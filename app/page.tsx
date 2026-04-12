import Link from 'next/link'
import { supabase } from '@/lib/supabase'

const CATEGORIES = [
  {
    label: 'Office Space',
    slug: 'office-space-rental',
    type: 'office',
    description: 'Private offices, coworking, and creative suites',
  },
  {
    label: 'Art Studios',
    slug: 'art-studio',
    type: 'art',
    description: 'Private studios, co-ops & ceramics spaces',
  },
  {
    label: 'Workshop Space',
    slug: 'workshop-space-rental',
    type: 'workshop',
    description: 'Garages, warehouses & maker spaces',
  },
  {
    label: 'Retail Space',
    slug: 'retail-space-for-rent',
    type: 'retail',
    description: 'Storefronts and commercial retail listings',
  },
  {
    label: 'Photo Studios',
    slug: 'photo-studio-rental',
    type: 'photo',
    description: 'Professional spaces with lighting & backdrops',
  },
  {
    label: 'Fitness & Dance',
    slug: 'fitness-studio-rental',
    type: 'fitness',
    description: 'Yoga, dance, and movement studios',
  },
]

export default async function Home() {
  const [counts, recentRes] = await Promise.all([
    supabase
      .from('listings')
      .select('type')
      .eq('status', 'active'),
    supabase
      .from('listings')
      .select('id, title, price_display, neighborhood, type')
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
    <main className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="border-b bg-white px-4 py-16 text-center">
        <h1 className="text-4xl font-bold tracking-tight">
          Find Studio &amp; Workspace in Portland
        </h1>
        <p className="mx-auto mt-3 max-w-lg text-gray-500">
          Browse {total} verified listings — photo studios, art spaces, offices,
          workshops, and retail across Portland, OR.
        </p>
      </section>

      <div className="mx-auto max-w-5xl space-y-12 px-4 py-12">
        {/* Categories */}
        <section>
          <h2 className="mb-5 text-xl font-semibold">Browse by type</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {CATEGORIES.map((cat) => {
              const count = countByType[cat.type] ?? 0
              return (
                <Link
                  key={cat.slug}
                  href={`/portland/${cat.slug}`}
                  className="group rounded-xl border bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
                >
                  <p className="font-semibold group-hover:text-blue-600">{cat.label}</p>
                  <p className="mt-1 text-sm text-gray-500">{cat.description}</p>
                  <p className="mt-3 text-sm font-medium text-blue-600">
                    {count} {count === 1 ? 'space' : 'spaces'} available
                  </p>
                </Link>
              )
            })}
          </div>
        </section>

        {/* Recent listings */}
        <section>
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-xl font-semibold">Recent listings</h2>
            <Link
              href="/portland/studio-space-rental"
              className="text-sm text-blue-600 hover:underline"
            >
              View all →
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {recent.map((listing) => (
              <Link
                key={listing.id}
                href={`/listing/${listing.id}`}
                className="group rounded-xl border bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
              >
                {listing.type && (
                  <span className="mb-2 inline-block rounded-full bg-gray-100 px-2.5 py-0.5 text-xs text-gray-600">
                    {listing.type}
                  </span>
                )}
                <h3 className="font-semibold leading-snug group-hover:text-blue-600">
                  {listing.title ?? 'Untitled listing'}
                </h3>
                {listing.price_display && (
                  <p className="mt-1 text-sm font-medium text-blue-700">
                    {listing.price_display}
                  </p>
                )}
                {listing.neighborhood && (
                  <p className="mt-1 text-xs text-gray-500">📍 {listing.neighborhood}</p>
                )}
                <p className="mt-3 text-xs font-medium text-blue-600 group-hover:underline">
                  View space →
                </p>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </main>
  )
}
