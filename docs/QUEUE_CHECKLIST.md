# Queue Checklist (Revenue + SEO)

## Completed
- [x] Hide listing `1104` from public listing route.
- [x] Portland 4-pillar routes added and linked as primary nav.
- [x] Exact SEO titles/H1s applied for event-space, content-studios, photo-studios, makerspace.
- [x] Lead routing v1 added (`exclusive` for Pro + owner email, `shared` otherwise).
- [x] Supply-acquisition pipeline: prospector, enrichment crons, `acquisition_targets` table.
- [x] Cold outreach email templates (`lib/outreach/templates.ts`) — 5 category-specific templates.
- [x] `send-outreach` cron route (`/api/cron/send-outreach`) — manual trigger, 20-email cap, dry-run flag.
- [x] `/bot` page — crawler disclosure (required for scraping transparency).
- [x] CAN-SPAM gate (`lib/outreach/canSpamGate.ts`) — hard-throws if no address; falls back to `POSTAL_ADDRESS`.
- [x] `tier-policy.ts` free photo limit aligned to 5 (matches pricing page + submit API).
- [x] `.env.example` added to repo.
- [x] Category mapping hardening: centralized classifier, use on pillar pages + breadcrumbs.
- [x] Cron endpoints hardened — x-vercel-cron header + Bearer token required.
- [x] Rate limiting migrated from in-memory Map to Supabase-backed `rate_limits` table.
- [x] /pricing page — two offers only: Free listing ($0) + Sponsored Placement (from $49/mo).
- [x] Nav/footer category pills updated to 6 real DB types (art, workshop, photo, office, retail, fitness).
- [x] Homepage CATEGORY_PILLS updated; duplicate strip removed; CTA → /list-your-space.
- [x] /about page — categories, vetting copy, schema, browse links all updated.
- [x] /for-landlords — removed Music Studios, $49 pricing, Pro CTA → /claim.
- [x] /terms, /claim — $49/mo pricing corrected.
- [x] Blog post dates spread across April 2026 for crawl optics.
- [x] claimUrl() bug fixed: was generating /claim/:id (404), now /claim?listing_id=:id.
- [x] Cold email template doc and sublease blog: /submit → /list-your-space.
- [x] Duplicate listings deactivated: 28, 42, 84, 102 (kept 21 and 97).
- [x] Category data audit: deactivated 55 (therapy office), 60 (wellness co-op), 73 (LEASE PENDING).
- [x] Pillar classifier fixed: type=art/workshop/fitness short-circuits to TYPE_TO_PILLAR before MEDIA_TERMS.
- [x] Listing page TYPE_TO_LABEL fixed (office/retail were 'Event Space', fitness was 'Makerspace').
- [x] Listing page breadcrumb now links to real category routes (not old 4-pillar slugs).
- [x] ListingCard 'Workshop' label aligned to 'Workshop Space'.
- [x] Schema completion: FAQPage + ItemList + BreadcrumbList on all category pages; LocalBusiness null-cleanup on listing pages.
- [x] Trust signal pass: website, instagram, neighborhood all displayed on listing page. Phone skipped — 0 of 119 active listings have contact_phone data.
- [x] Submit CTA pass: /submit refs → /list-your-space throughout.
- [x] Build `/portland/event-space` pillar page — config, FAQ schema, ItemList, BreadcrumbList all live.
- [x] Build `/podcast-studios` national page — live at app/podcast-studios/page.tsx.
- [x] Ahrefs niche restructure (Ticket 5) — 10 blog posts, 5 neighborhood pages, schema shipped.
- [x] Dashboard analytics charts — marked complete by owner.
- [x] Search Console submission / verification — marked complete by owner.
- [x] Homepage “By area” links tiled cards — neighborhood links now match the “Browse by space” grid/card treatment.
- [x] Fastest high-monetization business model — chosen staged model: free listings, sponsored placement now, paid lead routing next, take-rate bookings later.
- [x] Site accent color standardized for conversion — bright lime replaced with accessible forest green accent system.
- [x] Claim/pricing conversion path aligned — retired Pro checkout CTA removed; owners are routed to Sponsored Placement.

---

## AWAITING USER ACTION (manual steps — cannot be automated)

- [ ] **Set `POSTAL_ADDRESS` in Vercel env vars**
  Key: `POSTAL_ADDRESS`
  Value: `findstudiospace, 9169 W State St #1791, Garden City, ID 83714`
  → Unblocks cold outreach pipeline.

- [ ] **Send batch-zero cold outreach** (blocked by above)
  24 targets ranked in `docs/batch-zero-send-list.md`.
  Run: `GET /api/cron/send-outreach?dry_run=1` first, then without dry_run.

---

## DEFERRED / FUTURE SPRINTS

- [ ] **Google Business Profile** — deferred by owner.
- [ ] **Monetization pivot to take-rate** — booking flow, Stripe Connect, calendar/availability. Day-90 revenue target dependency.
- [ ] **IP-based rate limiting on `/api/claim/send-magic-link`** — defer until abuse observed.
- [ ] **Apollo email enrichment** — requires `APOLLO_API_KEY`. See `lib/enrichment/apolloFallback.ts`.
- [ ] **Inventory rebalance ingest** — requires ingestion data source run.
