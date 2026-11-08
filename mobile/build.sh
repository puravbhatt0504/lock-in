#!/usr/bin/env bash
# Builds the phone copy of the practice tests into a folder (default: _site) for GitHub Pages.
# Same files as the extension's practice/ and the two mocks, plus a hub page and phone.js on every test page.
set -euo pipefail
cd "$(dirname "$0")/.."
out="${1:-_site}"
rm -rf "$out"
mkdir -p "$out/material"
cp -r chrome-extension/practice "$out/"
cp chrome-extension/material/mock-*.html chrome-extension/material/mock-*.js "$out/material/"
cp mobile/index.html mobile/phone.js "$out/"
for f in "$out"/practice/*.html "$out"/material/*.html; do
  grep -q '</head>' "$f" || { echo "no </head> in $f" >&2; exit 1; }
  perl -0pi -e 's#</head>#<script src="../phone.js"></script>\n</head>#' "$f"   # perl: same on Linux and macOS
done
echo "Built $out: $(find "$out" -type f | wc -l) files"
