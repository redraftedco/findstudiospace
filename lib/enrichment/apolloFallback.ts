/**
 * lib/enrichment/apolloFallback.ts
 *
 * Stub for Apollo email enrichment fallback.
 *
 * WHY THIS IS A STUB:
 * The Apollo integration available in this project is the Claude Code MCP
 * harness (apollo:enrich-lead). That MCP tool runs in a Claude Code session —
 * it cannot be called programmatically from a Vercel serverless function.
 *
 * To activate real Apollo enrichment, one of:
 *   A) Obtain an Apollo.io REST API key and call their /people/match endpoint.
 *      Docs: https://apolloio.github.io/apollo-api-docs/#people-enrichment
 *      Add env var: APOLLO_API_KEY
 *   B) Run Apollo enrichment as a manual MCP session step using the
 *      apollo:enrich-lead skill on rows where enrichment_status='needs_apollo'.
 *
 * CURRENT BEHAVIOUR:
 * Returns null (no email found). Caller sets enrichment_status='needs_apollo'
 * so the row appears in the Apollo enrichment work queue.
 */

export type ApolloResult = {
  email: string | null
  confidence: 'high' | 'medium' | 'low' | null
}

/**
 * Attempt Apollo enrichment for a business.
 *
 * @param businessName  Business name
 * @param domain        Website domain, e.g. "studiosix.com" (without www)
 * @returns             ApolloResult — email is null until API key is wired
 */
export async function apolloEnrichFallback(
  businessName: string,  // eslint-disable-line @typescript-eslint/no-unused-vars
  domain: string | null, // eslint-disable-line @typescript-eslint/no-unused-vars
): Promise<ApolloResult> {
  // TODO: Wire APOLLO_API_KEY and call POST https://api.apollo.io/v1/people/match
  // Request body: { organization_domain: domain, reveal_personal_emails: false }
  // Response: { person: { email: string, email_status: string } }
  // Map email_status: 'verified' → 'high', 'likely' → 'medium', else → 'low'

  const apiKey = process.env.APOLLO_API_KEY
  if (!apiKey) {
    return { email: null, confidence: null }
  }

  // Placeholder for future implementation:
  // const res = await fetch('https://api.apollo.io/v1/people/match', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json', 'X-Api-Key': apiKey },
  //   body: JSON.stringify({ organization_domain: domain, reveal_personal_emails: false }),
  //   signal: AbortSignal.timeout(10_000),
  // })
  // ...

  return { email: null, confidence: null }
}
