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

const EVENT_TERMS = ['event', 'venue', 'party', 'wedding', 'private event']
const MEDIA_TERMS = ['podcast', 'recording', 'video', 'production', 'creator', 'media']
const PHOTO_TERMS = ['photo', 'photography', 'cyc', 'backdrop', 'shoot']
const MAKER_TERMS = ['maker', 'workshop', 'wood', 'fabrication', 'jewelry', 'craft']

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
