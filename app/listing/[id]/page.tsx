import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'
import { supabase } from '@/lib/supabase'
import InquiryForm from '@/components/InquiryForm'

export const revalidate = 3600

const TYPE_TO_SLUG: Record<string, string> = {
  office: 'office-space-rental',
  art: 'art-studio',
  workshop: 'workshop-space-rental',
  retail: 'retail-space-for-rent',
  photo: 'photo-studio-rental',
  fitness: 'fitness-studio-rental',
  music: 'music-studio-rental',
}

const TYPE_TO_LABEL: Record<string, string> = {
  office: 'Office Space',
  art: 'Art Studio',
  workshop: 'Workshop Space',
  retail: 'Retail Space',
  photo: 'Photo Studio',
  fitness: 'Fitness & Dance',
  music: 'Music Studio',
}

function formatPrice(raw: string | null | undefined): string {
  if (!raw) return 'Price on request'
  const digits = raw.replace(/[^0-9]/g, '')
  if (!digits) return raw
  const num = parseInt(digits, 10)
  if (isNaN(num)) return raw
  return `$${num.toLocaleString('en-US')}/mo`
}

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

  const typeKey = (listing.type ?? '').toLowerCase()
  const categorySlug = TYPE_TO_SLUG[typeKey]
  const categoryLabel = TYPE_TO_LABEL[typeKey] ?? listing.type

  const priceFormatted = formatPrice(listing.price_display)

  return (
    <main style={{ background: '#f4f1eb', color: '#1a1814' }} className="min-h-screen">
      <div className="mx-auto max-w-5xl px-6 py-8">

        {/* Breadcrumb */}
        <nav style={{ color: '#8c8680', fontFamily: 'var(--font-mono)' }} className="mb-6 text-xs">
          <Link href="/" className="hover:underline">FindStudioSpace</Link>
          <span className="mx-2">→</span>
          <Link href="/" className="hover:underline">Portland</Link>
          {categorySlug && (
            <>
              <span className="mx-2">→</span>
              <Link href={`/portland/${categorySlug}`} className="hover:underline">{categoryLabel}</Link>
            </>
          )}
          <span className="mx-2">→</span>
          <span style={{ color: '#1a1814' }}>{listing.title ?? 'Listing'}</span>
        </nav>

        {/* Space type tag */}
        {listing.type && (
          <p style={{ color: '#8c8680', fontFamily: 'var(--font-mono)' }} className="mb-2 text-xs uppercase">
            {listing.type}
          </p>
        )}

        {/* Title */}
        <h1 style={{ fontFamily: 'var(--font-heading)', color: '#1a1814' }} className="mb-4 text-3xl font-semibold leading-snug">
          {listing.title ?? 'Untitled listing'}
        </h1>

        {/* Metadata row */}
        <div style={{ fontFamily: 'var(--font-mono)', color: '#8c8680', borderBottom: '1px solid #d6d0c4' }} className="mb-6 flex flex-wrap items-center gap-x-4 gap-y-1 pb-4 text-sm">
          <span style={{ color: '#1a1814', fontWeight: 500 }}>{priceFormatted}</span>
          {listing.neighborhood && <span>{listing.neighborhood}</span>}
          {listing.square_footage && <span>{listing.square_footage.toLocaleString('en-US')} sq ft</span>}
        </div>

        {/* Two-column layout */}
        <div className="listing-page-grid">

          {/* Left column */}
          <div>
            {/* Image gallery */}
            {images.length === 0 ? (
              <div
                style={{ background: '#d6d0c4', aspectRatio: '16/9' }}
                className="mb-6 flex items-center justify-center"
              >
                <p style={{ color: '#8c8680', fontFamily: 'var(--font-mono)' }} className="text-xs">No photos available</p>
              </div>
            ) : images.length === 1 ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={images[0]} alt="" className="mb-6 w-full object-cover" style={{ aspectRatio: '16/9', objectFit: 'cover' }} />
            ) : (
              <div className="mb-6 grid gap-2" style={{ gridTemplateColumns: images.length >= 3 ? '2fr 1fr' : '1fr 1fr' }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={images[0]} alt="" className="w-full object-cover" style={{ aspectRatio: '16/9', objectFit: 'cover', gridRow: images.length >= 3 ? '1 / 3' : undefined }} />
                {images.slice(1, images.length >= 3 ? 3 : 2).map((src, i) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img key={i} src={src} alt="" className="w-full object-cover" style={{ aspectRatio: '16/9', objectFit: 'cover' }} />
                ))}
              </div>
            )}

            {/* Description */}
            <section style={{ borderTop: '1px solid #d6d0c4' }} className="pt-6">
              <h2 style={{ color: '#8c8680', fontFamily: 'var(--font-mono)' }} className="mb-3 text-xs uppercase tracking-wider">
                About this space
              </h2>
              <p style={{ color: '#1a1814' }} className="text-sm leading-relaxed whitespace-pre-line">
                {listing.description ?? 'No description available.'}
              </p>
            </section>

            {/* Amenities */}
            <section style={{ borderTop: '1px solid #d6d0c4' }} className="mt-6 pt-6">
              <h2 style={{ color: '#8c8680', fontFamily: 'var(--font-mono)' }} className="mb-3 text-xs uppercase tracking-wider">
                Amenities
              </h2>
              {amenities.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {amenities.map((a) => (
                    <span key={a} style={{ border: '1px solid #d6d0c4', color: '#1a1814', fontFamily: 'var(--font-mono)' }} className="px-3 py-1 text-xs">
                      {a}
                    </span>
                  ))}
                </div>
              ) : (
                <p style={{ color: '#8c8680' }} className="text-sm">None listed.</p>
              )}
            </section>

            {/* Bottom CTA */}
            <p style={{ borderTop: '1px solid #d6d0c4', color: '#2c4a3e' }} className="mt-8 pt-6 text-sm">
              <Link href="/list-your-space" className="hover:underline font-medium">
                Have a space to rent? List it free →
              </Link>
            </p>
          </div>

          {/* Right column — sticky form */}
          <div className="lg:sticky lg:top-6">
            <div style={{ border: '1px solid #d6d0c4', background: '#edeae2' }} className="p-6">
              <p style={{ fontFamily: 'var(--font-heading)', color: '#1a1814' }} className="mb-1 text-base font-semibold">
                Request Info
              </p>
              <p style={{ color: '#8c8680' }} className="mb-5 text-sm">
                Hosts typically respond within 24 hours.
              </p>
              <InquiryForm listingId={String(listing.id)} listingTitle={listing.title ?? 'this listing'} />
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
