# OP_BRIDGE Testnet Deployment State (2026-03-20)

This document records the actual state of the completed OP_BRIDGE testnet deployment as of 2026-03-20.

It covers:
- contract deployment state
- relayer and API runtime state
- public site/API cutover state
- operational failures encountered during rollout
- finality semantics and follow-up notes

This is the authoritative deployment checkpoint for the current OP_BRIDGE-branded testnet line.

## 1. Public endpoints

- Public site: `https://testnet.opbridge.app`
- Public API: `https://api.testnet.opbridge.app/status`
- Optional dev/operator app: `apps/web` in repo, not part of this production note

## 2. Ethereum Sepolia deployment

Deployment file:
- `contracts/ethereum/deployments/sepolia-latest.json`

Current deployed Sepolia addresses:
- Vault: `0x50E6a38e9B1c0B375752BD96715C43d2a91760e5`
- USDT: `0x7083344Afd1332929042944916217cb74944a53C`
- WBTC: `0x98a212018a3A9C65610b464236172e65554c37DF`
- WETH: `0x4B98D6b1f4ed837A1a0023eEbC75Be42AEEA8b97`
- PAXG: `0xC7bE981A9dcF107bbD016f7eA8260426C8262790`

Vault runtime state verified during rollout:
- paused: `false`
- relay count: `3`
- relay threshold: `2`
- fee bps: `50`
- fee recipient: `0x7c72d96895627928B8060942E37e6f0a43a1Dba4`
- asset slots `0..3` configured and enabled

Sepolia relay signer addresses configured on vault:
- `0xE09D972cf951fB8F8941B01EF3e80F602419Ce66`
- `0x5A7e29bEee0747179e098230289175c047E131c5`
- `0xe014a699b5a0458e9f4a4c2fDeA4BBe6749345C5`

## 3. OPNet bridge deployment

Current deployed OPNet bridge values:
- bridge address: `opt1sqzpz43ykxzyjynt3a804fqgqkl2754sv6gpvrqfk`
- bridge hex: `0x28aaa7128a0106ee04bbcc38f82bac582e5840daea9068aa81269ccb34974c0f`
- network: `testnet`

Wrapped OPNet token addresses:
- opUSDT: `opt1sqzteg2fr9ecjt66wh5fyms4vz8wdzztnaqtgxrqh`
- opWBTC: `opt1sqz0eecnrxz82d9995l3urnjh7xtzhn53dckfgh93`
- opWETH: `opt1sqrzm9xgx4tvqgz6cagradhrzfkexx8efn5z9tak4`
- opPAXG: `opt1sqprt4n67j3pp76menhm3qh8d50jpqrk6gsn2q5kd`

The OPNet bridge was configured with the relayer ML-DSA public keys and then unpaused.

## 4. Relay key material used

ML-DSA relay KMS keys:
- relay `a`: `arn:aws:kms:us-east-2:392014286458:key/33a7bae2-b1fe-4a8c-91ef-7bf99fd7d5a1`
- relay `b`: `arn:aws:kms:us-east-2:392014286458:key/8337128d-96f8-4f3f-b3a7-079997185310`
- relay `c`: `arn:aws:kms:us-east-2:392014286458:key/766765fc-30ef-4946-b5fd-da29f3863703`

EVM relay KMS keys:
- relay `a`: `arn:aws:kms:us-east-2:392014286458:key/67892b04-8a6a-41ee-80e8-7dcddaeee64f`
- relay `b`: `arn:aws:kms:us-east-2:392014286458:key/bdb5f6e7-3d75-4dde-a13c-cd5ba2a728e5`
- relay `c`: `arn:aws:kms:us-east-2:392014286458:key/b8839667-19d4-4aa8-941c-df25dfac54d2`

Derived/confirmed OPNet relay IDs (pubkey hashes):
- `0x11d2b8fe8290ecae6ebb84b1c67b213caffa92b44296850aaed7ee79fc174d76`
- plus the corresponding `b` and `c` relay hashes configured on-chain and verified in `apps/web`

## 5. Runtime topology

API box:
- runs `opbridge-relayer-api`
- runs `opbridge-relayer-aggregate-mint.timer`
- runs `opbridge-relayer-aggregate-release.timer`
- Nginx terminates TLS for `api.testnet.opbridge.app`

Worker boxes:
- three Ethereum pollers: `opbridge-relayer-ethereum@a|b|c`
- three OPNet pollers: `opbridge-relayer-opnet@a|b|c`

Healthy runtime state reached during rollout:
- all 6 relayers present in `/status`
- all 6 relayers `status: ok`
- no stale relayers
- public API reachable over HTTPS with the correct hostname certificate

## 6. Site/runtime env state

Current public site env values were synced into:
- `apps/site/.env.local`
- `apps/site/.env.vercel.import`

Current host runtime env sync tooling:
- repo-local env templates remain under `./opbridge-env`
- runtime systemd envs live under `~/opbridge-env`
- `scripts/opbridge-host-env-sync.sh` now copies repo envs into `~/opbridge-env` and applies host-specific overrides

