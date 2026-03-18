import fs from "node:fs";
import process from "node:process";
import { JSONRpcProvider, getContract } from "opnet";
import { networks } from "@btc-vision/bitcoin";
import { ABIDataTypes, BitcoinAbiTypes } from "opnet";

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
];

function bytesToHex(bytes) {
  return `0x${Array.from(bytes)
    .map((value) => value.toString(16).padStart(2, "0"))
    .join("")}`;
}

function hexToBytes(hex) {
  const raw = String(hex ?? "").trim();
  const normalized = raw.startsWith("0x") ? raw.slice(2) : raw;
  if (!normalized || normalized.length % 2 !== 0 || /[^0-9a-f]/i.test(normalized)) {
    throw new Error(`Invalid hex string: ${raw}`);
  }
  const out = new Uint8Array(normalized.length / 2);
  for (let i = 0; i < normalized.length; i += 2) {
    out[i / 2] = Number.parseInt(normalized.slice(i, i + 2), 16);
  }
  return out;
}

function bytesToBase64(bytes) {
  return Buffer.from(bytes).toString("base64");
}

function bytesToBigInt(bytes) {
  let value = 0n;
  for (const byte of bytes) {
    value = (value << 8n) | BigInt(byte);
  }
  return value;
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

function eventPayloadToBase64(value) {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  if (!trimmed) return null;
  if (trimmed.toLowerCase().startsWith("0x")) {
    return bytesToBase64(hexToBytes(trimmed));
  }
  return trimmed;
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
        const asBytes = byteMapToBytes(payload.data);
        payload = asBytes ? bytesToBase64(asBytes) : null;
      }
    }
    const asBase64 = eventPayloadToBase64(payload);
    if (asBase64) buckets.push(asBase64);
  }
  return buckets;
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

function decodeBridgeEventsSafely(bridge, bridgeEventsRaw) {
  const decodedEvents = [];
  for (const payload of bridgeEventsRaw) {
    try {
      const decoded = bridge.decodeEvents([payload]);
      if (Array.isArray(decoded) && decoded.length > 0) {
        decodedEvents.push(...decoded);
      }
    } catch {
      // Ignore malformed payloads in the probe.
    }
  }
  return decodedEvents;
}

function txIdentifierCandidates(tx) {
  return [...new Set([tx?.id, tx?.txid, tx?.hash, tx?.transactionHash, tx?.transactionId].filter(Boolean))];
}

function hasBridgeMention(contractEvents, bridgeAddress, bridgeHex) {
  const targets = new Set([String(bridgeAddress).toLowerCase(), String(bridgeHex).toLowerCase()]);
  return normalizeContractEventsInput(contractEvents).some(({ address }) => targets.has(address));
}

const mapping = JSON.parse(fs.readFileSync("contracts/ethereum/deployments/sepolia-latest.json", "utf8"));
const root = mapping.mapping ?? mapping;
const opnetNetwork = networks.opnetTestnet;
const provider = new JSONRpcProvider({ url: "https://testnet.opnet.org", network: opnetNetwork });
const bridge = getContract(root.opnet.bridgeAddress, BRIDGE_EVENTS_ABI, provider, opnetNetwork);

const startBlock = BigInt(process.argv[2] ?? "3885");
const latestBlock = await provider.getBlockNumber();
const endBlock = BigInt(process.argv[3] ?? latestBlock.toString());
const progressEvery = Number(process.env.PROBE_PROGRESS_EVERY?.trim() || "500");
const receiptBatchSize = Number(process.env.PROBE_RECEIPT_BATCH_SIZE?.trim() || "16");

const burns = [];
const mints = [];
const allEvents = [];
const stats = {
  startBlock: startBlock.toString(),
  endBlock: endBlock.toString(),
  latestBlock: latestBlock.toString(),
  blocksScanned: 0,
  txsEnumerated: 0,
  txsPrefilterMatched: 0,
  receiptFetches: 0,
  receiptFetchFailures: 0,
  receiptBridgeEventObjects: 0,
  structuredBurns: 0,
  decodedBurns: 0,
  structuredMints: 0,
  decodedMints: 0,
  otherStructuredEvents: 0,
  otherDecodedEvents: 0,
};

