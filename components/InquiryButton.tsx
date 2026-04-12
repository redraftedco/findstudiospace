'use client'

import { FormEvent, useState } from 'react'

type InquiryButtonProps = {
  listingId: string
}

export default function InquiryButton({ listingId }: InquiryButtonProps) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [website, setWebsite] = useState('')
  const [formStartedAt, setFormStartedAt] = useState<number | null>(null)
  const [status, setStatus] = useState('')
  const [submitting, setSubmitting] = useState(false)

  function onOpen() {
    setOpen(true)
    setFormStartedAt(Date.now())
    setStatus('')
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setStatus('')
    setSubmitting(true)

    const response = await fetch('/api/lead-inquiries', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        listing_id: listingId,
        name,
        email,
        message,
        website,
        form_started_at: formStartedAt,
      }),
    })

    const data = await response.json()

    if (response.ok) {
      setStatus('Inquiry sent successfully.')
      setName('')
      setEmail('')
      setMessage('')
      setWebsite('')
      setFormStartedAt(Date.now())
    } else {
      setStatus(data.error ?? 'Unable to submit inquiry right now.')
    }

    setSubmitting(false)
  }

  return (
    <div className="mt-3">
      <button
        className="rounded-md border border-blue-700 px-3 py-2 text-sm font-medium text-blue-700"
        onClick={onOpen}
        type="button"
      >
        Contact Owner
      </button>

      {open && (
        <div className="mt-3 rounded-md border bg-gray-50 p-3">
          <form className="space-y-2" onSubmit={submit}>
            <input
              className="w-full rounded-md border px-2 py-1"
              onChange={(event) => setName(event.target.value)}
              placeholder="Name"
              required
              value={name}
            />

            <input
              className="w-full rounded-md border px-2 py-1"
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Email"
              required
              type="email"
              value={email}
            />

            <textarea
              className="w-full rounded-md border px-2 py-1"
              onChange={(event) => setMessage(event.target.value)}
              placeholder="Message"
              required
              rows={3}
              value={message}
            />

            <input
              aria-hidden="true"
              className="hidden"
              onChange={(event) => setWebsite(event.target.value)}
              tabIndex={-1}
              value={website}
            />

            <div className="flex gap-2">
              <button
                className="rounded-md bg-blue-700 px-3 py-1 text-sm font-medium text-white disabled:opacity-50"
                disabled={submitting}
                type="submit"
              >
                {submitting ? 'Submitting…' : 'Submit'}
              </button>
              <button
                className="rounded-md border px-3 py-1 text-sm"
                onClick={() => setOpen(false)}
                type="button"
              >
                Close
              </button>
            </div>
          </form>

          {status && <p className="mt-2 text-sm text-gray-700">{status}</p>}
        </div>
      )}
    </div>
  )
}
