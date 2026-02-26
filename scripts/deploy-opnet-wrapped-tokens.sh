#!/usr/bin/env bash
set -euo pipefail

source "$(dirname "$0")/ops/lib/common.sh"
ensure_repo_root
require_cmd npm

ENV_DIR="${HEPTAD_ENV_DIR:-$(default_env_dir)}"
mkdir -p "$ENV_DIR"

echo "Building OPNet wrapped token artifacts..."
npm run build:husdt --workspace @heptad/opnet-contracts
npm run build:hwbtc --workspace @heptad/opnet-contracts
npm run build:heth --workspace @heptad/opnet-contracts
npm run build:hpaxg --workspace @heptad/opnet-contracts

if [[ -n "${OPNET_DEPLOY_WRAPPED_CMD:-}" ]]; then
  echo "Running custom OPNet wrapped-token deploy command..."
  bash -lc "$OPNET_DEPLOY_WRAPPED_CMD"
fi

require_env OPNET_HUSDT_ADDRESS
require_env OPNET_HWBTC_ADDRESS
require_env OPNET_HETH_ADDRESS
require_env OPNET_HPAXG_ADDRESS

CONTRACTS_ENV="$ENV_DIR/contracts.env"
touch "$CONTRACTS_ENV"
upsert_env_line "$CONTRACTS_ENV" "OPNET_HUSDT_ADDRESS" "$OPNET_HUSDT_ADDRESS"
upsert_env_line "$CONTRACTS_ENV" "OPNET_HWBTC_ADDRESS" "$OPNET_HWBTC_ADDRESS"
upsert_env_line "$CONTRACTS_ENV" "OPNET_HETH_ADDRESS" "$OPNET_HETH_ADDRESS"
upsert_env_line "$CONTRACTS_ENV" "OPNET_HPAXG_ADDRESS" "$OPNET_HPAXG_ADDRESS"

if [[ "${SYNC_ENV_AFTER:-1}" == "1" ]]; then
  if [[ -f contracts/ethereum/deployments/sepolia-latest.json ]] && [[ -n "${OPNET_BRIDGE_ADDRESS:-}" && -n "${OPNET_BRIDGE_HEX:-}" ]]; then
    scripts/heptad-env-sync.sh
  fi
fi

echo "Recorded OPNet wrapped token addresses in $CONTRACTS_ENV"
