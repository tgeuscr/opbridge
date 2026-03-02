import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { createHash } from "node:crypto";
import { fileURLToPath } from "node:url";
import { networks } from "@btc-vision/bitcoin";
import { Address } from "@btc-vision/transaction";
import { ABIDataTypes, BitcoinAbiTypes, getContract } from "opnet";
import { ethers } from "ethers";
import { createOpnetJsonRpcProvider, describeOpnetRpcTransport } from "./opnet-rpc-provider.mjs";
import { publishReleaseAttestationsSnapshot, publishRelayerHeartbeat } from "./relayer-api-publish.mjs";

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(SCRIPT_DIR, "../../..");
const DEFAULT_MAPPING_FILE = path.resolve(REPO_ROOT, "contracts/ethereum/deployments/sepolia-latest.json");
const DEFAULT_OUTPUT_FILE = path.resolve(REPO_ROOT, "services/relayer/.data/release-attestations/relayer-opnet.json");
const DEFAULT_KEYS_FILE = path.resolve(REPO_ROOT, "services/relayer/.data/relay-keys.json");
const DIRECTION_OP_TO_ETH_RELEASE = 2;
const DEFAULT_ATTESTATION_VERSION = 1;
const DEFAULT_OPNET_RPC_URL = "https://regtest.opnet.org";
const TESTNET_OPNET_RPC_URL = "https://testnet.opnet.org";

const BRIDGE_EVENTS_ABI = [
  {
    name: "BurnRequested",
    values: [
      { name: "assetId", type: ABIDataTypes.UINT8 },
      { name: "from", type: ABIDataTypes.ADDRESS },
      { name: "ethereumRecipient", type: ABIDataTypes.ADDRESS },
      { name: "amount", type: ABIDataTypes.UINT256 },
      { name: "withdrawalId", type: ABIDataTypes.UINT256 },
    ],
    type: BitcoinAbiTypes.Event,
  },
];

function requireEnv(name) {
  const value = process.env[name];
  if (!value || !value.trim()) {
    throw new Error(`Missing required env var: ${name}`);
  }
  return value.trim();
}

function bytesToHex(bytes) {
  return `0x${Array.from(bytes)
    .map((value) => value.toString(16).padStart(2, "0"))
    .join("")}`;
}

function hexToBytes(raw) {
  const value = String(raw ?? "").trim();
  const normalized = value.startsWith("0x") ? value.slice(2) : value;
  if (!/^[0-9a-fA-F]+$/.test(normalized) || normalized.length % 2 !== 0) {
    throw new Error(`Invalid hex string: ${raw}`);
  }
  const out = new Uint8Array(normalized.length / 2);
  for (let i = 0; i < out.length; i++) {
    out[i] = Number.parseInt(normalized.slice(i * 2, i * 2 + 2), 16);
  }
  return out;
}

function concatBytes(parts) {
  const totalLength = parts.reduce((acc, part) => acc + part.length, 0);
  const out = new Uint8Array(totalLength);
  let offset = 0;
  for (const part of parts) {
    out.set(part, offset);
    offset += part.length;
  }
  return out;
}

function leftPadTo32(bytes, fieldName) {
  if (bytes.length > 32) {
    throw new Error(`${fieldName} exceeds 32 bytes.`);
  }
  if (bytes.length === 32) return bytes;
  const out = new Uint8Array(32);
  out.set(bytes, 32 - bytes.length);
  return out;
}

function u256ToBytes(value) {
  const bigint = BigInt(value);
  if (bigint < 0n) throw new Error("u256 must be non-negative.");
  const out = new Uint8Array(32);
  let cursor = bigint;
  for (let i = 31; i >= 0; i--) {
    out[i] = Number(cursor & 0xffn);
    cursor >>= 8n;
  }
  return out;
}

function parseMapping(raw) {
  const parsed = JSON.parse(raw);
  const root = parsed.mapping ?? parsed;
  const mapping = root.ethereum
    ? root
    : {
        ethereum: {
          network: root.network ?? "sepolia",
          chainId: root.chainId,
          vaultAddress: root.vaultAddress,
          assets: root.assets ?? [],
        },
        opnet: root.opnet ?? {},
      };
  if (!mapping.ethereum?.vaultAddress) {
    throw new Error("Mapping ethereum.vaultAddress is required.");
  }
  if (!mapping.opnet?.bridgeAddress) {
    throw new Error("Mapping opnet.bridgeAddress is required.");
  }
  if (!mapping.opnet.bridgeHex) {
    mapping.opnet.bridgeHex = mapping.opnet.bridgeAddress;
  }
  if (!mapping.opnet.network) {
    mapping.opnet.network = "regtest";
  }
  if (!Array.isArray(mapping.ethereum.assets) || mapping.ethereum.assets.length === 0) {
    throw new Error("Mapping ethereum.assets must be a non-empty array.");
  }
  return mapping;
}

