import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import PastConferenceGallery from "@/components/past-conferences/PastConferenceGallery";
import "./past-conferences.css";

export const metadata: Metadata = {
  title: "Past Conferences 2025 | Nepal Wood International Expo",
  description:
    "Explore the 2025 conference highlights from the 10th Nepal Wood International Expo in Kathmandu: Timber Transformation on 18 January and Interior Designers’ Day on 19 January.",
  alternates: { canonical: "/past-conferences" },
};

const root = "/past-conferences";
const facts = [
  ["Edition", "10th Nepal Wood Expo"],
  ["Conference Dates", "18 & 19 January 2025"],
  ["Venue", "Bhrikuti Mandap, Kathmandu"],
  ["Event Hours · Each Day", "10:00 AM – 6:00 PM"],
];
const tracks = [
  {
    num: "01 / TIMBER & WOODWORKING",
    title: "Timber Transformation",
    date: "18 January 2025",
    text: "A practical conversation on responsible timber plantation, product quality and efficient, technology-enabled woodworking.",
    target: "#day-one",
  },
  {
    num: "02 / INTERIOR DESIGN",
    title: "Interior Designers’ Day",
    date: "19 January 2025",
    text: "An exchange on emerging design trends, sustainable interiors, materials and spaces of the future.",
    target: "#day-two",
  },
];
const topicsOne = [
  "Scope and strategy of timber plantation in Nepal",
  "Role of quality control parameters in the modern era",
  "Process automation solutions — cost cutting in a precise manner",
  "Sustainable timber practices, technology and greener industrial development",
];
const topicsTwo = [
  "Latest trends and emerging ideas in interior design",
  "Sustainable approaches to planning and designing spaces",
  "Innovative materials, technologies and design solutions",
  "The role of wood and woodworking in interior applications",
];

