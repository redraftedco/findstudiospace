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
    title: 'Event Space for Rent in Seattle, WA | Private Venues & Pop-Up Spaces',
    metaDescription:
      'Find private event space for rent in Seattle, WA. Browse venues for pop-ups, brand activations, private parties, and community events. Monthly rentals — contact hosts directly.',
    h1: 'Event Space for Rent in Seattle, WA',
    intro:
      'Browse private event spaces and venues available for monthly rent in Seattle, WA. From warehouse lofts in SoDo to gallery spaces in Capitol Hill and Georgetown — find a venue for recurring pop-ups, private parties, brand activations, and community events. Submit an inquiry from any listing to contact the host directly.',
    listingType: null,
    keywordInclude: ['event', 'venue', 'party', 'wedding', 'pop-up', 'activation', 'gallery'],
    keywordExclude: ['dance', 'yoga', 'fitness', 'office', 'cowork', 'class', 'cheap', 'affordable'],
    faqs: [
      {
        q: 'What kinds of event spaces are available in Seattle?',
        a: 'Seattle has private event venues, loft-style spaces, gallery-style rooms, warehouse flex spaces with open floor plans, and waterfront-adjacent venues. Most are available for recurring monthly use — ideal for brands, collectives, and organizers who host events on a regular schedule.',
      },
      {
        q: 'How much does event space rental cost in Seattle per month?',
        a: 'Monthly event space rentals in Seattle range from $600–$4,000/month depending on size, infrastructure, and neighborhood. Raw flex spaces in SoDo and Georgetown start lower; purpose-built venues with built-in AV, furniture, and kitchen access run higher.',
      },
      {
        q: 'Can I use a rented Seattle event space for a pop-up shop or brand activation?',
        a: 'Yes. Many monthly rental spaces in Seattle permit commercial events, pop-ups, and brand activations under standard terms. Confirm with the host that public foot traffic and commercial use are allowed — some buildings have restrictions on signage, hours, or occupancy for public-facing events.',
      },
      {
        q: 'What neighborhoods in Seattle have private event spaces for rent?',
        a: 'Private event venues and flex spaces are concentrated in SoDo, Georgetown, Capitol Hill, and South Lake Union. Georgetown in particular has strong inventory of warehouse-style venues with high ceilings and open floor plans.',
      },
      {
        q: 'What is the difference between hourly venue rental and monthly event space rental?',
        a: 'Hourly venues charge per session — convenient for one-off events but expensive if you host regularly. A monthly rental gives you flexible access throughout the month, including setup and breakdown time between events, without competing for booking slots.',
      },
    ],
    related: [
      { label: 'Retail Space for Rent', href: '/seattle/retail-space-for-rent' },
      { label: 'Content Studios', href: '/seattle/content-studios' },
      { label: 'Photo Studios', href: '/seattle/photo-studios' },
      { label: 'Makerspace', href: '/seattle/makerspace' },
    ],
  },

  'content-studios': {
    title: 'Podcast & Video Studio Rental in Seattle | Content Creator Spaces',
    metaDescription:
      'Browse content studios in Seattle for podcast, video production, and creator shoots. Monthly rentals with direct host inquiries.',
    h1: 'Podcast & Video Studio Rental in Seattle',
    intro:
      'Seattle has a deep tech and creative industry that supports a strong content studio market — podcast rooms, video production spaces, and creator-focused studios across Capitol Hill, South Lake Union, and beyond. Browse and inquire directly.',
    listingType: null,
    keywordInclude: ['podcast', 'recording', 'video', 'production', 'creator', 'media', 'audio'],
    keywordExclude: ['dance', 'yoga', 'fitness', 'office', 'cowork', 'class', 'cheap', 'affordable'],
    faqs: [
      {
        q: 'What is included in Content Studios listings in Seattle?',
        a: 'Content Studios includes podcast rooms, video production spaces, and creator studios. Seattle\'s tech and media industry supports a range of options from small solo booths to full production-ready sets.',
      },
      {
        q: 'How much does a content studio cost to rent in Seattle per month?',
        a: 'Monthly content studio rentals in Seattle typically range from $500–$3,000/month depending on room size, equipment included, and whether the space is production-ready for video.',
      },
      {
        q: 'Are soundproofed studios available in Seattle?',
        a: 'Yes. Several listings include acoustic treatment, soundproofing, and dedicated recording setups. Check individual listing descriptions for technical specs.',
      },
    ],
    related: [
      { label: 'Event Space', href: '/seattle/event-space' },
      { label: 'Photo Studios', href: '/seattle/photo-studios' },
      { label: 'Makerspace', href: '/seattle/makerspace' },
    ],
  },

  'photo-studios': {
    title: 'Photography Studio Rental in Seattle | Photo Shoot Locations',
    metaDescription:
      'Find Seattle photo studios for monthly rent. Cyc walls, north light, natural daylight studios for commercial and editorial shoots.',
    h1: 'Photography Studio Rental in Seattle',
    intro:
      'Browse photo-focused studios in Seattle with natural north light, cyc walls, and backdrop areas. Seattle\'s overcast climate is prized by photographers — diffused natural light year-round. Find a monthly photo studio and contact the host directly.',
    listingType: null,
    keywordInclude: ['photo', 'photography', 'cyc', 'backdrop', 'shoot', 'natural light'],
    keywordExclude: ['dance', 'yoga', 'fitness', 'office', 'cowork', 'class', 'cheap', 'affordable'],
    faqs: [
      {
        q: 'Are cyc wall studios available in Seattle?',
        a: 'Yes. Listings that mention cyc wall or dedicated backdrop setups are grouped under Photo Studios. Seattle has several purpose-built photo studio facilities.',
      },
      {
        q: 'How much does photo studio rental cost in Seattle per month?',
        a: 'Monthly photo studio rentals in Seattle range from $700–$3,000/month. Smaller dedicated studios start lower; larger production facilities with full lighting and set infrastructure run higher.',
      },
      {
        q: 'Is natural light available in Seattle studios?',
        a: 'Yes — Seattle\'s consistent overcast creates excellent diffused natural light for photography. Many studios highlight north-facing windows or skylights specifically for this reason.',
      },
    ],
    related: [
      { label: 'Event Space', href: '/seattle/event-space' },
      { label: 'Content Studios', href: '/seattle/content-studios' },
      { label: 'Makerspace', href: '/seattle/makerspace' },
    ],
  },

  'makerspace': {
    title: 'Makerspace in Seattle | Workshop & Creative Studio Rental',
    metaDescription:
      'Browse Seattle makerspaces and workshop rentals with equipment-ready setups for fabrication, woodwork, and craft production.',
    h1: 'Makerspace & Workshop Space in Seattle',
    intro:
      'Find workshop and makerspace listings in Seattle for fabrication, craft, and hands-on production. Georgetown and SoDo have some of the city\'s best industrial-style maker spaces with loading access, high ceilings, and 220v power.',
    listingType: null,
    keywordInclude: ['maker', 'workshop', 'wood', 'fabrication', 'jewelry', 'craft', 'CNC', 'metal'],
    keywordExclude: ['dance', 'yoga', 'fitness', 'office', 'cowork', 'class', 'cheap', 'affordable'],
    faqs: [
      {
        q: 'What spaces count as Makerspace in Seattle?',
        a: 'Makerspace includes workshop rentals and equipment-based spaces such as woodshop, metal fabrication, jewelry, and CNC-focused studios.',
      },
      {
        q: 'How much does makerspace cost in Seattle per month?',
        a: 'Shared makerspace memberships in Seattle start around $150–$400/month. Private workshop bays run $500–$2,000/month depending on size and infrastructure.',
      },
      {
        q: 'Which Seattle neighborhoods have the best workshop space?',
        a: 'Georgetown and SoDo have the strongest inventory of industrial-grade workshop space in Seattle, with high ceilings, loading docks, and 220v power infrastructure.',
      },
    ],
    related: [
      { label: 'Event Space', href: '/seattle/event-space' },
      { label: 'Content Studios', href: '/seattle/content-studios' },
      { label: 'Photo Studios', href: '/seattle/photo-studios' },
    ],
  },

  'art-studio-rental': {
    title: 'Art Studio for Rent in Seattle, WA | FindStudioSpace',
    metaDescription:
      'Find art studio space for rent in Seattle, WA. Private studios and shared co-ops for painters, sculptors, ceramicists, and mixed media artists. Monthly rentals.',
    h1: 'Art Studio for Rent in Seattle, WA',
    intro:
      'Browse private and shared art studios available for monthly rent in Seattle, WA. From private studios in Capitol Hill and Fremont to open maker co-ops in Georgetown, Seattle has workspace for every practice and budget. Submit an inquiry to connect directly with the host.',
    listingType: 'art',
    faqs: [
      {
        q: 'How much does it cost to rent an art studio in Seattle?',
        a: 'Monthly art studio rentals in Seattle range from $300–$1,200/month. Private studios with dedicated storage and utilities included tend to run $500–$900/month. Shared co-op spaces start lower.',
      },
      {
        q: "What's the difference between a private art studio and a co-op in Seattle?",
        a: "A private studio is yours alone — dedicated storage, your own key, set it up how you need. A co-op shares common areas with other artists but costs less. Both are available here.",
      },
      {
        q: 'Do Seattle art studios allow messy work — painting, sculpture, ceramics?',
        a: 'Most do, but it varies. Studios in converted industrial buildings are generally more permissive. Look for listings that mention ventilation, concrete floors, or utility sinks.',
      },
      {
        q: 'Are month-to-month art studio leases available in Seattle?',
        a: 'Yes. Many Seattle studio landlords offer flexible month-to-month terms, particularly in multi-unit creative buildings.',
      },
      {
        q: 'What neighborhoods in Seattle have art studios for rent?',
        a: 'Capitol Hill, Fremont, Georgetown, Ballard, and the Central District all have working artist studios. Georgetown is particularly strong for larger studio spaces at lower rents.',
      },
    ],
    related: [
      { label: 'Workshop Space for Rent', href: '/seattle/workshop-space-rental' },
      { label: 'Makerspace', href: '/seattle/makerspace' },
      { label: 'Studio Space Rental', href: '/seattle/studio-space-rental' },
    ],
  },

  'workshop-space-rental': {
    title: 'Workshop Space for Rent in Seattle, WA | FindStudioSpace',
    metaDescription:
      'Find workshop, garage, and warehouse space for rent in Seattle, WA. Maker spaces, fabrication bays, and flex industrial units available for monthly rental.',
    h1: 'Workshop Space for Rent in Seattle, WA',
    intro:
      'Find workshop, garage, and warehouse space for monthly rent in Seattle, WA. From small maker spaces in Fremont to large industrial bays in Georgetown and SoDo, Seattle has flex space for builders, fabricators, woodworkers, and small-batch producers.',
    listingType: 'workshop',
    faqs: [
      {
        q: 'How much does workshop space cost in Seattle?',
        a: 'Workshop and garage rentals in Seattle typically range from $400–$2,500/month depending on size, location, and infrastructure included. Spaces with 220v power or drive-in access cost more.',
      },
      {
        q: 'Which Seattle neighborhoods have the best workshop space?',
        a: 'Georgetown and SoDo have the highest concentration of industrial workshop space. Ballard and Interbay also have workshop inventory, particularly for marine and fabrication trades.',
      },
      {
        q: 'Are there shared workshop spaces in Seattle?',
        a: 'Yes. Seattle has several well-established makerspaces with membership-based access to shared tools — woodworking, metal fab, welding, and CNC.',
      },
      {
        q: 'Can I run a business out of a rented workshop in Seattle?',
        a: 'Most commercial workshop and flex spaces in Seattle allow business use. Check zoning and permitted uses — Georgetown and SoDo are zoned industrial and generally very permissive.',
      },
      {
        q: 'What neighborhoods in Seattle have workshop space for rent?',
        a: 'Georgetown, SoDo, Ballard, Interbay, and South Park have the strongest inventory of warehouse and workshop space in Seattle.',
      },
    ],
    related: [
      { label: 'Art Studio for Rent', href: '/seattle/art-studio-rental' },
      { label: 'Office Space Rental', href: '/seattle/office-space-rental' },
      { label: 'Makerspace', href: '/seattle/makerspace' },
    ],
  },

  'office-space-rental': {
    title: 'Office Space Rental in Seattle, WA | FindStudioSpace',
    metaDescription:
      'Find office space for rent in Seattle, WA. Private offices, creative suites, and coworking spaces with flexible terms.',
    h1: 'Office Space Rental in Seattle, WA',
    intro:
      'Browse private offices, creative suites, and shared coworking spaces available to rent in Seattle, WA. Flexible monthly and long-term options across Capitol Hill, South Lake Union, Fremont, Belltown, and beyond.',
    listingType: 'office',
    faqs: [
      { q: 'How much does office space cost in Seattle?', a: 'Seattle office rentals range from $400–$4,000/month depending on size, location, and amenities. South Lake Union and Belltown run higher; emerging creative neighborhoods like Georgetown and Fremont offer better value.' },
      { q: 'Are there short-term office rentals in Seattle?', a: 'Yes. Many Seattle spaces offer month-to-month or even weekly terms. This is common in coworking and creative office buildings.' },
      { q: 'What neighborhoods have office space in Seattle?', a: 'South Lake Union, Capitol Hill, Belltown, Fremont, Ballard, Georgetown, and Pioneer Square all have strong office inventory.' },
      { q: 'Can I rent a private office by the day in Seattle?', a: 'Yes. Several Seattle coworking spaces offer day passes and dedicated desk rentals in addition to monthly memberships.' },
      { q: 'Is parking available at Seattle office rentals?', a: 'Parking availability varies significantly. Capitol Hill and Belltown have limited street parking; Georgetown and SoDo generally have better parking. Confirm with the host.' },
    ],
    related: [
      { label: 'Retail Space for Rent', href: '/seattle/retail-space-for-rent' },
      { label: 'Studio Space Rental', href: '/seattle/studio-space-rental' },
      { label: 'Art Studio for Rent', href: '/seattle/art-studio-rental' },
    ],
  },

  'fitness-studio-rental': {
    title: 'Fitness & Dance Studio Rental in Seattle, WA | FindStudioSpace',
    metaDescription:
      'Rent a fitness or dance studio in Seattle, WA. Yoga studios, dance floors, and movement spaces available for monthly rental.',
    h1: 'Fitness & Dance Studio Rental in Seattle, WA',
    intro:
      'Find fitness studios, yoga spaces, and dance floors available for monthly rent in Seattle, WA. Whether you\'re an instructor looking for a permanent teaching space or a practitioner who needs dedicated studio access, Seattle has options across every neighborhood.',
    listingType: 'fitness',
    faqs: [
      { q: 'How much does a fitness studio cost to rent in Seattle per month?', a: 'Monthly fitness and yoga studio rentals in Seattle range from $600–$3,000/month depending on size, features, and neighborhood.' },
      { q: 'Do Seattle fitness studios have mirrors and sprung floors?', a: 'Some do. Check individual listings for specific features — mirrored walls, sprung floors, and sound systems are mentioned for studios that have them.' },
      { q: 'Can I use a rented Seattle fitness studio for teaching classes?', a: 'Yes. Most studios available for monthly rent allow instruction and class use. Some require proof of insurance for regular programming.' },
      { q: 'What neighborhoods have fitness and dance studios in Seattle?', a: 'Fitness and movement studios are concentrated in Capitol Hill, Fremont, Belltown, and the Central District.' },
      { q: 'Are yoga studios available for monthly rental in Seattle?', a: 'Yes. Several listings are dedicated yoga and movement spaces available for monthly sublease.' },
    ],
    related: [
      { label: 'Art Studio for Rent', href: '/seattle/art-studio-rental' },
      { label: 'Studio Space Rental', href: '/seattle/studio-space-rental' },
      { label: 'Workshop Space', href: '/seattle/workshop-space-rental' },
    ],
  },

  'retail-space-for-rent': {
    title: 'Retail Space for Rent in Seattle, WA | FindStudioSpace',
    metaDescription:
      'Find retail space for rent in Seattle, WA. Storefronts, pop-up spaces, and commercial retail listings across Seattle neighborhoods.',
    h1: 'Retail Space for Rent in Seattle, WA',
    intro:
      'Browse retail storefronts, pop-up spaces, and commercial listings available to rent in Seattle, WA. From busy Capitol Hill corridors to Fremont, Ballard, and Pioneer Square, find the right space for your business.',
    listingType: 'retail',
    faqs: [
      { q: 'How much does retail space cost in Seattle?', a: 'Seattle retail rents range from $1,500/month for smaller spaces to $8,000+ for high-traffic locations in Capitol Hill, Fremont, or Belltown.' },
      { q: 'Are there short-term retail leases in Seattle?', a: 'Yes. Pop-up and short-term retail is increasingly common in Seattle, especially in mixed-use developments.' },
      { q: 'What are the best retail neighborhoods in Seattle?', a: 'Capitol Hill, Fremont, Ballard, Pioneer Square, and the Central District are among the strongest corridors for independent businesses.' },
      { q: 'Can I use a Seattle retail space for events or classes?', a: 'Some retail spaces are zoned for mixed use and can accommodate events. Confirm permitted uses with the landlord.' },
      { q: 'Do Seattle retail spaces require a personal guarantee?', a: 'Many small-business retail leases in Seattle require a personal guarantee, especially for longer terms.' },
    ],
    related: [
      { label: 'Office Space Rental', href: '/seattle/office-space-rental' },
      { label: 'Art Studio for Rent', href: '/seattle/art-studio-rental' },
      { label: 'Studio Space Rental', href: '/seattle/studio-space-rental' },
    ],
  },

  'studio-space-rental': {
    title: 'Studio Space Rental in Seattle, WA | FindStudioSpace',
    metaDescription:
      'Find monthly studio space for rent in Seattle, WA. Browse listings for art studios, workshops, offices, photo studios, and creative workspaces.',
    h1: 'Studio Space Rental in Seattle, WA',
    intro:
      'FindStudioSpace is a directory of monthly studio rentals in Seattle, WA. Browse listings across art studios, workshops, creative offices, photo studios, and maker spaces. Submit an inquiry directly from any listing and the host will follow up.',
    listingType: null,
    faqs: [
      {
        q: 'How do I find monthly studio space in Seattle?',
        a: 'Browse listings by category or neighborhood using the filters above. Each listing shows monthly pricing, location, and photos. Submit an inquiry directly through any listing page to contact the host.',
      },
      {
        q: 'What does monthly studio space cost in Seattle?',
        a: 'Monthly studio rentals in Seattle typically range from $400 for small shared spaces to $4,000+ for large private studios. Most artist studios fall between $600–$1,800/month.',
      },
      {
        q: 'Do I need a long-term lease to rent studio space in Seattle?',
        a: 'Most listings on FindStudioSpace offer month-to-month terms. Some require a 3–6 month minimum. Check individual listing descriptions before inquiring.',
      },
      {
        q: 'What types of creative studio space are available in Seattle?',
        a: 'Seattle has art studios, woodworking and fabrication shops, photo studios, podcast studios, dance studios, and production-focused creative spaces.',
      },
      {
        q: 'Which Seattle neighborhoods have the most studio space?',
        a: 'Capitol Hill, Georgetown, Fremont, and Ballard have the highest concentration of creative studio space. SoDo and Georgetown offer the best value for larger production spaces.',
      },
    ],
    related: [
      { label: 'Photo Studios', href: '/seattle/photo-studios' },
      { label: 'Art Studio for Rent', href: '/seattle/art-studio-rental' },
      { label: 'Workshop Space for Rent', href: '/seattle/workshop-space-rental' },
    ],
  },

  'capitol-hill': {
    title: 'Studio Space for Rent in Capitol Hill Seattle | FindStudioSpace',
    metaDescription:
      'Find monthly studio, workshop, and creative space for rent in Seattle\'s Capitol Hill neighborhood. Art studios, creative offices, and production spaces.',
    h1: 'Studio Space for Rent in Capitol Hill, Seattle',
    intro:
      'Capitol Hill is Seattle\'s creative and cultural center — dense, walkable, and home to the city\'s arts community, independent businesses, and night scene. Find monthly studio, creative office, and workshop space in Seattle\'s most active creative neighborhood.',
    listingType: null,
    neighborhood: 'Capitol Hill',
    faqs: [
      {
        q: 'How much does studio space cost in Capitol Hill Seattle?',
        a: 'Studio and creative space rentals in Capitol Hill typically range from $700–$3,500/month depending on size and type.',
      },
      {
        q: 'What types of spaces are available in Capitol Hill?',
        a: 'Capitol Hill has photo studios, creative offices, retail storefronts, production spaces, and shared artist studios. Strong foot traffic makes it well suited for client-facing creative businesses.',
      },
      {
        q: 'Is Capitol Hill good for a studio practice?',
        a: 'Yes — Capitol Hill is Seattle\'s most walkable creative neighborhood with dense transit access, strong foot traffic, and a large community of working artists and creatives.',
      },
    ],
    related: [
      { label: 'Art Studio for Rent', href: '/seattle/art-studio-rental' },
      { label: 'Office Space Rental', href: '/seattle/office-space-rental' },
      { label: 'Photo Studios', href: '/seattle/photo-studios' },
    ],
  },

  'georgetown': {
    title: 'Studio Space for Rent in Georgetown Seattle | FindStudioSpace',
    metaDescription:
      'Find monthly art studio, workshop, and warehouse space for rent in Seattle\'s Georgetown neighborhood. Industrial creative spaces with high ceilings and loading access.',
    h1: 'Studio Space for Rent in Georgetown, Seattle',
    intro:
      'Georgetown is Seattle\'s industrial arts neighborhood — a grid of converted warehouses and light-industrial buildings south of downtown. High ceilings, loading docks, 220v power, and some of Seattle\'s lowest rents per square foot make it the top choice for makers, fabricators, and large-format artists. Find monthly studio and workshop space in Georgetown.',
    listingType: null,
    neighborhood: 'Georgetown',
    faqs: [
      {
        q: 'How much does studio space cost in Georgetown Seattle?',
        a: 'Georgetown offers some of Seattle\'s best value for large creative spaces. Monthly studios typically range from $400–$2,000/month — significantly lower per square foot than Capitol Hill or Belltown.',
      },
      {
        q: 'What types of spaces are available in Georgetown?',
        a: 'Georgetown has warehouse studios, fabrication shops, photo studios with loading access, woodworking bays, and flex industrial spaces. High ceilings are common.',
      },
      {
        q: 'Is Georgetown good for production or fabrication work?',
        a: 'Georgetown is Seattle\'s best neighborhood for production-heavy creative work. The industrial stock supports ceiling heights, power infrastructure, and loading access that is hard to find elsewhere in the city.',
      },
    ],
    related: [
      { label: 'Workshop Space for Rent', href: '/seattle/workshop-space-rental' },
      { label: 'Photo Studios', href: '/seattle/photo-studios' },
      { label: 'Makerspace', href: '/seattle/makerspace' },
    ],
  },

  'fremont': {
    title: 'Studio Space for Rent in Fremont Seattle | FindStudioSpace',
    metaDescription:
      'Find monthly studio and creative space for rent in Seattle\'s Fremont neighborhood. Art studios, offices, and maker spaces in Seattle\'s self-proclaimed Center of the Universe.',
    h1: 'Studio Space for Rent in Fremont, Seattle',
    intro:
      'Fremont is Seattle\'s quirky, creative neighborhood north of Lake Union — home to artists, tech workers, and independent businesses. Find monthly studio and office space in a walkable neighborhood with strong cycling access, a thriving arts scene, and a community of working creatives.',
    listingType: null,
    neighborhood: 'Fremont',
    faqs: [
      {
        q: 'How much does studio space cost in Fremont Seattle?',
        a: 'Monthly studio and office rentals in Fremont typically range from $600–$2,500/month. Pricing is moderate compared to Capitol Hill, with good walkability and cycling access.',
      },
      {
        q: 'What types of spaces are available in Fremont?',
        a: 'Fremont has art studios, small creative offices, retail storefronts, and workshop spaces. It\'s well suited for independent creatives and small creative businesses.',
      },
      {
        q: 'Is Fremont good for a creative practice?',
        a: 'Fremont has a strong arts community and a reputation for independent character. It\'s particularly well suited for practices that benefit from an active neighborhood and cycling-friendly infrastructure.',
      },
    ],
    related: [
      { label: 'Art Studio for Rent', href: '/seattle/art-studio-rental' },
      { label: 'Office Space Rental', href: '/seattle/office-space-rental' },
      { label: 'Capitol Hill', href: '/seattle/capitol-hill' },
    ],
  },

  'ballard': {
    title: 'Studio Space for Rent in Ballard Seattle | FindStudioSpace',
    metaDescription:
      'Find monthly studio, workshop, and creative space for rent in Seattle\'s Ballard neighborhood. Art studios, fabrication shops, and creative offices.',
    h1: 'Studio Space for Rent in Ballard, Seattle',
    intro:
      'Ballard is Seattle\'s maritime-industrial creative neighborhood — a mix of old fishing industry buildings, craft breweries, and a growing arts scene. Find monthly studio, workshop, and creative office space in a neighborhood with character and strong small-business community.',
    listingType: null,
    neighborhood: 'Ballard',
    faqs: [
      {
        q: 'How much does studio space cost in Ballard Seattle?',
        a: 'Monthly studio rentals in Ballard typically range from $500–$2,500/month. The neighborhood offers good value for mid-sized spaces with industrial character.',
      },
      {
        q: 'What types of spaces are available in Ballard?',
        a: 'Ballard has workshop and fabrication space, art studios, small creative offices, and retail storefronts. The maritime and craft tradition of the neighborhood shows in the availability of workshop-ready spaces.',
      },
      {
        q: 'Is Ballard good for a studio practice?',
        a: 'Yes — Ballard has a strong small-business and maker culture, good parking, and a community feel. It\'s particularly well suited for craftspeople, woodworkers, and independent producers.',
      },
    ],
    related: [
      { label: 'Workshop Space for Rent', href: '/seattle/workshop-space-rental' },
      { label: 'Art Studio for Rent', href: '/seattle/art-studio-rental' },
      { label: 'Georgetown', href: '/seattle/georgetown' },
    ],
  },

  'sodo': {
    title: 'Studio Space for Rent in SoDo Seattle | FindStudioSpace',
    metaDescription:
      'Find monthly warehouse, workshop, and production space for rent in Seattle\'s SoDo neighborhood. Large industrial spaces with loading access.',
    h1: 'Studio Space for Rent in SoDo, Seattle',
    intro:
      'SoDo — South of Downtown — is Seattle\'s industrial core: large warehouse spaces, loading docks, highway access, and some of the city\'s most affordable large-footprint studios. Find monthly production, workshop, and creative space in SoDo.',
    listingType: null,
    neighborhood: 'SoDo',
    faqs: [
      {
        q: 'How much does studio space cost in SoDo Seattle?',
        a: 'SoDo offers some of Seattle\'s best value for large production and warehouse spaces. Monthly studios typically range from $500–$3,000/month for significantly more square footage than you\'d get in Capitol Hill or Belltown.',
      },
      {
        q: 'What types of spaces are available in SoDo?',
        a: 'SoDo has warehouse production spaces, fabrication shops, event venues, and large-format creative studios. Drive-in loading access and high ceilings are common.',
      },
      {
        q: 'Is SoDo good for production or event use?',
        a: 'SoDo is Seattle\'s best option for production-heavy work requiring large footprints, vehicle access, or high ceilings. Many event and production companies are based here.',
      },
    ],
    related: [
      { label: 'Georgetown', href: '/seattle/georgetown' },
      { label: 'Workshop Space for Rent', href: '/seattle/workshop-space-rental' },
      { label: 'Event Space', href: '/seattle/event-space' },
    ],
  },
}
