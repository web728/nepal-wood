// Reusable page blocks shared by the inner pages.
import Link from 'next/link';
import Image, { type StaticImageData } from 'next/image';
import Icon from './Icon';
import TreeRings from './TreeRings';
import Countdown from './Countdown';
import { event, partners, organisers } from '@/lib/site';
import type { Testimonial } from '@/lib/public-data';

export function PageHero({ eyebrow, title, lead, crumbs = [], image, imageAlt = '', children, dark = true, seed = 9 }: {
  eyebrow: string; title: React.ReactNode; lead?: React.ReactNode; crumbs?: { name: string; path: string }[];
  image?: StaticImageData; imageAlt?: string; children?: React.ReactNode; dark?: boolean; seed?: number;
}) {
  return (
    <section className={`page-hero ${dark ? 'on-dark' : 'page-hero--light'}`}>
      {image && (
        <div className="page-hero__media" aria-hidden={imageAlt ? undefined : true}>
          <Image src={image} alt={imageAlt} fill priority sizes="100vw" placeholder="blur" />
        </div>
      )}
      <TreeRings className="page-hero__rings" rings={18} seed={seed} cracks={2} />
      <div className="container page-hero__inner">
        <nav className="crumbs" aria-label="Breadcrumb">
          <ol>
            <li><Link href="/">Home</Link></li>
            {crumbs.map((c, i) => (
              <li key={c.path}>{i === crumbs.length - 1 ? <span aria-current="page">{c.name}</span> : <Link href={c.path}>{c.name}</Link>}</li>
            ))}
          </ol>
        </nav>
        <p className="eyebrow">{eyebrow}</p>
        <h1 className="h-xl page-hero__title">{title}</h1>
        {lead && <p className="lead page-hero__lead">{lead}</p>}
        {children && <div className="page-hero__extra">{children}</div>}
      </div>
    </section>
  );
}

export function SectionHead({ eyebrow, title, lead, split = false, center = false, id }: { eyebrow: string; title: React.ReactNode; lead?: React.ReactNode; split?: boolean; center?: boolean; id?: string }) {
  return (
    <div className={`section-head${split ? ' section-head--split' : ''}${center ? ' section-head--center' : ''}`}>
      <div>
        <p className="eyebrow" data-reveal>{eyebrow}</p>
        <h2 id={id} className="h-xl" data-reveal>{title}</h2>
      </div>
      {lead && <p className="lead" data-reveal>{lead}</p>}
    </div>
  );
}

export function FeatureGrid({ items, cols = 3 }: { items: { icon: string; t: string; d: string }[]; cols?: 2 | 3 }) {
  return (
    <ul className={`features features--${cols}`}>
      {items.map((f, i) => (
        <li className="feature" key={f.t} data-reveal style={{ ['--d' as string]: `${(i % 3) * 0.06}s` }}>
          <span className="feature__icon"><Icon name={f.icon} /></span>
          <h3 className="h-sm">{f.t}</h3>
          <p>{f.d}</p>
        </li>
      ))}
    </ul>
  );
}

export function StatStrip({ items, note, dark = false }: { items: { v: number; suffix?: string; label: string; decimals?: number }[]; note?: string; dark?: boolean }) {
  return (
    <div className={`stat-strip${dark ? ' stat-strip--dark' : ''}`}>
      <dl>
        {items.map((s) => (
          <div key={s.label} data-reveal>
            <dt className="sr-only">{s.label}</dt>
            <dd className="stat-strip__num tnum"><span data-count={s.v} data-decimals={s.decimals || 0}>{s.v.toLocaleString('en-US', { minimumFractionDigits: s.decimals || 0 })}</span>{s.suffix}</dd>
            <dd className="stat-strip__label">{s.label}</dd>
          </div>
        ))}
      </dl>
      {note && <p className="stat-strip__note">{note}</p>}
    </div>
  );
}

