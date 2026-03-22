# OP_BRIDGE Architecture Overview

## Purpose

OP_BRIDGE is a bi-directional asset bridge between Ethereum and OP_NET.

Current live environment:

- Ethereum Sepolia
- OP_NET testnet

Planned production environment:

- Ethereum mainnet
- OP_NET mainnet

Supported asset set:

- `USDT`
- `WBTC`
- `WETH`
- `PAXG`

## High-Level Components

### 1. Ethereum vault

Location:

- [`contracts/ethereum`](../contracts/ethereum)

Responsibilities:

- custody ERC-20 assets on Ethereum
- accept deposits via `depositERC20(...)`
- release assets for OP_NET-originated withdrawals via `releaseWithRelaySignatures(...)`
- enforce owner controls:
  - pause / unpause
  - fee bps
  - fee recipient
  - fee whitelist
  - configured assets
  - release relay signers and threshold

### 2. OP_NET bridge

Location:

- [`contracts/opnet`](../contracts/opnet)

Responsibilities:

- mint wrapped assets after threshold Ethereum deposit attestations
- burn wrapped assets on withdrawal requests
- enforce OP_NET-side pause and relay configuration
- bind to the Ethereum vault address and attestation versioning

### 3. Relayers

Location:

- [`services/relayer`](../services/relayer)

There are two relayer directions:

- Ethereum deposit pollers:
  - watch `DepositInitiated`
  - canonicalize deposit payloads
  - sign mint attestations with ML-DSA keys
- OP_NET burn pollers:
  - watch burn requests / finalized mint state
  - canonicalize release payloads
  - sign Ethereum release attestations with ECDSA keys

The production model is independent relayers with fixed relay indexes and a threshold, currently `2-of-3`.

### 4. Aggregation and submission

Location:

- [`services/relayer`](../services/relayer)

Responsibilities:

- combine individual relayer signatures into threshold-ready mint/release candidates
- submit mint transactions on OP_NET
- expose candidate data for user claims and API visibility

### 5. Status API

Location:

- [`services/api`](../services/api)

Responsibilities:

- publish bridge status and relayer heartbeats
- expose mint candidates, processed state, attestations, and finality views
- serve as the frontend's main source of truth

The public site already depends on this API for bridge state, readiness, and pause gating.

### 6. Public site

Location:

- [`apps/site`](../apps/site)

Responsibilities:

- user-facing bridge UX
- wallet connections
- deposit / withdrawal / claim flows
- status lookup
- explorer links and transaction UX
- maintenance landing page when Ethereum vault or OP_NET bridge is paused

## End-to-End Flows

### Ethereum -> OP_NET

1. User approves the vault to spend an ERC-20.
2. User calls `depositERC20(...)`.
3. Vault emits `DepositInitiated`.
4. Ethereum relayers observe and sign the canonical payload.
5. Aggregator produces a threshold-ready mint candidate.
6. Candidate is submitted to the OP_NET bridge.
7. OP_NET bridge mints the wrapped asset.
8. API marks the mint as processed/finalized after OP_NET observation.

### OP_NET -> Ethereum

1. User calls the OP_NET bridge burn request flow.
2. OP_NET bridge burns wrapped tokens and emits the withdrawal event.
3. OP_NET relayers observe and sign the canonical release payload.
4. Aggregator/API expose a threshold-ready release candidate.
5. User claims on the Ethereum vault with the aggregated signatures.
6. Vault releases the underlying ERC-20.
7. API marks the withdrawal as processed/finalized after Ethereum observation.

## Finality Model

The product exposes two different kinds of finality:

- source-chain readiness/finality
  - a deposit or withdrawal has enough source-chain confirmations to be considered ready for the next step
- claim finality
  - the claim/mint/release transaction itself has been finalized on the destination chain

These must not be conflated in the UX. A source event can be `ready` while the destination-side claim has not yet happened.

## Pause Model

Bridge availability depends on both sides:

- Ethereum vault `paused`
- OP_NET bridge `paused`

Relayer heartbeats publish:

- `vaultPaused`
- `bridgePaused`

The public site reads `/status` and shows a maintenance landing page if either side is paused.

## Fee Model

The Ethereum vault applies fees on both directions:

- deposit fees on Ethereum -> OP_NET deposits
- release fees on OP_NET -> Ethereum withdrawals

Controls:

- `feeBps`
- `feeRecipient`
- `feeWhitelist(account)`

Whitelisted accounts bypass fees entirely.

## Canonical Deployment Metadata

Ethereum deployment artifacts are tracked separately by network:

- `contracts/ethereum/deployments/sepolia-latest.json`
- `contracts/ethereum/deployments/ethereum-latest.json`

Policy:

- these tracked manifests are canonical shared environment records
- local scratch overrides should use ignored local files instead of editing canonical manifests casually
