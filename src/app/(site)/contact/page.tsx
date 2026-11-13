import Icon from '@/components/Icon';
import JsonLd from '@/components/JsonLd';
import EnquiryForm from '@/components/forms/EnquiryForm';
import { PageHero } from '@/components/blocks';
import { pageMeta, graph, breadcrumbNode, organizationNodes } from '@/lib/seo';
import { contacts, offices, event, telHref, waHref, social } from '@/lib/site';

export const metadata = pageMeta({
  title: 'Contact Us | Stall Booking, Visitors & Sponsorship | Nepal Wood',
  description: 'Contact the Nepal Wood Expo team: stall booking (India & international), the Nepal secretariat, sponsorship and media, by phone, WhatsApp or email.',
  path: '/contact',
});

export default function Contact() {
  const crumbs = [{ name: 'Contact', path: '/contact' }];
  return (
    <>
      <JsonLd data={graph(breadcrumbNode(crumbs), ...organizationNodes())} />
      <PageHero seed={171} dark={false} eyebrow="Contact" title={<>We’re here to help <em>you connect.</em></>} lead="Booking a stand, planning a visit, sponsoring or writing about the expo? Reach the right person directly." crumbs={crumbs} />
      <section className="section">
        <div className="container">
          <div className="contact-cards">
            {contacts.map((c) => (
              <article className="card" key={c.email} data-reveal>
                <p className="card__kicker">{c.role}</p>
                <h2 className="h-sm">{c.name}</h2>
                <a className="contact-line" href={telHref(c.phone)}><Icon name="phone" />{c.phone}</a>
                <a className="contact-line" href={`mailto:${c.email}`}><Icon name="mail" />{c.email}</a>
                <a className="contact-line" href={waHref(c.whatsapp)} target="_blank" rel="noopener"><Icon name="whatsapp" />WhatsApp</a>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section className="section section--cream">
        <div className="container form-layout">
          <div className="form-card">
            <p className="eyebrow">Send a message</p>
            <h2 className="h-md" style={{ margin: '14px 0 26px' }}>We reply within one working day.</h2>
            <EnquiryForm topic="other" />
          </div>
          <aside className="form-aside">
            {offices.map((o) => (
              <div className="card" key={o.name}>
                <p className="card__kicker">Office</p>
                <strong>{o.name}</strong>
                <p>{o.lines.map((l) => <span key={l}>{l}<br /></span>)}<a href={telHref(o.phone)}>{o.phone}</a></p>
              </div>
            ))}
            <div className="card">
              <p className="card__kicker">Venue</p>
              <strong>{event.venue.full}</strong>
              <p>{event.venue.street}, {event.venue.city}, {event.venue.country}<br />{event.datesLabel}</p>
              <a className="link-arrow" href={event.venue.mapsUrl} target="_blank" rel="noopener">Directions<Icon name="arrow-up-right" /></a>
            </div>
            <a className="dl" href={social.linkedin} target="_blank" rel="noopener"><span className="dl__icon"><Icon name="linkedin" /></span><span><strong>Follow on LinkedIn</strong><span>News and exhibitor announcements</span></span></a>
          </aside>
        </div>
      </section>
    </>
  );
}
