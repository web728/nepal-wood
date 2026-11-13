'use client';
import { useMemo, useState } from 'react';
import Icon from './Icon';
import type { DirectoryEntry } from '@/lib/public-data';

export default function DirectoryBrowser({ entries, zones }: { entries: DirectoryEntry[]; zones: string[] }) {
  const [q, setQ] = useState('');
  const [zone, setZone] = useState('');
  const [country, setCountry] = useState('');
  const countries = useMemo(() => [...new Set(entries.map((e) => e.country))].sort(), [entries]);
  const shown = entries.filter((e) => {
    const text = `${e.company} ${e.description || ''} ${e.city || ''}`.toLowerCase();
    return (!q || text.includes(q.toLowerCase())) && (!zone || e.zones.includes(zone)) && (!country || e.country === country);
  });
  return (
    <div className="directory">
      <div className="directory__filters">
        <label className="directory__search">
          <Icon name="search" />
          <input type="search" placeholder="Search exhibitors" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search exhibitors" />
        </label>
        <select value={zone} onChange={(e) => setZone(e.target.value)} aria-label="Filter by zone">
          <option value="">All zones</option>
          {zones.map((z) => <option key={z}>{z}</option>)}
        </select>
        <select value={country} onChange={(e) => setCountry(e.target.value)} aria-label="Filter by country">
          <option value="">All countries</option>
          {countries.map((c) => <option key={c}>{c}</option>)}
        </select>
        <span className="directory__count" aria-live="polite">{shown.length} of {entries.length}</span>
      </div>
      <ul className="directory__list">
        {shown.map((e) => (
          <li className="exhibitor" key={e._id}>
            <div className="exhibitor__logo">{e.logo ? <img src={e.logo} alt="" loading="lazy" /> : <span>{e.company.slice(0, 2).toUpperCase()}</span>}</div>
            <div className="exhibitor__body">
              <h3>{e.company}</h3>
              <p className="exhibitor__meta">{[e.city, e.country].filter(Boolean).join(', ')}{e.stand && <> · Stand <strong>{e.stand}</strong></>}</p>
              {e.description && <p className="exhibitor__desc">{e.description}</p>}
              <div className="exhibitor__tags">{e.zones.map((z) => <span className="tag" key={z}>{z}</span>)}</div>
            </div>
            {e.website && <a className="exhibitor__link" href={e.website.startsWith('http') ? e.website : `https://${e.website}`} target="_blank" rel="noopener nofollow" aria-label={`${e.company} website`}><Icon name="arrow-up-right" /></a>}
          </li>
        ))}
      </ul>
      {!shown.length && <p className="muted">No exhibitors match those filters yet.</p>}
    </div>
  );
}
