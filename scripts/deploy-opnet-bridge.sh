#!/usr/bin/env bash
set -euo pipefail

source "$(dirname "$0")/ops/lib/common.sh"
ensure_repo_root
require_cmd npm

ENV_DIR="${OP_BRIDGE_ENV_DIR:-$(default_env_dir)}"
mkdir -p "$ENV_DIR"

echo "Building OPNet bridge artifact..."
npm run build:bridge --workspace @opbridge/opnet-contracts

if [[ -n "${OPNET_DEPLOY_BRIDGE_CMD:-}" ]]; then
  echo "Running custom OPNet bridge deploy command..."
  bash -lc "$OPNET_DEPLOY_BRIDGE_CMD"
fi

require_env OPNET_BRIDGE_ADDRESS
require_env OPNET_BRIDGE_HEX

CONTRACTS_ENV="$ENV_DIR/contracts.env"
touch "$CONTRACTS_ENV"
upsert_env_line "$CONTRACTS_ENV" "OPNET_BRIDGE_ADDRESS" "$OPNET_BRIDGE_ADDRESS"
upsert_env_line "$CONTRACTS_ENV" "OPNET_BRIDGE_HEX" "$OPNET_BRIDGE_HEX"

if [[ "${SYNC_ENV_AFTER:-1}" == "1" ]]; then
  if [[ -f contracts/ethereum/deployments/sepolia-latest.json ]] && \
     [[ -n "${OPNET_HUSDT_ADDRESS:-}" && -n "${OPNET_HWBTC_ADDRESS:-}" && -n "${OPNET_HETH_ADDRESS:-}" && -n "${OPNET_HPAXG_ADDRESS:-}" ]]; then
    scripts/opbridge-env-sync.sh
  fi
fi

echo "Recorded OPNet bridge addresses in $CONTRACTS_ENV"
echo "Bridge address: $OPNET_BRIDGE_ADDRESS"
echo "Bridge hex:     $OPNET_BRIDGE_HEX"
