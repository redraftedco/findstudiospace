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
    ? listing.images
        .map((x: unknown) => (typeof x === 'string' ? x : (x as Record<string, string>)?.url ?? ''))
        .filter(Boolean)
    : []

  return (
    <main style={{ background: '#f4f1eb', color: '#1a1814' }} className="min-h-screen">
      <div className="mx-auto max-w-4xl px-6 py-8">
        <Link href="/" style={{ color: '#8c8680', fontFamily: 'var(--font-mono)' }} className="text-sm hover:underline">
          ← Back to listings
        </Link>

        {images.length > 0 && (
          <div className="mt-6 flex gap-2 overflow-x-auto">
            {images.slice(0, 6).map((src, i) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img key={i} src={src} alt="" className="h-52 w-auto flex-shrink-0 object-cover" />
            ))}
          </div>
        )}

        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_340px]">
          {/* Main */}
          <div style={{ border: '1px solid #d6d0c4', background: '#edeae2' }} className="p-6">
            {listing.type && (
              <p style={{ color: '#8c8680', fontFamily: 'var(--font-mono)' }} className="mb-3 text-xs uppercase">
                {listing.type}
              </p>
            )}

            <h1 style={{ fontFamily: 'var(--font-heading)', color: '#1a1814' }} className="text-2xl font-semibold leading-snug">
              {listing.title ?? 'Untitled listing'}
            </h1>

            <div style={{ borderTop: '1px solid #d6d0c4' }} className="mt-4 pt-4 space-y-1">
              {listing.price_display && (
                <p style={{ fontFamily: 'var(--font-mono)', color: '#1a1814' }} className="text-xl font-medium">
                  {listing.price_display}
                </p>
              )}
              {(listing.neighborhood || listing.city) && (
                <p style={{ color: '#8c8680', fontFamily: 'var(--font-mono)' }} className="text-sm">
                  {[listing.neighborhood, listing.city].filter(Boolean).join(', ')}
                </p>
              )}
            </div>

            {listing.description && (
              <div style={{ borderTop: '1px solid #d6d0c4' }} className="mt-6 pt-6">
                <p style={{ color: '#8c8680', fontFamily: 'var(--font-mono)' }} className="mb-2 text-xs uppercase tracking-wider">
                  About this space
                </p>
                <p style={{ color: '#1a1814' }} className="text-sm leading-relaxed whitespace-pre-line">
                  {listing.description}
                </p>
              </div>
            )}

            {amenities.length > 0 && (
              <div style={{ borderTop: '1px solid #d6d0c4' }} className="mt-6 pt-6">
                <p style={{ color: '#8c8680', fontFamily: 'var(--font-mono)' }} className="mb-3 text-xs uppercase tracking-wider">
                  Amenities
                </p>
                <div className="flex flex-wrap gap-2">
                  {amenities.map((a) => (
                    <span key={a} style={{ border: '1px solid #d6d0c4', color: '#1a1814', fontFamily: 'var(--font-mono)' }} className="px-3 py-1 text-xs">
                      {a}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Inquiry */}
          <div style={{ border: '1px solid #d6d0c4', background: '#edeae2' }} className="p-6">
            <p style={{ fontFamily: 'var(--font-heading)', color: '#1a1814' }} className="text-base font-semibold">
              Request Info
            </p>
            <p style={{ color: '#8c8680' }} className="mt-1 mb-5 text-sm">
              Hosts typically respond within 24 hours.
            </p>
            <InquiryForm listingId={String(listing.id)} listingTitle={listing.title ?? 'this listing'} />
          </div>
        </div>

        {/* CTA */}
        <div style={{ border: '1px solid #d6d0c4', background: '#edeae2' }} className="mt-8 p-8 text-center">
          <p style={{ fontFamily: 'var(--font-heading)', color: '#1a1814' }} className="font-semibold">
            Have a space to rent?
          </p>
          <p style={{ color: '#8c8680' }} className="mt-1 text-sm">
            List it free and reach Portland creatives searching right now.
          </p>
          <Link
            href="/list-your-space"
            style={{ background: '#2c4a3e', color: '#f4f1eb' }}
            className="mt-5 inline-block px-6 py-2.5 text-sm font-medium hover:opacity-90"
          >
            List your space →
          </Link>
        </div>
      </div>
    </main>
  )
}
