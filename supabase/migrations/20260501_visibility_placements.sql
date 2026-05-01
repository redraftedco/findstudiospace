-- up: visibility_placements — paid advertising placements on category/neighborhood pages
-- Applied via Supabase MCP on 2026-05-01
-- Down: 20260501_visibility_placements_down.sql

CREATE TABLE public.visibility_placements (
  id                     bigserial   PRIMARY KEY,
  listing_id             integer     NOT NULL REFERENCES public.listings(id) ON DELETE CASCADE,
  placement_type         text        NOT NULL
    CHECK (placement_type IN ('featured_category', 'featured_neighborhood', 'featured_studio')),
  target_type            text        NOT NULL
    CHECK (target_type IN ('category', 'neighborhood')),
  target_slug            text        NOT NULL,
  status                 text        NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'active', 'cancelled', 'expired', 'comped')),
  starts_at              timestamptz,
  ends_at                timestamptz,
  stripe_customer_id     text,
  stripe_subscription_id text,
  stripe_price_id        text,
  created_at             timestamptz NOT NULL DEFAULT now(),
  updated_at             timestamptz NOT NULL DEFAULT now()
);

-- owner dashboard / listing-level placement lookups
CREATE INDEX idx_vp_listing_id
  ON public.visibility_placements (listing_id);

-- category/neighborhood pages finding active sponsored listings (partial — only active rows)
CREATE INDEX idx_vp_target
  ON public.visibility_placements (target_type, target_slug, status)
  WHERE status = 'active';

-- webhook: find placement by Stripe subscription to update status
CREATE INDEX idx_vp_stripe_sub
  ON public.visibility_placements (stripe_subscription_id)
  WHERE stripe_subscription_id IS NOT NULL;

ALTER TABLE public.visibility_placements ENABLE ROW LEVEL SECURITY;

-- Service role only: all reads/writes go through server components or API routes
-- using SUPABASE_SERVICE_KEY. stripe_customer_id and stripe_subscription_id must
-- never be accessible to public/anon clients.
CREATE POLICY "svc_all"
  ON public.visibility_placements
  FOR ALL
  TO public
  USING (auth.role() = 'service_role');
