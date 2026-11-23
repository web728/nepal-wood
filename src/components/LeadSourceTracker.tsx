'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

const VALID = new Set(['sv','se','wv','we','av','ae','cv','ce','ev','ee']);

export default function LeadSourceTracker() {
  const pathname = usePathname();
  const search = useSearchParams();

  useEffect(() => {
    const source = search.get('utm_source')?.toLowerCase();
    if (!source || !VALID.has(source)) return;
    // Only accept links arriving on their intended registration page.
    const expectedPath = source.endsWith('v')
      ? '/visitor-registration'
      : '/exhibitor-registration';
    if (pathname !== expectedPath) return;
    document.cookie = `nw_lead_source=${source}; Path=/; Max-Age=2592000; SameSite=Lax${location.protocol === 'https:' ? '; Secure' : ''}`;
  }, [pathname, search]);
  return null;
}
