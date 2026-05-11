#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
IMAGE_GEN="${CODEX_HOME:-$HOME/.codex}/skills/.system/imagegen/scripts/image_gen.py"
WINDOWS_CODEX_IMAGE_GEN="/mnt/c/Users/すのはら/.codex/skills/.system/imagegen/scripts/image_gen.py"
VENV_DIR="$ROOT_DIR/.venv-imagegen"

if [ ! -f "$IMAGE_GEN" ] && [ -f "$WINDOWS_CODEX_IMAGE_GEN" ]; then
  IMAGE_GEN="$WINDOWS_CODEX_IMAGE_GEN"
fi

if [ ! -f "$IMAGE_GEN" ]; then
  echo "image_gen.py not found: $IMAGE_GEN" >&2
  exit 1
fi

if [ ! -x "$VENV_DIR/bin/python" ]; then
  python3 -m venv "$VENV_DIR"
fi

"$VENV_DIR/bin/python" -m pip install --quiet --upgrade pip openai

"$VENV_DIR/bin/python" "$IMAGE_GEN" generate \
  --prompt "Setup check" \
  --out "$ROOT_DIR/tmp/imagegen/setup-check.png" \
  --dry-run >/dev/null

echo "Image generation CLI is ready."
