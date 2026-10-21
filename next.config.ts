import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const securityHeaders = [
  { key: 'X-DNS-Prefetch-Control', value: 'on' },
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
];

const nextConfig: NextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [360, 420, 640, 750, 828, 1080, 1200],
    imageSizes: [16, 32, 48, 64, 96, 128],
    minimumCacheTTL: 31536000,
  },
  compress: true,
  poweredByHeader: false,
  async headers() {
    return [
      { source: '/:path*', headers: securityHeaders },
      {
        source: '/Tajwedo-Public-Assets/:path*',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
      },
      {
        source: '/_next/image',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
      },
    ];
  },
  async redirects() {
    return [
      // Legacy /games routes -> /curriculum (SEO-safe 301)
      { source: '/games', destination: '/curriculum', permanent: true },
      { source: '/games/:path*', destination: '/curriculum', permanent: true },
      { source: '/en/games', destination: '/en/curriculum', permanent: true },
      { source: '/en/games/:path*', destination: '/en/curriculum', permanent: true },
      { source: '/ar/games', destination: '/ar/curriculum', permanent: true },
      { source: '/ar/games/:path*', destination: '/ar/curriculum', permanent: true },
      // Legacy landing page
      { source: '/lp/quran-trial', destination: '/en', permanent: true },
      { source: '/en/lp/quran-trial', destination: '/en', permanent: true },
      { source: '/ar/lp/quran-trial', destination: '/ar', permanent: true },
    ];
  },
};

export default withNextIntl(nextConfig);