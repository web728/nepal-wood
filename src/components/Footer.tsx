import Link from 'next/link';
import Icon from './Icon';
import { event, contacts, social, organisers, telHref, waHref, whatsappDefault } from '@/lib/site';

const cols = [
  { h: 'Exhibit', links: [['Why exhibit', '/why-exhibit'], ['Exhibitor profile', '/exhibitor-profile'], ['Book a stand', '/exhibitor-registration'], ['Sponsorship', '/sponsorship'], ['Exhibitor list 2027', '/exhibitors'], ['2027 brochure', '/downloads/event-brochure']] },
  { h: 'Visit', links: [['Why visit', '/why-visit'], ['Visitor profile', '/visitor-profile'], ['Register free', '/visitor-registration'], ['Plan your visit', '/venue'], ['Seminars', '/seminars'], ['FAQ', '/faq']] },
  { h: 'About', links: [['About the expo', '/about-show'], ['Organisers', '/about-organizers'], ['Past editions', '/past-editions'], ['Gallery', '/gallery'], ['Contact', '/contact']] },
];

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <>
      <footer className="site-footer">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-brand">
              <img src="/brand/logo-reverse.svg" alt="Nepal Wood International Expo" width={150} height={64} loading="lazy" />
              <p>Nepal’s specialised B2B exhibition for plywood, laminates, woodworking machinery, furniture technology, tools and raw materials.</p>
              <p className="small footer-brand__when">{event.datesLabel} · {event.venue.name}, {event.venue.city}</p>
              <div className="footer-orgs" aria-label="Organised by">
                {organisers.map((o) => <span key={o.id}><img src={o.logo} alt={o.name} width={120} height={26} loading="lazy" /></span>)}
              </div>
            </div>

            {cols.map((c) => (
              <div className="footer-col" key={c.h}>
                <h3>{c.h}</h3>
                <ul>{c.links.map(([l, h]) => <li key={h}><Link href={h}>{l}</Link></li>)}</ul>
              </div>
            ))}

            <div className="footer-col footer-contact">
              <h3>Talk to the team</h3>
              <ul>
                <li>
                  
                  <a href={`mailto:${contacts[0].email}`} className="small">{contacts[0].email}</a><br />
                  <a href={telHref(contacts[0].phone)} className="small">{contacts[0].phone}</a>
                </li>
                <li>
                 
                  <a href={`mailto:${contacts[1].email}`} className="small">{contacts[1].email}</a><br />
                  <a href={telHref(contacts[1].phone)} className="small">{contacts[1].phone}</a>
                </li>
                <li><Link className="small footer-all" href="/contact">All contacts →</Link></li>
              </ul>
              <div className="socials">
                <a href={social.linkedin} target="_blank" rel="noopener" aria-label="Nepal Wood Expo on LinkedIn"><Icon name="linkedin" /></a>
                <a href={waHref(whatsappDefault)} target="_blank" rel="noopener" aria-label="Chat with the Nepal secretariat on WhatsApp"><Icon name="whatsapp" /></a>
              </div>
            </div>
          </div>

          <div className="footer-bottom">
            <span>© {year} Nepal Wood International Expo. Organised by Futurex Trade Fair and Events and Media Space Solutions.</span>
            <nav aria-label="Legal">
              <Link href="/privacy-policy">Privacy policy</Link>
              <button type="button" data-cookie-settings>Cookie settings</button>
              <Link href="/contact">Contact</Link>
            </nav>
          </div>
        </div>
      </footer>

      <div className="action-bar" data-action-bar>
        <Link className="btn btn--copper" href="/exhibitor-registration">Book a stand</Link>
        <Link className="btn btn--ghost btn--on-dark" href="/visitor-registration">Register free</Link>
        <a className="action-bar__call" href={waHref(whatsappDefault)} target="_blank" rel="noopener" aria-label="WhatsApp the Nepal secretariat"><Icon name="whatsapp" /></a>
      </div>
      <a className="wa-float" href={waHref(whatsappDefault)} target="_blank" rel="noopener" aria-label="Chat on WhatsApp"><Icon name="whatsapp" /><span>Chat with us</span></a>
    </>
  );
}
