# Fact-Check — 2026-04-26

Verified state of `findstudiospace.com` against the strategic doc claims, before
the supply-acquisition scraper buildout.

## DB state (Supabase project `vnjsczhqhnzrplrdkolb`)

| Metric                              | Value | Doc claim     | Match |
|-------------------------------------|------:|---------------|-------|
| `listings` total                    |   141 | 131           | NO    |
| `listings` published                |   118 | —             | —     |
| `listings` indexable                |   117 | 117           | YES   |
| Indexable, no contact_email/owner   |    83 | 83            | YES   |
| Indexable with contact              |    34 | 34            | YES   |
| Listings in WA                      |     0 | 0 active      | YES   |
| Listings price < $100 or = 0        |     0 | 0 broken      | YES   |
| `niche_attributes` populated rows   |   136 | column exists | YES+  |
| `amenities` array populated rows    |     0 | column exists | EMPTY |
| `acquisition_targets` table exists  |     0 | n/a           | new   |

`niche_attributes` is the populated column for filtering. `amenities` is
defined but empty across the entire table — do not write filter UI against
`amenities`.

## Architecture state

- Pillars locked at four: `event-space`, `content-studios`, `photo-studios`,
  `makerspace`. Confirmed in `app/portland/[category]/config.ts`.
- Podcast lives **inside** `content-studios`. The pillar's H1 is
  "Podcast & Video Studio Rental in Portland" and `keywordInclude` covers
  `podcast`, `recording`, `video`, `production`, `creator`, `media`.
- A standalone `/portland/podcast-studio` route does **not** exist. Three
  BUILD-NOW podcast keywords (podcast studio near me, podcast studio rental
  near me, podcast recording studio near me) currently land on
  `content-studios` if they rank at all.
- A `photo-studio-rental` config exists alongside the `photo-studios` pillar.
  Verify which slug the sitemap and nav use before any further pillar work.

## Footer / CAN-SPAM

`app/layout.tsx` lines 76–87. The footer brand column shows only
"findstudiospace.com — Portland, OR". No street address. The placeholder
added in `8d06eb8` was removed by `1b11a6b` and never replaced.

**This is a hard blocker on every cold-email path.** Treat as a runtime
gate, not a TODO comment.

## Commits cited in the strategic doc — all verified

| SHA       | Subject                                                |
|-----------|--------------------------------------------------------|
| `2cc9bbc` | feat(seo): homepage title/H1/desc tweak for keyword targeting |
| `1e685f5` | feat(seo): swap homepage CATEGORY_PILLS to qualifying types   |
| `ef0da06` | feat(seo): harden LocalBusiness JSON-LD on listing detail pages |
| `ee142ca` | Merge PR #3 — domain verification + lead routing      |
| `a29adf9` | feat: nightly contact enrichment cron (Google Places + email scraper) |
| `8d06eb8` | Merge chore/footer-mailing — added CAN-SPAM placeholder |
| `1b11a6b` | remove stale placeholder text and TODO comments        |

## Existing scraper baseline (`/api/cron/enrich-contacts`)

- Cron 04:00 UTC daily. Batch 20. 4.5-min total budget.
- Google Places `findplacefromtext` → `details(website)` → fetch
  `/`, `/contact`, `/about` → email regex with obfuscation handling.
- Skips Places call when `website_url` already populated.
- Cooldown: 7 days between attempts. Max 3 attempts per row.
- `extractEmails.ts` handles `[at]`, `(at)`, `&#64;`, "user at domain dot
  com". Blocks noreply / postmaster / wordpress and sentry / mailchimp /
  example.com.
- Privacy: emails masked in logs as `abc...@domain.com`.
- **Operates only on rows already in `listings`.** Does not prospect.

## Decisions implied by the data

1. The 83-of-117 contact gap is a supply-acquisition problem, not a code
   problem. Scraper must prospect, not just enrich.
2. Existing `enrichment_*` columns + cron are reusable — the new scraper
   should write to a separate `acquisition_targets` table and feed the same
   enrichment pipeline.
3. `niche_attributes` already covers per-listing filterable attributes;
   building the photographer filter UI on top of it is unblocked when supply
   reaches ≥30 photo listings.
4. CAN-SPAM gate is a runtime hard-fail, enforced in code, not a doc TODO.
