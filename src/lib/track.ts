// Client-side analytics helpers. Events go to GA4 only when it has loaded (after cookie consent).
type Gtag = (...args: unknown[]) => void;

export function track(event: string, params: Record<string, unknown> = {}) {
  if (typeof window === 'undefined') return;
  const g = (window as unknown as { gtag?: Gtag }).gtag;
  if (g) g('event', event, params);
}

const KEY = 'nw_attribution';

/** First-touch attribution (UTM params + referrer), kept for the session and sent with every form. */
export function captureAttribution() {
  try {
    if (sessionStorage.getItem(KEY)) return;
    const p = new URLSearchParams(location.search);
    const data = {
      source: p.get('utm_source') || (document.referrer ? new URL(document.referrer).hostname : 'direct'),
      medium: p.get('utm_medium') || (document.referrer ? 'referral' : 'none'),
      campaign: p.get('utm_campaign') || '',
      referrer: document.referrer || '',
      landing: location.pathname,
    };
    sessionStorage.setItem(KEY, JSON.stringify(data));
  } catch {
    /* storage unavailable */
  }
}

export function attribution() {
  try {
    const raw = sessionStorage.getItem(KEY);
    return { ...(raw ? JSON.parse(raw) : {}), page: location.pathname };
  } catch {
    return { page: typeof location !== 'undefined' ? location.pathname : '' };
  }
}
