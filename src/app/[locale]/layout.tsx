import SiteNameJsonLd from '@/components/seo/SiteNameJsonLd';
import React from 'react';
import { getMessages } from 'next-intl/server';
import { NextIntlClientProvider } from 'next-intl';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import FloatingActions from '@/components/shared/FloatingActions';

interface LocaleLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const { locale } = await params;
  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={messages} locale={locale}>
      <div className="flex min-h-screen flex-col bg-[#FFFDF8]">
        <Navbar />
        <main className="flex-grow">{children}</main>
        <Footer />
      </div>
      <FloatingActions />
    </NextIntlClientProvider>
  );
}