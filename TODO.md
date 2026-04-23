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

## TICKET 4 — Full dashboard analytics (views over time, inquiry trend, neighborhood rank)
**Priority:** Phase 2. Build after Pro subscriptions exist.

**Current state:** Dashboard shows 30-day view count and total inquiry count as raw numbers.

**Fix:** Add daily views chart, inquiry trend line, and "rank in neighborhood" metric to `/dashboard/[listingId]`. Gate behind `tier = 'pro'`.

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
