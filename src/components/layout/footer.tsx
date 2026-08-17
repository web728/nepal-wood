"use client";

import Link from "next/link";
import Image from "next/image";
import Container from "@/components/shared/container";
import CTAButton from "@/components/shared/cta-button";
import { FacebookIcon, InstagramIcon, LinkedinIcon } from "@/components/shared/social-icons";
import { MapPin, Calendar, Mail, Phone } from "lucide-react";
import { site, contactDetails } from "@/lib/site-data";

const exhibitLinks = [
  { label: "Why Exhibit", href: "/exhibitor-profile" },
  { label: "Exhibitor Registration", href: "/exhibitor-registration" },
];

const visitLinks = [
  { label: "Visitor Profile", href: "/visitor-profile" },
  { label: "Visitor Registration", href: "/visitor-registration" },
  { label: "Photo Gallery", href: "/gallery" },
];

const aboutLinks = [
  { label: "The Organizers", href: "/about-organizers" },
  { label: "The Show Overview", href: "/about-show" },
  { label: "Venue Details", href: "/venue" },
  { label: "Contact Us", href: "/contact" },
];

const social = [
  { label: "Facebook", href: "https://facebook.com", Icon: FacebookIcon },
  { label: "Instagram", href: "https://instagram.com", Icon: InstagramIcon },
  { label: "LinkedIn", href: "https://linkedin.com", Icon: LinkedinIcon },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden bg-brand-brown text-white/90">

      {/* Background Image Layer */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/gallery/footer.png"
          alt="Nepal Wood Expo background"
          fill
          sizes="100vw"
          className="object-cover object-center opacity-70 transition-opacity duration-500"
          priority={false}
        />
        
        {/* LIGHT GRADIENT OVERLAY */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#F4C87A]/65 via-brand-brown/70 to-brand-brown/85" />
      </div>

      {/* Top-Left Ambient Glow */}
      <div className="pointer-events-none absolute -left-12 -top-12 z-0 h-96 w-96 rounded-full bg-[#F4C87A]/55 blur-[90px]" />
      
      {/* Bottom-Right Subdued Glow */}
      <div className="pointer-events-none absolute right-0 bottom-0 z-0 h-80 w-80 rounded-full bg-brand-maroon/50 blur-[110px]" />

      {/* Top Glassmorphic CTA Banner */}
      <div className="relative z-10 border-b border-white/15 bg-gradient-to-r from-black/80 via-brand-brown/90 to-black/80 backdrop-blur-md shadow-2xl">
        <Container>
          <div className="flex flex-col items-center justify-between gap-6 py-10 md:flex-row md:py-12">
            <div>
              <h3 className="font-display text-xl sm:text-2xl font-bold text-white tracking-tight">
                Ready to be part of Nepal Wood International Expo?
              </h3>
              <p className="mt-1.5 text-xs sm:text-sm text-zinc-300">
                Secure your spot at the 12th edition &mdash; {site.dates}
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <CTAButton
                href="/exhibitor-registration"
                size="sm"
                className="shadow-xl shadow-brand-amber/20 font-bold text-xs"
              >
                Book Exhibition Space
              </CTAButton>
              <CTAButton
                href="/visitor-registration"
                variant="outline"
                size="sm"
                className="!border-white/30 !bg-white/10 !text-white backdrop-blur-xl hover:!bg-white hover:!text-brand-brown font-bold text-xs transition-all"
              >
                Register as Visitor
              </CTAButton>
            </div>
          </div>
        </Container>
      </div>

      {/* Main Footer Body */}
      <div className="relative z-10 py-12 md:py-16">
        <Container>
          <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-12 lg:gap-8 items-start">

            {/* Col 1: Brand & Details */}
            <div className="lg:col-span-4 flex flex-col justify-start">
              <Link href="/" className="inline-block group">
                <div className="relative h-16 w-48 sm:h-20 sm:w-60 lg:h-22 lg:w-64 shrink-0 transition-transform duration-300 group-hover:scale-[1.02]">
                  <Image
                    src="/logo/nepal-wood-expo-logo.png"
                    alt="Nepal Wood Expo Logo"
                    fill
                    sizes="(max-width: 768px) 192px, 256px"
                    className="object-contain object-left drop-shadow-lg"
                  />
                </div>
              </Link>

              <p className="mt-4 text-xs font-normal leading-relaxed text-zinc-200 sm:text-sm max-w-sm">
                Nepal&rsquo;s premier B2B platform for wood processing technology, woodworking machinery, plywood, laminates, and furniture production solutions.
              </p>

              {/* Event Quick Details */}
              <div className="mt-5 space-y-2.5 text-xs sm:text-sm text-white/95 font-medium">
                <div className="flex items-center gap-2.5">
                  <Calendar className="h-4 w-4 shrink-0 text-[#F4C87A]" />
                  <span>{site.dates || "28–31 January 2027"}</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <MapPin className="h-4 w-4 shrink-0 text-[#F4C87A] mt-0.5" />
                  <span>{site.venue || "Bhrikuti Mandap, Kathmandu, Nepal"}</span>
                </div>
                {/* <div className="flex items-center gap-2.5">
                  <Mail className="h-4 w-4 shrink-0 text-[#F4C87A]" />
                  <a href={`mailto:${contactDetails.generalEmail}`} className="transition-colors hover:text-[#F4C87A]">
                    {contactDetails.generalEmail}
                  </a>
                </div> */}
                {/* <div className="flex items-center gap-2.5">
                  <Phone className="h-4 w-4 shrink-0 text-[#F4C87A]" />
                  <a href={`tel:${contactDetails.indiaContacts[0]?.phone}`} className="transition-colors hover:text-[#F4C87A]">
                    {contactDetails.indiaContacts[0]?.phone}
                  </a>
                </div> */}
              </div>

              {/* Social Icons */}
              <div className="mt-6 flex items-center gap-3">
                {social.map(({ label, href, Icon }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/20 bg-white/10 text-white/90 backdrop-blur-md transition-all duration-300 hover:border-brand-amber hover:bg-brand-amber hover:text-brand-brown hover:scale-105 shadow-md"
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                ))}
              </div>
            </div>

            {/* Col 2: About Links */}
            <div className="lg:col-span-2">
              <h3 className="mb-5 text-[11px] font-bold uppercase tracking-[0.2em] text-[#F4C87A]">
                About Expo
              </h3>
              <ul className="space-y-3 text-xs sm:text-sm font-medium text-zinc-200">
                {aboutLinks.map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      className="hover-underline inline-block transition-colors hover:text-white"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Col 3: Exhibit & Visit Links */}
            <div className="lg:col-span-3">
              <h3 className="mb-5 text-[11px] font-bold uppercase tracking-[0.2em] text-[#F4C87A]">
                Exhibitors &amp; Visitors
              </h3>
              <ul className="space-y-3 text-xs sm:text-sm font-medium text-zinc-200">
                {[...exhibitLinks, ...visitLinks].map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      className="hover-underline inline-block transition-colors hover:text-white"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Col 4: Map & Action */}
            <div className="lg:col-span-3">
              <h3 className="mb-5 text-[11px] font-bold uppercase tracking-[0.2em] text-[#F4C87A]">
                Location
              </h3>
              <div className="overflow-hidden rounded-xl border border-white/20 bg-black/40 p-1 shadow-2xl backdrop-blur-md">
                <iframe
                  title="Bhrikuti Mandap, Kathmandu map"
                  src="https://www.google.com/maps?q=Bhrikuti+Mandap+Kathmandu+Nepal&output=embed"
                  className="h-36 w-full rounded-lg border-0"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>

              <div className="mt-5">
                <CTAButton
                  href="/contact"
                  size="sm"
                  className="w-full justify-center !text-xs font-bold shadow-lg shadow-brand-amber/15"
                >
                  Contact Organizers
                </CTAButton>
              </div>
            </div>

          </div>
        </Container>
      </div>

      {/* Bottom Legal & Copyright Bar */}
      <div className="relative z-10 border-t border-white/10 bg-black/40 backdrop-blur-md py-5">
        <Container>
          <div className="flex flex-col items-center justify-between gap-3 text-center text-xs text-zinc-400 sm:flex-row sm:text-left">
            <p suppressHydrationWarning>
              &copy; {currentYear} Nepal Wood International Expo. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              <Link
                href="/privacy-policy"
                className="transition-colors hover:text-[#F4C87A]"
              >
                Privacy Policy
              </Link>
              <span className="text-white/20">&middot;</span>
              <Link
                href="/contact"
                className="transition-colors hover:text-[#F4C87A]"
              >
                Support
              </Link>
            </div>
          </div>
        </Container>
      </div>
    </footer>
  );
}