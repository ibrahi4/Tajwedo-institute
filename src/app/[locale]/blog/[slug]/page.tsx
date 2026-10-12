import React from 'react';
import { notFound } from 'next/navigation';
import { createMetadata } from '@/lib/metadata';
import Container from '@/components/shared/Container';
import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, User, ArrowLeft, ArrowRight, ShieldCheck } from 'lucide-react';
import { getMessages } from 'next-intl/server';
import { getServiceImage } from '@/lib/service-images';

interface BlogSlugProps {
  params: Promise<{ locale: string; slug: string }>;
}

const validSlugs = [
  'how-to-start-learning-quran',
  'tajweed-tips-for-beginners',
  'benefits-of-memorizing-quran',
  'arabic-language-learning-guide',
  'new-muslim-first-steps',
  'teaching-quran-to-kids',
  'best-online-quran-teacher-for-kids-uk',
  'how-to-learn-quran-for-converts-non-arabic-speakers',
  'online-tajweed-classes-for-adults-usa',
  'online-quran-classes-for-5-year-old',
  'noorani-qaida-vs-noor-al-bayan-for-beginners',
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

export async function generateMetadata({ params }: BlogSlugProps) {
  const { locale, slug } = await params;
  if (!validSlugs.includes(slug)) return {};

  const messages = (await getMessages()) as any;
  const post = messages?.blogPosts?.[slug] || messages?.blog?.posts?.items?.find((i: any) => i.slug === slug);

  const title = post?.title || 'Article | Tajwedo Institute';
  const description = post?.introduction || post?.excerpt || 'Read insights from Tajwedo Institute.';

  return createMetadata({
    title: `${title} | Tajwedo`,
    description,
    path: `/blog/${slug}`,
    ogImage: getServiceImage('kids-program'),
    locale,
  });
}

export default async function BlogPostPage({ params }: BlogSlugProps) {
  const { locale, slug } = await params;
  if (!validSlugs.includes(slug)) notFound();

  const isRTL = locale === 'ar';
  const messages = (await getMessages()) as any;
  const postData = messages?.blogPosts?.[slug];

  if (!postData) {
    notFound();
  }

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: postData.title,
    description: postData.introduction,
    image: `https://tajwedo.com${getServiceImage('kids-program')}`,
    author: {
      '@type': 'EducationalOrganization',
      name: 'Tajwedo Institute',
      url: 'https://tajwedo.com',
    },
    publisher: {
      '@type': 'EducationalOrganization',
      name: 'Tajwedo Institute',
      logo: {
        '@type': 'ImageObject',
        url: 'https://tajwedo.com/Tajwedo-Public-Assets/logo.webp',
      },
    },
    datePublished: '2026-10-02',
    dateModified: '2026-10-02',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://tajwedo.com/${locale}/blog/${slug}`,
    },
  };

  const sectionsCount = Number(postData.sectionsCount || 0);

  return (
    <div className="pt-24 pb-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <Container>
        <div className="mb-8">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-[#0D4F4F] transition-colors"
          >
            {isRTL ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
            <span>{isRTL ? 'العودة للمدونة' : 'Back to Blog'}</span>
          </Link>
        </div>

        <article className="max-w-3xl mx-auto">
          <header className="mb-8">
            <span className="inline-block px-3 py-1 rounded-full bg-[#0D4F4F]/10 text-[#0D4F4F] text-xs font-bold uppercase tracking-wider mb-4">
              {postData.category || 'Article'}
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 leading-tight mb-6">
              {postData.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-slate-500 border-b border-stone-200 pb-6">
              <div className="flex items-center gap-1.5">
                <User className="w-4 h-4 text-[#0D4F4F]" />
                <span>{postData.author || 'Tajwedo Institute'}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-[#0D4F4F]" />
                <span>{postData.date}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-[#0D4F4F]" />
                <span>{postData.readTime}</span>
              </div>
            </div>
          </header>

          <div className="relative w-full h-64 sm:h-96 rounded-3xl overflow-hidden shadow-md mb-10 border border-stone-200">
            <Image
              src={getServiceImage('kids-program')}
              alt={postData.title}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 800px"
              className="object-cover"
            />
          </div>

          <div className="text-lg text-slate-700 leading-relaxed font-medium mb-8 p-6 bg-amber-500/5 rounded-2xl border border-amber-500/15">
            {postData.introduction}
          </div>

          <div className="space-y-8 text-slate-700 leading-relaxed text-base md:text-lg">
            {Array.from({ length: sectionsCount }).map((_, idx) => {
              const section = postData.sections?.[idx];
              if (!section) return null;
              return (
                <section key={idx} className="space-y-3">
                  <h2 className="text-2xl font-bold text-slate-900 leading-snug">
                    {section.heading}
                  </h2>
                  <p className="text-slate-600 leading-relaxed">
                    {section.content}
                  </p>
                </section>
              );
            })}
          </div>

          {postData.conclusion && (
            <div className="mt-10 pt-8 border-t border-stone-200">
              <h3 className="text-xl font-bold text-slate-900 mb-3">
                {postData.conclusionTitle || (isRTL ? 'خلاصة' : 'Final Thoughts')}
              </h3>
              <p className="text-slate-600 leading-relaxed">
                {postData.conclusion}
              </p>
            </div>
          )}

          <div className="mt-12 p-8 rounded-3xl bg-[#0D4F4F] text-white shadow-xl text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center mx-auto text-amber-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-bold">
              {isRTL ? 'جرّب حصة فردية مجانية لطفلك الآن' : 'Experience a Free 1-on-1 Lesson for Your Child'}
            </h3>
            <p className="text-white/80 text-sm max-w-md mx-auto leading-relaxed">
              {isRTL
                ? 'احصل على تقييم مباشر لمدة 30 دقيقة عبر زووم مع معلم أزهري متخصص في تعليم الأطفال الغربيين.'
                : 'Get a 30-minute live assessment on Zoom with an Al-Azhar tutor specializing in Western students.'}
            </p>
            <Link href="/book-trial" className="inline-block pt-2">
              <Button size="lg" className="rounded-xl bg-[#C9A567] hover:bg-[#b59255] text-slate-950 font-bold h-13 px-8">
                {isRTL ? 'احجز التقييم المجاني' : 'Book Free Trial Lesson'}
                {isRTL ? <ArrowLeft className="w-5 h-5 ms-2" /> : <ArrowRight className="w-5 h-5 ms-2" />}
              </Button>
            </Link>
          </div>
        </article>
      </Container>
    </div>
  );
}