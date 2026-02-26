#!/usr/bin/env bash
set -euo pipefail

source "$(dirname "$0")/ops/lib/common.sh"
ensure_repo_root
require_cmd node

require_env OPNET_BRIDGE_ADDRESS

if [[ -z "${RELAYER_PUBLIC_CONFIG_FILE:-}" ]]; then
  export RELAYER_PUBLIC_CONFIG_FILE="$(pwd)/services/relayer/.data/relay-public-config.json"
fi

echo "OPNet bridge relay pubkey config"
echo "  bridge: $OPNET_BRIDGE_ADDRESS"
echo "  public config: $RELAYER_PUBLIC_CONFIG_FILE"
echo "  mode: ${SEND:-0}"

args=(set-relays)
if [[ "${SEND:-0}" == "1" || "${SEND:-false}" == "true" ]]; then
  args+=(--send)
fi

node scripts/ops/opnet-bridge-admin.mjs "${args[@]}"
