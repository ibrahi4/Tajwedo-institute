import React from 'react';
import { createMetadata } from '@/lib/metadata';
import Container from '@/components/shared/Container';
import PageHero from '@/components/shared/PageHero';
import { Star, Quote, MapPin } from 'lucide-react';

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { locale } = await params;
  return createMetadata({
    title: locale === 'ar' ? 'آراء وتجارب الطلاب | معهد تجويدو' : 'Student & Parent Reviews | Tajwedo Institute',
    description: locale === 'ar'
      ? 'قصص حقيقية وتقييمات عائلات من بريطانيا وأمريكا وكندا وأستراليا يتعلمون القرآن والتجويد مع معهد تجويدو.'
      : 'Real stories and reviews from Muslim families across UK, USA, Canada, and Australia learning Quran with Tajwedo.',
    path: '/testimonials',
    locale,
  });
}

export default async function TestimonialsPage({ params }: PageProps) {
  const { locale } = await params;
  const isRTL = locale === 'ar';
  const t = (en: string, ar: string) => (isRTL ? ar : en);

  const reviews = [
    {
      name: 'Sarah Mitchell',
      location: 'Birmingham, UK',
      role: t('Mother of 2', 'أم لطالبين'),
      text: t(
        'Two years of weekend madrasa and she still could not read a page alone. Four months with Tajwedo and she reads Juz Amma unaided. The weekly report is what convinced me.',
        'سنتين مدرسة نهاية أسبوع ومقدرتش تقرأ صفحة لوحدها. أربع شهور هنا وبتقرأ جزء عم بدون مساعدة. التقرير الأسبوعي هو اللي أقنعني.'
      ),
    },
    {
      name: 'Bilal Hassan',
      location: 'Houston, USA',
      role: t('Adult Tajweed Student', 'طالب تجويد بالغ'),
      text: t(
        'I am 41 and was embarrassed to recite in jamaa\'ah. My teacher never once made me feel slow. Madd rules finally make perfect sense.',
        'عندي 41 سنة وكنت محرج أقرأ في الجماعة. المعلم ولا مرة حسسني إني بطيء. قواعد المد أخيراً بقت واضحة ومتقنة.'
      ),
    },
    {
      name: 'Maryam K.',
      location: 'Toronto, Canada',
      role: t('New Muslim / Revert', 'مسلمة جديدة'),
      text: t(
        'I took shahadah last year knowing zero Arabic letters. They started at the alphabet in English, assuming nothing. I pray properly now.',
        'أسلمت السنة الماضية ولم أكن أعرف حرفاً واحداً. بدأوا معي من الألف بالإنجليزي بدون تعقيد. الآن أصلي وأقرأ بثقة.'
      ),
    },
    {
      name: 'Imran Patel',
      location: 'Sydney, Australia',
      role: t('Hifz Parent', 'ولي أمر طالب حفظ'),
      text: t(
        'Timezone was my biggest worry. My son is at 5pm Sydney time, same dedicated teacher, same slot every single week since March.',
        'التوقيت كان أكبر همومي. ابني يدرس الساعة 5 مساءً بتوقيت سيدني، نفس المعلم ونفس الموعد كل أسبوع بحساب ودقة.'
      ),
    },
  ];

  const reviewsSchema = {
    '@context': 'https://schema.org',
    '@type': 'EducationalOrganization',
    name: 'Tajwedo Institute',
    url: 'https://tajwedo.com',
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      reviewCount: '500',
    },
    review: reviews.map((rev) => ({
      '@type': 'Review',
      author: { '@type': 'Person', name: rev.name },
      reviewRating: { '@type': 'Rating', ratingValue: '5', bestRating: '5' },
      reviewBody: rev.text,
    })),
  };

  return (
    <div className="pb-16 bg-[#FFFDF8]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(reviewsSchema) }}
      />
      <PageHero
        title={t('What Parents & Students Say About Tajwedo', 'ماذا يقول أولياء الأمور والطلاب عن تجويدو')}
        subtitle={t(
          'Real stories from Muslim families across the UK, USA, Canada, Australia, and Europe.',
          'قصص وتجارب حقيقية لعائلات مسلمة في المملكة المتحدة، أمريكا، كندا، أستراليا وأوروبا.'
        )}
        badge={t('Trusted Worldwide', 'ثقة العائلات عالمياً')}
        iconName="reviews"
        breadcrumbs={[{ label: t('Testimonials', 'آراء الطلاب') }]}
      />

      <Container className="pt-16">
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {reviews.map((rev, idx) => (
            <div key={idx} className="p-8 rounded-3xl bg-white border border-stone-200 shadow-sm relative space-y-4">
              <Quote className="w-10 h-10 text-amber-500/20 absolute top-6 end-6" />
              <div className="flex items-center gap-1 text-amber-500">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-500" />
                ))}
              </div>
              <p className="text-slate-700 leading-relaxed text-base italic">&ldquo;{rev.text}&rdquo;</p>
              <div className="pt-4 border-t border-stone-100 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-slate-900 text-base">{rev.name}</h3>
                  <p className="text-xs text-[#0D4F4F] font-semibold">{rev.role}</p>
                </div>
                <div className="flex items-center gap-1 text-xs text-slate-400">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{rev.location}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </div>
  );
}