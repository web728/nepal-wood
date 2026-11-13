import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Icon from '@/components/Icon';
import TreeRings from '@/components/TreeRings';
import SiteEffects from '@/components/SiteEffects';
import './site.css';
import './components.css';

export const metadata = { title: 'Page not found', robots: { index: false } };

export default function NotFound() {
  return (
    <>
      <Header />
      <main id="main">
        <section className="page-hero on-dark" style={{ minHeight: '70vh', display: 'grid', alignItems: 'center' }}>
          <TreeRings className="page-hero__rings" rings={18} seed={404} cracks={3} />
          <div className="container page-hero__inner">
            <p className="eyebrow">Error 404</p>
            <h1 className="h-xl page-hero__title">This page is still <em>being planed.</em></h1>
            <p className="lead">The page you were looking for doesn’t exist or has moved. These will get you back on track:</p>
            <div className="page-hero__extra">
              <Link className="btn btn--copper" href="/">Back to the homepage<Icon name="arrow" className="arrow" /></Link>
              <Link className="btn btn--ghost" href="/exhibitor-registration">Book a stand</Link>
              <Link className="btn btn--ghost" href="/visitor-registration">Register to visit</Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <SiteEffects />
    </>
  );
}
