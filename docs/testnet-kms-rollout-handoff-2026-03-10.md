# Testnet KMS Rollout Handoff

Date: 2026-03-10
Branch: `feat/mainnet-relayer-ops`

## Current State

- OPNet bridge and Sepolia vault were paused earlier for relay rotation.
- New KMS-backed relay identities were generated and validated on all three relayer EC2 instances.
- Vault relay signers were updated successfully.
- OPNet bridge `setRelaysConfigPacked(...)` was submitted and confirmed.
- Bridge state was manually checked in the dev UI and appears correct.
- Three new relayer EC2 instances are up.
- New API EC2 instance is up.
- On the new API EC2, I already created `~/opbridge-env/relayer-api.env`, but I intentionally stopped before starting the API because I want to migrate the existing SQLite DB first.

## Important Values

### Vault signer addresses

- relay `a`: `0xE09D972cf951fB8F8941B01EF3e80F602419Ce66`
- relay `b`: `0x5A7e29bEee0747179e098230289175c047E131c5`
- relay `c`: `0xe014a699b5a0458e9f4a4c2fDeA4BBe6749345C5`

### OPNet relay pubkey hashes / relay IDs

- relay `a`: `0x11d2b8fe8290ecae6ebb84b1c67b213caffa92b44296850aaed7ee79fc174d76`
- relay `b`: `0xfa5990e08c77bcbf8ef5c4a218be3eadaaa9c9cd6e168ccdab0860b1134a3247`
- relay `c`: `0x4c4799e45765d4d43b7d1b9d3c7caa7dbebb19dae9bfe676e1a1dcc9d156e1e1`

### Relayer KMS keys

#### Relayer `a`

- ML-DSA key: `arn:aws:kms:us-east-2:392014286458:key/33a7bae2-b1fe-4a8c-91ef-7bf99fd7d5a1`
- EVM key: `arn:aws:kms:us-east-2:392014286458:key/67892b04-8a6a-41ee-80e8-7dcddaeee64f`

#### Relayer `b`

- ML-DSA key: `arn:aws:kms:us-east-2:392014286458:key/8337128d-96f8-4f3f-b3a7-079997185310`
- EVM key: `arn:aws:kms:us-east-2:392014286458:key/bdb5f6e7-3d75-4dde-a13c-cd5ba2a728e5`

#### Relayer `c`

- ML-DSA key: `arn:aws:kms:us-east-2:392014286458:key/766765fc-30ef-4946-b5fd-da29f3863703`
- EVM key: `arn:aws:kms:us-east-2:392014286458:key/b8839667-19d4-4aa8-941c-df25dfac54d2`

## What Was Verified Already

### OPNet KMS compatibility

All three relayers passed:

- `ok: true`
- `publicKeyBytes: 1312`
- `signatureBytes: 2420`
- `kmsVerify: true`

### Ethereum KMS compatibility

All three relayers passed:

- `ok: true`
- `packedSignatureBytes: 65`
- `recoveredAddress == ethereumAddress`
- `kmsVerify: true`

## Vault Update Status

This command logic was executed successfully, and output confirmed:

- `relayCount` already `3`
- `relayThreshold` already `2`
- all three `setRelaySigner(...)` calls updated to the new KMS-derived addresses

The vault is still intended to remain paused until the new relayer/API topology is running cleanly.

## Bridge Update Status

I generated the packed ML-DSA pubkeys and fed that packed blob into `setRelaysConfigPacked(<packed>, 2)`.

The dev UI now shows raw relay pubkeys in slots `r0`, `r1`, `r2`, and that is expected.

Important distinction:

- dev UI shows raw pubkeys
- the shorter 32-byte values above are pubkey hashes / relay IDs

There was no mismatch; this was just representation confusion.

## New Infrastructure Status

### Instances

- `opbridge-testnet-a` launched
- `opbridge-testnet-b` launched
- `opbridge-testnet-c` launched
- `opbridge-testnet-api` launched

### Roles

- one IAM role per relayer instance
- one IAM role for the API instance
- relayer roles are scoped to their own two KMS keys

### Node / repo status

On the relayer instances:

- Ubuntu packages installed
- `nvm` installed
- Node `24` installed and in use
- repo cloned
- branch checked out: `feat/mainnet-relayer-ops`

## Exact Stop Point

I stopped at the new API instance after creating:

- `~/opbridge-env/relayer-api.env`

I did **not** start the new API yet because I want to migrate the old SQLite DB first.

