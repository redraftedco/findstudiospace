// Photo limit enforcement per tier.
//
// Free tier: up to 5 photos per listing.
// Pro tier:  up to 15 photos per listing.
//
// Limits match the /pricing and /terms copy. Enforcement is display-side:
// the DB retains every image in the array; rendering slices per tier.
// This avoids fighting the scraper (which could re-add images we deleted)
// and makes Free → Pro upgrade unlock additional photos already present.
//
// Any unknown tier value (null, undefined, '', future string) defaults to
// the free limit for safety — prevents silent crashes or empty galleries
// if a DB row has a malformed tier for any reason.

export const PHOTO_LIMIT_FREE = 5
export const PHOTO_LIMIT_PRO = 15

export function photoLimitForTier(tier: string | null | undefined): number {
  if (tier === 'pro') return PHOTO_LIMIT_PRO
  return PHOTO_LIMIT_FREE
}

/**
 * Slice an image array to the tier's photo limit.
 * - Returns empty array for null/undefined/non-array input.
 * - Preserves ordering.
 * - Does not mutate the input.
 */
export function clampImagesToTier<T>(
  images: T[] | null | undefined,
  tier: string | null | undefined,
): T[] {
  if (!Array.isArray(images)) return []
  const limit = photoLimitForTier(tier)
  return images.slice(0, limit)
}

/**
 * Guard for write paths: return true if the provided image array exceeds
 * the limit for the given tier. Used by future upload routes to reject
 * payloads past the advertised limit.
 */
export function imageCountExceedsTier(
  images: unknown,
  tier: string | null | undefined,
): boolean {
  if (!Array.isArray(images)) return false
  return images.length > photoLimitForTier(tier)
}
