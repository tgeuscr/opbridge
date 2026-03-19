# OP_BRIDGE Cutover Runbook

Date intended for execution: 2026-03-19

Primary goal:
- move the current OP_BRIDGE testnet bridge into the new `OP_BRIDGE` identity
- deploy the live testnet bridge to `testnet.opbridge.app`
- reserve `opbridge.app` for the future mainnet public bridge

This document is written to be executed tomorrow with minimal guesswork.

## Scope

In scope:
- create or adopt a new GitHub repo for `op_bridge`
- rename user-facing branding from `opbridge` to `OP_BRIDGE`
- deploy testnet public site to `testnet.opbridge.app`
- deploy testnet relayer API to `api.testnet.opbridge.app`
- optionally deploy the operator console to `dev.testnet.opbridge.app`
- redeploy Sepolia and OPNet testnet contracts if you want a clean OP_BRIDGE-branded testnet stack
- wire the new testnet contracts into the new testnet frontend and relayer stack
- keep `opbridge.app` unused for mainnet launch

Out of scope:
- mainnet launch
- mainnet contract deployment
- migrating old production data if that data can be discarded safely for testnet

## Final desired topology

Testnet:
- public bridge site: `https://testnet.opbridge.app`
- relayer API: `https://api.testnet.opbridge.app`
- optional operator console: `https://dev.testnet.opbridge.app`
- Ethereum network: Sepolia
- OPNet network: OPNet testnet

Mainnet reserve:
- public bridge site: `https://opbridge.app`
- relayer API: `https://api.opbridge.app`
- optional operator console: `https://dev.opbridge.app`

Do not point the root domain at testnet after the cutover.

## Architecture surfaces that must be updated

Repo and code identity:
- root workspace name in [`package.json`](/home/m/projects/opbridge/package.json)
- workspace package names under `apps/`, `services/`, `packages/`, and `contracts/`
- user-facing copy and docs
- browser local storage keys in [`apps/site/src/App.tsx`](/home/m/projects/opbridge/apps/site/src/App.tsx)

Public frontend:
- [`apps/site`](/home/m/projects/opbridge/apps/site)
- env vars for addresses and API URL
- Vercel project or equivalent host

Operator frontend:
- [`apps/web`](/home/m/projects/opbridge/apps/web)
- old hostnames and old branding references

Relayer API:
- [`services/api`](/home/m/projects/opbridge/services/api)
- CORS allowlist
- hostname and reverse proxy
- database path

Relayers:
- [`services/relayer`](/home/m/projects/opbridge/services/relayer)
- `RELAYER_ID`
- deploy mapping file
- API URL
- signer secrets

Ethereum contracts:
- [`contracts/ethereum`](/home/m/projects/opbridge/contracts/ethereum)
- Sepolia vault deployment
- release relay config

OPNet contracts:
- [`contracts/opnet`](/home/m/projects/opbridge/contracts/opnet)
- bridge deployment
- wrapped token deployments
- token metadata if you want on-chain naming to change from `OP_BRIDGE Bridged ...`

## Hard recommendation

Do tomorrow in two phases:

1. Infra and branding cutover for testnet
2. Testnet contract redeploy and rewiring

Do not try to prepare mainnet at the same time.

## Decision checklist before starting

Answer these before the first command:

- Are you creating a brand new repo or transferring/renaming the current GitHub repo?
- Are you keeping the current testnet contracts temporarily, or are you redeploying fresh testnet contracts tomorrow?
- Are you hosting the public site on Vercel, as assumed by [`apps/site/README.md`](/home/m/projects/opbridge/apps/site/README.md)?
- Are API and relayers running on EC2 or another VM where you can control Nginx/systemd?
- Do you want `apps/web` exposed tomorrow at `dev.testnet.opbridge.app`, or is that optional?

Recommended answers:
- new GitHub repo
- fresh testnet contract redeploy
- Vercel for `apps/site`
- EC2 or equivalent VM for API and relayers
- `apps/web` optional

## Preflight checklist

Complete these before any DNS or deploy changes:

- Confirm you can log into GitHub org/user that will own the new repo.
- Confirm you can manage DNS for `opbridge.app`.
- Confirm you can manage the hosting provider for the public site.
- Confirm you can manage the testnet API server and relayer hosts.
- Confirm you have all current Sepolia deployer keys, vault owner key, fee recipient, relayer keys, OPNet deploy/admin wallet access, and API write token.
- Confirm you have a rollback path to the old testnet hostnames and old infrastructure.
- Confirm you can fund new Sepolia deployer transactions.
- Confirm you can access OP Wallet on OPNet testnet.
- Confirm you can build the repo locally.

