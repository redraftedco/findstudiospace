## STEP X — LEGAL & POLICY COMPLIANCE AUDIT (MANDATORY PRE-CHECK)

This step must run BEFORE:

- scraping any source
- storing any data
- publishing any listing

If this step fails, the system must STOP for that source or listing.

---

## SOURCE-LEVEL COMPLIANCE CHECK

For every source domain:

Check and log:
- robots.txt rules for the target path
- whether the page is publicly accessible (no login, no paywall)
- whether scraping would require bypassing any technical restriction
- whether the site explicitly disallows scraping in visible terms
- whether the content appears intended for public indexing

Rules:
- If robots.txt disallows the path → DO NOT SCRAPE
- If login or authentication required → DO NOT SCRAPE
- If CAPTCHA, bot-block, or rate-limit must be bypassed → DO NOT SCRAPE
- If access control is being bypassed → DO NOT SCRAPE

Output:
- source_compliance_status (allowed / restricted / blocked)
- compliance_reason

---

## LISTING-LEVEL COMPLIANCE CHECK

For each scraped listing:

Check for:
- personal or sensitive data (private emails, names not tied to business, phone numbers not publicly listed)
- copyrighted long-form descriptions (full text reuse)
- images not clearly intended for reuse or listing display
- scraped content that appears private, gated, or user-generated without permission

Rules:
- Do not store or display personal/private data
- Do not copy full copyrighted descriptions; create short factual summaries instead
- Only use images that appear as public listing media
- Always retain source_url for attribution and traceability

Output:
- data_safety_flags (array)
- safe_to_store boolean
- safe_to_publish boolean

---

## DATA MINIMIZATION RULE

Only store what is required to:
- identify the space
- categorize it
- allow renter action

Do NOT store:
- personal identities unless clearly business-facing
- unnecessary scraped metadata
- hidden or embedded data not visible to users

---

## ATTRIBUTION & TRACEABILITY

Every listing MUST include:
- source_url
- source_domain
- scraped_at timestamp

This ensures:
- auditability
- rollback capability
- legal defensibility

---

## RISK SCORING

Assign compliance_risk_score:

Low:
- public page
- no restrictions
- business listing data
- clear rental intent

Medium:
- unclear terms
- weak attribution signals
- ambiguous ownership of content

High:
- scraping restrictions present
- potential copyrighted content misuse
- personal data risk
- access control concerns

Rules:
- Low → proceed
- Medium → flag for review
- High → block

---

## BLOCK CONDITIONS

The system must block scraping or publishing if ANY of the following are true:

- robots.txt disallows scraping
- login or authentication is required
- CAPTCHA or anti-bot system must be bypassed
- personal/private data detected
- high compliance_risk_score
- unclear legal right to access or reuse content

Blocked items must be:
- logged
- excluded from pipeline
- reported in scrape report

---

## COMPLIANCE REPORT OUTPUT

Every scrape run must include:

- total_sources_checked
- sources_allowed
- sources_blocked
- listings_flagged_for_compliance
- listings_blocked_for_compliance
- high_risk_listings_count
- medium_risk_listings_count

---

## ENFORCEMENT RULE

This compliance audit overrides ALL other systems.

Even if:
- listing is high quality
- category is high value
- demand is strong

If compliance fails → DO NOT USE DATA

---

## PRIORITY

No bypassing.
No workarounds.
No exceptions.

If uncertain → flag for review and stop.
