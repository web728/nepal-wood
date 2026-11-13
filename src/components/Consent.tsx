'use client';
import { useEffect, useState } from 'react';
import Script from 'next/script';
import Link from 'next/link';

const KEY = 'nw_consent'; // 'granted' | 'denied'

// Cookie banner + Google Analytics 4. GA loads only after the visitor accepts, and only if an ID is configured.
export default function Consent({ gaId }: { gaId?: string }) {
  const [choice, setChoice] = useState<string | null | undefined>(undefined);

  useEffect(() => {
    let v: string | null = null;
    try { v = localStorage.getItem(KEY); } catch { /* blocked storage: ask every visit */ }
    setChoice(v);
    const open = () => setChoice(null);
    const btns = document.querySelectorAll('[data-cookie-settings]');
    btns.forEach((b) => b.addEventListener('click', open));
    return () => btns.forEach((b) => b.removeEventListener('click', open));
  }, []);

  const decide = (v: 'granted' | 'denied') => {
    try { localStorage.setItem(KEY, v); } catch { /* ignore */ }
    setChoice(v);
  };

  if (!gaId) return null;
  return (
    <>
      {choice === 'granted' && (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`} strategy="afterInteractive" />
          <Script id="ga4" strategy="afterInteractive">{`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}window.gtag=gtag;gtag('js',new Date());gtag('config','${gaId}',{anonymize_ip:true});`}</Script>
        </>
      )}
      {choice === null && (
        <div className="consent" role="dialog" aria-live="polite" aria-label="Cookie preferences">
          <p>We use analytics cookies to understand which pages help exhibitors and visitors, and only if you agree. <Link href="/privacy-policy">Privacy policy</Link></p>
          <div className="consent__btns">
            <button type="button" className="btn btn--ghost btn--sm" onClick={() => decide('denied')}>Decline</button>
            <button type="button" className="btn btn--sm" onClick={() => decide('granted')}>Accept analytics</button>
          </div>
        </div>
      )}
    </>
  );
}
