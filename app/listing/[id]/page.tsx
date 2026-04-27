import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'
import { supabase } from '@/lib/supabase'
import { clampImagesToTier } from '@/lib/photo-limits'
import InquiryForm from '@/components/InquiryForm'
import ViewCounter from '@/components/ViewCounter'
import ProUpsell from '@/components/ProUpsell'
import ClaimBanner from '@/components/ClaimBanner'
import { classifyListingToPillar } from '@/lib/pillar-category'

export const revalidate = 3600
const BLOCKED_PUBLIC_LISTING_IDS = new Set(['1104'])

const TEXT_CLASS: Record<string, string> = {
  art:      'cat-text-art',
  workshop: 'cat-text-workshop',
  office:   'cat-text-office',
  photo:    'cat-text-photo',
  retail:   'cat-text-retail',
  fitness:  'cat-text-fitness',
}

const TYPE_TO_LABEL: Record<string, string> = {
  office: 'Event Space',
  art: 'Makerspace',
  workshop: 'Makerspace',
  retail: 'Event Space',
  photo: 'Photo Studios',
  fitness: 'Makerspace',
  music: 'Content Studios',
}

function formatPrice(raw: string | null | undefined): string {
  if (!raw) return 'Price on request'
  const digits = raw.replace(/[^0-9]/g, '')
  if (!digits) return raw
  const num = parseInt(digits, 10)
  if (isNaN(num)) return raw
  return `$${num.toLocaleString('en-US')}/mo`
}

