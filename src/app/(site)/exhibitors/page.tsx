import Link from 'next/link';
import Icon from '@/components/Icon';
import JsonLd from '@/components/JsonLd';
import DirectoryBrowser from '@/components/DirectoryBrowser';
import { PageHero, SectionHead, CtaBand, ParticipantsMarquee } from '@/components/blocks';
import { pageMeta, graph, breadcrumbNode } from '@/lib/seo';
import { getDirectory } from '@/lib/public-data';
import { zones } from '@/lib/content';
import heroImg from '@/assets/gallery/expo-19.jpg';

export const revalidate = 300;

export const metadata = pageMeta({
  title: 'Exhibitor List 2027 | Nepal Wood International Expo',
  description: 'Browse confirmed exhibitors at Nepal Wood Expo 2027 by zone and country: plywood, laminates, machinery, furniture technology, hardware and more.',
  path: '/exhibitors',
});

export default async function Exhibitors() {
  const list = await getDirectory();
  const crumbs = [{ name: 'Exhibitor list 2027', path: '/exhibitors' }];
  return (
    <>
      <JsonLd data={graph(breadcrumbNode(crumbs), ...(list.length ? [{ '@type': 'ItemList', name: 'Exhibitors 2027', numberOfItems: list.length, itemListElement: list.slice(0, 100).map((e, i) => ({ '@type': 'ListItem', position: i + 1, item: { '@type': 'Organization', name: e.company, ...(e.website ? { url: e.website } : {}) } })) }] : []))} />
      <PageHero seed={91} eyebrow="Exhibitors 2027" title={<>Who’s <em>exhibiting.</em></>} lead="Plan your visit: find suppliers by product zone, country or name. The list grows as stands are confirmed." crumbs={crumbs} image={heroImg} />
      <section className="section">
        <div className="container">
          {list.length ? (
            <DirectoryBrowser entries={list} zones={zones.map((z) => z.title)} />
          ) : (
            <div className="empty-state" data-reveal>
              <Icon name="building" />
              <h2 className="h-md">The 2027 exhibitor list opens soon.</h2>
              <p>We publish exhibitors here as their stands are confirmed. Register as a visitor and we’ll email you when the list goes live.</p>
              <div className="form-done__actions">
                <Link className="btn" href="/visitor-registration">Register to visit<Icon name="arrow" className="arrow" /></Link>
                <Link className="btn btn--ghost" href="/exhibitor-registration">Exhibit and get listed</Link>
              </div>
            </div>
          )}
        </div>
      </section>
      <section className="section section--cream section--tight">
        <div className="container"><SectionHead split eyebrow="Past participants" title={<>Brands from the <em>10th edition.</em></>} /></div>
        <ParticipantsMarquee />
      </section>
      <CtaBand />
    </>
  );
}
