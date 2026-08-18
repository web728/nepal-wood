"use client";

import Image from "next/image";
import Container from "@/components/shared/container";
import SectionHeading from "@/components/shared/section-heading";
import StatCounter from "@/components/shared/stat-counter";
import CTAButton from "@/components/shared/cta-button";
import { useBatchReveal } from "@/hooks/useBatchReveal";
import {
  Users2Icon,
  Handshake,
  TrendingUp,
  MessageSquareCheck,
  Globe2,
  Rocket,
} from "lucide-react";

const benefits = [
  {
    title: "Access to 17,000+ Trade Professionals",
    body: "Access to over 17,000 quality trade professionals from Nepal and beyond to promote and showcase your latest products and services.",
    icon: Users2Icon,
  },
  {
    title: "Purchasing-Authority Visitors",
    body: "Connect with key visitors in the wood industry who hold purchasing authority.",
    icon: Handshake,
  },
  {
    title: "Expand Business Reach",
    body: "Establish new contacts and expand your business reach by meeting relevant partners such as suppliers, manufacturers, trade associations, and institutions.",
    icon: Globe2,
  },
  {
    title: "Industry Trends & Knowledge",
    body: "Stay updated on the latest industry trends, technologies, and products through interactions with industry experts.",
    icon: Rocket,
  },
  {
    title: "Grow Market Presence",
    body: "Increase your marketing presence in one of the fastest-growing construction markets in the region.",
    icon: TrendingUp,
  },
  {
    title: "Target Major Decision-Makers",
    body: "Enhance your visibility among decision-makers from major construction projects in Nepal.",
    icon: MessageSquareCheck,
  },
];

export default function WhyExhibit() {
  const gridRef = useBatchReveal<HTMLDivElement>({
    y: 16,
    stagger: 0.06,
  });

  return (
    <section className="relative overflow-hidden bg-white py-10 sm:py-14 md:py-16">
      {/* Background ambient lighting */}
      <div className="pointer-events-none absolute left-0 top-1/4 h-72 w-72 -translate-x-1/2 rounded-full bg-brand-amber/[0.04] blur-[90px]" />
      <div className="pointer-events-none absolute right-0 bottom-10 h-72 w-72 translate-x-1/2 rounded-full bg-brand-brown/[0.03] blur-[90px]" />

      <Container>
        <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12 lg:gap-10">
          
          {/* Left Column Content */}
          <div className="flex flex-col justify-between lg:col-span-5">
            <div>
              <SectionHeading
                kicker="Why Exhibit"
                title="NEPAL WOOD INTERNATIONAL EXPO"
                subtitle="YOUR GATEWAY TO ONE OF THE FASTEST EXPANDING MARKETS IN THE REGION"
              />

              {/* Compact Visual Feature Card */}
              <div className="relative mt-6 overflow-hidden rounded-xl border border-brand-amber/15 bg-gradient-to-br from-brand-brown via-brand-brown/95 to-brand-dark shadow-md">
                <div className="absolute inset-0 opacity-20">
                  <Image
                    src="/images/hero/crowd-booth-1.webp"
                    alt="Exhibitors engaging with visitors"
                    fill
                    sizes="(max-width: 768px) 100vw, 400px"
                    className="object-cover"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-brand-brown/95 via-brand-brown/80 to-transparent" />
                <div className="relative z-10 p-5">
                  <h4 className="font-display text-base font-bold text-white">
                    Nepal Wood International Expo
                  </h4>
                  <p className="mt-1 text-xs leading-relaxed text-white/75">
                    Your gateway to one of the fastest expanding markets in the region.
                  </p>
                </div>
              </div>

              {/* Key stat counter */}
              <div className="mt-5 border-t border-brand-brown/10 pt-4">
                <StatCounter
                  value={94.2}
                  suffix="%"
                  label="OF THE EXHIBITOR ARE SATISFIED WITH OVERALL PERFORMANCE OF THE ORGANIZER"
                />
              </div>
            </div>

            <div className="mt-6">
              <CTAButton href="/exhibitor-registration" className="h-11 px-5 text-sm">
                Register to Exhibit
              </CTAButton>
            </div>
          </div>

          {/* Right Column: Benefit Cards Grid */}
          <div
            ref={gridRef}
            className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:col-span-7"
          >
            {benefits.map((b) => {
              const IconComponent = b.icon;
              return (
                <div
                  key={b.title}
                  className="reveal-card group relative flex flex-col justify-between rounded-xl border border-brand-brown/8 bg-brand-cream/30 p-4 transition-all duration-300 hover:-translate-y-1 hover:border-brand-amber/40 hover:bg-white hover:shadow-md sm:p-5"
                >
                  <div>
                    <div className="mb-3 inline-flex rounded-lg bg-brand-amber/10 p-2.5 text-brand-amber transition-colors duration-300 group-hover:bg-brand-amber group-hover:text-white">
                      <IconComponent className="h-4 w-4 sm:h-5 sm:w-5" />
                    </div>
                    <h3 className="font-display text-sm font-bold text-brand-brown">
                      {b.title}
                    </h3>
                    <p className="mt-1 font-body text-xs leading-relaxed text-brand-brown/70">
                      {b.body}
                    </p>
                  </div>

                  <div className="mt-4 h-0.5 w-6 rounded-full bg-brand-amber/20 transition-all duration-300 group-hover:w-full group-hover:bg-brand-amber" />
                </div>
              );
            })}
          </div>

        </div>
      </Container>
    </section>
  );
}