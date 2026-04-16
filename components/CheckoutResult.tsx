'use client'

import { useSearchParams } from 'next/navigation'

export function CheckoutResult() {
  const params = useSearchParams()
  const success = params.get('success')
  const canceled = params.get('canceled')

  if (success) {
    return (
      <div style={{
        background: '#1a3a1a',
        color: '#d4edda',
        padding: '16px 24px',
        fontFamily: 'var(--font-mono)',
        fontSize: '14px',
        textAlign: 'center',
      }}>
        Your upgrade is active. Your listing will be updated within a few minutes.
      </div>
    )
  }

  if (canceled) {
    return (
      <div style={{
        background: '#3a2a1a',
        color: '#f5e6cc',
        padding: '16px 24px',
        fontFamily: 'var(--font-mono)',
        fontSize: '14px',
        textAlign: 'center',
      }}>
        Checkout canceled. No charges were made. You can try again below.
      </div>
    )
  }

  return null
}
