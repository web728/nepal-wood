// Single source of event facts. Every value is traced in ../../content/content-master.md.
// Values marked `tentative` are sensible defaults shown with a "tentative" label until the organiser confirms them.

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://nepalwood.com.np').replace(/\/$/, '');

export const event = {
  name: 'Nepal Wood International Expo 2027',
  shortName: 'Nepal Wood 2027',
  edition: '12th',
  editionNumber: 12,
  startDate: '2027-01-28',
  endDate: '2027-01-31',
  datesLabel: '28–31 January 2027',
  datesShort: '28–31 Jan 2027',
  weekdays: 'Thursday to Sunday',
  days: 4,
  hours: { open: '11:00', close: '18:00', label: '11:00 AM – 6:00 PM', tentative: true },
  // Countdown targets opening time in Nepal (UTC+5:45).
  countdownTarget: '2027-01-28T11:00:00+05:45',
  venue: {
    name: 'Bhrikuti Mandap',
    full: 'Bhrikuti Mandap Exhibition Complex',
    street: 'Pradarshani Marg',
    city: 'Kathmandu',
    country: 'Nepal',
    countryCode: 'NP',
    geo: { lat: 27.7006, lng: 85.3188 },
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Bhrikuti+Mandap+Exhibition+Hall+Kathmandu',
    embedUrl: 'https://www.google.com/maps?q=Bhrikuti+Mandap+Exhibition+Hall,+Kathmandu&output=embed',
  },
  badgePrefix: 'NW27',
};

/** Organiser-published figures (2027 brochure and post-show reports). 2027 values are projections. */
export const stats = {
  expectedVisitors: 17000,
  brands: 250,
  areaSqft: 60000,
  countries: 7,
  productsOnDisplay: 1500,
  lastEditionVisitors: 15000,
  seniorManagementPct: 75,
  exhibitorSatisfactionPct: 94.2,
  reconfirmationPct: 100,
  workforce: 300000,
};

export const headlineStats = [
  { value: stats.expectedVisitors, suffix: '+', label: 'Trade visitors expected' },
  { value: stats.brands, suffix: '+', label: 'Exhibiting brands' },
  { value: stats.areaSqft, suffix: '+', label: 'Sq ft of exhibition space' },
  { value: event.days, suffix: '', label: 'Show days, a first for the expo' },
];

export const organisers = [
  {
    id: 'futurex',
    name: 'Futurex Trade Fair and Events Pvt. Ltd.',
    short: 'Futurex',
    logo: '/partners/futurex.svg',
    url: 'https://www.futurextrade.com',
    city: 'New Delhi, India',
    since: 2011,
    blurb:
      'A New Delhi-based international exhibition and corporate events organiser, established in 2011, with branch offices in Mumbai, Colombo, Kathmandu and Dhaka. Futurex has delivered 300+ trade exhibitions and conferences across woodworking, textiles, building and infrastructure, agriculture, power, education and packaging.',
    tagline: 'Where Business Meets Opportunities.',
  },
  {
    id: 'mediaspace',
    name: 'Media Space Solutions Pvt. Ltd.',
    short: 'Media Space',
    logo: '/partners/media-space.svg',
    url: null as string | null,
    city: 'Kathmandu, Nepal',
    since: 2009,
    blurb:
      'Founded in 2009 in digital media and event management, Media Space Solutions now runs a portfolio of exhibitions across infrastructure, engineering and agriculture. It is one of Nepal’s largest commercial trade show organisers, combining a global marketing network with deep local connections.',
    tagline: 'Exhibitions · Conferences · Events',
  },
];

export const partners = {
  lanyard: [{ name: 'Action TESA', logo: '/partners/action-tesa.webp', note: 'Trusted interior panel brand' }],
  concurrent: [{ name: 'Hometex Nepal — Home Textile & Home Decor Exhibition', logo: '/partners/hometex-nepal.webp' }],
  supportedBy: [
    { name: 'Interior Designers Association of Nepal (IDEA Nepal)', logo: '/partners/idea-nepal.webp' },
    { name: 'Nepal Plywood Manufacturers’ Association', logo: '/partners/nepal-plywood-manufacturers-association.webp' },
    { name: 'Federation of Forest Based Industry and Trade Nepal (FenFIT)', logo: '/partners/fenfit-nepal.webp' },
    { name: 'Federation of Community Forestry Users Nepal (FECOFUN)', logo: '/partners/fecofun.webp' },
    { name: 'Wood Technologist Association', logo: '/partners/wood-technologist-association.webp' },
  ],
  media: [
    { name: 'Ply Insight', logo: '/partners/ply-insight.webp' },
    { name: 'Ply World', logo: '/partners/ply-world.webp' },
    { name: 'Modern Woodwork', logo: '/partners/modern-woodwork.webp' },
    { name: 'Woodage India.com', logo: '/partners/woodage-india.webp' },
    { name: 'Ply Gazette', logo: '/partners/ply-gazette.webp' },
  ],
  pastCoSponsor: [{ name: 'E3 Group', logo: '/partners/e3-group.webp', note: 'Co-sponsor, 11th edition' }],
};

