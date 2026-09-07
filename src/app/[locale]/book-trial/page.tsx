import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { buildPageMetadata } from "@/lib/seo";
import BookTrialContent from "@/components/book-trial/BookTrialContent";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return buildPageMetadata({
    locale,
    path: "/book-trial",
    titleEn: "Book Free Quran Trial Class | Tajwedo Institute",
    titleAr: "احجز حصة قرآن تجريبية مجانية | معهد تجويدو",
    descEn: "Book a free 30-minute trial Quran or Arabic class with Tajwedo Institute. No payment required.",
    descAr: "احجز حصة تجريبية مجانية 30 دقيقة للقرآن أو العربية مع معهد تجويدو. بدون دفع.",
  });
}

export default async function BookTrialPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <BookTrialContent />;
}