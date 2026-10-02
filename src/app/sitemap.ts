import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://tajwedo.com';
  const locales = ['en', 'ar'];

  const staticPages = [
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
    '/games/arabic-letters',
    '/games/tajweed',
    '/games/noor-albayan',
    '/pricing',
  ];

  const blogSlugs = [
    'how-to-start-learning-quran',
    'tajweed-tips-for-beginners',
    'benefits-of-memorizing-quran',
    'arabic-language-learning-guide',
    'new-muslim-first-steps',
    'teaching-quran-to-kids',
  ];

  const allPages = [...staticPages, ...blogSlugs.map((s) => `/blog/${s}`)];
  const lastModified = new Date('2026-10-02T00:00:00.000Z');

  const entries: MetadataRoute.Sitemap = [];

  for (const locale of locales) {
    for (const page of allPages) {
      const path = page === '' ? '' : page;
      entries.push({
        url: `${baseUrl}/${locale}${path}`,
        lastModified,
        changeFrequency: page === '' ? 'daily' : 'weekly',
        priority: page === '' ? 1.0 : page.startsWith('/services/') ? 0.9 : 0.8,
        alternates: {
          languages: {
            en: `${baseUrl}/en${path}`,
            ar: `${baseUrl}/ar${path}`,
            'x-default': `${baseUrl}/en${path}`,
          },
        },
      });
    }
  }

  return entries;
}