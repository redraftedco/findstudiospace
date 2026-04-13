export type CategoryConfig = {
  title: string
  metaDescription: string
  h1: string
  intro: string
  listingType: string | null
  neighborhood?: string | null
  faqs: { q: string; a: string }[]
  related: { label: string; href: string }[]
}

export const categoryConfigs: Record<string, CategoryConfig> = {
  'photo-studio-rental': {
    title: 'Photo Studio Rental in Portland, OR | FindStudioSpace',
    metaDescription:
      'Find photo studio space for rent in Portland, OR. Professional photography studios with backdrops, lighting, and cyclorama walls available for monthly and short-term rental.',
    h1: 'Photo Studio Rental in Portland, OR',
    intro:
      'Browse photo studio rentals in Portland, OR. Whether you need a cyclorama wall, a natural-light loft, or a fully equipped production space, Portland has photography studios across every neighborhood and budget. Submit an inquiry from any listing to connect directly with the host.',
    listingType: 'photo',
    faqs: [
      {
        q: 'How much does it cost to rent a photo studio in Portland?',
        a: 'Photo studio rentals in Portland vary by term and size. Monthly rates for dedicated studio space run $600–$2,500/month. Day-rate and project-based arrangements are also available — ask the host about their terms in your inquiry.',
      },
      {
        q: 'Do Portland photo studios include lighting and backdrops?',
        a: 'Most do. Common setups include strobe kits, seamless paper backgrounds, and V-flats. Check the listing description for the included gear list, and confirm with the host before committing.',
      },
      {
        q: 'Can I rent a Portland photo studio for commercial shoots?',
        a: 'Yes. Many studios are available for commercial, editorial, and brand work. Some hosts require a certificate of insurance for commercial production — check individual listing requirements and ask in your inquiry.',
      },
      {
        q: 'Are there photo studios near downtown Portland?',
        a: 'Yes. Studios are concentrated in the Pearl District, Central Eastside Industrial District, and NE Portland — all within a short drive of downtown. Filter by neighborhood to narrow your search.',
      },
      {
        q: 'Can I bring a hair and makeup team to a rented photo studio?',
        a: 'Most studios allow this. Some have dedicated prep stations included. Mention your team size in your inquiry so the host can confirm the space works for your setup.',
      },
    ],
    related: [
      { label: 'Photo Studio Near Me in Portland', href: '/portland/photo-studio-near-me' },
      { label: 'Art Studio for Rent', href: '/portland/art-studio-rental' },
      { label: 'Studio Space for Creators', href: '/portland/studio-space-for-creators' },
    ],
  },

  'photo-studio-near-me': {
    title: 'Photo Studio Near Me — Portland, OR | FindStudioSpace',
    metaDescription:
      'Looking for a photo studio near you in Portland? Browse nearby photography studios available by the hour with instant booking.',
    h1: 'Photo Studios Near You in Portland, OR',
    intro:
      'Need a photo studio close by in Portland? Browse studios by neighborhood — from NE Portland and the Pearl District to SE and Beaverton. All spaces are renter-verified and available to book directly.',
    listingType: 'photo',
    faqs: [
      {
        q: 'Where are photo studios located in Portland?',
        a: 'Studios are spread across Portland neighborhoods including the Pearl District, Central Eastside Industrial District, NE Alberta, and SE Division. Use the map view to find the closest option.',
      },
      {
        q: 'How do I find a photo studio open today in Portland?',
        a: 'Filter by date on the listing page to see real-time availability. Many Portland studios offer same-day booking.',
      },
      {
        q: 'Are there small photo studios for solo shoots in Portland?',
        a: 'Yes. Several smaller studios are designed for solo portrait or product photography and rent for as low as $35/hr.',
      },
      {
        q: 'Do Portland photo studios have parking?',
        a: 'It varies by location. Many Industrial District studios have on-site parking. Studios in denser neighborhoods like the Pearl may rely on street parking — check the listing details.',
      },
      {
        q: 'Can I tour a Portland photo studio before booking?',
        a: 'Some hosts offer walkthroughs by request. Message the host through the listing page to arrange a preview visit.',
      },
    ],
    related: [
      { label: 'Photo Studio Rental in Portland', href: '/portland/photo-studio-rental' },
      { label: 'Studio Space for Creators', href: '/portland/studio-space-for-creators' },
      { label: 'Studio Space Rental', href: '/portland/studio-space-rental' },
    ],
  },

  'music-recording-studio': {
    title: 'Music Recording Studio in Portland, OR | FindStudioSpace',
    metaDescription:
      'Book a professional music recording studio in Portland, OR. Find spaces with isolation booths, mixing consoles, and producer access. Hourly and daily rates.',
    h1: 'Music Recording Studios in Portland, OR',
    intro:
      'Portland has a thriving music scene — and the recording studios to match. From analog-equipped tracking rooms to modern digital setups, find the right space for your next session. Browse Portland recording studios below, compare rates, and book direct.',
    listingType: 'music',
    faqs: [
      {
        q: 'How much does recording studio time cost in Portland?',
        a: "Portland recording studios typically run $40–$200/hr. Fully staffed sessions with an in-house engineer cost more; self-op studio rentals are on the lower end. Many offer block-booking discounts for 10+ hour sessions.",
      },
      {
        q: 'Do Portland recording studios include an engineer?',
        a: 'Some do, some are self-op (bring your own engineer or record yourself). Listings will specify — filter for "engineer included" if you need one.',
      },
      {
        q: 'Can I record a full band in a Portland studio?',
        a: 'Yes. Several studios have large live rooms designed for full-band tracking with isolation. Check the room capacity and layout in each listing.',
      },
      {
        q: 'What DAWs are available at Portland recording studios?',
        a: 'Pro Tools, Logic Pro, and Ableton Live are the most common. Some studios also have hardware outboard gear. Gear lists are included in each listing.',
      },
      {
        q: 'Are there affordable recording studios in Portland for independent artists?',
        a: 'Yes. Budget-friendly self-op studios start around $40/hr. Some spaces also offer demo packages or introductory rates for first-time renters.',
      },
    ],
    related: [
      { label: 'Music Studio Near Me in Portland', href: '/portland/music-studio-near-me' },
      { label: 'Home Music Studio Spaces', href: '/portland/home-music-studio-spaces' },
      { label: 'Studio Space for Creators', href: '/portland/studio-space-for-creators' },
    ],
  },

  'music-studio-near-me': {
    title: 'Music Studio Near Me — Portland, OR | FindStudioSpace',
    metaDescription:
      'Find a music studio near you in Portland, OR. Practice rooms, recording suites, and rehearsal spaces available by the hour.',
    h1: 'Music Studios Near You in Portland, OR',
    intro:
      'Whether you need a rehearsal room, a practice space, or a full recording suite, Portland has music studios across every neighborhood. Browse by location to find what\'s closest, compare hourly rates, and book instantly.',
    listingType: 'music',
    faqs: [
      {
        q: 'Where are music studios located in Portland?',
        a: "Music studios are spread throughout Portland, with clusters in NE, SE, and the Central Eastside. Use the map to filter by your neighborhood.",
      },
      {
        q: 'Can I rent a music studio just for practice in Portland?',
        a: 'Yes. Many listings are practice rooms or rehearsal spaces — not full recording setups. They\'re ideal for band rehearsals, solo practice, or pre-show warmups.',
      },
      {
        q: 'Are Portland music studios soundproofed?',
        a: 'Most are, but the quality varies. Recording studios are fully isolated; rehearsal rooms may have basic soundproofing. Check individual listings for details.',
      },
      {
        q: 'Do Portland music studios have drum kits available?',
        a: 'Many rehearsal spaces include a backline (drums, amps). Check the gear list in each listing before booking.',
      },
      {
        q: 'How late can I book a Portland music studio?',
        a: "Hours vary by host. Some studios offer late-night availability for an additional fee. Check the listing's availability calendar.",
      },
    ],
    related: [
      { label: 'Music Recording Studio in Portland', href: '/portland/music-recording-studio' },
      { label: 'Home Music Studio Spaces', href: '/portland/home-music-studio-spaces' },
      { label: 'Studio Space Rental', href: '/portland/studio-space-rental' },
    ],
  },

  'art-studio-near-me': {
    title: 'Art Studio Near Me — Portland, OR | FindStudioSpace',
    metaDescription:
      'Find an art studio near you in Portland, OR. Rent studio space for painting, sculpture, ceramics, and more. Hourly and monthly options.',
    h1: 'Art Studios Near You in Portland, OR',
    intro:
      'Portland\'s art community is one of the most active in the Pacific Northwest. Find a nearby studio space for painting, drawing, ceramics, or mixed media — available by the hour, day, or month. Browse listings below.',
    listingType: 'art',
    faqs: [
      {
        q: 'Can I rent an art studio by the hour in Portland?',
        a: 'Yes. Many Portland art studios offer hourly access in addition to monthly memberships. Hourly rates typically start around $15–$30/hr for open studio time.',
      },
      {
        q: 'Are there art studios with ceramics or kilns in Portland?',
        a: "Yes. Several Portland studios have ceramics facilities including wheels, hand-building space, and kiln access. Filter by 'ceramics' to find them.",
      },
      {
        q: 'Do Portland art studios provide supplies?',
        a: "It depends on the space. Some provide shared supplies (easels, basic paints); others are BYOS (bring your own supplies). Check the listing description.",
      },
      {
        q: 'Are there open studio nights at Portland art spaces?',
        a: "Many co-working art studios host open studio nights or drop-in sessions. These are great for trying out a space before committing to a longer rental.",
      },
      {
        q: 'Can I use a Portland art studio for a private class or workshop?',
        a: "Yes. Several studios can be rented for private instruction or group workshops. Look for listings with event or class rental options.",
      },
    ],
    related: [
      { label: 'Art Studio in Portland', href: '/portland/art-studio' },
      { label: 'Kids Art Studio Spaces', href: '/portland/kids-art-studio-spaces' },
      { label: 'Studio Space for Creators', href: '/portland/studio-space-for-creators' },
    ],
  },

  'art-studio': {
    title: 'Art Studio Space in Portland, OR | FindStudioSpace',
    metaDescription:
      'Browse art studio spaces in Portland, OR. Private studios, shared co-working space, and event-ready venues for visual artists.',
    h1: 'Art Studio Space in Portland, OR',
    intro:
      'From private studios with north-facing light to shared creative co-ops, Portland offers art space for every working style and budget. Find your next studio below — filter by size, amenities, and neighborhood.',
    listingType: 'art',
    faqs: [
      {
        q: 'What types of art studios are available in Portland?',
        a: "Portland has private studios, shared co-op spaces, studio-with-gallery setups, and hybrid event/studio venues. The right choice depends on how often you work and whether you need dedicated storage.",
      },
      {
        q: 'How much does an art studio cost in Portland?',
        a: "Monthly art studio rents in Portland range from $200–$800 depending on size and location. Hourly and day-rate options are also available for project-based work.",
      },
      {
        q: 'Are there art studios with natural light in Portland?',
        a: "Yes. Several Portland studios advertise north-facing skylights or large windows — ideal for color-accurate work. Filter by 'natural light' to find them.",
      },
      {
        q: 'Can I store my art and supplies at a rented Portland studio?',
        a: "Many studios include secure storage. Private studios almost always do; shared spaces vary. Check what's included in the listing.",
      },
      {
        q: 'Are Portland art studios available for photographers too?',
        a: "Some are. Studios with good natural light and open floor plans work well for both visual artists and photographers. Check the listing for any use restrictions.",
      },
    ],
    related: [
      { label: 'Art Studio Near Me', href: '/portland/art-studio-near-me' },
      { label: 'Kids Art Studio Spaces', href: '/portland/kids-art-studio-spaces' },
      { label: 'Photo Studio Rental', href: '/portland/photo-studio-rental' },
    ],
  },

  'home-music-studio-spaces': {
    title: 'Home Music Studio Spaces in Portland, OR | FindStudioSpace',
    metaDescription:
      'Find home-style music studio spaces in Portland, OR — compact, private, and fully equipped. Ideal for solo artists, podcasters, and producers.',
    h1: 'Home Music Studio Spaces in Portland, OR',
    intro:
      'Not every session needs a full commercial studio. Portland has a range of home-style music spaces — compact, private rooms set up for recording, production, and practice without the commercial price tag. Browse options below.',
    listingType: 'music',
    faqs: [
      {
        q: 'What is a home music studio space?',
        a: "A home music studio space is a smaller, often residential-style recording or production room — typically set up for solo work, podcasting, voice-over, or indie music production. They're more affordable than full commercial studios.",
      },
      {
        q: 'Are home music studios in Portland soundproofed?',
        a: "Quality varies. Look for listings that specify soundproofing treatment — acoustic panels, isolation improvements, or dedicated recording booths.",
      },
      {
        q: 'Can I record vocals in a Portland home studio space?',
        a: "Yes. Many home studio listings are specifically set up for vocal recording with a treated booth or isolated recording corner.",
      },
      {
        q: 'What equipment is typically in a Portland home music studio?',
        a: "Common setups include an audio interface, studio monitors, a condenser mic, and a DAW-loaded computer (often Logic or Ableton). Gear lists are in each listing.",
      },
      {
        q: 'Is a home music studio space good for podcast recording?',
        a: "Yes — home studio spaces are often ideal for podcast production due to their treated acoustic environment and compact setup.",
      },
    ],
    related: [
      { label: 'Music Recording Studio in Portland', href: '/portland/music-recording-studio' },
      { label: 'Music Studio Near Me', href: '/portland/music-studio-near-me' },
      { label: 'Studio Space for Creators', href: '/portland/studio-space-for-creators' },
    ],
  },

  'kids-art-studio-spaces': {
    title: 'Kids Art Studio Spaces in Portland, OR | FindStudioSpace',
    metaDescription:
      'Find kids art studio spaces in Portland, OR. Family-friendly studios for classes, birthday parties, and youth art programs.',
    h1: 'Kids Art Studio Spaces in Portland, OR',
    intro:
      'Looking for a creative space for kids in Portland? Browse family-friendly art studios available for birthday parties, after-school classes, youth workshops, and more. All spaces below are suitable for children.',
    listingType: 'art',
    faqs: [
      {
        q: 'Can I rent an art studio in Portland for a kids birthday party?',
        a: "Yes. Several Portland art studios specialize in birthday party rentals with setup, supplies, and instructor options available. Check for minimum headcount requirements.",
      },
      {
        q: 'Are Portland kids art studios suitable for different age groups?',
        a: "Most spaces accommodate children ages 4 and up. Some are specifically designed for younger children with age-appropriate materials. Check the listing for recommended age ranges.",
      },
      {
        q: 'Do kids art studios in Portland provide supplies?',
        a: "Most do for structured classes and parties. For open studio rentals, you may need to bring your own. Confirm with the host.",
      },
      {
        q: 'Can I book a Portland art studio for a school field trip?',
        a: "Yes. Some studios are set up for group visits and have capacity for classroom-sized groups. Contact the host directly to arrange group bookings.",
      },
      {
        q: 'Are Portland kids art studio spaces supervised?',
        a: "Supervision depends on the booking type. Class and party formats typically include a host or instructor. Open studio rentals are unsupervised — adults must be present.",
      },
    ],
    related: [
      { label: 'Art Studio Near Me', href: '/portland/art-studio-near-me' },
      { label: 'Art Studio in Portland', href: '/portland/art-studio' },
      { label: 'Studio Space for Creators', href: '/portland/studio-space-for-creators' },
    ],
  },

  'studio-space-for-creators': {
    title: 'Studio Space for Creators in Portland, OR | FindStudioSpace',
    metaDescription:
      'Browse studio spaces for creators in Portland, OR — photography, music, art, content creation, and more. Flexible hourly and monthly rentals.',
    h1: 'Studio Space for Creators in Portland, OR',
    intro:
      'Portland\'s creative economy is booming. Whether you\'re a photographer, musician, visual artist, filmmaker, or content creator, there\'s a studio space in Portland built for what you do. Browse all creator-ready spaces below.',
    listingType: null,
    faqs: [
      {
        q: 'What types of creator studios are available in Portland?',
        a: "Portland has photo studios, recording studios, art studios, podcast rooms, content creation suites, and multi-use creative spaces. Use the category filters to narrow by type.",
      },
      {
        q: 'Can I rent a studio space in Portland for content creation?',
        a: "Yes. Many spaces are set up for YouTube, social media, and brand content production with lighting, backdrops, and audio treatment.",
      },
      {
        q: 'Are there co-working studio spaces for creatives in Portland?',
        a: "Yes. Several Portland spaces operate as creative co-working studios where multiple artists or creators share a facility with shared equipment.",
      },
      {
        q: 'How do I find a studio space in Portland that fits my creative work?',
        a: "Use the filters to narrow by type (photo, music, art), size, price, and neighborhood. Each listing includes photos, gear lists, and host reviews.",
      },
      {
        q: 'Are Portland creator studio spaces available on weekends?',
        a: "Most are. Availability varies by host — check the calendar on each listing for real-time open slots.",
      },
    ],
    related: [
      { label: 'Photo Studio Rental', href: '/portland/photo-studio-rental' },
      { label: 'Music Recording Studio', href: '/portland/music-recording-studio' },
      { label: 'Art Studio Space', href: '/portland/art-studio' },
    ],
  },

  'studio-space-rental': {
    title: 'Studio Space Rental in Portland, OR | FindStudioSpace',
    metaDescription:
      'Find monthly studio space for rent in Portland, OR. Browse listings for art studios, workshops, offices, photo studios, and creative workspaces.',
    h1: 'Studio Space Rental in Portland, OR',
    intro:
      'FindStudioSpace is a directory of monthly studio rentals in Portland, OR. Browse listings across art studios, workshops, creative offices, photo studios, and maker spaces. Submit an inquiry directly from any listing and the host will follow up.',
    listingType: null,
    faqs: [
      {
        q: 'How do I rent a studio space in Portland?',
        a: "Browse listings, find a space that fits your needs, and submit an inquiry through the listing page. The host will contact you directly to discuss terms, availability, and next steps. No account required.",
      },
      {
        q: 'Are Portland studio rentals monthly or hourly?',
        a: "The listings on FindStudioSpace are primarily monthly rentals — private studios, shared creative spaces, and flex workspace on month-to-month or longer terms. If you need hourly space, check individual listings for short-term options.",
      },
      {
        q: 'How much does it cost to rent a studio in Portland?',
        a: "Monthly studio rents in Portland range from around $200/mo for a shared art co-op to $1,500+/mo for a private workshop or office suite. Price depends on size, location, and what's included.",
      },
      {
        q: 'What types of studio space are available in Portland?',
        a: "Portland has a strong inventory of art studios, woodworking and fabrication workshops, creative office suites, photo studios, fitness and dance spaces, and mixed-use maker spaces. Use the category pages to browse by type.",
      },
      {
        q: 'Can I view a space before committing to a rental?',
        a: "Yes. Most hosts welcome a walkthrough before signing anything. Mention in your inquiry that you'd like to schedule a visit — it's a standard part of the process.",
      },
    ],
    related: [
      { label: 'Photo Studio Rental', href: '/portland/photo-studio-rental' },
      { label: 'Music Recording Studio', href: '/portland/music-recording-studio' },
      { label: 'Art Studio Space', href: '/portland/art-studio' },
    ],
  },

  'office-space-rental': {
    title: 'Office Space Rental in Portland, OR | FindStudioSpace',
    metaDescription:
      'Find office space for rent in Portland, OR. Private offices, creative suites, and coworking spaces with flexible terms.',
    h1: 'Office Space Rental in Portland, OR',
    intro:
      'Browse private offices, creative suites, and shared coworking spaces available to rent in Portland, OR. Flexible hourly, monthly, and long-term options across neighborhoods including the Pearl District, Central Eastside, and SE Portland.',
    listingType: 'office',
    faqs: [
      { q: 'How much does office space cost in Portland?', a: 'Portland office rentals range from $300–$3,000/month depending on size, location, and amenities. Hourly coworking rates start around $15–$30/hr.' },
      { q: 'Are there short-term office rentals in Portland?', a: 'Yes. Many Portland spaces offer month-to-month or even hourly terms. This is common in coworking and creative office buildings.' },
      { q: 'What neighborhoods have office space in Portland?', a: 'The Pearl District, Central Eastside Industrial District, SE Portland, and Downtown all have strong office inventory.' },
      { q: 'Can I rent a private office by the day in Portland?', a: 'Yes. Several Portland coworking spaces offer day passes and dedicated desk rentals in addition to monthly memberships.' },
      { q: 'Is parking available at Portland office rentals?', a: 'Some buildings include parking; many in denser neighborhoods do not. Check individual listing details for parking information.' },
    ],
    related: [
      { label: 'Art Studio Space', href: '/portland/art-studio' },
      { label: 'Retail Space for Rent', href: '/portland/retail-space-for-rent' },
      { label: 'Studio Space Rental', href: '/portland/studio-space-rental' },
    ],
  },

  'workshop-space-rental': {
    title: 'Workshop Space for Rent in Portland, OR | FindStudioSpace',
    metaDescription:
      'Find workshop, garage, and warehouse space for rent in Portland, OR. Maker spaces, fabrication bays, and flex industrial units available for monthly rental.',
    h1: 'Workshop Space for Rent in Portland, OR',
    intro:
      'Find workshop, garage, and warehouse space for monthly rent in Portland, OR. From small maker spaces to large industrial bays, Portland has flex space for builders, fabricators, woodworkers, metalworkers, and small-batch producers. Submit an inquiry from any listing to connect with the host.',
    listingType: 'workshop',
    faqs: [
      {
        q: 'How much does workshop space cost in Portland?',
        a: 'Workshop and garage rentals in Portland typically range from $300–$2,000/month depending on size, location, and what infrastructure is included. Spaces with 220v power, dust collection, or drive-in access cost more.',
      },
      {
        q: 'What should I look for in a Portland workshop rental?',
        a: 'Ceiling height, 220v power outlets, ventilation for dust or fumes, ground-floor loading access, and whether the lease allows the type of work you plan to do. Ask specifically about noise restrictions and operating hours — these vary significantly between buildings.',
      },
      {
        q: 'Are there shared workshop spaces in Portland?',
        a: 'Yes. Several Portland maker spaces offer membership-based access to shared tools — woodworking equipment, metal fabrication, welding, and CNC. These are more affordable than private bays but require sharing time on equipment.',
      },
      {
        q: 'Can I run a business out of a rented workshop in Portland?',
        a: 'Most commercial workshop and flex spaces in Portland allow business use. Check zoning and permitted uses in the listing or ask the host — some buildings are zoned light industrial, others general commercial.',
      },
      {
        q: 'Do Portland workshop spaces have loading access?',
        a: 'Many warehouse and flex spaces include ground-floor drive-in access or loading docks. This is worth confirming before viewing if you regularly move large materials or equipment.',
      },
    ],
    related: [
      { label: 'Woodworking Studio for Rent', href: '/portland/woodworking-studio-rental' },
      { label: 'Art Studio for Rent', href: '/portland/art-studio-rental' },
      { label: 'Office Space Rental', href: '/portland/office-space-rental' },
    ],
  },

  'retail-space-for-rent': {
    title: 'Retail Space for Rent in Portland, OR | FindStudioSpace',
    metaDescription:
      'Find retail space for rent in Portland, OR. Storefronts, pop-up spaces, and commercial retail listings across Portland neighborhoods.',
    h1: 'Retail Space for Rent in Portland, OR',
    intro:
      'Browse retail storefronts, pop-up spaces, and commercial listings available to rent in Portland, OR. From busy corridor locations on Division and Belmont to emerging neighborhoods, find the right space for your business.',
    listingType: 'retail',
    faqs: [
      { q: 'How much does retail space cost in Portland?', a: 'Portland retail rents range from $1,500/month for smaller spaces to $5,000+ for high-traffic corridor locations.' },
      { q: 'Are there short-term retail leases in Portland?', a: 'Yes. Pop-up and short-term retail is increasingly common in Portland, especially in mixed-use developments.' },
      { q: 'What are the best retail neighborhoods in Portland?', a: 'SE Division, NE Alberta, the Pearl District, Mississippi Ave, and Hawthorne are among the strongest retail corridors.' },
      { q: 'Can I use a Portland retail space for events or classes?', a: 'Some retail spaces are zoned for mixed use and can accommodate events, workshops, or classes. Confirm permitted uses with the landlord.' },
      { q: 'Do Portland retail spaces require a personal guarantee?', a: 'Many small-business retail leases in Portland do require a personal guarantee, especially for longer terms.' },
    ],
    related: [
      { label: 'Office Space Rental', href: '/portland/office-space-rental' },
      { label: 'Studio Space for Creators', href: '/portland/studio-space-for-creators' },
      { label: 'Studio Space Rental', href: '/portland/studio-space-rental' },
    ],
  },

  'fitness-studio-rental': {
    title: 'Fitness & Dance Studio Rental in Portland, OR | FindStudioSpace',
    metaDescription:
      'Rent a fitness or dance studio in Portland, OR. Yoga studios, dance floors, and movement spaces available for monthly rental.',
    h1: 'Fitness & Dance Studio Rental in Portland, OR',
    intro:
      'Find fitness studios, yoga spaces, and dance floors available for monthly rent in Portland, OR. Whether you are an instructor looking for a permanent teaching space or a practitioner who needs a dedicated movement studio, Portland has options across every neighborhood and budget.',
    listingType: 'fitness',
    faqs: [
      { q: 'How much does a fitness studio cost to rent in Portland per month?', a: 'Monthly fitness and yoga studio rentals in Portland range from $500–$2,500/month depending on size, features, and neighborhood. Smaller rooms for private instruction start lower; full studios with mirrors and sound systems run higher.' },
      { q: 'Do Portland fitness studios have mirrors and sprung floors?', a: 'Some do. Check individual listings for specific features — mirrored walls, sprung or floating floors, and sound systems are mentioned in listings that have them.' },
      { q: 'Can I use a rented Portland fitness studio for teaching classes?', a: 'Yes. Most studios available for monthly rent allow instruction and class use. Some require proof of insurance for regular programming. Ask about permitted uses in your inquiry.' },
      { q: 'Are there yoga studios available for monthly rental in Portland?', a: 'Yes. Several listings are dedicated yoga and movement spaces available for monthly sublease. These often come with props, mats, and a clean, calm environment already set up.' },
      { q: 'What neighborhoods have fitness and dance studios in Portland?', a: 'Movement and fitness studios are spread across Portland, with concentrations in NE, SE, and North Portland neighborhoods.' },
    ],
    related: [
      { label: 'Dance Studio for Rent', href: '/portland/dance-studio-rental' },
      { label: 'Studio Space for Creators', href: '/portland/studio-space-for-creators' },
      { label: 'Studio Space Rental', href: '/portland/studio-space-rental' },
    ],
  },

  'art-studio-rental': {
    title: 'Art Studio for Rent in Portland, OR | FindStudioSpace',
    metaDescription:
      'Find art studio space for rent in Portland, OR. Private studios and shared co-ops for painters, sculptors, ceramicists, and mixed media artists. Monthly rentals.',
    h1: 'Art Studio for Rent in Portland, OR',
    intro:
      'Browse private and shared art studios available for monthly rent in Portland, OR. From north-light painter studios to open maker co-ops, Portland has workspace for every practice and budget. Submit an inquiry from any listing to connect directly with the host.',
    listingType: 'art',
    faqs: [
      {
        q: 'How much does it cost to rent an art studio in Portland?',
        a: 'Monthly art studio rentals in Portland range from $200–$800/month. Private studios with dedicated storage and utilities included tend to run $400–$700/month. Shared co-op spaces start lower and are a good option if you work part-time in the studio.',
      },
      {
        q: "What's the difference between a private art studio and a co-op in Portland?",
        a: "A private studio is yours alone — dedicated storage, your own key, set it up however you need. A co-op shares common areas and sometimes equipment with other artists but costs less. Both are available here. The right choice depends on how often you work and whether you need full-time access.",
      },
      {
        q: 'Do Portland art studios allow messy work — painting, sculpture, ceramics?',
        a: 'Most do, but it varies. Studios in converted warehouse buildings are generally more permissive than those in mixed-use commercial buildings. Look for listings that mention ventilation, concrete floors, or utility sinks as signals of a maker-friendly space.',
      },
      {
        q: 'Are month-to-month art studio leases available in Portland?',
        a: 'Yes. Many Portland studio landlords offer flexible month-to-month terms, particularly in multi-unit creative buildings. Longer commitments sometimes come with lower rates. Terms are negotiable — mention your preferred term in your inquiry.',
      },
      {
        q: 'Can I visit an art studio before committing to a rental?',
        a: "Yes — most hosts expect it. Mention in your inquiry that you'd like to schedule a walkthrough. It's standard practice and a good sign when a host is happy to show the space in person.",
      },
    ],
    related: [
      { label: 'Art Studio Space in Portland', href: '/portland/art-studio' },
      { label: 'Ceramics Studio for Rent', href: '/portland/ceramics-studio-rental' },
      { label: 'Workshop Space for Rent', href: '/portland/workshop-space-rental' },
    ],
  },

  'music-studio-rental': {
    title: 'Music Studio for Rent in Portland, OR | FindStudioSpace',
    metaDescription:
      'Find music studio space for rent in Portland, OR. Recording studios, rehearsal rooms, and practice spaces available for monthly rental.',
    h1: 'Music Studio for Rent in Portland, OR',
    intro:
      'Browse music studios and rehearsal spaces available for monthly rent in Portland, OR. Whether you need a private recording room, a band rehearsal space, or a dedicated practice studio, Portland has options across every neighborhood and budget. Submit an inquiry from any listing to connect with the host.',
    listingType: 'music',
    faqs: [
      {
        q: 'How much does it cost to rent a music studio in Portland per month?',
        a: 'Monthly music studio rentals in Portland range from $300–$1,500/month depending on size, soundproofing quality, included equipment, and neighborhood. Smaller practice rooms start lower; fully equipped recording suites run higher.',
      },
      {
        q: 'Can I rent a music studio in Portland just for band rehearsal?',
        a: 'Yes. Several listings are rehearsal-focused spaces — not full recording setups. They typically include a drum kit, amps, and basic PA. These are the most affordable music spaces in Portland on a per-month basis.',
      },
      {
        q: 'What should I look for in a Portland music studio rental?',
        a: "Soundproofing quality, 24-hour access if you keep irregular hours, what gear is included, and whether you can bring your own equipment or modify the space. Ask these questions in your inquiry before committing.",
      },
      {
        q: 'Are there music studios in Portland with recording equipment included?',
        a: "Some listings include a basic recording setup — audio interface, monitors, microphone. Others are bare rooms for practice. The listing description will specify what's included. If it's unclear, ask in your inquiry.",
      },
      {
        q: 'Are month-to-month music studio leases available in Portland?',
        a: 'Most music studios and rehearsal spaces in Portland offer flexible monthly terms. Some require a minimum 2–3 month commitment for private spaces. Month-to-month is standard for smaller practice rooms.',
      },
    ],
    related: [
      { label: 'Music Recording Studio in Portland', href: '/portland/music-recording-studio' },
      { label: 'Home Music Studio Spaces', href: '/portland/home-music-studio-spaces' },
      { label: 'Studio Space for Creators', href: '/portland/studio-space-for-creators' },
    ],
  },

  'ceramics-studio-rental': {
    title: 'Ceramics Studio for Rent in Portland, OR | FindStudioSpace',
    metaDescription:
      'Find ceramics and pottery studio space for rent in Portland, OR. Studios with wheel access, kiln firing, and clay storage available for monthly rental.',
    h1: 'Ceramics Studio for Rent in Portland, OR',
    intro:
      'Find ceramics and pottery studio space for monthly rent in Portland, OR. Portland has a strong ceramics community with studios offering wheel access, hand-building space, kiln firing, and dedicated clay storage. Browse listings and submit an inquiry to connect directly with the host.',
    listingType: 'art',
    faqs: [
      {
        q: 'Are there ceramics studios with kiln access in Portland?',
        a: 'Yes. Several Portland studios offer kiln access as part of a monthly studio rental or membership. Check individual listings for firing schedules, cone range, and whether gas or electric kilns are available.',
      },
      {
        q: 'How much does it cost to rent ceramics studio space in Portland?',
        a: 'Monthly ceramics studio rentals with kiln access typically range from $150–$500/month depending on how much dedicated space you need and what is included. Shared studio memberships are on the lower end; private studio space runs higher.',
      },
      {
        q: 'Can I store clay and work-in-progress pieces at a Portland ceramics studio?',
        a: 'Most ceramics studios include shelving or designated storage for members. Ask specifically about wet work storage and bisqueware shelf space — policies vary between studios.',
      },
      {
        q: 'Do Portland ceramics studios provide clay and tools?',
        a: 'Some provide shared tools — ribs, wire tools, sponges. Most require you to buy or bring your own clay. Confirm with the host before signing up so there are no surprises.',
      },
      {
        q: 'Are Portland ceramics studios suitable for beginners?',
        a: 'Some studios welcome beginners, especially those that offer orientation or open studio hours with more experienced ceramicists around. If you are new to wheel throwing or hand-building, look for listings that mention beginner access or supervised open studio time.',
      },
    ],
    related: [
      { label: 'Art Studio for Rent', href: '/portland/art-studio-rental' },
      { label: 'Art Studio Space in Portland', href: '/portland/art-studio' },
      { label: 'Workshop Space for Rent', href: '/portland/workshop-space-rental' },
    ],
  },

  'woodworking-studio-rental': {
    title: 'Woodworking Studio for Rent in Portland, OR | FindStudioSpace',
    metaDescription:
      'Find woodworking studio space for rent in Portland, OR. Private shop bays and shared maker spaces with tools available for monthly rental.',
    h1: 'Woodworking Studio for Rent in Portland, OR',
    intro:
      'Browse woodworking studio space and shop rentals available for monthly rent in Portland, OR. From private workshop bays to shared maker spaces with tools included, Portland has dedicated woodworking space for furniture makers, carpenters, and serious hobbyists. Submit an inquiry from any listing to connect with the host.',
    listingType: 'workshop',
    faqs: [
      {
        q: 'Are there woodworking studios with tools included in Portland?',
        a: 'Yes. Several shared maker spaces in Portland include access to table saws, jointers, planers, bandsaws, and hand tools as part of monthly membership. Private workshop rentals typically require you to bring your own tools.',
      },
      {
        q: 'How much does it cost to rent woodworking space in Portland?',
        a: 'Shared woodworking space memberships in Portland start around $100–$300/month. Private shop bays run $400–$1,200/month depending on size. Spaces with 220v power, dust collection, and drive-in loading access cost more.',
      },
      {
        q: 'Can I store lumber and materials at a rented Portland woodworking studio?',
        a: 'Many private workshop rentals allow on-site material storage. Shared maker spaces vary — some have designated lumber racks, others do not. Ask specifically about this before committing.',
      },
      {
        q: 'What should I look for in a Portland woodworking studio rental?',
        a: '220v power outlets, dust collection infrastructure or hookups, ceiling height for sheet goods, drive-in or loading access, and ventilation for finishing work. Ground-floor access matters if you regularly move heavy stock in and out.',
      },
      {
        q: 'Are Portland woodworking studios available for small production runs?',
        a: 'Yes. Several private shop rentals in Portland are used by small furniture studios and production woodworkers. Look for listings that mention commercial or business use is permitted, and confirm zoning allows production activity.',
      },
    ],
    related: [
      { label: 'Workshop Space for Rent', href: '/portland/workshop-space-rental' },
      { label: 'Art Studio for Rent', href: '/portland/art-studio-rental' },
      { label: 'Studio Space Rental', href: '/portland/studio-space-rental' },
    ],
  },

  'dance-studio-rental': {
    title: 'Dance Studio for Rent in Portland, OR | FindStudioSpace',
    metaDescription:
      'Find dance studio space for rent in Portland, OR. Mirrored studios, sprung floors, and movement spaces available for monthly rental.',
    h1: 'Dance Studio for Rent in Portland, OR',
    intro:
      'Browse dance studio space available for monthly rent in Portland, OR. Whether you are a dance instructor looking for a permanent teaching space or a choreographer who needs a dedicated rehearsal room, Portland has studios with mirrors, sprung floors, and sound systems across multiple neighborhoods.',
    listingType: 'fitness',
    faqs: [
      {
        q: 'How much does it cost to rent a dance studio in Portland per month?',
        a: 'Monthly dance studio rentals in Portland range from $500–$2,500/month depending on size, features, and neighborhood. Smaller rooms for private instruction or solo rehearsal start lower; large mirrored studios with sprung floors and sound systems run higher.',
      },
      {
        q: 'Do Portland dance studios have sprung floors?',
        a: 'Some do. Sprung floors matter most for high-impact styles — ballet, contemporary, tap. Check individual listings for floor type. It is usually mentioned in the description or amenities list for studios that have it.',
      },
      {
        q: 'Can I use a rented dance studio in Portland for teaching classes?',
        a: 'Yes. Most dance studios available for monthly rent allow class and instruction use. Some hosts require proof of liability insurance for regular programming. Ask about permitted uses and insurance requirements in your inquiry.',
      },
      {
        q: 'Are there dance studios in Portland available for rehearsal on a monthly basis?',
        a: 'Yes. Monthly arrangements are common for choreographers, performing groups, and dance companies that need consistent access to a space. Some studio managers prefer monthly commitments for dedicated rooms.',
      },
      {
        q: 'What neighborhoods in Portland have dance studios for rent?',
        a: 'Dance and movement studios are spread across Portland, with concentrations in NE, SE, and North Portland. Several are located in mixed-use fitness and wellness buildings.',
      },
    ],
    related: [
      { label: 'Fitness & Dance Studio Rental', href: '/portland/fitness-studio-rental' },
      { label: 'Art Studio for Rent', href: '/portland/art-studio-rental' },
      { label: 'Studio Space for Creators', href: '/portland/studio-space-for-creators' },
    ],
  },

  'music-rehearsal-space': {
    title: 'Monthly Music Rehearsal Space in Portland, OR | FindStudioSpace',
    metaDescription:
      'Find monthly music rehearsal space in Portland, OR. Private lockout rehearsal rooms and band practice spaces available for month-to-month rental.',
    h1: 'Monthly Music Rehearsal Space in Portland, OR',
    intro:
      'Browse private music rehearsal spaces available for monthly rent in Portland, OR. Unlike hourly booking rooms, these are lockout studios — yours alone, available whenever you need them, no scheduling required. Find a dedicated band practice room or solo rehearsal space and submit an inquiry to connect directly with the host.',
    listingType: 'music',
    faqs: [
      {
        q: 'What is a lockout rehearsal space in Portland?',
        a: 'A lockout is a private rehearsal room rented on a monthly basis — you have the only key. Your gear stays set up, you come and go whenever you want, and you never compete for booking slots. It is the preferred arrangement for serious bands and working musicians who rehearse regularly.',
      },
      {
        q: 'How much does monthly rehearsal space cost in Portland?',
        a: 'Monthly lockout rehearsal rooms in Portland range from $250–$800/month depending on room size, soundproofing quality, and included gear. Smaller rooms for solo or duo practice start lower; rooms large enough for a full band with a drum kit run $400–$700/month on average.',
      },
      {
        q: 'Do Portland rehearsal spaces include a drum kit and backline?',
        a: 'Many do. Common setups include a full drum kit, bass and guitar amps, and a small PA. Check the listing description for what is included — spaces that have it typically say so. If it is not listed, ask in your inquiry.',
      },
      {
        q: 'What should I look for in a Portland rehearsal space rental?',
        a: 'Soundproofing quality and neighbor tolerance for noise hours, 24-hour access if your band rehearses late, what gear is included, whether you can store additional equipment on-site, and how the lease term works. Get these answered before you move in.',
      },
      {
        q: 'Are month-to-month rehearsal room leases available in Portland?',
        a: 'Yes. Month-to-month is the standard arrangement for rehearsal rooms in Portland. Some private lockout spaces require a 2–3 month minimum. Mention your preferred term in your inquiry.',
      },
    ],
    related: [
      { label: 'Music Studio for Rent', href: '/portland/music-studio-rental' },
      { label: 'Studio Space Rental', href: '/portland/studio-space-rental' },
      { label: 'Workshop Space for Rent', href: '/portland/workshop-space-rental' },
    ],
  },

  'central-eastside': {
    title: 'Studio Space for Rent in Central Eastside Portland | FindStudioSpace',
    metaDescription:
      'Find monthly studio, workshop, and art space for rent in Portland\'s Central Eastside Industrial District. Spaces for makers, artists, and producers.',
    h1: 'Studio Space for Rent in Central Eastside Portland',
    intro:
      'Portland\'s Central Eastside Industrial District is the city\'s primary hub for creative production, fabrication, and studio work. Bounded by the river and SE Portland neighborhoods, the district is home to working artists, furniture makers, ceramicists, and production studios. Find monthly workshop, art studio, and office space for rent in one of Portland\'s most active creative corridors.',
    listingType: null,
    neighborhood: 'Central Eastside',
    faqs: [
      {
        q: 'How much does studio space cost in Portland\'s Central Eastside?',
        a: 'Workshop and studio space in the Central Eastside Industrial District typically ranges from $500–$3,000/month depending on size and amenities. Smaller private studios start around $500/month while larger warehouse or fabrication spaces run $1,500–$3,000+.',
      },
      {
        q: 'What types of spaces are available in the Central Eastside?',
        a: 'The district is zoned for industrial and commercial use, making it ideal for woodworking shops, ceramics studios, fabrication bays, photography studios, and production offices. Many buildings offer loading dock access and high ceilings.',
      },
      {
        q: 'Is the Central Eastside good for artist studios?',
        a: 'Yes — the Central Eastside has been Portland\'s working artist district for decades. It offers a mix of individual studio spaces and shared co-op buildings with communal equipment and facilities.',
      },
    ],
    related: [
      { label: 'Workshop Space for Rent', href: '/portland/workshop-space-rental' },
      { label: 'Art Studio for Rent', href: '/portland/art-studio-rental' },
      { label: 'Office Space Rental', href: '/portland/office-space-rental' },
    ],
  },

  'pearl-district': {
    title: 'Studio Space for Rent in the Pearl District Portland | FindStudioSpace',
    metaDescription:
      'Find monthly studio and office space for rent in Portland\'s Pearl District. Professional creative studios, design offices, and gallery spaces.',
    h1: 'Studio Space for Rent in the Pearl District, Portland',
    intro:
      'The Pearl District offers Portland\'s highest concentration of professional creative studios, design offices, and gallery spaces. Former industrial buildings converted to live-work lofts and commercial studios make the Pearl a natural home for designers, architects, photographers, and creative agencies. Find monthly studio and office space for rent in the Pearl District.',
    listingType: null,
    neighborhood: 'Pearl District',
    faqs: [
      {
        q: 'How much does studio space cost in Portland\'s Pearl District?',
        a: 'Pearl District studio and office rentals typically range from $800–$4,000/month. The Pearl commands Portland\'s highest commercial rents but offers premium finishes, building amenities, and a professional business environment.',
      },
      {
        q: 'What types of creatives work in the Pearl District?',
        a: 'The Pearl is home to architecture firms, design studios, photographers, galleries, and creative agencies. It\'s well suited for client-facing creative businesses and professionals who need a polished environment.',
      },
      {
        q: 'Are there affordable options in the Pearl District?',
        a: 'Shared studio spaces and co-working arrangements in the Pearl can reduce individual costs significantly. Some buildings offer smaller private studios starting around $600–$800/month.',
      },
    ],
    related: [
      { label: 'Office Space Rental', href: '/portland/office-space-rental' },
      { label: 'Art Studio for Rent', href: '/portland/art-studio-rental' },
      { label: 'Studio Space Rental', href: '/portland/studio-space-rental' },
    ],
  },

  'alberta-arts': {
    title: 'Studio Space for Rent in Alberta Arts District Portland | FindStudioSpace',
    metaDescription:
      'Find monthly art studio space for rent in Portland\'s Alberta Arts District. Private studios and co-op spaces for painters, printmakers, and artists.',
    h1: 'Studio Space for Rent in the Alberta Arts District, Portland',
    intro:
      'The Alberta Arts District on NE Alberta Street is Portland\'s most established arts community, home to galleries, independent studios, and maker spaces. Monthly studio rentals in Alberta range from shared co-op spaces to private artist studios, with a strong community of painters, printmakers, and craft artists. Find monthly art studio space for rent in NE Portland\'s Alberta Arts District.',
    listingType: null,
    neighborhood: 'NE Portland',
    faqs: [
      {
        q: 'How much does studio space cost in the Alberta Arts District?',
        a: 'Monthly studio rentals in the Alberta Arts District typically range from $300–$1,500/month. Shared co-op spaces and smaller private studios offer some of Portland\'s most affordable options for working artists.',
      },
      {
        q: 'What kind of studios are available on Alberta?',
        a: 'The Alberta Arts District has a strong concentration of visual art studios — painters, printmakers, ceramicists, and mixed media artists. Several buildings offer shared facilities including kilns, printing presses, and communal equipment.',
      },
      {
        q: 'Is the Alberta Arts District good for a studio practice?',
        a: 'It\'s one of Portland\'s most established arts communities with a strong network of working artists, regular open studio events, and a walkable neighborhood with cafes and galleries nearby.',
      },
    ],
    related: [
      { label: 'Art Studio for Rent', href: '/portland/art-studio-rental' },
      { label: 'Studio Space Rental', href: '/portland/studio-space-rental' },
      { label: 'Office Space Rental', href: '/portland/office-space-rental' },
    ],
  },

  'division': {
    title: 'Studio Space for Rent on SE Division Portland | FindStudioSpace',
    metaDescription:
      'Find monthly studio, retail, and workshop space for rent along SE Division in Portland, OR. Affordable creative workspace in a walkable neighborhood.',
    h1: 'Studio Space for Rent near SE Division, Portland',
    intro:
      'SE Division Street and the surrounding blocks offer some of Portland\'s most affordable and accessible monthly studio rentals. The corridor mixes retail storefronts, workshop spaces, and creative offices in a walkable neighborhood with strong transit access. Find monthly studio, retail, and workshop space for rent along SE Division in Portland.',
    listingType: null,
    neighborhood: 'SE Portland',
    faqs: [
      {
        q: 'How much does studio space cost on SE Division?',
        a: 'Monthly rentals along SE Division and the surrounding blocks typically range from $400–$2,000/month depending on size and type. The corridor offers good value relative to the Pearl District with strong transit access.',
      },
      {
        q: 'What types of spaces are available on SE Division?',
        a: 'SE Division has a mix of retail-facing storefronts, private studios, workshop spaces, and creative offices. It\'s well suited for makers who want street presence or easy client access.',
      },
      {
        q: 'Is SE Division good for a creative business?',
        a: 'Yes — the Division corridor has strong foot traffic, good parking, and a dense residential neighborhood that supports creative businesses. It\'s one of Portland\'s most active commercial streets.',
      },
    ],
    related: [
      { label: 'Art Studio for Rent', href: '/portland/art-studio-rental' },
      { label: 'Workshop Space for Rent', href: '/portland/workshop-space-rental' },
      { label: 'Office Space Rental', href: '/portland/office-space-rental' },
    ],
  },

  'mississippi': {
    title: 'Studio Space for Rent on N Mississippi Portland | FindStudioSpace',
    metaDescription:
      'Find monthly studio and creative space for rent on N Mississippi Avenue in Portland. Small studios, retail storefronts, and maker spaces.',
    h1: 'Studio Space for Rent near N Mississippi, Portland',
    intro:
      'N Mississippi Avenue is Portland\'s boutique creative corridor — a mix of independent shops, studios, and small production spaces in converted older buildings. Monthly studio rentals on Mississippi tend toward smaller private studios, shared creative spaces, and retail-facing maker spaces. Find monthly studio space for rent on N Mississippi in Portland.',
    listingType: null,
    neighborhood: 'N Portland',
    faqs: [
      {
        q: 'How much does studio space cost on N Mississippi?',
        a: 'Monthly studio and retail rentals on N Mississippi typically range from $500–$2,500/month. Spaces tend to be smaller than industrial districts but offer street-level visibility and a strong neighborhood customer base.',
      },
      {
        q: 'What types of spaces are available on Mississippi?',
        a: 'N Mississippi offers a mix of small retail studios, private creative offices, and shared workspace. It\'s well suited for designers, jewelers, textile artists, and makers who want a visible storefront presence.',
      },
      {
        q: 'Is N Mississippi good for a studio practice?',
        a: 'Mississippi is one of Portland\'s most walkable creative corridors with strong community character. It\'s best for creatives who benefit from neighborhood foot traffic and want to be part of an established arts-friendly street.',
      },
    ],
    related: [
      { label: 'Art Studio for Rent', href: '/portland/art-studio-rental' },
      { label: 'Studio Space Rental', href: '/portland/studio-space-rental' },
      { label: 'Workshop Space for Rent', href: '/portland/workshop-space-rental' },
    ],
  },
}
