# 🚀 Nexus Landing Pages — Master Repo

Central monorepo for all Nexus 3D Web Studio client sites.
Every subfolder inside `clients/` is a standalone site auto-deployed to Cloudflare Pages.

## 📁 Structure
```
nexus-landing-pages/
├── .github/workflows/     ← CI: auto-deploy changed client on push
├── shared/                ← Global CSS tokens, Three.js helpers, brand assets
├── clients/
│   └── the-black-touch/   ← Live: https://the-black-touch.pages.dev
│       ├── index.html
│       └── meta.json      ← Client metadata (name, phone, city, niche)
└── scripts/
    └── new-client.sh      ← Scaffold a new client folder in 1 command
```

## ⚡ Adding a New Client
```bash
bash scripts/new-client.sh "Business Name" "+91XXXXXXXXXX" "City" "Niche"
```
This creates `clients/<slug>/index.html` + `meta.json`.
Push to `main` → GitHub Actions detects the changed folder → Cloudflare Pages deploys it automatically.

## 🔗 Cloudflare Pages Setup (one-time, ~2 min)
1. Go to [Cloudflare Pages](https://pages.cloudflare.com) → **Create a project** → **Connect to Git**
2. Select `nakad-pixel/nexus-landing-pages`
3. Build settings:
   - **Framework preset**: None
   - **Build command**: (leave empty)
   - **Build output directory**: `/` (root)
4. Click **Save and Deploy**

Each client folder deploys as `https://<project-name>.pages.dev`.

## 🔄 n8n Webhook Trigger
When a new client is pushed, the GitHub Actions workflow fires a POST to the n8n webhook:
```
POST https://wolfy1223-hugging8n.hf.space/webhook/nexus-pipeline
{ business_name, phone, city, niche, owner_name, pain_point, website_url, live_url }
```
This triggers the full Nexus Sales Pipeline: CRM log → WhatsApp pitch.

## 📋 Client Index
| Client | Niche | City | Live URL |
|--------|-------|------|----------|
| The Black Touch | Interior Design | Mumbai | https://the-black-touch.pages.dev |
