export type CategoryConfig = {
  title: string
  metaDescription: string
  h1: string
  intro: string
  listingType: string | null
  neighborhood?: string | null
  keywordInclude?: string[]
  keywordExclude?: string[]
  faqs: { q: string; a: string }[]
  related: { label: string; href: string }[]
}

export const categoryConfigs: Record<string, CategoryConfig> = {
  'event-space': {
    title: 'Event Space for Rent in Atlanta, GA | Private Venues & Pop-Up Spaces',
    metaDescription:
      'Find private event space for rent in Atlanta, GA. Browse venues for pop-ups, brand activations, private parties, and community events. Monthly rentals — contact hosts directly.',
    h1: 'Event Space for Rent in Atlanta, GA',
    intro:
      'Browse private event spaces and venues available for monthly rent in Atlanta, GA. Whether you need a space for recurring pop-ups, monthly community events, a brand activation, or a private party venue you can access on your schedule — Atlanta has flex event-ready spaces across every neighborhood. Submit an inquiry from any listing to contact the host directly.',
    listingType: null,
    keywordInclude: ['event', 'venue', 'party', 'wedding', 'pop-up', 'activation', 'gallery'],
    keywordExclude: ['dance', 'yoga', 'fitness', 'office', 'cowork', 'class', 'cheap', 'affordable'],
    faqs: [
      {
        q: 'What kinds of event spaces are available in Atlanta?',
        a: 'Atlanta has private event venues, loft-style spaces, gallery-style rooms, warehouse flex spaces with open floor plans, and rooftop venues. Most are available for recurring monthly use — ideal for brands, collectives, and organizers who host events on a regular schedule.',
      },
      {
        q: 'How much does event space rental cost in Atlanta per month?',
        a: 'Monthly event space rentals in Atlanta range from $800–$4,000/month depending on size, infrastructure, and neighborhood. Raw flex spaces in West Midtown and Old Fourth Ward start lower; purpose-built venues with built-in AV, furniture, and kitchen access run higher.',
      },
      {
        q: 'Can I use a rented Atlanta event space for a pop-up shop or brand activation?',
        a: 'Yes. Many monthly rental spaces in Atlanta permit commercial events, pop-ups, and brand activations under standard terms. Confirm with the host that public foot traffic and commercial use are allowed — some buildings have restrictions on signage, hours, or occupancy for public-facing events. Ask in your inquiry before committing.',
      },
      {
        q: 'What neighborhoods in Atlanta have private event spaces for rent?',
        a: 'Private event venues and flex spaces are concentrated in Old Fourth Ward, West Midtown, Castleberry Hill, and Inman Park. The Westside has a strong inventory of warehouse-style venues with high ceilings and open floor plans.',
      },
      {
        q: 'What is the difference between hourly venue rental and monthly event space rental?',
        a: 'Hourly venues charge per session — convenient for one-off events but expensive if you host regularly. A monthly rental gives you flexible access throughout the month, including setup and breakdown time between events, without competing for booking slots. If you host monthly pop-ups, recurring community events, or need on-site storage between uses, a monthly term is almost always more cost-effective.',
      },
    ],
    related: [
      { label: 'Retail Space for Rent', href: '/atlanta/retail-space-for-rent' },
      { label: 'Content Studios', href: '/atlanta/content-studios' },
      { label: 'Photo Studios', href: '/atlanta/photo-studios' },
      { label: 'Makerspace', href: '/atlanta/makerspace' },
    ],
  },

  'content-studios': {
    title: 'Podcast & Video Studio Rental in Atlanta | Content Creator Spaces',
    metaDescription:
      'Browse content studios in Atlanta for podcast, video production, and creator shoots. Monthly rentals with direct host inquiries.',
    h1: 'Podcast & Video Studio Rental in Atlanta',
    intro:
      'Atlanta is one of the country\'s top production cities — content studios here cover podcast rooms, video production spaces, and creator-focused studios. Browse options in Old Fourth Ward, West Midtown, and across the city.',
    listingType: null,
    keywordInclude: ['podcast', 'recording', 'video', 'production', 'creator', 'media'],
    keywordExclude: ['dance', 'yoga', 'fitness', 'office', 'cowork', 'class', 'cheap', 'affordable'],
    faqs: [
      {
        q: 'What is included in Content Studios?',
        a: 'Content Studios includes podcast rooms, video production spaces, and creator studios. Atlanta\'s deep production industry means options here range from small solo booths to full production-ready sets.',
      },
      {
        q: 'Do these listings support monthly creator workflows?',
        a: 'Yes. Listings are aimed at recurring creative use, not one-off class bookings or short-term office use.',
      },
      {
        q: 'How much does a content studio cost to rent in Atlanta per month?',
        a: 'Monthly content studio rentals in Atlanta typically range from $400–$2,500/month depending on room size, equipment included, and whether the space is production-ready for video.',
      },
    ],
    related: [
      { label: 'Event Space', href: '/atlanta/event-space' },
      { label: 'Photo Studios', href: '/atlanta/photo-studios' },
      { label: 'Makerspace', href: '/atlanta/makerspace' },
    ],
  },

  'photo-studios': {
    title: 'Photography Studio Rental in Atlanta | Photo Shoot Locations',
    metaDescription:
      'Find Atlanta photo studios for monthly rent, including cyc wall and backdrop-ready spaces for commercial and editorial shoots.',
    h1: 'Photography Studio Rental in Atlanta',
    intro:
      'Browse photo-focused studios in Atlanta with shooting amenities like cyc walls, backdrop areas, and production-ready layouts. Atlanta\'s commercial production market means strong inventory for editorial, product, and brand photography.',
    listingType: null,
    keywordInclude: ['photo', 'photography', 'cyc', 'backdrop', 'shoot'],
    keywordExclude: ['dance', 'yoga', 'fitness', 'office', 'cowork', 'class', 'cheap', 'affordable'],
    faqs: [
      {
        q: 'Are cyc wall studios available in Atlanta?',
        a: 'Yes. Listings that mention cyc wall or dedicated backdrop setups are grouped under Photo Studios. Atlanta has a strong commercial photography market with several purpose-built studio facilities.',
      },
      {
        q: 'How much does photo studio rental cost in Atlanta per month?',
        a: 'Monthly photo studio rentals in Atlanta range from $600–$2,500/month. Smaller dedicated studios start lower; larger production facilities with full lighting and set infrastructure run higher.',
      },
      {
        q: 'Can I find commercial shoot spaces in Atlanta?',
        a: 'Yes. Atlanta\'s film and production industry has created a strong supply of commercial-grade studio space. This route is for photo-focused rentals, including editorial and product shoot environments.',
      },
    ],
    related: [
      { label: 'Event Space', href: '/atlanta/event-space' },
      { label: 'Content Studios', href: '/atlanta/content-studios' },
      { label: 'Makerspace', href: '/atlanta/makerspace' },
    ],
  },

  'makerspace': {
    title: 'Makerspace in Atlanta | Workshop & Creative Studio Rental',
    metaDescription:
      'Browse Atlanta makerspaces and workshop rentals with equipment-ready setups for fabrication, woodwork, and craft production.',
    h1: 'Makerspace & Workshop Space in Atlanta',
    intro:
      'Find workshop and makerspace listings in Atlanta for fabrication, craft, and hands-on production. Compare spaces and contact hosts directly.',
    listingType: null,
    keywordInclude: ['maker', 'workshop', 'wood', 'fabrication', 'jewelry', 'craft'],
    keywordExclude: ['dance', 'yoga', 'fitness', 'office', 'cowork', 'class', 'cheap', 'affordable'],
    faqs: [
      {
        q: 'What spaces count as Makerspace in Atlanta?',
        a: 'Makerspace includes workshop rentals and equipment-based spaces such as woodshop, jewelry, and fabrication-focused studios.',
      },
      {
        q: 'Are office and coworking listings mixed in?',
        a: 'No. Office and coworking terms are filtered out so this route stays focused on hands-on maker use.',
      },
      {
        q: 'How much does makerspace cost in Atlanta per month?',
        a: 'Shared makerspace memberships in Atlanta start around $100–$300/month. Private workshop bays run $400–$1,500/month depending on size and infrastructure.',
      },
    ],
    related: [
      { label: 'Event Space', href: '/atlanta/event-space' },
      { label: 'Content Studios', href: '/atlanta/content-studios' },
      { label: 'Photo Studios', href: '/atlanta/photo-studios' },
    ],
  },

  'art-studio-rental': {
    title: 'Art Studio for Rent in Atlanta, GA | FindStudioSpace',
    metaDescription:
      'Find art studio space for rent in Atlanta, GA. Private studios and shared co-ops for painters, sculptors, ceramicists, and mixed media artists. Monthly rentals.',
    h1: 'Art Studio for Rent in Atlanta, GA',
    intro:
      'Browse private and shared art studios available for monthly rent in Atlanta, GA. From private studios in Old Fourth Ward and Castleberry Hill to open maker co-ops, Atlanta has workspace for every practice and budget. Submit an inquiry from any listing to connect directly with the host.',
    listingType: 'art',
    faqs: [
      {
        q: 'How much does it cost to rent an art studio in Atlanta?',
        a: 'Monthly art studio rentals in Atlanta range from $200–$800/month. Private studios with dedicated storage and utilities included tend to run $400–$700/month. Shared co-op spaces start lower and are a good option if you work part-time in the studio.',
      },
      {
        q: "What's the difference between a private art studio and a co-op in Atlanta?",
        a: "A private studio is yours alone — dedicated storage, your own key, set it up however you need. A co-op shares common areas and sometimes equipment with other artists but costs less. Both are available here. The right choice depends on how often you work and whether you need full-time access.",
      },
      {
        q: 'Do Atlanta art studios allow messy work — painting, sculpture, ceramics?',
        a: 'Most do, but it varies. Studios in converted warehouse buildings are generally more permissive than those in mixed-use commercial buildings. Look for listings that mention ventilation, concrete floors, or utility sinks as signals of a maker-friendly space.',
      },
      {
        q: 'Are month-to-month art studio leases available in Atlanta?',
        a: 'Yes. Many Atlanta studio landlords offer flexible month-to-month terms, particularly in multi-unit creative buildings. Longer commitments sometimes come with lower rates. Terms are negotiable — mention your preferred term in your inquiry.',
      },
      {
        q: 'What neighborhoods in Atlanta have art studios for rent?',
        a: 'Castleberry Hill is Atlanta\'s dedicated arts district. Old Fourth Ward, Inman Park, and West Midtown also have strong art studio inventory in converted industrial and mixed-use buildings.',
      },
    ],
    related: [
      { label: 'Workshop Space for Rent', href: '/atlanta/workshop-space-rental' },
      { label: 'Studio Space Rental', href: '/atlanta/studio-space-rental' },
      { label: 'Makerspace', href: '/atlanta/makerspace' },
    ],
  },

  'workshop-space-rental': {
    title: 'Workshop Space for Rent in Atlanta, GA | FindStudioSpace',
    metaDescription:
      'Find workshop, garage, and warehouse space for rent in Atlanta, GA. Maker spaces, fabrication bays, and flex industrial units available for monthly rental.',
    h1: 'Workshop Space for Rent in Atlanta, GA',
    intro:
      'Find workshop, garage, and warehouse space for monthly rent in Atlanta, GA. From small maker spaces to large industrial bays, Atlanta has flex space for builders, fabricators, woodworkers, metalworkers, and small-batch producers. Submit an inquiry from any listing to connect with the host.',
    listingType: 'workshop',
    faqs: [
      {
        q: 'How much does workshop space cost in Atlanta?',
        a: 'Workshop and garage rentals in Atlanta typically range from $300–$2,000/month depending on size, location, and what infrastructure is included. Spaces with 220v power, dust collection, or drive-in access cost more.',
      },
      {
        q: 'What should I look for in an Atlanta workshop rental?',
        a: 'Ceiling height, 220v power outlets, ventilation for dust or fumes, ground-floor loading access, and whether the lease allows the type of work you plan to do. Ask specifically about noise restrictions and operating hours — these vary significantly between buildings.',
      },
      {
        q: 'Are there shared workshop spaces in Atlanta?',
        a: 'Yes. Several Atlanta maker spaces offer membership-based access to shared tools — woodworking equipment, metal fabrication, welding, and CNC. These are more affordable than private bays but require sharing time on equipment.',
      },
      {
        q: 'Can I run a business out of a rented workshop in Atlanta?',
        a: 'Most commercial workshop and flex spaces in Atlanta allow business use. Check zoning and permitted uses in the listing or ask the host — some buildings are zoned light industrial, others general commercial.',
      },
      {
        q: 'What neighborhoods in Atlanta have workshop space for rent?',
        a: 'West Midtown, the Westside Industrial area, and neighborhoods south of downtown have the strongest inventory of warehouse and workshop space in Atlanta.',
      },
    ],
    related: [
      { label: 'Art Studio for Rent', href: '/atlanta/art-studio-rental' },
      { label: 'Office Space Rental', href: '/atlanta/office-space-rental' },
      { label: 'Makerspace', href: '/atlanta/makerspace' },
    ],
  },

  'office-space-rental': {
    title: 'Office Space Rental in Atlanta, GA | FindStudioSpace',
    metaDescription:
      'Find office space for rent in Atlanta, GA. Private offices, creative suites, and coworking spaces with flexible terms.',
    h1: 'Office Space Rental in Atlanta, GA',
    intro:
      'Browse private offices, creative suites, and shared coworking spaces available to rent in Atlanta, GA. Flexible monthly and long-term options across neighborhoods including Midtown, Old Fourth Ward, West Midtown, and Buckhead.',
    listingType: 'office',
    faqs: [
      { q: 'How much does office space cost in Atlanta?', a: 'Atlanta office rentals range from $300–$3,500/month depending on size, location, and amenities. Midtown and Buckhead run higher; emerging creative neighborhoods offer better value.' },
      { q: 'Are there short-term office rentals in Atlanta?', a: 'Yes. Many Atlanta spaces offer month-to-month or even hourly terms. This is common in coworking and creative office buildings.' },
      { q: 'What neighborhoods have office space in Atlanta?', a: 'Midtown, Buckhead, Old Fourth Ward, West Midtown, and Downtown all have strong office inventory. Old Fourth Ward and West Midtown are popular with creative businesses.' },
      { q: 'Can I rent a private office by the day in Atlanta?', a: 'Yes. Several Atlanta coworking spaces offer day passes and dedicated desk rentals in addition to monthly memberships.' },
      { q: 'Is parking available at Atlanta office rentals?', a: 'Many buildings include parking or are near paid lots. Atlanta is a car-centric city so most commercial spaces have parking options nearby — confirm with the host.' },
    ],
    related: [
      { label: 'Retail Space for Rent', href: '/atlanta/retail-space-for-rent' },
      { label: 'Studio Space Rental', href: '/atlanta/studio-space-rental' },
      { label: 'Art Studio for Rent', href: '/atlanta/art-studio-rental' },
    ],
  },

  'fitness-studio-rental': {
    title: 'Fitness & Dance Studio Rental in Atlanta, GA | FindStudioSpace',
    metaDescription:
      'Rent a fitness or dance studio in Atlanta, GA. Yoga studios, dance floors, and movement spaces available for monthly rental.',
    h1: 'Fitness & Dance Studio Rental in Atlanta, GA',
    intro:
      'Find fitness studios, yoga spaces, and dance floors available for monthly rent in Atlanta, GA. Whether you are an instructor looking for a permanent teaching space or a practitioner who needs a dedicated movement studio, Atlanta has options across every neighborhood and budget.',
    listingType: 'fitness',
    faqs: [
      { q: 'How much does a fitness studio cost to rent in Atlanta per month?', a: 'Monthly fitness and yoga studio rentals in Atlanta range from $500–$2,500/month depending on size, features, and neighborhood. Smaller rooms for private instruction start lower; full studios with mirrors and sound systems run higher.' },
      { q: 'Do Atlanta fitness studios have mirrors and sprung floors?', a: 'Some do. Check individual listings for specific features — mirrored walls, sprung or floating floors, and sound systems are mentioned in listings that have them.' },
      { q: 'Can I use a rented Atlanta fitness studio for teaching classes?', a: 'Yes. Most studios available for monthly rent allow instruction and class use. Some require proof of insurance for regular programming. Ask about permitted uses in your inquiry.' },
      { q: 'Are there yoga studios available for monthly rental in Atlanta?', a: 'Yes. Several listings are dedicated yoga and movement spaces available for monthly sublease. These often come with props, mats, and a calm environment already set up.' },
      { q: 'What neighborhoods have fitness and dance studios in Atlanta?', a: 'Movement and fitness studios are spread across Atlanta, with concentrations in Midtown, Buckhead, Old Fourth Ward, and Decatur.' },
    ],
    related: [
      { label: 'Art Studio for Rent', href: '/atlanta/art-studio-rental' },
      { label: 'Studio Space Rental', href: '/atlanta/studio-space-rental' },
      { label: 'Workshop Space', href: '/atlanta/workshop-space-rental' },
    ],
  },

  'retail-space-for-rent': {
    title: 'Retail Space for Rent in Atlanta, GA | FindStudioSpace',
    metaDescription:
      'Find retail space for rent in Atlanta, GA. Storefronts, pop-up spaces, and commercial retail listings across Atlanta neighborhoods.',
    h1: 'Retail Space for Rent in Atlanta, GA',
    intro:
      'Browse retail storefronts, pop-up spaces, and commercial listings available to rent in Atlanta, GA. From busy corridor locations in Old Fourth Ward and Ponce City Market to emerging neighborhoods, find the right space for your business.',
    listingType: 'retail',
    faqs: [
      { q: 'How much does retail space cost in Atlanta?', a: 'Atlanta retail rents range from $1,500/month for smaller spaces to $6,000+ for high-traffic corridor locations in Old Fourth Ward, Virginia-Highland, or Little Five Points.' },
      { q: 'Are there short-term retail leases in Atlanta?', a: 'Yes. Pop-up and short-term retail is increasingly common in Atlanta, especially in mixed-use developments and market halls.' },
      { q: 'What are the best retail neighborhoods in Atlanta?', a: 'Old Fourth Ward, Ponce City Market, Little Five Points, Decatur, Virginia-Highland, Castleberry Hill, and Westside Provisions District are among the strongest retail corridors for independent businesses.' },
      { q: 'Can I use an Atlanta retail space for events or classes?', a: 'Some retail spaces are zoned for mixed use and can accommodate events, workshops, or classes. Confirm permitted uses with the landlord.' },
      { q: 'Do Atlanta retail spaces require a personal guarantee?', a: 'Many small-business retail leases in Atlanta do require a personal guarantee, especially for longer terms.' },
    ],
    related: [
      { label: 'Office Space Rental', href: '/atlanta/office-space-rental' },
      { label: 'Art Studio for Rent', href: '/atlanta/art-studio-rental' },
      { label: 'Studio Space Rental', href: '/atlanta/studio-space-rental' },
    ],
  },

  'studio-space-rental': {
    title: 'Studio Space Rental in Atlanta, GA | FindStudioSpace',
    metaDescription:
      'Find monthly studio space for rent in Atlanta, GA. Browse listings for art studios, workshops, offices, photo studios, and creative workspaces.',
    h1: 'Studio Space Rental in Atlanta, GA',
    intro:
      'FindStudioSpace is a directory of monthly studio rentals in Atlanta, GA. Browse listings across art studios, workshops, creative offices, photo studios, and maker spaces. Submit an inquiry directly from any listing and the host will follow up.',
    listingType: null,
    faqs: [
      {
        q: 'How do I find monthly studio space in Atlanta?',
        a: 'Browse listings by category or neighborhood using the filters above. Each listing shows monthly pricing, location, and photos. Submit an inquiry directly through any listing page to contact the host.',
      },
      {
        q: 'What does monthly studio space cost in Atlanta?',
        a: 'Monthly studio rentals in Atlanta typically range from $300 for small shared spaces to $3,500+ for large private studios. Most artist studios and maker spaces fall between $500–$1,500/month depending on size and neighborhood.',
      },
      {
        q: "What's the difference between a shared studio and a private studio?",
        a: 'A private studio is yours alone — locked, dedicated space only you access. A shared studio or co-op means you share the space with other creatives, usually at a lower monthly cost with more community amenities.',
      },
      {
        q: 'Do I need a long-term lease to rent studio space in Atlanta?',
        a: 'Most listings on FindStudioSpace offer month-to-month terms. Some require a 3–6 month minimum. Check individual listing descriptions for lease terms before inquiring.',
      },
      {
        q: 'What types of creative studio space are available in Atlanta?',
        a: 'Atlanta has art studios, woodworking and fabrication shops, ceramics studios, photo studios, music rehearsal spaces, dance studios, and production-focused creative spaces. Use the category filters to find your type.',
      },
    ],
    related: [
      { label: 'Photo Studios', href: '/atlanta/photo-studios' },
      { label: 'Art Studio for Rent', href: '/atlanta/art-studio-rental' },
      { label: 'Workshop Space for Rent', href: '/atlanta/workshop-space-rental' },
    ],
  },

  'music-studio-rental': {
    title: 'Music Studio for Rent in Atlanta, GA | FindStudioSpace',
    metaDescription:
      'Find music studio space for rent in Atlanta, GA. Recording studios, rehearsal rooms, and practice spaces available for monthly rental.',
    h1: 'Music Studio for Rent in Atlanta, GA',
    intro:
      'Browse music studios and rehearsal spaces available for monthly rent in Atlanta, GA. Atlanta has one of the country\'s most active music production scenes — find a private recording room, band rehearsal space, or dedicated practice studio and submit an inquiry to connect with the host.',
    listingType: 'music',
    faqs: [
      {
        q: 'How much does it cost to rent a music studio in Atlanta per month?',
        a: 'Monthly music studio rentals in Atlanta range from $300–$1,500/month depending on size, soundproofing quality, included equipment, and neighborhood. Smaller practice rooms start lower; fully equipped recording suites run higher.',
      },
      {
        q: 'Can I rent a music studio in Atlanta just for band rehearsal?',
        a: 'Yes. Several listings are rehearsal-focused spaces — not full recording setups. They typically include a drum kit, amps, and basic PA. These are the most affordable music spaces in Atlanta on a per-month basis.',
      },
      {
        q: 'What should I look for in an Atlanta music studio rental?',
        a: "Soundproofing quality, 24-hour access if you keep irregular hours, what gear is included, and whether you can bring your own equipment or modify the space. Ask these questions in your inquiry before committing.",
      },
      {
        q: 'What neighborhoods in Atlanta have music studios for rent?',
        a: 'Music and recording studios in Atlanta are concentrated in Old Fourth Ward, West Midtown, and East Atlanta Village, where the city\'s independent music community is strongest.',
      },
      {
        q: 'Are month-to-month music studio leases available in Atlanta?',
        a: 'Most music studios and rehearsal spaces in Atlanta offer flexible monthly terms. Some require a minimum 2–3 month commitment for private spaces. Month-to-month is standard for smaller practice rooms.',
      },
    ],
    related: [
      { label: 'Content Studios', href: '/atlanta/content-studios' },
      { label: 'Studio Space Rental', href: '/atlanta/studio-space-rental' },
      { label: 'Art Studio for Rent', href: '/atlanta/art-studio-rental' },
    ],
  },

  'dance-studio-rental': {
    title: 'Dance Studio for Rent in Atlanta, GA | FindStudioSpace',
    metaDescription:
      'Find dance studio space for rent in Atlanta, GA. Mirrored studios, sprung floors, and movement spaces available for monthly rental.',
    h1: 'Dance Studio for Rent in Atlanta, GA',
    intro:
      'Browse dance studio space available for monthly rent in Atlanta, GA. Whether you are a dance instructor looking for a permanent teaching space or a choreographer who needs a dedicated rehearsal room, Atlanta has studios with mirrors, sprung floors, and sound systems across multiple neighborhoods.',
    listingType: 'fitness',
    faqs: [
      {
        q: 'How much does it cost to rent a dance studio in Atlanta per month?',
        a: 'Monthly dance studio rentals in Atlanta range from $500–$2,500/month depending on size, features, and neighborhood. Smaller rooms for private instruction or solo rehearsal start lower; large mirrored studios with sprung floors and sound systems run higher.',
      },
      {
        q: 'Do Atlanta dance studios have sprung floors?',
        a: 'Some do. Sprung floors matter most for high-impact styles — ballet, contemporary, tap. Check individual listings for floor type. It is usually mentioned in the description or amenities list for studios that have it.',
      },
      {
        q: 'Can I use a rented dance studio in Atlanta for teaching classes?',
        a: 'Yes. Most dance studios available for monthly rent allow class and instruction use. Some hosts require proof of liability insurance for regular programming. Ask about permitted uses and insurance requirements in your inquiry.',
      },
      {
        q: 'What neighborhoods in Atlanta have dance studios for rent?',
        a: 'Dance and movement studios in Atlanta are spread across the city, with strong inventory in Midtown, Old Fourth Ward, Buckhead, and Decatur.',
      },
      {
        q: 'Are there dance studios in Atlanta available for rehearsal on a monthly basis?',
        a: 'Yes. Monthly arrangements are common for choreographers, performing groups, and dance companies that need consistent access to a space.',
      },
    ],
    related: [
      { label: 'Fitness & Dance Studio Rental', href: '/atlanta/fitness-studio-rental' },
      { label: 'Art Studio for Rent', href: '/atlanta/art-studio-rental' },
      { label: 'Studio Space Rental', href: '/atlanta/studio-space-rental' },
    ],
  },

  'old-fourth-ward': {
    title: 'Studio Space for Rent in Old Fourth Ward Atlanta | FindStudioSpace',
    metaDescription:
      'Find monthly studio, workshop, and creative space for rent in Atlanta\'s Old Fourth Ward. Spaces for makers, artists, photographers, and producers near Ponce City Market.',
    h1: 'Studio Space for Rent in Old Fourth Ward, Atlanta',
    intro:
      'Old Fourth Ward is Atlanta\'s most active creative neighborhood — anchored by Ponce City Market and the BeltLine, it\'s home to production studios, art galleries, and creative businesses of every kind. Find monthly studio, workshop, and office space for rent in one of Atlanta\'s most walkable and creatively dense neighborhoods.',
    listingType: null,
    neighborhood: 'Old Fourth Ward',
    faqs: [
      {
        q: 'How much does studio space cost in Old Fourth Ward?',
        a: 'Studio and creative space rentals in Old Fourth Ward typically range from $600–$3,500/month depending on size and type. The BeltLine corridor commands the highest rents; smaller spaces on side streets offer better value.',
      },
      {
        q: 'What types of spaces are available in Old Fourth Ward?',
        a: 'Old Fourth Ward has photo studios, creative offices, retail storefronts, production spaces, and shared artist studios. The neighborhood is well suited for client-facing creative businesses and producers who want walkable access to restaurants and amenities.',
      },
      {
        q: 'Is Old Fourth Ward good for a studio practice?',
        a: 'Yes — the BeltLine and Ponce City Market have made O4W Atlanta\'s most dynamic creative neighborhood. It has strong foot traffic, a dense creative community, and excellent transit and bike access.',
      },
    ],
    related: [
      { label: 'Art Studio for Rent', href: '/atlanta/art-studio-rental' },
      { label: 'Office Space Rental', href: '/atlanta/office-space-rental' },
      { label: 'Photo Studios', href: '/atlanta/photo-studios' },
    ],
  },

  'west-midtown': {
    title: 'Studio Space for Rent in West Midtown Atlanta | FindStudioSpace',
    metaDescription:
      'Find monthly studio, workshop, and creative space for rent in Atlanta\'s West Midtown / Westside. Warehouse studios, production spaces, and maker shops.',
    h1: 'Studio Space for Rent in West Midtown, Atlanta',
    intro:
      'West Midtown and the Westside Provisions District offer Atlanta\'s strongest concentration of warehouse studios, production facilities, and maker spaces. Former industrial buildings now house photography studios, woodworking shops, fabrication bays, and creative agencies. Find monthly studio and workshop space in one of Atlanta\'s best-value creative neighborhoods.',
    listingType: null,
    neighborhood: 'West Midtown',
    faqs: [
      {
        q: 'How much does studio space cost in West Midtown Atlanta?',
        a: 'Studio and workshop rentals in West Midtown typically range from $400–$2,500/month. The area offers good value for larger spaces compared to Old Fourth Ward or Midtown proper.',
      },
      {
        q: 'What types of spaces are available in West Midtown?',
        a: 'West Midtown has a strong mix of warehouse studios, photography facilities, fabrication shops, production offices, and maker spaces. High ceilings and loading access are common.',
      },
      {
        q: 'Is West Midtown good for a production or fabrication business?',
        a: 'Yes — West Midtown is Atlanta\'s best neighborhood for production-heavy creative businesses. The industrial stock offers ceiling heights, power infrastructure, and loading access that\'s hard to find elsewhere in the city.',
      },
    ],
    related: [
      { label: 'Workshop Space for Rent', href: '/atlanta/workshop-space-rental' },
      { label: 'Photo Studios', href: '/atlanta/photo-studios' },
      { label: 'Content Studios', href: '/atlanta/content-studios' },
    ],
  },

  'castleberry-hill': {
    title: 'Studio Space for Rent in Castleberry Hill Atlanta | FindStudioSpace',
    metaDescription:
      'Find monthly art studio space for rent in Atlanta\'s Castleberry Hill arts district. Private studios and co-op spaces for painters, sculptors, and mixed media artists.',
    h1: 'Studio Space for Rent in Castleberry Hill, Atlanta',
    intro:
      'Castleberry Hill is Atlanta\'s designated arts district — a small, walkable neighborhood just southwest of downtown with galleries, open studios, and artist live/work spaces. Monthly studio rentals here range from shared co-op spaces to private artist studios. Find art studio space for rent in Atlanta\'s most established arts community.',
    listingType: null,
    neighborhood: 'Castleberry Hill',
    faqs: [
      {
        q: 'How much does studio space cost in Castleberry Hill?',
        a: 'Monthly studio rentals in Castleberry Hill typically range from $300–$1,500/month. The neighborhood offers some of Atlanta\'s most affordable options for working artists, particularly in shared and co-op arrangements.',
      },
      {
        q: 'What kind of studios are available in Castleberry Hill?',
        a: 'Castleberry Hill has a strong concentration of visual art studios — painters, sculptors, ceramicists, and mixed media artists. Several buildings offer shared facilities and open studio events.',
      },
      {
        q: 'Is Castleberry Hill good for an art practice?',
        a: 'It\'s Atlanta\'s most established arts community with a dedicated monthly gallery hop (Second Friday), a network of working artists, and a walkable neighborhood feel close to downtown.',
      },
    ],
    related: [
      { label: 'Art Studio for Rent', href: '/atlanta/art-studio-rental' },
      { label: 'Studio Space Rental', href: '/atlanta/studio-space-rental' },
      { label: 'Event Space', href: '/atlanta/event-space' },
    ],
  },

  'inman-park': {
    title: 'Studio Space for Rent in Inman Park Atlanta | FindStudioSpace',
    metaDescription:
      'Find monthly studio and creative space for rent in Atlanta\'s Inman Park neighborhood. Art studios, offices, and maker spaces near the BeltLine.',
    h1: 'Studio Space for Rent in Inman Park, Atlanta',
    intro:
      'Inman Park is one of Atlanta\'s most walkable historic neighborhoods, with creative studios and small businesses occupying converted bungalows and commercial storefronts. Close to the BeltLine and Old Fourth Ward, it\'s a natural home for independent creatives, designers, and small studios. Find monthly studio and office space for rent in Inman Park.',
    listingType: null,
    neighborhood: 'Inman Park',
    faqs: [
      {
        q: 'How much does studio space cost in Inman Park?',
        a: 'Monthly studio and office rentals in Inman Park typically range from $500–$2,500/month. Converted residential and small commercial spaces offer character that\'s hard to find in larger buildings.',
      },
      {
        q: 'What types of spaces are available in Inman Park?',
        a: 'Inman Park has smaller creative studios, independent offices, retail-facing storefronts, and some shared creative spaces. It\'s well suited for designers, photographers, and client-facing creative businesses.',
      },
      {
        q: 'Is Inman Park good for a creative business?',
        a: 'Yes — Inman Park has strong walkability, good parking, and a community of independent businesses and creatives. It\'s particularly well suited for practices that benefit from neighborhood character and proximity to the BeltLine.',
      },
    ],
    related: [
      { label: 'Old Fourth Ward', href: '/atlanta/old-fourth-ward' },
      { label: 'Art Studio for Rent', href: '/atlanta/art-studio-rental' },
      { label: 'Office Space Rental', href: '/atlanta/office-space-rental' },
    ],
  },
}
