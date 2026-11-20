import Link from 'next/link';
import Image from 'next/image';
import Icon from '@/components/Icon';
import JsonLd from '@/components/JsonLd';
import TreeRings from '@/components/TreeRings';
import {
  PageHero,
  SectionHead,
  StatStrip,
  FeatureGrid,
  CtaBand,
} from '@/components/blocks';
import { editions } from '@/lib/content';
import { event, stats } from '@/lib/site';
import { pageMeta, graph, breadcrumbNode, eventNode } from '@/lib/seo';

import heroImg from '@/assets/photos/machinery-hall.jpg';
import sideImg from '@/assets/gallery/expo-34.jpg';
import './about-show.css';

export const metadata = pageMeta({
  title: 'About the Expo | Nepal’s Wood & Furniture Trade Show | Nepal Wood',
  description:
    'Nepal’s specialised B2B show for plywood, laminates, woodworking machinery, furniture technology and tools. 12th edition: 28–31 Jan 2027, Kathmandu.',
  path: '/about-show',
});

const crumbs = [{ name: 'About the expo', path: '/about-show' }];

const pillars = [
  {
    icon: 'saw',
    t: 'Machinery & technology',
    d: 'Discover CNC routers, edge banders, panel saws, sawmill lines and automation through live demonstrations.',
  },
  {
    icon: 'layers',
    t: 'Materials & supplies',
    d: 'Explore plywood, MDF, laminates, veneers, timber, adhesives, coatings and hardware from leading suppliers.',
  },
  {
    icon: 'handshake',
    t: 'Trade & networking',
    d: 'Connect face to face with factory owners, architects, interior designers, dealers and importers.',
  },
];

export default function AboutShow() {
  return (
    <main className="about-page">
      <JsonLd data={graph(breadcrumbNode(crumbs), eventNode())} />

      <PageHero
        seed={14}
        eyebrow={`${event.edition} edition · ${event.datesLabel}`}
        title={<>Nepal’s wood & furniture <em>industry platform.</em></>}
        lead="Twelve editions connecting machinery makers, material suppliers and buyers across Nepal’s wood industry."
        crumbs={crumbs}
        image={heroImg}
      >
        <Link className="btn btn--copper" href="/exhibitor-registration">
          Book a stand <Icon name="arrow" className="arrow" />
        </Link>
        <Link className="btn btn--ghost" href="/visitor-registration">
          Register to visit
        </Link>
      </PageHero>

      <section className="section about-intro" aria-labelledby="about-intro-title">
        <div className="container about-intro__grid">
          <div className="about-intro__copy">
            <p className="eyebrow" data-reveal>Empowering the ecosystem</p>
            <h2 id="about-intro-title" className="h-lg" data-reveal>
              From the sawmill to the <em>showroom.</em>
            </h2>
            <div className="prose about-intro__prose" data-reveal>
              <p>
                Nepal Wood International Expo is a specialised trade show for
                woodworking, furniture and interiors. Manufacturers, importers,
                distributors and buyers meet to discover products, explore
                technology and build business relationships.
              </p>
              <p>
                The 12th edition in 2027 is the first four-day show. It is set
                to welcome 250+ brands from Nepal and international markets
                across {stats.areaSqft.toLocaleString('en-US')}+ sq ft at{' '}
                {event.venue.full}, Kathmandu. Hometex Nepal runs alongside it.
              </p>
              <p>
                Jointly organised by{' '}
                <Link href="/about-organizers">
                  Futurex Trade Fair and Events Pvt. Ltd. and Media Space
                  Solutions Pvt. Ltd.
                </Link>
                , with support from Nepal’s industry associations.
              </p>
            </div>
          </div>
          <div className="about-intro__media" data-reveal>
            <Image
              src={sideImg}
              alt="Exhibitor stand displaying wall panels and veneer samples"
              fill
              placeholder="blur"
              sizes="(max-width: 800px) 100vw, 42vw"
            />
          </div>
        </div>
      </section>

      <section className="section section--cream about-pillars" aria-labelledby="pillars-title">
        <div className="container">
          <SectionHead
            id="pillars-title"
            eyebrow="Three pillars"
            title={<>What defines <em>Nepal Wood.</em></>}
          />
          <FeatureGrid items={pillars} />
        </div>
      </section>

      {/* Dedicated CSS: this section no longer depends on home.css. */}
      <section
        className="section section--dark about-journey rings"
        aria-labelledby="rings-title"
        data-rings-section
      >
        <div className="container rings__grid">
          <div className="rings__visual" aria-hidden="true">
            <div className="rings__sticky">
              <TreeRings
                rings={12}
                seed={21}
                cracks={2}
                wobble={1.2}
                indexed
                className="rings__svg"
              />
              <div className="rings__readout">
                <span data-rings-ed>12th</span>
                <small data-rings-year>2027</small>
              </div>
            </div>
          </div>

          <div className="rings__content">
            <p className="eyebrow" data-reveal>Our journey</p>
            <h2 id="rings-title" className="h-xl" data-reveal>
              Twelve editions. <em>Twelve growth rings.</em>
            </h2>
            <p className="rings__intro" data-reveal>
              From early editions to a major industry gathering, each year
              marks another step forward. Explore the milestones of Nepal Wood.
            </p>

            <ol className="timeline">
              {editions.map((edition, index) => (
                <li
                  className={`timeline__item${edition.current ? ' is-current' : ''}`}
                  key={`${edition.ed}-${edition.year}`}
                  data-edition={index}
                  data-ed={edition.ed}
                  data-year={edition.year}
                >
                  <span className="timeline__ed">{edition.ed}</span>
                  <div className="timeline__details">
                    <p className="timeline__dates">{edition.dates}</p>
                   
                  </div>
                </li>
              ))}
            </ol>

            <Link className="link-arrow rings__link" href="/past-editions">
              Explore past editions & reports <Icon name="arrow" />
            </Link>
          </div>
        </div>
      </section>

      <section className="section about-record" aria-labelledby="record-title">
        <div className="container">
          <SectionHead
            split
            id="record-title"
            eyebrow="Track record"
            title={<>Results from <em>recent editions.</em></>}
            lead="Figures from organiser post-show reports, with relevant projections for the 2027 edition."
          />
          <StatStrip
            items={[
              {
                v: stats.lastEditionVisitors,
                suffix: '+',
                label: 'Trade visitors at previous edition',
              },
              {
                v: stats.seniorManagementPct,
                suffix: '%',
                label: 'Visitors in senior management roles',
              },
              {
                v: stats.exhibitorSatisfactionPct,
                suffix: '%',
                decimals: 1,
                label: 'Exhibitors satisfied with the organiser',
              },
              {
                v: stats.reconfirmationPct,
                suffix: '%',
                label: 'Reconfirmation rate of 11th edition exhibitors',
              },
            ]}
         
          />
        </div>
      </section>

    
    </main>
  );
}
