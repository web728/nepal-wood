import Link from 'next/link';
import Image from 'next/image';
import Icon from '@/components/Icon';
import JsonLd from '@/components/JsonLd';
import { PageHero, SectionHead, FeatureGrid, CtaBand, StatStrip } from '@/components/blocks';
import { pageMeta, graph, breadcrumbNode, eventNode } from '@/lib/seo';
import { whyVisit, zones, seminars } from '@/lib/content';
import { stats, event } from '@/lib/site';
import heroImg from '@/assets/photos/aisle-crowd.jpg';
import demoImg from '@/assets/gallery/expo-29.jpg';
import { visitorGroups, interest, whyExhibit } from '@/lib/content';
import '../../home.css';

export const metadata = pageMeta({
  title: 'Why Visit Nepal Wood Expo 2027 | Free Trade Visitor Entry, Kathmandu',
  description: 'Visit Nepal Wood Expo 2027 free: compare 250+ brands of machinery, plywood, laminates and hardware, see live demos and join seminars. 28–31 Jan.',
  path: '/why-visit',
});

export default function WhyVisit() {
  const crumbs = [{ name: 'Why visit', path: '/why-visit' }];
  return (
    <>
      <JsonLd data={graph(breadcrumbNode(crumbs), eventNode())} />
      <PageHero seed={101} eyebrow="Visit · free for trade visitors" title={<>Source smarter. <em>See it running.</em></>} lead="Four days to compare suppliers, watch machines work and meet the people behind the brands, all at Bhrikuti Mandap." crumbs={crumbs} image={heroImg}>
        <Link className="btn btn--copper" href="/visitor-registration">Get your free QR badge<Icon name="arrow" className="arrow" /></Link>
        <Link className="btn btn--ghost" href="/venue">Plan your visit</Link>
      </PageHero>
      <section className="section">
        <div className="container">
          <StatStrip items={[
            { v: stats.brands, suffix: '+', label: 'Brands to compare' },
            { v: stats.productsOnDisplay, suffix: '+', label: 'Products & services on display' },
            { v: stats.countries, suffix: '+', label: 'Exhibitor countries' },
            { v: event.days, label: 'Days, Thursday to Sunday' },
          ]} note="" />
        </div>
      </section>
      <section className="section section--cream">
        <div className="container">
          <SectionHead eyebrow="Why visit" title={<>Worth a day out of <em>the factory.</em></>} />
          <FeatureGrid items={whyVisit} />
        </div>
      </section>
         {/* ============ VISITORS ============ */}
       
      <section className="section">
        <div className="container split">
          <div className="split__media" data-reveal><Image src={demoImg} alt="Visitors watching a live machine demonstration" fill sizes="(max-width: 900px) 100vw, 45vw" /></div>
          <div>
            <p className="eyebrow" data-reveal>What you’ll find</p>
            <h2 className="h-lg" data-reveal>Five zones to <em>walk.</em></h2>
            <ul className="check-list" data-reveal>
              {zones.map((z) => <li key={z.slug}><Icon name="check" /><span><strong>{z.title}</strong>: {z.short}</span></li>)}
            </ul>
            <Link className="link-arrow" href="/exhibitors" style={{ marginTop: 22 }}>See who’s exhibiting<Icon name="arrow" /></Link>
          </div>
        </div>
      </section>
      <section className="section section--dark">
        <div className="container">
          <SectionHead split eyebrow="Seminars" title={<>Learn while <em>you’re there.</em></>} lead="Recent sessions covered timber plantation, quality standards, automation and Nepalese materials in interiors." />
          <div className="cards">
            {seminars.map((s) => <article className="card card--dark" key={s.slug} data-reveal><p className="card__kicker">{s.date} · {s.ed}</p><h3 className="h-sm">{s.title}</h3><p>{s.text}</p></article>)}
          </div>
          <Link className="link-arrow" href="/seminars" style={{ marginTop: 28 }}>Seminar programme<Icon name="arrow" /></Link>
        </div>
      </section>
      <CtaBand title={<>Your badge is <em>free.</em></>} lead="Register in two minutes, show the QR code at the express entry counter, and walk straight in." primary={{ href: '/visitor-registration', label: 'Register to visit' }} secondary={{ href: '/faq', label: 'Visitor FAQ' }} />
    </>
  );
}
