'use client';

import { useEffect } from 'react';

/**
 * Soft reveal-on-scroll for every element marked with data-fx.
 * Elements already on screen are left alone, and nothing is hidden
 * if the visitor prefers reduced motion or JavaScript is off.
 */
export default function HomeMotion() {
  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion || !('IntersectionObserver' in window)) return;

    const viewport = window.innerHeight;
    const pending: HTMLElement[] = [];

    document.querySelectorAll<HTMLElement>('[data-fx]').forEach((el) => {
      if (el.getBoundingClientRect().top < viewport * 0.92) {
        el.classList.remove('fx-hidden');
        return;
      }
      el.classList.add('fx-hidden');
      pending.push(el);
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.remove('fx-hidden');
          entry.target.classList.add('fx-in');
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -6% 0px' },
    );

    pending.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return null;
}