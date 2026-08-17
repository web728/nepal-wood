"use client";

import { useRef, useEffect } from "react";
import Container from "@/components/shared/container";
import CTAButton from "@/components/shared/cta-button";
import { Layers, Sparkles, ArrowRight } from "lucide-react";
import { gsap } from "@/lib/gsap";

export default function ConcurrentEvents() {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let ctx: gsap.Context;

    const rafId = requestAnimationFrame(() => {
      if (!cardRef.current) return;

      ctx = gsap.context(() => {
        gsap.fromTo(
          cardRef.current,
          { opacity: 0, y: 16 },
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            ease: "power2.out",
            scrollTrigger: {
              trigger: cardRef.current,
              start: "top 90%",
              toggleActions: "play none none none",
            },
          }
        );
      }, cardRef);
    });

    return () => {
      cancelAnimationFrame(rafId);
      if (ctx) ctx.revert();
    };
  }, []);

  return (
    <section className="relative overflow-hidden bg-brand-cream/40 py-6 sm:py-8 md:py-10">
      <Container>
        <div
          ref={cardRef}
          className="relative overflow-visible rounded-xl border border-brand-amber/20 bg-white p-5 sm:p-6 shadow-sm transition-all duration-300 hover:shadow-md"
        >
          {/* Subtle Ambient Background Light */}
          <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-brand-amber/10 blur-[50px]" />
          <div className="pointer-events-none absolute -left-10 -bottom-10 h-32 w-32 rounded-full bg-brand-maroon/5 blur-[50px]" />

          <div className="relative z-10 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            {/* Left Content Block */}
            <div className="max-w-3xl overflow-visible">
              <div className="inline-flex items-center gap-1.5 rounded-full border border-brand-maroon/15 bg-brand-maroon/8 px-3 py-1 text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.18em] text-brand-maroon">
                <Sparkles className="h-3 w-3 text-brand-maroon" />
                <span>Concurrent Event</span>
              </div>

              <div className="mt-3 flex items-start gap-3.5 overflow-visible">
                <div className="hidden sm:flex shrink-0 items-center justify-center rounded-lg bg-brand-amber/10 p-2.5 text-brand-amber">
                  <Layers className="h-5 w-5" />
                </div>
                <div className="overflow-visible pb-1">
                  <h3 className="font-display text-xl sm:text-2xl font-bold text-brand-brown leading-[1.25] tracking-tight pb-0.5 overflow-visible">
                    Hometex Nepal 2027
                  </h3>
                  <p className="mt-1 font-body text-xs sm:text-sm leading-relaxed text-brand-brown/70">
                    A co-located platform for home textiles, home d&eacute;cor, and interior lifestyle products&mdash;creating additional cross-industry sourcing, trade synergies, and high-value networking opportunities.
                  </p>
                </div>
              </div>
            </div>

            {/* Right Action Button */}
            <div className="flex shrink-0 items-center mt-2 lg:mt-0">
              <CTAButton
                href="/contact"
                variant="outline"
                className="h-10 px-5 text-xs sm:text-sm font-semibold w-full sm:w-auto border-brand-amber/40 text-brand-brown hover:bg-brand-amber hover:text-white transition-all group"
              >
                Learn More
               
              </CTAButton>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}