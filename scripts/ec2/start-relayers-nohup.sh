#!/usr/bin/env bash
set -euo pipefail

HEPTAD_HOME="${HEPTAD_HOME:-/home/ssm-user/heptad}"
HEPTAD_ENV_DIR="${HEPTAD_ENV_DIR:-/home/ssm-user/heptad-env}"
LOG_DIR="${HEPTAD_LOG_DIR:-/tmp}"
PID_DIR="${HEPTAD_PID_DIR:-/tmp}"
NVM_DIR="${NVM_DIR:-$HOME/.nvm}"
NODE_VERSION="${HEPTAD_NODE_VERSION:-24}"

mkdir -p \
  "$HEPTAD_HOME/services/relayer/.data/mint-attestations" \
  "$HEPTAD_HOME/services/relayer/.data/release-attestations"

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
  local pid_file log_file output_file run_script

  if [[ "$kind" == "sepolia" ]]; then
    pid_file="$PID_DIR/heptad-sepolia-$suffix.pid"
    log_file="$LOG_DIR/heptad-sepolia-$suffix.log"
    output_file="$HEPTAD_HOME/services/relayer/.data/mint-attestations/relayer-$suffix.json"
    run_script="run:sepolia"
  else
    pid_file="$PID_DIR/heptad-opnet-burn-$suffix.pid"
    log_file="$LOG_DIR/heptad-opnet-burn-$suffix.log"
    output_file="$HEPTAD_HOME/services/relayer/.data/release-attestations/relayer-$suffix.json"
    run_script="run:opnet-burn"
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
    cd "$HEPTAD_HOME"
    if ! command -v npm >/dev/null 2>&1; then
      if [[ -s "$NVM_DIR/nvm.sh" ]]; then
        # shellcheck disable=SC1090
        . "$NVM_DIR/nvm.sh"
        nvm use "$NODE_VERSION" >/dev/null
      fi
    fi
    command -v npm >/dev/null 2>&1 || { echo "npm not found (tried NVM_DIR=$NVM_DIR)"; exit 1; }

    set -a
    . "$HEPTAD_ENV_DIR/relayer-common.env"
    . "$HEPTAD_ENV_DIR/relayer-$suffix.env"
    RELAYER_ID="relayer-$suffix"
    RELAYER_INDEX="$index"
    RELAYER_OUTPUT_FILE="$output_file"
    set +a

    nohup npm run "$run_script" --workspace @heptad/relayer > "$log_file" 2>&1 &
    echo "$!" > "$pid_file"
  )

  echo "started ${kind}-${suffix}: pid=$(cat "$pid_file") log=$log_file"
}

main() {
  for suffix in a b c; do
    index="$(idx_for "$suffix")"
    start_one "sepolia" "$suffix" "$index"
    start_one "opnet-burn" "$suffix" "$index"
  done

  echo
  echo "Startup log tails:"
  for file in "$LOG_DIR"/heptad-sepolia-*.log "$LOG_DIR"/heptad-opnet-burn-*.log; do
    [[ -e "$file" ]] || continue
    echo "== $file =="
    tail -n 3 "$file" || true
  done
}

main "$@"
