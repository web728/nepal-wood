"use client";

import { useState, useEffect } from "react";
import Container from "@/components/shared/container";
import { heroStats } from "@/lib/site-data";
import { Users, Building, Maximize2, Globe } from "lucide-react";

const statIcons = [Users, Building, Maximize2, Globe];

export default function StatsBar() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [counts, setCounts] = useState<{ [key: string]: number }>({});

  useEffect(() => {
    // Trigger entrance animation immediately on mount
    setIsLoaded(true);

    const duration = 2000;
    const startTime = performance.now();

    const animateNumbers = (timestamp: number) => {
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeProgress = 1 - Math.pow(1 - progress, 3);

      const newCounts: { [key: string]: number } = {};
      heroStats.forEach((s) => {
        newCounts[s.label] = Math.floor(easeProgress * s.value);
      });

      setCounts(newCounts);

      if (progress < 1) {
        requestAnimationFrame(animateNumbers);
      } else {
        const finalCounts: { [key: string]: number } = {};
        heroStats.forEach((s) => {
          finalCounts[s.label] = s.value;
        });
        setCounts(finalCounts);
      }
    };

    const rafId = requestAnimationFrame(animateNumbers);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return (
    <section className="relative z-20 -mt-10 pb-6 md:-mt-14 md:pb-8">
      <Container>
        <div
          className={`grid grid-cols-2 gap-3 rounded-2xl border border-brand-amber/15 bg-white/90 p-4 shadow-premium-lg backdrop-blur-xl md:grid-cols-4 md:gap-5 md:p-6 transition-all duration-700 transform ${
            isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          {heroStats.map((s, idx) => {
            const IconComponent = statIcons[idx % statIcons.length] || Users;
            const currentVal = counts[s.label] ?? 0;
            const prefixVal = "prefix" in s ? (s as { prefix?: string }).prefix : "";

            return (
              <div
                key={s.label}
                className="group relative overflow-hidden rounded-xl border border-brand-brown/5 bg-brand-cream/50 p-4 md:p-5 transition-all duration-400 hover:-translate-y-0.5 hover:border-brand-amber/30 hover:bg-white hover:shadow-premium"
              >
                <div className="flex items-start gap-3.5">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-brand-amber/15 bg-brand-amber/8 transition-all duration-300 group-hover:border-brand-amber/50 group-hover:bg-brand-amber group-hover:shadow-glow-amber">
                    <IconComponent className="h-5 w-5 text-brand-amber transition-colors duration-300 group-hover:text-brand-brown" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <p className="font-display tabular-nums text-xl sm:text-2xl lg:text-3xl font-extrabold text-brand-brown tracking-tight">
                        {prefixVal}{currentVal.toLocaleString("en-US")}{s.suffix}
                      </p>
                      {s.note && (
                        <span className="rounded-full bg-brand-maroon/10 px-2 py-0.5 text-[9px] font-bold uppercase text-brand-maroon">
                          {s.note}
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-xs sm:text-sm font-semibold text-brand-brown/75 truncate">
                      {s.label}
                    </p>
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