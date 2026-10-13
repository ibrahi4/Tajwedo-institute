"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Amiri, Fraunces } from "next/font/google";
import { Link } from "@/i18n/navigation";
import { useLocale } from "@/hooks/useLocale";
import {
  ArrowLeft,
  ArrowRight,
  Clock,
  Gift,
  Globe,
  ShieldCheck,
  Video,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Container from "@/components/shared/Container";
import { cn } from "@/lib/utils";

const fraunces = Fraunces({ subsets: ["latin"], display: "swap" });
const amiri = Amiri({ subsets: ["arabic"], weight: ["700"], display: "swap" });

const COPY = {
  ar: {
    eyebrow: "معهد قرآن وتجويد معتمد",
    h1Part1: "دروس قرآن أونلاين للأطفال",
    h1Part2: "فردية وبتجويد صحيح",
    subtitle:
      "ساعد طفلك على تعلّم القرآن بحصص فردية مباشرة مع معلمين معتمدين من الأزهر الشريف، من بيتكم وفي الوقت المناسب لأسرتكم.",
    offer: "حصة أولى مجانية لكل فرد في أسرتك",
    cta: "احجز لطفلك حصة تجريبية مجانية",
    more: "تعرّف على سير الحصص",
    live: "حصة مباشرة 1-to-1",
    features: [
      "معلمون معتمدون من الأزهر",
      "مواعيد تناسب أسرتك",
      "لأسر مسلمة حول العالم",
    ],
    alt: "تعلّم القرآن أونلاين مع معهد تجويدو",
  },
  en: {
    eyebrow: "Certified Quran & Tajweed Institute",
    h1Part1: "Online Quran Classes for Kids",
    h1Part2: "1-on-1, With Correct Tajweed",
    subtitle:
      "Help your child learn the Quran with private live lessons from certified Al-Azhar teachers — from home, at times that suit your family.",
    offer: "Free first lesson for every family member",
    cta: "Book Your Child's Free Trial",
    more: "See how lessons work",
    live: "Live 1-to-1 on Zoom",
    features: [
      "Al-Azhar certified teachers",
      "Schedule that fits your family",
      "Muslim families worldwide",
    ],
    alt: "Learn Quran online with Tajwedo Institute",
  },
} as const;

const FEATURE_ICONS = [ShieldCheck, Clock, Globe];

const STAR_TILE =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='72' height='72' viewBox='0 0 64 64'%3E%3Cg fill='none' stroke='%23ffffff' stroke-opacity='.07' stroke-width='1'%3E%3Cpath d='M14 14h36v36H14z'/%3E%3Cpath d='M32 6.5 57.5 32 32 57.5 6.5 32z'/%3E%3C/g%3E%3C/svg%3E\")";

const TATREEZ =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='26' height='22' viewBox='0 0 26 22' shape-rendering='crispEdges'%3E%3Crect width='26' height='22' fill='%230D4F4F'/%3E%3Cpath fill='%23C8A96E' d='M0 0h26v2h-26zM12 4h2v2h-2zM10 6h6v2h-6zM8 8h4v2h-4zM14 8h4v2h-4zM6 10h4v2h-4zM16 10h4v2h-4zM8 12h4v2h-4zM10 14h6v2h-6zM12 16h2v2h-2zM0 20h26v2h-26z'/%3E%3Cpath fill='%23FBF6EA' d='M0 10h2v2h-2zM12 10h2v2h-2z24 10h2v2h-2z'/%3E%3C/svg%3E\")";

function Ornament() {
  return (
    <svg width="120" height="12" viewBox="0 0 120 12" aria-hidden className="mx-auto block sm:mx-0">
      <g stroke="#C8A96E" fill="none" strokeWidth="1.1">
        <path d="M0 6H44" strokeOpacity=".55" />
        <path d="M76 6H120" strokeOpacity=".55" />
        <rect x="55" y="1.5" width="10" height="10" />
        <rect x="55" y="1.5" width="10" height="10" transform="rotate(45 60 6.5)" />
      </g>
      <circle cx="60" cy="6.5" r="1.3" fill="#C8A96E" />
    </svg>
  );
}

export default function HeroSection() {
  const { isRTL } = useLocale();
  const c = isRTL ? COPY.ar : COPY.en;
  const Arrow = isRTL ? ArrowLeft : ArrowRight;

  return (
    <section
      aria-labelledby="hero-heading"
      className="relative isolate min-h-[100svh] overflow-hidden bg-[#06302f] text-white"
    >
      {/* ── Photo background (High-priority LCP) ── */}
      <div className="absolute inset-0 -z-20">
        <Image
          src="/Tajwedo-Public-Assets/herosection-mobile.webp"
          alt={c.alt}
          fill
          priority
          quality={60}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 1200px"
          className="object-cover object-[center_30%] sm:object-[center_35%] lg:object-[72%_center]"
        />
      </div>

      {/* ── Readability wash ── */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 lg:hidden"
        style={{
          background:
            "linear-gradient(180deg, rgba(6,48,47,0.82) 0%, rgba(6,48,47,0.88) 42%, rgba(6,48,47,0.94) 100%)",
        }}
      />
      <div
        aria-hidden
        className="absolute inset-0 -z-10 hidden lg:block"
        style={{
          background: isRTL
            ? "linear-gradient(90deg, rgba(6,48,47,0.15) 0%, rgba(6,48,47,0.55) 38%, rgba(6,48,47,0.92) 62%, rgba(6,48,47,0.97) 100%)"
            : "linear-gradient(90deg, rgba(6,48,47,0.97) 0%, rgba(6,48,47,0.92) 38%, rgba(6,48,47,0.55) 62%, rgba(6,48,47,0.15) 100%)",
        }}
      />

      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-80"
        style={{
          backgroundImage: STAR_TILE,
          backgroundSize: "72px 72px",
          WebkitMaskImage:
            "radial-gradient(ellipse 70% 60% at 50% 40%, #000 0%, transparent 75%)",
          maskImage:
            "radial-gradient(ellipse 70% 60% at 50% 40%, #000 0%, transparent 75%)",
        }}
      />

      <Container className="relative z-10 flex min-h-[100svh] flex-col justify-center pb-16 pt-28 sm:pt-32 lg:pb-24 lg:pt-36">
        <div
          dir={isRTL ? "rtl" : "ltr"}
          className={cn(
            "flex w-full max-w-xl flex-col",
            isRTL ? "lg:mr-0 lg:ml-auto" : "lg:ml-0",
            "text-center sm:text-start"
          )}
        >
          <div className="mb-5 flex justify-center sm:justify-start">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-[11px] font-semibold text-[#E6CF9F] backdrop-blur-sm">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
              </span>
              <Video className="h-3.5 w-3.5 text-[#C8A96E]" aria-hidden />
              {c.live}
            </span>
          </div>

          <p
            className={cn(
              "mb-4 inline-flex items-center justify-center gap-2 self-center text-[11px] font-semibold text-[#E6CF9F] sm:justify-start sm:self-start sm:text-[12px]",
              !isRTL && "uppercase tracking-[0.12em]"
            )}
          >
            <span aria-hidden className="h-1.5 w-1.5 rotate-45 bg-[#C8A96E]" />
            {c.eyebrow}
            <span aria-hidden className="h-1.5 w-1.5 rotate-45 bg-[#C8A96E]" />
          </p>

          <h1
            id="hero-heading"
            className={cn(
              "text-[1.85rem] font-bold leading-[1.15] [text-wrap:balance] sm:text-[2.4rem] lg:text-[2.75rem]",
              isRTL ? amiri.className : cn(fraunces.className, "tracking-[-0.02em]")
            )}
          >
            <span className="block text-white">{c.h1Part1}</span>
            <span className="mt-1 block text-[#E3B45F]">{c.h1Part2}</span>
          </h1>

          <div className="my-4 flex justify-center sm:justify-start">
            <Ornament />
          </div>

          <p className="mx-auto max-w-md text-[14.5px] leading-relaxed text-white/80 sm:mx-0 sm:text-[15.5px]">
            {c.subtitle}
          </p>

          <div className="mt-6 flex justify-center sm:justify-start">
            <Link
              href="/book-trial"
              className="inline-flex items-center gap-2 rounded-full border border-[#C8A96E]/45 bg-[#C8A96E]/12 px-3.5 py-1.5 text-[12px] font-semibold text-[#F1DDB0] transition-colors hover:bg-[#C8A96E]/22"
            >
              <Gift className="h-3.5 w-3.5 shrink-0 text-[#E3B45F]" aria-hidden />
              {c.offer}
              <Arrow className="h-3.5 w-3.5 shrink-0" aria-hidden />
            </Link>
          </div>

          <div className="mt-6 flex w-full flex-col gap-3 sm:flex-row sm:items-center sm:gap-5">
            <Button
              asChild
              size="lg"
              className="h-13 w-full rounded-xl bg-[#C8A96E] px-7 text-[15px] font-bold text-[#06302f] shadow-[0_12px_28px_-12px_rgba(200,169,110,0.85)] hover:bg-[#D9BC84] sm:h-14 sm:w-auto"
            >
              <Link href="/book-trial" className="inline-flex items-center justify-center gap-2">
                {c.cta}
                <Arrow className="h-5 w-5" aria-hidden />
              </Link>
            </Button>
            <Link
              href="/how-it-works"
              className="text-center text-[14px] font-semibold text-white/90 underline decoration-[#C8A96E]/55 underline-offset-[5px] hover:decoration-[#C8A96E] sm:text-start"
            >
              {c.more}
            </Link>
          </div>

          <ul className="mt-8 flex flex-col gap-2.5 sm:mt-10 sm:flex-row sm:flex-wrap sm:gap-3">
            {c.features.map((label, i) => {
              const Icon = FEATURE_ICONS[i];
              return (
                <li
                  key={label}
                  className="flex items-center justify-center gap-2.5 rounded-xl border border-white/10 bg-white/[0.07] px-3 py-2.5 backdrop-blur-[2px] sm:justify-start"
                >
                  <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-[#C8A96E]/15 text-[#E3B45F]">
                    <Icon className="h-3.5 w-3.5" aria-hidden />
                  </span>
                  <span className="text-[12px] font-semibold leading-snug text-white/90">
                    {label}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      </Container>

      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 z-20 h-[22px]"
        style={{
          backgroundImage: TATREEZ,
          backgroundRepeat: "repeat-x",
          backgroundSize: "26px 22px",
        }}
      />
    </section>
  );
}