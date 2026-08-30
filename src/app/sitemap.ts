import type { MetadataRoute } from 'next';
export default function sitemap(): MetadataRoute.Sitemap {
  const url = process.env.NEXT_PUBLIC_SITE_URL || 'https://tajwedo.com';
  const pages = ['', '/about', '/services', '/book-trial', '/blog', '/testimonials', '/contact', '/faq', '/how-it-works', '/games', '/pricing'];
  const entries: MetadataRoute.Sitemap = [];
  for (const locale of ['en', 'ar']) {
    for (const page of pages) {
      entries.push({
        url: url + '/' + locale + page,
        lastModified: new Date(),
        changeFrequency: page === '' ? 'daily' : 'weekly',
        priority: page === '' ? 1.0 : 0.8,
        alternates: { languages: { en: url + '/en' + page, ar: url + '/ar' + page } },
      });
    }
  }
  return entries;
}