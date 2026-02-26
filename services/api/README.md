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
- Snapshot import command for relayer candidate files:
  - `npm run import:relayer-snapshots --workspace @heptad/api`

Environment variables:

- `RELAYER_API_PORT` (default `8787`)
- `RELAYER_API_HOST` (default `0.0.0.0`)
- `RELAYER_API_DB_PATH` (default `services/api/.data/relayer-api.sqlite`)
- `MINT_CANDIDATES_FILE` (for import command)
- `RELAYER_HEARTBEATS_FILE` (optional import command input)

Still pending:

- authenticated write endpoints for relayers
- release (burn -> Ethereum) indexing tables/endpoints
- pagination/cursors and richer status summaries
