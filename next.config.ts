import type { NextConfig } from 'next';

const securityHeaders = [
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  { key: 'Permissions-Policy', value: 'camera=(self), microphone=(), geolocation=()' },
];

const campaignLinks: Record<string, string> = {
  sv: '/visitor-registration?utm_source=sv&utm_medium=social',
  se: '/exhibitor-registration?utm_source=se&utm_medium=social',
  wv: '/visitor-registration?utm_source=wv&utm_medium=whatsapp',
  we: '/exhibitor-registration?utm_source=we&utm_medium=whatsapp',
  av: '/visitor-registration?utm_source=av&utm_medium=ads',
  ae: '/exhibitor-registration?utm_source=ae&utm_medium=ads',
  cv: '/visitor-registration?utm_source=cv&utm_medium=combined',
  ce: '/exhibitor-registration?utm_source=ce&utm_medium=combined',
  ev: '/visitor-registration?utm_source=ev&utm_medium=email',
  ee: '/exhibitor-registration?utm_source=ee&utm_medium=email',
};

const nextConfig: NextConfig = {
  poweredByHeader: false,
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 828, 1080, 1440, 1920, 2560],
  },
  serverExternalPackages: ['mongodb', 'nodemailer'],
  async headers() {
    return [
      { source: '/:path*', headers: securityHeaders },
      { source: '/admin/:path*', headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }] },
      { source: '/badge/:path*', headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }] },
    ];
  },
  async redirects() {
    return [
      { source: '/home', destination: '/', permanent: true },
      { source: '/about', destination: '/about-show', permanent: true },
      { source: '/exhibit', destination: '/why-exhibit', permanent: true },
      { source: '/visit', destination: '/why-visit', permanent: true },
      { source: '/book-a-stand', destination: '/exhibitor-registration', permanent: true },
      { source: '/register', destination: '/visitor-registration', permanent: true },
      { source: '/brochure', destination: '/downloads/event-brochure', permanent: true },
      { source: '/downloads', destination: '/downloads/event-brochure', permanent: true },
      { source: '/organizers', destination: '/about-organizers', permanent: true },
      { source: '/organisers', destination: '/about-organizers', permanent: true },
      ...Object.entries(campaignLinks).map(([code, destination]) => ({
        source: `/${code}`,
        destination,
        permanent: false,
      })),
    ];
  },
};
export default nextConfig;
