"use client";

import React from "react";
import Image from "next/image";
import { Amiri, Fraunces } from "next/font/google";
import { Link } from "@/i18n/navigation";
import { useLocale } from "@/hooks/useLocale";
import { ArrowLeft, ArrowRight, Clock, Gift, Globe, ShieldCheck, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import Container from "@/components/shared/Container";
import { cn } from "@/lib/utils";

/**
 * HOME HERO
 *
 * Visual language shared with the /book-trial page: deep teal night, gold thread,
 * Islamic star lattice, glass details, and an embroidered (tatreez) border along the bottom.
 * The illustration sits inside a mihrab-style arch that "stands" on the embroidered border.
 *
 * Assets (in /public/Tajwedo-Public-Assets/):
 *  - herosection-mobile.webp  784x672  children + teacher  <- used on ALL screen sizes now
 *  - herosection-desktop.webp          no longer used by this component (safe to delete)
 *
 * Layout:
 *  - mobile/tablet : arch picture first (parents see the kids at once), then text, CTA, trust tiles.
 *  - lg+           : text on the left, arch on the right standing on the embroidered border.
 *                    The outer wrapper is LTR in both languages; only the text block flips for Arabic.
 */

const fraunces = Fraunces({ subsets: ["latin"], display: "swap" });
const amiri = Amiri({ subsets: ["arabic"], weight: ["700"], display: "swap" });

/** If the crop of the illustration cuts a head, nudge this (x% y%). */
const ART_POSITION = "50% 62%";

const COPY = {
  ar: {
    eyebrow: "معهد قرآن وتجويد معتمد",
    h1Part1: "دروس قرآن أونلاين للأطفال",
    h1Part2: "فردية وبتجويد صحيح",
    subtitle:
      "ساعد طفلك على تعلّم القرآن بحصص فردية مباشرة مع معلمين معتمدين من الأزهر الشريف، تناسب كل الأعمار والمستويات، من بيتكم وفي الوقت المناسب لأسرتكم.",
    offer: "حصة أولى مجانية لكل فرد في أسرتك",
    cta: "احجز لطفلك حصة تجريبية مجانية",
    more: "تعرّف على سير الحصص",
    live: "حصة مباشرة فردية",
    liveSub: "Zoom مع سبورة تفاعلية",
    features: ["معلمون معتمدون من الأزهر", "مواعيد تناسب أسرتك", "لأسر مسلمة حول العالم"],
    alt: "طفلان يتعلمان القرآن الكريم أونلاين مع معلم معتمد",
  },
  en: {
    eyebrow: "Certified Quran & Tajweed Institute",
    h1Part1: "Online Quran Classes for Kids",
    h1Part2: "1-on-1, With Correct Tajweed",
    subtitle:
      "Help your child learn the Quran with private live lessons from certified Al-Azhar teachers, for every age and level, from the comfort of your home and at times that suit your family.",
    offer: "Free first lesson for every family member",
    cta: "Book Your Child's Free Trial",
    more: "See how lessons work",
    live: "Live 1-to-1 lesson",
    liveSub: "Zoom with an interactive board",
    features: ["Al-Azhar certified teachers", "Schedule that fits your family", "Muslim families worldwide"],
    alt: "Two children learning the Quran online with a certified teacher",
  },
} as const;

const FEATURE_ICONS = [ShieldCheck, Clock, Globe];

/** Islamic star lattice, white on teal. */
const STAR_TILE =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='72' height='72' viewBox='0 0 64 64'%3E%3Cg fill='none' stroke='%23ffffff' stroke-opacity='.09' stroke-width='1'%3E%3Cpath d='M14 14h36v36H14z'/%3E%3Cpath d='M32 6.5 57.5 32 32 57.5 6.5 32z'/%3E%3C/g%3E%3C/svg%3E\")";

/** Embroidered (tatreez) border: gold cross-stitch diamonds on teal. 26x22 tile, repeats along X. */
const TATREEZ =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='26' height='22' viewBox='0 0 26 22' shape-rendering='crispEdges'%3E%3Crect width='26' height='22' fill='%230D4F4F'/%3E%3Cpath fill='%23C8A96E' d='M0 0h26v2h-26zM12 4h2v2h-2zM10 6h6v2h-6zM8 8h4v2h-4zM14 8h4v2h-4zM6 10h4v2h-4zM16 10h4v2h-4zM8 12h4v2h-4zM14 12h4v2h-4zM10 14h6v2h-6zM12 16h2v2h-2zM0 20h26v2h-26z'/%3E%3Cpath fill='%23FBF6EA' d='M0 10h2v2h-2zM12 10h2v2h-2zM24 10h2v2h-2z'/%3E%3C/svg%3E\")";

/** Gold ornament divider: hairline, eight-point star, hairline. Decorative only. */
function Ornament() {
  return (
    <svg width="132" height="14" viewBox="0 0 132 14" aria-hidden="true" className="block">
      <g stroke="#C8A96E" fill="none" strokeWidth="1.2">
        <path d="M0 7H50" strokeOpacity=".6" />
        <path d="M82 7H132" strokeOpacity=".6" />
        <rect x="61" y="2" width="10" height="10" />
        <rect x="61" y="2" width="10" height="10" transform="rotate(45 66 7)" />
      </g>
      <circle cx="66" cy="7" r="1.4" fill="#C8A96E" />
      <circle cx="54.5" cy="7" r="1.3" fill="#C8A96E" />
      <circle cx="77.5" cy="7" r="1.3" fill="#C8A96E" />
    </svg>
  );
}

export default function HeroSection() {
  const { isRTL } = useLocale();
  const c = isRTL ? COPY.ar : COPY.en;
  const Arrow = isRTL ? ArrowLeft : ArrowRight;

  return (
    <section
      dir="ltr"
      aria-labelledby="hero-heading"
      className="relative isolate overflow-hidden bg-[#06302f] text-white"
    >
      {/* ════════ ATMOSPHERE ════════ */}
      <div
        aria-hidden
        className="absolute inset-0 -z-20 bg-gradient-to-b from-[#031a1a] via-[#06302f] to-[#0a4040]"
      />
      <div
        aria-hidden
        className="absolute inset-0 -z-10"
        style={{
          backgroundImage: STAR_TILE,
          backgroundSize: "72px 72px",
          WebkitMaskImage: "radial-gradient(ellipse 85% 90% at 25% 35%, #000 25%, transparent 100%)",
          maskImage: "radial-gradient(ellipse 85% 90% at 25% 35%, #000 25%, transparent 100%)",
        }}
      />
      {/* Warm glow behind the arch, like a lit niche */}
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-24 -z-10 h-[460px] w-[460px] rounded-full bg-[#C8A96E]/20 blur-[110px] end-[4%] lg:end-[6%]"
      />

      <Container>
        <div className="grid items-center gap-12 pb-16 pt-24 sm:pt-28 lg:grid-cols-12 lg:gap-8 lg:pb-0 lg:pt-32">
          {/* ════════ ARCH + ILLUSTRATION ════════ */}
          <div className="relative mx-auto w-full max-w-[520px] lg:order-2 lg:col-span-5 lg:max-w-none lg:self-end">
            {/* Offset gold outline: the second line of the embroidered frame */}
            <div
              aria-hidden
              className="absolute -top-4 bottom-0 start-4 end-4 rounded-t-[44%] border-2 border-b-0 border-[#C8A96E]/50 lg:rounded-t-[46%]"
            />

            <div className="relative aspect-[16/11] overflow-hidden rounded-t-[42%] rounded-b-3xl border-2 border-[#C8A96E]/70 bg-[#FBF6EA] shadow-[0_30px_80px_-30px_rgba(0,0,0,0.65)] sm:aspect-[21/20] lg:rounded-b-none lg:rounded-t-[44%]">
              <Image
                src="/Tajwedo-Public-Assets/herosection-mobile.webp"
                alt={c.alt}
                fill
                priority
                quality={85}
                sizes="(min-width: 640px) 520px, 92vw"
                className="select-none object-cover"
                style={{ objectPosition: ART_POSITION }}
              />
            </div>

            {/* Glass "live lesson" chip */}
            <div
              dir={isRTL ? "rtl" : "ltr"}
              className="absolute -bottom-5 start-4 z-10 flex items-center gap-3 rounded-2xl border border-white/60 bg-white/90 px-3 py-2 shadow-lg backdrop-blur-md sm:px-3.5 sm:py-2.5 lg:bottom-9"
            >
              <span className="relative grid h-9 w-9 place-items-center rounded-xl bg-[#0D4F4F] text-white">
                <span className="absolute -end-0.5 -top-0.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-[#E5484D]" />
                <Video aria-hidden className="h-[18px] w-[18px]" />
              </span>
              <span className="leading-tight">
                <span className="block text-[13px] font-bold text-[#0D4F4F]">{c.live}</span>
                <span className="block text-[11px] text-slate-600">{c.liveSub}</span>
              </span>
            </div>
          </div>

          {/* ════════ TEXT ════════ */}
          <div className="lg:order-1 lg:col-span-7 lg:pb-24">
            <div dir={isRTL ? "rtl" : "ltr"} className="max-w-[640px]">
              <p
                className={cn(
                  "mb-5 inline-flex items-center gap-2.5 text-[11.5px] font-semibold text-[#E6CF9F] sm:gap-3 sm:text-[12.5px]",
                  !isRTL && "uppercase tracking-[0.1em] sm:tracking-[0.14em]"
                )}
              >
                <span aria-hidden className="h-1.5 w-1.5 rotate-45 bg-[#C8A96E]" />
                {c.eyebrow}
                <span aria-hidden className="h-1.5 w-1.5 rotate-45 bg-[#C8A96E]" />
              </p>

              <h1
                id="hero-heading"
                className={cn(
                  "text-[2rem] font-bold [text-wrap:balance] sm:text-[2.6rem] xl:text-[2.85rem]",
                  isRTL ? cn(amiri.className, "leading-[1.4]") : cn(fraunces.className, "leading-[1.08] tracking-[-0.02em]")
                )}
              >
                <span className="block text-white">{c.h1Part1}</span>
                <span className="mt-1 block text-[#E3B45F]">{c.h1Part2}</span>
              </h1>

              <div className="my-5">
                <Ornament />
              </div>

              <p className="max-w-[500px] text-[15px] leading-relaxed text-white/80 sm:text-base">
                {c.subtitle}
              </p>

              {/* Bridge to the offers on the booking page */}
              <Link
                href="/book-trial"
                className="group mt-7 inline-flex items-center gap-2 rounded-full border border-[#C8A96E]/50 bg-[#C8A96E]/10 px-3.5 py-1.5 text-[12px] font-semibold text-[#F1DDB0] transition-colors hover:bg-[#C8A96E]/20 sm:text-[12.5px]"
              >
                <Gift aria-hidden className="h-3.5 w-3.5 shrink-0 text-[#E3B45F]" />
                {c.offer}
                <Arrow
                  aria-hidden
                  className={cn(
                    "h-3.5 w-3.5 shrink-0 transition-transform motion-safe:group-hover:translate-x-0.5",
                    isRTL && "motion-safe:group-hover:-translate-x-0.5"
                  )}
                />
              </Link>

              <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
                <Button
                  asChild
                  size="lg"
                  className="group h-14 w-full rounded-xl bg-[#C8A96E] px-8 text-[15px] font-bold text-[#06302f] shadow-[0_14px_34px_-14px_rgba(200,169,110,0.9)] transition-colors hover:bg-[#D9BC84] focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#06302f] sm:w-auto"
                >
                  <Link href="/book-trial">
                    {c.cta}
                    <Arrow
                      aria-hidden
                      className={cn(
                        "ms-2 h-5 w-5 transition-transform motion-safe:group-hover:translate-x-1",
                        isRTL && "motion-safe:group-hover:-translate-x-1"
                      )}
                    />
                  </Link>
                </Button>

                <Link
                  href="/how-it-works"
                  className="text-center text-[14px] font-semibold text-white underline decoration-[#C8A96E]/60 underline-offset-[6px] transition-colors hover:decoration-[#C8A96E] sm:text-start"
                >
                  {c.more}
                </Link>
              </div>

              <ul className="mt-8 grid max-w-[640px] gap-3 sm:grid-cols-3">
                {c.features.map((label, i) => {
                  const Icon = FEATURE_ICONS[i];
                  return (
                    <li
                      key={label}
                      className="flex items-center gap-2.5 rounded-xl border border-white/10 bg-white/[0.06] px-3 py-2.5 backdrop-blur-sm"
                    >
                      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-[#C8A96E]/15 text-[#E3B45F]">
                        <Icon aria-hidden className="h-4 w-4" />
                      </span>
                      <span className="text-[12.5px] font-semibold leading-snug text-white/90">{label}</span>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>
      </Container>

      {/* ════════ EMBROIDERED BORDER (tatreez) ════════ */}
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 z-20 h-[22px]"
        style={{ backgroundImage: TATREEZ, backgroundRepeat: "repeat-x", backgroundSize: "26px 22px" }}
      />
    </section>
  );
}