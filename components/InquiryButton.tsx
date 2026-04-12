'use client'

import { useState, useRef } from 'react'

type Props = {
  listingId: string
  listingTitle: string
}

type FormState = 'idle' | 'open' | 'submitting' | 'success' | 'error'

export default function InquiryButton({ listingId, listingTitle }: Props) {
  const [state, setState] = useState<FormState>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const formStartedAt = useRef<number | null>(null)

  function openForm() {
    formStartedAt.current = Date.now()
    setState('open')
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setState('submitting')
    setErrorMsg('')

    const form = e.currentTarget
    const data = {
      listing_id: listingId,
      name: (form.elements.namedItem('name') as HTMLInputElement).value,
      email: (form.elements.namedItem('email') as HTMLInputElement).value,
      message: (form.elements.namedItem('message') as HTMLTextAreaElement).value,
      website: (form.elements.namedItem('website') as HTMLInputElement).value,
      form_started_at: formStartedAt.current,
    }

    try {
      const res = await fetch('/lead-inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      const json = await res.json()
      if (json.ok) {
        setState('success')
      } else {
        setErrorMsg(json.error ?? 'Something went wrong.')
        setState('error')
      }
    } catch {
      setErrorMsg('Network error. Please try again.')
      setState('error')
    }
  }

  if (state === 'success') {
    return (
      <p className="mt-3 rounded-md bg-green-50 px-3 py-2 text-sm text-green-700">
        Inquiry sent!
      </p>
    )
  }

  if (state === 'idle') {
    return (
      <button
        className="mt-3 rounded-md border border-blue-600 px-3 py-1.5 text-sm font-medium text-blue-600 hover:bg-blue-50"
        onClick={openForm}
        type="button"
      >
        Inquire
      </button>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="mt-3 space-y-2">
      <p className="text-xs font-medium text-gray-700">
        Inquire about: <span className="font-semibold">{listingTitle}</span>
      </p>

      {/* Honeypot */}
      <input name="website" type="text" className="hidden" tabIndex={-1} autoComplete="off" />

      <input
        name="name"
        required
        placeholder="Your name"
        className="w-full rounded-md border px-2 py-1.5 text-sm"
      />
      <input
        name="email"
        type="email"
        required
        placeholder="Your email"
        className="w-full rounded-md border px-2 py-1.5 text-sm"
      />
      <textarea
        name="message"
        required
        placeholder="Message"
        rows={3}
        className="w-full rounded-md border px-2 py-1.5 text-sm resize-none"
      />

      {state === 'error' && (
        <p className="text-xs text-red-600">{errorMsg}</p>
      )}

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={state === 'submitting'}
          className="rounded-md bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {state === 'submitting' ? 'Sending…' : 'Send inquiry'}
        </button>
        <button
          type="button"
          onClick={() => setState('idle')}
          className="rounded-md border px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}
