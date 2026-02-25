#!/usr/bin/env bash
set -euo pipefail

PID_DIR="${HEPTAD_PID_DIR:-/tmp}"

stop_pid_file() {
  local pid_file="$1"
  [[ -f "$pid_file" ]] || return 0

  local pid
  pid="$(cat "$pid_file" 2>/dev/null || true)"
  if [[ -z "$pid" ]]; then
    rm -f "$pid_file"
    return 0
  fi

  if kill -0 "$pid" 2>/dev/null; then
    kill "$pid" 2>/dev/null || true
    echo "stopped pid=$pid ($pid_file)"
  else
    echo "not running pid=$pid ($pid_file)"
  fi

  rm -f "$pid_file"
}

main() {
  shopt -s nullglob
  local files=("$PID_DIR"/heptad-sepolia-*.pid "$PID_DIR"/heptad-opnet-burn-*.pid)
  if [[ ${#files[@]} -eq 0 ]]; then
    echo "no pid files found in $PID_DIR"
    return 0
  fi

  for f in "${files[@]}"; do
    stop_pid_file "$f"
  done
}

main "$@"
