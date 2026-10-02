import React from 'react';
import { getMessages } from 'next-intl/server';
import { NextIntlClientProvider } from 'next-intl';
import FloatingActions from '@/components/shared/FloatingActions';

interface LocaleLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export default function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const { locale } = React.use(params);
  const messages = React.use(getMessages());

  return (
    <NextIntlClientProvider messages={messages} locale={locale}>
      {children}
      <FloatingActions />
    </NextIntlClientProvider>
  );
}