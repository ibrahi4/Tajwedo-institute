import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { buildPageMetadata } from "@/lib/seo";
import ContactPageContent from "@/components/contact/ContactPageContent";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return buildPageMetadata({
    locale,
    path: "/contact",
    titleEn: "Contact Tajwedo Institute | WhatsApp & Support",
    titleAr: "تواصل مع معهد تجويدو | واتساب ودعم",
    descEn: "Contact Tajwedo Institute via WhatsApp or form for Quran class inquiries and free trial booking.",
    descAr: "تواصل مع معهد تجويدو عبر واتساب أو النموذج لاستفسارات دروس القرآن وحجز التجربة المجانية.",
  });
}

export default async function ContactPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <ContactPageContent />;
}