import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { buildPageMetadata } from "@/lib/seo";
import BlogPageContent from "@/components/blog/BlogPageContent";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return buildPageMetadata({
    locale,
    path: "/blog",
    titleEn: "Quran & Tajweed Blog | Tajwedo Institute",
    titleAr: "مدونة القرآن والتجويد | معهد تجويدو",
    descEn: "Articles on Quran, Tajweed, Arabic learning tips from Tajwedo Institute.",
    descAr: "مقالات عن القرآن والتجويد ونصائح تعلّم العربية من معهد تجويدو.",
  });
}

export default async function Page({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <BlogPageContent />;
}