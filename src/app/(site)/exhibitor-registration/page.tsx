import Link from 'next/link';
import Icon from '@/components/Icon';
import JsonLd from '@/components/JsonLd';
import ExhibitorForm from '@/components/forms/ExhibitorForm';
import { PageHero } from '@/components/blocks';
import { pageMeta, graph, breadcrumbNode } from '@/lib/seo';
import { contacts, downloads, event, telHref, waHref } from '@/lib/site';
import { zones } from '@/lib/content';
import heroImg from '@/assets/photos/hero-machinery-aisle.jpg';

export const metadata = pageMeta({
  title: 'Book a Stand | Nepal Wood International Expo 2027 Exhibitor Enquiry',
  description: 'Book exhibition space at Nepal Wood International Expo 2027 (28–31 Jan, Kathmandu). Shell scheme from 9 sqm, raw space for machinery. Get the floor plan and a quote.',
  path: '/exhibitor-registration',
});

export default async function ExhibitorRegistration({ searchParams }: { searchParams: Promise<{ zone?: string }> }) {
  const { zone } = await searchParams;
  const defaultZone = zones.find((z) => z.title === zone)?.title;
  const crumbs = [{ name: 'Book a stand', path: '/exhibitor-registration' }];
  return (
    <>
      <JsonLd data={graph(breadcrumbNode(crumbs))} />
      <PageHero seed={71} eyebrow="Exhibitor space booking" title={<>Book your stand at <em>Nepal Wood 2027.</em></>} lead="Tell us what you’ll show and how much space you need. We’ll reply with the floor plan, available positions and a quote, usually within one working day." crumbs={crumbs} image={heroImg} />
      <section className="section section--cream form-section">
        <div className="container form-layout">
          <div className="form-card" id="form">
            <ExhibitorForm defaultZone={defaultZone} />
          </div>
          <aside className="form-aside">
            <div className="card card--featured">
              <p className="card__kicker">Talk to sales directly</p>
              {contacts.slice(0, 2).map((c) => (
                <div key={c.email} className="aside-contact">
                  <strong>{c.name}</strong>
                  {/* <span>{c.role}</span> */}
                  <a href={telHref(c.phone)}><Icon name="phone" />{c.phone}</a>
                  <a href={waHref(c.whatsapp, 'Hello, I would like to book a stand at Nepal Wood Expo 2027.')} target="_blank" rel="noopener"><Icon name="whatsapp" />WhatsApp</a>
                  <a href={`mailto:${c.email}`}><Icon name="mail" />{c.email}</a>
                </div>
              ))}
            </div>
            
            <a className="dl" href={downloads.brochure.file} download>
              <span className="dl__icon"><Icon name="download" /></span>
              <span><strong>2027 brochure</strong><span>Exhibitor & visitor profile · {downloads.brochure.size}</span></span>
            </a>
            <div className="card">
              <p className="card__kicker">Heavy machinery?</p>
              <p>Running live demos or bringing machines over a tonne? Tick the box in step 2 and tell us about power (3-phase), compressed air and unloading. We plan floor load and placement with you.</p>
              <Link className="link-arrow" href="/why-exhibit">Why exhibit<Icon name="arrow" /></Link>
            </div>
            <p className="small muted">{event.datesLabel} · {event.venue.full}, {event.venue.city}</p>
          </aside>
        </div>
      </section>
    </>
  );
}
