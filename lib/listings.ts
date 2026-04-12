export type Listing = {
  id: string | number
  title: string | null
  price_display: string | null
  neighborhood?: string | null
  external_url?: string | null
  city?: string | null
  category?: string | null
  status?: string | null
  niche_attributes?: Record<string, boolean | string | number | null> | null
}

export const NICHE_FILTERS = [
  { key: 'laser_cutter', label: 'Laser Cutter' },
  { key: 'kiln', label: 'Kiln' },
  { key: 'woodworking_tools', label: 'Woodworking Tools' },
  { key: 'twenty_four_seven_access', label: '24/7 Access' },
] as const

export function slugToLabel(value: string): string {
  return value
    .split('-')
    .map((chunk) => chunk.charAt(0).toUpperCase() + chunk.slice(1))
    .join(' ')
}
