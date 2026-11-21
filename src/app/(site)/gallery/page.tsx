import JsonLd from '@/components/JsonLd';
import GalleryGrid from '@/components/GalleryGrid';
import { PageHero, CtaBand } from '@/components/blocks';
import { pageMeta, graph, breadcrumbNode } from '@/lib/seo';
import { getGallery } from '@/lib/gallery';
import { SITE_URL } from '@/lib/site';
import heroImg from '@/assets/gallery/expo-35.jpg';
import './gallery.css';

export const revalidate = 300;

export const metadata = pageMeta({
  title: 'Photo Gallery | Nepal Wood International Expo, Kathmandu',
  description: 'Explore photos from Nepal Wood International Expo: machinery, material stands, meetings, ceremonies and seminars.',
  path: '/gallery',
});

export default async function GalleryPage() {
  const crumbs = [{ name: 'Gallery', path: '/gallery' }];
  const shots = await getGallery();

  return (
    <>
      <JsonLd data={graph(
        breadcrumbNode(crumbs),
        {
          '@type': 'ImageGallery',
          name: 'Nepal Wood International Expo photo gallery',
          url: `${SITE_URL}/gallery`,
          image: shots.slice(0, 20).map((shot) => ({
            '@type': 'ImageObject',
            contentUrl: `${SITE_URL}${shot.src}`,
            caption: shot.alt,
          })),
        },
      )} />

      <PageHero
        seed={151}
        eyebrow="Photo gallery"
        title={<>Glimpses of <em>the show.</em></>}
        lead="Explore moments from the exhibition floor, demonstrations, meetings and industry events."
        crumbs={crumbs}
        image={heroImg}
      />

      <section className="section expo-gallery-section" aria-label="Expo photo gallery">
        <div className="container">
          <GalleryGrid shots={shots} />
        </div>
      </section>
      <CtaBand />
    </>
  );
}
