'use client';
import { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import Icon from './Icon';
import type { Shot } from '@/lib/gallery';

const tags = ['All', 'Show floor', 'Machinery', 'Materials', 'Meetings', 'Ceremonies & seminars'] as const;

export default function GalleryGrid({ shots }: { shots: Shot[] }) {
  const [tag, setTag] = useState<(typeof tags)[number]>('All');
  const [open, setOpen] = useState<number | null>(null);
  const list = tag === 'All' ? shots : shots.filter((s) => s.tag === tag);
  const go = useCallback((d: number) => setOpen((i) => (i === null ? null : (i + d + list.length) % list.length)), [list.length]);

  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(null);
      if (e.key === 'ArrowRight') go(1);
      if (e.key === 'ArrowLeft') go(-1);
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => { window.removeEventListener('keydown', onKey); document.body.style.overflow = ''; };
  }, [open, go]);

  return (
    <>
      <div className="gallery-filters" role="tablist" aria-label="Filter photos">
        {tags.map((t) => (
          <button key={t} role="tab" aria-selected={tag === t} className={`chip${tag === t ? ' is-on' : ''}`} onClick={() => setTag(t)}>
            {t}  
          </button>
        ))}
      </div>
      <div className="gallery-grid">
        {list.map((s, i) => (
          <button type="button" key={s.src.src} onClick={() => setOpen(i)} aria-label={`Open photo: ${s.alt}`}>
            <Image src={s.src} alt={s.alt} sizes="(max-width: 700px) 100vw, (max-width: 1100px) 50vw, 33vw" placeholder="blur" />
          </button>
        ))}
      </div>
      {open !== null && list[open] && (
        <div className="lightbox" role="dialog" aria-modal="true" aria-label="Photo viewer" onClick={(e) => e.target === e.currentTarget && setOpen(null)}>
          <Image src={list[open].src} alt={list[open].alt} sizes="90vw" />
          <button className="lightbox__btn lightbox__close" onClick={() => setOpen(null)} aria-label="Close"><Icon name="x" /></button>
          <button className="lightbox__btn lightbox__prev" onClick={() => go(-1)} aria-label="Previous photo"><Icon name="arrow" /></button>
          <button className="lightbox__btn lightbox__next" onClick={() => go(1)} aria-label="Next photo"><Icon name="arrow" /></button>
         
        </div>
      )}
    </>
  );
}
