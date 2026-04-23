'use client'

import { useState } from 'react'

const TYPES = ['Art Studio', 'Workshop', 'Office', 'Photo Studio', 'Retail', 'Fitness & Dance']

const AMENITIES = [
  'Parking',
  '24hr Access',
  'Natural Light',
  'Utilities Included',
  'Private Bathroom',
  'WiFi',
  'Storage',
]

export default function ListYourSpacePage() {
  const [amenities, setAmenities] = useState<string[]>([])
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  function toggleAmenity(a: string) {
    setAmenities((prev) => prev.includes(a) ? prev.filter((x) => x !== a) : [...prev, a])
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus('submitting')
    const form = e.currentTarget
    const get = (name: string) => (form.elements.namedItem(name) as HTMLInputElement).value

    const payload = {
      host_name: get('host_name'),
      email: get('email'),
      title: get('title'),
      type: get('type'),
      neighborhood: get('neighborhood'),
      price_monthly: get('price') ? Number(get('price')) : null,
      square_footage: get('sq_ft') ? Number(get('sq_ft')) : null,
      description: get('description'),
      amenities,
    }

    try {
      const res = await fetch('/api/submit-listing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const json = await res.json()
      if (!json.success) throw new Error(json.error ?? 'Submission failed')
      setStatus('success')
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Something went wrong.')
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <main style={{ background: 'var(--paper)' }} className="min-h-screen flex items-center justify-center px-6">
        <div className="max-w-md text-center">
          <p style={{ fontFamily: 'var(--font-heading)', color: 'var(--ink)' }} className="text-2xl font-semibold">
            You&apos;re submitted.
          </p>
          <p style={{ color: 'var(--stone)' }} className="mt-3 text-sm">
            We&apos;ll review and publish your listing within 48 hours.
          </p>
          <a href="/" style={{ color: '#a84530', fontFamily: 'var(--font-mono)' }} className="mt-6 inline-block text-sm hover:underline">
            ← Back to listings
          </a>
        </div>
      </main>
    )
  }

  return (
    <main style={{ background: 'var(--paper)' }} className="min-h-screen">
      <div className="mx-auto max-w-2xl px-6 py-14">
        <h1 style={{ fontFamily: 'var(--font-heading)', color: 'var(--ink)' }} className="text-3xl font-semibold">
          List your space. Reach Portland creatives.
        </h1>
        <p style={{ color: 'var(--stone)' }} className="mt-2 text-sm">
          Listing is free. We&apos;ll publish your space within 48 hours.
        </p>

        <form onSubmit={handleSubmit} className="mt-10 space-y-6">
          <div>
            <label style={{ color: 'var(--ink)' }} className="mb-1 block text-sm font-medium">Your name</label>
            <input name="host_name" required className="input" placeholder="Jane Smith" autoComplete="name" />
          </div>
          <div>
            <label style={{ color: 'var(--ink)' }} className="mb-1 block text-sm font-medium">Your email</label>
            <input name="email" type="email" required className="input" placeholder="you@example.com" autoComplete="email" inputMode="email" />
          </div>

          <div>
            <label style={{ color: 'var(--ink)' }} className="mb-1 block text-sm font-medium">Space title</label>
            <input name="title" required className="input" placeholder="Bright NE Portland Art Studio" />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label style={{ color: 'var(--ink)' }} className="mb-1 block text-sm font-medium">Space type</label>
              <select name="type" required className="input">
                <option value="">Select type</option>
                {TYPES.map((t) => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label style={{ color: 'var(--ink)' }} className="mb-1 block text-sm font-medium">Neighborhood</label>
              <input name="neighborhood" required className="input" placeholder="NE Portland" />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label style={{ color: 'var(--ink)' }} className="mb-1 block text-sm font-medium">Monthly price ($)</label>
              <input name="price" type="number" min="0" required className="input" placeholder="850" />
            </div>
            <div>
              <label style={{ color: 'var(--ink)' }} className="mb-1 block text-sm font-medium">Square footage (optional)</label>
              <input name="sq_ft" type="number" min="0" className="input" placeholder="400" />
            </div>
          </div>

          <div>
            <label style={{ color: 'var(--ink)' }} className="mb-1 block text-sm font-medium">Description</label>
            <textarea
              name="description"
              required
              minLength={50}
              rows={5}
              className="input resize-none"
              placeholder="Describe the space — natural light, ceiling height, access hours, what kind of work it's suited for..."
            />
          </div>

          <div>
            <p style={{ color: 'var(--ink)' }} className="mb-3 text-sm font-medium">Amenities</p>
            <div className="flex flex-wrap gap-2">
              {AMENITIES.map((a) => (
                <button
                  key={a}
                  type="button"
                  onClick={() => toggleAmenity(a)}
                  style={{
                    border: amenities.includes(a) ? '1px solid #a84530' : '1px solid var(--rule)',
                    background: amenities.includes(a) ? 'var(--surface)' : 'var(--paper)',
                    color: amenities.includes(a) ? '#a84530' : 'var(--ink)',
                    fontFamily: 'var(--font-mono)',
                  }}
                  className="px-3 py-1.5 text-xs transition-colors"
                >
                  {a}
                </button>
              ))}
            </div>
          </div>

          {status === 'error' && (
            <p style={{ border: '1px solid #8b2020', color: '#8b2020', fontFamily: 'var(--font-mono)' }} className="px-4 py-2 text-sm">
              {errorMsg}
            </p>
          )}

          <button
            type="submit"
            disabled={status === 'submitting'}
            style={{ width: '100%' }}
            className="btn-action py-3 text-sm font-medium"
          >
            {status === 'submitting' ? 'Submitting…' : 'Submit'}
          </button>
        </form>
      </div>
    </main>
  )
}
