import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { buildPageMetadata } from "@/lib/seo";
import TestimonialsPageContent from "@/components/testimonials/TestimonialsPageContent";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return buildPageMetadata({
    locale,
    path: "/testimonials",
    titleEn: "Student Reviews | Tajwedo Institute | Tajwedo Institute",
    titleAr: "آراء الطلاب | معهد تجويدو | معهد تجويدو",
    descEn: "Read parent and student reviews of online Quran and Arabic classes.",
    descAr: "اقرأ تقييمات أولياء الأمور والطلاب لدروس القرآن والعربية أونلاين.",
  });
}

export default async function Page({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <TestimonialsPageContent />;
}