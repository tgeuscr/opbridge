# Ethereum Contracts

Current scaffolding:

- `OpBridgeVault.sol` includes:
  - owner / pause controls
  - deploys **paused by default**
  - per-asset configuration (`assetId -> token/enabled`)
  - ERC20 deposit path (`depositERC20`)
  - OP_NET burn -> ETH release path (`releaseWithRelaySignatures`)
  - threshold relay signer verification (ECDSA)
  - replay protection (`processedWithdrawals`)
  - fee model on both deposit and release:
    - `feeBps` (default `50` = 0.5%)
    - `feeRecipient` (default = owner, configurable)
  - monotonic `depositId` generation
  - canonical `DepositInitiated` event for relayers
- `OpBridgeTestToken.sol` for Sepolia test assets (owner-mintable ERC20 + faucet `claim()`)

## Sepolia deployment scripts

Environment variables:

- `SEPOLIA_RPC_URL` (required)
- `SEPOLIA_DEPLOYER_PRIVATE_KEY` (required)
- `ETH_VAULT_OWNER` (optional; defaults to deployer)
- `ETH_VAULT_FEE_RECIPIENT` (optional; defaults to owner)
- `SEPOLIA_TEST_MINT_PER_TOKEN` (optional; defaults to `50000000`)
- `SEPOLIA_TEST_FAUCET_ENABLED` (optional; defaults to `true`)
- `SEPOLIA_TEST_FAUCET_CLAIM_AMOUNT` (optional; defaults to `1000`, human units)
- `SEPOLIA_TEST_FAUCET_COOLDOWN_SECONDS` (optional; defaults to `86400`)
- Per-token faucet claim amount overrides (optional):
  - `SEPOLIA_TEST_FAUCET_USDT_CLAIM_AMOUNT`
  - `SEPOLIA_TEST_FAUCET_WBTC_CLAIM_AMOUNT`
  - `SEPOLIA_TEST_FAUCET_WETH_CLAIM_AMOUNT`
  - `SEPOLIA_TEST_FAUCET_PAXG_CLAIM_AMOUNT`
- Optional OPNet metadata for deployment artifact:
  - `OPNET_BRIDGE_ADDRESS`
  - `OPNET_BRIDGE_HEX`
  - `OPNET_HUSDT_ADDRESS`
  - `OPNET_HWBTC_ADDRESS`
  - `OPNET_HETH_ADDRESS`
  - `OPNET_HPAXG_ADDRESS`

Commands:

```bash
npm run deploy:sepolia --workspace @opbridge/ethereum-contracts
npm run configure:sepolia --workspace @opbridge/ethereum-contracts
npm run configure:release-relays:sepolia --workspace @opbridge/ethereum-contracts
npm run admin:sepolia --workspace @opbridge/ethereum-contracts
npm run deposit:sepolia --workspace @opbridge/ethereum-contracts
```

Notes:

- `deploy:sepolia` deploys the vault in a **paused** state
- If `ETH_VAULT_OWNER != deployer`, deploy skips owner-only vault configuration calls
- Use `configure:sepolia`, `configure:release-relays:sepolia`, and `admin:sepolia` with the owner key to finish wiring

## Sepolia vault admin (terminal)

Use `admin:sepolia` for terminal-only owner actions:

- pause / unpause (`setPaused`)
- fee bps (`setFeeBps`, pause-guarded)
- fee recipient (`setFeeRecipient`)

Required env vars:

- `SEPOLIA_RPC_URL`
- `SEPOLIA_DEPLOYER_PRIVATE_KEY` (owner key)

Optional actions:

- `SEPOLIA_VAULT_PAUSED=true|false`
- `ETH_VAULT_FEE_BPS=<0..10000>`
- `ETH_VAULT_FEE_RECIPIENT=0x...`
- `SEPOLIA_DEPLOYMENT_FILE` or `SEPOLIA_VAULT_ADDRESS`

Examples:

Keep vault paused and set fee recipient:

```bash
SEPOLIA_RPC_URL=... \
SEPOLIA_DEPLOYER_PRIVATE_KEY=0x<owner-key> \
ETH_VAULT_FEE_RECIPIENT=0x<fee-recipient> \
SEPOLIA_VAULT_PAUSED=true \
npm run admin:sepolia --workspace @opbridge/ethereum-contracts
```

Set fee bps (0.5%) and unpause:

```bash
SEPOLIA_RPC_URL=... \
SEPOLIA_DEPLOYER_PRIVATE_KEY=0x<owner-key> \
ETH_VAULT_FEE_BPS=50 \
SEPOLIA_VAULT_PAUSED=false \
npm run admin:sepolia --workspace @opbridge/ethereum-contracts
```

## Sepolia terminal deposit (approve + depositERC20)

Environment variables:

- `SEPOLIA_RPC_URL` (required)
- `SEPOLIA_DEPOSITOR_PRIVATE_KEY` (required; falls back to `SEPOLIA_DEPLOYER_PRIVATE_KEY`)
- `SEPOLIA_DEPOSIT_ASSET` (required; symbol or assetId, e.g. `USDT` or `0`)
- `SEPOLIA_DEPOSIT_AMOUNT` (required; human amount, e.g. `25.5`)
- `SEPOLIA_DEPOSIT_RECIPIENT` (required; OPNet recipient as `bytes32` hex)
- `SEPOLIA_DEPLOYMENT_FILE` (optional; default `contracts/ethereum/deployments/sepolia-latest.json`)

Behavior:

- Deposit fee is taken in-vault before relaying/minting
- At default `0.5%` fee, depositing `X` emits `DepositInitiated.amount = 0.995 * X`
- Relayers mint the emitted net amount on OP_NET

Example:

```bash
SEPOLIA_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/<KEY> \
SEPOLIA_DEPOSITOR_PRIVATE_KEY=0x... \
SEPOLIA_DEPOSIT_ASSET=USDT \
SEPOLIA_DEPOSIT_AMOUNT=25 \
SEPOLIA_DEPOSIT_RECIPIENT=0x<64-hex> \
npm run deposit:sepolia --workspace @opbridge/ethereum-contracts
```

Outputs:

- `contracts/ethereum/deployments/sepolia-<timestamp>.json`
- `contracts/ethereum/deployments/sepolia-latest.json`

Reference template:

- `docs/sepolia-opnet-regtest-asset-map.template.json`

## Sepolia vault release relay configuration (OP_NET -> ETH)

Configures the Ethereum vault with:

- `opnetBridgeHex`
- `relayCount`
- `relayThreshold`
- `relaySigners[index]`

Required env vars:

- `SEPOLIA_RPC_URL`
- `SEPOLIA_DEPLOYER_PRIVATE_KEY`
- Relay EVM signer KMS keys:
  - `RELAYER_EVM_KMS_KEY_IDS` (comma-separated in relay index order)
- OP_NET bridge hash binding:
  - `OPNET_BRIDGE_HEX` (32-byte hex), or deployment JSON containing `opnet.bridgeHex`

Optional:

- `SEPOLIA_DEPLOYMENT_FILE` (default: `contracts/ethereum/deployments/sepolia-latest.json`)
- `RELAYER_THRESHOLD` (default: `2`)

Command:

```bash
npm run configure:release-relays:sepolia --workspace @opbridge/ethereum-contracts
```

This must be done while the vault is paused.
