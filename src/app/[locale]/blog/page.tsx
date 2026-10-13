import React from 'react';
import { createMetadata } from '@/lib/metadata';
import Container from '@/components/shared/Container';
import PageHero from '@/components/shared/PageHero';
import { Link } from '@/i18n/navigation';
import { ArrowRight, ArrowLeft, Calendar, Clock } from 'lucide-react';
import { getAllArticles } from '@/lib/blog-store';

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { locale } = await params;
  return createMetadata({
    title: locale === 'ar' ? 'المدونة وحقيبة المعرفة | معهد تجويدو' : 'Blog & Quranic Learning Guides | Tajwedo Institute',
    description: locale === 'ar'
      ? 'مقالات ونشريات وأدلة شاملة في تعليم القرآن الكريم والتجويد واللغة العربية للأطفال والكبار والمسلمين الجدد.'
      : 'Guides and articles on Quran recitation, Tajweed, and Arabic learning for kids, adults, and new Muslims.',
    path: '/blog',
    locale,
  });
}

export default async function BlogPage({ params }: PageProps) {
  const { locale } = await params;
  const isRTL = locale === 'ar';
  const lang = (locale === 'ar' ? 'ar' : 'en') as 'en' | 'ar';
  const t = (en: string, ar: string) => (isRTL ? ar : en);

  const articles = getAllArticles();

  return (
    <div className="pb-16 bg-[#FFFDF8]">
      <PageHero
        title={t('Knowledge & Insights for Your Learning Journey', 'معرفة ونشريات لرحلة تعلمك')}
        subtitle={t(
          'Practical guides for parents, adults, and new Muslims — written for English-speaking families worldwide.',
          'أدلة عملية لأولياء الأمور والكبار والمسلمين الجدد — مكتوبة للعائلات الناطقة بالإنجليزية حول العالم.'
        )}
        badge={t('Our Blog', 'مدونتنا')}
        iconName="blog"
        breadcrumbs={[{ label: t('Blog', 'المدونة') }]}
      />

      <Container className="pt-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {articles.map((art) => (
            <Link
              key={art.slug}
              href={`/blog/${art.slug}`}
              className="group flex flex-col justify-between rounded-3xl bg-white border border-stone-200 p-6 shadow-sm hover:shadow-md hover:border-[#0D4F4F]/30 transition-all"
            >
              <div>
                <span className="inline-block px-2.5 py-1 rounded-full bg-[#0D4F4F]/10 text-[#0D4F4F] text-[10px] font-bold uppercase tracking-wider mb-3">
                  {art.category}
                </span>
                <h2 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-[#0D4F4F] transition-colors leading-snug">
                  {art.title[lang]}
                </h2>
                <p className="text-sm text-slate-600 leading-relaxed mb-4 line-clamp-3">
                  {art.introduction[lang]}
                </p>
              </div>

              <div>
                <div className="flex items-center justify-between text-xs text-slate-400 pt-4 border-t border-stone-100">
                  <span className="inline-flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {art.date}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {art.readTime}
                  </span>
                </div>
                <div className="mt-3 flex items-center gap-1 text-sm font-bold text-[#0D4F4F]">
                  <span>{t('Read guide', 'اقرأ الدليل')}</span>
                  {isRTL ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </div>
  );
}