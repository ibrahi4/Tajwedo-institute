import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { buildPageMetadata } from "@/lib/seo";
import LandingPageContent from "@/components/landing/LandingPageContent";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return buildPageMetadata({
    locale,
    path: "/lp/quran-trial",
    titleEn: "Free Trial Class - Online Quran & Tajweed | Tajwedo Institute",
    titleAr: "حصة تجريبية مجانية - القرآن والتجويد أونلاين | معهد تجويدو",
    descEn: "Book your 100% free 30-minute trial session with Al-Azhar certified male and female Quran teachers. Flexible schedules for kids and adults.",
    descAr: "احجز حصتك التجريبية المجانية 30 دقيقة مع معلمين ومعلمات معتمدين من الأزهر الشريف. جدول مرن للأطفال والكبار.",
  });
}

export default async function LandingPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <LandingPageContent />;
}