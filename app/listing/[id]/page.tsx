import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'
import { supabase } from '@/lib/supabase'
import { clampImagesToTier } from '@/lib/photo-limits'
import ListingGallery from '@/components/ListingGallery'
import InquiryForm from '@/components/InquiryForm'
import ViewCounter from '@/components/ViewCounter'
import ProUpsell from '@/components/ProUpsell'
import ClaimBanner from '@/components/ClaimBanner'
import ArchSpecs from '@/components/ArchSpecs'
import SpaceBadges from '@/components/SpaceBadges'
import PreLeaseChecklist from '@/components/PreLeaseChecklist'

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
  art:      'Art Studio',
  workshop: 'Workshop Space',
  office:   'Office Space',
  photo:    'Photo Studio',
  retail:   'Retail Space',
  fitness:  'Fitness & Dance',
  music:    'Music Studio',
}

const TYPE_TO_CATEGORY_SLUG: Record<string, string> = {
  art:      'art-studio-rental',
  workshop: 'workshop-space-rental',
  office:   'office-space-rental',
  photo:    'photo-studios',
  retail:   'retail-space-for-rent',
  fitness:  'fitness-studio-rental',
  music:    'music-studio-rental',
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

export default async function ListingPage({ params }: Props) {
  const { id } = await params
  if (BLOCKED_PUBLIC_LISTING_IDS.has(id)) notFound()

  const { data: listing } = await supabase
    .from('listings')
    .select('*')
    .eq('id', id)
    .single()

  if (!listing) notFound()

  const { data: enrichment } = await supabase
    .from('listing_enrichment')
    .select('zoning_base,airport_noise_dnl_band,fema_flood_zone,wildfire_hazard,landslide_hazard,parking_permit_zone,business_district,hri_listed,opportunity_zone,nearest_max_stop_id,dist_to_max_meters,nearest_bus_stop_id,dist_to_bus_meters')
    .eq('listing_id', id)
    .maybeSingle()

  // Inactive or removed listings 301 to their parent category page
  if (listing.status !== 'active') {
    const typeKey = (listing.type ?? '').toLowerCase()
    const categorySlug = TYPE_TO_CATEGORY_SLUG[typeKey]
    redirect(categorySlug ? `/portland/${categorySlug}` : '/portland')
  }

  // Coerce numeric columns once for schema reuse below
  const lat = typeof listing.latitude  === 'number' ? listing.latitude  : null
  const lng = typeof listing.longitude === 'number' ? listing.longitude : null

  const attrs = listing.niche_attributes as Record<string, boolean | string | number | null> | null

  // Keys that are classifier internals, not user-facing features
  const SKIP_ATTR_KEYS = new Set(['category', 'space_type'])
  const ATTR_LABELS: Record<string, string> = {
    natural_light:       'Natural light',
    cyc_wall:            'Cyc wall',
    green_screen:        'Green screen',
    product_photography: 'Product photography',
    private_event:       'Private events',
    has_rental_lang:     'Rental terms',
    has_pricing:         'Pricing listed',
    loading_dock:        'Loading dock',
    three_phase_power:   'Three-phase power',
    freight_elevator:    'Freight elevator',
    sound_treated:       'Sound treatment',
    hvac:                'HVAC',
    kitchen:             'Kitchen',
    outdoor_space:       'Outdoor space',
    parking:             'Parking',
    wifi:                'Wi-Fi',
    storage:             'Storage',
    av_equipment:        'AV equipment',
    spray_booth:         'Spray booth',
    laser_cutter:        'Laser cutter',
    cnc_router:          'CNC router',
    three_d_printer:     '3D printer',
    darkroom:            'Darkroom',
    backdrop:            'Backdrop',
  }
  const features: string[] = attrs
    ? Object.entries(attrs)
        .filter(([k, v]) => !SKIP_ATTR_KEYS.has(k) && v === true)
        .map(([k]) => ATTR_LABELS[k] ?? k.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()))
    : []

  const sqft = typeof listing.square_footage === 'number' && listing.square_footage > 0
    ? listing.square_footage
    : null

  // Extract image URLs from the jsonb array, then clamp to tier's photo limit.
  // Free: 5, Pro: 15. Unknown/malformed tier defaults to free. DB keeps the
  // full array; clamp here enforces the /pricing + /terms promise on render.
  const allImages: string[] = Array.isArray(listing.images)
    ? listing.images
        .map((x: unknown) => (typeof x === 'string' ? x : (x as Record<string, string>)?.url ?? ''))
        .filter(Boolean)
    : []

  if (allImages.length === 0) redirect('/portland')

  const images: string[] = clampImagesToTier(allImages, listing.tier)

  const typeKey = (listing.type ?? '').toLowerCase()
  const categorySlug = TYPE_TO_CATEGORY_SLUG[typeKey] ?? null
  const categoryLabel = TYPE_TO_LABEL[typeKey] ?? 'Studio'
  const priceFormatted = formatPrice(listing.price_display)
  const textClass = TEXT_CLASS[typeKey] ?? ''
  const studioName = listing.title ?? 'this listing'
  const neighborhood = listing.neighborhood ?? 'Portland'

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
    name: listing.title ?? 'Studio',
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
    ...(listing.price_numeric
      ? {
          makesOffer: {
            '@type': 'Offer',
            price: String(listing.price_numeric),
            priceCurrency: 'USD',
            priceSpecification: {
              '@type': 'UnitPriceSpecification',
              price: String(listing.price_numeric),
              priceCurrency: 'USD',
              unitText: 'MON',
            },
            availability: 'https://schema.org/InStock',
            url: `https://www.findstudiospace.com/listing/${listing.id}`,
          },
        }
      : {}),
  }
  Object.keys(jsonLd).forEach((k) => (jsonLd[k] === undefined || jsonLd[k] === null) && delete jsonLd[k])

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
      <ClaimBanner listingId={String(listing.id)} studioName={studioName} />

      <main style={{ background: 'var(--paper)', color: 'var(--ink)' }} className="min-h-screen">
        <div className="mx-auto" style={{ maxWidth: '1200px', padding: '2rem 1.5rem 4rem' }}>

          {/* Breadcrumb */}
          <nav
            style={{
              color: 'var(--stone)',
              fontFamily: 'var(--font-body)',
              fontSize: '0.75rem',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
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

          <ViewCounter listingId={String(listing.id)} tier={listing.tier ?? 'free'} />

          {/* Two-column layout */}
          <div className="listing-detail-layout">

            {/* Left column */}
            <div className="listing-detail-main">
              {/* Gallery — hover any thumbnail to preview in the hero slot */}
              <ListingGallery
                images={images}
                title={listing.title ?? 'Studio'}
                neighborhood={listing.neighborhood ?? 'Portland'}
              />

              {/* Hairline */}
              <hr
                style={{
                  border: 'none',
                  borderTop: '1px solid var(--rule)',
                  margin: '3rem 0',
                }}
              />

              {/* Space details — specs + features + description */}
              <section style={{ maxWidth: '65ch' }}>

                {/* Spec table */}
                <dl style={{ margin: 0 }}>
                  {[
                    { label: 'Type',         value: TYPE_TO_LABEL[typeKey] ?? listing.type },
                    { label: 'Neighborhood', value: listing.neighborhood },
                    { label: 'Size',         value: sqft ? `${sqft.toLocaleString('en-US')} sq ft` : null },
                    { label: 'Monthly',      value: listing.price_display ? formatPrice(listing.price_display) : null },
                  ]
                    .filter((r) => r.value)
                    .map((row, i, arr) => (
                      <div
                        key={row.label}
                        style={{
                          display: 'grid',
                          gridTemplateColumns: '120px 1fr',
                          gap: '0 1.5rem',
                          padding: '0.75rem 0',
                          borderBottom: i < arr.length - 1 ? '1px solid var(--rule)' : 'none',
                        }}
                      >
                        <dt
                          style={{
                            fontFamily: 'var(--font-mono)',
                            fontSize: '0.6875rem',
                            letterSpacing: '0.08em',
                            textTransform: 'uppercase',
                            color: 'var(--stone)',
                            paddingTop: '2px',
                          }}
                        >
                          {row.label}
                        </dt>
                        <dd
                          style={{
                            fontFamily: 'var(--font-body)',
                            fontSize: '0.9375rem',
                            color: 'var(--ink)',
                            margin: 0,
                            fontWeight: 500,
                          }}
                        >
                          {row.value}
                        </dd>
                      </div>
                    ))}
                </dl>

                {/* Feature tags */}
                {features.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem', marginTop: '1.5rem' }}>
                    {features.map((f) => (
                      <span
                        key={f}
                        style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: '0.6875rem',
                          letterSpacing: '0.06em',
                          textTransform: 'uppercase',
                          color: 'var(--stone)',
                          border: '1px solid var(--rule)',
                          padding: '4px 10px',
                          borderRadius: '2px',
                        }}
                      >
                        {f}
                      </span>
                    ))}
                  </div>
                )}

                {/* Description */}
                {listing.description && (
                  <p
                    style={{
                      fontFamily: 'var(--font-body)',
                      color: 'var(--sub)',
                      fontSize: '0.9375rem',
                      lineHeight: 1.7,
                      whiteSpace: 'pre-line',
                      margin: '2rem 0 0',
                    }}
                  >
                    {listing.description}
                  </p>
                )}
              </section>


              {/* Technical specs */}
              {(listing.ceiling_height_ft || listing.power_amps || listing.voltage_phase ||
                listing.stc_rating || listing.nc_rating || listing.floor_type ||
                listing.loading_dock_type || listing.ventilation_cfm ||
                listing.kiln_ready || listing.cyc_wall_struct) && (
                <>
                  <hr style={{ border: 'none', borderTop: '1px solid var(--rule)', margin: '3rem 0' }} />
                  <ArchSpecs
                    ceilingHeightFt={listing.ceiling_height_ft}
                    powerAmps={listing.power_amps}
                    voltagePhase={listing.voltage_phase}
                    stcRating={listing.stc_rating}
                    ncRating={listing.nc_rating}
                    floorType={listing.floor_type}
                    loadingDockType={listing.loading_dock_type}
                    ventilationCfm={listing.ventilation_cfm}
                    kilnReady={listing.kiln_ready}
                    cycWall={listing.cyc_wall_struct}
                  />
                </>
              )}

              {/* GIS location data */}
              {enrichment && (
                <>
                  <hr style={{ border: 'none', borderTop: '1px solid var(--rule)', margin: '3rem 0' }} />
                  <SpaceBadges enrichment={enrichment} />
                </>
              )}

              {/* Pre-lease checklist */}
              {listing.type && (
                <>
                  <hr style={{ border: 'none', borderTop: '1px solid var(--rule)', margin: '3rem 0' }} />
                  <PreLeaseChecklist studioType={listing.type} />
                </>
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
              <div className="listing-sidebar-card">
                <p
                  style={{
                    fontFamily: 'var(--font-heading)',
                    color: 'var(--lime)',
                    fontSize: '2rem',
                    fontWeight: 700,
                    margin: '0 0 2px',
                    letterSpacing: '-0.02em',
                    lineHeight: 1,
                  }}
                >
                  {priceFormatted}
                </p>
                <p
                  style={{
                    fontFamily: 'var(--font-body)',
                    color: 'var(--stone)',
                    fontSize: '0.8125rem',
                    margin: '0 0 1.5rem',
                  }}
                >
                  per month
                </p>
                <InquiryForm listingId={String(listing.id)} listingTitle={studioName} />
              </div>

              <ProUpsell listingId={String(listing.id)} />
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
