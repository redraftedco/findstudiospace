'use client'

import { useRef, useState } from 'react'
import { useSearchParams } from 'next/navigation'

type Props = { listingId: string }

export default function InquiryForm({ listingId }: Props) {
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const startedAt = useRef<number | null>(null)
  const searchParams = useSearchParams()

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus('submitting')
    if (startedAt.current === null) startedAt.current = Date.now()
    const form = e.currentTarget
    const userMessage = (form.elements.namedItem('message') as HTMLTextAreaElement).value

    try {
      const res = await fetch('/api/lead-inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          listing_id: listingId,
          name: (form.elements.namedItem('name') as HTMLInputElement).value,
          email: (form.elements.namedItem('email') as HTMLInputElement).value,
          message: userMessage,
          website: (form.elements.namedItem('website') as HTMLInputElement).value,
          form_started_at: startedAt.current,
          utm_source: searchParams.get('utm_source') || undefined,
          utm_medium: searchParams.get('utm_medium') || undefined,
          utm_campaign: searchParams.get('utm_campaign') || undefined,
        }),
      })
      const json = await res.json()
      if (json.ok) {
        setStatus('success')
      } else {
        setErrorMsg(json.error ?? 'Something went wrong.')
        setStatus('error')
      }
    } catch {
      setErrorMsg('Network error. Please try again.')
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div
        style={{
          border: '1px solid var(--rule)',
          color: 'var(--action)',
          fontFamily: 'var(--font-mono)',
          fontSize: '0.8125rem',
          padding: '16px',
          lineHeight: 1.5,
        }}
      >
        Message sent. The host typically responds within 48 hours.
      </div>
    )
  }

  return (
    <form id="inquiry" onSubmit={handleSubmit} className="space-y-3">
      {/* honeypot */}
      <input name="website" type="text" className="hidden" tabIndex={-1} autoComplete="off" />
      <input name="name" required placeholder="Your name" autoComplete="name" className="input" />
      <input
        name="email"
        type="email"
        required
        placeholder="Your email"
        autoComplete="email"
        inputMode="email"
        className="input"
      />
      <textarea
        name="message"
        required
        defaultValue="I'm interested in this space. Please send me more information."
        rows={4}
        className="input resize-none"
      />
      {status === 'error' && (
        <p style={{ color: 'var(--error)', fontFamily: 'var(--font-mono)' }} className="text-xs">
          {errorMsg}
        </p>
      )}
      <button
        type="submit"
        disabled={status === 'submitting'}
        className="btn-action"
        style={{
          width: '100%',
          fontFamily: 'var(--font-heading)',
          fontSize: '0.875rem',
          fontWeight: 500,
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          padding: '14px',
          border: 'none',
          cursor: status === 'submitting' ? 'not-allowed' : 'pointer',
          opacity: status === 'submitting' ? 0.7 : 1,
        }}
      >
        {status === 'submitting' ? 'Sending…' : 'Send Inquiry'}
      </button>
      <p
        style={{
          color: 'var(--stone)',
          fontFamily: 'var(--font-body)',
          fontSize: '0.8125rem',
          textAlign: 'center',
          lineHeight: 1.5,
          marginTop: '8px',
        }}
      >
        Free to inquire. No commitment. Response typically within 48 hours.
      </p>
    </form>
  )
}
