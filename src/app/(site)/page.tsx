import Link from 'next/link';
import Image from 'next/image';
import Icon from '@/components/Icon';
import TreeRings from '@/components/TreeRings';
import Countdown from '@/components/Countdown';
import JsonLd from '@/components/JsonLd';
import { SectionHead, PartnerWall, ParticipantsMarquee, Testimonials } from '@/components/blocks';
import { event, headlineStats, organisers, contacts, stats, telHref } from '@/lib/site';
import { zones, editions, visitorGroups, interest, seminars, whyExhibit } from '@/lib/content';
import { pageMeta, graph, organizationNodes, eventNode } from '@/lib/seo';
import { SITE_URL } from '@/lib/site';
import { getTestimonials } from '@/lib/public-data';
import '../home.css';

import heroImg from '@/assets/photos/hero-machinery-aisle.jpg';
import exhibitImg from '@/assets/photos/demo-laser-cutter.jpg';
import visitImg from '@/assets/photos/aisle-crowd.jpg';
import partnerImg from '@/assets/photos/inauguration-10th.jpg';
import meetingImg from '@/assets/photos/b2b-meeting.jpg';
import hallImg from '@/assets/photos/machinery-hall.jpg';
import ribbonImg from '@/assets/photos/ribbon-cutting.jpg';
import seminarImg from '@/assets/photos/seminar-stage.jpg';
import audienceImg from '@/assets/photos/seminar-audience.jpg';
import crowdImg from '@/assets/photos/visitors-crowd.jpg';
import flooringImg from '@/assets/photos/flooring-display.jpg';
import roadshowImg from '@/assets/photos/roadshow.jpg';
import textureImg from '@/assets/photos/wood-texture.jpg';
import g1 from '@/assets/gallery/expo-29.jpg';
import g2 from '@/assets/gallery/expo-34.jpg';
import g3 from '@/assets/gallery/expo-19.jpg';
import g4 from '@/assets/gallery/expo-53.jpg';
import g5 from '@/assets/gallery/expo-13.jpg';
import g6 from '@/assets/gallery/expo-56.jpg';
import g7 from '@/assets/gallery/expo-32.jpg';
import g8 from '@/assets/gallery/expo-22.jpg';

export const revalidate = 300;

export const metadata = pageMeta({
  title: 'Nepal Wood International Expo 2027 | 28–31 Jan, Kathmandu',
  description: '12th Nepal Wood International Expo, 28–31 January 2027, Bhrikuti Mandap, Kathmandu. Plywood, laminates, woodworking machinery, furniture tech & tools.',
  path: '/',
});

const storyImgs = [
  { img: meetingImg, alt: 'An exhibitor in discussion with two trade visitors at a stand table' },
  { img: exhibitImg, alt: 'Visitors gathered around a laser-cutting machine demonstration' },
  { img: hallImg, alt: 'Busy machinery aisle with edge banding machines on display' },
  { img: flooringImg, alt: 'Visitors studying flooring and soffit panels at an exhibitor stand' },
  { img: roadshowImg, alt: 'Promotional roadshow banners for cities across Nepal' },
  { img: audienceImg, alt: 'Audience listening at a Nepal Wood seminar session' },
];

const galleryA = [g1, ribbonImg, g2, crowdImg, g3, seminarImg];
const galleryB = [g4, exhibitImg, g5, hallImg, g6, g7, g8];