export default function PastConferencesPage() {
  const archiveJsonLd = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: "Nepal Wood International Expo 2025 — Two-Day Conference Programme",
    startDate: "2025-01-18T10:00:00+05:45",
    endDate: "2025-01-19T18:00:00+05:45",
    eventStatus: "https://schema.org/EventCompleted",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    location: {
      "@type": "Place",
      name: "Bhrikuti Mandap Exhibition Hall",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Kathmandu",
        addressCountry: "NP",
      },
    },
    organizer: [
      { "@type": "Organization", name: "Futurex Trade Fair and Events" },
      { "@type": "Organization", name: "Media Space Solutions" },
    ],
    description:
      "Historical conference programme held alongside the 10th Nepal Wood International Expo 2025, covering timber transformation and interior design.",
  };
  return (
    <main className="pc25">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(archiveJsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <section className="pc25-hero">
        <div className="pc25-container">
          <nav className="pc25-breadcrumb" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span>›</span>
            <Link href="/conference">Conference</Link>
            <span>›</span>
            <span>Past Conferences</span>
          </nav>
          <div className="pc25-hero-grid">
            <div className="pc25-hero-copy">
              <span className="pc25-eyebrow">
                10th Edition · Official 2025 Archive
              </span>
              <h1>
                Ideas that shaped the future of <em>wood &amp; design.</em>
              </h1>
              <p>
                A documented look back at the two-day conference programme held
                during the 10th Nepal Wood International Expo: Timber
                Transformation on 18 January and Interior Designers’ Day on 19
                January.
              </p>
              <div className="pc25-actions">
                <a className="pc25-btn pc25-btn-solid" href="#overview">
                  Explore Conferences <span aria-hidden="true">↗</span>
                </a>
                <a className="pc25-btn pc25-btn-ghost" href="#gallery">
                  View Event Gallery <span aria-hidden="true">↘</span>
                </a>
              </div>
            </div>
            <div className="pc25-hero-media">
              <Image
                src={`${root}/hero-audience.jpg`}
                alt="Conference audience watching a design presentation at Nepal Wood Expo 2025"
                fill
                priority
                sizes="(max-width: 800px) 100vw, 48vw"
              />
              <div className="pc25-image-stamp">
                <strong>18–19 JAN 2025</strong>
                <span>Bhrikuti Mandap, Kathmandu</span>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="pc25-facts" aria-label="Conference facts">
        <div className="pc25-container pc25-facts-grid">
          {facts.map(([key, val]) => (
            <div className="pc25-fact" key={key}>
              <small>{key}</small>
              <strong>{val}</strong>
            </div>
          ))}
        </div>
      </section>
      <section className="pc25-context">
        <div className="pc25-container pc25-context-inner">
          <strong>2025 event timeline</strong>
          <p>
            Exhibition: 17–19 January 2025 <span>·</span> Conference: 18–19
            January 2025 <span>·</span> Entry: Free <span>·</span> Campaign:
            #WOODपाठशाला
          </p>
        </div>
      </section>
      <section className="pc25-summary">
        <div className="pc25-container">
          <div className="pc25-summary-card">
            <div>
              <span className="pc25-eyebrow">At a glance</span>
              <h2>A conference archive, not an active event listing.</h2>
              <p>
                This page preserves the themes, pictures and 2025 campaign
                material of the two conferences. It does not provide active
                registration for those past sessions.
              </p>
            </div>
            <div className="pc25-summary-links">
              <a href="#day-one">
                <span>18 Jan</span>
                <strong>Timber Transformation</strong>
                <small>Wood &amp; woodworking · Day 1</small>
              </a>
              <a href="#day-two">
                <span>19 Jan</span>
                <strong>Interior Designers’ Day</strong>
                <small>Interior design · Day 2</small>
              </a>
            </div>
          </div>
        </div>
      </section>
      <section id="overview" className="pc25-intro">
        <div className="pc25-container">
          <div className="pc25-intro-grid">
            <div>
              <span className="pc25-eyebrow">The Conference Archive</span>
              <h2 className="pc25-heading">
                Two focused conferences, one shared industry platform.
              </h2>
              <span className="pc25-mini-label">
                Free-entry conference · January 2025
              </span>
            </div>
            <div>
              <p>
                Held alongside the 10th Nepal Wood International Expo (17–19
                January 2025), the two-day conference programme (18–19 January)
                brought industry leaders, experts and professionals together to
                exchange ideas on timber, woodworking and contemporary interior
                design.
              </p>
              <p>
                Day 1 focused on sustainable timber practices and Nepal’s
                industrial future, including a panel discussion on plantation
                strategy, quality control and process automation. Day 2 shifted
                the conversation to design trends, innovative spaces and
                sustainability in the interiors industry. The original campaign
                also featured the identity <strong>#WOODपाठशाला</strong>.
              </p>
            </div>
          </div>
          <div className="pc25-purpose">
            <span className="pc25-eyebrow">2025 Event Purpose</span>
            <h3>What the conference set out to offer</h3>
            <div className="pc25-purpose-grid">
              <div>
                <strong>Learn</strong>
                <p>Insights from industry experts and policymakers.</p>
              </div>
              <div>
                <strong>Discover</strong>
                <p>Innovations in timber, sustainability and design.</p>
              </div>
              <div>
                <strong>Connect</strong>
                <p>
                  Networking with national and international woodworking and
                  interior-sector professionals.
                </p>
              </div>
            </div>
          </div>
          <div className="pc25-tracks">
            {tracks.map((t) => (
              <article className="pc25-track" key={t.num}>
                <span className="pc25-track-num">{t.num}</span>
                <h3>{t.title}</h3>
                <p>{t.text}</p>
                <a href={t.target}>
                  {t.date} <span aria-hidden="true">↗</span>
                </a>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section
        id="day-one"
        className="pc25-day pc25-day-one"
        aria-labelledby="pc25-day-one-title"
      >
        <div className="pc25-container pc25-day-grid">
          <div className="pc25-day-media">
            <div className="pc25-day-image">
              <Image
                src={`${root}/day1-panel.jpeg`}
                alt="Panel discussion at the wood and woodworking conference"
                fill
                sizes="(max-width: 800px) 100vw, 46vw"
              />
            </div>
            
           
          </div>
          <div className="pc25-day-copy">
            <div className="pc25-day-kicker">
              <span className="pc25-day-badge">Day 01</span>
              <span>Saturday · 18 January 2025</span>
            </div>
            <h2 id="pc25-day-one-title">
              Timber Transformation: Charting Nepal’s Sustainable Industrial
              Future
            </h2>
            <strong className="pc25-day-sub">
              Nepal’s Wood &amp; Woodworking Conference · Panel Discussion
            </strong>
            <p>
              A focused exploration of how sustainable timber practices,
              evolving technologies and forward-looking strategies can
              contribute to a greener future for Nepal’s wood industry. Industry
              experts and innovators came together to exchange perspectives on
              timber processing and responsible growth.
            </p>
            <h3>Key themes explored</h3>
            <ul className="pc25-topics">
              {topicsOne.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>
      <section
        id="day-two"
        className="pc25-day pc25-day-two"
        aria-labelledby="pc25-day-two-title"
      >
        <div className="pc25-container pc25-day-grid pc25-day-grid-reverse">
          <div className="pc25-day-media">
            <div className="pc25-day-image">
              <Image
                src={`${root}/day2-design-plans.jpeg`}
                alt="Design conference presentation showing architectural plans"
                fill
                sizes="(max-width: 800px) 100vw, 46vw"
              />
            </div>
           
           
          </div>
          <div className="pc25-day-copy">
            <div className="pc25-day-kicker">
              <span className="pc25-day-badge">Day 02</span>
              <span>Sunday · 19 January 2025</span>
            </div>
            <h2 id="pc25-day-two-title">Interior Designers’ Day</h2>
            <strong className="pc25-day-sub">
              Celebrate Design &amp; Spaces With Us!
            </strong>
            <p>
              Day 2 brought the focus to the latest interior design trends,
              sustainable practices and innovations shaping tomorrow’s spaces.
              Industry leaders shared their expertise, including perspectives
              from the wood and woodworking sector, in a conference dedicated to
              the evolving design industry.
            </p>
            <h3>Key themes explored</h3>
            <ul className="pc25-topics">
              {topicsTwo.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>
      <PastConferenceGallery />
      <section id="associations" className="pc25-partners">
        <div className="pc25-container">
          <span className="pc25-eyebrow">
            Acknowledgements from 2025 Materials
          </span>
          <h2 className="pc25-heading">
            Event organisers &amp; industry partners.
          </h2>
          <p className="pc25-lead">
            The 2025 conference creatives acknowledge the following
            organisations and industry bodies. The pre-event campaign was
            promoted under #WOODपाठशाला with a focus on expert learning,
            innovation and professional networking.
          </p>
          <div className="pc25-partners-grid">
            <article>
              <h3>Jointly organised by</h3>
              <p>
                Futurex Trade Fair &amp; Events
                <small>Exhibitions &amp; trade events · India</small>
              </p>
              <p>
                Media Space Solutions
                <small>Exhibitions, conferences &amp; events · Nepal</small>
              </p>
            </article>
            <article>
              <h3>Conference associations</h3>
              <p>
                Interior Designers Association of Nepal (IDEA Nepal)
                <small>Interior Designers’ Day</small>
              </p>
              <p>
                Wood Technologist Association
                <small>Wood &amp; woodworking conference</small>
              </p>
              <p>
                Nepal Plywood Manufacturers’ Association
                <small>Wood &amp; woodworking conference</small>
              </p>
            </article>
            <article>
              <h3>Supporting organisations</h3>
              <p>Nepal Plywood Manufacturers’ Association</p>
              <p>Federation of Community Forestry Users Nepal (FECOFUN)</p>
              <p>
                Federation of Forest Based Industry and Trade Nepal (FenFIT
                Nepal)
              </p>
              <p>Wood Technologist Association</p>
            </article>
          </div>
        </div>
      </section>
      <section className="pc25-cta">
        <div className="pc25-container pc25-cta-grid">
          <div>
            <span className="pc25-eyebrow">Looking Ahead</span>
            <h2>Explore what’s next at Nepal Wood.</h2>
            <p>
              These conferences took place in January 2025. For upcoming
              exhibitions and current registration information, explore Nepal
              Wood 2027.
            </p>
          </div>
          <Link className="pc25-btn pc25-btn-light" href="/conference">
            Explore Technical Conclave 2027 <span aria-hidden="true">↗</span>
          </Link>
        </div>
      </section>
    </main>
  );
}
