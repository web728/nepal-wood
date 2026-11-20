import LeadList, { SheetMark, when } from '../LeadList';
import { COLLECTIONS } from '@/lib/db';
import { topicLabel } from '@/lib/forms';

export default async function Page({ searchParams }: { searchParams: Promise<Record<string, string>> }) {
  const sp = await searchParams;
  return (
    <LeadList
      title="Enquiries"
      collection={COLLECTIONS.enquiries}
      sp={sp}
      exportType="enquiries"
      statuses={['new', 'contacted', 'closed']}
      searchFields={['name', 'company', 'email', 'phone', 'message', 'ref']}
      columns={[
        { label: 'Received', render: (d) => <><small>{when(d.createdAt)}</small><br /><code>{d.ref}</code> <SheetMark d={d} /></> },
        { label: 'Topic', render: (d) => <span className="pill">{topicLabel[d.topic] || d.topic}</span> },
        { label: 'From', render: (d) => <><strong>{d.name}</strong>{d.company && <><br /><small>{d.company}</small></>}<br /><a href={`mailto:${d.email}`}>{d.email}</a><br /><a href={`tel:${d.phone}`}>{d.phone}</a></> },
        { label: 'Message', className: 'tbl__wide', render: (d) => <p className="tbl__text">{d.message}</p> },
      ]}
    />
  );
}
