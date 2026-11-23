import type { NextRequest } from 'next/server';

const VALID_SOURCES = new Set(['sv','se','wv','we','av','ae','cv','ce','ev','ee']);

export function getLeadAdSource(request: NextRequest): string {
  const candidate = request.cookies.get('nw_lead_source')?.value?.toLowerCase();
  // Fallback covers a quick form submission before client-side tracking effect.
  const referer = request.headers.get('referer');
  let fromUrl: string | null = null;
  if (referer) {
    try {
      const url = new URL(referer);
      if (url.hostname === 'nepalwood.com.np' || url.hostname === 'www.nepalwood.com.np' ||
          (process.env.NODE_ENV !== 'production' && url.hostname === 'localhost')) {
        fromUrl = url.searchParams.get('utm_source')?.toLowerCase() || null;
      }
    } catch { /* Invalid referer: ignore */ }
  }
  if (fromUrl && VALID_SOURCES.has(fromUrl)) return fromUrl;
  return candidate && VALID_SOURCES.has(candidate) ? candidate : 'direct';
}
