# OP_BRIDGE Mainnet Production Plan

Target: launch-ready before OP_NET mainnet week.

## Recommendation

Use AWS-native secret storage for day-one mainnet:

- `AWS Secrets Manager` for relayer key bundles and API write tokens
- `EC2 IAM roles` for instance access to those secrets
- existing `systemd` units for process supervision

Do not introduce HashiCorp Vault before mainnet unless there is a non-negotiable requirement for:

- multi-cloud secret access
- dynamic short-lived credentials across many systems
- centralized human/operator secret workflows outside AWS

Reasoning:

- OP_BRIDGE is already targeting EC2, so Secrets Manager removes an entire control plane that Vault would add.
- Vault would still need secure bootstrap and auth setup. That is operationally heavier than the problem we need to solve in one week.
- The relayer code currently needs raw MLDSA and ECDSA private key material at runtime. For day one, storing encrypted secret payloads and loading them at process start is the shortest reliable path.

Revisit Vault later if we outgrow AWS-only operations.

## Relayer Topology

Run one signer identity per EC2 instance:

- `relayer-a`: `RELAYER_INDEX=0`
- `relayer-b`: `RELAYER_INDEX=1`
- `relayer-c`: `RELAYER_INDEX=2`

Each instance runs:

- one Sepolia deposit poller
- one OPNet burn poller

Optional central services:

- one relayer API instance
- one reverse proxy at `api.testnet.opbridge.app`
- one hosted operator UI at `dev.testnet.opbridge.app`

## Secret Layout

Store one JSON secret per relayer instance.

Suggested secret names:

- `opbridge/mainnet/relayer-a`
- `opbridge/mainnet/relayer-b`
- `opbridge/mainnet/relayer-c`

Suggested secret JSON shape:

```json
{
  "relayPrivateKeys": ["0x..."],
  "relayEvmPrivateKeys": ["0x..."]
}
```

Optional split-secret layout:

- `opbridge/mainnet/relayer-a/opnet`
- `opbridge/mainnet/relayer-a/ethereum`

The relayer should use AWS KMS directly for signing:

- `RELAYER_KMS_KEY_ID`
- `RELAYER_EVM_KMS_KEY_ID`

## Instance Configuration

Common instance role permissions should include:

- `secretsmanager:GetSecretValue` on the relayer secret ARNs
- `ssm:GetParameter` only if Parameter Store is used
- CloudWatch Logs shipping if journald forwarding is enabled

Instance env should use KMS-only signer settings.

Example per-instance env:

```bash
RELAYER_ID=relayer-mainnet-a
RELAYER_INDEX=0
RELAYER_SIGNER_MODE=kms
RELAYER_KMS_KEY_ID=arn:aws:kms:...mldsa
RELAYER_EVM_SIGNER_MODE=kms
RELAYER_EVM_KMS_KEY_ID=arn:aws:kms:...ecdsa
RELAYER_API_URL=http://10.0.1.10:8787
```

## Operator Surface

`apps/web` should become the hosted operator console at `dev.testnet.opbridge.app`.

Primary functions:

- bridge configuration and pause state
- Ethereum vault configuration and pause state
- relayer health overview
- latest mint and release candidate visibility
- attestation backlog visibility

Do not expose write APIs publicly without auth.

Recommended pattern:

- put the operator app behind auth at the edge
- keep relayer API write endpoints private
- allow read-only status endpoints only from the operator UI origin

## Contract Compiler

The OPNet contract package should be rebuilt with the current OPNet compiler toolchain:

- use `@btc-vision/assemblyscript`
- do not install upstream `assemblyscript`
- compile via `asconfig.json`

Before final mainnet deployment, do a clean reinstall and rebuild of `contracts/opnet`.

## Remaining Must-Ship Tasks

1. Provision three EC2 instances and IAM roles.
2. Move mainnet relayer secrets into AWS Secrets Manager.
3. Add edge auth and deployment target for `dev.testnet.opbridge.app`.
4. Rebuild OPNet contracts with the refreshed compiler toolchain and redeploy if bytecode changes.
5. Run a production dress rehearsal with all three relayers and the API.
