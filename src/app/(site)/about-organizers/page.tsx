import Link from 'next/link';
import Image from 'next/image';
import Icon from '@/components/Icon';
import JsonLd from '@/components/JsonLd';
import { PageHero, SectionHead, CtaBand } from '@/components/blocks';
import { pageMeta, graph, breadcrumbNode, organizationNodes } from '@/lib/seo';
import { organisers, offices, contacts, telHref } from '@/lib/site';
import heroImg from '@/assets/photos/inauguration-10th.jpg';
import teamImg from '@/assets/gallery/expo-56.jpg';

export const metadata = pageMeta({
  title: 'Organisers | Futurex Trade Fair & Events and Media Space Solutions',
  description: 'Nepal Wood International Expo is jointly organised by Futurex Trade Fair and Events (New Delhi, est. 2011) and Media Space Solutions (Kathmandu, est. 2009).',
  path: '/about-organizers',
});

export default function Organisers() {
  const crumbs = [{ name: 'Organisers', path: '/about-organizers' }];
  return (
    <>
      <JsonLd data={graph(breadcrumbNode(crumbs), ...organizationNodes())} />
      <PageHero seed={22} eyebrow="Jointly organised by" title={<>Two organisers, <em>one focused platform.</em></>} lead="International reach from New Delhi, and local depth from Kathmandu." crumbs={crumbs} image={heroImg} />

      <section className="section">
        <div className="container org-grid">
          {organisers.map((o, i) => (
            <article className="org" key={o.id} data-reveal style={{ ['--d' as string]: `${i * 0.08}s` }}>
              <div className="org__logo"><img src={o.logo} alt={o.name} width={220} height={60} /></div>
              <p className="card__kicker">Since {o.since} · {o.city}</p>
              <h2 className="h-md">{o.name}</h2>
              <p>{o.blurb}</p>
              <p className="org__tag">{o.tagline}</p>
              {o.url && <a className="link-arrow" href={o.url} target="_blank" rel="noopener">Visit website<Icon name="arrow-up-right" /></a>}
            </article>
          ))}
        </div>
      </section>

      <section className="section section--cream">
        <div className="container split">
          <div className="split__media" data-reveal><Image src={teamImg} alt="Organisers and partners on stage at Nepal Wood International Expo" fill sizes="(max-width: 900px) 100vw, 45vw" /></div>
          <div>
            <p className="eyebrow" data-reveal>How we work together</p>
            <h2 className="h-lg" data-reveal>International exhibitors, <em>Nepali buyers.</em></h2>
            <ul className="check-list" data-reveal>
              <li><Icon name="check" />Futurex runs the India & international desk: overseas exhibitors, country participation, media partners and sales.</li>
              <li><Icon name="check" />Media Space runs the Nepal secretariat: venue operations, local exhibitors, visitor promotion, associations and government relations.</li>
              <li><Icon name="check" />Together they run nationwide visitor campaigns: city roadshows, press, TV, radio, outdoor, digital and WhatsApp.</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SectionHead eyebrow="Offices & contacts" title={<>Talk to <em>the team.</em></>} />
          <div className="cards">
            {contacts.map((c) => (
              <article className="card" key={c.email} data-reveal>
                {/* <p className="card__kicker">{c.role}</p> */}
                <h3 className="h-sm">{c.name}</h3>
                <p><a href={telHref(c.phone)}>{c.phone}</a><br /><a href={`mailto:${c.email}`}>{c.email}</a></p>
              </article>
            ))}
            {offices.map((o) => (
              <article className="card" key={o.name} data-reveal>
                <p className="card__kicker">Office</p>
                <h3 className="h-sm">{o.name}</h3>
                <p>{o.lines.map((l) => <span key={l}>{l}<br /></span>)}{o.phone}</p>
              </article>
            ))}
          </div>
          <p className="small muted" style={{ marginTop: 24 }}>Or use the <Link href="/contact" style={{ textDecoration: 'underline' }}>contact form</Link>, and we’ll route it to the right person.</p>
        </div>
      </section>
      <CtaBand />
    </>
  );
}
