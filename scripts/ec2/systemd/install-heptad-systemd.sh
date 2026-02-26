#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../../.." && pwd)"
UNIT_SRC_DIR="$ROOT_DIR/scripts/ec2/systemd"
UNIT_DST_DIR="/etc/systemd/system"

echo "Installing Heptad systemd unit templates from: $UNIT_SRC_DIR"

sudo install -m 0644 "$UNIT_SRC_DIR/heptad-relayer-sepolia@.service" "$UNIT_DST_DIR/"
sudo install -m 0644 "$UNIT_SRC_DIR/heptad-relayer-opnet-burn@.service" "$UNIT_DST_DIR/"
sudo install -m 0644 "$UNIT_SRC_DIR/heptad-relayer-api.service" "$UNIT_DST_DIR/"
sudo install -m 0644 "$UNIT_SRC_DIR/heptad-relayer-aggregate-mint.service" "$UNIT_DST_DIR/"
sudo install -m 0644 "$UNIT_SRC_DIR/heptad-relayer-aggregate-mint.timer" "$UNIT_DST_DIR/"
sudo install -m 0644 "$UNIT_SRC_DIR/heptad-relayer-aggregate-release.service" "$UNIT_DST_DIR/"
sudo install -m 0644 "$UNIT_SRC_DIR/heptad-relayer-aggregate-release.timer" "$UNIT_DST_DIR/"

sudo systemctl daemon-reload

cat <<'EOF'
Installed units:
  heptad-relayer-sepolia@.service
  heptad-relayer-opnet-burn@.service
  heptad-relayer-api.service
  heptad-relayer-aggregate-mint.service
  heptad-relayer-aggregate-mint.timer
  heptad-relayer-aggregate-release.service
  heptad-relayer-aggregate-release.timer

Example enable/start:
  sudo systemctl enable --now heptad-relayer-sepolia@a
  sudo systemctl enable --now heptad-relayer-sepolia@b
  sudo systemctl enable --now heptad-relayer-sepolia@c
  sudo systemctl enable --now heptad-relayer-opnet-burn@a
  sudo systemctl enable --now heptad-relayer-opnet-burn@b
  sudo systemctl enable --now heptad-relayer-opnet-burn@c
  sudo systemctl enable --now heptad-relayer-api
  sudo systemctl enable --now heptad-relayer-aggregate-mint.timer
  sudo systemctl enable --now heptad-relayer-aggregate-release.timer

Manual run (debug):
  sudo systemctl start heptad-relayer-aggregate-mint.service
  sudo systemctl start heptad-relayer-aggregate-release.service

View logs:
  journalctl -u heptad-relayer-sepolia@a -f
  journalctl -u heptad-relayer-opnet-burn@a -f
  journalctl -u heptad-relayer-api -f
  journalctl -u heptad-relayer-aggregate-mint.service -f
  journalctl -u heptad-relayer-aggregate-release.service -f
  systemctl list-timers 'heptad-relayer-aggregate-*'
EOF
