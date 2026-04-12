import type { Metadata } from 'next'
import Link from 'next/link'
import { slugToLabel, type Listing } from '@/lib/listings'
import { supabase } from '@/lib/supabase'
import InquiryButton from '@/components/InquiryButton'

type PageProps = {
  params: Promise<{
    city: string
    category: string
  }>
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
      <div className="mx-auto max-w-5xl space-y-5">
        <header className="space-y-1">
          <p className="text-sm text-gray-600">
            <Link className="underline" href="/">
              Home
            </Link>{' '}
            / {city} / {category}
          </p>
          <h1 className="text-3xl font-bold">
            {normalizedCategory} spaces in {normalizedCity}
          </h1>
          <p className="text-gray-600">{listings.length} listings found.</p>
        </header>

        <section className="grid gap-4 md:grid-cols-2">
          {listings.map((listing) => (
            <article key={listing.id} className="rounded-lg border bg-white p-4 shadow-sm">
              <h2 className="font-semibold">{listing.title ?? 'Untitled listing'}</h2>
              {listing.price_display && (
                <p className="mt-1 text-blue-700">{listing.price_display}</p>
              )}
              {listing.neighborhood && (
                <p className="mt-1 text-sm text-gray-600">📍 {listing.neighborhood}</p>
              )}
              <InquiryButton
                listingId={String(listing.id)}
                listingTitle={listing.title ?? 'this listing'}
              />
            </article>
          ))}
        </section>
      </div>
    </main>
  )
}
