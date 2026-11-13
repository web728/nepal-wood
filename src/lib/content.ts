// Editorial content shared across pages. Facts trace to content/content-master.md.
import type { StaticImageData } from 'next/image';
import panelsImg from '@/assets/photos/panels-display.jpg';
import machineImg from '@/assets/photos/panel-saw-demo.jpg';
import furnitureImg from '@/assets/photos/interior-display.jpg';
import interiorImg from '@/assets/photos/wall-panels.jpg';
import toolsImg from '@/assets/photos/tools-booth.jpg';
import { event } from './site';

export type Zone = {
  slug: string;
  no: string;
  title: string;
  short: string;
  img: StaticImageData;
  alt: string;
  items: string[];
  intro: string;
  forWho: string[];
  seoTitle: string;
  seoDesc: string;
  keyword: string;
};

export const zones: Zone[] = [
  {
    slug: 'wood-panel-products',
    no: '01',
    title: 'Wood & Panel Products',
    short: 'Plywood, MDF, laminates and veneers',
    img: panelsImg,
    alt: 'Laminate and panel samples on display at a Nepal Wood exhibitor stand',
    items: ['Plywood, blockboard & MDF', 'Particle board & pre-laminated boards', 'Laminates & decorative surfaces', 'Veneers & engineered wood', 'Hardwood, softwood & sawn timber', 'PVC/WPC boards & door skins'],
    intro: 'Boards and surfaces are the materials Nepal’s furniture makers and interior contractors buy every week. This zone brings plywood mills, laminate brands, veneer houses and timber traders face to face with the dealers, fabricators and architects who specify them.',
    forWho: ['Plywood, MDF and particle board manufacturers', 'Laminate, veneer and decorative surface brands', 'Timber importers and saw mills', 'Board distributors looking for Nepal dealers'],
    seoTitle: 'Plywood, Laminates & Panel Products Expo in Nepal',
    seoDesc: 'Exhibit plywood, MDF, laminates, veneers and engineered wood at Nepal Wood International Expo 2027, 28–31 January, Bhrikuti Mandap, Kathmandu.',
    keyword: 'plywood and laminate exhibition Nepal',
  },
  {
    slug: 'woodworking-machinery',
    no: '02',
    title: 'Woodworking Machinery',
    short: 'CNC, panel saws, edge banders, automation',
    img: machineImg,
    alt: 'Visitors inspecting a sliding panel saw at a machinery stand',
    items: ['CNC routers & nesting machines', 'Panel saws & beam saws', 'Edge banding machines', 'Drilling, boring & routing', 'Sanding, finishing & spray lines', 'Saw milling & veneer peeling', 'Dust extraction', 'Automation & robotics'],
    intro: 'Machinery is the zone visitors come for first. About 30% of visitors name woodworking machinery and dust control as their main interest. Bring your machines, run them live on the floor, and let furniture factories see the cut quality, speed and finish for themselves.',
    forWho: ['Machinery manufacturers and their Nepal dealers', 'CNC and automation suppliers', 'Saw-mill and veneer-line makers', 'Tooling, spares and service companies'],
    seoTitle: 'Woodworking Machinery Exhibition in Nepal',
    seoDesc: 'Show CNC routers, panel saws, edge banders and automation to Nepal’s furniture factories at Nepal Wood International Expo 2027, Kathmandu.',
    keyword: 'woodworking machinery exhibition Nepal',
  },
  {
    slug: 'furniture-production-technology',
    no: '03',
    title: 'Furniture & Production Technology',
    short: 'Modular systems and factory technology',
    img: furnitureImg,
    alt: 'Visitors examining a scale model of modular interiors',
    items: ['Modular furniture systems', 'Kitchen & wardrobe systems', 'Furniture manufacturing technology', 'Upholstery, foam & accessories', 'Office, residential & commercial furniture', 'Design & production software'],
    intro: 'From modular kitchens to office systems, this zone shows how furniture is designed, engineered and produced at scale. It suits furniture brands looking for dealers, and technology providers helping Nepal’s workshops become factories.',
    forWho: ['Furniture brands and manufacturers', 'Modular kitchen and wardrobe system brands', 'Upholstery, foam and accessory suppliers', 'Design and production software companies'],
    seoTitle: 'Furniture & Production Technology Expo in Nepal',
    seoDesc: 'Present modular furniture, kitchen systems and furniture production technology at Nepal Wood International Expo 2027 in Kathmandu.',
    keyword: 'furniture exhibition Nepal',
  },
  {
    slug: 'furnishing-interior-products',
    no: '04',
    title: 'Furnishing & Interior Products',
    short: 'Flooring, doors, wall panels and décor',
    img: interiorImg,
    alt: 'Fabric, ripple and fluted wall panels displayed at a stand',
    items: ['Wood, laminate & SPC flooring', 'Doors, frames & windows', 'Decorative & fluted wall panels', 'Ceilings & soffits', 'Interior décor materials', 'Lighting for interiors'],
    intro: 'Architects, interior designers and builders walk this zone to find the finishes for their next project. Show your flooring, doors, panels and décor where specification decisions are made.',
    forWho: ['Flooring and door manufacturers', 'Wall panel and ceiling brands', 'Interior décor and lighting suppliers', 'Importers of interior finishes'],
    seoTitle: 'Flooring, Doors & Interior Products Expo in Nepal',
    seoDesc: 'Exhibit flooring, doors, wall panels and interior décor to Nepal’s architects, designers and builders at Nepal Wood Expo 2027.',
    keyword: 'interior products exhibition Kathmandu',
  },
  {
    slug: 'tools-hardware-raw-materials',
    no: '05',
    title: 'Tools, Hardware & Raw Materials',
    short: 'Fittings, adhesives, coatings and tools',
    img: toolsImg,
    alt: 'Visitors browsing power tools at a Bosch stand',
    items: ['Furniture fittings, hinges & handles', 'Locks & hardware systems', 'Adhesives & woodworking chemicals', 'Coatings, polishes & paints', 'Power tools, blades & cutters', 'Abrasives & edge banding materials', 'Packaging materials'],
    intro: 'Every workshop needs hinges, glue, finishes and blades, and buys them again and again. This zone connects hardware, chemical and tool brands with the carpenters, fabricators and distributors who reorder all year.',
    forWho: ['Furniture hardware and fittings brands', 'Adhesive, coating and chemical manufacturers', 'Power-tool, blade and cutter brands', 'Distributors seeking Nepal partners'],
    seoTitle: 'Furniture Hardware, Coatings & Tools Expo in Nepal',
    seoDesc: 'Show furniture fittings, adhesives, coatings, power tools and raw materials at Nepal Wood International Expo 2027, Kathmandu.',
    keyword: 'furniture hardware exhibition Nepal',
  },
];

