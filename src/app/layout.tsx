import React from 'react';
import type { Metadata, Viewport } from 'next';
import {
  plusJakarta,
  ibmPlexArabic,
  amiri,
  bodyFont,
  displayFont,
  arabicFont,
} from '@/lib/fonts';
import './globals.css';
import '../styles/animations.css';
import '../styles/islamic-patterns.css';
import { Geist } from 'next/font/google';
import { cn } from '@/lib/utils';
import GoogleTagManager, { GTMNoscript } from '@/components/shared/GoogleTagManager';

const geist = Geist({ subsets: ['latin'], variable: '--font-sans' });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://tajwedo.com'),
  title: {
    default: 'Tajwedo Institute | Online Quran & Arabic Education',
    template: '%s | Tajwedo Institute',
  },
  description:
    'Learn Quran, Tajweed, and Arabic online with certified Arab teachers holding authentic Ijazah. Personalized 1-on-1 live lessons on Zoom for kids, adults, and new Muslims.',
  applicationName: 'Tajwedo Institute',
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || '',
  },
  other: {
    'color-scheme': 'light only',
  },
  openGraph: {
    type: 'website',
    siteName: 'Tajwedo Institute',
    title: 'Tajwedo Institute | Online Quran & Arabic Education',
    description:
      'Learn Quran, Tajweed, and Arabic online with certified Arab teachers holding authentic Ijazah. Personalized 1-on-1 live lessons on Zoom for kids, adults, and new Muslims.',
    url: 'https://tajwedo.com',
    images: [{ url: '/Tajwedo-Public-Assets/herosection.webp', width: 1200, height: 630 }],
  },
  manifest: '/Tajwedo-Public-Assets/favicon-for-app/manifest.json',
  icons: {
    icon: [
      { url: '/Tajwedo-Public-Assets/favicon-for-app/favicon.ico', sizes: 'any' },
      { url: '/Tajwedo-Public-Assets/favicon-for-app/icon1.png', type: 'image/png' },
      { url: '/Tajwedo-Public-Assets/favicon-for-app/icon0.svg', type: 'image/svg+xml' },
    ],
    shortcut: [{ url: '/Tajwedo-Public-Assets/favicon-for-app/favicon.ico' }],
    apple: [
      {
        url: '/Tajwedo-Public-Assets/favicon-for-app/apple-icon.png',
        sizes: '180x180',
        type: 'image/png',
      },
    ],
  },
  appleWebApp: {
    capable: true,
    title: 'Tajwedo Institute',
    statusBarStyle: 'default',
  },
};

export const viewport: Viewport = {
  themeColor: '#0D4F4F',
  colorScheme: 'light',
};

const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Tajwedo Institute',
  alternateName: ['Tajwedo', 'معهد تجويدو', 'تجويدو'],
  url: 'https://tajwedo.com/',
};

const orgSchema = {
  '@context': 'https://schema.org',
  '@type': 'EducationalOrganization',
  name: 'Tajwedo Institute',
  alternateName: ['تجويدو', 'معهد تجويدو'],
  url: 'https://tajwedo.com',
  logo: 'https://tajwedo.com/Tajwedo-Public-Assets/logo.webp',
  description:
    'Online Quran, Tajweed, and Arabic Language Institute with certified Al-Azhar scholars.',
  sameAs: [
    'https://www.facebook.com/share/1HnKieS6Ry/',
    'https://www.instagram.com/tajwedo/',
    'https://t.me/TajwedoInstitute',
    'https://youtube.com/@tajwedoinstitute',
    'https://tiktok.com/@tajwedoinstitute',
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      data-scroll-behavior="smooth"
      suppressHydrationWarning
      style={{ colorScheme: 'light only' }}
      className={cn(
        plusJakarta.variable,
        ibmPlexArabic.variable,
        amiri.variable,
        bodyFont.variable,
        displayFont.variable,
        arabicFont.variable,
        geist.variable,
        'font-sans'
      )}
    >
      <head>
        <meta name="color-scheme" content="light only" />
        <meta name="supported-color-schemes" content="light" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
        />
        <GoogleTagManager />
      </head>
      <body
        suppressHydrationWarning
        className="min-h-screen flex flex-col bg-white text-gray-900"
        style={{
          fontFamily: 'var(--font-body, var(--font-sans))',
          colorScheme: 'light only',
          backgroundColor: '#ffffff',
        }}
      >
        <GTMNoscript />
        {children}
      </body>
    </html>
  );
}