import JsonLd from '@/components/JsonLd';
import NewsGallery from '@/components/NewsGallery';
import { PageHero, CtaBand } from '@/components/blocks';
import { pageMeta, graph, breadcrumbNode } from '@/lib/seo';
import { getNewsImages } from '@/lib/news';
import './news.css';

export const metadata = pageMeta({
  title: 'News & Media Coverage | Nepal Wood International Expo',
  description: 'Browse news and media photographs from Nepal Wood International Expo in Kathmandu.',
  path: '/news',
});

// Refresh the scanned photo list periodically; deploy new files to public/news to publish them.
export const revalidate = 300;

export default async function NewsPage() {
  const crumbs = [{ name: 'News & media', path: '/news' }];
  const images = await getNewsImages();

  return (
    <>
      <JsonLd data={graph(breadcrumbNode(crumbs))} />
      <PageHero
        seed={27}
        eyebrow="News & media"
        title={<>Stories from <em>the show.</em></>}
        lead="Explore news photographs and media highlights from Nepal Wood International Expo."
        crumbs={crumbs}
      />

      <section className="section news-section" aria-labelledby="news-section-title">
        <div className="container">
          <div className="news-intro">
            <div>
              <p className="eyebrow">Media collection</p>
              <h2 className="h-lg" id="news-section-title">Latest <em>visual coverage.</em></h2>
            </div>
            <p className="news-intro__text">
              Photos from the news archive, presented in a simple and easy-to-browse gallery.
            </p>
          </div>
          <NewsGallery images={images} />
        </div>
      </section>
      <CtaBand />
    </>
  );
}
