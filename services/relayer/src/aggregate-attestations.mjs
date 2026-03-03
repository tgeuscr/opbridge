import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { DatabaseSync } from "node:sqlite";
import { fileURLToPath } from "node:url";
import { publishMintCandidatesSnapshot } from "./relayer-api-publish.mjs";

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(SCRIPT_DIR, "../../..");
const DEFAULT_RELAYER_DATA_DIR = path.resolve(REPO_ROOT, "services/relayer/.data");
const DEFAULT_OUTPUT_FILE = path.resolve(DEFAULT_RELAYER_DATA_DIR, "mint-submission-candidates.json");
const RELAY_SIGNATURE_BYTES = 2420;

function hexToBytes(raw) {
  const value = String(raw ?? "").trim().toLowerCase();
  if (!value) throw new Error("Hex string is required.");
  const normalized = value.startsWith("0x") ? value.slice(2) : value;
  if (!/^[0-9a-f]+$/.test(normalized) || normalized.length % 2 !== 0) {
    throw new Error("Invalid hex string.");
  }
  const bytes = new Uint8Array(normalized.length / 2);
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = Number.parseInt(normalized.slice(i * 2, i * 2 + 2), 16);
  }
  return bytes;
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

function resolveInputFiles() {
  const fromEnv = process.env.RELAYER_ATTESTATION_FILES?.trim();
  if (fromEnv) {
    return fromEnv
      .split(",")
      .map((entry) => entry.trim())
      .filter(Boolean);
  }

  const fallback = [];
  const attestationsDir = path.resolve(DEFAULT_RELAYER_DATA_DIR, "attestations");
  if (fs.existsSync(attestationsDir)) {
    const files = fs
      .readdirSync(attestationsDir)
      .filter((name) => name.toLowerCase().endsWith(".json"))
      .map((name) => path.join(attestationsDir, name));
    fallback.push(...files);
  }
  if (fallback.length === 0) {
    const legacyDefault = path.resolve(DEFAULT_RELAYER_DATA_DIR, "pending-attestations.json");
    if (fs.existsSync(legacyDefault)) {
      fallback.push(legacyDefault);
    }
  }

  return [...new Set(fallback)];
}

function loadAttestationEntries(files) {
  const entries = [];
  for (const file of files) {
    if (!fs.existsSync(file)) continue;
    const parsed = JSON.parse(fs.readFileSync(file, "utf8"));
    const pending = Array.isArray(parsed.pending) ? parsed.pending : [];
    for (const item of pending) {
      entries.push({
        file,
        relayerId: parsed.relayerId ?? null,
        pending: item,
      });
    }
  }
  return entries;
}

function canonicalPayloadForMintMessage(message) {
  const value = message ?? {};
  return [
    `v=${value.version}`,
    `ethVault=${String(value.ethereumVault ?? "").toLowerCase()}`,
    `bridge=${String(value.opnetBridge ?? "").toLowerCase()}`,
    `ethUser=${String(value.ethereumUser ?? "").toLowerCase()}`,
    `opUser=${String(value.opnetUser ?? value.recipient ?? "").toLowerCase()}`,
    `asset=${value.assetId}`,
    `amount=${value.amount}`,
    `d=${value.direction}`,
    `nonce=${value.nonce}`,
  ].join("|");
}

function loadAttestationEntriesFromDb(dbPath) {
  const db = new DatabaseSync(dbPath, { readOnly: true });
  const rows = db.prepare(`
    SELECT relayer_id, payload_hash_hex, observation_id, message_json, signatures_json, source_json
    FROM mint_attestations
    ORDER BY updated_at DESC
  `).all();
  const entries = [];
  for (const row of rows) {
    try {
      const message = row.message_json ? JSON.parse(row.message_json) : {};
      entries.push({
        file: `sqlite:${dbPath}`,
        relayerId: row.relayer_id ?? null,
        pending: {
          observationId: row.observation_id,
          payloadHashHex: row.payload_hash_hex,
          message,
          canonicalPayload: canonicalPayloadForMintMessage(message),
          signatures: row.signatures_json ? JSON.parse(row.signatures_json) : [],
          source: row.source_json ? JSON.parse(row.source_json) : null,
        },
      });
    } catch {
      // Skip malformed rows.
    }
  }
  return entries;
}

