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
    .select('title, city, category')
    .eq('id', id)
    .single()
  if (!data) return {}
  return {
    title: `${data.title} | FindStudioSpace`,
    description: `${data.category ?? 'Studio'} space in ${data.city ?? 'Portland'}. Contact the owner to learn more.`,
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
  const trueAttrs = attrs
    ? Object.entries(attrs)
        .filter(([, v]) => v === true)
        .map(([k]) => k.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()))
    : []

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-4xl px-4 py-8">
        <Link href="/" className="text-sm text-gray-500 hover:underline">
          ← Back to listings
        </Link>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_360px]">
          {/* Details */}
          <div className="rounded-xl border bg-white p-6 shadow-sm">
            {listing.category && (
              <span className="mb-3 inline-block rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
                {listing.category}
              </span>
            )}
            <h1 className="text-2xl font-bold leading-snug">
              {listing.title ?? 'Untitled listing'}
            </h1>

            <div className="mt-4 space-y-2">
              {listing.price_display && (
                <p className="text-xl font-semibold text-blue-700">{listing.price_display}</p>
              )}
              {(listing.neighborhood || listing.city) && (
                <p className="text-sm text-gray-600">
                  📍 {[listing.neighborhood, listing.city].filter(Boolean).join(', ')}
                </p>
              )}
            </div>

            {trueAttrs.length > 0 && (
              <div className="mt-6">
                <p className="mb-2 text-sm font-semibold text-gray-700">Amenities</p>
                <div className="flex flex-wrap gap-2">
                  {trueAttrs.map((attr) => (
                    <span
                      key={attr}
                      className="rounded-full border px-3 py-1 text-xs text-gray-600"
                    >
                      {attr}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Inquiry form */}
          <div className="rounded-xl border bg-white p-6 shadow-sm">
            <p className="text-base font-semibold">Request Info</p>
            <p className="mt-1 mb-4 text-sm text-gray-500">
              Landlords typically respond within 24 hours.
            </p>
            <InquiryForm
              listingId={String(listing.id)}
              listingTitle={listing.title ?? 'this listing'}
            />
          </div>
        </div>
      </div>
    </main>
  )
}
