"use client";

import Image from "next/image";
import Container from "@/components/shared/container";
import SectionHeading from "@/components/shared/section-heading";
import CTAButton from "@/components/shared/cta-button";
import WhyVisitBullets from "@/components/sections/why-visit-bullets";
import { Compass, Sparkles, ArrowRight } from "lucide-react";

export default function WhyVisit() {
  return (
    <section className="relative overflow-hidden bg-brand-brown py-10 sm:py-14 md:py-16">
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
      <div className="pointer-events-none absolute -left-20 top-1/2 h-72 w-72 -translate-y-1/2 rounded-full bg-brand-amber/15 blur-[100px]" />
      <div className="pointer-events-none absolute -right-20 bottom-10 h-64 w-64 rounded-full bg-brand-amber/10 blur-[80px]" />

      <Container className="relative z-10">
        <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12 lg:gap-12">
          {/* Left Column */}
          <div className="flex flex-col items-start lg:col-span-5 overflow-visible">
            <div className="inline-flex items-center gap-2 rounded-full border border-brand-amber/20 bg-brand-amber/8 px-3.5 py-1 text-xs font-bold uppercase tracking-widest text-brand-amber backdrop-blur-xl">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Visitor Benefits</span>
            </div>

            <div className="mt-3.5 w-full">
              <SectionHeading
                kicker="Why Visit"
                title="Discover products, technology and business opportunities"
                subtitle="Compare suppliers, see machinery in action and meet the people shaping the future of furniture manufacturing and woodworking in Nepal."
                light
              />
            </div>

            {/* Feature Highlight Box */}
            <div className="mt-6 w-full rounded-xl border border-white/8 bg-white/[0.04] p-4 backdrop-blur-xl transition-all duration-300 hover:border-brand-amber/30 hover:bg-white/[0.08]">
              <div className="flex items-start gap-3.5">
                <div className="shrink-0 rounded-lg bg-brand-amber/15 p-2.5 text-brand-amber">
                  <Compass className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-display text-sm font-semibold text-white">
                    Live Machinery Demos
                  </h4>
                  <p className="mt-0.5 text-xs leading-relaxed text-white/60">
                    Experience state-of-the-art CNC tools &amp; timber tech live on the expo floor.
                  </p>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="mt-6 flex w-full flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <CTAButton href="/visitor-registration" className="h-11 px-5 text-sm font-semibold w-full sm:w-auto shadow-md shadow-brand-amber/20">
                <span className="flex items-center justify-center gap-2">
                  Register to Visit
                
                </span>
              </CTAButton>
            </div>
          </div>

          {/* Right Column: Bullets */}
          <div className="w-full lg:col-span-7">
            <WhyVisitBullets />
          </div>
        </div>
      </Container>
    </section>
  );
}