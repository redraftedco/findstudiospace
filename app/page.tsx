import Link from 'next/link'
import { supabase } from '@/lib/supabase'

const CATEGORIES = [
  {
    label: 'Photo Studios',
    slug: 'photo-studio-rental',
    type: 'photo',
    description: 'Professional spaces with lighting & backdrops',
  },
  {
    label: 'Music Studios',
    slug: 'music-recording-studio',
    type: 'music',
    description: 'Recording suites, rehearsal & practice rooms',
  },
  {
    label: 'Art Studios',
    slug: 'art-studio',
    type: 'art',
    description: 'Private studios, co-ops & ceramics spaces',
  },
  {
    label: 'All Spaces',
    slug: 'studio-space-rental',
    type: null,
    description: 'Browse every available studio in Portland',
  },
]

export default async function Home() {
  const [photoRes, musicRes, artRes, totalRes, recentRes] = await Promise.all([
    supabase
      .from('listings')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'active')
      .eq('type', 'photo'),
    supabase
      .from('listings')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'active')
      .eq('type', 'music'),
    supabase
      .from('listings')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'active')
      .eq('type', 'art'),
    supabase
      .from('listings')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'active'),
    supabase
      .from('listings')
      .select('id, title, price_display, neighborhood, category')
      .eq('status', 'active')
      .limit(6),
  ])

  const countByType: Record<string, number> = {
    photo: photoRes.count ?? 0,
    music: musicRes.count ?? 0,
    art: artRes.count ?? 0,
  }

  const recent = recentRes.data ?? []

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="border-b bg-white px-4 py-16 text-center">
        <h1 className="text-4xl font-bold tracking-tight">
          Find Studio Space in Portland
        </h1>
        <p className="mx-auto mt-3 max-w-lg text-gray-500">
          Browse photo studios, music studios, and art spaces available to rent
          by the hour, day, or month.
        </p>
      </section>

      <div className="mx-auto max-w-5xl space-y-12 px-4 py-12">
        {/* Categories */}
        <section>
          <h2 className="mb-5 text-xl font-semibold">Browse by type</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {CATEGORIES.map((cat) => {
              const count =
                cat.type === null
                  ? (totalRes.count ?? 0)
                  : (countByType[cat.type] ?? 0)

              return (
                <Link
                  key={cat.slug}
                  href={`/portland/${cat.slug}`}
                  className="group rounded-xl border bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
                >
                  <p className="font-semibold group-hover:text-blue-600">
                    {cat.label}
                  </p>
                  <p className="mt-1 text-sm text-gray-500">{cat.description}</p>
                  <p className="mt-3 text-sm font-medium text-blue-600">
                    {count} spaces
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
                {listing.category && (
                  <span className="mb-2 inline-block rounded-full bg-gray-100 px-2.5 py-0.5 text-xs text-gray-600">
                    {listing.category}
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
                  <p className="mt-1 text-xs text-gray-500">
                    📍 {listing.neighborhood}
                  </p>
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
