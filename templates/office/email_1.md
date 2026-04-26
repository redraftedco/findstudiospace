# Office cold email — Email 1 (initial)

**Word count target:** 95–115 (body only, excluding signature)
**Tone:** business-pragmatic, peer-direct, no platform vocab
**Hook:** Portland vacant-storefront penalty law + months-on-Craigslist
**Pitch:** free directory inbound, claim listing in 2 min

## Subject variants (5 — randomly assigned at send)

1. quick note re: your {neighborhood} listing
2. {months_listed} months on craigslist — different angle?
3. portland storefront penalty + your {neighborhood} vacancy
4. free directory inbound for your {neighborhood} space
5. saw your {neighborhood} office listing — fast question

## Body

Hi {first_name},

Noticed your {neighborhood} space has been on Craigslist for {months_listed} months. Portland's new vacant-storefront penalty law kicks in at 90 days — probably already on your radar, flagging in case.

Quick context: I run findstudiospace.com, a Portland-only directory for monthly creative space. Renters land here when they search "studio space Portland" and inquire directly to landlords — no booking fees, no middleman. Your listing is already live on the directory (I scrape Craigslist daily).

Claiming takes ~2 minutes and routes inquiries to your inbox instead of Craigslist's. Free.

{claim_link}

— Taylor
findstudiospace.com
{postal_address}

Reply STOP and I'll remove you from this list.

## CAN-SPAM checklist

- [x] Sender ID (Taylor + findstudiospace.com)
- [x] Subject is non-deceptive (refers to actual listing + actual law)
- [x] Identification as commercial outreach (clear context paragraph)
- [x] Physical postal address ({postal_address} placeholder — fill from iPostal1)
- [x] Opt-out mechanism (Reply STOP)
- [x] Honor within 10 days (suppression list maintained in CSV)

## Notes

- `{months_listed}=0` rows: rewrite hook to "I see it just went up" instead of "X months". Generator script should branch on this.
- `{neighborhood}` null: use "Portland" as fallback. Quality of email drops without specific neighborhood — manually triage these to the bottom of send order.
- Vacant-storefront penalty law claim: cited from Portland Bureau of Planning + Sustainability 2024 ordinance discussion. **Believe / not verified this session** — confirm before send.
