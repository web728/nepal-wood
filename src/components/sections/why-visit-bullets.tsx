"use client";

import { useGsapReveal } from "@/hooks/useGsapReveal";
import { CheckCircle2 } from "lucide-react";

const points = [
  "Discover new products, machinery and materials",
  "Compare domestic and international suppliers",
  "Attend live machinery demonstrations",
  "Find solutions for current and future projects",
  "Meet manufacturers, dealers, architects and associations",
  "Build valuable industry connections",
];

export default function WhyVisitBullets() {
  const ref = useGsapReveal<HTMLUListElement>({ selector: "li", stagger: 0.08 });

  return (
    <ul
      ref={ref}
      className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:gap-5"
    >
      {points.map((p) => (
        <li
          key={p}
          className="group relative flex items-start gap-3.5 rounded-2xl border border-white/10 bg-white/[0.04] p-4 sm:p-5 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-brand-amber/40 hover:bg-white/[0.08] hover:shadow-lg hover:shadow-brand-amber/5"
        >
          {/* Glowing Indicator Icon Wrapper */}
          <div className="mt-0.5 flex shrink-0 items-center justify-center rounded-lg bg-brand-amber/10 p-1.5 text-brand-amber transition-colors duration-300 group-hover:bg-brand-amber group-hover:text-brand-brown">
            <CheckCircle2 className="h-4 w-4 stroke-[2.5]" />
          </div>

          {/* Point Description Text */}
          <p className="text-sm font-medium leading-relaxed text-white/90 transition-colors group-hover:text-white sm:text-base">
            {p}
          </p>
        </li>
      ))}
    </ul>
  );
}