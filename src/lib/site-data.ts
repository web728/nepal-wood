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
    logoHeight: 120,
  blurb:
      "Established in 2011, FUTUREX TRADE FAIR AND EVENTS PVT. LTD. is a premier international exhibition and corporate events organizer headquartered in New Delhi, India. The company has successfully executed 300+ international and domestic trade exhibitions and conferences both globally and across India, establishing itself as the largest show organizer in SAARC countries. Specializing in sectors including Woodworking, Textile, Building and Infrastructure, Agriculture, Power, Education, and Packaging, Futurex creates focused B2B platforms that connect manufacturers, suppliers, and buyers worldwide. Backed by seasoned professionals and strong government associations, Futurex continues to redefine excellence in Nepal's exhibition industry. Futurex: Where Business Meets Opportunities.",
    href: "https://futurextrade.com",
  },
  {
    name: "Media Space Solutions Pvt. Ltd.",
    logo: "/logo/Media-Space.png",
    logoWidth: 220,  // <-- Yahan se Media Space logo ki size badlein
    logoHeight: 100,
   blurb:
      "MEDIA SPACE SOLUTIONS has been a key player in the industry since 2009, initially focusing on digital media and event management. Today, we manage a diverse portfolio of exhibitions and mobile networks, making us the largest commercial trade show company in Nepal. Our exhibitions span crucial sectors like infrastructure, engineering, and agriculture, among others, with partnerships from industry-leading brands. Leveraging our global marketing network, organizational expertise, and local connections, we consistently deliver top-tier trade shows of international standards, attracting qualified visitors.",
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