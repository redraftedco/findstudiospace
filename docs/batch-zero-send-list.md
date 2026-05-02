# Batch-Zero Cold Outreach Send List

**Generated:** 2026-04-26 from Supabase `listings` table
**Status:** Ready to send manually. Current mailing address is in `docs/cold-email-templates.md` Template A.
**Excluded:** test row id 1104 (redraftedco@gmail.com), test row id 1105 (testing@example.com), id 559 (malformed email prefix).

---

## Tier 1 — Multi-listing operators (HIGHEST VALUE — 5 contacts, 19 listings)

These already trust you with multiple listings. Best Pro upgrade targets and exclusive-agreement candidates (P2-C).
**Send order: send these FIRST.** A reply here is worth 3-5 single-listing replies.

| Email | Listings | Listing IDs | Type |
|---|---|---|---|
| `info@ned.space` | 5 | 1, 11, 13, 18, 28 | NW + NE + SE / office + art |
| `thegeodepdx@gmail.com` | 4 | 107, 112, 525, 529 | Central Eastside / SE / office |
| `info@artdesignxchange.com` | 4 | 21, 42, 97, 547 | SE Portland / workshop + art + office |
| `membership@ideaworkspdx.org` | 3 | 31, 36, 591 | NW Portland / art / makerspace |
| `ballard@activspace.com` | 2 | 68, 80 | NW + NE / art + office |

**Personalization tip:** Reference the specific number of listings in the email opener. *"Your 5 listings on ned.space are all live on FindStudioSpace..."* signals you've done the work.

---

## Tier 2 — Single-listing professional contacts (12 sendable)

Real businesses with brand-domain emails. Higher reply-rate than personal emails.

| Email | Listing | ID | Notes |
|---|---|---|---|
| `leasing@beamdevelopment.com` | Suite 225 — Cyclorama Wall | 22 | **P0-C — also the only cyc wall.** High-priority Pro candidate. |
| `hello@breathingroomcollective.com` | Wellness/Yoga Studio | 4 | SE Portland fitness |
| `membership@pastlives.space` | Beautiful Private Creative Space | 8 | NW art |
| `connect@thebymc.com` | Yoga/Dance/Movement Studio | 10 | N Portland fitness |
| `donate@pdxhs.org` | Cozy Maker Space | 29 | NW art (non-profit) |
| `hello@theartroompdx.com` | Make Room for Your Art | 44 | SE art |
| `customerservice@tenderlovingempire.com` | Ink/Art/Fashion Beauty | 49 | NW art (retail brand) |
| `info@therapyworks-pdx.com` | Therapy/Office/Studio | 63 | office |
| `leasing@nwflexspace.com` | 950 SF Commercial | 79 | retail |
| `info@crmgco.com` | Prime Commercial Broadway | 85 | retail (commercial mgmt) |
| `hello@mikebennettstudios.com` | Private Studios for Artists | 101 | NW art |
| `info@smartbins.store` | Load in / Store Smart | 102 | SE art |
| `contact@northrimpdx.com` | Suite 350 Creative Office | 523 | Central Eastside office |
| `hello@shoppracticespace.com` | Eliot Neighborhood Office | 528 | NE office |
| `civilianstudios@gmail.com` | Creative Warehouse Pearl | 532 | workshop |
| `info@creativeofficeresources.com` | EBCC 135 Office | 541 | Central Eastside office |
| `henry@flexwh.com` | Workshops/Garages | 599 | workshop |

---

## Tier 3 — Personal/individual landlord emails (3 sendable)

Personal Gmail or business-of-one. Still worth contacting; reply rate generally lower than Tier 2.

| Email | Listing | ID |
|---|---|---|
| `wotbmassage@gmail.com` | Massage Studio SE | 26 |
| `nwcreativecounseling@gmail.com` | Therapy/Counseling Office | 55 |
| `civilianstudios@gmail.com` | (also in Tier 2) | 532 |

---

## Excluded

| Email | Reason |
|---|---|
| `redraftedco@gmail.com` | Your own email (test listing 1104) |
| `testing@example.com` | Test row 1105 |
| `u003eeudistrict.reception@industriousoffice.com` | Malformed email — has `u003e` HTML entity prefix. Real address is probably `eudistrict.reception@industriousoffice.com`. **Verify and fix in DB before sending** (listing id 559). |

---

## Send schedule recommendation

**Day 1 (Tier 1 — 5 emails):** Send Template A. These are your highest-leverage contacts.

**Day 3 (Tier 2 — 17 emails):** Split A/B between subject options:
- Option 1 ("Your [Space Name] — quick question"): first 9 contacts
- Option 2 ("[Space Name] on FindStudioSpace"): next 8

**Day 5 (Tier 3 — 2-3 emails):** Personal addresses last. Lower expected reply rate; volume isn't urgent.

**Day 8:** Review reply rates per tier and per subject option. Iterate.

---

## Sending mechanics

1. Send manually from Resend or your Gmail. Do not bulk-send via the cron/API for batch-zero; manual sends are easier to review and safer for deliverability.
2. Personalize **[Space Name]** and **[First Name]** for each. For generic addresses (info@, leasing@, etc.), use the company name in [Space Name] and skip [First Name] — open with "Hi there,"
3. Log each send in a spreadsheet: date, email, subject used, template, reply (Y/N), reply date, outcome.
4. Monitor `redraftedco@gmail.com` (or whatever you set `PLATFORM_NOTIFY_EMAIL` to in Vercel) for replies.
5. Reply within 24 hours to anyone who responds. Use Template B for the follow-up.

---

## Expected outcome (data-backed projection)

- Tier 1 (5 sends): expect 1-2 replies (40% rate on warm directory operators)
- Tier 2 (17 sends): expect 4-5 replies (25% rate on professional addresses)
- Tier 3 (2-3 sends): expect 0-1 reply (15-20% rate on personal addresses)

**Total batch-zero projection:** 5-8 replies → 2-4 conversations → 1-2 Pro upgrades or exclusive agreements.

If you hit < 2 replies total, the issue is the email itself, not the list. Iterate Template A's first sentence before scaling to the next batch.
