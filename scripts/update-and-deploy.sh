#!/usr/bin/env bash
#
# Refresh the chart's data from your local DB and redeploy GitHub Pages.
#
# What it does:
#   1. Pulls the latest data from your locally-running uvicorn API.
#   2. Writes it to app/data.json (baked into the next build).
#   3. Commits + pushes, which triggers the existing Pages deploy workflow.
#
# Requires: your uvicorn process running, plus `curl`, `git`, and `python3`.
#
# Usage:
#   ./scripts/update-and-deploy.sh
#   DATA_URL=http://localhost:8000/days ./scripts/update-and-deploy.sh   # override endpoint
#
set -euo pipefail

# ---- Configure this to your endpoint -----------------------------------------
# Must return a JSON object with a "days" array, where each day has at least
# "date" and "productive_minutes" { Coding, Studying, Writing, Other }:
#   { "days": [ { "date": "2026-06-25", "productive_minutes": {...}, ... }, ... ] }
DATA_URL="${DATA_URL:-http://localhost:8000/days}"
# ------------------------------------------------------------------------------

# Run from the repo root regardless of where the script is invoked from.
cd "$(dirname "$0")/.."

DEST="app/data.json"
TMP="$(mktemp)"
trap 'rm -f "$TMP"' EXIT

echo "→ Fetching data from $DATA_URL"
if ! curl -fsS "$DATA_URL" -o "$TMP"; then
  echo "✗ Could not reach $DATA_URL — is uvicorn running? (data.json left unchanged)" >&2
  exit 1
fi

# Validate it's a JSON array before overwriting the real file, so a bad/empty
# response never ships an empty chart.
echo "→ Validating response"
python3 - "$TMP" <<'PY'
import json, sys
with open(sys.argv[1]) as f:
    data = json.load(f)                       # raises if not valid JSON
days = data.get("days") if isinstance(data, dict) else None
if not isinstance(days, list):
    sys.exit('response has no "days" array')
if len(days) == 0:
    sys.exit('"days" array is empty')
print(f"  ok — {len(days)} day(s)")
PY

mv "$TMP" "$DEST"

# Only commit/deploy if the data actually changed.
if git diff --quiet -- "$DEST"; then
  echo "→ No data changes — nothing to deploy."
  exit 0
fi

echo "→ Committing and pushing (this triggers the Pages deploy)"
git add "$DEST"
git commit -m "data: refresh $(date '+%Y-%m-%d %H:%M')"
git push

echo "✓ Pushed. GitHub Actions is now redeploying your site."
