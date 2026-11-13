import Link from 'next/link';
import Image from 'next/image';
import Icon from '@/components/Icon';
import JsonLd from '@/components/JsonLd';
import { PageHero, SectionHead, StatStrip, FeatureGrid, CtaBand, PartnerWall } from '@/components/blocks';
import { pageMeta, graph, breadcrumbNode, eventNode } from '@/lib/seo';
import { event, stats } from '@/lib/site';
import { zones } from '@/lib/content';
import heroImg from '@/assets/photos/machinery-hall.jpg';
import sideImg from '@/assets/gallery/expo-34.jpg';

export const metadata = pageMeta({
  title: 'About the Expo | Nepal’s Wood & Furniture Trade Show | Nepal Wood',
  description: 'Nepal’s specialised B2B show for plywood, laminates, woodworking machinery, furniture technology and tools. 12th edition: 28–31 Jan 2027, Kathmandu.',
  path: '/about-show',
});

const pillars = [
  { icon: 'saw', t: 'Machinery & technology', d: 'Live demonstrations of CNC routers, edge banders, panel saws, saw-mill lines and automation, the technology moving Nepal’s workshops to factories.' },
  { icon: 'layers', t: 'Materials & supplies', d: 'Plywood, MDF, laminates, veneers, hardwood and softwood, adhesives, coatings and hardware from domestic mills and international brands.' },
  { icon: 'handshake', t: 'Trade & networking', d: 'Architects, interior designers, factory owners, dealers and importers meet suppliers face to face, and deals are done on the floor.' },
];

export default function AboutShow() {
  const crumbs = [{ name: 'About the expo', path: '/about-show' }];
  return (
    <>
      <JsonLd data={graph(breadcrumbNode(crumbs), eventNode())} />
      <PageHero seed={14} eyebrow={`${event.edition} edition · ${event.datesLabel}`} title={<>Nepal’s largest wood & furniture <em>industry platform.</em></>} lead="Twelve editions of bringing machinery makers, material suppliers and the buyers of Nepal’s wood industry together under one roof." crumbs={crumbs} image={heroImg}>
        <Link className="btn btn--copper" href="/exhibitor-registration">Book a stand<Icon name="arrow" className="arrow" /></Link>
        <Link className="btn btn--ghost" href="/visitor-registration">Register to visit</Link>
      </PageHero>

      <section className="section">
        <div className="container split">
          <div>
            <p className="eyebrow" data-reveal>Empowering the ecosystem</p>
            <h2 className="h-lg" data-reveal>From the saw mill to the <em>showroom.</em></h2>
            <div className="prose" data-reveal>
              <p>Nepal Wood International Expo is a highly specialised trade show for the wood, woodworking, furniture and interior sectors. It is a meeting ground for manufacturers, importers, traders, distributors, converters and end-users, and the launch pad for new products and technology in Nepal.</p>
              <p>The 12th edition in 2027 is the first to run for four days. It is set to welcome 250+ brands from Nepal, India, China, Malaysia, Germany, Taiwan and beyond, across {stats.areaSqft.toLocaleString('en-US')}+ sq ft at {event.venue.full}, Kathmandu. Hometex Nepal, the Home Textile & Home Decor Exhibition, runs alongside it.</p>
              <p>The show is jointly organised by <Link href="/about-organizers">Futurex Trade Fair and Events and Media Space Solutions</Link>, and supported by Nepal’s plywood, forestry, interior-design and wood-technology associations.</p>
            </div>
          </div>
          <div className="split__media split__media--tall" data-reveal><Image src={sideImg} alt="Wall panels and veneer samples at an exhibitor stand" fill sizes="(max-width: 900px) 100vw, 45vw" /></div>
        </div>
      </section>

      <section className="section section--cream">
        <div className="container">
          <SectionHead eyebrow="Three pillars" title={<>What defines <em>Nepal Wood.</em></>} />
          <FeatureGrid items={pillars} />
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SectionHead split eyebrow="Track record" title={<>Results from <em>recent editions.</em></>} lead="Figures as reported by the organiser in the 10th and 11th edition post-show reports, and projections for 2027." />
          <StatStrip items={[
            { v: stats.lastEditionVisitors, suffix: '+', label: 'Trade visitors at the 11th edition (Dec 2025)' },
            { v: stats.seniorManagementPct, suffix: '%', label: 'Visitors in senior management roles' },
            { v: stats.exhibitorSatisfactionPct, suffix: '%', decimals: 1, label: 'Exhibitors satisfied with the organiser (organiser survey)' },
            { v: stats.reconfirmationPct, suffix: '%', label: 'Re-confirmation rate from 11th edition exhibitors' },
          ]} note="Source: organiser post-show reports and the 2027 brochure." />
        </div>
      </section>

      <section className="section section--dark">
        <div className="container">
          <SectionHead split eyebrow="Exhibitor profile" title={<>Five zones, <em>one industry.</em></>} lead="The show floor is organised into five product zones." />
          <div className="cards">
            {zones.map((z) => (
              <Link className="card card--dark-link" key={z.slug} href={`/exhibitor-profile/${z.slug}`} data-reveal>
                <p className="card__kicker">Zone {z.no}</p>
                <h3 className="h-sm">{z.title}</h3>
                <p>{z.short}</p>
                <span className="link-arrow">Explore<Icon name="arrow" /></span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SectionHead center eyebrow="Partners" title={<>Supported by <em>the industry.</em></>} />
          <PartnerWall />
        </div>
      </section>

      <CtaBand />
    </>
  );
}
