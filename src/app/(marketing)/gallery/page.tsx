import type { Metadata } from "next";
import { Images, Sparkles, Camera, Award, ShieldCheck } from "lucide-react";

import PageBanner from "@/components/shared/page-banner";
import Container from "@/components/shared/container";
import LightboxGallery from "@/components/shared/lightbox-gallery";
import { getGalleryImages } from "@/lib/gallery-data";

export const metadata: Metadata = {
  title: "Gallery | Nepal Wood International Expo 2027",
  description:
    "Explore photos from previous editions of Nepal Wood International Expo — machinery live demos, exhibitor stalls, B2B meetings, and trade show highlights.",
};

const highlights = [
  { icon: Camera, title: "High-Res Photography", desc: "Detailed Machinery & Stalls" },
  { icon: Award, title: "International Stands", desc: "Over 10+ Country Pavilions" },
  { icon: ShieldCheck, title: "Verified Displays", desc: "Live Working Demos" },
];

export default function GalleryPage() {
  const images = getGalleryImages();
  return (
    <>
      {/* Hero Page Banner */}
      <PageBanner
        kicker="Visual Highlights"
        title="Glimpses of Nepal Wood Expo"
        subtitle="A visual showcase of heavy machinery demonstrations, raw material displays, high-level business networking, and international exhibitor stands from past editions."
        bgImage="/expo/expo-34.jpeg"
      />

      <section className="bg-slate-50/50 py-12 lg:py-16">
        <Container>
       

          {/* Section Header */}
          <div className="mb-8 flex flex-col items-start justify-between gap-4 border-b border-brand-brown/10 pb-6 sm:flex-row sm:items-center">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-amber/10 px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-brand-brown">
                <Sparkles className="h-3.5 w-3.5 text-brand-amber" /> Event Highlights
              </span>
              <h2 className="mt-2 font-display text-2xl font-bold text-brand-brown sm:text-3xl">
                Showcase & Expo Flooring
              </h2>
            </div>

           
          </div>

          {/* Optimized Lightbox Gallery with Lazy Loading */}
       <LightboxGallery images={images} />
        </Container>
      </section>
    </>
  );
}