-- up: acquisition_targets staging table for supply prospecting
-- Applied via Supabase MCP on 2026-04-26
-- Down: 20260426_acquisition_targets_down.sql
--
-- PURPOSE: Prospects discovered by the Places / Yelp cron live here.
-- They are NOT in listings until manually promoted (consent gate).
-- RLS: service_role only — same pattern as lead_inquiries.

CREATE TABLE IF NOT EXISTS public.acquisition_targets (
  id                    bigserial PRIMARY KEY,
  business_name         text        NOT NULL,
  category              text        NOT NULL
    CHECK (category IN ('photo', 'event', 'brewery', 'maker', 'rooftop', 'podcast', 'other')),
  city                  text        NOT NULL,
  neighborhood          text,
  website_url           text,
  contact_email         text,
  instagram_url         text,
  phone                 text,
  google_place_id       text,
  rating_average        numeric(3,1),
  rating_count          int,
  acquisition_source    text        NOT NULL
    CHECK (acquisition_source IN ('places_textsearch', 'yelp', 'openstudios', 'manual')),
  acquisition_priority  smallint,       -- 0–100, higher = email first
  content_signals       jsonb,          -- {private_event:bool, has_pricing:bool, accepts_bookings:bool}
  enrichment_status     text        NOT NULL DEFAULT 'pending'
    CHECK (enrichment_status IN ('pending', 'success', 'no_website', 'no_email', 'needs_apollo', 'failed')),
  enrichment_attempts   smallint    NOT NULL DEFAULT 0,
  enrichment_attempted_at timestamptz,
  outreach_status       text
    CHECK (outreach_status IN ('pending', 'sent', 'opened', 'replied', 'converted', 'bounced', 'unsubscribed')),
  outreach_sent_at      timestamptz,
  outreach_responded_at timestamptz,
  outreach_template     text,           -- template variant used
  promoted_listing_id   bigint REFERENCES public.listings(id) ON DELETE SET NULL,
  created_at            timestamptz NOT NULL DEFAULT now(),
  updated_at            timestamptz NOT NULL DEFAULT now()
);

-- Composite unique: prevent duplicate discovery of same business
CREATE UNIQUE INDEX IF NOT EXISTS uq_acq_place
  ON public.acquisition_targets (google_place_id)
  WHERE google_place_id IS NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS uq_acq_name_city
  ON public.acquisition_targets (lower(business_name), lower(city));

-- Enrichment work queue index — same pattern as listings enrichment
CREATE INDEX IF NOT EXISTS idx_acq_enrichment
  ON public.acquisition_targets (enrichment_attempts, enrichment_attempted_at)
  WHERE enrichment_status != 'success';

-- Outreach priority index
CREATE INDEX IF NOT EXISTS idx_acq_outreach
  ON public.acquisition_targets (acquisition_priority DESC)
  WHERE outreach_status IS NULL
    AND enrichment_status = 'success'
    AND contact_email IS NOT NULL;

-- updated_at trigger (reuse the approach used elsewhere in the schema)
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$;

CREATE TRIGGER trg_acq_updated_at
  BEFORE UPDATE ON public.acquisition_targets
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- RLS — service_role only, matches lead_inquiries pattern
ALTER TABLE public.acquisition_targets ENABLE ROW LEVEL SECURITY;

CREATE POLICY svc ON public.acquisition_targets
  USING (auth.role() = 'service_role');
