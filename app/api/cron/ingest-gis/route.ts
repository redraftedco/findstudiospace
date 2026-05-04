import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { safeEqual } from '@/lib/security'

/**
 * GET /api/cron/ingest-gis
 *
 * Triggers GIS layer ingestion — rotates through layers on successive runs so
 * each layer refreshes weekly without hitting Portland's ArcGIS servers all at once.
 * Layer rotation tracked via gis_layer_runs (oldest successful run goes next).
 *
 * Authorization: Bearer <CRON_SECRET>
 */

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SERVICE_KEY  = process.env.SUPABASE_SERVICE_KEY!
const PDX_ARC      = 'https://www.portlandmaps.com/arcgis/rest/services/Public'
const USER_AGENT   = 'findstudiospace-gis-cron/1.0 (Portland studio directory)'
const MAX_RECORDS  = 150

type GeoJSONFeature = {
  type: 'Feature'
  geometry: { type: string; coordinates: unknown }
  properties: Record<string, unknown>
}

const LAYER_ROTATION = ['zoning','airport_noise','flood_zone','wildfire_hazard',
  'landslide_hazard','parking_zones','business_districts','historic_resources']

export async function GET(req: NextRequest) {
  const secret = process.env.CRON_SECRET
  if (!secret || !safeEqual(req.headers.get('authorization') ?? '', `Bearer ${secret}`)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const db = createClient(SUPABASE_URL, SERVICE_KEY)

  const { data: runs } = await db
    .from('gis_layer_runs')
    .select('layer_name, finished_at')
    .eq('status', 'success')
    .order('finished_at', { ascending: true })

  const runMap = new Map((runs ?? []).map(r => [r.layer_name, r.finished_at]))
  const layerName = LAYER_ROTATION.find(l => !runMap.has(l))
    ?? LAYER_ROTATION.reduce((oldest, l) =>
      (runMap.get(l) ?? '') < (runMap.get(oldest) ?? '') ? l : oldest
    )

  const { data: runRow } = await db
    .from('gis_layer_runs')
    .insert({ layer_name: layerName, status: 'running' })
    .select('id').single()
  const runId = runRow?.id

  try {
    const count = await ingestLayerByName(db, layerName)
    if (runId) {
      await db.from('gis_layer_runs').update({
        status: 'success', features_in: count, finished_at: new Date().toISOString()
      }).eq('id', runId)
    }
    await db.rpc('enrich_all_listings_spatial')
    return NextResponse.json({ layer: layerName, inserted: count })
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    if (runId) {
      await db.from('gis_layer_runs').update({
        status: 'error', error_msg: msg, finished_at: new Date().toISOString()
      }).eq('id', runId)
    }
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}

async function fetchArcGISLayer(serviceUrl: string, layerId: number, outFields: string, where = '1=1'): Promise<GeoJSONFeature[]> {
  const features: GeoJSONFeature[] = []
  let offset = 0
  let hasMore = true

  while (hasMore) {
    const url = new URL(`${serviceUrl}/${layerId}/query`)
    url.searchParams.set('where', where)
    url.searchParams.set('outFields', outFields)
    url.searchParams.set('outSR', '4326')
    url.searchParams.set('f', 'geojson')
    url.searchParams.set('resultOffset', String(offset))
    url.searchParams.set('resultRecordCount', String(MAX_RECORDS))

    const res = await fetch(url.toString(), {
      headers: { 'User-Agent': USER_AGENT },
      signal: AbortSignal.timeout(30_000),
    })
    if (!res.ok) break

    const data = await res.json() as { features?: GeoJSONFeature[]; exceededTransferLimit?: boolean }
    const batch = data.features ?? []
    features.push(...batch)
    hasMore = data.exceededTransferLimit === true && batch.length === MAX_RECORDS
    offset += batch.length
    if (batch.length === 0) hasMore = false
    if (hasMore) await new Promise(r => setTimeout(r, 300))
  }
  return features
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type DB = ReturnType<typeof createClient<any>>

async function ingestLayerByName(db: DB, layerName: string): Promise<number> {
  type LayerConfig = {
    serviceUrl: string
    layerId: number
    table: string
    fields: string
    where?: string
    mapProps: (f: GeoJSONFeature) => Record<string, unknown>
  }

  const configs: Record<string, LayerConfig> = {
    zoning:             { serviceUrl: `${PDX_ARC}/Zoning/MapServer`,         layerId: 0,   table: 'gis_zoning',             fields: 'ZONE_CODE,ZONE_CLASS',                mapProps: f => ({ zone_code: f.properties['ZONE_CODE'] ?? null, zone_class: f.properties['ZONE_CLASS'] ?? null }) },
    airport_noise:      { serviceUrl: `${PDX_ARC}/Zoning/MapServer`,         layerId: 1,   table: 'gis_airport_noise',      fields: 'OVERLAY_CODE,OVERLAY_CLASS',           where: "OVERLAY_CODE LIKE 'x%' OR OVERLAY_CODE LIKE 'X%'", mapProps: f => ({ dnl_band: classifyNoise(f.properties) }) },
    flood_zone:         { serviceUrl: `${PDX_ARC}/BDS_Layers/MapServer`,     layerId: 30,  table: 'gis_flood_zone',         fields: 'FLD_ZONE,ZONE_SUBTYPE',               mapProps: f => ({ fema_zone: f.properties['FLD_ZONE'] ?? null }) },
    wildfire_hazard:    { serviceUrl: `${PDX_ARC}/Natural_Hazards/MapServer`,layerId: 23,  table: 'gis_wildfire_hazard',    fields: 'HAZARD_CLASS,LABEL',                   mapProps: f => ({ hazard_level: f.properties['HAZARD_CLASS'] ?? null }) },
    landslide_hazard:   { serviceUrl: `${PDX_ARC}/Hazard/MapServer`,         layerId: 2,   table: 'gis_landslide_hazard',   fields: 'HAZARD_CLASS,LABEL',                   mapProps: f => ({ hazard_level: f.properties['HAZARD_CLASS'] ?? null }) },
    parking_zones:      { serviceUrl: `${PDX_ARC}/COP_OpenData/MapServer`,   layerId: 67,  table: 'gis_parking_zones',      fields: 'ZONENAME,ZONE_ID',                     mapProps: f => ({ zone_label: f.properties['ZONENAME'] ?? null }) },
    business_districts: { serviceUrl: `${PDX_ARC}/COP_OpenData/MapServer`,   layerId: 8,   table: 'gis_business_districts', fields: 'NAME,TYPE',                            mapProps: f => ({ district_name: f.properties['NAME'] ?? null }) },
    historic_resources: { serviceUrl: `${PDX_ARC}/COP_OpenData/MapServer`,   layerId: 132, table: 'gis_historic_resources', fields: 'RESOURCE_ID,RESOURCE_NAME,DESIGNATION', mapProps: f => ({ hri_id: f.properties['RESOURCE_ID'] ?? null, name: f.properties['RESOURCE_NAME'] ?? null, designation: f.properties['DESIGNATION'] ?? null }) },
  }

  const cfg = configs[layerName]
  if (!cfg) throw new Error(`Unknown layer: ${layerName}`)

  const features = await fetchArcGISLayer(cfg.serviceUrl, cfg.layerId, cfg.fields, cfg.where)
  if (features.length === 0) return 0

  await db.rpc('exec_sql' as never, { sql: `DELETE FROM public.${cfg.table}` } as never)

  let inserted = 0
  for (const f of features) {
    if (!f.geometry?.coordinates) continue
    const props = cfg.mapProps(f)
    const geomJson = JSON.stringify(f.geometry).replace(/'/g, "''")
    const propEntries = Object.entries(props)
    const cols = propEntries.map(([k]) => k).join(', ')
    const vals = propEntries.map(([, v]) => v === null ? 'NULL' : `'${String(v).replace(/'/g, "''")}'`).join(', ')
    const { error } = await db.rpc('exec_sql' as never, {
      sql: `INSERT INTO public.${cfg.table} (${cols}, geom) VALUES (${vals}, ST_SetSRID(ST_Multi(ST_GeomFromGeoJSON('${geomJson}')),4326))`
    } as never)
    if (!error) inserted++
  }
  return inserted
}

function classifyNoise(props: Record<string, unknown>): string {
  const raw = String(props['OVERLAY_CODE'] ?? props['DNL_BAND'] ?? '')
  if (raw.match(/6[89]|7\d/)) return 'gte68'
  if (raw.match(/65|66|67/)) return '65-68'
  return '55-65'
}
