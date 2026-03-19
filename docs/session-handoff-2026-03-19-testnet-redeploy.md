# Session Handoff: Testnet Redeploy Status (2026-03-19)

## Purpose

This handoff captures the exact state of the OP_BRIDGE testnet redeploy as of 2026-03-19. It is intended to let work resume without reconstructing operational context from shell history.

This is specifically about the new `opbridge` deployment line, not the legacy `heptad` line.

## Repo State

Working repo:

- `/home/m/projects/opbridge`

Recent relevant commits:

- `6a96440` `Adjust Ethereum testnet fee and mint defaults`
- `85bb695` `Rebuild OPNet wrapped token artifacts`
- `5614bb3` `Rename wrapped OP20 token sources`
- `ec09adc` `Rename OPNet relayer surface to opnet`
- `98deafd` `Add secret-ref support for runtime credentials`
- `2237b1f` `Rename Sepolia relayer surface to Ethereum`
- `e2cf21a` `Rebrand project to opbridge`

Important naming/state changes already landed:

- project rebrand from `heptad` to `opbridge`
- KMS-only signer model for relayers
- secret-ref support for runtime credentials
- `sepolia` relayer surface renamed to generic `ethereum`
- `opnet-burn` relayer surface renamed to `opnet`
- OP20 wrapped token metadata renamed to:
  - `opUSDT`
  - `opWBTC`
  - `opWETH`
  - `opPAXG`
- wrapped OP20 source trees renamed to:
  - `contracts/opnet/src/wrapped/opusdt`
  - `contracts/opnet/src/wrapped/opwbtc`
  - `contracts/opnet/src/wrapped/opweth`
  - `contracts/opnet/src/wrapped/oppaxg`

## DNS / Domains

Current intended public testnet routing:

- `testnet.opbridge.app` -> Vercel frontend
- `api.testnet.opbridge.app` -> EC2 API/Nginx
- `opbridge.app` reserved for future mainnet

Current DNS status already set at Porkbun:

- `ALIAS @ -> pixie.porkbun.com`
- `CNAME testnet -> 42aaf89cceb2b67f.vercel-dns-017.com`
- `A api.testnet -> 16.59.37.50`
- apex MX/TXT restored

## Secrets / IAM

AWS Secrets Manager secret created:

- `opbridge-testnet`

Expected keys inside that secret:

- `ethereumRpcUrl`
- `opnetRpcUrl`
- `relayerApiWriteToken`

EC2 IAM roles on API and relayer instances were updated to allow reading this secret.

Secret-ref env shape expected in runtime env files:

```bash
ETHEREUM_RPC_URL_SECRET_REF=aws-sm://opbridge-testnet#ethereumRpcUrl
OPNET_RPC_URL_SECRET_REF=aws-sm://opbridge-testnet#opnetRpcUrl
RELAYER_API_WRITE_TOKEN_SECRET_REF=aws-sm://opbridge-testnet#relayerApiWriteToken
```

## Ethereum Testnet Deployment

Fresh Sepolia deployment completed successfully on 2026-03-19.

Latest deployment file:

- `/home/ssm-user/opbridge/contracts/ethereum/deployments/sepolia-latest.json`

Current deployed Sepolia addresses:

- Vault: `0x50E6a38e9B1c0B375752BD96715C43d2a91760e5`
- USDT: `0x7083344Afd1332929042944916217cb74944a53C`
- WBTC: `0x98a212018a3A9C65610b464236172e65554c37DF`
- WETH: `0x4B98D6b1f4ed837A1a0023eEbC75Be42AEEA8b97`
- PAXG: `0xC7bE981A9dcF107bbD016f7eA8260426C8262790`

Deployer / owner:

- `0xDBC112f28da61cA54e8F2A802866Dcc516Fa6D86`

Fee recipient:

- `0x7c72d96895627928B8060942E37e6f0a43a1Dba4`

Ethereum-side defaults now in code:

- vault fee default: `50` bps
- test token initial mint default: `50000000` per asset

Faucet claim amounts explicitly used for this redeploy:

- USDT: `10000`
- WBTC: `0.2`
- WETH: `5`
- PAXG: `2`

Vault post-deploy status:

- deployed
- fee recipient configured
- asset IDs `0..3` configured in the vault
- still needs release relay signer configuration
- should remain paused until relay config is complete

## OPNet Mapping Used During Ethereum Deploy

The deployment JSON currently records these OPNet-side addresses:

- bridge: `opt1sqzpz43ykxzyjynt3a804fqgqkl2754sv6gpvrqfk`
- wrapped USDT: `opt1sqzteg2fr9ecjt66wh5fyms4vz8wdzztnaqtgxrqh`
- wrapped WBTC: `opt1sqz0eecnrxz82d9995l3urnjh7xtzhn53dckfgh93`
- wrapped WETH: `opt1sqrzm9xgx4tvqgz6cagradhrzfkexx8efn5z9tak4`
- wrapped PAXG: `opt1sqprt4n67j3pp76menhm3qh8d50jpqrk6gsn2q5kd`
- OPNet bridge hex: `0x28aaa7128a0106ee04bbcc38f82bac582e5840daea9068aa81269ccb34974c0f`

