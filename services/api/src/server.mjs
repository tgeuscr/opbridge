import http from 'node:http';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';
import {
  openApiDb,
  getApiSummary,
  upsertMintCandidate,
  upsertReleaseCandidate,
  upsertHeartbeat,
  upsertMintAttestation,
  upsertReleaseAttestation,
  upsertProcessedMint,
  upsertProcessedRelease,
} from './db.mjs';

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const SERVICE_ROOT = path.resolve(SCRIPT_DIR, '..');
const DEFAULT_DB_PATH = path.resolve(SERVICE_ROOT, '.data/relayer-api.sqlite');
const HOST = process.env.RELAYER_API_HOST?.trim() || '0.0.0.0';
const PORT = Number(process.env.RELAYER_API_PORT?.trim() || '8787');
const CORS_ALLOWED_ORIGINS =
  process.env.RELAYER_API_CORS_ALLOWED_ORIGINS?.trim() ||
  'https://heptad.app,https://www.heptad.app,https://*.vercel.app,http://localhost:5173,http://127.0.0.1:5173';
const CORS_ALLOW_HEADERS = 'content-type, x-relayer-token';
const CORS_ALLOW_METHODS = 'GET, POST, OPTIONS';
const CORS_MAX_AGE_SECONDS = '600';
const ORIGIN_RULES = buildOriginRules(CORS_ALLOWED_ORIGINS);
const HEARTBEAT_STALE_MS = Number(process.env.RELAYER_API_HEARTBEAT_STALE_MS?.trim() || '90000');
const EXPECTED_RELAYER_NAMES = String(process.env.RELAYER_API_EXPECTED_RELAYER_NAMES || '')
  .split(',')
  .map((value) => value.trim())
  .filter(Boolean);
const UTF8_DECODER = new TextDecoder();
function json(req, res, statusCode, body) {
  res.writeHead(statusCode, {
    ...corsHeaders(req),
    'content-type': 'application/json; charset=utf-8',
    'cache-control': 'no-store',
  });
  res.end(JSON.stringify(body, (_, v) => (typeof v === 'bigint' ? v.toString() : v), 2));
}

function empty(req, res, statusCode) {
  res.writeHead(statusCode, {
    ...corsHeaders(req),
    'cache-control': 'no-store',
  });
  res.end();
}

function buildOriginRules(raw) {
  return raw
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean)
    .map((value) => {
      if (value === '*') return { any: true };
      if (!value.includes('*')) return { exact: value };
      const pattern = value
        .split('*')
        .map((part) => part.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
        .join('.*');
      return { regex: new RegExp(`^${pattern}$`) };
    });
}

function isOriginAllowed(origin) {
  if (!origin) return false;
  for (const rule of ORIGIN_RULES) {
    if (rule.any) return true;
    if (rule.exact && rule.exact === origin) return true;
    if (rule.regex && rule.regex.test(origin)) return true;
  }
  return false;
}

function corsHeaders(req) {
  const origin = String(req.headers.origin || '').trim();
  if (!origin || !isOriginAllowed(origin)) return {};
  return {
    'access-control-allow-origin': ORIGIN_RULES.some((rule) => rule.any) ? '*' : origin,
    'access-control-allow-methods': CORS_ALLOW_METHODS,
    'access-control-allow-headers': CORS_ALLOW_HEADERS,
    'access-control-max-age': CORS_MAX_AGE_SECONDS,
    vary: 'Origin',
  };
}

function readJsonBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on('data', (chunk) => chunks.push(chunk));
    req.on('end', () => {
      try {
        const totalLength = chunks.reduce((sum, chunk) => sum + chunk.length, 0);
        const bodyBytes = new Uint8Array(totalLength);
        let offset = 0;
        for (const chunk of chunks) {
          bodyBytes.set(chunk, offset);
          offset += chunk.length;
        }
        const raw = UTF8_DECODER.decode(bodyBytes);
        resolve(raw ? JSON.parse(raw) : {});
      } catch (error) {
        reject(error);
      }
    });
    req.on('error', reject);
  });
}

