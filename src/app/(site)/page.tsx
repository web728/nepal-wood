import Link from 'next/link';
import Image from 'next/image';
import Icon from '@/components/Icon';
import TreeRings from '@/components/TreeRings';
import ExpoCountdown from '@/components/ExpoCountdown';
import HomeMotion from '@/components/HomeMotion';
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
import ribbonImg from '@/assets/photos/ribbon-cutting.jpg';
import seminarImg from '@/assets/photos/seminar-stage.jpg';
import crowdImg from '@/assets/photos/visitors-crowd.jpg';
import textureImg from '@/assets/photos/wood-texture.jpg';
import g1 from '@/assets/gallery/expo-29.jpg';
import g2 from '@/assets/gallery/expo-34.jpg';
import g3 from '@/assets/gallery/expo-19.jpg';
import g4 from '@/assets/gallery/expo-53.jpg';

export const revalidate = 300;

export const metadata = pageMeta({
  title: 'Nepal Wood International Expo 2027 | 28–31 Jan, Kathmandu',
  description:
    '12th Nepal Wood International Expo, 28–31 January 2027, Bhrikuti Mandap, Kathmandu. Plywood, laminates, woodworking machinery, furniture tech & tools.',
  path: '/',
});

// One calm row of photos.
const galleryImages = [g1, ribbonImg, g2, crowdImg, g3, seminarImg, g4, exhibitImg];

