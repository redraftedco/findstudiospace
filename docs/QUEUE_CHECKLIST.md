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

## Next in Queue
- [ ] **STEP X — Legal & Policy Compliance Audit (mandatory pre-check)** (full text stored in `docs/queue_items/step-x-legal-policy-compliance-audit.md`)
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
