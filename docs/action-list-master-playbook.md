# FindStudioSpace — Action List (Execution Version)

Last updated: April 27, 2026 (UTC)

This converts the strategy playbook into a prioritized, operator-ready checklist.

---

## Phase 0 (Today–72 hours): Stabilize trust + conversion baseline

- [x] Add listing-page trust block everywhere (owner-supplied data, verify before transacting).
- [x] Add explicit listing status labels (`Verified` vs `Unverified`) across listing cards and detail pages.
- [x] Remove/replace any copy implying guaranteed outcomes (response times, booking certainty).
- [ ] Audit all placeholder/missing listing images and patch top 25 traffic listings first. *(Audit script added: `scripts/audit-listing-images.mjs`; requires production Supabase env vars to run.)*
- [x] Publish clear landlord pricing details and feature matrix on public pages.
- [x] Confirm footer legal links (`/terms`, `/privacy`) are present and crawlable on all routes.

**KPIs**
- Listing-to-inquiry conversion rate > current baseline
- Placeholder-image share < 5% on top traffic pages
- 0 critical legal-link misses in route crawl

---

## Phase 1 (Week 1–2): Core marketplace architecture upgrades

### Product/UX
- [ ] Add map-based browsing to city/category pages (with neighborhood pins + quick filters).
- [ ] Introduce availability states (at minimum: available now, this week, this month).
- [ ] Implement short-duration price display support (hourly/daily/weekly where applicable).
- [ ] Add host response-time telemetry and visible trust metrics.

### Data model
- [ ] Expand listing schema for transaction readiness:
  - [ ] `pricing_mode` (hourly/daily/weekly/monthly)
  - [ ] `availability_state`
  - [ ] `verification_status`
  - [ ] `response_time_sla` (computed)
- [ ] Backfill `niche_attributes` quality for top categories.

**KPIs**
- Inquiry form completion rate
- Median time-to-first-inquiry < 48h for new listings
- % listings with complete imagery + pricing metadata > 90%

---

## Phase 2 (Week 2–4): SEO and demand engine buildout

### Local SEO execution
- [ ] Build high-intent “money pages” for neighborhood × use-case intersections.
- [ ] Add schema coverage audit:
  - [ ] `ItemList` on category pages
  - [ ] `LocalBusiness` completeness on listing pages
- [ ] Ship indexable tag routes for high-intent amenity clusters.
- [ ] Produce 4 priority content pages:
  - [ ] Portland breweries with private event spaces
  - [ ] Small/intimate wedding venues Portland
  - [ ] Team building venues Portland
  - [ ] Last-minute event spaces Portland

### Authority/citations
- [ ] Launch local citation campaign (arts orgs, chambers, local creative media).
- [ ] Add internal-linking modules from blog → category → listing pages.

**KPIs**
- Top-20 ranking count for target KD<15 queries
- Organic sessions to local landing pages
- Inquiry share attributable to SEO traffic

---

## Phase 3 (Month 2): Supply-side growth + monetization alignment

### Supply acquisition
- [ ] Run targeted outreach sprint for underrepresented inventory types:
  - [ ] Breweries/private dining
  - [ ] Podcast/video-ready studios
  - [ ] Makerspaces/light industrial
- [ ] Operationalize claim-to-activation workflow with SLA.
- [ ] Roll out monthly digest upsell experiments (A/B CTA variants).

### Monetization
- [ ] Finalize take-rate strategy and legal consistency before transaction features.
- [ ] Launch DFY funnel tracking (source → application → close rate).
- [ ] Add affiliate integrations to onboarding and relevant blog touchpoints.

**KPIs**
- Active supply growth rate (MoM)
- Pro upgrade conversion rate from digest traffic
- LTV:CAC trend toward >= 3:1

---

## Phase 4 (Month 2–3): Expansion playbook (new city launch)

### Market selection
- [ ] Score target cities (creative density, CRE stress, outreach feasibility).
- [ ] Select beachhead city (Seattle/Austin decision memo).

### 24-hour launch sequence
- [ ] Supply blitz: secure first 15–25 high-quality listings.
- [ ] Localized routing + neighborhood taxonomy + sitemap entries.
- [ ] Pre-seeded local money pages + geo-targeted campaigns.
- [ ] Activate demand only after minimum viable supply threshold is live.

**Launch KPIs**
- First-inquiry SLA for new listings < 48h
- Supply retention at 30 days
- CAC by channel and early payback signal

---

## Cross-cutting legal/compliance/security (run in parallel)

### Legal/compliance
- [ ] Keep Terms/Privacy synchronized with actual data/payment flows.
- [ ] Require landlord insurance attestation for hosted spaces.
- [ ] Maintain clear “lead-generation platform” posture (not broker/intermediary).
- [ ] Ensure host-directed pricing to avoid prohibited algorithmic coordination risks.

### Security engineering
- [x] Add/verify hardened security headers and CSP policy.
- [x] Enforce edge auth/rate limits on sensitive routes.
- [ ] Validate all server actions/API inputs with strict schemas.
- [ ] Confirm Supabase RLS coverage on all multi-tenant tables.
- [x] Verify Stripe webhook signatures and secret isolation.

**Security KPIs**
- 100% protected table RLS coverage
- 100% webhook signature verification pass
- 0 exposed secret regressions in CI scans

---

## Weekly operator cadence

- Monday: KPI review + backlog reprioritization
- Tuesday–Thursday: build + ship
- Friday: QA, route crawl, legal copy review, and post-ship metric snapshot

Suggested dashboard (minimum):
- Inquiry conversion rate
- Time-to-first-inquiry
- Listing completeness score
- Organic traffic to money pages
- Pro upgrade funnel metrics
