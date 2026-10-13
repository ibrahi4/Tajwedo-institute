import React from 'react';
import { createMetadata } from '@/lib/metadata';
import Container from '@/components/shared/Container';
import PageHero from '@/components/shared/PageHero';
import { Link } from '@/i18n/navigation';
import { ArrowRight, ArrowLeft, Calendar, Clock } from 'lucide-react';
import { getMessages } from 'next-intl/server';

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { locale } = await params;
  return createMetadata({
    title: locale === 'ar' ? 'المدونة | معهد تجويدو' : 'Blog & Learning Guides | Tajwedo Institute',
    description: locale === 'ar'
      ? 'مقالات ونصائح حول تعليم القرآن والتجويد والعربية للأطفال والكبار والمسلمين الجدد.'
      : 'Guides and articles on Quran, Tajweed, and Arabic learning for kids, adults, and new Muslims.',
    path: '/blog',
    locale,
  });
}

export default async function BlogPage({ params }: PageProps) {
  const { locale } = await params;
  const isRTL = locale === 'ar';
  const t = (en: string, ar: string) => (isRTL ? ar : en);
  const messages = (await getMessages()) as any;
  const posts = messages?.blog?.posts?.items || {};
  const postList = Array.isArray(posts) ? posts : Object.values(posts);

  return (
    <div className="pb-16 bg-[#FFFDF8]">
      <PageHero
        title={t('Knowledge & Insights for Your Learning Journey', 'معرفة ونصائح لرحلة تعلمك')}
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
          {postList.map((post: any, idx: number) => (
            <Link
              key={post.slug || idx}
              href={`/blog/${post.slug}`}
              className="group block rounded-3xl bg-white border border-stone-200 p-6 shadow-sm hover:shadow-md hover:border-[#0D4F4F]/30 transition-all"
            >
              <span className="inline-block px-2.5 py-1 rounded-full bg-[#0D4F4F]/10 text-[#0D4F4F] text-[10px] font-bold uppercase tracking-wider mb-3">
                {post.category || 'Article'}
              </span>
              <h2 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-[#0D4F4F] transition-colors leading-snug">
                {post.title}
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed mb-4 line-clamp-3">
                {post.excerpt}
              </p>
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="inline-flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  {post.date}
                </span>
                <span className="inline-flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {post.readTime}
                </span>
              </div>
              <div className="mt-4 flex items-center gap-1 text-sm font-bold text-[#0D4F4F]">
                <span>{t('Read more', 'اقرأ المزيد')}</span>
                {isRTL ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </div>
  );
}