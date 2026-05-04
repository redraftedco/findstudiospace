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
- [x] Hero redesign — fills 100svh, negative space, "Own a studio? List free →" anchored to bottom fold.
- [x] Listing detail page redesign — spec table (Type/Neighborhood/Size/Monthly) + feature tag pills + description block. Offer + UnitPriceSpecification schema added.
- [x] Organization JSON-LD schema added to /portland (was missing; had LocalBusiness + WebSite only).
- [x] Pillar pages noindex fix — MIN_PILLAR_LISTINGS_FOR_INDEX set to 0 (was 3, blocking all 4 pillar pages).
- [x] 20 active listings had indexable=false — fixed via SQL; all now included in sitemap.
- [x] Portland hero count inconsistency fixed — removed hardcoded "126" from meta description; now pulls live count.
- [x] outreach_status DB constraint extended — added 'review' and 'approved' to allowed values (migration applied).
- [x] acquisition_source constraint fix — changed 'manual_seed' to 'manual' in queueSequence.ts.
- [x] prospect-places partial index fix — removed onConflict constraint; 107 targets discovered in first run.
- [x] Blog internal links audit — all 16 posts verified; no broken links found.
- [x] All 16 blog posts confirmed to have FAQPage schema — no gaps.
- [x] Sitemap completeness verified — all listing/neighborhood/blog/pillar pages included.

---

## SEARCH CONSOLE INDEX SUBMISSIONS

### Submitted ✓
- [x] `https://www.findstudiospace.com/portland`
- [x] `https://www.findstudiospace.com/central-eastside`
- [x] `https://www.findstudiospace.com/slabtown`
- [x] `https://www.findstudiospace.com/makerspace-portland`
- [x] `https://www.findstudiospace.com/video-production-studios-portland`

### Deferred (submit in next batch)
- [ ] `/podcast-studios`
- [ ] `/kerns`
- [ ] `/mississippi-ave`
- [ ] `/division-street`
- [ ] `/sellwood`
- [ ] `/st-johns`
- [ ] `/blog/creative-workspace-rental-portland-guide`
- [ ] `/blog/questions-to-ask-before-renting-studio-portland`
- [ ] `/blog/pearl-district-vs-central-eastside-studio`
- [ ] `/blog/how-to-rent-podcast-studio-portland`
- [ ] `/blog/how-to-rent-event-space-portland`
- [ ] `/blog/portland-studio-market-2026`
- [ ] `/blog/photo-studio-rental-portland`
- [ ] `/blog/studio-space-cost-portland`
- [ ] `/blog/art-studio-rental-guide-portland`

**Also resubmit sitemap in GSC** to surface the 20 newly-indexable listing pages.

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

- [ ] **Atlanta hero text color** — user confirmed page exists (DB: id=2, slug='atlanta', is_active=false). Green accent text in hero needs to be red. Source not yet pinpointed — check CITY_CONFIG accent or inline style in app/[city]/page.tsx.
- [ ] **Listing description rewrites** — 69 active Portland listings, most have thin/missing descriptions. Action plan: (1) export all listing IDs + names + type + amenities from Supabase, (2) generate descriptions via AI batch (category-aware prompts), (3) apply via SQL UPDATE. File: docs/description-rewrites.sql (may need to be created).
- [ ] **GSC deferred index submissions** — see Index Submissions section above.
- [ ] **Approve acquisition_targets rows** — 31 rows at outreach_status='review' in Supabase. Manual approval required before send-outreach cron will send.
- [ ] **Run more enrich-targets cycles** — 51 rows still at 'pending' enrichment status.
- [ ] **Google Business Profile** — deferred by owner.
- [ ] **Monetization pivot to take-rate** — booking flow, Stripe Connect, calendar/availability. Day-90 revenue target dependency.
- [ ] **IP-based rate limiting on `/api/claim/send-magic-link`** — defer until abuse observed.
- [ ] **Apollo email enrichment** — requires `APOLLO_API_KEY`. See `lib/enrichment/apolloFallback.ts`.
- [ ] **Inventory rebalance ingest** — requires ingestion data source run.
