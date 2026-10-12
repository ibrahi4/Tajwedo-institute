import React from 'react';
import { createMetadata } from '@/lib/metadata';
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
  await params;

  return (
    <div className="pt-24">
      <HowItWorks />
    </div>
  );
}