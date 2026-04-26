-- ============================================================
-- UP: multi_city_schema
-- Run: applied via Supabase MCP apply_migration
-- ============================================================

-- 1. cities
CREATE TABLE IF NOT EXISTS public.cities (
  id               serial      PRIMARY KEY,
  slug             text        NOT NULL UNIQUE,
  name             text        NOT NULL,
  state            text        NOT NULL,
  accent_color_hex text,
  launched_at      timestamptz,
  seo_published_at timestamptz,
  is_active        boolean     NOT NULL DEFAULT false,
  is_indexable     boolean     NOT NULL DEFAULT false,
  created_at       timestamptz NOT NULL DEFAULT now()
);

-- 2. neighborhoods
CREATE TABLE IF NOT EXISTS public.neighborhoods (
  id          serial      PRIMARY KEY,
  city_id     integer     NOT NULL REFERENCES public.cities(id) ON DELETE CASCADE,
  slug        text        NOT NULL,
  name        text        NOT NULL,
  description text,
  created_at  timestamptz NOT NULL DEFAULT now(),
  UNIQUE (city_id, slug)
);

-- 3. categories
CREATE TABLE IF NOT EXISTS public.categories (
  id          serial      PRIMARY KEY,
  slug        text        NOT NULL UNIQUE,
  name        text        NOT NULL,
  plural_name text        NOT NULL,
  created_at  timestamptz NOT NULL DEFAULT now()
);

-- 4. listing_categories (many-to-many junction)
CREATE TABLE IF NOT EXISTS public.listing_categories (
  listing_id  integer NOT NULL REFERENCES public.listings(id)  ON DELETE CASCADE,
  category_id integer NOT NULL REFERENCES public.categories(id) ON DELETE CASCADE,
  PRIMARY KEY (listing_id, category_id)
);

-- 5. Add columns to listings
ALTER TABLE public.listings
  ADD COLUMN IF NOT EXISTS city_id            integer   REFERENCES public.cities(id),
  ADD COLUMN IF NOT EXISTS neighborhood_id    integer   REFERENCES public.neighborhoods(id),
  ADD COLUMN IF NOT EXISTS published          boolean   NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS indexable          boolean   NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS last_scraped_at    timestamptz,
  ADD COLUMN IF NOT EXISTS last_verified_at   timestamptz,
  ADD COLUMN IF NOT EXISTS quality_score      smallint  NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS verification_fails smallint  NOT NULL DEFAULT 0;

-- 6. Indexes
CREATE INDEX IF NOT EXISTS idx_listings_city_id          ON public.listings(city_id);
CREATE INDEX IF NOT EXISTS idx_listings_neighborhood_id  ON public.listings(neighborhood_id);
CREATE INDEX IF NOT EXISTS idx_listings_indexable        ON public.listings(indexable) WHERE indexable = true;
CREATE INDEX IF NOT EXISTS idx_neighborhoods_city_slug   ON public.neighborhoods(city_id, slug);
CREATE INDEX IF NOT EXISTS idx_categories_slug           ON public.categories(slug);

-- 7. Enable RLS on new tables
ALTER TABLE public.cities             ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.neighborhoods      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.listing_categories ENABLE ROW LEVEL SECURITY;

-- 8. RLS policies — public read, service role write
CREATE POLICY "cities_public_read"           ON public.cities             FOR SELECT TO public USING (true);
CREATE POLICY "cities_svc"                   ON public.cities             FOR ALL    TO public USING (auth.role() = 'service_role');
CREATE POLICY "neighborhoods_public_read"    ON public.neighborhoods      FOR SELECT TO public USING (true);
CREATE POLICY "neighborhoods_svc"            ON public.neighborhoods      FOR ALL    TO public USING (auth.role() = 'service_role');
CREATE POLICY "categories_public_read"       ON public.categories         FOR SELECT TO public USING (true);
CREATE POLICY "categories_svc"               ON public.categories         FOR ALL    TO public USING (auth.role() = 'service_role');
CREATE POLICY "listing_categories_pub_read"  ON public.listing_categories FOR SELECT TO public USING (true);
CREATE POLICY "listing_categories_svc"       ON public.listing_categories FOR ALL    TO public USING (auth.role() = 'service_role');

