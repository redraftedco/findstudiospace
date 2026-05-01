import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createAuthClient } from '@/lib/supabase-auth'
import { supabaseServer } from '@/lib/supabase-server'

type Props = { params: Promise<{ listingId: string }> }

export default async function DashboardPage({ params }: Props) {
  const { listingId } = await params
  const id = parseInt(listingId, 10)
  if (isNaN(id)) redirect('/')

  const supabase = await createAuthClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect(`/claim/${id}`)

  const { data: listing } = await supabaseServer
    .from('listings')
    .select('id, title, neighborhood, type, owner_user_id')
    .eq('id', id)
    .eq('status', 'active')
    .single()

  if (!listing) redirect('/')
  if (listing.owner_user_id !== user.id) redirect('/')

  const { count: inquiryCount } = await supabaseServer
    .from('lead_inquiries')
    .select('id', { count: 'exact', head: true })
    .eq('listing_id', id)

  const cutoff = new Date()
  cutoff.setDate(cutoff.getDate() - 30)
  const { count: viewCount } = await supabaseServer
    .from('listing_views')
    .select('id', { count: 'exact', head: true })
    .eq('listing_id', id)
    .gte('viewed_at', cutoff.toISOString())

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--paper)',
      padding: '80px 24px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    }}>
      <div style={{ maxWidth: '560px', width: '100%' }}>

        <Link href={`/listing/${id}`} style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '11px',
          color: 'var(--stone)',
          textDecoration: 'none',
          display: 'block',
          marginBottom: '48px',
        }}>
          ← View listing
        </Link>

        <div style={{ marginBottom: '32px' }}>
          <p style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '10px',
            color: 'var(--stone)',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            margin: '0 0 4px',
          }}>
            {listing.type} · {listing.neighborhood}
          </p>
          <h1 style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '24px',
            fontWeight: 700,
            color: 'var(--ink)',
            margin: 0,
          }}>
            {listing.title}
          </h1>
        </div>

        {/* Stats */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '12px',
          marginBottom: '32px',
        }}>
          <div style={{
            background: 'var(--surface)',
            border: '1px solid var(--rule)',
            padding: '20px',
            textAlign: 'center',
          }}>
            <p style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '36px',
              fontWeight: 700,
              color: (viewCount ?? 0) > 0 ? 'var(--ink)' : 'var(--stone)',
              margin: '0 0 4px',
              lineHeight: 1,
            }}>
              {viewCount ?? 0}
            </p>
            <p style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '10px',
              color: 'var(--stone)',
              margin: 0,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
            }}>
              Views (30 days)
            </p>
          </div>
          <div style={{
            background: 'var(--surface)',
            border: '1px solid var(--rule)',
            padding: '20px',
            textAlign: 'center',
          }}>
            <p style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '36px',
              fontWeight: 700,
              color: (inquiryCount ?? 0) > 0 ? 'var(--action)' : 'var(--stone)',
              margin: '0 0 4px',
              lineHeight: 1,
            }}>
              {inquiryCount ?? 0}
            </p>
            <p style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '10px',
              color: 'var(--stone)',
              margin: 0,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
            }}>
              Inquiries
            </p>
          </div>
        </div>

        {/* Placement upsell */}
        <div style={{ border: '1px solid var(--rule)', padding: '24px', marginBottom: '24px' }}>
          <p style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '16px',
            fontWeight: 600,
            color: 'var(--ink)',
            margin: '0 0 8px',
          }}>
            Get more visibility
          </p>
          <p style={{
            fontFamily: 'var(--font-body)',
            fontSize: '14px',
            color: 'var(--stone)',
            margin: '0 0 16px',
            lineHeight: 1.5,
          }}>
            Sponsored placement puts your studio at the top of a category or neighborhood page — from $49/month. No commission. Renters contact you directly.
          </p>
          <Link
            href="/advertise"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              fontFamily: 'var(--font-body)',
              fontSize: '14px',
              fontWeight: 500,
              color: 'var(--action)',
              textDecoration: 'none',
            }}
          >
            Learn about sponsored placement →
          </Link>
        </div>

      </div>
    </div>
  )
}
