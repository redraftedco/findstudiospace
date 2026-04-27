# Next Step Security Execution — 2026-04-27

## Completed

- Hardened global response headers in `next.config.ts`:
  - `X-Frame-Options: DENY`
  - `Cross-Origin-Opener-Policy: same-origin`
  - `Cross-Origin-Resource-Policy: same-site`
  - retained CSP and HSTS coverage
- Added middleware rate limiting for sensitive API endpoints:
  - `/api/lead-inquiries`
  - `/api/claim/send-magic-link`

## Notes

- Current rate limit window is 60 seconds.
- Limits are in-memory per runtime instance (sufficient as an immediate safeguard, not a distributed quota system).
- Stripe webhook signature verification was already implemented and remains in place.
