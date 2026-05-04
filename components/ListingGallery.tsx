'use client'

import { useState } from 'react'

type Props = {
  images: string[]
  title: string
  neighborhood: string
}

export default function ListingGallery({ images, title, neighborhood }: Props) {
  const [activeIndex, setActiveIndex] = useState(0)
  const heroAlt = `${title} studio in ${neighborhood}, Portland`

  if (images.length === 0) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src="/placeholder-studio.svg"
        alt=""
        width={1200}
        height={675}
        style={{
          width: '100%',
          aspectRatio: '16 / 9',
          objectFit: 'cover',
          display: 'block',
          borderRadius: '2px',
        }}
      />
    )
  }

  return (
    <>
      {/* Hero, updates on thumbnail hover */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={images[activeIndex]}
        alt={heroAlt}
        width={1200}
        height={675}
        fetchPriority="high"
        loading="eager"
        style={{
          width: '100%',
          aspectRatio: '16 / 9',
          objectFit: 'cover',
          display: 'block',
          borderRadius: '2px',
        }}
      />

      {/* Thumbnails, all images including first so user can hover back */}
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
              style={{
                width: '100%',
                aspectRatio: '4 / 3',
                objectFit: 'cover',
                display: 'block',
                borderRadius: '2px',
                cursor: 'pointer',
                outline: i === activeIndex
                  ? '2px solid var(--action)'
                  : '2px solid transparent',
                outlineOffset: '-2px',
              }}
            />
          ))}
        </div>
      )}
    </>
  )
}
