"use client";

import type { Metadata } from "next";
import PageBanner from "@/components/shared/page-banner";
import Container from "@/components/shared/container";
import ExhibitorRegistrationForm from "@/components/forms/exhibitor-registration-form";
import CTAButton from "@/components/shared/cta-button";
import { contactDetails } from "@/lib/site-data";
import { motion, Variants } from "framer-motion";
import {
  FileText,
  PhoneCall,
  Mail,
  Download,
  Building2,
  CheckCircle2,
  ShieldCheck,
  HelpCircle,
  Sparkles,
  ArrowUpRight,
} from "lucide-react";

const exhibitorBenefits = [
  "Direct access to 12,000+ targeted B2B trade visitors",
  "Prime exhibition space in central Kathmandu",
  "Complimentary digital & event directory listing",
  "B2B buyer matchmaking support",
];

// Minimal Animation Variants
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
      staggerChildren: 0.08,
      delayChildren: 0.05,
    },
  },
};

export default function ExhibitorRegistrationPage() {
  return (
    <>
      <PageBanner
        kicker="Exhibitor Space Booking"
        title="Register Your Space & Showcase Your Innovations"
        subtitle="Submit your company profile and space requirements. Our sales team will get back to you with stall availability, pricing packages, and custom booth configurations."
        bgImage="/images/gallery/img-36.jpg"
      />

      <section className="bg-white py-10 sm:py-14 md:py-16 overflow-hidden">
        <Container>
          {/* Top Quick Benefits Strip */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={fadeInUp}
            className="mb-8 md:mb-10 rounded-2xl border border-brand-brown/10 bg-gradient-to-r from-brand-cream/60 via-white to-brand-cream/60 p-5 sm:p-7 shadow-xs"
          >
            <div className="flex flex-wrap items-center gap-2 mb-3.5">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-amber/10 border border-brand-amber/20 px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-brand-amber">
                <Sparkles className="h-3.5 w-3.5" /> Exhibitor Privileges
              </span>
              <p className="font-display text-xs sm:text-sm font-bold text-brand-brown uppercase tracking-wider">
                Included with Participation
              </p>
            </div>

            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4"
            >
              {exhibitorBenefits.map((benefit) => (
                <motion.div
                  key={benefit}
                  variants={fadeInUp}
                  whileHover={{ y: -2 }}
                  className="flex items-start gap-2.5 rounded-xl border border-brand-brown/10 bg-white p-3 sm:p-3.5 shadow-2xs transition-all duration-300 hover:border-brand-amber/30 hover:shadow-xs"
                >
                  <CheckCircle2 className="h-4 w-4 text-brand-amber shrink-0 mt-0.5" />
                  <span className="text-xs sm:text-sm font-semibold text-brand-brown/85 leading-snug">
                    {benefit}
                  </span>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Main Form & Sidebar Grid */}
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-10">
            {/* Left Column - Main Form Wrapper */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
              className="lg:col-span-8"
            >
              <div className="rounded-2xl border border-brand-brown/10 bg-white p-5 sm:p-8 shadow-xs">
                <div className="mb-6 border-b border-brand-brown/10 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <span className="inline-block rounded-md bg-brand-brown/5 px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-widest text-brand-brown border border-brand-brown/10 mb-1.5">
                      Exhibitor Application
                    </span>
                    <h2 className="font-display text-xl sm:text-2xl font-bold text-brand-brown">
                      Space Interest &amp; Inquiry Form
                    </h2>
                    <p className="text-xs sm:text-sm text-brand-brown/70 mt-1">
                      Please provide your business details below. All fields marked with an asterisk (*) are required.
                    </p>
                  </div>

                  <div className="hidden sm:flex items-center gap-2 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200/60 px-3 py-1.5 rounded-full shrink-0">
                    <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span>Booths Available</span>
                  </div>
                </div>

                <ExhibitorRegistrationForm />
              </div>
            </motion.div>

            {/* Right Column - Sidebar Callouts & Sales Desk */}
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="flex flex-col gap-5 lg:col-span-4"
            >
              {/* Brochure Download Box */}
              <motion.div
                variants={fadeInUp}
                whileHover={{ y: -3 }}
                className="group relative overflow-hidden rounded-2xl border border-brand-brown/10 bg-gradient-to-br from-brand-cream/80 to-white p-5 sm:p-6 shadow-2xs transition-all duration-300 hover:border-brand-amber/40 hover:shadow-xs"
              >
                <div className="flex items-center justify-between mb-3.5">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-brown text-brand-amber shadow-md">
                    <FileText className="h-5 w-5" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-brand-brown/60 group-hover:text-brand-amber transition-colors">
                    PDF Guide
                  </span>
                </div>

                <h3 className="font-display text-base sm:text-lg font-bold text-brand-brown">
                  Official Event Sales Prospectus
                </h3>
                <p className="mt-1.5 text-xs leading-relaxed text-brand-brown/75 sm:text-sm">
                  Review floor plan layouts, stall options, attendee demographics, and sponsorship opportunities.
                </p>

                <div className="mt-5">
                  <CTAButton
                    href="/downloads/event-brochure"
                    variant="outline"
                    className="w-full justify-center text-xs font-bold shadow-2xs hover:shadow-xs"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Download Prospectus
                  </CTAButton>
                </div>
              </motion.div>

              {/* Direct Contacts Card */}
              <motion.div
                variants={fadeInUp}
                className="rounded-2xl border border-brand-brown/10 bg-white p-5 sm:p-6 shadow-xs"
              >
                <div className="flex items-center gap-2 mb-3 border-b border-brand-brown/10 pb-3">
                  <ShieldCheck className="h-5 w-5 text-brand-amber" />
                  <h3 className="font-display text-base font-bold text-brand-brown">
                    Direct Sales Desk
                  </h3>
                </div>
                <p className="text-xs text-brand-brown/70 mb-4">
                  Prefer to speak directly? Reach out to our regional managers for instant booth allocation assistance:
                </p>

                <div className="space-y-4">
                  {/* International / India Sales Contacts */}
                  <div>
                    <span className="inline-block rounded bg-brand-brown/5 px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-brand-brown border border-brand-brown/10 mb-2.5">
                      International &amp; India Desk
                    </span>
                    <div className="space-y-2.5">
                      {contactDetails.indiaContacts.map((c) => (
                        <div
                          key={c.name}
                          className="rounded-xl border border-brand-brown/10 bg-brand-cream/30 p-3"
                        >
                          <p className="font-display text-xs font-bold text-brand-brown">{c.name}</p>
                          <div className="mt-1 flex flex-col gap-1 text-xs text-brand-brown/80">
                            <a
                              href={`tel:${c.phone.replace(/\s/g, "")}`}
                              className="inline-flex items-center gap-1.5 hover:text-brand-amber font-semibold transition-colors"
                            >
                              <PhoneCall className="h-3 w-3 text-brand-amber shrink-0" />
                              {c.phone}
                            </a>
                            <a
                              href={`mailto:${c.email}`}
                              className="inline-flex items-center gap-1.5 hover:text-brand-amber transition-colors"
                            >
                              <Mail className="h-3 w-3 text-brand-amber shrink-0" />
                              {c.email}
                            </a>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Nepal Regional Coordination */}
                  <div className="border-t border-brand-brown/10 pt-3.5">
                    <span className="inline-block rounded bg-brand-brown/5 px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-brand-brown border border-brand-brown/10 mb-2.5">
                      Nepal Secretariat
                    </span>
                    <div className="rounded-xl border border-brand-brown/10 bg-brand-cream/30 p-3">
                      <p className="font-display text-xs font-bold text-brand-brown">
                        {contactDetails.nepalContact.name}
                      </p>
                      <div className="mt-1 flex flex-col gap-1 text-xs text-brand-brown/80">
                        <a
                          href={`tel:${contactDetails.nepalContact.phone.replace(/\s/g, "")}`}
                          className="inline-flex items-center gap-1.5 hover:text-brand-amber font-semibold transition-colors"
                        >
                          <PhoneCall className="h-3 w-3 text-brand-amber shrink-0" />
                          {contactDetails.nepalContact.phone}
                        </a>
                        <a
                          href={`mailto:${contactDetails.nepalContact.email}`}
                          className="inline-flex items-center gap-1.5 hover:text-brand-amber transition-colors"
                        >
                          <Mail className="h-3 w-3 text-brand-amber shrink-0" />
                          {contactDetails.nepalContact.email}
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Need Custom Requirements Box */}
              <motion.div
                variants={fadeInUp}
                className="rounded-2xl border border-brand-amber/30 bg-gradient-to-r from-brand-amber/10 to-transparent p-4 sm:p-5"
              >
                <div className="flex items-start gap-3">
                  <HelpCircle className="h-5 w-5 text-brand-brown shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-display text-xs font-bold uppercase tracking-wider text-brand-brown">
                      Custom Heavy Machinery Requirements?
                    </h4>
                    <p className="mt-1 text-xs text-brand-brown/80 leading-relaxed">
                      If you require high-voltage power lines, overhead crane access, or custom pavilion spaces over 50 sqm, please mention it in the form comments.
                    </p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </Container>
      </section>
    </>
  );
}