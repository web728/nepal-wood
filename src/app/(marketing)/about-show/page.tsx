import type { Metadata } from "next";
import Image from "next/image";
import PageBanner from "@/components/shared/page-banner";
import Container from "@/components/shared/container";
import SectionHeading from "@/components/shared/section-heading";
import StatCounter from "@/components/shared/stat-counter";
import CTAButton from "@/components/shared/cta-button";
import EditionHighlightsAccordion from "@/components/sections/edition-highlights-accordion";
import { previousEditionStats } from "@/lib/site-data";
import { Cpu, Layers, Users2, Sparkles, CheckCircle2, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "About the Show | Nepal Wood International Expo 2027",
  description:
    "Learn about Nepal Wood International Expo 2027 — Nepal's specialised trade exhibition for wood, furniture and woodworking technology.",
};

const keyPillars = [
  {
    icon: Cpu,
    title: "Advanced Machinery & Tech",
    description: "Live demonstrations of CNC routers, edgebanders, sawmills, and automated woodworking machinery.",
    image: "/images/texture/advanced.JFIF",
  },
  {
    icon: Layers,
    title: "Raw Materials & Supplies",
    description: "Explore wide varieties of premium plywood, decorative laminates, veneers, adhesives, and hardware.",
    image: "/images/texture/raw-materials.JFIF",
  },
  {
    icon: Users2,
    title: "B2B Trade & Networking",
    description: "Connect directly with architects, interior designers, factory owners, importers, and regional buyers.",
    image: "/images/gallery/img-41.jpeg",
  },
];

