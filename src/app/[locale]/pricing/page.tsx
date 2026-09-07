import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { buildPageMetadata } from "@/lib/seo";
import PricingContent from "@/components/pricing/PricingContent";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return buildPageMetadata({
    locale,
    path: "/pricing",
    titleEn: "Pricing Plans | Quran Classes | Tajwedo Institute",
    titleAr: "باقات الأسعار | دروس القرآن | معهد تجويدو",
    descEn: "Simple pricing for online Quran and Arabic lessons. Start with a free trial.",
    descAr: "أسعار بسيطة لدروس القرآن والعربية أونلاين. ابدأ بتجربة مجانية.",
  });
}

export default async function Page({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <PricingContent />;
}