-- 9. Seed Portland city (already live, is_indexable = true)
INSERT INTO public.cities (slug, name, state, accent_color_hex, is_active, is_indexable, seo_published_at)
VALUES ('portland', 'Portland', 'OR', '#D4724E', true, true, now())
ON CONFLICT (slug) DO NOTHING;

-- 10. Seed categories (slugs must match existing URL structure — these are Google-indexed)
INSERT INTO public.categories (slug, name, plural_name) VALUES
  ('photo-studio-rental',      'Photo Studio',           'Photo Studios'),
  ('art-studio',               'Art Studio',             'Art Studios'),
  ('art-studio-rental',        'Art Studio',             'Art Studios'),
  ('workshop-space-rental',    'Workshop Space',         'Workshop Spaces'),
  ('office-space-rental',      'Office Space',           'Office Spaces'),
  ('fitness-studio-rental',    'Fitness & Dance Studio', 'Fitness & Dance Studios'),
  ('retail-space-for-rent',    'Retail Space',           'Retail Spaces'),
  ('music-studio-rental',      'Music Studio',           'Music Studios'),
  ('music-rehearsal-space',    'Music Rehearsal Space',  'Music Rehearsal Spaces'),
  ('dance-studio-rental',      'Dance Studio',           'Dance Studios'),
  ('ceramics-studio-rental',   'Ceramics Studio',        'Ceramics Studios'),
  ('woodworking-studio-rental','Woodworking Studio',     'Woodworking Studios'),
  ('studio-space-rental',      'Studio Space',           'Studio Spaces')
ON CONFLICT (slug) DO NOTHING;

-- 11. Seed Portland neighborhoods
-- Derived from real listing.neighborhood values (≥2 listings) + config entries already indexed by Google
WITH portland AS (SELECT id FROM public.cities WHERE slug = 'portland')
INSERT INTO public.neighborhoods (city_id, slug, name)
SELECT portland.id, n.slug, n.name
FROM portland, (VALUES
  ('se-portland',      'SE Portland'),
  ('nw-portland',      'NW Portland'),
  ('central-eastside', 'Central Eastside'),
  ('ne-portland',      'NE Portland'),
  ('n-portland',       'N Portland'),
  ('sellwood',         'Sellwood'),
  ('downtown',         'Downtown Portland'),
  ('goose-hollow',     'Goose Hollow'),
  ('pearl-district',   'Pearl District'),
  ('alberta-arts',     'Alberta Arts District'),
  ('division',         'SE Division'),
  ('mississippi',      'N Mississippi')
) AS n(slug, name)
ON CONFLICT (city_id, slug) DO NOTHING;

-- 12. Backfill city_id for Portland listings
UPDATE public.listings
SET city_id = (SELECT id FROM public.cities WHERE slug = 'portland')
WHERE city ILIKE 'portland'
  AND city_id IS NULL;

-- 13. Set indexable=true + published=true for active Portland listings with photos
--     Portland is already live — these listings are already in the sitemap
UPDATE public.listings
SET indexable = true, published = true
WHERE city_id = (SELECT id FROM public.cities WHERE slug = 'portland')
  AND status = 'active'
  AND jsonb_typeof(images) = 'array'
  AND jsonb_array_length(images) > 0;

-- 14. Audit log
DO $$
DECLARE
  backfilled_count  integer;
  null_count        integer;
  null_cities       text;
  made_indexable    integer;
BEGIN
  SELECT COUNT(*) INTO backfilled_count  FROM public.listings WHERE city_id IS NOT NULL;
  SELECT COUNT(*) INTO null_count        FROM public.listings WHERE city_id IS NULL;
  SELECT COUNT(*) INTO made_indexable    FROM public.listings WHERE indexable = true;
  SELECT string_agg(DISTINCT city, ', ' ORDER BY city) INTO null_cities
    FROM public.listings WHERE city_id IS NULL AND city IS NOT NULL;

  RAISE NOTICE 'Migration audit:';
  RAISE NOTICE '  Rows backfilled to Portland city_id : %', backfilled_count;
  RAISE NOTICE '  Rows with city_id = NULL            : %', null_count;
  RAISE NOTICE '  Distinct city values for NULL rows  : %', COALESCE(null_cities, 'none');
  RAISE NOTICE '  Listings set indexable=true         : %', made_indexable;
END $$;