async function processCandidateTx(height, rawTx) {
  const txIds = txIdentifierCandidates(rawTx);
  if (txIds.length === 0) return [];

  let receipt = null;
  for (const candidate of txIds) {
    try {
      stats.receiptFetches += 1;
      receipt = await provider.getTransactionReceipt(candidate);
      if (receipt && typeof receipt === "object") break;
    } catch {
      stats.receiptFetchFailures += 1;
    }
  }
  if (!receipt || typeof receipt !== "object") return [];

  const receiptEvents = receipt.events ?? receipt.rawEvents ?? null;
  if (hasBridgeMention(receiptEvents, root.opnet.bridgeAddress, root.opnet.bridgeHex)) {
    stats.receiptBridgeEventObjects += 1;
  }

  const structuredBurnEvents = extractStructuredBurnRequestedEvents(receiptEvents, root.opnet.bridgeAddress, root.opnet.bridgeHex);
  const structuredMintEvents = extractStructuredMintFinalizedEvents(receiptEvents, root.opnet.bridgeAddress, root.opnet.bridgeHex);
  const bridgeEventsRaw = normalizeEventBuckets(receiptEvents, root.opnet.bridgeAddress, root.opnet.bridgeHex);
  const decodedEvents = decodeBridgeEventsSafely(bridge, bridgeEventsRaw);
  const decodedBurns = decodedEvents.filter((event) => event?.type === "BurnRequested");
  const decodedMints = decodedEvents.filter((event) => event?.type === "MintFinalized");
  const structuredBridgeEvents = normalizeContractEventsInput(receiptEvents)
    .filter(({ address, event }) => {
      const normalized = String(address).toLowerCase();
      return (
        (normalized === String(root.opnet.bridgeAddress).toLowerCase() ||
          normalized === String(root.opnet.bridgeHex).toLowerCase()) &&
        typeof event?.type === "string" &&
        event.type.trim()
      );
    })
    .map(({ event }) => event);
  const out = [];

  for (const event of structuredBurnEvents) {
    stats.structuredBurns += 1;
    out.push({
      source: "structured",
      blockNumber: Number(height),
      txHash: String(txIds[0]).toLowerCase(),
      withdrawalId: String(event.properties.withdrawalId),
      assetId: Number(event.properties.assetId),
      amount: String(event.properties.amount),
      recipient: String(event.properties.ethereumRecipient).toLowerCase(),
    });
  }

  for (const event of decodedBurns) {
    stats.decodedBurns += 1;
    out.push({
      source: "decoded",
      blockNumber: Number(height),
      txHash: String(txIds[0]).toLowerCase(),
      withdrawalId: String(event.properties.withdrawalId),
      assetId: Number(event.properties.assetId),
      amount: String(event.properties.amount),
      recipient: String(event.properties.ethereumRecipient).toLowerCase(),
    });
  }

  for (const event of structuredMintEvents) {
    stats.structuredMints += 1;
    mints.push({
      source: "structured",
      blockNumber: Number(height),
      txHash: String(txIds[0]).toLowerCase(),
      depositId: String(event.properties.depositId),
      assetId: Number(event.properties.assetId),
      amount: String(event.properties.amount),
      recipient: String(event.properties.recipient).toLowerCase(),
    });
  }

  for (const event of decodedMints) {
    stats.decodedMints += 1;
    mints.push({
      source: "decoded",
      blockNumber: Number(height),
      txHash: String(txIds[0]).toLowerCase(),
      depositId: String(event.properties.depositId),
      assetId: Number(event.properties.assetId),
      amount: String(event.properties.amount),
      recipient: String(event.properties.recipient).toLowerCase(),
    });
  }

  for (const event of structuredBridgeEvents) {
    const eventType = String(event.type).trim();
    const isBurn = eventType === "BurnRequested";
    const isMint = eventType === "MintFinalized";
    if (!isBurn && !isMint) {
      stats.otherStructuredEvents += 1;
    }
    allEvents.push({
      source: "structured",
      blockNumber: Number(height),
      txHash: String(txIds[0]).toLowerCase(),
      eventType,
      properties: event.properties ?? event.data ?? event,
    });
  }

  for (const event of decodedEvents) {
    const eventType = String(event?.type ?? "").trim();
    if (!eventType) continue;
    const isBurn = eventType === "BurnRequested";
    const isMint = eventType === "MintFinalized";
    if (!isBurn && !isMint) {
      stats.otherDecodedEvents += 1;
    }
    allEvents.push({
      source: "decoded",
      blockNumber: Number(height),
      txHash: String(txIds[0]).toLowerCase(),
      eventType,
      properties: event.properties ?? null,
    });
  }

  return out;
}

for (let height = startBlock; height <= endBlock; height += 1n) {
  const block = await provider.getBlock(height, true);
  stats.blocksScanned += 1;
  const rawTransactions = Array.isArray(block.rawTransactions) ? block.rawTransactions : [];
  stats.txsEnumerated += rawTransactions.length;

  const candidates = rawTransactions.filter((rawTx) => hasBridgeMention(rawTx?.events, root.opnet.bridgeAddress, root.opnet.bridgeHex));
  stats.txsPrefilterMatched += candidates.length;

  for (let index = 0; index < candidates.length; index += receiptBatchSize) {
    const batch = candidates.slice(index, index + receiptBatchSize);
    const results = await Promise.all(batch.map((rawTx) => processCandidateTx(height, rawTx)));
    for (const entries of results) {
      burns.push(...entries);
    }
  }

  if (progressEvery > 0 && stats.blocksScanned % progressEvery === 0) {
    console.error(
      `[probe-prefilter] scanned blocks=${stats.blocksScanned} height=${height.toString()} txs=${stats.txsEnumerated} candidates=${stats.txsPrefilterMatched} burns=${burns.length}`,
    );
  }
}

const uniqueBurns = [...new Map(burns.map((burn) => [`${burn.txHash}:${burn.withdrawalId}`, burn])).values()].sort(
  (a, b) => a.blockNumber - b.blockNumber || Number(a.withdrawalId) - Number(b.withdrawalId),
);
const uniqueMints = [...new Map(mints.map((mint) => [`${mint.txHash}:${mint.depositId}`, mint])).values()].sort(
  (a, b) => a.blockNumber - b.blockNumber || Number(a.depositId) - Number(b.depositId),
);
const uniqueEvents = [
  ...new Map(
    allEvents.map((event) => [
      `${event.source}:${event.txHash}:${event.eventType}:${JSON.stringify(event.properties)}`,
      event,
    ]),
  ).values(),
].sort((a, b) => a.blockNumber - b.blockNumber || a.txHash.localeCompare(b.txHash) || a.eventType.localeCompare(b.eventType));
const eventTypeCounts = uniqueEvents.reduce((acc, event) => {
  acc[event.eventType] = (acc[event.eventType] ?? 0) + 1;
  return acc;
}, {});

console.log(
  JSON.stringify(
    {
      stats,
      uniqueBurnCount: uniqueBurns.length,
      uniqueMintCount: uniqueMints.length,
      uniqueEventCount: uniqueEvents.length,
      eventTypeCounts,
      burns: uniqueBurns,
      mints: uniqueMints,
      events: uniqueEvents,
    },
    null,
    2,
  ),
);
