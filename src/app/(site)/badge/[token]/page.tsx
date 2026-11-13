import { notFound } from 'next/navigation';
import Link from 'next/link';
import QRCode from 'qrcode';
import Icon from '@/components/Icon';
import PrintButton from '@/components/PrintButton';
import { getDb, COLLECTIONS, dbConfigured } from '@/lib/db';
import { event } from '@/lib/site';
import { mailConfigured } from '@/lib/mail';
import '@/app/badge.css';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Your visitor badge', robots: { index: false, follow: false } };

export default async function BadgePage({ params, searchParams }: { params: Promise<{ token: string }>; searchParams: Promise<{ new?: string; existing?: string }> }) {
  const { token } = await params;
  const sp = await searchParams;
  if (!dbConfigured() || !/^[A-Za-z0-9_-]{16,40}$/.test(token)) notFound();
  const db = await getDb();
  const v = await db.collection(COLLECTIONS.visitors).findOne({ token }, { projection: { name: 1, designation: 1, company: 1, city: 1, country: 1, badgeId: 1, checkedInAt: 1 } });
  if (!v) notFound();

  // The QR carries the badge ID plus the private token, so a scan can't be forged from the ID alone.
  const payload = `NW27:${v.badgeId}:${token}`;
  const qr = await QRCode.toString(payload, { type: 'svg', errorCorrectionLevel: 'M', margin: 1, color: { dark: '#1a110d', light: '#ffffff' } });

  return (
    <section className="badge-page">
      <div className="container badge-wrap">
        {sp.existing && <p className="badge-note no-print"><Icon name="info" />You were already registered with this email. Here is your badge.</p>}
        {sp.new && <p className="badge-note badge-note--ok no-print"><Icon name="check" />You’re registered! Save this page or take a screenshot.</p>}
        <article className="badge" aria-label="Visitor badge">
          <header className="badge__top">
            <img src="/brand/logo-12th-edition-reverse.svg" alt="Nepal Wood International Expo, 12th Edition" width={140} height={60} />
            <span className="badge__type">Trade visitor</span>
          </header>
          <div className="badge__body">
            <h1 className="badge__name">{v.name}</h1>
            <p className="badge__role">{v.designation}</p>
            <p className="badge__company">{v.company}</p>
            <p className="badge__place">{[v.city, v.country].filter(Boolean).join(', ')}</p>
            <div className="badge__qr" dangerouslySetInnerHTML={{ __html: qr }} role="img" aria-label={`QR code for badge ${v.badgeId}`} />
            <p className="badge__id tnum">{v.badgeId}</p>
          </div>
          <footer className="badge__foot">
            <span>{event.datesLabel}</span>
            <span>{event.venue.name}, {event.venue.city}</span>
          </footer>
        </article>
        <div className="badge-actions no-print">
          <PrintButton />
          <Link className="btn btn--ghost" href="/venue">Plan your visit</Link>
        </div>
        <ul className="badge-tips no-print">
          <li><Icon name="badge" />Show this QR code at the express entry counter on any of the four days.</li>
          <li><Icon name="info" />Carry a business card, company ID or photo ID.</li>
          <li><Icon name="mail" />{mailConfigured() ? 'We’ve emailed you a link to this badge. ' : ''}Bookmark this page or take a screenshot, so you have the QR code on the day.</li>
        </ul>
      </div>
    </section>
  );
}
