export type AmenityOption = { key: string; label: string; count: number }

const AMENITY_LABELS: Record<string, string> = {
  cyc_wall: 'Cyc Wall',
  natural_light: 'Natural Light',
  green_screen: 'Green Screen',
  product_photography: 'Product Photography',
  self_service: 'Self-Service',
  photo_shoot_friendly: 'Photo Shoot Friendly',
}

export function formatAmenityLabel(key: string): string {
  return AMENITY_LABELS[key] ?? key.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
}

export function topAmenityOptions<T extends { niche_attributes?: Record<string, unknown> | null }>(
  listings: T[],
  limit = 12,
): AmenityOption[] {
  const counts = new Map<string, number>()

  for (const listing of listings) {
    const attrs = listing.niche_attributes
    if (!attrs || typeof attrs !== 'object') continue

    for (const [key, value] of Object.entries(attrs)) {
      if (value === true) counts.set(key, (counts.get(key) ?? 0) + 1)
    }
  }

  return Array.from(counts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([key, count]) => ({ key, count, label: formatAmenityLabel(key) }))
}

export function hasAmenity(attrs: Record<string, unknown> | null | undefined, amenity: string): boolean {
  return attrs?.[amenity] === true
}