function packCandidate(groupKey, groupEntries, threshold) {
  const [first] = groupEntries;
  const message = first.pending.message ?? {};
  const opnetUser = String(message.opnetUser ?? message.recipient ?? "");
  const ethereumUser = String(message.ethereumUser ?? "");
  if (!opnetUser) {
    throw new Error(`Candidate ${groupKey} missing message.opnetUser/recipient.`);
  }
  if (!ethereumUser) {
    throw new Error(`Candidate ${groupKey} missing message.ethereumUser.`);
  }
  const signaturesBySigner = new Map();
  for (const entry of groupEntries) {
    const signatures = Array.isArray(entry.pending.signatures) ? entry.pending.signatures : [];
    for (const sig of signatures) {
      const signerId = String(sig.signerId ?? "");
      if (!signerId || signaturesBySigner.has(signerId)) continue;
      signaturesBySigner.set(signerId, {
        signerId,
        relayerId: sig.relayerId ?? entry.relayerId ?? null,
        relayIndex: Number(sig.relayIndex),
        signerPubKeyHex: String(sig.signerPubKeyHex ?? ""),
        signatureHex: String(sig.signatureHex ?? ""),
      });
    }
  }

  const unique = [...signaturesBySigner.values()].sort((a, b) => a.relayIndex - b.relayIndex);
  const thresholdSignatures = unique.slice(0, threshold);
  if (thresholdSignatures.length < threshold) {
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

  const signatureBytes = thresholdSignatures.map((entry) => {
    const bytes = hexToBytes(entry.signatureHex);
    if (bytes.length !== RELAY_SIGNATURE_BYTES) {
      throw new Error(
        `Invalid signature size for signerId=${entry.signerId}: ${bytes.length} bytes (expected ${RELAY_SIGNATURE_BYTES}).`,
      );
    }
    return bytes;
  });
  const relayIndexesPacked = new Uint8Array(threshold);
  for (let i = 0; i < thresholdSignatures.length; i++) {
    const relayIndex = thresholdSignatures[i].relayIndex;
    if (!Number.isInteger(relayIndex) || relayIndex < 0 || relayIndex > 255) {
      throw new Error(`Invalid relayIndex=${relayIndex}; expected integer in [0,255].`);
    }
    relayIndexesPacked[i] = relayIndex;
  }
  const relaySignaturesPacked = concatBytes(signatureBytes);

  return {
    payloadHashHex: groupKey,
    ready: true,
    message,
    canonicalPayload: first.pending.canonicalPayload || canonicalPayloadForMintMessage(message),
    observationIds: groupEntries.map((entry) => entry.pending.observationId),
    selectedSignatures: thresholdSignatures.map((entry) => ({
      relayIndex: entry.relayIndex,
      signerId: entry.signerId,
      relayerId: entry.relayerId,
    })),
    mintSubmission: {
      assetId: Number(first.pending.message.assetId),
      attestationVersion: Number(message.version),
      ethereumUser,
      recipient: opnetUser,
      amount: String(message.amount),
      nonce: String(message.nonce),
      relayIndexesPackedHex: bytesToHex(relayIndexesPacked),
      relaySignaturesPackedHex: bytesToHex(relaySignaturesPacked),
    },
  };
}

async function main() {
  if (process.argv.includes("--help") || process.argv.includes("-h")) {
    console.log(`Aggregate Relayer Attestations

Optional:
  RELAYER_ATTESTATION_FILES (comma-separated JSON files to merge)
  RELAYER_ATTESTATION_SOURCE (optional: db|files; default auto)
  RELAYER_API_DB_PATH (SQLite DB path; used when source=db or when file exists)
  RELAYER_THRESHOLD (default: 2)
  AGGREGATOR_OUTPUT_FILE (default: ${DEFAULT_OUTPUT_FILE})

Notes:
  - If RELAYER_ATTESTATION_FILES is omitted, the script scans:
    services/relayer/.data/attestations/*.json
    services/relayer/.data/pending-attestations.json
`);
    return;
  }

  const dbPath = process.env.RELAYER_API_DB_PATH?.trim() || "";
  const sourceMode = (process.env.RELAYER_ATTESTATION_SOURCE?.trim() || "").toLowerCase();
  const threshold = Number(process.env.RELAYER_THRESHOLD || 2);
  if (!Number.isInteger(threshold) || threshold < 1 || threshold > 255) {
    throw new Error("RELAYER_THRESHOLD must be an integer in [1,255].");
  }
  const outputFile = process.env.AGGREGATOR_OUTPUT_FILE?.trim() || DEFAULT_OUTPUT_FILE;
  let inputFiles = [];
  let entries = [];
  if (sourceMode === "db" || (dbPath && fs.existsSync(dbPath) && sourceMode !== "files")) {
    if (!dbPath) {
      throw new Error("RELAYER_API_DB_PATH is required when RELAYER_ATTESTATION_SOURCE=db");
    }
    entries = loadAttestationEntriesFromDb(dbPath);
    inputFiles = [`sqlite:${dbPath}`];
  } else {
    inputFiles = resolveInputFiles();
    if (inputFiles.length === 0) {
      throw new Error("No attestation input files found. Set RELAYER_ATTESTATION_FILES or create .data/attestations/*.json.");
    }
    entries = loadAttestationEntries(inputFiles);
  }

  const groups = new Map();
  for (const entry of entries) {
    const payloadHashHex = String(entry.pending.payloadHashHex ?? "").toLowerCase();
    if (!payloadHashHex) continue;
    const list = groups.get(payloadHashHex) ?? [];
    list.push(entry);
    groups.set(payloadHashHex, list);
  }

  const candidates = [];
  for (const [groupKey, groupEntries] of groups.entries()) {
    candidates.push(packCandidate(groupKey, groupEntries, threshold));
  }

  const output = {
    generatedAt: new Date().toISOString(),
    threshold,
    filesScanned: inputFiles,
    groups: groups.size,
    ready: candidates.filter((entry) => entry.ready).length,
    candidates,
  };
  const disableFileOutput =
    process.env.RELAYER_DISABLE_FILE_OUTPUT?.trim() === "1" ||
    process.env.RELAYER_DISABLE_FILE_OUTPUT?.trim()?.toLowerCase() === "true";
  if (!disableFileOutput) {
    fs.mkdirSync(path.dirname(outputFile), { recursive: true });
    fs.writeFileSync(outputFile, JSON.stringify(output, null, 2));
    console.log(`Wrote ${output.ready}/${output.groups} ready candidates -> ${outputFile}`);
  } else {
    console.log(`File output disabled; generated ${output.ready}/${output.groups} ready candidates in-memory.`);
  }

  try {
    const published = await publishMintCandidatesSnapshot(output, disableFileOutput ? null : outputFile);
    if (published?.skipped) {
      console.log(`[aggregator] API publish skipped: ${published.reason}`);
    } else {
      console.log(`[aggregator] Published mint candidates snapshot to relayer API.`);
    }
  } catch (error) {
    console.error(`[aggregator] API publish failed: ${error instanceof Error ? error.message : String(error)}`);
    if (disableFileOutput) {
      throw error;
    }
  }
}

try {
  await main();
} catch (error) {
  console.error(error);
  process.exit(1);
}
