import type { BuildingFootprint, Coord } from './types'

const FOOTPRINT_URL = 'https://www.portlandmaps.com/arcgis/rest/services/Public/Basemap_Color_Buildings/MapServer/0/query'

// meters per pixel — sets the zoom level of the Nolli plan view
// PLAN_W=1304, TOP_H=576 → at 1.0 m/px: 1304m wide × 576m tall
export const METERS_PER_PX = 1.0

export function planBbox(lat: number, lon: number): {
  dLat: number; dLon: number
  minLat: number; maxLat: number; minLon: number; maxLon: number
} {
  const cosLat = Math.cos(lat * Math.PI / 180)
  const dLat = (288 * METERS_PER_PX) / 111000          // half TOP_H in degrees
  const dLon = (652 * METERS_PER_PX) / (cosLat * 111000) // half PLAN_W in degrees
  return {
    dLat, dLon,
    minLat: lat - dLat, maxLat: lat + dLat,
    minLon: lon - dLon, maxLon: lon + dLon,
  }
}

export async function fetchBuildingFootprints(
  lat: number,
  lon: number,
): Promise<BuildingFootprint[]> {
  const { minLat, maxLat, minLon, maxLon } = planBbox(lat, lon)
  const bbox = `${minLon},${minLat},${maxLon},${maxLat}`

  const params = new URLSearchParams({
    where: '1=1',
    geometry: bbox,
    geometryType: 'esriGeometryEnvelope',
    inSR: '4326',
    outSR: '4326',
    outFields: 'OBJECTID',
    returnGeometry: 'true',
    f: 'json',
  })

  const r = await fetch(`${FOOTPRINT_URL}?${params}`, {
    signal: AbortSignal.timeout(12000),
  })
  if (!r.ok) throw new Error(`Building footprint API: ${r.status}`)

  type ArcGISResponse = {
    features?: Array<{ geometry: { rings: number[][][] } }>
    error?: { message: string }
  }
  const data = await r.json() as ArcGISResponse
  if (data.error) throw new Error(`Building footprint API error: ${data.error.message}`)

  const features = data.features ?? []
  return features.map(f => {
    const outerRing = f.geometry.rings[0] as Coord[]
    return { outerRing, isSubject: pointInPolygon(lon, lat, outerRing) }
  })
}

function pointInPolygon(x: number, y: number, ring: Coord[]): boolean {
  let inside = false
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [xi, yi] = ring[i]
    const [xj, yj] = ring[j]
    if (((yi > y) !== (yj > y)) && x < (xj - xi) * (y - yi) / (yj - yi) + xi) {
      inside = !inside
    }
  }
  return inside
}
