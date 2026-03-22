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

## Deployment modes

The Ethereum scripts now support two canonical deployment tracks:

- `sepolia`
  - deploys mock ERC-20 test assets
  - writes `contracts/ethereum/deployments/sepolia-latest.json`
- `ethereum`
  - does not deploy ERC-20s
  - requires existing token addresses for `USDT`, `WBTC`, `WETH`, `PAXG`
  - writes `contracts/ethereum/deployments/ethereum-latest.json`

The npm commands select the correct mode for you:

```bash
npm run deploy:sepolia --workspace @opbridge/ethereum-contracts
npm run deploy:ethereum --workspace @opbridge/ethereum-contracts
npm run configure:sepolia --workspace @opbridge/ethereum-contracts
npm run configure:ethereum --workspace @opbridge/ethereum-contracts
npm run configure:release-relays:sepolia --workspace @opbridge/ethereum-contracts
npm run configure:release-relays:ethereum --workspace @opbridge/ethereum-contracts
npm run admin:sepolia --workspace @opbridge/ethereum-contracts
npm run admin:ethereum --workspace @opbridge/ethereum-contracts
npm run deposit:sepolia --workspace @opbridge/ethereum-contracts
npm run deposit:ethereum --workspace @opbridge/ethereum-contracts
```

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

## Ethereum mainnet deployment scripts

Required env vars:

- `ETHEREUM_RPC_URL`
- `ETHEREUM_DEPLOYER_PRIVATE_KEY`
- existing token addresses:
  - `ETHEREUM_TOKEN_USDT_ADDRESS` or `ETH_MAINNET_TOKEN_USDT_ADDRESS`
  - `ETHEREUM_TOKEN_WBTC_ADDRESS` or `ETH_MAINNET_TOKEN_WBTC_ADDRESS`
  - `ETHEREUM_TOKEN_WETH_ADDRESS` or `ETH_MAINNET_TOKEN_WETH_ADDRESS`
  - `ETHEREUM_TOKEN_PAXG_ADDRESS` or `ETH_MAINNET_TOKEN_PAXG_ADDRESS`

Optional:

- `ETH_VAULT_OWNER`
- `ETH_VAULT_FEE_RECIPIENT`
- `OPNET_NETWORK` (defaults to `mainnet`)
- `OPNET_BRIDGE_ADDRESS`
- `OPNET_BRIDGE_HEX`
- `OPNET_HUSDT_ADDRESS`
- `OPNET_HWBTC_ADDRESS`
- `OPNET_HETH_ADDRESS`
- `OPNET_HPAXG_ADDRESS`

Command:

```bash
npm run deploy:ethereum --workspace @opbridge/ethereum-contracts
```

Notes:

- `deploy:ethereum` deploys only the vault; it does not deploy ERC-20 tokens
- The resulting manifest is written to `contracts/ethereum/deployments/ethereum-latest.json`
- Use `configure:ethereum`, `configure:release-relays:ethereum`, and `admin:ethereum` for the mainnet follow-up steps

## Vault admin (terminal)

Use `admin:sepolia` or `admin:ethereum` for terminal-only owner actions:

- pause / unpause (`setPaused`)
- fee bps (`setFeeBps`, pause-guarded)
- fee recipient (`setFeeRecipient`)

Required env vars:

- Sepolia:
  - `SEPOLIA_RPC_URL`
  - `SEPOLIA_DEPLOYER_PRIVATE_KEY`
- Ethereum mainnet:
  - `ETHEREUM_RPC_URL`
  - `ETHEREUM_DEPLOYER_PRIVATE_KEY`

Optional actions:

- `SEPOLIA_VAULT_PAUSED=true|false`
- `ETH_VAULT_FEE_BPS=<0..10000>`
- `ETH_VAULT_FEE_RECIPIENT=0x...`
- `SEPOLIA_DEPLOYMENT_FILE` or `SEPOLIA_VAULT_ADDRESS`
- `ETHEREUM_DEPLOYMENT_FILE` or `ETHEREUM_VAULT_ADDRESS`

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

## Ethereum mainnet terminal deposit (approve + depositERC20)

Environment variables:

- `ETHEREUM_RPC_URL`
- `ETHEREUM_DEPOSITOR_PRIVATE_KEY` (falls back to `ETHEREUM_DEPLOYER_PRIVATE_KEY`)
- `ETHEREUM_DEPOSIT_ASSET`
- `ETHEREUM_DEPOSIT_AMOUNT`
- `ETHEREUM_DEPOSIT_RECIPIENT`
- `ETHEREUM_DEPLOYMENT_FILE` (optional; default `contracts/ethereum/deployments/ethereum-latest.json`)

Example:

```bash
ETHEREUM_RPC_URL=https://mainnet.infura.io/v3/<KEY> \
ETHEREUM_DEPOSITOR_PRIVATE_KEY=0x... \
ETHEREUM_DEPOSIT_ASSET=WETH \
ETHEREUM_DEPOSIT_AMOUNT=0.5 \
ETHEREUM_DEPOSIT_RECIPIENT=0x<64-hex> \
npm run deposit:ethereum --workspace @opbridge/ethereum-contracts
```

Reference template:

- `docs/sepolia-opnet-regtest-asset-map.template.json`

## Vault release relay configuration (OP_NET -> ETH)

Configures the Ethereum vault with:

- `opnetBridgeHex`
- `relayCount`
- `relayThreshold`
- `relaySigners[index]`

Required env vars:

- Sepolia:
  - `SEPOLIA_RPC_URL`
  - `SEPOLIA_DEPLOYER_PRIVATE_KEY`
- Ethereum mainnet:
  - `ETHEREUM_RPC_URL`
  - `ETHEREUM_DEPLOYER_PRIVATE_KEY`
- Relay EVM signer KMS keys:
  - `RELAYER_EVM_KMS_KEY_IDS` (comma-separated in relay index order)
- OP_NET bridge hash binding:
  - `OPNET_BRIDGE_HEX` (32-byte hex), or deployment JSON containing `opnet.bridgeHex`

Optional:

- `SEPOLIA_DEPLOYMENT_FILE` (default: `contracts/ethereum/deployments/sepolia-latest.json`)
- `ETHEREUM_DEPLOYMENT_FILE` (default: `contracts/ethereum/deployments/ethereum-latest.json`)
- `RELAYER_THRESHOLD` (default: `2`)

Command:

```bash
npm run configure:release-relays:sepolia --workspace @opbridge/ethereum-contracts
npm run configure:release-relays:ethereum --workspace @opbridge/ethereum-contracts
```

This must be done while the vault is paused.
