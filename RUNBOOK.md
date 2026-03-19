# OP_BRIDGE E2E Runbook (Regtest OP_NET + Sepolia)

This runbook covers the full cycle:

1. Deploy OP_NET bridge + wrapped tokens
2. Deploy Ethereum Sepolia vault + test tokens
3. Wire both sides
4. Deposit on Sepolia
5. Relay + mint on OP_NET
6. Burn on OP_NET
7. Relay + release on Sepolia

## Prereqs

- Repo root: `cd /home/m/projects/opbridge`
- OP Wallet installed and using OP_NET `regtest`
- Sepolia RPC URL and funded EOA
- OP_NET bridge deployed with the **new burn ABI**:
  - `requestBurn(asset, from, ethereumRecipient, amount, withdrawalId)`
- KMS signer fleet:
  - one ML-DSA AWS KMS key per Sepolia poller
  - one ECDSA AWS KMS key per OP_NET burn poller
  - relay index order still defines on-chain signer slot order (`0,1,2,...`)

Generate the OP_NET relay public config before bridge wiring:

```bash
RELAYER_KMS_KEY_IDS=arn:aws:kms:...mldsa-a,arn:aws:kms:...mldsa-b,arn:aws:kms:...mldsa-c \
RELAYER_EVM_KMS_KEY_IDS=arn:aws:kms:...ecdsa-a,arn:aws:kms:...ecdsa-b,arn:aws:kms:...ecdsa-c \
OPNET_NETWORK=testnet \
npm run relay-config:kms --workspace @opbridge/relayer
```

This writes `services/relayer/.data/relay-public-config.json` for `setRelaysConfigPacked(...)`.

## 1) Build/Test Before Deploying

```bash
npm run build --workspace @opbridge/opnet-contracts
npm run test --workspace @opbridge/opnet-contracts
npm run build --workspace @opbridge/ethereum-contracts
npm run test --workspace @opbridge/ethereum-contracts
npm run typecheck --workspace @opbridge/web
```

## 2) Deploy OP_NET Contracts (Manual)

Deploy manually (wallet/UI/current flow):

- `OpBridgeBridge` (new ABI)
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
ETHEREUM_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/<KEY> \
ETHEREUM_DEPLOYER_PRIVATE_KEY=0x... \
ETH_VAULT_OWNER=0x<owner> \
ETH_VAULT_FEE_RECIPIENT=0x<fee-recipient> \
OPNET_BRIDGE_ADDRESS=op... \
OPNET_BRIDGE_HEX=0x<64-hex> \
OPNET_HUSDT_ADDRESS=op... \
OPNET_HWBTC_ADDRESS=op... \
OPNET_HETH_ADDRESS=op... \
OPNET_HPAXG_ADDRESS=op... \
npm run deploy:ethereum --workspace @opbridge/ethereum-contracts
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
npm run configure:ethereum --workspace @opbridge/ethereum-contracts
```

## 4) Configure Ethereum Vault Release Relays (ECDSA, OP->ETH path, Terminal)

This wires the Sepolia vault to:
- `opnetBridgeHex`
- `relayCount`
- `relayThreshold`
- `relaySigners[index]`

```bash
cd /home/m/projects/opbridge/contracts/ethereum

ETHEREUM_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/<KEY> \
ETHEREUM_DEPLOYER_PRIVATE_KEY=0x<owner-private-key> \
ETHEREUM_DEPLOYMENT_FILE=deployments/sepolia-latest.json \
OPNET_BRIDGE_HEX=0x<64-hex> \
RELAYER_EVM_KMS_KEY_IDS=arn:aws:kms:...a,arn:aws:kms:...b,arn:aws:kms:...c \
RELAYER_THRESHOLD=2 \
npm run configure:release-relays:ethereum

