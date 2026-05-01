export const PLACEMENT_TYPES = [
  'featured_category',
  'featured_neighborhood',
  'featured_studio',
] as const
export type PlacementType = (typeof PLACEMENT_TYPES)[number]

export const TARGET_TYPES = ['category', 'neighborhood'] as const
export type TargetType = (typeof TARGET_TYPES)[number]

export const PLACEMENT_STATUSES = [
  'pending',
  'active',
  'cancelled',
  'expired',
  'comped',
] as const
export type PlacementStatus = (typeof PLACEMENT_STATUSES)[number]

export type VisibilityPlacement = {
  id: number
  listing_id: number
  placement_type: PlacementType
  target_type: TargetType
  target_slug: string
  status: PlacementStatus
  starts_at: string | null
  ends_at: string | null
  stripe_customer_id: string | null
  stripe_subscription_id: string | null
  stripe_price_id: string | null
  created_at: string
  updated_at: string
}
