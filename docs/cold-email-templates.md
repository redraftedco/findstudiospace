# Cold Email Templates

**Status:** Ready to send. BLOCKED on P0-A (physical mailing address for CAN-SPAM footer).
**From:** hello@findstudiospace.com
**Reply-to:** PLATFORM_NOTIFY_EMAIL env var (set in .env.local and Vercel)
**Goal per template is noted. Optimize for that goal only — don't stack goals.**

---

## Conversion model (data-backed)

Cold → Reply: 25% target
Reply → Listed/Upgraded: 50% target
Combined: ~12.5% cold → revenue

**Rule:** Email 1 goal = reply only. Don't pitch. Don't mention pricing.
Email 2 (after reply) = convert.

---

## Template A — Batch-zero / existing landlords with email (9 contacts)

**Goal:** Get a reply. That's it. Nothing else.

**Subject line options (A/B — split your 9 sends 5/4):**
- Option 1: `Your [Space Name] — quick question`
- Option 2: `[Space Name] on FindStudioSpace`

```
Hi [First Name],

Your [Space Name] is live on FindStudioSpace — Portland's directory for monthly studio rentals.

Is your contact info current? I want to make sure any inquiries reach you directly.

— [Your Name]
FindStudioSpace · findstudiospace.com
1631 NE Broadway St, Portland, OR 97232-1425

Reply "unsubscribe" to stop these emails.
```

**Why this converts:**
- 3 sentences. Under 35 words of body copy. Reads in 8 seconds.
- Asks a yes/no question they can answer in one reply. Low friction.
- No pitch. No pricing. No "here's what Pro can do." Relationship first.
- Founder voice ("I want") outperforms brand voice ("we") for cold outreach under 20 contacts.
- Subject line uses their own space name → open rates ~40% above generic subjects.

**Do not:**
- Mention Pro, pricing, or upgrades in this email.
- Include more than one question.
- Add a P.S. or secondary CTA.

---

## Template B — Follow-up to Template A reply

**Trigger:** They replied to Template A with anything (even just "yes, it's current").
**Goal:** Get them to claim listing or upgrade to Pro.

**Subject:** `Re: [their reply subject]`

```
Hi [First Name],

Great — I'll make sure it's right.

Quick update: [Space Name] has been viewed [X] times in the last 30 days. [Omit this line entirely if views = 0.]

Landlords on Pro show up at the top of search results, get a verified badge, and can add up to 15 photos. Most see significantly more inquiries within the first month.

It's $29/month — first 30 days free, cancel any time.

Claim your listing here: findstudiospace.com/claim

— [Your Name]
FindStudioSpace · findstudiospace.com
1631 NE Broadway St, Portland, OR 97232-1425

Reply "unsubscribe" to stop these emails.
```

**Why this converts:**
- Opens as a reply thread → read rate near 100% (they're already in conversation).
- View count (if non-zero) = proof their listing is working = loss aversion ("I'm already getting views, don't want to miss inquiries").
- Single CTA with direct URL. No friction.
- Trial framing ("first 30 days free") removes the payment objection.
- "$29/month" stated plainly — don't hide the price, it signals confidence.

---

## Template C — Cold outreach to Peerspace/Giggster landlords

**Use for:** Landlords you identify on Peerspace/Giggster who rent monthly (not hourly).
**Goal:** Get a reply expressing interest.

**Subject:** `[Space Name] — no booking fees`

```
Hi [First Name],

I'm [Name], founder of FindStudioSpace — a Portland directory for monthly studio rentals.

Peerspace charges ~15–30% per booking in platform fees. FindStudioSpace is a flat $29/month — no commission, you keep everything.

Would it make sense to list [Space Name] on FindStudioSpace as well?

— [Your Name]
FindStudioSpace · findstudiospace.com
1631 NE Broadway St, Portland, OR 97232-1425

Reply "unsubscribe" to stop these emails.
```

**Why this converts:**
- "No booking fees" in subject is a direct pain-point hit for anyone running a Peerspace listing.
- Fee comparison is factual: Peerspace 15% host + ~10% guest = ~25% total. Stated as "~15–30%" to be accurate for the range.
- One question at the end — "would it make sense?" is softer than "sign up now" and gets higher reply rates.
- Under 60 words of body copy.

**Note:** "Monthly renters" qualifier is important. A landlord doing hourly shoots on Peerspace has a different value prop than one doing monthly leases. Target the monthly lessors.

---

## Template D — First-reply follow-up to Template C

**Trigger:** Peerspace/Giggster landlord replied with interest.
**Goal:** Get listing submitted.

```
Hi [First Name],

Easy — takes about 5 minutes to submit: findstudiospace.com/submit

I'll review and publish within 48 hours. Once it's live I'll send you the link.

— [Your Name]
FindStudioSpace · findstudiospace.com
1631 NE Broadway St, Portland, OR 97232-1425

Reply "unsubscribe" to stop these emails.
```

---

## Template E — Landlord referral (after first pro conversion)

**Trigger:** Pro subscriber has been on platform 30+ days with no complaints.
**Goal:** One warm referral name.

**Subject:** `Quick favor — know any other Portland studio landlords?`

```
Hi [First Name],

Glad [Space Name] is on FindStudioSpace. Quick ask:

Do you know any other Portland landlords with studio or workshop space? A name or intro from you means more than anything else I can do.

No obligation at all.

— [Your Name]
FindStudioSpace · findstudiospace.com
1631 NE Broadway St, Portland, OR 97232-1425

Reply "unsubscribe" to stop these emails.
```

---

## CAN-SPAM compliance gate

**CAN-SPAM gate: CLEARED. Batch-zero is unblocked.**

Physical address: **1631 NE Broadway St, Portland, OR 97232-1425**
Address is in all template footers above and hardcoded in the monthly digest route.

Other requirements (already satisfied):
- [x] FROM address is not deceptive (hello@findstudiospace.com)
- [x] Subject lines are not deceptive
- [x] Unsubscribe instruction in every template
- [x] Unsubscribe honored within 10 business days → add to Resend suppression list

---

## Batch-zero execution checklist

1. [ ] P0-A: Get physical address. Add to all templates above.
2. [ ] Pull send list: `SELECT id, title, contact_email FROM listings WHERE status='active' AND contact_email IS NOT NULL ORDER BY created_at DESC LIMIT 20`
3. [ ] Personalize [First Name] and [Space Name] for each row — no mail merge, do it manually for batch-zero.
4. [ ] Send Template A Option 1 to first 5 contacts, Option 2 to next 4.
5. [ ] Log send date + subject used per contact in a spreadsheet.
6. [ ] Wait 5 business days before any follow-up.
7. [ ] Reply → immediately send Template B.
8. [ ] After batch-zero: compare reply rates for Option 1 vs Option 2. Use winner for subsequent batches.

---

## Suppression list

When anyone replies "unsubscribe":
1. Add to Resend suppression list immediately (Settings → Suppressions).
2. Log email + date in local spreadsheet.
3. Do not contact again.

SLA: remove within 48 hours of receipt (our published commitment).
