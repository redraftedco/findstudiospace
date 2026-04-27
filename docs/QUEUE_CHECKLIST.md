# Queue Checklist (Revenue + SEO)

## Completed
- [x] Hide listing `1104` from public listing route.
- [x] Portland 4-pillar routes added and linked as primary nav.
- [x] Exact SEO titles/H1s applied for:
  - `/portland/event-space`
  - `/portland/content-studios`
  - `/portland/photo-studios`
  - `/portland/makerspace`
- [x] Lead routing v1 added (`exclusive` for Pro + owner email, `shared` otherwise).

## In Progress
- [ ] Category mapping hardening: ensure every listing resolves to exactly one pillar category.
  - [x] Add centralized classifier (`lib/pillar-category.ts`).
  - [x] Use classifier on pillar category pages.
  - [x] Use classifier for listing → category breadcrumb link.
  - [ ] Run production data audit and export unclassified/edge-case listings (requires live DB run).
- [ ] **STEP Y — Platform legal hardening + trust safety pass** (Tier 1 started; full checklist in `docs/queue_items/step-y-platform-legal-hardening.md`)
  - [x] Tier 1 complete (Terms rewrite + liability cap + role clarity + assumption of risk + as-is clause)
  - [ ] Tier 2 complete (listing disclaimers + verification labeling + no intermediary implication + inquiry expectation language)
  - [ ] Tier 3 complete (privacy/data-sharing disclosure + lead data security verification)
  - [ ] Tier 4 complete (copyright + takedown/update process + messaging authority audit)
  - [ ] Tier 5 complete (monetization/legal alignment)
  - [ ] Tier 6 complete (route cleanup + footer legal links + end-to-end journey QA)

## Next in Queue

- [ ] **Master architecture action list execution** — run from `docs/action-list-master-playbook.md` in phase order (Phase 0 → Phase 4), with weekly KPI checkpointing.

- [ ] **Supply-acquisition scraper buildout** — prospector + enrichment + outreach pipeline.
  Adds `acquisition_targets` table, Google Places `textsearch` cron, Yelp
  Fusion cron (gated on `YELP_API_KEY`), Apollo email fallback, content
  classifier, robots.txt + per-domain throttle, Apollo sequence push at
  priority ≥70. Plan in `docs/fact-check-2026-04-26.md`.

- [ ] **Footer mailing address (CAN-SPAM blocker)** — replace
  `findstudiospace.com — Portland, OR` in `app/layout.tsx` with real UPS
  Store / postal address. Runtime gate added by scraper buildout will
  hard-fail outbound email until this is set. Required before sending any
  cold outreach legally.

- [ ] **Google Business Profile setup** — manual. Maps pack visibility for
  "near me" searches (event 3.4K/mo, podcast 2K/mo, photo 1.4K/mo). 20 min
  to create, 5–14 days for postcard verification.

- [ ] **Podcast standalone page** at `/portland/podcast-studio` — covers
  three BUILD-NOW keywords as one cluster:
  - podcast studio near me — SV 2,000, KD 0, CPC $0.80, TP 4,100
  - podcast studio rental near me — SV 250, KD 4, CPC $0.70, TP 500
  - podcast recording studio near me — SV 150, KD 1, CPC $0.80, TP 400
  Architectural decision: split out from `content-studios` pillar or keep
  nested. Standalone page wins on page-level topical focus. Needs nav,
  sitemap, internal links, FAQ schema, and category-mapping update.

- [ ] **STEP X — Legal & Policy Compliance Audit (mandatory pre-check)** (full text stored in `docs/queue_items/step-x-legal-policy-compliance-audit.md`)
- [ ] **STEP Y — Platform legal hardening + trust safety pass** (full text stored in `docs/queue_items/step-y-platform-legal-hardening.md`)
- [ ] Schema completion pass:
  - [ ] Category pages `ItemList` JSON-LD
  - [ ] Listing pages `LocalBusiness` JSON-LD field audit (no empty/null keys)
- [ ] Trust signal pass on listing pages:
  - [ ] website
  - [ ] instagram
  - [ ] phone
  - [ ] neighborhood/address visibility check
- [ ] Submit CTA pass:
  - [ ] Header link to `/submit`
  - [ ] Homepage CTA to `/submit`
  - [ ] Create `/submit` page if missing

## Blocked / External
- [ ] Inventory rebalance ingest (5–10 content + 5–10 photo): requires ingestion data source run.
- [ ] GSC submission verification: requires Search Console access/session.