export const editions = [
  { year: '2016', ed: '2nd', dates: 'April 2016', note: '100+ participating companies across about 110 stalls, as reported by The Himalayan Times.' },
  { year: '2019', ed: '5th', dates: '15–17 Feb 2019', note: 'The show was by now Nepal’s focused trade fair for woodworking and furniture technology.' },
  { year: '2020', ed: '6th', dates: '31 Jan – 2 Feb 2020', note: 'Exhibitors from Nepal, India, China, Malaysia and Italy; the last edition before the pandemic.' },
  { year: '2022', ed: '7th', dates: '7–9 Jan 2022', note: 'Held under COVID-19 protocols. 20,000+ business visitors were reported despite the restrictions.', report: '7th' },
  { year: '2023', ed: '8th', dates: '27–29 Jan 2023', note: 'Alongside Nepal MUF Technology Expo and the 4th Nepal Furniture & Home Décor Expo. 10,000+ business visitors.', report: '8th' },
  { year: '2024', ed: '9th', dates: '5–7 Jan 2024', note: 'Concurrent with the 2nd Mattress, Upholstery & Furnishing Expo.' },
  { year: '2025', ed: '10th', dates: '17–19 Jan 2025', note: 'Ten years of the expo. 15,000+ trade visitors, and seminars on timber and on design.', report: '10th' },
  { year: '2025', ed: '11th', dates: '19–21 Dec 2025', note: 'Co-sponsored by E3 Group, with exhibitors from India, China, Malaysia, Germany and Taiwan. 15,000+ trade visitors.', report: '11th' },
  { year: '2027', ed: '12th', dates: '28–31 Jan 2027', note: 'The first four-day edition, with Hometex Nepal alongside.', current: true },
];

