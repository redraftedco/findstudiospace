-- Enable Row Level Security (RLS) on ALL public tables.
-- Run this in the Supabase SQL Editor or via supabase db push.
--
-- IMPORTANT: After enabling RLS, tables with no policies will
-- deny ALL access through the anon/authenticated keys (only the
-- service_role key can bypass RLS).

-- 1. LISTINGS
ALTER TABLE public.listings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read active listings"
  ON public.listings FOR SELECT
  USING (status = 'active');

CREATE POLICY "Service role can insert listings"
  ON public.listings FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Service role can update listings"
  ON public.listings FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- 2. LEAD_INQUIRIES
ALTER TABLE public.lead_inquiries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role can insert inquiries"
  ON public.lead_inquiries FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Service role can read inquiries"
  ON public.lead_inquiries FOR SELECT
  USING (true);

-- 3. LEADS (if exists)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'leads') THEN
    EXECUTE 'ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY';
    EXECUTE $p$
      CREATE POLICY "Service role manages leads"
        ON public.leads FOR ALL
        USING (true) WITH CHECK (true)
    $p$;
  END IF;
END $$;

-- 4. USERS (if exists)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'users') THEN
    EXECUTE 'ALTER TABLE public.users ENABLE ROW LEVEL SECURITY';
    EXECUTE $p$
      CREATE POLICY "Users can read own row"
        ON public.users FOR SELECT
        USING (auth.uid() = id)
    $p$;
    EXECUTE $p$
      CREATE POLICY "Service role manages users"
        ON public.users FOR ALL
        USING (true) WITH CHECK (true)
    $p$;
  END IF;
END $$;

-- 5. SUBSCRIPTIONS (if exists)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'subscriptions') THEN
    EXECUTE 'ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY';
    EXECUTE $p$
      CREATE POLICY "Service role manages subscriptions"
        ON public.subscriptions FOR ALL
        USING (true) WITH CHECK (true)
    $p$;
  END IF;
END $$;

-- 6. DIRECTORIES (if exists)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'directories') THEN
    EXECUTE 'ALTER TABLE public.directories ENABLE ROW LEVEL SECURITY';
    EXECUTE $p$
      CREATE POLICY "Public can read directories"
        ON public.directories FOR SELECT
        USING (true)
    $p$;
    EXECUTE $p$
      CREATE POLICY "Service role manages directories"
        ON public.directories FOR ALL
        USING (true) WITH CHECK (true)
    $p$;
  END IF;
END $$;

-- 7. LISTING_INGESTION_RUNS (if exists)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'listing_ingestion_runs') THEN
    EXECUTE 'ALTER TABLE public.listing_ingestion_runs ENABLE ROW LEVEL SECURITY';
    EXECUTE $p$
      CREATE POLICY "Service role manages ingestion runs"
        ON public.listing_ingestion_runs FOR ALL
        USING (true) WITH CHECK (true)
    $p$;
  END IF;
END $$;
