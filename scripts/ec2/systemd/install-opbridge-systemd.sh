#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../../.." && pwd)"
UNIT_SRC_DIR="$ROOT_DIR/scripts/ec2/systemd"
UNIT_DST_DIR="/etc/systemd/system"

echo "Installing OP_BRIDGE systemd unit templates from: $UNIT_SRC_DIR"

sudo install -m 0644 "$UNIT_SRC_DIR/opbridge-relayer-ethereum@.service" "$UNIT_DST_DIR/"
sudo install -m 0644 "$UNIT_SRC_DIR/opbridge-relayer-opnet-burn@.service" "$UNIT_DST_DIR/"
sudo install -m 0644 "$UNIT_SRC_DIR/opbridge-relayer-api.service" "$UNIT_DST_DIR/"
sudo install -m 0644 "$UNIT_SRC_DIR/opbridge-relayer-aggregate-mint.service" "$UNIT_DST_DIR/"
sudo install -m 0644 "$UNIT_SRC_DIR/opbridge-relayer-aggregate-mint.timer" "$UNIT_DST_DIR/"
sudo install -m 0644 "$UNIT_SRC_DIR/opbridge-relayer-aggregate-release.service" "$UNIT_DST_DIR/"
sudo install -m 0644 "$UNIT_SRC_DIR/opbridge-relayer-aggregate-release.timer" "$UNIT_DST_DIR/"

sudo systemctl daemon-reload

cat <<'EOF'
Installed units:
  opbridge-relayer-ethereum@.service
  opbridge-relayer-opnet-burn@.service
  opbridge-relayer-api.service
  opbridge-relayer-aggregate-mint.service
  opbridge-relayer-aggregate-mint.timer
  opbridge-relayer-aggregate-release.service
  opbridge-relayer-aggregate-release.timer

Example enable/start:
  sudo systemctl enable --now opbridge-relayer-ethereum@a
  sudo systemctl enable --now opbridge-relayer-ethereum@b
  sudo systemctl enable --now opbridge-relayer-ethereum@c
  sudo systemctl enable --now opbridge-relayer-opnet-burn@a
  sudo systemctl enable --now opbridge-relayer-opnet-burn@b
  sudo systemctl enable --now opbridge-relayer-opnet-burn@c
  sudo systemctl enable --now opbridge-relayer-api
  sudo systemctl enable --now opbridge-relayer-aggregate-mint.timer
  sudo systemctl enable --now opbridge-relayer-aggregate-release.timer

Manual run (debug):
  sudo systemctl start opbridge-relayer-aggregate-mint.service
  sudo systemctl start opbridge-relayer-aggregate-release.service

View logs:
  journalctl -u opbridge-relayer-ethereum@a -f
  journalctl -u opbridge-relayer-opnet-burn@a -f
  journalctl -u opbridge-relayer-api -f
  journalctl -u opbridge-relayer-aggregate-mint.service -f
  journalctl -u opbridge-relayer-aggregate-release.service -f
  systemctl list-timers 'opbridge-relayer-aggregate-*'
EOF
