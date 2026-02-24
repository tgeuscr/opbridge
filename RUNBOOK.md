# Heptad Bridge E2E Runbook (Regtest OP_NET + Sepolia)

This runbook covers the full cycle:

1. Deploy OP_NET bridge + wrapped tokens
2. Deploy Ethereum Sepolia vault + test tokens
3. Wire both sides
4. Deposit on Sepolia
5. Relay + mint on OP_NET
6. Burn on OP_NET
7. Relay + release on Sepolia

## Prereqs

- Repo root: `cd /home/m/projects/heptad`
- OP Wallet installed and using OP_NET `regtest`
- Sepolia RPC URL and funded EOA
- OP_NET bridge deployed with the **new burn ABI**:
  - `requestBurn(asset, from, ethereumRecipient, amount, withdrawalId)`
- Relay key file (combined MLDSA + ECDSA):
  - `services/relayer/.data/relay-keys.json`

Recommended (deterministic generation from one mnemonic):

```bash
RELAYER_KEYS_MNEMONIC="word1 ... word12" \
npm run keys:generate --workspace @heptad/relayer
```

This writes:
- `services/relayer/.data/relay-keys.json` (private keys; keep local)
- `services/relayer/.data/relay-public-config.json` (contract-facing public values)

## Key File Format

`services/relayer/.data/relay-keys.json`

```json
{
  "relayPrivateKeys": [
    "MLDSA_KEY_RELAY_0",
    "MLDSA_KEY_RELAY_1",
    "MLDSA_KEY_RELAY_2"
  ],
  "relayEvmPrivateKeys": [
    "0xECDSA_KEY_RELAY_0",
    "0xECDSA_KEY_RELAY_1",
    "0xECDSA_KEY_RELAY_2"
  ]
}
```

Notes:
- `relayPrivateKeys` = MLDSA keys (ETH -> OP mint path)
- `relayEvmPrivateKeys` = ECDSA keys (OP -> ETH release path)
- Key order defines relay index (`0,1,2,...`)
- `relay-public-config.json` includes:
  - `relayPubKeysPackedHex` (feed OP_NET bridge `setRelaysConfigPacked`)
  - per-relay ECDSA addresses (feed Ethereum vault `setRelaySigner`)

## 1) Build/Test Before Deploying

```bash
npm run build --workspace @heptad/opnet-contracts
npm run test --workspace @heptad/opnet-contracts
npm run build --workspace @heptad/ethereum-contracts
npm run test --workspace @heptad/ethereum-contracts
npm run typecheck --workspace @heptad/web
```

## 2) Deploy OP_NET Contracts (Manual)

Deploy manually (wallet/UI/current flow):

- `HeptadBridge` (new ABI)
- `HUSDT`
- `HWBTC`
- `HETH`
- `HPAXG`

Capture:
- `OPNET_BRIDGE_ADDRESS` (`op...`)
- `OPNET_BRIDGE_HEX` (`0x` + 64 hex chars, used in attestation hashing)
- wrapped token addresses (`OPNET_HUSDT_ADDRESS`, etc.)

## 3) Deploy Ethereum Sepolia Vault + Test Tokens

```bash
SEPOLIA_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/<KEY> \
SEPOLIA_DEPLOYER_PRIVATE_KEY=0x... \
ETH_VAULT_OWNER=0x<owner> \
ETH_VAULT_FEE_RECIPIENT=0x<fee-recipient> \
OPNET_BRIDGE_ADDRESS=op... \
OPNET_BRIDGE_HEX=0x<64-hex> \
OPNET_HUSDT_ADDRESS=op... \
OPNET_HWBTC_ADDRESS=op... \
OPNET_HETH_ADDRESS=op... \
OPNET_HPAXG_ADDRESS=op... \
npm run deploy:sepolia --workspace @heptad/ethereum-contracts
```

Notes:
- Vault deploys **paused by default**
- Default fee is `100 bps` (1%)
- If `ETH_VAULT_OWNER != deployer`, deploy script skips vault config calls and you must run the next steps with the owner key

Optional/required (if owner != deployer) rerun asset config + fee recipient:

```bash
SEPOLIA_RPC_URL=... \
SEPOLIA_DEPLOYER_PRIVATE_KEY=0x<owner-private-key> \
ETH_VAULT_FEE_RECIPIENT=0x<fee-recipient> \
npm run configure:sepolia --workspace @heptad/ethereum-contracts
```

## 4) Configure Ethereum Vault Release Relays (ECDSA, OP->ETH path, Terminal)

This wires the Sepolia vault to:
- `opnetBridgeHex`
- `relayCount`
- `relayThreshold`
- `relaySigners[index]`

