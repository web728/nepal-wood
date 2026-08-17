import type { Metadata } from "next";
import HomeHero from "@/components/sections/home-hero";
import StatsBar from "@/components/sections/stats-bar";
import SupportedByStrip from "@/components/sections/supported-by-strip";
import AboutExpoIntro from "@/components/sections/about-expo-intro";
import ExhibitorProfileGrid from "@/components/sections/exhibitor-profile-grid";
import WhyExhibit from "@/components/sections/why-exhibit";
import WhyVisit from "@/components/sections/why-visit";
import ConcurrentEvents from "@/components/sections/concurrent-events";
import GalleryPreview from "@/components/sections/gallery-preview";
import VenueMap from "@/components/sections/venue-map";

export const metadata: Metadata = {
  title: "Nepal Wood International Expo 2027 | 28-31 Jan, Kathmandu",
  description:
    "12th Nepal Wood International Expo 2027 — South Asia's leading B2B trade exhibition for woodworking machinery, plywood, laminates, furniture hardware & technology. 28-31 January 2027, Bhrikuti Mandap, Kathmandu, Nepal.",
  alternates: {
    canonical: "https://www.nepalwoodexpo.com",
  },
};

const eventJsonLd = {
  "@context": "https://schema.org",
  "@type": "Event",
  name: "12th Nepal Wood International Expo 2027",
  startDate: "2027-01-28",
  endDate: "2027-01-31",
  eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
  eventStatus: "https://schema.org/EventScheduled",
  location: {
    "@type": "Place",
    name: "Bhrikuti Mandap",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Bhrikuti Mandap Exhibition Hall",
      addressLocality: "Kathmandu",
      addressRegion: "Bagmati",
      addressCountry: "NP",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: "27.7017",
      longitude: "85.3206",
    },
  },
  image: ["https://www.nepalwoodexpo.com/images/og-default.jpg"],
  description:
    "Nepal's leading platform for wood, plywood, laminates, woodworking machinery and furniture production technology. 250+ brands, 15,000+ trade visitors expected.",
  organizer: [
    {
      "@type": "Organization",
      name: "Futurex Trade Fair and Events Pvt. Ltd.",
      url: "https://futurextrade.com",
    },
    {
      "@type": "Organization",
      name: "Media Space Solutions Pvt. Ltd.",
    },
  ],
  offers: {
    "@type": "Offer",
    url: "https://www.nepalwoodexpo.com/visitor-registration",
    availability: "https://schema.org/InStock",
    price: "0",
    priceCurrency: "NPR",
    validFrom: "2026-06-01",
  },
};

const orgJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Nepal Wood International Expo",
  url: "https://www.nepalwoodexpo.com",
  logo: "https://www.nepalwoodexpo.com/logo/nepal-wood-expo-logo.png",
  contactPoint: {
    "@type": "ContactPoint",
    telephone: "+91-98108-55697",
    contactType: "sales",
    email: "namit@futurextrade.com",
    availableLanguage: ["English", "Hindi", "Nepali"],
  },
};

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(eventJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
      />
      <HomeHero />
      <SupportedByStrip />
      <AboutExpoIntro />
      <ExhibitorProfileGrid />
      <WhyExhibit />
      <WhyVisit />
      <ConcurrentEvents />
      <GalleryPreview />
      <VenueMap />
    </>
  );
}
