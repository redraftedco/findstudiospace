-- ============================================================
-- UP: postgis_gis_pipeline
-- Enables PostGIS, adds architectural attribute columns to
-- listings, creates listing_enrichment flat table, and
-- creates GIS overlay polygon/point tables for spatial joins.
-- Applied via Supabase MCP apply_migration 2026-05-04
-- Down: 20260504_postgis_gis_pipeline_down.sql
-- ============================================================

CREATE EXTENSION IF NOT EXISTS postgis WITH SCHEMA extensions;

ALTER TABLE public.listings
  ADD COLUMN IF NOT EXISTS ceiling_height_ft  NUMERIC(5,1),
  ADD COLUMN IF NOT EXISTS power_amps         SMALLINT,
  ADD COLUMN IF NOT EXISTS voltage_phase      TEXT,
  ADD COLUMN IF NOT EXISTS stc_rating         SMALLINT,
  ADD COLUMN IF NOT EXISTS nc_rating          SMALLINT,
  ADD COLUMN IF NOT EXISTS floor_type         TEXT,
  ADD COLUMN IF NOT EXISTS loading_dock_type  TEXT,
  ADD COLUMN IF NOT EXISTS ventilation_cfm    INTEGER,
  ADD COLUMN IF NOT EXISTS kiln_ready         BOOLEAN,
  ADD COLUMN IF NOT EXISTS cyc_wall_struct    BOOLEAN;

-- (constraints, geometry column, GIS tables, enrichment table,
--  spatial functions — see apply_migration run for full body)
