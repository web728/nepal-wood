"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { gsap, SplitText, EASE, prefersReducedMotion } from "@/lib/gsap";
import { ChevronRight, Home } from "lucide-react";

interface PageBannerProps {
  kicker?: string;
  title: string;
  subtitle?: string;
  bgImage?: string;
}

function getBreadcrumbs(pathname: string) {
  const segments = pathname.split("/").filter(Boolean);
  return segments.map((seg, i) => ({
    label: seg
      .replace(/-/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase()),
    href: "/" + segments.slice(0, i + 1).join("/"),
    isLast: i === segments.length - 1,
  }));
}

export default function PageBanner({ kicker, title, subtitle, bgImage }: PageBannerProps) {
  const kickerRef = useRef<HTMLSpanElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const breadcrumbRef = useRef<HTMLElement>(null);
  const pathname = usePathname();
  const breadcrumbs = getBreadcrumbs(pathname);

  useEffect(() => {
    const titleEl = titleRef.current;
    if (!titleEl) return;

    let split: ReturnType<typeof SplitText.create> | null = null;

    const ctx = gsap.context(() => {
      if (prefersReducedMotion()) {
        gsap.set([kickerRef.current, titleEl, subtitleRef.current, breadcrumbRef.current], { opacity: 1, y: 0 });
        return;
      }

      split = SplitText.create(titleEl, { type: "words", mask: "words" });
      gsap.set(split.words, { yPercent: 110 });
      gsap.set(subtitleRef.current, { opacity: 0, y: 14 });
      if (kickerRef.current) gsap.set(kickerRef.current, { opacity: 0, y: 8 });
      if (breadcrumbRef.current) gsap.set(breadcrumbRef.current, { opacity: 0, y: 8 });

      gsap
        .timeline({ delay: 0.1 })
        .to(breadcrumbRef.current, { opacity: 1, y: 0, duration: 0.4, ease: EASE.premium })
        .to(kickerRef.current, { opacity: 1, y: 0, duration: 0.4, ease: EASE.premium }, "-=0.2")
        .to(split.words, { yPercent: 0, duration: 0.7, stagger: 0.05, ease: EASE.premium }, "-=0.2")
        .to(subtitleRef.current, { opacity: 1, y: 0, duration: 0.5, ease: EASE.premium }, "-=0.35");

      if (bgRef.current) {
        gsap.fromTo(
          bgRef.current,
          { scale: 1.05, opacity: 0 },
          { scale: 1, opacity: 0.55, duration: 1.2, ease: "power2.out" }
        );
      }
    }, titleEl);

    return () => {
      ctx.revert();
      split?.revert();
    };
  }, []);

  return (
    <section className="relative overflow-hidden bg-brand-brown pb-16 pt-32 md:pb-20 md:pt-40">
      {/* Background Image with Crisp Overlay */}
      {bgImage && (
        <div ref={bgRef} className="absolute inset-0 z-0 pointer-events-none">
          <Image
            src={bgImage}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
          {/* Subtle Dark Vignette & Color Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-brand-brown/90 via-brand-brown/40 to-black/30" />
          <div className="absolute inset-0 bg-gradient-to-r from-brand-brown/85 via-brand-brown/30 to-transparent" />
        </div>
      )}

      {/* Decorative Geometry Line */}
      <svg
        className="pointer-events-none absolute right-0 top-0 h-full w-1/3 opacity-10 z-[1]"
        viewBox="0 0 400 400"
        fill="none"
        aria-hidden="true"
      >
        <path d="M0 60 Q100 20 200 60 T400 60" stroke="#E0943D" strokeWidth="1" fill="none" />
        <path d="M0 130 Q100 90 200 130 T400 130" stroke="#E0943D" strokeWidth="1" fill="none" />
        <path d="M0 200 Q100 160 200 200 T400 200" stroke="#7A1F1F" strokeWidth="1" fill="none" />
      </svg>

      {/* Subtle Warm Glow (Reduced Blur) */}
      <div className="pointer-events-none absolute -top-10 left-10 h-48 w-48 rounded-full bg-brand-amber/15 blur-[40px]" />

      {/* Foreground Content */}
      <div className="container-expo relative z-10">
        {/* Glass Breadcrumb Pill */}
        <nav ref={breadcrumbRef} aria-label="Breadcrumb" className="mb-6 inline-flex">
          <ol className="flex items-center gap-1.5 rounded-full bg-white/10 border border-white/15 px-3.5 py-1 text-xs font-medium text-white/80 backdrop-blur-md">
            <li>
              <Link href="/" className="flex items-center gap-1 transition-colors hover:text-brand-amber">
                <Home className="h-3 w-3" />
                <span>Home</span>
              </Link>
            </li>
            {breadcrumbs.map((crumb) => (
              <li key={crumb.href} className="flex items-center gap-1.5">
                <ChevronRight className="h-3 w-3 text-white/40" />
                {crumb.isLast ? (
                  <span className="text-brand-amberLight font-semibold">{crumb.label}</span>
                ) : (
                  <Link href={crumb.href} className="transition-colors hover:text-brand-amber">
                    {crumb.label}
                  </Link>
                )}
              </li>
            ))}
          </ol>
        </nav>

        {kicker && (
          <div className="mb-2">
            <span ref={kickerRef} className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-brand-amberLight">
              <span className="h-0.5 w-5 bg-brand-amber" />
              {kicker}
            </span>
          </div>
        )}

        <h1 ref={titleRef} className="max-w-3xl text-balance font-display text-3xl font-extrabold leading-tight text-white sm:text-4xl md:text-5xl lg:text-[3.25rem]">
          {title}
        </h1>

        {subtitle && (
          <p ref={subtitleRef} className="mt-4 max-w-2xl text-sm sm:text-base text-white/85 leading-relaxed font-normal">
            {subtitle}
          </p>
        )}
      </div>

      {/* Ultra Subtle Bottom Edge Transition */}
      <div className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-white to-transparent opacity-10 z-[2]" />
    </section>
  );
}