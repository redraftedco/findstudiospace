-- down: remove enrichment tracking columns
DROP INDEX IF EXISTS idx_listings_enrichment;

ALTER TABLE listings
  DROP CONSTRAINT IF EXISTS listings_enrichment_status_check,
  DROP COLUMN IF EXISTS enrichment_attempted_at,
  DROP COLUMN IF EXISTS enrichment_attempts,
  DROP COLUMN IF EXISTS enrichment_status;
