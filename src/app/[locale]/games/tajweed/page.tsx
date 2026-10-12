import React from 'react';
import { createMetadata } from '@/lib/metadata';
import TajweedGame from '@/components/games/tajweed/TajweedGame';

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { locale } = await params;
  return createMetadata({
    title: locale === 'ar' ? 'لعبة أحكام التجويد للأطفال | تجويدو' : 'Tajweed Rules Game for Kids | Tajwedo',
    description: locale === 'ar'
      ? 'أتقن قواعد تلاوة القرآن من خلال تحديات ملونة وممتعة للأطفال.'
      : 'Master Quran recitation rules through colorful, engaging challenges for children.',
    path: '/games/tajweed',
    locale,
  });
}

export default async function TajweedGamePage({ params }: PageProps) {
  await params;
  return <TajweedGame />;
}