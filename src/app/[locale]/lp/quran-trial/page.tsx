import type { Metadata } from 'next';
import LandingPageContent from '@/components/landing/LandingPageContent';

export const metadata: Metadata = {
  title: 'Free Quran Trial | Tajwedo Institute',
  description: 'Book your free 30-minute Quran assessment with a certified teacher.',
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
    },
  },
};

export default function QuranTrialLP() {
  return <LandingPageContent />;
}