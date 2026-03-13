# Session Handoff

Date: 2026-03-13
Primary branch: `master`

## Focus Of This Session

- Investigated a failed OPNet-to-Ethereum withdrawal during OPNet reorg-resistance testing.
- Traced relayer/API behavior around `withdrawalId=13`.
- Fixed relayer parsing and aggregation issues that were causing valid canonical events to be dropped or misrepresented.
- Added confirmation gating and a shared bridge finality model for both bridge directions.
- Shifted API finality derivation to relayer heartbeat telemetry instead of direct OPNet API probing.

## Incident Summary

- `withdrawalId=13` was on the canonical surviving OPNet branch.
- Only `relayer-opnet-b` originally produced a release attestation row.
- `relayer-opnet-a` and `relayer-opnet-c` both skipped the same canonical burn tx:
  - tx hash: `06b605a781760a2ddf7e95c0e00b413f2d303fdfc370098ea93e3f6585216fcf`
  - block: `5746`
  - error: `non-canonical s; use ._s`
- The burn itself was valid and present in `block.rawTransactions`.
- Root cause was not a reorg removing the burn. It was a relayer implementation bug: parsed tx access could throw and veto attestation generation even though raw tx event data was sufficient.

## Main Fixes

### 1. Release candidate canonical payload reconstruction

- `services/relayer/src/aggregate-release-attestations.mjs`
- Ready release candidates were coming back with `canonicalPayload: null` because DB-backed aggregation dropped that derived field.
- Release aggregation now reconstructs canonical payload from `message_json`, mirroring the mint side.

### 2. Raw-first OPNet burn relayer event extraction

- `services/relayer/src/opnet-burn-poller.mjs`
- The OPNet burn poller now prefers raw tx event data for bridge event extraction.
- This prevents canonical `BurnRequested` / `MintFinalized` events from being lost when parsed tx access hits `ethers` canonicalization errors.

### 3. Confirmation gating before attesting

- `services/relayer/src/opnet-burn-poller.mjs`
- `services/relayer/src/sepolia-poller.mjs`
- Both pollers now gate attestation generation behind `RELAYER_MIN_CONFIRMATIONS`.
- This addresses the actual reorg safety risk:
  - relayers should not sign before origin-chain confirmation depth is met
  - candidates should only become ready from sufficiently deep origin events

### 4. Finality model exposed through API/UI

- `services/api/src/server.mjs`
- `apps/site/src/App.tsx`
- API responses now include:
  - `observationSource`
  - `finality`
- Website lookup flows now surface finality state instead of only ready/not-ready.

### 5. Heartbeat-driven finality computation

- `services/api/src/server.mjs`
- `services/relayer/src/opnet-burn-poller.mjs`
- `services/relayer/src/sepolia-poller.mjs`
- API originally tried to poll OPNet heads directly, but `https://testnet.opnet.org` did not behave like a normal JSON-RPC POST endpoint for the methods tried.
- The final design now follows the better pattern:
  - relayers publish `currentHead`, `finalizedHead`, `minConfirmations`, `nextFromBlock` in heartbeat detail
  - API derives `currentConfirmations` / `remainingConfirmations` from relayer telemetry
  - website just renders API state

## Commits Introduced

- `37e73d8` `Harden release relayer event handling`
- `871fb3b` `Prefer raw tx events in burn poller`
- `fe02282` `Require source confirmations before attesting`
- `3dd6156` `Expose bridge finality progress`
- `92bce2d` `Lazy-load OPNet head polling in API`
- `4a420c4` `Use plain RPC for OPNet API head polling`
- `514811d` `Derive bridge finality from relayer heartbeats`
- `bce4744` `Fix Sepolia relayer heartbeat head lookup`

Notes:

- `3dd6156` briefly crashed the API because of a hard runtime dependency on `opnet`.
- That was made non-fatal via `92bce2d`.
- `4a420c4` moved OPNet head polling to plain RPC, but that approach still proved unreliable for `testnet.opnet.org`.
- `514811d` is the real architectural resolution and should be treated as the intended final model.

## Deployment State Reached

### API host

- API is healthy.
- `/health` works publicly and on the private backend.
- Finality fields are exposed again.
- API now derives confirmation progress from relayer heartbeats, not direct OPNet probing.

### Relayer hosts

- All Sepolia relayers now publish structured heartbeat detail JSON.
- All OPNet burn relayers now publish structured heartbeat detail JSON.
- `/status` shows all 6 relayers as `ok`, not stale.

## Current Observable Behavior

- `GET /withdrawals/13` now shows:
  - `ready: true`
  - `processed: true`
  - populated `canonicalPayload`
  - `observationSource`
  - `finality`
- Older rows that were created before source enrichment may still have:
  - `observedAt: null`
  - `requiredConfirmations: null`
- New rows should carry those fields once attested by updated relayers.

## Finality Model

Same model is now used across both bridge directions:

- `observed`
- `confirming`
- `ready`
- `processed`

Same data shape:

- `sourceBlockNumber`
- `sourceBlockHash`
- `sourceTxHash`
- `observedAt`
- `requiredConfirmations`
- `currentConfirmations`
- `remainingConfirmations`

Chain-specific policy is handled by relayer configuration:

- Sepolia deposits:
  - currently intended around `10` confirmations
- OPNet withdrawals:
  - intended around `5` confirmations
  - during testing this was temporarily set to `1`

## Important Config Notes

- API service env file in use:
  - `/home/ssm-user/heptad-env/relayer-api.env`
- Do not confuse it with:
  - `/home/ssm-user/heptad/heptad-env/relayer-api.env`

Relayer finality now depends on fresh heartbeat detail being published in JSON form.

## Remaining Cleanup

1. Put OPNet relayers back to `RELAYER_MIN_CONFIRMATIONS=5` if testing at `1` is done.
2. Verify new deposit/withdrawal rows carry:
   - `observedAt`
   - `requiredConfirmations`
3. Consider backfilling / republishing older rows if you want those fields on historical entries.
4. Consider expanding the API/UI status model later with an explicit `reorged` state if orphan handling is added.

## Suggested First Checks Next Session

1. Confirm OPNet relayers are back on the intended threshold:
   - `journalctl -u heptad-relayer-opnet-burn@a -n 20 --no-pager`
   - same for `@b`, `@c`
2. Check finality on one fresh withdrawal:
   - `curl -s https://api.heptad.app/withdrawals/<ID> | jq .`
3. Check finality on one fresh deposit:
   - `curl -s https://api.heptad.app/deposits/<ID> | jq .`
4. Check relayer heartbeat health:
   - `curl -s https://api.heptad.app/status | jq .`

## Key Takeaway

- The original failed withdrawal was not primarily a reorg/finality disagreement.
- It was a relayer parsing bug exposed during reorg testing.
- The actual security risk remains premature attestation before origin finality.
- The system now has:
  - raw-first OPNet event extraction
  - confirmation-gated attestation
  - heartbeat-driven finality telemetry
  - API/UI exposure of bridge observation and finality state
