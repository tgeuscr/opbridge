# API Service

Optional bridge API/indexer for:

- Relay signature aggregation endpoints
- Bridge status and history APIs
- Health checks and observability

Current scaffolding:

- In-memory signature bundle registry
- Runtime methods:
  - `upsertSignatureBundle`
  - `getSignatureBundle`
  - `health`

Still pending:

- HTTP server wiring
- auth/rate-limit policy
- persistent storage and pagination
