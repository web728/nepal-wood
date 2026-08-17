"use client";

import { useEffect, useRef } from "react";
import { gsap, SplitText, EASE, prefersReducedMotion } from "@/lib/gsap";
import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  kicker?: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center";
  light?: boolean;
  className?: string;
}

export default function SectionHeading({
  kicker,
  title,
  subtitle,
  align = "left",
  light = false,
  className,
}: SectionHeadingProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  // FIX: Type ko HTMLSpanElement se HTMLDivElement change kiya
  const kickerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const titleEl = titleRef.current;
    if (!container || !titleEl) return;

    let split: ReturnType<typeof SplitText.create> | null = null;

    const ctx = gsap.context(() => {
      const kickerEl = kickerRef.current;
      const subtitleEl = subtitleRef.current;

      if (prefersReducedMotion()) {
        const reducedTargets = [kickerEl, titleEl, subtitleEl].filter(Boolean);
        gsap.set(reducedTargets, { opacity: 1, y: 0 });
        return;
      }

      // Setup Precision Line Splitting
      split = SplitText.create(titleEl, {
        type: "lines",
        linesClass: "split-line-inner inline-block w-full pb-1",
      });

      if (split.lines) {
        split.lines.forEach((line) => {
          const wrapper = document.createElement("div");
          wrapper.className = "split-line-mask overflow-hidden py-0.5 -my-0.5 block";
          line.parentNode?.insertBefore(wrapper, line);
          wrapper.appendChild(line);
          gsap.set(line, { yPercent: 120, opacity: 0 });
        });
      }

      if (subtitleEl) {
        gsap.set(subtitleEl, { opacity: 0, y: 20 });
      }
      if (kickerEl) {
        gsap.set(kickerEl, { opacity: 0, y: 10 });
      }

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: "top 88%",
          once: true,
        },
      });

      if (kickerEl && kicker) {
        tl.to(kickerEl, {
          opacity: 1,
          y: 0,
          duration: 0.5,
          ease: "power2.out",
        });
      }

      if (split.lines && split.lines.length > 0) {
        tl.to(
          split.lines,
          {
            yPercent: 0,
            opacity: 1,
            duration: 0.85,
            stagger: 0.08,
            ease: EASE.premium ?? "power3.out",
          },
          kickerEl && kicker ? "-=0.3" : 0
        );
      }

      if (subtitleEl) {
        tl.to(
          subtitleEl,
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: "power2.out",
          },
          "-=0.4"
        );
      }
    }, container);

    return () => {
      ctx.revert();
      split?.revert();
    };
  }, [kicker, title, subtitle]);

  return (
    <div
      ref={containerRef}
      className={cn(
        "max-w-3xl transition-all",
        align === "center" && "mx-auto text-center flex flex-col items-center",
        className
      )}
    >
      {/* Kicker Label */}
      {kicker && (
        <div
          ref={kickerRef}
          className={cn(
            "inline-flex items-center gap-2.5 text-xs font-bold uppercase tracking-[0.25em]",
            light ? "text-brand-amberLight" : "text-brand-maroon",
            align === "center" ? "justify-center" : "justify-start"
          )}
        >
          <span className="h-px w-5 sm:w-8 bg-current opacity-70" />
          <span>{kicker}</span>
          {align === "center" && (
            <span className="h-px w-5 sm:w-8 bg-current opacity-70" />
          )}
        </div>
      )}

      {/* Main Heading Title */}
      <h2
        ref={titleRef}
        className={cn(
          "mt-2.5 font-display text-2xl sm:text-4xl md:text-5xl lg:text-[3.25rem] font-bold leading-[1.18] tracking-tight text-balance overflow-visible",
          light ? "text-white" : "text-brand-brown"
        )}
      >
        {title}
      </h2>

      {/* Subtitle Description */}
      {subtitle && (
        <p
          ref={subtitleRef}
          className={cn(
            "mt-3.5 text-sm sm:text-base md:text-lg leading-relaxed max-w-2xl text-balance",
            light ? "text-white/80" : "text-brand-brown/75"
          )}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}