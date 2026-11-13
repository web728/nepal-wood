import { getDb, COLLECTIONS } from '@/lib/db';
import { saveTestimonial, deleteTestimonial } from '../../actions';

export default async function TestimonialsAdmin() {
  const db = await getDb();
  const rows = await db.collection(COLLECTIONS.testimonials).find().sort({ order: 1, createdAt: -1 }).toArray();
  return (
    <>
      <header className="admin__head"><div><h1>Testimonials</h1><p>Real quotes from exhibitors and visitors, published with their permission. They appear on the homepage and Why exhibit once at least one is published.</p></div></header>
      <section className="panel">
        <h2>Add testimonial</h2>
        <TForm />
      </section>
      <section className="panel panel--flush">
        <div className="tbl-wrap">
          <table className="tbl tbl--full">
            <thead><tr><th>Quote</th><th>Who</th><th>Status</th><th /></tr></thead>
            <tbody>
              {rows.map((r) => (
                <tr key={String(r._id)}>
                  <td className="tbl__wide"><p className="tbl__text">“{r.quote}”</p></td>
                  <td><strong>{r.name}</strong><br /><small>{[r.role, r.company].filter(Boolean).join(', ')}</small><br /><small>{r.edition}</small></td>
                  <td>{r.published ? <span className="pill pill--booked">Published</span> : <span className="pill">Draft</span>}</td>
                  <td>
                    <details className="row-edit"><summary className="admin-link">Edit</summary><TForm entry={{ ...r, _id: String(r._id) }} /></details>
                    <form action={deleteTestimonial}><input type="hidden" name="id" value={String(r._id)} /><button className="admin-link admin-link--danger" type="submit">Delete</button></form>
                  </td>
                </tr>
              ))}
              {!rows.length && <tr><td colSpan={4} className="muted">No testimonials yet. Collect a few at the show (video or written) and add them here.</td></tr>}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}

function TForm({ entry }: { entry?: Record<string, unknown> & { _id: string } }) {
  const e = (entry || {}) as Record<string, string | number | boolean | undefined>;
  return (
    <form action={saveTestimonial} className="admin-form">
      {entry && <input type="hidden" name="id" value={entry._id} />}
      <label className="span-2">Quote *<textarea name="quote" rows={3} required maxLength={600} defaultValue={e.quote as string} /></label>
      <label>Name *<input name="name" required defaultValue={e.name as string} /></label>
      <label>Role<input name="role" defaultValue={e.role as string} placeholder="e.g. Managing Director" /></label>
      <label>Company<input name="company" defaultValue={e.company as string} /></label>
      <label>Edition<input name="edition" defaultValue={e.edition as string} placeholder="e.g. Exhibitor, 11th edition" /></label>
      <label>Order<input name="order" type="number" defaultValue={(e.order as number) ?? 0} /></label>
      <label className="inline"><input type="checkbox" name="published" defaultChecked={entry ? Boolean(e.published) : false} />Published (permission received)</label>
      <button className="btn btn--sm" type="submit">{entry ? 'Save changes' : 'Add testimonial'}</button>
    </form>
  );
}
