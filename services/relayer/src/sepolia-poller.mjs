import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";
import { networks } from "@btc-vision/bitcoin";
import { Address, MLDSASecurityLevel, QuantumBIP32Factory } from "@btc-vision/transaction";
import { publishMintAttestationsSnapshot, publishRelayerHeartbeat } from "./relayer-api-publish.mjs";

const DEPOSIT_INITIATED_TOPIC0 =
  "0x3fb1c794079291b42d6d8707ba973ad40ab31522db5ff4280e7606823b71be73";

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(SCRIPT_DIR, "../../..");
const DEFAULT_MAPPING_FILE = path.resolve(REPO_ROOT, "contracts/ethereum/deployments/sepolia-latest.json");
const DEFAULT_OUTPUT_FILE = path.resolve(REPO_ROOT, "services/relayer/.data/pending-attestations.json");
const DEFAULT_KEYS_FILE = path.resolve(REPO_ROOT, "services/relayer/.data/relay-keys.json");
const ZERO_CHAIN_CODE = new Uint8Array(32);
const DIRECTION_ETH_TO_OP_MINT = 1;
const DEFAULT_ATTESTATION_VERSION = 1;

function hexToBigInt(hex) {
  return BigInt(hex);
}

function hexToBytes(raw) {
  const value = raw.trim().toLowerCase();
  if (!value) {
    throw new Error("Hex string is required.");
  }
  const normalized = value.startsWith("0x") ? value.slice(2) : value;
  if (!/^[0-9a-f]+$/.test(normalized) || normalized.length % 2 !== 0) {
    throw new Error("Invalid hex string.");
  }
  const result = new Uint8Array(normalized.length / 2);
  for (let i = 0; i < result.length; i++) {
    result[i] = Number.parseInt(normalized.slice(i * 2, i * 2 + 2), 16);
  }
  return result;
}

function bytesToHex(bytes) {
  return `0x${Array.from(bytes)
    .map((value) => value.toString(16).padStart(2, "0"))
    .join("")}`;
}

function concatBytes(parts) {
  const totalLength = parts.reduce((acc, part) => acc + part.length, 0);
  const output = new Uint8Array(totalLength);
  let offset = 0;
  for (const part of parts) {
    output.set(part, offset);
    offset += part.length;
  }
  return output;
}

function u256ToBytes(value) {
  if (typeof value !== "bigint") {
    throw new Error("u256 value must be bigint.");
  }
  if (value < 0n) {
    throw new Error("u256 value must be non-negative.");
  }
  const max = (1n << 256n) - 1n;
  if (value > max) {
    throw new Error("u256 value exceeds 256 bits.");
  }
  const output = new Uint8Array(32);
  let cursor = value;
  for (let i = 31; i >= 0; i--) {
    output[i] = Number(cursor & 0xffn);
    cursor >>= 8n;
  }
  return output;
}

async function sha256Bytes(data) {
  const digest = await crypto.subtle.digest("SHA-256", data);
  return new Uint8Array(digest);
}

function leftPadTo32(bytes) {
  if (bytes.length > 32) {
    throw new Error(`Cannot pad ${bytes.length} bytes into bytes32.`);
  }
  if (bytes.length === 32) return bytes;
  const padded = new Uint8Array(32);
  padded.set(bytes, 32 - bytes.length);
  return padded;
}

function resolveWord32(raw, fieldName) {
  const value = String(raw ?? "").trim();
  if (!value) {
    throw new Error(`${fieldName} is required.`);
  }
  try {
    if (value.startsWith("0x")) {
      const bytes = hexToBytes(value);
      if (bytes.length === 20 || bytes.length === 32) {
        return leftPadTo32(bytes);
      }
      throw new Error(`${fieldName} must be 20 or 32 bytes (got ${bytes.length}).`);
    }
    return leftPadTo32(hexToBytes(Address.fromString(value).toHex()));
  } catch (error) {
    throw new Error(`${fieldName} is invalid: ${(error instanceof Error ? error.message : String(error))}`);
  }
}

