import React from 'react';
import { createMetadata } from '@/lib/metadata';
import Container from '@/components/shared/Container';
import Image from 'next/image';
import { Award, BookOpen, CheckCircle2, Heart, Shield, Users } from 'lucide-react';

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { locale } = await params;
  return createMetadata({
    title: locale === 'ar' ? 'ماذا عنا وعن معلمينا | معهد تجويدو' : 'About Us & Our Certified Faculty | Tajwedo Institute',
    description: locale === 'ar'
      ? 'تعرّف على معهد تجويدو لتعليم القرآن الكريم والعربية. معلمون عرب معتمدون من الأزهر الشريف ومجازون بأسانيد متصلة.'
      : 'Learn about Tajwedo Institute. Dedicated Al-Azhar certified Arab scholars providing personalized online Quran and Arabic education.',
    path: '/about',
    locale,
  });
}

export default async function AboutPage({ params }: PageProps) {
  const { locale } = await params;
  const isRTL = locale === 'ar';

  const t = (en: string, ar: string) => (isRTL ? ar : en);

  return (
    <div className="pt-28 pb-16">
      <Container>
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <span className="inline-block px-3.5 py-1.5 rounded-full bg-[#0D4F4F]/10 text-[#0D4F4F] font-bold text-xs uppercase tracking-wider mb-4">
            {t('About Tajwedo Institute', 'عن معهد تجويدو')}
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-6 leading-tight">
            {t('Connecting Global Muslim Families with Authentic Quranic Scholarship', 'نصل العائلات المسلمة حول العالم بالعلم القرآني الأصيل')}
          </h1>
          <p className="text-slate-600 text-lg leading-relaxed">
            {t(
              'Tajwedo Institute was built to solve a clear problem: providing accessible, high-quality, 1-on-1 Quran and Arabic education taught by verified native Arab scholars holding authentic Ijazah.',
              'تأسس معهد تجويدو لسد فجوة واضحة: توفير تعليم قرآني وفردي عالي الجودة لغير الناطقين بالعربية، على يد علماء عرب معتمدين ومجازين بأسانيد متصلة.'
            )}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto mb-20 text-center">
          <div className="p-6 rounded-2xl bg-white border border-stone-200 shadow-sm">
            <Users className="w-8 h-8 text-[#0D4F4F] mx-auto mb-3" />
            <p className="text-3xl font-bold text-slate-900">500+</p>
            <p className="text-xs text-slate-500 font-semibold uppercase mt-1">{t('Active Students', 'طالب نشط')}</p>
          </div>
          <div className="p-6 rounded-2xl bg-white border border-stone-200 shadow-sm">
            <Award className="w-8 h-8 text-[#C9A567] mx-auto mb-3" />
            <p className="text-3xl font-bold text-slate-900">100%</p>
            <p className="text-xs text-slate-500 font-semibold uppercase mt-1">{t('Ijazah Certified Tutors', 'معلمون مجازون')}</p>
          </div>
          <div className="p-6 rounded-2xl bg-white border border-stone-200 shadow-sm">
            <BookOpen className="w-8 h-8 text-[#0D4F4F] mx-auto mb-3" />
            <p className="text-3xl font-bold text-slate-900">25+</p>
            <p className="text-xs text-slate-500 font-semibold uppercase mt-1">{t('Countries Served', 'دولة نخدمها')}</p>
          </div>
          <div className="p-6 rounded-2xl bg-white border border-stone-200 shadow-sm">
            <Heart className="w-8 h-8 text-[#C9A567] mx-auto mb-3" />
            <p className="text-3xl font-bold text-slate-900">4.9/5</p>
            <p className="text-xs text-slate-500 font-semibold uppercase mt-1">{t('Parent Rating', 'تقييم أولياء الأمور')}</p>
          </div>
        </div>

        {/* Values Section */}
        <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-8">
          <div className="p-6 rounded-2xl bg-white border border-stone-200">
            <Shield className="w-6 h-6 text-[#0D4F4F] mb-4" />
            <h3 className="text-lg font-bold text-slate-900 mb-2">{t('Authenticity', 'الأصالة والأمانة')}</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              {t('We verify the academic background and chain of narration (Sanad) of every scholar on our faculty.', 'نتحقق شخصياً من المؤهلات الأكاديمية وسلسلة أسانيد الإجازة لكل معلم في فريقنا.')}
            </p>
          </div>
          <div className="p-6 rounded-2xl bg-white border border-stone-200">
            <Users className="w-6 h-6 text-[#C9A567] mb-4" />
            <h3 className="text-lg font-bold text-slate-900 mb-2">{t('1-on-1 Focus', 'الاهتمام الفردي')}</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              {t('Zero crowded classrooms. Your child receives 100% focused personal instruction during every lesson.', 'لا توجد فصول جماعية مزدحمة. يحصل طفلك على تركيز وانتباه شخصي بنسبة 100% في كل حصة.')}
            </p>
          </div>
          <div className="p-6 rounded-2xl bg-white border border-stone-200">
            <CheckCircle2 className="w-6 h-6 text-[#0D4F4F] mb-4" />
            <h3 className="text-lg font-bold text-slate-900 mb-2">{t('Patient Pedagogy', 'الصبر والتشجيع')}</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              {t('Friendly, supportive teaching tailored for young children, converts, and non-Arabic speakers.', 'تعليم مشجع وصبور مصمم للأطفال الصغار، المسلمين الجدد، وغير الناطقين بالعربية.')}
            </p>
          </div>
        </div>
      </Container>
    </div>
  );
}