function isAuthorized(req) {
  const token = process.env.RELAYER_API_WRITE_TOKEN?.trim();
  if (!token) return true;
  const provided = String(req.headers['x-relayer-token'] || '').trim();
  return Boolean(provided) && provided === token;
}

function normalizePath(url) {
  const pathname = new URL(url, 'http://localhost').pathname;
  return pathname.replace(/\/+$/, '') || '/';
}

function withMintCandidate(row, heartbeatHeads = null) {
  if (!row) return null;
  const observationSource = safeJson(row.observation_source_json);
  return {
    payloadHashHex: row.payload_hash_hex,
    depositId: row.deposit_id,
    ready: row.ready === 1,
    assetId: row.asset_id,
    attestationVersion: row.attestation_version,
    ethereumUser: row.ethereum_user,
    recipientHash: row.recipient_hash,
    amount: row.amount,
    relayIndexesPackedHex: row.relay_indexes_packed_hex,
    relaySignaturesPackedHex: row.relay_signatures_packed_hex,
    canonicalPayload: row.canonical_payload,
    message: safeJson(row.message_json),
    mintSubmission: safeJson(row.mint_submission_json),
    processed: row.processed === 1,
    processedTxHash: row.processed_tx_hash ?? null,
    processedAt: row.processed_at ?? null,
    observationSource,
    finality: buildFinality(observationSource, row.ready === 1, row.processed === 1, heartbeatHeads),
    sourceFile: row.source_file,
    updatedAt: row.updated_at,
  };
}

function withReleaseCandidate(row, heartbeatHeads = null) {
  if (!row) return null;
  const observationSource = safeJson(row.observation_source_json);
  return {
    payloadHashHex: row.payload_hash_hex,
    withdrawalId: row.withdrawal_id,
    ready: row.ready === 1,
    assetId: row.asset_id,
    attestationVersion: row.attestation_version,
    opnetUser: row.opnet_user,
    ethereumRecipient: row.ethereum_recipient,
    amount: row.amount,
    relayIndexesPackedHex: row.relay_indexes_packed_hex,
    relaySignaturesPackedHex: row.relay_signatures_packed_hex,
    canonicalPayload: row.canonical_payload,
    message: safeJson(row.message_json),
    releaseSubmission: safeJson(row.release_submission_json),
    processed: row.processed === 1,
    processedTxHash: row.processed_tx_hash ?? null,
    processedAt: row.processed_at ?? null,
    observationSource,
    finality: buildFinality(observationSource, row.ready === 1, row.processed === 1, heartbeatHeads),
    sourceFile: row.source_file,
    updatedAt: row.updated_at,
  };
}

function safeJson(value) {
  try {
    return value ? JSON.parse(value) : null;
  } catch {
    return null;
  }
}

function parseHeartbeatDetail(value) {
  if (typeof value !== 'string' || !value.trim()) return null;
  try {
    const parsed = JSON.parse(value);
    return parsed && typeof parsed === 'object' ? parsed : null;
  } catch {
    return null;
  }
}

function inferSourceChain(detail, role) {
  const explicit = String(detail?.sourceChain ?? '').trim().toLowerCase();
  if (explicit) return explicit;
  const normalizedRole = String(role ?? '').trim().toLowerCase();
  if (normalizedRole === 'sepolia-poller') return 'sepolia';
  if (normalizedRole === 'opnet-burn-poller') return 'testnet';
  return null;
}

