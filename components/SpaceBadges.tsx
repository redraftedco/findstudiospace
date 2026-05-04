// SpaceBadges, shows GIS-derived location facts sourced from listing_enrichment.
// Rendered on listing detail pages when enrichment data exists. Each badge is
// a single structural fact a renter can't get from photos or a price tag.

type Enrichment = {
  zoning_base?: string | null
  airport_noise_dnl_band?: string | null
  fema_flood_zone?: string | null
  wildfire_hazard?: string | null
  landslide_hazard?: string | null
  parking_permit_zone?: string | null
  business_district?: string | null
  hri_listed?: boolean | null
  opportunity_zone?: boolean | null
  nearest_max_stop_id?: string | null
  dist_to_max_meters?: number | null
  nearest_bus_stop_id?: string | null
  dist_to_bus_meters?: number | null
}

type Props = { enrichment: Enrichment | null }

type Badge = {
  label: string
  detail: string
  tone: 'neutral' | 'warn' | 'good'
}

function metersToFeet(m: number): string {
  const ft = Math.round(m * 3.281)
  return ft < 5280 ? `${ft.toLocaleString()} ft` : `${(ft / 5280).toFixed(2)} mi`
}

function buildBadges(e: Enrichment): Badge[] {
  const badges: Badge[] = []

  if (e.zoning_base) {
    const zone = e.zoning_base.toUpperCase()
    const allowsKilns = /^(IG|IH|EG|EX|CE)/.test(zone)
    badges.push({
      label: 'Zoning',
      detail: zone + (allowsKilns ? ', kilns & industrial equipment permitted' : ''),
      tone: 'neutral',
    })
  }

  if (e.airport_noise_dnl_band) {
    const band = e.airport_noise_dnl_band
    if (band === 'gte68' || band === '65-68') {
      badges.push({
        label: 'Airport noise',
        detail: band === 'gte68' ? '≥68 DNL, in PDX noise overlay; glazing restrictions apply' : '65–68 DNL, moderate airport noise zone',
        tone: 'warn',
      })
    } else if (band === '55-65') {
      badges.push({ label: 'Airport noise', detail: '55–65 DNL, low-level noise overlay', tone: 'neutral' })
    }
  }

  if (e.fema_flood_zone) {
    const zone = (e.fema_flood_zone ?? '').toUpperCase()
    if (zone.startsWith('A') || zone.startsWith('V')) {
      badges.push({
        label: 'Flood zone',
        detail: `FEMA ${zone}, 100-year Special Flood Hazard Area; flood insurance likely required`,
        tone: 'warn',
      })
    } else if (zone === 'X' || zone === 'X500') {
      badges.push({ label: 'Flood zone', detail: 'Outside 100-year flood zone', tone: 'good' })
    }
  }

  if (e.wildfire_hazard && e.wildfire_hazard.toLowerCase() !== 'none') {
    badges.push({
      label: 'Wildfire hazard',
      detail: `${e.wildfire_hazard}, verify insurance coverage with landlord`,
      tone: 'warn',
    })
  }

  if (e.landslide_hazard && e.landslide_hazard.toLowerCase() !== 'none') {
    badges.push({
      label: 'Landslide hazard',
      detail: `DOGAMI ${e.landslide_hazard}, potential hillside stability concern`,
      tone: 'warn',
    })
  }

  if (e.parking_permit_zone) {
    badges.push({
      label: 'Parking',
      detail: `Zone ${e.parking_permit_zone} permit area, street parking restricted for non-permit holders`,
      tone: 'neutral',
    })
  }

  if (e.business_district) {
    badges.push({ label: 'Business district', detail: e.business_district, tone: 'neutral' })
  }

  if (e.hri_listed) {
    badges.push({
      label: 'Historic resource',
      detail: 'Portland Historic Resource Inventory, improvements may require BDS review',
      tone: 'warn',
    })
  }

  if (e.opportunity_zone) {
    badges.push({
      label: 'Opportunity zone',
      detail: 'Federal OZ census tract, potential tax incentives for qualifying investments',
      tone: 'good',
    })
  }

  if (e.nearest_max_stop_id && e.dist_to_max_meters != null) {
    const dist = metersToFeet(e.dist_to_max_meters)
    const tone = e.dist_to_max_meters <= 400 ? 'good' : 'neutral'
    badges.push({ label: 'MAX light rail', detail: `~${dist} to nearest MAX stop (approximate)`, tone })
  }

  if (e.nearest_bus_stop_id && e.dist_to_bus_meters != null && e.dist_to_bus_meters <= 200) {
    badges.push({
      label: 'Bus stop',
      detail: `~${metersToFeet(e.dist_to_bus_meters)} to nearest TriMet stop (approximate)`,
      tone: 'neutral',
    })
  }

  return badges
}

const TONE_STYLES: Record<Badge['tone'], { color: string; borderColor: string }> = {
  neutral: { color: 'var(--stone)',  borderColor: 'var(--rule)' },
  warn:    { color: '#b45309',       borderColor: '#fde68a' },
  good:    { color: '#166534',       borderColor: '#bbf7d0' },
}

export default function SpaceBadges({ enrichment }: Props) {
  if (!enrichment) return null
  const badges = buildBadges(enrichment)
  if (badges.length === 0) return null

  return (
    <section>
      <h2
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.6875rem',
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          color: 'var(--stone)',
          margin: '0 0 1rem',
        }}
      >
        Location data
      </h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {badges.map((badge) => {
          const styles = TONE_STYLES[badge.tone]
          return (
            <div
              key={badge.label}
              style={{
                display: 'flex',
                gap: '0.75rem',
                alignItems: 'flex-start',
                padding: '0.625rem 0.875rem',
                border: `1px solid ${styles.borderColor}`,
                borderRadius: '3px',
              }}
            >
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.625rem',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: styles.color,
                  minWidth: '110px',
                  paddingTop: '1px',
                  flexShrink: 0,
                }}
              >
                {badge.label}
              </span>
              <span
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.8125rem',
                  color: badge.tone === 'warn' ? '#92400e' : 'var(--ink)',
                  lineHeight: 1.4,
                }}
              >
                {badge.detail}
              </span>
            </div>
          )
        })}
      </div>
    </section>
  )
}