Recommended local verification before touching anything:

```bash
npm run build
npm run test
npm run typecheck
```

If that is too broad for tomorrow morning, at minimum run:

```bash
npm run build --workspace @opbridge/site
npm run build --workspace @opbridge/web
npm run build --workspace @opbridge/ethereum-contracts
npm run build --workspace @opbridge/opnet-contracts
```

## Phase 1: New repo and rename prep

### 1. Create the new GitHub repo

Recommended repo name:
- `op-bridge`

Recommended visibility:
- private if mainnet work and secrets-adjacent workflows are still in flux

### 2. Push current code into the new repo

From your local clone:

```bash
git remote add opbridge git@github.com:<org-or-user>/op-bridge.git
git push opbridge --all
git push opbridge --tags
```

Then make the new repo the primary remote locally:

```bash
git remote rename origin opbridge-origin
git remote rename opbridge origin
```

Verify:

```bash
git remote -v
```

### 3. Protect the old repo

Pick one:
- archive the old repo
- lock it read-only
- leave only a pointer README to the new repo

Do not continue developing testnet in two repos after tomorrow.

## Phase 2: Rename codebase branding

### 4. Rename user-facing identity first

Tomorrow’s coding pass should prioritize these surfaces:

- root package/workspace names in [`package.json`](/home/m/projects/opbridge/package.json)
- workspace package names in:
  - [`apps/site/package.json`](/home/m/projects/opbridge/apps/site/package.json)
  - [`apps/web/package.json`](/home/m/projects/opbridge/apps/web/package.json)
  - [`services/api/package.json`](/home/m/projects/opbridge/services/api/package.json)
  - [`services/relayer/package.json`](/home/m/projects/opbridge/services/relayer/package.json)
  - [`packages/shared/package.json`](/home/m/projects/opbridge/packages/shared/package.json)
  - [`contracts/ethereum/package.json`](/home/m/projects/opbridge/contracts/ethereum/package.json)
  - [`contracts/opnet/package.json`](/home/m/projects/opbridge/contracts/opnet/package.json)
- docs in:
  - [`README.md`](/home/m/projects/opbridge/README.md)
  - [`RUNBOOK.md`](/home/m/projects/opbridge/RUNBOOK.md)
  - [`docs/mainnet-production-plan.md`](/home/m/projects/opbridge/docs/mainnet-production-plan.md)
- site local storage keys in [`apps/site/src/App.tsx`](/home/m/projects/opbridge/apps/site/src/App.tsx)
- operator console copy in [`apps/web/src/App.tsx`](/home/m/projects/opbridge/apps/web/src/App.tsx)

### 5. Decide what to do with contract names

If you are redeploying fresh testnet contracts tomorrow, also rename:
- bridge contract naming from `OpBridgeBridge` if desired
- wrapped token names like `OP_BRIDGE Bridged WETH`, `OP_BRIDGE Bridged PAXG`, etc.

Relevant files include:
- [`contracts/opnet/src/wrapped/opweth/opWETH.ts`](/home/m/projects/opbridge/contracts/opnet/src/wrapped/opweth/opWETH.ts)
- analogous wrapped token files for `husdt`, `hwbtc`, `hpaxg`
- bridge source in [`contracts/opnet/src/bridge/OpBridgeBridge.ts`](/home/m/projects/opbridge/contracts/opnet/src/bridge/OpBridgeBridge.ts)

Recommendation:
- yes, rename those for the new testnet deployment
- no, do not spend time trying to preserve old testnet contract names

## Phase 3: Environment split

### 6. Separate testnet and mainnet envs

The public site uses browser-safe env vars documented in [`apps/site/README.md`](/home/m/projects/opbridge/apps/site/README.md).

Create two clear env sets:

Testnet public site:
- `VITE_STATUS_API_URL=https://api.testnet.opbridge.app`
- `VITE_ETHEREUM_VAULT_ADDRESS=<new testnet vault>`
- `VITE_ETHEREUM_USDT_ADDRESS=<new testnet USDT>`
- `VITE_ETHEREUM_WBTC_ADDRESS=<new testnet WBTC>`
- `VITE_ETHEREUM_WETH_ADDRESS=<new testnet WETH>`
- `VITE_ETHEREUM_PAXG_ADDRESS=<new testnet PAXG>`
- `VITE_OPNET_USDT_ADDRESS=<new testnet OPNet wrapped USDT>`
- `VITE_OPNET_WBTC_ADDRESS=<new testnet OPNet wrapped WBTC>`
- `VITE_OPNET_WETH_ADDRESS=<new testnet OPNet wrapped WETH>`
- `VITE_OPNET_PAXG_ADDRESS=<new testnet OPNet wrapped PAXG>`
- `VITE_OPNET_BRIDGE_ADDRESS=<new OPNet bridge>`
- `VITE_ETHEREUM_GAS_LIMIT_CAP=15000000`
- `VITE_OPNET_FEE_RATE=2`
- `VITE_OPNET_MAX_SAT_SPEND=20000`

