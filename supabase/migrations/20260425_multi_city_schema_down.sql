-- ============================================================
-- DOWN: multi_city_schema — full rollback
-- WARNING: drops cities, neighborhoods, categories tables
--          and removes 7 columns from listings
-- ============================================================

-- 1. Remove listing columns (drop indexes first to avoid constraint errors)
DROP INDEX IF EXISTS public.idx_listings_city_id;
DROP INDEX IF EXISTS public.idx_listings_neighborhood_id;
DROP INDEX IF EXISTS public.idx_listings_indexable;
DROP INDEX IF EXISTS public.idx_neighborhoods_city_slug;
DROP INDEX IF EXISTS public.idx_categories_slug;

ALTER TABLE public.listings
  DROP COLUMN IF EXISTS city_id,
  DROP COLUMN IF EXISTS neighborhood_id,
  DROP COLUMN IF EXISTS published,
  DROP COLUMN IF EXISTS indexable,
  DROP COLUMN IF EXISTS last_scraped_at,
  DROP COLUMN IF EXISTS last_verified_at,
  DROP COLUMN IF EXISTS quality_score,
  DROP COLUMN IF EXISTS verification_fails;

-- 2. Drop tables in FK dependency order
DROP TABLE IF EXISTS public.listing_categories;
DROP TABLE IF EXISTS public.categories;
DROP TABLE IF EXISTS public.neighborhoods;
DROP TABLE IF EXISTS public.cities;
