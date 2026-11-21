'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import type { NewsImage } from '@/lib/news';

const PAGE_SIZE = 18;

export default function NewsGallery({ images }: { images: NewsImage[] }) {
  const categories = useMemo(
    () => ['All', ...Array.from(new Set(images.map((item) => item.category)))],
    [images],
  );
  const [category, setCategory] = useState('All');
  const [visible, setVisible] = useState(PAGE_SIZE);
  const [selected, setSelected] = useState<number | null>(null);
  const loadMarker = useRef<HTMLDivElement>(null);
  const lastTrigger = useRef<HTMLButtonElement | null>(null);
  const closeButton = useRef<HTMLButtonElement>(null);

  const filtered = useMemo(
    () => category === 'All' ? images : images.filter((item) => item.category === category),
    [category, images],
  );
  const shown = filtered.slice(0, visible);
  const canLoadMore = visible < filtered.length;
  const active = selected === null ? null : filtered[selected];

  const close = useCallback(() => setSelected(null), []);
  const move = useCallback((direction: number) => {
    setSelected((index) => index === null || filtered.length === 0
      ? null
      : (index + direction + filtered.length) % filtered.length);
  }, [filtered.length]);

  useEffect(() => {
    if (!canLoadMore) return;
    const node = loadMarker.current;
    if (!node || !('IntersectionObserver' in window)) return;
    const observer = new IntersectionObserver((entries) => {
      if (entries[0]?.isIntersecting) {
        setVisible((value) => Math.min(value + PAGE_SIZE, filtered.length));
      }
    }, { rootMargin: '350px 0px' });
    observer.observe(node);
    return () => observer.disconnect();
  }, [canLoadMore, filtered.length, visible]);

  useEffect(() => {
    if (selected === null) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeButton.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close();
      if (event.key === 'ArrowRight') move(1);
      if (event.key === 'ArrowLeft') move(-1);
      if (event.key === 'Tab') {
        const buttons = Array.from(document.querySelectorAll<HTMLButtonElement>('[data-news-dialog] button'));
        if (!buttons.length) return;
        const current = buttons.indexOf(document.activeElement as HTMLButtonElement);
        if (event.shiftKey && current <= 0) {
          event.preventDefault();
          buttons[buttons.length - 1].focus();
        } else if (!event.shiftKey && current === buttons.length - 1) {
          event.preventDefault();
          buttons[0].focus();
        }
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKeyDown);
      lastTrigger.current?.focus();
    };
  }, [selected === null, close, move]);

  function chooseCategory(next: string) {
    setCategory(next);
    setVisible(PAGE_SIZE);
    setSelected(null);
  }

  if (!images.length) {
    return (
      <div className="news-empty">
        <h3>No photos available yet</h3>
        <p>Add JPG, PNG, WebP, AVIF or GIF files to <code>public/news</code> and redeploy the site.</p>
      </div>
    );
  }

  return (
    <>
      <div className="news-toolbar">
        <div className="news-filters" aria-label="Filter news images">
          {categories.map((item) => (
            <button
              key={item}
              type="button"
              className={`news-filter${category === item ? ' is-active' : ''}`}
              aria-pressed={category === item}
              onClick={() => chooseCategory(item)}
            >
              {item}
            </button>
          ))}
        </div>
        <p className="news-count" aria-live="polite">Showing {shown.length} of {filtered.length} photos</p>
      </div>

      <div className="news-grid">
        {shown.map((item, index) => (
          <button
            key={item.id}
            type="button"
            className="news-card"
            aria-label={`View image: ${item.title}`}
            onClick={(event) => {
              lastTrigger.current = event.currentTarget;
              setSelected(index);
            }}
          >
            <span className="news-card__media">
              <Image
                src={item.src}
                alt={item.title}
                width={720}
                height={520}
                sizes="(max-width: 640px) 100vw, (max-width: 1000px) 50vw, 33vw"
                loading="lazy"
                quality={75}
              />
              <span className="news-card__view" aria-hidden="true">View photo ↗</span>
            </span>
            <span className="news-card__content">
              <span className="news-card__category">{item.category}</span>
              <span className="news-card__title">{item.title}</span>
            </span>
          </button>
        ))}
      </div>

      {canLoadMore && (
        <div className="news-pagination" ref={loadMarker}>
          <button
            type="button"
            className="news-load-more"
            onClick={() => setVisible((count) => Math.min(count + PAGE_SIZE, filtered.length))}
          >
            Load more photos
          </button>
        </div>
      )}

      {active && selected !== null && (
        <div
          className="news-lightbox"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) close();
          }}
        >
          <div
            className="news-lightbox__dialog"
            role="dialog"
            aria-modal="true"
            aria-label="News photo viewer"
            data-news-dialog
          >
            <button ref={closeButton} type="button" className="news-lightbox__close" onClick={close} aria-label="Close viewer">×</button>
            <div className="news-lightbox__image">
              <Image
                key={active.id}
                src={active.src}
                alt={active.title}
                fill
                sizes="(max-width: 800px) 100vw, 88vw"
                quality={85}
                style={{ objectFit: 'contain' }}
              />
            </div>
            <div className="news-lightbox__bottom">
              <button type="button" onClick={() => move(-1)} aria-label="Previous photo">←</button>
              <p>{active.title} <span>{selected + 1} / {filtered.length}</span></p>
              <button type="button" onClick={() => move(1)} aria-label="Next photo">→</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
