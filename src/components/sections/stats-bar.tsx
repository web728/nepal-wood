"use client";

import { useRef, useEffect } from "react";
import Container from "@/components/shared/container";
import StatCounter from "@/components/shared/stat-counter";
import { heroStats } from "@/lib/site-data";
import { gsap } from "@/lib/gsap";
import { Users, Building, Maximize2, Globe } from "lucide-react";

const statIcons = [Users, Building, Maximize2, Globe];

export default function StatsBar() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let ctx: gsap.Context;

    const rafId = requestAnimationFrame(() => {
      if (!containerRef.current) return;

      ctx = gsap.context(() => {
        gsap.fromTo(
          ".stat-card",
          { opacity: 0, y: 25, scale: 0.96 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.6,
            stagger: 0.1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: containerRef.current,
              start: "top 90%",
              toggleActions: "play none none none",
            },
          }
        );
      }, containerRef);
    });

    return () => {
      cancelAnimationFrame(rafId);
      if (ctx) ctx.revert();
    };
  }, []);

  return (
    <section className="relative z-20 -mt-10 pb-6 md:-mt-14 md:pb-8">
      <Container>
        <div
          ref={containerRef}
          className="grid grid-cols-2 gap-3 rounded-2xl border border-brand-amber/15 bg-white/90 p-4 shadow-premium-lg backdrop-blur-xl md:grid-cols-4 md:gap-5 md:p-6"
        >
          {heroStats.map((s, idx) => {
            const IconComponent = statIcons[idx % statIcons.length] || Users;

            return (
              <div
                key={s.label}
                className="stat-card group relative overflow-hidden rounded-xl border border-brand-brown/5 bg-brand-cream/50 p-4 md:p-5 transition-all duration-400 hover:-translate-y-0.5 hover:border-brand-amber/30 hover:bg-white hover:shadow-premium"
              >
                <div className="flex items-start gap-3.5">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-brand-amber/15 bg-brand-amber/8 transition-all duration-300 group-hover:border-brand-amber/50 group-hover:bg-brand-amber group-hover:shadow-glow-amber">
                    <IconComponent className="h-5 w-5 text-brand-amber transition-colors duration-300 group-hover:text-brand-brown" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <StatCounter
                      value={s.value}
                      suffix={s.suffix}
                      prefix={"prefix" in s ? (s as { prefix?: string }).prefix : ""}
                      label={s.label}
                      note={s.note}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
