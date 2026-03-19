# API Service

Optional bridge API/indexer for:

- Relay signature aggregation endpoints
- Bridge status and history APIs
- Health checks and observability

Current scaffolding:

- SQLite-backed mint candidate registry (Node `node:sqlite`)
- Minimal HTTP server endpoints:
  - `GET /health`
  - `GET /status`
  - `GET /mint-candidates`
  - `GET /mint-candidates/:depositId`
  - `GET /deposits/:depositId`
  - `GET /mint-attestations`
  - `GET /release-candidates`
  - `GET /withdrawals/:withdrawalId`
  - `POST /ingest/mint-attestations`
  - `POST /ingest/release-attestations`
  - `POST /ingest/mint-candidates`
  - `POST /ingest/release-candidates`
  - `POST /ingest/heartbeat`
- Snapshot import command for relayer candidate files:
  - `npm run import:relayer-snapshots --workspace @opbridge/api`

Environment variables:

- `RELAYER_API_PORT` (default `8787`)
- `RELAYER_API_HOST` (default `0.0.0.0`)
- `RELAYER_API_DB_PATH` (default `services/api/.data/relayer-api.sqlite`)
- `RELAYER_API_CORS_ALLOWED_ORIGINS` (comma-separated list, supports `*` wildcards, default allows `testnet.opbridge.app`, `*.vercel.app`, and local Vite origins)
- `RELAYER_API_WRITE_TOKEN` (optional token required for write/ingest endpoints via `x-relayer-token`)
- `RELAYER_API_WRITE_TOKEN_SECRET_REF` (optional secret ref; used when `RELAYER_API_WRITE_TOKEN` is unset)
- `RELAYER_API_HEARTBEAT_STALE_MS` (default `90000`; heartbeats older than this are marked stale in `/status`)
- `RELAYER_API_EXPECTED_RELAYER_NAMES` (optional comma-separated relayer names to flag missing workers in `/status`)
- `MINT_CANDIDATES_FILE` (for import command)
- `RELAYER_HEARTBEATS_FILE` (optional import command input)

## Production exposure pattern

Do not expose SQLite directly. Frontend should call HTTP endpoints only.

Recommended:
- run API on EC2 bound to `127.0.0.1:8787`
- expose `https://api.testnet.opbridge.app` with Nginx reverse proxy
- keep CORS allowlist limited to Vercel/site domains
- keep write tokens and provider credentials in AWS Secrets Manager / SSM and reference them with `*_SECRET_REF`

Still pending:

- authenticated write endpoints for relayers
- release (burn -> Ethereum) indexing tables/endpoints
- pagination/cursors and richer status summaries
