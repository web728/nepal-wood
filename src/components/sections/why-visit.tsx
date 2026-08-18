"use client";

import Image from "next/image";
import Container from "@/components/shared/container";
import SectionHeading from "@/components/shared/section-heading";
import CTAButton from "@/components/shared/cta-button";
import WhyVisitBullets from "@/components/sections/why-visit-bullets";
import { Compass, Sparkles } from "lucide-react";

export default function WhyVisit() {
  return (
    <section className="relative overflow-hidden bg-brand-brown py-6 sm:py-8 md:py-10">
      {/* Background Image */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <Image
          src="/images/gallery/crowd-aisle-1.webp"
          alt="Expo crowd aisle"
          fill
          sizes="100vw"
          className="object-cover object-center opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-brand-brown/90 via-brand-brown/70 to-brand-brown/50" />
        <div className="absolute inset-0 bg-gradient-to-b from-brand-brown/40 via-transparent to-brand-brown/60" />
      </div>

      {/* Ambient Glows */}
      <div className="pointer-events-none absolute -left-20 top-1/2 h-56 w-56 -translate-y-1/2 rounded-full bg-brand-amber/15 blur-[90px]" />
      <div className="pointer-events-none absolute -right-20 bottom-5 h-48 w-48 rounded-full bg-brand-amber/10 blur-[70px]" />

      <Container className="relative z-10">
        <div className="grid grid-cols-1 items-center gap-6 lg:grid-cols-12 lg:gap-8">
          {/* Left Column */}
          <div className="flex flex-col items-start lg:col-span-5 overflow-visible">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-brand-amber/20 bg-brand-amber/8 px-3 py-0.5 text-[10px] font-bold uppercase tracking-widest text-brand-amber backdrop-blur-xl">
              <Sparkles className="h-3 w-3" />
              <span>SHOW HIGHLIGHTS</span>
            </div>

            <div className="mt-2 w-full">
              <SectionHeading
                kicker="Why Visit"
                title="SHOW HIGHLIGHTS OF PREVIOUS EDITION"
                subtitle="Discover key achievements, trade opportunities, and international participation from our successful past edition."
                light
              />
            </div>

            {/* Feature Highlight Box */}
            <div className="mt-3.5 w-full rounded-lg border border-white/8 bg-white/[0.04] p-3 backdrop-blur-xl transition-all duration-300 hover:border-brand-amber/30 hover:bg-white/[0.08]">
              <div className="flex items-start gap-3">
                <div className="shrink-0 rounded-md bg-brand-amber/15 p-2 text-brand-amber">
                  <Compass className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="font-display text-xs font-semibold text-white">
                    Phenomenal Growth & Success
                  </h4>
                  <p className="mt-0.5 text-[11px] leading-relaxed text-white/60">
                    The 11th edition of the Nepal Wood International Expo achieved a 60% growth compared to the previous edition.
                  </p>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="mt-4 flex w-full flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <CTAButton href="/visitor-registration" className="h-9 px-4 text-xs font-semibold w-full sm:w-auto shadow-md shadow-brand-amber/20">
                <span className="flex items-center justify-center gap-2">
                  Register to Visit
                </span>
              </CTAButton>
            </div>
          </div>

          {/* Right Column: Highlights & Bullets */}
          <div className="w-full lg:col-span-7">
            <WhyVisitBullets />
          </div>
        </div>
      </Container>
    </section>
  );
}