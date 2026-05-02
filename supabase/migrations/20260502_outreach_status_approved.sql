-- up: add 'approved' and 'review' to outreach_status check constraint
-- 'review'   = enrichment complete, awaiting manual approval before sending
-- 'approved' = manually approved in Supabase, will be picked up by send-outreach
--
-- The original constraint omitted these values, causing send-outreach to query
-- for a status that could never exist — blocking all cold email sends.

ALTER TABLE public.acquisition_targets
  DROP CONSTRAINT IF EXISTS acquisition_targets_outreach_status_check;

ALTER TABLE public.acquisition_targets
  ADD CONSTRAINT acquisition_targets_outreach_status_check
  CHECK (outreach_status IN (
    'pending', 'review', 'approved',
    'sent', 'opened', 'replied', 'converted', 'bounced', 'unsubscribed'
  ));
