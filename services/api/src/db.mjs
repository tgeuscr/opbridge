import fs from 'node:fs';
import path from 'node:path';
import { DatabaseSync } from 'node:sqlite';

function ensureDirForFile(filePath) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
}

export function openApiDb(dbPath) {
  ensureDirForFile(dbPath);
  const db = new DatabaseSync(dbPath);
  db.exec(`
    PRAGMA journal_mode = WAL;
    PRAGMA foreign_keys = ON;

    CREATE TABLE IF NOT EXISTS mint_candidates (
      payload_hash_hex TEXT PRIMARY KEY,
      deposit_id TEXT NOT NULL,
      ready INTEGER NOT NULL,
      asset_id INTEGER,
      attestation_version INTEGER,
      ethereum_user TEXT,
      recipient_hash TEXT,
      amount TEXT,
      relay_indexes_packed_hex TEXT,
      relay_signatures_packed_hex TEXT,
      canonical_payload TEXT,
      message_json TEXT NOT NULL,
      mint_submission_json TEXT NOT NULL,
      source_file TEXT,
      updated_at TEXT NOT NULL
    );

    CREATE INDEX IF NOT EXISTS idx_mint_candidates_deposit_id ON mint_candidates(deposit_id);
    CREATE INDEX IF NOT EXISTS idx_mint_candidates_recipient_hash ON mint_candidates(recipient_hash);
    CREATE INDEX IF NOT EXISTS idx_mint_candidates_ethereum_user ON mint_candidates(ethereum_user);

    CREATE TABLE IF NOT EXISTS relayer_heartbeats (
      relayer_name TEXT PRIMARY KEY,
      role TEXT NOT NULL,
      status TEXT NOT NULL,
      detail TEXT,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS mint_attestations (
      observation_id TEXT PRIMARY KEY,
      payload_hash_hex TEXT NOT NULL,
      nonce TEXT,
      asset_id INTEGER,
      ethereum_user TEXT,
      opnet_user TEXT,
      amount TEXT,
      relayer_id TEXT,
      message_json TEXT NOT NULL,
      signatures_json TEXT NOT NULL,
      source_json TEXT,
      batch_generated_at TEXT,
      source_file TEXT,
      updated_at TEXT NOT NULL
    );
    CREATE INDEX IF NOT EXISTS idx_mint_attestations_payload_hash ON mint_attestations(payload_hash_hex);
    CREATE INDEX IF NOT EXISTS idx_mint_attestations_nonce ON mint_attestations(nonce);
    CREATE INDEX IF NOT EXISTS idx_mint_attestations_relayer ON mint_attestations(relayer_id);

    CREATE TABLE IF NOT EXISTS release_attestations (
      observation_id TEXT PRIMARY KEY,
      payload_hash_hex TEXT NOT NULL,
      withdrawal_id TEXT,
      asset_id INTEGER,
      ethereum_user TEXT,
      opnet_user TEXT,
      amount TEXT,
      relayer_id TEXT,
      message_json TEXT NOT NULL,
      signatures_json TEXT NOT NULL,
      source_json TEXT,
      batch_generated_at TEXT,
      source_file TEXT,
      updated_at TEXT NOT NULL
    );
    CREATE INDEX IF NOT EXISTS idx_release_attestations_payload_hash ON release_attestations(payload_hash_hex);
    CREATE INDEX IF NOT EXISTS idx_release_attestations_withdrawal_id ON release_attestations(withdrawal_id);
    CREATE INDEX IF NOT EXISTS idx_release_attestations_relayer ON release_attestations(relayer_id);

    CREATE TABLE IF NOT EXISTS release_candidates (
      payload_hash_hex TEXT PRIMARY KEY,
      withdrawal_id TEXT NOT NULL,
      ready INTEGER NOT NULL,
      asset_id INTEGER,
      attestation_version INTEGER,
      opnet_user TEXT,
      ethereum_recipient TEXT,
      amount TEXT,
      relay_indexes_packed_hex TEXT,
      relay_signatures_packed_hex TEXT,
      canonical_payload TEXT,
      message_json TEXT NOT NULL,
      release_submission_json TEXT NOT NULL,
      source_file TEXT,
      updated_at TEXT NOT NULL
    );

    CREATE INDEX IF NOT EXISTS idx_release_candidates_withdrawal_id ON release_candidates(withdrawal_id);
    CREATE INDEX IF NOT EXISTS idx_release_candidates_opnet_user ON release_candidates(opnet_user);
    CREATE INDEX IF NOT EXISTS idx_release_candidates_eth_recipient ON release_candidates(ethereum_recipient);
  `);
  return db;
}

