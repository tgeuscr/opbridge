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
  - `npm run run:sepolia --workspace @heptad/relayer`
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
- Single-relayer mode (recommended for multi-instance topology):
  - `RELAYER_PRIVATE_KEY` (single MLDSA private key)
  - `RELAYER_INDEX` (relay index in bridge config, `0..255`)
- `RELAYER_MAPPING_FILE` (default: `contracts/ethereum/deployments/sepolia-latest.json`)
- `OPNET_BRIDGE_ADDRESS` (required only when mapping/deployment JSON does not contain `opnet.bridgeAddress`)
- `OPNET_BRIDGE_HEX` (32-byte hex bridge address used in attestation hash; required when bridge address is `op...`)
- `ATTESTATION_VERSION` (default: `1`; must match an accepted bridge attestation version)
- Relay key inputs (for signing):
  - `RELAYER_KEYS_FILE` (default: `services/relayer/.data/relay-keys.json`)
  - `RELAYER_KEYS_JSON` (inline JSON with `relayPrivateKeys`)
  - `RELAYER_PRIVATE_KEYS` (comma-separated hex keys fallback)
- `RELAYER_OUTPUT_FILE` (default: `services/relayer/.data/pending-attestations.json`)
- `RELAYER_START_BLOCK` (default: latest-20)
- `RELAYER_MAX_BLOCK_RANGE` (default: `10`, Alchemy free-tier safe)
- `RELAYER_POLL_INTERVAL_MS` (default: `8000`)

Run:

```bash
npm run run:sepolia --workspace @heptad/relayer
```

Relay keys JSON shape:

```json
{
  "relayPrivateKeys": [
    "0x..."
  ]
}
```

Current pending attestation output now includes per-signer signatures:

- `signerIds`
- `signatures[]` with:
  - `relayIndex`
  - `relayerId`
  - `signerId`
  - `signerPubKeyHex`
  - `signatureHex`

## Multi-relayer setup (3 independent signers)

Run each relayer in its own process with one key and one relay index:

```bash
SEPOLIA_RPC_URL=... OPNET_BRIDGE_ADDRESS=... OPNET_BRIDGE_HEX=0x... \
RELAYER_ID=relayer-a RELAYER_INDEX=0 RELAYER_PRIVATE_KEY=0x... \
RELAYER_OUTPUT_FILE=services/relayer/.data/attestations/relayer-a.json \
npm run run:sepolia --workspace @heptad/relayer

SEPOLIA_RPC_URL=... OPNET_BRIDGE_ADDRESS=... OPNET_BRIDGE_HEX=0x... \
RELAYER_ID=relayer-b RELAYER_INDEX=1 RELAYER_PRIVATE_KEY=0x... \
RELAYER_OUTPUT_FILE=services/relayer/.data/attestations/relayer-b.json \
npm run run:sepolia --workspace @heptad/relayer

SEPOLIA_RPC_URL=... OPNET_BRIDGE_ADDRESS=... OPNET_BRIDGE_HEX=0x... \
RELAYER_ID=relayer-c RELAYER_INDEX=2 RELAYER_PRIVATE_KEY=0x... \
RELAYER_OUTPUT_FILE=services/relayer/.data/attestations/relayer-c.json \
npm run run:sepolia --workspace @heptad/relayer
```

## Aggregate threshold attestations

CLI:

```bash
npm run aggregate:sepolia --workspace @heptad/relayer
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
npm run submit:opnet --workspace @heptad/relayer
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
- `OPNET_RPC_URL` (default: `https://regtest.opnet.org`)
- `OPNET_NETWORK` (default: `regtest`; `regtest|mainnet`)
- `OPNET_MAX_SAT_SPEND` (default: `20000`)
- `OPNET_FEE_RATE` (default: `2`)
