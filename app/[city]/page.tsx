import { Metadata } from 'next'
import Link from 'next/link'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
)

const CITY_CONFIG: Record<string, {
  displayName: string
  state: string
  title: string
  description: string
}> = {
  portland: {
    displayName: 'Portland',
    state: 'OR',
    title: 'Find Studio Space in Portland, OR | FindStudioSpace',
    description: 'Browse monthly studio rentals in Portland — art studios, workshops, offices, photo studios, and creative spaces for makers and producers.',
  },
  seattle: {
    displayName: 'Seattle',
    state: 'WA',
    title: 'Find Studio Space in Seattle, WA | FindStudioSpace',
    description: 'Browse monthly studio rentals in Seattle — art studios, workshops, offices, photo studios, and creative spaces for makers and producers.',
  },
}

const CATEGORIES = [
  { label: 'Office Space', slug: 'office-space-rental', type: 'office', descriptor: 'Private offices and creative suites' },
  { label: 'Art Studios', slug: 'art-studio', type: 'art', descriptor: 'Private studios, co-ops and maker spaces' },
  { label: 'Workshop Space', slug: 'workshop-space-rental', type: 'workshop', descriptor: 'Garages, warehouses and fabrication bays' },
  { label: 'Retail Space', slug: 'retail-space-for-rent', type: 'retail', descriptor: 'Storefronts and commercial retail' },
  { label: 'Photo Studios', slug: 'photo-studio-rental', type: 'photo', descriptor: 'Professional spaces for shoots and production' },
  { label: 'Fitness & Dance', slug: 'fitness-studio-rental', type: 'fitness', descriptor: 'Yoga, dance and movement studios' },
]

const BORDER_CLASS: Record<string, string> = {
  art:      'cat-border-art',
  workshop: 'cat-border-workshop',
  office:   'cat-border-office',
  photo:    'cat-border-photo',
  retail:   'cat-border-retail',
  fitness:  'cat-border-fitness',
}

const TEXT_CLASS: Record<string, string> = {
  art:      'cat-text-art',
  workshop: 'cat-text-workshop',
  office:   'cat-text-office',
  photo:    'cat-text-photo',
  retail:   'cat-text-retail',
  fitness:  'cat-text-fitness',
}

function timeAgo(dateStr: string | null | undefined): string | null {
  if (!dateStr) return null
  const days = Math.max(0, Math.floor((Date.now() - new Date(dateStr).getTime()) / (1000 * 60 * 60 * 24)))
  if (days === 0) return null
  if (days === 1) return 'Listed yesterday'
  if (days < 30) return `Listed ${days} days ago`
  if (days < 90) return `Listed ${Math.floor(days / 7)} weeks ago`
  return `Listed ${Math.floor(days / 30)} months ago`
}

