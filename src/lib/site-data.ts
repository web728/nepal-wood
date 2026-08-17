import { MarsStroke } from "lucide-react";

// Optional: Explicit type declaration to keep TypeScript happy
export interface Organizer {
  name: string;
  blurb: string;
  href: string;
  logo?: string; 
  logoWidth?: number;  
  logoHeight?: number; 
}

export const site = {
  eventName: "12th Nepal Wood International Expo 2027",
  dates: "28 – 31 January 2027",
  venue: "Bhrikuti Mandap, Kathmandu, Nepal",
};

export const heroStats = [
  { value: 250, suffix: "+", label: "Participating Brands", note: "Expected for 2027" },
  { value: 60000, suffix: "+", label: "Exhibition Area (sq.ft.)", note: "Expected for 2027" },
  { value: 17000, suffix: "+", label: "Visitors", note: "Expected for 2027" },
  { value: 1500, suffix: "+", label: "Products & Services", note: "Expected for 2027" },
];

export const previousEditionStats = [
  { value: 15000, suffix: "+", label: "Trade visitors reported", note: "Previous edition" },
  { value: 250, suffix: "+", label: "Regional & international brands", note: "Previous edition" },
  { value: 75, suffix: "%", label: "Visitors in senior-management roles", note: "Previous edition" },
];

export const exhibitorCategories = [
  { label: "Machinery", image: "/images/texture/machinery.jfif" },
  { label: "Plywood & Panels", image: "/images/texture/plywood.jfif" },
  { label: "Laminates", image: "/images/texture/laminates.jfif" },
  { label: "Doors & Flooring", image: "/images/texture/doors.jfif" },
  { label: "Raw Materials", image: "/images/texture/raw-material.jfif" },
  { label: "Fasteners & Hardware", image: "/images/texture/hardware.jfif" },
  { label: "Power Tools", image: "/images/texture/power-tools.jfif" },
  { label: "Furniture", image: "/images/texture/furniture.jfif" },
  { label: "Saw Milling", image: "/images/texture/saw-mining.jfif" },
];

export const organizers: Organizer[] = [
  {
    name: "Futurex Trade Fair and Events Pvt. Ltd.",
    logo: "/logo/futurex.png", 
    logoWidth: 240,  // <-- Yahan se Futurex logo ki size badlein (Pixels)
    logoHeight: 100,
    blurb:
      "Established in 2011 and headquartered in New Delhi, an international exhibition and corporate-events organiser with experience across South Asia, having executed more than 300 exhibitions and conferences across sectors including woodworking, textiles, infrastructure, agriculture, power, education and packaging.",
    href: "https://futurextrade.com",
  },
  {
    name: "Media Space Solutions Pvt. Ltd.",
    logo: "/logo/Media-Space.png",
    logoWidth: 200,  // <-- Yahan se Media Space logo ki size badlein
    logoHeight: 80,
    blurb:
      "Operating in Nepal since 2009, contributing local market knowledge, industry relationships, promotional reach and on-ground operational expertise to professionally managed trade exhibitions in Nepal.",
    href: "https://mss.com.np/",
  },
];

export const associations = [
  {
    name: "Trusted Interior Panel Brand",
    logo: "/logo/TESA-logo.png",
    url: "https://www.actiontesa.com/",
  },
];

export const contactDetails = {
  indiaContacts: [
    { name: "Mr. Namit Gupta", phone: "+91 98108 55697", email: "namit@futurextrade.com" },
  ],
  nepalContact: { name: "Mr. Srijal Bhattarai", phone: "+977 9801171141", email: "info@mss.com.np" },
  generalEmail: "namit@futurextrade.com",
};