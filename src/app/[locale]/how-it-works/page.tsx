import React from 'react';
import { createMetadata } from '@/lib/metadata';
import PageHero from '@/components/shared/PageHero';
import HowItWorks from '@/components/home/HowItWorks';

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { locale } = await params;
  return createMetadata({
    title: locale === 'ar' ? 'كيف يعمل المعهد | معهد تجويدو' : 'How It Works - 4 Easy Steps | Tajwedo Institute',
    description: locale === 'ar'
      ? 'خطوات بسيطة لبدء رحلة التعلم: حجز التجربة المجانية، تقييم المستوى، إعداد الخطة المخصصة، والبدء عبر زووم.'
      : 'Four simple steps to start learning: Book free trial, level evaluation, custom plan, and 1-on-1 Zoom sessions.',
    path: '/how-it-works',
    locale,
  });
}

export default async function HowItWorksPage({ params }: PageProps) {
  const { locale } = await params;
  const isRTL = locale === 'ar';
  const t = (en: string, ar: string) => (isRTL ? ar : en);

  return (
    <div className="pb-16 bg-[#FFFDF8]">
      <PageHero
        title={t('How Tajwedo Lessons Work', 'كيف تعمل حصص تجويدو')}
        subtitle={t(
          'From your first free assessment to weekly progress reports — a clear path designed for busy Muslim families.',
          'من أول تقييم مجاني حتى تقارير التقدم الأسبوعية — مسار واضح مصمم للعائلات المسلمة المشغولة.'
        )}
        badge={t('Simple Process', 'خطوات بسيطة')}
        iconName="how"
        breadcrumbs={[{ label: t('How It Works', 'كيف يعمل') }]}
      />
      <HowItWorks />
    </div>
  );
}