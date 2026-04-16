# Known Gaps

## Checkout has no ownership verification
The upgrade checkout accepts any listing_id + email combination without verifying the email owns the listing. The actual attack (paying to upgrade someone else's listing) is self-punishing and reversible via Stripe portal cancellation.

**Fix:** Claim flow with magic-link email verification. Deferred to Phase 3.5.

## Email gate not possible for scraped listings
131 of 132 active listings have null `submitted_by_email` and `contact_email` (scraped data). Email-based ownership verification requires either backfill or a separate claim/verification flow.

## Rate limiting is in-memory
Resets on every Vercel deploy. Production-grade rate limiting requires edge-based solution (Vercel WAF, Upstash Redis, or Cloudflare).
