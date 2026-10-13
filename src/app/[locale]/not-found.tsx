import React from 'react';
import Container from '@/components/shared/Container';
import PageHero from '@/components/shared/PageHero';
import { Button } from '@/components/ui/button';
import { Link } from '@/i18n/navigation';
import { ArrowLeft, ArrowRight, Home, MessageCircle, Search } from 'lucide-react';
import { WHATSAPP_LINK } from '@/lib/constants';

export default function NotFoundPage() {
  const whatsappUrl = `${WHATSAPP_LINK}?text=${encodeURIComponent(
    'Assalamu Alaikum, I reached a 404 page on Tajwedo Institute website and need assistance.'
  )}`;

  return (
    <div className="pb-16 bg-[#FFFDF8]">
      <PageHero
        title="Page Not Found (404)"
        subtitle="The page you are looking for might have been moved or updated. Let us help you get back on track."
        badge="Navigation Support"
        iconName="info"
        breadcrumbs={[{ label: '404 Error' }]}
      />

      <Container className="pt-16">
        <div className="max-w-2xl mx-auto text-center space-y-8 bg-white p-8 sm:p-12 rounded-3xl border border-stone-200 shadow-lg">
          <div className="w-20 h-20 rounded-full bg-[#0D4F4F]/10 text-[#0D4F4F] flex items-center justify-center mx-auto">
            <Search className="w-10 h-10 stroke-[2]" />
          </div>

          <div className="space-y-3">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
              Looking for Quran & Arabic Classes?
            </h2>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed max-w-md mx-auto">
              Explore our main certified programs or contact our admissions team on WhatsApp for instant assistance.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
            <Link href="/" className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto rounded-xl bg-[#0D4F4F] hover:bg-[#093D33] text-white font-bold h-13 px-8">
                <Home className="w-4 h-4 me-2" />
                <span>Return to Homepage</span>
              </Button>
            </Link>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto"
            >
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto rounded-xl border-stone-300 text-slate-800 font-bold h-13 px-8 hover:bg-stone-100"
              >
                <MessageCircle className="w-4 h-4 me-2 text-[#25D366]" />
                <span>Chat on WhatsApp</span>
              </Button>
            </a>
          </div>
        </div>
      </Container>
    </div>
  );
}