"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { usePathname } from "next/navigation";
import { gsap, EASE, prefersReducedMotion } from "@/lib/gsap";

interface PageTransitionMainProps {
  children: React.ReactNode;
}

/**
 * Wraps <main>, replaying a short GSAP transition on every route change.
 *
 * A true "exit, then navigate, then enter" isn't achievable with plain
 * next/link client navigation — React swaps the tree the instant the new
 * route's content is ready, there's no separate "outgoing" phase to
 * animate. So instead: a quick full-viewport cover fades in, the new
 * page's content fades/slides in underneath it, then the cover fades back
 * out — reads as one continuous transition rather than a hard cut, without
 * fighting how App Router actually swaps content.
 *
 * The overlay is portaled straight to document.body so it sits outside
 * ScrollSmoother's transformed #smooth-content wrapper (a transformed
 * ancestor breaks `position: fixed` descendants — see the note in
 * smooth-scroll-provider.tsx, same reason Header/CookieConsentBanner live
 * outside the smoother).
 */
export default function PageTransitionMain({ children }: PageTransitionMainProps) {
  const pathname = usePathname();
  const mainRef = useRef<HTMLElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const isFirstRender = useRef(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Portal target (document.body) doesn't exist during SSR; flip this
    // post-mount, client-only, same pattern as useCookieConsent.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    const main = mainRef.current;
    const overlay = overlayRef.current;
    if (!main || !overlay || prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      gsap
        .timeline()
        .set(main, { autoAlpha: 0, y: 14 })
        .to(overlay, { autoAlpha: 1, duration: 0.16, ease: EASE.premium })
        .to(main, { autoAlpha: 1, y: 0, duration: 0.4, ease: EASE.premium })
        .to(overlay, { autoAlpha: 0, duration: 0.3, ease: EASE.premium }, "-=0.3");
    });

    return () => ctx.revert();
  }, [pathname]);

  return (
    <>
      <main ref={mainRef} id="main-content" className="flex-1">
        {children}
      </main>
      {mounted &&
        createPortal(
          <div
            ref={overlayRef}
            aria-hidden="true"
            className="pointer-events-none fixed inset-0 z-[80] bg-brand-cream opacity-0"
          />,
          document.body
        )}
    </>
  );
}