export const visitorGroups = [
  'Architects, interior designers, builders & developers',
  'Consultants & government officers',
  'Manufacturers & traders of furniture, kitchens and wood products',
  'Dealers & distributors of machines, laminates, hardware and fittings',
  'Office furniture manufacturers',
  'Saw millers, board & timber traders, plywood & packaging professionals',
  'Industry associations & importers of laminates',
];

export const jobProfile = [
  { label: 'Manager / head of department', v: 28 },
  { label: 'Chairman / CEO / president', v: 25 },
  { label: 'Director / vice president', v: 22 },
  { label: 'Sales / business development', v: 14 },
  { label: 'Consultant', v: 8 },
  { label: 'Others', v: 3 },
];

export const interest = [
  { label: 'Woodworking machinery & dust control', v: 30 },
  { label: 'Plywood, veneer, MDF & laminates', v: 22 },
  { label: 'Hardwood & softwood', v: 16 },
  { label: 'Flooring, doors, furniture & fittings', v: 10 },
  { label: 'Coatings, paints & adhesives', v: 10 },
  { label: 'Tools, blades & cutters', v: 5 },
  { label: 'Associations & government', v: 5 },
  { label: '3D software', v: 2 },
];

export const seminars = [
  {
    slug: 'timber-transformation-2025',
    date: '18 Jan 2025',
    iso: '2025-01-18',
    ed: '10th edition',
    title: 'Timber Transformation: Charting Nepal’s Sustainable Industrial Future',
    text: 'A one-day seminar for industry leaders, policymakers and innovators on sustainable growth in timber and woodworking.',
    sessions: ['Scope & strategy of timber plantation in Nepal: sustainable forestry, government incentives, plantation economics', 'Role of quality-control parameters: global standards, technology-driven assessment and certification', 'Process automation solutions: AI and smart automation for cost, efficiency and ROI', 'Panel discussion, Q&A and networking'],
  },
  {
    slug: 'celebrating-design-spaces-2025',
    date: '19 Jan 2025',
    iso: '2025-01-19',
    ed: '10th edition',
    title: 'Celebrating Design & Spaces',
    text: 'A day with the Interior Designers’ Association of Nepal, bringing leading architects and interior designers together on the trends shaping design.',
    sessions: ['Creative approaches to space utilisation', 'Sustainable design practice and modern material applications', 'Adapting global inspiration to Nepal’s context', 'Panel discussion and networking with manufacturers'],
  },
  {
    slug: 'nepalese-materials-2025',
    date: '20 Dec 2025',
    iso: '2025-12-20',
    ed: '11th edition',
    title: 'Modern Interior Design Practices & the Integration of Nepalese Materials',
    text: 'Learning through material exhibitions: how lokta paper, Himalayan nettle, bamboo composites and traditional stone finishes work in modern interiors.',
    sessions: ['Curated displays of indigenous materials', 'Performance metrics, sourcing challenges and fabrication techniques', 'Case studies of Nepalese materials in commercial and residential projects', 'Outcome: two academic collaborations initiated for material research'],
  },
];

export const whyExhibit = [
  { icon: 'users', t: 'Meet buyers who sign the orders', d: `75% of visitors hold senior roles (chairman, CEO, director, VP or head of department), and they come to source.` },
  { icon: 'saw', t: 'Run your machines live', d: 'Demonstrate CNC routers, edge banders and panel saws on the floor. Tell us your power, compressed-air and floor-load needs in advance.' },
  { icon: 'handshake', t: 'Find distributors and partners', d: 'Meet dealers, importers, contractors and associations from across Nepal’s seven provinces, plus visitors from India and beyond.' },
  { icon: 'trend', t: 'Ride Nepal’s construction growth', d: 'Get in front of decision-makers from major construction and interior projects in one of the region’s fastest-growing markets.' },
  { icon: 'megaphone', t: 'Promotion that reaches the whole country', d: 'City roadshows (14 cities in November 2024), plus newspapers, TV, radio, hoardings, Google Ads, SMS, e-mailers and WhatsApp campaigns.' },
  { icon: 'spark', t: 'Launch where the trade is watching', d: 'National media covered the last edition. Use the show to launch products, sign dealers and announce partnerships.' },
];

