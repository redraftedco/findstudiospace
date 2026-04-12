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
      <div className="rounded-lg bg-green-50 p-4 text-sm text-green-700">
        Inquiry sent. The owner will be in touch soon.
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
        className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:border-blue-500"
      />
      <input
        name="email"
        type="email"
        required
        placeholder="Your email"
        className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:border-blue-500"
      />
      <textarea
        name="message"
        required
        placeholder="What are you looking for? Include intended use, budget, and move-in date."
        rows={4}
        className="w-full resize-none rounded-lg border px-3 py-2 text-sm outline-none focus:border-blue-500"
      />
      {status === 'error' && <p className="text-xs text-red-600">{errorMsg}</p>}
      <button
        type="submit"
        disabled={status === 'submitting'}
        className="w-full rounded-lg bg-blue-600 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
      >
        {status === 'submitting' ? 'Sending…' : 'Request Info'}
      </button>
    </form>
  )
}
