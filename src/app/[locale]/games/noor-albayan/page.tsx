import React from 'react';
import { createMetadata } from '@/lib/metadata';
import NoorAlBayanGame from '@/components/games/noor-albayan/NoorAlBayanGame';

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { locale } = await params;
  return createMetadata({
    title: locale === 'ar' ? 'لعبة نور البيان للأطفال | تجويدو' : 'Noor Al-Bayan Reading Game for Kids | Tajwedo',
    description: locale === 'ar'
      ? 'طريقة تعلم تدريجية من الحروف إلى الكلمات إلى الجمل في القرآن الكريم.'
      : 'Progressive reading method from letters to words to sentences in the Holy Quran.',
    path: '/games/noor-albayan',
    locale,
  });
}

export default async function NoorAlBayanPage({ params }: PageProps) {
  await params;
  return <NoorAlBayanGame />;
}