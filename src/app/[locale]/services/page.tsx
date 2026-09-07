import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { buildPageMetadata } from "@/lib/seo";
import ServicesPageContent from "@/components/services/ServicesPageContent";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return buildPageMetadata({
    locale,
    path: "/services",
    titleEn: "Quran & Arabic Courses Online | Tajwedo Institute",
    titleAr: "دورات القرآن والعربية أونلاين | معهد تجويدو",
    descEn: "Explore Quran recitation, Tajweed, Arabic, Islamic studies, kids programs and new Muslim courses.",
    descAr: "استكشف دورات التلاوة والتجويد والعربية والدراسات الإسلامية وبرامج الأطفال والمسلمين الجدد.",
  });
}

export default async function ServicesPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <ServicesPageContent />;
}