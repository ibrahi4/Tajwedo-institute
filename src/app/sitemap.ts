import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://tajwedo.com';
  const locales = ['en', 'ar'];
  const pages = [
    '',
    '/about',
    '/services',
    '/services/quran-recitation',
    '/services/tajweed',
    '/services/arabic-language',
    '/services/islamic-studies',
    '/services/kids-program',
    '/services/new-muslims',
    '/book-trial',
    '/blog',
    '/testimonials',
    '/contact',
    '/faq',
    '/how-it-works',
    '/games',
    '/pricing',
  ];

  const entries: MetadataRoute.Sitemap = [];

  for (const locale of locales) {
    for (const page of pages) {
      entries.push({
        url: `${baseUrl}/${locale}${page}`,
        lastModified: new Date(),
        changeFrequency: page === '' ? 'daily' : 'weekly',
        priority: page === '' ? 1.0 : 0.8,
        alternates: {
          languages: {
            en: `${baseUrl}/en${page}`,
            ar: `${baseUrl}/ar${page}`,
          },
        },
      });
    }
  }

  return entries;
}
