'use client';

import { usePathname } from 'next/navigation';
import Navbar from './Navbar';
import Footer from './Footer';
import ScrollToTop from './ScrollToTop';
import WhatsAppButton from './WhatsAppButton';

export default function LayoutShellClient({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const clean = pathname.replace(/^\/(en|ar)/, '') || '/';
  const isHome = clean === '/';

  return (
    <>
      <Navbar />
      <main className={`min-h-screen ${isHome ? '' : 'pt-16 md:pt-20'}`}>{children}</main>
      <Footer />
      <ScrollToTop />
      <WhatsAppButton />
    </>
  );
}