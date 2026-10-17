#!/bin/zsh
# Double-click to deploy the Delve to Life MCP server to mcp.delvetolife.com
cd "$(dirname "$0")"
if ! npx wrangler whoami 2>/dev/null | grep -q "associated with the email"; then npx wrangler login --browser=false > /tmp/wl.log 2>&1 & P=$!; sleep 8; open -a Safari "$(grep -o "https://dash.cloudflare.com/oauth2/auth[^ ]*" /tmp/wl.log | head -1)"; wait $P || exit 1; fi
python3 scripts/build-guides.py && npx wrangler deploy && sleep 20 && node scripts/smoke-test.mjs https://mcp.delvetolife.com/mcp
echo; echo "Done. You can close this window."
