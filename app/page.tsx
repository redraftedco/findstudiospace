'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://vnjsczhqhnzrplrdkolb.supabase.co',
  'sb_publishable_BNjt2IcsKgSqatPUGKIghg_PJLJpQMF'
)

export default function Home() {
  const [listings, setListings] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchListings() {
      const { data } = await supabase.from('listings').select('*').limit(50)
      setListings(data || [])
      setLoading(false)
    }
    fetchListings()
  }, [])

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Portland Studios</h1>
      {loading ? <p>Loading...</p> : (
        <div className="grid gap-4">
          {listings.map(l => (
            <div key={l.id} className="border p-4">
              <h3 className="font-bold">{l.title}</h3>
              <p>{l.price_display}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}