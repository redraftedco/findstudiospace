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
    title: 'Studio Rental in Portland, Oregon — Creative Workspace',
    description: 'Browse 126 Portland studio rentals — creative workspace for artists, makers, photographers, and producers across every Oregon neighborhood. Free.',
  },
  seattle: {
    displayName: 'Seattle',
    state: 'WA',
    title: 'Find Studio Space in Seattle, WA | FindStudioSpace',
    description: 'Browse monthly studio rentals in Seattle — art studios, workshops, offices, photo studios, and creative spaces for makers and producers.',
  },
}

// Primary Portland pill nav. Keep legacy routes live, but lead users to the
// four validated categories.
const CATEGORY_PILLS: { slug: string; label: string }[] = [
  { slug: 'event-space', label: 'EVENT SPACE' },
  { slug: 'content-studios', label: 'CONTENT STUDIOS' },
  { slug: 'photo-studios', label: 'PHOTO STUDIOS' },
  { slug: 'makerspace', label: 'MAKERSPACE' },
]

// Neighborhood entry points — these pages already exist in category config;
// surfacing them on the homepage gives Google a crawl path and users a fast
// neighborhood-first filter.
const NEIGHBORHOOD_PILLS: { slug: string; label: string }[] = [
  { slug: 'central-eastside', label: 'CENTRAL EASTSIDE' },
  { slug: 'pearl-district', label: 'PEARL DISTRICT' },
  { slug: 'alberta-arts', label: 'ALBERTA ARTS' },
  { slug: 'division', label: 'SE DIVISION' },
  { slug: 'mississippi', label: 'N MISSISSIPPI' },
]

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

type PageProps = {
  params: Promise<{ city: string }>
  searchParams: Promise<{ q?: string | string[] }>
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
    description: `Browse monthly studio rentals in ${dbCity.name} — art studios, workshops, offices, photo studios, and creative spaces for makers and producers.`,
    alternates: { canonical: `https://www.findstudiospace.com/${citySlug}` },
    robots: robotsContent(dbCity.is_indexable),
  }
}

export default async function CityPage({ params, searchParams }: PageProps) {
  const { city } = await params
  const sp = await searchParams
  const citySlug = city.toLowerCase()
  const staticConfig = CITY_CONFIG[citySlug]

  const q = sanitizeQuery(sp.q)

  // ── Static-config cities (Portland, Seattle) ──────────────────────────────
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

    const { data: listings } = await query
    const rows = (listings ?? []).filter(
      l => Array.isArray(l.images) && l.images.length > 0
    )
    const total = rows.length
    const config = staticConfig

    return <CityPageUI citySlug={citySlug} config={config} rows={rows} total={total} q={q} isIndexable />
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
    description: `Browse monthly studio rentals in ${dbCityTyped.name} — art studios, workshops, offices, photo studios, and creative spaces for makers and producers.`,
  }

  return <CityPageUI citySlug={citySlug} config={config} rows={rows} total={total} q={q} isIndexable={gate.indexable} />
}

// ── Shared page UI ─────────────────────────────────────────────────────────────

function CityPageUI({
  citySlug,
  config,
  rows,
  total,
  q,
  isIndexable,
}: {
  citySlug: string
  config: { displayName: string; state: string; title: string; description: string }
  rows: { id: number; title: string; price_display: string | null; neighborhood: string | null; type: string | null; images: unknown[]; tier: string; is_featured: boolean }[]
  total: number
  q: string
  isIndexable: boolean
}) {

  // LocalBusiness — Portland only. Signals to Google Maps / Knowledge Panel that
  // findstudiospace.com is a Portland-area business. Omit street address
  // intentionally (privacy); city+state satisfies schema.org requirements.
  const localBusinessSchema = citySlug === 'portland' ? {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'FindStudioSpace',
    description: 'Portland\'s creative studio rental directory — photo studios, event space, podcast studios, makerspace, and creative workspace.',
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

  // BreadcrumbList — Home → {City}. Home MUST resolve to the site root, not
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

  // ItemList — refs-only ListItems pointing at each listing detail page.
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
        {/* HERO — headline → stat → search only */}
        <section
          style={{
            background: 'var(--paper)',
            paddingTop: '5rem',
            paddingBottom: '3rem',
          }}
          className="px-6 hero-section"
        >
          <div className="mx-auto max-w-5xl">
            <h1
              style={{
                color: 'var(--ink)',
              }}
              className="hero-title"
            >
              {config.displayName} studio rentals & creative workspace.
            </h1>
            <p
              style={{
                fontFamily: 'var(--font-body)',
                color: 'var(--sub)',
                fontSize: '1.125rem',
                lineHeight: 1.5,
                marginTop: '1.25rem',
                maxWidth: '620px',
              }}
            >
              <span style={{ fontWeight: 700 }}>{total}</span>
              {' '}studios. Every neighborhood. Free to search.
            </p>

            <form
              action={`/${citySlug}`}
              method="GET"
              style={{ maxWidth: '520px', marginTop: '2rem' }}
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

            <div
              style={{ marginTop: '2.5rem' }}
              className="flex flex-wrap items-center gap-2"
            >
              {CATEGORY_PILLS.map((cat) => (
                <Link key={cat.slug} href={`/${citySlug}/${cat.slug}`} className="hero-chip">
                  {cat.label}
                </Link>
              ))}
            </div>

            {/* Neighborhood entry points — only shown for Portland where pages exist */}
            {citySlug === 'portland' && (
              <div
                style={{ marginTop: '1rem' }}
                className="flex flex-wrap items-center gap-2"
              >
                {NEIGHBORHOOD_PILLS.map((n) => (
                  <Link key={n.slug} href={`/${citySlug}/${n.slug}`} className="hero-chip">
                    {n.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Hairline */}
        <div style={{ borderTop: '1px solid var(--rule)' }} />

        {/* LISTINGS */}
        <section style={{ paddingTop: '3rem', paddingBottom: '4rem' }} className="px-6">
          <div className="mx-auto max-w-5xl">

            {/* Category filter strip — above grid, below hero */}
            {!q && (
              <div
                style={{ marginBottom: '2rem' }}
                className="flex flex-wrap items-center gap-2"
              >
                {CATEGORY_PILLS.map((cat) => (
                  <Link key={cat.slug} href={`/${citySlug}/${cat.slug}`} className="hero-chip">
                    {cat.label}
                  </Link>
                ))}
              </div>
            )}

            {q && (
              <p
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.875rem',
                  color: 'var(--stone)',
                  marginBottom: '1.5rem',
                }}
              >
                {total} {total === 1 ? 'result' : 'results'} for &ldquo;{q}&rdquo;
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

            {/* Submit CTA — studio owner prompt */}
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
                  href="/submit"
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
                  Submit your studio →
                </Link>
              </div>
            )}

            {/* Neighborhood links — SEO crawl path, not primary nav */}
            {citySlug === 'portland' && (
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
                {NEIGHBORHOOD_PILLS.map((n) => (
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
