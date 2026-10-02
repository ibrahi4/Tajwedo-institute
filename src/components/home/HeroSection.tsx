"use client";

import React from "react";
import { getImageProps } from "next/image";
import { Link } from "@/i18n/navigation";
import { useLocale } from "@/hooks/useLocale";
import { ArrowRight, ArrowLeft, ShieldCheck, Clock, Globe, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import Container from "@/components/shared/Container";

/**
 * Assets (put both in /public/Tajwedo-Public-Assets/):
 *  - herosection-desktop.webp  1584x672  full illustration, crescent ornament removed
 *  - herosection-mobile.webp    784x672  crop of the right side (children + teacher)
 *
 * Layout idea:
 *  - xl+  : illustration is the background. Text always sits on the EMPTY left side
 *           of the picture, in both languages (the outer wrapper is forced to LTR, only
 *           the text block flips direction), so the children are never covered.
 *  - < xl : stacked. Text first, then the cropped illustration, so the children are
 *           fully visible on phones and tablets.
 *
 * Requires Next.js >= 14.1 (getImageProps for art direction).
 * Removed the `mounted` gate: it hid the <h1> from server HTML (bad for SEO and LCP).
 */

const COPY = {
  ar: {
    badge: "معهد قرآن وتجويد معتمد",
    h1Part1: "تعلّم القرآن الكريم",
    h1Part2: "وابنِ مستقبلاً مشرقاً",
    subtitle:
      "ارتقِ بتلاوتك مع معلمين معتمدين من الأزهر الشريف. دروس فردية مباشرة تناسب جميع الأعمار والمستويات.",
    features: ["معلمون معتمدون", "أوقات مرنة", "للعائلات عالمياً"],
    cta: "احجز حصة تجريبية مجانية",
    alt: "طفلان يتعلمان القرآن الكريم أونلاين مع معلم معتمد",
  },
  en: {
    badge: "Certified Quran & Tajweed Institute",
    h1Part1: "Learn the Quran",
    h1Part2: "Build a Brighter Future",
    subtitle:
      "Elevate your recitation with certified Al-Azhar teachers. Personalized 1-on-1 live lessons for every age and level.",
    features: ["Certified Teachers", "Flexible Schedule", "Muslim Families Worldwide"],
    cta: "Book Free Trial Lesson",
    alt: "Two children learning the Quran online with a certified teacher",
  },
} as const;

const FEATURE_ICONS = [ShieldCheck, Clock, Globe];

export default function HeroSection() {
  const { isRTL } = useLocale();
  const c = isRTL ? COPY.ar : COPY.en;

  // Art direction: wide image on xl+, tight crop on smaller screens.
  const common = { alt: c.alt, sizes: "100vw", quality: 85 };
  const {
    props: { srcSet: desktopSrcSet },
  } = getImageProps({
    ...common,
    width: 1584,
    height: 672,
    src: "/Tajwedo-Public-Assets/herosection-desktop.webp",
  });
  const {
    props: { srcSet: mobileSrcSet, ...img },
  } = getImageProps({
    ...common,
    width: 784,
    height: 672,
    src: "/Tajwedo-Public-Assets/herosection-mobile.webp",
    priority: true, // hero image = LCP element
  });

  return (
    <section
      dir="ltr" /* physical layout is identical in both languages; text block sets its own dir */
      aria-labelledby="hero-heading"
      className="relative isolate flex flex-col overflow-hidden bg-[#FBF6EA] xl:block xl:h-[clamp(680px,46vw,820px)]"
    >
      {/* ════════ ILLUSTRATION ════════ */}
      <div className="order-2 xl:absolute xl:inset-0 xl:-z-10">
        <picture>
          <source media="(min-width: 1280px)" srcSet={desktopSrcSet} />
          <source media="(min-width: 0px)" srcSet={mobileSrcSet} />
          <img
            {...img}
            className="h-auto w-full select-none [mask-image:linear-gradient(to_bottom,transparent,#000_28%)] xl:h-full xl:object-cover xl:object-[100%_60%] xl:[mask-image:none]"
          />
        </picture>
      </div>

      {/* ════════ CONTENT ════════ */}
      <div className="relative z-10 order-1 pb-4 pt-28 md:pt-36 xl:flex xl:h-full xl:items-center xl:pb-0 xl:pt-24">
        <Container>
          <div className={`flex ${isRTL ? "justify-end xl:justify-start" : "justify-start"}`}>
            <div dir={isRTL ? "rtl" : "ltr"} className="w-full max-w-[560px] xl:max-w-[540px]">
              {/* Badge */}
              <p className="mb-5 inline-flex items-center rounded-full border border-[#0D4F4F]/15 bg-[#0D4F4F]/[0.07] px-3.5 py-1.5 text-xs font-semibold text-[#0D4F4F] sm:text-[13px]">
                <Sparkles aria-hidden className="me-2 h-3.5 w-3.5 shrink-0 text-[#9A7638]" />
                {c.badge}
              </p>

              {/* Headline (single H1 per page) */}
              <h1
                id="hero-heading"
                className={`mb-5 text-[2.25rem] font-bold sm:text-5xl xl:text-[3.5rem] ${
                  isRTL ? "leading-[1.35]" : "font-serif leading-[1.1] tracking-tight"
                }`}
              >
                <span className="block text-[#0D4F4F]">{c.h1Part1}</span>
                {/* #9A7638 passes WCAG AA for large text on the cream background (#B8945F did not) */}
                <span className="mt-1 block text-[#9A7638]">{c.h1Part2}</span>
              </h1>

              {/* Subtitle */}
              <p className="mb-8 max-w-[460px] text-[15px] leading-relaxed text-slate-700 sm:text-base">
                {c.subtitle}
              </p>

              {/* Trust points */}
              <ul className="mb-9 flex flex-wrap items-center gap-x-6 gap-y-3">
                {c.features.map((label, i) => {
                  const Icon = FEATURE_ICONS[i];
                  return (
                    <li key={label} className="flex items-center gap-2">
                      <Icon aria-hidden className="h-4 w-4 shrink-0 text-[#0D4F4F]" />
                      <span className="text-[13px] font-semibold text-slate-800">{label}</span>
                    </li>
                  );
                })}
              </ul>

              {/* CTA: asChild avoids invalid <a><button> nesting */}
              <Button
                asChild
                size="lg"
                className="group h-14 w-full rounded-xl bg-[#0D4F4F] px-8 text-[15px] font-bold text-white shadow-lg shadow-[#0D4F4F]/20 transition-colors hover:bg-[#093D33] focus-visible:ring-2 focus-visible:ring-[#9A7638] focus-visible:ring-offset-2 sm:w-auto"
              >
                <Link href="/book-trial">
                  {c.cta}
                  {isRTL ? (
                    <ArrowLeft aria-hidden className="ms-2 h-5 w-5 transition-transform group-hover:-translate-x-1" />
                  ) : (
                    <ArrowRight aria-hidden className="ms-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                  )}
                </Link>
              </Button>
            </div>
          </div>
        </Container>
      </div>
    </section>
  );
}