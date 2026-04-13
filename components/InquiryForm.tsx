'use client'

import { useRef, useState } from 'react'

type Props = { listingId: string; listingTitle: string }

export default function InquiryForm({ listingId }: Props) {
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const startedAt = useRef(Date.now())

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus('submitting')
    const form = e.currentTarget

    try {
      const res = await fetch('/lead-inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          listing_id: listingId,
          name: (form.elements.namedItem('name') as HTMLInputElement).value,
          email: (form.elements.namedItem('email') as HTMLInputElement).value,
          message: (form.elements.namedItem('message') as HTMLTextAreaElement).value,
          website: (form.elements.namedItem('website') as HTMLInputElement).value,
          form_started_at: startedAt.current,
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
      <div style={{ border: '1px solid #d6d0c4', color: '#2c4a3e', fontFamily: 'var(--font-mono)' }} className="p-4 text-sm">
        Your message was sent. Hosts typically respond within 24 hours.
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <input name="website" type="text" className="hidden" tabIndex={-1} autoComplete="off" />
      <input
        name="name"
        required
        placeholder="Your name"
        className="input"
      />
      <input
        name="email"
        type="email"
        required
        placeholder="Your email"
        className="input"
      />
      <textarea
        name="message"
        required
        placeholder="What are you looking for? Include intended use, budget, and move-in date."
        rows={4}
        className="input resize-none"
      />
      {status === 'error' && (
        <p style={{ color: '#8b2020', fontFamily: 'var(--font-mono)' }} className="text-xs">{errorMsg}</p>
      )}
      <button
        type="submit"
        disabled={status === 'submitting'}
        style={{ background: '#2c4a3e', color: '#f4f1eb', width: '100%', fontFamily: 'var(--font-body)' }}
        className="py-2.5 text-sm font-medium hover:opacity-90 disabled:opacity-50"
      >
        {status === 'submitting' ? 'Sending…' : 'Request Info'}
      </button>
    </form>
  )
}
