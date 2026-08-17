"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger, EASE, prefersReducedMotion } from "@/lib/gsap";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export interface UseGsapRevealOptions {
  selector?: string;
  y?: number;
  duration?: number;
  stagger?: number;
  start?: string;
  delay?: number;
}

/**
 * Fade-up-on-scroll-enter reveal, optionally staggered across children.
 */
export function useGsapReveal<T extends HTMLElement = HTMLDivElement>(
  options: UseGsapRevealOptions = {}
) {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    if (typeof window === "undefined" || !ScrollTrigger) return;
    gsap.registerPlugin(ScrollTrigger);

    const el = ref.current;
    if (!el) return;

    const {
      selector,
      y = 24,
      duration = 0.7,
      stagger = 0.1,
      start = "top 85%",
      delay = 0,
    } = options;

    const ctx = gsap.context(() => {
      // FIX 1: Robust targets resolving using gsap.utils.toArray
      let targets: Element[] = [];
      if (selector) {
        targets = gsap.utils.toArray(selector, el);
      } else {
        targets = el.children.length > 0 ? Array.from(el.children) : [el];
      }

      // Safeguard against missing/empty elements
      if (!targets || targets.length === 0) return;

      if (prefersReducedMotion()) {
        gsap.set(targets, { opacity: 1, y: 0 });
        return;
      }

      // FIX 2: Check node connection to DOM before binding ScrollTrigger
      if (!el.isConnected) return;

      // FIX 3: Safe execution with requestAnimationFrame & end fallback
      requestAnimationFrame(() => {
        if (!el.isConnected) return;

        gsap.fromTo(
          targets,
          { opacity: 0, y },
          {
            opacity: 1,
            y: 0,
            duration,
            delay,
            stagger,
            ease: EASE?.premium ?? "power2.out",
            scrollTrigger: {
              trigger: el,
              start: start,
              end: "bottom top", // Explicit fallback prevents reading undefined 'end'
              once: true,
              invalidateOnRefresh: true,
            },
          }
        );
      });
    }, el);

    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return ref;
}

export interface UseParallaxOptions {
  speed?: number;
}

/**
 * Subtle scroll-linked parallax for a background layer.
 */
export function useParallax<T extends HTMLElement = HTMLDivElement>(
  options: UseParallaxOptions = {}
) {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    if (typeof window === "undefined" || !ScrollTrigger) return;
    gsap.registerPlugin(ScrollTrigger);

    const el = ref.current;
    if (!el || prefersReducedMotion()) return;

    const { speed = 0.3 } = options;

    const ctx = gsap.context(() => {
      const triggerEl = el.parentElement ?? el;
      if (!triggerEl.isConnected) return;

      gsap.to(el, {
        yPercent: speed * 20,
        ease: "none",
        scrollTrigger: {
          trigger: triggerEl,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
          invalidateOnRefresh: true,
        },
      });
    }, el);

    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return ref;
}

export interface UseCountUpOptions {
  duration?: number;
  formatter?: (n: number) => string;
}

/** Numeric count-up tween bound to a DOM node's textContent, once per view. */
export function useCountUp<T extends HTMLElement = HTMLSpanElement>(
  value: number,
  options: UseCountUpOptions = {}
) {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    if (typeof window === "undefined" || !ScrollTrigger) return;
    gsap.registerPlugin(ScrollTrigger);

    const el = ref.current;
    if (!el) return;

    const {
      duration = 1.4,
      formatter = (n: number) => Math.round(n).toLocaleString("en-US"),
    } = options;

    if (prefersReducedMotion()) {
      el.textContent = formatter(value);
      return;
    }

    const ctx = gsap.context(() => {
      const counter = { val: 0 };
      const tl = gsap.timeline({
        scrollTrigger: { 
          trigger: el, 
          start: "top 90%", 
          end: "bottom top",
          once: true 
        },
      });

      tl.to(counter, {
        val: value,
        duration,
        ease: EASE?.premium ?? "power2.out",
        onUpdate: () => {
          if (el) el.textContent = formatter(counter.val);
        },
      });
    }, el);

    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return ref;
}

interface UseBatchRevealOptions {
  selector?: string;
  y?: number;
  scale?: number;
  duration?: number;
  stagger?: number;
  start?: string;
}

export function useBatchReveal<T extends HTMLElement = HTMLDivElement>(
  options: UseBatchRevealOptions = {}
) {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    if (typeof window === "undefined" || !ScrollTrigger) return;
    gsap.registerPlugin(ScrollTrigger);

    const container = ref.current;
    if (!container) return;

    const {
      selector = ".reveal-card",
      y = 28,
      scale,
      duration = 0.6,
      stagger = 0.08,
      start = "top 88%",
    } = options;

    const ctx = gsap.context(() => {
      const targets = gsap.utils.toArray(selector, container);

      if (!targets || targets.length === 0) return;

      if (prefersReducedMotion()) {
        gsap.set(targets, { opacity: 1, y: 0, scale: 1 });
        return;
      }

      gsap.set(targets, { opacity: 0, y, ...(scale !== undefined ? { scale } : {}) });

      requestAnimationFrame(() => {
        if (!container.isConnected) return;

   
ScrollTrigger.batch(targets as Element[], {
  start,
  once: true,
  onEnter: (batch) =>
    gsap.to(batch, {
      opacity: 1,
      y: 0,
      ...(scale !== undefined ? { scale: 1 } : {}),
      duration,
      stagger,
      ease: EASE?.premium ?? "power2.out",
      overwrite: "auto",
    }),
});
      });
    }, container);

    return () => {
      ctx.revert();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return ref;
}