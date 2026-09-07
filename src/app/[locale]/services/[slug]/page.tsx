import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { buildPageMetadata } from "@/lib/seo";
import ServiceDetailContent from "@/components/services/ServiceDetailContent";

const SERVICE_SEO: Record<string, { en: string; ar: string; dEn: string; dAr: string }> = {
  "quran-recitation": {
    en: "Quran Recitation & Memorization Online",
    ar: "تلاوة وحفظ القرآن أونلاين",
    dEn: "Master Quran recitation and Hifz with certified teachers at Tajwedo Institute. Book a free trial.",
    dAr: "أتقن تلاوة القرآن والحفظ مع معلمين معتمدين في معهد تجويدو. احجز حصة تجريبية مجانية.",
  },
  tajweed: {
    en: "Tajweed Course Online | Perfect Your Recitation",
    ar: "دورة تجويد أونلاين | أتقن التلاوة",
    dEn: "Learn Tajweed rules clearly online with structured lessons for all levels.",
    dAr: "تعلّم أحكام التجويد بوضوح أونلاين بدروس منظمة لكل المستويات.",
  },
  "arabic-language": {
    en: "Arabic Language Course Online",
    ar: "دورة اللغة العربية أونلاين",
    dEn: "Learn Arabic from alphabet to fluency with professional online tutors.",
    dAr: "تعلّم العربية من الحروف حتى الطلاقة مع معلّمين محترفين أونلاين.",
  },
  "islamic-studies": {
    en: "Islamic Studies Online Courses",
    ar: "دورات الدراسات الإسلامية أونلاين",
    dEn: "Authentic Islamic studies classes for adults and families online.",
    dAr: "دروس دراسات إسلامية أصيلة للكبار والعائلات أونلاين.",
  },
  "kids-program": {
    en: "Quran Classes for Kids Online",
    ar: "دروس قرآن للأطفال أونلاين",
    dEn: "Fun, age-appropriate Quran and Arabic classes for children and teens.",
    dAr: "دروس قرآن وعربية ممتعة ومناسبة لعمر الأطفال والناشئين.",
  },
  "new-muslims": {
    en: "New Muslim Quran & Prayer Course",
    ar: "دورة للمسلمين الجدد | قرآن وصلاة",
    dEn: "Gentle introduction to Islam, Quran and prayer for new Muslims and reverts.",
    dAr: "مقدمة لطيفة للإسلام والقرآن والصلاة للمسلمين الجدد والمهتدين.",
  },
};

type Props = { params: Promise<{ locale: string; slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const seo = SERVICE_SEO[slug] || {
    en: "Online Islamic Course | Tajwedo Institute",
    ar: "دورة إسلامية أونلاين | معهد تجويدو",
    dEn: "Professional online Islamic education at Tajwedo Institute.",
    dAr: "تعليم إسلامي احترافي أونلاين في معهد تجويدو.",
  };
  return buildPageMetadata({
    locale,
    path: `/services/${slug}`,
    titleEn: `${seo.en} | Tajwedo Institute`,
    titleAr: `${seo.ar} | معهد تجويدو`,
    descEn: seo.dEn,
    descAr: seo.dAr,
  });
}

export default async function ServiceSlugPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  return <ServiceDetailContent slug={slug} />;
}