Mainnet public site:
- same keys, but empty until mainnet addresses exist

Recommendation:
- commit `.env.example` style templates
- keep real values only in hosting provider env settings

### 7. Split API hostnames and storage

Testnet API:
- hostname: `api.testnet.opbridge.app`
- dedicated DB path
- CORS allowlist for `testnet.opbridge.app`, `dev.testnet.opbridge.app`, and preview URLs

Mainnet API:
- hostname: `api.opbridge.app`
- separate DB path
- separate write token
- separate relayer fleet

From [`services/api/README.md`](/home/m/projects/opbridge/services/api/README.md), relevant env vars:
- `RELAYER_API_PORT`
- `RELAYER_API_HOST`
- `RELAYER_API_DB_PATH`
- `RELAYER_API_CORS_ALLOWED_ORIGINS`
- `RELAYER_API_WRITE_TOKEN`
- `RELAYER_API_HEARTBEAT_STALE_MS`
- `RELAYER_API_EXPECTED_RELAYER_NAMES`

Recommended testnet values:

```bash
RELAYER_API_HOST=127.0.0.1
RELAYER_API_PORT=8787
RELAYER_API_DB_PATH=/srv/opbridge-testnet/api/relayer-api.sqlite
RELAYER_API_CORS_ALLOWED_ORIGINS=https://testnet.opbridge.app,https://dev.testnet.opbridge.app,https://*.vercel.app,http://localhost:5173
RELAYER_API_WRITE_TOKEN=<new-testnet-write-token>
RELAYER_API_EXPECTED_RELAYER_NAMES=relayer-a,relayer-b,relayer-c,relayer-opnet-a,relayer-opnet-b,relayer-opnet-c
```

## Phase 4: DNS and hosting plan

### 8. Public DNS layout

Recommended records tomorrow:

- `testnet.opbridge.app` -> Vercel project for `apps/site`
- `api.testnet.opbridge.app` -> EC2/public proxy for testnet API
- `dev.testnet.opbridge.app` -> Vercel project for `apps/web` if exposed
- `opbridge.app` -> placeholder or maintenance page only
- `www.opbridge.app` -> same as root or redirect to root
- `api.opbridge.app` -> do not point yet unless you have mainnet infra
- `dev.opbridge.app` -> optional placeholder only

Do not point `opbridge.app` to testnet. That will create cleanup pain later.

### 9. Vercel projects

For `apps/site`:
- project name: `opbridge-testnet-site`
- root directory: `apps/site`
- framework preset: `Vite`
- build command: `npm run build`
- output directory: `dist`

For `apps/web` if hosted:
- project name: `opbridge-testnet-dev`
- root directory: `apps/web`
- framework preset: `Vite`
- build command: `npm run build`
- output directory: `dist`

Do not reuse one Vercel project for both testnet and mainnet.

## Phase 5: Testnet contract redeploy

### 10. Rebuild contracts before redeploy

```bash
npm run build --workspace @opbridge/opnet-contracts
npm run test --workspace @opbridge/opnet-contracts
npm run build --workspace @opbridge/ethereum-contracts
npm run test --workspace @opbridge/ethereum-contracts
```

If package names are renamed tomorrow, use the new workspace names instead.

### 11. Deploy fresh OPNet contracts

Manual OPNet deployment targets:
- bridge
- wrapped USDT
- wrapped WBTC
- wrapped WETH
- wrapped PAXG

Capture immediately:
- `OPNET_BRIDGE_ADDRESS`
- `OPNET_BRIDGE_HEX`
- each wrapped token address

Store those in:
- a fresh deployment note under `docs/`
- the Sepolia deployment JSON if you keep that pattern
- the new site env
- relayer mapping/config

### 12. Deploy fresh Sepolia vault and test assets

Use the scripts already present in [`contracts/ethereum/package.json`](/home/m/projects/opbridge/contracts/ethereum/package.json).

