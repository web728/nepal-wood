import type { Metadata } from "next";
import { Sora, Manrope } from "next/font/google";
import "./globals.css";
import Providers from "@/components/providers";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import PageTransitionMain from "@/components/layout/page-transition-main";
import CookieConsentBanner from "@/components/shared/cookie-consent-banner";
import PreloaderIntro from "@/components/shared/preloader-intro";

const displayFont = Sora({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  display: "swap",
});

const bodyFont = Manrope({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.nepalwoodexpo.com"),
  title: {
    default: "Nepal Wood International Expo 2027 | 28-31 Jan, Kathmandu",
    template: "%s | Nepal Wood International Expo 2027",
  },
  description:
    "Nepal Wood International Expo 2027 — the 12th edition. Nepal's leading B2B trade exhibition for woodworking machinery, plywood, laminates, furniture hardware & technology. 28-31 January 2027, Bhrikuti Mandap, Kathmandu.",
  keywords: [
    "Nepal Wood Expo",
    "Nepal Wood International Expo 2027",
    "woodworking machinery exhibition",
    "plywood laminates expo Nepal",
    "furniture technology exhibition",
    "Bhrikuti Mandap trade fair",
    "wood expo Kathmandu",
    "B2B trade exhibition Nepal",
    "furniture hardware expo",
    "Nepal trade show 2027",
  ],
  authors: [
    { name: "Futurex Trade Fair and Events Pvt. Ltd.", url: "https://futurextrade.com" },
  ],
  creator: "Futurex Trade Fair and Events Pvt. Ltd.",
  publisher: "Nepal Wood International Expo",
  openGraph: {
    title: "Nepal Wood International Expo 2027 | Kathmandu",
    description:
      "Nepal's leading B2B platform for wood, furniture & woodworking technology. 250+ brands, 15,000+ trade visitors. 28-31 January 2027, Bhrikuti Mandap, Kathmandu.",
    url: "https://www.nepalwoodexpo.com",
    siteName: "Nepal Wood International Expo 2027",
    images: [
      {
        url: "/images/og-default.jpg",
        width: 1200,
        height: 630,
        alt: "Nepal Wood International Expo 2027 — 28-31 January, Bhrikuti Mandap, Kathmandu",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Nepal Wood International Expo 2027 | Kathmandu",
    description:
      "Nepal's leading B2B platform for wood, furniture & woodworking technology. 28-31 January 2027, Bhrikuti Mandap, Kathmandu.",
    images: ["/images/og-default.jpg"],
  },
  alternates: {
    canonical: "https://www.nepalwoodexpo.com",
  },
  category: "Trade Exhibition",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${displayFont.variable} ${bodyFont.variable} h-full`}
      suppressHydrationWarning
    >
      <body
        className="min-h-full flex flex-col bg-brand-cream text-brand-brown font-body antialiased"
        suppressHydrationWarning
      >
        <Providers>
          <PreloaderIntro />
          <Header />
          <main id="main-content" className="flex-1">
            <PageTransitionMain>{children}</PageTransitionMain>
          </main>
          <Footer />
          <CookieConsentBanner />
        </Providers>
      </body>
    </html>
  );
}