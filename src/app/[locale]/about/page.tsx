import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { buildPageMetadata } from "@/lib/seo";
import AboutPageContent from "@/components/about/AboutPageContent";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return buildPageMetadata({
    locale,
    path: "/about",
    titleEn: "About Tajwedo Institute | Online Quran Academy",
    titleAr: "عن معهد تجويدو | أكاديمية قرآن أونلاين",
    descEn: "Tajwedo Institute provides professional online Quran, Tajweed, Arabic and Islamic studies with certified teachers.",
    descAr: "معهد تجويدو يقدّم تعليمًا احترافيًا للقرآن والتجويد والعربية والدراسات الإسلامية أونلاين مع معلمين معتمدين.",
  });
}

export default async function AboutPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <AboutPageContent />;
}