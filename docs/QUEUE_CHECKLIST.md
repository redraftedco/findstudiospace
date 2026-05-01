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

---

## CRITICAL — blocks revenue or has a live bug

- [ ] **Set `POSTAL_ADDRESS` in Vercel env vars** (manual — Vercel dashboard)
  Value: `FindStudioSpace, 1631 NE Broadway St, Portland, OR 97232-1425`
  Unblocks cold outreach.

- [ ] **Send batch-zero cold outreach** — 24 ranked targets in `docs/batch-zero-send-list.md`.
  Run: `GET /api/cron/send-outreach` with `Authorization: Bearer <CRON_SECRET>`.
  Dry-run first: append `?dry_run=1` to preview count without sending.

---

## HIGH — directly blocks traffic or revenue

- [ ] **Build `/portland/event-space` pillar page**
  KD 0, 660/mo Portland, 7K/mo national. Zero competition. Highest-value missing page.
  Needs: category config in `lib/config.ts`, FAQ schema, filters (rooftop, brewery, capacity,
  neighborhood), nav pill, sitemap update.

- [ ] **Build `/podcast-studios` national page** (NOT Portland-gated)
  KD 0–4, 2K/mo national. Fastest organic SEO win on the board.
  National URL = no `/portland/` prefix. Separate route under `app/podcast-studios/`.
  Needs: FAQ schema, JSON-LD ItemList, meta, sitemap, internal links from category pages.

- [ ] **Google Business Profile setup** (20 min manual, 5–14 day postcard verification lag)
  Maps pack for "near me" searches: event 3.4K/mo, podcast 2K/mo, photo 1.4K/mo.
  Do this before any other manual tasks — the lag is the constraint.

- [ ] **Production category data audit** — run live DB query to find listings that
  `classifyListingToPillar()` returns `null` or multiple matches. Export list.
  Requires Supabase session or MCP execute_sql.

---

## MEDIUM — growth work

- [ ] **Ahrefs niche restructure** (TODO.md Ticket 5 — full plan there)
  Kill intent-trap pills: dance, yoga, recording-studio, art-studio (generic).
  Build 6 new landing pages in priority order (event, podcast, photo, industrial, neighborhood, maker/video).
  SEO title rule: every page must include "rental," "book," or "for rent."

- [ ] **Monetization pivot to take-rate** — 10% per booking for short-term spaces
  (event, photo, podcast, video, industrial). Keep $29/mo for long-term (maker, artist studio).
  Requires: booking request flow, calendar/availability, Stripe Connect or hold-and-capture.
  Prerequisite for Day-90 $1.5K MRR target.

- [ ] **Dashboard analytics charts** (Phase 2, gate behind `tier = 'pro'`)
  Daily views chart, inquiry trend line, "rank in neighborhood" metric.
  TODO.md Ticket 4.

- [ ] **Schema completion pass**
  - [ ] Category pages `ItemList` JSON-LD (verify all 21 configs have it)
  - [ ] Listing pages `LocalBusiness` JSON-LD field audit (no empty/null keys emitted)

- [ ] **Trust signal pass on listing pages**
  - [ ] website link displayed
  - [ ] instagram displayed
  - [ ] phone displayed
  - [ ] neighborhood/address visibility

- [ ] **Submit CTA pass**
  - [ ] Header link to `/submit`
  - [ ] Homepage CTA to `/submit`

---

## LOW — deferred / stable

- [ ] **IP-based rate limiting on `/api/claim/send-magic-link`** — deferred until abuse observed.
  Current: relies on Supabase built-in OTP 60s rate limit.
  Fix when needed: Upstash Redis or Vercel edge rate limiting.

- [ ] **GSC submission verification** — blocked on Search Console access/session.

---

## Blocked / External

- [ ] Inventory rebalance ingest (5–10 content + 5–10 photo): requires ingestion data source run.
- [ ] Apollo email enrichment activation: requires `APOLLO_API_KEY` and REST API access.
  See `lib/enrichment/apolloFallback.ts` for activation steps.
