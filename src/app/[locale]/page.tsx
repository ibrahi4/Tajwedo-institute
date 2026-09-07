import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { buildPageMetadata } from "@/lib/seo";
import HeroSection from "@/components/home/HeroSection";
import TrustBar from "@/components/home/TrustBar";
import ServicesOverview from "@/components/home/ServicesOverview";
import WhyChooseMe from "@/components/home/WhyChooseMe";
import HowItWorks from "@/components/home/HowItWorks";
import FAQPreview from "@/components/home/FAQPreview";
import QuranVerse from "@/components/home/QuranVerse";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return buildPageMetadata({
    locale,
    path: "",
    titleEn: "Online Quran, Tajweed & Arabic Classes | Tajwedo Institute",
    titleAr: "معهد تجويدو | تعليم القرآن والتجويد والعربية أونلاين",
    descEn: "Learn Quran, Tajweed and Arabic online with certified Al-Azhar teachers. Free trial for kids and adults worldwide.",
    descAr: "تعلّم القرآن والتجويد والعربية أونلاين مع معلمين معتمدين من الأزهر. حصة تجريبية مجانية للأطفال والكبار.",
  });
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <>
      <HeroSection />
      <TrustBar />
      <ServicesOverview />
      <WhyChooseMe />
      <HowItWorks />
      <QuranVerse />
      <FAQPreview />
    </>
  );
}