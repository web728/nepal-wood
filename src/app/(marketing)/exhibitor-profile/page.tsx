"use client";

import type { Metadata } from "next";
import Image from "next/image";
import PageBanner from "@/components/shared/page-banner";
import Container from "@/components/shared/container";
import SectionHeading from "@/components/shared/section-heading";
import BarChart from "@/components/shared/bar-chart";
import CTAButton from "@/components/shared/cta-button";
import { motion, Variants } from "framer-motion";
import {
  Trees,
  Cpu,
  Armchair,
  Layers,
  Hammer,
  CheckCircle2,
  Sparkles,
  BarChart3,
  Download,
  ArrowRight,
} from "lucide-react";

const groups = [
  {
    icon: Trees,
    badge: "Materials & Surfaces",
    title: "Wood & Panel Products",
    items: [
      "Plywood & commercial plywood",
      "Blockboard & flush doors",
      "MDF, HDF & particleboard",
      "Veneers & veneered panels",
      "Decorative laminates & surfaces",
      "Timber & solid wood logs",
    ],
  },
  {
    icon: Cpu,
    badge: "Equipment & Automation",
    title: "Woodworking Machinery",
    items: [
      "CNC routers & machining centres",
      "Panel saws & beam saws",
      "Edge-banding machines",
      "Sanding & finishing systems",
      "Dust extraction & air filtration",
      "Sawmilling equipment",
    ],
  },
  {
    icon: Armchair,
    badge: "Production Tech",
    title: "Furniture Production Technology",
    items: [
      "Modular-furniture systems",
      "Kitchen & wardrobe manufacturing",
      "Upholstery machinery",
      "Production planning software",
      "3D design & nesting software",
      "Hardware fitting machinery",
    ],
  },
  {
    icon: Layers,
    badge: "Interiors & Décor",
    title: "Furnishing & Interior Products",
    items: [
      "Wooden & vinyl flooring solutions",
      "Doors, windows & frames",
      "Decorative wall panels & acoustic louvers",
      "Interior décor materials",
      "Architectural hardware & handles",
      "Edge bands & profiles",
    ],
  },
  {
    icon: Hammer,
    badge: "Consumables & Tools",
    title: "Tools, Hardware & Raw Materials",
    items: [
      "Power tools & hand tools",
      "Blades, cutters & abrasives",
      "Fasteners, hinges & drawer slides",
      "Adhesives, glues & coatings",
      "Wood preservatives & lacquers",
      "Woodpolishes & stains",
    ],
  },
];

const categoryInterest = [
  { label: "Woodworking Machinery & Dust Control", value: 82 },
  { label: "Plywood, Veneers, MDF & Laminates", value: 74 },
  { label: "Hardwood, Softwood & Timber", value: 61 },
  { label: "Flooring, Doors, Furniture & Fittings", value: 55 },
  { label: "Coatings, Paints & Adhesives", value: 43 },
];

// Minimal & Smooth Animation Variants
const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.05,
    },
  },
};

