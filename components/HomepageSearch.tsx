'use client'

import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'

const CITIES = [
  { slug: 'portland', label: 'Portland, OR' },
  { slug: 'seattle', label: 'Seattle, WA' },
  { slug: 'atlanta', label: 'Atlanta, GA' },
]

export default function HomepageSearch() {
  const router = useRouter()
  const [city, setCity] = useState('portland')
  const [q, setQ] = useState('')

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const query = q.trim()
    router.push(query ? `/${city}?q=${encodeURIComponent(query)}` : `/${city}`)
  }

  return (
    <form onSubmit={handleSubmit} style={{ width: '100%' }}>
      <div style={{
        display: 'flex',
        border: '1px solid var(--rule-strong)',
        background: 'var(--search-bg)',
        marginBottom: '12px',
      }}>
        <label htmlFor="homepage-search-q" className="sr-only">Search studios</label>
        <input
          id="homepage-search-q"
          type="text"
          value={q}
          onChange={e => setQ(e.target.value)}
          placeholder="Photo studio, art room, workshop…"
          style={{
            flex: 1,
            border: 'none',
            background: 'transparent',
            color: 'var(--ink)',
            fontFamily: 'var(--font-body)',
            fontSize: '1rem',
            padding: '14px 16px',
            outline: 'none',
            minHeight: '52px',
            minWidth: 0,
          }}
        />

        <div style={{ width: '1px', background: 'var(--rule)', margin: '10px 0', flexShrink: 0 }} />

        <label htmlFor="homepage-search-city" className="sr-only">Select city</label>
        <select
          id="homepage-search-city"
          value={city}
          onChange={e => setCity(e.target.value)}
          style={{
            border: 'none',
            background: 'transparent',
            color: 'var(--ink)',
            fontFamily: 'var(--font-body)',
            fontSize: '0.875rem',
            padding: '14px 36px 14px 14px',
            outline: 'none',
            cursor: 'pointer',
            flexShrink: 0,
            appearance: 'none',
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6'%3E%3Cpath d='M0 0l5 6 5-6z' fill='%23595959'/%3E%3C/svg%3E")`,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'right 12px center',
          }}
        >
          {CITIES.map(c => (
            <option key={c.slug} value={c.slug}>{c.label}</option>
          ))}
        </select>
      </div>

      <button
        type="submit"
        className="btn-action"
        style={{
          width: '100%',
          padding: '13px',
          fontFamily: 'var(--font-body)',
          fontSize: '0.9375rem',
          fontWeight: 500,
          border: 'none',
          cursor: 'pointer',
        }}
      >
        Search studios →
      </button>
    </form>
  )
}
