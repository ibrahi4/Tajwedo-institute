import type { MetadataRoute } from 'next';
import { BLOG_ARTICLES } from '@/lib/blog-store';
import { PUBLISHED_COURSES } from '@/lib/curriculum';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://tajwedo.com';
  const locales = ['en', 'ar'];

  const staticPages = [
    '', '/about', '/services', '/services/quran-recitation', '/services/tajweed',
    '/services/arabic-language', '/services/islamic-studies', '/services/kids-program',
    '/services/new-muslims', '/book-trial', '/blog', '/testimonials', '/contact',
    '/faq', '/how-it-works', '/curriculum', '/pricing',
  ];

  const blogSlugs = Object.keys(BLOG_ARTICLES);
  const curriculumPages: string[] = [];
  for (const course of PUBLISHED_COURSES) {
    curriculumPages.push(`/curriculum/${course.slug}`);
    for (const lesson of course.lessons) {
      if (lesson.isPublished) {
        curriculumPages.push(`/curriculum/${course.slug}/${lesson.slug}`);
      }
    }
  }

  const allPages = [
    ...staticPages,
    ...blogSlugs.map((s) => `/blog/${s}`),
    ...curriculumPages,
  ];
  const lastModified = new Date();

  const entries: MetadataRoute.Sitemap = [];
  for (const locale of locales) {
    for (const page of allPages) {
      const path = page === '' ? '' : page;
      entries.push({
        url: `${baseUrl}/${locale}${path}`,
        lastModified,
        changeFrequency: page === '' ? 'daily' : 'weekly',
        priority:
          page === ''
            ? 1.0
            : page.startsWith('/curriculum')
              ? 0.95
              : page.startsWith('/services/')
                ? 0.9
                : 0.8,
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