function deriveHeartbeatHeads(rows) {
  const now = Date.now();
  const map = new Map();
  for (const row of rows) {
    const updatedAt = row.updated_at ? Date.parse(String(row.updated_at)) : Number.NaN;
    const isStale = !(Number.isFinite(updatedAt) && Math.max(0, now - updatedAt) <= HEARTBEAT_STALE_MS);
    if (isStale) continue;
    const detail = parseHeartbeatDetail(row.detail);
    if (!detail) continue;
    const sourceChain = inferSourceChain(detail, row.role);
    if (!sourceChain) continue;
    const currentHeadRaw = Number(detail.currentHead);
    const finalizedHeadRaw = Number(detail.finalizedHead);
    const currentHead = Number.isInteger(currentHeadRaw) && currentHeadRaw >= 0 ? currentHeadRaw : null;
    const finalizedHead = Number.isInteger(finalizedHeadRaw) && finalizedHeadRaw >= 0 ? finalizedHeadRaw : null;
    const existing = map.get(sourceChain) ?? { currentHead: null, finalizedHead: null };
    map.set(sourceChain, {
      currentHead: currentHead != null ? Math.max(existing.currentHead ?? -1, currentHead) : existing.currentHead,
      finalizedHead: finalizedHead != null ? Math.max(existing.finalizedHead ?? -1, finalizedHead) : existing.finalizedHead,
    });
  }
  return map;
}

function buildFinality(source, ready, processed, heartbeatHeads) {
  if (!source || typeof source !== 'object') return null;
  const requiredConfirmationsRaw = Number(source.requiredConfirmations);
  const requiredConfirmations = Number.isInteger(requiredConfirmationsRaw) && requiredConfirmationsRaw >= 0
    ? requiredConfirmationsRaw
    : null;
  const sourceBlockNumberRaw = Number(source.blockNumber);
  const sourceBlockNumber = Number.isInteger(sourceBlockNumberRaw) && sourceBlockNumberRaw >= 0
    ? sourceBlockNumberRaw
    : null;
  const heartbeatHead = heartbeatHeads?.get?.(String(source.network ?? '').trim().toLowerCase()) ?? null;
  const currentHead = heartbeatHead?.currentHead ?? null;
  const finalizedHead = heartbeatHead?.finalizedHead ?? currentHead;
  const currentConfirmations =
    sourceBlockNumber != null && Number.isInteger(finalizedHead) && finalizedHead >= sourceBlockNumber
      ? finalizedHead - sourceBlockNumber + 1
      : null;
  const remainingConfirmations =
    requiredConfirmations != null && currentConfirmations != null
      ? Math.max(requiredConfirmations - currentConfirmations, 0)
      : null;
  let status = requiredConfirmations != null ? 'confirming' : 'observed';
  if (processed) status = 'processed';
  else if (ready) status = 'ready';
  return {
    status,
    sourceChain: source.network ?? null,
    sourceBlockNumber,
    sourceBlockHash: source.blockHash ?? null,
    sourceTxHash: source.txHash ?? null,
    sourceLogIndex: source.logIndex ?? source.eventIndex ?? null,
    observedAt: source.observedAt ?? null,
    requiredConfirmations,
    currentConfirmations,
    remainingConfirmations,
  };
}

function summarizeRelayers(rows) {
  const now = Date.now();
  const relayers = rows.map((row) => {
    const updatedAt = row.updated_at ? Date.parse(String(row.updated_at)) : Number.NaN;
    const ageMs = Number.isFinite(updatedAt) ? Math.max(0, now - updatedAt) : null;
    const isStale = ageMs != null ? ageMs > HEARTBEAT_STALE_MS : true;
    const status = String(row.status || 'unknown');
    return {
      relayerName: row.relayer_name,
      role: row.role,
      status,
      detail: row.detail,
      updatedAt: row.updated_at,
      ageMs,
      isStale,
      derivedStatus: status === 'ok' && !isStale ? 'ok' : isStale ? 'stale' : status,
    };
  });

  const presentNames = new Set(relayers.map((row) => row.relayerName));
  const missingExpected = EXPECTED_RELAYER_NAMES.filter((name) => !presentNames.has(name));
  const counts = {
    ok: relayers.filter((row) => row.derivedStatus === 'ok').length,
    stale: relayers.filter((row) => row.derivedStatus === 'stale').length,
    error: relayers.filter((row) => row.derivedStatus !== 'ok' && row.derivedStatus !== 'stale').length,
    expected: EXPECTED_RELAYER_NAMES.length,
    missing: missingExpected.length,
  };

  return {
    relayers,
    counts,
    missingExpected,
    heartbeatStaleMs: HEARTBEAT_STALE_MS,
  };
}

