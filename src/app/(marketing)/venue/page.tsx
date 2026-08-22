"use client";

import type { Metadata } from "next";
import Image from "next/image";
import PageBanner from "@/components/shared/page-banner";
import Container from "@/components/shared/container";
import SectionHeading from "@/components/shared/section-heading";
import CTAButton from "@/components/shared/cta-button";
import { site } from "@/lib/site-data";
import { motion, Variants } from "framer-motion";
import {
  MapPin,
  Calendar,
  Sparkles,
  Plane,
  Car,
  Bus,
  Navigation,
  ExternalLink,
  Building,
  CheckCircle2,
} from "lucide-react";

const travelOptions = [
  {
    icon: Plane,
    title: "By Air",
    badge: "International Travel",
    body: "Tribhuvan International Airport (KTM) is located approximately 5.5 km from the venue. Official airport taxis and pre-booked hotel transfers take around 20-30 minutes depending on city traffic.",
  },
  {
    icon: Car,
    title: "By Taxi & Ride Services",
    badge: "Direct City Travel",
    body: "Use licensed taxis or local ride-hailing apps (such as Pathao or Indrive). Simply set your destination to 'Bhrikuti Mandap Exhibition Hall, Pradarshani Marg, Kathmandu'.",
  },
  {
    icon: Bus,
    title: "By Public Transport",
    badge: "Local Transit",
    body: "Bhrikuti Mandap is a major landmark in central Kathmandu, well connected by microbuses and city buses running through Ratna Park and Exhibition Road.",
  },
  {
    icon: Navigation,
    title: "Parking & Accessibility",
    badge: "On-site Info",
    body: "Dedicated parking zones for visitors and exhibitors are available around the exhibition complex. Wheelchair access and traffic assistance will be provided at primary entry gates.",
  },
];

const venueHighlights = [
  "Central Kathmandu Location",
  "Spacious Covered Halls",
  "Dedicated Heavy Machinery Area",
  "Continuous Power & Utility Backup",
];

// Reusable Minimal Animation Variants
const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.5, ease: "easeOut" } 
  },
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.05,
    },
  },
};

