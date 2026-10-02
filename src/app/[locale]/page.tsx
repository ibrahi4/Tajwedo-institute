import React from 'react';
import { createMetadata } from '@/lib/metadata';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import HeroSection from '@/components/home/HeroSection';
import TrustBar from '@/components/home/TrustBar';
import QuranVerse from '@/components/home/QuranVerse';
import ServicesOverview from '@/components/home/ServicesOverview';
import HowItWorks from '@/components/home/HowItWorks';
import WhyChooseMe from '@/components/home/WhyChooseMe';
import FAQPreview from '@/components/home/FAQPreview';

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { locale } = await params;

  return createMetadata({
    title:
      locale === 'ar'
        ? 'معهد تجويدو | تعليم القرآن الكريم والتجويد والعربية أونلاين'
        : 'Tajwedo Institute | Online 1-on-1 Quran, Tajweed & Arabic Classes',
    description:
      locale === 'ar'
        ? 'تعلم القرآن الكريم والتجويد واللغة العربية أونلاين عبر حصص فردية مباشرة مع معلمين عرب معتمدين من الأزهر.'
        : 'Learn Quran, Tajweed, and Arabic online with certified Al-Azhar teachers. Personalized 1-on-1 live lessons on Zoom for kids, adults, and new Muslims.',
    path: '/',
    locale: locale,
  });
}

export default async function HomePage({ params }: PageProps) {
  await params;

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Navbar />
      <main className="flex-grow">
        <HeroSection />
        <TrustBar />
        <QuranVerse />
        <ServicesOverview />
        <HowItWorks />
        <WhyChooseMe />
        <FAQPreview />
      </main>
      <Footer />
    </div>
  );
}