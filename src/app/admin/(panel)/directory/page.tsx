import { getDb, COLLECTIONS } from '@/lib/db';
import { saveDirectoryEntry, deleteDirectoryEntry } from '../../actions';
import { zones, countries } from '@/lib/content';

export default async function DirectoryAdmin() {
  const db = await getDb();
  const rows = await db.collection(COLLECTIONS.directory).find().sort({ company: 1 }).toArray();
  return (
    <>
      <header className="admin__head"><div><h1>Exhibitor list</h1><p>Confirmed exhibitors shown on <a className="admin-link" href="/exhibitors" target="_blank">/exhibitors</a>. Only “Published” entries are public.</p></div></header>
      <section className="panel">
        <h2>Add exhibitor</h2>
        <DirectoryForm />
      </section>
      <section className="panel panel--flush">
        <div className="tbl-wrap">
          <table className="tbl tbl--full">
            <thead><tr><th>Company</th><th>Stand</th><th>Zones</th><th>Status</th><th /></tr></thead>
            <tbody>
              {rows.map((r) => (
                <tr key={String(r._id)}>
                  <td><strong>{r.company}</strong><br /><small>{[r.city, r.country].filter(Boolean).join(', ')}</small></td>
                  <td>{r.stand || '—'}</td>
                  <td><small>{(r.zones || []).join(', ')}</small></td>
                  <td>{r.published ? <span className="pill pill--booked">Published</span> : <span className="pill">Draft</span>}</td>
                  <td>
                    <details className="row-edit"><summary className="admin-link">Edit</summary><DirectoryForm entry={{ ...r, _id: String(r._id) }} /></details>
                    <form action={deleteDirectoryEntry}><input type="hidden" name="id" value={String(r._id)} /><button className="admin-link admin-link--danger" type="submit">Delete</button></form>
                  </td>
                </tr>
              ))}
              {!rows.length && <tr><td colSpan={5} className="muted">No exhibitors yet. Add confirmed exhibitors above as stands are booked.</td></tr>}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}

function DirectoryForm({ entry }: { entry?: Record<string, unknown> & { _id: string } }) {
  const e = (entry || {}) as Record<string, string | string[] | boolean | undefined>;
  const selected = (e.zones as string[]) || [];
  return (
    <form action={saveDirectoryEntry} className="admin-form">
      {entry && <input type="hidden" name="id" value={entry._id} />}
      <label>Company *<input name="company" required defaultValue={e.company as string} /></label>
      <label>Country *<select name="country" defaultValue={(e.country as string) || 'Nepal'}>{countries.map((c) => <option key={c}>{c}</option>)}</select></label>
      <label>City<input name="city" defaultValue={e.city as string} /></label>
      <label>Stand no.<input name="stand" defaultValue={e.stand as string} placeholder="e.g. A17" /></label>
      <label>Website<input name="website" defaultValue={e.website as string} placeholder="www.example.com" /></label>
      <label>Logo URL<input name="logo" defaultValue={e.logo as string} placeholder="https://… or /participants/p001.webp" /></label>
      <label className="span-2">Short description<textarea name="description" rows={2} defaultValue={e.description as string} maxLength={400} /></label>
      <fieldset className="span-2"><legend>Zones</legend>{zones.map((z) => <label key={z.slug} className="inline"><input type="checkbox" name="zones" value={z.title} defaultChecked={selected.includes(z.title)} />{z.title}</label>)}</fieldset>
      <label className="inline"><input type="checkbox" name="published" defaultChecked={entry ? Boolean(e.published) : true} />Published</label>
      <button className="btn btn--sm" type="submit">{entry ? 'Save changes' : 'Add exhibitor'}</button>
    </form>
  );
}
