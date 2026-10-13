import React from 'react';
import { createMetadata } from '@/lib/metadata';
import BookTrialContent from '@/components/book-trial/BookTrialContent';

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { locale } = await params;
  return createMetadata({
    title:
      locale === 'ar'
        ? 'احجز حصة تجريبية مجانية | معهد تجويدو'
        : 'Book a Free 30-Minute Trial Lesson | Tajwedo Institute',
    description:
      locale === 'ar'
        ? 'احجز تقييماً مجانياً لمدة 30 دقيقة عبر زووم مع معلم أزهري معتمد — بدون أي التزام مالي.'
        : 'Schedule a free 30-minute Quran assessment on Zoom with a certified Al-Azhar teacher. Zero obligation.',
    path: '/book-trial',
    locale,
  });
}

export default async function BookTrialPage({ params }: PageProps) {
  await params;
  return <BookTrialContent />;
}