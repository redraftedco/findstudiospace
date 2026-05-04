import type { SiteAnalysisMapData, SiteAnalysisGenerationResult } from './types'
import { CATEGORY_LABELS } from './constants'
import {
  isEligible,
  inferConfidence,
  isApproximateLocation,
  zoningDescription,
  buildCallouts,
} from './mapRules'

type ListingRow = {
  id: number
  title: string | null
  neighborhood: string | null
  type: string | null
  latitude: number | null
  longitude: number | null
  ceiling_height_ft: number | null
  niche_attributes: Record<string, unknown> | null
}

type EnrichmentRow = {
  lat: number | null
  lon: number | null
  zoning_base: string | null
  fema_flood_zone: string | null
  dist_to_max_meters: number | null
  dist_to_bus_meters: number | null
  business_district: string | null
  parking_permit_zone: string | null
  landslide_hazard: string | null
  wildfire_hazard: string | null
  last_enriched_at: string | null
}

export function buildSiteAnalysisData(
  listing: ListingRow,
  enrichment: EnrichmentRow | null,
): SiteAnalysisMapData | SiteAnalysisGenerationResult {
  const lat = enrichment?.lat ?? listing.latitude
  const lon = enrichment?.lon ?? listing.longitude

  const eligibility = isEligible(lat, lon, enrichment as Record<string, unknown> | null)
  if (!eligibility.eligible) {
    return { status: 'skipped', skipReason: eligibility.reason }
  }

  const category = (listing.type ?? '').toLowerCase()
  const zoningCode = enrichment?.zoning_base ?? undefined
  const zoningDesc = zoningCode ? zoningDescription(zoningCode) : undefined
  const hazard = enrichment?.landslide_hazard ?? enrichment?.wildfire_hazard ?? undefined

  const enrichmentForCallouts = {
    zoningCode,
    zoningDesc,
    floodZone: enrichment?.fema_flood_zone ?? undefined,
    distToMaxMeters: enrichment?.dist_to_max_meters ?? undefined,
    distToBusMeters: enrichment?.dist_to_bus_meters ?? undefined,
    businessDistrict: enrichment?.business_district ?? undefined,
    parkingZone: enrichment?.parking_permit_zone ?? undefined,
    hazard: hazard !== 'Potential Hazard Area' ? hazard : 'LANDSLIDE RISK',
  }

  const confidence = inferConfidence(enrichment as Record<string, unknown>)
  const callouts = buildCallouts(category, enrichmentForCallouts, confidence)

  const attrs = listing.niche_attributes ?? {}
  const hasDaylightData = Boolean(attrs.natural_light)

  return {
    listingId: listing.id,
    title: listing.title ?? 'Studio',
    neighborhood: listing.neighborhood ?? 'Portland',
    category: CATEGORY_LABELS[category] ?? 'Studio Space',
    lat: lat!,
    lon: lon!,
    confidence,
    isApproximate: isApproximateLocation(confidence),
    zoningCode,
    zoningDesc,
    floodZone: enrichment?.fema_flood_zone ?? undefined,
    distToMaxMeters: enrichment?.dist_to_max_meters ?? undefined,
    distToBusMeters: enrichment?.dist_to_bus_meters ?? undefined,
    businessDistrict: enrichment?.business_district ?? undefined,
    parkingZone: enrichment?.parking_permit_zone ?? undefined,
    hazard,
    ceilingHeightFt: listing.ceiling_height_ft ?? undefined,
    hasDaylightData,
    callouts,
    generatedAt: new Date().toISOString(),
  }
}
