'use client';

import { usePathname } from 'next/navigation';
import Navbar from './Navbar';
import Footer from './Footer';
import ScrollToTop from './ScrollToTop';
import WhatsAppButton from './WhatsAppButton';

export default function LayoutShellClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const clean = pathname.replace(/^\/(en|ar)/, '') || '/';
  const isHome = clean === '/';
  const isLandingPage = clean.startsWith('/lp/');

  // For Landing Pages, do not render main navbar/footer to maximize conversions
  if (isLandingPage) {
    return <>{children}</>;
  }

  return (
    <>
      <Navbar />
      <main className={isHome ? 'min-h-screen' : 'min-h-screen pt-16 md:pt-20'}>
        {children}
      </main>
      <Footer />
      <ScrollToTop />
      <WhatsAppButton />
    </>
  );
}