export function upsertMintCandidate(db, candidate, sourceFile = null) {
  const now = new Date().toISOString();
  const message = candidate?.message ?? {};
  const mintSubmission = candidate?.mintSubmission ?? {};
  const stmt = db.prepare(`
    INSERT INTO mint_candidates (
      payload_hash_hex, deposit_id, ready, asset_id, attestation_version, ethereum_user, recipient_hash, amount,
      relay_indexes_packed_hex, relay_signatures_packed_hex, canonical_payload, message_json, mint_submission_json,
      source_file, updated_at
    ) VALUES (
      @payload_hash_hex, @deposit_id, @ready, @asset_id, @attestation_version, @ethereum_user, @recipient_hash, @amount,
      @relay_indexes_packed_hex, @relay_signatures_packed_hex, @canonical_payload, @message_json, @mint_submission_json,
      @source_file, @updated_at
    )
    ON CONFLICT(payload_hash_hex) DO UPDATE SET
      deposit_id=excluded.deposit_id,
      ready=excluded.ready,
      asset_id=excluded.asset_id,
      attestation_version=excluded.attestation_version,
      ethereum_user=excluded.ethereum_user,
      recipient_hash=excluded.recipient_hash,
      amount=excluded.amount,
      relay_indexes_packed_hex=excluded.relay_indexes_packed_hex,
      relay_signatures_packed_hex=excluded.relay_signatures_packed_hex,
      canonical_payload=excluded.canonical_payload,
      message_json=excluded.message_json,
      mint_submission_json=excluded.mint_submission_json,
      source_file=excluded.source_file,
      updated_at=excluded.updated_at
  `);
  stmt.run({
    payload_hash_hex: String(candidate?.payloadHashHex ?? '').toLowerCase(),
    deposit_id: String(mintSubmission?.nonce ?? message?.nonce ?? ''),
    ready: candidate?.ready ? 1 : 0,
    asset_id: typeof mintSubmission?.assetId === 'number' ? mintSubmission.assetId : (typeof message?.assetId === 'number' ? message.assetId : null),
    attestation_version:
      typeof mintSubmission?.attestationVersion === 'number' ? mintSubmission.attestationVersion : null,
    ethereum_user: mintSubmission?.ethereumUser ? String(mintSubmission.ethereumUser).toLowerCase() : (message?.ethereumUser ? String(message.ethereumUser).toLowerCase() : null),
    recipient_hash: mintSubmission?.recipient ? String(mintSubmission.recipient).toLowerCase() : (message?.opnetUser ? String(message.opnetUser).toLowerCase() : null),
    amount: mintSubmission?.amount != null ? String(mintSubmission.amount) : (message?.amount != null ? String(message.amount) : null),
    relay_indexes_packed_hex: mintSubmission?.relayIndexesPackedHex ? String(mintSubmission.relayIndexesPackedHex).toLowerCase() : null,
    relay_signatures_packed_hex: mintSubmission?.relaySignaturesPackedHex ? String(mintSubmission.relaySignaturesPackedHex).toLowerCase() : null,
    canonical_payload: candidate?.canonicalPayload ? String(candidate.canonicalPayload) : null,
    message_json: JSON.stringify(message),
    mint_submission_json: JSON.stringify(mintSubmission),
    source_file: sourceFile,
    updated_at: now,
  });
}

export function upsertHeartbeat(db, heartbeat) {
  const stmt = db.prepare(`
    INSERT INTO relayer_heartbeats (relayer_name, role, status, detail, updated_at)
    VALUES (@relayer_name, @role, @status, @detail, @updated_at)
    ON CONFLICT(relayer_name) DO UPDATE SET
      role=excluded.role,
      status=excluded.status,
      detail=excluded.detail,
      updated_at=excluded.updated_at
  `);
  stmt.run({
    relayer_name: heartbeat.relayerName,
    role: heartbeat.role,
    status: heartbeat.status,
    detail: heartbeat.detail ?? null,
    updated_at: heartbeat.updatedAt ?? new Date().toISOString(),
  });
}

