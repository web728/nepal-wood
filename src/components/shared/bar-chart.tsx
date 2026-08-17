"use client";

import { useEffect, useRef } from "react";
import { gsap, EASE, prefersReducedMotion } from "@/lib/gsap";

export interface BarDatum {
  label: string;
  value: number; // 0-100
}

/** Animated horizontal bar chart, GSAP-driven with animated percentage counter. */
export default function BarChart({ data }: { data: BarDatum[] }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const bars = el.querySelectorAll<HTMLElement>("[data-bar-fill]");
    const counters = el.querySelectorAll<HTMLElement>("[data-counter]");

    if (prefersReducedMotion()) {
      bars.forEach((bar) => {
        bar.style.width = `${bar.dataset.value}%`;
      });
      counters.forEach((counter) => {
        counter.textContent = `${counter.dataset.target}%`;
      });
      return;
    }

    const ctx = gsap.context(() => {
      bars.forEach((bar, i) => {
        const targetValue = parseFloat(bar.dataset.value || "0");
        const counterEl = counters[i];

        // 1. Smooth Bar Fill Animation
        gsap.fromTo(
          bar,
          { width: "0%" },
          {
            width: `${targetValue}%`,
            duration: 1.4,
            delay: i * 0.12,
            ease: EASE.premium ?? "power3.out",
            scrollTrigger: { 
              trigger: el, 
              start: "top 85%", 
              once: true 
            },
          }
        );

        // 2. Animated Percentage Counter (0% -> target%)
        if (counterEl) {
          const counterObj = { val: 0 };
          gsap.to(counterObj, {
            val: targetValue,
            duration: 1.4,
            delay: i * 0.12,
            ease: EASE.premium ?? "power3.out",
            scrollTrigger: { 
              trigger: el, 
              start: "top 85%", 
              once: true 
            },
            onUpdate: () => {
              counterEl.textContent = `${Math.round(counterObj.val)}%`;
            },
          });
        }
      });
    }, el);

    return () => ctx.revert();
  }, [data]);

  return (
    <div ref={ref} className="space-y-6">
      {data.map((d) => (
        <div key={d.label} className="group">
          {/* Label & Number Header */}
          <div className="mb-2 flex items-center justify-between text-sm sm:text-base">
            <span className="font-semibold text-brand-brown group-hover:text-brand-amber transition-colors duration-300">
              {d.label}
            </span>
            <span
              data-counter
              data-target={d.value}
              className="font-mono font-bold text-brand-brown/80"
            >
              0%
            </span>
          </div>

          {/* Bar Container Track */}
          <div className="relative h-3 w-full overflow-hidden rounded-full bg-brand-brown/5 p-0.5 border border-brand-brown/10 shadow-inner">
            {/* Animated Bar Fill */}
            <div
              data-bar-fill
              data-value={d.value}
              className="relative h-full rounded-full bg-gradient-to-r from-brand-brown via-brand-amber to-amber-500 shadow-sm"
              style={{ width: "0%" }}
            >
              {/* Soft Light Shimmer Overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-80" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}