async function buildMintAttestationHash(message) {
  const ethereumVaultBytes = resolveWord32(message.ethereumVault, "ethereumVault");
  const opnetBridgeBytes = resolveWord32(message.opnetBridgeHex ?? message.opnetBridge, "opnetBridge");
  const ethereumUserBytes = resolveWord32(message.ethereumUser, "ethereumUser");
  const opnetUserBytes = resolveWord32(message.opnetUser, "opnetUser");
  const payload = concatBytes([
    new Uint8Array([Number(message.version)]),
    ethereumVaultBytes,
    opnetBridgeBytes,
    ethereumUserBytes,
    opnetUserBytes,
    new Uint8Array([Number(message.assetId)]),
    u256ToBytes(BigInt(message.amount)),
    new Uint8Array([Number(message.direction)]),
    u256ToBytes(BigInt(message.nonce)),
  ]);
  return sha256Bytes(payload);
}

function normalizeHexAddress(wordHex) {
  const raw = wordHex.toLowerCase().replace(/^0x/, "");
  return `0x${raw.slice(raw.length - 40)}`;
}

function parseDataWords(dataHex) {
  const hex = dataHex.replace(/^0x/, "");
  if (hex.length % 64 !== 0) {
    throw new Error(`Invalid data hex length: ${hex.length}`);
  }
  const words = [];
  for (let i = 0; i < hex.length; i += 64) {
    words.push(`0x${hex.slice(i, i + 64)}`);
  }
  return words;
}

function parseMldsaPrivateKey(raw) {
  const value = raw.trim();
  if (!value) {
    throw new Error("Relay private key is required.");
  }

  const keyBytes = hexToBytes(value);
  const mldsa44PrivateSize = 2560;
  const mldsa44PrivatePlusPublicSize = 3872;
  if (keyBytes.length === mldsa44PrivateSize) {
    return keyBytes;
  }
  if (keyBytes.length === mldsa44PrivatePlusPublicSize) {
    return keyBytes.slice(0, mldsa44PrivateSize);
  }
  throw new Error(
    `Relay private key has invalid size (${keyBytes.length} bytes). Expected ${mldsa44PrivateSize} (private) or ${mldsa44PrivatePlusPublicSize} (private+public).`,
  );
}

function resolveOPNetNetwork(name) {
  const normalized = String(name ?? "regtest").trim().toLowerCase();
  if (normalized === "testnet") return networks.opnetTestnet;
  if (normalized === "regtest") return networks.regtest;
  if (normalized === "mainnet") return networks.bitcoin;
  throw new Error(`Unsupported opnet.network=${name}. Expected testnet, regtest, or mainnet.`);
}

function buildRelaySigner(rawKey, relayIndex, relayerId, opnetNetwork) {
  const privateKey = parseMldsaPrivateKey(rawKey);
  const signer = QuantumBIP32Factory.fromPrivateKey(
    privateKey,
    ZERO_CHAIN_CODE,
    opnetNetwork,
    MLDSASecurityLevel.LEVEL2,
  );
  const publicKey = new Uint8Array(signer.publicKey);
  const signerId = new Address(publicKey).toHex();
  return {
    relayIndex,
    relayerId,
    signerId,
    publicKey,
    sign: (messageHashBytes) => signer.sign(messageHashBytes),
  };
}

function loadRelayKeyPayload() {
  if (process.env.RELAYER_KEYS_JSON?.trim()) {
    return JSON.parse(process.env.RELAYER_KEYS_JSON);
  }

  const keysFile = process.env.RELAYER_KEYS_FILE?.trim() || DEFAULT_KEYS_FILE;
  if (fs.existsSync(keysFile)) {
    return JSON.parse(fs.readFileSync(keysFile, "utf8"));
  }

  const keysCsv = process.env.RELAYER_PRIVATE_KEYS?.trim();
  if (keysCsv) {
    return { relayPrivateKeys: keysCsv.split(",").map((entry) => entry.trim()).filter(Boolean) };
  }

  return null;
}