function normalizeOPNetNetworkName(name) {
  return String(name ?? "regtest").trim().toLowerCase();
}

function resolveOPNetNetwork(name) {
  const normalized = normalizeOPNetNetworkName(name);
  if (normalized === "regtest") return networks.regtest;
  if (normalized === "testnet") return networks.opnetTestnet;
  if (normalized === "mainnet") return networks.bitcoin;
  throw new Error(`Unsupported OPNET_NETWORK=${name}. Expected regtest, testnet, or mainnet.`);
}

function defaultOpnetRpcUrlForNetwork(name) {
  return normalizeOPNetNetworkName(name) === "testnet" ? TESTNET_OPNET_RPC_URL : DEFAULT_OPNET_RPC_URL;
}

function normalizeOpnetAddressHex32(value) {
  if (value && typeof value.toHex === "function") {
    return String(value.toHex()).toLowerCase();
  }
  const raw = String(value ?? "").trim();
  if (!raw) throw new Error("OP_NET address is required.");
  if (raw.startsWith("0x")) {
    const bytes = hexToBytes(raw);
    return bytesToHex(leftPadTo32(bytes, "opnetUser")).toLowerCase();
  }
  return bytesToHex(leftPadTo32(hexToBytes(Address.fromString(raw).toHex()), "opnetUser")).toLowerCase();
}

function isLikelyHex(value) {
  const raw = String(value ?? "").trim();
  const normalized = raw.startsWith("0x") ? raw.slice(2) : raw;
  return normalized.length > 0 && /^[0-9a-fA-F]+$/.test(normalized) && normalized.length % 2 === 0;
}

function pickPublicKeyHexFromRpcInfo(rawInfo) {
  if (!rawInfo || typeof rawInfo !== "object") return null;
  for (const candidate of [rawInfo.originalPubKey, rawInfo.tweakedPubkey, rawInfo.mldsaHashedPublicKey]) {
    if (typeof candidate === "string" && isLikelyHex(candidate)) {
      return candidate;
    }
  }
  return null;
}

async function resolveOpnetAddressViaRpcToHex32(raw, provider) {
  if (typeof provider.getPublicKeysInfoRaw === "function") {
    const rpcInfoMap = await provider.getPublicKeysInfoRaw([raw]);
    const candidates = [];
    if (rpcInfoMap && typeof rpcInfoMap === "object") {
      if (Object.hasOwn(rpcInfoMap, raw)) candidates.push(rpcInfoMap[raw]);
      for (const value of Object.values(rpcInfoMap)) candidates.push(value);
    }

    for (const info of candidates) {
      if (!info || typeof info !== "object" || Object.hasOwn(info, "error")) continue;
      const pubKeyHex = pickPublicKeyHexFromRpcInfo(info);
      if (pubKeyHex) return normalizeOpnetAddressHex32(pubKeyHex);
    }
  }

  // Fallback for SDKs without getPublicKeysInfoRaw exposed on the provider instance.
  const resolved = await provider.getPublicKeyInfo(raw, false);
  return normalizeOpnetAddressHex32(resolved);
}

async function normalizeOpnetAddressHex32Resolved(value, provider) {
  try {
    return normalizeOpnetAddressHex32(value);
  } catch (originalError) {
    const raw = typeof value === "string" ? value.trim() : "";
    if (!raw) {
      throw originalError;
    }
    if (raw.startsWith("0x")) {
      throw originalError;
    }
    return resolveOpnetAddressViaRpcToHex32(raw, provider);
  }
}

function normalizeEthereumRecipientHex20(value) {
  let raw = "";
  if (value && typeof value.toHex === "function") {
    raw = String(value.toHex());
  } else {
    raw = String(value ?? "");
  }
  const bytes = hexToBytes(raw);
  if (bytes.length !== 20 && bytes.length !== 32) {
    throw new Error(`Ethereum recipient must be 20 or 32 bytes, got ${bytes.length}.`);
  }
  const tail20 = bytes.slice(bytes.length - 20);
  return bytesToHex(tail20).toLowerCase();
}

