'use client'

import { useRef, useState } from 'react'

interface Props {
  listingId: number
  initialPhotos: string[]
}

export default function PhotoManager({ listingId, initialPhotos }: Props) {
  const [photos, setPhotos] = useState<string[]>(initialPhotos)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [dragOver, setDragOver] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  async function uploadFile(file: File) {
    setUploading(true)
    setError(null)
    const form = new FormData()
    form.append('photo', file)
    try {
      const res = await fetch(`/api/listings/${listingId}/photos`, { method: 'POST', body: form })
      const data = await res.json() as { url?: string; error?: string }
      if (!res.ok) { setError(data.error ?? 'Upload failed'); return }
      if (data.url) setPhotos(prev => [...prev, data.url!])
    } catch {
      setError('Upload failed. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  async function removePhoto(url: string) {
    const res = await fetch(`/api/listings/${listingId}/photos`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url }),
    })
    if (res.ok) setPhotos(prev => prev.filter(u => u !== url))
  }

  function onFiles(files: FileList | null) {
    if (!files || files.length === 0) return
    Array.from(files).forEach(uploadFile)
  }

  return (
    <div>
      <p style={{ fontFamily: 'var(--font-heading)', fontSize: '16px', fontWeight: 600, color: 'var(--ink)', margin: '0 0 8px' }}>
        Photos
      </p>
      <p style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: 'var(--stone)', margin: '0 0 16px', lineHeight: 1.5 }}>
        JPEG, PNG, or WebP · 10 MB max per photo. Drag and drop or click to select.
      </p>

      {/* Drop zone */}
      <div
        role="button"
        tabIndex={0}
        onClick={() => inputRef.current?.click()}
        onKeyDown={e => e.key === 'Enter' && inputRef.current?.click()}
        onDragOver={e => { e.preventDefault(); setDragOver(true) }}
        onDragLeave={() => setDragOver(false)}
        onDrop={e => { e.preventDefault(); setDragOver(false); onFiles(e.dataTransfer.files) }}
        style={{
          border: `2px dashed ${dragOver ? 'var(--action)' : 'var(--rule)'}`,
          background: dragOver ? 'rgba(0,0,0,0.02)' : 'var(--surface)',
          padding: '32px',
          textAlign: 'center',
          cursor: 'pointer',
          marginBottom: '16px',
          transition: 'border-color 0.15s',
        }}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          style={{ display: 'none' }}
          onChange={e => onFiles(e.target.files)}
        />
        {uploading ? (
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--stone)', margin: 0 }}>Uploading…</p>
        ) : (
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--stone)', margin: 0, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Drop photos here or click to select
          </p>
        )}
      </div>

      {error && (
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--action)', margin: '0 0 12px' }}>{error}</p>
      )}

      {/* Photo grid */}
      {photos.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
          {photos.map(url => (
            <div key={url} style={{ position: 'relative', aspectRatio: '4/3', overflow: 'hidden', border: '1px solid var(--rule)' }}>
              <img src={url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
              <button
                onClick={() => removePhoto(url)}
                style={{
                  position: 'absolute', top: '4px', right: '4px',
                  background: 'rgba(0,0,0,0.6)', color: '#fff',
                  border: 'none', width: '22px', height: '22px',
                  fontSize: '14px', lineHeight: 1, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
                aria-label="Remove photo"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      {photos.length === 0 && !uploading && (
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--stone)', textTransform: 'uppercase', letterSpacing: '0.08em', margin: 0 }}>
          No photos yet
        </p>
      )}
    </div>
  )
}
