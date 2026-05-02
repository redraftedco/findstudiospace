-- up: stripe_events — idempotency table for Stripe webhook deduplication
-- Applied via Supabase MCP
-- Down: 20260502_stripe_events_down.sql

CREATE TABLE public.stripe_events (
  event_id   text        PRIMARY KEY,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Enables periodic cleanup of old events (retention policy outside this migration)
CREATE INDEX idx_stripe_events_created ON public.stripe_events (created_at);

ALTER TABLE public.stripe_events ENABLE ROW LEVEL SECURITY;

-- Service role only — webhook handler uses SUPABASE_SERVICE_KEY
CREATE POLICY "svc_all"
  ON public.stripe_events
  FOR ALL
  TO public
  USING (auth.role() = 'service_role');
