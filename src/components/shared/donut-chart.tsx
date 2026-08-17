"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, EASE, prefersReducedMotion } from "@/lib/gsap";

export interface DonutDatum {
  label: string;
  value: number;
  color: string;
}

interface DonutChartProps {
  data: DonutDatum[];
  size?: number;
  centerLabel?: string;
  centerValue?: string;
}

/** Premium Animated Donut Chart with GSAP Entry & Dynamic Hover Syncing */
export default function DonutChart({
  data,
  size = 240,
  centerLabel = "Senior Management",
  centerValue = "75%",
}: DonutChartProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  
  // Hover State Management
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const strokeWidth = 24;
  const radius = size / 2 - strokeWidth / 2 - 4;
  const circumference = 2 * Math.PI * radius;
  const total = data.reduce((sum, d) => sum + d.value, 0) || 1;

  // Initial Entrance Animation with GSAP
  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    const segments = svg.querySelectorAll<SVGCircleElement>("[data-segment]");

    if (prefersReducedMotion()) {
      segments.forEach((seg) => seg.setAttribute("stroke-width", String(strokeWidth)));
      return;
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(
        segments,
        { strokeWidth: 0, opacity: 0 },
        {
          strokeWidth,
          opacity: 1,
          duration: 1,
          stagger: 0.12,
          ease: EASE.premium,
          scrollTrigger: { trigger: svg, start: "top 85%", once: true },
        }
      );
    }, svg);

    return () => ctx.revert();
  }, [strokeWidth]);

  // Segment offset mapping
  const segments = data.reduce<
    { label: string; value: number; color: string; dash: number; offset: number; percent: number }[]
  >((acc, d) => {
    const priorDash = acc.reduce((sum, s) => sum + s.dash, 0);
    const dash = (d.value / total) * circumference;
    const percent = Math.round((d.value / total) * 100);
    acc.push({ label: d.label, value: d.value, color: d.color, dash, offset: -priorDash, percent });
    return acc;
  }, []);

  // Active Item Data for Hover Display
  const activeSegment = hoveredIndex !== null ? segments[hoveredIndex] : null;
  const activeValue = activeSegment ? `${activeSegment.percent}%` : centerValue;
  const activeLabel = activeSegment ? activeSegment.label : centerLabel;

  return (
    <div className="flex flex-col items-center justify-between gap-8 sm:flex-row sm:items-center">
      {/* SVG Donut Container */}
      <div className="relative shrink-0 flex items-center justify-center" style={{ width: size, height: size }}>
        <svg
          ref={svgRef}
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className="-rotate-90 transform overflow-visible"
        >
          {/* Subtle Background Track Ring */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="#4A2A160F"
            strokeWidth={strokeWidth - 4}
          />

          {/* Interactive Donut Segments */}
          {segments.map((s, idx) => {
            const isHovered = hoveredIndex === idx;
            const isAnyHovered = hoveredIndex !== null;

            return (
              <circle
                key={s.label}
                data-segment
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="none"
                stroke={s.color}
                strokeWidth={isHovered ? strokeWidth + 4 : strokeWidth}
                strokeDasharray={`${s.dash} ${circumference - s.dash}`}
                strokeDashoffset={s.offset}
                strokeLinecap="butt"
                className="cursor-pointer transition-all duration-300 ease-out"
                style={{
                  opacity: isAnyHovered ? (isHovered ? 1 : 0.35) : 1,
                  filter: isHovered ? `drop-shadow(0px 4px 12px ${s.color}66)` : "none",
                }}
                onMouseEnter={() => setHoveredIndex(idx)}
                onMouseLeave={() => setHoveredIndex(null)}
              />
            );
          })}
        </svg>

        {/* Dynamic Center HUD Display */}
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center p-4">
          <span
            key={activeValue}
            className="font-display text-2xl sm:text-3xl font-extrabold text-brand-brown transition-all duration-200 transform scale-100"
          >
            {activeValue}
          </span>
          <span
            key={activeLabel}
            className="mt-0.5 max-w-[8.5rem] text-center text-[11px] sm:text-xs font-semibold text-brand-brown/70 leading-tight transition-all duration-200"
          >
            {activeLabel}
          </span>
        </div>
      </div>

      {/* Interactive Legend List */}
      <ul className="w-full flex-1 space-y-2">
        {segments.map((s, idx) => {
          const isHovered = hoveredIndex === idx;

          return (
            <li
              key={s.label}
              onMouseEnter={() => setHoveredIndex(idx)}
              onMouseLeave={() => setHoveredIndex(null)}
              className={`flex items-center gap-3 rounded-xl p-2.5 text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer ${
                isHovered
                  ? "bg-brand-brown/10 shadow-xs translate-x-1"
                  : "bg-brand-cream/30 hover:bg-brand-brown/5"
              }`}
            >
              <span
                className="h-3 w-3 shrink-0 rounded-sm transition-transform duration-200"
                style={{
                  backgroundColor: s.color,
                  transform: isHovered ? "scale(1.25)" : "scale(1)",
                }}
              />
              <span
                className={`flex-1 transition-colors ${
                  isHovered ? "text-brand-brown font-bold" : "text-brand-brown/80"
                }`}
              >
                {s.label}
              </span>
              <span className="font-extrabold text-brand-brown">{s.percent}%</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}