export function upsertMintAttestation(db, entry, context = {}) {
  const now = new Date().toISOString();
  const message = entry?.message ?? {};
  const signatures = Array.isArray(entry?.signatures) ? entry.signatures : [];
  const source = entry?.source ?? null;
  const stmt = db.prepare(`
    INSERT INTO mint_attestations (
      observation_id, payload_hash_hex, nonce, asset_id, ethereum_user, opnet_user, amount, relayer_id,
      message_json, signatures_json, source_json, batch_generated_at, source_file, updated_at
    ) VALUES (
      @observation_id, @payload_hash_hex, @nonce, @asset_id, @ethereum_user, @opnet_user, @amount, @relayer_id,
      @message_json, @signatures_json, @source_json, @batch_generated_at, @source_file, @updated_at
    )
    ON CONFLICT(observation_id) DO UPDATE SET
      payload_hash_hex=excluded.payload_hash_hex,
      nonce=excluded.nonce,
      asset_id=excluded.asset_id,
      ethereum_user=excluded.ethereum_user,
      opnet_user=excluded.opnet_user,
      amount=excluded.amount,
      relayer_id=excluded.relayer_id,
      message_json=excluded.message_json,
      signatures_json=excluded.signatures_json,
      source_json=excluded.source_json,
      batch_generated_at=excluded.batch_generated_at,
      source_file=excluded.source_file,
      updated_at=excluded.updated_at
  `);
  stmt.run({
    observation_id: String(entry?.observationId ?? ''),
    payload_hash_hex: String(entry?.payloadHashHex ?? '').toLowerCase(),
    nonce: message?.nonce != null ? String(message.nonce) : null,
    asset_id: Number.isInteger(message?.assetId) ? Number(message.assetId) : null,
    ethereum_user: message?.ethereumUser ? String(message.ethereumUser).toLowerCase() : null,
    opnet_user: (message?.opnetUser ?? message?.recipient) ? String(message.opnetUser ?? message.recipient).toLowerCase() : null,
    amount: message?.amount != null ? String(message.amount) : null,
    relayer_id: context.relayerId ? String(context.relayerId) : null,
    message_json: JSON.stringify(message),
    signatures_json: JSON.stringify(signatures),
    source_json: source ? JSON.stringify(source) : null,
    batch_generated_at: context.generatedAt ? String(context.generatedAt) : null,
    source_file: context.sourceFile ? String(context.sourceFile) : null,
    updated_at: now,
  });
}

export function upsertReleaseAttestation(db, entry, context = {}) {
  const now = new Date().toISOString();
  const message = entry?.message ?? {};
  const signatures = Array.isArray(entry?.signatures) ? entry.signatures : [];
  const source = entry?.source ?? null;
  const stmt = db.prepare(`
    INSERT INTO release_attestations (
      observation_id, payload_hash_hex, withdrawal_id, asset_id, ethereum_user, opnet_user, amount, relayer_id,
      message_json, signatures_json, source_json, batch_generated_at, source_file, updated_at
    ) VALUES (
      @observation_id, @payload_hash_hex, @withdrawal_id, @asset_id, @ethereum_user, @opnet_user, @amount, @relayer_id,
      @message_json, @signatures_json, @source_json, @batch_generated_at, @source_file, @updated_at
    )
    ON CONFLICT(observation_id) DO UPDATE SET
      payload_hash_hex=excluded.payload_hash_hex,
      withdrawal_id=excluded.withdrawal_id,
      asset_id=excluded.asset_id,
      ethereum_user=excluded.ethereum_user,
      opnet_user=excluded.opnet_user,
      amount=excluded.amount,
      relayer_id=excluded.relayer_id,
      message_json=excluded.message_json,
      signatures_json=excluded.signatures_json,
      source_json=excluded.source_json,
      batch_generated_at=excluded.batch_generated_at,
      source_file=excluded.source_file,
      updated_at=excluded.updated_at
  `);
  stmt.run({
    observation_id: String(entry?.observationId ?? ''),
    payload_hash_hex: String(entry?.payloadHashHex ?? '').toLowerCase(),
    withdrawal_id: message?.nonce != null ? String(message.nonce) : null,
    asset_id: Number.isInteger(message?.assetId) ? Number(message.assetId) : null,
    ethereum_user: message?.ethereumUser ? String(message.ethereumUser).toLowerCase() : null,
    opnet_user: message?.opnetUser ? String(message.opnetUser).toLowerCase() : null,
    amount: message?.amount != null ? String(message.amount) : null,
    relayer_id: context.relayerId ? String(context.relayerId) : null,
    message_json: JSON.stringify(message),
    signatures_json: JSON.stringify(signatures),
    source_json: source ? JSON.stringify(source) : null,
    batch_generated_at: context.generatedAt ? String(context.generatedAt) : null,
    source_file: context.sourceFile ? String(context.sourceFile) : null,
    updated_at: now,
  });
}

