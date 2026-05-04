/**
 * ingest-gis-layers.ts
 *
 * Fetches Portland GIS overlay layers from ArcGIS REST endpoints (no API key)
 * and inserts them as geometry rows into Supabase PostGIS tables.
 * Run once to seed, then the weekly cron keeps it current.
 *
 * Usage:
 *   npx tsx scripts/ingest-gis-layers.ts
 *   npx tsx scripts/ingest-gis-layers.ts --layers zoning,flood_zone
 *
 * Env:
 *   NEXT_PUBLIC_SUPABASE_URL
 *   SUPABASE_SERVICE_KEY
 */

import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? 'https://vnjsczhqhnzrplrdkolb.supabase.co'
const SERVICE_KEY  = process.env.SUPABASE_SERVICE_KEY
if (!SERVICE_KEY) { console.error('SUPABASE_SERVICE_KEY required'); process.exit(1) }

const db = createClient(SUPABASE_URL, SERVICE_KEY)
const PDX_ARC    = 'https://www.portlandmaps.com/arcgis/rest/services/Public'
const PDX_TRANSIT = 'https://www.portlandmaps.com/arcgis/rest/services/Public/Transit/MapServer'
const MAX_RECORDS = 150
const USER_AGENT  = 'findstudiospace-gis-ingest/1.0 (Portland studio directory; contact@findstudiospace.com)'

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
    if (hasMore) await sleep(300)
  }
  return features
}

type LayerDef = {
  name: string
  table: string
  fetch: () => Promise<GeoJSONFeature[]>
  mapProps: (f: GeoJSONFeature) => Record<string, unknown>
}

// Verified field names via direct API probing 2024:
// - Zoning/MapServer layer 0: ZONE (code), ZONE_DESC (description)
// - Natural_Hazards/MapServer layer 23: HAZARD (integer 1-5)
// - Natural_Hazards/MapServer layer 70: binary polygon, no meaningful field
// - BDS_Layers/MapServer layer 30: FLD_ZONE ✓
// - COP_OpenData is down — parking, business districts, historic resources skipped
const LAYERS: LayerDef[] = [
  {
    name: 'zoning',
    table: 'gis_zoning',
    fetch: () => fetchArcGISLayer(`${PDX_ARC}/Zoning/MapServer`, 0, 'ZONE,ZONE_DESC'),
    mapProps: (f) => ({
      zone_code:  f.properties['ZONE']      ?? null,
      zone_class: f.properties['ZONE_DESC'] ?? null,
    }),
  },
  {
    name: 'flood_zone',
    table: 'gis_flood_zone',
    fetch: () => fetchArcGISLayer(`${PDX_ARC}/BDS_Layers/MapServer`, 30, 'FLD_ZONE,ZONE_SUBTYPE'),
    mapProps: (f) => ({ fema_zone: f.properties['FLD_ZONE'] ?? f.properties['ZONE_SUBTYPE'] ?? 'AE' }),
  },
  {
    name: 'wildfire_hazard',
    table: 'gis_wildfire_hazard',
    fetch: () => fetchArcGISLayer(`${PDX_ARC}/Natural_Hazards/MapServer`, 23, 'HAZARD,LABEL'),
    mapProps: (f) => ({
      hazard_level: f.properties['HAZARD'] != null
        ? String(f.properties['HAZARD'])
        : (f.properties['LABEL'] ?? 'unknown'),
    }),
  },
  {
    name: 'landslide_hazard',
    table: 'gis_landslide_hazard',
    fetch: () => fetchArcGISLayer(`${PDX_ARC}/Natural_Hazards/MapServer`, 70, 'OBJECTID'),
    mapProps: () => ({ hazard_level: 'Potential Hazard Area' }),
  },
]

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

async function ensureExecFunction(): Promise<void> {
  const { error } = await db.rpc('exec_sql' as never, { sql: 'SELECT 1' } as never)
  if (error) {
    console.error('[ingest-gis] exec_sql function not found. Apply the migration first.')
    process.exit(1)
  }
}

