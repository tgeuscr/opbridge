import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(SCRIPT_DIR, "../../..");
const DEFAULT_RELAYER_DATA_DIR = path.resolve(REPO_ROOT, "services/relayer/.data");
const DEFAULT_OUTPUT_FILE = path.resolve(DEFAULT_RELAYER_DATA_DIR, "release-submission-candidates.json");
const RELEASE_SIG_BYTES = 65;
const DIRECTION_OP_TO_ETH_RELEASE = 2;

function hexToBytes(raw) {
  const value = String(raw ?? "").trim().toLowerCase();
  const normalized = value.startsWith("0x") ? value.slice(2) : value;
  if (!/^[0-9a-f]+$/.test(normalized) || normalized.length % 2 !== 0) {
    throw new Error(`Invalid hex string: ${raw}`);
  }
  const out = new Uint8Array(normalized.length / 2);
  for (let i = 0; i < out.length; i++) {
    out[i] = Number.parseInt(normalized.slice(i * 2, i * 2 + 2), 16);
  }
  return out;
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

function resolveInputFiles() {
  const fromEnv = process.env.RELAYER_RELEASE_ATTESTATION_FILES?.trim();
  if (fromEnv) {
    return fromEnv.split(",").map((v) => v.trim()).filter(Boolean);
  }
  const dir = path.resolve(DEFAULT_RELAYER_DATA_DIR, "release-attestations");
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((name) => name.toLowerCase().endsWith(".json"))
    .map((name) => path.join(dir, name));
}

function loadEntries(files) {
  const entries = [];
  for (const file of files) {
    if (!fs.existsSync(file)) continue;
    const parsed = JSON.parse(fs.readFileSync(file, "utf8"));
    const pending = Array.isArray(parsed.pending) ? parsed.pending : [];
    for (const item of pending) {
      if (Number(item?.message?.direction) !== DIRECTION_OP_TO_ETH_RELEASE) continue;
      entries.push({ file, relayerId: parsed.relayerId ?? null, pending: item });
    }
  }
  return entries;
}

function packReleaseCandidate(groupKey, groupEntries, threshold) {
  const [first] = groupEntries;
  const message = first.pending.message ?? {};
  const ethereumRecipient = String(message.ethereumUser ?? "");
  const opnetUser = String(message.opnetUser ?? "");
  if (!ethereumRecipient) throw new Error(`Candidate ${groupKey} missing message.ethereumUser.`);
  if (!opnetUser) throw new Error(`Candidate ${groupKey} missing message.opnetUser.`);

  const signaturesBySigner = new Map();
  for (const entry of groupEntries) {
    const signatures = Array.isArray(entry.pending.signatures) ? entry.pending.signatures : [];
    for (const sig of signatures) {
      const signerId = String(sig.signerId ?? "").toLowerCase();
      if (!signerId || signaturesBySigner.has(signerId)) continue;
      signaturesBySigner.set(signerId, {
        signerId,
        relayerId: sig.relayerId ?? entry.relayerId ?? null,
        relayIndex: Number(sig.relayIndex),
        signatureHex: String(sig.signatureHex ?? ""),
      });
    }
  }

  const unique = [...signaturesBySigner.values()].sort((a, b) => a.relayIndex - b.relayIndex);
  const selected = unique.slice(0, threshold);
  if (selected.length < threshold) {
    return {
      payloadHashHex: groupKey,
      ready: false,
      reason: `Need ${threshold} signatures, found ${unique.length}.`,
      message,
      availableSignatures: unique.map((entry) => ({
        relayIndex: entry.relayIndex,
        signerId: entry.signerId,
        relayerId: entry.relayerId,
      })),
    };
  }

  const relayIndexesPacked = new Uint8Array(threshold);
  const signatureBytes = selected.map((entry, i) => {
    if (!Number.isInteger(entry.relayIndex) || entry.relayIndex < 0 || entry.relayIndex > 255) {
      throw new Error(`Invalid relayIndex=${entry.relayIndex}`);
    }
    relayIndexesPacked[i] = entry.relayIndex;
    const bytes = hexToBytes(entry.signatureHex);
    if (bytes.length !== RELEASE_SIG_BYTES) {
      throw new Error(`Invalid ECDSA signature size ${bytes.length}; expected ${RELEASE_SIG_BYTES}.`);
    }
    return bytes;
  });

  return {
    payloadHashHex: groupKey,
    ready: true,
    message,
    canonicalPayload: first.pending.canonicalPayload,
    observationIds: groupEntries.map((entry) => entry.pending.observationId),
    selectedSignatures: selected.map((entry) => ({
      relayIndex: entry.relayIndex,
      signerId: entry.signerId,
      relayerId: entry.relayerId,
    })),
    releaseSubmission: {
      assetId: Number(message.assetId),
      attestationVersion: Number(message.version),
      opnetUser,
      recipient: ethereumRecipient,
      amount: String(message.amount),
      withdrawalId: String(message.nonce),
      relayIndexesPackedHex: bytesToHex(relayIndexesPacked),
      relaySignaturesPackedHex: bytesToHex(concatBytes(signatureBytes)),
    },
  };
}

function main() {
  if (process.argv.includes("--help") || process.argv.includes("-h")) {
    console.log(`Aggregate OP_NET Burn Attestations (Release Candidates)

Optional:
  RELAYER_RELEASE_ATTESTATION_FILES (comma-separated JSON files)
  RELAYER_THRESHOLD (default: 2)
  RELEASE_AGGREGATOR_OUTPUT_FILE (default: ${DEFAULT_OUTPUT_FILE})
`);
    return;
  }

  const files = resolveInputFiles();
  if (files.length === 0) {
    throw new Error("No release attestation files found. Set RELAYER_RELEASE_ATTESTATION_FILES or create .data/release-attestations/*.json.");
  }
  const threshold = Number(process.env.RELAYER_THRESHOLD?.trim() || "2");
  if (!Number.isInteger(threshold) || threshold < 1 || threshold > 255) {
    throw new Error("RELAYER_THRESHOLD must be an integer in [1,255].");
  }
  const outputFile = process.env.RELEASE_AGGREGATOR_OUTPUT_FILE?.trim() || DEFAULT_OUTPUT_FILE;
  const entries = loadEntries(files);
  const groups = new Map();
  for (const entry of entries) {
    const hash = String(entry.pending.payloadHashHex ?? "").toLowerCase();
    if (!hash) continue;
    const list = groups.get(hash) ?? [];
    list.push(entry);
    groups.set(hash, list);
  }

  const candidates = [];
  for (const [hash, groupEntries] of groups.entries()) {
    candidates.push(packReleaseCandidate(hash, groupEntries, threshold));
  }

  const output = {
    generatedAt: new Date().toISOString(),
    threshold,
    filesScanned: files,
    groups: groups.size,
    ready: candidates.filter((entry) => entry.ready).length,
    candidates,
  };
  fs.mkdirSync(path.dirname(outputFile), { recursive: true });
  fs.writeFileSync(outputFile, JSON.stringify(output, null, 2));
  console.log(`Wrote ${output.ready}/${output.groups} ready release candidates -> ${outputFile}`);
}

try {
  main();
} catch (error) {
  console.error(error);
  process.exit(1);
}
