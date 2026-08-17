"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollSmoother, ScrollTrigger, prefersReducedMotion } from "@/lib/gsap";

interface SmoothScrollProviderProps {
  children: React.ReactNode;
}

/**
 * Wraps the scrollable page content (main + footer) in GSAP ScrollSmoother.
 *
 * Deliberately desktop-only (matchMedia: pointer-fine, >=1024px) — mobile
 * hardware/real-device testing isn't available in this environment, and
 * native touch scroll reliably feels better than a smoothed scroll on
 * phones anyway (see Prompt 4 Section 1), so touch/small-screen visitors
 * always get plain native scrolling with zero ScrollSmoother overhead.
 *
 * Header, CookieConsentBanner and the Toaster deliberately live OUTSIDE
 * this wrapper (see layout.tsx): ScrollSmoother applies a CSS transform to
 * #smooth-content, and a transformed ancestor becomes the containing block
 * for any `position: fixed` descendant — nesting fixed UI inside would
 * silently break it (it would scroll with the page instead of staying
 * pinned to the viewport).
 */
export default function SmoothScrollProvider({ children }: SmoothScrollProviderProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

useEffect(() => {
  if (prefersReducedMotion()) return;

  const mm = gsap.matchMedia();
  mm.add("(min-width: 1024px) and (pointer: fine)", () => {
    ScrollSmoother.get()?.kill();

    let smoother: ReturnType<typeof ScrollSmoother.create> | null = null;
    try {
      smoother = ScrollSmoother.create({
        wrapper: wrapperRef.current!,
        content: contentRef.current!,
        smooth: 1.1,
        effects: true,
        smoothTouch: 0,
      });
    } catch (err) {
      console.error("[SmoothScrollProvider] ScrollSmoother failed to initialize:", err);
    }

    // Debounced refresh — canvas ke chhote resize events ko
    // loop mein refresh trigger nahi karne dega
    let resizeTimeout: ReturnType<typeof setTimeout> | null = null;
    let resizeObserver: ResizeObserver | null = null;

    if (contentRef.current) {
      resizeObserver = new ResizeObserver(() => {
        if (resizeTimeout) clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
          ScrollTrigger.refresh();
        }, 250); // 250ms debounce
      });
      resizeObserver.observe(contentRef.current);
    }

    if (typeof document !== "undefined" && "fonts" in document) {
      document.fonts.ready.then(() => ScrollTrigger.refresh());
    }

    return () => {
      if (resizeTimeout) clearTimeout(resizeTimeout);
      resizeObserver?.disconnect();
      smoother?.kill();
    };
  });

  return () => mm.revert();
}, []);
  // flex/min-h-full pass the body's sticky-footer flex context down through
  // to <main>/<Footer> now that they're nested inside these wrapper divs
  // instead of being direct children of <body>.
  return (
    <div id="smooth-wrapper" ref={wrapperRef} className="flex min-h-full flex-col">
      <div id="smooth-content" ref={contentRef} className="flex min-h-full flex-1 flex-col">
        {children}
      </div>
    </div>
  );
}
