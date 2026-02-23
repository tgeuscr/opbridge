# Ethereum Contracts

Current scaffolding:

- `HeptadVault.sol` includes:
  - owner / pause controls
  - per-asset configuration (`assetId -> token/enabled`)
  - `depositERC20` only (ERC20-only vault)
  - monotonic `depositId` generation
  - canonical `DepositInitiated` event for relayers
- `HeptadTestToken.sol` for Sepolia test assets (owner-mintable ERC20)

Still pending:

- withdrawal attestation verification
- threshold signer set management
- replay protection on redemption path

## Sepolia deployment scripts

Environment variables:

- `SEPOLIA_RPC_URL` (required)
- `SEPOLIA_DEPLOYER_PRIVATE_KEY` (required)
- `ETH_VAULT_OWNER` (optional; defaults to deployer)
- `SEPOLIA_TEST_MINT_PER_TOKEN` (optional; defaults to `1000000`)
- Optional OPNet metadata for deployment artifact:
  - `OPNET_BRIDGE_ADDRESS`
  - `OPNET_HUSDT_ADDRESS`
  - `OPNET_HWBTC_ADDRESS`
  - `OPNET_HETH_ADDRESS`
  - `OPNET_HPAXG_ADDRESS`

Commands:

```bash
npm run deploy:sepolia --workspace @heptad/ethereum-contracts
npm run configure:sepolia --workspace @heptad/ethereum-contracts
npm run deposit:sepolia --workspace @heptad/ethereum-contracts
```

## Sepolia terminal deposit (approve + depositERC20)

Environment variables:

- `SEPOLIA_RPC_URL` (required)
- `SEPOLIA_DEPOSITOR_PRIVATE_KEY` (required; falls back to `SEPOLIA_DEPLOYER_PRIVATE_KEY`)
- `SEPOLIA_DEPOSIT_ASSET` (required; symbol or assetId, e.g. `USDT` or `0`)
- `SEPOLIA_DEPOSIT_AMOUNT` (required; human amount, e.g. `25.5`)
- `SEPOLIA_DEPOSIT_RECIPIENT` (required; OPNet recipient as `bytes32` hex)
- `SEPOLIA_DEPLOYMENT_FILE` (optional; default `contracts/ethereum/deployments/sepolia-latest.json`)

Example:

```bash
SEPOLIA_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/<KEY> \
SEPOLIA_DEPOSITOR_PRIVATE_KEY=0x... \
SEPOLIA_DEPOSIT_ASSET=USDT \
SEPOLIA_DEPOSIT_AMOUNT=25 \
SEPOLIA_DEPOSIT_RECIPIENT=0x<64-hex> \
npm run deposit:sepolia --workspace @heptad/ethereum-contracts
```

Outputs:

- `contracts/ethereum/deployments/sepolia-<timestamp>.json`
- `contracts/ethereum/deployments/sepolia-latest.json`

Reference template:

- `docs/sepolia-opnet-regtest-asset-map.template.json`
