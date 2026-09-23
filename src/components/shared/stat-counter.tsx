"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface StatCounterProps {
  value: number;
  suffix?: string;
  prefix?: string;
  label: string;
  note?: string;
  icon?: ReactNode;
  className?: string;
}

export default function StatCounter({
  value,
  suffix = "",
  prefix = "",
  label,
  note,
  icon,
  className,
}: StatCounterProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;

    let startTime: number;
    const duration = 1500; // 1.5 seconds

    const animateCount = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;
      const percentage = Math.min(progress / duration, 1);
      
      // Easing out effect
      const easeOutValue = 1 - Math.pow(1 - percentage, 3);
      setCount(Math.floor(easeOutValue * value));

      if (percentage < 1) {
        requestAnimationFrame(animateCount);
      } else {
        setCount(value); // Ensure exact final value
      }
    };

    requestAnimationFrame(animateCount);
  }, [isInView, value]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, ease: [0.25, 1, 0.5, 1] }}
      className={cn(
        "stat-card group relative overflow-hidden rounded-2xl p-5 sm:p-6",
        "bg-gradient-to-b from-white via-white/95 to-brand-cream/30 backdrop-blur-md",
        "border border-brand-brown/10 shadow-[0_4px_20px_-4px_rgba(74,42,22,0.05)]",
        "transition-all duration-500 ease-out",
        "hover:-translate-y-1.5 hover:border-brand-amber/40",
        "hover:shadow-[0_20px_40px_-15px_rgba(74,42,22,0.12)]",
        className
      )}
    >
      {/* Top Border Amber Accent Highlight on Hover */}
      <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-brand-amber to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

      {/* Ambient Radial Glow */}
      <div className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full bg-brand-amber/10 blur-2xl transition-all duration-500 group-hover:bg-brand-amber/20 group-hover:scale-125" />

      {/* Header Info: Icon & Note Badge */}
      <div className="relative z-10 flex items-center justify-between gap-3">
        {icon ? (
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-amber/10 text-brand-brown border border-brand-amber/20 shadow-inner transition-all duration-300 group-hover:bg-brand-amber group-hover:text-white group-hover:scale-105">
            {icon}
          </div>
        ) : (
          <div />
        )}

        {note && (
          <span className="inline-flex items-center rounded-full bg-brand-maroon/10 border border-brand-maroon/15 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-brand-maroon shadow-sm">
            {note}
          </span>
        )}
      </div>

      {/* Counter Number Display */}
      <div className="relative z-10 mt-4 font-display text-3xl font-extrabold tracking-tight text-brand-brown sm:text-4xl lg:text-5xl">
        <span className="font-mono tabular-nums inline-block">
          {prefix}{count.toLocaleString("en-US")}{suffix}
        </span>
      </div>

      {/* Label Title */}
      <p className="relative z-10 mt-1.5 font-body text-xs sm:text-sm font-semibold leading-snug text-brand-brown/75 group-hover:text-brand-brown transition-colors duration-300">
        {label}
      </p>
    </motion.div>
  );
}