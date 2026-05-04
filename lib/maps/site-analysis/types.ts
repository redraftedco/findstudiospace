export type SiteAnalysisMapStatus = 'pending' | 'generated' | 'skipped' | 'failed'

export type GeocodeConfidence = 'address' | 'parcel' | 'neighborhood' | 'city'

export interface SiteAnalysisCallout {
  icon: 'zone' | 'transit' | 'flood' | 'business' | 'parking' | 'hazard' | 'data'
  label: string
  value: string
  sub?: string
}

export interface SiteAnalysisMapData {
  listingId: number
  title: string
  neighborhood: string
  category: string
  lat: number
  lon: number
  confidence: GeocodeConfidence
  isApproximate: boolean

  // GIS fields (all optional)
  zoningCode?: string
  zoningDesc?: string
  floodZone?: string
  distToMaxMeters?: number
  distToBusMeters?: number
  businessDistrict?: string
  parkingZone?: string
  hazard?: string

  // Listing specs (optional, for section view)
  ceilingHeightFt?: number
  hasDaylightData: boolean

  callouts: SiteAnalysisCallout[]
  generatedAt: string
}

export interface SiteAnalysisGenerationResult {
  status: SiteAnalysisMapStatus
  mapUrl?: string
  skipReason?: string
  error?: string
}
