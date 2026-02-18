# OP_NET Contracts

This package contains the OP_NET side of Heptad:

- Bridge contract (verification + mint/burn orchestration)
- Wrapped OP_20 token contracts (examples in `src/wrapped/*`)

## Bridge Contract

- `src/bridge/HeptadBridge.ts`
- Stage-1 mode is permissionless (`mintPermissionless`) for bootstrap liquidity.
- Relay-gated minting uses `mintWithRelaySignatures`.
- Default relay security is `2-of-3` on deployment.
- Verification uses `Blockchain.verifySignature(..., SignaturesMethods.Schnorr)` (consensus-aware API path).
- Replay protection included via `depositId` / `withdrawalId` tracking.
- Wrapped token addresses are configured after deployment via `setWrappedToken(assetId, tokenAddress)`.
- Asset IDs are now generic (`uint8`) and not hardcoded in bridge logic, so new tokens can be added without bridge contract edits.
- Ownership is transferable via `transferOwnership(newOwner)`.
- Relay set is expandable post-deploy:
  - `setRelayPubKey(index, relayPubKey)` supports indices `0..31`
  - `setRelayPubKeysPacked(packed)` accepts `3..32` ML-DSA pubkeys (`1312` bytes each)
  - `setRelayCount(count)` supports `3..32` (increase-only)
  - `setRelayThreshold(t)` supports `2..4`, must be `<= relayCount` (increase-only)
- Bridge deploys with no constructor calldata; configure relays post-deploy with `setRelayPubKey` / `setRelayPubKeysPacked`.

## Deployment Order

1. Deploy `HeptadBridge.wasm` (no deployment calldata).
2. Deploy wrapped token contracts (for example `HUSDT.wasm`, `HWBTC.wasm`, `HETH.wasm`, `HPAXG.wasm`) with no deployment calldata.
3. Set wrapped-token bridge authority post-deploy by calling `setBridgeAuthority(bridgeAddress)` on each token from the deployer account.
4. Call `setWrappedToken(assetId, tokenAddress)` on bridge for each token you support.
5. Set initial relays with `setRelayPubKey(0..2, relayPubKey)`.
6. Keep `setSignatureEnforcement(false)` for stage-1 permissionless mode.
7. Later, enable relay-gated minting with `setSignatureEnforcement(true)`.
8. For stronger security later, expand relays and threshold without redeploying:
   - `setRelayPubKey(3..31, relayPubKey)`
   - `setRelayCount(5, 7, ... up to 32)`
   - `setRelayThreshold(3, 4, ...)`

## Wrapped Token Contracts

- `src/wrapped/husdt/HUSDT.ts`
  - Name: `heptad-bridged USDT`
  - Symbol: `hUSDT`
  - Decimals: `6`
  - Max supply: `u256.Max` (effectively infinite)
- `src/wrapped/hwbtc/HWBTC.ts`
  - Name: `heptad-bridged WBTC`
  - Symbol: `hWBTC`
  - Decimals: `8`
  - Max supply: `21,000,000 * 10^8 = 2,100,000,000,000,000`
- `src/wrapped/heth/HETH.ts`
  - Name: `heptad-bridged ETH`
  - Symbol: `hETH`
  - Decimals: `18`
  - Max supply: `u256.Max` (effectively infinite)
- `src/wrapped/hpaxg/HPAXG.ts`
  - Name: `heptad-bridged PAXG`
  - Symbol: `hPAXG`
  - Decimals: `18`
  - Max supply: `u256.Max` (effectively infinite)

## Authorization and Events

- `mint(to, amount)` and `burnFrom(from, amount)` are bridge-authority only.
- Bridge authority is configured post-deploy. The deployer can set the initial authority once, and the current bridge authority can rotate it later with `setBridgeAuthority(newBridge)`.
- Contracts emit custom events:
  - `BridgeMinted(bridge, recipient, amount)`
  - `BridgeBurned(bridge, from, amount)`
  - `BridgeAuthorityChanged(previousBridge, newBridge)`

## Build

```bash
npm run build:bridge
npm run build:husdt
npm run build:hwbtc
npm run build:heth
npm run build:hpaxg
```

## Notes

- This is a scaffold aligned with OP_NET TypeScript/AssemblyScript-first workflows.
- Final contract logic should integrate OP_NET runtime primitives, production auth controls, replay protection, and full signature verification.
