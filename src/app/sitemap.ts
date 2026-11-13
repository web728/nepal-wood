import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/site';
import { zones } from '@/lib/content';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const pages: [string, number, MetadataRoute.Sitemap[number]['changeFrequency']][] = [
    ['/', 1, 'weekly'],
    ['/exhibitor-registration', 0.95, 'weekly'],
    ['/visitor-registration', 0.95, 'weekly'],
    ['/why-exhibit', 0.85, 'monthly'],
    ['/exhibitor-profile', 0.8, 'monthly'],
    ['/why-visit', 0.8, 'monthly'],
    ['/visitor-profile', 0.7, 'monthly'],
    ['/exhibitors', 0.8, 'weekly'],
    ['/sponsorship', 0.7, 'monthly'],
    ['/venue', 0.75, 'monthly'],
    ['/seminars', 0.7, 'weekly'],
    ['/about-show', 0.7, 'monthly'],
    ['/about-organizers', 0.5, 'yearly'],
    ['/past-editions', 0.6, 'monthly'],
    ['/gallery', 0.6, 'monthly'],
    ['/faq', 0.6, 'monthly'],
    ['/contact', 0.6, 'yearly'],
    ['/downloads/event-brochure', 0.7, 'monthly'],
    ['/privacy-policy', 0.2, 'yearly'],
  ];
  return [
    ...pages.map(([p, priority, changeFrequency]) => ({ url: `${SITE_URL}${p === '/' ? '/' : p}`, lastModified: now, changeFrequency, priority })),
    ...zones.map((z) => ({ url: `${SITE_URL}/exhibitor-profile/${z.slug}`, lastModified: now, changeFrequency: 'monthly' as const, priority: 0.75 })),
  ];
}
