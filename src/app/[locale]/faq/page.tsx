import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { buildPageMetadata } from "@/lib/seo";
import FAQPageContent from "@/components/faq/FAQPageContent";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return buildPageMetadata({
    locale,
    path: "/faq",
    titleEn: "FAQ | Online Quran Classes | Tajwedo Institute",
    titleAr: "الأسئلة الشائعة | دروس قرآن أونلاين | معهد تجويدو",
    descEn: "Answers about online Quran, Tajweed, scheduling and free trial at Tajwedo Institute.",
    descAr: "إجابات عن دروس القرآن والتجويد والمواعيد والتجربة المجانية في معهد تجويدو.",
  });
}

export default async function Page({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <FAQPageContent />;
}