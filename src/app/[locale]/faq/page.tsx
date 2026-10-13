import React from 'react';
import { createMetadata } from '@/lib/metadata';
import PageHero from '@/components/shared/PageHero';
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
  const isRTL = locale === 'ar';
  const t = (en: string, ar: string) => (isRTL ? ar : en);
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
    <div className="pb-16 bg-[#FFFDF8]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <PageHero
        title={t('Frequently Asked Questions', 'الأسئلة الشائعة')}
        subtitle={t(
          'Clear answers about lessons, pricing, scheduling, and how Tajwedo works for families worldwide.',
          'إجابات واضحة حول الحصص والأسعار والمواعيد وكيف يعمل معهد تجويدو مع العائلات حول العالم.'
        )}
        badge={t('Help Center', 'مركز المساعدة')}
        iconName="faq"
        breadcrumbs={[{ label: t('FAQ', 'الأسئلة الشائعة') }]}
      />
      <FAQPreview />
    </div>
  );
}