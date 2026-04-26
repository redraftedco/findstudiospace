/**
 * Quality gate for SEO indexability.
 *
 * Pure function — no DB calls, no side effects.
 * Used by page templates (generateMetadata robots tag) and
 * the publish-city.js script.
 *
 * Rules (all must pass to be indexable):
 *  1. City must be published (is_indexable = true in cities table)
 *  2. Page must have >= MIN_LISTING_COUNT listings
 *  3. >= MIN_PHOTO_RATIO fraction of listings must have at least one photo
 */

export type QualityGateInput = {
  /** Total number of listings on this page */
  listingCount: number
  /** 0–1: fraction of listings with at least one photo */
  photoRatio: number
  /** Whether the parent city has is_indexable = true */
  cityIndexable: boolean
}

export type QualityGateResult = {
  indexable: boolean
  reason: string
}

const MIN_LISTING_COUNT = 4
const MIN_PHOTO_RATIO = 0.5

export function qualityGate(input: QualityGateInput): QualityGateResult {
  if (!input.cityIndexable) {
    return { indexable: false, reason: 'city not yet published' }
  }
  if (input.listingCount < MIN_LISTING_COUNT) {
    return {
      indexable: false,
      reason: `only ${input.listingCount} listing${input.listingCount === 1 ? '' : 's'} — need at least ${MIN_LISTING_COUNT}`,
    }
  }
  if (input.photoRatio < MIN_PHOTO_RATIO) {
    return {
      indexable: false,
      reason: `${Math.round(input.photoRatio * 100)}% of listings have photos — need at least ${Math.round(MIN_PHOTO_RATIO * 100)}%`,
    }
  }
  return { indexable: true, reason: 'all quality thresholds met' }
}
