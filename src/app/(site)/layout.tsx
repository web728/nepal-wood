import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SiteEffects from '@/components/SiteEffects';
import Consent from '@/components/Consent';
import '../site.css';
import '../components.css';
import '../forms.css';
import '../pages.css';

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <a className="skip-link" href="#main">Skip to content</a>
      <Header />
      <main id="main">{children}</main>
      <Footer />
      <SiteEffects />
      <Consent gaId={process.env.NEXT_PUBLIC_GA_ID} />
    </>
  );
}
