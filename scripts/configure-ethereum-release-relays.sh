#!/usr/bin/env bash
set -euo pipefail

source "$(dirname "$0")/ops/lib/common.sh"
ensure_repo_root
require_cmd npm
require_cmd node

require_env ETHEREUM_RPC_URL
require_env RELAYER_EVM_KMS_KEY_IDS
if [[ -z "${ETHEREUM_DEPLOYER_PRIVATE_KEY:-}" && -z "${SEPOLIA_DEPLOYER_PRIVATE_KEY:-}" ]]; then
  require_env MNEMONIC
  ETHEREUM_DEPLOYER_PRIVATE_KEY="$(derive_ethereum_pk_from_mnemonic "$MNEMONIC" "${ETHEREUM_DEPLOYER_ACCOUNT:-${SEPOLIA_DEPLOYER_ACCOUNT:-0}}" "${ETHEREUM_DEPLOYER_INDEX:-${SEPOLIA_DEPLOYER_INDEX:-0}}" "${MNEMONIC_PASSPHRASE:-}")"
  export ETHEREUM_DEPLOYER_PRIVATE_KEY
  echo "Derived ETHEREUM_DEPLOYER_PRIVATE_KEY from MNEMONIC."
fi

export ETHEREUM_RPC_URL="${ETHEREUM_RPC_URL:-${SEPOLIA_RPC_URL:-}}"
export ETHEREUM_DEPLOYER_PRIVATE_KEY="${ETHEREUM_DEPLOYER_PRIVATE_KEY:-${SEPOLIA_DEPLOYER_PRIVATE_KEY:-}}"
export ETHEREUM_DEPLOYMENT_FILE="${ETHEREUM_DEPLOYMENT_FILE:-${SEPOLIA_DEPLOYMENT_FILE:-$(pwd)/contracts/ethereum/deployments/sepolia-latest.json}}"
export RELAYER_THRESHOLD="${RELAYER_THRESHOLD:-2}"

if [[ -z "${OPNET_BRIDGE_HEX:-}" ]]; then
  echo "OPNET_BRIDGE_HEX not set; configure script will attempt to use deployment JSON opnet.bridgeHex." >&2
fi

npm run configure:release-relays:ethereum --workspace @opbridge/ethereum-contracts

echo "Configured Ethereum vault release relays."
