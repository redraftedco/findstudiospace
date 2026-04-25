-- up: enrichment tracking columns on listings
-- Applied via Supabase MCP on 2026-04-26
-- Down: 20260426_enrichment_columns_down.sql

ALTER TABLE listings
  ADD COLUMN enrichment_attempted_at  timestamptz,
  ADD COLUMN enrichment_attempts      smallint    NOT NULL DEFAULT 0,
  ADD COLUMN enrichment_status        text        NOT NULL DEFAULT 'pending';

ALTER TABLE listings
  ADD CONSTRAINT listings_enrichment_status_check
  CHECK (enrichment_status IN ('pending', 'success', 'no_website', 'no_email', 'failed'));

-- Partial index — only rows that still need enrichment; keeps it small
CREATE INDEX idx_listings_enrichment
  ON listings (enrichment_attempts, enrichment_attempted_at)
  WHERE contact_email IS NULL;