Base deploy:

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
npm run deploy:sepolia --workspace @opbridge/ethereum-contracts
```

Then configure:

```bash
SEPOLIA_RPC_URL=... \
SEPOLIA_DEPLOYER_PRIVATE_KEY=0x<owner-private-key> \
ETH_VAULT_FEE_RECIPIENT=0x<fee-recipient> \
npm run configure:sepolia --workspace @opbridge/ethereum-contracts
```

Release relay config:

```bash
SEPOLIA_RPC_URL=... \
SEPOLIA_DEPLOYER_PRIVATE_KEY=0x<owner-private-key> \
SEPOLIA_DEPLOYMENT_FILE=contracts/ethereum/deployments/sepolia-latest.json \
OPNET_BRIDGE_HEX=0x<64-hex> \
RELAYER_EVM_KMS_KEY_IDS=arn:aws:kms:...a,arn:aws:kms:...b,arn:aws:kms:...c \
RELAYER_THRESHOLD=2 \
npm run configure:release-relays:sepolia --workspace @opbridge/ethereum-contracts
```

Unpause only after all wiring is complete.

### 13. Wire the OPNet bridge

On the OPNet side, confirm:
- `setEthereumVault(<new vault>)`
- `setWrappedToken(assetId, token)` for every asset
- relay count
- relay threshold
- relay public keys
- accepted attestation version
- bridge unpaused

Before calling `setRelaysConfigPacked(...)`, generate the packed relay blob from the ML-DSA KMS keys:

```bash
RELAYER_KMS_KEY_IDS=arn:aws:kms:...mldsa-a,arn:aws:kms:...mldsa-b,arn:aws:kms:...mldsa-c \
RELAYER_EVM_KMS_KEY_IDS=arn:aws:kms:...ecdsa-a,arn:aws:kms:...ecdsa-b,arn:aws:kms:...ecdsa-c \
OPNET_NETWORK=testnet \
npm run relay-config:kms --workspace @opbridge/relayer
```

## Phase 6: Testnet relayer and API redeploy

### 14. Prepare relayer IDs

Recommended IDs for testnet:
- Sepolia pollers:
  - `relayer-a`
  - `relayer-b`
  - `relayer-c`
- OPNet burn pollers:
  - `relayer-opnet-a`
  - `relayer-opnet-b`
  - `relayer-opnet-c`

### 15. Start Sepolia pollers

From [`services/relayer/README.md`](/home/m/projects/opbridge/services/relayer/README.md):

```bash
SEPOLIA_RPC_URL=... \
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

Repeat for relay indexes `1` and `2`.

### 16. Start OPNet pollers

Use the same pattern for:
- `relayer-opnet-a`
- `relayer-opnet-b`
- `relayer-opnet-c`

Relevant script:
- `npm run run:opnet --workspace @opbridge/relayer`

Set:
- `RELAYER_ID`
- `RELAYER_INDEX`
- `RELAYER_SIGNER_MODE=kms`
- `RELAYER_KMS_KEY_ID` for Ethereum pollers or `RELAYER_EVM_KMS_KEY_ID` for OPNet pollers
- `RELAYER_API_URL`
- `OPNET_RPC_URL`
- `OPNET_NETWORK=testnet`
- mapping/deployment inputs

### 17. Deploy the API

Recommended production exposure model, consistent with [`services/api/README.md`](/home/m/projects/opbridge/services/api/README.md):
- API process bound to `127.0.0.1:8787`
- Nginx reverse proxy at `api.testnet.opbridge.app`

Basic verification:

```bash
curl https://api.testnet.opbridge.app/health
curl https://api.testnet.opbridge.app/status
```

## Phase 7: Public site deployment

### 18. Deploy `apps/site` to `testnet.opbridge.app`

Set the testnet env vars in the hosting provider.

Critical values:
- `VITE_STATUS_API_URL=https://api.testnet.opbridge.app`
- all new Sepolia token addresses
- all new OPNet wrapped token addresses
- new OPNet bridge address

Then run a production build locally before pushing:

```bash
npm run build --workspace @opbridge/site
```

After deploy, verify:
- site loads
- correct wordmark/branding
- X and Telegram links
- wallet connect modal
- API status modal reads from `api.testnet.opbridge.app`

### 19. Optional: deploy `apps/web` to `dev.testnet.opbridge.app`

This is useful if you need the operator console remotely tomorrow.

Before exposing it, change:
- old branding
- old domains
- any default placeholder still referencing `testnet.opbridge.app`

## Phase 8: Smoke tests

Run these in order after deploy.

### 20. API checks

Confirm:
- `/health` returns success
- `/status` returns relayers
- heartbeats appear for all expected relayers
- CORS allows `testnet.opbridge.app`

