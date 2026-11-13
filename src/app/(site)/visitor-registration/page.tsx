import Icon from '@/components/Icon';
import JsonLd from '@/components/JsonLd';
import VisitorForm from '@/components/forms/VisitorForm';
import { PageHero } from '@/components/blocks';
import { pageMeta, graph, breadcrumbNode, eventNode } from '@/lib/seo';
import { event, contacts, telHref, waHref } from '@/lib/site';
import heroImg from '@/assets/photos/aisle-crowd.jpg';

export const metadata = pageMeta({
  title: 'Free Visitor Registration | Nepal Wood International Expo 2027',
  description: 'Register free for Nepal Wood International Expo 2027, 28–31 January, Bhrikuti Mandap, Kathmandu. Get your QR entry badge instantly and skip the queue.',
  path: '/visitor-registration',
});

const perks = [
  { icon: 'ticket', t: 'Free entry', d: 'For trade and business visitors, all four days.' },
  { icon: 'badge', t: 'Instant QR badge', d: 'Show it on your phone at the express counter.' },
  { icon: 'mail', t: 'Show updates', d: 'Seminar schedule and exhibitor list by email.' },
];

export default function VisitorRegistration() {
  const crumbs = [{ name: 'Register to visit', path: '/visitor-registration' }];
  return (
    <>
      <JsonLd data={graph(breadcrumbNode(crumbs), eventNode())} />
      <PageHero seed={121} eyebrow={`Free visitor pass · ${event.datesLabel}`} title={<>Register to visit <em>Nepal Wood 2027.</em></>} lead="Two minutes now saves the queue later. Your QR badge appears as soon as you submit." crumbs={crumbs} image={heroImg}>
        <ul className="hero-perks">{perks.map((p) => <li key={p.t}><Icon name={p.icon} /><span><strong>{p.t}</strong>{p.d}</span></li>)}</ul>
      </PageHero>
      <section className="section section--cream form-section">
        <div className="container form-layout">
          <div className="form-card"><VisitorForm /></div>
          <aside className="form-aside">
            <div className="card">
              <p className="card__kicker">Visiting guidelines</p>
              <ul>
                <li><Icon name="check" />This is a trade event for industry professionals, business owners, architects, designers and students of design.</li>
                <li><Icon name="check" />Carry a business card, company ID or photo ID with your badge.</li>
                <li><Icon name="check" />One badge per person. Badges can’t be shared.</li>
                <li><Icon name="check" />{event.hours.label} daily{event.hours.tentative ? ' (tentative)' : ''}, {event.datesLabel}.</li>
              </ul>
            </div>
            <div className="card card--featured">
              <p className="card__kicker">Groups & delegations</p>
              <p>Coming with a team, association or delegation? The Nepal secretariat can register you together.</p>
              <p><a href={telHref(contacts[2].phone)}>{contacts[2].phone}</a> · <a href={`mailto:${contacts[2].email}`}>{contacts[2].email}</a></p>
              <a className="link-arrow" href={waHref(contacts[2].whatsapp, 'Hello, I would like to register a group for Nepal Wood Expo 2027.')} target="_blank" rel="noopener">WhatsApp the secretariat<Icon name="arrow-up-right" /></a>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
