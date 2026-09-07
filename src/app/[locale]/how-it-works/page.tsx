import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { buildPageMetadata } from "@/lib/seo";
import HowItWorksPageContent from "@/components/how-it-works/HowItWorksPageContent";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return buildPageMetadata({
    locale,
    path: "/how-it-works",
    titleEn: "How Online Quran Classes Work | Tajwedo Institute",
    titleAr: "كيف تعمل دروس القرآن أونلاين | معهد تجويدو",
    descEn: "Learn how Tajwedo Institute online classes work from trial to weekly progress.",
    descAr: "تعرّف كيف تعمل دروس معهد تجويدو أونلاين من التجربة حتى المتابعة الأسبوعية.",
  });
}

export default async function Page({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <HowItWorksPageContent />;
}