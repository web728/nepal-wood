import Link from 'next/link';
import Image from 'next/image';
import Icon from '@/components/Icon';
import JsonLd from '@/components/JsonLd';
import { PageHero, SectionHead, CtaBand, ParticipantsMarquee } from '@/components/blocks';
import { pageMeta, graph, breadcrumbNode } from '@/lib/seo';
import { editions, seminars } from '@/lib/content';
import { downloads, partners } from '@/lib/site';
import heroImg from '@/assets/photos/ribbon-cutting.jpg';
import r1 from '@/assets/photos/inauguration-10th.jpg';
import r2 from '@/assets/photos/seminar-stage.jpg';
import r3 from '@/assets/photos/roadshow.jpg';

export const metadata = pageMeta({
  title: 'Past Editions & Post-Show Reports | Nepal Wood International Expo',
  description: 'Twelve editions of Nepal Wood International Expo since 2015: timeline, highlights, seminars, participants and downloadable post-show reports.',
  path: '/past-editions',
});

export default function PastEditions() {
  const crumbs = [{ name: 'Past editions', path: '/past-editions' }];
  const reportFor = (ed?: string) => downloads.reports.find((r) => r.edition === ed);
  return (
    <>
      <JsonLd data={graph(breadcrumbNode(crumbs))} />
      <PageHero seed={33} eyebrow="Our journey" title={<>Twelve editions, <em>one growing industry.</em></>} lead="From about 110 stalls in 2016 to a four-day international show in 2027: every edition, with results and reports." crumbs={crumbs} image={heroImg} />

      <section className="section">
        <div className="container">
          <SectionHead eyebrow="Timeline" title={<>Edition by <em>edition.</em></>} />
          <ol className="eds">
            {[...editions].reverse().map((e) => {
              const rep = reportFor(e.report);
              return (
                <li className={`ed${e.current ? ' ed--current' : ''}`} key={e.ed} data-reveal>
                  <span className="ed__no">{e.ed}</span>
                  <span className="ed__dates">{e.dates}</span>
                  <p className="ed__note">{e.note}</p>
                  {e.current ? (
                    <Link className="link-arrow" href="/exhibitor-registration">Book a stand<Icon name="arrow" /></Link>
                  ) : rep ? (
                    <a className="link-arrow" href={rep.file} download>Post-show report<Icon name="download" /></a>
                  ) : <span />}
                </li>
              );
            })}
          </ol>
          <p className="small muted" style={{ marginTop: 18 }}>The 1st, 3rd and 4th editions ran from 2015 to 2018. Visitor figures are as reported by the organiser.</p>
        </div>
      </section>

      <section className="section section--cream">
        <div className="container">
          <SectionHead split eyebrow="Highlights" title={<>Moments that <em>shaped the show.</em></>} />
          <div className="highlights">
            {[
              { img: r1, alt: 'Ribbon-cutting at the 10th edition entrance celebrating ten years', t: 'Ten years of showcasing innovation', d: 'The 10th edition in January 2025 was inaugurated by Hon. Damodar Bhandari, Minister for Industry, Commerce and Supplies, with Swami Prem Anveshi (MD, Futurex Group) and Pratap Singh Bist (Director, Media Space).' },
              { img: r2, alt: 'Speaker on stage at a Nepal Wood seminar', t: 'A knowledge platform', d: `Seminars on timber plantation, quality standards, automation and interior design, held with IDEA Nepal. ${seminars.length} sessions across the 10th and 11th editions.` },
              { img: r3, alt: 'Roadshow banners for 14 cities across Nepal', t: 'Promotion across Nepal', d: 'The November 2024 roadshow reached Janakpur, Birgunj, Simara, Chitwan, Bhairahawa, Butwal, Kapilvastu, Dang, Nepalgunj, Dhangadhi, Mahendranagar, Pokhara, Bhaktapur and Kathmandu.' },
            ].map((h, i) => (
              <article className="highlight" key={h.t} data-reveal style={{ ['--d' as string]: `${i * 0.08}s` }}>
                <div className="highlight__img"><Image src={h.img} alt={h.alt} fill sizes="(max-width: 900px) 100vw, 33vw" /></div>
                <h3 className="h-sm">{h.t}</h3>
                <p>{h.d}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--tight">
        <div className="container">
          <SectionHead split eyebrow="10th edition participants" title={<>115+ brands <em>on the floor.</em></>} lead={`Also with us: ${partners.pastCoSponsor[0].name}, co-sponsor of the 11th edition.`} />
        </div>
        <ParticipantsMarquee />
      </section>

      <section className="section section--cream">
        <div className="container container--narrow">
          <SectionHead eyebrow="Downloads" title={<>Post-show <em>reports.</em></>} />
          <div className="downloads">
            {downloads.reports.map((r) => (
              <a className="dl" key={r.file} href={r.file} download data-reveal>
                <span className="dl__icon"><Icon name="download" /></span>
                <span><strong>{r.edition} edition post-show report</strong><span>{r.dates} · PDF · {r.size}</span></span>
                <Icon name="arrow" className="arrow" />
              </a>
            ))}
          </div>
        </div>
      </section>
      <CtaBand />
    </>
  );
}
