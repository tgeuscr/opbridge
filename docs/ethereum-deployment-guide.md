# Ethereum Deployment Guide

## Scope

This guide covers the Ethereum-side deployment split:

- `sepolia` for testnet
- `ethereum` for mainnet

The important difference is token handling:

- Sepolia deploys mock/test ERC-20 contracts
- Ethereum mainnet uses pre-existing token contracts and does not deploy ERC-20s

## Canonical Output Files

Tracked deployment manifests:

- `contracts/ethereum/deployments/sepolia-latest.json`
- `contracts/ethereum/deployments/ethereum-latest.json`

These are canonical shared records, not local scratch files.

If you need local experimentation, use ignored local override files rather than editing the canonical manifest casually.

## Sepolia Deployment

### Purpose

Use this for testnet deployments and full bridge rehearsals.

### Behavior

- deploys mock ERC-20s for `USDT`, `WBTC`, `WETH`, `PAXG`
- deploys the vault
- configures assets if owner == deployer
- writes `sepolia-<timestamp>.json` and `sepolia-latest.json`

### Required env vars

- `SEPOLIA_RPC_URL`
- `SEPOLIA_DEPLOYER_PRIVATE_KEY`

### Optional env vars

- `ETH_VAULT_OWNER`
- `ETH_VAULT_FEE_RECIPIENT`
- `SEPOLIA_TEST_MINT_PER_TOKEN`
- `SEPOLIA_TEST_FAUCET_ENABLED`
- `SEPOLIA_TEST_FAUCET_CLAIM_AMOUNT`
- `SEPOLIA_TEST_FAUCET_COOLDOWN_SECONDS`
- token-specific faucet claim amounts
- OP_NET metadata:
  - `OPNET_NETWORK`
  - `OPNET_BRIDGE_ADDRESS`
  - `OPNET_BRIDGE_HEX`
  - wrapped token addresses

### Command

```bash
npm run deploy:sepolia --workspace @opbridge/ethereum-contracts
```

## Ethereum Mainnet Deployment

### Purpose

Use this for the real mainnet deployment.

### Behavior

- deploys only the vault
- does not deploy ERC-20 tokens
- requires token addresses for the supported assets
- writes `ethereum-<timestamp>.json` and `ethereum-latest.json`

### Required env vars

- `ETHEREUM_RPC_URL`
- `ETHEREUM_DEPLOYER_PRIVATE_KEY`
- one address for each supported asset:
  - `ETHEREUM_TOKEN_USDT_ADDRESS` or `ETH_MAINNET_TOKEN_USDT_ADDRESS`
  - `ETHEREUM_TOKEN_WBTC_ADDRESS` or `ETH_MAINNET_TOKEN_WBTC_ADDRESS`
  - `ETHEREUM_TOKEN_WETH_ADDRESS` or `ETH_MAINNET_TOKEN_WETH_ADDRESS`
  - `ETHEREUM_TOKEN_PAXG_ADDRESS` or `ETH_MAINNET_TOKEN_PAXG_ADDRESS`

### Optional env vars

- `ETH_VAULT_OWNER`
- `ETH_VAULT_FEE_RECIPIENT`
- OP_NET metadata:
  - `OPNET_NETWORK` (defaults to `mainnet`)
  - `OPNET_BRIDGE_ADDRESS`
  - `OPNET_BRIDGE_HEX`
  - wrapped token addresses

### Command

```bash
npm run deploy:ethereum --workspace @opbridge/ethereum-contracts
```

## Post-Deploy Steps

After either deployment:

1. configure the vault assets / fee recipient if owner != deployer
2. configure release relays on the vault
3. configure the OP_NET bridge
4. confirm pause state and fee settings
5. unpause only after both sides are wired
6. run a low-value end-to-end bridge test

## Configure Commands

Sepolia:

```bash
npm run configure:sepolia --workspace @opbridge/ethereum-contracts
npm run configure:release-relays:sepolia --workspace @opbridge/ethereum-contracts
npm run admin:sepolia --workspace @opbridge/ethereum-contracts
```

Ethereum mainnet:

```bash
npm run configure:ethereum --workspace @opbridge/ethereum-contracts
npm run configure:release-relays:ethereum --workspace @opbridge/ethereum-contracts
npm run admin:ethereum --workspace @opbridge/ethereum-contracts
```

## Deposit Commands

Sepolia:

```bash
npm run deposit:sepolia --workspace @opbridge/ethereum-contracts
```

Ethereum mainnet:

```bash
npm run deposit:ethereum --workspace @opbridge/ethereum-contracts
```

## Mainnet Deployment Checklist

Before considering the Ethereum mainnet side ready:

1. confirm the canonical token addresses are correct
2. confirm the deployed vault owner is correct
3. confirm `feeRecipient` and `feeBps`
4. confirm the fee whitelist policy
5. confirm the release relay signer set and threshold
6. confirm OP_NET bridge binding (`opnetBridgeHex`)
7. confirm the relayer API reports coherent heartbeat state
8. confirm the public site behaves correctly in mainnet mode
9. run a low-value bridge test in both directions
10. keep the vault paused until every previous item is explicitly checked
