#!/bin/bash
# Deploy WIR Redlist Explorer to Toolforge from the Git repo.
#
# Usage (on Toolforge):
#   become wir-redlist-explorer
#   git clone https://github.com/nethahussain/wir-redlist-explorer.git
#   cd wir-redlist-explorer
#   bash toolforge/deploy.sh

set -e

echo "=== WIR Redlist Explorer — Toolforge Deploy ==="

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"

mkdir -p ~/www/static
cp "$REPO_ROOT/tool.html" ~/www/static/index.html
cp "$REPO_ROOT/tool-uk.html" ~/www/static/tool-uk.html

echo "✅ Files deployed:"
ls -la ~/www/static/

webservice stop 2>/dev/null || true
webservice start

echo ""
echo "🔗 https://wir-redlist-explorer.toolforge.org/"
