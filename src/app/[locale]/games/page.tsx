import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { buildPageMetadata } from "@/lib/seo";
import GamesHubContent from "@/components/games/GamesHubContent";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return buildPageMetadata({
    locale,
    path: "/games",
    titleEn: "Quran Learning Games for Kids | Tajwedo Institute",
    titleAr: "ألعاب تعليم القرآن للأطفال | معهد تجويدو",
    descEn: "Educational Arabic and Tajweed games for kids at Tajwedo Institute.",
    descAr: "ألعاب تعليمية للعربية والتجويد للأطفال في معهد تجويدو.",
  });
}

export default async function Page({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <GamesHubContent />;
}