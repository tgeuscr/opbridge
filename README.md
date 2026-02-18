# heptad

Heptad is a bi-directional bridge between Ethereum and OP_NET (smart contracts on Bitcoin), designed to bootstrap day-one liquidity for OP_NET DeFi.

## Initial scope

- Bridge assets from Ethereum to OP_NET: `ETH`, `WBTC`, `USDT`, `PAXG`
- Mint wrapped OP_NET representations: `hETH`, `hWBTC`, `hUSDT`, `hPAXG`
- Burn wrapped OP_NET assets for redemption on Ethereum
- Start implementation with:
  - OP_NET smart contracts (`contracts/opnet`)
  - Frontend bridge app (`apps/web`)

## Repository layout

- `apps/web`: user-facing bridge dApp (Ethereum + OP_NET wallet flows)
- `contracts/opnet`: OP_NET bridge + wrapped asset contract skeletons
- `contracts/ethereum`: Ethereum vault/verification contract skeleton
- `services/relayer`: off-chain relay/signer network skeleton
- `services/api`: optional API/indexer service skeleton
- `packages/shared`: shared TypeScript types/constants

## Architecture (high-level)

1. User deposits supported asset into Ethereum vault contract.
2. Relayers observe deposit events and sign attested bridge messages.
3. User submits proofs/signatures to OP_NET bridge contract.
4. OP_NET bridge mints wrapped tokens (`hETH`, `hWBTC`, `hUSDT`, `hPAXG`).
5. For withdrawals, user burns wrapped OP_NET tokens.
6. Relayers attest burn events and user redeems on Ethereum vault.

## Protocol spec

- Message protocol draft: `docs/message-protocol-v1.md`

## Quick start

```bash
npm install
npm run build
npm run dev:web
```

## Status

This repository is an active development prototype, not production-ready bridge infrastructure.