function encodeReleaseAttestationHash(message) {
  const normalizedBridgeHex32 = normalizeOpnetAddressHex32(message.opnetBridgeHex ?? message.opnetBridge);
  const payload = concatBytes([
    new Uint8Array([Number(message.version)]),
    leftPadTo32(hexToBytes(message.ethereumVault), "ethereumVault"),
    leftPadTo32(hexToBytes(normalizedBridgeHex32), "opnetBridge"),
    leftPadTo32(hexToBytes(message.ethereumUser), "ethereumUser"),
    leftPadTo32(hexToBytes(message.opnetUser), "opnetUser"),
    new Uint8Array([Number(message.assetId)]),
    u256ToBytes(message.amount),
    new Uint8Array([DIRECTION_OP_TO_ETH_RELEASE]),
    u256ToBytes(message.nonce),
  ]);
  const digest = createHash("sha256").update(payload).digest();
  return new Uint8Array(digest);
}

function loadRelayKeyPayload() {
  if (process.env.RELAYER_EVM_KEYS_JSON?.trim()) {
    return JSON.parse(process.env.RELAYER_EVM_KEYS_JSON);
  }
  const keysFile = process.env.RELAYER_EVM_KEYS_FILE?.trim() || DEFAULT_KEYS_FILE;
  if (fs.existsSync(keysFile)) {
    return JSON.parse(fs.readFileSync(keysFile, "utf8"));
  }
  const csv = process.env.RELAYER_EVM_PRIVATE_KEYS?.trim();
  if (csv) {
    return { relayEvmPrivateKeys: csv.split(",").map((v) => v.trim()).filter(Boolean) };
  }
  return null;
}

function loadRelaySigners(relayerId) {
  const singlePrivateKey = process.env.RELAYER_EVM_PRIVATE_KEY?.trim();
  if (singlePrivateKey) {
    const relayIndexRaw = process.env.RELAYER_INDEX?.trim();
    if (!relayIndexRaw || !/^\d+$/.test(relayIndexRaw)) {
      throw new Error("RELAYER_INDEX is required in single-relayer mode.");
    }
    const relayIndex = Number(relayIndexRaw);
    const wallet = new ethers.Wallet(singlePrivateKey);
    return [
      {
        relayIndex,
        relayerId,
        signerId: wallet.address,
        signerPubKeyHex: wallet.signingKey.publicKey,
        signDigestHex: (digestHex) => wallet.signingKey.sign(digestHex).serialized,
      },
    ];
  }

  const payload = loadRelayKeyPayload();
  if (!payload) return [];
  const keys =
    (Array.isArray(payload.relayEvmPrivateKeys) ? payload.relayEvmPrivateKeys : null) ??
    (Array.isArray(payload.relayPrivateKeys) ? payload.relayPrivateKeys : []);

  return keys.map((key, relayIndex) => {
    const wallet = new ethers.Wallet(String(key).trim());
    return {
      relayIndex,
      relayerId,
      signerId: wallet.address,
      signerPubKeyHex: wallet.signingKey.publicKey,
      signDigestHex: (digestHex) => wallet.signingKey.sign(digestHex).serialized,
    };
  });
}

function canonicalPayload(message) {
  return [
    `v=${message.version}`,
    `vault=${String(message.ethereumVault).toLowerCase()}`,
    `bridge=${String(message.opnetBridge).toLowerCase()}`,
    `ethUser=${String(message.ethereumUser).toLowerCase()}`,
    `opUser=${String(message.opnetUser).toLowerCase()}`,
    `asset=${message.assetId}`,
    `amount=${message.amount}`,
    `d=${message.direction}`,
    `nonce=${message.nonce}`,
  ].join("|");
}

function normalizeEventBuckets(contractEvents, bridgeAddress, bridgeHex) {
  if (!contractEvents || typeof contractEvents !== "object") return [];
  const targets = new Set([String(bridgeAddress).toLowerCase(), String(bridgeHex).toLowerCase()]);
  const buckets = [];
  for (const [key, events] of Object.entries(contractEvents)) {
    if (!Array.isArray(events)) continue;
    if (targets.has(String(key).toLowerCase())) {
      for (const event of events) {
        // opnet.decodeEvents expects base64 payloads; skip malformed hex-prefixed entries.
        if (typeof event === "string" && event.trim().toLowerCase().startsWith("0x")) {
          continue;
        }
        buckets.push(event);
      }
    }
  }
  return buckets;
}

