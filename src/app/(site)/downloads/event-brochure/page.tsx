import Image from 'next/image';
import Icon from '@/components/Icon';
import JsonLd from '@/components/JsonLd';
import BrochureForm from '@/components/forms/BrochureForm';
import { PageHero } from '@/components/blocks';
import { pageMeta, graph, breadcrumbNode } from '@/lib/seo';
import { downloads } from '@/lib/site';
import cover from '@/assets/brochure-cover.jpg';

export const metadata = pageMeta({
  title: '2027 Event Brochure | Nepal Wood International Expo (PDF)',
  description: 'Download the official Nepal Wood International Expo 2027 brochure: dates, venue, exhibitor and visitor profiles, show highlights and organiser contacts.',
  path: '/downloads/event-brochure',
});

export default function Brochure() {
  const crumbs = [{ name: '2027 brochure', path: '/downloads/event-brochure' }];
  return (
    <>
      <JsonLd data={graph(breadcrumbNode(crumbs))} />
      <PageHero seed={181} dark={false} eyebrow="Download" title={<>The 2027 <em>event brochure.</em></>} lead={`Eight pages: the show in numbers, exhibitor and visitor profiles, glimpses of past editions and contacts. PDF, ${downloads.brochure.size}.`} crumbs={crumbs} />
      <section className="section section--cream">
        <div className="container form-layout">
          <div className="form-card">
            <p className="eyebrow">Where should we send updates?</p>
            <h2 className="h-md" style={{ margin: '14px 0 26px' }}>Get the brochure instantly.</h2>
            <BrochureForm />
          </div>
          <aside className="form-aside">
            <div className="brochure-cover"><Image src={cover} alt="Cover of the Nepal Wood International Expo 2027 brochure" sizes="(max-width: 900px) 80vw, 30vw" placeholder="blur" /></div>
            <div className="card">
              <p className="card__kicker">Inside</p>
              <ul>
                <li><Icon name="check" />12th edition dates, venue and format</li>
                <li><Icon name="check" />Exhibitor profile: five product zones</li>
                <li><Icon name="check" />Visitor profile and show highlights</li>
                <li><Icon name="check" />Organisers and booking contacts</li>
              </ul>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
