'use client'

import { useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import posthog from 'posthog-js'

export default function UTMCapture() {
  const searchParams = useSearchParams()

  useEffect(() => {
    const utmSource = searchParams.get('utm_source')
    if (utmSource === 'cold_email') {
      posthog.capture('email_link_clicked', {
        utm_source: utmSource,
        utm_medium: searchParams.get('utm_medium'),
        utm_campaign: searchParams.get('utm_campaign'),
      })
    }
  }, [searchParams])

  return null
}
