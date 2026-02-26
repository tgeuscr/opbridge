# Ops Tooling (Deploy + Env Helpers)

These scripts wrap the existing deploy/config flows and keep a reusable `heptad-env/` folder populated.

## Initialize local env templates

```bash
bash scripts/heptad-env-init.sh
```

Creates `./heptad-env/` with template files:
- `relayer-common.env`
- `relayer-api.env`
- `aggregator.env`
- `sepolia-{a,b,c}.env`
- `opnet-burn-{a,b,c}.env`
- `contracts.env`

## Deploy Ethereum Sepolia vault + test tokens (mnemonic or private key)

Requires OPNet bridge + wrapped token addresses because the deploy script stores them in `sepolia-latest.json`.

```bash
MNEMONIC="word1 ... word12" \
SEPOLIA_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/<KEY> \
ETH_VAULT_OWNER=0x... \
ETH_VAULT_FEE_RECIPIENT=0x... \
OPNET_BRIDGE_ADDRESS=op... \
OPNET_BRIDGE_HEX=0x<64-hex> \
OPNET_HUSDT_ADDRESS=op... \
OPNET_HWBTC_ADDRESS=op... \
OPNET_HETH_ADDRESS=op... \
OPNET_HPAXG_ADDRESS=op... \
bash scripts/deploy-ethereum-sepolia.sh
```

Notes:
- You can use `SEPOLIA_DEPLOYER_PRIVATE_KEY=0x...` instead of `MNEMONIC`.
- If `ETH_VAULT_OWNER != deployer`, vault asset configuration is skipped by the underlying deploy script.

## Sync generated addresses into `heptad-env/` and `apps/site/.env.local`

```bash
OPNET_BRIDGE_ADDRESS=op... \
OPNET_BRIDGE_HEX=0x<64-hex> \
OPNET_HUSDT_ADDRESS=op... \
OPNET_HWBTC_ADDRESS=op... \
OPNET_HETH_ADDRESS=op... \
OPNET_HPAXG_ADDRESS=op... \
VITE_STATUS_API_URL=https://api.heptad.app \
bash scripts/heptad-env-sync.sh
```

This reads `contracts/ethereum/deployments/sepolia-latest.json` and writes:
- `heptad-env/contracts.env`
- updates `heptad-env/relayer-common.env`
- updates DB path defaults in `heptad-env/relayer-api.env` and `heptad-env/aggregator.env`
- `apps/site/.env.local`

## Configure Sepolia vault release relays (Ethereum ECDSA keys)

```bash
MNEMONIC="word1 ... word12" \
SEPOLIA_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/<KEY> \
RELAYER_EVM_KEYS_FILE=services/relayer/.data/relay-keys.json \
OPNET_BRIDGE_HEX=0x<64-hex> \
RELAYER_THRESHOLD=2 \
bash scripts/configure-ethereum-release-relays.sh
```

## OPNet relay pubkeys -> bridge (`setRelaysConfigPacked`)

First generate relay public config if you do not already have it:

```bash
RELAYER_KEYS_MNEMONIC="word1 ... word12" \
RELAYER_KEYS_OPNET_NETWORK=testnet \
node services/relayer/src/generate-relay-keys.mjs
```

Then configure bridge relays:

```bash
MNEMONIC="word1 ... word12" \
OPNET_NETWORK=testnet \
OPNET_RPC_URL=https://testnet.opnet.org \
OPNET_BRIDGE_ADDRESS=opr1... \
RELAYER_PUBLIC_CONFIG_FILE=services/relayer/.data/relay-public-config.json \
RELAYER_THRESHOLD=2 \
SEND=1 \
bash scripts/addpubkeystobridge.sh
```

`SEND=1` sends the transaction. Without it, the script runs in simulate-only mode.

## OPNet deploy wrappers (artifact build + address recording)

The repository does not currently contain a canonical OPNet deploy CLI command.
These wrappers:
- build the relevant artifacts
- optionally run your custom command
- persist addresses into `heptad-env/contracts.env`

Bridge:
```bash
OPNET_DEPLOY_BRIDGE_CMD='<your OPNet bridge deploy command>' \
OPNET_BRIDGE_ADDRESS=opr1... \
OPNET_BRIDGE_HEX=0x<64-hex> \
bash scripts/deploy-opnet-bridge.sh
```

Wrapped tokens:
```bash
OPNET_DEPLOY_WRAPPED_CMD='<your wrapped token deploy commands>' \
OPNET_HUSDT_ADDRESS=op... \
OPNET_HWBTC_ADDRESS=op... \
OPNET_HETH_ADDRESS=op... \
OPNET_HPAXG_ADDRESS=op... \
bash scripts/deploy-opnet-wrapped-tokens.sh
```
