-- down: revert outreach_status check constraint to original values
ALTER TABLE public.acquisition_targets
  DROP CONSTRAINT IF EXISTS acquisition_targets_outreach_status_check;

ALTER TABLE public.acquisition_targets
  ADD CONSTRAINT acquisition_targets_outreach_status_check
  CHECK (outreach_status IN (
    'pending', 'sent', 'opened', 'replied', 'converted', 'bounced', 'unsubscribed'
  ));
