# OP_BRIDGE Public Site (`apps/site`)

Public-facing bridge frontend preview (separate from the internal dev console in `apps/web`).

Current scope:
- Connect `OP_WALLET`
- Connect MetaMask
- Sepolia network check / switch button
- Status API polling and lookup (`/health`, `/status`, `/deposits/:id`, `/withdrawals/:id`)

## Local Development

From the repo root:

```bash
npm run dev --workspace @opbridge/site
```

Build:

```bash
npm run build --workspace @opbridge/site
```

## Environment Variables

Browser-safe only.

- `VITE_STATUS_API_URL`: Base URL for relayer API (example: `https://api.testnet.opbridge.app`)
- `VITE_ETHEREUM_VAULT_ADDRESS`
- `VITE_ETHEREUM_USDT_ADDRESS`
- `VITE_ETHEREUM_WBTC_ADDRESS`
- `VITE_ETHEREUM_WETH_ADDRESS`
- `VITE_ETHEREUM_PAXG_ADDRESS`
- `VITE_OPNET_USDT_ADDRESS`
- `VITE_OPNET_WBTC_ADDRESS`
- `VITE_OPNET_WETH_ADDRESS`
- `VITE_OPNET_PAXG_ADDRESS`
- `VITE_OPNET_BRIDGE_ADDRESS`
- `VITE_ETHEREUM_GAS_LIMIT_CAP` (default `15000000`, must stay below chain cap)
- `VITE_BRIDGE_FEE_PERCENT` (default `0.5`, expressed as a percent)
- `VITE_OPNET_FEE_RATE` (default `2`)
- `VITE_OPNET_MAX_SAT_SPEND` (default `20000`)

Example:

```bash
VITE_STATUS_API_URL=https://api.testnet.opbridge.app
VITE_ETHEREUM_VAULT_ADDRESS=0x...
VITE_ETHEREUM_USDT_ADDRESS=0x...
VITE_ETHEREUM_WBTC_ADDRESS=0x...
VITE_ETHEREUM_WETH_ADDRESS=0x...
VITE_ETHEREUM_PAXG_ADDRESS=0x...
VITE_OPNET_USDT_ADDRESS=op...
VITE_OPNET_WBTC_ADDRESS=op...
VITE_OPNET_WETH_ADDRESS=op...
VITE_OPNET_PAXG_ADDRESS=op...
VITE_OPNET_BRIDGE_ADDRESS=op...
VITE_ETHEREUM_GAS_LIMIT_CAP=15000000
VITE_BRIDGE_FEE_PERCENT=0.5
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
- `VITE_OPNET_USDT_ADDRESS`
- `VITE_OPNET_WBTC_ADDRESS`
- `VITE_OPNET_WETH_ADDRESS`
- `VITE_OPNET_PAXG_ADDRESS`
- `VITE_OPNET_BRIDGE_ADDRESS`
- `VITE_ETHEREUM_GAS_LIMIT_CAP`
- `VITE_BRIDGE_FEE_PERCENT`
- `VITE_OPNET_FEE_RATE`
- `VITE_OPNET_MAX_SAT_SPEND`

Recommended value for this project:

```bash
VITE_STATUS_API_URL=https://api.testnet.opbridge.app
```

## DNS Layout

Recommended split:
- `testnet.opbridge.app` and `testnet.opbridge.app` -> Vercel
- `api.testnet.opbridge.app` -> EC2 (Nginx -> local relayer API)

## Notes

- Keep `apps/web` for internal bridge/dev operations.
- This app should not contain private keys, relayer signer keys, or AWS secrets.