function loadRelaySigners(relayerId, opnetNetwork) {
  const relayIndexFromEnvRaw = process.env.RELAYER_INDEX?.trim();
  const relayIndexFromEnv =
    relayIndexFromEnvRaw && /^\d+$/.test(relayIndexFromEnvRaw) ? Number(relayIndexFromEnvRaw) : null;
  const singlePrivateKey = process.env.RELAYER_PRIVATE_KEY?.trim();
  if (singlePrivateKey) {
    if (relayIndexFromEnv == null) {
      throw new Error("RELAYER_INDEX is required in single-relayer mode (RELAYER_PRIVATE_KEY).");
    }
    const relayIndex = relayIndexFromEnv;
    if (!Number.isInteger(relayIndex) || relayIndex < 0 || relayIndex > 255) {
      throw new Error("RELAYER_INDEX must be an integer in [0,255].");
    }
    return [buildRelaySigner(singlePrivateKey, relayIndex, relayerId, opnetNetwork)];
  }

  const payload = loadRelayKeyPayload();
  if (!payload) {
    return [];
  }

  const keys = Array.isArray(payload.relayPrivateKeys) ? payload.relayPrivateKeys : [];
  const payloadStartIndex =
    payload?.startIndex != null && Number.isInteger(Number(payload.startIndex))
      ? Number(payload.startIndex)
      : null;
  const indexOffset =
    payloadStartIndex != null ? payloadStartIndex : keys.length === 1 && relayIndexFromEnv != null ? relayIndexFromEnv : 0;
  return keys
    .map((raw, position) => buildRelaySigner(raw, indexOffset + position, relayerId, opnetNetwork))
    .filter(Boolean);
}

async function rpc(rpcUrl, method, params) {
  const response = await fetch(rpcUrl, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: Date.now(),
      method,
      params,
    }),
  });
  const rawBody = await response.text();
  let body = null;
  try {
    body = rawBody ? JSON.parse(rawBody) : null;
  } catch {
    body = null;
  }
  if (!response.ok) {
    const detail =
      body?.error?.message ||
      body?.message ||
      (rawBody ? rawBody.slice(0, 500) : "no response body");
    throw new Error(`RPC ${method} failed with HTTP ${response.status}: ${detail}`);
  }
  if (body.error) {
    throw new Error(`RPC ${method} error: ${body.error.message || JSON.stringify(body.error)}`);
  }
  return body.result;
}

function parseMapping(raw, options = {}) {
  const payload = JSON.parse(raw);
  const root = payload.mapping ?? payload;
  const opnetBridgeFromEnv = (options.opnetBridgeAddress ?? "").trim();
  const opnetBridgeHexFromEnv = (options.opnetBridgeHex ?? "").trim();
  const isMappingShape = !!root.ethereum;
  const mapping = isMappingShape
    ? root
    : {
        ethereum: {
          network: root.network ?? "sepolia",
          chainId: root.chainId,
          rpcUrl: root.rpcUrl,
          vaultAddress: root.vaultAddress,
          assets: root.assets,
        },
        opnet: root.opnet ?? {},
      };
  const ethereum = mapping.ethereum;
  const opnet = mapping.opnet ?? {};

  if (!ethereum) {
    throw new Error("Mapping JSON must contain Ethereum fields (ethereum.* or top-level deployment fields).");
  }
  if (!ethereum.vaultAddress) {
    throw new Error("Mapping ethereum.vaultAddress is required.");
  }
  if (!opnet.bridgeAddress && opnetBridgeFromEnv) {
    opnet.bridgeAddress = opnetBridgeFromEnv;
  }
  if (!opnet.bridgeHex && opnetBridgeHexFromEnv) {
    opnet.bridgeHex = opnetBridgeHexFromEnv;
  }
  if (!opnet.bridgeAddress) {
    throw new Error("Mapping opnet.bridgeAddress is required. Set it in mapping JSON or OPNET_BRIDGE_ADDRESS.");
  }
  if (!opnet.bridgeHex) {
    opnet.bridgeHex = opnet.bridgeAddress;
  }
  if (!opnet.network) {
    opnet.network = "regtest";
  }
  if (!Array.isArray(ethereum.assets) || ethereum.assets.length === 0) {
    throw new Error("Mapping ethereum.assets must be a non-empty array.");
  }

  return mapping;
}

