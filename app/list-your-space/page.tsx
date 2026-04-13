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
      <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md text-center">
          <p className="text-3xl font-bold">You're submitted!</p>
          <p className="mt-3 text-gray-500">
            We'll review and publish your listing within 48 hours.
          </p>
          <a href="/" className="mt-6 inline-block text-sm text-blue-600 hover:underline">
            ← Back to listings
          </a>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-2xl px-4 py-12">
        <h1 className="text-3xl font-bold">List your studio</h1>
        <p className="mt-2 text-gray-500">
          Reach Portland creatives actively searching for space.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          {/* Tier selection */}
          <div>
            <p className="mb-3 font-semibold">Choose your listing tier</p>
            <div className="grid grid-cols-2 gap-4">
              {([
                { value: 'free', label: 'Free Listing', price: '$0', desc: 'Listed in directory. Published within 48 hours.' },
                { value: 'featured', label: 'Featured Listing', price: '$29/mo', desc: 'Pinned to top of category. Featured badge. Priority placement.' },
              ] as const).map((t) => (
                <button
                  key={t.value}
                  type="button"
                  onClick={() => setTier(t.value)}
                  className={`rounded-xl border p-4 text-left transition-colors ${
                    tier === t.value
                      ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-500'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <p className="font-semibold">{t.label}</p>
                  <p className="text-lg font-bold text-blue-600">{t.price}</p>
                  <p className="mt-1 text-xs text-gray-500">{t.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Contact info */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium">Your name</label>
              <input name="host_name" required className="input" placeholder="Jane Smith" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Email</label>
              <input name="email" type="email" required className="input" placeholder="jane@example.com" />
            </div>
          </div>

          {/* Space details */}
          <div>
            <label className="mb-1 block text-sm font-medium">Space title</label>
            <input name="title" required className="input" placeholder="Bright NE Portland Art Studio" />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium">Space type</label>
              <select name="type" required className="input">
                <option value="">Select type</option>
                {TYPES.map((t) => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Neighborhood</label>
              <input name="neighborhood" required className="input" placeholder="NE Portland" />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium">Monthly price ($)</label>
              <input name="price" type="number" min="0" required className="input" placeholder="850" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Square footage (optional)</label>
              <input name="sq_ft" type="number" min="0" className="input" placeholder="400" />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Description (min 100 characters)</label>
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
            <p className="mb-2 text-sm font-medium">Amenities</p>
            <div className="flex flex-wrap gap-2">
              {AMENITIES.map((a) => (
                <button
                  key={a}
                  type="button"
                  onClick={() => toggleAmenity(a)}
                  className={`rounded-full border px-3 py-1 text-sm transition-colors ${
                    amenities.includes(a)
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                  }`}
                >
                  {a}
                </button>
              ))}
            </div>
          </div>

          {/* Photo upload */}
          <div>
            <label className="mb-1 block text-sm font-medium">Photos (optional)</label>
            <input name="photos" type="file" accept="image/*" multiple className="text-sm text-gray-500" />
            <p className="mt-1 text-xs text-gray-400">Upload photos after submission via email.</p>
          </div>

          {status === 'error' && (
            <p className="rounded-lg bg-red-50 px-4 py-2 text-sm text-red-600">{errorMsg}</p>
          )}

          <button
            type="submit"
            disabled={status === 'submitting'}
            className="w-full rounded-lg bg-blue-600 py-3 font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
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