export const whyVisit = [
  { icon: 'layers', t: 'Compare suppliers in one place', d: '250+ brands across boards, machines, hardware and finishes, with domestic and international suppliers side by side.' },
  { icon: 'saw', t: 'See machines run before you buy', d: 'Watch live demonstrations, check cut quality and finish, and talk directly to the technicians.' },
  { icon: 'trend', t: 'Get show-floor offers', d: 'Exhibitors bring their best terms for the show days, and many visitors close orders on the spot.' },
  { icon: 'mic', t: 'Learn at the seminars', d: 'Sessions on timber, quality standards, automation and interior design, with industry associations.' },
  { icon: 'handshake', t: 'Find new product lines', d: 'Dealers and distributors meet brands looking for Nepal partners.' },
  { icon: 'ticket', t: 'Free for trade visitors', d: 'Register online in two minutes and get a QR badge for fast entry on all four days.' },
];

export const standOptions = [
  {
    t: 'Shell scheme stand',
    from: 'From 9 sqm (3 m × 3 m)',
    d: 'A ready-built stand: you arrive, set up your products and start selling. Best for first-time exhibitors and material or hardware brands.',
    inc: ['Partition walls & fascia with your company name', 'Carpet', '1 table & 2 chairs', 'Spotlights & 1 power socket', 'Listing in the exhibitor directory'],
  },
  {
    t: 'Raw space',
    from: 'From 18 sqm',
    d: 'Bare floor for your own custom-built stand. Best for machinery demonstrations, large displays and brand pavilions.',
    inc: ['Floor space only, so you design and build the stand', 'Power and 3-phase connections on request', 'Heavy-machinery placement & unloading support', 'Listing in the exhibitor directory'],
    featured: true,
  },
  {
    t: 'Premium & pavilions',
    from: '36 sqm and above',
    d: 'Corner and island positions, high-footfall locations and country or company pavilions.',
    inc: ['Prime locations near entrances and seminars', 'Multiple open sides', 'Pavilion branding', 'Bundled sponsorship options'],
  },
];

export const sponsorships = [
  { t: 'Title partner', tier: 'Exclusive · 1 available', d: 'Your brand on the event name across all promotion, signage and badges, with keynote and inauguration presence.', perks: ['“Presented by” lockup on all marketing', 'Prime raw-space stand', 'Inauguration stage presence', 'Logo on every visitor badge & website header'] },
  { t: 'Platinum partner', tier: 'Limited', d: 'Top-tier visibility across the venue and campaign, plus a premium stand location.', perks: ['Logo on hoardings, backdrop & website', 'Premium stand location', 'Seminar speaking slot', 'Social & email features'] },
  { t: 'Gold partner', tier: 'Limited', d: 'Strong visibility across venue branding and digital campaigns.', perks: ['Logo on venue branding & website', 'Brochure & visitor-guide placement', 'Social media features'] },
  { t: 'Lanyard partner', tier: 'Confirmed: Action TESA', d: 'Your logo around the neck of every visitor and exhibitor, for all four days.', perks: ['Lanyards for all badges'], taken: true },
  { t: 'Registration & badge partner', tier: 'Exclusive', d: 'Your brand on the online registration, the confirmation email and every printed badge.', perks: ['Logo on registration pages & emails', 'Branding at registration counters', 'Logo on printed badges'] },
  { t: 'Seminar partner', tier: 'Per session', d: 'Host a knowledge session and speak to architects, designers and factory owners.', perks: ['Session naming & stage branding', 'Speaking slot', 'Attendee list (with consent)'] },
  { t: 'Entrance & venue branding', tier: 'Multiple', d: 'Entrance arches, hall gates, aisle banners and outdoor hoardings at Bhrikuti Mandap.', perks: ['High-footfall placements', 'Combine with any stand package'] },
  { t: 'Visitor bag partner', tier: 'Exclusive', d: 'Branded bags carried through the halls and home to offices and factories.', perks: ['Logo on visitor bags', 'Insert your brochure'] },
];

