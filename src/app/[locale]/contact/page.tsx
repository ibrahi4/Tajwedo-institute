import React from 'react';
import { createMetadata } from '@/lib/metadata';
import Container from '@/components/shared/Container';
import PageHero from '@/components/shared/PageHero';
import { Mail, MessageCircle } from 'lucide-react';
import { WHATSAPP_LINK, EMAIL } from '@/lib/constants';

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { locale } = await params;
  return createMetadata({
    title: locale === 'ar' ? 'تواصل معنا | معهد تجويدو' : 'Contact Admissions & Support | Tajwedo Institute',
    description: locale === 'ar'
      ? 'تواصل مباشرة مع فريق القبول بمعهد تجويدو عبر الواتساب أو البريد الإلكتروني لحجز الحصص وتنسيق المواعيد.'
      : 'Get in touch with Tajwedo Institute admissions team via WhatsApp or Email for class bookings and schedule support.',
    path: '/contact',
    locale,
  });
}

export default async function ContactPage({ params }: PageProps) {
  const { locale } = await params;
  const isRTL = locale === 'ar';
  const t = (en: string, ar: string) => (isRTL ? ar : en);

  const whatsappUrl = `${WHATSAPP_LINK}?text=${encodeURIComponent(
    t('Assalamu Alaikum, I would like to contact admissions.', 'السلام عليكم، أود التواصل مع إدارة القبول.')
  )}`;

  return (
    <div className="pb-16 bg-[#FFFDF8]">
      <PageHero
        title={t('We Are Here to Support Your Family', 'نحن هنا لمساعدة وتوجيه عائلتك')}
        subtitle={t(
          'Have questions about our tutors, curricula, or time zone availability? Our admissions team typically responds within 2 hours.',
          'هل لديك أي استفسارات عن المعلمين، المناهج، أو التوقيتات؟ يجيب فريق القبول عادة خلال ساعتين.'
        )}
        badge={t('Get in Touch', 'تواصل معنا')}
        iconName="contact"
        breadcrumbs={[{ label: t('Contact', 'تواصل معنا') }]}
      />

      <Container className="pt-16">
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <div className="p-8 rounded-3xl bg-emerald-50 border border-emerald-200 text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-[#25D366] text-white flex items-center justify-center mx-auto shadow-md">
              <MessageCircle className="w-7 h-7" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900">{t('WhatsApp Support', 'محادثة الواتساب')}</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              {t('Fastest response for trial bookings, schedules, and urgent inquiries.', 'الرد الأسرع لحجز التجربة، تنسيق الجداول، والاستفسارات العاجلة.')}
            </p>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 w-full h-12 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-sm transition-all shadow-md"
            >
              <MessageCircle className="w-5 h-5" />
              <span>{t('Chat on WhatsApp Now', 'تحدث معنا عبر الواتساب')}</span>
            </a>
          </div>

          <div className="p-8 rounded-3xl bg-white border border-stone-200 text-center space-y-4 shadow-sm">
            <div className="w-14 h-14 rounded-full bg-[#0D4F4F]/10 text-[#0D4F4F] flex items-center justify-center mx-auto">
              <Mail className="w-7 h-7" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900">{t('Email Support', 'البريد الإلكتروني')}</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              {t('For formal inquiries, feedback, and academic document submissions.', 'للاستفسارات التفصيلية والملاحظات ومستندات التسجيل.')}
            </p>
            <a
              href={`mailto:${EMAIL}`}
              className="inline-flex items-center justify-center gap-2 w-full h-12 rounded-xl bg-[#0D4F4F] hover:bg-[#093D33] text-white font-bold text-sm transition-all shadow-md"
            >
              <Mail className="w-5 h-5" />
              <span>{EMAIL}</span>
            </a>
          </div>
        </div>
      </Container>
    </div>
  );
}