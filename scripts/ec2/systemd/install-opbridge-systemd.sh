#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../../.." && pwd)"
UNIT_SRC_DIR="$ROOT_DIR/scripts/ec2/systemd"
UNIT_DST_DIR="/etc/systemd/system"

echo "Installing OP_BRIDGE systemd unit templates from: $UNIT_SRC_DIR"

sudo install -m 0644 "$UNIT_SRC_DIR/opbridge-relayer-ethereum@.service" "$UNIT_DST_DIR/"
sudo install -m 0644 "$UNIT_SRC_DIR/opbridge-relayer-opnet@.service" "$UNIT_DST_DIR/"
sudo install -m 0644 "$UNIT_SRC_DIR/opbridge-relayer-api.service" "$UNIT_DST_DIR/"
sudo install -m 0644 "$UNIT_SRC_DIR/opbridge-relayer-aggregate-mint.service" "$UNIT_DST_DIR/"
sudo install -m 0644 "$UNIT_SRC_DIR/opbridge-relayer-aggregate-mint.timer" "$UNIT_DST_DIR/"
sudo install -m 0644 "$UNIT_SRC_DIR/opbridge-relayer-aggregate-release.service" "$UNIT_DST_DIR/"
sudo install -m 0644 "$UNIT_SRC_DIR/opbridge-relayer-aggregate-release.timer" "$UNIT_DST_DIR/"

sudo systemctl daemon-reload

cat <<'EOF'
Installed units:
  opbridge-relayer-ethereum@.service
  opbridge-relayer-opnet@.service
  opbridge-relayer-api.service
  opbridge-relayer-aggregate-mint.service
  opbridge-relayer-aggregate-mint.timer
  opbridge-relayer-aggregate-release.service
  opbridge-relayer-aggregate-release.timer

Before enable/start, sync runtime env files into ~/opbridge-env:
  RELAYER_API_URL=http://127.0.0.1:8787 \
    bash scripts/opbridge-host-env-sync.sh --role api
  RELAYER_API_URL=http://<api-box-private-ip>:8787 \
  RELAYER_KMS_KEY_ID=arn:aws:kms:...mldsa-a \
  RELAYER_EVM_KMS_KEY_ID=arn:aws:kms:...ecdsa-a \
    bash scripts/opbridge-host-env-sync.sh --role worker --instance a
  RELAYER_API_URL=http://<api-box-private-ip>:8787 \
  RELAYER_KMS_KEY_ID=arn:aws:kms:...mldsa-b \
  RELAYER_EVM_KMS_KEY_ID=arn:aws:kms:...ecdsa-b \
    bash scripts/opbridge-host-env-sync.sh --role worker --instance b
  RELAYER_API_URL=http://<api-box-private-ip>:8787 \
  RELAYER_KMS_KEY_ID=arn:aws:kms:...mldsa-c \
  RELAYER_EVM_KMS_KEY_ID=arn:aws:kms:...ecdsa-c \
    bash scripts/opbridge-host-env-sync.sh --role worker --instance c

Example enable/start:
  sudo systemctl enable --now opbridge-relayer-ethereum@a
  sudo systemctl enable --now opbridge-relayer-ethereum@b
  sudo systemctl enable --now opbridge-relayer-ethereum@c
  sudo systemctl enable --now opbridge-relayer-opnet@a
  sudo systemctl enable --now opbridge-relayer-opnet@b
  sudo systemctl enable --now opbridge-relayer-opnet@c
  sudo systemctl enable --now opbridge-relayer-api
  sudo systemctl enable --now opbridge-relayer-aggregate-mint.timer
  sudo systemctl enable --now opbridge-relayer-aggregate-release.timer

Manual run (debug):
  sudo systemctl start opbridge-relayer-aggregate-mint.service
  sudo systemctl start opbridge-relayer-aggregate-release.service

View logs:
  journalctl -u opbridge-relayer-ethereum@a -f
  journalctl -u opbridge-relayer-opnet@a -f
  journalctl -u opbridge-relayer-api -f
  journalctl -u opbridge-relayer-aggregate-mint.service -f
  journalctl -u opbridge-relayer-aggregate-release.service -f
  systemctl list-timers 'opbridge-relayer-aggregate-*'
EOF
