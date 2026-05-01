/**
 * lib/outreach/canSpamGate.ts
 *
 * CAN-SPAM compliance gate. Hard-fails any outbound email path when the
 * physical mailing address is not configured.
 *
 * CAN-SPAM Act (15 U.S.C. § 7704) requires every commercial email to include
 * a valid physical postal address. Without this, sending cold outreach is
 * a federal violation regardless of content quality or unsubscribe links.
 *
 * HOW TO ACTIVATE:
 *   1. Get a physical mailing address (UPS Store, CMRA, or real address).
 *   2. Set env var POSTAL_ADDRESS to the full address string, e.g.:
 *      POSTAL_ADDRESS="FindStudioSpace, 123 NW Example St #456, Portland OR 97209"
 *   3. Update the footer in app/layout.tsx to display the same address.
 *   4. The gate will pass automatically once POSTAL_ADDRESS is set.
 *
 * USAGE:
 *   import { assertCanSpamCompliant } from '@/lib/outreach/canSpamGate'
 *   assertCanSpamCompliant() // throws if not configured — call before any send
 *
 * DESIGN: Hard throw, not soft warn. Soft warnings get silenced.
 */

const PLACEHOLDER_PATTERNS = [
  /your.*address/i,
  /update.*before/i,
  /placeholder/i,
  /portland,?\s*or$/i,  // bare city+state with no street is not a valid address
  /example/i,
]

/**
 * Asserts that the CAN-SPAM mailing address is configured.
 * Throws an Error if not — preventing any email from sending.
 *
 * Call this at the top of every function that sends outbound email.
 */
export function assertCanSpamCompliant(): void {
  const address = process.env.POSTAL_ADDRESS?.trim()

  if (!address) {
    throw new Error(
      '[CAN-SPAM] POSTAL_ADDRESS env var is not set. ' +
      'Set POSTAL_ADDRESS to a full physical postal address before sending any outreach. ' +
      'See lib/outreach/canSpamGate.ts for setup instructions.'
    )
  }

  for (const pattern of PLACEHOLDER_PATTERNS) {
    if (pattern.test(address)) {
      throw new Error(
        `[CAN-SPAM] POSTAL_ADDRESS appears to be a placeholder: "${address}". ` +
        'Set POSTAL_ADDRESS to a real physical postal address.'
      )
    }
  }
}

/**
 * Returns the configured mailing address string for inclusion in email footers.
 * Call assertCanSpamCompliant() first.
 */
export function getMailingAddress(): string {
  return (process.env.POSTAL_ADDRESS ?? '').trim()
}
