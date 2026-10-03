"use client";

import React from "react";
import { getImageProps } from "next/image";
import { Link } from "@/i18n/navigation";
import { useLocale } from "@/hooks/useLocale";
import { ArrowRight, ArrowLeft, ShieldCheck, Clock, Globe, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import Container from "@/components/shared/Container";

/**
 * Assets (in /public/Tajwedo-Public-Assets/):
 *  - herosection-desktop.webp  1584x672  full illustration
 *  - herosection-mobile.webp    784x672  crop of the children + teacher
 *
 * Layout:
 *  - xl+  : illustration is the background, text sits on the empty left side
 *           (same in AR and EN: the outer wrapper is LTR, only the text block flips).
 *  - < xl : illustration comes FIRST (parents see the happy kids immediately),
 *           it fades into the cream background, then headline -> CTA -> trust points.
 *
 * Requires Next.js >= 14.1 (getImageProps).
 */

const COPY = {
  ar: {
    badge: "معهد قرآن وتجويد معتمد",
    h1Part1: "علّم طفلك القرآن الكريم",
    h1Part2: "أونلاين بتجويد صحيح",
    subtitle:
      "حصص فردية مباشرة مع معلمين معتمدين من الأزهر الشريف، تناسب أطفالك في كل الأعمار والمستويات، من بيتكم وفي الوقت المناسب لأسرتكم.",
    features: ["معلمون معتمدون", "مواعيد تناسب أسرتك", "لأسر مسلمة حول العالم"],
    cta: "احجز لطفلك حصة تجريبية مجانية",
    alt: "طفلان يتعلمان القرآن الكريم أونلاين مع معلم معتمد",
  },
  en: {
    badge: "Certified Quran & Tajweed Institute",
    h1Part1: "Help Your Child Learn the Quran",
    h1Part2: "Online, With Correct Tajweed",
    subtitle:
      "Private 1-on-1 live lessons with certified Al-Azhar teachers, for children of every age and level, from the comfort of your home and at times that suit your family.",
    features: ["Certified Teachers", "Schedule That Fits Your Family", "Muslim Families Worldwide"],
    cta: "Book Your Child's Free Trial",
    alt: "Two children learning the Quran online with a certified teacher",
  },
} as const;

const FEATURE_ICONS = [ShieldCheck, Clock, Globe];

export default function HeroSection() {
  const { isRTL } = useLocale();
  const c = isRTL ? COPY.ar : COPY.en;

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
    priority: true, // LCP element
  });

  return (
    <section
      dir="ltr"
      aria-labelledby="hero-heading"
      className="relative isolate flex flex-col overflow-hidden bg-[#FBF6EA] xl:block xl:h-[clamp(680px,46vw,820px)]"
    >
      {/* ════════ ILLUSTRATION (top on mobile/tablet, background on desktop) ════════ */}
      <div className="order-1 pt-16 md:pt-20 xl:absolute xl:inset-0 xl:-z-10 xl:pt-0">
        <div className="aspect-[4/3] w-full md:aspect-[16/9] xl:aspect-auto xl:h-full">
          <picture>
            <source media="(min-width: 1280px)" srcSet={desktopSrcSet} />
            <source media="(min-width: 0px)" srcSet={mobileSrcSet} />
            <img
              {...img}
              className="h-full w-full select-none object-cover object-[50%_65%] [mask-image:linear-gradient(to_bottom,#000_65%,transparent)] xl:object-[100%_60%] xl:[mask-image:none]"
            />
          </picture>
        </div>
      </div>

      {/* ════════ CONTENT ════════ */}
      <div className="relative z-10 order-2 -mt-8 pb-14 md:-mt-12 xl:mt-0 xl:flex xl:h-full xl:items-center xl:pb-0 xl:pt-24">
        <Container>
          <div className={`flex ${isRTL ? "justify-end xl:justify-start" : "justify-start"}`}>
            <div dir={isRTL ? "rtl" : "ltr"} className="w-full max-w-[560px] xl:max-w-[540px]">
              <p className="mb-4 inline-flex items-center rounded-full border border-[#0D4F4F]/15 bg-[#0D4F4F]/[0.07] px-3.5 py-1.5 text-xs font-semibold text-[#0D4F4F] sm:text-[13px]">
                <Sparkles aria-hidden className="me-2 h-3.5 w-3.5 shrink-0 text-[#9A7638]" />
                {c.badge}
              </p>

              <h1
                id="hero-heading"
                className={`mb-4 text-[2rem] font-bold sm:text-5xl xl:text-[3.25rem] ${
                  isRTL ? "leading-[1.35]" : "font-serif leading-[1.12] tracking-tight"
                }`}
              >
                <span className="block text-[#0D4F4F]">{c.h1Part1}</span>
                <span className="mt-1 block text-[#9A7638]">{c.h1Part2}</span>
              </h1>

              <p className="mb-7 max-w-[480px] text-[15px] leading-relaxed text-slate-700 sm:text-base">
                {c.subtitle}
              </p>

              {/* CTA comes before the trust points so it stays high on small screens */}
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

              <ul className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3">
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
            </div>
          </div>
        </Container>
      </div>
    </section>
  );
}