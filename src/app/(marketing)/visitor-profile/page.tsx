"use client";

import type { Metadata } from "next";
import PageBanner from "@/components/shared/page-banner";
import Container from "@/components/shared/container";
import SectionHeading from "@/components/shared/section-heading";
import DonutChart from "@/components/shared/donut-chart";
import CTAButton from "@/components/shared/cta-button";
import { motion, Variants } from "framer-motion";
import {
  Users,
  Building2,
  Factory,
  Compass,
  PackageCheck,
  CheckCircle2,
  TrendingUp,
  Award,
  ArrowRight,
  Ticket,
} from "lucide-react";

const visitorCategories = [
  {
    icon: Compass,
    title: "Design & Construction",
    badge: "Specifiers",
    items: [
      "Architects & Interior Designers",
      "Builders, Developers & Civil Contractors",
      "Turnkey Project Consultants",
      "Structural Engineers & Specifiers",
    ],
  },
  {
    icon: Factory,
    title: "Manufacturing & Production",
    badge: "Industry Leaders",
    items: [
      "Furniture & Kitchen Manufacturers",
      "Modular Wardrobe Producers",
      "Saw Millers & Primary Timber Processors",
      "OEM Machinery Operators & Technicians",
    ],
  },
  {
    icon: PackageCheck,
    title: "Supply Chain & Trade",
    badge: "Distribution",
    items: [
      "Dealers & Distributors of Woodworking Machinery",
      "Board, Timber & Plywood Stockists",
      "Laminates & Veneer Surface Suppliers",
      "Hardware, Fittings & Tool Traders",
    ],
  },
  {
    icon: Building2,
    title: "Commercial & Institutional",
    badge: "Bulk Procurement",
    items: [
      "Hotels, Restaurants & Resort Buyers",
      "Office Space & Real-Estate Project Purchasing",
      "Industry Association & Government Delegates",
      "Design Academics & Technical Institutes",
    ],
  },
];

const designationBreakdown = [
  { label: "Manager / HOD", value: 34, color: "#C97A2B" },
  { label: "Chairman / CEO / President", value: 22, color: "#7A1F1F" },
  { label: "Director / VP", value: 19, color: "#E0943D" },
  { label: "Sales / Business Development", value: 15, color: "#4A2A16" },
  { label: "Consultant", value: 6, color: "#B08968" },
  { label: "Others", value: 4, color: "#D8C3A5" },
];

// Motion Animation Variants
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

