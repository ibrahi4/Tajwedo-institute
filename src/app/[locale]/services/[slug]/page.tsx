import React from 'react';
import { notFound } from 'next/navigation';
import { createMetadata } from '@/lib/metadata';
import Container from '@/components/shared/Container';
import { getServiceImage } from '@/lib/service-images';
import Image from 'next/image';
import { CheckCircle2, ArrowRight, ArrowLeft, ShieldCheck, GraduationCap, Clock, HelpCircle, BookOpen, Star } from 'lucide-react';
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
      en: 'Master fluent Quran recitation and Hifz from home with 1-on-1 certified Arab scholars holding authentic Ijazah. Free 30-minute trial.',
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
  const messages = (await getMessages()) as any;
  const serviceData = messages?.serviceDetails?.[slug] || {};
  const imageUrl = getServiceImage(slug);

  const t = (en: string, ar: string) => (isRTL ? ar : en);

  // Cross-linking articles map for Silo PageRank distribution
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

  return (
    <div className="pt-28 pb-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(courseSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <Container>
        {/* Breadcrumbs View */}
        <nav className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-8" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-[#0D4F4F] transition-colors">{t('Home', 'الرئيسية')}</Link>
          <span>/</span>
          <Link href="/services" className="hover:text-[#0D4F4F] transition-colors">{t('Services', 'الخدمات')}</Link>
          <span>/</span>
          <span className="text-[#0D4F4F] font-bold">{serviceData.title || slug}</span>
        </nav>

        {/* Hero Section */}
        <div className="max-w-3xl mx-auto text-center mb-12">
          <span className="inline-block px-3.5 py-1.5 rounded-full bg-[#0D4F4F]/10 text-[#0D4F4F] font-bold text-xs uppercase tracking-wider mb-4">
            {serviceData.badge || 'Program'}
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-4 leading-tight">
            {serviceData.title}
          </h1>
          <p className="text-slate-600 text-lg leading-relaxed">
            {serviceData.subtitle}
          </p>
        </div>

        {/* Featured Image */}
        <div className="relative w-full max-w-4xl mx-auto h-64 sm:h-96 rounded-3xl overflow-hidden shadow-xl mb-12 border border-stone-200">
          <Image
            src={imageUrl}
            alt={serviceData.title || 'Service Image'}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 1000px"
            className="object-cover"
          />
        </div>

        {/* Contextual SEO Cross-Link (Silo PageRank Transfer) */}
        {relatedArticle && (
          <div className="max-w-3xl mx-auto mb-12 p-5 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <BookOpen className="w-5 h-5 text-amber-600 shrink-0" />
              <span className="text-xs sm:text-sm font-bold text-slate-800">{relatedArticle.title}</span>
            </div>
            <Link
              href={`/blog/${relatedArticle.slug}`}
              className="shrink-0 text-xs font-bold text-[#0D4F4F] hover:underline flex items-center gap-1"
            >
              <span>{t('Read Article', 'اقرأ المقال')}</span>
              {isRTL ? <ArrowLeft className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
            </Link>
          </div>
        )}

        {/* Conversion Action Box */}
        <div className="max-w-3xl mx-auto bg-white p-8 sm:p-10 rounded-3xl border border-stone-200 shadow-lg text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-[#0D4F4F]/10 text-[#0D4F4F] flex items-center justify-center mx-auto">
            <GraduationCap className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900">
            {isRTL ? 'جاهز للبدء مع معلم أزهري معتمد؟' : 'Ready to Learn with a Certified Al-Azhar Scholar?'}
          </h2>
          <p className="text-slate-600 text-sm max-w-md mx-auto leading-relaxed">
            {isRTL
              ? 'احجز جلستك التقييمية المجانية لمدة 30 دقيقة عبر زووم لتحديد مستواك وإعداد خطتك المخصصة.'
              : 'Book a free 30-minute live assessment on Zoom to evaluate your level and custom roadmap.'}
          </p>
          <Link href="/book-trial" className="inline-block pt-2">
            <Button size="lg" className="rounded-xl bg-[#0D4F4F] hover:bg-[#093D33] text-white font-bold h-13 px-8 shadow-md">
              {isRTL ? 'احجز الحصة التجريبية المجانية' : 'Book Free Trial Lesson'}
              {isRTL ? <ArrowLeft className="w-5 h-5 ms-2" /> : <ArrowRight className="w-5 h-5 ms-2" />}
            </Button>
          </Link>
          <div className="flex items-center justify-center gap-2 pt-2 text-xs text-slate-500">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>{t('100% Free — Zero Financial Obligation', 'مجاني 100% — بدون أي التزام مالي')}</span>
          </div>
        </div>
      </Container>
    </div>
  );
}