type Props = {
  params: Promise<{ id: string }>
  searchParams: Promise<{ upgrade?: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  if (BLOCKED_PUBLIC_LISTING_IDS.has(id)) return {}
  const { data } = await supabase
    .from('listings')
    .select('title, city, type, neighborhood, price_numeric, price_display, images')
    .eq('id', id)
    .eq('status', 'active')
    .single()
  if (!data) return {}

  const typeLabel = TYPE_TO_LABEL[(data.type ?? '').toLowerCase()] ?? 'Studio'
  const hood = data.neighborhood
  const city = data.city ?? 'Portland'

  const locationPart = hood ? `in ${hood}, ${city}` : `in ${city}`
  const title = `${data.title} — ${typeLabel} for Rent ${locationPart} | FindStudioSpace`

  const pricePart = data.price_numeric
    ? ` Starting at $${data.price_numeric.toLocaleString('en-US')}/mo.`
    : data.price_display
      ? ` Starting at ${data.price_display}/mo.`
      : ''
  const desc = `${typeLabel} for rent ${locationPart}.${pricePart}`.slice(0, 155)

  const images: string[] = Array.isArray(data.images)
    ? (data.images as unknown[])
        .map((x: unknown) => (typeof x === 'string' ? x : (x as Record<string, string>)?.url ?? ''))
        .filter(Boolean)
    : []
  const ogImage = images[0] ?? null

  return {
    title,
    description: desc,
    openGraph: {
      title,
      description: desc,
      ...(ogImage ? { images: [{ url: ogImage }] } : {}),
    },
  }
}

export default async function ListingPage({ params, searchParams }: Props) {
  const { id } = await params
  if (BLOCKED_PUBLIC_LISTING_IDS.has(id)) notFound()
  const sp = await searchParams
  const showUpgradeSuccess = sp.upgrade === 'success'

  const { data: listing } = await supabase
    .from('listings')
    .select('*')
    .eq('id', id)
    .eq('status', 'active')
    .single()

  if (!listing) notFound()

  // Coerce numeric columns once for schema reuse below
  const lat = typeof listing.latitude  === 'number' ? listing.latitude  : null
  const lng = typeof listing.longitude === 'number' ? listing.longitude : null

  const attrs = listing.niche_attributes as Record<string, boolean | string | number | null> | null
  const amenities = attrs
    ? Object.entries(attrs)
        .filter(([, v]) => v === true)
        .map(([k]) => k.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()))
    : []

  // Extract image URLs from the jsonb array, then clamp to tier's photo limit.
  // Free: 5, Pro: 15. Unknown/malformed tier defaults to free. DB keeps the
  // full array; clamp here enforces the /pricing + /terms promise on render.
  const allImages: string[] = Array.isArray(listing.images)
    ? listing.images
        .map((x: unknown) => (typeof x === 'string' ? x : (x as Record<string, string>)?.url ?? ''))
        .filter(Boolean)
    : []
  const images: string[] = clampImagesToTier(allImages, listing.tier)

  const typeKey = (listing.type ?? '').toLowerCase()
  const categorySlug = classifyListingToPillar(listing)
  const categoryLabel = TYPE_TO_LABEL[typeKey] ?? 'Content Studios'
  const priceFormatted = formatPrice(listing.price_display)
  const textClass = TEXT_CLASS[typeKey] ?? ''
  const studioName = listing.title ?? 'this listing'
  const neighborhood = listing.neighborhood ?? 'Portland'
  const isFree = (listing.tier ?? 'free') !== 'pro'
  const isVerified = listing.tier === 'pro'

  // JSON-LD — LocalBusiness. Conditional rendering of every nullable field;
  // empty/undefined keys removed at the end. Google flags incomplete schema
  // when empty-string fields are emitted, so we omit rather than blank-string.
  const address: Record<string, string> = {
    '@type': 'PostalAddress',
    addressLocality: listing.city ?? 'Portland',
    addressRegion: listing.state ?? 'OR',
    addressCountry: 'US',
  }
  if (listing.address)  address.streetAddress = String(listing.address)
  if (listing.zip_code) address.postalCode    = String(listing.zip_code)

  const jsonLd: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: listing.title,
    description: listing.description ? String(listing.description).slice(0, 300) : undefined,
    address,
    ...(listing.neighborhood ? { areaServed: listing.neighborhood } : {}),
    ...(lat !== null && lng !== null
      ? { geo: { '@type': 'GeoCoordinates', latitude: lat, longitude: lng } }
      : {}),
    ...(listing.contact_phone ? { telephone: String(listing.contact_phone) } : {}),
    ...(images.length > 0 ? { image: images[0] } : {}),
    // priceRange is for ranges (e.g. "$$" or "$50-$100"); only emit when we
    // have a real display value. Drop the '$$' fallback — Google flags
    // generic price symbols on LocalBusiness as low-quality.
    ...(listing.price_display ? { priceRange: String(listing.price_display) } : {}),
    url: `https://www.findstudiospace.com/listing/${listing.id}`,
  }
  Object.keys(jsonLd).forEach((k) => jsonLd[k] === undefined && delete jsonLd[k])

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.findstudiospace.com' },
      { '@type': 'ListItem', position: 2, name: 'Portland', item: 'https://www.findstudiospace.com/portland' },
      ...(categorySlug
        ? [{
            '@type': 'ListItem',
            position: 3,
            name: categoryLabel,
            item: `https://www.findstudiospace.com/portland/${categorySlug}`,
          }]
        : []),
      {
        '@type': 'ListItem',
        position: categorySlug ? 4 : 3,
        name: listing.title ?? 'Listing',
      },
    ],
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />

      {/* Claim banner — above breadcrumb, full-width, dismissible */}
      {isFree && <ClaimBanner listingId={String(listing.id)} studioName={studioName} />}

      {/* Upgrade success banner — display-only; tier check stays on DB */}
      {showUpgradeSuccess && (
        <div
          style={{
            background: 'var(--surface)',
            borderBottom: '1px solid var(--rule)',
            padding: '10px 16px',
            fontFamily: 'var(--font-mono)',
            fontSize: '12px',
            color: 'var(--ink)',
            textAlign: 'center',
            letterSpacing: '0.02em',
          }}
        >
          Your listing is now Pro — featured placement is live.
        </div>
      )}

      <main style={{ background: 'var(--paper)', color: 'var(--ink)' }} className="min-h-screen">
        <div className="mx-auto" style={{ maxWidth: '1200px', padding: '2rem 1.5rem 4rem' }}>

          {/* Breadcrumb */}
          <nav
            style={{
              color: 'var(--stone)',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.75rem',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              marginBottom: '1.5rem',
            }}
          >
            <Link href="/portland" style={{ color: 'var(--ink)' }} className="hover:underline">Directory</Link>
            <span style={{ margin: '0 0.5rem', color: 'var(--rule)' }}>/</span>
            <Link href="/portland" style={{ color: 'var(--ink)' }} className="hover:underline">Portland</Link>
            {listing.neighborhood && (
              <>
                <span style={{ margin: '0 0.5rem', color: 'var(--rule)' }}>/</span>
                <span>{listing.neighborhood}</span>
              </>
            )}
            <span style={{ margin: '0 0.5rem', color: 'var(--rule)' }}>/</span>
            <span style={{ color: 'var(--stone)' }}>{studioName}</span>
          </nav>

          {/* Title row */}
          <h1
            style={{
              fontFamily: 'var(--font-heading)',
              color: 'var(--ink)',
              fontSize: '2.5rem',
              fontWeight: 600,
              letterSpacing: '-0.02em',
              lineHeight: 1.1,
              margin: '0 0 0.75rem',
            }}
            className="listing-title"
          >
            {studioName}
            {listing.tier === 'pro' && (
              <span style={{ marginLeft: '0.75rem', verticalAlign: 'middle', display: 'inline-block' }}>
                <span className="pro-badge">Pro</span>
              </span>
            )}
          </h1>

          {/* Metadata line: Neighborhood · Type · Sqft */}
          <p
            style={{
              fontFamily: 'var(--font-body)',
              color: 'var(--stone)',
              fontSize: '1rem',
              margin: '0 0 2rem',
            }}
          >
            {neighborhood}
            {categoryLabel && (
              <>
                <span style={{ margin: '0 0.4rem', color: 'var(--rule)' }}>·</span>
                <span className={textClass}>{categoryLabel}</span>
              </>
            )}
            {listing.square_footage && (
              <>
                <span style={{ margin: '0 0.4rem', color: 'var(--rule)' }}>·</span>
                <span>{listing.square_footage.toLocaleString('en-US')} SF</span>
              </>
            )}
          </p>

          <p
            style={{
              margin: '0 0 1.25rem',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.72rem',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              color: 'var(--stone)',
            }}
          >
            Listing status: {isVerified ? 'Verified listing' : 'Unverified listing'} · FindStudioSpace is a lead-generation platform, not a broker.
          </p>

          <ViewCounter listingId={String(listing.id)} tier={listing.tier ?? 'free'} />

          {/* Two-column layout */}
          <div className="listing-detail-layout">

            {/* Left column */}
            <div className="listing-detail-main">
              {/* Gallery */}
              {images.length === 0 ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src="/placeholder-studio.svg"
                  alt=""
                  width={1200}
                  height={675}
                  style={{
                    width: '100%',
                    aspectRatio: '16 / 9',
                    objectFit: 'cover',
                    display: 'block',
                    borderRadius: '2px',
                  }}
                />
              ) : (
                <>
                  {/* Hero image */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={images[0]}
                    alt={`${listing.title ?? 'Studio'} in ${listing.neighborhood ?? 'Portland'}, OR`}
                    width={1200}
                    height={675}
                    fetchPriority="high"
                    loading="eager"
                    style={{
                      width: '100%',
                      aspectRatio: '16 / 9',
                      objectFit: 'cover',
                      display: 'block',
                      borderRadius: '2px',
                    }}
                  />
                  {images.length > 1 && (
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(4, 1fr)',
                        gap: '1rem',
                        marginTop: '1rem',
                      }}
                    >
                      {images.slice(1, 5).map((src, i) => (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          key={i}
                          src={src}
                          alt=""
                          width={300}
                          height={225}
                          loading="lazy"
                          style={{
                            width: '100%',
                            aspectRatio: '4 / 3',
                            objectFit: 'cover',
                            display: 'block',
                            borderRadius: '2px',
                          }}
                        />
                      ))}
                    </div>
                  )}
                </>
              )}

              {/* Hairline */}
              <hr
                style={{
                  border: 'none',
                  borderTop: '1px solid var(--rule)',
                  margin: '3rem 0',
                }}
              />

              {/* About */}
              <section style={{ maxWidth: '680px' }}>
                <h2
                  style={{
                    fontFamily: 'var(--font-heading)',
                    color: 'var(--ink)',
                    fontSize: '1.5rem',
                    fontWeight: 600,
                    letterSpacing: '-0.015em',
                    margin: '0 0 1rem',
                  }}
                >
                  About
                </h2>
                <p
                  style={{
                    fontFamily: 'var(--font-body)',
                    color: 'var(--ink)',
                    fontSize: '1rem',
                    lineHeight: 1.6,
                    whiteSpace: 'pre-line',
                    margin: 0,
                  }}
                >
                  {listing.description ?? 'No description available.'}
                </p>
              </section>

              {/* Amenities */}
              {amenities.length > 0 && (
                <section style={{ maxWidth: '680px', marginTop: '2.5rem' }}>
                  <h2
                    style={{
                      fontFamily: 'var(--font-heading)',
                      color: 'var(--ink)',
                      fontSize: '1.5rem',
                      fontWeight: 600,
                      letterSpacing: '-0.015em',
                      margin: '0 0 1rem',
                    }}
                  >
                    Amenities
                  </h2>
                  <ul
                    style={{
                      listStyle: 'disc',
                      paddingLeft: '1.25rem',
                      margin: 0,
                      color: 'var(--ink)',
                      fontSize: '1rem',
                      lineHeight: 1.6,
                    }}
                  >
                    {amenities.map((a) => (
                      <li key={a}>{a}</li>
                    ))}
                  </ul>
                </section>
              )}

              {/* Pro links — website & Instagram (Pro tier only) */}
              {listing.tier === 'pro' && (listing.website_url || listing.instagram_url) && (
                <section style={{ maxWidth: '680px', marginTop: '2.5rem' }}>
                  <h2
                    style={{
                      fontFamily: 'var(--font-heading)',
                      color: 'var(--ink)',
                      fontSize: '1.5rem',
                      fontWeight: 600,
                      letterSpacing: '-0.015em',
                      margin: '0 0 1rem',
                    }}
                  >
                    Links
                  </h2>
                  <div className="flex flex-wrap gap-4">
                    {listing.website_url && (
                      <a
                        href={listing.website_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: 'var(--action)', fontFamily: 'var(--font-body)' }}
                        className="text-sm hover:underline"
                      >
                        Website ↗
                      </a>
                    )}
                    {listing.instagram_url && (
                      <a
                        href={listing.instagram_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: 'var(--action)', fontFamily: 'var(--font-body)' }}
                        className="text-sm hover:underline"
                      >
                        Instagram ↗
                      </a>
                    )}
                  </div>
                </section>
              )}

              {/* Hairline */}
              <hr
                style={{
                  border: 'none',
                  borderTop: '1px solid var(--rule)',
                  margin: '3rem 0 1.5rem',
                }}
              />

              {/* Listing ID */}
              <p
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.75rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  color: 'var(--stone)',
                  margin: 0,
                }}
              >
                LISTING ID · {listing.id}
              </p>
            </div>

            {/* Right column — sticky inquiry form */}
            <aside className="listing-detail-aside">
              <p
                style={{
                  fontFamily: 'var(--font-heading)',
                  color: 'var(--ink)',
                  fontSize: '1.5rem',
                  fontWeight: 500,
                  margin: '0 0 2px',
                  letterSpacing: '-0.01em',
                }}
              >
                {priceFormatted}
              </p>
              <p
                style={{
                  fontFamily: 'var(--font-body)',
                  color: 'var(--stone)',
                  fontSize: '0.875rem',
                  margin: '0 0 2rem',
                }}
              >
                per month
              </p>
              <InquiryForm listingId={String(listing.id)} />

              <div
                style={{
                  border: '1px solid var(--rule)',
                  background: 'var(--surface)',
                  padding: '12px',
                  marginTop: '12px',
                  color: 'var(--stone)',
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.8rem',
                  lineHeight: 1.55,
                }}
              >
                Listing information is provided by the owner/operator or public sources and may change.
                Please verify availability, pricing, permits, and fit before entering any agreement.
              </div>

              {isFree && <ProUpsell listingId={String(listing.id)} />}
            </aside>
          </div>
        </div>

        {/* Mobile sticky inquiry bar — CSS-only; hidden on desktop */}
        <a href="#inquiry" className="mobile-inquiry-bar">
          Inquire about this studio
        </a>
      </main>
    </>
  )
}
