"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, SplitText, EASE, prefersReducedMotion } from "@/lib/gsap";
import {
  hasShownPreloader,
  markPreloaderShown,
  PRELOADER_DONE_EVENT,
  GLOBE_READY_EVENT,
} from "@/lib/preloader-state";

const HERO_IMAGE_SRC = "/images/hero/exhibition-hall-wide.webp";
const GLOBE_READY_TIMEOUT_MS = 1500;

function waitForFonts(): Promise<void> {
  if (typeof document === "undefined" || !document.fonts?.ready) return Promise.resolve();
  return document.fonts.ready.then(() => undefined);
}

function waitForHeroImage(): Promise<void> {
  return new Promise((resolve) => {
    if (typeof window === "undefined") return resolve();
    const img = new window.Image();
    img.onload = () => resolve();
    img.onerror = () => resolve();
    img.src = HERO_IMAGE_SRC;
    if (img.complete) resolve();
  });
}

function waitForGlobeReady(): Promise<void> {
  return new Promise((resolve) => {
    let done = false;
    const finish = () => {
      if (done) return;
      done = true;
      window.removeEventListener(GLOBE_READY_EVENT, finish);
      resolve();
    };
    window.addEventListener(GLOBE_READY_EVENT, finish, { once: true });
    setTimeout(finish, GLOBE_READY_TIMEOUT_MS);
  });
}

/**
 * Full-viewport luxury intro shown once per session.
 * Features ultra-smooth SplitText animation, radial ambiance,
 * and high-precision asset loading progress sync.
 */
export default function PreloaderIntro() {
  const [mounted, setMounted] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);
  const wordmarkRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const progressFillRef = useRef<HTMLDivElement>(null);
  const progressLabelRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(!hasShownPreloader());
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const overlay = overlayRef.current;
    const wordmark = wordmarkRef.current;
    const subtitle = subtitleRef.current;
    if (!overlay || !wordmark) return;

    markPreloaderShown();
    const announceDone = () => window.dispatchEvent(new CustomEvent(PRELOADER_DONE_EVENT));

    if (prefersReducedMotion()) {
      gsap.set(overlay, { autoAlpha: 0 });
      announceDone();
      const t = setTimeout(() => setMounted(false), 0);
      return () => clearTimeout(t);
    }

    let split: ReturnType<typeof SplitText.create> | null = null;

    const ctx = gsap.context(() => {
      const splitInstance = SplitText.create(wordmark, { type: "chars", mask: "chars" });
      split = splitInstance;

      // Initial state with subtle perspective and blur
      gsap.set(splitInstance.chars, {
        yPercent: 120,
        rotateX: -30,
        filter: "blur(8px)",
        opacity: 0,
      });

      if (subtitle) {
        gsap.set(subtitle, { opacity: 0, y: 10 });
      }

      const progress = { value: 0 };
      const updateProgressUI = () => {
        if (progressFillRef.current) progressFillRef.current.style.width = `${progress.value}%`;
        if (progressLabelRef.current)
          progressLabelRef.current.textContent = `${Math.round(progress.value)}%`;
      };

      // Entrance animation timeline
      const introTl = gsap.timeline();

      introTl.to(splitInstance.chars, {
        yPercent: 0,
        rotateX: 0,
        filter: "blur(0px)",
        opacity: 1,
        duration: 0.85,
        stagger: 0.035,
        ease: EASE.premium ?? "power3.out",
      });

      if (subtitle) {
        introTl.to(
          subtitle,
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            ease: "power2.out",
          },
          "-=0.4"
        );
      }

      // Progress bar drift up to 85% while loading real assets
      const driftTween = gsap.to(progress, {
        value: 85,
        duration: 1.2,
        ease: "power1.out",
        onUpdate: updateProgressUI,
      });

      Promise.all([waitForFonts(), waitForHeroImage(), waitForGlobeReady()]).then(() => {
        driftTween.kill();
        gsap.to(progress, {
          value: 100,
          duration: 0.3,
          ease: EASE.premium ?? "power3.out",
          onUpdate: updateProgressUI,
          onComplete: () => {
            const exitTl = gsap.timeline({
              onComplete: () => {
                announceDone();
                setMounted(false);
              },
            });

            exitTl
              .to(splitInstance.chars, {
                yPercent: -120,
                filter: "blur(6px)",
                opacity: 0,
                duration: 0.5,
                stagger: 0.02,
                ease: EASE.premium ?? "power3.inOut",
              })
              .to(
                subtitle,
                {
                  opacity: 0,
                  y: -10,
                  duration: 0.3,
                },
                "-=0.4"
              )
              .to(
                overlay,
                {
                  yPercent: -100,
                  duration: 0.7,
                  ease: EASE.premium ?? "power4.inOut",
                },
                "-=0.25"
              );
          },
        });
      });
    }, overlay);

    return () => {
      ctx.revert();
      split?.revert();
    };
  }, [mounted]);

  if (!mounted) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[999] flex flex-col items-center justify-center bg-brand-cream overflow-hidden"
      aria-hidden="true"
    >
      {/* Subtle Luxury Radial Glow */}
      <div className="pointer-events-none absolute h-[500px] w-[500px] rounded-full bg-brand-amber/10 blur-[120px]" />

      <div className="relative z-10 flex flex-col items-center text-center px-4">
        {/* Main Brand Title */}
        <h1
          ref={wordmarkRef}
          className="overflow-hidden font-display text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-brand-brown py-2"
        >
          NEPAL WOOD
        </h1>

        {/* Subtitle / Tagline */}
        <p
          ref={subtitleRef}
          className="mt-1 font-mono text-xs sm:text-sm font-semibold tracking-[0.3em] text-brand-brown/60 uppercase"
        >
          International Expo 2027
        </p>

        {/* Premium Progress Meter */}
        <div className="mt-10 flex w-56 sm:w-64 flex-col items-center gap-3">
          <div className="relative h-[2px] w-full overflow-hidden rounded-full bg-brand-brown/10 p-0">
            <div
              ref={progressFillRef}
              className="h-full bg-gradient-to-r from-brand-brown via-brand-amber to-amber-500 shadow-[0_0_12px_rgba(217,119,6,0.6)] transition-all duration-75"
              style={{ width: "0%" }}
            />
          </div>

          <div className="flex w-full justify-between items-center text-[11px] font-mono tracking-[0.2em] text-brand-brown/50">
            <span>LOADING</span>
            <span ref={progressLabelRef} className="font-bold text-brand-brown">
              0%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}