export default function VenuePage() {
  return (
    <>
      <PageBanner
        kicker="The Venue"
        title="Plan Your Visit to Bhrikuti Mandap"
        subtitle="Event location details, travel guidance, and practical visitor information for Nepal Wood International Expo 2027."
        bgImage="/images/gallery/venue.jpg"
      />

      {/* Quick Summary Strip */}
      <section className="bg-white py-8 sm:py-10 border-b border-brand-brown/10 overflow-hidden">
        <Container>
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
          >
            {[
              { icon: Sparkles, label: "Event Title", value: site.eventName },
              { icon: Calendar, label: "Official Dates", value: site.dates },
              { icon: MapPin, label: "Exhibition Ground", value: site.venue },
            ].map((item, idx) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={idx}
                  variants={fadeInUp}
                  whileHover={{ y: -4 }}
                  className="group flex items-center gap-4 rounded-2xl border border-brand-brown/10 bg-white p-4 sm:p-5 shadow-xs transition-shadow hover:border-brand-amber/40 hover:shadow-md"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-brown text-brand-amber shadow-md transition-transform duration-300 group-hover:scale-105">
                    <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[10px] font-black uppercase tracking-widest text-brand-amber block">
                      {item.label}
                    </span>
                    <p className="mt-0.5 font-display text-sm font-bold text-brand-brown sm:text-base leading-snug truncate sm:whitespace-normal">
                      {item.value}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </Container>
      </section>

      {/* About Venue Visual Section */}
      <section className="relative bg-white py-12 sm:py-16 md:py-20 overflow-hidden">
        {/* Soft Decorative Ambient Light */}
        <div className="pointer-events-none absolute top-1/2 left-0 h-96 w-96 -translate-y-1/2 rounded-full bg-brand-amber/[0.04] blur-3xl" />
        
        <Container>
          <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-12">
            {/* Left Content */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              variants={fadeInUp}
              className="lg:col-span-7"
            >
              <div className="inline-flex items-center gap-1.5 rounded-full bg-brand-amber/10 border border-brand-amber/20 px-3.5 py-1 text-[11px] font-bold uppercase tracking-widest text-brand-amber mb-3">
                <Building className="h-3.5 w-3.5" /> Premier Exhibition Ground
              </div>

              <SectionHeading
                kicker="Exhibition Center"
                title="Bhrikuti Mandap Exhibition Complex"
              />

              <p className="mt-4 text-base leading-relaxed font-medium text-brand-brown/85 sm:text-lg">
                Bhrikuti Mandap is Nepal&rsquo;s most prominent and recognized exhibition ground located in the heart of Kathmandu city.
              </p>

              <p className="mt-3 text-sm leading-relaxed text-brand-brown/70 sm:text-base">
                Positioned strategically along Pradarshani Marg, the venue provides spacious indoor halls and outdoor exhibition areas suitable for heavy woodworking machinery demonstrations, raw material displays, and high-footfall B2B trade interactions.
              </p>

              {/* Venue Feature Highlights List */}
              <motion.div
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2"
              >
                {venueHighlights.map((highlight) => (
                  <motion.div
                    key={highlight}
                    variants={fadeInUp}
                    className="flex items-center gap-2.5 text-sm font-semibold text-brand-brown"
                  >
                    <CheckCircle2 className="h-4 w-4 text-brand-amber shrink-0" />
                    <span>{highlight}</span>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>

            {/* Photo Preview Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              viewport={{ once: true }}
              className="lg:col-span-5"
            >
              <div className="relative overflow-hidden rounded-2xl border border-brand-brown/10 bg-brand-cream/30 p-2 sm:p-2.5 shadow-xl">
                <div className="relative h-64 sm:h-80 w-full overflow-hidden rounded-xl">
                  <Image
                    src="/expo/expo-56.jpeg"
                    alt="Bhrikuti Mandap Exhibition Floor"
                    fill
                    className="object-cover transition-transform duration-700 hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-brown/85 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4 p-2 text-white">
                    <span className="rounded bg-brand-amber px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider text-brand-brown shadow-xs">
                      Venue Location
                    </span>
                    <p className="mt-1.5 font-display text-sm sm:text-base font-bold text-white">
                      Pradarshani Marg, Kathmandu, Nepal
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </Container>
      </section>

      {/* Getting There Grid */}
      <section className="relative overflow-hidden bg-brand-cream/20 py-12 sm:py-16 md:py-20 border-y border-brand-brown/10">
        <Container>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="text-center max-w-2xl mx-auto mb-10 sm:mb-12"
          >
            <SectionHeading
              kicker="Travel & Transport"
              title="How to Reach the Expo"
              subtitle="Seamless travel guidance whether you are arriving from abroad or travelling within Kathmandu Valley."
              align="center"
            />
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="grid grid-cols-1 gap-5 sm:grid-cols-2"
          >
            {travelOptions.map((opt) => {
              const Icon = opt.icon;
              return (
                <motion.div
                  key={opt.title}
                  variants={fadeInUp}
                  whileHover={{ y: -4 }}
                  className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-brand-brown/10 bg-white p-5 sm:p-7 shadow-xs transition-all duration-300 hover:border-brand-amber/40 hover:shadow-md"
                >
                  <div>
                    <div className="flex items-center justify-between gap-4 mb-4">
                      <div className="flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-xl bg-brand-amber/15 text-brand-brown shadow-xs group-hover:bg-brand-amber group-hover:text-brand-brown transition-colors duration-300">
                        <Icon className="h-5 w-5" />
                      </div>
                      <span className="rounded-full bg-brand-brown/5 border border-brand-brown/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-brand-brown">
                        {opt.badge}
                      </span>
                    </div>

                    <h3 className="font-display text-base sm:text-xl font-bold text-brand-brown">
                      {opt.title}
                    </h3>
                    <p className="mt-2 text-xs leading-relaxed text-brand-brown/80 sm:text-sm">
                      {opt.body}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </Container>
      </section>

      {/* Interactive Map & Directions Section */}
      <section className="bg-white py-12 sm:py-16 md:py-20">
        <Container>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="text-center max-w-2xl mx-auto mb-8"
          >
            <SectionHeading
              kicker="Google Maps"
              title="Find Bhrikuti Mandap on Map"
              subtitle="Get real-time turn-by-turn navigation directly to the expo entrance."
              align="center"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            viewport={{ once: true }}
            className="overflow-hidden rounded-2xl border border-brand-brown/10 bg-brand-cream/30 p-2 sm:p-2.5 shadow-xl"
          >
            <iframe
              title="Bhrikuti Mandap, Kathmandu map"
              src="https://www.google.com/maps?q=Bhrikuti+Mandap+Kathmandu+Nepal&output=embed"
              className="h-72 sm:h-96 md:h-[420px] w-full rounded-xl border-0 contrast-105"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="mt-8 flex flex-col items-center justify-center gap-3.5 sm:flex-row"
          >
            <a
              href="https://maps.google.com/?q=Bhrikuti+Mandap+Kathmandu+Nepal"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-brand-brown/20 bg-brand-cream/60 px-6 py-3 text-xs font-bold uppercase tracking-wider text-brand-brown transition-all duration-300 hover:bg-brand-brown hover:text-white hover:shadow-md"
            >
              Open in Google Maps App
              <ExternalLink className="h-4 w-4" />
            </a>

            <CTAButton href="/visitor-registration" className="w-full sm:w-auto shadow-md">
              Register as Visitor
            </CTAButton>
          </motion.div>
        </Container>
      </section>
    </>
  );
}