// "Add to calendar" file, built from the show dates and venue already on the site.
const calendarHref =
  'data:text/calendar;charset=utf-8,' +
  encodeURIComponent(
    [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Nepal Wood International Expo//EN',
      'BEGIN:VEVENT',
      'UID:nepal-wood-2027@nepalwood.com.np',
      'DTSTAMP:20261121T000000Z',
      'DTSTART;VALUE=DATE:20270128',
      'DTEND;VALUE=DATE:20270201',
      'SUMMARY:Nepal Wood International Expo 2027',
      'LOCATION:Bhrikuti Mandap Exhibition Complex\\, Kathmandu\\, Nepal',
      'DESCRIPTION:12th Nepal Wood International Expo. https://nepalwood.com.np',
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n'),
  );

export default async function Home() {
  const testimonials = await getTestimonials(3);

  return (
    <>
      <HomeMotion />
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

      {/* HERO */}
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

        <div className="container hero__main">
          <div className="hero__copy">
            <h1 id="hero-title" className="hero__title">
              <span className="hero__kicker">12th Edition · Nepal Wood International Expo 2027</span>
              <span className="h-display hero__headline">
                Where Nepal’s wood industry <em>does business.</em>
              </span>
            </h1>
            <p className="lead hero__lead">
              Plywood, laminates, machinery, furniture technology and tools. Four days, one
              venue, the buyers who matter.
            </p>
            <ul className="hero__meta" aria-label="Event dates and venue">
              <li className="hero__meta-date tnum">{event.datesLabel}</li>
              <li>
                <Icon name="pin" />
                {event.venue.name}, {event.venue.city}
              </li>
            </ul>
            <div className="hero__ctas">
              <Link className="btn btn--copper" href="/exhibitor-registration">
                Book a stand <Icon name="arrow" className="arrow" />
              </Link>
              <Link className="btn btn--ghost" href="/visitor-registration">
                Register to visit, free
              </Link>
            </div>
          </div>
        </div>

        <div className="container">
          <div className="hero__foot">
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
        </div>
      </section>

      {/* ABOUT */}
      <section className="section section--cream about" aria-labelledby="about-title">
        <div className="container about__grid">
          <div className="about__side" data-fx="0">
            <p className="eyebrow">The expo</p>
            <div className="about__seal" aria-label="12 editions">
              <TreeRings rings={12} seed={3} cracks={0} className="about__seal-rings" />
              <span className="about__seal-num">12</span>
              <span className="about__seal-txt">editions</span>
            </div>
          </div>
          <div className="about__main">
            <h2 id="about-title" className="h-lg" data-fx="1">
              Nepal’s specialised trade show for the <em>wood and furniture</em> industry.
            </h2>
            <p className="about__text" data-fx="2">
              Manufacturers, importers, traders and end-users meet face to face to discover
              products, compare suppliers and close deals.
            </p>
            <div className="about__orgs" data-fx="3">
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

      {/* COUNTDOWN */}
      <ExpoCountdown dates={event.datesLabel} venue={`${event.venue.name}, ${event.venue.city}`} />

      {/* TWO WAYS IN */}
      <section className="section paths" aria-labelledby="paths-title">
        <div className="container">
          <div data-fx="0">
            <SectionHead
              center
              eyebrow="Be part of it"
              id="paths-title"
              title={<>One show, <em>two ways in.</em></>}
            />
          </div>
          <div className="paths__grid">
            <article className="path" data-fx="1">
              <div className="path__media">
                <Image
                  src={meetingImg}
                  alt="Exhibitor discussing business with trade visitors"
                  fill
                  sizes="(max-width: 760px) 100vw, 50vw"
                />
              </div>
              <div className="path__body">
                <p className="path__tag">For exhibitors</p>
                <h3 className="h-sm">Meet the buyers who sign the orders.</h3>
                <p>Show your machines live to dealers, importers and decision-makers.</p>
                <div className="path__actions">
                  <Link className="btn" href="/exhibitor-registration">
                    Book a stand <Icon name="arrow" className="arrow" />
                  </Link>
                </div>
              </div>
            </article>

            <article className="path" data-fx="2">
              <div className="path__media">
                <Image
                  src={crowdImg}
                  alt="Trade visitors at the expo"
                  fill
                  sizes="(max-width: 760px) 100vw, 50vw"
                />
              </div>
              <div className="path__body">
                <p className="path__tag">For visitors</p>
                <h3 className="h-sm">Find suppliers and close deals.</h3>
                <p>Free entry for registered trade visitors.</p>
                <div className="path__actions">
                  <Link className="btn" href="/visitor-registration">
                    Register to visit, free <Icon name="arrow" className="arrow" />
                  </Link>
                </div>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* EXHIBITOR ZONES */}
      <section className="section section--cream cats" aria-labelledby="cats-title">
        <div className="container">
          <div data-fx="0">
            <SectionHead
              split
              eyebrow="Exhibitor profile"
              id="cats-title"
              title={<>Everything between the log <em>and the living room.</em></>}
              lead="Five product zones, from raw boards and machines to finished interiors."
            />
          </div>
          <div className="cats__rail" data-accordion data-fx="1">
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
                  <span className="cat__more">Explore the zone <Icon name="arrow" /></span>
                </span>
              </Link>
            ))}
          </div>
          <div className="cats__foot" data-fx="2">
            <Link className="link-arrow" href="/exhibitor-profile">
              See the full exhibitor profile <Icon name="arrow" />
            </Link>
          </div>
        </div>
      </section>

      {/* WHY EXHIBIT: three reasons only */}
      <section className="section why" aria-labelledby="why-title">
        <div className="container">
          <div data-fx="0">
            <SectionHead
              split
              eyebrow="Why exhibit"
              id="why-title"
              title={<>Your gateway to one of the region’s <em>fastest-growing markets.</em></>}
            />
          </div>
          <ol className="reasons">
            {whyExhibit.slice(0, 3).map((reason, index) => (
              <li className="reason" data-fx={String(index + 1)} key={reason.t}>
               
                <h3 className="h-sm">{reason.t}</h3>
                <p>{reason.d}</p>
              </li>
            ))}
          </ol>
          <div className="why__ctas" data-fx="2">
            <Link className="btn" href="/exhibitor-registration">
              Book a stand <Icon name="arrow" className="arrow" />
            </Link>
            <Link className="link-arrow" href="/why-exhibit">
              All the reasons <Icon name="arrow" />
            </Link>
          </div>
        </div>
      </section>

      {/* GALLERY */}
      <section className="gallery-band section--darkest" aria-labelledby="gal-title">
        <div className="container gallery-band__head" data-fx="0">
          <p className="eyebrow">Glimpses</p>
          <h2 id="gal-title" className="h-lg">Inside past editions</h2>
          <Link className="link-arrow" href="/gallery">
            Open the gallery <Icon name="arrow" />
          </Link>
        </div>
        <div className="marquee" aria-hidden="true">
          {[0, 1].map((copy) => (
            <div className="marquee__track" key={copy}>
              {galleryImages.map((img, index) => (
                <Image
                  key={index}
                  src={img}
                  alt=""
                  sizes="(max-width: 700px) 235px, 365px"
                  className="marquee__img"
                />
              ))}
            </div>
          ))}
        </div>
      </section>

      <Testimonials items={testimonials} />

      {/* PARTNERS */}
      <section className="section partners" aria-labelledby="partners-title">
        <div className="container">
          <div data-fx="0">
            <SectionHead
              center
              eyebrow="Partners"
              id="partners-title"
              title={<>Backed by <em>the industry.</em></>}
            />
          </div>
          <div data-fx="1">
            <PartnerWall />
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="final on-dark" aria-labelledby="final-title">
        <div className="final__bg" aria-hidden="true">
          <Image src={textureImg} alt="" fill sizes="100vw" />
        </div>
        <TreeRings className="final__rings" rings={18} seed={5} cracks={2} />
        <div className="container final__inner">
          <p className="eyebrow" data-fx="0">12th edition · {event.datesLabel}</p>
          <h2 id="final-title" className="h-display" data-fx="1">
            Mark your <em>presence.</em>
          </h2>
          <p className="lead" data-fx="2">
            Stalls are being allotted now. Tell us what you want to show and we will come back
            with availability and options.
          </p>
          <div className="final__ctas" data-fx="3">
            <Link className="btn btn--copper" href="/exhibitor-registration">
              Book a stand <Icon name="arrow" className="arrow" />
            </Link>
            <Link className="btn btn--ghost" href="/visitor-registration">
              Register to visit
            </Link>
          </div>
          <div className="final__links" data-fx="3">
            <Link className="final__link" href="/downloads/event-brochure">
              <Icon name="download" />Download the 2027 brochure
            </Link>
            <a className="final__link" href={calendarHref} download="nepal-wood-expo-2027.ics">
              <Icon name="download" />Add to calendar
            </a>
          </div>
        </div>
      </section>
    </>
  );
}