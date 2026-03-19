# Ops Tooling (Deploy + Env Helpers)

These scripts wrap the existing deploy/config flows and keep a reusable `opbridge-env/` folder populated.

## Initialize local env templates

```bash
bash scripts/opbridge-env-init.sh
```

Creates `./opbridge-env/` with template files:
- `relayer-common.env`
- `relayer-api.env`
- `aggregator.env`
- `ethereum-{a,b,c}.env`
- `opnet-{a,b,c}.env`
- `contracts.env`

## Deploy Ethereum Sepolia vault + test tokens (mnemonic or private key)

Requires OPNet bridge + wrapped token addresses because the deploy script stores them in `sepolia-latest.json`.

```bash
MNEMONIC="word1 ... word12" \
ETHEREUM_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/<KEY> \
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
- You can use `ETHEREUM_DEPLOYER_PRIVATE_KEY=0x...` instead of `MNEMONIC`.
- If `ETH_VAULT_OWNER != deployer`, vault asset configuration is skipped by the underlying deploy script.

## Sync generated addresses into `opbridge-env/` and `apps/site/.env.local`

```bash
OPNET_BRIDGE_ADDRESS=op... \
OPNET_BRIDGE_HEX=0x<64-hex> \
OPNET_HUSDT_ADDRESS=op... \
OPNET_HWBTC_ADDRESS=op... \
OPNET_HETH_ADDRESS=op... \
OPNET_HPAXG_ADDRESS=op... \
VITE_STATUS_API_URL=https://api.testnet.opbridge.app \
bash scripts/opbridge-env-sync.sh
```

This reads `contracts/ethereum/deployments/sepolia-latest.json` and writes:
- `opbridge-env/contracts.env`
- updates `opbridge-env/relayer-common.env`
- updates DB path defaults in `opbridge-env/relayer-api.env` and `opbridge-env/aggregator.env`
- `apps/site/.env.local`

## Configure Sepolia vault release relays (Ethereum ECDSA keys)

```bash
ETHEREUM_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/<KEY> \
RELAYER_EVM_KMS_KEY_IDS=arn:aws:kms:...a,arn:aws:kms:...b,arn:aws:kms:...c \
OPNET_BRIDGE_HEX=0x<64-hex> \
RELAYER_THRESHOLD=2 \
bash scripts/configure-ethereum-release-relays.sh
```

## Generate OPNet relay public config from KMS

```bash
RELAYER_KMS_KEY_IDS=arn:aws:kms:...mldsa-a,arn:aws:kms:...mldsa-b,arn:aws:kms:...mldsa-c \
RELAYER_EVM_KMS_KEY_IDS=arn:aws:kms:...ecdsa-a,arn:aws:kms:...ecdsa-b,arn:aws:kms:...ecdsa-c \
OPNET_NETWORK=testnet \
npm run relay-config:kms --workspace @opbridge/relayer
```

## OPNet relay pubkeys -> bridge (`setRelaysConfigPacked`)

Use the generated `services/relayer/.data/relay-public-config.json`:

```bash
OPNET_NETWORK=testnet \
OPNET_RPC_URL=https://testnet.opnet.org \
OPNET_BRIDGE_ADDRESS=opr1... \
RELAYER_PUBLIC_CONFIG_FILE=services/relayer/.data/relay-public-config.json \
RELAYER_THRESHOLD=2 \
SEND=1 \
bash scripts/addpubkeystobridge.sh
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
- persist addresses into `opbridge-env/contracts.env`

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