export default function VisitorProfilePage() {
  return (
    <>
      <PageBanner
        kicker="Visitor Profile"
        title="Who Should Attend Nepal Wood 2027?"
        subtitle="Connect with key decision-makers, specifiers, and trade buyers across the woodworking, furniture production, and interior design sectors."
        bgImage="/images/gallery/DSC_7509-1024x683.jpg"
      />

      {/* Target Visitors Section (Compact) */}
<section className="bg-white py-8 sm:py-12 overflow-hidden">
  <Container>
    {/* Compact Header Row */}
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      variants={fadeInUp}
      className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-end mb-6 sm:mb-8"
    >
      <div>
        <div className="inline-flex items-center gap-1 rounded-full bg-brand-amber/10 border border-brand-amber/20 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-brand-amber mb-2">
          <Users className="h-3 w-3" /> Target Audience
        </div>
        <SectionHeading
          kicker="Visitor Spectrum"
          title="Who Attends the Expo"
          subtitle="A premier business networking platform for industry decision-makers."
        />
      </div>

      <div className="hidden lg:block shrink-0">
        <CTAButton href="/visitor-registration" size="sm" className="shadow-xs text-xs">
          <Ticket className="mr-1.5 h-3.5 w-3.5" />
          Free Pass
        </CTAButton>
      </div>
    </motion.div>

    {/* Compact Categorized Cards Grid */}
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-4"
    >
      {visitorCategories.map((cat) => {
        const Icon = cat.icon;
        return (
          <motion.div
            key={cat.title}
            variants={fadeInUp}
            whileHover={{ y: -2 }}
            className="group relative flex flex-col justify-between overflow-hidden rounded-xl border border-brand-brown/10 bg-white p-3.5 sm:p-4 shadow-xs transition-all duration-300 hover:border-brand-amber/40 hover:shadow-sm"
          >
            <div>
              {/* Card Top Info */}
              <div className="flex items-center justify-between gap-2 mb-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-brown text-brand-amber shadow-xs transition-transform duration-300 group-hover:scale-105">
                  <Icon className="h-4 w-4" />
                </div>
                <span className="rounded-full bg-brand-brown/5 border border-brand-brown/10 px-2 py-0.5 text-[9px] font-bold uppercase tracking-tight text-brand-brown">
                  {cat.badge}
                </span>
              </div>

              <h3 className="font-display text-sm font-bold text-brand-brown">
                {cat.title}
              </h3>

              {/* Compact List */}
              <ul className="mt-2.5 space-y-1.5 border-t border-brand-brown/10 pt-2.5">
                {cat.items.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-1.5 text-xs font-medium text-brand-brown/80"
                  >
                    <CheckCircle2 className="h-3.5 w-3.5 text-brand-amber shrink-0 mt-0.5" />
                    <span className="line-clamp-1">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        );
      })}
    </motion.div>
  </Container>
</section>

      {/* Visitor Seniority & Demographics Analytics Section (Compact) */}
<section className="relative overflow-hidden bg-brand-cream/20 py-8 sm:py-12 border-y border-brand-brown/10">
  <Container>
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-center">
      {/* Left Info Column */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeInUp}
        className="lg:col-span-5"
      >
        <div className="inline-flex items-center gap-1 rounded-full bg-brand-brown/10 border border-brand-brown/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-brand-brown mb-2">
          <TrendingUp className="h-3 w-3 text-brand-amber" /> Senior Management Audience
        </div>
        <SectionHeading
          kicker="Previous Edition Report"
          title="Visitor Designation Breakdown"
          subtitle="High-caliber B2B buyers and decision-makers dominate the trade show floor."
        />

        {/* Stat Card Highlight */}
        <motion.div
          whileHover={{ scale: 1.01 }}
          className="mt-4 flex items-center gap-3 rounded-xl border border-brand-brown/10 bg-white p-3 sm:p-3.5 shadow-xs"
        >
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-brown text-brand-amber shadow-xs">
            <Award className="h-4.5 w-4.5" />
          </div>
          <div>
            <div className="font-display text-base sm:text-lg font-extrabold text-brand-brown leading-none">
              75% Decision-Makers
            </div>
            <p className="text-[11px] sm:text-xs text-brand-brown/75 leading-tight mt-1">
              CXO, Director, Management, or Strategic Purchasing roles.
            </p>
          </div>
        </motion.div>
      </motion.div>

      {/* Right Chart Card Column */}
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        viewport={{ once: true }}
        className="lg:col-span-7"
      >
        <div className="rounded-xl border border-brand-brown/10 bg-white p-4 sm:p-5 shadow-xs">
          <DonutChart
            data={designationBreakdown}
            centerValue="75%"
            centerLabel="Senior Management"
          />
        </div>
      </motion.div>
    </div>
  </Container>
</section>

  {/* Final Call to Action Section (Compact) */}
<section className="relative overflow-hidden bg-brand-brown py-8 sm:py-12 text-center text-white">
  <div className="pointer-events-none absolute -left-20 top-1/2 h-60 w-60 -translate-y-1/2 rounded-full bg-brand-amber/10 blur-2xl" />
  <div className="pointer-events-none absolute -right-20 bottom-0 h-60 w-60 rounded-full bg-brand-amber/5 blur-2xl" />

  <Container>
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={fadeInUp}
      className="max-w-2xl mx-auto relative z-10"
    >
      <span className="inline-block rounded-full bg-brand-amber/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-brand-amber border border-brand-amber/20 mb-2">
        Join Nepal’s Largest Wood & Interiors Expo
      </span>
      <h2 className="font-display text-xl sm:text-2xl md:text-3xl font-bold text-white leading-snug">
        If Your Business Involves Wood, Furniture or Interiors — Nepal Wood 2027 is Essential.
      </h2>
      <p className="mt-2 text-xs sm:text-sm text-brand-cream/80 leading-relaxed max-w-xl mx-auto">
        Register now for complimentary admission or explore exhibiting options to showcase your brand.
      </p>

      <div className="mt-5 flex flex-col justify-center gap-2.5 sm:flex-row sm:items-center">
        <CTAButton href="/visitor-registration" size="sm" className="w-full sm:w-auto shadow-xs text-xs">
          Register to Visit
        </CTAButton>
        <CTAButton
          href="/exhibitor-registration"
          variant="outline"
          size="sm"
          className="w-full sm:w-auto !border-white/30 !text-white hover:!bg-white hover:!text-brand-brown text-xs"
        >
          Book a Booth Space
        </CTAButton>
      </div>
    </motion.div>
  </Container>
</section>
    </>
  );
}