export default async function Home() {
  const testimonials = await getTestimonials(6);
  return (
    <>
      <JsonLd data={graph(...organizationNodes(), { '@type': 'WebSite', '@id': `${SITE_URL}/#website`, url: `${SITE_URL}/`, name: 'Nepal Wood International Expo', inLanguage: 'en' }, eventNode())} />

      {/* ============ HERO ============ */}
      <section className="hero on-dark" aria-labelledby="hero-title">
        <div className="hero__media" aria-hidden="true">
          <Image src={heroImg} alt="" fill priority sizes="(max-width: 1080px) 100vw, 70vw" className="hero__img" placeholder="blur" />
        </div>
        <TreeRings className="hero__rings" rings={26} seed={12} cracks={3} />
        <div className="container hero__inner">
          <div className="hero__copy">
            <p className="hero__chip"><span className="dot" />12th Edition · first four-day show</p>
            <h1 id="hero-title" className="hero__title">
              <span className="hero__kicker">Nepal Wood International Expo 2027</span>
              <span className="h-display hero__headline">Where Nepal’s wood industry <em>does business.</em></span>
            </h1>
            <p className="lead hero__lead">Plywood, laminates, woodworking machinery, furniture technology, tools and raw materials: four days, one venue, and the buyers who matter.</p>
            <div className="hero__ctas">
              <Link className="btn btn--copper" href="/exhibitor-registration">Book a stand<Icon name="arrow" className="arrow" /></Link>
              <Link className="btn btn--ghost" href="/visitor-registration">Register to visit, free</Link>
            </div>
            <Link className="hero__brochure" href="/downloads/event-brochure"><Icon name="download" />Download the 2027 brochure</Link>
          </div>
          <aside className="hero__panel" aria-label="Dates and venue">
            <div className="hero__date">
              <span className="hero__days tnum">28<span>–</span>31</span>
              <span className="hero__month">January<br />2027</span>
            </div>
            <p className="hero__venue"><Icon name="pin" />{event.venue.full}, {event.venue.city}, {event.venue.country}</p>
            <div>
              <p className="hero__count-label">Countdown to opening day <span>Nepal time (UTC+5:45)</span></p>
              <Countdown />
            </div>
          </aside>
        </div>
        <div className="container">
          <dl className="hero__stats">
            {headlineStats.map((s) => (
              <div key={s.label}>
                <dt className="sr-only">{s.label}</dt>
                <dd>{s.value.toLocaleString('en-US')}{s.suffix}</dd>
                <dd className="hero__stat-label">{s.label}</dd>
              </div>
            ))}
          </dl>
          <p className="hero__note">2027 figures are projections from the official 2027 brochure.</p>
        </div>
      </section>

      {/* ============ PATHS ============ */}
      <section className="section paths" aria-labelledby="paths-title">
        <div className="container">
          <SectionHead eyebrow="Take part" id="paths-title" title={<>Exhibit, visit or partner: <em>choose your way in.</em></>} />
          <div className="paths__grid">
            {[
              { href: '/exhibitor-registration', dark: true, img: exhibitImg, alt: 'Visitors watching a laser-cutting machine demonstration', forWho: 'For manufacturers, brands & distributors', t: 'Book a stand', d: 'Show your machines, boards and materials to Nepal’s furniture makers, dealers, architects and importers, the people who sign purchase orders.', ticks: ['Live machine demonstrations', 'Tell us your power, space & heavy-machinery needs', 'Branding and sponsorship add-ons'], cta: 'Enquire about a stand' },
              { href: '/visitor-registration', img: visitImg, alt: 'Trade visitors walking a busy aisle of exhibitor stands', forWho: 'For buyers, architects & factory owners', t: 'Register to visit', d: 'Pre-register as a trade visitor and spend four days comparing suppliers, watching machines run and joining industry seminars.', ticks: ['Free entry for trade visitors', 'QR badge for fast entry', 'Live demos and seminars'], cta: 'Register free' },
              { href: '/sponsorship', img: partnerImg, alt: 'Ribbon-cutting at the inauguration of the 10th Nepal Wood International Expo', forWho: 'For brands that want to lead', t: 'Sponsor & partner', d: 'Title and tier partnerships, badges, seminars and venue branding that put your name in front of every visitor, all four days.', ticks: ['Registration & badge branding', 'Seminar and session partnerships', 'Venue and digital visibility'], cta: 'See sponsorship options' },
            ].map((p, i) => (
              <Link className={`path-card${p.dark ? ' path-card--dark' : ''}`} href={p.href} key={p.t} data-reveal style={{ ['--d' as string]: `${i * 0.08}s` }}>
                <div className="path-card__media"><Image src={p.img} alt={p.alt} sizes="(max-width: 900px) 100vw, 34vw" placeholder="blur" /></div>
                <div className="path-card__body">
                  <p className="path-card__for">{p.forWho}</p>
                  <h3 className="h-md">{p.t}</h3>
                  <p>{p.d}</p>
                  <ul className="ticks">{p.ticks.map((t) => <li key={t}><Icon name="check" />{t}</li>)}</ul>
                  <span className="path-card__cta">{p.cta}<Icon name="arrow" className="arrow" /></span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ============ ABOUT ============ */}
      <section className="section section--cream about" aria-labelledby="about-title">
        <div className="container about__grid">
          <div className="about__side">
            <p className="eyebrow" data-reveal>The expo</p>
            <div className="about__seal" data-reveal>
              <TreeRings rings={12} seed={3} cracks={0} className="about__seal-rings" />
              <span className="about__seal-num">12</span>
              <span className="about__seal-txt">editions</span>
            </div>
          </div>
          <div className="about__main">
            <h2 id="about-title" className="h-lg" data-reveal>Nepal’s specialised trade show for the <em>wood and furniture</em> industry.</h2>
            <div className="about__cols">
              <p data-reveal>Nepal Wood International Expo is where manufacturers, importers, traders, distributors, converters and end-users of the wood industry meet face to face to discover products, compare suppliers and close deals.</p>
              <p data-reveal style={{ ['--d' as string]: '.08s' }}>For the first time, the 12th edition runs for four days, with exhibitors expected from Nepal, India, China, Malaysia, Germany, Taiwan and beyond. It is organised by Futurex Trade Fair and Events (New Delhi) and Media Space Solutions (Kathmandu) and supported by Nepal’s leading industry associations.</p>
            </div>
            <div className="about__orgs" data-reveal>
              <span className="about__orgs-label">Organised by</span>
              {organisers.map((o) => <img key={o.id} src={o.logo} alt={o.name} width={150} height={32} loading="lazy" />)}
              <Link className="link-arrow" href="/about-show">More about the expo<Icon name="arrow" /></Link>
            </div>
          </div>
        </div>
      </section>

      {/* ============ ZONES ============ */}
      <section className="section cats" aria-labelledby="cats-title">
        <div className="container">
          <SectionHead split eyebrow="Exhibitor profile" id="cats-title" title={<>Everything between the log <em>and the living room.</em></>} lead="Five product zones, from raw boards and machines to finished interiors. The list is a guide, not a limit." />
          <div className="cats__rail" data-accordion>
            {zones.map((c, i) => (
              <Link href={`/exhibitor-profile/${c.slug}`} className={`cat${i === 0 ? ' is-open' : ''}`} data-cat key={c.slug} aria-expanded={i === 0}>
                <Image src={c.img} alt={c.alt} fill sizes="(max-width: 900px) 100vw, 50vw" className="cat__img" />
                <span className="cat__shade" />
                <span className="cat__no">{c.no}</span>
                <span className="cat__body">
                  <span className="cat__title">{c.title}</span>
                  <span className="cat__items">{c.items.slice(0, 5).map((it) => <span key={it}>{it}</span>)}</span>
                  <span className="cat__more">Explore the zone<Icon name="arrow" /></span>
                </span>
              </Link>
            ))}
          </div>
          <div className="cats__foot" data-reveal>
            <Link className="btn" href="/exhibitor-registration">Book a stand in your zone<Icon name="arrow" className="arrow" /></Link>
            <Link className="link-arrow" href="/exhibitor-profile">See the full exhibitor profile<Icon name="arrow" /></Link>
          </div>
        </div>
      </section>

      {/* ============ GROWTH RINGS ============ */}
      <section className="section section--dark rings" aria-labelledby="rings-title" data-rings-section>
        <div className="container rings__grid">
          <div className="rings__visual">
            <div className="rings__sticky">
              <TreeRings rings={12} seed={21} cracks={2} wobble={1.2} indexed className="rings__svg" />
              <div className="rings__readout" aria-hidden="true"><span data-rings-ed>12th</span><small data-rings-year>2027</small></div>
            </div>
          </div>
          <div className="rings__content">
            <p className="eyebrow" data-reveal>Our journey</p>
            <h2 id="rings-title" className="h-xl" data-reveal>Twelve editions. <em>Twelve growth rings.</em></h2>
            <p className="lead" data-reveal>A tree records every year in a ring. Nepal Wood has added one with nearly every season, through the pandemic and a tenth anniversary to its first four-day show.</p>
            <ol className="timeline">
              {editions.map((e, i) => (
                <li className={`timeline__item${e.current ? ' is-current' : ''}`} key={e.ed} data-edition={i} data-ed={e.ed} data-year={e.year}>
                  <span className="timeline__ed">{e.ed}</span>
                  <div>
                    <p className="timeline__dates">{e.dates}</p>
                    <p className="timeline__note">{e.note}</p>
                  </div>
                </li>
              ))}
            </ol>
            <Link className="link-arrow" href="/past-editions">Explore past editions & reports<Icon name="arrow" /></Link>
          </div>
        </div>
      </section>

      {/* ============ VISITORS ============ */}
      <section className="section visitors" aria-labelledby="visitors-title">
        <div className="container">
          <SectionHead split eyebrow="Who you’ll meet" id="visitors-title" title={<>The people who buy, specify <em>and sell wood.</em></>} lead="Trade visitors come to source machinery, boards, hardware and finishes for real projects and factories." />
          <div className="visitors__grid">
            <ul className="visitors__list">
              {visitorGroups.map((g, i) => <li key={g} data-reveal style={{ ['--d' as string]: `${i * 0.05}s` }}><span className="tnum">{String(i + 1).padStart(2, '0')}</span>{g}</li>)}
            </ul>
            <div className="visitors__data" data-reveal>
              <div className="big-stat">
                <span className="big-stat__num tnum"><span data-count={stats.seniorManagementPct}>{stats.seniorManagementPct}</span>%</span>
                <p>of visitors hold senior management roles: chairman, CEO, director, VP or head of department.</p>
              </div>
              <h3 className="visitors__chart-title">Visitor interest by sector</h3>
              <ul className="bars" data-bars>
                {/* bar widths are relative to the largest share (30%) */}
                {interest.map((b, i) => (
                  <li className="bar" key={b.label} style={{ ['--bd' as string]: `${i * 0.06}s` }}>
                    <span className="bar__label">{b.label}</span>
                    <span className="bar__track"><span className="bar__fill" style={{ ['--v' as string]: b.v / 30 }} /></span>
                    <span className="bar__val tnum">{b.v}%</span>
                  </li>
                ))}
              </ul>
              <p className="source">Source: organiser visitor data, 10th and 11th edition post-show reports (2025).</p>
            </div>
          </div>
        </div>
      </section>

      {/* ============ WHY EXHIBIT (sticky story) ============ */}
      <section className="section section--cream why" aria-labelledby="why-title" data-story>
        <div className="container why__grid">
          <div className="why__content">
            <p className="eyebrow" data-reveal>Why exhibit</p>
            <h2 id="why-title" className="h-xl" data-reveal>Your gateway to one of the region’s <em>fastest-growing markets.</em></h2>
            <ol className="reasons">
              {whyExhibit.map((r, i) => (
                <li className="reason" data-step={i} key={r.t}>
                  <span className="reason__no tnum">{String(i + 1).padStart(2, '0')}</span>
                  <div>
                    <h3 className="h-sm">{r.t}</h3>
                    <p>{r.d}</p>
                  </div>
                  <div className="reason__img-mobile"><Image src={storyImgs[i].img} alt={storyImgs[i].alt} sizes="100vw" /></div>
                </li>
              ))}
            </ol>
            <div className="why__ctas">
              <Link className="btn" href="/exhibitor-registration">Book a stand<Icon name="arrow" className="arrow" /></Link>
              <Link className="btn btn--ghost" href="/why-exhibit">All the reasons</Link>
            </div>
          </div>
          <div className="why__media" aria-hidden="true">
            <div className="why__sticky">
              {storyImgs.map((s, i) => (
                <div className={`why__frame${i === 0 ? ' is-active' : ''}`} data-frame={i} key={i}>
                  <Image src={s.img} alt="" fill sizes="(max-width: 900px) 100vw, 46vw" />
                </div>
              ))}
              <div className="why__progress"><span data-story-progress /></div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ PARTICIPANTS ============ */}
      <section className="section section--tight participants-band" aria-labelledby="part-title">
        <div className="container">
          <div className="section-head section-head--split">
            <div>
              <p className="eyebrow" data-reveal>Past participants</p>
              <h2 id="part-title" className="h-lg" data-reveal>115+ brands exhibited <em>at the 10th edition.</em></h2>
            </div>
            <p className="lead" data-reveal>Plywood mills, laminate houses, machinery makers, hardware and chemical brands from Nepal, India, China and beyond.</p>
          </div>
        </div>
        <ParticipantsMarquee />
      </section>

      {/* ============ SEMINARS ============ */}
      <section className="section section--dark seminars" aria-labelledby="sem-title">
        <div className="seminars__bg" aria-hidden="true" data-parallax><Image src={seminarImg} alt="" fill sizes="100vw" /></div>
        <div className="container">
          <SectionHead split eyebrow="Knowledge sessions" id="sem-title" title={<>More than a <em>trade floor.</em></>} lead="Industry seminars bring policy-makers, technologists, architects and designers together on the show days." />
          <div className="seminars__grid">
            {seminars.map((s, i) => (
              <article className="seminar" key={s.slug} data-reveal style={{ ['--d' as string]: `${i * 0.08}s` }}>
                <p className="seminar__meta"><span>{s.date}</span><span>{s.ed}</span></p>
                <h3 className="h-sm">{s.title}</h3>
                <p>{s.text}</p>
              </article>
            ))}
            <article className="seminar seminar--next" data-reveal style={{ ['--d' as string]: '.24s' }}>
              <p className="seminar__meta"><span>28–31 Jan 2027</span><span>12th edition</span></p>
              <h3 className="h-sm">The 2027 programme will be announced soon</h3>
              <p>Register as a visitor to get the session schedule as soon as it is published.</p>
              <Link className="link-arrow" href="/seminars">Seminar details<Icon name="arrow" /></Link>
            </article>
          </div>
        </div>
      </section>

      {/* ============ GALLERY ============ */}
      <section className="gallery-band section--darkest" aria-labelledby="gal-title">
        <div className="container gallery-band__head">
          <p className="eyebrow">Glimpses</p>
          <h2 id="gal-title" className="h-lg">Inside past editions</h2>
          <Link className="link-arrow" href="/gallery">Open the gallery<Icon name="arrow" /></Link>
        </div>
        {[galleryA, galleryB].map((row, r) => (
          <div className={`marquee${r ? ' marquee--reverse' : ''}`} aria-hidden="true" key={r}>
            {[0, 1].map((k) => (
              <div className="marquee__track" key={k}>
                {row.map((img, i) => <Image key={i} src={img} alt="" sizes="380px" className="marquee__img" />)}
              </div>
            ))}
          </div>
        ))}
      </section>

      <Testimonials items={testimonials} />

      {/* ============ PARTNERS ============ */}
      <section className="section partners" aria-labelledby="partners-title">
        <div className="container">
          <SectionHead center eyebrow="Partners" id="partners-title" title={<>Backed by <em>the industry.</em></>} />
          <PartnerWall />
        </div>
      </section>

      {/* ============ PLAN ============ */}
      <section className="section section--cream plan" aria-labelledby="plan-title">
        <div className="container">
          <SectionHead split eyebrow="Plan your visit" id="plan-title" title={<>See you at <em>Bhrikuti Mandap.</em></>} lead="Nepal’s best-known exhibition ground, in the heart of Kathmandu on Pradarshani Marg." />
          <div className="plan__grid">
            {[
              { icon: 'pin', t: 'Venue', d: `${event.venue.full}, ${event.venue.street}, ${event.venue.city}, ${event.venue.country}`, href: event.venue.mapsUrl, l: 'Open in Google Maps', ext: true },
              { icon: 'clock', t: 'Dates & hours', d: `${event.datesLabel}, ${event.weekdays}. ${event.hours.label} daily${event.hours.tentative ? ' (tentative)' : ''}.`, href: '/venue', l: 'Visitor information' },
              { icon: 'plane', t: 'Getting there', d: 'About 5.5 km from Tribhuvan International Airport. Taxis and ride apps such as Pathao and inDrive drop you at the gate.', href: '/venue#travel', l: 'Travel guide' },
              { icon: 'badge', t: 'Entry', d: 'Free for trade visitors who register. Show your QR badge and carry a business card or photo ID.', href: '/visitor-registration', l: 'Get your badge' },
            ].map((c, i) => (
              <article className="plan-card" key={c.t} data-reveal style={{ ['--d' as string]: `${i * 0.06}s` }}>
                <Icon name={c.icon} className="plan-card__icon" />
                <h3 className="h-sm">{c.t}</h3>
                <p>{c.d}</p>
                {c.ext ? <a className="link-arrow" href={c.href} target="_blank" rel="noopener">{c.l}<Icon name="arrow-up-right" /></a> : <Link className="link-arrow" href={c.href}>{c.l}<Icon name="arrow" /></Link>}
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ============ FINAL CTA ============ */}
      <section className="final on-dark" aria-labelledby="final-title">
        <div className="final__bg" aria-hidden="true" data-parallax><Image src={textureImg} alt="" fill sizes="100vw" /></div>
        <TreeRings className="final__rings" rings={22} seed={5} cracks={2} />
        <div className="container final__inner">
          <p className="eyebrow" data-reveal>12th edition · {event.datesLabel}</p>
          <h2 id="final-title" className="h-display" data-reveal>Mark your <em>presence.</em></h2>
          <p className="lead" data-reveal>Stalls for the 12th edition are being allotted now. Tell us what you want to show, and the team will come back with availability and options.</p>
          <div className="final__ctas" data-reveal>
            <Link className="btn btn--copper" href="/exhibitor-registration">Book a stand<Icon name="arrow" className="arrow" /></Link>
            <Link className="btn btn--ghost" href="/visitor-registration">Register to visit</Link>
          </div>
          <div className="final__count" data-reveal><Countdown compact /></div>
          <ul className="final__contacts">
            {contacts.map((c, i) => (
              <li key={c.email} data-reveal style={{ ['--d' as string]: `${i * 0.06}s` }}>
                <strong>{c.name}</strong>
                <span>{c.role}</span>
                <a href={telHref(c.phone)}><Icon name="phone" />{c.phone}</a>
                <a href={`mailto:${c.email}`}><Icon name="mail" />{c.email}</a>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
