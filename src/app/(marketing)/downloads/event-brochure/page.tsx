import type { Metadata } from "next";
import PageBanner from "@/components/shared/page-banner";
import Container from "@/components/shared/container";
import BrochureDownloadForm from "@/components/forms/brochure-download-form";
import { FileText, Sparkles, CheckCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "2027 Event Brochure | Nepal Wood International Expo",
  description: "Download the official event brochure for Nepal Wood International Expo 2027.",
};

export default function BrochurePage() {
  return (
    <>
      <PageBanner
        kicker="Downloads"
        title="2027 Event Brochure"
        subtitle="Fill in your details to instantly get the comprehensive event profile, floor plan, and exhibitor details."
         bgImage="/images/gallery/img-38.jpg"
      />

      <section className="bg-white py-12 md:py-20">
        <Container>
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 items-start">
            {/* Form Section */}
            <div className="lg:col-span-7 rounded-2xl border border-brand-brown/10 bg-white p-6 md:p-10 shadow-sm">
              <div className="mb-6 space-y-1">
                <h2 className="font-display text-2xl font-bold text-brand-brown">Request Event Brochure</h2>
                <p className="text-xs text-brand-brown/70">
                  Please provide your details below to download the official PDF brochure.
                </p>
              </div>

              <BrochureDownloadForm />
            </div>

            {/* Side Highlights Card */}
            <div className="lg:col-span-5 space-y-6">
              <div className="rounded-2xl border border-brand-amber/30 bg-brand-cream/20 p-6 md:p-8 space-y-6">
                <div className="flex items-center gap-2 text-brand-amber font-bold text-sm tracking-wider uppercase">
                  <Sparkles className="h-4 w-4" /> What's Inside The Brochure?
                </div>

                <ul className="space-y-4 text-sm text-brand-brown/85">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-brand-amber shrink-0 mt-0.5" />
                    <span>Complete breakdown of Exhibitor Categories & Profiles</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-brand-amber shrink-0 mt-0.5" />
                    <span>Comprehensive Visitor Demographics & Expected Footfall</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-brand-amber shrink-0 mt-0.5" />
                    <span>Detailed Venue Layout & Exhibition Stall Tariffs</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-brand-amber shrink-0 mt-0.5" />
                    <span>Sponsorship Packages & Promotional Opportunities</span>
                  </li>
                </ul>

                <div className="border-t border-brand-brown/10 pt-4 text-xs text-brand-brown/70 flex items-center gap-2">
                  <FileText className="h-4 w-4 text-brand-amber" /> PDF Format • Direct Instant Download
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}