export default function ExhibitorProfilePage() {
  return (
    <>
      <PageBanner
        kicker="Exhibitor Profile"
        title="Who Should Exhibit at Nepal Wood 2027?"
        subtitle="A comprehensive commercial platform for manufacturers, distributors, and suppliers of woodworking machinery, raw materials, hardware, and furniture production tech."
        bgImage="/images/gallery/stand-detail-4.webp"
      />

      {/* Main Categories Grid Section */}
      <section className="bg-white py-12 sm:py-16 md:py-20 overflow-hidden">
        <Container>
          {/* Header Row */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={fadeInUp}
            className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end mb-10 md:mb-12"
          >
            <div>
              <div className="inline-flex items-center gap-1.5 rounded-full bg-brand-amber/10 border border-brand-amber/20 px-3.5 py-1 text-[11px] font-bold uppercase tracking-widest text-brand-amber mb-3">
                <Sparkles className="h-3.5 w-3.5" /> Exhibit Sectors
              </div>
              <SectionHeading
                kicker="Product Spectrum"
                title="Explore Key Exhibitor Categories"
                subtitle="Position your brand in front of thousands of decision-makers and regional buyers."
              />
            </div>

            <div className="hidden lg:block shrink-0">
              <CTAButton href="/exhibitor-registration" className="shadow-md">
                Book Booth Space
            
              </CTAButton>
            </div>
          </motion.div>

          {/* Dynamic Category Cards Grid */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
          >
            {groups.map((group) => {
              const Icon = group.icon;
              return (
                <motion.div
                  key={group.title}
                  variants={fadeInUp}
                  whileHover={{ y: -4 }}
                  className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-brand-brown/10 bg-white p-5 sm:p-6 shadow-xs transition-all duration-300 hover:border-brand-amber/40 hover:shadow-md"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-4">
                      <div className="flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-xl bg-brand-brown text-brand-amber shadow-md transition-transform duration-300 group-hover:scale-105">
                        <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
                      </div>
                      <span className="rounded-full bg-brand-brown/5 border border-brand-brown/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-brand-brown">
                        {group.badge}
                      </span>
                    </div>

                    <h3 className="font-display text-lg font-bold text-brand-brown sm:text-xl">
                      {group.title}
                    </h3>

                    <ul className="mt-4 space-y-2 border-t border-brand-brown/10 pt-4">
                      {group.items.map((item) => (
                        <li
                          key={item}
                          className="flex items-start gap-2.5 text-xs font-semibold text-brand-brown/80 sm:text-sm"
                        >
                          <CheckCircle2 className="h-4 w-4 text-brand-amber shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              );
            })}

            {/* Custom Category Promo Card */}
            <motion.div
              variants={fadeInUp}
              whileHover={{ y: -4 }}
              className="relative flex flex-col justify-between overflow-hidden rounded-2xl border border-brand-brown/10 bg-brand-brown p-5 sm:p-6 text-white shadow-xl"
            >
              <div className="relative z-10">
                <span className="rounded-full bg-brand-amber/20 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-brand-amber border border-brand-amber/30">
                  Custom Category
                </span>
                <h3 className="mt-4 font-display text-lg sm:text-xl font-bold text-white leading-snug">
                  Have a Specialized Wood Solution?
                </h3>
                <p className="mt-2.5 text-xs leading-relaxed text-white/80 sm:text-sm">
                  The profile listed above is indicative. If your company offers allied machinery, software, chemical treatments, or hardware, Nepal Wood provides a tailor-made booth configuration.
                </p>
              </div>

              <div className="relative z-10 mt-6 border-t border-white/15 pt-4">
                <CTAButton
                  href="/contact"
                  variant="outline"
                  className="w-full justify-center !border-white/30 !text-white hover:!bg-white hover:!text-brand-brown"
                >
                  Discuss Custom Space
                </CTAButton>
              </div>

              {/* Background Ambient Glow */}
              <div className="pointer-events-none absolute -right-10 -bottom-10 h-40 w-40 rounded-full bg-brand-amber/10 blur-2xl" />
            </motion.div>
          </motion.div>
        </Container>
      </section>

      {/* Visitor Category Interest Chart Section */}
      <section className="relative overflow-hidden bg-brand-cream/20 py-12 sm:py-16 border-y border-brand-brown/10">
        <Container>
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-center">
            {/* Left Context */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
              className="lg:col-span-5"
            >
              <div className="inline-flex items-center gap-1.5 rounded-full bg-brand-brown/10 border border-brand-brown/10 px-3.5 py-1 text-[11px] font-bold uppercase tracking-widest text-brand-brown mb-3">
                <BarChart3 className="h-3.5 w-3.5 text-brand-amber" /> Post-Show Market Analysis
              </div>
              <SectionHeading
                kicker="Visitor Demand"
                title="Concentration of Trade Visitor Interest"
                subtitle="Data based on registration analysis from previous editions showing key product search trends of trade buyers."
              />
              <p className="mt-3.5 text-xs leading-relaxed text-brand-brown/75 sm:text-sm">
                High demand for automated woodworking machinery and premium panels (plywood, laminates, MDF) dominates buyer search queries during the 4-day exhibition.
              </p>
            </motion.div>

            {/* Bar Chart Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              viewport={{ once: true }}
              className="lg:col-span-7"
            >
              <div className="rounded-2xl border border-brand-brown/10 bg-white p-5 sm:p-7 shadow-xs">
                <BarChart data={categoryInterest} />
              </div>
            </motion.div>
          </div>
        </Container>
      </section>

      {/* Final Call to Action Section */}
      <section className="relative overflow-hidden bg-brand-brown py-12 sm:py-16 md:py-20 text-center text-white">
        <div className="pointer-events-none absolute -left-20 top-1/2 h-80 w-80 -translate-y-1/2 rounded-full bg-brand-amber/10 blur-3xl" />
        <div className="pointer-events-none absolute -right-20 bottom-0 h-80 w-80 rounded-full bg-brand-amber/5 blur-3xl" />

        <Container>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="max-w-3xl mx-auto relative z-10"
          >
            <span className="inline-block rounded-full bg-brand-amber/10 px-3.5 py-1 text-[11px] font-bold uppercase tracking-widest text-brand-amber border border-brand-amber/20 mb-3.5">
              Maximize Your Market Outreach
            </span>
            <h2 className="font-display text-2xl font-bold text-white sm:text-3xl md:text-4xl leading-tight">
              Does Your Company Serve the Wood, Furniture or Interior Industry?
            </h2>
            <p className="mt-3.5 text-sm sm:text-base text-brand-cream/80 leading-relaxed max-w-2xl mx-auto">
              Book your exhibition stall today to secure prime floor location at Bhrikuti Mandap, Kathmandu.
            </p>

            <div className="mt-7 flex flex-col justify-center gap-3.5 sm:flex-row sm:items-center">
              <CTAButton href="/exhibitor-registration" className="w-full sm:w-auto shadow-md">
                Register to Exhibit Now
              </CTAButton>
              <CTAButton
                href="/downloads/event-brochure"
                variant="outline"
                className="w-full sm:w-auto !border-white/30 !text-white hover:!bg-white hover:!text-brand-brown"
              >
                Download Brochure
              </CTAButton>
            </div>
          </motion.div>
        </Container>
      </section>
    </>
  );
}