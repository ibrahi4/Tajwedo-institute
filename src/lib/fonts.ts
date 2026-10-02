import { Plus_Jakarta_Sans, IBM_Plex_Sans_Arabic, Amiri } from 'next/font/google';

export const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  variable: '--font-sans',
  display: 'swap',
});

export const ibmPlexArabic = IBM_Plex_Sans_Arabic({
  subsets: ['arabic'],
  weight: ['400', '600', '700'],
  variable: '--font-ibm-plex-arabic',
  display: 'swap',
});

export const amiri = Amiri({
  subsets: ['arabic'],
  weight: ['400', '700'],
  variable: '--font-quran',
  display: 'swap',
});

export const bodyFont = plusJakarta;
export const displayFont = plusJakarta;
export const arabicFont = ibmPlexArabic;
export const amiriQuran = amiri;