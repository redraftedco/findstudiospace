// PreLeaseChecklist — category-specific "forgotten viewing questions" from the
// build-out research. Converts before signing.

type Props = { studioType: string }

type Item = { q: string; why: string }

const CHECKLISTS: Record<string, Item[]> = {
  photo: [
    { q: 'What is the clear ceiling height to the lowest obstruction (beam, duct, or lighting grid)?', why: 'Below 12 ft forces low-angle shots; 14–18 ft is mid-tier commercial standard.' },
    { q: 'Are there structural columns in the shooting area?', why: 'Columns break clean infinity setups and force awkward camera positions.' },
    { q: 'What is the door or loading clearance for a Genie lift or large equipment?', why: 'Production rigs and scissor lifts need ≥12 ft clearance to move inside.' },
    { q: 'Is the electrical service 3-phase? What is the total amperage and how much is dedicated to production equipment?', why: 'Full production lighting (strobes, HMIs, motion control) draws 100–200A; sharing one circuit with HVAC causes breaker trips mid-shoot.' },
    { q: 'Is there a cyclorama wall? Who pays to repaint it between rentals?', why: 'Scuff/paint costs are a common surprise lease clause — get it in writing.' },
    { q: 'Can I access the roof or skylights? Does the HVAC compressor run during shoots (vibration/noise)?', why: 'Natural-light rooftop access adds significant day-rate value; HVAC noise ruins audio sync.' },
  ],
  art: [
    { q: 'What is the exhaust CFM and where does it discharge?', why: 'Spray finishing requires ventilation to 25% LEL per OSHA 29 CFR 1910.94; insufficient exhaust is a lease-breaker in winter.' },
    { q: 'Is there make-up air? What happens to heat/cool balance when you open the exhaust?', why: 'Make-up air prevents negative pressure that pulls dust and fumes back in; without it, winter heating costs are extreme.' },
    { q: 'Will the landlord allow a flammable-storage cabinet?', why: 'Most office leases prohibit them; industrial leases must explicitly allow it for solvent painters.' },
    { q: 'What is the floor — sealed concrete with a drain, epoxy, or bare concrete?', why: 'Bare concrete absorbs solvents and becomes a hazmat issue; drains are required for rinsing spray equipment.' },
    { q: 'Are the sprinklers rated for combustible-liquid load?', why: 'Standard sprinklers are insufficient for solvent-heavy environments — verify with Fire & Rescue.' },
  ],
  workshop: [
    { q: 'What voltage and phase is the panel — 208V 3-phase or 240V single-phase?', why: 'Most US studio kilns and large dust collectors are designed for 240V/1P; running them on 208V reduces capacity and burns elements faster.' },
    { q: 'Where is the dust collector located, and how is it vented?', why: 'NFPA 664 (Ch. 24) generally requires combustible-dust collectors to be exterior-mounted; an interior cyclone is a code violation waiting to happen.' },
    { q: 'What is the floor load rating in lbs/sq ft?', why: 'Industrial kilns and large CNC routers can exceed 200 lbs/sq ft; most office floors are rated 50–80 lbs/sq ft.' },
    { q: 'Does the lease allow welding? Is there a hot-work permit process?', why: 'Most commercial leases prohibit welding without a Welding & Hot Work Permit (Portland Fire & Rescue Form 302.00).' },
    { q: 'Is the kiln room separately vented with a downdraft system?', why: 'Kiln off-gassing (sulfur, fluorine, wax) requires dedicated ventilation — a shared HVAC system will contaminate the whole building.' },
  ],
  music: [
    { q: 'Has the STC (Sound Transmission Class) of the walls been independently measured?', why: 'A standard 2×4 stud wall is STC ~33. You need STC 55+ for rehearsal, STC 65+ for true recording isolation.' },
    { q: 'Is the slab a floating slab, or is it directly tied to adjacent units?', why: 'A tied slab transmits low-frequency impact noise (kick drum, bass) regardless of wall mass — no amount of foam panels fixes this.' },
    { q: 'Is the HVAC ducted with lined flex duct and silencers, or bare sheet metal?', why: 'Unlined sheet metal ducts carry HVAC noise directly into the room and add 15–20 dB of ambient noise.' },
    { q: 'Are there shared mechanical chases between units?', why: 'Shared chases are flanking paths that bypass wall isolation entirely.' },
    { q: 'What is the measured noise floor in the room in dBA (not dB SPL)?', why: 'A target of NC-25 is the minimum for professional rehearsal; NC-15 to NC-20 for recording.' },
  ],
  podcast: [
    { q: 'What is the measured noise floor in dBA? Does the host have a measurement certificate?', why: 'Foam panels reduce reverb (NRC) but do not block noise (STC) — the bus stop outside will bleed through if isolation is insufficient.' },
    { q: 'What is the upload speed (not download), and is it metered or throttled?', why: 'Live streaming and remote recording sessions need sustained upload; many "gigabit" building connections are asymmetric.' },
    { q: 'Can the HVAC be switched to a low-noise or fan-off mode during sessions?', why: 'HVAC fan noise is the most common continuous-noise complaint in podcast recordings.' },
    { q: 'Is the acoustic treatment on the walls actual absorption panels, or decorative foam? What is the RT60?', why: 'Decorative foam (thin <2 in.) only kills highs; broadband absorption needs 4 in. thick panels or thicker to control 250 Hz and below.' },
  ],
  fitness: [
    { q: 'Is the floor a true floating sprung floor, or laminate over plywood over slab?', why: '"Air everywhere; no direct contact to concrete" is the test phrase. Anything directly over concrete transmits impact and causes injury for high-impact workouts.' },
    { q: 'What is the HVAC tonnage, and is it sized for full-capacity class occupancy (approx. 2,500–3,000 BTU/hr per person)?', why: 'A 30-person fitness class generates ~75,000–90,000 BTU/hr — most office HVAC units cannot handle this.' },
    { q: 'Does the floor meet DIN 18032-2 for shock absorption and area deflection?', why: 'This is the minimum standard for dance studios and fitness spaces to reduce chronic ankle and knee injury.' },
    { q: 'Are the mirror walls tempered or laminated safety glass?', why: 'Standard plate glass mirrors in fitness spaces are a liability — one errant barbell breaks them into razor shards.' },
    { q: 'Is the space ADA-compliant — 36 in. accessible route, accessible restroom, 60 in. turning radius?', why: 'Fitness studios are places of public accommodation under ADA Title III; non-compliance is a legal liability.' },
  ],
  office: [
    { q: 'What is the electrical power density in watts per square foot, and can it support dual 4K monitor setups per seat?', why: 'Modern creative offices draw 3–5 W/sq ft continuous; older Portland buildings deliver 1–2 W/sq ft, causing breaker trips under full occupancy.' },
    { q: 'Who are the fiber providers in the building — not just "internet available"?', why: '"Internet available" often means a single 100 Mbps shared line; a creative studio running render farms needs dedicated symmetric fiber.' },
    { q: 'Is the electric submetered, or shared across the floor?', why: 'Shared metering means you pay proportionally for neighbors\' usage — submetered spaces let you track and control your actual consumption.' },
    { q: 'What is the common-path-of-travel distance to an egress exit?', why: 'IBC caps this at 100 ft for business occupancy; verify you are not in a dead-end corridor configuration.' },
  ],
  retail: [
    { q: 'What is the current Certificate of Occupancy and what use group does it authorize?', why: 'Converting from office to retail (Group M) triggers a change-of-use permit; converting to food service may require a grease interceptor — costs you bear.' },
    { q: 'Is there a grease interceptor, and what is its capacity?', why: 'Any food prep requires a grease interceptor per Portland Plumbing Code — retrofitting one can cost $10,000–$30,000.' },
    { q: 'What is the Tenant Improvement Allowance (TIA) in dollars per square foot?', why: 'Portland retail TIA ranges from $0 to $60/sq ft; without TIA, tenant bears full fit-out cost for Portland sign code–compliant signage and accessibility upgrades.' },
    { q: 'How much sign area is allowed under Title 32? Is there an A-frame/portable sign permit?', why: 'Portland allows 1.5 sq ft of sign per linear foot of primary building wall; portable signs require separate registration.' },
  ],
  event: [
    { q: 'Is the building sprinklered? What is the C of O occupant load?', why: 'Portland Fire & Rescue caps non-sprinklered, non-assembly buildings at 100 occupants; a 200-person event in a non-sprinklered warehouse is an immediate fire code violation.' },
    { q: 'What permits are required for events above 49 people, and what is the lead time?', why: 'PF&R Form 300.08APP requires 21-day advance notice for any event with 49+ persons in a non-assembly building.' },
    { q: 'Are there two independent egress paths visible from every point in the space?', why: 'IBC §1006 requires two exits; a single exit church-converted-to-event-space is a code problem that cannot be waived.' },
    { q: 'Does any liquor service require an OLCC distance-to-school check?', why: 'OLCC licenses require the premises to be ≥150 ft from a school — measure from the nearest property line, not the building.' },
  ],
  makerspace: [
    { q: 'Has a Dust Hazard Analysis (DHA) been completed per NFPA 652?', why: 'Any makerspace with woodworking or metalworking is legally required to have a DHA; without one, the operator and potentially the landlord are in violation.' },
    { q: 'Is the dust collector exterior-mounted, or inside the building?', why: 'NFPA 664 generally requires combustible-dust collectors exterior to the building; interior cyclones create explosion risk.' },
    { q: 'Does the lease allow welding, metalworking, and spray finishing — or does it only allow "light industrial" use?', why: 'Most commercial leases specifically prohibit open-flame and hot work without a Portland Fire permit; this needs to be in the lease, not a verbal agreement.' },
    { q: 'Can you obtain a single liability insurance policy covering the full activity stack (woodworking + welding + spray finishing)?', why: 'Mixed-use maker operations require specific business classification (trade school, social club, or co-working shop) to be insurable at reasonable rates.' },
  ],
}

