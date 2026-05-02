'use client'

import { useState, useEffect, useCallback, useRef } from 'react'

type Props = {
  images: string[]
  title: string
  neighborhood: string
}

export default function ListingGallery({ images, title, neighborhood }: Props) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(0)
  const touchStartX = useRef<number | null>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const heroAlt = `${title} studio in ${neighborhood}, Portland`

  const openLightbox = useCallback((index: number) => {
    setLightboxIndex(index)
    setLightboxOpen(true)
    document.body.style.overflow = 'hidden'
  }, [])

  const closeLightbox = useCallback(() => {
    setLightboxOpen(false)
    document.body.style.overflow = ''
  }, [])

  const goNext = useCallback(() => {
    setLightboxIndex((i) => (i + 1) % images.length)
  }, [images.length])

  const goPrev = useCallback(() => {
    setLightboxIndex((i) => (i - 1 + images.length) % images.length)
  }, [images.length])

  // Keyboard navigation and escape
  useEffect(() => {
    if (!lightboxOpen) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeLightbox()
      if (e.key === 'ArrowRight') goNext()
      if (e.key === 'ArrowLeft') goPrev()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [lightboxOpen, closeLightbox, goNext, goPrev])

  // Focus close button when lightbox opens (accessibility)
  useEffect(() => {
    if (lightboxOpen) closeButtonRef.current?.focus()
  }, [lightboxOpen])

  // Clean up overflow lock if component unmounts while open
  useEffect(() => {
    return () => { document.body.style.overflow = '' }
  }, [])

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return
    const delta = e.changedTouches[0].clientX - touchStartX.current
    touchStartX.current = null
    if (Math.abs(delta) < 50) return
    if (delta < 0) goNext()
    else goPrev()
  }

  if (images.length === 0) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src="/placeholder-studio.svg"
        alt=""
        width={1200}
        height={675}
        style={{ width: '100%', aspectRatio: '16 / 9', objectFit: 'cover', display: 'block', borderRadius: '2px' }}
      />
    )
  }

  return (
    <>
      {/* Hero — hover thumbnail to preview, click to open lightbox */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={images[activeIndex]}
        alt={heroAlt}
        width={1200}
        height={675}
        fetchPriority="high"
        loading="eager"
        onClick={() => openLightbox(activeIndex)}
        style={{
          width: '100%',
          aspectRatio: '16 / 9',
          objectFit: 'cover',
          display: 'block',
          borderRadius: '2px',
          cursor: 'zoom-in',
        }}
      />

      {/* Thumbnails */}
      {images.length > 1 && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '0.5rem',
            marginTop: '0.5rem',
          }}
        >
          {images.map((src, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={i}
              src={src}
              alt=""
              width={300}
              height={225}
              loading="lazy"
              onMouseEnter={() => setActiveIndex(i)}
              onClick={() => openLightbox(i)}
              style={{
                width: '100%',
                aspectRatio: '4 / 3',
                objectFit: 'cover',
                display: 'block',
                borderRadius: '2px',
                cursor: 'zoom-in',
                outline: i === activeIndex ? '2px solid var(--action)' : '2px solid transparent',
                outlineOffset: '-2px',
              }}
            />
          ))}
        </div>
      )}

      {/* Lightbox overlay */}
      {lightboxOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Photo gallery"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            background: 'rgba(10, 10, 10, 0.97)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {/* Top bar: counter + close */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '20px 24px',
              zIndex: 1,
            }}
          >
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '12px',
                color: 'rgba(255,255,255,0.55)',
                letterSpacing: '0.1em',
              }}
            >
              {lightboxIndex + 1} / {images.length}
            </span>
            <button
              ref={closeButtonRef}
              onClick={closeLightbox}
              aria-label="Close photo gallery"
              style={{
                background: 'none',
                border: 'none',
                color: 'rgba(255,255,255,0.7)',
                fontSize: '28px',
                lineHeight: 1,
                cursor: 'pointer',
                padding: '4px 8px',
                fontFamily: 'sans-serif',
                fontWeight: 300,
              }}
            >
              ×
            </button>
          </div>

          {/* Prev arrow */}
          {images.length > 1 && (
            <button
              onClick={goPrev}
              aria-label="Previous photo"
              style={{
                position: 'absolute',
                left: '16px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255,255,255,0.12)',
                color: 'rgba(255,255,255,0.8)',
                width: '44px',
                height: '44px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                fontSize: '20px',
                zIndex: 1,
              }}
            >
              ‹
            </button>
          )}

          {/* Main image */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            key={lightboxIndex}
            src={images[lightboxIndex]}
            alt={`${heroAlt} — photo ${lightboxIndex + 1}`}
            style={{
              maxWidth: '90vw',
              maxHeight: '80vh',
              objectFit: 'contain',
              display: 'block',
              userSelect: 'none',
              WebkitUserDrag: 'none',
            } as React.CSSProperties}
          />

          {/* Next arrow */}
          {images.length > 1 && (
            <button
              onClick={goNext}
              aria-label="Next photo"
              style={{
                position: 'absolute',
                right: '16px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255,255,255,0.12)',
                color: 'rgba(255,255,255,0.8)',
                width: '44px',
                height: '44px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                fontSize: '20px',
                zIndex: 1,
              }}
            >
              ›
            </button>
          )}

          {/* Thumbnail strip */}
          {images.length > 1 && (
            <div
              style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                display: 'flex',
                justifyContent: 'center',
                gap: '6px',
                padding: '16px 24px',
                overflowX: 'auto',
                background: 'linear-gradient(to top, rgba(10,10,10,0.8) 0%, transparent 100%)',
              }}
            >
              {images.map((src, i) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={i}
                  src={src}
                  alt=""
                  onClick={() => setLightboxIndex(i)}
                  style={{
                    width: '56px',
                    height: '42px',
                    objectFit: 'cover',
                    cursor: 'pointer',
                    flexShrink: 0,
                    outline: i === lightboxIndex
                      ? '2px solid #D4F542'
                      : '2px solid transparent',
                    outlineOffset: '1px',
                    opacity: i === lightboxIndex ? 1 : 0.5,
                    transition: 'opacity 150ms, outline-color 150ms',
                  }}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </>
  )
}
