import Link from 'next/link';
import Image from 'next/image';
import Icon from '@/components/Icon';
import JsonLd from '@/components/JsonLd';
import { PageHero, CtaBand } from '@/components/blocks';
import { pageMeta, graph, breadcrumbNode } from '@/lib/seo';
import { zones, interest } from '@/lib/content';
import heroImg from '@/assets/photos/panels-display.jpg';

export const metadata = pageMeta({
  title: 'Exhibitor Profile | Who Exhibits at Nepal Wood International Expo 2027',
  description:
    'Wood and panel products, woodworking machinery, furniture production technology, furnishing and interior products, tools, hardware and raw materials. See where your company fits at Nepal Wood International Expo 2027.',
  path: '/exhibitor-profile',
});

export default function ExhibitorProfile() {
  const crumbs = [{ name: 'Exhibitor profile', path: '/exhibitor-profile' }];
  return (
    <>
      <JsonLd
        data={graph(breadcrumbNode(crumbs), {
          '@type': 'ItemList',
          name: 'Nepal Wood Expo exhibitor categories',
          itemListElement: zones.map((z, i) => ({
            '@type': 'ListItem',
            position: i + 1,
            name: z.title,
            url: `/exhibitor-profile/${z.slug}`,
          })),
        })}
      />
      <PageHero
        seed={51}
        eyebrow="Exhibitor profile"
        title={<>Who should <em>exhibit?</em></>}
        lead="If your company serves the wood, furniture or interior industry, you belong here. The categories below are a guide, not a boundary. If your product isn’t listed, talk to us."
        crumbs={crumbs}
        image={heroImg}
      />

      <section className="section">
        <div className="container zone-list">
          {zones.map((z, i) => (
            <article className={`zone-row${i % 2 ? ' zone-row--rev' : ''}`} key={z.slug} id={z.slug}>
              <div className="zone-row__media" data-reveal>
                <Image src={z.img} alt={z.alt} fill sizes="(max-width: 900px) 100vw, 45vw" />
              </div>
              <div className="zone-row__body">
                <p className="eyebrow" data-reveal>Product category</p>
                <h2 className="h-lg" data-reveal>{z.title}</h2>
                <p className="lead" data-reveal>{z.intro}</p>
                <ul className="pill-list" data-reveal>
                  {z.items.map((it) => <li key={it}>{it}</li>)}
                </ul>
                <div className="zone-row__ctas" data-reveal>
                  <Link className="btn" href={`/exhibitor-registration?zone=${encodeURIComponent(z.title)}`}>
                    Exhibit in this category<Icon name="arrow" className="arrow" />
                  </Link>
                  <Link className="link-arrow" href={`/exhibitor-profile/${z.slug}`}>
                    Category details<Icon name="arrow" />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="section section--cream">
        <div className="container split split--top">
          <div>
            <p className="eyebrow" data-reveal>Demand</p>
            <h2 className="h-lg" data-reveal>What visitors <em>come to source.</em></h2>
            <p className="lead" data-reveal>Visitor interest by sector, from organiser visitor data (10th and 11th editions).</p>
          </div>
          <ul className="bars" data-bars>
            {interest.map((b, i) => (
              <li className="bar" key={b.label} style={{ ['--bd' as string]: `${i * 0.06}s` }}>
                <span className="bar__label">{b.label}</span>
                <span className="bar__track"><span className="bar__fill" style={{ ['--v' as string]: b.v / 30 }} /></span>
                <span className="bar__val tnum">{b.v}%</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <CtaBand
        title={<>Does your company serve the <em>wood industry?</em></>}
        lead="Nepal’s furniture makers, builders, architects and dealers want to meet you. Tell us what you make and we’ll suggest the right stand."
      />
    </>
  );
}