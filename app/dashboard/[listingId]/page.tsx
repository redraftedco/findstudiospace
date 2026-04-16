import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createAuthClient } from '@/lib/supabase-auth'
import { supabaseServer } from '@/lib/supabase-server'

type Props = { params: Promise<{ listingId: string }> }

export default async function DashboardPage({ params }: Props) {
  const { listingId } = await params
  const id = parseInt(listingId, 10)
  if (isNaN(id)) redirect('/')

  // Verify auth
  const supabase = await createAuthClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect(`/claim/${id}`)

  // Fetch listing with ownership check
  const { data: listing } = await supabaseServer
    .from('listings')
    .select('id, title, neighborhood, type, tier, stripe_customer_id, owner_user_id, owner_email')
    .eq('id', id)
    .eq('status', 'active')
    .single()

  if (!listing) redirect('/')
  if (listing.owner_user_id !== user.id) redirect('/')

  // Fetch inquiry count
  const { count: inquiryCount } = await supabaseServer
    .from('lead_inquiries')
    .select('id', { count: 'exact', head: true })
    .eq('listing_id', id)

  // Fetch 30-day view count
  const cutoff = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
  const { count: viewCount } = await supabaseServer
    .from('listing_views')
    .select('id', { count: 'exact', head: true })
    .eq('listing_id', id)
    .gte('viewed_at', cutoff)

  const isPro = listing.tier === 'pro'

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

        {/* Header */}
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h1 style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '24px',
              fontWeight: 700,
              color: 'var(--ink)',
              margin: 0,
            }}>
              {listing.title}
            </h1>
            {isPro && <span className="pro-badge">Pro</span>}
          </div>
        </div>

        {/* Stats */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '12px',
          marginBottom: '32px',
        }}>
          <div style={{
            background: 'white',
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
            background: 'white',
            border: '1px solid var(--rule)',
            padding: '20px',
            textAlign: 'center',
          }}>
            <p style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '36px',
              fontWeight: 700,
              color: (inquiryCount ?? 0) > 0 ? '#a84530' : 'var(--stone)',
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

        {/* Free vs Pro comparison */}
        {!isPro && (
          <div style={{
            border: '1px solid var(--rule)',
            marginBottom: '24px',
          }}>
            <div style={{
              padding: '16px 20px',
              borderBottom: '1px solid var(--rule)',
            }}>
              <p style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '16px',
                fontWeight: 600,
                color: 'var(--ink)',
                margin: 0,
              }}>
                Get more from your listing
              </p>
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={{ ...thStyle, textAlign: 'left' }}>Feature</th>
                  <th style={thStyle}>Free</th>
                  <th style={{ ...thStyle, color: '#a84530' }}>Pro</th>
                </tr>
              </thead>
              <tbody>
                <CompareRow label="View count" free="Basic" pro="Full analytics" />
                <CompareRow label="Photos" free="3" pro="15" />
                <CompareRow label="Website link" free="—" pro="Shown on listing" />
                <CompareRow label="Instagram link" free="—" pro="Shown on listing" />
                <CompareRow label="Verified badge" free="—" pro="Pro badge" />
                <CompareRow label="Search ranking" free="Standard" pro="Featured" />
              </tbody>
            </table>
            <div style={{ padding: '16px 20px' }}>
              <a
                href={`/claim?listing_id=${id}`}
                className="btn-action"
                style={{
                  display: 'block',
                  width: '100%',
                  padding: '12px',
                  textAlign: 'center',
                  fontFamily: 'var(--font-body)',
                  fontSize: '14px',
                  fontWeight: 500,
                  textDecoration: 'none',
                  border: 'none',
                  boxSizing: 'border-box',
                }}
              >
                Upgrade to Pro — $29/mo
              </a>
              <p style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '11px',
                color: 'var(--stone)',
                textAlign: 'center',
                margin: '8px 0 0',
              }}>
                First 30 days free. Cancel anytime.
              </p>
            </div>
          </div>
        )}

        {/* Pro: manage subscription */}
        {isPro && listing.stripe_customer_id && (
          <ProPortalButton customerId={listing.stripe_customer_id} listingId={id} />
        )}
      </div>
    </div>
  )
}

const thStyle: React.CSSProperties = {
  fontFamily: 'var(--font-mono)',
  fontSize: '10px',
  color: 'var(--stone)',
  textTransform: 'uppercase',
  letterSpacing: '0.08em',
  padding: '10px 20px',
  borderBottom: '1px solid var(--rule)',
  textAlign: 'center',
}

function CompareRow({ label, free, pro }: { label: string; free: string; pro: string }) {
  const cellStyle: React.CSSProperties = {
    fontFamily: 'var(--font-mono)',
    fontSize: '12px',
    padding: '10px 20px',
    borderBottom: '1px solid var(--rule)',
    textAlign: 'center',
  }
  return (
    <tr>
      <td style={{ ...cellStyle, textAlign: 'left', color: 'var(--ink)' }}>{label}</td>
      <td style={{ ...cellStyle, color: 'var(--stone)' }}>{free}</td>
      <td style={{ ...cellStyle, color: 'var(--ink)' }}>{pro}</td>
    </tr>
  )
}

function ProPortalButton({ customerId, listingId }: { customerId: string; listingId: number }) {
  return (
    <form action="/api/stripe/portal" method="POST">
      <input type="hidden" name="customer_id" value={customerId} />
      <input type="hidden" name="listing_id" value={listingId} />
      <button
        type="submit"
        style={{
          width: '100%',
          padding: '10px',
          border: '1px solid var(--ink)',
          background: 'transparent',
          color: 'var(--ink)',
          fontFamily: 'var(--font-body)',
          fontSize: '14px',
          fontWeight: 500,
          cursor: 'pointer',
        }}
      >
        Manage subscription →
      </button>
    </form>
  )
}
