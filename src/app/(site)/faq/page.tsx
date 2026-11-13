import Link from 'next/link';
import Icon from '@/components/Icon';
import JsonLd from '@/components/JsonLd';
import { PageHero, Faq, CtaBand } from '@/components/blocks';
import { pageMeta, graph, breadcrumbNode, faqNode } from '@/lib/seo';
import { faqs } from '@/lib/content';
import { contacts, telHref, waHref } from '@/lib/site';

export const metadata = pageMeta({
  title: 'FAQ | Nepal Wood International Expo 2027: Visiting, Exhibiting, Badges',
  description: 'Answers about Nepal Wood International Expo 2027: dates, hours, free entry, getting to Bhrikuti Mandap, booking a stand, machinery demos, sponsorship and badges.',
  path: '/faq',
});

export default function FaqPage() {
  const crumbs = [{ name: 'FAQ', path: '/faq' }];
  return (
    <>
      <JsonLd data={graph(breadcrumbNode(crumbs), faqNode(faqs.flatMap((g) => g.items)))} />
      <PageHero seed={161} dark={false} eyebrow="Help" title={<>Frequently asked <em>questions.</em></>} lead="Everything visitors and exhibitors usually ask. Still stuck? Call or WhatsApp the team." crumbs={crumbs} />
      <section className="section">
        <div className="container faq-layout">
          <nav className="faq-nav" aria-label="FAQ sections">
            {faqs.map((g) => <a key={g.group} href={`#${g.group.toLowerCase().replace(/[^a-z]+/g, '-')}`}>{g.group}</a>)}
          </nav>
          <div>
            {faqs.map((g) => (
              <div className="faq-group" key={g.group} id={g.group.toLowerCase().replace(/[^a-z]+/g, '-')}>
                <h2 className="h-md">{g.group}</h2>
                <Faq items={g.items} />
              </div>
            ))}
            <div className="card card--featured" style={{ marginTop: 48 }}>
              <p className="card__kicker">Didn’t find your answer?</p>
              <p>Nepal secretariat: <a href={telHref(contacts[2].phone)}>{contacts[2].phone}</a> · <a href={`mailto:${contacts[2].email}`}>{contacts[2].email}</a></p>
              <div className="form-done__actions" style={{ justifyContent: 'flex-start' }}>
                <a className="btn btn--copper btn--sm" href={waHref(contacts[2].whatsapp)} target="_blank" rel="noopener"><Icon name="whatsapp" className="arrow" />WhatsApp us</a>
                <Link className="btn btn--ghost btn--sm" href="/contact">Contact form</Link>
              </div>
            </div>
          </div>
        </div>
      </section>
      <CtaBand />
    </>
  );
}
