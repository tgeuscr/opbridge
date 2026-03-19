# OP_NET Contracts

This package contains the OP_NET side of OP_BRIDGE:

- Bridge contract: `src/bridge/OpBridgeBridge.ts`
- Wrapped OP_20 tokens:
  - `src/wrapped/husdt/HUSDT.ts`
  - `src/wrapped/hwbtc/HWBTC.ts`
  - `src/wrapped/heth/HETH.ts`
  - `src/wrapped/hpaxg/HPAXG.ts`

## Bridge behavior

- Deploys paused with no default relays/assets configured.
- Minting uses relay attestations only: `mintWithRelaySignatures`.
- Burn path: `requestBurn`.
- Burn requests require `from == tx.sender`.
- Owner-only admin methods; bridge-state mutation is pause-gated.
- Relay config supports `1..32` relays and threshold `1..relayCount`.
- Duplicate relay pubkeys are rejected across relay slots.
- Replay protection via `depositId` / `withdrawalId`.
- Ownership is transferable via `transferOwnership`.

## Relay configuration

- Preferred one-tx method: `setRelaysConfigPacked(relayPubKeysPacked, threshold)`.
- Pubkeys are ML-DSA-44 (`1312` bytes each), packed contiguously.
- The repository can generate the packed blob from AWS KMS ML-DSA keys via `npm run relay-config:kms --workspace @opbridge/relayer`.
- Additional methods exist for granular updates:
  - `setRelayPubKey`
  - `setRelayPubKeysPacked`
  - `setRelayCount`
  - `setRelayThreshold`

## Asset configuration

- Add assets in batch: `setSupportedAssetsPacked(assetsPacked)`.
- Remove assets:
  - single: `removeSupportedAsset`
  - batch: `removeSupportedAssetsPacked`
- `setSupportedAssetsPacked` is append-only and rejects already configured IDs.
- Wrapped token address per asset can be changed with `setWrappedToken(assetId, tokenAddress)`.
- Read APIs:
  - `supportedAssetCount`
  - `supportedAssetAt`

Packed asset entry format (50 bytes per entry):

- `assetId` (1 byte)
- `token` (32 bytes address)
- `decimals` (1 byte)
- `symbol` (16 bytes, zero-padded)

## Pause policy

- Bridge deploys paused.
- State changes (relays/assets/tokens) require paused state.
- Unpause via `setPaused(false)` validates readiness:
  - relay count and threshold valid
  - active relay pubkeys configured
  - at least one supported asset configured

## Wrapped tokens

Each wrapped token includes:

- bridge authority (`setBridgeAuthority`)
- ownership transfer (`transferOwnership`)
- token pause control (`setPaused`)
- transfer guards while paused

## Deployment flow

1. Deploy `OpBridgeBridge.wasm` (empty deployment calldata).
2. Deploy wrapped token contracts (`HUSDT`, `HWBTC`, `HETH`, `HPAXG`).
3. While bridge is paused:
   - configure supported assets (`setSupportedAssetsPacked`)
   - configure relays (`setRelaysConfigPacked`)
   - set bridge authority on each wrapped token (`setBridgeAuthority`)
4. Unpause bridge (`setPaused(false)`).
5. Mint/burn operations become available.

## Build

```bash
npm run build:bridge
npm run build:husdt
npm run build:hwbtc
npm run build:heth
npm run build:hpaxg
```

Notes:

- Builds should run through `asconfig.json` so the OPNet transform and per-target outputs are explicit.
- OPNet upstream expects contracts to be compiled with the current `@btc-vision/assemblyscript` fork, not the upstream `assemblyscript` package.