async function buildPendingAttestation(log, mapping, relaySigners) {
  if (!Array.isArray(log.topics) || log.topics.length < 4) {
    throw new Error(`Unexpected log topics length: ${log.topics?.length ?? 0}`);
  }
  const words = parseDataWords(log.data);
  if (words.length < 4) {
    throw new Error(`Unexpected log data words: ${words.length}`);
  }

  const depositId = hexToBigInt(log.topics[1]);
  const assetId = Number(hexToBigInt(log.topics[2]));
  const depositor = normalizeHexAddress(log.topics[3]);
  const token = normalizeHexAddress(words[0]);
  const amount = hexToBigInt(words[1]);
  const recipientBytes32 = words[2].toLowerCase();
  const depositorBytes32 = bytesToHex(resolveWord32(depositor, "depositor")).toLowerCase();

  const asset = mapping.ethereum.assets.find((entry) => entry.assetId === assetId);
  if (!asset) {
    throw new Error(`Unknown assetId from log: ${assetId}`);
  }

  const attestationVersion = Number(
    process.env.ATTESTATION_VERSION?.trim() || `${DEFAULT_ATTESTATION_VERSION}`,
  );
  if (!Number.isInteger(attestationVersion) || attestationVersion < 0 || attestationVersion > 255) {
    throw new Error("ATTESTATION_VERSION must be an integer in [0,255].");
  }

  const message = {
    version: attestationVersion,
    direction: DIRECTION_ETH_TO_OP_MINT,
    ethereumVault: mapping.ethereum.vaultAddress,
    opnetBridge: mapping.opnet.bridgeAddress,
    opnetBridgeHex: mapping.opnet.bridgeHex,
    assetId,
    ethereumUser: depositorBytes32,
    opnetUser: recipientBytes32,
    amount: amount.toString(),
    nonce: depositId.toString(),
  };
  const payloadHashBytes = await buildMintAttestationHash(message);
  const payloadHashHex = bytesToHex(payloadHashBytes);
  const signatures = relaySigners.map((signer) => {
    const signature = signer.sign(payloadHashBytes);
    return {
      relayIndex: signer.relayIndex,
      relayerId: signer.relayerId,
      signerId: signer.signerId,
      signerPubKeyHex: bytesToHex(signer.publicKey),
      signatureHex: bytesToHex(signature),
    };
  });

  return {
    observationId: `${log.transactionHash}:${Number(hexToBigInt(log.logIndex))}`,
    message,
    canonicalPayload: [
      `v=${message.version}`,
      `ethVault=${String(message.ethereumVault).toLowerCase()}`,
      `bridge=${String(message.opnetBridge).toLowerCase()}`,
      `ethUser=${String(message.ethereumUser).toLowerCase()}`,
      `opUser=${String(message.opnetUser).toLowerCase()}`,
      `asset=${message.assetId}`,
      `amount=${message.amount}`,
      `d=${message.direction}`,
      `nonce=${message.nonce}`,
    ].join("|"),
    payloadHashHex,
    signerIds: signatures.map((entry) => entry.signerId),
    signatures,
    source: {
      network: "sepolia",
      vaultAddress: mapping.ethereum.vaultAddress,
      tokenAddress: token,
      expectedTokenAddress: asset.tokenAddress,
      depositor,
      blockNumber: Number(hexToBigInt(log.blockNumber)),
      txHash: log.transactionHash,
      logIndex: Number(hexToBigInt(log.logIndex)),
    },
  };
}

