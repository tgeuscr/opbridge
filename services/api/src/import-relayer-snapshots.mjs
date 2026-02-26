import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';
import {
  openApiDb,
  upsertMintCandidate,
  upsertHeartbeat,
  upsertReleaseCandidate,
  upsertMintAttestation,
  upsertReleaseAttestation,
} from './db.mjs';

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const SERVICE_ROOT = path.resolve(SCRIPT_DIR, '..');
const DEFAULT_DB_PATH = path.resolve(SERVICE_ROOT, '.data/relayer-api.sqlite');
const DEFAULT_CANDIDATES_FILE = path.resolve(SERVICE_ROOT, '../relayer/.data/mint-submission-candidates.json');
const DEFAULT_RELEASE_CANDIDATES_FILE = path.resolve(SERVICE_ROOT, '../relayer/.data/release-submission-candidates.json');
const DEFAULT_MINT_ATTESTATIONS_DIR = path.resolve(SERVICE_ROOT, '../relayer/.data/attestations');
const DEFAULT_RELEASE_ATTESTATIONS_DIR = path.resolve(SERVICE_ROOT, '../relayer/.data/release-attestations');

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function importMintCandidates(db, filePath) {
  const parsed = readJson(filePath);
  const list = Array.isArray(parsed?.candidates) ? parsed.candidates : [];
  for (const candidate of list) {
    if (!candidate?.payloadHashHex) continue;
    upsertMintCandidate(db, candidate, filePath);
  }
  return list.length;
}

function importReleaseCandidates(db, filePath) {
  const parsed = readJson(filePath);
  const list = Array.isArray(parsed?.candidates) ? parsed.candidates : [];
  for (const candidate of list) {
    if (!candidate?.payloadHashHex) continue;
    upsertReleaseCandidate(db, candidate, filePath);
  }
  return list.length;
}

function importHeartbeatsFromFile(db, filePath) {
  const parsed = readJson(filePath);
  const rows = Array.isArray(parsed) ? parsed : Array.isArray(parsed?.heartbeats) ? parsed.heartbeats : [];
  let count = 0;
  for (const row of rows) {
    if (!row?.relayerName) continue;
    upsertHeartbeat(db, row);
    count += 1;
  }
  return count;
}

function importAttestationDir(db, dirPath, kind) {
  if (!fs.existsSync(dirPath)) return 0;
  const files = fs.readdirSync(dirPath).filter((name) => name.endsWith('.json')).map((name) => path.join(dirPath, name));
  let count = 0;
  for (const file of files) {
    const parsed = readJson(file);
    const pending = Array.isArray(parsed?.pending) ? parsed.pending : [];
    for (const entry of pending) {
      if (!entry?.observationId || !entry?.payloadHashHex) continue;
      if (kind === 'mint') {
        upsertMintAttestation(db, entry, { relayerId: parsed?.relayerId ?? null, generatedAt: parsed?.generatedAt ?? null, sourceFile: file });
      } else {
        upsertReleaseAttestation(db, entry, { relayerId: parsed?.relayerId ?? null, generatedAt: parsed?.generatedAt ?? null, sourceFile: file });
      }
      count += 1;
    }
  }
  return count;
}

function main() {
  const dbPath = process.env.RELAYER_API_DB_PATH?.trim() || DEFAULT_DB_PATH;
  const db = openApiDb(dbPath);

  let importedMintCandidates = 0;
  const candidatesFile = process.env.MINT_CANDIDATES_FILE?.trim() || DEFAULT_CANDIDATES_FILE;
  if (fs.existsSync(candidatesFile)) {
    importedMintCandidates = importMintCandidates(db, candidatesFile);
  }
  let importedReleaseCandidates = 0;
  const releaseCandidatesFile = process.env.RELEASE_CANDIDATES_FILE?.trim() || DEFAULT_RELEASE_CANDIDATES_FILE;
  if (fs.existsSync(releaseCandidatesFile)) {
    importedReleaseCandidates = importReleaseCandidates(db, releaseCandidatesFile);
  }

  let importedHeartbeats = 0;
  const heartbeatFile = process.env.RELAYER_HEARTBEATS_FILE?.trim();
  if (heartbeatFile && fs.existsSync(heartbeatFile)) {
    importedHeartbeats = importHeartbeatsFromFile(db, heartbeatFile);
  }
  const mintAttestationsDir = process.env.MINT_ATTESTATIONS_DIR?.trim() || DEFAULT_MINT_ATTESTATIONS_DIR;
  const releaseAttestationsDir = process.env.RELEASE_ATTESTATIONS_DIR?.trim() || DEFAULT_RELEASE_ATTESTATIONS_DIR;
  const importedMintAttestations = importAttestationDir(db, mintAttestationsDir, 'mint');
  const importedReleaseAttestations = importAttestationDir(db, releaseAttestationsDir, 'release');

  console.log(
    JSON.stringify(
      {
        action: 'relayer-api/import-snapshots',
        dbPath,
        candidatesFile: fs.existsSync(candidatesFile) ? candidatesFile : null,
        importedMintCandidates,
        releaseCandidatesFile: fs.existsSync(releaseCandidatesFile) ? releaseCandidatesFile : null,
        importedReleaseCandidates,
        heartbeatFile: heartbeatFile && fs.existsSync(heartbeatFile) ? heartbeatFile : null,
        importedHeartbeats,
        mintAttestationsDir: fs.existsSync(mintAttestationsDir) ? mintAttestationsDir : null,
        importedMintAttestations,
        releaseAttestationsDir: fs.existsSync(releaseAttestationsDir) ? releaseAttestationsDir : null,
        importedReleaseAttestations,
      },
      null,
      2,
    ),
  );
}

main();
