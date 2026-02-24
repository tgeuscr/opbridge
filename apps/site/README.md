# Heptad Public Site (`apps/site`)

Public-facing bridge frontend preview (separate from the internal dev console in `apps/web`).

Current scope:
- Connect `OP_WALLET`
- Connect MetaMask
- Sepolia network check / switch button
- Status API polling stub (`/health`)

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

- `VITE_STATUS_API_URL` (optional): Base URL for the status API (the app polls `GET /health`)

Example:

```bash
VITE_STATUS_API_URL=https://status-api.example.com
```

## Vercel Deployment (Preview)

Create a new Vercel project and use:

- Framework Preset: `Vite`
- Root Directory: `apps/site`
- Build Command: `npm run build`
- Output Directory: `dist`

Optional env vars (Vercel Project Settings -> Environment Variables):
- `VITE_STATUS_API_URL`

## Notes

- Keep `apps/web` for internal bridge/dev operations.
- This app should not contain private keys, relayer signer keys, or AWS secrets.
