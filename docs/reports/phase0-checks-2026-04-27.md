# Phase 0 Checks — 2026-04-27

## Footer legal links

Command:

```bash
rg -n "href=\"/privacy\"|href=\"/terms\"" app/layout.tsx app -g '*.tsx'
```

Result confirms global footer links exist in `app/layout.tsx`:
- `Privacy` link
- `Terms` link

## Placeholder image audit

Added script:
- `scripts/audit-listing-images.mjs`

Run status:
- blocked in local environment due missing `NEXT_PUBLIC_SUPABASE_URL` / `SUPABASE_SERVICE_KEY`.
- once env vars are available, run:

```bash
node scripts/audit-listing-images.mjs
```

This writes a report to:
- `docs/reports/listing-image-audit-YYYY-MM-DD.md`
