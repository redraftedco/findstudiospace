# TODO

## TICKET 1 — ~~Directory sort~~ DONE (feat/directory-sort)

---

## TICKET 2 — ~~Route validation~~ DONE (feat/route-validation)

**Files:**
- `app/[city]/page.tsx`
- `app/[city]/[category]/page.tsx`

**Fix:** If city not in allowed list OR category not in known slugs (art-studio, music-studio-rental, photo-studio-rental, workshop-space-rental, office-space-rental, fitness-studio-rental, retail-space-for-rent, dance-studio-rental), return `notFound()`.

**Acceptance:** `/feat/pro-tier-gaps` returns 404, not a broken page. Same for `/portland/nonexistent-category`.

---

## TICKET 3 — Rate limiting on /api/claim/send-magic-link
**Priority:** Low. Deferred until abuse observed post-launch.

**Current state:** Relies on Supabase built-in OTP rate limit (60s between sends per email).

**Fix when needed:** Add IP-based rate limiting via Upstash Redis or Vercel's built-in rate limiting.

---

## TICKET 4 — ~~Full dashboard analytics~~ COMPLETED

Marked complete by owner.

---

## TICKET 5 — Ahrefs-driven site restructure (NICHE ANALYSIS execution)
**Priority:** Not started. Execute after current hero/design work ships.

**Source doc:** Master Niche Analysis (Ahrefs data, 10+ keyword strings analyzed 2026-04-20).

**New pill structure (6 categories, in order):**
1. Event Space (7K/mo national, 660/mo Portland, KD 0–13, $1.20 CPC)
2. Podcast Studio (2.7K/mo national, KD 0–4, $0.80 CPC — NATIONAL play, not Portland-gated)
3. Photography Studio Rental (1.4K/mo national, 160/mo Portland — Portland overindexes at 15.6% of national)
4. Makerspace (8.5K/mo national, 124/mo Portland, KD 22)
5. Video/Production Studio (630/mo, $2.00 CPC — highest buyer value)
6. Industrial/Warehouse Space (1.5K/mo national, KD 0 — Portland Central Eastside, zero competitor owns)

**Kill from current pills (intent traps):** dance studio, yoga studio, recording studio (no "rental"), art studio (generic). Parent topics = classes/services, not rental.

**Landing pages to build (priority order):**
1. `/event-spaces-portland` — with filters: rooftop, brewery, restaurant private room, BYOB, kitchen, barn/farm, outdoor, industrial/warehouse, capacity, neighborhood
2. `/podcast-studios` (NATIONAL, not `/portland/`) — fastest SEO win, KD 0
3. `/photography-studios-portland` — with sub-types: cyc wall, natural light, white backdrop, green screen, self-service, product photography, boudoir, maternity
4. `/industrial-spaces-portland` — uncontested keyword space
5. Neighborhood pages (programmatic): `/alberta-arts-district`, `/central-eastside`, `/slabtown` — 508K Portland neighborhood searches with ZERO venue platforms ranking
6. `/makerspace-portland` and `/video-production-studios-portland` — lower priority, fragmented supply

**Content piece:** "Portland Fashion Week Venues" ($2.00 CPC, 150/mo, KD 0) — ties photo + event categories.

**SEO title rule:** Every rental page title/meta MUST include "rental," "book," or "for rent." Drops lose 80–90% of correct-intent traffic.

**Monetization shift (required before traffic ramp):**
- Take-rate 10% per booking on: event, photo, podcast, video, industrial (short-term, high-frequency)
- Keep $29/mo subscription for: makerspace, artist studio (long-term renters)
- Revenue projections in master doc assume this split.

**Supply roadmap (cold outreach, 8 weeks):**
- Week 1–2: 20–30 event venues (Central Eastside, Slabtown, Alberta Arts focus)
- Week 3–4: 10–15 photography studios
- Week 5–6: 5–8 makerspaces
- Week 7–8: 3–5 podcast studios

**Load-bearing action:** Event venue outreach in Month 2 is what crosses $1.5K MRR by Day 90–120. Everything else follows from it.

**Master doc location:** Paste/maintain in project root or `/docs/niche-analysis.md` when starting execution. Contains 11 sections: TAM, category rankings, keyword clusters by landing page, competitive landscape, Portland neighborhoods, CPC/buyer value map, filters/UX signals, intent trap list, traffic share intelligence, revenue projections, keyword master table.

---

## TICKET 6 — ~~Global design reskin~~ DONE (this branch)

Anton + Inter fonts, off-white #fafaf7 bg, forest green #2d5a3d, warm borders #e6e3dc. Bebas Neue and JetBrains Mono removed.

---

## TICKET 7 — ~~Em dash removal~~ DONE (this branch)

Zero em dashes in all app/ and components/ tsx files. Permanent no-em-dash rule in effect.

---

## TICKET 8 — Portland page full audit (46 items across 6 blocks)

**Priority:** High. Credibility blockers in BLOCK 1 affect every visitor now.

### BLOCK 1: Data cleanup (do first — visible credibility damage)
1. Fix/null bad prices: query listings WHERE city='portland' AND price < 50. Set corrupted prices ($1, $13, $22) to null so they show "Price on request."
2. Hide no-image listings from city page: add WHERE clause requiring at least one image URL in the query.
3. Deduplicate warehouse cluster: /listing/121–126 are six entries for the same property. Keep one, remove others.
4. Normalize listing titles: strip ALL CAPS, remove marketing filler ("NEW!", "Your Dream...Awaits!"), title-case.
5. Replace AI-generated descriptions with original scraped text, or null if not stored.
6. Audit neighborhood assignments: remove/flag listings outside Portland city limits (Oak Grove, Milwaukie).

### BLOCK 2: Image self-hosting (ticking time bomb)
7. Script to download all hotlinked images.craigslist.org images, upload to Supabase Storage, update image_url in DB.

### BLOCK 3: Design system migration
8. Portland city page to new design system.
9. All Portland subcategory pages to new design system.
10. All Portland neighborhood pages to new design system.
11. All Portland listing detail pages to match listing-detail.html template.

### BLOCK 4: SEO + structured data
12. Unique meta descriptions for Portland city page, 6 subcategory pages, 5 neighborhood pages.
13. JSON-LD LocalBusiness schema on every Portland listing page.
14. Verify sitemap covers all Portland listing, subcategory, and neighborhood pages.

### BLOCK 5: UX
15. Category filter chips on Portland city page (client-side, no backend change).
16. Pagination or lazy load at 24–30 listings per page.

### BLOCK 6: Verification
17. Full verification pass after all blocks complete.

---

## TICKET 9 — Add Seattle to homepage

Add Seattle alongside Portland and Atlanta in the homepage city section. Seattle city infrastructure already exists (commit 4157a23). Homepage just needs to surface it.
