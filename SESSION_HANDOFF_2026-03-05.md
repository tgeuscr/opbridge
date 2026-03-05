# Session Handoff — 2026-03-05

## Scope Completed
Refined `apps/site` visual/UX for testnet bridge onboarding and wallet connection flow, plus finalized brand assets for Heptad/OPNet usage.

## Key Changes
- Reworked `apps/site` styling to align with Heptad brand direction.
- Added Heptad wordmark + symbol assets (light/dark) and integrated wordmark in hero.
- Added OPNet-powered badge and updated hero copy to testnet-live framing.
- Added first-visit onboarding modal with bridge UX steps and localStorage dismissal.
- Replaced old wallet connect cards with icon-based connector UI:
  - Left: BTC + OP overlap (click to connect OP wallet)
  - Center: Heptad symbol and connection state text
  - Right: ETH + MetaMask overlap (click to connect MetaMask)
- Enforced connection readiness logic for bridging:
  - OP wallet must be on OPNet testnet
  - Ethereum wallet must be on Sepolia
- Removed the Bridge Policy section below wallet connection per latest request.
- Simplified connector visualization by removing problematic arc arrows.

## Asset Outputs in `apps/site/public/branding`
- `heptad-wordmark.svg`
- `heptad-wordmark-dark.svg`
- `heptad-logo.svg`
- `heptad-logo-dark.svg`
- `opnet-logo.svg`
- `op.svg`
- `btc.svg`
- `eth.svg`
- `metamask.svg`
- plus token icons already present (`usdt.svg`, `paxg.svg`)

## Build Verification
- `npm run build --workspace @heptad/site` passes.

## Notes
- There are unrelated pre-existing modifications in:
  - `scripts/OPS_TOOLING.md`
  - `scripts/ec2/systemd/heptad-relayer-api.service`
  - `services/api/README.md`
  - `services/api/src/server.mjs`
  - `scripts/ec2/nginx/` (untracked)
- These were intentionally left untouched in this commit.

