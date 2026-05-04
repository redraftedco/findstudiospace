import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@supabase/supabase-js'
import ListingCard from '@/components/ListingCard'
import { qualityGate } from '@/lib/seo/qualityGate'
import { robotsContent } from '@/lib/seo/robotsTag'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
)

// Static config for cities with hand-crafted copy. Cities not listed here fall
// back to a DB lookup against the cities table at request time.
const CITY_CONFIG: Record<string, {
  displayName: string
  state: string
  title: string
  description: string
}> = {
  portland: {
    displayName: 'Portland',
    state: 'OR',
    title: 'Portland Studio Space for Rent, Art Studios, Workshops, Photo Studios | FindStudioSpace',
    description: 'Browse Portland studio rentals, art studios, photo studios, workshop space, event venues, and creative workspace across every neighborhood. Free to search.',
  },
  seattle: {
    displayName: 'Seattle',
    state: 'WA',
    title: 'Find Studio Space in Seattle, WA | FindStudioSpace',
    description: 'Browse monthly studio rentals in Seattle, art studios, workshops, offices, photo studios, and creative spaces for makers and producers.',
  },
  atlanta: {
    displayName: 'Atlanta',
    state: 'GA',
    title: 'Studio Rental in Atlanta, GA, Creative Workspace | FindStudioSpace',
    description: 'Browse Atlanta studio rentals, art studios, photo studios, workshops, event space, and creative workspace across Old Fourth Ward, West Midtown, Castleberry Hill, and beyond.',
  },
}

// Primary browse paths per city. Portland uses Ahrefs-prioritized pillar pages
// (highest-volume, lowest-KD categories). Seattle/Atlanta use city-scoped routes.
const CATEGORY_PILLS: Record<string, { href: string; label: string; note: string }[]> = {
  portland: [
    { href: '/event-spaces-portland',            label: 'Event spaces',      note: 'Pop-ups, parties, brand activations' },
    { href: '/podcast-studios',                  label: 'Podcast studios',   note: 'Soundproofed, mic-ready rooms' },
    { href: '/photography-studios-portland',     label: 'Photo studios',     note: 'Cyc walls, natural light, sets' },
    { href: '/makerspace-portland',              label: 'Makerspace',        note: 'Laser cutters, woodshop, fab tools' },
    { href: '/video-production-studios-portland',label: 'Video production',  note: 'Green screen, stages, grip' },
    { href: '/industrial-spaces-portland',       label: 'Industrial space',  note: 'Loading dock, 220v, warehouse' },
  ],
  seattle: [
    { href: '/seattle/photo-studio-rental',      label: 'Photo studios',     note: 'Cyc walls, daylight, sets' },
    { href: '/seattle/art-studio-rental',        label: 'Art studios',       note: 'Private rooms, shared shops' },
    { href: '/seattle/workshop-space-rental',    label: 'Workshops',         note: 'Tools, storage, production' },
    { href: '/seattle/office-space-rental',      label: 'Creative offices',  note: 'Quiet rooms, small teams' },
    { href: '/seattle/music-studio-rental',      label: 'Music studios',     note: 'Rehearsal, recording, lockout' },
    { href: '/seattle/fitness-studio-rental',    label: 'Movement rooms',    note: 'Yoga, dance, wellness' },
  ],
  atlanta: [
    { href: '/atlanta/photo-studio-rental',      label: 'Photo studios',     note: 'Cyc walls, daylight, sets' },
    { href: '/atlanta/art-studio-rental',        label: 'Art studios',       note: 'Private rooms, shared shops' },
    { href: '/atlanta/workshop-space-rental',    label: 'Workshops',         note: 'Tools, storage, production' },
    { href: '/atlanta/office-space-rental',      label: 'Creative offices',  note: 'Quiet rooms, small teams' },
    { href: '/atlanta/music-studio-rental',      label: 'Music studios',     note: 'Rehearsal, recording, lockout' },
    { href: '/atlanta/fitness-studio-rental',    label: 'Movement rooms',    note: 'Yoga, dance, wellness' },
  ],
}

