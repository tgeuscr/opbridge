#!/usr/bin/env bash
set -euo pipefail

source "$(dirname "$0")/ops/lib/common.sh"
ensure_repo_root
require_cmd npm
require_cmd node

require_env SEPOLIA_RPC_URL
require_env RELAYER_EVM_KMS_KEY_IDS
if [[ -z "${SEPOLIA_DEPLOYER_PRIVATE_KEY:-}" ]]; then
  require_env MNEMONIC
  SEPOLIA_DEPLOYER_PRIVATE_KEY="$(derive_sepolia_pk_from_mnemonic "$MNEMONIC" "${SEPOLIA_DEPLOYER_ACCOUNT:-0}" "${SEPOLIA_DEPLOYER_INDEX:-0}" "${MNEMONIC_PASSPHRASE:-}")"
  export SEPOLIA_DEPLOYER_PRIVATE_KEY
  echo "Derived SEPOLIA_DEPLOYER_PRIVATE_KEY from MNEMONIC."
fi

export SEPOLIA_DEPLOYMENT_FILE="${SEPOLIA_DEPLOYMENT_FILE:-$(pwd)/contracts/ethereum/deployments/sepolia-latest.json}"
export RELAYER_THRESHOLD="${RELAYER_THRESHOLD:-2}"

if [[ -z "${OPNET_BRIDGE_HEX:-}" ]]; then
  echo "OPNET_BRIDGE_HEX not set; configure script will attempt to use deployment JSON opnet.bridgeHex." >&2
fi

npm run configure:release-relays:sepolia --workspace @opbridge/ethereum-contracts

echo "Configured Ethereum vault release relays."
