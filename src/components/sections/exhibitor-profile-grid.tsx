"use client";

import Link from "next/link";
import Image from "next/image";
import Container from "@/components/shared/container";
import SectionHeading from "@/components/shared/section-heading";
import { useBatchReveal } from "@/hooks/useBatchReveal";
import { exhibitorCategories } from "@/lib/site-data";
import { ArrowUpRight } from "lucide-react";

export default function ExhibitorProfileGrid() {
  const gridRef = useBatchReveal<HTMLDivElement>();

  return (
    <section className="relative bg-brand-cream py-8 sm:py-10 md:py-12 overflow-hidden">
      <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 h-px w-24 bg-gradient-to-r from-transparent via-brand-amber/30 to-transparent" />

      <Container>
        {/* Compact Heading Spacing */}
        <SectionHeading
          kicker="Exhibitor Profile"
          title="What you'll find on the show floor"
          subtitle="A complete cross-section of the wood, panel, machinery and furniture-production industry."
          className="max-w-xl"
        />

        {/* Compact Grid */}
        <div 
          ref={gridRef} 
          className="mt-6 sm:mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5 lg:gap-4"
        >
          {exhibitorCategories.map((cat) => (
            <Link
              key={cat.label}
              href="/exhibitor-profile"
              className="reveal-card group relative overflow-hidden rounded-xl border border-brand-brown/6 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-brand-amber/30 hover:shadow-md"
            >
              {/* Reduced Image Height (h-24 sm:h-28) */}
              <div className="relative h-24 sm:h-28 w-full overflow-hidden">
                <Image
                  src={cat.image}
                  alt={cat.label}
                  fill
                  sizes="(max-width: 768px) 50vw, 20vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-brown/60 via-transparent to-transparent transition-opacity group-hover:from-brand-brown/40" />
                <div className="absolute right-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-md bg-white/20 text-white opacity-0 backdrop-blur-sm transition-all duration-300 group-hover:opacity-100">
                  <ArrowUpRight className="h-3 w-3" />
                </div>
              </div>

              {/* Reduced Text Padding */}
              <div className="p-2.5 text-center">
                <span className="font-display text-xs sm:text-sm font-semibold text-brand-brown group-hover:text-brand-amber transition-colors line-clamp-1">
                  {cat.label}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}