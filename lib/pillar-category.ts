export type PillarCategorySlug =
  | 'event-space'
  | 'content-studios'
  | 'photo-studios'
  | 'makerspace'

type ListingForCategory = {
  title?: string | null
  description?: string | null
  type?: string | null
}

// Strict rental-intent signals. Single-word matches like 'photo', 'studio',
// 'shoot', 'wedding' triggered false positives where a general creative space
// listed photography/events/podcasts as use cases ("perfect for photographers,
// podcasts, weddings"). Now requires multi-word rental-specific terminology.
const EVENT_TERMS = [
  'event space', 'event venue', 'private event', 'venue rental',
  'wedding venue', 'party venue', 'event rental', 'rooftop venue',
]

const MEDIA_TERMS = [
  'podcast studio', 'podcast booth', 'recording studio', 'video production',
  'production studio', 'sound stage', 'voiceover booth',
  'content creator studio', 'video studio',
]

const PHOTO_TERMS = [
  'photography studio', 'photo studio', 'cyclorama', 'cyc wall',
  'seamless backdrop', 'product photography studio', 'headshot studio',
  'photo shoot location', 'photography rental',
]

const MAKER_TERMS = [
  'makerspace', 'maker space', 'wood shop', 'woodshop',
  'fabrication lab', 'fab lab', 'metal shop', 'metalworking',
  'ceramics studio', 'jewelry studio', '3d printing', 'workshop space',
]

const TYPE_TO_PILLAR: Record<string, PillarCategorySlug> = {
  retail: 'event-space',
  music: 'content-studios',
  photo: 'photo-studios',
  art: 'makerspace',
  workshop: 'makerspace',
  office: 'event-space',
  fitness: 'makerspace',
}

function hasAnyTerm(haystack: string, terms: string[]): boolean {
  return terms.some((term) => haystack.includes(term))
}

export function classifyListingToPillar(listing: ListingForCategory): PillarCategorySlug {
  const haystack = `${listing.title ?? ''} ${listing.description ?? ''} ${listing.type ?? ''}`.toLowerCase()
  const typeKey = (listing.type ?? '').toLowerCase()

  if (hasAnyTerm(haystack, EVENT_TERMS)) return 'event-space'
  if (hasAnyTerm(haystack, PHOTO_TERMS)) return 'photo-studios'
  if (hasAnyTerm(haystack, MAKER_TERMS)) return 'makerspace'
  if (hasAnyTerm(haystack, MEDIA_TERMS)) return 'content-studios'

  return TYPE_TO_PILLAR[typeKey] ?? 'content-studios'
}
