export type CategoryConfig = {
  title: string
  metaDescription: string
  h1: string
  intro: string
  listingType: string | null
  faqs: { q: string; a: string }[]
  related: { label: string; href: string }[]
}

export const categoryConfigs: Record<string, CategoryConfig> = {
  'photo-studio-rental': {
    title: 'Photo Studio Rental in Portland, OR | FindStudioSpace',
    metaDescription:
      'Rent a photo studio in Portland, OR. Browse professional photography spaces with backdrops, lighting, and hourly rates. Book today.',
    h1: 'Photo Studio Rental in Portland',
    intro:
      'Find the perfect photo studio rental in Portland, OR. Whether you need a cyclorama wall, natural light loft, or a fully equipped commercial space, Portland has options to fit every shoot and budget. Browse available spaces below and book by the hour or day.',
    listingType: 'photo',
    faqs: [
      {
        q: 'How much does it cost to rent a photo studio in Portland?',
        a: 'Hourly rates for Portland photo studios typically range from $35 to $150/hr depending on size, equipment included, and location. Many spaces offer half-day and full-day discounts.',
      },
      {
        q: 'Do Portland photo studios include lighting and backdrops?',
        a: 'Most do. Look for listings that specify included gear — common setups include strobe kits, seamless paper backgrounds, and V-flats. Confirm with the host before booking.',
      },
      {
        q: 'Can I book a Portland photo studio for a commercial shoot?',
        a: 'Yes. Many studios are available for commercial, editorial, and brand work. Some require a certificate of insurance for commercial shoots — check individual listing requirements.',
      },
      {
        q: 'Are there photo studios near downtown Portland?',
        a: "Yes. Several studios are located in the Pearl District, Central Eastside, and NE Portland — all within a short drive of downtown. Use the map filter to find what's closest to you.",
      },
      {
        q: 'Can I bring a hair and makeup team to a rented photo studio?',
        a: 'Most studios allow this. Some have dedicated makeup stations included. Confirm with the host if you need dedicated prep space.',
      },
    ],
    related: [
      { label: 'Photo Studio Near Me in Portland', href: '/portland/photo-studio-near-me' },
      { label: 'Art Studio in Portland', href: '/portland/art-studio' },
      { label: 'Studio Space Rental in Portland', href: '/portland/studio-space-rental' },
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
      'Rent studio space in Portland, OR. Find hourly, daily, and monthly studio rentals for photography, music, art, and more.',
    h1: 'Studio Space Rental in Portland, OR',
    intro:
      'Portland Studios is the easiest way to find and book studio space in Portland, OR. Browse verified listings across photo, music, art, and multi-use studios. Hourly, daily, and monthly rentals available — no membership required.',
    listingType: null,
    faqs: [
      {
        q: 'How do I rent a studio space in Portland?',
        a: "Browse listings on Portland Studios, select your dates and times, and book directly through the listing page. No membership required.",
      },
      {
        q: 'What is the minimum rental period for Portland studio spaces?',
        a: "Most studios have a 1–2 hour minimum. Some spaces offer day rates or monthly memberships for regular users.",
      },
      {
        q: 'Do I need insurance to rent a studio in Portland?',
        a: "Some commercial-use rentals require a certificate of insurance. Personal and creative-use bookings typically do not. Check individual listing requirements.",
      },
      {
        q: 'Can I rent a Portland studio space for events or workshops?',
        a: "Yes. Many studios double as event venues for workshops, classes, pop-ups, and private events. Look for listings tagged with event availability.",
      },
      {
        q: 'Are Portland studio spaces pet-friendly?',
        a: "Some are, some are not — particularly photography studios with clean backdrops. Check the house rules in each listing.",
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
      'Rent workshop, garage, and warehouse space in Portland, OR. Maker spaces, woodworking shops, and flex industrial units available.',
    h1: 'Workshop Space for Rent in Portland, OR',
    intro:
      'Find workshop, garage, and warehouse space for rent in Portland, OR. From small maker spaces to large industrial units, Portland has flex space for builders, fabricators, hobbyists, and small businesses.',
    listingType: 'workshop',
    faqs: [
      { q: 'How much does workshop space cost in Portland?', a: 'Workshop and garage rentals in Portland typically range from $300–$2,000/month depending on size and location.' },
      { q: 'Are there shared workshop spaces in Portland?', a: 'Yes. Several maker spaces offer membership-based access to tools including woodworking, metalworking, and fabrication.' },
      { q: 'Can I run a business out of a workshop rental in Portland?', a: 'Most commercial workshop spaces allow business use. Check zoning and lease terms in each listing.' },
      { q: 'Do Portland workshop spaces have loading dock access?', a: 'Some warehouse and flex spaces include loading docks or drive-in access. Check individual listing descriptions.' },
      { q: 'Are Portland workshop spaces available for short-term rental?', a: 'Yes. Some spaces offer monthly or project-based terms. Longer leases are more common for larger industrial units.' },
    ],
    related: [
      { label: 'Art Studio Space', href: '/portland/art-studio' },
      { label: 'Office Space Rental', href: '/portland/office-space-rental' },
      { label: 'Studio Space Rental', href: '/portland/studio-space-rental' },
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
      'Rent a fitness or dance studio in Portland, OR. Yoga studios, dance floors, and movement spaces available by the hour or month.',
    h1: 'Fitness & Dance Studio Rental in Portland, OR',
    intro:
      'Find fitness studios, yoga spaces, and dance floors available to rent in Portland, OR. Whether you are teaching a class, running a workshop, or need a dedicated movement practice space, Portland has options by the hour and by the month.',
    listingType: 'fitness',
    faqs: [
      { q: 'Can I rent a yoga or dance studio by the hour in Portland?', a: 'Yes. Several Portland studios offer hourly rental for instructors and practitioners. Rates typically run $25–$75/hr.' },
      { q: 'Do Portland fitness studios have mirrors and sprung floors?', a: 'Some do. Check individual listings for specific features like mirrored walls, sprung floors, and sound systems.' },
      { q: 'Can I use a Portland fitness studio for private classes?', a: 'Yes. Hourly rental is common for personal trainers, yoga instructors, and dance teachers.' },
      { q: 'Are Portland dance studios available on weekends?', a: 'Most are. Weekend availability varies by studio — check the listing calendar for open slots.' },
      { q: 'What neighborhoods have fitness and dance studios in Portland?', a: 'Studios are spread across Portland with concentrations in NE, SE, and North Portland.' },
    ],
    related: [
      { label: 'Art Studio Near Me', href: '/portland/art-studio-near-me' },
      { label: 'Studio Space for Creators', href: '/portland/studio-space-for-creators' },
      { label: 'Studio Space Rental', href: '/portland/studio-space-rental' },
    ],
  },
}