export default function AboutShowPage() {
  return (
    <>
    <PageBanner
  kicker="12th Edition | 28–31 January 2027"
  title="Nepal's Largest Wood & Furniture Industry Platform"
  subtitle="Connecting global manufacturers, technology leaders, and trade buyers at the region's premier woodworking & furniture international expo."
  bgImage="/images/gallery/img-16.jpeg"
/>

      {/* Overview & Key Pillars Section */}
      <section className="relative bg-white py-12 sm:py-16 md:py-20 overflow-hidden">
        <div className="pointer-events-none absolute top-0 right-0 h-96 w-96 rounded-full bg-brand-amber/[0.03] blur-[100px]" />
        <Container>
          {/* Top Overview Split */}
          <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-12">
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-1.5 rounded-full bg-brand-amber/10 border border-brand-amber/20 px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-brand-amber mb-3">
                <Sparkles className="h-3.5 w-3.5" /> Industry Hub
              </div>
              <h2 className="font-display text-2xl font-bold text-brand-brown sm:text-3xl md:text-4xl leading-tight">
                Empowering Nepal's Woodworking & Furniture Ecosystem
              </h2>
              <p className="mt-4 text-base font-medium leading-relaxed text-brand-brown/80 sm:text-lg">
                The 12th Nepal Wood International Expo 2027 brings together the complete industry ecosystem — from machinery manufacturers and material suppliers to distributors, architects, interior designers, and project professionals.
              </p>
              <p className="mt-3 text-sm leading-relaxed text-brand-brown/70 sm:text-base">
                The expo helps international and domestic companies showcase new products, demonstrate cutting-edge technology, identify regional distribution partners, and tap into Nepal's rapidly expanding construction and interior infrastructure demand.
              </p>

              <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {[
                  "150+ Leading Exhibitors",
                  "Live Equipment Demos",
                  "Focused B2B Matchmaking",
                  "Architect & Builder Forums",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-2.5 text-sm font-semibold text-brand-brown">
                    <CheckCircle2 className="h-4 w-4 text-brand-amber shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Feature Image Card */}
            <div className="lg:col-span-5">
              <div className="relative overflow-hidden rounded-2xl border border-brand-brown/10 bg-brand-cream/30 p-2 shadow-xl">
                <div className="relative h-72 sm:h-96 w-full overflow-hidden rounded-xl">
                  <Image
                    src="/images/gallery/katmandu.png"
                    alt="Exhibition Floor Highlights"
                    fill
                    className="object-cover transition-transform duration-700 hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-brown/80 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4 p-2 text-white">
                    <span className="rounded bg-brand-amber px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-brand-brown">
                      12th Edition
                    </span>
                    <p className="mt-1 font-display text-sm font-bold text-white">
                      Bhrikuti Mandap, Kathmandu
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Key Expo Pillars */}
          <div className="mt-10 sm:mt-24">
            <SectionHeading
              kicker="Core Sectors"
              title="What Defines Nepal Wood Expo"
              subtitle="Three major pillars driving the region's premier trade platform."
            />

            <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
              {keyPillars.map((pillar) => {
                const Icon = pillar.icon;
                return (
                  <div
                    key={pillar.title}
                    className="group relative overflow-hidden rounded-2xl border border-brand-brown/10 bg-white p-5 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-brand-amber/40 hover:shadow-md"
                  >
                    <div className="relative h-44 w-full overflow-hidden rounded-xl mb-5">
                      <Image
                        src={pillar.image}
                        alt={pillar.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-brand-brown/70 to-transparent" />
                      <div className="absolute top-3 left-3 flex h-10 w-10 items-center justify-center rounded-lg bg-brand-amber text-brand-brown shadow-md">
                        <Icon className="h-5 w-5" />
                      </div>
                    </div>

                    <h3 className="font-display text-lg font-bold text-brand-brown">
                      {pillar.title}
                    </h3>
                    <p className="mt-2 text-xs leading-relaxed text-brand-brown/75 sm:text-sm">
                      {pillar.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </Container>
      </section>

      {/* Previous Edition Performance Stats */}
      <section className="relative overflow-hidden bg-brand-cream/30 py-12 sm:py-16 border-y border-brand-brown/10">
        <Container>
          <div className="text-center max-w-2xl mx-auto mb-10">
            <SectionHeading
              kicker="Proven Track Record"
              title="Results From Our Last Edition"
              subtitle="Consistently delivering quality buyers, high-value trade connections, and brand visibility."
              align="center"
            />
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            {previousEditionStats.map((s) => (
              <div
                key={s.label}
                className="rounded-2xl border border-brand-brown/10 bg-white p-6 shadow-xs transition-all duration-300 hover:border-brand-amber/40 hover:shadow-md hover:-translate-y-0.5"
              >
                <StatCounter
                  value={s.value}
                  suffix={s.suffix}
                  label={s.label}
                  note={s.note}
                />
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Edition Highlights Split View */}
      {/* <section className="bg-white py-16 sm:py-20 md:py-24">
        <Container>
          <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-12 lg:gap-12">
            <div className="lg:col-span-5">
              <div className="sticky top-28">
                <SectionHeading
                  kicker="Show Floor Highlights"
                  title="What to Expect at the 2027 Edition"
                  subtitle="Designed to maximize value for both visitors seeking latest solutions and exhibitors aiming for trade deals."
                />

                <div className="mt-6 overflow-hidden rounded-2xl border border-brand-brown/10 bg-brand-brown/5 p-2 shadow-xs transition-all duration-300 hover:border-brand-amber/30 hover:shadow-md">
                  <div className="group relative h-64 w-full overflow-hidden rounded-xl sm:h-80">
                    <Image
                      src="/images/gallery/opening-ceremony.webp"
                      alt="Opening Ceremony & Expo Floor"
                      fill
                      sizes="(max-width: 1024px) 100vw, 40vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-brand-brown/90 via-brand-brown/20 to-transparent" />

                    <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                      <p className="text-xs font-bold text-white tracking-wide">
                        Inauguration & VIP Delegation Tours
                      </p>
                      <span className="rounded-full bg-brand-amber/20 px-2.5 py-0.5 text-[10px] font-semibold text-brand-amber backdrop-blur-md border border-brand-amber/30">
                        Live Highlight
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          
            <div className="lg:col-span-7">
              <EditionHighlightsAccordion />
            </div>
          </div>
        </Container>
      </section> */}

      {/* Final Call To Action Banner */}
      <section className="relative overflow-hidden bg-brand-brown py-12 sm:py-16 md:py-20 text-center text-white">
        <div className="pointer-events-none absolute -left-20 top-1/2 h-80 w-80 -translate-y-1/2 rounded-full bg-brand-amber/10 blur-3xl" />
        <div className="pointer-events-none absolute -right-20 bottom-0 h-80 w-80 rounded-full bg-brand-amber/5 blur-3xl" />

        <Container>
          <div className="max-w-3xl mx-auto relative z-10">
            <span className="inline-block rounded-full bg-brand-amber/10 px-3.5 py-1 text-[11px] font-bold uppercase tracking-widest text-brand-amber border border-brand-amber/20 mb-4">
              Join Nepal's Wood Tech Revolution
            </span>
            <h2 className="font-display text-2xl font-bold text-white sm:text-3xl md:text-4xl leading-tight">
              Join the 12th Edition and Connect With Key Industry Buyers
            </h2>
            <p className="mt-4 text-sm sm:text-base text-brand-cream/80 leading-relaxed">
              Whether you want to showcase your machinery to top Nepali furniture manufacturers or source the latest laminates and hardware, reserve your space today.
            </p>

            <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row sm:items-center">
              <CTAButton href="/exhibitor-registration" className="shadow-lg">
                Register to Exhibit
              </CTAButton>
              <CTAButton
                href="/visitor-registration"
                variant="outline"
                className="!border-white/30 !text-white hover:!bg-white hover:!text-brand-brown"
              >
                Register as Visitor
              </CTAButton>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}