# heptad

Heptad is a bi-directional bridge between Ethereum and OP_NET that moves assets between Sepolia and OP_NET testnet.

## Current Status

Heptad is already live and operational on testnet.

- Ethereum side: Sepolia
- Bitcoin side: OP_NET testnet
- Public bridge site: `https://heptad.app`
- Public status API: `https://api.heptad.app`
- Supported assets: `USDT`, `WBTC`, `WETH`, `PAXG`

The current system supports:

- Sepolia deposit -> OP_NET wrapped asset mint
- OP_NET burn -> Sepolia release
- Public deposit / withdrawal status lookup
- Live relayer heartbeat and aggregation APIs

Recent testnet operations have completed end-to-end in production infrastructure, including fresh withdrawals that became `ready`, were claimed on Sepolia, and were later marked `processed` by the API. This repository should therefore be read as the codebase for an active testnet bridge, not just a local prototype.

Mainnet is not live yet. The remaining operational risk on testnet is OP_NET public RPC reliability, not the existence of the bridge flow itself.

## Live Testnet Deployment

The latest checked-in Sepolia deployment artifact is [`contracts/ethereum/deployments/sepolia-latest.json`](contracts/ethereum/deployments/sepolia-latest.json).

- Sepolia vault: `0x9a27a441132AD4a86a8d781Bb2617a741104F342`
- OP_NET bridge: `opt1sqq3sffh6wasa9pdstgc2dtlrswfm2t878vp0hc8j`
- OP_NET bridge hash binding: `0x7b47f9d39c855c13ec94e3a7a9750a5f386a4ae58f96242194549f643ce6afd7`

Supported testnet assets:

| Asset | Sepolia token | OP_NET wrapped token |
| --- | --- | --- |
| USDT | `0x70642a53a64aDF15AA1F8311425D38efc04Ef02a` | `opt1sqr8ayy2476cv7zrrnp2gsq2lk67d0tdc9y2uzw55` |
| WBTC | `0x9D42E00B0D72B6F54e181c68F31f1F53944EA969` | `opt1sqqhqx4r78fgzgv0vfkx038983fh68chkkutqvzzx` |
| WETH | `0x96DA5575B1bD0c3CF4786733355513Dff2A9334D` | `opt1sqqawsa9nu30345wu29l97ql4nphndnrn5s99v7ac` |
| PAXG | `0xD8CD8E95b0461D4e76C2A97C705be7695539fA7E` | `opt1sqpr0re5zchswwxqxpje844a636lhl4f5t5pdfzjx` |

## How The Bridge Works

1. A user deposits a supported ERC-20 into the Sepolia vault.
2. Independent relayers observe the deposit and sign a canonical mint attestation.
3. Threshold-ready attestations are aggregated and submitted to the OP_NET bridge.
4. The OP_NET bridge mints the corresponding wrapped asset.
5. For withdrawals, the user requests a burn on OP_NET and specifies an Ethereum recipient.
6. Relayers observe the burn, sign release attestations, and publish a threshold-ready release candidate.
7. The release is claimed on the Sepolia vault and later marked processed by the API once the release event is observed.

The current deployment uses:

- OP_NET ML-DSA relay signatures for the Sepolia -> OP_NET mint path
- Ethereum ECDSA relay signatures for the OP_NET -> Sepolia release path
- A `2-of-3` relayer threshold
- API-driven visibility for finality, readiness, and processing state

## Repository Layout

- `apps/site`: hosted public bridge frontend for `heptad.app`
- `apps/web`: internal bridge/dev console used for admin and operator flows
- `contracts/ethereum`: Sepolia vault and test asset contracts
- `contracts/opnet`: OP_NET bridge and wrapped OP_20 contracts
- `services/relayer`: deposit pollers, burn pollers, aggregation, signing, and submission CLIs
- `services/api`: SQLite-backed bridge status API exposed through `api.heptad.app`
- `packages/shared`: shared TypeScript types and helpers
- `scripts`: deployment, admin, EC2, and environment bootstrap tooling
- `docs`: handoffs, protocol notes, and production planning documents

## Local Development

Install dependencies:

```bash
npm install
```

Build all workspaces:

```bash
npm run build
```

Run the internal dev console:

```bash
npm run dev:web
```

Run the public site locally:

```bash
npm run dev --workspace @heptad/site
```

Run workspace checks:

```bash
npm run test
npm run typecheck
```

## Operations And Docs

- End-to-end bridge runbook: `RUNBOOK.md`
- Public site notes and env vars: `apps/site/README.md`
- Relayer service usage: `services/relayer/README.md`
- API service usage: `services/api/README.md`
- Ethereum contract details: `contracts/ethereum/README.md`
- OP_NET contract details: `contracts/opnet/README.md`
- Protocol draft: `docs/message-protocol-v1.md`
- Latest operational handoff: `docs/session-handoff-2026-03-14.md`

## Testnet Notes

- The bridge is currently intended for testnet use only.
- Sepolia and OP_NET testnet are the authoritative live environments for this repo today.
- The hosted system is active, and the repo contains the code and ops tooling that back that live testnet deployment.
