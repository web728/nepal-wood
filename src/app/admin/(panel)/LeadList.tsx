import Link from 'next/link';
import type { Document, Filter } from 'mongodb';
import { getDb } from '@/lib/db';
import { updateLead } from '../actions';

export type Column = { label: string; render: (d: Document) => React.ReactNode; className?: string };

const PAGE = 50;
const esc = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
export const when = (d: Date) => new Date(d).toLocaleString('en-GB', { timeZone: 'Asia/Kathmandu', day: '2-digit', month: 'short', year: '2-digit', hour: '2-digit', minute: '2-digit' });

export default async function LeadList({ title, collection, columns, searchFields, sp, statuses, exportType, extraFilter, note }: {
  title: string; collection: string; columns: Column[]; searchFields: string[]; sp: { q?: string; page?: string; status?: string };
  statuses?: string[]; exportType?: string; extraFilter?: Filter<Document>; note?: React.ReactNode;
}) {
  const db = await getDb();
  const q = (sp.q || '').trim().slice(0, 80);
  const page = Math.max(1, Number(sp.page || 1));
  const filter: Filter<Document> = { ...(extraFilter || {}) };
  if (q) filter.$or = searchFields.map((f) => ({ [f]: { $regex: esc(q), $options: 'i' } }));
  if (sp.status && statuses?.includes(sp.status)) filter.status = sp.status;
  const [rows, total] = await Promise.all([
    db.collection(collection).find(filter).sort({ createdAt: -1 }).skip((page - 1) * PAGE).limit(PAGE).toArray(),
    db.collection(collection).countDocuments(filter),
  ]);
  const pages = Math.max(1, Math.ceil(total / PAGE));
  const qs = (p: number) => `?${new URLSearchParams({ ...(q ? { q } : {}), ...(sp.status ? { status: sp.status } : {}), page: String(p) })}`;

  return (
    <>
      <header className="admin__head">
        <div><h1>{title}</h1><p>{total.toLocaleString()} record{total === 1 ? '' : 's'}{q ? ` matching “${q}”` : ''}</p></div>
        {exportType && <div className="admin__head-actions"><a className="btn btn--sm" href={`/api/admin/export?type=${exportType}`}>Export CSV</a></div>}
      </header>
      {note}
      <form className="admin-filters" method="get">
        <input type="search" name="q" defaultValue={q} placeholder="Search name, company, email, phone…" aria-label="Search" />
        {statuses && (
          <select name="status" defaultValue={sp.status || ''} aria-label="Status">
            <option value="">All statuses</option>
            {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        )}
        <button className="btn btn--sm" type="submit">Filter</button>
        {(q || sp.status) && <Link href="?" className="admin-link">Clear</Link>}
      </form>
      <div className="panel panel--flush">
        <div className="tbl-wrap">
          <table className="tbl tbl--full">
            <thead><tr>{columns.map((c) => <th key={c.label} className={c.className}>{c.label}</th>)}{statuses && <th>Status & notes</th>}</tr></thead>
            <tbody>
              {rows.map((d) => (
                <tr key={String(d._id)}>
                  {columns.map((c) => <td key={c.label} className={c.className}>{c.render(d)}</td>)}
                  {statuses && (
                    <td className="tbl__status">
                      <form action={updateLead} className="status-form">
                        <input type="hidden" name="collection" value={collection} />
                        <input type="hidden" name="id" value={String(d._id)} />
                        <select name="status" defaultValue={d.status} aria-label="Status">{statuses.map((s) => <option key={s}>{s}</option>)}</select>
                        <textarea name="notes" defaultValue={d.notes || ''} rows={2} placeholder="Notes (synced to the sheet)" aria-label="Notes" />
                        <button type="submit" className="admin-link">Save</button>
                      </form>
                    </td>
                  )}
                </tr>
              ))}
              {!rows.length && <tr><td colSpan={columns.length + 1} className="muted">Nothing here yet.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
      {pages > 1 && (
        <nav className="pager" aria-label="Pages">
          {page > 1 && <Link href={qs(page - 1)}>← Prev</Link>}
          <span>Page {page} of {pages}</span>
          {page < pages && <Link href={qs(page + 1)}>Next →</Link>}
        </nav>
      )}
    </>
  );
}

export function SheetMark({ d }: { d: Document }) {
  if (!d.sheet) return <span className="sheet sheet--wait" title="Not synced yet">●</span>;
  if (d.sheet.skipped) return <span className="sheet sheet--off" title="Sheets not configured">●</span>;
  return d.sheet.ok ? <span className="sheet sheet--ok" title="In Google Sheets">●</span> : <span className="sheet sheet--bad" title={d.sheet.error}>●</span>;
}
