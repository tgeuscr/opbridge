#!/usr/bin/env bash
set -euo pipefail

source "$(dirname "$0")/ops/lib/common.sh"
ensure_repo_root
require_cmd npm
require_cmd node

require_env ETHEREUM_RPC_URL
require_env OPNET_BRIDGE_ADDRESS
require_env OPNET_BRIDGE_HEX
require_env OPNET_HUSDT_ADDRESS
require_env OPNET_HWBTC_ADDRESS
require_env OPNET_HETH_ADDRESS
require_env OPNET_HPAXG_ADDRESS

if [[ -z "${ETHEREUM_DEPLOYER_PRIVATE_KEY:-}" && -z "${SEPOLIA_DEPLOYER_PRIVATE_KEY:-}" ]]; then
  require_env MNEMONIC
  ETHEREUM_DEPLOYER_PRIVATE_KEY="$(derive_ethereum_pk_from_mnemonic "$MNEMONIC" "${ETHEREUM_DEPLOYER_ACCOUNT:-${SEPOLIA_DEPLOYER_ACCOUNT:-0}}" "${ETHEREUM_DEPLOYER_INDEX:-${SEPOLIA_DEPLOYER_INDEX:-0}}" "${MNEMONIC_PASSPHRASE:-}")"
  export ETHEREUM_DEPLOYER_PRIVATE_KEY
  echo "Derived ETHEREUM_DEPLOYER_PRIVATE_KEY from MNEMONIC (account=${ETHEREUM_DEPLOYER_ACCOUNT:-${SEPOLIA_DEPLOYER_ACCOUNT:-0}} index=${ETHEREUM_DEPLOYER_INDEX:-${SEPOLIA_DEPLOYER_INDEX:-0}})."
fi
export ETHEREUM_RPC_URL="${ETHEREUM_RPC_URL:-${SEPOLIA_RPC_URL:-}}"
export ETHEREUM_DEPLOYER_PRIVATE_KEY="${ETHEREUM_DEPLOYER_PRIVATE_KEY:-${SEPOLIA_DEPLOYER_PRIVATE_KEY:-}}"

export ETH_VAULT_OWNER="${ETH_VAULT_OWNER:-}"
export ETH_VAULT_FEE_RECIPIENT="${ETH_VAULT_FEE_RECIPIENT:-}"
export SEPOLIA_TEST_MINT_PER_TOKEN="${SEPOLIA_TEST_MINT_PER_TOKEN:-1000000}"

npm run deploy:ethereum --workspace @opbridge/ethereum-contracts

if [[ "${SYNC_ENV_AFTER:-1}" == "1" ]]; then
  scripts/opbridge-env-sync.sh
fi

echo
echo "Sepolia deploy complete. Next:"
echo "  1) verify opbridge-env/contracts.env and apps/site/.env.local"
echo "  2) run scripts/configure-ethereum-release-relays.sh"
