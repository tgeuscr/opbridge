# Heptad Public Site (`apps/site`)

Public-facing bridge frontend preview (separate from the internal dev console in `apps/web`).

Current scope:
- Connect `OP_WALLET`
- Connect MetaMask
- Sepolia network check / switch button
- Status API polling and lookup (`/health`, `/status`, `/deposits/:id`, `/withdrawals/:id`)

## Local Development

From the repo root:

```bash
npm run dev --workspace @heptad/site
```

Build:

```bash
npm run build --workspace @heptad/site
```

## Environment Variables

Browser-safe only.

- `VITE_STATUS_API_URL`: Base URL for relayer API (example: `https://api.heptad.app`)
- `VITE_ETHEREUM_VAULT_ADDRESS`
- `VITE_ETHEREUM_USDT_ADDRESS`
- `VITE_ETHEREUM_WBTC_ADDRESS`
- `VITE_ETHEREUM_WETH_ADDRESS`
- `VITE_ETHEREUM_PAXG_ADDRESS`
- `VITE_OPNET_BRIDGE_ADDRESS`
- `VITE_ETHEREUM_GAS_LIMIT_CAP` (default `15000000`, must stay below chain cap)
- `VITE_OPNET_FEE_RATE` (default `2`)
- `VITE_OPNET_MAX_SAT_SPEND` (default `20000`)

Example:

```bash
VITE_STATUS_API_URL=https://api.heptad.app
VITE_ETHEREUM_VAULT_ADDRESS=0x...
VITE_ETHEREUM_USDT_ADDRESS=0x...
VITE_ETHEREUM_WBTC_ADDRESS=0x...
VITE_ETHEREUM_WETH_ADDRESS=0x...
VITE_ETHEREUM_PAXG_ADDRESS=0x...
VITE_OPNET_BRIDGE_ADDRESS=op...
VITE_ETHEREUM_GAS_LIMIT_CAP=15000000
VITE_OPNET_FEE_RATE=2
VITE_OPNET_MAX_SAT_SPEND=20000
```

## Vercel Deployment (Preview)

Create a new Vercel project and use:

- Framework Preset: `Vite`
- Root Directory: `apps/site`
- Build Command: `npm run build`
- Output Directory: `dist`

Set env vars (Vercel Project Settings -> Environment Variables):
- `VITE_STATUS_API_URL`
- `VITE_ETHEREUM_VAULT_ADDRESS`
- `VITE_ETHEREUM_USDT_ADDRESS`
- `VITE_ETHEREUM_WBTC_ADDRESS`
- `VITE_ETHEREUM_WETH_ADDRESS`
- `VITE_ETHEREUM_PAXG_ADDRESS`
- `VITE_OPNET_BRIDGE_ADDRESS`
- `VITE_ETHEREUM_GAS_LIMIT_CAP`
- `VITE_OPNET_FEE_RATE`
- `VITE_OPNET_MAX_SAT_SPEND`

Recommended value for this project:

```bash
VITE_STATUS_API_URL=https://api.heptad.app
```

## DNS Layout

Recommended split:
- `heptad.app` and `www.heptad.app` -> Vercel
- `api.heptad.app` -> EC2 (Nginx -> local relayer API)

## Notes

- Keep `apps/web` for internal bridge/dev operations.
- This app should not contain private keys, relayer signer keys, or AWS secrets.
