import Link from 'next/link'
import { supabase } from '@/lib/supabase'

const CATEGORIES = [
  { label: 'Office Space', slug: 'office-space-rental', type: 'office' },
  { label: 'Art Studios', slug: 'art-studio', type: 'art' },
  { label: 'Workshop Space', slug: 'workshop-space-rental', type: 'workshop' },
  { label: 'Retail Space', slug: 'retail-space-for-rent', type: 'retail' },
  { label: 'Photo Studios', slug: 'photo-studio-rental', type: 'photo' },
  { label: 'Fitness & Dance', slug: 'fitness-studio-rental', type: 'fitness' },
]

export default async function Home() {
  const [counts, recentRes] = await Promise.all([
    supabase.from('listings').select('type').eq('status', 'active'),
    supabase
      .from('listings')
      .select('id, title, price_display, neighborhood, type, images')
      .eq('status', 'active')
      .limit(6),
  ])

  const countByType: Record<string, number> = {}
  for (const row of counts.data ?? []) {
    const t = row.type ?? 'general'
    countByType[t] = (countByType[t] ?? 0) + 1
  }
  const total = (counts.data ?? []).length
  const recent = recentRes.data ?? []

  return (
    <main style={{ background: '#f4f1eb', color: '#1a1814' }} className="min-h-screen">
      {/* Hero */}
      <section style={{ borderBottom: '1px solid #d6d0c4' }} className="px-6 py-20">
        <div className="mx-auto max-w-5xl">
          <h1 style={{ fontFamily: 'var(--font-heading)', color: '#1a1814' }} className="text-4xl font-semibold leading-tight">
            Find studio space in Portland.
          </h1>
          <p style={{ color: '#8c8680', fontFamily: 'var(--font-mono)' }} className="mt-3 text-sm">
            {total} spaces listed — photo, art, workshop, office, retail, fitness
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-5xl space-y-16 px-6 py-14">
        {/* Categories */}
        <section>
          <h2 style={{ fontFamily: 'var(--font-heading)', color: '#1a1814' }} className="mb-6 text-xl font-semibold">
            Browse by type
          </h2>
          <div className="grid gap-px sm:grid-cols-2 lg:grid-cols-3" style={{ border: '1px solid #d6d0c4' }}>
            {CATEGORIES.map((cat) => {
              const count = countByType[cat.type] ?? 0
              return (
                <Link
                  key={cat.slug}
                  href={`/portland/${cat.slug}`}
                  style={{ background: '#edeae2', borderRight: '1px solid #d6d0c4', borderBottom: '1px solid #d6d0c4' }}
                  className="group block p-6 hover:bg-[#e5e1d8] transition-colors"
                >
                  <p style={{ fontFamily: 'var(--font-heading)', color: '#1a1814' }} className="font-semibold">
                    {cat.label}
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
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
                  className="group block hover:border-[#8c8680] transition-colors"
                >
                  {thumb ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={thumb} alt="" className="w-full object-cover" style={{ height: '160px' }} />
                  ) : (
                    <div style={{ background: '#d6d0c4', height: '160px' }} />
                  )}
                  <div className="p-4">
                    {listing.type && (
                      <p style={{ color: '#8c8680', fontFamily: 'var(--font-mono)' }} className="mb-1 text-xs uppercase">
                        {listing.type}
                      </p>
                    )}
                    <h3 style={{ fontFamily: 'var(--font-heading)', color: '#1a1814' }} className="font-semibold leading-snug">
                      {listing.title ?? 'Untitled listing'}
                    </h3>
                    <div style={{ fontFamily: 'var(--font-mono)', color: '#8c8680' }} className="mt-2 text-xs">
                      {listing.price_display && <span>{listing.price_display}</span>}
                      {listing.price_display && listing.neighborhood && <span> · </span>}
                      {listing.neighborhood && <span>{listing.neighborhood}</span>}
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        </section>

        {/* List your space CTA */}
        <section style={{ border: '1px solid #d6d0c4', background: '#edeae2' }} className="p-10 text-center">
          <h2 style={{ fontFamily: 'var(--font-heading)', color: '#1a1814' }} className="text-xl font-semibold">
            Own or manage a studio?
          </h2>
          <p style={{ color: '#8c8680' }} className="mx-auto mt-3 max-w-md text-sm">
            List your space free and reach Portland creatives searching right now.
          </p>
          <Link
            href="/list-your-space"
            style={{ color: '#2c4a3e' }}
            className="mt-4 inline-block text-sm font-medium hover:underline"
          >
            List your space →
          </Link>
        </section>
      </div>
    </main>
  )
}
