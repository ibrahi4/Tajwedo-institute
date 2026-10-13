import React from 'react';
import { notFound } from 'next/navigation';
import { createMetadata } from '@/lib/metadata';
import Container from '@/components/shared/Container';
import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, User, ArrowLeft, ArrowRight, ShieldCheck } from 'lucide-react';
import { getServiceImage } from '@/lib/service-images';
import { getArticleBySlug, BLOG_ARTICLES } from '@/lib/blog-store';

interface BlogSlugProps {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateStaticParams() {
  const locales = ['en', 'ar'];
  const params: { locale: string; slug: string }[] = [];

  for (const locale of locales) {
    for (const slug of Object.keys(BLOG_ARTICLES)) {
      params.push({ locale, slug });
    }
  }
  return params;
}

export async function generateMetadata({ params }: BlogSlugProps) {
  const { locale, slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) return {};

  const lang = (locale === 'ar' ? 'ar' : 'en') as 'en' | 'ar';

  return createMetadata({
    title: `${article.title[lang]} | Tajwedo`,
    description: article.introduction[lang],
    path: `/blog/${slug}`,
    ogImage: getServiceImage('kids-program'),
    locale,
  });
}

export default async function BlogPostPage({ params }: BlogSlugProps) {
  const { locale, slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) notFound();

  const isRTL = locale === 'ar';
  const lang = (locale === 'ar' ? 'ar' : 'en') as 'en' | 'ar';

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: article.title[lang],
    description: article.introduction[lang],
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

  return (
    <div className="pt-28 pb-16 bg-[#FFFDF8]">
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
              {article.category}
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 leading-tight mb-6">
              {article.title[lang]}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-slate-500 border-b border-stone-200 pb-6">
              <div className="flex items-center gap-1.5">
                <User className="w-4 h-4 text-[#0D4F4F]" />
                <span>{article.author}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-[#0D4F4F]" />
                <span>{article.date}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-[#0D4F4F]" />
                <span>{article.readTime}</span>
              </div>
            </div>
          </header>

          <div className="relative w-full h-64 sm:h-96 rounded-3xl overflow-hidden shadow-md mb-10 border border-stone-200">
            <Image
              src={getServiceImage('kids-program')}
              alt={article.title[lang]}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 800px"
              className="object-cover"
            />
          </div>

          <div className="text-lg text-slate-700 leading-relaxed font-medium mb-8 p-6 bg-amber-500/5 rounded-2xl border border-amber-500/15">
            {article.introduction[lang]}
          </div>

          <div className="space-y-8 text-slate-700 leading-relaxed text-base md:text-lg">
            {article.sections.map((section, idx) => (
              <section key={idx} className="space-y-3">
                <h2 className="text-2xl font-bold text-slate-900 leading-snug">
                  {section.heading[lang]}
                </h2>
                <p className="text-slate-600 leading-relaxed">
                  {section.content[lang]}
                </p>
              </section>
            ))}
          </div>

          <div className="mt-10 pt-8 border-t border-stone-200">
            <h3 className="text-xl font-bold text-slate-900 mb-3">
              {article.conclusionTitle[lang]}
            </h3>
            <p className="text-slate-600 leading-relaxed">
              {article.conclusion[lang]}
            </p>
          </div>

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