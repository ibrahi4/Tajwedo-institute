import type { Metadata } from 'next';

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://tajwedo.com';

interface MetadataProps {
  title: string;
  description: string;
  path?: string;
  ogImage?: string;
  locale?: string;
}

export function createMetadata({
  title,
  description,
  path = '',
  ogImage = '/Tajwedo-Public-Assets/herosection.webp',
  locale = 'en',
}: MetadataProps): Metadata {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  const canonicalUrl = `${baseUrl}/${locale}${normalizedPath === '/' ? '' : normalizedPath}`;
  const ogImageUrl = ogImage.startsWith('http') ? ogImage : `${baseUrl}${ogImage}`;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
      languages: {
        en: `${baseUrl}/en${normalizedPath === '/' ? '' : normalizedPath}`,
        ar: `${baseUrl}/ar${normalizedPath === '/' ? '' : normalizedPath}`,
        'x-default': `${baseUrl}/en${normalizedPath === '/' ? '' : normalizedPath}`,
      },
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: 'Tajwedo Institute',
      locale: locale === 'ar' ? 'ar_EG' : 'en_US',
      type: 'website',
      images: [{ url: ogImageUrl, width: 1200, height: 630 }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImageUrl],
    },
  };
}