// Neighborhood entry points, these pages already exist in category config;
// surfacing them on the homepage gives Google a crawl path and users a fast
// neighborhood-first filter.
const NEIGHBORHOOD_PILLS: Record<string, { slug: string; label: string; note: string }[]> = {
  portland: [
    { slug: 'central-eastside', label: 'Central Eastside', note: 'Industrial rooms, offices' },
    { slug: 'pearl-district', label: 'Pearl District', note: 'Photo, art, creative suites' },
    { slug: 'alberta-arts', label: 'Alberta Arts', note: 'Artist studios, small shops' },
    { slug: 'division', label: 'SE Division', note: 'Retail, wellness, workshops' },
    { slug: 'mississippi', label: 'N Mississippi', note: 'Maker space, offices' },
  ],
  atlanta: [
    { slug: 'old-fourth-ward', label: 'Old Fourth Ward', note: 'BeltLine, production, creative' },
    { slug: 'west-midtown', label: 'West Midtown', note: 'Warehouses, studios, fabrication' },
    { slug: 'castleberry-hill', label: 'Castleberry Hill', note: 'Arts district, galleries' },
    { slug: 'inman-park', label: 'Inman Park', note: 'Historic, walkable, creative' },
  ],
  seattle: [
    { slug: 'capitol-hill', label: 'Capitol Hill', note: 'Arts, music, creative studios' },
    { slug: 'georgetown', label: 'Georgetown', note: 'Industrial, fabrication, makers' },
    { slug: 'fremont', label: 'Fremont', note: 'Creative offices, workshops' },
    { slug: 'ballard', label: 'Ballard', note: 'Photo studios, production' },
    { slug: 'sodo', label: 'SoDo', note: 'Warehouses, large-format space' },
  ],
}

// Sanitize search query: alphanumerics + spaces + hyphens, max 64 chars
function sanitizeQuery(raw: string | string[] | undefined): string {
  if (typeof raw !== 'string') return ''
  return raw.replace(/[^a-zA-Z0-9\s-]/g, '').trim().slice(0, 64)
}

// City resolved from DB (not in CITY_CONFIG)
type DbCity = {
  id: number
  name: string
  state: string
  is_indexable: boolean
}

const TYPE_FILTER_LABELS: Record<string, string> = {
  photo:    'Photo',
  art:      'Art',
  workshop: 'Workshop',
  office:   'Office',
  retail:   'Retail',
  fitness:  'Fitness',
  music:    'Music',
}

type PageProps = {
  params: Promise<{ city: string }>
  searchParams: Promise<{ q?: string | string[]; type?: string | string[] }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { city } = await params
  const citySlug = city.toLowerCase()
  const staticConfig = CITY_CONFIG[citySlug]

  if (staticConfig) {
    return {
      title: staticConfig.title,
      description: staticConfig.description,
      alternates: { canonical: `https://www.findstudiospace.com/${citySlug}` },
    }
  }

  // DB fallback for dynamic cities
  const { data: dbCity } = await supabase
    .from('cities')
    .select('name, state, is_indexable')
    .eq('slug', citySlug)
    .maybeSingle()

  if (!dbCity) return {}

  return {
    title: `Find Studio Space in ${dbCity.name}, ${dbCity.state} | FindStudioSpace`,
    description: `Browse monthly studio rentals in ${dbCity.name}, art studios, workshops, offices, photo studios, and creative spaces for makers and producers.`,
    alternates: { canonical: `https://www.findstudiospace.com/${citySlug}` },
    robots: robotsContent(dbCity.is_indexable),
  }
}

function sanitizeType(raw: string | string[] | undefined): string {
  if (typeof raw !== 'string') return ''
  const v = raw.toLowerCase().trim()
  return v in TYPE_FILTER_LABELS ? v : ''
}