export const faqs: { group: string; items: { q: string; a: string }[] }[] = [
  {
    group: 'Visiting',
    items: [
      { q: 'When and where is Nepal Wood International Expo 2027?', a: `${event.datesLabel} (${event.weekdays}) at ${event.venue.full}, ${event.venue.street}, ${event.venue.city}, Nepal. It is the 12th edition and the first to run for four days.` },
      { q: 'What are the opening hours?', a: `Planned daily hours are ${event.hours.label}. Final timings will be confirmed by email to registered visitors and posted on this site.` },
      { q: 'Is entry free?', a: 'Yes. Entry is free for trade and business visitors who register. Register online to get a QR badge and skip the registration queue.' },
      { q: 'Who can visit?', a: 'This is a trade show for industry professionals: furniture and kitchen manufacturers, architects, interior designers, builders, contractors, dealers, distributors, importers, saw millers and timber traders, consultants and government officers. Students of architecture and design are welcome to the seminars.' },
      { q: 'What should I bring?', a: 'Your QR badge (on your phone or printed) and a business card, company ID or photo ID. Bring catalogues or drawings if you plan to discuss specific projects with exhibitors.' },
      { q: 'How do I get to Bhrikuti Mandap?', a: 'Bhrikuti Mandap is on Pradarshani Marg in central Kathmandu, about 5.5 km from Tribhuvan International Airport (20–30 minutes by taxi). Taxis and ride apps such as Pathao and inDrive drop you at the gate, and city buses run via Ratna Park.' },
    ],
  },
  {
    group: 'Exhibiting',
    items: [
      { q: 'How do I book a stand?', a: 'Send a stand enquiry through the “Book a stand” form. The sales team will reply with the floor plan, available positions and a quote, usually within one working day. You can also call or WhatsApp the team directly.' },
      { q: 'What stand types are available?', a: 'Shell scheme stands from 9 sqm (ready-built with walls, fascia, carpet, furniture and lighting), raw space from 18 sqm for custom stands and machinery, and premium corner, island and pavilion positions.' },
      { q: 'What does a stand cost?', a: 'Rates depend on stand type, size and location, and are shared with the floor plan in your quote. Early bookings get the widest choice of positions.' },
      { q: 'Can I demonstrate heavy machinery?', a: 'Yes. Live demonstrations are a highlight of the show. Tell us the machine weight, dimensions and power requirements (including 3-phase) in your enquiry so we can plan floor load, unloading and connections.' },
      { q: 'Do you help international exhibitors?', a: 'Yes. Our India and international desk supports overseas exhibitors with stand planning, freight forwarding contacts, invitation letters and hotel suggestions.' },
      { q: 'What sponsorship opportunities are there?', a: 'Title, Platinum and Gold partnerships, registration and badge branding, seminar sessions, visitor bags and venue branding. The lanyard partnership for 2027 is confirmed with Action TESA.' },
    ],
  },
  {
    group: 'Registration & badges',
    items: [
      { q: 'I registered but lost my badge. What do I do?', a: 'Register again with the same email address and you will see the same badge, or ask at the registration desk with your ID.' },
      { q: 'Can I register colleagues?', a: 'Each person needs their own badge, since badges are personal. For group or delegation registrations, contact the Nepal secretariat.' },
      { q: 'How is my data used?', a: 'Your details are used to issue your badge and to send you show updates. Exhibitors only receive your details if you choose to share them. See the privacy policy.' },
    ],
  },
];

export const countries = ['Nepal', 'India', 'China', 'Malaysia', 'Germany', 'Taiwan', 'Italy', 'Turkey', 'Bangladesh', 'Bhutan', 'Sri Lanka', 'Thailand', 'Vietnam', 'Indonesia', 'Japan', 'South Korea', 'United Arab Emirates', 'United Kingdom', 'United States', 'Other'];

export const businessTypes = [
  'Furniture / kitchen manufacturer',
  'Architect / interior designer',
  'Builder / developer / contractor',
  'Dealer / distributor / retailer',
  'Importer / trader',
  'Saw mill / timber / board trader',
  'Carpenter / workshop owner',
  'Consultant',
  'Government / association',
  'Student / academic',
  'Other',
];

export const interestOptions = interest.map((i) => i.label);

export const heardFrom = ['Newspaper / magazine', 'Facebook / Instagram', 'LinkedIn', 'Google search', 'WhatsApp / SMS', 'Roadshow / invitation', 'Hoarding / banner', 'Colleague / friend', 'Exhibitor invited me', 'Other'];
