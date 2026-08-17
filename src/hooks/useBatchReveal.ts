"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger, EASE, prefersReducedMotion } from "@/lib/gsap";

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
    const container = ref.current;
    if (!container) return;

    const { 
      selector = ".reveal-card", 
      y = 28, 
      scale, 
      duration = 0.6, 
      stagger = 0.08, 
      start = "top 88%" 
    } = options;

    const ctx = gsap.context((self) => {
      // 1. Target elements strictly scoped inside this container
      const targets = self.selector ? (self.selector(selector) as HTMLElement[]) : [];

      if (!targets || targets.length === 0) return;

      if (prefersReducedMotion()) {
        gsap.set(targets, { opacity: 1, y: 0, scale: 1 });
        return;
      }

      // 2. Initial state setup
      gsap.set(targets, { opacity: 0, y, ...(scale !== undefined ? { scale } : {}) });

      // 3. Defer ScrollTrigger creation to ensure layout measurements are ready
      requestAnimationFrame(() => {
        if (!container.isConnected) return;

        ScrollTrigger.batch(targets, {
          start,
          once: true,
          onEnter: (batch) =>
            gsap.to(batch, {
              opacity: 1,
              y: 0,
              ...(scale !== undefined ? { scale: 1 } : {}),
              duration,
              stagger,
              ease: EASE.premium,
              overwrite: "auto",
            }),
        });
      });
    }, container);

    return () => {
      ctx.revert();
    };
  }, []); // eslint-disable-next-line react-hooks/exhaustive-deps

  return ref;
}