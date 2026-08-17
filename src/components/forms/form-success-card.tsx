"use client";

import { useEffect, useRef } from "react";
import { CheckCircle2, RotateCcw, Sparkles } from "lucide-react";
import { gsap, EASE, prefersReducedMotion } from "@/lib/gsap";
import { Button } from "@/components/ui/button";

interface FormSuccessCardProps {
  title: string;
  body: string;
  actionLabel: string;
  onAction: () => void;
}

/**
 * Shared success-state confirmation shown after form submission —
 * Features an animated GSAP reveal with premium visual cues and structured CTA.
 */
export default function FormSuccessCard({
  title,
  body,
  actionLabel,
  onAction,
}: FormSuccessCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const iconRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cardEl = cardRef.current;
    const iconEl = iconRef.current;
    if (!cardEl || prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      // Animate card entrance
      gsap.fromTo(
        cardEl,
        { opacity: 0, y: 20, scale: 0.96 },
        { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: EASE.premium }
      );

      // Animate checkmark bounce/scale
      if (iconEl) {
        gsap.fromTo(
          iconEl,
          { scale: 0, rotate: -20 },
          { scale: 1, rotate: 0, duration: 0.5, delay: 0.2, ease: "back.out(1.7)" }
        );
      }
    }, cardEl);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={cardRef}
      className="relative overflow-hidden rounded-2xl border border-brand-amber/30 bg-gradient-to-b from-white via-brand-cream/30 to-brand-cream/60 p-8 sm:p-10 text-center shadow-xl backdrop-blur-sm"
    >
      {/* Decorative background glow */}
      <div className="absolute -top-24 -right-24 h-48 w-48 rounded-full bg-brand-amber/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 h-48 w-48 rounded-full bg-brand-maroon/5 blur-3xl pointer-events-none" />

      {/* Success Badge Icon */}
      <div className="flex justify-center mb-6">
        <div
          ref={iconRef}
          className="relative flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 shadow-md ring-8 ring-emerald-500/10"
        >
          <CheckCircle2 className="h-8 w-8 text-emerald-600" />
          <Sparkles className="absolute -top-1 -right-1 h-5 w-5 text-brand-amber animate-pulse" />
        </div>
      </div>

      {/* Title & Description */}
      <h3 className="font-display text-xl sm:text-2xl font-bold tracking-tight text-brand-brown">
        {title}
      </h3>
      <p className="mt-3 text-sm sm:text-base leading-relaxed text-brand-brown/80 max-w-lg mx-auto">
        {body}
      </p>

      {/* Action CTA */}
      <div className="mt-8 flex justify-center">
        <Button
          variant="outline"
          onClick={onAction}
          className="inline-flex items-center gap-2 border-brand-brown/20 bg-white hover:bg-brand-cream text-brand-brown font-semibold shadow-sm transition-all duration-200 hover:border-brand-amber hover:text-brand-maroon active:scale-95 rounded-xl px-6 py-2.5"
        >
          <RotateCcw className="h-4 w-4 text-brand-amber" />
          <span>{actionLabel}</span>
        </Button>
      </div>
    </div>
  );
}