import React from 'react';
import { createMetadata } from '@/lib/metadata';
import PageHero from '@/components/shared/PageHero';
import FAQHubContent from '@/components/faq/FAQHubContent';
import { getMessages } from 'next-intl/server';

interface FAQPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: FAQPageProps) {
  const { locale } = await params;
  return createMetadata({
    title: locale === 'ar' ? 'مركز الأسئلة الشائعة | معهد تجويدو' : 'FAQ Knowledge Hub | Tajwedo Institute',
    description: locale === 'ar'
      ? 'إجابات شاملة لجميع الأسئلة حول باقات تجويدو، الحصص التجريبية، طرق التدريس والمعلمين المعتمدين.'
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
  const faqData = messages?.faq || {};
  const catKeys = ['general', 'lessons', 'pricing', 'scheduling', 'curriculum', 'technical'];
  
  const schemaQuestions: any[] = [];
  catKeys.forEach((cat) => {
    try {
      const count = Number(faqData[cat]?.count || 0);
      for (let i = 0; i < count; i++) {
        const q = faqData[cat]?.items?.[i]?.q;
        const a = faqData[cat]?.items?.[i]?.a;
        if (q && a) {
          schemaQuestions.push({
            '@type': 'Question',
            name: q,
            acceptedAnswer: {
              '@type': 'Answer',
              text: a,
            },
          });
        }
      }
    } catch {
      // Safe fallback
    }
  });

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: schemaQuestions,
  };

  return (
    <div className="pb-16 bg-[#FFFDF8]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <PageHero
        title={t('Frequently Asked Questions', 'مركز الأسئلة الشائعة')}
        subtitle={t(
          'Clear, comprehensive answers about our 1-on-1 Zoom lessons, Al-Azhar tutors, pricing, and schedules.',
          'إجابات شاملة حول حصص زووم الفردية، معلمي الأزهر المعتمدين، الباقات، والمواعيد.'
        )}
        badge={t('Knowledge Base', 'قاعدة المعرفة')}
        iconName="faq"
        breadcrumbs={[{ label: t('FAQ', 'الأسئلة الشائعة') }]}
      />
      <FAQHubContent />
    </div>
  );
}