import type { Metadata } from "next";
import Image from "next/image";
import PageBanner from "@/components/shared/page-banner";
import Container from "@/components/shared/container";
import SectionHeading from "@/components/shared/section-heading";
import AnimatedCard from "@/components/shared/animated-card";
import RevealGrid from "@/components/shared/reveal-grid";
import CTAButton from "@/components/shared/cta-button";
import { organizers } from "@/lib/site-data";
import {
  Building2,
  Globe2,
  CheckCircle2,
  ExternalLink,
  Award,
  Users2,
  CalendarCheck,
  Handshake,
} from "lucide-react";

export const metadata: Metadata = {
  title: "About the Organizers | Nepal Wood International Expo 2027",
  description:
    "Meet Futurex Trade Fair & Events and Media Space Solutions — the joint force behind Nepal Wood International Expo 2027.",
};

const jointStrength = [
  "International exhibitor outreach & global trade delegations",
  "Deep local industry networks & government association ties",
  "360-degree integrated marketing & media campaigns",
  "Targeted B2B business visitor development initiatives",
  "World-class on-ground exhibition management & logistics",
  "Comprehensive buyer-seller matchmaking programs",
];

const organizerStats = [
  { icon: Award, value: "15+", label: "Years of Event Excellence" },
  { icon: CalendarCheck, value: "100+", label: "Successful Trade Expos" },
  { icon: Users2, value: "500k+", label: "B2B Trade Visitors Connected" },
  { icon: Globe2, value: "20+", label: "Participating Countries" },
];

