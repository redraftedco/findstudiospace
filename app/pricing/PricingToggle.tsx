'use client'

// Client component: monthly/annual toggle needs React state for display switching.
// Actual checkout interval is selected on the dashboard after claim, so this
// component does not POST anywhere — purely display.

import { useState } from 'react'

export default function PricingToggle() {
  const [annual, setAnnual] = useState(false)

  return (
    <div className="mb-6">
      <div
        style={{
          background: 'var(--surface)',
          border: '1px solid var(--rule)',
          display: 'inline-flex',
        }}
        className="mb-4"
        role="group"
        aria-label="Billing interval"
      >
        <button
          type="button"
          onClick={() => setAnnual(false)}
          aria-pressed={!annual}
          style={{
            padding: '8px 14px',
            fontFamily: 'var(--font-body)',
            fontSize: '13px',
            background: !annual ? 'var(--paper)' : 'transparent',
            color: !annual ? 'var(--ink)' : 'var(--stone)',
            minHeight: '40px',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          Monthly
        </button>
        <button
          type="button"
          onClick={() => setAnnual(true)}
          aria-pressed={annual}
          style={{
            padding: '8px 14px',
            fontFamily: 'var(--font-body)',
            fontSize: '13px',
            background: annual ? 'var(--paper)' : 'transparent',
            color: annual ? 'var(--ink)' : 'var(--stone)',
            minHeight: '40px',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          Annual{' '}
          <span style={{ color: 'var(--action)', fontWeight: 500 }}>(save $99)</span>
        </button>
      </div>
      <div>
        <span
          style={{ fontFamily: 'var(--font-heading)', color: 'var(--ink)' }}
          className="text-5xl font-semibold"
        >
          ${annual ? '249' : '29'}
        </span>
        <span style={{ color: 'var(--stone)' }} className="text-sm ml-2">
          /{annual ? 'year' : 'month'}
        </span>
      </div>
    </div>
  )
}