async function ingestMaxStops(): Promise<number> {
  // Transit/MapServer layer 2 = MAX Light Rail stations
  // Fields verified: OBJECTID, STATION, LINE, STATUS, TYPE
  let inserted = 0
  let offset = 0
  const maxRecords = 200

  while (true) {
    const url = new URL(`${PDX_TRANSIT}/2/query`)
    url.searchParams.set('where', '1=1')
    url.searchParams.set('outFields', 'OBJECTID,STATION,LINE')
    url.searchParams.set('outSR', '4326')
    url.searchParams.set('f', 'geojson')
    url.searchParams.set('resultOffset', String(offset))
    url.searchParams.set('resultRecordCount', String(maxRecords))

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
        const stopId   = String(f.properties['OBJECTID'] ?? '')
        const stopName = String(f.properties['STATION']  ?? '')
        const geomJson = JSON.stringify(f.geometry).replace(/'/g, "''")

        const { error } = await db.rpc('exec_sql' as never, {
          sql: `INSERT INTO public.gis_transit_stops (stop_id, stop_name, route_type, geom)
                VALUES ('MAX-${stopId.replace(/'/g, "''")}', '${stopName.replace(/'/g, "''")}', 1,
                        ST_SetSRID(ST_GeomFromGeoJSON('${geomJson}'),4326))
                ON CONFLICT (stop_id) DO UPDATE SET
                  stop_name = EXCLUDED.stop_name,
                  geom = EXCLUDED.geom, fetched_at = now()`
        } as never)
        if (!error) inserted++
      }

      if (!data.exceededTransferLimit) break
      offset += batch.length
      await sleep(400)
    } catch (err) {
      console.warn('[ingest-gis] MAX stops error at offset', offset, err)
      break
    }
  }
  return inserted
}

async function ingestBusStops(): Promise<number> {
  // Transit/MapServer layer 7 = Bus stops
  // Fields verified: OBJECTID, LOC_ID, LOCATION, ROUTE, FREQUENT
  let inserted = 0
  let offset = 0
  const maxRecords = 500

  while (offset < 20000) {
    const url = new URL(`${PDX_TRANSIT}/7/query`)
    url.searchParams.set('where', '1=1')
    url.searchParams.set('outFields', 'LOC_ID,LOCATION,FREQUENT')
    url.searchParams.set('outSR', '4326')
    url.searchParams.set('f', 'geojson')
    url.searchParams.set('resultOffset', String(offset))
    url.searchParams.set('resultRecordCount', String(maxRecords))

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
        const stopId   = String(f.properties['LOC_ID']   ?? '')
        const stopName = String(f.properties['LOCATION'] ?? '')
        const geomJson = JSON.stringify(f.geometry).replace(/'/g, "''")

        const { error } = await db.rpc('exec_sql' as never, {
          sql: `INSERT INTO public.gis_transit_stops (stop_id, stop_name, route_type, geom)
                VALUES ('BUS-${stopId.replace(/'/g, "''")}', '${stopName.replace(/'/g, "''")}', 3,
                        ST_SetSRID(ST_GeomFromGeoJSON('${geomJson}'),4326))
                ON CONFLICT (stop_id) DO UPDATE SET
                  stop_name = EXCLUDED.stop_name,
                  geom = EXCLUDED.geom, fetched_at = now()`
        } as never)
        if (!error) inserted++
      }

      if (!data.exceededTransferLimit) break
      offset += batch.length
      await sleep(300)
    } catch (err) {
      console.warn('[ingest-gis] bus stops error at offset', offset, err)
      break
    }
  }
  return inserted
}

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

    await db.rpc('exec_sql' as never, { sql: `DELETE FROM public.${layer.table}` } as never)

    let inserted = 0
    for (const feature of features) {
      if (!feature.geometry?.coordinates) continue
      const props = layer.mapProps(feature)
      const geomJson = JSON.stringify(feature.geometry).replace(/'/g, "''")
      const propEntries = Object.entries(props)
      const cols = propEntries.map(([k]) => k).join(', ')
      const vals = propEntries.map(([, val]) =>
        val === null || val === undefined ? 'NULL' : `'${String(val).replace(/'/g, "''")}'`
      ).join(', ')

      const { error } = await db.rpc('exec_sql' as never, {
        sql: `INSERT INTO public.${layer.table} (${cols}, geom) VALUES (${vals}, ST_SetSRID(ST_Multi(ST_GeomFromGeoJSON('${geomJson}')),4326))`
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

  const toRun = onlyLayers ? LAYERS.filter(l => onlyLayers.includes(l.name)) : LAYERS
  for (const layer of toRun) {
    await ingestLayer(layer)
    await sleep(500)
  }

  if (!onlyLayers || onlyLayers.includes('transit')) {
    console.log('\n[ingest-gis] ▶ MAX light rail stops')
    const maxN = await ingestMaxStops()
    console.log(`  inserted ${maxN} MAX stops`)

    console.log('\n[ingest-gis] ▶ bus stops')
    const busN = await ingestBusStops()
    console.log(`  inserted ${busN} bus stops`)
  }

  console.log('\n[ingest-gis] ✅ all layers complete')
}

main().catch(err => { console.error(err); process.exit(1) })
