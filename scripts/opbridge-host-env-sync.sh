#!/usr/bin/env bash
set -euo pipefail

source "$(dirname "$0")/ops/lib/common.sh"
ensure_repo_root

usage() {
  cat <<'EOF'
Usage:
  bash scripts/opbridge-host-env-sync.sh [--role api|worker|all] [--instance a|b|c] [--runtime-dir /home/ssm-user/opbridge-env]

Copies repo env templates from ./opbridge-env into the runtime env directory
used by the EC2 systemd units and applies optional host-specific overrides.

Examples:
  RELAYER_API_URL=http://127.0.0.1:8787 \
    bash scripts/opbridge-host-env-sync.sh --role api

  RELAYER_API_URL=http://10.0.1.25:8787 \
  ETHEREUM_RPC_URL_SECRET_REF=aws-sm://opbridge-mainnet#ethereumRpcUrl \
  OPNET_RPC_URL_SECRET_REF=aws-sm://opbridge-mainnet#opnetRpcUrl \
  RELAYER_API_WRITE_TOKEN_SECRET_REF=aws-sm://opbridge-mainnet#relayerApiWriteToken \
    bash scripts/opbridge-host-env-sync.sh --role worker --instance a

Optional overrides applied when present in the shell environment:
  RELAYER_API_URL
  RELAYER_API_WRITE_TOKEN
  RELAYER_API_WRITE_TOKEN_SECRET_REF
  ETHEREUM_RPC_URL
  ETHEREUM_RPC_URL_SECRET_REF
  OPNET_RPC_URL
  OPNET_RPC_URL_SECRET_REF
  RELAYER_API_HOST
  RELAYER_API_PORT
  RELAYER_API_CORS_ALLOWED_ORIGINS
  RELAYER_API_EXPECTED_RELAYER_NAMES
  RELAYER_API_DB_PATH
  RELAYER_MAPPING_FILE
  OPNET_BRIDGE_ADDRESS
  OPNET_BRIDGE_HEX
EOF
}

ROLE="all"
INSTANCE=""
RUNTIME_ENV_DIR="${OP_BRIDGE_RUNTIME_ENV_DIR:-${HOME}/opbridge-env}"
SOURCE_ENV_DIR="${OP_BRIDGE_ENV_DIR:-$(default_env_dir)}"

while [[ $# -gt 0 ]]; do
  case "$1" in
    --role)
      ROLE="${2:-}"
      shift 2
      ;;
    --instance)
      INSTANCE="${2:-}"
      shift 2
      ;;
    --runtime-dir)
      RUNTIME_ENV_DIR="${2:-}"
      shift 2
      ;;
    -h|--help)
      usage
      exit 0
      ;;
    *)
      echo "Unknown argument: $1" >&2
      usage >&2
      exit 1
      ;;
  esac
done

case "$ROLE" in
  api|worker|all) ;;
  *)
    echo "Unsupported role: $ROLE" >&2
    usage >&2
    exit 1
    ;;
esac

if [[ "$ROLE" == "worker" ]]; then
  case "$INSTANCE" in
    a|b|c) ;;
    *)
      echo "--instance must be one of: a, b, c when --role worker is used" >&2
      usage >&2
      exit 1
      ;;
  esac
fi

if [[ ! -d "$SOURCE_ENV_DIR" ]]; then
  echo "Source env dir not found: $SOURCE_ENV_DIR" >&2
  exit 1
fi

mkdir -p "$RUNTIME_ENV_DIR"

copy_file() {
  local src="$1"
  local dst="$2"
  if [[ ! -f "$src" ]]; then
    echo "Missing source env file: $src" >&2
    exit 1
  fi
  install -m 0600 "$src" "$dst"
  echo "Copied $(basename "$src") -> $dst"
}

copy_role_files() {
  case "$ROLE" in
    api)
      copy_file "$SOURCE_ENV_DIR/relayer-common.env" "$RUNTIME_ENV_DIR/relayer-common.env"
      copy_file "$SOURCE_ENV_DIR/relayer-api.env" "$RUNTIME_ENV_DIR/relayer-api.env"
      copy_file "$SOURCE_ENV_DIR/aggregator.env" "$RUNTIME_ENV_DIR/aggregator.env"
      copy_file "$SOURCE_ENV_DIR/contracts.env" "$RUNTIME_ENV_DIR/contracts.env"
      ;;
    worker)
      copy_file "$SOURCE_ENV_DIR/relayer-common.env" "$RUNTIME_ENV_DIR/relayer-common.env"
      copy_file "$SOURCE_ENV_DIR/contracts.env" "$RUNTIME_ENV_DIR/contracts.env"
      copy_file "$SOURCE_ENV_DIR/ethereum-${INSTANCE}.env" "$RUNTIME_ENV_DIR/ethereum-${INSTANCE}.env"
      copy_file "$SOURCE_ENV_DIR/opnet-${INSTANCE}.env" "$RUNTIME_ENV_DIR/opnet-${INSTANCE}.env"
      ;;
    all)
      local src
      for src in "$SOURCE_ENV_DIR"/*.env "$SOURCE_ENV_DIR"/contracts.env; do
        copy_file "$src" "$RUNTIME_ENV_DIR/$(basename "$src")"
      done
      ;;
  esac
}

apply_override_if_set() {
  local file="$1"
  local key="$2"
  if [[ -f "$file" && -n "${!key:-}" ]]; then
    upsert_env_line "$file" "$key" "${!key}"
  fi
}

copy_role_files

for key in \
  ETHEREUM_RPC_URL \
  ETHEREUM_RPC_URL_SECRET_REF \
  OPNET_RPC_URL \
  OPNET_RPC_URL_SECRET_REF \
  RELAYER_API_URL \
  RELAYER_API_DB_PATH \
  RELAYER_API_WRITE_TOKEN \
  RELAYER_API_WRITE_TOKEN_SECRET_REF \
  RELAYER_MAPPING_FILE \
  OPNET_BRIDGE_ADDRESS \
  OPNET_BRIDGE_HEX
do
  apply_override_if_set "$RUNTIME_ENV_DIR/relayer-common.env" "$key"
done

for key in \
  RELAYER_API_URL \
  RELAYER_API_DB_PATH \
  RELAYER_API_WRITE_TOKEN \
  RELAYER_API_WRITE_TOKEN_SECRET_REF
do
  apply_override_if_set "$RUNTIME_ENV_DIR/aggregator.env" "$key"
done

for key in \
  RELAYER_API_HOST \
  RELAYER_API_PORT \
  RELAYER_API_DB_PATH \
  RELAYER_API_CORS_ALLOWED_ORIGINS \
  RELAYER_API_EXPECTED_RELAYER_NAMES \
  RELAYER_API_WRITE_TOKEN \
  RELAYER_API_WRITE_TOKEN_SECRET_REF
do
  apply_override_if_set "$RUNTIME_ENV_DIR/relayer-api.env" "$key"
done

echo
echo "Runtime env synced to: $RUNTIME_ENV_DIR"
case "$ROLE" in
  api)
    echo "Role: api"
    echo "Expected local API URL override: RELAYER_API_URL=http://127.0.0.1:8787"
    ;;
  worker)
    echo "Role: worker (${INSTANCE})"
    echo "Expected worker API URL override: RELAYER_API_URL=http://<api-box-private-ip>:8787"
    ;;
  all)
    echo "Role: all"
    ;;
esac
