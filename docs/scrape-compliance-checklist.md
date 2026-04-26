# Step X — Scrape Compliance Checklist (gating doc)

**Status:** Active gate. Every scrape job must pass this checklist before execution.
**Owner:** Solo developer.
**Last reviewed:** 2026-04-26.

---

## Why this exists

Listing-discovery scrapes touch third-party content. Done wrong they expose us to:
- Terms-of-Service breach claims (civil)
- CFAA / state computer-misuse exposure (criminal in egregious cases)
- DMCA takedowns (forced delisting + reputation hit)
- Cloud-provider termination (Vercel ToS prohibits scraping that violates source ToS)
- CCPA / Oregon Consumer Privacy Act exposure if we collect PII without basis

This checklist is the gate. No scrape job runs until the relevant section is filled in for that specific source.

---

## Pre-scrape gate (must pass before any new source goes into rotation)

### 1. Source ToS review

For each source URL, paste the relevant clause text and a one-sentence interpretation.

- [ ] **Source identified:** \_\_\_\_\_ (e.g., `peerspace.com`, `giggster.com`, `portland.craigslist.org`)
- [ ] **ToS URL:** \_\_\_\_\_
- [ ] **Scraping clause text (verbatim):** \_\_\_\_\_
- [ ] **Interpretation (one sentence):** \_\_\_\_\_
- [ ] **Verdict:** Allowed / Allowed-with-conditions / Prohibited

Hard stops:
- "no automated access" → STOP, do not scrape
- "API only" → STOP, use the API or do not collect
- "non-commercial only" → STOP, we are commercial
- "must obtain written permission" → STOP unless permission obtained

### 2. robots.txt check

- [ ] Fetched `https://<host>/robots.txt` within last 7 days
- [ ] Path being scraped is NOT under a `Disallow:` rule for `User-agent: *`
- [ ] If `Crawl-delay:` is set, our rate-limit honors it
- [ ] If a specific path is allowed but with conditions, conditions are satisfied

robots.txt is not legally binding everywhere but ignoring it weakens any later defence and signals bad faith.

### 3. Rate-limit policy

- [ ] Concurrency cap: max 1 request at a time per source domain
- [ ] Inter-request delay: minimum 5 seconds (10 seconds for sources with explicit `Crawl-delay`)
- [ ] Daily volume cap: 200 requests/source/day for active discovery; 50 requests/source/day for re-verification
- [ ] User-Agent string identifies the project and includes a contact email so the source can request stop-via-email

### 4. Wayback Machine fallback (LEGAL: yes, with attribution)

The Internet Archive's snapshots are public-record copies. Reading from `web.archive.org/web/<timestamp>/<url>` is generally permitted under the Archive's own ToS for non-commercial reference and limited commercial reference. We use it only when:

- [ ] The live source is unreachable, deleted, or blocks our user-agent
- [ ] We cite the snapshot URL in the listing's `external_url` AND in `acquisition_source` field
- [ ] We do NOT scrape Archive at high volume (max 30 requests/min, per their published rate-limit guidance)
- [ ] We respect any `noarchive` meta tags found in the snapshot

If the original source's ToS prohibits scraping, the Wayback snapshot does NOT cure that — the ToS prohibition still applies to the underlying content. Wayback is a fallback for reach failures, not a ToS bypass.

### 5. PII handling for collected contact data

- [ ] Email addresses found in scrapes are stored ONLY in `listings.contact_email` (server-only access, RLS enforced)
- [ ] We do NOT export contact lists outside the project
- [ ] We do NOT use scraped emails for any purpose other than contacting the listed business about its own listing
- [ ] CAN-SPAM compliance is enforced separately (physical postal address in every commercial email; functional unsubscribe; truthful header)
- [ ] If a recipient asks us to remove their email, we comply within 10 business days and add the address to a suppression list

### 6. Attribution requirements

- [ ] Each scraped listing has `acquisition_source` populated with the source domain
- [ ] Each scraped listing has `external_url` populated with the original source URL
- [ ] Each scraped listing has `last_scraped_at` populated with the fetch timestamp
- [ ] If the source requires visible attribution on display (e.g., "via Peerspace"), that attribution is rendered on the listing detail page

### 7. Takedown SLA

- [ ] Inbox `redraftedco@gmail.com` is monitored for takedown requests
- [ ] Takedown SLA: action within 48 hours of receipt
- [ ] Takedown action: set `status='removed'`, set `indexable=false`, retain row for audit but exclude from all public surfaces and sitemap
- [ ] If the source itself sends a takedown for ALL their listings, bulk-disable that source's listings within 7 days

---

## Per-source pre-flight (fill in for each source before first scrape)

### Peerspace
- [ ] ToS verdict: \_\_\_\_\_
- [ ] robots.txt verdict: \_\_\_\_\_
- [ ] API available: yes — prefer API over scrape (Peerspace has a partner API)
- [ ] Decision: \_\_\_\_\_

### Giggster
- [ ] ToS verdict: \_\_\_\_\_
- [ ] robots.txt verdict: \_\_\_\_\_
- [ ] API available: \_\_\_\_\_
- [ ] Decision: \_\_\_\_\_

### Craigslist
- [ ] ToS verdict: Craigslist ToS explicitly prohibits scraping. **STOP.**
- [ ] Alternative: only follow direct landlord URLs found via Craigslist (one-shot fetch of a specific posting the user has linked) — NOT systematic discovery
- [ ] Decision: \_\_\_\_\_

### Tagvenue
- [ ] ToS verdict: \_\_\_\_\_
- [ ] robots.txt verdict: \_\_\_\_\_
- [ ] Decision: \_\_\_\_\_

### Swimply
- [ ] ToS verdict: \_\_\_\_\_
- [ ] robots.txt verdict: \_\_\_\_\_
- [ ] Decision: \_\_\_\_\_

### Open-web (landlord/property-manager websites)
- [ ] One-off enrichment fetches against a specific URL the user supplies are permitted (single-page lookup, not systematic crawling)
- [ ] robots.txt of the host is honored even for one-off fetches
- [ ] No header spoofing — User-Agent identifies the project
- [ ] Decision: ALLOWED for enrichment, NOT for systematic discovery

---

## Audit trail

Every scrape run logs (via existing `enrichment_attempted_at`, `enrichment_attempts`, `enrichment_status`, `last_scraped_at`, `acquisition_source`):
- Source
- Timestamp
- Number of listings touched
- Outcome distribution (success / no_email / no_website / failed)

Quarterly review: confirm checklist sections 1–7 still hold for each source in active rotation.

---

## Stop conditions (immediate halt)

- Source returns 4xx with text indicating block (e.g., 403 + "automated access blocked")
- Cloudflare or other bot-mitigation page served
- Terms-of-Service updated since last review (re-review required before resume)
- Takedown email received for any listing from a given source (re-review entire source)
- More than 5% of fetches in a 24-hour window returned 404 / removed (source pulled the dataset, stop)

When a stop condition fires: pause all jobs against that source, file a note in this doc, decide resume / abandon.

---

## Out of scope

This document does not cover:
- DMCA takedown letter drafting (separate template)
- Privacy policy / Terms of Service for findstudiospace.com itself (separate `/privacy` and `/terms` routes)
- CAN-SPAM compliance details (separate `/templates/*` cold-email checklist)
- Stripe / payment compliance (PCI-DSS scope is handled by Stripe-hosted checkout)