This script supports:
- `--role api`
- `--role worker --instance a|b|c`
- override injection for:
  - `RELAYER_API_URL`
  - `ETHEREUM_RPC_URL[_SECRET_REF]`
  - `OPNET_RPC_URL[_SECRET_REF]`
  - `RELAYER_API_WRITE_TOKEN[_SECRET_REF]`
  - `RELAYER_KMS_KEY_ID`
  - `RELAYER_EVM_KMS_KEY_ID`

## 7. Operational failures encountered

### 7.1 Runtime env dir mismatch

Problem:
- systemd units load env from `/home/ssm-user/opbridge-env`
- repo tooling had been writing only to repo-local `./opbridge-env`

Effect:
- services started with missing or stale runtime env files

Resolution:
- created `scripts/opbridge-host-env-sync.sh`
- documented host-specific sync flow in systemd install output and ops docs

### 7.2 API box aggregators initially failed on public TLS hostname

Problem:
- API/aggregator runtime used `RELAYER_API_URL=https://api.testnet.opbridge.app`
- public hostname still served a cert for `api.heptad.app`

Effect:
- aggregators failed with `ERR_TLS_CERT_ALTNAME_INVALID`

Resolution:
- API box local runtime switched to `RELAYER_API_URL=http://127.0.0.1:8787`
- public hostname was fixed later at the Nginx/cert layer

### 7.3 Secret-backed envs failed because AWS CLI was missing

Problem:
- runtime secret refs such as `aws-sm://opbridge-testnet#...` require `aws` CLI on host
- several hosts did not have a working AWS CLI install

Effect:
- relayers/aggregators could not resolve write tokens or RPC URLs
- observed error: `AWS CLI secret fetch failed: spawn aws ENOENT`

Resolution:
- installed/fixed AWS CLI on API and worker boxes
- confirmed `aws --version` works

### 7.4 API box bound only to loopback

Problem:
- `RELAYER_API_HOST=127.0.0.1` on API box

Effect:
- worker relayers could not publish heartbeats to `172.31.2.219:8787`

Resolution:
- changed API runtime host binding to `0.0.0.0`
- restarted API service
- workers successfully published heartbeats afterward

### 7.5 Public API Nginx/cert still pointed at legacy hostname

Problem:
- Nginx was still configured only for `api.heptad.app`
- public hostname `api.testnet.opbridge.app` resolved to box but served wrong certificate

Effect:
- public API calls to `api.testnet.opbridge.app` failed hostname validation

Resolution:
- created new Nginx site config for `api.testnet.opbridge.app`
- issued new Let’s Encrypt certificate
- verified:
  - certificate subject `CN=api.testnet.opbridge.app`
  - `GET /status` returns `200 OK`

### 7.6 `HEAD /status` returns 404 while `GET /status` returns 200

Observation:
- `curl -I` produced `404`
- `curl https://api.testnet.opbridge.app/status` produced valid JSON

Interpretation:
- the API serves `GET /status` correctly but does not handle `HEAD /status`
- this is not a deployment blocker

## 8. Finality and claim-state semantics

Original issue observed during testing:
- after a deposit was successfully claimed on OPNet, the site still showed the deposit candidate as `ready`
- the claim button lingered until more blocks passed

Why this happened:
- the API marked `processed=true` only after the destination-side claim event had itself crossed the same confirmation threshold used for source-side deposits/burns
- that made sense for strict finality, but it was not a good UX/state model for already-submitted claims

New semantics introduced in this checkpoint:
- source-side readiness/finality remains tracked under `finality`
- destination-side claim observation is tracked separately
- `processed` now means:
  - claim observed on the destination chain
- `processedFinalized` now means:
  - the observed destination-side claim is finalized
- `claimFinality` provides destination-side claim state:
  - `observed`
  - `finalized`

Design rationale:
- source-chain confirmations guard against reorgs before value becomes claimable
- destination-side claim observation should hide stale “ready to claim” UI as soon as the claim is seen on-chain
- final settlement confidence still matters, but it should be expressed separately from “already claimed”

Files changed for this model:
- `services/api/src/server.mjs`
- `services/relayer/src/ethereum-poller.mjs`
- `services/relayer/src/opnet-burn-poller.mjs`

Behavior expected after these changes are deployed:
- a claimed deposit should stop appearing in `processed=false` mint-candidate queries as soon as `MintFinalized` is observed on OPNet
- a claimed withdrawal should stop appearing in `processed=false` release-candidate queries as soon as `WithdrawalReleased` is observed on Sepolia
- destination-chain confidence remains available through `claimFinality` / `processedFinalized`

## 9. Deployment success summary

Completed successfully:
- public OP_BRIDGE testnet site wired to live contracts
- public OP_BRIDGE relayer API deployed at `api.testnet.opbridge.app`
- fresh Sepolia vault deployment configured and unpaused
- OPNet bridge configured and unpaused
- six relayers healthy and publishing
- aggregator snapshots publishing successfully
- worker and API runtime env flow standardized
- public TLS for API fixed
- initial deposit test succeeded
- withdrawal test initiated and waiting through confirmations at time of note

## 10. Immediate follow-up / next checks

- push the latest repo commit(s)
- deploy the updated API/relayer code carrying the claim observation/finality split
- confirm that a claimed deposit disappears from ready candidate queries immediately after destination-chain observation
- confirm the same behavior for processed withdrawals
- complete end-to-end deposit and withdrawal verification on public testnet site
