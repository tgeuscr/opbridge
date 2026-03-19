# OP_BRIDGE Message Protocol v1

Status: draft for implementation

This document defines the relay-signed message format for both bridge directions.

- `ETH -> OP_NET`: deposit attestation used for wrapped mint.
- `OP_NET -> ETH`: burn attestation used for vault release.

## Goals

- Deterministic, chain-agnostic payload format.
- Strong replay protection across assets and directions.
- Clear domain separation across environments (regtest/testnet/mainnet).
- Payload fields that are easy to derive from on-chain events.

## Conventions

- Hash function: `sha256`.
- Integer encoding: big-endian fixed width.
- Addresses:
  - Ethereum addresses: left-padded to 32 bytes.
  - OP_NET addresses: native 32 bytes.
- `assetId` mapping:
  - `0 = USDT`
  - `1 = WBTC`
  - `2 = ETH`

## Intent IDs

Intent IDs are globally unique per direction, not per asset.

- `depositId`: unique across all ETH->OP_NET deposits.
- `withdrawalId`: unique across all OP_NET->ETH burns.

Why global and not per-asset:

- Eliminates cross-asset replay classes.
- Reduces relayer/bookkeeping complexity.
- Makes audits and incident response simpler.

## Core Attestation Hash (signed by relays)

Relays sign a single 32-byte digest:

`attestationHash = sha256(preimage)`

Preimage layout (fixed width):

1. `protocolVersion` (`u8`) - `1`
2. `direction` (`u8`)
   - `1` = ETH_TO_OP_MINT
   - `2` = OP_TO_ETH_RELEASE
3. `sourceChainId` (`u64`)
4. `destinationChainId` (`u64`)
5. `sourceBridge` (`bytes32`)
6. `destinationBridge` (`bytes32`)
7. `assetId` (`u8`)
8. `recipient` (`bytes32`)
9. `amount` (`u256`)
10. `intentId` (`u256`) (depositId or withdrawalId, based on direction)

Notes:

- `recipient` is destination-chain recipient.
- `intentId` MUST be unique in source bridge state for that direction.
- The same `attestationHash` must be accepted only once on destination.

## Relay Envelope (not signed, transport/indexing metadata)

Relayer/network APIs should additionally carry:

- `sourceTxHash` (`bytes32`)
- `sourceLogIndex` (`u32`)
- `sourceBlockNumber` (`u64`)
- `observedAt` (`unix seconds`)

This envelope is for observability, reorg handling, and debugging. It is not part of `attestationHash`.

## Signature Requirements

- Relay threshold policy is chain-configurable (`relayCount`, `requiredSignatures`).
- A valid attestation requires at least `requiredSignatures` unique relay signatures over the exact same `attestationHash`.
- Duplicate relay signatures do not count multiple times.
- Current bridge profile (this repo stage): fixed `relayCount = 7`, fixed `requiredSignatures = 4`.

### Signature Algorithms by Destination Chain

- OP_NET destination verification: `MLDSA` (quantum-resistant), via `Blockchain.verifySignature(..., SignaturesMethods.MLDSA)`.
- Ethereum destination verification: `ECDSA` (`ecrecover`/OpenZeppelin ECDSA flow).

Relayers therefore produce chain-specific signatures over the same canonical `attestationHash`:

- `MLDSA` bundle for OP_NET mint.
- `ECDSA` bundle for Ethereum release.

## Mandatory Contract Binding Rule

Destination contracts MUST recompute `attestationHash` from calldata fields and reject if:

- Provided hash does not match computed hash.
- Signatures verify against a hash that is not bound to calldata.

Without this rule, signatures can be replayed against altered `asset/recipient/amount/intentId`.

## Direction-Specific Semantics

### ETH -> OP_NET (Mint)

Source of truth: Ethereum vault `Deposit` event.

Core fields:

- `direction = 1`
- `sourceChainId = ethChainId`
- `destinationChainId = opnetChainId`
- `recipient = OP_NET recipient`
- `intentId = depositId`

Destination action:

- OP_NET bridge verifies signatures and mints wrapped token.
- OP_NET bridge records `depositId` as consumed.

### OP_NET -> ETH (Release)

Source of truth: OP_NET bridge `BurnRequested` event.

Core fields:

- `direction = 2`
- `sourceChainId = opnetChainId`
- `destinationChainId = ethChainId`
- `recipient = Ethereum recipient (left-padded 20-byte address)`
- `intentId = withdrawalId`

Destination action:

- Ethereum vault verifies relay signatures.
- Ethereum vault releases underlying asset.
- Ethereum vault records `withdrawalId` as consumed.

## Environment Separation

Never reuse relay signatures across environments.

At minimum, environment is separated by:

- `sourceChainId`
- `destinationChainId`
- `sourceBridge`
- `destinationBridge`

This prevents regtest/testnet/mainnet cross-replay.

## Immediate Implementation Checklist

1. OP_NET bridge:
   - Recompute and enforce `attestationHash` inside `mintWithRelaySignatures*`.
2. Ethereum vault:
   - Implement equivalent hash construction and signature verification.
3. Relayer:
   - Canonical encoder for preimage fields and hash generation.
   - Deduplicate by `(direction, sourceChainId, sourceBridge, intentId)`.
4. Shared package:
   - Add TS encoder/decoder tests with fixed vectors.
