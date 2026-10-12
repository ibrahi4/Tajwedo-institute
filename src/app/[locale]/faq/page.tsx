import React from 'react';
import { createMetadata } from '@/lib/metadata';
import FAQPreview from '@/components/home/FAQPreview';
import { getMessages } from 'next-intl/server';

interface FAQPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: FAQPageProps) {
  const { locale } = await params;
  return createMetadata({
    title: locale === 'ar' ? 'الأسئلة الشائعة | معهد تجويدو' : 'Frequently Asked Questions | Tajwedo Institute',
    description: locale === 'ar'
      ? 'إجابات شاملة لجميع الأسئلة حول باقات تجويدو، الحصص التجريبية، طرق التدريس والمعلمين.'
      : 'Find detailed answers regarding Tajwedo pricing, 1-on-1 Zoom classes, teacher qualifications, and scheduling.',
    path: '/faq',
    locale,
  });
}

export default async function FAQPage({ params }: FAQPageProps) {
  const { locale } = await params;
  const messages = (await getMessages()) as any;
  const rawItems = messages?.faqPreview?.items || {};
  const faqItems = Array.isArray(rawItems) ? rawItems : Object.values(rawItems);

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqItems.map((item: any) => ({
      '@type': 'Question',
      name: item.question || item.q || '',
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer || item.a || '',
      },
    })),
  };

  return (
    <div className="pt-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <FAQPreview />
    </div>
  );
}