'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

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

type Tier = 'free' | 'featured'

export default function ListYourSpacePage() {
  const router = useRouter()
  const [tier, setTier] = useState<Tier>('free')
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
      price_display: get('price') ? `$${get('price')}/mo` : null,
      niche_attributes: {
        sq_ft: get('sq_ft') || null,
        ...Object.fromEntries(AMENITIES.map((a) => [a.toLowerCase().replace(/\s+/g, '_'), amenities.includes(a)])),
      },
      description: get('description'),
      tier,
    }

    try {
      if (tier === 'free') {
        const res = await fetch('/api/submit-listing', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
        const json = await res.json()
        if (!json.success) throw new Error(json.error ?? 'Submission failed')
        setStatus('success')
      } else {
        const res = await fetch('/api/create-checkout-session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: payload.email, listing_data: payload }),
        })
        const json = await res.json()
        if (!json.url) throw new Error(json.error ?? 'Could not start checkout')
        router.push(json.url)
      }
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Something went wrong.')
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <main style={{ background: '#f4f1eb' }} className="min-h-screen flex items-center justify-center px-6">
        <div className="max-w-md text-center">
          <p style={{ fontFamily: 'var(--font-heading)', color: '#1a1814' }} className="text-3xl font-semibold">
            You&apos;re submitted.
          </p>
          <p style={{ color: '#8c8680' }} className="mt-3 text-sm">
            We&apos;ll review and publish your listing within 48 hours.
          </p>
          <a href="/" style={{ color: '#2c4a3e', fontFamily: 'var(--font-mono)' }} className="mt-6 inline-block text-sm hover:underline">
            ← Back to listings
          </a>
        </div>
      </main>
    )
  }

  return (
    <main style={{ background: '#f4f1eb' }} className="min-h-screen">
      <div className="mx-auto max-w-2xl px-6 py-14">
        <h1 style={{ fontFamily: 'var(--font-heading)', color: '#1a1814' }} className="text-3xl font-semibold">
          Reach Portland&apos;s creative community.
        </h1>
        <p style={{ color: '#8c8680' }} className="mt-2 text-sm">
          List your space and connect with artists, makers, and professionals searching right now.
        </p>

        <form onSubmit={handleSubmit} className="mt-10 space-y-7">
          {/* Tier selection */}
          <div>
            <p style={{ color: '#1a1814' }} className="mb-3 text-sm font-medium">Choose your listing tier</p>
            <div className="grid grid-cols-2 gap-4">
              {([
                { value: 'free', label: 'Free Listing', price: '$0', desc: 'Listed in directory. Published within 48 hours.' },
                { value: 'featured', label: 'Featured', price: '$29/mo', desc: 'Pinned to top. Featured badge. Priority placement.' },
              ] as const).map((t) => (
                <button
                  key={t.value}
                  type="button"
                  onClick={() => setTier(t.value)}
                  style={{
                    border: tier === t.value ? '2px solid #2c4a3e' : '1px solid #d6d0c4',
                    background: tier === t.value ? '#edeae2' : '#f4f1eb',
                    textAlign: 'left',
                  }}
                  className="p-4 transition-colors"
                >
                  <p style={{ color: '#1a1814', fontFamily: 'var(--font-heading)' }} className="font-semibold">{t.label}</p>
                  <p style={{ fontFamily: 'var(--font-mono)', color: t.value === 'featured' ? '#b8860b' : '#1a1814' }} className="text-lg font-medium">
                    {t.price}
                  </p>
                  <p style={{ color: '#8c8680' }} className="mt-1 text-xs">{t.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label style={{ color: '#1a1814' }} className="mb-1 block text-sm font-medium">Your name</label>
              <input name="host_name" required className="input" placeholder="Jane Smith" />
            </div>
            <div>
              <label style={{ color: '#1a1814' }} className="mb-1 block text-sm font-medium">Email</label>
              <input name="email" type="email" required className="input" placeholder="jane@example.com" />
            </div>
          </div>

          {/* Space details */}
          <div>
            <label style={{ color: '#1a1814' }} className="mb-1 block text-sm font-medium">Space title</label>
            <input name="title" required className="input" placeholder="Bright NE Portland Art Studio" />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label style={{ color: '#1a1814' }} className="mb-1 block text-sm font-medium">Space type</label>
              <select name="type" required className="input">
                <option value="">Select type</option>
                {TYPES.map((t) => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label style={{ color: '#1a1814' }} className="mb-1 block text-sm font-medium">Neighborhood</label>
              <input name="neighborhood" required className="input" placeholder="NE Portland" />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label style={{ color: '#1a1814' }} className="mb-1 block text-sm font-medium">Monthly price ($)</label>
              <input name="price" type="number" min="0" required className="input" placeholder="850" />
            </div>
            <div>
              <label style={{ color: '#1a1814' }} className="mb-1 block text-sm font-medium">Square footage (optional)</label>
              <input name="sq_ft" type="number" min="0" className="input" placeholder="400" />
            </div>
          </div>

          <div>
            <label style={{ color: '#1a1814' }} className="mb-1 block text-sm font-medium">Description (min 100 characters)</label>
            <textarea
              name="description"
              required
              minLength={100}
              rows={5}
              className="input resize-none"
              placeholder="Describe the space — natural light, ceiling height, who it's good for, access hours..."
            />
          </div>

          {/* Amenities */}
          <div>
            <p style={{ color: '#1a1814' }} className="mb-3 text-sm font-medium">Amenities</p>
            <div className="flex flex-wrap gap-2">
              {AMENITIES.map((a) => (
                <button
                  key={a}
                  type="button"
                  onClick={() => toggleAmenity(a)}
                  style={{
                    border: amenities.includes(a) ? '1px solid #2c4a3e' : '1px solid #d6d0c4',
                    background: amenities.includes(a) ? '#edeae2' : '#f4f1eb',
                    color: amenities.includes(a) ? '#2c4a3e' : '#1a1814',
                    fontFamily: 'var(--font-mono)',
                  }}
                  className="px-3 py-1.5 text-xs transition-colors"
                >
                  {a}
                </button>
              ))}
            </div>
          </div>

          {/* Photos */}
          <div>
            <label style={{ color: '#1a1814' }} className="mb-1 block text-sm font-medium">Photos (optional)</label>
            <input name="photos" type="file" accept="image/*" multiple style={{ color: '#8c8680' }} className="text-sm" />
            <p style={{ color: '#8c8680' }} className="mt-1 text-xs">Upload photos after submission via email.</p>
          </div>

          {status === 'error' && (
            <p style={{ border: '1px solid #8b2020', color: '#8b2020', fontFamily: 'var(--font-mono)' }} className="px-4 py-2 text-sm">
              {errorMsg}
            </p>
          )}

          <button
            type="submit"
            disabled={status === 'submitting'}
            style={{ background: '#2c4a3e', color: '#f4f1eb', width: '100%', fontFamily: 'var(--font-body)' }}
            className="py-3 font-medium hover:opacity-90 disabled:opacity-50"
          >
            {status === 'submitting'
              ? 'Submitting…'
              : tier === 'featured'
              ? 'Continue to payment →'
              : 'Submit free listing'}
          </button>
        </form>
      </div>
    </main>
  )
}
