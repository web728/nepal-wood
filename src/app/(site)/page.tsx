import Link from 'next/link';
import Image from 'next/image';
import Icon from '@/components/Icon';
import TreeRings from '@/components/TreeRings';
import Countdown from '@/components/Countdown';
import JsonLd from '@/components/JsonLd';
import { SectionHead, PartnerWall, Testimonials } from '@/components/blocks';
import { event, headlineStats, organisers, SITE_URL } from '@/lib/site';
import { zones, whyExhibit } from '@/lib/content';
import { pageMeta, graph, organizationNodes, eventNode } from '@/lib/seo';
import { getTestimonials } from '@/lib/public-data';
import '../home.css';

import heroImg from '@/assets/photos/hero-machinery-aisle.jpg';
import exhibitImg from '@/assets/photos/demo-laser-cutter.jpg';
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
  description:
    '12th Nepal Wood International Expo, 28–31 January 2027, Bhrikuti Mandap, Kathmandu. Plywood, laminates, woodworking machinery, furniture tech & tools.',
  path: '/',
});

const storyImgs = [
  { img: meetingImg, alt: 'Exhibitor discussing business with trade visitors' },
  { img: exhibitImg, alt: 'Visitors at a laser-cutting machine demonstration' },
  { img: hallImg, alt: 'Machinery aisle at the expo' },
  { img: flooringImg, alt: 'Visitors exploring flooring and panels' },
  { img: roadshowImg, alt: 'Nepal Wood promotional roadshow' },
  { img: audienceImg, alt: 'Audience attending a Nepal Wood seminar' },
];

const galleryRows = [
  [g1, ribbonImg, g2, crowdImg, g3, seminarImg],
  [g4, exhibitImg, g5, hallImg, g6, g7, g8],
];

