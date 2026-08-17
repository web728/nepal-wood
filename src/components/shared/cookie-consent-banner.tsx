"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Cookie, ShieldCheck, X } from "lucide-react";
import { gsap, EASE, prefersReducedMotion } from "@/lib/gsap";
import { useCookieConsent } from "@/hooks/useCookieConsent";
import { Button } from "@/components/ui/button";

export default function CookieConsentBanner() {
  const { visible, accept, reject } = useCookieConsent();
  const ref = useRef<HTMLDivElement>(null);
  const [isDismissing, setIsDismissing] = useState(false);

  // Entrance Animation
  useEffect(() => {
    if (!visible || !ref.current) return;
    if (prefersReducedMotion()) {
      gsap.set(ref.current, { y: 0, opacity: 1, scale: 1 });
      return;
    }
    gsap.fromTo(
      ref.current,
      { y: 80, opacity: 0, scale: 0.96 },
      { y: 0, opacity: 1, scale: 1, duration: 0.6, ease: EASE.premium ?? "power3.out" }
    );
  }, [visible]);

  // Smooth Exit Animation Wrapper
  const handleAction = (actionFn: () => void) => {
    if (!ref.current || prefersReducedMotion()) {
      actionFn();
      return;
    }
    setIsDismissing(true);
    gsap.to(ref.current, {
      y: 40,
      opacity: 0,
      scale: 0.95,
      duration: 0.4,
      ease: "power2.in",
      onComplete: () => {
        actionFn();
        setIsDismissing(false);
      },
    });
  };

  if (!visible) return null;

  return (
    <div
      ref={ref}
      role="dialog"
      aria-label="Cookie consent banner"
      className="fixed inset-x-3 bottom-3 z-[90] max-w-4xl mx-auto rounded-3xl border border-brand-brown/10 bg-white/90 backdrop-blur-2xl p-5 sm:p-6 shadow-[0_20px_50px_-10px_rgba(74,42,22,0.18)] transition-all sm:bottom-6 sm:inset-x-6"
    >
      {/* Decorative Glow Line */}
      <div className="absolute inset-x-8 top-0 h-[2px] bg-gradient-to-r from-transparent via-brand-amber to-transparent opacity-60" />

      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 sm:gap-6">
        
        {/* Left Info Section */}
        <div className="flex items-start gap-3 sm:gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-brand-amber/15 text-brand-brown border border-brand-amber/20 shadow-inner">
            <Cookie className="h-5 w-5 text-brand-brown animate-pulse" />
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h4 className="font-display text-sm sm:text-base font-bold text-brand-brown">
                We respect your privacy
              </h4>
              <ShieldCheck className="h-4 w-4 text-emerald-600 hidden sm:inline-block" />
            </div>
            <p className="text-xs sm:text-sm text-brand-brown/80 leading-relaxed max-w-2xl">
              We use cookies to personalize content, analyze traffic, and ensure you get the best experience on Nepal Wood Expo. Read our{" "}
              <Link
                href="/privacy-policy"
                className="font-semibold text-brand-amber underline underline-offset-4 decoration-brand-amber/40 hover:decoration-brand-amber transition-all"
              >
                Privacy Policy
              </Link>
              .
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-2.5 w-full md:w-auto shrink-0 pt-2 md:pt-0 border-t border-brand-brown/5 md:border-t-0">
          <Button
            variant="outline"
            size="sm"
            disabled={isDismissing}
            onClick={() => handleAction(reject)}
            className="flex-1 md:flex-none border-brand-brown/20 text-brand-brown hover:bg-brand-brown/5 hover:text-brand-brown rounded-xl px-5 py-2.5 text-xs sm:text-sm font-semibold transition-all"
          >
            Decline
          </Button>

          <Button
            size="sm"
            disabled={isDismissing}
            onClick={() => handleAction(accept)}
            className="flex-1 md:flex-none bg-gradient-to-r from-brand-brown via-brand-brown to-brand-amber text-white hover:opacity-95 rounded-xl px-6 py-2.5 text-xs sm:text-sm font-bold shadow-md shadow-brand-brown/10 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            Accept All
          </Button>
        </div>

      </div>
    </div>
  );
}