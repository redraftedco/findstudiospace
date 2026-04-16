import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { slugToLabel, type Listing } from '@/lib/listings'
import { supabase } from '@/lib/supabase'
import { directoryConfig } from '@/lib/directory'

const ALLOWED_CITIES = new Set(['portland', 'seattle'])
const ALLOWED_CATEGORIES = new Set([
  'art-studio', 'art-studio-rental', 'workshop-space-rental',
  'office-space-rental', 'photo-studio-rental', 'fitness-studio-rental',
  'retail-space-for-rent', 'music-studio-rental', 'music-rehearsal-space',
  'dance-studio-rental', 'ceramics-studio-rental', 'woodworking-studio-rental',
  'studio-space-rental',
])

type PageProps = {
  params: Promise<{ city: string; category: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { city, category } = await params
  if (!ALLOWED_CITIES.has(city.toLowerCase()) || !ALLOWED_CATEGORIES.has(category.toLowerCase())) return {}
  const cityLabel = slugToLabel(city)
  const categoryLabel = slugToLabel(category)
  return {
    title: `${categoryLabel} spaces in ${cityLabel} | FindStudioSpace`,
    description: `Browse ${categoryLabel.toLowerCase()} listings in ${cityLabel}.`,
  }
}

export default async function ListingCollectionPage({ params }: PageProps) {
  const { city, category } = await params
  if (!ALLOWED_CITIES.has(city.toLowerCase()) || !ALLOWED_CATEGORIES.has(category.toLowerCase())) notFound()
  const normalizedCity = slugToLabel(city)
  const normalizedCategory = slugToLabel(category)

  const { data } = await supabase
    .from('listings')
    .select('*')
    .eq('status', 'active')
    .ilike('city', normalizedCity)
    .order('is_featured', { ascending: false })
    .order('created_at', { ascending: false })
    .limit(200)

  const listings = (data as Listing[]) ?? []

  return (
    <main style={{ background: '#f4f1eb', color: '#1a1814' }} className="min-h-screen px-6 py-10">
      <div className="mx-auto max-w-5xl space-y-8">
        <header className="space-y-2">
          <p style={{ color: '#6b6762', fontFamily: 'var(--font-mono)' }} className="text-sm">
            <Link className="hover:underline" href="/">Home</Link>
            {' / '}{city}{' / '}{category}
          </p>
          <h1 style={{ fontFamily: 'var(--font-heading)', color: '#1a1814' }} className="text-3xl font-semibold">
            {normalizedCategory} spaces in {normalizedCity}
          </h1>
          <p style={{ color: '#6b6762', fontFamily: 'var(--font-mono)' }} className="text-sm">
            {listings.length} listings found
          </p>
        </header>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {listings.map((listing) => (
            <Link
              key={listing.id}
              href={`/listing/${listing.id}`}
              style={{ border: '1px solid #d6d0c4', background: '#edeae2' }}
              className="group block p-4 hover:border-[#6b6762] transition-colors"
            >
              <div className="flex items-center gap-2">
                <h2 style={{ fontFamily: 'var(--font-heading)', color: '#1a1814' }} className="font-semibold leading-snug">
                  {listing.title ?? 'Untitled listing'}
                </h2>
                {listing.tier === 'pro' && <span className="pro-badge">Pro</span>}
              </div>
              {listing.price_display && (
                <p style={{ fontFamily: 'var(--font-mono)', color: '#1a1814' }} className="mt-1 text-sm font-medium">
                  {listing.price_display}
                </p>
              )}
              {listing.neighborhood && (
                <p style={{ color: '#6b6762', fontFamily: 'var(--font-mono)' }} className="mt-1 text-xs">
                  {listing.neighborhood}
                </p>
              )}
              {listing.description && (
                <p style={{ color: '#6b6762' }} className="mt-2 text-xs leading-relaxed line-clamp-2">
                  {String(listing.description)}
                </p>
              )}
            </Link>
          ))}
        </div>
      </div>
    </main>
  )
}
