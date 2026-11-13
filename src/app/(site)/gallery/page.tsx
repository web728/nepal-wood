import JsonLd from '@/components/JsonLd';
import GalleryGrid from '@/components/GalleryGrid';
import { PageHero, CtaBand } from '@/components/blocks';
import { pageMeta, graph, breadcrumbNode } from '@/lib/seo';
import { gallery } from '@/lib/gallery';
import { SITE_URL } from '@/lib/site';
import heroImg from '@/assets/gallery/expo-35.jpg';

export const metadata = pageMeta({
  title: 'Photo Gallery | Nepal Wood International Expo, Kathmandu',
  description: 'Photos from recent editions of Nepal Wood International Expo: machinery demonstrations, plywood and laminate stands, B2B meetings, inaugurations and seminars.',
  path: '/gallery',
});

export default function Gallery() {
  const crumbs = [{ name: 'Gallery', path: '/gallery' }];
  return (
    <>
      <JsonLd data={graph(breadcrumbNode(crumbs), { '@type': 'ImageGallery', name: 'Nepal Wood International Expo photo gallery', url: `${SITE_URL}/gallery`, image: gallery.slice(0, 20).map((g) => ({ '@type': 'ImageObject', contentUrl: `${SITE_URL}${g.src.src}`, caption: g.alt })) })} />
      <PageHero seed={151} eyebrow="Gallery" title={<>Glimpses of <em>the show.</em></>} lead="Machinery demonstrations, material stands, meetings and ceremonies from recent editions at Bhrikuti Mandap." crumbs={crumbs} image={heroImg} />
      <section className="section">
        <div className="container"><GalleryGrid shots={gallery} /></div>
      </section>
      <CtaBand />
    </>
  );
}
