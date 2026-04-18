export default function ProUpsell({ listingId }: { listingId: string }) {
  return (
    <div
      style={{
        border: '1px solid var(--rule)',
        background: 'var(--surface)',
        padding: '20px',
        marginTop: '16px',
      }}
    >
      <p
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '11px',
          color: 'var(--stone)',
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          margin: '0 0 8px',
        }}
      >
        Own this listing?
      </p>
      <p
        style={{
          fontFamily: 'var(--font-body)',
          fontSize: '0.9375rem',
          color: 'var(--ink)',
          margin: '0 0 16px',
          lineHeight: 1.5,
        }}
      >
        Get featured placement, Instagram and website links, and monthly analytics.
      </p>
      <a
        href={`/claim?listing_id=${listingId}`}
        className="btn-action"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '12px 18px',
          fontFamily: 'var(--font-heading)',
          fontSize: '0.8125rem',
          fontWeight: 500,
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          textDecoration: 'none',
          color: 'var(--paper)',
        }}
      >
        Start 30-day free trial →
      </a>
      <p
        style={{
          fontFamily: 'var(--font-body)',
          fontSize: '0.8125rem',
          color: 'var(--stone)',
          margin: '12px 0 0',
        }}
      >
        $29/month after. Cancel anytime.
      </p>
    </div>
  )
}
