'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import Icon from './Icon';
import { galleryTags, type GalleryTag, type Shot } from '@/lib/gallery-types';

const PAGE_SIZE = 24;

export default function GalleryGrid({ shots }: { shots: Shot[] }) {
  const [tag, setTag] = useState<GalleryTag>('All');
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  const filtered = useMemo(
    () => tag === 'All' ? shots : shots.filter((shot) => shot.tag === tag),
    [shots, tag],
  );
  const visible = useMemo(() => filtered.slice(0, visibleCount), [filtered, visibleCount]);
  const hasMore = visibleCount < filtered.length;
  const current = openIndex === null ? null : filtered[openIndex];

  const changeTag = (next: GalleryTag) => {
    setTag(next);
    setVisibleCount(PAGE_SIZE);
    setOpenIndex(null);
  };

  const loadMore = useCallback(() => {
    setVisibleCount((count) => Math.min(count + PAGE_SIZE, filtered.length));
  }, [filtered.length]);

  useEffect(() => {
    const node = sentinelRef.current;
    if (!node || !hasMore || !('IntersectionObserver' in window)) return;
    const observer = new IntersectionObserver((entries) => {
      if (entries[0]?.isIntersecting) loadMore();
    }, { rootMargin: '350px 0px', threshold: 0 });
    observer.observe(node);
    return () => observer.disconnect();
  }, [hasMore, loadMore, tag, visibleCount]);

  const move = useCallback((direction: number) => {
    setOpenIndex((index) => index === null || filtered.length === 0
      ? null
      : (index + direction + filtered.length) % filtered.length);
  }, [filtered.length]);

  const openPhoto = (index: number) => {
    previousFocusRef.current = document.activeElement as HTMLElement | null;
    setOpenIndex(index);
  };

  const closePhoto = useCallback(() => setOpenIndex(null), []);

  useEffect(() => {
    if (openIndex === null) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closePhoto();
      else if (event.key === 'ArrowRight') move(1);
      else if (event.key === 'ArrowLeft') move(-1);
      else if (event.key === 'Tab') {
        // Keep keyboard focus inside the three modal controls.
        const controls = document.querySelectorAll<HTMLButtonElement>('.expo-lightbox__button');
        const first = controls[0];
        const last = controls[controls.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault(); last?.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault(); first?.focus();
        }
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [openIndex, move, closePhoto]);

  // Restore focus once the viewer is actually closed (not between images).
  const wasOpenRef = useRef(false);
  useEffect(() => {
    if (openIndex !== null) wasOpenRef.current = true;
    else if (wasOpenRef.current) {
      previousFocusRef.current?.focus();
      wasOpenRef.current = false;
    }
  }, [openIndex]);

  return (
    <>
      <div className="expo-gallery__toolbar">
        <div>
          <p className="expo-gallery__eyebrow">Explore the exhibition</p>
          <h2 className="expo-gallery__heading">Photo collection</h2>
        </div>
       
      </div>

      

      {filtered.length ? (
        <>
          <div className="expo-gallery__grid">
            {visible.map((shot, index) => (
              <button
                type="button"
                className="expo-gallery__item"
                key={shot.src}
                onClick={() => openPhoto(index)}
            
              >
                <Image
                  src={shot.src}
                  alt={shot.alt}
                  fill
                  sizes="(max-width: 600px) 100vw, (max-width: 950px) 50vw, 33vw"
                  quality={72}
                  loading="lazy"
                />
                {/* <span className="expo-gallery__item-label">{shot.tag}</span> */}
                {/* <span className="expo-gallery__item-icon" aria-hidden="true"><Icon name="arrow-up-right" /></span> */}
              </button>
            ))}
          </div>
          {hasMore && (
            <div className="expo-gallery__more" ref={sentinelRef}>
              <button type="button" className="btn" onClick={loadMore}>
                Load more photos
              </button>
            </div>
          )}
        </>
      ) : (
        <p className="expo-gallery__empty">No photos found for this category. Add image files under <code>public/images</code>.</p>
      )}

      {current && (
        <div
          className="expo-lightbox"
          role="dialog"
          aria-modal="true"
          aria-label="Photo viewer"
          onMouseDown={(event) => { if (event.target === event.currentTarget) closePhoto(); }}
        >
          <div className="expo-lightbox__image">
            <Image
              key={current.src}
              src={current.src}
              alt={current.alt}
              fill
              sizes="100vw"
              quality={85}
              priority
            />
          </div>
          <button ref={closeRef} className="expo-lightbox__button expo-lightbox__close" type="button" onClick={closePhoto} aria-label="Close gallery viewer">
            <Icon name="x" />
          </button>
          <button className="expo-lightbox__button expo-lightbox__previous" type="button" onClick={() => move(-1)} aria-label="Previous photo">
            <Icon name="arrow" />
          </button>
          <button className="expo-lightbox__button expo-lightbox__next" type="button" onClick={() => move(1)} aria-label="Next photo">
            <Icon name="arrow" />
          </button>
          
        </div>
      )}
    </>
  );
}
