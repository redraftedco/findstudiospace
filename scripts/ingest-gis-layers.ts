/**
 * ingest-gis-layers.ts
 *
 * Fetches Portland GIS overlay layers from ArcGIS REST endpoints (no API key)
 * and the PDX OpenData hub, then inserts them as geometry rows into Supabase
 * PostGIS tables. Run once to seed, then on the weekly cron to refresh.
 *
 * Usage:
 *   npx tsx scripts/ingest-gis-layers.ts
 *   npx tsx scripts/ingest-gis-layers.ts --layers zoning,noise  (subset)
 *
 * Env vars required:
 *   NEXT_PUBLIC_SUPABASE_URL
 *   SUPABASE_SERVICE_KEY
 */

import { createClient } from '@supabase/supabase-js'

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? 'https://vnjsczhqhnzrplrdkolb.supabase.co'
const SERVICE_KEY  = process.env.SUPABASE_SERVICE_KEY
if (!SERVICE_KEY) { console.error('SUPABASE_SERVICE_KEY required'); process.exit(1) }

const db = createClient(SUPABASE_URL, SERVICE_KEY)

// ArcGIS REST endpoints — no API key required
const PDX_ARC  = 'https://www.portlandmaps.com/arcgis/rest/services/Public'
// PortlandMaps MaxRecordCount = 150; Metro RLIS = 1000
const MAX_RECORDS = 150

const USER_AGENT = 'findstudiospace-gis-ingest/1.0 (Portland studio directory; contact@findstudiospace.com)'

// ---------------------------------------------------------------------------
// ArcGIS REST pagination helper
// ---------------------------------------------------------------------------

interface GeoJSONFeature {
  type: 'Feature'
  geometry: { type: string; coordinates: unknown }
  properties: Record<string, unknown>
}

async function fetchArcGISLayer(
  serviceUrl: string,
  layerId: number,
  outFields: string,
  whereClause = '1=1',
): Promise<GeoJSONFeature[]> {
  const features: GeoJSONFeature[] = []
  let offset = 0
  let hasMore = true

  while (hasMore) {
    const url = new URL(`${serviceUrl}/${layerId}/query`)
    url.searchParams.set('where', whereClause)
    url.searchParams.set('outFields', outFields)
    url.searchParams.set('outSR', '4326')
    url.searchParams.set('f', 'geojson')
    url.searchParams.set('resultOffset', String(offset))
    url.searchParams.set('resultRecordCount', String(MAX_RECORDS))

    const res = await fetch(url.toString(), {
      headers: { 'User-Agent': USER_AGENT },
      signal: AbortSignal.timeout(30_000),
    })
    if (!res.ok) throw new Error(`ArcGIS HTTP ${res.status} for ${url}`)

    const data = await res.json() as { features?: GeoJSONFeature[]; exceededTransferLimit?: boolean }
    const batch = data.features ?? []
    features.push(...batch)

    hasMore = data.exceededTransferLimit === true && batch.length === MAX_RECORDS
    offset += batch.length
    if (batch.length === 0) hasMore = false

    if (hasMore) await sleep(300) // polite delay
  }

  return features
}



// ---------------------------------------------------------------------------
// Layer definitions
// ---------------------------------------------------------------------------

type LayerDef = {
  name: string
  table: string
  fetch: () => Promise<GeoJSONFeature[]>
  mapProps: (f: GeoJSONFeature) => Record<string, unknown>
}

