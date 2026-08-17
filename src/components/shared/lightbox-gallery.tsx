"use client";

import { useEffect, useRef, useState, useMemo, useCallback } from "react";
import Image from "next/image";
import { gsap, Flip, EASE, prefersReducedMotion } from "@/lib/gsap";
import { ChevronLeft, ChevronRight, X, Loader2 } from "lucide-react";

export interface GalleryImage {
  src: string;
  w: number;
  h: number;
  caption?: string;
  category?: string;
}

const ITEMS_PER_PAGE = 12;

export default function LightboxGallery({ images }: { images: GalleryImage[] }) {
  const [index, setIndex] = useState<number | null>(null);
  const [visibleCount, setVisibleCount] = useState<number>(ITEMS_PER_PAGE);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  
  const flipStateRef = useRef<ReturnType<typeof Flip.getState> | null>(null);
  const lightboxImageWrapRef = useRef<HTMLDivElement>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  // Mobile Touch Swipe Handling
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  // Filter Categories
  const categories = useMemo(() => {
    const cats = new Set<string>();
    cats.add("All");
    images.forEach((img) => {
      if (img.category) cats.add(img.category);
    });
    return Array.from(cats);
  }, [images]);

  const filteredImages = useMemo(() => {
    if (selectedCategory === "All") return images;
    return images.filter((img) => img.category === selectedCategory);
  }, [images, selectedCategory]);

  const visibleImages = useMemo(() => {
    return filteredImages.slice(0, visibleCount);
  }, [filteredImages, visibleCount]);

  // Infinite Scroll Observer
  useEffect(() => {
    if (visibleCount >= filteredImages.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisibleCount((prev) => Math.min(prev + 8, filteredImages.length));
        }
      },
      { threshold: 0.1, rootMargin: "300px" }
    );

    const currentRef = loadMoreRef.current;
    if (currentRef) observer.observe(currentRef);

    return () => {
      if (currentRef) observer.unobserve(currentRef);
    };
  }, [visibleCount, filteredImages.length]);

  // Open Lightbox with GSAP Flip State
  const openAt = (i: number, triggerEl: HTMLElement) => {
    if (!prefersReducedMotion()) {
      flipStateRef.current = Flip.getState(triggerEl);
    }
    setIndex(i);
  };

  // Close Lightbox
  const closeLightbox = useCallback(() => {
    const enlargedEl = lightboxImageWrapRef.current;
    const thumbEl =
      index !== null
        ? document.querySelector<HTMLElement>(`[data-gallery-index="${index}"]`)
        : null;

    if (enlargedEl && thumbEl && !prefersReducedMotion()) {
      const state = Flip.getState(enlargedEl);
      setIndex(null);
      requestAnimationFrame(() => {
        Flip.from(state, {
          targets: thumbEl,
          duration: 0.4,
          ease: EASE.premium,
          absolute: true,
          scale: true,
        });
      });
      return;
    }
    setIndex(null);
  }, [index]);

  const handleNext = useCallback(() => {
    setIndex((i) => (i === null ? null : (i + 1) % visibleImages.length));
  }, [visibleImages.length]);

  const handlePrev = useCallback(() => {
    setIndex((i) => (i === null ? null : (i - 1 + visibleImages.length) % visibleImages.length));
  }, [visibleImages.length]);

  // Keyboard Navigation
  useEffect(() => {
    if (index === null) return;
    document.body.style.overflow = "hidden";

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "ArrowRight") handleNext();
    };

    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [index, closeLightbox, handlePrev, handleNext]);

  // GSAP Entrance Animation
  useEffect(() => {
    if (index === null || prefersReducedMotion()) return;
    const el = lightboxImageWrapRef.current;
    if (!el) return;

    const state = flipStateRef.current;
    flipStateRef.current = null;

    if (state) {
      Flip.from(state, {
        targets: el,
        duration: 0.45,
        ease: EASE.premium,
        absolute: true,
        scale: true,
      });
    } else {
      gsap.fromTo(
        el,
        { opacity: 0, scale: 0.95 },
        { opacity: 1, scale: 1, duration: 0.3, ease: EASE.premium }
      );
    }
  }, [index]);

  // Mobile Touch Controls
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const distance = touchStartX.current - touchEndX.current;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) handleNext();
    if (isRightSwipe) handlePrev();

    touchStartX.current = null;
    touchEndX.current = null;
  };

  return (
    <>
      {/* Category Filter Pills */}
      {categories.length > 1 && (
        <div className="mb-8 flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setSelectedCategory(cat);
                setVisibleCount(ITEMS_PER_PAGE);
              }}
              className={`rounded-full px-5 py-2 text-xs font-bold tracking-wide transition-all duration-300 ${
                selectedCategory === cat
                  ? "bg-brand-brown text-brand-amber shadow-premium border border-brand-brown scale-105"
                  : "bg-white text-brand-brown/70 hover:bg-brand-brown/5 hover:text-brand-brown border border-brand-brown/10"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {/* Masonry Grid - Pure Clean Images */}
      <div className="columns-1 gap-4 sm:columns-2 md:columns-3 lg:columns-4 [&>*]:mb-4">
        {visibleImages.map((img, i) => (
          <button
            key={`${img.src}-${i}`}
            data-gallery-index={i}
            onClick={(e) => openAt(i, e.currentTarget)}
            className="group relative block w-full overflow-hidden rounded-2xl border border-brand-brown/10 bg-white shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-brand-amber/40 hover:shadow-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-amber"
            style={{ breakInside: "avoid" }}
          >
            <div
              className="relative w-full overflow-hidden"
              style={{ aspectRatio: `${img.w} / ${img.h}` }}
            >
              <Image
                src={img.src}
                alt={img.caption || "Gallery image"}
                fill
                loading="lazy"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 33vw, 25vw"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
            </div>
          </button>
        ))}
      </div>

      {/* Load More Indicator */}
      {visibleCount < filteredImages.length && (
        <div ref={loadMoreRef} className="mt-12 flex flex-col items-center justify-center gap-3">
          <Loader2 className="h-5 w-5 animate-spin text-brand-amber" />
        </div>
      )}

      {/* Lightbox Modal */}
      {index !== null && visibleImages[index] && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Image viewer"
          onClick={closeLightbox}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-brand-brown/95 backdrop-blur-xl p-4 sm:p-8 cursor-pointer animate-in fade-in duration-200"
        >
          {/* Top Control Bar - Only Close Button */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="absolute top-4 right-4 flex items-center justify-end z-30"
          >
            <button
              onClick={closeLightbox}
              aria-label="Close Lightbox"
              className="flex items-center gap-1.5 rounded-full bg-white/10 border border-white/15 px-4 py-2 text-xs font-bold text-white backdrop-blur-xl transition-all hover:bg-white hover:text-brand-brown"
            >
              <X className="h-4 w-4" />
              <span>Close</span>
            </button>
          </div>

          {/* Prev Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handlePrev();
            }}
            aria-label="Previous image"
            className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white border border-white/15 backdrop-blur-xl transition-all hover:bg-brand-amber hover:text-brand-brown hover:border-brand-amber shadow-lg z-30"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>

          {/* Main Image Container (Only Image) */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-5xl flex items-center justify-center cursor-default max-h-[85vh]"
          >
            <div
              ref={lightboxImageWrapRef}
              className="relative flex items-center justify-center max-h-[85vh] w-auto max-w-full overflow-hidden rounded-2xl shadow-2xl border border-white/10 bg-black/30"
            >
              <img
                src={visibleImages[index].src}
                alt={visibleImages[index].caption || "Full view image"}
                className="max-h-[85vh] w-auto max-w-full object-contain select-none"
              />
            </div>
          </div>

          {/* Next Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleNext();
            }}
            aria-label="Next image"
            className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white border border-white/15 backdrop-blur-xl transition-all hover:bg-brand-amber hover:text-brand-brown hover:border-brand-amber shadow-lg z-30"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </div>
      )}
    </>
  );
}