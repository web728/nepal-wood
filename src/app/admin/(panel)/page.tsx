import Link from 'next/link';
import { getDb, COLLECTIONS } from '@/lib/db';
import { sheetsConfigured } from '@/lib/sheets';
import { retrySheetSync } from '../actions';
import { event } from '@/lib/site';

const fmt = (d: Date) => new Date(d).toLocaleString('en-GB', { timeZone: 'Asia/Kathmandu', day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });

export default async function Dashboard() {
  const db = await getDb();
  const since = new Date(Date.now() - 24 * 3600 * 1000);
  const c = (col: string, q = {}) => db.collection(col).countDocuments(q);
  const [vis, vis24, checked, ex, ex24, booked, enq, br, failed] = await Promise.all([
    c(COLLECTIONS.visitors), c(COLLECTIONS.visitors, { createdAt: { $gte: since } }), c(COLLECTIONS.visitors, { checkedInAt: { $ne: null } }),
    c(COLLECTIONS.exhibitors), c(COLLECTIONS.exhibitors, { createdAt: { $gte: since } }), c(COLLECTIONS.exhibitors, { status: 'booked' }),
    c(COLLECTIONS.enquiries), c(COLLECTIONS.brochure),
    Promise.all([COLLECTIONS.exhibitors, COLLECTIONS.visitors, COLLECTIONS.enquiries, COLLECTIONS.brochure].map((col) => c(col, { 'sheet.ok': false, 'sheet.skipped': { $ne: true } }))).then((a) => a.reduce((x, y) => x + y, 0)),
  ]);
  const recentEx = await db.collection(COLLECTIONS.exhibitors).find().sort({ createdAt: -1 }).limit(6).toArray();
  const recentVis = await db.collection(COLLECTIONS.visitors).find().sort({ createdAt: -1 }).limit(6).toArray();
  const byInterest = await db.collection(COLLECTIONS.visitors).aggregate([{ $unwind: '$interests' }, { $group: { _id: '$interests', n: { $sum: 1 } } }, { $sort: { n: -1 } }]).toArray();
  const bySource = await db.collection(COLLECTIONS.visitors).aggregate([{ $group: { _id: { $ifNull: ['$meta.source', 'direct'] }, n: { $sum: 1 } } }, { $sort: { n: -1 } }, { $limit: 8 }]).toArray();
  const days = Math.ceil((new Date(event.countdownTarget).getTime() - Date.now()) / 864e5);

  return (
    <>
      <header className="admin__head">
        <div><h1>Overview</h1><p>{days > 0 ? `${days} days to opening · ${event.datesLabel}` : event.datesLabel}</p></div>
        <div className="admin__head-actions">
          <a className="btn btn--ghost btn--sm" href="/api/admin/export?type=visitors">Export visitors CSV</a>
          <a className="btn btn--sm" href="/api/admin/export?type=exhibitors">Export stand enquiries CSV</a>
        </div>
      </header>

      <div className="kpis">
        <Link className="kpi" href="/admin/visitors"><span>Visitors registered</span><strong>{vis.toLocaleString()}</strong><small>+{vis24} in 24 h</small></Link>
        <Link className="kpi" href="/admin/checkin"><span>Checked in</span><strong>{checked.toLocaleString()}</strong><small>{vis ? Math.round((checked / vis) * 100) : 0}% of registered</small></Link>
        <Link className="kpi kpi--accent" href="/admin/exhibitors"><span>Stand enquiries</span><strong>{ex}</strong><small>+{ex24} in 24 h · {booked} booked</small></Link>
        <Link className="kpi" href="/admin/enquiries"><span>Enquiries</span><strong>{enq}</strong><small>Contact & sponsorship</small></Link>
        <Link className="kpi" href="/admin/brochure"><span>Brochure downloads</span><strong>{br}</strong><small>Gated leads</small></Link>
      </div>

      {sheetsConfigured() ? (
        failed > 0 && (
          <form action={async () => { 'use server'; await retrySheetSync(); }} className="admin-alert">
            <span>{failed} record(s) haven’t reached Google Sheets yet.</span>
            <button className="btn btn--sm" type="submit">Retry sync now</button>
          </form>
        )
      ) : (
        <div className="admin-alert admin-alert--info">Google Sheets isn’t connected yet. Leads are safe in MongoDB. See <code>integrations/google-sheets/SETUP.md</code> to connect a sheet, then use “Retry sync” to backfill.</div>
      )}

      <div className="admin-grid">
        <section className="panel">
          <h2>Latest stand enquiries</h2>
          <table className="tbl"><tbody>
            {recentEx.map((d) => <tr key={String(d._id)}><td><strong>{d.company}</strong><br /><small>{d.name} · {d.country}</small></td><td>{d.areaSqm} sqm</td><td><span className={`pill pill--${d.status}`}>{d.status}</span></td><td><small>{fmt(d.createdAt)}</small></td></tr>)}
            {!recentEx.length && <tr><td className="muted">No enquiries yet.</td></tr>}
          </tbody></table>
        </section>
        <section className="panel">
          <h2>Latest visitors</h2>
          <table className="tbl"><tbody>
            {recentVis.map((d) => <tr key={String(d._id)}><td><strong>{d.name}</strong><br /><small>{d.company} · {d.city}</small></td><td><code>{d.badgeId}</code></td><td><small>{fmt(d.createdAt)}</small></td></tr>)}
            {!recentVis.length && <tr><td className="muted">No registrations yet.</td></tr>}
          </tbody></table>
        </section>
        <section className="panel">
          <h2>Visitor interests</h2>
          <ul className="mini-bars">{byInterest.map((r) => <li key={r._id}><span>{r._id}</span><b style={{ ['--w' as string]: `${(r.n / (byInterest[0]?.n || 1)) * 100}%` }} /><em>{r.n}</em></li>)}</ul>
          {!byInterest.length && <p className="muted">Appears once visitors register.</p>}
        </section>
        <section className="panel">
          <h2>Where visitors come from</h2>
          <ul className="mini-bars">{bySource.map((r) => <li key={String(r._id)}><span>{String(r._id)}</span><b style={{ ['--w' as string]: `${(r.n / (bySource[0]?.n || 1)) * 100}%` }} /><em>{r.n}</em></li>)}</ul>
          <p className="muted small">Add <code>?utm_source=whatsapp&utm_campaign=roadshow</code> to links you share to track campaigns.</p>
        </section>
      </div>
    </>
  );
}
