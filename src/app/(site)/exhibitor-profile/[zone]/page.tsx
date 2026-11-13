import { notFound } from 'next/navigation';
import Link from 'next/link';
import Icon from '@/components/Icon';
import JsonLd from '@/components/JsonLd';
import ExhibitorForm from '@/components/forms/ExhibitorForm';
import { PageHero, SectionHead } from '@/components/blocks';
import { pageMeta, graph, breadcrumbNode, eventNode } from '@/lib/seo';
import { zones, interest } from '@/lib/content';
import { event, stats } from '@/lib/site';

export const dynamicParams = false;
export function generateStaticParams() {
  return zones.map((z) => ({ zone: z.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ zone: string }> }) {
  const { zone } = await params;
  const z = zones.find((x) => x.slug === zone);
  if (!z) return {};
  return pageMeta({ title: `${z.seoTitle} | Nepal Wood 2027`, description: z.seoDesc, path: `/exhibitor-profile/${z.slug}`, image: '/og/og-default.jpg' });
}

// Which visitor-interest rows matter most for each zone (organiser visitor data).
const demand: Record<string, string[]> = {
  'wood-panel-products': ['Plywood, veneer, MDF & laminates', 'Hardwood & softwood'],
  'woodworking-machinery': ['Woodworking machinery & dust control', 'Tools, blades & cutters'],
  'furniture-production-technology': ['Flooring, doors, furniture & fittings', '3D software'],
  'furnishing-interior-products': ['Flooring, doors, furniture & fittings', 'Plywood, veneer, MDF & laminates'],
  'tools-hardware-raw-materials': ['Coatings, paints & adhesives', 'Tools, blades & cutters'],
};

export default async function ZonePage({ params }: { params: Promise<{ zone: string }> }) {
  const { zone } = await params;
  const z = zones.find((x) => x.slug === zone);
  if (!z) notFound();
  const crumbs = [{ name: 'Exhibitor profile', path: '/exhibitor-profile' }, { name: z.title, path: `/exhibitor-profile/${z.slug}` }];
  const rows = interest.filter((i) => demand[z.slug]?.includes(i.label));
  const others = zones.filter((x) => x.slug !== z.slug);
  return (
    <>
      <JsonLd data={graph(breadcrumbNode(crumbs), eventNode())} />
      <PageHero seed={60 + Number(z.no)} eyebrow={`Zone ${z.no} · ${event.shortName}`} title={<>{z.title} <em>at Nepal Wood.</em></>} lead={z.intro} crumbs={crumbs} image={z.img} imageAlt={z.alt}>
        <a className="btn btn--copper" href="#enquire">Book a stand in this zone<Icon name="arrow" className="arrow" /></a>
      </PageHero>

      <section className="section">
        <div className="container split split--top">
          <div>
            <p className="eyebrow" data-reveal>On display</p>
            <h2 className="h-lg" data-reveal>What this zone <em>covers.</em></h2>
            <ul className="pill-list" data-reveal>{z.items.map((it) => <li key={it}>{it}</li>)}</ul>
            <h3 className="h-sm" style={{ margin: '40px 0 14px' }} data-reveal>Who should exhibit here</h3>
            <ul className="check-list" data-reveal>{z.forWho.map((w) => <li key={w}><Icon name="check" />{w}</li>)}</ul>
          </div>
          <aside className="zone-demand" data-reveal>
            <p className="card__kicker">Visitor demand</p>
            {rows.map((r) => (
              <div className="zone-demand__row" key={r.label}>
                <span className="zone-demand__num tnum">{r.v}%</span>
                <span>of visitors name <strong>{r.label.toLowerCase()}</strong> as a main interest</span>
              </div>
            ))}
            <div className="zone-demand__row">
              <span className="zone-demand__num tnum">{stats.seniorManagementPct}%</span>
              <span>of all visitors hold senior management roles</span>
            </div>
            <p className="source">Organiser visitor data, 10th & 11th editions.</p>
          </aside>
        </div>
      </section>

      <section className="section section--cream" id="enquire">
        <div className="container form-layout">
          <div className="form-card">
            <p className="eyebrow">Stand enquiry · {z.title}</p>
            <h2 className="h-md" style={{ margin: '14px 0 26px' }}>Tell us about your stand.</h2>
            <ExhibitorForm defaultZone={z.title} />
          </div>
          <aside className="form-aside">
            <div className="card">
              <p className="card__kicker">Other zones</p>
              {others.map((o) => <Link key={o.slug} className="link-arrow" style={{ marginTop: 10 }} href={`/exhibitor-profile/${o.slug}`}>{o.title}<Icon name="arrow" /></Link>)}
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
