import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'
import { supabase } from '@/lib/supabase'
import InquiryForm from '@/components/InquiryForm'
import ViewCounter from '@/components/ViewCounter'
import ProUpsell from '@/components/ProUpsell'
import { directoryConfig } from '@/lib/directory'

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

const TEXT_CLASS: Record<string, string> = {
  art:      'cat-text-art',
  workshop: 'cat-text-workshop',
  office:   'cat-text-office',
  photo:    'cat-text-photo',
  retail:   'cat-text-retail',
  fitness:  'cat-text-fitness',
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
  const textClass = TEXT_CLASS[typeKey] ?? ''

  function timeAgo(dateStr: string | null | undefined): string | null {
    if (!dateStr) return null
    const days = Math.max(0, Math.floor((Date.now() - new Date(dateStr).getTime()) / (1000 * 60 * 60 * 24)))
    if (days === 0) return null
    if (days === 1) return 'Listed yesterday'
    if (days < 30) return `Listed ${days} days ago`
    if (days < 90) return `Listed ${Math.floor(days / 7)} weeks ago`
    return `Listed ${Math.floor(days / 30)} months ago`
  }
  const timestamp = timeAgo(listing.created_at)

  return (
    <main style={{ background: '#f4f1eb', color: '#1a1814' }} className="min-h-screen">
      <div className="mx-auto max-w-5xl px-6 py-8">

        {/* Breadcrumb */}
        <nav style={{ color: '#6b6762', fontFamily: 'var(--font-mono)' }} className="mb-6 text-xs">
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

        {/* Space type tag + Pro badge */}
        <div className="flex items-center gap-2 mb-2">
          {listing.type && (
            <p style={{ fontFamily: 'var(--font-mono)' }} className={`${textClass} text-xs uppercase`}>
              {listing.type}
            </p>
          )}
          {listing.tier === 'pro' && <span className="pro-badge">Pro</span>}
        </div>

        {/* Title */}
        <h1 style={{ fontFamily: 'var(--font-heading)', color: '#1a1814' }} className="mb-4 text-3xl font-semibold leading-snug">
          {listing.title ?? 'Untitled listing'}
        </h1>

        {/* Metadata row */}
        <div style={{ fontFamily: 'var(--font-mono)', color: '#6b6762', borderBottom: '1px solid #d6d0c4' }} className="mb-6 pb-4 text-sm">
          {[
            <span key="price" style={{ color: '#1a1814', fontWeight: 500 }}>{priceFormatted}</span>,
            listing.neighborhood ? <span key="hood">{listing.neighborhood}</span> : null,
            listing.square_footage ? <span key="sqft">{listing.square_footage.toLocaleString('en-US')} SF</span> : null,
            timestamp ? <span key="ts">{timestamp}</span> : null,
          ].filter(Boolean).reduce<React.ReactNode[]>((acc, el, i) => {
            if (i > 0) acc.push(<span key={`sep-${i}`} style={{ margin: '0 0.4rem' }}>·</span>)
            acc.push(el)
            return acc
          }, [])}
        </div>

        <div style={{
          background: '#FAE5DB',
          padding: '10px 16px',
          marginBottom: '16px',
          display: 'flex',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '8px 16px',
        }}>
          <p style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '12px',
            color: '#1a1814',
            margin: 0,
          }}>
            Is this your studio?
          </p>
          <a
            href={`/claim/${listing.id}`}
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '12px',
              color: '#a84530',
              textDecoration: 'none',
              marginLeft: 'auto',
            }}
          >
            Claim My Listing →
          </a>
        </div>

        <ViewCounter listingId={String(listing.id)} tier={listing.tier ?? 'free'} />

        {/* Two-column layout */}
        <div className="listing-page-wrapper" style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start' }}>

          {/* Left column */}
          <div style={{ flex: 1, minWidth: 0 }}>
            {/* Image gallery */}
            {images.length === 0 ? (
              <div style={{ background: '#d6d0c4', height: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center' }} className="mb-6">
                <p style={{ color: '#6b6762', fontFamily: 'var(--font-mono)' }} className="text-xs">No photos available</p>
              </div>
            ) : images.length === 1 ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={images[0]} alt="" className="mb-6 w-full" style={{ height: '400px', objectFit: 'cover', display: 'block' }} />
            ) : (
              <div className="mb-6 grid gap-2" style={{ gridTemplateColumns: images.length >= 3 ? '2fr 1fr' : '1fr 1fr', position: 'relative' }}>
                <div style={{ position: 'relative' }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={images[0]} alt="" style={{ height: '400px', objectFit: 'cover', display: 'block', width: '100%', gridRow: images.length >= 3 ? '1 / 3' : undefined }} />
                  <span style={{
                    position: 'absolute', top: '8px', right: '8px',
                    background: 'rgba(26,24,20,0.6)', color: '#f4f1eb',
                    fontFamily: 'var(--font-mono)', fontSize: '0.72rem',
                    padding: '2px 8px',
                  }}>
                    {images.length} photos
                  </span>
                </div>
                {images.slice(1, images.length >= 3 ? 3 : 2).map((src, i) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img key={i} src={src} alt="" style={{ height: images.length >= 3 ? '196px' : '400px', objectFit: 'cover', display: 'block', width: '100%' }} />
                ))}
              </div>
            )}

            {/* Description */}
            <section style={{ borderTop: '1px solid #d6d0c4' }} className="pt-6">
              <h2 style={{ color: '#6b6762', fontFamily: 'var(--font-mono)' }} className="mb-3 text-xs uppercase tracking-wider">
                About this space
              </h2>
              <p style={{ color: '#1a1814' }} className="text-sm leading-relaxed whitespace-pre-line">
                {listing.description ?? 'No description available.'}
              </p>
            </section>

            {/* Amenities */}
            <section style={{ borderTop: '1px solid #d6d0c4' }} className="mt-6 pt-6">
              <h2 style={{ color: '#6b6762', fontFamily: 'var(--font-mono)' }} className="mb-3 text-xs uppercase tracking-wider">
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
                <p style={{ color: '#6b6762' }} className="text-sm">None listed.</p>
              )}
            </section>

            {/* Pro links — website & Instagram */}
            {listing.tier === 'pro' && (listing.website_url || listing.instagram_url) && (
              <section style={{ borderTop: '1px solid #d6d0c4' }} className="mt-6 pt-6">
                <h2 style={{ color: '#6b6762', fontFamily: 'var(--font-mono)' }} className="mb-3 text-xs uppercase tracking-wider">
                  Links
                </h2>
                <div className="flex flex-wrap gap-4">
                  {listing.website_url && (
                    <a
                      href={listing.website_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: '#a84530', fontFamily: 'var(--font-mono)' }}
                      className="text-sm hover:underline"
                    >
                      Website ↗
                    </a>
                  )}
                  {listing.instagram_url && (
                    <a
                      href={listing.instagram_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: '#a84530', fontFamily: 'var(--font-mono)' }}
                      className="text-sm hover:underline"
                    >
                      Instagram ↗
                    </a>
                  )}
                </div>
              </section>
            )}
          </div>

          {/* Right column — sticky form */}
          <div className="listing-form-col" style={{ width: '360px', flexShrink: 0, position: 'sticky', top: '2rem', alignSelf: 'flex-start' }}>
            <div style={{ border: '1px solid #d6d0c4', background: '#edeae2' }} className="p-6">
              <p style={{ fontFamily: 'var(--font-heading)', color: '#1a1814' }} className="mb-1 text-base font-semibold">
                Request Info
              </p>
              <p style={{ color: '#6b6762' }} className="mb-5 text-sm">
                Hosts typically respond within 24 hours.
              </p>
              <InquiryForm listingId={String(listing.id)} listingTitle={listing.title ?? 'this listing'} />
            </div>
          </div>
        </div>

        {(listing.tier ?? 'free') !== 'pro' && (
          <ProUpsell listingId={String(listing.id)} />
        )}

      </div>
    </main>
  )
}
