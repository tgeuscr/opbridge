import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { createHash } from "node:crypto";
import { fileURLToPath } from "node:url";
import { networks } from "@btc-vision/bitcoin";
import { Address } from "@btc-vision/transaction";
import { ABIDataTypes, BitcoinAbiTypes, getContract } from "opnet";
import { ethers } from "ethers";
import { bytesToBase64, hexToBytes } from "./byte-utils.mjs";
import { createOpnetJsonRpcProvider, describeOpnetRpcTransport } from "./opnet-rpc-provider.mjs";
import {
  publishProcessedMintsSnapshot,
  publishReleaseAttestationsSnapshot,
  publishRelayerHeartbeat,
} from "./relayer-api-publish.mjs";
import { loadEvmRelaySigners } from "./signers/index.mjs";
import { resolveSecretBackedValue } from "./secret-provider.mjs";

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(SCRIPT_DIR, "../../..");
const DEFAULT_MAPPING_FILE = path.resolve(REPO_ROOT, "contracts/ethereum/deployments/sepolia-latest.json");
const DEFAULT_OUTPUT_FILE = path.resolve(REPO_ROOT, "services/relayer/.data/release-attestations/relayer-opnet.json");
const DIRECTION_OP_TO_ETH_RELEASE = 2;
const DEFAULT_ATTESTATION_VERSION = 1;
const DEFAULT_OPNET_RPC_URL = "https://regtest.opnet.org";
const TESTNET_OPNET_RPC_URL = "https://testnet.opnet.org";
const DISCOVERY_DEBUG_ENABLED =
  process.env.RELAYER_DEBUG_DISCOVERY?.trim() === "1" ||
  process.env.RELAYER_DEBUG_DISCOVERY?.trim()?.toLowerCase() === "true";