type PageProps = {
  params: Promise<{ city: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { city } = await params
  const config = CITY_CONFIG[city.toLowerCase()]
  if (!config) return {}
  return {
    title: config.title,
    description: config.description,
  }
}

export default async function CityPage({ params }: PageProps) {
  const { city } = await params
  const citySlug = city.toLowerCase()
  const config = CITY_CONFIG[citySlug]

  if (!config) {
    return (
      <div style={{
        minHeight: '100vh',
        background: '#f4f1eb',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'var(--font-body)',
      }}>
        <div style={{ textAlign: 'center' }}>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: '#6b6762', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Coming soon</p>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '28px', color: '#1a1814', margin: '8px 0' }}>
            {city.charAt(0).toUpperCase() + city.slice(1)}
          </h1>
          <p style={{ color: '#6b6762', fontSize: '14px' }}>
            We&apos;re launching here soon.{' '}
            <a href="/portland" style={{ color: '#a84530' }}>Browse Portland →</a>
          </p>
        </div>
      </div>
    )
  }

  const [countsRes, recentRes] = await Promise.all([
    supabase.from('listings').select('type').eq('status', 'active'),
    supabase
      .from('listings')
      .select('id, title, price_display, neighborhood, type, images, description, created_at')
      .eq('status', 'active')
      .limit(24),
  ])

  const countByType: Record<string, number> = {}
  for (const row of countsRes.data ?? []) {
    const t = row.type ?? 'general'
    countByType[t] = (countByType[t] ?? 0) + 1
  }
  const total = (countsRes.data ?? []).length

  const allRecent = recentRes.data ?? []
  const sorted = [...allRecent].sort((a, b) => {
    const aImages: string[] = Array.isArray(a.images) ? a.images : []
    const bImages: string[] = Array.isArray(b.images) ? b.images : []
    const aScore = (aImages.length > 0 ? 2 : 0) + (a.price_display ? 1 : 0)
    const bScore = (bImages.length > 0 ? 2 : 0) + (b.price_display ? 1 : 0)
    return bScore - aScore
  })
  const recent = sorted.slice(0, 6)

  return (
    <main style={{ background: '#f4f1eb', color: '#1a1814' }} className="min-h-screen">
      {/* Hero */}
      <section
        style={{
          borderBottom: '1px solid #d6d0c4',
          backgroundImage: 'radial-gradient(circle, #c8c4bb 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
        className="px-6"
      >
        <div className="mx-auto max-w-5xl py-24">
          <h1 style={{ fontFamily: 'var(--font-heading)', color: '#1a1814' }} className="text-4xl font-semibold leading-tight sm:text-5xl">
            Find studio space in {config.displayName}.
          </h1>
          <form action={`/${citySlug}/studio-space-rental`} method="GET" className="mt-6 flex w-full max-w-xl">
            <input
              type="text"
              name="q"
              placeholder="Search by neighborhood, space type, or keyword..."
              style={{
                border: '1px solid #d6d0c4',
                background: '#f4f1eb',
                color: '#1a1814',
                fontFamily: 'var(--font-body)',
                height: '48px',
                outline: 'none',
                borderRight: 'none',
              }}
              className="hero-search-input flex-1 px-4 text-sm placeholder:text-[#6b6762]"
            />
            <button
              type="submit"
              style={{ height: '48px', fontFamily: 'var(--font-body)', border: 'none' }}
              className="btn-action px-5 text-sm font-medium whitespace-nowrap"
            >
              Search
            </button>
          </form>
          <div className="hero-trust-row">
            <span className="hero-count">{total} spaces in {config.displayName}</span>
            <span className="hero-dot">·</span>
            <a href={`/${citySlug}/art-studio`} className="hero-chip">Art Studios</a>
            <a href={`/${citySlug}/workshop-space-rental`} className="hero-chip">Workshop</a>
            <a href={`/${citySlug}/office-space-rental`} className="hero-chip">Office</a>
            <a href={`/${citySlug}/photo-studio-rental`} className="hero-chip">Photo</a>
            <a href={`/${citySlug}/dance-studio-rental`} className="hero-chip">Dance</a>
            <a href={`/${citySlug}/music-rehearsal-space`} className="hero-chip">Music</a>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-5xl space-y-16 px-6 py-14">
        {/* Categories */}
        <section>
          <h2 style={{ fontFamily: 'var(--font-heading)', color: '#1a1814' }} className="mb-6 text-xl font-semibold">
            Browse by type
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" style={{ background: '#d6d0c4', gap: '1px' }}>
            {CATEGORIES.map((cat) => {
              const count = countByType[cat.type] ?? 0
              return (
                <Link
                  key={cat.slug}
                  href={`/${citySlug}/${cat.slug}`}
                  style={{ background: '#edeae2' }}
                  className="group block p-6 hover:bg-[#e5e1d8] transition-colors"
                >
                  <p style={{ fontFamily: 'var(--font-heading)', color: '#1a1814', fontSize: '1.1rem' }} className="font-semibold">
                    {cat.label}
                  </p>
                  <p style={{ color: '#6b6762', fontSize: '0.85rem' }} className="mt-1">
                    {cat.descriptor}
                  </p>
                  <p style={{ fontFamily: 'var(--font-mono)', color: '#6b6762', fontSize: '0.72rem' }} className="mt-2">
                    {count} {count === 1 ? 'space' : 'spaces'}
                  </p>
                </Link>
              )
            })}
          </div>
        </section>

        {/* Recent listings */}
        <section>
          <h2 style={{ fontFamily: 'var(--font-heading)', color: '#1a1814' }} className="mb-6 text-xl font-semibold">
            Recent listings
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {recent.map((listing) => {
              const images: string[] = Array.isArray(listing.images)
                ? listing.images.map((x: unknown) => (typeof x === 'string' ? x : (x as Record<string, string>)?.url ?? '')).filter(Boolean)
                : []
              const thumb = images[0]
              const timestamp = timeAgo(listing.created_at)
              const hasPrice = !!listing.price_display
              const typeKey = (listing.type ?? '').toLowerCase()
              const borderClass = BORDER_CLASS[typeKey] ?? 'cat-border-default'
              const textClass = TEXT_CLASS[typeKey] ?? ''
              return (
                <Link
                  key={listing.id}
                  href={`/listing/${listing.id}`}
                  className={`listing-card-base ${borderClass} group flex flex-col`}
                >
                  {thumb ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={thumb} alt="" className="w-full listing-card-placeholder" style={{ objectFit: 'cover', height: '200px' }} />
                  ) : (
                    <div className="listing-card-placeholder" />
                  )}
                  <div className="flex flex-1 flex-col p-4">
                    {listing.type && (
                      <p style={{ fontFamily: 'var(--font-mono)' }} className={`${textClass} mb-1 text-xs uppercase`}>
                        {listing.type}
                      </p>
                    )}
                    {listing.neighborhood && (
                      <p style={{ color: '#6b6762', fontFamily: 'var(--font-mono)' }} className="mb-1 text-xs">
                        {listing.neighborhood.trim()}
                      </p>
                    )}
                    <h3 style={{ fontFamily: 'var(--font-heading)', color: '#1a1814' }} className="font-semibold leading-snug">
                      {listing.title ?? 'Untitled listing'}
                    </h3>
                    <p style={{ fontFamily: 'var(--font-mono)', color: hasPrice ? '#1a1814' : '#9c8e84', fontStyle: hasPrice ? 'normal' : 'italic' }} className="mt-2 text-xs">
                      {hasPrice ? listing.price_display : 'Price on request'}
                    </p>
                    <p style={{ color: '#a84530' }} className="mt-auto pt-3 text-xs font-medium">
                      View space →
                    </p>
                    {timestamp && (
                      <p style={{ color: '#6b6762', fontFamily: 'var(--font-mono)' }} className="mt-1 text-xs">
                        {timestamp}
                      </p>
                    )}
                  </div>
                </Link>
              )
            })}
          </div>
        </section>

        {/* CTA band */}
        <section style={{ background: '#edeae2', borderTop: '1px solid #d6d0c4', borderBottom: '1px solid #d6d0c4' }} className="py-12 text-center">
          <p style={{ fontFamily: 'var(--font-heading)', color: '#1a1814' }} className="text-xl font-semibold">
            Have a space to rent?
          </p>
          <p style={{ color: '#6b6762' }} className="mx-auto mt-3 max-w-md text-sm">
            List it free and reach {config.displayName} creatives searching right now.
          </p>
          <Link
            href="/list-your-space"
            style={{ width: 'auto' }}
            className="btn-action mt-5 inline-block px-6 py-2.5 text-sm font-medium"
          >
            List your space →
          </Link>
        </section>
      </div>
    </main>
  )
}