```bash
cd /home/m/projects/heptad/contracts/ethereum

SEPOLIA_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/<KEY> \
SEPOLIA_DEPLOYER_PRIVATE_KEY=0x<owner-private-key> \
SEPOLIA_DEPLOYMENT_FILE=deployments/sepolia-latest.json \
OPNET_BRIDGE_HEX=0x<64-hex> \
RELAYER_EVM_KEYS_FILE=../../services/relayer/.data/relay-keys.json \
RELAYER_THRESHOLD=2 \
npm run configure:release-relays:sepolia

cd /home/m/projects/heptad
```

## 5) Configure Ethereum Vault Admin State (Terminal)

All Ethereum admin steps should be terminal-driven.

Set/confirm fee recipient and keep paused (owner key):

```bash
SEPOLIA_RPC_URL=... \
SEPOLIA_DEPLOYER_PRIVATE_KEY=0x<owner-private-key> \
ETH_VAULT_FEE_RECIPIENT=0x<fee-recipient> \
SEPOLIA_VAULT_PAUSED=true \
npm run admin:sepolia --workspace @heptad/ethereum-contracts
```

Optional: set fee bps (must be paused). `100 = 1%`.

```bash
SEPOLIA_RPC_URL=... \
SEPOLIA_DEPLOYER_PRIVATE_KEY=0x<owner-private-key> \
ETH_VAULT_FEE_BPS=100 \
SEPOLIA_VAULT_PAUSED=true \
npm run admin:sepolia --workspace @heptad/ethereum-contracts
```

Do **not** unpause yet until OP_NET bridge wiring is complete.

## 6) Wire OP_NET Bridge (Manual)

On the OP_NET bridge (wallet/UI admin flow), confirm:

- `setEthereumVault(<Sepolia vault address>)`
- `setWrappedToken(assetId, token)` for each asset
- MLDSA relay configuration for mint path
  - `setRelayCount(...)`
  - `setRelayThreshold(...)`
- `setRelayPubKey(...)` or packed config
- attestation version active/accepted
- bridge unpaused

## 7) Unpause Ethereum Vault (Terminal)

After all wiring is complete, unpause the Sepolia vault:

```bash
SEPOLIA_RPC_URL=... \
SEPOLIA_DEPLOYER_PRIVATE_KEY=0x<owner-private-key> \
SEPOLIA_VAULT_PAUSED=false \
npm run admin:sepolia --workspace @heptad/ethereum-contracts
```

`depositERC20(...)` and `releaseWithRelaySignatures(...)` will revert while paused.

## 8) Start ETH->OP Mint Relayers (MLDSA Signatures)

Run one process per relay index (examples use 3 relayers):

```bash
SEPOLIA_RPC_URL=... \
RELAYER_ID=relayer-a \
RELAYER_INDEX=0 \
RELAYER_KEYS_FILE=services/relayer/.data/relay-keys.json \
OPNET_BRIDGE_ADDRESS=op... \
OPNET_BRIDGE_HEX=0x<64-hex> \
RELAYER_OUTPUT_FILE=services/relayer/.data/attestations/relayer-a.json \
RELAYER_START_BLOCK=<recent-sepolia-block> \
RELAYER_MAX_BLOCK_RANGE=1 \
RELAYER_POLL_INTERVAL_MS=30000 \
npm run run:sepolia --workspace @heptad/relayer
```

Repeat with:
- `RELAYER_ID=relayer-b`, `RELAYER_INDEX=1`, output `relayer-b.json`
- `RELAYER_ID=relayer-c`, `RELAYER_INDEX=2`, output `relayer-c.json`

## 9) Deposit on Sepolia (Vault)

`SEPOLIA_DEPOSIT_RECIPIENT` must be OP_NET recipient as `bytes32` hex (usually hashed MLDSA key).

At the default `1%` vault fee:
- User deposits `X`
- Vault retains `0.01 * X` for `feeRecipient`
- `DepositInitiated.amount` emits the bridged net amount `0.99 * X`
- OP_NET mint relayers will mint the emitted net amount

```bash
SEPOLIA_RPC_URL=... \
SEPOLIA_DEPOSITOR_PRIVATE_KEY=0x... \
SEPOLIA_DEPOSIT_ASSET=USDT \
SEPOLIA_DEPOSIT_AMOUNT=25 \
SEPOLIA_DEPOSIT_RECIPIENT=0x<64-hex> \
npm run deposit:sepolia --workspace @heptad/ethereum-contracts
```

## 10) Aggregate Mint Candidate (ETH->OP)