export default async function CityPage({ params, searchParams }: PageProps) {
  const { city } = await params
  const sp = await searchParams
  const citySlug = city.toLowerCase()
  const staticConfig = CITY_CONFIG[citySlug]

  const q = sanitizeQuery(sp.q)
  const typeFilter = sanitizeType(sp.type)

  // ── Static-config cities (Portland, Seattle) ──────────────────────────────
  // Atlanta pages need the red accent; Portland inherits global forest green.
  const accentOverride: React.CSSProperties | undefined = citySlug === 'atlanta'
    ? { '--lime': '#c0392b', '--lime-bg': '#c0392b', '--lime-bg-hover': '#922b21', '--lime-soft': '#FDECEA' } as React.CSSProperties
    : undefined

  if (staticConfig) {
    let query = supabase
      .from('listings')
      .select('id, title, price_display, neighborhood, type, images, tier, is_featured')
      .eq('status', 'active')
      .eq('city', staticConfig.displayName)
      .order('is_featured', { ascending: false })
      .order('created_at', { ascending: false })

    if (q) {
      const pattern = `%${q}%`
      query = query.or(`title.ilike.${pattern},neighborhood.ilike.${pattern},type.ilike.${pattern}`)
    }
    if (typeFilter) query = query.eq('type', typeFilter)

    const { data: listings } = await query
    const rows = (listings ?? []).filter(
      l => Array.isArray(l.images) && l.images.length > 0
    )
    const total = rows.length
    const config = staticConfig

    return (
      <div style={accentOverride}>
        <CityPageUI citySlug={citySlug} config={config} rows={rows} total={total} q={q} typeFilter={typeFilter} isIndexable />
      </div>
    )
  }

  // ── DB-backed cities ──────────────────────────────────────────────────────
  const { data: dbCity } = await supabase
    .from('cities')
    .select('id, name, state, is_indexable')
    .eq('slug', citySlug)
    .maybeSingle()

  if (!dbCity) notFound()

  const dbCityTyped = dbCity as DbCity

  let dbQuery = supabase
    .from('listings')
    .select('id, title, price_display, neighborhood, type, images, tier, is_featured')
    .eq('status', 'active')
    .eq('city_id', dbCityTyped.id)
    .order('is_featured', { ascending: false })
    .order('created_at', { ascending: false })

  if (q) {
    const pattern = `%${q}%`
    dbQuery = dbQuery.or(`title.ilike.${pattern},neighborhood.ilike.${pattern},type.ilike.${pattern}`)
  }
  if (typeFilter) dbQuery = dbQuery.eq('type', typeFilter)

  const { data: listings } = await dbQuery
  const rows = (listings ?? []).filter(
    l => Array.isArray(l.images) && l.images.length > 0
  )
  const total = rows.length

  const gate = qualityGate({
    listingCount: total,
    photoRatio: total > 0
      ? rows.filter(l => Array.isArray(l.images) && l.images.length > 0).length / total
      : 0,
    cityIndexable: dbCityTyped.is_indexable,
  })

  const config = {
    displayName: dbCityTyped.name,
    state: dbCityTyped.state,
    title: `Find Studio Space in ${dbCityTyped.name}, ${dbCityTyped.state} | FindStudioSpace`,
    description: `Browse monthly studio rentals in ${dbCityTyped.name}, art studios, workshops, offices, photo studios, and creative spaces for makers and producers.`,
  }

  return (
    <div style={accentOverride}>
      <CityPageUI citySlug={citySlug} config={config} rows={rows} total={total} q={q} typeFilter={typeFilter} isIndexable={gate.indexable} />
    </div>
  )
}

// ── Shared page UI ─────────────────────────────────────────────────────────────

