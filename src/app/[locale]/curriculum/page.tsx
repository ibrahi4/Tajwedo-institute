import type { Metadata } from 'next';
import { getLocale } from 'next-intl/server';
import { createMetadata } from '@/lib/metadata';
import { PUBLISHED_COURSES } from '@/lib/curriculum';
import CurriculumHub from '@/components/curriculum/CurriculumHub';

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  return createMetadata({
    title: 'Free Interactive Quran & Arabic Curriculum | Tajwedo Institute',
    description:
      'Learn Quran reading, Tajweed, Arabic, and Islamic Studies with our free interactive curriculum. Taught in English, built by expert teachers, used live in our 1-on-1 Zoom classes.',
    path: '/curriculum',
    locale,
  });
}

export default async function CurriculumPage() {
  const locale = await getLocale();

  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Tajwedo Institute Curriculum',
    description: 'Free interactive courses in Quran, Arabic, Tajweed, and Islamic Studies',
    itemListElement: PUBLISHED_COURSES.map((course, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      item: {
        '@type': 'Course',
        name: course.titleEn,
        description: course.taglineEn,
        provider: {
          '@type': 'EducationalOrganization',
          name: 'Tajwedo Institute',
          url: 'https://tajwedo.com',
        },
        url: `https://tajwedo.com/${locale}/curriculum/${course.slug}`,
        hasCourseInstance: {
          '@type': 'CourseInstance',
          courseMode: 'online',
          courseWorkload: `PT${Math.round(course.totalMinutes / 60)}H`,
        },
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD',
          category: 'Free',
          availability: 'https://schema.org/InStock',
        },
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />
      <CurriculumHub locale={locale} />
    </>
  );
}