export const contacts = [
  { name: 'Mr. Namit Gupta', role: 'Stall booking · India & international', phone: '+91 98108 55697', email: 'namit@futurextrade.com', whatsapp: '919810855697' },
  { name: 'Ms. Jagriti Pandey', role: 'Stall booking & sponsorship', phone: '+91 88512 28446', email: 'jagriti@futurextrade.com', whatsapp: '918851228446' },
  { name: 'Mr. Srijal Bhattarai', role: 'Nepal secretariat · visitors & local exhibitors', phone: '+977 980-1171141', email: 'info@mss.com.np', whatsapp: '9779801171141' },
];

export const offices = [
  { name: 'Futurex Trade Fair and Events Pvt. Ltd.', lines: ['E-52, 1st Floor, Kalkaji', 'New Delhi 110019, India'], phone: '+91 11 2621 0821' },
  { name: 'Media Space Solutions Pvt. Ltd.', lines: ['Kathmandu, Nepal'], phone: '+977 980-1171141' },
];

export const social = {
  linkedin: 'https://www.linkedin.com/company/nepalwoodexpo/',
};

export const whatsappDefault = contacts[2].whatsapp;

export type NavItem = { label: string; href?: string; items?: { label: string; href: string; desc?: string }[] };

export const nav: NavItem[] = [
  {
    label: 'About',
    items: [
      { label: 'About the expo', href: '/about-show', desc: 'Twelve editions of Nepal’s wood industry show' },
      { label: 'Organisers', href: '/about-organizers', desc: 'Futurex and Media Space' },
      { label: 'Past editions', href: '/past-editions', desc: 'Timeline, results and reports' },
      { label: 'Gallery', href: '/gallery', desc: 'Photos from recent editions' },
    ],
  },
  {
    label: 'Exhibit',
    items: [
      { label: 'Why exhibit', href: '/why-exhibit', desc: 'Buyers, demos and market reach' },
      { label: 'Exhibitor profile', href: '/exhibitor-profile', desc: 'Five product zones' },
      { label: 'Book a stand', href: '/exhibitor-registration', desc: 'Space enquiry in two minutes' },
      { label: 'Sponsorship', href: '/sponsorship', desc: 'Branding and partnerships' },
      { label: 'Exhibitor list 2027', href: '/exhibitors', desc: 'Confirmed exhibitors' },
    ],
  },
  {
    label: 'Visit',
    items: [
      { label: 'Why visit', href: '/why-visit', desc: 'Source, compare and learn' },
      { label: 'Visitor profile', href: '/visitor-profile', desc: 'Who attends' },
      { label: 'Register free', href: '/visitor-registration', desc: 'Get your QR entry badge' },
      { label: 'Plan your visit', href: '/venue', desc: 'Venue, hours and travel' },
    ],
  },
  { label: 'Seminars', href: '/seminars' },
  { label: 'FAQ', href: '/faq' },
  { label: 'Contact', href: '/contact' },
];

export const downloads = {
  brochure: { file: '/downloads/nepal-wood-expo-2027-brochure.pdf', label: '2027 event brochure', size: '3.1 MB' },
  reports: [
    { edition: '11th', dates: '19–21 Dec 2025', file: '/downloads/nepal-wood-11th-edition-post-show-report.pdf', size: '2.2 MB' },
    { edition: '10th', dates: '17–19 Jan 2025', file: '/downloads/nepal-wood-10th-edition-post-show-report.pdf', size: '3.1 MB' },
    { edition: '8th', dates: '27–29 Jan 2023', file: '/downloads/nepal-wood-8th-edition-post-show-report.pdf', size: '1.5 MB' },
    { edition: '7th', dates: '7–9 Jan 2022', file: '/downloads/nepal-wood-7th-edition-post-show-report.pdf', size: '1.5 MB' },
  ],
};

export const telHref = (phone: string) => `tel:${phone.replace(/[^+\d]/g, '')}`;
export const waHref = (num: string, text = 'Hello, I would like to know more about Nepal Wood International Expo 2027.') =>
  `https://wa.me/${num}?text=${encodeURIComponent(text)}`;
