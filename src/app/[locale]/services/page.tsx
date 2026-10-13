import React from 'react';
import { createMetadata } from '@/lib/metadata';
import PageHero from '@/components/shared/PageHero';
import ServicesOverview from '@/components/home/ServicesOverview';

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { locale } = await params;
  return createMetadata({
    title: locale === 'ar' ? 'جميع الخدمات والبرامج | معهد تجويدو' : 'Our Quran & Arabic Learning Programs | Tajwedo Institute',
    description: locale === 'ar'
      ? 'استكشف برامج معهد تجويدو: تلاوة القرآن، التجويد، اللغة العربية، الدراسات الإسلامية، برنامج الأطفال، والمسلمين الجدد.'
      : 'Explore Tajwedo Institute programs: Quran Recitation, Tajweed, Arabic Language, Islamic Studies, Kids Program, and New Muslims.',
    path: '/services',
    locale,
  });
}

export default async function ServicesPage({ params }: PageProps) {
  const { locale } = await params;
  const isRTL = locale === 'ar';
  const t = (en: string, ar: string) => (isRTL ? ar : en);

  return (
    <div className="pb-16 bg-[#FFFDF8]">
      <PageHero 
        title={t('Comprehensive Islamic & Quranic Programs', 'برامج تعليمية شاملة ومصممة لكل متعلم')}
        subtitle={t(
          'From complete beginners to advanced students — discover programs designed to help you connect deeply with the Quran and Arabic.',
          'من المبتدئين إلى المتقدمين — اكتشف برامج مصممة لمساعدتك على التواصل العميق مع كتاب الله واللغة العربية.'
        )}
        badge={t('Educational Excellence', 'تميز وإتقان أكاديمي')}
        iconName="course"
        breadcrumbs={[{ label: t('Services', 'الخدمات') }]}
      />
      <ServicesOverview />
    </div>
  );
}