export function startHttpServer({ dbPath = DEFAULT_DB_PATH } = {}) {
  const db = openApiDb(dbPath);

  const server = http.createServer((req, res) => {
    const method = req.method || 'GET';
    const pathname = normalizePath(req.url || '/');

    if (method === 'OPTIONS') {
      return empty(req, res, 204);
    }

    if (method === 'GET' && pathname === '/health') {
      return json(req, res, 200, {
        ok: true,
        service: 'heptad-relayer-api',
        time: new Date().toISOString(),
        dbPath,
      });
    }

    if (method === 'POST' && pathname === '/ingest/mint-candidates') {
      if (!isAuthorized(req)) return json(req, res, 401, { ok: false, error: 'Unauthorized' });
      return void readJsonBody(req)
        .then((body) => {
          const candidates = Array.isArray(body?.candidates) ? body.candidates : [];
          const source = body?.sourceFile ? String(body.sourceFile) : null;
          for (const candidate of candidates) {
            if (!candidate?.payloadHashHex) continue;
            upsertMintCandidate(db, candidate, source);
          }
          json(req, res, 200, {
            ok: true,
            imported: candidates.length,
            sourceFile: source,
            generatedAt: body?.generatedAt ?? null,
          });
        })
        .catch((error) => json(req, res, 400, { ok: false, error: error instanceof Error ? error.message : String(error) }));
    }

    if (method === 'POST' && pathname === '/ingest/release-candidates') {
      if (!isAuthorized(req)) return json(req, res, 401, { ok: false, error: 'Unauthorized' });
      return void readJsonBody(req)
        .then((body) => {
          const candidates = Array.isArray(body?.candidates) ? body.candidates : [];
          const source = body?.sourceFile ? String(body.sourceFile) : null;
          for (const candidate of candidates) {
            if (!candidate?.payloadHashHex) continue;
            upsertReleaseCandidate(db, candidate, source);
          }
          json(req, res, 200, {
            ok: true,
            imported: candidates.length,
            sourceFile: source,
            generatedAt: body?.generatedAt ?? null,
          });
        })
        .catch((error) => json(req, res, 400, { ok: false, error: error instanceof Error ? error.message : String(error) }));
    }

    if (method === 'POST' && pathname === '/ingest/heartbeat') {
      if (!isAuthorized(req)) return json(req, res, 401, { ok: false, error: 'Unauthorized' });
      return void readJsonBody(req)
        .then((body) => {
          const relayerName = String(body?.relayerName ?? '').trim();
          const role = String(body?.role ?? '').trim();
          const status = String(body?.status ?? '').trim() || 'ok';
          if (!relayerName || !role) {
            return json(req, res, 400, { ok: false, error: 'relayerName and role are required' });
          }
          upsertHeartbeat(db, {
            relayerName,
            role,
            status,
            detail:
              typeof body?.detail === 'string'
                ? body.detail
                : body?.detail != null
                  ? JSON.stringify(body.detail)
                  : null,
            updatedAt: body?.updatedAt ? String(body.updatedAt) : new Date().toISOString(),
          });
          json(req, res, 200, { ok: true, relayerName, role, status });
        })
        .catch((error) => json(req, res, 400, { ok: false, error: error instanceof Error ? error.message : String(error) }));
    }

    if (method === 'POST' && pathname === '/ingest/mint-attestations') {
      if (!isAuthorized(req)) return json(req, res, 401, { ok: false, error: 'Unauthorized' });
      return void readJsonBody(req)
        .then((body) => {
          const pending = Array.isArray(body?.pending) ? body.pending : [];
          const relayerId = body?.relayerId ? String(body.relayerId) : null;
          const generatedAt = body?.generatedAt ? String(body.generatedAt) : null;
          const sourceFile = body?.sourceFile ? String(body.sourceFile) : null;
          let imported = 0;
          for (const entry of pending) {
            if (!entry?.observationId || !entry?.payloadHashHex) continue;
            upsertMintAttestation(db, entry, { relayerId, generatedAt, sourceFile });
            imported += 1;
          }
          json(req, res, 200, { ok: true, imported, relayerId, generatedAt });
        })
        .catch((error) => json(req, res, 400, { ok: false, error: error instanceof Error ? error.message : String(error) }));
    }

    if (method === 'POST' && pathname === '/ingest/release-attestations') {
      if (!isAuthorized(req)) return json(req, res, 401, { ok: false, error: 'Unauthorized' });
      return void readJsonBody(req)
        .then((body) => {
          const pending = Array.isArray(body?.pending) ? body.pending : [];
          const relayerId = body?.relayerId ? String(body.relayerId) : null;
          const generatedAt = body?.generatedAt ? String(body.generatedAt) : null;
          const sourceFile = body?.sourceFile ? String(body.sourceFile) : null;
          let imported = 0;
          for (const entry of pending) {
            if (!entry?.observationId || !entry?.payloadHashHex) continue;
            upsertReleaseAttestation(db, entry, { relayerId, generatedAt, sourceFile });
            imported += 1;
          }
          json(req, res, 200, { ok: true, imported, relayerId, generatedAt });
        })
        .catch((error) => json(req, res, 400, { ok: false, error: error instanceof Error ? error.message : String(error) }));
    }

    if (method === 'POST' && pathname === '/ingest/processed-mints') {
      if (!isAuthorized(req)) return json(req, res, 401, { ok: false, error: 'Unauthorized' });
      return void readJsonBody(req)
        .then((body) => {
          const processed = Array.isArray(body?.processed) ? body.processed : [];
          const source = body?.sourceFile ? String(body.sourceFile) : null;
          let imported = 0;
          for (const item of processed) {
            if (upsertProcessedMint(db, item, source)) imported += 1;
          }
          json(req, res, 200, { ok: true, imported, sourceFile: source });
        })
        .catch((error) => json(req, res, 400, { ok: false, error: error instanceof Error ? error.message : String(error) }));
    }

    if (method === 'POST' && pathname === '/ingest/processed-releases') {
      if (!isAuthorized(req)) return json(req, res, 401, { ok: false, error: 'Unauthorized' });
      return void readJsonBody(req)
        .then((body) => {
          const processed = Array.isArray(body?.processed) ? body.processed : [];
          const source = body?.sourceFile ? String(body.sourceFile) : null;
          let imported = 0;
          for (const item of processed) {
            if (upsertProcessedRelease(db, item, source)) imported += 1;
          }
          json(req, res, 200, { ok: true, imported, sourceFile: source });
        })
        .catch((error) => json(req, res, 400, { ok: false, error: error instanceof Error ? error.message : String(error) }));
    }

    if (method === 'GET' && pathname === '/status') {
      const summary = getApiSummary(db);
      const heartbeats = db.prepare(`
        SELECT relayer_name, role, status, detail, updated_at
        FROM relayer_heartbeats
        ORDER BY relayer_name ASC
      `).all();
      const relayerSummary = summarizeRelayers(heartbeats);
      return json(req, res, 200, {
        ok: true,
        service: 'heptad-relayer-api',
        time: new Date().toISOString(),
        summary,
        relayers: relayerSummary.relayers,
        relayerHealth: relayerSummary.counts,
        missingExpectedRelayers: relayerSummary.missingExpected,
        heartbeatStaleMs: relayerSummary.heartbeatStaleMs,
      });
    }

    if (method === 'GET' && pathname === '/mint-candidates') {
      const heartbeatHeads = deriveHeartbeatHeads(
        db.prepare(`
          SELECT relayer_name, role, status, detail, updated_at
          FROM relayer_heartbeats
        `).all(),
      );
      const url = new URL(req.url || '/', 'http://localhost');
      const depositId = url.searchParams.get('depositId')?.trim();
      const recipientHash = url.searchParams.get('recipientHash')?.trim()?.toLowerCase();
      const ethereumUser = url.searchParams.get('ethereumUser')?.trim()?.toLowerCase();
      const ready = url.searchParams.get('ready');
      const processed = url.searchParams.get('processed');
      const limitRaw = Number(url.searchParams.get('limit') || '20');
      const limit = Number.isFinite(limitRaw) ? Math.max(1, Math.min(100, Math.trunc(limitRaw))) : 20;

      const clauses = [];
      const params = {};
      if (depositId) {
        clauses.push('mc.deposit_id = @deposit_id');
        params.deposit_id = depositId;
      }
      if (recipientHash) {
        clauses.push('mc.recipient_hash = @recipient_hash');
        params.recipient_hash = recipientHash;
      }
      if (ethereumUser) {
        clauses.push('mc.ethereum_user = @ethereum_user');
        params.ethereum_user = ethereumUser;
      }
      if (ready === '1' || ready === 'true') {
        clauses.push('mc.ready = 1');
      } else if (ready === '0' || ready === 'false') {
        clauses.push('mc.ready = 0');
      }
      if (processed === '1' || processed === 'true') {
        clauses.push('pm.deposit_id IS NOT NULL');
      } else if (processed === '0' || processed === 'false') {
        clauses.push('pm.deposit_id IS NULL');
      }

      const where = clauses.length ? `WHERE ${clauses.join(' AND ')}` : '';
      const rows = db.prepare(`
        SELECT
          mc.*,
          (
            SELECT ma.source_json
            FROM mint_attestations ma
            WHERE ma.nonce = mc.deposit_id
            ORDER BY ma.updated_at DESC
            LIMIT 1
          ) AS observation_source_json,
          CASE WHEN pm.deposit_id IS NULL THEN 0 ELSE 1 END AS processed,
          pm.tx_hash AS processed_tx_hash,
          pm.updated_at AS processed_at
        FROM mint_candidates mc
        LEFT JOIN processed_mints pm ON pm.deposit_id = mc.deposit_id
        ${where}
        ORDER BY CAST(mc.deposit_id AS INTEGER) DESC, mc.updated_at DESC
        LIMIT ${limit}
      `).all(params);
      return json(req, res, 200, {
        ok: true,
        count: rows.length,
        items: rows.map((row) => withMintCandidate(row, heartbeatHeads)),
      });
    }

    if (method === 'GET' && pathname.startsWith('/mint-candidates/')) {
      const heartbeatHeads = deriveHeartbeatHeads(
        db.prepare(`
          SELECT relayer_name, role, status, detail, updated_at
          FROM relayer_heartbeats
        `).all(),
      );
      const depositId = decodeURIComponent(pathname.slice('/mint-candidates/'.length));
      const rows = db.prepare(`
        SELECT
          mc.*,
          (
            SELECT ma.source_json
            FROM mint_attestations ma
            WHERE ma.nonce = mc.deposit_id
            ORDER BY ma.updated_at DESC
            LIMIT 1
          ) AS observation_source_json,
          CASE WHEN pm.deposit_id IS NULL THEN 0 ELSE 1 END AS processed,
          pm.tx_hash AS processed_tx_hash,
          pm.updated_at AS processed_at
        FROM mint_candidates mc
        LEFT JOIN processed_mints pm ON pm.deposit_id = mc.deposit_id
        WHERE mc.deposit_id = ?
        ORDER BY mc.updated_at DESC
      `).all(depositId);
      return json(req, res, 200, {
        ok: true,
        depositId,
        count: rows.length,
        items: rows.map((row) => withMintCandidate(row, heartbeatHeads)),
      });
    }

    if (method === 'GET' && pathname.startsWith('/deposits/')) {
      const heartbeatHeads = deriveHeartbeatHeads(
        db.prepare(`
          SELECT relayer_name, role, status, detail, updated_at
          FROM relayer_heartbeats
        `).all(),
      );
      const depositId = decodeURIComponent(pathname.slice('/deposits/'.length));
      const row = db.prepare(`
        SELECT
          mc.*,
          (
            SELECT ma.source_json
            FROM mint_attestations ma
            WHERE ma.nonce = mc.deposit_id
            ORDER BY ma.updated_at DESC
            LIMIT 1
          ) AS observation_source_json,
          CASE WHEN pm.deposit_id IS NULL THEN 0 ELSE 1 END AS processed,
          pm.tx_hash AS processed_tx_hash,
          pm.updated_at AS processed_at
        FROM mint_candidates mc
        LEFT JOIN processed_mints pm ON pm.deposit_id = mc.deposit_id
        WHERE mc.deposit_id = ?
        ORDER BY mc.ready DESC, mc.updated_at DESC
        LIMIT 1
      `).get(depositId);
      if (!row) return json(req, res, 404, { ok: false, error: 'Not found', depositId });
      return json(req, res, 200, { ok: true, depositId, mintCandidate: withMintCandidate(row, heartbeatHeads) });
    }

    if (method === 'GET' && pathname === '/mint-attestations') {
      const url = new URL(req.url || '/', 'http://localhost');
      const payloadHashHex = url.searchParams.get('payloadHashHex')?.trim()?.toLowerCase();
      const depositId = url.searchParams.get('depositId')?.trim();
      const limitRaw = Number(url.searchParams.get('limit') || '50');
      const limit = Number.isFinite(limitRaw) ? Math.max(1, Math.min(500, Math.trunc(limitRaw))) : 50;
      const clauses = [];
      const params = {};
      if (payloadHashHex) {
        clauses.push('payload_hash_hex = @payload_hash_hex');
        params.payload_hash_hex = payloadHashHex;
      }
      if (depositId) {
        clauses.push('nonce = @nonce');
        params.nonce = depositId;
      }
      const where = clauses.length ? `WHERE ${clauses.join(' AND ')}` : '';
      const rows = db.prepare(`
        SELECT observation_id, payload_hash_hex, nonce, asset_id, ethereum_user, opnet_user, amount, relayer_id, message_json, signatures_json, source_json, batch_generated_at, source_file, updated_at
        FROM mint_attestations
        ${where}
        ORDER BY updated_at DESC
        LIMIT ${limit}
      `).all(params);
      return json(req, res, 200, {
        ok: true,
        count: rows.length,
        items: rows.map((row) => ({
          observationId: row.observation_id,
          payloadHashHex: row.payload_hash_hex,
          depositId: row.nonce,
          assetId: row.asset_id,
          ethereumUser: row.ethereum_user,
          opnetUser: row.opnet_user,
          amount: row.amount,
          relayerId: row.relayer_id,
          message: safeJson(row.message_json),
          signatures: safeJson(row.signatures_json),
          source: safeJson(row.source_json),
          generatedAt: row.batch_generated_at,
          sourceFile: row.source_file,
          updatedAt: row.updated_at,
        })),
      });
    }

    if (method === 'GET' && pathname === '/release-candidates') {
      const heartbeatHeads = deriveHeartbeatHeads(
        db.prepare(`
          SELECT relayer_name, role, status, detail, updated_at
          FROM relayer_heartbeats
        `).all(),
      );
      const url = new URL(req.url || '/', 'http://localhost');
      const withdrawalId = url.searchParams.get('withdrawalId')?.trim();
      const opnetUser = url.searchParams.get('opnetUser')?.trim()?.toLowerCase();
      const recipient = url.searchParams.get('recipient')?.trim()?.toLowerCase();
      const ready = url.searchParams.get('ready');
      const processed = url.searchParams.get('processed');
      const limitRaw = Number(url.searchParams.get('limit') || '20');
      const limit = Number.isFinite(limitRaw) ? Math.max(1, Math.min(100, Math.trunc(limitRaw))) : 20;
      const clauses = [];
      const params = {};
      if (withdrawalId) {
        clauses.push('rc.withdrawal_id = @withdrawal_id');
        params.withdrawal_id = withdrawalId;
      }
      if (opnetUser) {
        clauses.push('rc.opnet_user = @opnet_user');
        params.opnet_user = opnetUser;
      }
      if (recipient) {
        clauses.push('rc.ethereum_recipient = @ethereum_recipient');
        params.ethereum_recipient = recipient;
      }
      if (ready === '1' || ready === 'true') clauses.push('rc.ready = 1');
      if (ready === '0' || ready === 'false') clauses.push('rc.ready = 0');
      if (processed === '1' || processed === 'true') clauses.push('pr.withdrawal_id IS NOT NULL');
      if (processed === '0' || processed === 'false') clauses.push('pr.withdrawal_id IS NULL');
      const where = clauses.length ? `WHERE ${clauses.join(' AND ')}` : '';
      const rows = db.prepare(`
        SELECT
          rc.*,
          (
            SELECT ra.source_json
            FROM release_attestations ra
            WHERE ra.withdrawal_id = rc.withdrawal_id
            ORDER BY ra.updated_at DESC
            LIMIT 1
          ) AS observation_source_json,
          CASE WHEN pr.withdrawal_id IS NULL THEN 0 ELSE 1 END AS processed,
          pr.tx_hash AS processed_tx_hash,
          pr.updated_at AS processed_at
        FROM release_candidates rc
        LEFT JOIN processed_releases pr ON pr.withdrawal_id = rc.withdrawal_id
        ${where}
        ORDER BY CAST(rc.withdrawal_id AS INTEGER) DESC, rc.updated_at DESC
        LIMIT ${limit}
      `).all(params);
      return json(req, res, 200, {
        ok: true,
        count: rows.length,
        items: rows.map((row) => withReleaseCandidate(row, heartbeatHeads)),
      });
    }

    if (method === 'GET' && pathname.startsWith('/withdrawals/')) {
      const heartbeatHeads = deriveHeartbeatHeads(
        db.prepare(`
          SELECT relayer_name, role, status, detail, updated_at
          FROM relayer_heartbeats
        `).all(),
      );
      const withdrawalId = decodeURIComponent(pathname.slice('/withdrawals/'.length));
      const row = db.prepare(`
        SELECT
          rc.*,
          (
            SELECT ra.source_json
            FROM release_attestations ra
            WHERE ra.withdrawal_id = rc.withdrawal_id
            ORDER BY ra.updated_at DESC
            LIMIT 1
          ) AS observation_source_json,
          CASE WHEN pr.withdrawal_id IS NULL THEN 0 ELSE 1 END AS processed,
          pr.tx_hash AS processed_tx_hash,
          pr.updated_at AS processed_at
        FROM release_candidates rc
        LEFT JOIN processed_releases pr ON pr.withdrawal_id = rc.withdrawal_id
        WHERE rc.withdrawal_id = ?
        ORDER BY rc.ready DESC, rc.updated_at DESC
        LIMIT 1
      `).get(withdrawalId);
      if (!row) return json(req, res, 404, { ok: false, error: 'Not found', withdrawalId });
      return json(req, res, 200, {
        ok: true,
        withdrawalId,
        releaseCandidate: withReleaseCandidate(row, heartbeatHeads),
      });
    }

    return json(req, res, 404, {
      ok: false,
      error: 'Not found',
      endpoints: [
        'GET /health',
        'GET /status',
        'GET /mint-candidates',
        'GET /mint-candidates/:depositId',
        'GET /deposits/:depositId',
        'GET /mint-attestations',
        'GET /release-candidates',
        'GET /withdrawals/:withdrawalId',
        'POST /ingest/mint-attestations',
        'POST /ingest/release-attestations',
        'POST /ingest/mint-candidates',
        'POST /ingest/release-candidates',
        'POST /ingest/processed-mints',
        'POST /ingest/processed-releases',
        'POST /ingest/heartbeat',
      ],
    });
  });

  return {
    server,
    listen() {
      server.listen(PORT, HOST, () => {
        // eslint-disable-next-line no-console
        console.log(
          JSON.stringify(
            {
              action: 'relayer-api/start',
              host: HOST,
              port: PORT,
              dbPath,
            },
            null,
            2,
          ),
        );
      });
    },
    close(callback) {
      return server.close(callback);
    },
  };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  startHttpServer({ dbPath: process.env.RELAYER_API_DB_PATH?.trim() || DEFAULT_DB_PATH }).listen();
}
