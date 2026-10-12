import React from 'react';
import { createMetadata } from '@/lib/metadata';
import ArabicLettersGame from '@/components/games/arabic-letters/ArabicLettersGame';

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { locale } = await params;
  return createMetadata({
    title: locale === 'ar' ? 'لعبة الحروف العربية للأطفال | تجويدو' : 'Arabic Letters Game for Kids | Tajwedo',
    description: locale === 'ar'
      ? 'تعلم الـ 28 حرفاً عربياً مع رسوم متحركة وأصوات وتمارين تفاعلية ممتعة للأطفال.'
      : 'Learn all 28 Arabic letters with fun animations, native sounds, and interactive exercises for kids.',
    path: '/games/arabic-letters',
    locale,
  });
}

export default async function ArabicLettersPage({ params }: PageProps) {
  await params;
  return <ArabicLettersGame />;
}