export function CtaBand({ title = <>Mark your <em>presence.</em></>, lead = 'Stalls for the 12th edition are being allotted now. Tell us what you want to show and the team will come back with availability and options.', primary = { href: '/exhibitor-registration', label: 'Book a stand' }, secondary = { href: '/visitor-registration', label: 'Register to visit' }, countdown = true }: {
  title?: React.ReactNode; lead?: string; primary?: { href: string; label: string }; secondary?: { href: string; label: string }; countdown?: boolean;
}) {
  return (
    <section className="cta-band on-dark">
      <TreeRings className="cta-band__rings" rings={20} seed={31} cracks={2} />
      <div className="container cta-band__inner">
        <div>
          <p className="eyebrow" data-reveal>12th edition · {event.datesLabel}</p>
          <h2 className="h-xl" data-reveal>{title}</h2>
          <p className="lead" data-reveal>{lead}</p>
          <div className="cta-band__btns" data-reveal>
            <Link className="btn btn--copper" href={primary.href}>{primary.label}<Icon name="arrow" className="arrow" /></Link>
            <Link className="btn btn--ghost" href={secondary.href}>{secondary.label}</Link>
          </div>
        </div>
        {countdown && <div className="cta-band__count" data-reveal><p className="cta-band__count-label">Opening in</p><Countdown compact /></div>}
      </div>
    </section>
  );
}

export function LogoTiles({ items, cols = 5, large = false }: { items: { name: string; logo: string; note?: string }[]; cols?: number; large?: boolean }) {
  return (
    <div className="logo-row" style={{ ['--cols' as string]: cols }}>
      {items.map((p) => (
        <span className={`logo-tile${large ? ' logo-tile--lg' : ''}`} key={p.name} title={p.name}>
          <img src={p.logo} alt={p.name} loading="lazy" />
        </span>
      ))}
    </div>
  );
}

export function PartnerWall() {
  return (
    <div className="partner-wall">
      <div className="partner-wall__top">
        <div className="partner-group" data-reveal><h3>Organised by</h3><LogoTiles items={organisers.map((o) => ({ name: o.name, logo: o.logo }))} cols={2} large /></div>
        <div className="partner-group" data-reveal><h3>Lanyard sponsor</h3><LogoTiles items={partners.lanyard} cols={1} large /></div>
        <div className="partner-group" data-reveal><h3>Concurrent event</h3><LogoTiles items={partners.concurrent} cols={1} large /></div>
      </div>
      <div className="partner-group" data-reveal><h3>Supported by</h3><LogoTiles items={partners.supportedBy} /></div>
      <div className="partner-group" data-reveal><h3>Media partners</h3><LogoTiles items={partners.media} /></div>
    </div>
  );
}

const participantLogos = Array.from({ length: 115 }, (_, i) => `/participants/p${String(i + 1).padStart(3, '0')}.webp`);

export function ParticipantsMarquee() {
  const rows = [participantLogos.slice(0, 58), participantLogos.slice(58)];
  return (
    <div className="participants" aria-label="Brands that exhibited at the 10th edition">
      {rows.map((row, r) => (
        <div className={`marquee marquee--logos${r ? ' marquee--reverse' : ''}`} key={r} aria-hidden="true">
          {[0, 1].map((k) => (
            <div className="marquee__track" key={k}>
              {row.map((src) => <span className="participant" key={src}><img src={src} alt="" loading="lazy" width={150} height={60} /></span>)}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

export function Testimonials({ items }: { items: Testimonial[] }) {
  if (!items.length) return null;
  return (
    <section className="section section--cream testimonials" aria-labelledby="t-title">
      <div className="container">
        <SectionHead eyebrow="In their words" title={<>What exhibitors <em>say.</em></>} id="t-title" />
        <div className="testimonials__grid">
          {items.map((t, i) => (
            <figure className="quote" key={t._id} data-reveal style={{ ['--d' as string]: `${(i % 3) * 0.06}s` }}>
              <blockquote>“{t.quote}”</blockquote>
              <figcaption><strong>{t.name}</strong>{[t.role, t.company].filter(Boolean).join(', ')}{t.edition && <span className="tag">{t.edition}</span>}</figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Faq({ items }: { items: { q: string; a: string }[] }) {
  return (
    <div className="faq">
      {items.map((f) => (
        <details className="faq__item" key={f.q}>
          <summary><span>{f.q}</span><Icon name="plus" /></summary>
          <p>{f.a}</p>
        </details>
      ))}
    </div>
  );
}
