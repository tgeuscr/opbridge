#!/usr/bin/env bash
set -euo pipefail

OP_BRIDGE_HOME="${OP_BRIDGE_HOME:-/home/ssm-user/opbridge}"
OP_BRIDGE_ENV_DIR="${OP_BRIDGE_ENV_DIR:-/home/ssm-user/opbridge-env}"
LOG_DIR="${OP_BRIDGE_LOG_DIR:-/tmp}"
PID_DIR="${OP_BRIDGE_PID_DIR:-/tmp}"
NVM_DIR="${NVM_DIR:-$HOME/.nvm}"
NODE_VERSION="${OP_BRIDGE_NODE_VERSION:-24}"

mkdir -p \
  "$OP_BRIDGE_HOME/services/relayer/.data/mint-attestations" \
  "$OP_BRIDGE_HOME/services/relayer/.data/release-attestations"

idx_for() {
  case "$1" in
    a) echo 0 ;;
    b) echo 1 ;;
    c) echo 2 ;;
    *) echo "Unknown relayer suffix: $1" >&2; exit 1 ;;
  esac
}

start_one() {
  local kind="$1" suffix="$2" index="$3"
  local pid_file log_file output_file run_script env_file

  if [[ "$kind" == "ethereum" ]]; then
    pid_file="$PID_DIR/opbridge-ethereum-$suffix.pid"
    log_file="$LOG_DIR/opbridge-ethereum-$suffix.log"
    output_file="$OP_BRIDGE_HOME/services/relayer/.data/mint-attestations/relayer-$suffix.json"
    run_script="run:ethereum"
    env_file="$OP_BRIDGE_ENV_DIR/ethereum-$suffix.env"
  else
    pid_file="$PID_DIR/opbridge-opnet-$suffix.pid"
    log_file="$LOG_DIR/opbridge-opnet-$suffix.log"
    output_file="$OP_BRIDGE_HOME/services/relayer/.data/release-attestations/relayer-$suffix.json"
    run_script="run:opnet"
    env_file="$OP_BRIDGE_ENV_DIR/opnet-$suffix.env"
  fi

  if [[ -f "$pid_file" ]]; then
    local existing_pid
    existing_pid="$(cat "$pid_file" 2>/dev/null || true)"
    if [[ -n "${existing_pid}" ]] && kill -0 "$existing_pid" 2>/dev/null; then
      echo "skip ${kind}-${suffix}: already running (pid=$existing_pid)"
      return 0
    fi
    rm -f "$pid_file"
  fi

  (
    cd "$OP_BRIDGE_HOME"
    if ! command -v npm >/dev/null 2>&1; then
      if [[ -s "$NVM_DIR/nvm.sh" ]]; then
        # shellcheck disable=SC1090
        . "$NVM_DIR/nvm.sh"
        nvm use "$NODE_VERSION" >/dev/null
      fi
    fi
    command -v npm >/dev/null 2>&1 || { echo "npm not found (tried NVM_DIR=$NVM_DIR)"; exit 1; }

    set -a
    . "$OP_BRIDGE_ENV_DIR/relayer-common.env"
    . "$env_file"
    RELAYER_ID="${RELAYER_ID:-relayer-$suffix}"
    RELAYER_INDEX="$index"
    RELAYER_OUTPUT_FILE="$output_file"
    set +a

    nohup npm run "$run_script" --workspace @opbridge/relayer > "$log_file" 2>&1 &
    echo "$!" > "$pid_file"
  )

  echo "started ${kind}-${suffix}: pid=$(cat "$pid_file") log=$log_file"
}

main() {
  for suffix in a b c; do
    index="$(idx_for "$suffix")"
    start_one "ethereum" "$suffix" "$index"
    start_one "opnet" "$suffix" "$index"
  done

  echo
  echo "Startup log tails:"
  for file in "$LOG_DIR"/opbridge-ethereum-*.log "$LOG_DIR"/opbridge-opnet-*.log; do
    [[ -e "$file" ]] || continue
    echo "== $file =="
    tail -n 3 "$file" || true
  done
}

main "$@"
