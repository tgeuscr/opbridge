#!/usr/bin/env bash
set -euo pipefail

source "$(dirname "$0")/ops/lib/common.sh"
ensure_repo_root
require_cmd npm
require_cmd node

require_env SEPOLIA_RPC_URL
require_env OPNET_BRIDGE_ADDRESS
require_env OPNET_BRIDGE_HEX
require_env OPNET_HUSDT_ADDRESS
require_env OPNET_HWBTC_ADDRESS
require_env OPNET_HETH_ADDRESS
require_env OPNET_HPAXG_ADDRESS

if [[ -z "${SEPOLIA_DEPLOYER_PRIVATE_KEY:-}" ]]; then
  require_env MNEMONIC
  SEPOLIA_DEPLOYER_PRIVATE_KEY="$(derive_sepolia_pk_from_mnemonic "$MNEMONIC" "${SEPOLIA_DEPLOYER_ACCOUNT:-0}" "${SEPOLIA_DEPLOYER_INDEX:-0}" "${MNEMONIC_PASSPHRASE:-}")"
  export SEPOLIA_DEPLOYER_PRIVATE_KEY
  echo "Derived SEPOLIA_DEPLOYER_PRIVATE_KEY from MNEMONIC (account=${SEPOLIA_DEPLOYER_ACCOUNT:-0} index=${SEPOLIA_DEPLOYER_INDEX:-0})."
fi

export ETH_VAULT_OWNER="${ETH_VAULT_OWNER:-}"
export ETH_VAULT_FEE_RECIPIENT="${ETH_VAULT_FEE_RECIPIENT:-}"
export SEPOLIA_TEST_MINT_PER_TOKEN="${SEPOLIA_TEST_MINT_PER_TOKEN:-1000000}"

npm run deploy:sepolia --workspace @heptad/ethereum-contracts

if [[ "${SYNC_ENV_AFTER:-1}" == "1" ]]; then
  scripts/heptad-env-sync.sh
fi

echo
echo "Sepolia deploy complete. Next:"
echo "  1) verify heptad-env/contracts.env and apps/site/.env.local"
echo "  2) run scripts/configure-ethereum-release-relays.sh"