Deployment JSON still labels OPNet network as `regtest`. That should be corrected later if this line is meant to become the durable OP_BRIDGE testnet blueprint.

## Env Sync Status

On the API box, this succeeded after exporting OPNet values:

```bash
bash scripts/opbridge-env-sync.sh
```

That updated:

- `/home/ssm-user/opbridge/opbridge-env/contracts.env`
- `/home/ssm-user/opbridge/opbridge-env/relayer-common.env`
- `/home/ssm-user/opbridge/opbridge-env/relayer-api.env`
- `/home/ssm-user/opbridge/opbridge-env/aggregator.env`
- `/home/ssm-user/opbridge/apps/site/.env.local`

## Relay Signer Derivation

The EVM relay signer addresses were derived successfully from KMS public keys on the relayer side.

Derived addresses:

- relay 0: `0xE09D972cf951fB8F8941B01EF3e80F602419Ce66`
- relay 1: `0x5A7e29bEee0747179e098230289175c047E131c5`
- relay 2: `0xe014a699b5a0458e9f4a4c2fDeA4BBe6749345C5`

These match the expected KMS-backed signer set from the earlier rollout work.

Important implementation detail:

- Ethereum vault stores signer addresses, not relay pubkeys.
- OPNet bridge uses relay pubkeys.

## Current Blocker

The intended Sepolia relay configuration script:

- `contracts/ethereum/scripts/configure-release-relays-sepolia.mjs`

expects:

- `RELAYER_EVM_KMS_KEY_IDS`

and uses the local AWS CLI via `services/relayer/src/aws-kms-utils.mjs`.

Observed failure when trying to run it from a relayer box:

- `Error: AWS CLI command failed: spawn aws ENOENT`

Interpretation:

- the relayer box where the command was run did not have `aws` CLI available on `PATH`
- the script currently does not support direct `RELAY_SIGNER_0/1/2` address input

So release relay configuration is not finished yet.

## Fastest Remaining Path

Because the relay addresses are already known, the fastest completion path is to bypass KMS lookup in the script and configure the vault directly with the owner key.

Needed vault values:

- vault: `0x50E6a38e9B1c0B375752BD96715C43d2a91760e5`
- bridge hex: `0x28aaa7128a0106ee04bbcc38f82bac582e5840daea9068aa81269ccb34974c0f`
- relay count: `3`
- threshold: `2`
- relay signer 0: `0xE09D972cf951fB8F8941B01EF3e80F602419Ce66`
- relay signer 1: `0x5A7e29bEee0747179e098230289175c047E131c5`
- relay signer 2: `0xe014a699b5a0458e9f4a4c2fDeA4BBe6749345C5`

After that, unpause the vault.

## EC2 Install Notes

Important operational finding from relayer instance `c`:

- broad or combined install patterns caused CPU spikes / unresponsiveness
- reboot was required after a heavy install attempt

Working safe install pattern on relayer instances:

```bash
cd /home/ssm-user/opbridge
npm install --workspace @opbridge/relayer
npm install --workspace @opbridge/shared
```

Do not use on relayer workers:

```bash
npm install
npm ci
npm install --workspace @opbridge/api
npm install --workspace @opbridge/ethereum-contracts
```

API/control box install set remains:

```bash
npm install --workspace @opbridge/api --workspace @opbridge/relayer --workspace @opbridge/shared
npm install --workspace @opbridge/ethereum-contracts
```

## Relayer/API Naming Conventions Now Expected

Ethereum relayers:

- `opbridge-relayer-ethereum@a`
- `opbridge-relayer-ethereum@b`
- `opbridge-relayer-ethereum@c`

OPNet relayers:

- `opbridge-relayer-opnet@a`
- `opbridge-relayer-opnet@b`
- `opbridge-relayer-opnet@c`

Env files:

- `opbridge-env/ethereum-a.env`
- `opbridge-env/ethereum-b.env`
- `opbridge-env/ethereum-c.env`
- `opbridge-env/opnet-a.env`
- `opbridge-env/opnet-b.env`
- `opbridge-env/opnet-c.env`

## Immediate Next Steps

1. Configure Sepolia vault release relays using the already-derived signer addresses.
2. Verify vault state:
   - bridge hex
   - relay count
   - threshold
   - signer slots
3. Unpause the vault.
4. Finish `opbridge` systemd/nginx rollout on EC2 if not already complete.
5. Start the renamed `opbridge` services from the new repo/env paths.
6. Verify:
   - API health
   - relayer heartbeats
   - test deposit
   - OPNet burn
   - Sepolia release

## Explicit Current Status Summary

As of this handoff, the OP_BRIDGE testnet redeploy is partially complete:

- branding/code migration: complete
- secrets/KMS-first runtime model: complete in repo
- DNS and Vercel testnet domain setup: complete
- Sepolia contracts redeployed: complete
- env sync from latest deployment: complete
- EVM relay signer addresses derived from KMS keys: complete
- Sepolia release relay configuration: not complete
- Sepolia vault unpause: not complete
- renamed `opbridge` services fully rolled out on EC2: not yet confirmed complete
- end-to-end deposit/burn/release test on the new deployment line: not yet done