## Next Step When Resuming

### 1. Migrate old SQLite DB to new API instance

Preferred safe flow:

1. stop old API service on the old instance
2. copy SQLite files from old instance to new API instance
3. verify files exist on new API instance
4. only then start new API service

Files to copy if present:

- `/home/ssm-user/opbridge/services/api/.data/relayer-api.sqlite`
- `/home/ssm-user/opbridge/services/api/.data/relayer-api.sqlite-wal`
- `/home/ssm-user/opbridge/services/api/.data/relayer-api.sqlite-shm`

Destination:

- `/home/ssm-user/opbridge/services/api/.data/`

### 2. Start API on new API instance

Commands:

```bash
cd ~/opbridge
bash scripts/ec2/systemd/install-opbridge-systemd.sh
mkdir -p services/api/.data
sudo systemctl enable --now opbridge-relayer-api
sudo systemctl enable --now opbridge-relayer-aggregate-mint.timer
sudo systemctl enable --now opbridge-relayer-aggregate-release.timer
systemctl status opbridge-relayer-api --no-pager
curl http://127.0.0.1:8787/health
```

Then get the new API private IP:

```bash
TOKEN=$(curl -s -X PUT "http://169.254.169.254/latest/api/token" -H "X-aws-ec2-metadata-token-ttl-seconds: 21600")
curl -s -H "X-aws-ec2-metadata-token: $TOKEN" http://169.254.169.254/latest/meta-data/local-ipv4
```

### 3. Configure relayer env files

On each relayer box, use:

- `~/opbridge-env/relayer-common.env`
- `~/opbridge-env/sepolia-a.env` / `b` / `c`
- `~/opbridge-env/opnet-burn-a.env` / `b` / `c`

Important env names:

- `RELAYER_SIGNER_MODE=kms`
- `RELAYER_KMS_KEY_ID=<MLDSA key>`
- `RELAYER_EVM_SIGNER_MODE=kms`
- `RELAYER_EVM_KMS_KEY_ID=<ECC key>`
- `RELAYER_API_URL=http://<API_PRIVATE_IP>:8787`
- `RELAYER_API_WRITE_TOKEN=opbridge-testnet-write-token`

Note:

- `RELAYER_API_WRITE_TOKEN` is the correct env name, not `RELAYER_API_AUTH_TOKEN`

### 4. Bring relayers up in order

1. `relayer-a`
2. `relayer-b`
3. `relayer-c`

Systemd units:

```bash
sudo systemctl enable --now opbridge-relayer-sepolia@a
sudo systemctl enable --now opbridge-relayer-opnet-burn@a
```

Then later `@b`, then `@c`.

### 5. Verify before unpause

Check API:

```bash
curl http://127.0.0.1:8787/status
journalctl -u opbridge-relayer-api -n 100 --no-pager
journalctl -u opbridge-relayer-aggregate-mint.service -n 100 --no-pager
journalctl -u opbridge-relayer-aggregate-release.service -n 100 --no-pager
```

Check relayer logs:

```bash
journalctl -u opbridge-relayer-sepolia@a -f
journalctl -u opbridge-relayer-opnet-burn@a -f
```

Look for:

- heartbeats visible for `relayer-a`, later `b`, `c`
- no KMS permission errors
- no signer mismatch errors

### 6. Only after that, unpause

First unpause vault:

```bash
cd /home/ssm-user/opbridge/contracts/ethereum

SEPOLIA_RPC_URL='https://eth-sepolia.g.alchemy.com/v2/<ALCHEMY_KEY>' \
SEPOLIA_DEPLOYER_PRIVATE_KEY='0x<SEPOLIA_VAULT_OWNER_KEY>' \
SEPOLIA_VAULT_ADDRESS='0x9a27a441132AD4a86a8d781Bb2617a741104F342' \
SEPOLIA_VAULT_PAUSED=false \
npm run admin:sepolia
```

Then unpause the OPNet bridge via the existing admin/dev UI flow.

### 7. First live validation

1. submit one Sepolia deposit
2. confirm all 3 mint attestations appear
3. submit one OPNet burn
4. confirm all 3 release attestations appear

## Notes

- Today’s goal was not full redeploy; full fresh testnet redeploy is postponed until tomorrow.
- The immediate objective is proving relay rotation + KMS-backed runtime works with the currently deployed bridge/vault.
- There are unrelated uncommitted local repo changes on the workstation where this handoff was created; this file is just a session note and does not imply all local changes are committed.
