"use client";

import Image from "next/image";
import Container from "@/components/shared/container";
import SectionHeading from "@/components/shared/section-heading";
import CTAButton from "@/components/shared/cta-button";
import { useBatchReveal } from "@/hooks/useBatchReveal";
import { ArrowUpRight, Images } from "lucide-react";

const previewImages = [
  {
    src: "/images/gallery/glimp-1.jpg",
    alt: "Exhibition Aisle & Booths",
    className: "md:col-span-2 md:row-span-2 min-h-[260px] md:min-h-[360px]",
  },
  {
    src: "/images/gallery/glimp-2.jpg",
    alt: "Live Machinery Demos",
    className: "col-span-1 min-h-[170px] md:min-h-[175px]",
  },
  {
    src: "/images/gallery/glimp-3.jpg",
    alt: "B2B Trade Meetings",
    className: "col-span-1 min-h-[170px] md:min-h-[175px]",
  },
  {
    src: "/images/gallery/glimp-4.jpg",
    alt: "Inauguration & Keynotes",
    className: "md:col-span-2 min-h-[170px] md:min-h-[175px]",
  },
];

export default function GalleryPreview() {
  const gridRef = useBatchReveal<HTMLDivElement>({
    y: 15,
    stagger: 0.08,
  });

  return (
    <section className="relative bg-white py-10 sm:py-14 md:py-16 overflow-hidden">
      {/* Background accent */}
      <div className="pointer-events-none absolute bottom-0 left-0 h-64 w-full bg-gradient-to-t from-brand-cream/50 to-transparent" />

      <Container>
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-brand-amber/8 border border-brand-amber/15 px-3 py-1 text-[10px] sm:text-[11px] font-bold uppercase tracking-widest text-brand-amber mb-2.5">
              <Images className="h-3.5 w-3.5" /> Media Highlights
            </div>
            <SectionHeading
              kicker="Gallery"
              title="Glimpses of the Show"
              subtitle="Key moments, machinery demonstrations, and networking from recent editions."
            />
          </div>

          <CTAButton
            href="/gallery"
            variant="outline"
            className="self-start sm:self-auto group h-10 px-4 text-xs sm:text-sm font-semibold border-brand-brown/15 hover:border-brand-amber"
          >
            View Full Gallery
          </CTAButton>
        </div>

        {/* Pure Image Bento Grid */}
        <div
          ref={gridRef}
          className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-4 md:gap-4"
        >
          {previewImages.map((img) => (
            <div
              key={img.src}
              className={`reveal-card group relative overflow-hidden rounded-xl border border-brand-brown/10 bg-brand-brown/5 shadow-xs transition-shadow duration-300 hover:shadow-md ${img.className}`}
            >
              <Image
                src={img.src}
                alt={img.alt}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}