#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
IMAGE_GEN="${CODEX_HOME:-$HOME/.codex}/skills/.system/imagegen/scripts/image_gen.py"
WINDOWS_CODEX_IMAGE_GEN="/mnt/c/Users/すのはら/.codex/skills/.system/imagegen/scripts/image_gen.py"
VENV_DIR="$ROOT_DIR/.venv-imagegen"

load_env_file() {
  local file="$1"

  if [ -f "$file" ]; then
    while IFS= read -r line || [ -n "$line" ]; do
      line="${line%$'\r'}"

      if [ -z "$line" ] || [[ "$line" == \#* ]]; then
        continue
      fi

      if [[ "$line" == export\ * ]]; then
        line="${line#export }"
      fi

      if [[ ! "$line" =~ ^[A-Za-z_][A-Za-z0-9_]*= ]]; then
        continue
      fi

      local key="${line%%=*}"
      local value="${line#*=}"

      if [[ "$value" == \"*\" ]] && [[ "$value" == *\" ]]; then
        value="${value:1:${#value}-2}"
      elif [[ "$value" == \'*\' ]] && [[ "$value" == *\' ]]; then
        value="${value:1:${#value}-2}"
      fi

      export "$key=$value"
    done < "$file"
  fi
}

load_windows_openai_key() {
  if [ -n "${OPENAI_API_KEY:-}" ] || ! command -v powershell.exe >/dev/null 2>&1; then
    return
  fi

  local windows_key
  windows_key="$(powershell.exe -NoProfile -Command '[Environment]::GetEnvironmentVariable("OPENAI_API_KEY","User")' 2>/dev/null | tr -d '\r' | tail -n 1)"

  if [ -n "$windows_key" ]; then
    export OPENAI_API_KEY="$windows_key"
  fi
}

if [ ! -f "$IMAGE_GEN" ] && [ -f "$WINDOWS_CODEX_IMAGE_GEN" ]; then
  IMAGE_GEN="$WINDOWS_CODEX_IMAGE_GEN"
fi

if [ ! -f "$IMAGE_GEN" ]; then
  echo "image_gen.py not found: $IMAGE_GEN" >&2
  exit 1
fi

if [ -n "${OPENAI_ENV_FILE:-}" ]; then
  load_env_file "$OPENAI_ENV_FILE"
fi

load_env_file "$ROOT_DIR/.env"
load_env_file "$ROOT_DIR/.env.local"
load_windows_openai_key

if [ ! -x "$VENV_DIR/bin/python" ]; then
  python3 -m venv "$VENV_DIR"
fi

if ! "$VENV_DIR/bin/python" -c "import openai" >/dev/null 2>&1; then
  "$VENV_DIR/bin/python" -m pip install --quiet --upgrade pip openai
fi

if [ -z "${OPENAI_API_KEY:-}" ]; then
  echo "OPENAI_API_KEY is not set." >&2
  echo "Set it in one of these places, then rerun npm run generate:pv-mockups:" >&2
  echo "  1. project .env.local: OPENAI_API_KEY=..." >&2
  echo "  2. current shell: export OPENAI_API_KEY=..." >&2
  echo "  3. Windows user environment variable OPENAI_API_KEY" >&2
  exit 1
fi

mkdir -p "$ROOT_DIR/public/mockups/generated"

"$VENV_DIR/bin/python" "$IMAGE_GEN" generate \
  --model gpt-image-2 \
  --quality high \
  --size 2048x1152 \
  --prompt "Create a polished 16:9 desktop browser mockup for a premium product video scene. Resolution 1920x1080 feel, landscape. A large brand-neutral browser window sits on a warm cream background. Inside the browser, show a realistic focused work session: a document editor or project planning page, left document area, subtle toolbar, tabs, small focus/timer panel, project summary cards. The right side of the browser must have a clean empty vertical lane reserved for animated notification overlays. Do not draw notification toast cards in that lane. A single very faint ghost placeholder is acceptable, but no readable notification text. Premium software product video, calm, editorial, stylish, high detail, clean spacing, subtle shadows, realistic UI density, warm off-white background, black and charcoal text, restrained accent colors. Not cartoonish, not playful UI, not a landing page. No real brand logos. No Chrome logo, no Google logo, no Slack logo. No readable long text except small generic UI fragments. Do not include a black hole. Do not include a cursor. Keep the right-top notification overlay area open and uncluttered." \
  --out "$ROOT_DIR/public/mockups/generated/work-browser-notifications.png" \
  --force

"$VENV_DIR/bin/python" "$IMAGE_GEN" generate \
  --model gpt-image-2 \
  --quality high \
  --size 2048x1152 \
  --prompt "Create a polished 16:9 desktop news website mockup for a premium product video scene. Resolution 1920x1080 feel, landscape. A brand-neutral Japanese-style online news portal is shown inside a large browser-like panel. The visual mood should be stylish but slightly tense: breaking news bar, market stress, layoff/economy/AI anxiety atmosphere, restrained red accents, subtle dark editorial contrast, still clean and premium. The left ranking column must contain five clean empty ranked rows with large numbers, category labels, comment icons, and generous blank space where Remotion will overlay Japanese headline text. Do not put headline text into the left ranking rows. The right feature story can show an abstract city or market image and generic UI details, but avoid optimistic sunny business-news feeling. Premium editorial technology brand video, high information density, modern news UI, white cards, warm cream environment, crisp typography, subtle shadows. No NewsPicks text. No real publication logos. No real company logos. No black hole. No cursor. Avoid text overflowing outside cards. Keep the left ranked headline rows clean and readable for animation overlays." \
  --out "$ROOT_DIR/public/mockups/generated/news-site-negative-headlines.png" \
  --force

echo "Generated:"
echo "  public/mockups/generated/work-browser-notifications.png"
echo "  public/mockups/generated/news-site-negative-headlines.png"
