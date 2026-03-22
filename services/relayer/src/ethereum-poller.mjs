import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";
import { networks } from "@btc-vision/bitcoin";
import { Address } from "@btc-vision/transaction";
import {
  publishMintAttestationsSnapshot,
  publishProcessedReleasesSnapshot,
  publishRelayerHeartbeat,
} from "./relayer-api-publish.mjs";
import { loadOpnetRelaySigners } from "./signers/index.mjs";
import { resolveSecretBackedValue } from "./secret-provider.mjs";

const DEPOSIT_INITIATED_TOPIC0 =
  "0x3fb1c794079291b42d6d8707ba973ad40ab31522db5ff4280e7606823b71be73";
const WITHDRAWAL_RELEASED_TOPIC0 =
  "0xf508cb4e522554ecdc6cdaed6e06898939fadca9fe07857fa51c68ddc2bead4a";
const VAULT_PAUSED_SELECTOR = "0x5c975abb";

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(SCRIPT_DIR, "../../..");
const DEFAULT_OUTPUT_FILE = path.resolve(REPO_ROOT, "services/relayer/.data/pending-attestations.json");
const DIRECTION_ETH_TO_OP_MINT = 1;
const DEFAULT_ATTESTATION_VERSION = 1;

function defaultMappingFile() {
  const ethereumNetwork = String(process.env.ETHEREUM_NETWORK ?? "").trim().toLowerCase();
  const opnetNetwork = String(process.env.OPNET_NETWORK ?? "").trim().toLowerCase();
  const manifestName =
    ethereumNetwork === "ethereum" || opnetNetwork === "mainnet"
      ? "ethereum-latest.json"
      : "sepolia-latest.json";
  return path.resolve(REPO_ROOT, "contracts/ethereum/deployments", manifestName);
}

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

function resolveOPNetNetwork(name) {
  const normalized = String(name ?? "regtest").trim().toLowerCase();
  if (normalized === "testnet") return networks.opnetTestnet;
  if (normalized === "regtest") return networks.regtest;
  if (normalized === "mainnet") return networks.bitcoin;
  throw new Error(`Unsupported opnet.network=${name}. Expected testnet, regtest, or mainnet.`);
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

async function buildPendingAttestation(log, mapping, relaySigners, requiredConfirmations) {
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
  const signatures = await Promise.all(
    relaySigners.map(async (signer) => {
      const signature = await Promise.resolve(signer.sign(payloadHashBytes));
      return {
        relayIndex: signer.relayIndex,
        relayerId: signer.relayerId,
        signerId: signer.signerId,
        signerPubKeyHex: bytesToHex(signer.publicKey),
        signatureHex: bytesToHex(signature),
      };
    }),
  );

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
      observedAt: new Date().toISOString(),
      requiredConfirmations,
    },
  };
}

function buildProcessedRelease(log) {
  if (!Array.isArray(log.topics) || log.topics.length < 2) {
    throw new Error(`Unexpected withdrawal log topics length: ${log.topics?.length ?? 0}`);
  }
  return {
    withdrawalId: hexToBigInt(log.topics[1]).toString(),
    sourceChain: "ethereum-sepolia",
    txHash: String(log.transactionHash ?? "").toLowerCase(),
    blockNumber: Number(hexToBigInt(log.blockNumber)),
  };
}