async function main() {
  if (process.argv.includes("--help") || process.argv.includes("-h")) {
    console.log(`OP_NET Burn Poller (OP_NET -> ETH release attestations)

Required:
  OPNET_RPC_URL (default: derived from OPNET_NETWORK; regtest=${DEFAULT_OPNET_RPC_URL}, testnet=${TESTNET_OPNET_RPC_URL})

Optional:
  OPNET_NETWORK (default: regtest; regtest|testnet|mainnet)
  RELAYER_ID (default: relayer-opnet)
  RELAYER_MAPPING_FILE (default: ${DEFAULT_MAPPING_FILE})
  ATTESTATION_VERSION (default: ${DEFAULT_ATTESTATION_VERSION})
  RELAYER_OUTPUT_FILE (default: ${DEFAULT_OUTPUT_FILE})
  RELAYER_START_BLOCK (default: latest-20)
  RELAYER_MAX_BLOCK_RANGE (default: 5)
  RELAYER_POLL_INTERVAL_MS (default: 30000)

ECDSA relay key options (one required for signatures; otherwise unsigned attestations are written):
  RELAYER_EVM_PRIVATE_KEY + RELAYER_INDEX
  RELAYER_EVM_KEYS_FILE (default: ${DEFAULT_KEYS_FILE})
  RELAYER_EVM_KEYS_JSON
  RELAYER_EVM_PRIVATE_KEYS (comma-separated)
`);
    return;
  }

  const mappingFile = process.env.RELAYER_MAPPING_FILE?.trim() || DEFAULT_MAPPING_FILE;
  const mapping = parseMapping(fs.readFileSync(mappingFile, "utf8"));
  const opnetNetworkName = process.env.OPNET_NETWORK || mapping.opnet.network;
  const opnetNetwork = resolveOPNetNetwork(opnetNetworkName);
  const rpcUrl = process.env.OPNET_RPC_URL?.trim() || defaultOpnetRpcUrlForNetwork(opnetNetworkName);
  const relayerId = process.env.RELAYER_ID?.trim() || "relayer-opnet";
  const outputFile = process.env.RELAYER_OUTPUT_FILE?.trim() || DEFAULT_OUTPUT_FILE;
  const attestationVersion = Number(process.env.ATTESTATION_VERSION?.trim() || `${DEFAULT_ATTESTATION_VERSION}`);
  const pollIntervalMs = Number(process.env.RELAYER_POLL_INTERVAL_MS?.trim() || "30000");
  const maxBlockRange = Number(process.env.RELAYER_MAX_BLOCK_RANGE?.trim() || "5");
  const startBlockEnv = process.env.RELAYER_START_BLOCK?.trim();

  if (!Number.isInteger(attestationVersion) || attestationVersion < 0 || attestationVersion > 255) {
    throw new Error("ATTESTATION_VERSION must be an integer in [0,255].");
  }
  if (!Number.isFinite(pollIntervalMs) || pollIntervalMs < 1000) {
    throw new Error("RELAYER_POLL_INTERVAL_MS must be >= 1000.");
  }
  if (!Number.isInteger(maxBlockRange) || maxBlockRange < 1) {
    throw new Error("RELAYER_MAX_BLOCK_RANGE must be >= 1.");
  }

  const provider = createOpnetJsonRpcProvider({ url: rpcUrl, network: opnetNetwork });
  if (!isLikelyHex(mapping.opnet.bridgeHex)) {
    mapping.opnet.bridgeHex = await resolveOpnetAddressViaRpcToHex32(String(mapping.opnet.bridgeAddress), provider);
  }
  const bridge = getContract(mapping.opnet.bridgeAddress, BRIDGE_EVENTS_ABI, provider, opnetNetwork);
  const relaySigners = loadRelaySigners(relayerId);

  fs.mkdirSync(path.dirname(outputFile), { recursive: true });
  const latestBlock = await provider.getBlockNumber();
  let nextFromBlock = startBlockEnv
    ? BigInt(startBlockEnv)
    : latestBlock > 20n
      ? latestBlock - 20n
      : 0n;
  const seen = new Set();

  console.log(
    `OP_NET burn poller started. id=${relayerId} bridge=${mapping.opnet.bridgeAddress} fromBlock=${nextFromBlock} intervalMs=${pollIntervalMs} maxBlockRange=${maxBlockRange} signers=${relaySigners.length}`,
  );
  console.log(`Output file: ${outputFile}`);
  console.log(`OP_NET RPC transport: ${describeOpnetRpcTransport()} -> ${rpcUrl}`);
  if (relaySigners.length === 0) {
    console.log("[opnet-burn-poller] no ECDSA relay signer keys configured; pending release attestations will be unsigned.");
  }

  while (true) {
    try {
      const head = await provider.getBlockNumber();
      if (head >= nextFromBlock) {
        const pending = [];
        let cursor = nextFromBlock;
        while (cursor <= head) {
          const end = cursor + BigInt(maxBlockRange) - 1n <= head ? cursor + BigInt(maxBlockRange) - 1n : head;
          for (let height = cursor; height <= end; height++) {
            const block = await provider.getBlock(height, true);
            const blockHeight = BigInt(block.height);
            for (const tx of block.transactions) {
              const bridgeEventsRaw = normalizeEventBuckets(tx.events, mapping.opnet.bridgeAddress, mapping.opnet.bridgeHex);
              if (bridgeEventsRaw.length === 0) continue;
              const decodedEvents = bridge.decodeEvents(bridgeEventsRaw);
              let burnOrdinal = 0;
              for (const evt of decodedEvents) {
                if (evt.type !== "BurnRequested") continue;
                const props = evt.properties ?? {};
                const observationId = `${tx.hash}:${burnOrdinal}`;
                burnOrdinal += 1;
                if (seen.has(observationId)) continue;
                seen.add(observationId);

                const message = {
                  version: attestationVersion,
                  direction: DIRECTION_OP_TO_ETH_RELEASE,
                  ethereumVault: String(mapping.ethereum.vaultAddress),
                  opnetBridge: String(mapping.opnet.bridgeAddress),
                  opnetBridgeHex: String(mapping.opnet.bridgeHex),
                  ethereumUser: normalizeEthereumRecipientHex20(props.ethereumRecipient),
                  opnetUser: await normalizeOpnetAddressHex32Resolved(props.from, provider),
                  assetId: Number(props.assetId),
                  amount: String(props.amount),
                  nonce: String(props.withdrawalId),
                };
                const payloadHashBytes = encodeReleaseAttestationHash(message);
                const payloadHashHex = bytesToHex(payloadHashBytes);
                const signatures = relaySigners.map((signer) => ({
                  relayIndex: signer.relayIndex,
                  relayerId: signer.relayerId,
                  signerId: signer.signerId,
                  signerPubKeyHex: signer.signerPubKeyHex,
                  signatureHex: signer.signDigestHex(payloadHashHex),
                }));

                pending.push({
                  observationId,
                  message,
                  canonicalPayload: canonicalPayload(message),
                  payloadHashHex,
                  signerIds: signatures.map((entry) => entry.signerId),
                  signatures,
                  source: {
                    network: mapping.opnet.network,
                    bridgeAddress: mapping.opnet.bridgeAddress,
                    blockNumber: Number(blockHeight),
                    blockHash: block.hash,
                    txHash: tx.hash,
                    txIndex: tx.index,
                    eventType: evt.type,
                    eventIndex: burnOrdinal - 1,
                  },
                });
              }
            }
          }
          cursor = end + 1n;
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
            fs.writeFileSync(
              outputFile,
              JSON.stringify(snapshot, (_, value) => (typeof value === "bigint" ? value.toString() : value), 2),
            );
          }
          try {
            const published = await publishReleaseAttestationsSnapshot(snapshot, disableFileOutput ? null : outputFile);
            if (published?.skipped) {
              console.log(`[opnet-burn-poller] API publish skipped: ${published.reason}`);
            } else {
              console.log(`[opnet-burn-poller] Published ${pending.length} release attestations to relayer API.`);
            }
          } catch (error) {
            console.error(`[opnet-burn-poller] release attestation API publish failed: ${error instanceof Error ? error.message : String(error)}`);
            if (disableFileOutput) throw error;
          }
          for (const entry of pending) {
            console.log(
              `[opnet-burn-poller] burn tx=${entry.source.txHash} withdrawalId=${entry.message.nonce} asset=${entry.message.assetId} amount=${entry.message.amount} recipient=${entry.message.ethereumUser}`,
            );
          }
        }
        nextFromBlock = head + 1n;
      }
    } catch (error) {
      console.error(`[opnet-burn-poller-error] ${error instanceof Error ? error.message : String(error)}`);
    }

    try {
      await publishRelayerHeartbeat({
        relayerName: relayerId,
        role: "opnet-burn-poller",
        status: "ok",
        detail: `nextFromBlock=${nextFromBlock.toString()}`,
      });
    } catch (error) {
      console.error(`[opnet-burn-heartbeat] ${error instanceof Error ? error.message : String(error)}`);
    }

    await new Promise((resolve) => setTimeout(resolve, pollIntervalMs));
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