### 21. Deposit path

1. Open `https://testnet.opbridge.app`
2. Connect EVM wallet on Sepolia
3. Connect OP_WALLET on OPNet testnet
4. Deposit a small amount of one asset
5. Confirm site shows deposit submitted
6. Confirm API receives deposit candidate
7. Confirm claim candidate becomes ready
8. Claim on OPNet
9. Confirm OPNet balance updates

### 22. Withdrawal path

1. Select the bridged OPNet asset
2. Burn a small amount
3. Confirm OPNet burn tx appears
4. Confirm API receives withdrawal candidate
5. Confirm claim candidate becomes ready
6. Claim on Sepolia
7. Confirm release tx finalizes
8. Confirm API later marks it claimed/processed state correctly

### 23. UI checks

Verify:
- waiting popup appears while candidate readiness is pending
- log boxes still work
- bridge status badges are correct
- API status modal looks correct
- relayer heartbeat block ranges render correctly

## Rollback plan

If the cutover fails, rollback in this order:

1. Point `testnet.opbridge.app` away from the broken site or disable the deployment.
2. Restore the old testnet frontend hostname if you still need a public testnet bridge immediately.
3. Restore old API hostname or revert Nginx to the old API process.
4. Stop newly started relayers if they are ingesting incorrect mappings.
5. Repoint site env vars to the old testnet contracts only if the old API and relayers are still authoritative.

Do not attempt partial rollback where the frontend points at new contracts but the relayers still watch the old deployment.

## Tomorrow’s exact execution order

Use this checklist as the real-time operator sequence.

### Morning prep

1. Pull latest code on the work machine.
2. Create a working branch in the new repo.
3. Apply branding/code rename changes.
4. Build site, web, and contracts locally.
5. Prepare deployment env values in a secure note.

### Infra prep

1. Create DNS entries for:
   - `testnet.opbridge.app`
   - `api.testnet.opbridge.app`
   - `dev.testnet.opbridge.app` if needed
2. Create new Vercel projects for site and optionally web.
3. Prepare API server env and Nginx config.
4. Prepare relayer server env and systemd commands.

### Contract and backend cutover

1. Deploy OPNet contracts.
2. Deploy Sepolia contracts.
3. Configure release relays on Sepolia.
4. Wire OPNet bridge.
5. Start API.
6. Start Sepolia pollers.
7. Start OPNet burn pollers.
8. Verify `/health` and `/status`.

### Frontend cutover

1. Set final testnet env vars in Vercel.
2. Deploy `apps/site`.
3. Verify `testnet.opbridge.app`.
4. Optionally deploy `apps/web`.

### Verification

1. Deposit smoke test.
2. Withdrawal smoke test.
3. Verify relayer heartbeats and status look sane.
4. Verify block watchers and candidate readiness.

## Time estimate

If all credentials and infra access are ready:
- repo + branding prep: 1 to 2 hours
- DNS + hosting setup: 30 to 60 minutes
- contract redeploy and wiring: 2 to 4 hours
- API + relayer cutover: 1 to 2 hours
- smoke testing and fixes: 1 to 3 hours

Realistic full-day estimate:
- 6 to 10 hours

## Common failure points

Expect problems here:

- stale env values still pointing at old `opbridge` domains
- frontend pointing at new contracts while API still indexes old ones
- CORS allowlist missing `testnet.opbridge.app`
- OPNet bridge hex mismatch on Sepolia vault config
- wrong relay key file or wrong relay index ordering
- forgetting to unpause Sepolia vault after wiring
- using `opbridge.app` for testnet by accident

## Deliverables that should exist by end of day

- new GitHub repo for `op_bridge`
- codebase renamed to OP_BRIDGE in user-facing surfaces
- deployed public testnet bridge at `testnet.opbridge.app`
- deployed testnet API at `api.testnet.opbridge.app`
- optional operator console at `dev.testnet.opbridge.app`
- fresh testnet contract addresses documented
- successful Sepolia -> OPNet and OPNet -> Sepolia smoke tests

## Recommended follow-up after tomorrow

After the cutover succeeds, create these immediately:

1. `docs/opbridge-testnet-deployment-<date>.md`
   Record final addresses, API URL, relayer IDs, DNS records, and Vercel project names.

2. `docs/opbridge-mainnet-launch-runbook.md`
   Separate from testnet. Do not overload this document with mainnet details.

3. Secret inventory
   Document where each of these now lives:
   - Sepolia deployer key
   - vault owner key
   - fee recipient
   - relayer key bundles
   - API write token
   - hosting env vars
