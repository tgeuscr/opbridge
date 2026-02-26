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
} from './db.mjs';

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const SERVICE_ROOT = path.resolve(SCRIPT_DIR, '..');
const DEFAULT_DB_PATH = path.resolve(SERVICE_ROOT, '.data/relayer-api.sqlite');
const HOST = process.env.RELAYER_API_HOST?.trim() || '0.0.0.0';
const PORT = Number(process.env.RELAYER_API_PORT?.trim() || '8787');

function json(res, statusCode, body) {
  res.writeHead(statusCode, {
    'content-type': 'application/json; charset=utf-8',
    'cache-control': 'no-store',
  });
  res.end(JSON.stringify(body, (_, v) => (typeof v === 'bigint' ? v.toString() : v), 2));
}

function readJsonBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on('data', (chunk) => chunks.push(chunk));
    req.on('end', () => {
      try {
        const raw = Buffer.concat(chunks).toString('utf8');
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

function withMintCandidate(row) {
  if (!row) return null;
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
    sourceFile: row.source_file,
    updatedAt: row.updated_at,
  };
}

function withReleaseCandidate(row) {
  if (!row) return null;
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

export function startHttpServer({ dbPath = DEFAULT_DB_PATH } = {}) {
  const db = openApiDb(dbPath);

  const server = http.createServer((req, res) => {
    const method = req.method || 'GET';
    const pathname = normalizePath(req.url || '/');

    if (method === 'GET' && pathname === '/health') {
      return json(res, 200, {
        ok: true,
        service: 'heptad-relayer-api',
        time: new Date().toISOString(),
        dbPath,
      });
    }

    if (method === 'POST' && pathname === '/ingest/mint-candidates') {
      if (!isAuthorized(req)) return json(res, 401, { ok: false, error: 'Unauthorized' });
      return void readJsonBody(req)
        .then((body) => {
          const candidates = Array.isArray(body?.candidates) ? body.candidates : [];
          const source = body?.sourceFile ? String(body.sourceFile) : null;
          for (const candidate of candidates) {
            if (!candidate?.payloadHashHex) continue;
            upsertMintCandidate(db, candidate, source);
          }
          json(res, 200, {
            ok: true,
            imported: candidates.length,
            sourceFile: source,
            generatedAt: body?.generatedAt ?? null,
          });
        })
        .catch((error) => json(res, 400, { ok: false, error: error instanceof Error ? error.message : String(error) }));
    }

    if (method === 'POST' && pathname === '/ingest/release-candidates') {
      if (!isAuthorized(req)) return json(res, 401, { ok: false, error: 'Unauthorized' });
      return void readJsonBody(req)
        .then((body) => {
          const candidates = Array.isArray(body?.candidates) ? body.candidates : [];
          const source = body?.sourceFile ? String(body.sourceFile) : null;
          for (const candidate of candidates) {
            if (!candidate?.payloadHashHex) continue;
            upsertReleaseCandidate(db, candidate, source);
          }
          json(res, 200, {
            ok: true,
            imported: candidates.length,
            sourceFile: source,
            generatedAt: body?.generatedAt ?? null,
          });
        })
        .catch((error) => json(res, 400, { ok: false, error: error instanceof Error ? error.message : String(error) }));
    }

    if (method === 'POST' && pathname === '/ingest/heartbeat') {
      if (!isAuthorized(req)) return json(res, 401, { ok: false, error: 'Unauthorized' });
      return void readJsonBody(req)
        .then((body) => {
          const relayerName = String(body?.relayerName ?? '').trim();
          const role = String(body?.role ?? '').trim();
          const status = String(body?.status ?? '').trim() || 'ok';
          if (!relayerName || !role) {
            return json(res, 400, { ok: false, error: 'relayerName and role are required' });
          }
          upsertHeartbeat(db, {
            relayerName,
            role,
            status,
            detail: body?.detail ? String(body.detail) : null,
            updatedAt: body?.updatedAt ? String(body.updatedAt) : new Date().toISOString(),
          });
          json(res, 200, { ok: true, relayerName, role, status });
        })
        .catch((error) => json(res, 400, { ok: false, error: error instanceof Error ? error.message : String(error) }));
    }

    if (method === 'POST' && pathname === '/ingest/mint-attestations') {
      if (!isAuthorized(req)) return json(res, 401, { ok: false, error: 'Unauthorized' });
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
          json(res, 200, { ok: true, imported, relayerId, generatedAt });
        })
        .catch((error) => json(res, 400, { ok: false, error: error instanceof Error ? error.message : String(error) }));
    }

    if (method === 'POST' && pathname === '/ingest/release-attestations') {
      if (!isAuthorized(req)) return json(res, 401, { ok: false, error: 'Unauthorized' });
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
          json(res, 200, { ok: true, imported, relayerId, generatedAt });
        })
        .catch((error) => json(res, 400, { ok: false, error: error instanceof Error ? error.message : String(error) }));
    }

    if (method === 'GET' && pathname === '/status') {
      const summary = getApiSummary(db);
      const heartbeats = db.prepare(`
        SELECT relayer_name, role, status, detail, updated_at
        FROM relayer_heartbeats
        ORDER BY relayer_name ASC
      `).all();
      return json(res, 200, {
        ok: true,
        service: 'heptad-relayer-api',
        time: new Date().toISOString(),
        summary,
        relayers: heartbeats.map((row) => ({
          relayerName: row.relayer_name,
          role: row.role,
          status: row.status,
          detail: row.detail,
          updatedAt: row.updated_at,
        })),
      });
    }

    if (method === 'GET' && pathname === '/mint-candidates') {
      const url = new URL(req.url || '/', 'http://localhost');
      const depositId = url.searchParams.get('depositId')?.trim();
      const recipientHash = url.searchParams.get('recipientHash')?.trim()?.toLowerCase();
      const ethereumUser = url.searchParams.get('ethereumUser')?.trim()?.toLowerCase();
      const ready = url.searchParams.get('ready');
      const limitRaw = Number(url.searchParams.get('limit') || '20');
      const limit = Number.isFinite(limitRaw) ? Math.max(1, Math.min(100, Math.trunc(limitRaw))) : 20;

      const clauses = [];
      const params = {};
      if (depositId) {
        clauses.push('deposit_id = @deposit_id');
        params.deposit_id = depositId;
      }
      if (recipientHash) {
        clauses.push('recipient_hash = @recipient_hash');
        params.recipient_hash = recipientHash;
      }
      if (ethereumUser) {
        clauses.push('ethereum_user = @ethereum_user');
        params.ethereum_user = ethereumUser;
      }
      if (ready === '1' || ready === 'true') {
        clauses.push('ready = 1');
      } else if (ready === '0' || ready === 'false') {
        clauses.push('ready = 0');
      }

      const where = clauses.length ? `WHERE ${clauses.join(' AND ')}` : '';
      const rows = db.prepare(`
        SELECT *
        FROM mint_candidates
        ${where}
        ORDER BY CAST(deposit_id AS INTEGER) DESC, updated_at DESC
        LIMIT ${limit}
      `).all(params);
      return json(res, 200, { ok: true, count: rows.length, items: rows.map(withMintCandidate) });
    }

    if (method === 'GET' && pathname.startsWith('/mint-candidates/')) {
      const depositId = decodeURIComponent(pathname.slice('/mint-candidates/'.length));
      const rows = db.prepare(`
        SELECT *
        FROM mint_candidates
        WHERE deposit_id = ?
        ORDER BY updated_at DESC
      `).all(depositId);
      return json(res, 200, { ok: true, depositId, count: rows.length, items: rows.map(withMintCandidate) });
    }

    if (method === 'GET' && pathname.startsWith('/deposits/')) {
      const depositId = decodeURIComponent(pathname.slice('/deposits/'.length));
      const row = db.prepare(`
        SELECT *
        FROM mint_candidates
        WHERE deposit_id = ?
        ORDER BY ready DESC, updated_at DESC
        LIMIT 1
      `).get(depositId);
      if (!row) return json(res, 404, { ok: false, error: 'Not found', depositId });
      return json(res, 200, { ok: true, depositId, mintCandidate: withMintCandidate(row) });
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
      return json(res, 200, {
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
      const url = new URL(req.url || '/', 'http://localhost');
      const withdrawalId = url.searchParams.get('withdrawalId')?.trim();
      const opnetUser = url.searchParams.get('opnetUser')?.trim()?.toLowerCase();
      const recipient = url.searchParams.get('recipient')?.trim()?.toLowerCase();
      const ready = url.searchParams.get('ready');
      const limitRaw = Number(url.searchParams.get('limit') || '20');
      const limit = Number.isFinite(limitRaw) ? Math.max(1, Math.min(100, Math.trunc(limitRaw))) : 20;
      const clauses = [];
      const params = {};
      if (withdrawalId) {
        clauses.push('withdrawal_id = @withdrawal_id');
        params.withdrawal_id = withdrawalId;
      }
      if (opnetUser) {
        clauses.push('opnet_user = @opnet_user');
        params.opnet_user = opnetUser;
      }
      if (recipient) {
        clauses.push('ethereum_recipient = @ethereum_recipient');
        params.ethereum_recipient = recipient;
      }
      if (ready === '1' || ready === 'true') clauses.push('ready = 1');
      if (ready === '0' || ready === 'false') clauses.push('ready = 0');
      const where = clauses.length ? `WHERE ${clauses.join(' AND ')}` : '';
      const rows = db.prepare(`
        SELECT *
        FROM release_candidates
        ${where}
        ORDER BY CAST(withdrawal_id AS INTEGER) DESC, updated_at DESC
        LIMIT ${limit}
      `).all(params);
      return json(res, 200, { ok: true, count: rows.length, items: rows.map(withReleaseCandidate) });
    }

    if (method === 'GET' && pathname.startsWith('/withdrawals/')) {
      const withdrawalId = decodeURIComponent(pathname.slice('/withdrawals/'.length));
      const row = db.prepare(`
        SELECT *
        FROM release_candidates
        WHERE withdrawal_id = ?
        ORDER BY ready DESC, updated_at DESC
        LIMIT 1
      `).get(withdrawalId);
      if (!row) return json(res, 404, { ok: false, error: 'Not found', withdrawalId });
      return json(res, 200, { ok: true, withdrawalId, releaseCandidate: withReleaseCandidate(row) });
    }

    return json(res, 404, {
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
  };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  startHttpServer({ dbPath: process.env.RELAYER_API_DB_PATH?.trim() || DEFAULT_DB_PATH }).listen();
}
