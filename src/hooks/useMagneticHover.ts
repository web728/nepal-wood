"use client";

import { useEffect, useRef } from "react";
import { gsap, Observer, prefersReducedMotion } from "@/lib/gsap";

/**
 * Light magnetic-cursor pull on the element the returned ref is attached
 * to — a subtle offset (a few px), never a dramatic drag. Pointer-fine
 * devices only (magnetic pull means nothing on touch) and skipped entirely
 * under prefers-reduced-motion.
 */
export function useMagneticHover<T extends HTMLElement>(strength = 14) {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;
    if (typeof window === "undefined" || !window.matchMedia("(pointer: fine)").matches) return;

    const xTo = gsap.quickTo(el, "x", { duration: 0.4, ease: "power3.out" });
    const yTo = gsap.quickTo(el, "y", { duration: 0.4, ease: "power3.out" });

    const observer = Observer.create({
      target: el,
      type: "pointer",
      onMove: (self) => {
        const rect = el.getBoundingClientRect();
        const relX = (self.x ?? 0) - (rect.left + rect.width / 2);
        const relY = (self.y ?? 0) - (rect.top + rect.height / 2);
        xTo((relX / rect.width) * strength);
        yTo((relY / rect.height) * strength);
      },
      onHoverEnd: () => {
        xTo(0);
        yTo(0);
      },
      onStop: () => {
        xTo(0);
        yTo(0);
      },
    });

    return () => {
      observer.kill();
      gsap.set(el, { x: 0, y: 0 });
    };
  }, [strength]);

  return ref;
}
