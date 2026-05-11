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

if [ -z "${OPENAI_API_KEY:-}" ]; then
  echo "OPENAI_API_KEY is not set. Set it before running gpt-image-2 generation." >&2
  exit 1
fi

if [ ! -x "$VENV_DIR/bin/python" ]; then
  python3 -m venv "$VENV_DIR"
fi

"$VENV_DIR/bin/python" -m pip install --upgrade pip openai

mkdir -p "$ROOT_DIR/public/mockups/generated"

"$VENV_DIR/bin/python" "$IMAGE_GEN" generate \
  --model gpt-image-2 \
  --quality high \
  --size 2048x1152 \
  --prompt "Create a polished 16:9 desktop browser mockup for a product video scene. Resolution 1920x1080 feel, landscape. A realistic but brand-neutral web browser window is open on a warm cream background. Inside the browser, a person is clearly doing focused work: a document editor or project planning page with a left document area, subtle toolbar, tabs, and a small focus/timer panel. Several browser-style notification toasts appear from the top-right corner of the browser window, overlapping the page like real web notifications. Premium software product video, calm, editorial, stylish, high detail, clean spacing, subtle shadows, realistic UI density, warm off-white background, black and charcoal text, restrained accent colors. Not cartoonish, not playful UI, not a landing page. No real brand logos. No Chrome logo, no Google logo, no Slack logo. No readable long text except small generic UI fragments. Do not include a black hole. Do not include a cursor. Keep the top-right notification area clear enough for Remotion overlays." \
  --out "$ROOT_DIR/public/mockups/generated/work-browser-notifications.png" \
  --force

"$VENV_DIR/bin/python" "$IMAGE_GEN" generate \
  --model gpt-image-2 \
  --quality high \
  --size 2048x1152 \
  --prompt "Create a polished 16:9 desktop news website mockup for a product video scene. Resolution 1920x1080 feel, landscape. A brand-neutral Japanese-style online news portal is shown inside a large browser-like panel. The page has a clear news-site structure: header navigation, breaking-news label, ranked story list on the left, feature story card with an image on the right, small metadata rows, comment counts, and topic chips. The main story area should leave clean horizontal rows where Remotion can overlay Japanese headline text. Premium editorial technology brand video, stylish, calm, high information density, modern news UI, white cards, warm cream environment, restrained red and blue accents, crisp typography, subtle shadows. It should feel more like a real news product than a simple card mockup. No NewsPicks text. No real publication logos. No real company logos. No black hole. No cursor. Avoid text overflowing outside cards. Keep the left ranked headline rows clean and readable for animation overlays." \
  --out "$ROOT_DIR/public/mockups/generated/news-site-negative-headlines.png" \
  --force

echo "Generated:"
echo "  public/mockups/generated/work-browser-notifications.png"
echo "  public/mockups/generated/news-site-negative-headlines.png"
