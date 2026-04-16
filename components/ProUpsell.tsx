export default function ProUpsell({ listingId }: { listingId: string }) {
  return (
    <div style={{
      border: '1px solid var(--rule)',
      background: 'var(--surface)',
      padding: '16px',
      marginTop: '12px',
    }}>
      <p style={{
        fontFamily: 'var(--font-mono)',
        fontSize: '11px',
        color: 'var(--stone)',
        textTransform: 'uppercase',
        letterSpacing: '0.08em',
        margin: '0 0 6px',
      }}>
        Pro Analytics
      </p>
      <p style={{
        fontFamily: 'var(--font-body)',
        fontSize: '13px',
        color: 'var(--stone)',
        margin: '0 0 12px',
        lineHeight: 1.5,
      }}>
        See daily views, inquiry trends, and how you rank in your neighborhood.
      </p>
      <a
        href={`/claim?listing_id=${listingId}`}
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '12px',
          color: '#a84530',
          textDecoration: 'none',
        }}
      >
        Upgrade to Pro →
      </a>
    </div>
  )
}
