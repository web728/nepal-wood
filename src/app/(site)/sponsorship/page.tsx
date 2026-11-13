import Image from 'next/image';
import Icon from '@/components/Icon';
import JsonLd from '@/components/JsonLd';
import EnquiryForm from '@/components/forms/EnquiryForm';
import { PageHero, SectionHead, StatStrip } from '@/components/blocks';
import { pageMeta, graph, breadcrumbNode } from '@/lib/seo';
import { sponsorships } from '@/lib/content';
import { stats, partners, contacts, telHref } from '@/lib/site';
import heroImg from '@/assets/photos/inauguration-10th.jpg';
import brandImg from '@/assets/gallery/expo-54.jpg';

export const metadata = pageMeta({
  title: 'Sponsorship & Partnerships | Nepal Wood International Expo 2027',
  description: 'Sponsor Nepal Wood Expo 2027: title, platinum and gold partnerships, badge branding, seminars, visitor bags and venue branding at Bhrikuti Mandap.',
  path: '/sponsorship',
});

export default function Sponsorship() {
  const crumbs = [{ name: 'Sponsorship', path: '/sponsorship' }];
  return (
    <>
      <JsonLd data={graph(breadcrumbNode(crumbs))} />
      <PageHero seed={81} eyebrow="Partner with Nepal Wood" title={<>Lead the conversation, <em>not just the aisle.</em></>} lead="Sponsorship puts your brand on every badge, banner, email and stage of Nepal’s wood-industry week." crumbs={crumbs} image={heroImg}>
        <a className="btn btn--copper" href="#enquire">Discuss sponsorship<Icon name="arrow" className="arrow" /></a>
      </PageHero>

      <section className="section">
        <div className="container">
          <StatStrip items={[
            { v: stats.expectedVisitors, suffix: '+', label: 'Trade visitors expected' },
            { v: 4, label: 'Show days, the first four-day edition' },
            { v: 14, label: 'Cities in the last promotional roadshow' },
            { v: stats.seniorManagementPct, suffix: '%', label: 'Visitors in senior roles' },
          ]} />
        </div>
      </section>

      <section className="section section--cream">
        <div className="container">
          <SectionHead split eyebrow="Opportunities" title={<>Packages that <em>fit your goals.</em></>} lead="Every package can be combined with a stand. Pricing and full benefits come with your proposal." />
          <div className="cards">
            {sponsorships.map((s) => (
              <article className={`card${s.taken ? ' card--muted' : ''}${s.t === 'Title partner' ? ' card--featured' : ''}`} key={s.t} data-reveal>
                <span className={`tag${s.taken ? ' tag--ok' : ' tag--copper'}`}>{s.tier}</span>
                <h3 className="h-sm">{s.t}</h3>
                <p>{s.d}</p>
                <ul>{s.perks.map((p) => <li key={p}><Icon name="check" />{p}</li>)}</ul>
                {s.taken && partners.lanyard[0] && <img className="card__logo" src={partners.lanyard[0].logo} alt={partners.lanyard[0].name} width={120} height={48} />}
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section" id="enquire">
        <div className="container form-layout">
          <div className="form-card">
            <p className="eyebrow">Sponsorship enquiry</p>
            <h2 className="h-md" style={{ margin: '14px 0 26px' }}>Tell us what you’d like to achieve.</h2>
            <EnquiryForm topic="sponsorship" />
          </div>
          <aside className="form-aside">
            <div className="split__media" style={{ aspectRatio: '4/3' }}><Image src={brandImg} alt="Inauguration at the Nepal Wood entrance arch" fill sizes="(max-width: 900px) 100vw, 30vw" /></div>
            <div className="card">
              <p className="card__kicker">Sponsorship desk</p>
              <strong>{contacts[1].name}</strong>
              <p><a href={telHref(contacts[1].phone)}>{contacts[1].phone}</a><br /><a href={`mailto:${contacts[1].email}`}>{contacts[1].email}</a></p>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
