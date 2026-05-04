import type { GeocodeConfidence, SiteAnalysisCallout } from './types'
import { MAX_CALLOUTS, ZONE_DESCRIPTIONS } from './constants'

export function isEligible(
  lat: number | null,
  lon: number | null,
  enrichment: Record<string, unknown> | null,
): { eligible: boolean; reason?: string } {
  if (!lat || !lon) return { eligible: false, reason: 'missing_coordinates' }

  if (!enrichment) return { eligible: false, reason: 'no_enrichment' }

  const hasMeaningful =
    enrichment.zoning_base ||
    enrichment.fema_flood_zone ||
    enrichment.dist_to_max_meters != null ||
    enrichment.dist_to_bus_meters != null ||
    enrichment.business_district ||
    enrichment.parking_permit_zone ||
    enrichment.landslide_hazard ||
    enrichment.wildfire_hazard

  if (!hasMeaningful) return { eligible: false, reason: 'insufficient_enrichment' }

  return { eligible: true }
}

export function inferConfidence(enrichment: Record<string, unknown>): GeocodeConfidence {
  // If we have transit distance data, spatial join worked well → neighborhood+ confidence
  if (enrichment.dist_to_max_meters != null || enrichment.dist_to_bus_meters != null) {
    return 'neighborhood'
  }
  if (enrichment.zoning_base) return 'neighborhood'
  return 'city'
}

export function isApproximateLocation(confidence: GeocodeConfidence): boolean {
  return confidence === 'neighborhood' || confidence === 'city'
}

export function confidenceLabel(confidence: GeocodeConfidence): string {
  switch (confidence) {
    case 'address': return 'Address-Level Location'
    case 'parcel':  return 'Parcel-Level Location'
    case 'neighborhood': return 'Approx. Neighborhood Location'
    case 'city':    return 'City-Level Location'
  }
}

export function zoningDescription(code: string | null | undefined): string {
  if (!code) return ''
  const upper = code.toUpperCase().trim()
  return ZONE_DESCRIPTIONS[upper] ?? code
}

export function metersToFeet(m: number): number {
  return Math.round(m * 3.28084)
}

export function metersToMiles(m: number): string {
  const miles = m / 1609.34
  return miles < 0.15 ? `${Math.round(m * 3.28084)} ft` : `${miles.toFixed(1)} mi`
}

// Build ordered callouts based on category priority, capped at MAX_CALLOUTS
export function buildCallouts(
  category: string,
  enrichment: {
    zoningCode?: string
    zoningDesc?: string
    floodZone?: string
    distToMaxMeters?: number
    distToBusMeters?: number
    businessDistrict?: string
    parkingZone?: string
    hazard?: string
  },
  confidence: GeocodeConfidence,
): SiteAnalysisCallout[] {
  const all: SiteAnalysisCallout[] = []

  // Zoning
  if (enrichment.zoningCode) {
    all.push({
      icon: 'zone',
      label: 'ZONING',
      value: enrichment.zoningCode.toUpperCase(),
      sub: enrichment.zoningDesc || zoningDescription(enrichment.zoningCode),
    })
  }

  // Transit
  const hasMax = enrichment.distToMaxMeters != null
  const hasBus = enrichment.distToBusMeters != null
  if (hasMax || hasBus) {
    const parts: string[] = []
    if (hasMax) parts.push(`${metersToMiles(enrichment.distToMaxMeters!)} TO MAX`)
    if (hasBus) parts.push(`${metersToMiles(enrichment.distToBusMeters!)} TO BUS`)
    all.push({
      icon: 'transit',
      label: 'TRANSIT',
      value: 'NEARBY',
      sub: parts.join(' · '),
    })
  }

  // Business district
  if (enrichment.businessDistrict) {
    all.push({
      icon: 'business',
      label: 'DISTRICT',
      value: enrichment.businessDistrict.toUpperCase(),
    })
  }

  // Flood
  if (enrichment.floodZone && enrichment.floodZone !== 'X') {
    all.push({
      icon: 'flood',
      label: 'FLOOD',
      value: `ZONE ${enrichment.floodZone}`,
      sub: 'FEMA MAPPED',
    })
  }

  // Parking
  if (enrichment.parkingZone) {
    all.push({
      icon: 'parking',
      label: 'PARKING',
      value: enrichment.parkingZone.toUpperCase(),
    })
  }

  // Hazard
  if (enrichment.hazard && enrichment.hazard !== '0' && enrichment.hazard !== 'false') {
    all.push({
      icon: 'hazard',
      label: 'HAZARD',
      value: enrichment.hazard.toUpperCase().slice(0, 20),
    })
  }

  // Confidence always last
  all.push({
    icon: 'data',
    label: 'CONFIDENCE',
    value: confidenceLabel(confidence).toUpperCase(),
  })

  // Category priority reordering: put transit first for transit-heavy categories
  const transitFirst = ['fitness', 'event', 'retail', 'podcast']
  if (transitFirst.includes(category)) {
    const tIdx = all.findIndex(c => c.icon === 'transit')
    if (tIdx > 0) {
      const [tc] = all.splice(tIdx, 1)
      all.unshift(tc)
    }
  }

  return all.slice(0, MAX_CALLOUTS)
}