const BRIDGE_EVENTS_ABI = [
  {
    name: "MintFinalized",
    values: [
      { name: "assetId", type: ABIDataTypes.UINT8 },
      { name: "recipient", type: ABIDataTypes.ADDRESS },
      { name: "amount", type: ABIDataTypes.UINT256 },
      { name: "depositId", type: ABIDataTypes.UINT256 },
    ],
    type: BitcoinAbiTypes.Event,
  },
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
  {
    name: "WrappedTokenUpdated",
    values: [
      { name: "assetId", type: ABIDataTypes.UINT8 },
      { name: "token", type: ABIDataTypes.ADDRESS },
    ],
    type: BitcoinAbiTypes.Event,
  },
  {
    name: "RelayCountUpdated",
    values: [{ name: "relayCount", type: ABIDataTypes.UINT8 }],
    type: BitcoinAbiTypes.Event,
  },
  {
    name: "RelayThresholdUpdated",
    values: [{ name: "requiredSignatures", type: ABIDataTypes.UINT8 }],
    type: BitcoinAbiTypes.Event,
  },
  {
    name: "BridgePausedUpdated",
    values: [{ name: "paused", type: ABIDataTypes.BOOL }],
    type: BitcoinAbiTypes.Event,
  },
  {
    name: "AttestationVersionAcceptanceUpdated",
    values: [
      { name: "version", type: ABIDataTypes.UINT8 },
      { name: "accepted", type: ABIDataTypes.BOOL },
    ],
    type: BitcoinAbiTypes.Event,
  },
  {
    name: "ActiveAttestationVersionUpdated",
    values: [
      { name: "previousVersion", type: ABIDataTypes.UINT8 },
      { name: "nextVersion", type: ABIDataTypes.UINT8 },
    ],
    type: BitcoinAbiTypes.Event,
  },
  {
    name: "OwnershipTransferred",
    values: [
      { name: "previousOwner", type: ABIDataTypes.ADDRESS },
      { name: "newOwner", type: ABIDataTypes.ADDRESS },
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

function logDiscovery(message) {
  if (DISCOVERY_DEBUG_ENABLED) {
    console.log(message);
  }
}

function bytesToHex(bytes) {
  return `0x${Array.from(bytes)
    .map((value) => value.toString(16).padStart(2, "0"))
    .join("")}`;
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

function bytesToBigInt(bytes) {
  let value = 0n;
  for (const byte of bytes) {
    value = (value << 8n) | BigInt(byte);
  }
  return value;
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

function eventPayloadToBase64(value) {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  if (!trimmed) return null;
  if (trimmed.toLowerCase().startsWith("0x")) {
    const hex = trimmed.slice(2);
    if (!/^[0-9a-fA-F]+$/.test(hex) || hex.length % 2 !== 0) {
      return null;
    }
    return bytesToBase64(hexToBytes(hex));
  }
  return trimmed;
}

function byteMapToBase64(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const entries = Object.entries(value)
    .map(([key, byte]) => [Number(key), Number(byte)])
    .filter(([idx, byte]) => Number.isInteger(idx) && idx >= 0 && Number.isInteger(byte) && byte >= 0 && byte <= 255)
    .sort((a, b) => a[0] - b[0]);
  if (entries.length === 0) return null;
  for (let i = 0; i < entries.length; i += 1) {
    if (entries[i][0] !== i) return null;
  }
  return bytesToBase64(Uint8Array.from(entries.map(([, byte]) => byte)));
}

function normalizeContractEventsInput(contractEvents) {
  if (!contractEvents || typeof contractEvents !== "object") return [];
  if (Array.isArray(contractEvents)) {
    return contractEvents
      .filter((event) => event && typeof event === "object")
      .map((event) => ({
        address: String(event.contractAddress ?? event.address ?? "").toLowerCase(),
        event,
      }))
      .filter((entry) => entry.address);
  }

  const out = [];
  for (const [key, events] of Object.entries(contractEvents)) {
    if (!Array.isArray(events)) continue;
    for (const event of events) {
      if (!event || typeof event !== "object") continue;
      out.push({
        address: String(key).toLowerCase(),
        event,
      });
    }
  }
  return out;
}

function normalizeEventBuckets(contractEvents, bridgeAddress, bridgeHex) {
  const targets = new Set([String(bridgeAddress).toLowerCase(), String(bridgeHex).toLowerCase()]);
  const buckets = [];
  for (const { address, event } of normalizeContractEventsInput(contractEvents)) {
    if (!targets.has(address)) continue;
    let payload = event;
    if (payload && typeof payload === "object") {
      if (typeof payload.data === "string") {
        payload = payload.data;
      } else if (typeof payload.payload === "string") {
        payload = payload.payload;
      } else if (payload.data && typeof payload.data === "object") {
        payload = byteMapToBase64(payload.data);
      }
    }
    const asBase64 = eventPayloadToBase64(payload);
    if (asBase64) buckets.push(asBase64);
  }
  return buckets;
}

function byteMapToBytes(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const entries = Object.entries(value)
    .map(([key, byte]) => [Number(key), Number(byte)])
    .filter(([idx, byte]) => Number.isInteger(idx) && idx >= 0 && Number.isInteger(byte) && byte >= 0 && byte <= 255)
    .sort((a, b) => a[0] - b[0]);
  if (entries.length === 0) return null;
  for (let i = 0; i < entries.length; i += 1) {
    if (entries[i][0] !== i) return null;
  }
  return Uint8Array.from(entries.map(([, byte]) => byte));
}

function extractStructuredBurnRequestedEvents(contractEvents, bridgeAddress, bridgeHex) {
  const targets = new Set([String(bridgeAddress).toLowerCase(), String(bridgeHex).toLowerCase()]);
  const out = [];
  for (const { address, event } of normalizeContractEventsInput(contractEvents)) {
    if (!targets.has(address)) continue;
    if (String(event.type ?? "").trim() !== "BurnRequested") continue;
    const bytes = byteMapToBytes(event.data);
    if (!bytes || bytes.length < 129) continue;

    out.push({
      type: "BurnRequested",
      properties: {
        assetId: Number(bytes[0]),
        from: bytesToHex(bytes.slice(1, 33)),
        ethereumRecipient: bytesToHex(bytes.slice(33, 65)),
        amount: bytesToBigInt(bytes.slice(65, 97)).toString(),
        withdrawalId: bytesToBigInt(bytes.slice(97, 129)).toString(),
      },
    });
  }
  return out;
}

function extractStructuredMintFinalizedEvents(contractEvents, bridgeAddress, bridgeHex) {
  const targets = new Set([String(bridgeAddress).toLowerCase(), String(bridgeHex).toLowerCase()]);
  const out = [];
  for (const { address, event } of normalizeContractEventsInput(contractEvents)) {
    if (!targets.has(address)) continue;
    if (String(event.type ?? "").trim() !== "MintFinalized") continue;
    const bytes = byteMapToBytes(event.data);
    if (!bytes || bytes.length < 97) continue;
    out.push({
      type: "MintFinalized",
      properties: {
        assetId: Number(bytes[0]),
        recipient: bytesToHex(bytes.slice(1, 33)),
        amount: bytesToBigInt(bytes.slice(33, 65)).toString(),
        depositId: bytesToBigInt(bytes.slice(65, 97)).toString(),
      },
    });
  }
  return out;
}

function collectBridgeEventArtifacts(txOrReceipt, bridgeAddress, bridgeHex) {
  const contractEvents =
    cautiouslyReadEvents(txOrReceipt, "events") ??
    cautiouslyReadEvents(txOrReceipt, "rawEvents") ??
    safeContractEvents(txOrReceipt) ??
    safeOwnValue(txOrReceipt, "events") ??
    safeOwnValue(txOrReceipt, "rawEvents") ??
    null;
  const bridgeEventsRaw = normalizeEventBuckets(contractEvents, bridgeAddress, bridgeHex);
  const structuredBurnEvents = extractStructuredBurnRequestedEvents(contractEvents, bridgeAddress, bridgeHex);
  const structuredMintEvents = extractStructuredMintFinalizedEvents(contractEvents, bridgeAddress, bridgeHex);
  return {
    contractEvents,
    bridgeEventsRaw,
    structuredBurnEvents,
    structuredMintEvents,
  };
}

function decodeBridgeEventsSafely(bridge, bridgeEventsRaw, txHash, blockHeight) {
  const decodedEvents = [];
  for (let eventIndex = 0; eventIndex < bridgeEventsRaw.length; eventIndex += 1) {
    const payload = bridgeEventsRaw[eventIndex];
    try {
      const decoded = bridge.decodeEvents([payload]);
      if (Array.isArray(decoded) && decoded.length > 0) {
        decodedEvents.push(...decoded);
      }
    } catch (error) {
      console.warn(
        `[opnet-poller] skipping malformed bridge event payload tx=${txHash} block=${blockHeight.toString()} index=${eventIndex}: ${
          error instanceof Error ? error.message : String(error)
        }`,
      );
    }
  }
  return decodedEvents;
}

function hasStructuredBurnRequested(contractEvents, bridgeAddress, bridgeHex) {
  const structured = extractStructuredBurnRequestedEvents(contractEvents, bridgeAddress, bridgeHex);
  return structured.length > 0;
}

function hasBridgeMention(contractEvents, bridgeAddress, bridgeHex) {
  const targets = new Set([String(bridgeAddress).toLowerCase(), String(bridgeHex).toLowerCase()]);
  return normalizeContractEventsInput(contractEvents).some(({ address }) => targets.has(address));
}

function safeOwnValue(target, key) {
  if (!target || (typeof target !== "object" && typeof target !== "function")) return undefined;
  let current = target;
  while (current && (typeof current === "object" || typeof current === "function")) {
    const descriptor = Object.getOwnPropertyDescriptor(current, key);
    if (descriptor) {
      if (Object.prototype.hasOwnProperty.call(descriptor, "value")) {
        return descriptor.value;
      }
      return undefined;
    }
    current = Object.getPrototypeOf(current);
  }
  return undefined;
}

function safeStringProperty(target, keys) {
  for (const key of keys) {
    const value = safeOwnValue(target, key);
    if (typeof value !== "string") continue;
    const normalized = value.trim().toLowerCase();
    if (normalized) return normalized;
  }
  return "";
}

function safeNumericProperty(target, key) {
  const value = safeOwnValue(target, key);
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "bigint") return Number(value);
  if (typeof value === "string" && value.trim()) {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) return parsed;
  }
  return null;
}

function safeContractEvents(tx) {
  const directEvents = safeOwnValue(tx, "events");
  if (directEvents && typeof directEvents === "object") return directEvents;
  const receipt = safeOwnValue(tx, "receipt");
  const receiptEvents = safeOwnValue(receipt, "events");
  return receiptEvents && typeof receiptEvents === "object" ? receiptEvents : null;
}

function cautiouslyReadEvents(target, key) {
  if (!target || (typeof target !== "object" && typeof target !== "function")) return null;
  try {
    const value = target[key];
    return value && typeof value === "object" ? value : null;
  } catch {
    return null;
  }
}

function isLikelyTxHash(raw) {
  const value = String(raw ?? "").trim().toLowerCase();
  return /^[0-9a-f]{64}$/.test(value);
}

function txIdentifierCandidates(tx) {
  const out = [];
  for (const key of ["id", "txid", "hash", "transactionHash", "transactionId"]) {
    const value = safeStringProperty(tx, [key]);
    if (!value || !isLikelyTxHash(value) || out.includes(value)) continue;
    out.push(value);
  }
  return out;
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
  RELAYER_DEBUG_DISCOVERY (default: false; enables verbose tx probing/fallback logs)

ECDSA relay signer configuration:
  RELAYER_EVM_SIGNER_MODE (default: kms)
  RELAYER_INDEX (required)
  RELAYER_EVM_KMS_KEY_ID or KMS_EVM_KEY_ID (required)
`);
    return;
  }

  const mappingFile = process.env.RELAYER_MAPPING_FILE?.trim() || DEFAULT_MAPPING_FILE;
  const mapping = parseMapping(fs.readFileSync(mappingFile, "utf8"));
  const opnetNetworkName = process.env.OPNET_NETWORK || mapping.opnet.network;
  const opnetNetwork = resolveOPNetNetwork(opnetNetworkName);
  const rpcUrl = await resolveSecretBackedValue({
    directValue: process.env.OPNET_RPC_URL?.trim() || defaultOpnetRpcUrlForNetwork(opnetNetworkName),
    secretRef: process.env.OPNET_RPC_URL_SECRET_REF,
  });
  const relayerId = process.env.RELAYER_ID?.trim() || "relayer-opnet";
  const outputFile = process.env.RELAYER_OUTPUT_FILE?.trim() || DEFAULT_OUTPUT_FILE;
  const attestationVersion = Number(process.env.ATTESTATION_VERSION?.trim() || `${DEFAULT_ATTESTATION_VERSION}`);
  const pollIntervalMs = Number(process.env.RELAYER_POLL_INTERVAL_MS?.trim() || "30000");
  const maxBlockRange = Number(process.env.RELAYER_MAX_BLOCK_RANGE?.trim() || "5");
  const minConfirmations = Number(process.env.RELAYER_MIN_CONFIRMATIONS?.trim() || "10");
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
  if (!Number.isInteger(minConfirmations) || minConfirmations < 0) {
    throw new Error("RELAYER_MIN_CONFIRMATIONS must be >= 0.");
  }

  const provider = createOpnetJsonRpcProvider({ url: rpcUrl, network: opnetNetwork });
  if (!isLikelyHex(mapping.opnet.bridgeHex)) {
    mapping.opnet.bridgeHex = await resolveOpnetAddressViaRpcToHex32(String(mapping.opnet.bridgeAddress), provider);
  }
  const bridge = getContract(mapping.opnet.bridgeAddress, BRIDGE_EVENTS_ABI, provider, opnetNetwork);
  const relaySigners = await loadEvmRelaySigners({
    relayerId,
  });

  fs.mkdirSync(path.dirname(outputFile), { recursive: true });
  const latestBlock = await provider.getBlockNumber();
  let nextFromBlock = startBlockEnv
    ? BigInt(startBlockEnv)
    : latestBlock > 20n
      ? latestBlock - 20n
      : 0n;
  const seen = new Set();

  console.log(
    `OP_NET burn poller started. id=${relayerId} bridge=${mapping.opnet.bridgeAddress} fromBlock=${nextFromBlock} intervalMs=${pollIntervalMs} maxBlockRange=${maxBlockRange} minConfirmations=${minConfirmations} signers=${relaySigners.length}`,
  );
  console.log(`Output file: ${outputFile}`);
  console.log(`OP_NET RPC transport: ${describeOpnetRpcTransport()} -> ${rpcUrl}`);
  if (relaySigners.length === 0) {
    console.log("[opnet-poller] no ECDSA relay signer keys configured; pending release attestations will be unsigned.");
  }

  while (true) {
    try {
      const head = await provider.getBlockNumber();
      const finalizedHead = head >= BigInt(minConfirmations) ? head - BigInt(minConfirmations) : -1n;
      if (finalizedHead >= nextFromBlock) {
        const pending = [];
        const processedMints = [];
        let retryFromBlock = null;
        let cursor = nextFromBlock;
        while (cursor <= finalizedHead) {
          const end =
            cursor + BigInt(maxBlockRange) - 1n <= finalizedHead
              ? cursor + BigInt(maxBlockRange) - 1n
              : finalizedHead;
          for (let height = cursor; height <= end; height++) {
            let block;
            try {
              block = await provider.getBlock(height, true);
            } catch (error) {
              console.warn(
                `[opnet-poller] block=${height.toString()} fetch/parse error; will retry from this block: ${
                  error instanceof Error ? error.message : String(error)
                }`,
              );
              if (retryFromBlock == null || height < retryFromBlock) {
                retryFromBlock = height;
              }
              continue;
            }
            const blockHeight = BigInt(block.height);
            const rawTransactions = Array.isArray(block.rawTransactions) ? block.rawTransactions : [];
            let parsedTransactions = [];
            if (rawTransactions.length === 0) {
              try {
                if (Array.isArray(block.transactions)) {
                  parsedTransactions = block.transactions;
                }
              } catch (error) {
                logDiscovery(
                  `[opnet-poller] block=${height.toString()} parsed tx list error: ${
                    error instanceof Error ? error.message : String(error)
                  }; using available rawTransactions only.`,
                );
              }
            }
            const transactions = rawTransactions.length > 0 ? rawTransactions : parsedTransactions;
            for (let txIndex = 0; txIndex < transactions.length; txIndex += 1) {
              const rawTxAtIndex = rawTransactions[txIndex] ?? null;
              const parsedTx = parsedTransactions[txIndex] ?? null;
              const tx = rawTxAtIndex ?? parsedTx;
              const bridgeHintEvents =
                cautiouslyReadEvents(tx, "events") ??
                safeOwnValue(tx, "events") ??
                null;
              if (!hasBridgeMention(bridgeHintEvents, mapping.opnet.bridgeAddress, mapping.opnet.bridgeHex)) {
                continue;
              }
              const txIds = [...new Set([...txIdentifierCandidates(rawTxAtIndex), ...txIdentifierCandidates(parsedTx)])];
              const txHash = txIds[0] ?? `${block.hash}:${blockHeight.toString()}:${txIndex.toString()}`;
              try {
                let bridgeEventsRaw = [];
                let structuredBurnEvents = [];
                let structuredMintEvents = [];
                const eventCandidates = [];
                if (txIds.length > 0 && typeof provider.getTransactionReceipt === "function") {
                  for (const candidate of txIds) {
                    try {
                      const receipt = await provider.getTransactionReceipt(candidate);
                      if (!receipt || typeof receipt !== "object") continue;
                      eventCandidates.push({ tx: receipt, label: "receipt" });
                      break;
                    } catch {
                      // Try next candidate hash/id form.
                    }
                  }
                }
                if (rawTxAtIndex) eventCandidates.push({ tx: rawTxAtIndex, label: "raw" });
                if (parsedTx && parsedTx !== rawTxAtIndex) eventCandidates.push({ tx: parsedTx, label: "parsed" });
                if (eventCandidates.length === 0) eventCandidates.push({ tx, label: "selected" });
                let lastEventError = null;
                for (const candidate of eventCandidates) {
                  try {
                    ({
                      bridgeEventsRaw,
                      structuredBurnEvents,
                      structuredMintEvents,
                    } = collectBridgeEventArtifacts(candidate.tx, mapping.opnet.bridgeAddress, mapping.opnet.bridgeHex));
                    if (bridgeEventsRaw.length > 0 || structuredBurnEvents.length > 0 || structuredMintEvents.length > 0) {
                      break;
                    }
                  } catch (error) {
                    lastEventError = error;
                    if (candidate.label === "receipt") {
                      logDiscovery(
                        `[opnet-poller] tx=${txHash} receipt event access failed; falling back to tx object events: ${
                          error instanceof Error ? error.message : String(error)
                        }`,
                      );
                      continue;
                    }
                    if (candidate.label === "parsed" && rawTxAtIndex) {
                      logDiscovery(
                        `[opnet-poller] tx=${txHash} parsed tx event access failed; retaining raw tx events: ${
                          error instanceof Error ? error.message : String(error)
                        }`,
                      );
                      continue;
                    }
                    if (candidate.label === "raw" && parsedTx && parsedTx !== rawTxAtIndex) {
                      logDiscovery(
                        `[opnet-poller] tx=${txHash} raw tx event access failed; trying parsed tx events: ${
                          error instanceof Error ? error.message : String(error)
                        }`,
                      );
                      continue;
                    }
                    throw error;
                  }
                }
                if (bridgeEventsRaw.length === 0 && structuredBurnEvents.length === 0 && structuredMintEvents.length === 0 && lastEventError) {
                  throw lastEventError;
                }
                if (bridgeEventsRaw.length === 0 && structuredBurnEvents.length === 0 && structuredMintEvents.length === 0) continue;
                const decodedEvents = [
                  ...structuredMintEvents,
                  ...structuredBurnEvents,
                  ...((structuredMintEvents.length === 0 && structuredBurnEvents.length === 0)
                    ? decodeBridgeEventsSafely(bridge, bridgeEventsRaw, txHash, blockHeight)
                    : []),
                ];
                if (decodedEvents.length === 0) continue;
                let burnOrdinal = 0;
                for (const evt of decodedEvents) {
                  if (evt.type === "MintFinalized") {
                    const depositId = String(evt?.properties?.depositId ?? "").trim();
                    if (!depositId) continue;
                    const processedId = `mint:${depositId}`;
                    if (seen.has(processedId)) continue;
                    seen.add(processedId);
                    processedMints.push({
                      depositId,
                      sourceChain: "opnet-testnet",
                      txHash: txHash.toLowerCase(),
                      blockNumber: Number(blockHeight),
                    });
                    continue;
                  }
                  if (evt.type !== "BurnRequested") continue;
                  const props = evt.properties ?? {};
                  const observationId = `${txHash}:${burnOrdinal}`;
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
                  const signatureResults = await Promise.all(
                    relaySigners.map(async (signer) => {
                      try {
                        return {
                          ok: true,
                          signature: {
                            relayIndex: signer.relayIndex,
                            relayerId: signer.relayerId,
                            signerId: signer.signerId,
                            signerPubKeyHex: signer.signerPubKeyHex,
                            signatureHex: await Promise.resolve(signer.signDigestHex(payloadHashHex)),
                          },
                        };
                      } catch (error) {
                        console.warn(
                          `[opnet-poller] tx=${txHash} withdrawalId=${message.nonce} signer=${signer.relayerId} signature generation failed: ${
                            error instanceof Error ? error.message : String(error)
                          }`,
                        );
                        return {
                          ok: false,
                          signerId: signer.signerId,
                        };
                      }
                    }),
                  );
                  const signatures = signatureResults.filter((result) => result.ok).map((result) => result.signature);

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
                      txHash,
                      txIndex: safeNumericProperty(rawTxAtIndex ?? parsedTx ?? tx, "index") ?? txIndex,
                      eventType: evt.type,
                      eventIndex: burnOrdinal - 1,
                      observedAt: new Date().toISOString(),
                      requiredConfirmations: minConfirmations,
                    },
                  });
                }
              } catch (error) {
                console.warn(
                  `[opnet-poller] skipping tx=${txHash} at block=${blockHeight.toString()} due to event parse error: ${
                    error instanceof Error ? error.message : String(error)
                  }`,
                );
                continue;
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
              console.log(`[opnet-poller] API publish skipped: ${published.reason}`);
            } else {
              console.log(`[opnet-poller] Published ${pending.length} release attestations to relayer API.`);
            }
          } catch (error) {
            console.error(`[opnet-poller] release attestation API publish failed: ${error instanceof Error ? error.message : String(error)}`);
            if (disableFileOutput) throw error;
          }
          for (const entry of pending) {
            console.log(
              `[opnet-poller] burn tx=${entry.source.txHash} withdrawalId=${entry.message.nonce} asset=${entry.message.assetId} amount=${entry.message.amount} recipient=${entry.message.ethereumUser}`,
            );
          }
        }
        if (processedMints.length > 0) {
          const snapshot = {
            generatedAt: new Date().toISOString(),
            relayerId,
            mappingSource: mappingFile,
            count: processedMints.length,
            processed: processedMints,
          };
          const disableFileOutput =
            process.env.RELAYER_DISABLE_FILE_OUTPUT?.trim() === "1" ||
            process.env.RELAYER_DISABLE_FILE_OUTPUT?.trim()?.toLowerCase() === "true";
          try {
            const published = await publishProcessedMintsSnapshot(snapshot, disableFileOutput ? null : outputFile);
            if (published?.skipped) {
              console.log(`[opnet-poller] processed mint publish skipped: ${published.reason}`);
            } else {
              console.log(`[opnet-poller] Published ${processedMints.length} processed mint(s) to relayer API.`);
            }
          } catch (error) {
            console.error(`[opnet-poller] processed mint API publish failed: ${error instanceof Error ? error.message : String(error)}`);
            if (disableFileOutput) throw error;
          }
        }
        if (retryFromBlock != null) {
          nextFromBlock = retryFromBlock;
          console.log(
            `[opnet-poller] retaining cursor at block=${nextFromBlock.toString()} for retry after parse failures.`,
          );
        } else {
          nextFromBlock = finalizedHead + 1n;
        }
      }
    } catch (error) {
      console.error(`[opnet-poller-error] ${error instanceof Error ? error.message : String(error)}`);
    }

    try {
      const heartbeatHead = await provider.getBlockNumber();
      const heartbeatFinalizedHead =
        heartbeatHead >= BigInt(minConfirmations) ? heartbeatHead - BigInt(minConfirmations) : -1n;
      await publishRelayerHeartbeat({
        relayerName: relayerId,
        role: "opnet-poller",
        status: "ok",
        detail: JSON.stringify({
          sourceChain: opnetNetworkName,
          currentHead: Number(heartbeatHead),
          finalizedHead: heartbeatFinalizedHead >= 0n ? Number(heartbeatFinalizedHead) : null,
          minConfirmations,
          nextFromBlock: nextFromBlock.toString(),
        }),
      });
    } catch (error) {
      console.error(`[opnet-heartbeat] ${error instanceof Error ? error.message : String(error)}`);
    }

    await new Promise((resolve) => setTimeout(resolve, pollIntervalMs));
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
