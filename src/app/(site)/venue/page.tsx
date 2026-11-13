import Link from 'next/link';
import Icon from '@/components/Icon';
import JsonLd from '@/components/JsonLd';
import MapEmbed from '@/components/MapEmbed';
import { PageHero, SectionHead, CtaBand } from '@/components/blocks';
import { pageMeta, graph, breadcrumbNode, placeNode, eventNode } from '@/lib/seo';
import { event } from '@/lib/site';
import heroImg from '@/assets/photos/ribbon-cutting.jpg';
import mapCover from '@/assets/gallery/expo-54.jpg';

export const metadata = pageMeta({
  title: 'Plan Your Visit | Bhrikuti Mandap, Hours & Travel | Nepal Wood 2027',
  description: 'Nepal Wood International Expo 2027 venue: Bhrikuti Mandap Exhibition Complex, Pradarshani Marg, Kathmandu. Dates, opening hours, how to get there, parking and entry.',
  path: '/venue',
});

const days = ['Thu 28 Jan', 'Fri 29 Jan', 'Sat 30 Jan', 'Sun 31 Jan'];

export default function Venue() {
  const crumbs = [{ name: 'Plan your visit', path: '/venue' }];
  return (
    <>
      <JsonLd data={graph(breadcrumbNode(crumbs), placeNode(), eventNode())} />
      <PageHero seed={131} eyebrow="Plan your visit" title={<>See you at <em>Bhrikuti Mandap.</em></>} lead="Nepal’s best-known exhibition ground, in the heart of Kathmandu on Pradarshani Marg." crumbs={crumbs} image={heroImg}>
        <a className="btn btn--copper" href={event.venue.mapsUrl} target="_blank" rel="noopener">Open in Google Maps<Icon name="arrow-up-right" className="arrow" /></a>
        <Link className="btn btn--ghost" href="/visitor-registration">Get your badge</Link>
      </PageHero>

      <section className="section">
        <div className="container">
          <div className="facts">
            <div className="fact" data-reveal><Icon name="calendar" /><p className="card__kicker">Dates</p><strong>{event.datesLabel}</strong><span>{event.weekdays}, 4 days</span></div>
            <div className="fact" data-reveal><Icon name="clock" /><p className="card__kicker">Hours</p><strong>{event.hours.label}</strong><span>Daily{event.hours.tentative ? ', tentative; final timings by email' : ''}</span></div>
            <div className="fact" data-reveal><Icon name="pin" /><p className="card__kicker">Venue</p><strong>{event.venue.full}</strong><span>{event.venue.street}, {event.venue.city}</span></div>
            <div className="fact" data-reveal><Icon name="ticket" /><p className="card__kicker">Entry</p><strong>Free for trade visitors</strong><span>Register online for a QR badge</span></div>
          </div>
          <table className="hours">
            <caption className="sr-only">Daily opening hours</caption>
            <tbody>{days.map((d) => <tr key={d}><th scope="row">{d}</th><td>{event.hours.label}</td></tr>)}</tbody>
          </table>
        </div>
      </section>

      <section className="section section--cream" id="travel">
        <div className="container split split--top">
          <div>
            <SectionHead eyebrow="Getting there" title={<>How to reach <em>the expo.</em></>} />
            <div className="travel">
              <div className="travel__item" data-reveal><Icon name="plane" /><div><h3 className="h-sm">By air</h3><p>Tribhuvan International Airport (KTM) is about 5.5 km from the venue. Airport taxis and hotel transfers take 20–30 minutes, depending on traffic.</p></div></div>
              <div className="travel__item" data-reveal><Icon name="car" /><div><h3 className="h-sm">Taxi & ride apps</h3><p>Use licensed taxis or ride apps such as Pathao and inDrive. Set your destination to “Bhrikuti Mandap Exhibition Hall, Pradarshani Marg”.</p></div></div>
              <div className="travel__item" data-reveal><Icon name="bus" /><div><h3 className="h-sm">Public transport</h3><p>Bhrikuti Mandap is a major central landmark. Microbuses and city buses run via Ratna Park and Exhibition Road.</p></div></div>
              <div className="travel__item" data-reveal><Icon name="building" /><div><h3 className="h-sm">Where to stay</h3><p>The nearest hotel districts are Durbar Marg, Thamel, Tripureshwor and Kamaladi, all within a short drive. International exhibitors can ask our India & international desk for hotel suggestions.</p></div></div>
            </div>
          </div>
          <MapEmbed cover={mapCover} />
        </div>
      </section>

      <section className="section">
        <div className="container container--narrow">
          <SectionHead eyebrow="On the day" title={<>Before you <em>leave.</em></>} />
          <ul className="check-list">
            <li><Icon name="badge" />Have your QR badge ready on your phone, or printed.</li>
            <li><Icon name="check" />Carry a business card, company ID or photo ID.</li>
            <li><Icon name="check" />Bring drawings or specifications if you plan to discuss a project with exhibitors.</li>
            <li><Icon name="check" />Kathmandu is cold in late January: mornings are around 3–8 °C, so dress in layers.</li>
            <li><Icon name="check" />Parking is around the exhibition complex. Arrive early on Saturday and Sunday, which are the busiest days.</li>
          </ul>
        </div>
      </section>
      <CtaBand title={<>Skip the <em>queue.</em></>} lead="Pre-registered visitors go straight to the express entry counter." primary={{ href: '/visitor-registration', label: 'Register free' }} secondary={{ href: '/faq', label: 'Visitor FAQ' }} />
    </>
  );
}