export default async function Home() {
  const testimonials = await getTestimonials(6);

  return (
    <>
      <JsonLd
        data={graph(
          ...organizationNodes(),
          {
            '@type': 'WebSite',
            '@id': `${SITE_URL}/#website`,
            url: `${SITE_URL}/`,
            name: 'Nepal Wood International Expo',
            inLanguage: 'en',
          },
          eventNode(),
        )}
      />

      <section className="hero on-dark" aria-labelledby="hero-title">
        <div className="hero__media" aria-hidden="true">
          <Image
            src={heroImg}
            alt=""
            fill
            priority
            placeholder="blur"
            sizes="100vw"
            className="hero__img"
          />
        </div>
        <TreeRings className="hero__rings" rings={20} seed={12} cracks={3} />
        <div className="container hero__inner">
          <div className="hero__copy">
            <p className="hero__chip"><span className="dot" />12th Edition · First four-day show</p>
            <h1 id="hero-title" className="hero__title">
              <span className="hero__kicker">Nepal Wood International Expo 2027</span>
              <span className="h-display hero__headline">
                Where Nepal’s wood industry <em>does business.</em>
              </span>
            </h1>
            <p className="lead hero__lead">
              Plywood, laminates, woodworking machinery, furniture technology, tools and raw
              materials: four days, one venue, and the buyers who matter.
            </p>
            <div className="hero__ctas">
              <Link className="btn btn--copper" href="/exhibitor-registration">
                Book a stand <Icon name="arrow" className="arrow" />
              </Link>
              <Link className="btn btn--ghost" href="/visitor-registration">
                Register to visit, free
              </Link>
            </div>
            <Link className="hero__brochure" href="/downloads/event-brochure">
              <Icon name="download" />Download the 2027 brochure
            </Link>
          </div>
          <aside className="hero__panel" aria-label="Event dates and venue">
            <div className="hero__date">
              <span className="hero__days tnum">28<span>–</span>31</span>
              <span className="hero__month">January<br />2027</span>
            </div>
            <p className="hero__venue">
              <Icon name="pin" />
              {event.venue.full}, {event.venue.city}, {event.venue.country}
            </p>
            <Countdown />
          </aside>
        </div>
        <div className="container">
          <dl className="hero__stats">
            {headlineStats.map((stat) => (
              <div key={stat.label}>
                <dt className="hero__stat-label">{stat.label}</dt>
                <dd className="hero__stat-value tnum">
                  {stat.value.toLocaleString('en-US')}{stat.suffix}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="section section--cream about" aria-labelledby="about-title">
        <div className="container about__grid">
          <div className="about__side">
            <p className="eyebrow" data-reveal>The expo</p>
            <div className="about__seal" data-reveal aria-label="12 editions">
              <TreeRings rings={12} seed={3} cracks={0} className="about__seal-rings" />
              <span className="about__seal-num">12</span>
              <span className="about__seal-txt">editions</span>
            </div>
          </div>
          <div className="about__main">
            <h2 id="about-title" className="h-lg" data-reveal>
              Nepal’s specialised trade show for the <em>wood and furniture</em> industry.
            </h2>
            <div className="about__cols">
              <p data-reveal>
                Nepal Wood International Expo brings manufacturers, importers, traders,
                distributors, converters and end-users together to discover products,
                compare suppliers and close deals.
              </p>
              <p data-reveal>
                The 12th edition runs for four days, with exhibitors expected from Nepal,
                India, China, Malaysia, Germany, Taiwan and beyond. Organised by Futurex
                Trade Fair and Events Pvt. Ltd. and Media Space Solutions Pvt. Ltd.
              </p>
            </div>
            <div className="about__orgs" data-reveal>
              <span className="about__orgs-label">Organised by</span>
              {organisers.map((org) => (
                <img key={org.id} src={org.logo} alt={org.name} width={150} height={32} loading="lazy" />
              ))}
              <Link className="link-arrow" href="/about-show">
                More about the expo <Icon name="arrow" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="section cats" aria-labelledby="cats-title">
        <div className="container">
          <SectionHead
            split
            eyebrow="Exhibitor profile"
            id="cats-title"
            title={<>Everything between the log <em>and the living room.</em></>}
            lead="Five product zones, from raw boards and machines to finished interiors. The list is a guide, not a limit."
          />
          <div className="cats__rail" data-accordion>
            {zones.map((zone, index) => (
              <Link
                href={`/exhibitor-profile/${zone.slug}`}
                className={`cat${index === 0 ? ' is-open' : ''}`}
                data-cat
                key={zone.slug}
              >
                <Image
                  src={zone.img}
                  alt={zone.alt}
                  fill
                  sizes="(max-width: 700px) 100vw, (max-width: 1100px) 50vw, 40vw"
                  className="cat__img"
                />
                <span className="cat__shade" />
                <span className="cat__body">
                  <span className="cat__title">{zone.title}</span>
                  <span className="cat__items">
                    {zone.items.slice(0, 4).map((item) => <span key={item}>{item}</span>)}
                  </span>
                  <span className="cat__more">Explore the zone <Icon name="arrow" /></span>
                </span>
              </Link>
            ))}
          </div>
          <div className="cats__foot" data-reveal>
            <Link className="btn" href="/exhibitor-registration">
              Book a stand in your zone <Icon name="arrow" className="arrow" />
            </Link>
            <Link className="link-arrow" href="/exhibitor-profile">
              See the full exhibitor profile <Icon name="arrow" />
            </Link>
          </div>
        </div>
      </section>

      <section className="section section--cream why" aria-labelledby="why-title" data-story>
        <div className="container why__grid">
          <div className="why__content">
            <p className="eyebrow" data-reveal>Why exhibit</p>
            <h2 id="why-title" className="h-xl" data-reveal>
              Your gateway to one of the region’s <em>fastest-growing markets.</em>
            </h2>
            <ol className="reasons">
              {whyExhibit.map((reason, index) => (
                <li className="reason" data-step={index} key={reason.t}>
                  <span className="reason__no tnum">{String(index + 1).padStart(2, '0')}</span>
                  <div>
                    <h3 className="h-sm">{reason.t}</h3>
                    <p>{reason.d}</p>
                  </div>
                  <div className="reason__img-mobile">
                    <Image
                      src={storyImgs[index % storyImgs.length].img}
                      alt={storyImgs[index % storyImgs.length].alt}
                      sizes="(max-width: 700px) 90vw, 45vw"
                    />
                  </div>
                </li>
              ))}
            </ol>
            <div className="why__ctas">
              <Link className="btn" href="/exhibitor-registration">
                Book a stand <Icon name="arrow" className="arrow" />
              </Link>
              <Link className="btn btn--ghost" href="/why-exhibit">All the reasons</Link>
            </div>
          </div>
          <div className="why__media" aria-hidden="true">
            <div className="why__sticky">
              {storyImgs.map((story, index) => (
                <div
                  className={`why__frame${index === 0 ? ' is-active' : ''}`}
                  data-frame={index}
                  key={index}
                >
                  <Image
                    src={story.img}
                    alt=""
                    fill
                    sizes="(max-width: 900px) 90vw, 42vw"
                  />
                </div>
              ))}
              <div className="why__progress"><span data-story-progress /></div>
            </div>
          </div>
        </div>
      </section>

      <section className="gallery-band section--darkest" aria-labelledby="gal-title">
        <div className="container gallery-band__head">
          <p className="eyebrow">Glimpses</p>
          <h2 id="gal-title" className="h-lg">Inside past editions</h2>
          <Link className="link-arrow" href="/gallery">
            Open the gallery <Icon name="arrow" />
          </Link>
        </div>
        {galleryRows.map((row, rowIndex) => (
          <div
            className={`marquee${rowIndex ? ' marquee--reverse' : ''}`}
            aria-hidden="true"
            key={rowIndex}
          >
            {[0, 1].map((copy) => (
              <div className="marquee__track" key={copy}>
                {row.map((img, index) => (
                  <Image
                    key={index}
                    src={img}
                    alt=""
                    sizes="(max-width: 700px) 210px, 300px"
                    className="marquee__img"
                  />
                ))}
              </div>
            ))}
          </div>
        ))}
      </section>

      <Testimonials items={testimonials} />

      <section className="section partners" aria-labelledby="partners-title">
        <div className="container">
          <SectionHead
            center
            eyebrow="Partners"
            id="partners-title"
            title={<>Backed by <em>the industry.</em></>}
          />
          <PartnerWall />
        </div>
      </section>

      <section className="final on-dark" aria-labelledby="final-title">
        <div className="final__bg" aria-hidden="true">
          <Image src={textureImg} alt="" fill sizes="100vw" />
        </div>
        <TreeRings className="final__rings" rings={18} seed={5} cracks={2} />
        <div className="container final__inner">
          <p className="eyebrow" data-reveal>12th edition · {event.datesLabel}</p>
          <h2 id="final-title" className="h-display" data-reveal>
            Mark your <em>presence.</em>
          </h2>
          <p className="lead" data-reveal>
            Stalls for the 12th edition are being allotted now. Tell us what you want to show,
            and the team will come back with availability and options.
          </p>
          <div className="final__ctas" data-reveal>
            <Link className="btn btn--copper" href="/exhibitor-registration">
              Book a stand <Icon name="arrow" className="arrow" />
            </Link>
            <Link className="btn btn--ghost" href="/visitor-registration">
              Register to visit
            </Link>
          </div>
          <div className="final__count" data-reveal><Countdown compact /></div>
        </div>
      </section>
    </>
  );
}
