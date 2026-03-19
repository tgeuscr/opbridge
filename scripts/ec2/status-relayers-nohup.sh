#!/usr/bin/env bash
set -euo pipefail

PID_DIR="${OP_BRIDGE_PID_DIR:-/tmp}"
LOG_DIR="${OP_BRIDGE_LOG_DIR:-/tmp}"

print_status() {
  local name="$1" pid_file="$2"
  if [[ ! -f "$pid_file" ]]; then
    printf "%-20s %s\n" "$name" "missing pid file"
    return 0
  fi

  local pid
  pid="$(cat "$pid_file" 2>/dev/null || true)"
  if [[ -z "$pid" ]]; then
    printf "%-20s %s\n" "$name" "empty pid file"
    return 0
  fi

  if kill -0 "$pid" 2>/dev/null; then
    local cmd
    cmd="$(ps -p "$pid" -o args= 2>/dev/null || true)"
    printf "%-20s running pid=%s %s\n" "$name" "$pid" "$cmd"
  else
    printf "%-20s %s\n" "$name" "stale pid=$pid"
  fi
}

main() {
  for suffix in a b c; do
    print_status "ethereum-$suffix" "$PID_DIR/opbridge-ethereum-$suffix.pid"
    print_status "opnet-$suffix" "$PID_DIR/opbridge-opnet-$suffix.pid"
  done

  echo
  for file in "$LOG_DIR"/opbridge-ethereum-*.log "$LOG_DIR"/opbridge-opnet-*.log; do
    [[ -e "$file" ]] || continue
    echo "== $file =="
    tail -n 2 "$file" || true
  done
}

main "$@"
