"use client";

import { useEffect, useRef, useState, useMemo, useCallback } from "react";
import Image from "next/image";
import { gsap, Flip, EASE, prefersReducedMotion } from "@/lib/gsap";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

export interface GalleryImage {
  src: string;
  w: number;
  h: number;
  caption?: string;
  category?: string;
}

const INITIAL_LOAD = 16;
const BATCH_SIZE = 12;
const EXTENSIONS = [".jpg", ".webp", ".png", ".jpeg", ".JPG", ".PNG", ".WEBP"];

export default function LightboxGallery({ images }: { images: GalleryImage[] }) {
  const [index, setIndex] = useState<number | null>(null);
  const [visibleCount, setVisibleCount] = useState<number>(INITIAL_LOAD);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [imageSources, setImageSources] = useState<Record<string, string>>({});
  const [loadedImages, setLoadedImages] = useState<Record<string, boolean>>({});

  const flipStateRef = useRef<ReturnType<typeof Flip.getState> | null>(null);
  const lightboxImageWrapRef = useRef<HTMLDivElement>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  // Mobile Touch Swipe Handling
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  // Fallback Extension Switcher
  const handleImageError = (originalSrc: string) => {
    const currentSrc = imageSources[originalSrc] || originalSrc;
    const baseName = originalSrc.substring(0, originalSrc.lastIndexOf("."));
    const currentExt = currentSrc.substring(currentSrc.lastIndexOf("."));
    const currentIndex = EXTENSIONS.indexOf(currentExt);

    if (currentIndex !== -1 && currentIndex < EXTENSIONS.length - 1) {
      const nextExt = EXTENSIONS[currentIndex + 1];
      const nextSrc = `${baseName}${nextExt}`;
      setImageSources((prev) => ({ ...prev, [originalSrc]: nextSrc }));
    }
  };

  const handleImageLoad = (src: string) => {
    setLoadedImages((prev) => ({ ...prev, [src]: true }));
  };

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

  // Early Pre-fetching via IntersectionObserver (rootMargin 600px ahead)
  useEffect(() => {
    if (visibleCount >= filteredImages.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          // Pre-fetch next batch before user reaches bottom
          setVisibleCount((prev) => Math.min(prev + BATCH_SIZE, filteredImages.length));
        }
      },
      { threshold: 0.01, rootMargin: "600px" } // Early trigger for instant scroll feel
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
          duration: 0.35,
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

  // Lightbox Entrance GSAP
  useEffect(() => {
    if (index === null || prefersReducedMotion()) return;
    const el = lightboxImageWrapRef.current;
    if (!el) return;

    const state = flipStateRef.current;
    flipStateRef.current = null;

    if (state) {
      Flip.from(state, {
        targets: el,
        duration: 0.4,
        ease: EASE.premium,
        absolute: true,
        scale: true,
      });
    } else {
      gsap.fromTo(
        el,
        { opacity: 0, scale: 0.95 },
        { opacity: 1, scale: 1, duration: 0.25, ease: EASE.premium }
      );
    }
  }, [index]);

  // Touch handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const distance = touchStartX.current - touchEndX.current;
    if (distance > 50) handleNext();
    if (distance < -50) handlePrev();
    touchStartX.current = null;
    touchEndX.current = null;
  };

  return (
    <>
      {/* Category Pills */}
      {categories.length > 1 && (
        <div className="mb-8 flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setSelectedCategory(cat);
                setVisibleCount(INITIAL_LOAD);
              }}
              className={`rounded-full px-5 py-2 text-xs font-bold tracking-wide transition-all duration-300 ${
                selectedCategory === cat
                  ? "bg-brand-brown text-brand-amber shadow-sm border border-brand-brown scale-105"
                  : "bg-white text-brand-brown/70 hover:bg-brand-brown/5 hover:text-brand-brown border border-brand-brown/10"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {/* Masonry Grid */}
      <div className="columns-1 gap-4 sm:columns-2 md:columns-3 lg:columns-4 [&>*]:mb-4">
        {visibleImages.map((img, i) => {
          const imgSrc = imageSources[img.src] || img.src;
          const isLoaded = loadedImages[imgSrc];

          return (
            <button
              key={`${img.src}-${i}`}
              data-gallery-index={i}
              onClick={(e) => openAt(i, e.currentTarget)}
              className="group relative block w-full overflow-hidden rounded-2xl border border-brand-brown/10 bg-slate-200/60 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-brand-amber/40 hover:shadow-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-amber"
              style={{ breakInside: "avoid" }}
            >
              <div
                className="relative w-full overflow-hidden"
                style={{ aspectRatio: `${img.w} / ${img.h}` }}
              >
                <Image
                  src={imgSrc}
                  alt={img.caption || "Gallery image"}
                  fill
                  quality={65} // Fast loading compressed quality
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 33vw, 25vw"
                  loading={i < 8 ? "eager" : "lazy"} // First 8 load instantly
                  onLoad={() => handleImageLoad(imgSrc)}
                  onError={() => handleImageError(img.src)}
                  className={`object-cover transition-all duration-500 ease-out group-hover:scale-105 ${
                    isLoaded ? "opacity-100 blur-0 scale-100" : "opacity-0 blur-md scale-95"
                  }`}
                />
              </div>
            </button>
          );
        })}
      </div>

      {/* Invisible Pre-fetch Trigger Area */}
      {visibleCount < filteredImages.length && (
        <div ref={loadMoreRef} className="h-20 w-full" />
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
          {/* Top Control Bar */}
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

          {/* Main Image Container */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-5xl flex items-center justify-center cursor-default max-h-[85vh]"
          >
            <div
              ref={lightboxImageWrapRef}
              className="relative flex items-center justify-center max-h-[85vh] w-auto max-w-full overflow-hidden rounded-2xl shadow-2xl border border-white/10 bg-black/30"
            >
              <img
                src={imageSources[visibleImages[index].src] || visibleImages[index].src}
                alt={visibleImages[index].caption || "Full view image"}
                onError={() => handleImageError(visibleImages[index].src)}
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