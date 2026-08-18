"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Cookie, ShieldCheck, User, Mail, Phone, ChevronDown, ChevronUp } from "lucide-react";
import { gsap, EASE, prefersReducedMotion } from "@/lib/gsap";
import { useCookieConsent } from "@/hooks/useCookieConsent";
import { Button } from "@/components/ui/button";

export default function CookieConsentBanner() {
  const { visible, accept, reject } = useCookieConsent();
  const ref = useRef<HTMLDivElement>(null);
  const [isDismissing, setIsDismissing] = useState(false);
  const [showFields, setShowFields] = useState(false);

  // Identity State
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

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

  // Smooth Exit Animation & Submit
  const handleAction = (actionFn: (lead?: { name?: string; email?: string; phone?: string }) => void) => {
    const leadData = {
      name: name.trim() || undefined,
      email: email.trim() || undefined,
      phone: phone.trim() || undefined,
    };

    if (!ref.current || prefersReducedMotion()) {
      actionFn(leadData);
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
        actionFn(leadData);
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
      className="fixed inset-x-3 bottom-3 z-[90] max-w-4xl mx-auto rounded-3xl border border-brand-brown/10 bg-white/95 backdrop-blur-2xl p-5 sm:p-6 shadow-[0_20px_50px_-10px_rgba(74,42,22,0.18)] transition-all sm:bottom-6 sm:inset-x-6"
    >
      <div className="absolute inset-x-8 top-0 h-[2px] bg-gradient-to-r from-transparent via-brand-amber to-transparent opacity-60" />

      <div className="flex flex-col gap-4 sm:gap-5">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 sm:gap-6">
          
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
                We use cookies to personalize content and improve your experience. Read our{" "}
                <Link
                  href="/privacy-policy"
                  className="font-semibold text-brand-amber underline underline-offset-4 hover:text-brand-brown transition-all"
                >
                  Privacy Policy
                </Link>
                .
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-end gap-2.5 w-full md:w-auto shrink-0 pt-2 md:pt-0 border-t border-brand-brown/5 md:border-t-0">
            <button
              type="button"
              onClick={() => setShowFields(!showFields)}
              className="text-xs font-semibold text-brand-brown/70 hover:text-brand-brown flex items-center gap-1 px-2 py-1 transition-all"
            >
              {showFields ? "Hide Form" : "Provide Info (Optional)"}
              {showFields ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
            </button>

            <Button
              variant="outline"
              size="sm"
              disabled={isDismissing}
              onClick={() => handleAction(reject)}
              className="border-brand-brown/20 text-brand-brown hover:bg-brand-brown/5 rounded-xl px-4 py-2 text-xs sm:text-sm font-semibold transition-all"
            >
              Decline
            </Button>

            <Button
              size="sm"
              disabled={isDismissing}
              onClick={() => handleAction(accept)}
              className="bg-gradient-to-r from-brand-brown via-brand-brown to-brand-amber text-white hover:opacity-95 rounded-xl px-5 py-2 text-xs sm:text-sm font-bold shadow-md shadow-brand-brown/10 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              Accept All
            </Button>
          </div>
        </div>

        {showFields && (
          <div className="pt-3 border-t border-brand-brown/10 grid grid-cols-1 sm:grid-cols-3 gap-3 animate-in fade-in duration-300">
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-brand-brown/40" />
              <input
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-xl border border-brand-brown/15 bg-white/80 pl-9 pr-3 py-2 text-xs text-brand-brown focus:border-brand-amber focus:outline-none"
              />
            </div>

            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-brand-brown/40" />
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-brand-brown/15 bg-white/80 pl-9 pr-3 py-2 text-xs text-brand-brown focus:border-brand-amber focus:outline-none"
              />
            </div>

            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-brand-brown/40" />
              <input
                type="tel"
                placeholder="Mobile"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full rounded-xl border border-brand-brown/15 bg-white/80 pl-9 pr-3 py-2 text-xs text-brand-brown focus:border-brand-amber focus:outline-none"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}