const LAYERS: LayerDef[] = [
  // ── Zoning (Portland Zoning MapServer, layer 0 = base zones) ──────────────
  {
    name: 'zoning',
    table: 'gis_zoning',
    fetch: () => fetchArcGISLayer(`${PDX_ARC}/Zoning/MapServer`, 0, 'ZONE_CODE,ZONE_CLASS'),
    mapProps: (f) => ({
      zone_code:  f.properties['ZONE_CODE']  ?? f.properties['zone_code']  ?? null,
      zone_class: f.properties['ZONE_CLASS'] ?? f.properties['zone_class'] ?? null,
    }),
  },

  // ── Airport noise overlay — Zoning MapServer overlay zones layer ──────────
  // Layer 1 in Zoning/MapServer contains Portland overlay zones including the
  // PDX Airport Safety & Noise overlay ('x' prefix codes). Returns polygons
  // only where an overlay zone is designated; unaffected areas have no row.
  {
    name: 'airport_noise',
    table: 'gis_airport_noise',
    fetch: () => fetchArcGISLayer(
      `${PDX_ARC}/Zoning/MapServer`, 1, 'OVERLAY_CODE,OVERLAY_CLASS',
      "OVERLAY_CODE LIKE 'x%' OR OVERLAY_CODE LIKE 'X%'",
    ),
    mapProps: (f) => ({
      dnl_band: classifyNoiseBand(f.properties),
    }),
  },

  // ── FEMA Special Flood Hazard Area (100-yr), BDS_Layers layer 30 ──────────
  {
    name: 'flood_zone',
    table: 'gis_flood_zone',
    fetch: () => fetchArcGISLayer(`${PDX_ARC}/BDS_Layers/MapServer`, 30, 'ZONE_SUBTYPE,FLD_ZONE'),
    mapProps: (f) => ({
      fema_zone: f.properties['FLD_ZONE'] ?? f.properties['ZONE_SUBTYPE'] ?? 'AE',
    }),
  },

  // ── Wildfire hazard zones, Natural_Hazards layer 23 ───────────────────────
  {
    name: 'wildfire_hazard',
    table: 'gis_wildfire_hazard',
    fetch: () => fetchArcGISLayer(`${PDX_ARC}/Natural_Hazards/MapServer`, 23, 'HAZARD_CLASS,LABEL'),
    mapProps: (f) => ({
      hazard_level: f.properties['HAZARD_CLASS'] ?? f.properties['LABEL'] ?? null,
    }),
  },

  // ── DOGAMI Landslide Inventory, Hazard layer 2 ────────────────────────────
  {
    name: 'landslide_hazard',
    table: 'gis_landslide_hazard',
    fetch: () => fetchArcGISLayer(`${PDX_ARC}/Hazard/MapServer`, 2, 'HAZARD_CLASS,LABEL'),
    mapProps: (f) => ({
      hazard_level: f.properties['HAZARD_CLASS'] ?? f.properties['LABEL'] ?? null,
    }),
  },

  // ── Area Parking Permit Zones ─────────────────────────────────────────────
  {
    name: 'parking_zones',
    table: 'gis_parking_zones',
    fetch: () => fetchArcGISLayer(`${PDX_ARC}/COP_OpenData/MapServer`, 67, 'ZONENAME,ZONE_ID'),
    mapProps: (f) => ({
      zone_label: f.properties['ZONENAME'] ?? f.properties['ZONE_ID'] ?? null,
    }),
  },

  // ── Business Districts ────────────────────────────────────────────────────
  {
    name: 'business_districts',
    table: 'gis_business_districts',
    fetch: () => fetchArcGISLayer(`${PDX_ARC}/COP_OpenData/MapServer`, 8, 'NAME,TYPE'),
    mapProps: (f) => ({
      district_name: f.properties['NAME'] ?? null,
    }),
  },

  // ── Historic Resource Inventory, COP_OpenData layer 132 ───────────────────
  {
    name: 'historic_resources',
    table: 'gis_historic_resources',
    fetch: () => fetchArcGISLayer(`${PDX_ARC}/COP_OpenData/MapServer`, 132, 'RESOURCE_ID,RESOURCE_NAME,DESIGNATION'),
    mapProps: (f) => ({
      hri_id:      f.properties['RESOURCE_ID']   ?? null,
      name:        f.properties['RESOURCE_NAME'] ?? null,
      designation: f.properties['DESIGNATION']   ?? null,
    }),
  },
]

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function classifyNoiseBand(props: Record<string, unknown>): string {
  const raw = String(props['DNL_BAND'] ?? props['NOISE_BAND'] ?? props['OVERLAY_CODE'] ?? '')
  if (raw.includes('68') || raw.includes('70') || raw.includes('75')) return 'gte68'
  if (raw.includes('65')) return '65-68'
  if (raw.includes('55')) return '55-65'
  return '55-65' // default for any noise overlay feature
}

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

// ---------------------------------------------------------------------------
// Verify exec_sql helper is available before running
// ---------------------------------------------------------------------------

async function ensureExecFunction(): Promise<void> {
  const { error } = await db.rpc('exec_sql' as never, { sql: 'SELECT 1' } as never)
  if (error) {
    console.error('[ingest-gis] exec_sql function not found in DB. Apply the migration first.')
    process.exit(1)
  }
}

// ---------------------------------------------------------------------------
// Transit stops via TriMet Metro RLIS
// ---------------------------------------------------------------------------

