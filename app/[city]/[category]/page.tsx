import type { Metadata } from 'next'
import Link from 'next/link'
import { slugToLabel, type Listing } from '@/lib/listings'
import { supabase } from '@/lib/supabase'

type PageProps = {
  params: Promise<{ city: string; category: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { city, category } = await params
  const cityLabel = slugToLabel(city)
  const categoryLabel = slugToLabel(category)
  return {
    title: `${categoryLabel} spaces in ${cityLabel} | FindStudioSpace`,
    description: `Browse ${categoryLabel.toLowerCase()} listings in ${cityLabel}.`,
  }
}

export default async function ListingCollectionPage({ params }: PageProps) {
  const { city, category } = await params
  const normalizedCity = slugToLabel(city)
  const normalizedCategory = slugToLabel(category)

  const { data } = await supabase
    .from('listings')
    .select('*')
    .eq('status', 'active')
    .ilike('city', normalizedCity)
    .ilike('category', normalizedCategory)
    .limit(200)

  const listings = (data as Listing[]) ?? []

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="mx-auto max-w-5xl space-y-6">
        <header className="space-y-1">
          <p className="text-sm text-gray-500">
            <Link className="hover:underline" href="/">
              Home
            </Link>
            {' / '}
            {city}
            {' / '}
            {category}
          </p>
          <h1 className="text-3xl font-bold">
            {normalizedCategory} spaces in {normalizedCity}
          </h1>
          <p className="text-gray-500">{listings.length} listings found</p>
        </header>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {listings.map((listing) => (
            <Link
              key={listing.id}
              href={`/listing/${listing.id}`}
              className="group rounded-xl border bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
            >
              <h2 className="font-semibold leading-snug group-hover:text-blue-600">
                {listing.title ?? 'Untitled listing'}
              </h2>
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
      </div>
    </main>
  )
}
