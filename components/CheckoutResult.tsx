'use client'

import { useSearchParams } from 'next/navigation'

export function CheckoutResult() {
  const params = useSearchParams()
  const success = params.get('success')
  const canceled = params.get('canceled')

  if (success) {
    return (
      <div style={{
        background: 'rgba(212,245,66,0.08)',
        color: 'var(--lime)',
        padding: '16px 24px',
        fontFamily: 'var(--font-mono)',
        fontSize: '14px',
        textAlign: 'center',
        border: '1px solid rgba(212,245,66,0.2)',
      }}>
        Your upgrade is active. Your listing will be updated within a few minutes.
      </div>
    )
  }

  if (canceled) {
    return (
      <div style={{
        background: 'rgba(229,161,0,0.08)',
        color: 'var(--featured-color)',
        padding: '16px 24px',
        fontFamily: 'var(--font-mono)',
        fontSize: '14px',
        textAlign: 'center',
        border: '1px solid rgba(229,161,0,0.2)',
      }}>
        Checkout canceled. No charges were made. You can try again below.
      </div>
    )
  }

  return null
}
