import type { Metadata } from "next";

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://tajwedo.com";

export function absoluteUrl(locale: string, path: string = ""): string {
  const clean = path.startsWith("/") ? path : path ? `/${path}` : "";
  return `${SITE}/${locale}${clean}`;
}

type PageSeoInput = {
  locale: string;
  path?: string; // e.g. "/about" or "" for home
  titleEn: string;
  titleAr: string;
  descEn: string;
  descAr: string;
};

/**
 * Canonical + hreflang + OG for every public page.
 * Fixes GSC: "Duplicate without user-selected canonical"
 */
export function buildPageMetadata({
  locale,
  path = "",
  titleEn,
  titleAr,
  descEn,
  descAr,
}: PageSeoInput): Metadata {
  const isAr = locale === "ar";
  const title = isAr ? titleAr : titleEn;
  const description = isAr ? descAr : descEn;
  const canonical = absoluteUrl(locale, path);
  const enUrl = absoluteUrl("en", path);
  const arUrl = absoluteUrl("ar", path);

  return {
    title,
    description,
    alternates: {
      canonical,
      languages: {
        en: enUrl,
        ar: arUrl,
        "x-default": enUrl,
      },
    },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: "Tajwedo Institute",
      locale: isAr ? "ar_SA" : "en_US",
      alternateLocale: isAr ? ["en_US"] : ["ar_SA"],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}