async function main() {
  if (process.argv.includes("--help") || process.argv.includes("-h")) {
    console.log(`Sepolia Deposit Poller

Required:
  SEPOLIA_RPC_URL

Optional:
  RELAYER_ID (default: relayer-0)
  RELAYER_PRIVATE_KEY + RELAYER_INDEX (single-relayer mode; recommended for multi-instance setup)
  RELAYER_MAPPING_FILE (default: ${DEFAULT_MAPPING_FILE})
  OPNET_BRIDGE_ADDRESS (required only if mapping file does not include opnet.bridgeAddress)
  OPNET_BRIDGE_HEX (32-byte hex bridge address used for signature hash; required when bridgeAddress is op...)
  RELAYER_KEYS_FILE (default: ${DEFAULT_KEYS_FILE})
  RELAYER_KEYS_JSON (inline JSON payload containing relayPrivateKeys)
  RELAYER_PRIVATE_KEYS (comma-separated fallback if no key JSON is supplied)
  ATTESTATION_VERSION (default: ${DEFAULT_ATTESTATION_VERSION})
  RELAYER_OUTPUT_FILE  (default: ${DEFAULT_OUTPUT_FILE})
  RELAYER_START_BLOCK  (default: latest-20)
  RELAYER_MAX_BLOCK_RANGE (default: 10)
  RELAYER_POLL_INTERVAL_MS (default: 30000)

Example:
  SEPOLIA_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/<KEY> \\
  npm run run:sepolia --workspace @heptad/relayer
`);
    return;
  }

  const mappingFile = process.env.RELAYER_MAPPING_FILE || DEFAULT_MAPPING_FILE;
  const outputFile = process.env.RELAYER_OUTPUT_FILE || DEFAULT_OUTPUT_FILE;
  const relayerId = process.env.RELAYER_ID?.trim() || "relayer-0";
  const pollIntervalMs = Number(process.env.RELAYER_POLL_INTERVAL_MS || 30000);
  const startBlockEnv = process.env.RELAYER_START_BLOCK;
  const rpcUrl = process.env.SEPOLIA_RPC_URL;
  const opnetBridgeAddress = process.env.OPNET_BRIDGE_ADDRESS;
  const opnetBridgeHex = process.env.OPNET_BRIDGE_HEX;
  const maxBlockRange = Number(process.env.RELAYER_MAX_BLOCK_RANGE || 10);

  if (!rpcUrl) {
    throw new Error("SEPOLIA_RPC_URL is required.");
  }

  const mappingRaw = fs.readFileSync(mappingFile, "utf8");
  const mapping = parseMapping(mappingRaw, { opnetBridgeAddress, opnetBridgeHex });
  const relaySigners = loadRelaySigners(relayerId, resolveOPNetNetwork(mapping.opnet.network));
  if (Number(mapping.ethereum.chainId) !== 11155111) {
    throw new Error(`Expected ethereum.chainId=11155111 for Sepolia, got ${mapping.ethereum.chainId}`);
  }

  fs.mkdirSync(path.dirname(outputFile), { recursive: true });

  const latestBlockHex = await rpc(rpcUrl, "eth_blockNumber", []);
  let nextFromBlock = startBlockEnv
    ? BigInt(startBlockEnv)
    : hexToBigInt(latestBlockHex) > 20n
      ? hexToBigInt(latestBlockHex) - 20n
      : 0n;
  const seen = new Set();

  console.log(
    `Relayer poller started. id=${relayerId} vault=${mapping.ethereum.vaultAddress} fromBlock=${nextFromBlock} intervalMs=${pollIntervalMs} maxBlockRange=${maxBlockRange} signers=${relaySigners.length}`,
  );
  if (relaySigners.length === 0) {
    console.log("[poller] no relay signer keys configured; pending attestations will be unsigned.");
  }
  console.log(`Output file: ${outputFile}`);

  while (true) {
    try {
      const latest = hexToBigInt(await rpc(rpcUrl, "eth_blockNumber", []));
      if (latest >= nextFromBlock) {
        const pending = [];
        let windowStart = nextFromBlock;
        while (windowStart <= latest) {
          const initialEnd = windowStart + BigInt(maxBlockRange) - 1n;
          let clampedEnd = initialEnd < latest ? initialEnd : latest;
          let logs = null;
          while (logs === null) {
            const fromHex = `0x${windowStart.toString(16)}`;
            const toHex = `0x${clampedEnd.toString(16)}`;
            try {
              logs = await rpc(rpcUrl, "eth_getLogs", [
                {
                  address: mapping.ethereum.vaultAddress,
                  fromBlock: fromHex,
                  toBlock: toHex,
                  topics: [DEPOSIT_INITIATED_TOPIC0],
                },
              ]);
            } catch (error) {
              const message = error instanceof Error ? error.message : String(error);
              const range = clampedEnd - windowStart + 1n;
              if (range <= 1n) {
                throw error;
              }
              // Providers may reject large eth_getLogs windows on lower-tier plans.
              const nextRange = range / 2n;
              const safeRange = nextRange > 0n ? nextRange : 1n;
              clampedEnd = windowStart + safeRange - 1n;
              console.warn(
                `[poller] reducing log range after error: ${message}. nextRange=${safeRange.toString()} blocks`,
              );
            }
          }

          for (const log of logs) {
            const id = `${log.transactionHash}:${Number(hexToBigInt(log.logIndex))}`;
            if (seen.has(id)) continue;
            seen.add(id);
            pending.push(await buildPendingAttestation(log, mapping, relaySigners));
          }

          windowStart = clampedEnd + 1n;
        }

        if (pending.length > 0) {
          const snapshot = {
            generatedAt: new Date().toISOString(),
            relayerId,
            mappingSource: mappingFile,
            count: pending.length,
            pending,
          };
          const disableFileOutput =
            process.env.RELAYER_DISABLE_FILE_OUTPUT?.trim() === "1" ||
            process.env.RELAYER_DISABLE_FILE_OUTPUT?.trim()?.toLowerCase() === "true";
          if (!disableFileOutput) {
            fs.writeFileSync(outputFile, JSON.stringify(snapshot, null, 2));
          }
          try {
            const published = await publishMintAttestationsSnapshot(snapshot, disableFileOutput ? null : outputFile);
            if (published?.skipped) {
              console.log(`[poller] API publish skipped: ${published.reason}`);
            } else {
              console.log(`[poller] Published ${pending.length} mint attestations to relayer API.`);
            }
          } catch (error) {
            console.error(`[poller] mint attestation API publish failed: ${error instanceof Error ? error.message : String(error)}`);
            if (disableFileOutput) throw error;
          }
          for (const entry of pending) {
            console.log(
              `[deposit] assetId=${entry.message.assetId} nonce=${entry.message.nonce} payloadHash=${entry.payloadHashHex}`,
            );
          }
        }

        nextFromBlock = latest + 1n;
      }
    } catch (error) {
      console.error(`[poller-error] ${error instanceof Error ? error.message : String(error)}`);
    }

    try {
      await publishRelayerHeartbeat({
        relayerName: relayerId,
        role: "sepolia-poller",
        status: "ok",
        detail: `nextFromBlock=${nextFromBlock.toString()}`,
      });
    } catch (error) {
      console.error(`[poller-heartbeat] ${error instanceof Error ? error.message : String(error)}`);
    }

    await new Promise((resolve) => setTimeout(resolve, pollIntervalMs));
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
