"use client";

import Image from "next/image";
import Container from "@/components/shared/container";
import { useBatchReveal } from "@/hooks/useBatchReveal";
import { associations } from "@/lib/site-data";
import { ShieldCheck, Building2 } from "lucide-react";

// Organizers Configuration - Ab yahan se exact Pixel Size control kar sakte ho!
const organizers = [
  {
    id: "futurex",
    logo: "/logo/futurex.png",
    alt: "Futurex Trade Fair and Events",
    url: "https://futurextrade.com/",
    width: 400,
    height: 200,
    // IN VALUES KO CHANGE KARKE SIZE MANUALLY ADJUST KARO:
    sizes: {
      mobile: "115px",  // Mobile Height
      tablet: "110px", // Tablet Height
      laptop: "130px", // Laptop/Desktop Height (Bada size)
    },
  },
  {
    id: "mediaspace",
    logo: "/logo/Media-Space.png",
    alt: "Media Space Solutions",
    url: "https://www.mediaspace.com.np/",
    width: 250,
    height: 100,
    // IN VALUES KO CHANGE KARKE SIZE MANUALLY ADJUST KARO:
    sizes: {
      mobile: "60px",  // Mobile Height
      tablet: "55px",  // Tablet Height
      laptop: "65px",  // Laptop/Desktop Height
    },
  },
];

export default function SupportedByStrip() {
  const stripRef = useBatchReveal<HTMLDivElement>({
    y: 15,
    scale: 0.95,
    stagger: 0.08,
  });

  return (
    <section className="relative z-10 border-y border-brand-brown/6 bg-white py-12 md:py-16">
      <Container>
        <div ref={stripRef} className="space-y-12">
          
          {/* SECTION 1: SUPPORTED BY ASSOCIATIONS */}
          <div>
            <div className="mb-6 text-center">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-amber/8 border border-brand-amber/15 px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-brand-amber">
                <ShieldCheck className="h-3.5 w-3.5" /> Industry Endorsements
              </span>
              <h2 className="mt-2.5 font-display text-2xl font-bold text-brand-brown sm:text-3xl tracking-tight">
               Lanyard Sponsor
              </h2>
            </div>

            <div className="flex flex-wrap justify-center items-center gap-4">
              {associations.map((assoc) => (
                <a
                  key={assoc.name}
                  href={assoc.url || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="reveal-card group relative flex flex-col items-center justify-center max-w-xs w-full sm:w-[calc(50%-1rem)] lg:w-[calc(33.33%-1rem)] rounded-2xl border border-brand-brown/6 bg-brand-cream/50 p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-brand-amber/30 hover:bg-white hover:shadow-md"
                >
                  <div className="relative flex h-20 w-full items-center justify-center overflow-hidden">
                    <Image
                      src={assoc.logo}
                      alt={assoc.name}
                      width={160}
                      height={80}
                      className="max-h-16 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                      }}
                    />
                  </div>

                  <p className="mt-3 text-center font-body text-xs font-semibold leading-tight text-brand-brown transition-colors group-hover:text-brand-amber">
                    {assoc.name}
                  </p>
                </a>
              ))}
            </div>
          </div>

          {/* SECTION 2: ORGANIZERS */}
          <div>
            <div className="mb-6 text-center">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-amber/8 border border-brand-amber/15 px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-brand-amber">
                <Building2 className="h-3.5 w-3.5" /> Organized By
              </span>
              <h2 className="mt-2.5 font-display text-2xl font-bold text-brand-brown sm:text-3xl tracking-tight">
                Industry Leaders Behind the Expo
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 max-w-3xl mx-auto items-stretch">
              {organizers.map((org) => (
                <a
                  key={org.id}
                  href={org.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="reveal-card group relative flex flex-col items-center justify-center rounded-2xl border border-brand-brown/10 bg-brand-cream/30 p-4 sm:p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-brand-amber/40 hover:bg-white hover:shadow-md"
                >
                  <div className="relative flex min-h-[120px] w-full items-center justify-center overflow-hidden">
                    <Image
                      src={org.logo}
                      alt={org.alt}
                      width={org.width}
                      height={org.height}
                      style={{
                        // Dynamic manual height controls
                        "--mobile-h": org.sizes.mobile,
                        "--tablet-h": org.sizes.tablet,
                        "--laptop-h": org.sizes.laptop,
                      } as React.CSSProperties}
                      className="w-auto object-contain transition-transform duration-300 group-hover:scale-105 h-[var(--mobile-h)] sm:h-[var(--tablet-h)] lg:h-[var(--laptop-h)]"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                      }}
                    />
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* DIVIDER */}
          <div className="w-full h-px bg-brand-brown/10 max-w-4xl mx-auto" />
        </div>
      </Container>
    </section>
  );
}