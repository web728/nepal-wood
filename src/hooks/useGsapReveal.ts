"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger, EASE, prefersReducedMotion } from "@/lib/gsap";

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
    if (typeof window === "undefined") return;

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
      let targets: Element[] = [];
      if (selector) {
        targets = gsap.utils.toArray(selector, el);
      } else {
        targets = el.children.length > 0 ? Array.from(el.children) : [el];
      }

      if (!targets || targets.length === 0) return;

      if (prefersReducedMotion()) {
        gsap.set(targets, { opacity: 1, y: 0 });
        return;
      }

      // Initial safe state set karo taaki element invisible na phase rahe agar JS delay ho
      gsap.set(targets, { opacity: 0, y });

      requestAnimationFrame(() => {
        if (!el.isConnected) return;

        gsap.to(targets, {
          opacity: 1,
          y: 0,
          duration,
          delay,
          stagger,
          ease: EASE?.premium ?? "power2.out",
          scrollTrigger: {
            trigger: el,
            start: start,
            end: "bottom top",
            once: true,
            invalidateOnRefresh: true,
          },
        });

        // Trigger refresh taaki layout shift hone par positions fix rahein
        ScrollTrigger.refresh();
      });
    }, el);

    return () => ctx.revert();
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
    if (typeof window === "undefined") return;

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

      ScrollTrigger.refresh();
    }, el);

    return () => ctx.revert();
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
      
      // Fallback: Agar animation trigger me issue ho toh direct gsap.to chala sakte hain 
      // ya ScrollTrigger ka start "top 95%" karo taaki jaldi trigger ho.
      gsap.to(counter, {
        val: value,
        duration,
        ease: EASE?.premium ?? "power2.out",
        scrollTrigger: {
          trigger: el,
          start: "top 95%", // Yeh change kiya hai taaki early trigger ho jaye
          once: true,
          invalidateOnRefresh: true,
        },
        onUpdate: () => {
          if (el) el.textContent = formatter(counter.val);
        },
      });
    }, el);

    ScrollTrigger.refresh();

    return () => ctx.revert();
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
    if (typeof window === "undefined") return;

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

        ScrollTrigger.refresh();
      });
    }, container);

    return () => {
      ctx.revert();
    };
  }, []);

  return ref;
}