```bash
RELAYER_THRESHOLD=2 \
AGGREGATOR_OUTPUT_FILE=services/relayer/.data/mint-submission-candidates.json \
npm run aggregate:sepolia --workspace @heptad/relayer
```

## 11) Submit Mint on OP_NET

Use the UI mint panel (load candidate -> send) or terminal:

```bash
OPNET_RPC_URL=https://regtest.opnet.org \
HTTPS_PROXY=http://proxy.example.corp:8080 \
OPNET_NETWORK=regtest \
OPNET_WALLET_MNEMONIC="..." \
MINT_CANDIDATES_FILE=services/relayer/.data/mint-submission-candidates.json \
npm run submit:opnet --workspace @heptad/relayer
```

Note: if using terminal, the env var name in the script is `MINT_CANDIDATES_FILE`.

## 12) Burn on OP_NET (Now Requires Ethereum Recipient)

In the web UI Burn Request section, set:
- Asset
- Amount
- Withdrawal ID
- **Ethereum Recipient (0x...)** (new field)

Then run:
- `Simulate Burn`
- `Simulate + Send Burn`

This emits:
- `BurnRequested(assetId, from, ethereumRecipient, amount, withdrawalId)`

## 13) Start OP_NET->ETH Burn Relayers (ECDSA Signatures)

Run one process per relay index:

```bash
OPNET_RPC_URL=https://regtest.opnet.org \
HTTPS_PROXY=http://proxy.example.corp:8080 \
OPNET_NETWORK=regtest \
RELAYER_ID=relayer-a \
RELAYER_INDEX=0 \
RELAYER_EVM_KEYS_FILE=services/relayer/.data/relay-keys.json \
RELAYER_MAPPING_FILE=contracts/ethereum/deployments/sepolia-latest.json \
RELAYER_OUTPUT_FILE=services/relayer/.data/release-attestations/relayer-a.json \
RELAYER_POLL_INTERVAL_MS=30000 \
npm run run:opnet-burn --workspace @heptad/relayer
```

Proxy options for OPNet scripts:
- Standard env proxy mode (default on): `HTTPS_PROXY`, `HTTP_PROXY`, optional `NO_PROXY`
- Explicit per-script proxy override: `OPNET_RPC_PROXY_URL=http://proxy.example.corp:8080`
- If proxy auth is required, add `OPNET_RPC_PROXY_AUTH_TOKEN='Basic ...'` (or other `Proxy-Authorization` value)
- Disable env proxy for OPNet only: `OPNET_RPC_USE_ENV_PROXY=false`

Repeat with:
- `RELAYER_ID=relayer-b`, `RELAYER_INDEX=1`, output `relayer-b.json`
- `RELAYER_ID=relayer-c`, `RELAYER_INDEX=2`, output `relayer-c.json`

## 14) Aggregate Release Candidate (OP->ETH)

```bash
RELAYER_THRESHOLD=2 \
npm run aggregate:release --workspace @heptad/relayer
```

Output:
- `services/relayer/.data/release-submission-candidates.json`

## 15) Submit Release on Sepolia Vault

```bash
SEPOLIA_RPC_URL=... \
SEPOLIA_SUBMITTER_PRIVATE_KEY=0x... \
npm run submit:sepolia-release --workspace @heptad/relayer
```

This calls:
- `HeptadVault.releaseWithRelaySignatures(...)`

At the default `1%` vault fee on release:
- OP_NET burn amount `X` is attested by relayers
- Vault sends `0.99 * X` to Ethereum recipient
- Vault sends `0.01 * X` to `feeRecipient`

## 16) Verify Final State

- Recipient received underlying ERC20 on Sepolia
- Fee recipient received fee on Sepolia (deposit-side accumulation and release-side fee)
- Vault replay protection set:
  - `processedWithdrawals(withdrawalId) == true`
- Replaying the same release candidate should revert

## Cleanup Between Retry Attempts (Important)

If bridge address/hex or relay config changes, clear stale files before regenerating:

```bash
rm -f services/relayer/.data/attestations/*.json
rm -f services/relayer/.data/mint-submission-candidates.json
rm -f services/relayer/.data/release-attestations/*.json
rm -f services/relayer/.data/release-submission-candidates.json
```

## Common Failure Causes

- Wrong `OPNET_BRIDGE_HEX` in relayer or vault config
- Relay index mismatch (`RELAYER_INDEX`) vs on-chain relay signer slots
- Using MLDSA keys for release relayers (must be ECDSA)
- Using old OP_NET bridge deployment (pre-`ethereumRecipient` burn ABI)
- Stale attestation/candidate files from a previous bridge deployment
- Old `RELAYER_START_BLOCK` causing Sepolia backfill spikes / RPC `429`
