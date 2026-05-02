/**
 * lib/outreach/queueSequence.ts
 *
 * Outreach sequence queueing. Marks high-priority acquisition_targets as
 * ready for Apollo sequence enrollment.
 *
 * WHY THIS IS STUBBED:
 * The apollo:sequence-load MCP skill runs in a Claude Code session. It
 * cannot be called directly from Vercel serverless. Until an Apollo REST
 * API key is configured, this module marks rows as 'pending' and logs
 * them so a manual Claude session can run the bulk enrollment.
 *
 * TO ACTIVATE AUTOMATIC ENROLLMENT:
 *   1. Obtain an Apollo.io API key with sequence write permissions.
 *   2. Set env var: APOLLO_API_KEY
 *   3. Set env var: APOLLO_SEQUENCE_ID (the target sequence ID)
 *   4. Replace the stub body below with the Apollo REST call:
 *      POST https://api.apollo.io/v1/emailer_campaigns/{id}/add_contact_ids
 *
 * CURRENT BEHAVIOUR:
 * Sets outreach_status = 'pending' on eligible rows. Those rows are then
 * visible in the apollo:sequence-load MCP skill when you run it manually.
 */

import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!,
)

/** Minimum priority score to enter the outreach queue. */
const PRIORITY_THRESHOLD = 70

export type QueueResult = {
  queued:  number
  skipped: number
}

/**
 * Mark eligible acquisition_targets as outreach_status='pending'.
 *
 * Eligible = enrichment_status='success' AND contact_email IS NOT NULL
 *            AND acquisition_priority >= PRIORITY_THRESHOLD
 *            AND outreach_status IS NULL
 *
 * @returns Count of rows queued and skipped.
 */
export async function queueHighPriorityTargets(): Promise<QueueResult> {
  const { data, error } = await supabase
    .from('acquisition_targets')
    .select('id, business_name, contact_email, acquisition_priority')
    .eq('enrichment_status', 'success')
    .not('contact_email', 'is', null)
    .gte('acquisition_priority', PRIORITY_THRESHOLD)
    .is('outreach_status', null)
    .limit(50)

  if (error || !data?.length) {
    return { queued: 0, skipped: 0 }
  }

  const ids = data.map(r => r.id)

  const { error: updateErr } = await supabase
    .from('acquisition_targets')
    .update({ outreach_status: 'review' })
    .in('id', ids)

  if (updateErr) {
    console.error('[queueSequence] update error:', updateErr.message)
    return { queued: 0, skipped: ids.length }
  }

  console.log(
    `[queueSequence] marked ${ids.length} targets as outreach_status='review'. ` +
    `Human approval required before send — run the approval query in Supabase.`
  )

  return { queued: ids.length, skipped: 0 }
}