export default function AboutOrganizersPage() {
  return (
    <>
      <PageBanner
        kicker="The Organizers"
        title="Organized by Industry-Leading Exhibition Pioneers"
        subtitle="Combining international trade fair expertise with unparalleled regional market knowledge to deliver Nepal's largest wood & technology platform."
        bgImage="/images/gallery/seminar-discussion.webp"
      />

      {/* Main Organizers Profile Cards */}
      <section className="bg-white py-10 sm:py-14 md:py-16">
        <Container>
          <div className="mb-8 sm:mb-10 text-center">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-brand-amber/10 border border-brand-amber/20 px-3.5 py-1 text-[10px] sm:text-[11px] font-bold uppercase tracking-widest text-brand-amber mb-2.5">
              <Handshake className="h-3.5 w-3.5" /> Powerful Synergy
            </div>
            <SectionHeading
              kicker="Joint Venture"
              title="Meet the Organizers"
              // subtitle="Two premier trade show managers united to deliver an exceptional B2B trade experience."
              align="center"
            />
          </div>

          <RevealGrid className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {organizers.map((org) => (
              <AnimatedCard
                key={org.name}
                className="group relative flex flex-col justify-between overflow-visible rounded-xl border border-brand-brown/10 bg-white p-6 sm:p-8 shadow-xs transition-all duration-300 hover:border-brand-amber/40 hover:shadow-md"
              >
                {/* Background Accent Pill */}
                <div className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full bg-brand-amber/10 blur-xl transition-all group-hover:bg-brand-amber/20" />

                <div className="overflow-visible">
                  {/* Flexible Logo Container */}
                  <div className="mb-6 flex min-h-[5rem] w-full max-w-[280px] items-center justify-start rounded-xl border border-brand-brown/10 bg-brand-cream/20 p-3 shadow-xs transition-all group-hover:border-brand-amber/40 group-hover:bg-brand-cream/40">
                    {org.logo ? (
                      <Image
                        src={org.logo as string}
                        alt={org.name}
                        width={org.logoWidth || 200}
                        height={org.logoHeight || 70}
                        style={{
                          width: org.logoWidth ? `${org.logoWidth}px` : "auto",
                          height: org.logoHeight ? `${org.logoHeight}px` : "auto",
                        }}
                        className="object-contain"
                      />
                    ) : (
                      <div className="flex items-center gap-2 text-brand-brown font-bold text-sm">
                        <Building2 className="h-6 w-6 text-brand-amber" />
                        <span>{org.name}</span>
                      </div>
                    )}
                  </div>

                  <h3 className="font-display text-xl sm:text-2xl font-bold text-brand-brown leading-snug">
                    {org.name}
                  </h3>

                  <p className="mt-3 text-xs sm:text-sm leading-relaxed text-brand-brown/80">
                    {org.blurb}
                  </p>
                </div>

                <div className="mt-8 pt-5 border-t border-brand-brown/10 flex items-center justify-between">
                  <span className="text-xs font-semibold text-brand-brown/60">
                    Official Website
                  </span>
                  <CTAButton
                    href={org.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    variant="outline"
                    size="sm"
                    className="h-9 px-4 border-brand-brown/20 hover:border-brand-amber text-xs font-bold"
                  >
                    Visit Website
                    {/* <ExternalLink className="ml-1.5 h-3.5 w-3.5" /> */}
                  </CTAButton>
                </div>
              </AnimatedCard>
            ))}
          </RevealGrid>
        </Container>
      </section>

      {/* Joint Strength Matrix */}
      <section className="relative overflow-hidden bg-brand-cream/30 py-10 sm:py-14 border-y border-brand-brown/10">
        <Container>
          <div className="text-center max-w-2xl mx-auto mb-8">
            <SectionHeading
              kicker="Strategic Advantages"
              title="Two Organizations, One Focused Platform"
              subtitle="By leveraging our combined strengths, we provide exhibitors and visitors with a seamless, high-ROI trade environment."
              align="center"
            />
          </div>

          <div className="mx-auto grid max-w-4xl grid-cols-1 gap-3.5 sm:grid-cols-2 md:grid-cols-3">
            {jointStrength.map((strength) => (
              <div
                key={strength}
                className="flex items-start gap-3 rounded-xl border border-brand-brown/10 bg-white p-3.5 shadow-xs transition-all duration-300 hover:border-brand-amber/40 hover:shadow-sm"
              >
                <div className="shrink-0 rounded-md bg-brand-amber/15 p-1 text-brand-amber mt-0.5">
                  <CheckCircle2 className="h-4 w-4" />
                </div>
                <p className="text-xs sm:text-sm font-semibold leading-snug text-brand-brown/90">
                  {strength}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Organizer Statistics Strip */}
      <section className="bg-white py-10 sm:py-12 border-b border-brand-brown/10">
        <Container>
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {organizerStats.map((stat) => {
              const Icon = stat.icon;
              return (
                <div
                  key={stat.label}
                  className="flex flex-col items-center text-center p-4 rounded-xl bg-white border border-brand-brown/10 shadow-xs"
                >
                  <div className="mb-2.5 rounded-full bg-brand-amber/15 p-2.5 text-brand-brown">
                    <Icon className="h-5 w-5 text-brand-brown" />
                  </div>
                  <span className="font-display text-xl sm:text-2xl font-black text-brand-brown leading-none">
                    {stat.value}
                  </span>
                  <span className="mt-1.5 text-[10px] sm:text-xs font-bold text-brand-brown/70 uppercase tracking-wider">
                    {stat.label}
                  </span>
                </div>
              );
            })}
          </div>
        </Container>
      </section>

      {/* Bottom Direct Interaction Call to Action */}
      <section className="relative overflow-hidden bg-brand-brown py-12 sm:py-16 text-center text-white">
        <Container className="relative z-10">
          <div className="max-w-2xl mx-auto">
            <h2 className="font-display text-xl sm:text-2xl md:text-3xl font-bold text-white leading-tight">
              Partner with Us or Discuss Custom Booth Plans
            </h2>
            <p className="mt-2.5 text-xs sm:text-sm text-white/80 leading-relaxed">
              Our team of exhibition experts is ready to assist you with floor space booking, sponsorship opportunities, and custom stall design inquiries.
            </p>
            <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row sm:items-center">
              <CTAButton href="/contact" className="h-10 px-5 text-xs sm:text-sm font-semibold">
                Get in Touch with Organizers
              </CTAButton>
              <CTAButton
                href="/exhibitor-registration"
                variant="outline"
                className="h-10 px-5 text-xs sm:text-sm font-semibold border-white/30 text-white hover:bg-white hover:text-brand-brown"
              >
                Book Exhibitor Space
              </CTAButton>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}