import Link from 'next/link';
import Icon from '@/components/Icon';
import JsonLd from '@/components/JsonLd';
import { PageHero, SectionHead, CtaBand } from '@/components/blocks';
import { pageMeta, graph, breadcrumbNode } from '@/lib/seo';
import { visitorGroups, jobProfile, interest } from '@/lib/content';
import { stats } from '@/lib/site';
import heroImg from '@/assets/photos/visitors-crowd.jpg';

export const metadata = pageMeta({
  title: 'Visitor Profile | Who Attends Nepal Wood International Expo',
  description: 'Who visits Nepal Wood Expo: architects, interior designers, builders, furniture manufacturers, dealers, importers and saw millers. 75% hold senior management roles.',
  path: '/visitor-profile',
});

const Bars = ({ rows, max }: { rows: { label: string; v: number }[]; max: number }) => (
  <ul className="bars" data-bars>
    {rows.map((b, i) => (
      <li className="bar" key={b.label} style={{ ['--bd' as string]: `${i * 0.06}s` }}>
        <span className="bar__label">{b.label}</span>
        <span className="bar__track"><span className="bar__fill" style={{ ['--v' as string]: b.v / max }} /></span>
        <span className="bar__val tnum">{b.v}%</span>
      </li>
    ))}
  </ul>
);

export default function VisitorProfile() {
  const crumbs = [{ name: 'Visitor profile', path: '/visitor-profile' }];
  return (
    <>
      <JsonLd data={graph(breadcrumbNode(crumbs))} />
      <PageHero seed={111} eyebrow="Visitor profile" title={<>Who walks <em>the floor.</em></>} lead="If your business involves wood, furniture or interiors, Nepal Wood 2027 is where your buyers will be." crumbs={crumbs} image={heroImg} />
      <section className="section">
        <div className="container split split--top">
          <div>
            <p className="eyebrow" data-reveal>Who attends</p>
            <h2 className="h-lg" data-reveal>The buying side of <em>the industry.</em></h2>
            <ul className="visitor-groups">
              {visitorGroups.map((g, i) => <li key={g} data-reveal style={{ ['--d' as string]: `${i * 0.04}s` }}> {g}</li>)}
            </ul>
          </div>
          <div className="profile-panel" data-reveal>
            <div className="big-stat">
              <span className="big-stat__num tnum"><span data-count={stats.seniorManagementPct}>{stats.seniorManagementPct}</span>%</span>
              <p>of visitors hold senior management positions.</p>
            </div>
            <h3 className="panel-title">Visitors by job profile</h3>
            <Bars rows={jobProfile} max={28} />
          </div>
        </div>
      </section>
    {/* <section className="section section--cream interest-section">
  <div className="container split split--top interest-split">
    <div className="interest-split__copy">
      <p className="eyebrow" data-reveal>Interests</p>
      <h2 className="h-lg" data-reveal>What they <em>come to buy.</em></h2>
      <p className="lead" data-reveal>
        Machinery and panel products lead, but every category has its buyers.
      </p>
      <Link className="btn" href="/exhibitor-registration" data-reveal>
        Meet them at your stand<Icon name="arrow" className="arrow" />
      </Link>
    </div>
    <div className="profile-panel" data-reveal>
      <h3 className="panel-title">Visitor interest by sector</h3>
      <Bars rows={interest} max={30} />
    </div>
  </div>
</section> */}
      <CtaBand />
    </>
  );
}
