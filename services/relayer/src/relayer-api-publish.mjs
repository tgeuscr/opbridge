import process from 'node:process';

function normalizeBaseUrl() {
  const raw = process.env.RELAYER_API_URL?.trim();
  if (!raw) return null;
  return raw.replace(/\/+$/, '');
}

async function postJson(pathname, body) {
  const baseUrl = normalizeBaseUrl();
  if (!baseUrl) return { skipped: true, reason: 'RELAYER_API_URL not set' };
  const token = process.env.RELAYER_API_WRITE_TOKEN?.trim();
  const response = await fetch(`${baseUrl}${pathname}`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      ...(token ? { 'x-relayer-token': token } : {}),
    },
    body: JSON.stringify(body),
  });
  const text = await response.text();
  let parsed = null;
  try {
    parsed = text ? JSON.parse(text) : null;
  } catch {
    parsed = text;
  }
  if (!response.ok) {
    throw new Error(`POST ${pathname} failed: HTTP ${response.status} ${typeof parsed === 'string' ? parsed : JSON.stringify(parsed)}`);
  }
  return { skipped: false, response: parsed };
}

export async function publishMintCandidatesSnapshot(snapshot, sourceFile) {
  return postJson('/ingest/mint-candidates', {
    ...snapshot,
    sourceFile: sourceFile ?? null,
  });
}

export async function publishReleaseCandidatesSnapshot(snapshot, sourceFile) {
  return postJson('/ingest/release-candidates', {
    ...snapshot,
    sourceFile: sourceFile ?? null,
  });
}

export async function publishMintAttestationsSnapshot(snapshot, sourceFile) {
  return postJson('/ingest/mint-attestations', {
    ...snapshot,
    sourceFile: sourceFile ?? null,
  });
}

export async function publishReleaseAttestationsSnapshot(snapshot, sourceFile) {
  return postJson('/ingest/release-attestations', {
    ...snapshot,
    sourceFile: sourceFile ?? null,
  });
}

export async function publishProcessedMintsSnapshot(snapshot, sourceFile) {
  return postJson('/ingest/processed-mints', {
    ...snapshot,
    sourceFile: sourceFile ?? null,
  });
}

export async function publishProcessedReleasesSnapshot(snapshot, sourceFile) {
  return postJson('/ingest/processed-releases', {
    ...snapshot,
    sourceFile: sourceFile ?? null,
  });
}

export async function publishRelayerHeartbeat({ relayerName, role, status = 'ok', detail }) {
  return postJson('/ingest/heartbeat', {
    relayerName,
    role,
    status,
    detail: detail ?? null,
    updatedAt: new Date().toISOString(),
  });
}
