"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap, SplitText, EASE, prefersReducedMotion } from "@/lib/gsap";
import { hasShownPreloader, PRELOADER_DONE_EVENT } from "@/lib/preloader-state";
import CTAButton from "@/components/shared/cta-button";
import { site } from "@/lib/site-data";
import { Sparkles, ArrowRight, Calendar, MapPin, Clock } from "lucide-react";

// Definitions for the animated background images
const bgImages = [
  { src: "/images/gallery/img-43.jpeg", alt: "Nepal Wood Expo hall 1" },
  { src: "/images/gallery/img-16.jpeg", alt: "Nepal Wood Expo hall 2" },
  { src: "/images/gallery/img-30.jpg", alt: "Nepal Wood Expo hall 3" },
  { src: "/images/gallery/img-44.jpg", alt: "Nepal Wood Expo hall 4" },
  { src: "/images/gallery/img-45.jpg", alt: "Nepal Wood Expo hall 5" },
];

export default function HomeHero() {
  const sectionRef = useRef<HTMLElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const locationRef = useRef<HTMLDivElement>(null);
  const metricsRef = useRef<HTMLDivElement>(null);

  // Background images refs for animation
  const bgRefs = useRef<HTMLDivElement[]>([]);

  // Refs for metric counting animation
  const count1Ref = useRef<HTMLParagraphElement>(null);
  const count2Ref = useRef<HTMLParagraphElement>(null);
  const count3Ref = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const headline = headlineRef.current;
    if (!section || !headline) return;

    let split: ReturnType<typeof SplitText.create> | null = null;
    let bgTl: gsap.core.Timeline | null = null;

    const ctx = gsap.context(() => {
      const ctaChildren = ctaRef.current ? Array.from(ctaRef.current.children) : [];
      const bgElements = bgRefs.current.filter(Boolean);

      const runEntrance = () => {
        const imageOpacity = 0.22; // Slightly higher contrast for crisp visuals

        if (prefersReducedMotion()) {
          gsap.set(
            [badgeRef.current, headline, subRef.current, locationRef.current, metricsRef.current, ...ctaChildren],
            {
              opacity: 1,
              y: 0,
              scale: 1,
            }
          );

          if (bgElements.length > 0) {
            gsap.set(bgElements[0], { opacity: imageOpacity });
          }
          return;
        }

        // TEXT ENTRANCE ANIMATIONS
        split = SplitText.create(headline, { type: "words", mask: "words" });
        gsap.set(split.words, { yPercent: 110 });
        gsap.set([badgeRef.current, subRef.current, locationRef.current], { opacity: 0, y: 15 });
        gsap.set(ctaChildren, { opacity: 0, y: 15 });
        gsap.set(metricsRef.current, { opacity: 0, y: 25, scale: 0.98 });

        const tl = gsap.timeline({ delay: 0.1 });

        tl.to(badgeRef.current, { opacity: 1, y: 0, duration: 0.5, ease: EASE.premium })
          .to(split.words, { yPercent: 0, duration: 0.7, stagger: 0.03, ease: EASE.premium }, "-=0.2")
          .to(subRef.current, { opacity: 1, y: 0, duration: 0.4, ease: EASE.premium }, "-=0.3")
          .to(locationRef.current, { opacity: 1, y: 0, duration: 0.4, ease: EASE.premium }, "-=0.2")
          .to(ctaChildren, { opacity: 1, y: 0, duration: 0.4, stagger: 0.08, ease: EASE.premium }, "-=0.2")
          .to(metricsRef.current, { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: EASE.premium }, "-=0.2");

        // METRIC COUNTING ANIMATION
        const statsObj = { num1: 0, num2: 0, num3: 0 };

        tl.to(
          statsObj,
          {
            num1: 250,
            num2: 17000,
            num3: 60000,
            duration: 2,
            ease: "power2.out",
            onUpdate: () => {
              if (count1Ref.current) count1Ref.current.innerText = `${Math.floor(statsObj.num1)}+`;
              if (count2Ref.current) count2Ref.current.innerText = `${Math.floor(statsObj.num2).toLocaleString()}+`;
              if (count3Ref.current) count3Ref.current.innerText = `${Math.floor(statsObj.num3).toLocaleString()}+ SQM`;
            },
          },
          "-=0.5"
        );

        // BACKGROUND CROSS-FADE ANIMATION
        if (bgElements.length > 1) {
          bgTl = gsap.timeline({ repeat: -1 });
          const duration = 5;
          const fadeDuration = 1.8;

          gsap.set(bgElements[0], { opacity: imageOpacity });

          bgElements.slice(1).forEach((bgEl) => {
            bgTl
              ?.to(bgEl, { opacity: imageOpacity, duration: fadeDuration }, `+=${duration - fadeDuration}`)
              .to(bgEl, { opacity: 0, duration: fadeDuration }, `+=${duration}`);
          });

          bgTl?.to(bgElements[0], { opacity: imageOpacity, duration: fadeDuration }, `+=${duration - fadeDuration}`);
        } else if (bgElements.length === 1) {
          gsap.set(bgElements[0], { opacity: imageOpacity });
        }
      };

      if (hasShownPreloader()) {
        runEntrance();
      } else {
        window.addEventListener(PRELOADER_DONE_EVENT, runEntrance, { once: true });
      }

      return () => {
        window.removeEventListener(PRELOADER_DONE_EVENT, runEntrance);
        bgTl?.kill();
      };
    }, section);

    return () => {
      ctx.revert();
      split?.revert();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-[100vh] flex-col justify-between overflow-hidden bg-brand-dark px-4 pt-32 sm:pt-40 lg:pt-44 pb-12"
    >
      {/* Animated Background Images Layer */}
      <div className="absolute inset-0 z-0">
        {bgImages.map((img, index) => (
          <div
            key={img.src}
            ref={(el) => {
              if (el) bgRefs.current[index] = el;
            }}
            className="absolute inset-0 opacity-0 will-change-opacity"
          >
            <Image
              src={img.src}
              alt={img.alt}
              fill
              priority={index === 0}
              sizes="100vw"
              className="object-cover scale-105 transition-transform duration-10000 ease-linear"
            />
          </div>
        ))}
      </div>

      {/* Multi-layer Premium Vignette & Gradients */}
      <div className="absolute inset-0 bg-gradient-to-b from-brand-dark/55 via-brand-dark/20 to-brand-dark/25" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-brand-dark/10 to-brand-dark" />

      {/* Premium Ambient Lights/Glows */}
      <div className="pointer-events-none absolute -top-10 left-1/2 h-[450px] w-[600px] -translate-x-1/2 rounded-full bg-brand-amber/15 blur-[140px]" />
      <div className="pointer-events-none absolute top-1/3 left-10 h-[300px] w-[300px] rounded-full bg-teal-500/10 blur-[120px]" />

      {/* MAIN CENTER CONTENT */}
      <div className="container-expo relative z-10 w-full text-center flex-1 flex flex-col items-center justify-center my-auto py-4">

        {/* Top Badge - Highlighted 4 Days & 12th Edition */}
        <div ref={badgeRef} className="flex items-center justify-center mb-4 sm:mb-6">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#F4C87A]/40 bg-[#F4C87A]/15 px-4 py-1.5 text-[11px] sm:text-xs font-extrabold uppercase tracking-[0.2em] text-[#F4C87A] backdrop-blur-2xl shadow-lg shadow-[#F4C87A]/10">
            <Sparkles className="h-3.5 w-3.5 text-[#F4C87A]" />
            12th Edition • 4 Mega Days Expo
          </span>
        </div>

        {/* Main Title */}
        <h1
          ref={headlineRef}
          className="max-w-5xl font-display text-3xl sm:text-5xl lg:text-6xl xl:text-[3.8rem] font-extrabold leading-[1.12] text-white tracking-tight text-center drop-shadow-sm"
        >
          {site.eventName}
        </h1>

        {/* Subtitle */}
        <p
          ref={subRef}
          className="mt-4 sm:mt-6 max-w-2xl text-sm sm:text-lg lg:text-xl font-normal leading-relaxed text-zinc-300 font-body"
        >
          Nepal&rsquo;s definitive platform for{" "}
          <span className="font-semibold text-white">Woodworking Machinery</span>,{" "}
          <span className="font-semibold text-white">Furniture Hardware, Plywood, Laminates &amp; Raw Materials.</span>
        </p>

        {/* Date, Duration & Location Glass Pill Badges */}
        <div ref={locationRef} className="mt-6 sm:mt-8 flex flex-wrap items-center justify-center gap-3 text-xs sm:text-sm font-semibold text-white/95">
          {/* Highlighted 4-Days Badge */}
          <span className="inline-flex items-center gap-2 rounded-full border border-[#F4C87A]/50 bg-[#F4C87A]/20 px-4 py-2 text-[#F4C87A] font-bold backdrop-blur-xl shadow-md">
            <Clock className="h-4 w-4" />
            First Time Ever — 4 Days Event
          </span>
          <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 backdrop-blur-xl shadow-md">
            <Calendar className="h-4 w-4 text-[#F4C87A]" />
            28–31 January 2027
          </span>
          <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 backdrop-blur-xl shadow-md">
            <MapPin className="h-4 w-4 text-[#F4C87A]" />
            Bhrikuti Mandap, Kathmandu
          </span>
        </div>

        {/* CTA Buttons */}
        <div
          ref={ctaRef}
          className="mt-8 sm:mt-10 grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-md mx-auto"
        >
          <CTAButton
            href="/exhibitor-registration"
            size="lg"
            className="w-full h-12 sm:h-13 justify-center text-sm font-bold shadow-2xl shadow-brand-amber/30 hover:shadow-brand-amber/40 transition-all !px-6 border border-brand-amber/40"
          >
            Book a Stand
          </CTAButton>

          <CTAButton
            href="/downloads/event-brochure"
            variant="outline"
            size="lg"
            className="w-full h-12 sm:h-13 justify-center text-sm font-bold !border-white/30 !bg-white/10 !text-[#ffffff] backdrop-blur-2xl hover:!bg-white hover:!text-brand-dark transition-all !px-6"
          >
            Download Brochure
          </CTAButton>
        </div>

      </div>

      {/* BOTTOM FLOATING METRICS CARD */}
      <div 
        ref={metricsRef} 
        className="container-expo relative z-10 w-full max-w-2xl mx-auto mt-6 sm:mt-10 rounded-2xl border border-white/15 bg-white/[0.05] backdrop-blur-2xl p-4 sm:p-5 shadow-2xl shadow-black/50 overflow-hidden"
      >
        {/* Card Ambient Glow */}
        <div className="pointer-events-none absolute -top-12 left-1/2 -translate-x-1/2 h-24 w-1/2 rounded-full bg-brand-amber/10 blur-xl" />

        <div className="grid grid-cols-3 gap-2 sm:gap-4 items-center">
          
          {/* Metric 1 */}
          <div className="text-center px-1 sm:px-3 border-r border-white/10 pr-2 sm:pr-4">
            <p ref={count1Ref} className="font-display text-lg sm:text-2xl lg:text-3xl font-bold text-white tracking-tight leading-none">
              0+
            </p>
            <p className="text-[10px] sm:text-xs text-zinc-300/80 font-medium uppercase tracking-wider font-body mt-1.5 sm:mt-2 leading-tight">
              Global Brands
            </p>
          </div>

          {/* Metric 2 */}
          <div className="text-center px-1 sm:px-3 border-r border-white/10 pr-2 sm:pr-4">
            <p ref={count2Ref} className="font-display text-lg sm:text-2xl lg:text-3xl font-bold text-white tracking-tight leading-none">
              0+
            </p>
            <p className="text-[10px] sm:text-xs text-zinc-300/80 font-medium uppercase tracking-wider font-body mt-1.5 sm:mt-2 leading-tight">
              B2B Visitors
            </p>
          </div>

          {/* Metric 3 */}
          <div className="text-center px-1 sm:px-3">
            <p ref={count3Ref} className="font-display text-base sm:text-2xl lg:text-3xl font-bold text-white tracking-tight leading-none">
              0 SQM
            </p>
            <p className="text-[10px] sm:text-xs text-zinc-300/80 font-medium uppercase tracking-wider font-body mt-1.5 sm:mt-2 leading-tight">
              Expo Area
            </p>
          </div>

        </div>
      </div>
    </section>
  );
}