function CityPageUI({
  citySlug,
  config,
  rows,
  total,
  q,
  typeFilter,
  isIndexable,
}: {
  citySlug: string
  config: { displayName: string; state: string; title: string; description: string }
  rows: { id: number; title: string; price_display: string | null; neighborhood: string | null; type: string | null; images: unknown[]; tier: string; is_featured: boolean }[]
  total: number
  q: string
  typeFilter: string
  isIndexable: boolean
}) {

  // LocalBusiness, Portland only. Signals to Google Maps / Knowledge Panel that
  // findstudiospace.com is a Portland-area business. Omit street address
  // intentionally (privacy); city+state satisfies schema.org requirements.
  const localBusinessSchema = citySlug === 'portland' ? {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'FindStudioSpace',
    description: 'Portland\'s creative studio rental directory, photo studios, event space, podcast studios, makerspace, and creative workspace.',
    url: 'https://www.findstudiospace.com/portland',
    areaServed: {
      '@type': 'City',
      name: 'Portland',
      sameAs: 'https://en.wikipedia.org/wiki/Portland,_Oregon',
    },
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Portland',
      addressRegion: 'OR',
      addressCountry: 'US',
    },
  } : null

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'FindStudioSpace',
    url: 'https://www.findstudiospace.com',
    potentialAction: {
      '@type': 'SearchAction',
      target: `https://www.findstudiospace.com/${citySlug}?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  }

  const organizationSchema = citySlug === 'portland' ? {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'FindStudioSpace',
    url: 'https://www.findstudiospace.com',
    logo: 'https://www.findstudiospace.com/logo.png',
    description: 'Portland\'s creative studio rental directory, connecting artists, makers, photographers, and producers with monthly workspace.',
    areaServed: {
      '@type': 'City',
      name: 'Portland',
      sameAs: 'https://en.wikipedia.org/wiki/Portland,_Oregon',
    },
    sameAs: [
      'https://www.findstudiospace.com',
    ],
  } : null

  // BreadcrumbList, Home → {City}. Home MUST resolve to the site root, not
  // back to this page, or Google ignores the malformed breadcrumb.
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://www.findstudiospace.com',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: config.displayName,
      },
    ],
  }

  // ItemList, refs-only ListItems pointing at each listing detail page.
  // Capped at 100 per Google's crawl-budget guidance; sort order (featured
  // first, newest second) means the first 100 are the highest-value subset.
  // When a filter (?q=) is active, the list reflects the filtered set so the
  // schema matches what the user and crawler actually see on the page.
  const itemListCap = 100
  const itemListRows = rows.slice(0, itemListCap)
  const itemListName = q
    ? `Search results for "${q}" in ${config.displayName}`
    : `${config.displayName} studio listings`
  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: itemListName,
    numberOfItems: itemListRows.length,
    itemListElement: itemListRows.map((listing, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: `https://www.findstudiospace.com/listing/${listing.id}`,
    })),
  }

  return (
    <>
      {!isIndexable && (
        <meta name="robots" content="noindex, follow" />
      )}
      {localBusinessSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
        />
      )}
      {organizationSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
      )}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />
      <main style={{ background: 'var(--paper)', color: 'var(--ink)' }} className="min-h-screen">
        {/* HERO, fills viewport; headline+search top, pills+CTA bottom */}
        <section
          style={{
            background: 'var(--paper)',
            minHeight: 'calc(100svh - 4rem)',
            paddingTop: '7rem',
            paddingBottom: '4rem',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
          className="px-6 hero-section"
        >
          {/* Top: headline + stat + search */}
          <div className="mx-auto max-w-5xl w-full">
            <h1
              style={{ color: 'var(--ink)' }}
              className="hero-title"
            >
              <span style={{ color: 'var(--lime)' }}>{config.displayName}</span> studio rentals & creative workspace.
            </h1>
            <p
              style={{
                fontFamily: 'var(--font-body)',
                color: 'var(--sub)',
                fontSize: '1.125rem',
                lineHeight: 1.5,
                marginTop: '2rem',
                maxWidth: '620px',
              }}
            >
              <span style={{ fontWeight: 700, color: 'var(--lime)' }}>{total}</span>
              {' '}studios. Every neighborhood. Free to search.
            </p>

            <form
              action={`/${citySlug}`}
              method="GET"
              style={{ maxWidth: '520px', marginTop: '2.75rem' }}
              className="w-full"
            >
              <input
                type="text"
                name="q"
                defaultValue={q}
                maxLength={64}
                placeholder="Search studios, neighborhoods, or type..."
                style={{
                  width: '100%',
                  border: '1px solid var(--rule)',
                  background: 'var(--search-bg)',
                  color: 'var(--ink)',
                  fontFamily: 'var(--font-body)',
                  fontSize: '1rem',
                  padding: '14px 16px',
                  borderRadius: '2px',
                  outline: 'none',
                  minHeight: '48px',
                  boxSizing: 'border-box',
                }}
                className="hero-search-input"
              />
            </form>
          </div>

          {/* Bottom: browse pills + landlord CTA */}
          <div className="mx-auto max-w-5xl w-full hero-browse-panel">
            <div className="hero-browse-kicker">Browse by space</div>
            <div className="hero-category-grid">
              {(CATEGORY_PILLS[citySlug] ?? []).map((cat) => (
                <Link key={cat.href} href={cat.href} className="hero-category-card">
                  <span className="hero-category-title">{cat.label}</span>
                  <span className="hero-category-note">{cat.note}</span>
                </Link>
              ))}
            </div>

            {NEIGHBORHOOD_PILLS[citySlug] && (
              <div className="hero-area-panel">
                <div className="hero-browse-kicker">By area</div>
                <div className="hero-area-grid">
                  {NEIGHBORHOOD_PILLS[citySlug].map((n) => (
                    <Link key={n.slug} href={`/${citySlug}/${n.slug}`} className="hero-category-card">
                      <span className="hero-category-title">{n.label}</span>
                      <span className="hero-category-note">{n.note}</span>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {!q && (
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.8125rem', color: 'var(--stone)', marginTop: '2rem' }}>
                Own a studio in {config.displayName}?{' '}
                <Link href="/list-your-space" style={{ color: 'var(--action)', textDecoration: 'underline' }}>
                  List free →
                </Link>
              </p>
            )}
          </div>
        </section>

        {/* Hairline */}
        <div style={{ borderTop: '1px solid var(--rule)' }} />

        {/* LISTINGS */}
        <section style={{ paddingTop: '3rem', paddingBottom: '4rem' }} className="px-6">
          <div className="mx-auto max-w-5xl">

            {/* Type filter chips */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '1.5rem' }}>
              <Link
                href={q ? `/${citySlug}?q=${encodeURIComponent(q)}` : `/${citySlug}`}
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '13px',
                  fontWeight: typeFilter === '' ? 600 : 400,
                  color: typeFilter === '' ? 'var(--paper)' : 'var(--ink)',
                  background: typeFilter === '' ? 'var(--ink)' : 'transparent',
                  border: '1px solid var(--rule)',
                  padding: '5px 13px',
                  borderRadius: '999px',
                  textDecoration: 'none',
                  whiteSpace: 'nowrap',
                }}
              >
                All
              </Link>
              {Object.entries(TYPE_FILTER_LABELS).map(([type, label]) => {
                const isActive = typeFilter === type
                const href = q
                  ? `/${citySlug}?q=${encodeURIComponent(q)}&type=${type}`
                  : `/${citySlug}?type=${type}`
                return (
                  <Link
                    key={type}
                    href={isActive ? (q ? `/${citySlug}?q=${encodeURIComponent(q)}` : `/${citySlug}`) : href}
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: '13px',
                      fontWeight: isActive ? 600 : 400,
                      color: isActive ? 'var(--paper)' : 'var(--ink)',
                      background: isActive ? 'var(--ink)' : 'transparent',
                      border: '1px solid var(--rule)',
                      padding: '5px 13px',
                      borderRadius: '999px',
                      textDecoration: 'none',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {label}
                  </Link>
                )
              })}
            </div>

            {(q || typeFilter) && (
              <p
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.875rem',
                  color: 'var(--stone)',
                  marginBottom: '1.5rem',
                }}
              >
                {total} {total === 1 ? 'result' : 'results'}
                {q ? ` for "${q}"` : ''}
                {typeFilter ? ` · ${TYPE_FILTER_LABELS[typeFilter]}` : ''}
              </p>
            )}

            {rows.length === 0 ? (
              <p style={{ color: 'var(--stone)' }} className="text-sm">
                No listings match that search. Try a neighborhood or space type.
              </p>
            ) : (
              <div className="home-grid">
                {rows.map((listing) => (
                  <ListingCard key={listing.id} listing={listing} />
                ))}
              </div>
            )}

            {/* Submit CTA, studio owner prompt */}
            {!q && (
              <div
                style={{
                  marginTop: '3rem',
                  padding: '28px 32px',
                  border: '1px solid var(--rule)',
                  background: 'var(--surface)',
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '16px',
                }}
              >
                <div>
                  <p style={{ fontFamily: 'var(--font-heading)', color: 'var(--ink)', fontSize: '1.125rem', fontWeight: 600, margin: '0 0 4px' }}>
                    Own a studio in {config.displayName}?
                  </p>
                  <p style={{ fontFamily: 'var(--font-body)', color: 'var(--stone)', fontSize: '0.875rem', margin: 0 }}>
                    Free to list. No commission. Renters contact you directly.
                  </p>
                </div>
                <Link
                  href="/list-your-space"
                  className="btn-action"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    padding: '12px 20px',
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    textDecoration: 'none',
                    whiteSpace: 'nowrap',
                  }}
                >
                  List your space free →
                </Link>
              </div>
            )}

            {NEIGHBORHOOD_PILLS[citySlug] && (
              <div
                style={{
                  marginTop: '3rem',
                  paddingTop: '1.5rem',
                  borderTop: '1px solid var(--rule)',
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '0.5rem',
                  alignItems: 'center',
                }}
              >
                <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.75rem', color: 'var(--stone)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  By neighborhood:
                </span>
                {NEIGHBORHOOD_PILLS[citySlug].map((n) => (
                  <Link key={n.slug} href={`/${citySlug}/${n.slug}`} className="hero-chip">
                    {n.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
    </>
  )
}