async function main() {
  if (process.argv.includes("--help") || process.argv.includes("-h")) {
    console.log(`Ethereum Deposit Poller

Required:
  ETHEREUM_RPC_URL (or SEPOLIA_RPC_URL fallback)

Optional:
  RELAYER_ID (default: relayer-0)
  RELAYER_SIGNER_MODE (default: kms)
  RELAYER_INDEX (required)
  RELAYER_KMS_KEY_ID or KMS_OPNET_KEY_ID (required)
  RELAYER_MAPPING_FILE (default: ${defaultMappingFile()})
  OPNET_BRIDGE_ADDRESS (required only if mapping file does not include opnet.bridgeAddress)
  OPNET_BRIDGE_HEX (32-byte hex bridge address used for signature hash; required when bridgeAddress is op...)
  ATTESTATION_VERSION (default: ${DEFAULT_ATTESTATION_VERSION})
  RELAYER_OUTPUT_FILE  (default: ${DEFAULT_OUTPUT_FILE})
  RELAYER_START_BLOCK  (default: latest-20)
  RELAYER_MAX_BLOCK_RANGE (default: 10)
  RELAYER_POLL_INTERVAL_MS (default: 30000)

Example:
  ETHEREUM_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/<KEY> \\
  npm run run:ethereum --workspace @opbridge/relayer
`);
    return;
  }

  const mappingFile = process.env.RELAYER_MAPPING_FILE || defaultMappingFile();
  const outputFile = process.env.RELAYER_OUTPUT_FILE || DEFAULT_OUTPUT_FILE;
  const relayerId = process.env.RELAYER_ID?.trim() || "relayer-0";
  const pollIntervalMs = Number(process.env.RELAYER_POLL_INTERVAL_MS || 30000);
  const startBlockEnv = process.env.RELAYER_START_BLOCK;
  const rpcUrl = await resolveSecretBackedValue({
    directValue: process.env.ETHEREUM_RPC_URL?.trim() || process.env.SEPOLIA_RPC_URL,
    secretRef: process.env.ETHEREUM_RPC_URL_SECRET_REF?.trim() || process.env.SEPOLIA_RPC_URL_SECRET_REF,
  });
  const opnetBridgeAddress = process.env.OPNET_BRIDGE_ADDRESS;
  const opnetBridgeHex = process.env.OPNET_BRIDGE_HEX;
  const maxBlockRange = Number(process.env.RELAYER_MAX_BLOCK_RANGE || 10);
  const minConfirmations = Number(process.env.RELAYER_MIN_CONFIRMATIONS?.trim() || "10");

  if (!rpcUrl) {
    throw new Error("ETHEREUM_RPC_URL is required.");
  }
  if (!Number.isInteger(minConfirmations) || minConfirmations < 0) {
    throw new Error("RELAYER_MIN_CONFIRMATIONS must be >= 0.");
  }

  const mappingRaw = fs.readFileSync(mappingFile, "utf8");
  const mapping = parseMapping(mappingRaw, { opnetBridgeAddress, opnetBridgeHex });
  const relaySigners = await loadOpnetRelaySigners({
    relayerId,
    opnetNetwork: resolveOPNetNetwork(mapping.opnet.network),
  });
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
  let nextProcessedReleaseFromBlock = nextFromBlock;
  const seen = new Set();

  console.log(
    `Relayer poller started. id=${relayerId} vault=${mapping.ethereum.vaultAddress} fromBlock=${nextFromBlock} intervalMs=${pollIntervalMs} maxBlockRange=${maxBlockRange} minConfirmations=${minConfirmations} signers=${relaySigners.length}`,
  );
  if (relaySigners.length === 0) {
    console.log("[poller] no relay signer keys configured; pending attestations will be unsigned.");
  }
  console.log(`Output file: ${outputFile}`);

  while (true) {
    try {
      const latest = hexToBigInt(await rpc(rpcUrl, "eth_blockNumber", []));
      const finalizedHead = latest >= BigInt(minConfirmations) ? latest - BigInt(minConfirmations) : -1n;
      if (finalizedHead >= nextFromBlock) {
        const pending = [];
        const processedReleases = [];
        let windowStart = nextFromBlock;
        while (windowStart <= finalizedHead) {
          const initialEnd = windowStart + BigInt(maxBlockRange) - 1n;
          let clampedEnd = initialEnd < finalizedHead ? initialEnd : finalizedHead;
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
                  topics: [[DEPOSIT_INITIATED_TOPIC0, WITHDRAWAL_RELEASED_TOPIC0]],
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
            const topic0 = String(log?.topics?.[0] ?? "").toLowerCase();
            if (topic0 === DEPOSIT_INITIATED_TOPIC0) {
              const id = `deposit:${log.transactionHash}:${Number(hexToBigInt(log.logIndex))}`;
              if (seen.has(id)) continue;
              seen.add(id);
              pending.push(await buildPendingAttestation(log, mapping, relaySigners, minConfirmations));
              continue;
            }
            if (topic0 === WITHDRAWAL_RELEASED_TOPIC0) {
              const release = buildProcessedRelease(log);
              const id = `release:${release.withdrawalId}`;
              if (seen.has(id)) continue;
              seen.add(id);
              processedReleases.push(release);
            }
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

        if (processedReleases.length > 0) {
          const snapshot = {
            generatedAt: new Date().toISOString(),
            relayerId,
            mappingSource: mappingFile,
            count: processedReleases.length,
            processed: processedReleases,
          };
          const disableFileOutput =
            process.env.RELAYER_DISABLE_FILE_OUTPUT?.trim() === "1" ||
            process.env.RELAYER_DISABLE_FILE_OUTPUT?.trim()?.toLowerCase() === "true";
          try {
            const published = await publishProcessedReleasesSnapshot(snapshot, disableFileOutput ? null : outputFile);
            if (published?.skipped) {
              console.log(`[poller] processed release publish skipped: ${published.reason}`);
            } else {
              console.log(`[poller] Published ${processedReleases.length} processed release(s) to relayer API.`);
            }
          } catch (error) {
            console.error(`[poller] processed release API publish failed: ${error instanceof Error ? error.message : String(error)}`);
            if (disableFileOutput) throw error;
          }
        }

        nextFromBlock = finalizedHead + 1n;
      }

      if (latest >= nextProcessedReleaseFromBlock) {
        const processedReleases = [];
        let windowStart = nextProcessedReleaseFromBlock;
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
                  topics: [[WITHDRAWAL_RELEASED_TOPIC0]],
                },
              ]);
            } catch (error) {
              const message = error instanceof Error ? error.message : String(error);
              const range = clampedEnd - windowStart + 1n;
              if (range <= 1n) {
                throw error;
              }
              const nextRange = range / 2n;
              const safeRange = nextRange > 0n ? nextRange : 1n;
              clampedEnd = windowStart + safeRange - 1n;
              console.warn(
                `[poller] reducing processed-release log range after error: ${message}. nextRange=${safeRange.toString()} blocks`,
              );
            }
          }

          for (const log of logs) {
            const release = buildProcessedRelease(log);
            const id = `release:${release.withdrawalId}`;
            if (seen.has(id)) continue;
            seen.add(id);
            processedReleases.push(release);
          }

          windowStart = clampedEnd + 1n;
        }

        if (processedReleases.length > 0) {
          const snapshot = {
            generatedAt: new Date().toISOString(),
            relayerId,
            mappingSource: mappingFile,
            count: processedReleases.length,
            processed: processedReleases,
          };
          const disableFileOutput =
            process.env.RELAYER_DISABLE_FILE_OUTPUT?.trim() === "1" ||
            process.env.RELAYER_DISABLE_FILE_OUTPUT?.trim()?.toLowerCase() === "true";
          try {
            const published = await publishProcessedReleasesSnapshot(snapshot, disableFileOutput ? null : outputFile);
            if (published?.skipped) {
              console.log(`[poller] processed release publish skipped: ${published.reason}`);
            } else {
              console.log(`[poller] Published ${processedReleases.length} observed release(s) to relayer API.`);
            }
          } catch (error) {
            console.error(`[poller] processed release API publish failed: ${error instanceof Error ? error.message : String(error)}`);
            if (disableFileOutput) throw error;
          }
        }

        nextProcessedReleaseFromBlock = latest + 1n;
      }
    } catch (error) {
      console.error(`[poller-error] ${error instanceof Error ? error.message : String(error)}`);
    }

    try {
      const heartbeatHead = hexToBigInt(await rpc(rpcUrl, "eth_blockNumber", []));
      const heartbeatPausedRaw = await rpc(rpcUrl, "eth_call", [
        { to: mapping.ethereum.vaultAddress, data: VAULT_PAUSED_SELECTOR },
        "latest",
      ]);
      const heartbeatFinalizedHead =
        heartbeatHead >= BigInt(minConfirmations) ? heartbeatHead - BigInt(minConfirmations) : -1n;
      await publishRelayerHeartbeat({
        relayerName: relayerId,
        role: "ethereum-poller",
        status: "ok",
        detail: JSON.stringify({
          sourceChain: "sepolia",
          vaultPaused: hexToBigInt(heartbeatPausedRaw) !== 0n,
          currentHead: Number(heartbeatHead),
          finalizedHead: heartbeatFinalizedHead >= 0n ? Number(heartbeatFinalizedHead) : null,
          minConfirmations,
          nextFromBlock: nextFromBlock.toString(),
        }),
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
