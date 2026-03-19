#!/usr/bin/env bash
set -euo pipefail

repo_root() {
  local script_dir
  script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
  cd "${script_dir}/../../.." && pwd
}

ensure_repo_root() {
  cd "$(repo_root)"
}

require_cmd() {
  local cmd="$1"
  command -v "$cmd" >/dev/null 2>&1 || {
    echo "Missing required command: ${cmd}" >&2
    exit 1
  }
}

require_env() {
  local name="$1"
  if [[ -z "${!name:-}" ]]; then
    echo "Missing required env var: ${name}" >&2
    exit 1
  fi
}

default_env_dir() {
  echo "$(repo_root)/opbridge-env"
}

mkdir_p() {
  mkdir -p "$1"
}

upsert_env_line() {
  local file="$1"
  local key="$2"
  local value="$3"
  mkdir -p "$(dirname "$file")"
  touch "$file"
  if grep -qE "^${key}=" "$file"; then
    sed -i.bak "s|^${key}=.*$|${key}=${value}|" "$file"
    rm -f "${file}.bak"
  else
    printf '%s=%s\n' "$key" "$value" >>"$file"
  fi
}

derive_ethereum_pk_from_mnemonic() {
  local mnemonic="$1"
  local account="${2:-0}"
  local index="${3:-0}"
  local passphrase="${4:-}"
  node "$(repo_root)/scripts/ops/lib/derive-ethereum-key-from-mnemonic.mjs" \
    "$mnemonic" "$account" "$index" "$passphrase"
}
