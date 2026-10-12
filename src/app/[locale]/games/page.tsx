import React from 'react';
import { createMetadata } from '@/lib/metadata';
import GamesHubContent from '@/components/games/GamesHubContent';

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { locale } = await params;
  return createMetadata({
    title: locale === 'ar' ? 'ألعاب تعليم القرآن والعربية للأطفال | تجويدو' : 'Interactive Arabic & Quran Games for Kids | Tajwedo',
    description: locale === 'ar'
      ? 'ألعاب تفاعلية ممتعة لتعليم الأطفال الحروف العربية، قواعد التجويد، والقراءة الصحيحة.'
      : 'Fun interactive games designed for children to learn Arabic alphabet, Tajweed rules, and Quran reading.',
    path: '/games',
    locale,
  });
}

export default async function GamesPage({ params }: PageProps) {
  await params;
  return <GamesHubContent />;
}