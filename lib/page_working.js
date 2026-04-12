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
    fetchListings()
  }, [])

  async function fetchListings() {
    const { data } = await supabase
      .from('listings')
      .select('*')
      .eq('status', 'active')
      .limit(50)
    
    setListings(data || [])
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold">Portland Studios</h1>
          <p className="text-gray-600">Find your perfect creative workspace</p>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {loading ? (
          <p className="text-center">Loading...</p>
        ) : (
          <>
            <p className="mb-4">{listings.length} studios found</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {listings.map((listing) => (
                <div key={listing.id} className="bg-white rounded-lg shadow p-6">
                  <h3 className="font-bold mb-2">{listing.title}</h3>
                  {listing.price_display && (
                    <p className="text-blue-600 mb-2">{listing.price_display}</p>
                  )}
                  {listing.neighborhood && (
                    <p className="text-sm mb-2">📍 {listing.neighborhood}</p>
                  )}
                  {listing.external_url && (
                    <a href={listing.external_url} target="_blank" className="text-blue-600 text-sm">
                      View Details →
                    </a>
                  )}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
