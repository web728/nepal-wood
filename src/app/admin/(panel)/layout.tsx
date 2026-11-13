import Link from 'next/link';
import { requireAdmin } from '@/lib/auth';
import { logout } from '../actions';
import { dbConfigured } from '@/lib/db';
import { sheetsConfigured } from '@/lib/sheets';
import { mailConfigured } from '@/lib/mail';
import '../admin.css';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Dashboard', robots: { index: false, follow: false } };

const nav = [
  ['Overview', '/admin'],
  ['Stand enquiries', '/admin/exhibitors'],
  ['Visitors', '/admin/visitors'],
  ['Gate check-in', '/admin/checkin'],
  ['Enquiries', '/admin/enquiries'],
  ['Brochure leads', '/admin/brochure'],
  ['Exhibitor list', '/admin/directory'],
  ['Testimonials', '/admin/testimonials'],
];

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin();
  return (
    <div className="admin">
      <aside className="admin__side">
        <Link href="/admin" className="admin__brand"><img src="/brand/logo-reverse.svg" alt="Nepal Wood" width={120} height={52} /></Link>
        <nav>{nav.map(([l, h]) => <Link key={h} href={h}>{l}</Link>)}</nav>
        <div className="admin__status">
          <span className={dbConfigured() ? 'ok' : 'bad'}>MongoDB</span>
          <span className={sheetsConfigured() ? 'ok' : 'bad'}>Google Sheets</span>
          <span className={mailConfigured() ? 'ok' : 'bad'}>Email</span>
        </div>
        <div className="admin__foot">
          <Link href="/" target="_blank">View site ↗</Link>
          <form action={logout}><button type="submit">Sign out</button></form>
        </div>
      </aside>
      <main className="admin__main">{children}</main>
    </div>
  );
}
