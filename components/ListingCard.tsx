import Link from 'next/link'
import { clampImagesToTier } from '@/lib/photo-limits'

// Shared editorial listing card — single source of truth for card appearance
// across homepage and category pages. Server component; accepts a minimal
// listing shape so it can be fed from any loader.

type Listing = {
  id: number
  title: string | null
  price_display: string | null
  neighborhood: string | null
  type: string | null
  images: unknown
  tier: string | null
}

type Props = { listing: Listing }

const TEXT_CLASS: Record<string, string> = {
  art:      'cat-text-art',
  workshop: 'cat-text-workshop',
  office:   'cat-text-office',
  photo:    'cat-text-photo',
  retail:   'cat-text-retail',
  fitness:  'cat-text-fitness',
}

const TYPE_LABEL: Record<string, string> = {
  art:      'Art Studio',
  music:    'Music Studio',
  workshop: 'Workshop',
  photo:    'Photo Studio',
  retail:   'Retail Space',
  fitness:  'Fitness & Dance',
  office:   'Office Space',
}

function getThumb(images: unknown, tier: string | null | undefined): string | null {
  if (!Array.isArray(images)) return null
  // Clamp to tier photo limit. For the card's single-thumbnail use, this is a
  // no-op (thumb is always images[0]); kept for consistency with the listing
  // detail page and to future-proof hover-carousel or multi-image card variants.
  const clamped = clampImagesToTier(images, tier)
  for (const x of clamped) {
    if (typeof x === 'string' && x) return x
    if (typeof x === 'object' && x !== null && 'url' in x) {
      const url = (x as Record<string, string>).url
      if (typeof url === 'string' && url) return url
    }
  }
  return null
}

function formatPrice(raw: string | null | undefined): string | null {
  if (!raw) return null
  const digits = raw.replace(/[^0-9]/g, '')
  if (!digits) return raw
  const num = parseInt(digits, 10)
  if (isNaN(num)) return raw
  return `$${num.toLocaleString('en-US')}/mo`
}

export default function ListingCard({ listing }: Props) {
  const thumb = getThumb(listing.images, listing.tier)
  const typeKey = (listing.type ?? '').toLowerCase()
  const textClass = TEXT_CLASS[typeKey] ?? ''
  const typeLabel = TYPE_LABEL[typeKey] ?? listing.type ?? ''
  const priceFormatted = formatPrice(listing.price_display)
  const isPro = listing.tier === 'pro'

  return (
    <Link
      href={`/listing/${listing.id}`}
      className="listing-card group"
      style={{ textDecoration: 'none' }}
    >
      <div className="listing-card-image-wrap">
        {thumb ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={thumb}
            alt=""
            width={600}
            height={450}
            loading="lazy"
            className="listing-card-image"
          />
        ) : (
          <div className="listing-card-image-placeholder">
            <span>NO IMAGE</span>
          </div>
        )}
        {isPro && (
          <span
            style={{
              position: 'absolute',
              top: '8px',
              right: '8px',
              background: 'var(--featured-bg)',
              color: 'var(--featured-color)',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.7rem',
              letterSpacing: '0.08em',
              padding: '3px 8px',
              borderRadius: '4px',
              fontWeight: 500,
            }}
          >
            PRO
          </span>
        )}
      </div>
      <div className="listing-card-body">
        <h3
          className="listing-card-name"
          style={{
            fontFamily: 'var(--font-heading)',
            color: 'var(--ink)',
            fontSize: '1.125rem',
            fontWeight: 600,
            letterSpacing: '-0.01em',
            lineHeight: 1.3,
            margin: 0,
          }}
        >
          {listing.title ?? 'Untitled listing'}
        </h3>
        <p
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.75rem',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            color: 'var(--stone)',
            marginTop: '4px',
            marginBottom: 0,
          }}
        >
          {listing.neighborhood || 'Portland'}
          {typeLabel && (
            <>
              {' · '}
              <span className={textClass}>{typeLabel}</span>
            </>
          )}
        </p>
        <p
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '1rem',
            fontWeight: 500,
            color: priceFormatted ? 'var(--ink)' : 'var(--stone)',
            marginTop: 'auto',
            paddingTop: '8px',
            marginBottom: 0,
          }}
        >
          {priceFormatted ?? 'Price on request'}
        </p>
      </div>
    </Link>
  )
}
