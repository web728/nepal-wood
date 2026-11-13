import LeadList, { SheetMark, when } from '../LeadList';
import { COLLECTIONS } from '@/lib/db';
import { standTypeLabel } from '@/lib/forms';

export default async function Page({ searchParams }: { searchParams: Promise<Record<string, string>> }) {
  const sp = await searchParams;
  return (
    <LeadList
      title="Stand enquiries"
      collection={COLLECTIONS.exhibitors}
      sp={sp}
      exportType="exhibitors"
      statuses={['new', 'contacted', 'quoted', 'booked', 'lost']}
      searchFields={['company', 'name', 'email', 'phone', 'ref', 'country', 'city']}
      columns={[
        { label: 'Received', render: (d) => <><small>{when(d.createdAt)}</small><br /><code>{d.ref}</code> <SheetMark d={d} /></> },
        { label: 'Company', render: (d) => <><strong>{d.company}</strong><br /><small>{d.city}, {d.country}</small>{d.website && <><br /><small>{d.website}</small></>}</> },
        { label: 'Contact', render: (d) => <>{d.name}<br /><small>{d.designation}</small><br /><a href={`mailto:${d.email}`}>{d.email}</a><br /><a href={`tel:${d.phone}`}>{d.phone}</a></> },
        { label: 'Stand', render: (d) => <><strong>{d.areaSqm} sqm</strong><br /><small>{standTypeLabel[d.standType]}</small>{d.heavyMachinery && <><br /><span className="pill pill--warn">Heavy machinery</span></>}{d.sponsorship && <><br /><span className="pill pill--quoted">Sponsorship</span></>}</> },
        { label: 'Products', className: 'tbl__wide', render: (d) => <><small>{(d.zones || []).join(', ')}</small>{d.products && <p className="tbl__text">{d.products}</p>}{d.powerNeeds && <p className="tbl__text"><b>Power:</b> {d.powerNeeds}</p>}{d.message && <p className="tbl__text"><b>Msg:</b> {d.message}</p>}</> },
      ]}
    />
  );
}