export function upsertReleaseCandidate(db, candidate, sourceFile = null) {
  const now = new Date().toISOString();
  const message = candidate?.message ?? {};
  const releaseSubmission = candidate?.releaseSubmission ?? {};
  const stmt = db.prepare(`
    INSERT INTO release_candidates (
      payload_hash_hex, withdrawal_id, ready, asset_id, attestation_version, opnet_user, ethereum_recipient, amount,
      relay_indexes_packed_hex, relay_signatures_packed_hex, canonical_payload, message_json, release_submission_json,
      source_file, updated_at
    ) VALUES (
      @payload_hash_hex, @withdrawal_id, @ready, @asset_id, @attestation_version, @opnet_user, @ethereum_recipient, @amount,
      @relay_indexes_packed_hex, @relay_signatures_packed_hex, @canonical_payload, @message_json, @release_submission_json,
      @source_file, @updated_at
    )
    ON CONFLICT(payload_hash_hex) DO UPDATE SET
      withdrawal_id=excluded.withdrawal_id,
      ready=excluded.ready,
      asset_id=excluded.asset_id,
      attestation_version=excluded.attestation_version,
      opnet_user=excluded.opnet_user,
      ethereum_recipient=excluded.ethereum_recipient,
      amount=excluded.amount,
      relay_indexes_packed_hex=excluded.relay_indexes_packed_hex,
      relay_signatures_packed_hex=excluded.relay_signatures_packed_hex,
      canonical_payload=excluded.canonical_payload,
      message_json=excluded.message_json,
      release_submission_json=excluded.release_submission_json,
      source_file=excluded.source_file,
      updated_at=excluded.updated_at
  `);
  stmt.run({
    payload_hash_hex: String(candidate?.payloadHashHex ?? '').toLowerCase(),
    withdrawal_id: String(releaseSubmission?.withdrawalId ?? message?.nonce ?? ''),
    ready: candidate?.ready ? 1 : 0,
    asset_id: typeof releaseSubmission?.assetId === 'number' ? releaseSubmission.assetId : (typeof message?.assetId === 'number' ? message.assetId : null),
    attestation_version: typeof releaseSubmission?.attestationVersion === 'number' ? releaseSubmission.attestationVersion : null,
    opnet_user: releaseSubmission?.opnetUser ? String(releaseSubmission.opnetUser).toLowerCase() : (message?.opnetUser ? String(message.opnetUser).toLowerCase() : null),
    ethereum_recipient: releaseSubmission?.recipient ? String(releaseSubmission.recipient).toLowerCase() : (message?.ethereumUser ? String(message.ethereumUser).toLowerCase() : null),
    amount: releaseSubmission?.amount != null ? String(releaseSubmission.amount) : (message?.amount != null ? String(message.amount) : null),
    relay_indexes_packed_hex: releaseSubmission?.relayIndexesPackedHex ? String(releaseSubmission.relayIndexesPackedHex).toLowerCase() : null,
    relay_signatures_packed_hex: releaseSubmission?.relaySignaturesPackedHex ? String(releaseSubmission.relaySignaturesPackedHex).toLowerCase() : null,
    canonical_payload: candidate?.canonicalPayload ? String(candidate.canonicalPayload) : null,
    message_json: JSON.stringify(message),
    release_submission_json: JSON.stringify(releaseSubmission),
    source_file: sourceFile,
    updated_at: now,
  });
}

export function getApiSummary(db) {
  const counts = db.prepare(`
    SELECT
      (SELECT COUNT(*) FROM mint_candidates) AS mint_candidates,
      (SELECT COUNT(*) FROM mint_candidates WHERE ready = 1) AS mint_candidates_ready,
      (SELECT COUNT(*) FROM mint_attestations) AS mint_attestations,
      (SELECT COUNT(*) FROM release_candidates) AS release_candidates,
      (SELECT COUNT(*) FROM release_candidates WHERE ready = 1) AS release_candidates_ready,
      (SELECT COUNT(*) FROM release_attestations) AS release_attestations,
      (SELECT COUNT(*) FROM relayer_heartbeats) AS relayer_heartbeats
  `).get();
  return counts ?? {
    mint_candidates: 0,
    mint_candidates_ready: 0,
    mint_attestations: 0,
    release_candidates: 0,
    release_candidates_ready: 0,
    release_attestations: 0,
    relayer_heartbeats: 0,
  };
}
