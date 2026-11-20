import LeadList, { SheetMark, when } from '../LeadList';
import { COLLECTIONS } from '@/lib/db';

export default async function Page({ searchParams }: { searchParams: Promise<Record<string, string>> }) {
  const sp = await searchParams;
  return (
    <LeadList
      title="Visitors"
      collection={COLLECTIONS.visitors}
      sp={sp}
      exportType="visitors"
      searchFields={['name', 'company', 'email', 'phone', 'badgeId', 'city']}
      columns={[
        { label: 'Badge', render: (d) => <><code>{d.badgeId}</code> <SheetMark d={d} /><br /><small>{when(d.createdAt)}</small></> },
        { label: 'Visitor', render: (d) => <><strong>{d.name}</strong><br /><small>{d.designation}</small></> },
        { label: 'Company', render: (d) => <>{d.company}<br /><small>{d.businessType}</small></> },
        { label: 'Contact', render: (d) => <><a href={`mailto:${d.email}`}>{d.email}</a><br /><a href={`tel:${d.phone}`}>{d.phone}</a><br /><small>{d.city}, {d.country}</small></> },
        { label: 'Interests', className: 'tbl__wide', render: (d) => <small>{(d.interests || []).join(', ')}</small> },
        { label: 'Check-in', render: (d) => (d.checkedInAt ? <span className="pill pill--booked">{when(d.checkedInAt)}</span> : <span className="muted">—</span>) },
        { label: 'Badge page', render: (d) => <a className="admin-link" href={`/badge/${d.token}`} target="_blank">Open ↗</a> },
      ]}
    />
  );
}
