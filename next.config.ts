import type { NextConfig } from 'next';

const securityHeaders = [
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  { key: 'Permissions-Policy', value: 'camera=(self), microphone=(), geolocation=()' },
];

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
    // Old or likely-typed URLs from the previous site and print material go to their new homes.
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
      { source: '/conference', destination: '/seminars', permanent: true },
    ];
  },
};

export default nextConfig;