cd /home/m/projects/opbridge
```

## 5) Configure Ethereum Vault Admin State (Terminal)

All Ethereum admin steps should be terminal-driven.

Set/confirm fee recipient and keep paused (owner key):

```bash
ETHEREUM_RPC_URL=... \
ETHEREUM_DEPLOYER_PRIVATE_KEY=0x<owner-private-key> \
ETH_VAULT_FEE_RECIPIENT=0x<fee-recipient> \
ETHEREUM_VAULT_PAUSED=true \
npm run admin:ethereum --workspace @opbridge/ethereum-contracts
```

Optional: set fee bps (must be paused). `100 = 1%`.

```bash
ETHEREUM_RPC_URL=... \
ETHEREUM_DEPLOYER_PRIVATE_KEY=0x<owner-private-key> \
ETH_VAULT_FEE_BPS=100 \
ETHEREUM_VAULT_PAUSED=true \
npm run admin:ethereum --workspace @opbridge/ethereum-contracts
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
ETHEREUM_RPC_URL=... \
ETHEREUM_DEPLOYER_PRIVATE_KEY=0x<owner-private-key> \
ETHEREUM_VAULT_PAUSED=false \
npm run admin:ethereum --workspace @opbridge/ethereum-contracts
```

`depositERC20(...)` and `releaseWithRelaySignatures(...)` will revert while paused.

## 8) Start ETH->OP Mint Relayers (MLDSA Signatures)

Run one process per relay index (examples use 3 relayers):

```bash
ETHEREUM_RPC_URL=... \
RELAYER_ID=relayer-a \
RELAYER_INDEX=0 \
RELAYER_SIGNER_MODE=kms \
RELAYER_KMS_KEY_ID=arn:aws:kms:... \
OPNET_BRIDGE_ADDRESS=op... \
OPNET_BRIDGE_HEX=0x<64-hex> \
RELAYER_OUTPUT_FILE=services/relayer/.data/attestations/relayer-a.json \
RELAYER_START_BLOCK=<recent-sepolia-block> \
RELAYER_MAX_BLOCK_RANGE=1 \
RELAYER_POLL_INTERVAL_MS=30000 \
npm run run:ethereum --workspace @opbridge/relayer
```

Repeat with:
- `RELAYER_ID=relayer-b`, `RELAYER_INDEX=1`, output `relayer-b.json`
- `RELAYER_ID=relayer-c`, `RELAYER_INDEX=2`, output `relayer-c.json`

## 9) Deposit on Sepolia (Vault)

`ETHEREUM_DEPOSIT_RECIPIENT` must be OP_NET recipient as `bytes32` hex (usually hashed MLDSA key).

At the default `1%` vault fee:
- User deposits `X`
- Vault retains `0.01 * X` for `feeRecipient`
- `DepositInitiated.amount` emits the bridged net amount `0.99 * X`
- OP_NET mint relayers will mint the emitted net amount

```bash
ETHEREUM_RPC_URL=... \
ETHEREUM_DEPOSITOR_PRIVATE_KEY=0x... \
ETHEREUM_DEPOSIT_ASSET=USDT \
ETHEREUM_DEPOSIT_AMOUNT=25 \
ETHEREUM_DEPOSIT_RECIPIENT=0x<64-hex> \
npm run deposit:ethereum --workspace @opbridge/ethereum-contracts
```

## 10) Aggregate Mint Candidate (ETH->OP)

```bash
RELAYER_THRESHOLD=2 \
AGGREGATOR_OUTPUT_FILE=services/relayer/.data/mint-submission-candidates.json \
npm run aggregate:ethereum --workspace @opbridge/relayer
```

## 11) Submit Mint on OP_NET

Use the UI mint panel (load candidate -> send) or terminal:

```bash
OPNET_RPC_URL=https://testnet.opnet.org \
HTTPS_PROXY=http://proxy.example.corp:8080 \
OPNET_NETWORK=testnet \
OPNET_WALLET_MNEMONIC="..." \
MINT_CANDIDATES_FILE=services/relayer/.data/mint-submission-candidates.json \
npm run submit:opnet --workspace @opbridge/relayer
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
OPNET_RPC_URL=https://testnet.opnet.org \
HTTPS_PROXY=http://proxy.example.corp:8080 \
OPNET_NETWORK=testnet \
RELAYER_ID=relayer-a \
RELAYER_INDEX=0 \
RELAYER_EVM_SIGNER_MODE=kms \
RELAYER_EVM_KMS_KEY_ID=arn:aws:kms:... \
RELAYER_MAPPING_FILE=contracts/ethereum/deployments/sepolia-latest.json \
RELAYER_OUTPUT_FILE=services/relayer/.data/release-attestations/relayer-a.json \
RELAYER_POLL_INTERVAL_MS=30000 \
npm run run:opnet-burn --workspace @opbridge/relayer
```

Repeat with:
- `RELAYER_ID=relayer-b`, `RELAYER_INDEX=1`, output `relayer-b.json`
- `RELAYER_ID=relayer-c`, `RELAYER_INDEX=2`, output `relayer-c.json`

## 14) Aggregate Release Candidate (OP->ETH)

```bash
RELAYER_THRESHOLD=2 \
npm run aggregate:release --workspace @opbridge/relayer
```

Output:
- `services/relayer/.data/release-submission-candidates.json`

## 15) Submit Release on Sepolia Vault

```bash
ETHEREUM_RPC_URL=... \
ETHEREUM_SUBMITTER_PRIVATE_KEY=0x... \
npm run submit:ethereum-release --workspace @opbridge/relayer
```

This calls:
- `OpBridgeVault.releaseWithRelaySignatures(...)`

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
