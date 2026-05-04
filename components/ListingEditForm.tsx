'use client'

import { useState } from 'react'

interface Props {
  listingId: number
  initialDescription: string
  initialContactEmail: string
  initialContactPhone: string
}

const INPUT_STYLE: React.CSSProperties = {
  display: 'block',
  width: '100%',
  padding: '10px 12px',
  border: '1px solid var(--rule)',
  fontFamily: 'var(--font-body)',
  fontSize: '14px',
  background: 'var(--search-bg)',
  color: 'var(--ink)',
  boxSizing: 'border-box',
  outline: 'none',
}

const LABEL_STYLE: React.CSSProperties = {
  display: 'block',
  fontFamily: 'var(--font-mono)',
  fontSize: '11px',
  color: 'var(--stone)',
  textTransform: 'uppercase',
  letterSpacing: '0.08em',
  marginBottom: '6px',
}

export default function ListingEditForm({ listingId, initialDescription, initialContactEmail, initialContactPhone }: Props) {
  const [description, setDescription] = useState(initialDescription)
  const [contactEmail, setContactEmail] = useState(initialContactEmail)
  const [contactPhone, setContactPhone] = useState(initialContactPhone)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSave() {
    setSaving(true)
    setSaved(false)
    setError(null)
    try {
      const res = await fetch(`/api/listings/${listingId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description, contact_email: contactEmail, contact_phone: contactPhone }),
      })
      const data = await res.json() as { ok?: boolean; error?: string }
      if (!res.ok) { setError(data.error ?? 'Save failed'); return }
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch {
      setError('Save failed. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      <p style={{ fontFamily: 'var(--font-heading)', fontSize: '16px', fontWeight: 600, color: 'var(--ink)', margin: '0 0 20px' }}>
        Listing details
      </p>

      <div style={{ marginBottom: '16px' }}>
        <label style={LABEL_STYLE}>Description</label>
        <textarea
          value={description}
          onChange={e => setDescription(e.target.value)}
          rows={6}
          maxLength={5000}
          style={{ ...INPUT_STYLE, resize: 'vertical', lineHeight: 1.6 }}
        />
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--stone)', margin: '4px 0 0' }}>
          {description.length}/5000
        </p>
      </div>

      <div style={{ marginBottom: '16px' }}>
        <label style={LABEL_STYLE}>Contact email</label>
        <input
          type="email"
          value={contactEmail}
          onChange={e => setContactEmail(e.target.value)}
          style={INPUT_STYLE}
        />
      </div>

      <div style={{ marginBottom: '20px' }}>
        <label style={LABEL_STYLE}>Contact phone</label>
        <input
          type="tel"
          value={contactPhone}
          onChange={e => setContactPhone(e.target.value)}
          style={INPUT_STYLE}
        />
      </div>

      {error && (
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--action)', margin: '0 0 12px' }}>{error}</p>
      )}

      <button
        onClick={handleSave}
        disabled={saving}
        className="btn-action"
        style={{
          padding: '10px 20px',
          fontFamily: 'var(--font-body)',
          fontSize: '14px',
          fontWeight: 500,
          border: 'none',
          cursor: saving ? 'not-allowed' : 'pointer',
          opacity: saving ? 0.7 : 1,
        }}
      >
        {saving ? 'Saving…' : saved ? 'Saved ✓' : 'Save changes'}
      </button>
    </div>
  )
}
