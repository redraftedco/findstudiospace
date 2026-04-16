# TODO

## TICKET 1 — Directory sort by is_featured DESC, created_at DESC
**Priority:** MUST ship before any cold email batch goes out.

**Files:**
- `app/[city]/page.tsx:116` — no `.order()`, sorts by image count in JS
- `app/[city]/[category]/page.tsx:33-37` — sorts by `tier === 'pro'` in JS, no secondary sort
- `app/portland/[category]/page.tsx:38-44` — no `.order()` call

**Fix:** Replace JS-side sorting with Supabase query:
```ts
.order('is_featured', { ascending: false })
.order('created_at', { ascending: false })
```

**Acceptance:** Pro listings appear above free listings on all three routes. Verify on `/portland`, `/portland/art-studio`, and `/portland/[any-category]`.

---

## TICKET 2 — Route validation for unknown cities/categories
**Priority:** Medium. Prevents broken pages from being indexed or confusing users.

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