async function ingestTransitStops(): Promise<number> {
  const METRO_URL = 'https://gis.oregonmetro.gov/arcgis/rest/services/OpenData/TransitDataWebMerc/MapServer'
  const MAX_METRO = 1000
  let inserted = 0

  // Layer 0 = transit stops in Metro RLIS (check layer list at METRO_URL/layers)
  // We fetch up to 3 pages to get all stops
  for (let offset = 0; offset < 9000; offset += MAX_METRO) {
    const url = new URL(`${METRO_URL}/0/query`)
    url.searchParams.set('where', '1=1')
    url.searchParams.set('outFields', 'STOP_ID,STOP_NAME,ROUTE_TYPE')
    url.searchParams.set('outSR', '4326')
    url.searchParams.set('f', 'geojson')
    url.searchParams.set('resultOffset', String(offset))
    url.searchParams.set('resultRecordCount', String(MAX_METRO))

    try {
      const res = await fetch(url.toString(), {
        headers: { 'User-Agent': USER_AGENT },
        signal: AbortSignal.timeout(30_000),
      })
      if (!res.ok) break
      const data = await res.json() as { features?: GeoJSONFeature[]; exceededTransferLimit?: boolean }
      const batch = data.features ?? []
      if (batch.length === 0) break

      for (const f of batch) {
        if (!f.geometry?.coordinates) continue
        const stopId   = String(f.properties['STOP_ID']   ?? f.properties['stop_id']   ?? '')
        const stopName = String(f.properties['STOP_NAME'] ?? f.properties['stop_name'] ?? '')
        const routeType = Number(f.properties['ROUTE_TYPE'] ?? f.properties['route_type'] ?? 3)
        const geomJson = JSON.stringify(f.geometry).replace(/'/g, "''")

        const { error } = await db.rpc('exec_sql' as never, {
          sql: `INSERT INTO public.gis_transit_stops (stop_id, stop_name, route_type, geom)
                VALUES ('${stopId.replace(/'/g, "''")}', '${stopName.replace(/'/g, "''")}', ${routeType},
                        ST_SetSRID(ST_GeomFromGeoJSON('${geomJson}'),4326))
                ON CONFLICT (stop_id) DO UPDATE SET
                  stop_name = EXCLUDED.stop_name, route_type = EXCLUDED.route_type,
                  geom = EXCLUDED.geom, fetched_at = now()`
        } as never)
        if (!error) inserted++
      }

      if (!data.exceededTransferLimit) break
      await sleep(400)
    } catch (err) {
      console.warn('[ingest-gis] transit stops error at offset', offset, err)
      break
    }
  }

  return inserted
}

// ---------------------------------------------------------------------------
// Main ingestion loop
// ---------------------------------------------------------------------------

async function ingestLayer(layer: LayerDef): Promise<void> {
  const { data: runData } = await db
    .from('gis_layer_runs')
    .insert({ layer_name: layer.name, status: 'running' })
    .select('id')
    .single()

  const runId = runData?.id
  console.log(`\n[ingest-gis] ▶ ${layer.name}`)

  try {
    const features = await layer.fetch()
    console.log(`  fetched ${features.length} features`)

    // Delete existing rows for this layer's table before re-insert
    const { error: delErr } = await db.rpc('exec_sql' as never, {
      sql: `DELETE FROM public.${layer.table}`
    } as never)
    if (delErr) console.warn(`  [warn] could not clear ${layer.table}:`, delErr.message)

    let inserted = 0
    const geomIsPoint = layer.table === 'gis_transit_stops'

    for (const feature of features) {
      if (!feature.geometry?.coordinates) continue
      const props = layer.mapProps(feature)
      const geomJson = JSON.stringify(feature.geometry).replace(/'/g, "''")

      const propEntries = Object.entries(props)
      const cols = propEntries.map(([k]) => k).join(', ')
      const vals = propEntries.map(([, val]) =>
        val === null || val === undefined ? 'NULL' : `'${String(val).replace(/'/g, "''")}'`
      ).join(', ')

      const geomExpr = geomIsPoint
        ? `ST_SetSRID(ST_GeomFromGeoJSON('${geomJson}'),4326)`
        : `ST_SetSRID(ST_Multi(ST_GeomFromGeoJSON('${geomJson}')),4326)`

      const { error } = await db.rpc('exec_sql' as never, {
        sql: `INSERT INTO public.${layer.table} (${cols}, geom) VALUES (${vals}, ${geomExpr})`
      } as never)
      if (!error) inserted++
    }

    console.log(`  inserted ${inserted}/${features.length}`)
    if (runId) {
      await db.from('gis_layer_runs').update({
        status: 'success', features_in: inserted, finished_at: new Date().toISOString()
      }).eq('id', runId)
    }
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    console.error(`  [error] ${msg}`)
    if (runId) {
      await db.from('gis_layer_runs').update({
        status: 'error', error_msg: msg, finished_at: new Date().toISOString()
      }).eq('id', runId)
    }
  }
}

async function main() {
  const args = process.argv.slice(2)
  const onlyFlag = args.find(a => a.startsWith('--layers='))
  const onlyLayers = onlyFlag ? onlyFlag.split('=')[1].split(',') : null

  await ensureExecFunction()

  const toRun = onlyLayers
    ? LAYERS.filter(l => onlyLayers.includes(l.name))
    : LAYERS

  for (const layer of toRun) {
    await ingestLayer(layer)
    await sleep(500) // polite inter-layer pause
  }

  // Transit stops (separate flow)
  if (!onlyLayers || onlyLayers.includes('transit')) {
    console.log('\n[ingest-gis] ▶ transit_stops')
    const n = await ingestTransitStops()
    console.log(`  inserted ${n} transit stops`)
  }

  console.log('\n[ingest-gis] ✅ all layers complete')
}

main().catch(err => { console.error(err); process.exit(1) })
