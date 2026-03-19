# Relayer Service

Off-chain signer network responsibilities:

- Observe Ethereum deposits and OP_NET burns
- Canonicalize bridge message payloads
- Produce threshold signatures
- Publish signatures for user retrieval/submission

Current scaffolding:

- Deterministic protocol builder for Ethereum deposit observations
- Canonical payload generation for message hashing/signing
- In-memory idempotency + pending-attestation store
- Runtime methods:
  - `ingestEthereumDeposit`
  - `listPendingAttestations`
  - `snapshot`
- Sepolia poller CLI for `DepositInitiated` event ingestion:
  - `src/sepolia-poller.mjs`
  - `npm run run:sepolia --workspace @opbridge/relayer`
  - mapping loader + log polling + canonical payload + pending attestation output

Still pending:

- real Ethereum/OPNet listeners
- key management + threshold signature aggregation
- persistence and production observability

## Sepolia poller usage

Required env vars:

- `SEPOLIA_RPC_URL` (Alchemy/other Sepolia RPC)

Optional env vars:

- `RELAYER_ID` (default: `relayer-0`)
- `RELAYER_SIGNER_MODE` (default: `kms`; only `kms` is supported)
- `RELAYER_KMS_KEY_ID` or `KMS_OPNET_KEY_ID`
- `RELAYER_INDEX` (required)
- `RELAYER_MAPPING_FILE` (default: `contracts/ethereum/deployments/sepolia-latest.json`)
- `OPNET_BRIDGE_ADDRESS` (required only when mapping/deployment JSON does not contain `opnet.bridgeAddress`)
- `OPNET_BRIDGE_HEX` (32-byte hex bridge address used in attestation hash; required when bridge address is `op...`)
- `ATTESTATION_VERSION` (default: `1`; must match an accepted bridge attestation version)
- `RELAYER_OUTPUT_FILE` (default: `services/relayer/.data/pending-attestations.json`)
- `RELAYER_START_BLOCK` (default: latest-20)
- `RELAYER_MAX_BLOCK_RANGE` (default: `10`, Alchemy free-tier safe)
- `RELAYER_POLL_INTERVAL_MS` (default: `30000`)

Run:

```bash
npm run run:sepolia --workspace @opbridge/relayer
```

KMS signer example:

```bash
RELAYER_SIGNER_MODE=kms
RELAYER_INDEX=0
RELAYER_KMS_KEY_ID=arn:aws:kms:us-east-2:123456789012:key/...
```

Generate the OP_NET relay public config from the same KMS signer set:

```bash
RELAYER_KMS_KEY_IDS=arn:aws:kms:...mldsa-a,arn:aws:kms:...mldsa-b,arn:aws:kms:...mldsa-c \
RELAYER_EVM_KMS_KEY_IDS=arn:aws:kms:...ecdsa-a,arn:aws:kms:...ecdsa-b,arn:aws:kms:...ecdsa-c \
OPNET_NETWORK=testnet \
npm run relay-config:kms --workspace @opbridge/relayer
```

This writes `services/relayer/.data/relay-public-config.json`, which is consumed by `scripts/addpubkeystobridge.sh`.

Current pending attestation output now includes per-signer signatures:

- `signerIds`
- `signatures[]` with:
  - `relayIndex`
  - `relayerId`
  - `signerId`
  - `signerPubKeyHex`
  - `signatureHex`

## AWS KMS compatibility spike

Validate the KMS signing paths directly:

```bash
npm run kms:spike:opnet --workspace @opbridge/relayer
npm run kms:spike:evm --workspace @opbridge/relayer
```

See `docs/kms-spike.md` for required env vars and success criteria.

## Multi-relayer setup (3 independent signers)

Run each relayer in its own process with one key and one relay index:

```bash
SEPOLIA_RPC_URL=... OPNET_BRIDGE_ADDRESS=... OPNET_BRIDGE_HEX=0x... \
RELAYER_ID=relayer-a RELAYER_INDEX=0 \
RELAYER_SIGNER_MODE=kms RELAYER_KMS_KEY_ID=arn:aws:kms:... \
RELAYER_OUTPUT_FILE=services/relayer/.data/attestations/relayer-a.json \
npm run run:sepolia --workspace @opbridge/relayer

SEPOLIA_RPC_URL=... OPNET_BRIDGE_ADDRESS=... OPNET_BRIDGE_HEX=0x... \
RELAYER_ID=relayer-b RELAYER_INDEX=1 \
RELAYER_SIGNER_MODE=kms RELAYER_KMS_KEY_ID=arn:aws:kms:... \
RELAYER_OUTPUT_FILE=services/relayer/.data/attestations/relayer-b.json \
npm run run:sepolia --workspace @opbridge/relayer

SEPOLIA_RPC_URL=... OPNET_BRIDGE_ADDRESS=... OPNET_BRIDGE_HEX=0x... \
RELAYER_ID=relayer-c RELAYER_INDEX=2 \
RELAYER_SIGNER_MODE=kms RELAYER_KMS_KEY_ID=arn:aws:kms:... \
RELAYER_OUTPUT_FILE=services/relayer/.data/attestations/relayer-c.json \
npm run run:sepolia --workspace @opbridge/relayer
```

## Aggregate threshold attestations

CLI:

```bash
npm run aggregate:sepolia --workspace @opbridge/relayer
```

Optional env vars:

- `RELAYER_ATTESTATION_FILES` (comma-separated explicit input files)
- `RELAYER_THRESHOLD` (default: `2`)
- `AGGREGATOR_OUTPUT_FILE` (default: `services/relayer/.data/mint-submission-candidates.json`)

Aggregator output includes threshold-ready `mintSubmission` payloads with:

- `assetId`
- `attestationVersion`
- `ethereumUser`
- `recipient`
- `amount`
- `nonce`
- `relayIndexesPackedHex`
- `relaySignaturesPackedHex`

## Submit OPNet mint from aggregated candidate

CLI:

```bash
npm run submit:opnet --workspace @opbridge/relayer
```

Required env vars:

- Either mnemonic mode:
  - `OPNET_WALLET_MNEMONIC`
- Or private-key mode:
  - `OPNET_WALLET_PRIVATE_KEY` (classical key, hex or WIF)
  - `OPNET_WALLET_QUANTUM_PRIVATE_KEY` (MLDSA private key, hex/base58)

Optional env vars:

- `OPNET_WALLET_MNEMONIC_PASSPHRASE` (default: `''`)
- `OPNET_WALLET_INDEX` (default: `0`)
- `OPNET_WALLET_ACCOUNT` (default: `0`)
- `OPNET_WALLET_IS_CHANGE` (default: `false`)
- `MINT_CANDIDATES_FILE` (default: `services/relayer/.data/mint-submission-candidates.json`)
- `MINT_CANDIDATE_PAYLOAD_HASH` (choose a specific candidate)
- `MINT_CANDIDATE_NONCE` (choose a specific candidate by nonce)
- `OPNET_BRIDGE_ADDRESS` (fallback if missing in candidate)
- `OPNET_RPC_URL` (default derived from `OPNET_NETWORK`: `regtest` -> `https://regtest.opnet.org`, `testnet` -> `https://testnet.opnet.org`)
- `OPNET_NETWORK` (default: `regtest`; `testnet|regtest|mainnet`)
- `OPNET_MAX_SAT_SPEND` (default: `20000`)
- `OPNET_FEE_RATE` (default: `2`)

OPNet scripts log `OP_NET RPC transport: ...` at startup/submission (currently direct only).
