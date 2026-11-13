'use client';
import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { captureAttribution } from '@/lib/track';

gsap.registerPlugin(ScrollTrigger);

// DOM-level behaviour for server-rendered markup: smooth scroll, reveals, header, menus and scroll stories.
// It re-runs on every route change so client-side navigations behave like full loads.
export default function SiteEffects() {
  const pathname = usePathname();
  const lenisRef = useRef<Lenis | null>(null);

  // Smooth scroll lives for the whole session.
  useEffect(() => {
    captureAttribution();
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce || pathname.startsWith('/admin')) return;
    const lenis = new Lenis({ lerp: 0.11, touchMultiplier: 1.2 });
    lenisRef.current = lenis;
    lenis.on('scroll', ScrollTrigger.update);
    const raf = (t: number) => lenis.raf(t * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);
    return () => {
      gsap.ticker.remove(raf);
      lenis.destroy();
      lenisRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const cleanups: (() => void)[] = [];
    const on = <K extends keyof WindowEventMap>(t: EventTarget, ev: K | string, fn: EventListener, opts?: AddEventListenerOptions) => {
      t.addEventListener(ev, fn, opts);
      cleanups.push(() => t.removeEventListener(ev, fn, opts));
    };
    lenisRef.current?.scrollTo(0, { immediate: true });
    lenisRef.current?.start();

    /* ---------- Reveal on scroll ---------- */
    const revealables = document.querySelectorAll<HTMLElement>('[data-reveal]:not(.is-in), .tree-rings:not(.is-in), [data-reveal-group]:not(.is-in)');
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); } }),
      { rootMargin: '0px 0px -8% 0px', threshold: 0.12 },
    );
    revealables.forEach((el) => io.observe(el));
    cleanups.push(() => io.disconnect());
    document.querySelectorAll('.hero .tree-rings, .page-hero .tree-rings').forEach((el) => el.classList.add('is-in'));

    /* ---------- Count-up numbers ---------- */
    document.querySelectorAll<HTMLElement>('[data-count]').forEach((el) => {
      if (reduce || el.closest('.hero')) return;
      const end = Number(el.dataset.count);
      const decimals = Number(el.dataset.decimals || 0);
      const obj = { v: 0 };
      el.textContent = (0).toFixed(decimals);
      ScrollTrigger.create({
        trigger: el, start: 'top 88%', once: true,
        onEnter: () => gsap.to(obj, { v: end, duration: 1.8, ease: 'expo.out', onUpdate: () => (el.textContent = obj.v.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })) }),
      });
    });

    /* ---------- Header hide/show, mobile action bar ---------- */
    const header = document.querySelector<HTMLElement>('[data-header]');
    const actionBar = document.querySelector<HTMLElement>('[data-action-bar]');
    let lastY = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      if (header && !root.classList.contains('menu-open')) {
        if (y > 480 && y > lastY + 2) header.classList.add('is-hidden');
        else if (y < lastY - 2 || y < 480) header.classList.remove('is-hidden');
      }
      actionBar?.classList.toggle('is-visible', y > 560 && !pathname.includes('registration'));
      root.classList.toggle('is-scrolled', y > 40);
      lastY = y;
    };
    on(window, 'scroll', onScroll as EventListener, { passive: true });
    onScroll();

    /* ---------- Mobile menu ---------- */
    const toggle = document.querySelector<HTMLButtonElement>('[data-menu-toggle]');
    const setOpen = (open: boolean) => {
      if (open && header) {
        header.classList.remove('is-hidden');
        root.style.setProperty('--menu-top', `${Math.max(0, header.getBoundingClientRect().bottom)}px`);
      }
      root.classList.toggle('menu-open', open);
      toggle?.setAttribute('aria-expanded', String(open));
      document.body.style.overflow = open ? 'hidden' : '';
      if (open) lenisRef.current?.stop(); else lenisRef.current?.start();
    };
    setOpen(false);
    if (toggle) on(toggle, 'click', (() => setOpen(!root.classList.contains('menu-open'))) as EventListener);
    document.querySelectorAll('[data-mobile-menu] a').forEach((a) => on(a, 'click', (() => setOpen(false)) as EventListener));
    on(window, 'keydown', ((e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)) as EventListener);

    /* ---------- Category accordion ---------- */
    document.querySelectorAll<HTMLElement>('[data-accordion]').forEach((rail) => {
      const cats = [...rail.querySelectorAll<HTMLElement>('[data-cat]')];
      const open = (c: HTMLElement) => cats.forEach((x) => { x.classList.toggle('is-open', x === c); x.setAttribute('aria-expanded', String(x === c)); });
      const fine = window.matchMedia('(hover: hover) and (min-width: 901px)');
      cats.forEach((c) => {
        on(c, 'mouseenter', (() => fine.matches && open(c)) as EventListener);
        on(c, 'focus', (() => open(c)) as EventListener);
        on(c, 'click', ((e: Event) => { if (!c.classList.contains('is-open')) { e.preventDefault(); open(c); } }) as EventListener);
      });
    });

    /* ---------- Growth rings timeline ---------- */
    const ringSection = document.querySelector<HTMLElement>('[data-rings-section]');
    if (ringSection) {
      const rings = [...ringSection.querySelectorAll<SVGPathElement>('[data-ring]')];
      const items = [...ringSection.querySelectorAll<HTMLElement>('[data-edition]')];
      const edLabel = ringSection.querySelector('[data-rings-ed]');
      const yearLabel = ringSection.querySelector('[data-rings-year]');
      const light = (item: HTMLElement) => {
        const n = parseInt(item.dataset.ed || '0', 10);
        rings.forEach((r, i) => { r.classList.toggle('is-lit', i < n); r.classList.toggle('is-edge', i === n - 1); });
        items.forEach((it) => it.classList.toggle('is-active', it === item));
        if (edLabel) edLabel.textContent = item.dataset.ed || '';
        if (yearLabel) yearLabel.textContent = item.dataset.year || '';
      };
      if (items.length && !window.matchMedia('(min-width: 901px)').matches) {
        light(items[items.length - 1]);
        items.forEach((it) => it.classList.add('is-active'));
      } else if (items.length) {
        light(items[0]);
        items.forEach((item) => ScrollTrigger.create({ trigger: item, start: 'top 62%', end: 'bottom 62%', onEnter: () => light(item), onEnterBack: () => light(item) }));
      }
    }

    /* ---------- Sticky image story ---------- */
    document.querySelectorAll<HTMLElement>('[data-story]').forEach((story) => {
      const steps = [...story.querySelectorAll<HTMLElement>('[data-step]')];
      const frames = [...story.querySelectorAll<HTMLElement>('[data-frame]')];
      const progress = story.querySelector<HTMLElement>('[data-story-progress]');
      const activate = (i: number) => {
        steps.forEach((r, k) => r.classList.toggle('is-active', k === i));
        frames.forEach((f, k) => f.classList.toggle('is-active', k === i));
        progress?.style.setProperty('--p', String((i + 1) / steps.length));
      };
      activate(0);
      steps.forEach((r, i) => ScrollTrigger.create({ trigger: r, start: 'top 58%', end: 'bottom 58%', onEnter: () => activate(i), onEnterBack: () => activate(i) }));
    });

    /* ---------- Bars ---------- */
    document.querySelectorAll<HTMLElement>('[data-bars]').forEach((el) => {
      const io2 = new IntersectionObserver((en) => en.forEach((e) => { if (e.isIntersecting) { el.classList.add('is-in'); io2.disconnect(); } }), { threshold: 0.3 });
      io2.observe(el);
      cleanups.push(() => io2.disconnect());
    });

    /* ---------- Parallax ---------- */
    if (!reduce) {
      const hero = document.querySelector('.hero, .page-hero');
      const heroRings = hero?.querySelector('.tree-rings');
      if (hero && heroRings) gsap.to(heroRings, { yPercent: 12, ease: 'none', scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true } });
      const heroMedia = hero?.querySelector('.hero__media, .page-hero__media');
      if (hero && heroMedia) gsap.to(heroMedia, { yPercent: 8, ease: 'none', scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true } });
      document.querySelectorAll<HTMLElement>('[data-parallax] img').forEach((img) => {
        gsap.fromTo(img, { yPercent: -6, scale: 1.12 }, { yPercent: 6, ease: 'none', scrollTrigger: { trigger: img.closest('section') || img, start: 'top bottom', end: 'bottom top', scrub: true } });
      });
    }

    const refresh = () => ScrollTrigger.refresh();
    const t = window.setTimeout(refresh, 400);
    on(window, 'load', refresh as EventListener);

    return () => {
      window.clearTimeout(t);
      cleanups.forEach((fn) => fn());
      ScrollTrigger.getAll().forEach((st) => st.kill());
      document.body.style.overflow = '';
      root.classList.remove('menu-open');
    };
  }, [pathname]);

  return null;
}
