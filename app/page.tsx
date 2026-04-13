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
      .select('id, title, price_display, neighborhood, type, is_featured')
      .eq('status', 'active')
      .order('is_featured', { ascending: false })
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
            {recent.map((listing) => (
              <Link
                key={listing.id}
                href={`/listing/${listing.id}`}
                style={{ border: '1px solid #d6d0c4', background: '#edeae2' }}
                className="group block p-4 hover:border-[#8c8680] transition-colors"
              >
                <div className="mb-2 flex gap-2">
                  {listing.is_featured && (
                    <span style={{ background: '#b8860b', color: '#fff', fontFamily: 'var(--font-mono)' }} className="px-2 py-0.5 text-xs font-medium tracking-wider">
                      FEATURED
                    </span>
                  )}
                  {listing.type && (
                    <span style={{ color: '#8c8680', fontFamily: 'var(--font-mono)' }} className="text-xs uppercase">
                      {listing.type}
                    </span>
                  )}
                </div>
                <h3 style={{ fontFamily: 'var(--font-heading)', color: '#1a1814' }} className="font-semibold leading-snug">
                  {listing.title ?? 'Untitled listing'}
                </h3>
                {listing.price_display && (
                  <p style={{ fontFamily: 'var(--font-mono)', color: '#1a1814' }} className="mt-2 text-sm font-medium">
                    {listing.price_display}
                  </p>
                )}
                {listing.neighborhood && (
                  <p style={{ color: '#8c8680', fontFamily: 'var(--font-mono)' }} className="mt-1 text-xs">
                    {listing.neighborhood}
                  </p>
                )}
              </Link>
            ))}
          </div>
        </section>

        {/* List your space CTA */}
        <section style={{ border: '1px solid #d6d0c4', background: '#edeae2' }} className="p-10 text-center">
          <h2 style={{ fontFamily: 'var(--font-heading)', color: '#1a1814' }} className="text-xl font-semibold">
            Own or manage a studio?
          </h2>
          <p style={{ color: '#8c8680' }} className="mx-auto mt-3 max-w-md text-sm">
            List your space free and reach Portland creatives, makers, and business owners searching right now.
          </p>
          <Link
            href="/list-your-space"
            style={{ background: '#2c4a3e', color: '#f4f1eb' }}
            className="mt-6 inline-block px-8 py-3 text-sm font-medium hover:opacity-90"
          >
            List your space →
          </Link>
        </section>
      </div>
    </main>
  )
}
