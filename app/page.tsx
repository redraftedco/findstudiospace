import Link from 'next/link'
import { supabase } from '@/lib/supabase'

const CATEGORIES = [
  { label: 'Office Space', slug: 'office-space-rental', type: 'office', descriptor: 'Private offices and creative suites' },
  { label: 'Art Studios', slug: 'art-studio', type: 'art', descriptor: 'Private studios, co-ops and maker spaces' },
  { label: 'Workshop Space', slug: 'workshop-space-rental', type: 'workshop', descriptor: 'Garages, warehouses and fabrication bays' },
  { label: 'Retail Space', slug: 'retail-space-for-rent', type: 'retail', descriptor: 'Storefronts and commercial retail' },
  { label: 'Photo Studios', slug: 'photo-studio-rental', type: 'photo', descriptor: 'Professional spaces for shoots and production' },
  { label: 'Fitness & Dance', slug: 'fitness-studio-rental', type: 'fitness', descriptor: 'Yoga, dance and movement studios' },
]

export default async function Home() {
  const [counts, recentRes] = await Promise.all([
    supabase.from('listings').select('type').eq('status', 'active'),
    supabase
      .from('listings')
      .select('id, title, price_display, neighborhood, type, images, description')
      .eq('status', 'active')
      .limit(24),
  ])

  const countByType: Record<string, number> = {}
  for (const row of counts.data ?? []) {
    const t = row.type ?? 'general'
    countByType[t] = (countByType[t] ?? 0) + 1
  }
  const total = (counts.data ?? []).length

  // Sort: photos + price first, then photos only, then price only, then rest
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
      <section style={{ borderBottom: '1px solid #d6d0c4' }} className="px-6 py-20">
        <div className="mx-auto max-w-5xl">
          <h1 style={{ fontFamily: 'var(--font-heading)', color: '#1a1814' }} className="text-4xl font-semibold leading-tight sm:text-5xl">
            Find studio space in Portland.
          </h1>
          <p style={{ color: '#8c8680', fontFamily: 'var(--font-mono)' }} className="mt-3 text-sm">
            {total} spaces available in Portland, OR
          </p>
          <p style={{ color: '#8c8680' }} className="mt-2 text-sm">
            The directory for creatives, makers, and producers looking for monthly workspace.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-5xl space-y-16 px-6 py-14">
        {/* Categories */}
        <section>
          <h2 style={{ fontFamily: 'var(--font-heading)', color: '#1a1814' }} className="mb-6 text-xl font-semibold">
            Browse by type
          </h2>
          <div className="listing-grid" style={{ background: '#d6d0c4', gap: '1px' }}>
            {CATEGORIES.map((cat) => {
              const count = countByType[cat.type] ?? 0
              return (
                <Link
                  key={cat.slug}
                  href={`/portland/${cat.slug}`}
                  style={{ background: '#edeae2' }}
                  className="group block p-6 hover:bg-[#e5e1d8] transition-colors"
                >
                  <p style={{ fontFamily: 'var(--font-heading)', color: '#1a1814' }} className="font-semibold">
                    {cat.label}
                  </p>
                  <p style={{ color: '#8c8680' }} className="mt-1 text-xs">
                    {cat.descriptor}
                  </p>
                  <p style={{ fontFamily: 'var(--font-mono)', color: '#8c8680' }} className="mt-2 text-xs">
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
          <div className="listing-grid">
            {recent.map((listing) => {
              const images: string[] = Array.isArray(listing.images)
                ? listing.images.map((x: unknown) => (typeof x === 'string' ? x : (x as Record<string, string>)?.url ?? '')).filter(Boolean)
                : []
              const thumb = images[0]
              return (
                <Link
                  key={listing.id}
                  href={`/listing/${listing.id}`}
                  style={{ border: '1px solid #d6d0c4', background: '#edeae2' }}
                  className="group flex flex-col hover:border-[#8c8680] transition-colors"
                >
                  {thumb ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={thumb} alt="" className="w-full object-cover listing-card-placeholder" style={{ objectFit: 'cover', height: '200px' }} />
                  ) : (
                    <div className="listing-card-placeholder" />
                  )}
                  <div className="flex flex-1 flex-col p-4">
                    {listing.type && (
                      <p style={{ color: '#8c8680', fontFamily: 'var(--font-mono)' }} className="mb-1 text-xs uppercase">
                        {listing.type}
                      </p>
                    )}
                    <h3 style={{ fontFamily: 'var(--font-heading)', color: '#1a1814' }} className="font-semibold leading-snug">
                      {listing.title ?? 'Untitled listing'}
                    </h3>
                    <div style={{ fontFamily: 'var(--font-mono)', color: '#8c8680' }} className="mt-2 text-xs">
                      <span>{listing.price_display ?? 'Price on request'}</span>
                      {listing.neighborhood && <span> · {listing.neighborhood}</span>}
                    </div>
                    <p style={{ color: '#2c4a3e' }} className="mt-auto pt-3 text-xs font-medium">
                      View space →
                    </p>
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
          <p style={{ color: '#8c8680' }} className="mx-auto mt-3 max-w-md text-sm">
            List it free and reach Portland creatives searching right now.
          </p>
          <Link
            href="/list-your-space"
            style={{ background: '#2c4a3e', color: '#f4f1eb' }}
            className="mt-5 inline-block px-6 py-2.5 text-sm font-medium hover:bg-[#1e3329] transition-colors"
          >
            List your space →
          </Link>
        </section>
      </div>
    </main>
  )
}
