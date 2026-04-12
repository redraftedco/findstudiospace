import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'
import { supabase } from '@/lib/supabase'
import InquiryForm from '@/components/InquiryForm'

type Props = { params: Promise<{ id: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const { data } = await supabase
    .from('listings')
    .select('title, city, type, description')
    .eq('id', id)
    .single()
  if (!data) return {}
  return {
    title: `${data.title} | FindStudioSpace`,
    description: data.description
      ? String(data.description).slice(0, 160)
      : `${data.type ?? 'Studio'} space in ${data.city ?? 'Portland'}.`,
  }
}

export default async function ListingPage({ params }: Props) {
  const { id } = await params
  const { data: listing } = await supabase
    .from('listings')
    .select('*')
    .eq('id', id)
    .single()

  if (!listing) notFound()

  const attrs = listing.niche_attributes as Record<string, boolean | string | number | null> | null
  const amenities = attrs
    ? Object.entries(attrs)
        .filter(([, v]) => v === true)
        .map(([k]) => k.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()))
    : []

  const images: string[] = Array.isArray(listing.images)
    ? listing.images.map((x: unknown) => (typeof x === 'string' ? x : (x as Record<string, string>)?.url ?? '')).filter(Boolean)
    : []

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-4xl px-4 py-8">
        <Link href="/" className="text-sm text-gray-500 hover:underline">
          ← Back to listings
        </Link>

        {images.length > 0 && (
          <div className="mt-6 flex gap-2 overflow-x-auto">
            {images.slice(0, 6).map((src, i) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img key={i} src={src} alt="" className="h-48 w-auto flex-shrink-0 rounded-lg object-cover" />
            ))}
          </div>
        )}

        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_360px]">
          <div className="rounded-xl border bg-white p-6 shadow-sm">
            {listing.type && (
              <span className="mb-3 inline-block rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
                {listing.type}
              </span>
            )}
            <h1 className="text-2xl font-bold leading-snug">{listing.title ?? 'Untitled listing'}</h1>

            <div className="mt-4 space-y-1">
              {listing.price_display && (
                <p className="text-xl font-semibold text-blue-700">{listing.price_display}</p>
              )}
              {(listing.neighborhood || listing.city) && (
                <p className="text-sm text-gray-600">
                  📍 {[listing.neighborhood, listing.city].filter(Boolean).join(', ')}
                </p>
              )}
            </div>

            {listing.description && (
              <div className="mt-6">
                <p className="mb-1 text-sm font-semibold text-gray-700">About this space</p>
                <p className="text-sm leading-relaxed text-gray-600 whitespace-pre-line">{listing.description}</p>
              </div>
            )}

            {amenities.length > 0 && (
              <div className="mt-6">
                <p className="mb-2 text-sm font-semibold text-gray-700">Amenities</p>
                <div className="flex flex-wrap gap-2">
                  {amenities.map((a) => (
                    <span key={a} className="rounded-full border px-3 py-1 text-xs text-gray-600">{a}</span>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="rounded-xl border bg-white p-6 shadow-sm">
            <p className="text-base font-semibold">Request Info</p>
            <p className="mt-1 mb-4 text-sm text-gray-500">Landlords typically respond within 24 hours.</p>
            <InquiryForm listingId={String(listing.id)} listingTitle={listing.title ?? 'this listing'} />
          </div>
        </div>
      </div>
    </main>
  )
}
