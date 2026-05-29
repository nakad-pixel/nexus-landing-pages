#!/usr/bin/env bash
# ─── Nexus: Scaffold a new client site ───────────────────────────────────────
# Usage: bash scripts/new-client.sh "Business Name" "+91XXXXXXXXXX" "City" "Niche"
set -e

BUSINESS_NAME="${1:-My Business}"
PHONE="${2:-+919999999999}"
CITY="${3:-Mumbai}"
NICHE="${4:-Business}"

SLUG=$(echo "$BUSINESS_NAME" | tr '[:upper:]' '[:lower:]' | sed 's/[^a-z0-9 ]//g' | tr ' ' '-' | cut -c1-30 | sed 's/-*$//')
DIR="clients/$SLUG"

if [ -d "$DIR" ]; then
  echo "⚠️  Client folder already exists: $DIR"
  exit 1
fi

mkdir -p "$DIR"

# Write meta.json
cat > "$DIR/meta.json" << METAEOF
{
  "business_name": "$BUSINESS_NAME",
  "slug": "$SLUG",
  "phone": "$PHONE",
  "city": "$CITY",
  "niche": "$NICHE",
  "deployed_at": "$(date +%Y-%m-%d)",
  "live_url": "https://$SLUG.pages.dev",
  "status": "PENDING"
}
METAEOF

# Write placeholder index.html (Claude will replace with the real site)
cat > "$DIR/index.html" << HTMLEOF
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>$BUSINESS_NAME | Coming Soon</title>
<style>body{background:#0a0a0a;color:#c9a96e;font-family:sans-serif;display:flex;align-items:center;justify-content:center;min-height:100vh;text-align:center;} h1{font-size:2rem;margin-bottom:1rem;} p{color:#888;}</style>
</head>
<body>
<div><h1>$BUSINESS_NAME</h1><p>$CITY &middot; $NICHE</p><p style="margin-top:2rem;color:#444">Site deploying via Nexus 3D Web Studio...</p></div>
</body>
</html>
HTMLEOF

echo "✅ Created: $DIR"
echo "📋 Next: replace $DIR/index.html with the full site, then:"
echo "   git add $DIR && git commit -m 'feat: add $SLUG' && git push"
echo "   Cloudflare Pages will auto-deploy to: https://nexus-landing-pages.pages.dev/$SLUG"
