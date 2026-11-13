import LeadList, { SheetMark, when } from '../LeadList';
import { COLLECTIONS } from '@/lib/db';

export default async function Page({ searchParams }: { searchParams: Promise<Record<string, string>> }) {
  const sp = await searchParams;
  return (
    <LeadList
      title="Brochure leads"
      collection={COLLECTIONS.brochure}
      sp={sp}
      exportType="brochure"
      searchFields={['name', 'company', 'email', 'phone']}
      columns={[
        { label: 'When', render: (d) => <><small>{when(d.createdAt)}</small> <SheetMark d={d} /></> },
        { label: 'Name', render: (d) => <strong>{d.name}</strong> },
        { label: 'Company', render: (d) => d.company },
        { label: 'Contact', render: (d) => <><a href={`mailto:${d.email}`}>{d.email}</a><br /><a href={`tel:${d.phone}`}>{d.phone}</a></> },
        { label: 'Interest', render: (d) => <span className="pill">{d.interest}</span> },
        { label: 'Source', render: (d) => <small>{d.meta?.source || 'direct'}</small> },
      ]}
    />
  );
}
