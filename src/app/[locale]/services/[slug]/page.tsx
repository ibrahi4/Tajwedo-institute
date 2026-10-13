import React from 'react';
import { notFound } from 'next/navigation';
import { createMetadata } from '@/lib/metadata';
import Container from '@/components/shared/Container';
import PageHero from '@/components/shared/PageHero';
import { getServiceImage } from '@/lib/service-images';
import Image from 'next/image';
import { 
  CheckCircle2, ArrowRight, ArrowLeft, ShieldCheck, GraduationCap, 
  Clock, BookOpen, Star, Users, Check, Layers, Target, HelpCircle, MessageCircle 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from '@/i18n/navigation';
import { getMessages } from 'next-intl/server';

interface ServicePageProps {
  params: Promise<{ locale: string; slug: string }>;
}

const validSlugs = [
  'quran-recitation',
  'tajweed',
  'arabic-language',
  'islamic-studies',
  'kids-program',
  'new-muslims',
];

export async function generateStaticParams() {
  const locales = ['en', 'ar'];
  const params: { locale: string; slug: string }[] = [];

  for (const locale of locales) {
    for (const slug of validSlugs) {
      params.push({ locale, slug });
    }
  }
  return params;
}

export async function generateMetadata({ params }: ServicePageProps) {
  const { locale, slug } = await params;
  if (!validSlugs.includes(slug)) return {};

  const titles: Record<string, { en: string; ar: string }> = {
    'quran-recitation': {
      en: 'Online Quran Recitation & Memorization Classes | Tajwedo Institute',
      ar: 'دروس تلاوة القرآن الكريم وحفظه أونلاين | معهد تجويدو',
    },
    'tajweed': {
      en: 'Online Tajweed Course with Certified Al-Azhar Teachers | Tajwedo',
      ar: 'دورة إتقان أحكام التجويد أونلاين مع معلمين معتمدين | تجويدو',
    },
    'arabic-language': {
      en: 'Learn Quranic & Modern Standard Arabic Online | Tajwedo',
      ar: 'تعلم اللغة العربية والعربية القرآنية أونلاين | تجويدو',
    },
    'islamic-studies': {
      en: 'Online Islamic Studies for Kids, Adults & Reverts | Tajwedo',
      ar: 'الدراسات الإسلامية أونلاين للأطفال والكبار والمسلمين الجدد | تجويدو',
    },
    'kids-program': {
      en: '1-on-1 Online Quran & Arabic Classes for Kids | Tajwedo Institute',
      ar: 'برنامج القرآن واللغة العربية للأطفال أونلاين | معهد تجويدو',
    },
    'new-muslims': {
      en: 'Supportive Quran & Islamic Studies for New Muslims (Reverts) | Tajwedo',
      ar: 'برنامج تعليم الإسلام والقرآن للمسلمين الجدد | معهد تجويدو',
    },
  };

  const descriptions: Record<string, { en: string; ar: string }> = {
    'quran-recitation': {
      en: 'Master beautiful Quran recitation and Hifz from home with 1-on-1 certified Arab scholars holding authentic Ijazah. Free 30-minute trial.',
      ar: 'تعلم تلاوة القرآن الكريم بطلاقة وابدأ رحلة الحفظ مع معلمين عرب معتمدين من الأزهر الشريف. احجز حصة تجريبية مجانية.',
    },
    'tajweed': {
      en: 'Perfect your makharij, Ghunnah, and Tajweed rules with Hafs an Asim certified scholars. Personalized 1-on-1 Zoom sessions.',
      ar: 'أتقن مخارج الحروف وأحكام التجويد عملياً مع معلمين حاصلين على الإجازة بسند متصل في رواية حفص عن عاصم.',
    },
    'arabic-language': {
      en: 'From alphabet to fluency. Learn reading, writing, Nahw grammar, and Quranic Arabic with native English-fluent Arab teachers.',
      ar: 'من الحروف إلى الطلاقة. تعلم القراءة والكتابة والنحو والفهم القرآني مع معلمين عرب يتحدثون الإنجليزية بطلاقة.',
    },
    'islamic-studies': {
      en: 'Authentic Islamic studies covering Aqeedah, Fiqh of worship, Seerah, and daily Duas for Western Muslim families.',
      ar: 'تعليم إسلامي أصيل يشمل العقيدة والفقه والسيرة النبوية والأذكار اليومية بأسلوب مبسط وشامل للعائلات في الغرب.',
    },
    'kids-program': {
      en: 'Fun, engaging, and patient Quran and Arabic tuition for children aged 5+. 100% safe 1-on-1 online learning environment.',
      ar: 'دروس قرآن وعربية ممتعة وتفاعلية للأطفال من سن 5 سنوات في بيئة إلكترونية آمنة ومعلمين صبورين.',
    },
    'new-muslims': {
      en: 'Step-by-step supportive program for converts: Learn Shahada, daily Prayer (Salah), Quran reading, and core Islamic beliefs.',
      ar: 'برنامج داعم وصبور للمسلمين الجدد: تعلم الصلاة خطوة بخطوة، قراءة القرآن، وأساسيات العقيدة دون أي حرج.',
    },
  };

  const currentTitle = titles[slug]?.[locale as 'en' | 'ar'] || 'Program | Tajwedo Institute';
  const currentDesc = descriptions[slug]?.[locale as 'en' | 'ar'] || 'Learn Quran, Tajweed, and Arabic with Tajwedo Institute.';

  return createMetadata({
    title: currentTitle,
    description: currentDesc,
    path: `/services/${slug}`,
    ogImage: getServiceImage(slug),
    locale,
  });
}

export default async function ServiceDetailsPage({ params }: ServicePageProps) {
  const { locale, slug } = await params;
  if (!validSlugs.includes(slug)) notFound();

  const isRTL = locale === 'ar';
  const t = (en: string, ar: string) => (isRTL ? ar : en);
  const messages = (await getMessages()) as any;
  const serviceData = messages?.serviceDetails?.[slug] || {};
  const imageUrl = getServiceImage(slug);

  // Related Silo Articles
  const relatedArticles: Record<string, { slug: string; title: string }> = {
    'kids-program': {
      slug: 'best-online-quran-teacher-for-kids-uk',
      title: t('Read Guide: How to Choose the Best Quran Tutor for Kids in UK', 'اقرأ الدليل: كيف تختار أفضل معلم قرآن للأطفال في بريطانيا'),
    },
    'new-muslims': {
      slug: 'how-to-learn-quran-for-converts-non-arabic-speakers',
      title: t('Read Guide: Step-by-Step Quran & Salah Guide for Converts', 'اقرأ الدليل: تعلم القرآن والصلاة خطوة بخطوة للمسلمين الجدد'),
    },
    'tajweed': {
      slug: 'online-tajweed-classes-for-adults-usa',
      title: t('Read Guide: 1-on-1 Online Tajweed Classes for Adults in USA', 'اقرأ الدليل: دروس التجويد الفردية أونلاين للكبار في أمريكا'),
    },
  };

  const relatedArticle = relatedArticles[slug];

  // 1. Triple Schema: Course Data
  const courseSchema = {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: serviceData.title || slug,
    description: serviceData.subtitle || '',
    provider: {
      '@type': 'EducationalOrganization',
      name: 'Tajwedo Institute',
      sameAs: 'https://tajwedo.com',
      logo: 'https://tajwedo.com/Tajwedo-Public-Assets/logo.webp',
    },
    hasCourseInstance: {
      '@type': 'CourseInstance',
      courseMode: 'Online',
      courseWorkload: 'PT30M',
      instructor: {
        '@type': 'Person',
        name: 'Certified Al-Azhar Scholar',
      },
    },
  };

  // 2. Triple Schema: Breadcrumb Data
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: isRTL ? 'الرئيسية' : 'Home',
        item: `https://tajwedo.com/${locale}`,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: isRTL ? 'الخدمات والبرامج' : 'Services',
        item: `https://tajwedo.com/${locale}/services`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: serviceData.title || slug,
        item: `https://tajwedo.com/${locale}/services/${slug}`,
      },
    ],
  };

  // Extract arrays safely
  const statsList = serviceData.stats ? Object.values(serviceData.stats) : [];
  const featuresList = serviceData.features?.items ? Object.values(serviceData.features.items) : [];
  const curriculumLevels = serviceData.curriculum?.levels ? Object.values(serviceData.curriculum.levels) : [];
  const audienceList = serviceData.audience?.items ? Object.values(serviceData.audience.items) : [];

  return (
    <div className="pb-16 bg-[#FFFDF8]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(courseSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      {/* Page Hero */}
      <PageHero
        title={serviceData.title || slug}
        subtitle={serviceData.subtitle || ''}
        badge={serviceData.badge || 'Program'}
        iconName="course"
        breadcrumbs={[
          { label: t('Services', 'الخدمات'), href: '/services' },
          { label: serviceData.title || slug },
        ]}
      />

      <Container className="pt-12">
        {/* Stats Row */}
        {statsList.length > 0 && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto mb-16 text-center">
            {statsList.map((st: any, idx: number) => (
              <div key={idx} className="p-5 rounded-2xl bg-white border border-stone-200 shadow-sm">
                <p className="text-2xl sm:text-3xl font-bold text-[#0D4F4F]">{st.value}</p>
                <p className="text-xs text-slate-500 font-semibold uppercase mt-1">{st.label}</p>
              </div>
            ))}
          </div>
        )}

        {/* Featured Banner Image */}
        <div className="relative w-full max-w-4xl mx-auto h-64 sm:h-96 rounded-3xl overflow-hidden shadow-xl mb-16 border border-stone-200">
          <Image
            src={imageUrl}
            alt={serviceData.title || 'Service Image'}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 1000px"
            className="object-cover"
          />
        </div>

        {/* Contextual SEO Cross-Link */}
        {relatedArticle && (
          <div className="max-w-4xl mx-auto mb-16 p-5 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <BookOpen className="w-5 h-5 text-amber-600 shrink-0" />
              <span className="text-xs sm:text-sm font-bold text-slate-800">{relatedArticle.title}</span>
            </div>
            <Link
              href={`/blog/${relatedArticle.slug}`}
              className="shrink-0 text-xs font-bold text-[#0D4F4F] hover:underline flex items-center gap-1"
            >
              <span>{t('Read Guide', 'اقرأ الدليل')}</span>
              {isRTL ? <ArrowLeft className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
            </Link>
          </div>
        )}

        {/* Program Highlights (What You Will Learn) */}
        {featuresList.length > 0 && (
          <div className="max-w-4xl mx-auto mb-16">
            <div className="text-center mb-10">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">
                {serviceData.features?.title || t('What You Will Learn', 'ماذا ستتعلم في هذا البرنامج')}
              </h2>
              <p className="text-slate-600 text-sm">
                {serviceData.features?.subtitle || ''}
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {featuresList.map((feat: any, idx: number) => (
                <div key={idx} className="p-6 rounded-2xl bg-white border border-stone-200 shadow-sm flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[#0D4F4F]/10 text-[#0D4F4F] flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-base mb-1">{feat.title}</h3>
                    <p className="text-slate-600 text-sm leading-relaxed">{feat.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Curriculum Levels Breakdown */}
        {curriculumLevels.length > 0 && (
          <div className="max-w-4xl mx-auto mb-16">
            <div className="text-center mb-10">
              <span className="inline-block px-3 py-1 rounded-full bg-amber-500/10 text-amber-800 font-bold text-xs uppercase tracking-wider mb-2">
                {serviceData.curriculum?.badge || 'Curriculum'}
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">
                {serviceData.curriculum?.title || t('Structured Learning Path', 'مسار التعلم المنظم')}
              </h2>
              <p className="text-slate-600 text-sm">
                {serviceData.curriculum?.subtitle || ''}
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {curriculumLevels.map((lvl: any, idx: number) => {
                const topics = lvl.topics ? Object.values(lvl.topics) : [];
                return (
                  <div key={idx} className="p-6 rounded-3xl bg-white border border-stone-200 shadow-sm flex flex-col justify-between">
                    <div>
                      <div className="inline-block px-3 py-1 rounded-lg bg-stone-100 text-slate-700 text-xs font-bold mb-3">
                        Level 0{idx + 1}
                      </div>
                      <h3 className="text-lg font-bold text-slate-900 mb-2">{lvl.title}</h3>
                      <p className="text-slate-500 text-xs leading-relaxed mb-4">{lvl.description}</p>
                      
                      <ul className="space-y-2 border-t border-stone-100 pt-4">
                        {topics.map((tp: any, tpi: number) => (
                          <li key={tpi} className="flex items-start gap-2 text-xs text-slate-700">
                            <Check className="w-3.5 h-3.5 text-[#0D4F4F] shrink-0 mt-0.5" />
                            <span>{tp}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Target Audience Section */}
        {audienceList.length > 0 && (
          <div className="max-w-4xl mx-auto mb-16">
            <div className="text-center mb-10">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">
                {serviceData.audience?.title || t('Who Is This Course For?', 'لمن صمم هذا البرنامج؟')}
              </h2>
            </div>

            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
              {audienceList.map((aud: any, idx: number) => (
                <div key={idx} className="p-6 rounded-2xl bg-amber-500/5 border border-amber-500/15">
                  <Target className="w-6 h-6 text-[#C9A567] mb-3" />
                  <h3 className="font-bold text-slate-900 text-base mb-1">{aud.title}</h3>
                  <p className="text-slate-600 text-xs leading-relaxed">{aud.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Conversion CTA Card */}
        <div className="max-w-3xl mx-auto bg-[#0D4F4F] text-white p-8 sm:p-12 rounded-3xl shadow-xl text-center space-y-5">
          <div className="w-14 h-14 rounded-full bg-white/10 text-amber-400 flex items-center justify-center mx-auto">
            <GraduationCap className="w-7 h-7" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold leading-tight">
            {serviceData.serviceCta?.title || (isRTL ? 'جاهز للبدء مع معلم أزهري معتمد؟' : 'Ready to Start Your Journey?')}
          </h2>
          <p className="text-white/80 text-sm sm:text-base max-w-md mx-auto leading-relaxed">
            {serviceData.serviceCta?.subtitle || (isRTL ? 'احجز حصتك التجريبية المجانية 30 دقيقة بدون التزام مالي.' : 'Book your free 30-minute introductory lesson on Zoom with zero obligation.')}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            <Link href="/book-trial">
              <Button size="lg" className="w-full sm:w-auto rounded-xl bg-[#C9A567] hover:bg-[#b59255] text-slate-950 font-bold h-13 px-8">
                {serviceData.serviceCta?.bookTrial || (isRTL ? 'احجز الحصة التجريبية' : 'Book Free Trial')}
                {isRTL ? <ArrowLeft className="w-5 h-5 ms-2" /> : <ArrowRight className="w-5 h-5 ms-2" />}
              </Button>
            </Link>
          </div>
          <div className="flex items-center justify-center gap-2 pt-2 text-xs text-white/70">
            <ShieldCheck className="w-4 h-4 text-amber-400" />
            <span>{t('100% Free — Zero Financial Obligation', 'مجاني 100% — بدون أي التزام مالي')}</span>
          </div>
        </div>

      </Container>
    </div>
  );
}