// components/PartnerSites.tsx
// Displays related directory sites in the footer.
// This creates the cross-linking cluster effect that
// builds authority across all three directories.

const PARTNER_SITES = [
  {
    id: 'portlandarchitecturalsalvage',
    name: 'Portland Architectural Salvage',
    url: 'https://portlandarchitecturalsalvage.com',
    description: 'Reclaimed building materials and salvage yards',
    status: 'coming-soon',
  },
  {
    id: 'portlandhardwareid',
    name: 'Portland Hardware ID',
    url: 'https://portlandhardwareid.com',
    description: 'Identify and source antique hardware',
    status: 'coming-soon',
  },
]

export function PartnerSites() {
  const comingSoon = PARTNER_SITES.filter(s => s.status === 'coming-soon')

  if (comingSoon.length === 0) return null

  return (
    <div className="partner-sites-footer">
      <p className="partner-sites-label">Also from this network:</p>
      <div className="partner-sites-list">
        {comingSoon.map((site) => (
          <div key={site.id} className="partner-site-item">
            <span className="partner-site-name">{site.name}</span>
            <span className="partner-site-desc">{site.description}</span>
            <span className="partner-site-badge">Coming soon</span>
          </div>
        ))}
      </div>
    </div>
  )
}