const DEFAULT_ITEMS: Item[] = [
  { q: 'What is the current Certificate of Occupancy and permitted use?', why: 'Using a space for a different use than the C of O authorizes triggers a permit requirement and potential lease default.' },
  { q: 'What is the actual electrical panel capacity and phase?', why: 'Insufficient power is the most common infrastructure mismatch discovered after signing.' },
  { q: 'Is HVAC sufficient for the planned occupancy and heat load?', why: 'Office HVAC is rarely sized for production or high-density workshop use.' },
  { q: 'Are there any pending code violations or open permits on the property?', why: 'Open violations can prevent you from pulling improvement permits and may trigger forced vacate orders.' },
]

function getChecklist(studioType: string): Item[] {
  const type = studioType.toLowerCase()
  if (type.includes('photo')) return CHECKLISTS.photo
  if (type.includes('art'))   return CHECKLISTS.art
  if (type.includes('workshop') || type.includes('ceramic') || type.includes('woodwork')) return CHECKLISTS.workshop
  if (type.includes('music') || type.includes('rehearsal') || type.includes('recording')) return CHECKLISTS.music
  if (type.includes('podcast') || type.includes('content')) return CHECKLISTS.podcast
  if (type.includes('fitness') || type.includes('dance') || type.includes('yoga')) return CHECKLISTS.fitness
  if (type.includes('office')) return CHECKLISTS.office
  if (type.includes('retail') || type.includes('pop-up')) return CHECKLISTS.retail
  if (type.includes('event')) return CHECKLISTS.event
  if (type.includes('maker')) return CHECKLISTS.makerspace
  return DEFAULT_ITEMS
}

export default function PreLeaseChecklist({ studioType }: Props) {
  const items = getChecklist(studioType)

  return (
    <section>
      <h2
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.6875rem',
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          color: 'var(--stone)',
          margin: '0 0 0.5rem',
        }}
      >
        Pre-lease questions to ask
      </h2>
      <p
        style={{
          fontFamily: 'var(--font-body)',
          fontSize: '0.8125rem',
          color: 'var(--stone)',
          margin: '0 0 1.25rem',
          lineHeight: 1.5,
        }}
      >
        These are the questions most renters don&apos;t ask until after signing.
      </p>
      <ol style={{ margin: 0, paddingLeft: '1.25rem' }}>
        {items.map((item, i) => (
          <li
            key={i}
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '0.875rem',
              color: 'var(--ink)',
              lineHeight: 1.5,
              marginBottom: '1rem',
            }}
          >
            <strong style={{ display: 'block', marginBottom: '2px' }}>{item.q}</strong>
            <span style={{ color: 'var(--stone)', fontSize: '0.8125rem' }}>{item.why}</span>
          </li>
        ))}
      </ol>
    </section>
  )
}
