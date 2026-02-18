# Heptad Session Handoff (2026-02-16)

## Scope Completed

- OP_NET bridge scaffold implemented with:
  - permissionless mint path
  - relay-signature scaffold
  - ownership transfer
  - relay set/threshold/count management (future 3/5, 4/7 style expansion)
- Wrapped OP20 tokens implemented:
  - `hUSDT` (6 decimals)
  - `hWBTC` (8 decimals, capped)
  - `hETH` (18 decimals)
  - bridge-only mint/burn authority logic
  - bridge mint/burn events
- Dev web app updated for bridge operations and deployment support:
  - copy buttons for `publicKey` and `hashedMLDSAKey`
  - `op...` contract address input + auto-resolution to hex
  - bridge admin actions (simulate/send)
  - constructor calldata helpers
- Added deployment-calldata diagnostic contract:
  - `contracts/opnet/src/debug/CalldataProbe.ts`
  - build target `build/CalldataProbe.wasm`
  - ABI `contracts/opnet/abis/CalldataProbe.*`

## Critical Blocker Identified

Deployment constructor calldata is not reaching OP_NET contracts when deployed through current OP_WALLET flow (in your environment/session).

### Verified Evidence

- Probe deployment tx:
  - `b9c56aa8c785d0f63a6c393d623fe4cebc89d15f86772df017fb9d8f88b413d1`
- Probe contract address:
  - `opr1sqr83trpcwak4yffvugn4uhn376lutgxz2vht97pg`
- `btc_getTransactionByHash` result for that tx shows:
  - `"OPNetType":"Deployment"`
  - `"calldata":""` (empty)
- `btc_getCode` for probe address returns bytecode (contract exists).
- Probe `CalldataParsed` deployment event payload is all zeros, consistent with empty deployment calldata.

This means the contract parser itself is not the root cause; the deploy path is dropping calldata.

## Probe Calldata Test Vector

Expected constructor payload (69 bytes):

- `u32 magic = 0xdeadbeef`
- `address = 0x1111111111111111111111111111111111111111111111111111111111111111`
- `u256 amount = 123456789`
- `bool flag = true`

Generated hex:

`0xdeadbeef111111111111111111111111111111111111111111111111111111111111111100000000000000000000000000000000000000000000000000000000075bcd1501`

Important SDK note:
- `BinaryWriter.getBuffer()` is effectively single-read in this flow. Capture once into `const buf = w.getBuffer()` and reuse `buf` for hex + length checks.

## Files Added/Changed This Session (high-value)

- `contracts/opnet/src/bridge/HeptadBridge.ts`
- `contracts/opnet/src/bridge/events/HeptadBridgeEvents.ts`
- `contracts/opnet/src/wrapped/husdt/HUSDT.ts`
- `contracts/opnet/src/wrapped/hwbtc/HWBTC.ts`
- `contracts/opnet/src/wrapped/heth/HETH.ts`
- `contracts/opnet/src/debug/CalldataProbe.ts`
- `contracts/opnet/src/debug/events/CalldataProbeEvents.ts`
- `contracts/opnet/src/debug/index.ts`
- `contracts/opnet/asconfig.json`
- `contracts/opnet/package.json`
- `contracts/opnet/README.md`
- `apps/web/src/App.tsx`
- `apps/web/src/abi/HeptadBridge.abi.ts`
- `apps/web/package.json`

## Tomorrow: Recommended Start Sequence

1. Get OP_NET team confirmation on deployment calldata behavior in OP_WALLET (regtest).
2. If fixed/confirmed, redeploy `CalldataProbe.wasm` first and verify:
   - tx shows non-empty `calldata`
   - probe getters/event reflect non-zero parsed values.
3. Redeploy bridge with constructor calldata.
4. Redeploy wrapped tokens with bridge address calldata.
5. Run bridge admin setup (`setWrappedToken`, relay config, enforcement toggle as needed).
6. Resume end-to-end mint/burn flow checks in the web app.

## Useful Commands

Build contracts:

```bash
cd contracts/opnet
npm run build
```

Check deploy tx:

```bash
curl -s https://regtest.opnet.org/api/v1/json-rpc \
  -H 'content-type: application/json' \
  --data '{"jsonrpc":"2.0","id":1,"method":"btc_getTransactionByHash","params":["<TXID>"]}'
```

Check contract bytecode exists:

```bash
curl -s https://regtest.opnet.org/api/v1/json-rpc \
  -H 'content-type: application/json' \
  --data '{"jsonrpc":"2.0","id":1,"method":"btc_getCode","params":["<OP_CONTRACT_ADDRESS>", false]}'
```
