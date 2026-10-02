"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { useLocale } from "@/hooks/useLocale";
import { ArrowRight, ArrowLeft, ShieldCheck, Clock, Globe, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import Container from "@/components/shared/Container";

export default function HeroSection() {
  const [mounted, setMounted] = useState(false);
  const { isRTL } = useLocale();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const t = (en: string, ar: string) => (isRTL ? ar : en);

  const content = isRTL
    ? {
        badge: "معهد قرآن وتجويد معتمد",
        h1Part1: "تعلّم القرآن الكريم",
        h1Part2: "وابنِ مستقبلاً مشرقاً",
        subtitle:
          "ارتقِ بتلاوتك مع معلمين معتمدين من الأزهر الشريف. دروس فردية مباشرة تناسب جميع الأعمار والمستويات.",
        feat1: "معلمون معتمدون",
        feat2: "أوقات مرنة",
        feat3: "للعائلات عالمياً",
        primaryCta: "احجز حصة تجريبية مجانية",
      }
    : {
        badge: "Certified Quran & Tajweed Institute",
        h1Part1: "Learn the Quran",
        h1Part2: "Build a Brighter Future",
        subtitle:
          "Elevate your recitation with certified Al-Azhar teachers. Personalized 1-on-1 live lessons for every age and level.",
        feat1: "Certified Teachers",
        feat2: "Flexible Schedule",
        feat3: "Muslim Families Worldwide",
        primaryCta: "Book Free Trial Lesson",
      };

  return (
    <section
      className="relative min-h-[90svh] lg:min-h-[850px] w-full flex items-center overflow-hidden bg-[#FAF8F5]"
      dir={isRTL ? "rtl" : "ltr"}
    >
      {/* ════════ BACKGROUND IMAGE ════════ */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/Tajwedo-Public-Assets/herosection.webp"
          alt="Tajwedo Institute"
          fill
          priority
          quality={90}
          sizes="100vw"
          className="object-cover object-[70%_center] lg:object-[80%_center]"
        />

        {/* Clean, natural gradient overlay (Zero ugly boxes or solid backgrounds) */}
        <div
          className="absolute inset-0"
          style={{
            background: isRTL
              ? "linear-gradient(270deg, rgba(250,248,245,0.96) 0%, rgba(250,248,245,0.85) 45%, rgba(250,248,245,0.2) 75%, transparent 100%)"
              : "linear-gradient(90deg, rgba(250,248,245,0.96) 0%, rgba(250,248,245,0.85) 45%, rgba(250,248,245,0.2) 75%, transparent 100%)",
          }}
        />
      </div>

      {/* ════════ CLEAN CONTENT ════════ */}
      <div className="relative z-10 w-full pt-28 pb-16 md:pt-36 lg:py-0">
        <Container>
          <div
            className={`max-w-[560px] transition-all duration-700 ease-out ${
              mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
          >
            {/* Badge */}
            <div className="inline-flex items-center px-3.5 py-1.5 mb-5 rounded-full bg-[#0D4F4F]/8 border border-[#0D4F4F]/15">
              <Sparkles className="w-3.5 h-3.5 text-[#B8945F] me-2 shrink-0" />
              <span className="text-[11px] sm:text-xs font-bold text-[#0D4F4F] tracking-wide uppercase">
                {content.badge}
              </span>
            </div>

            {/* Headline */}
            <h1
              className="text-[2.4rem] sm:text-[3.2rem] lg:text-[4rem] font-bold leading-[1.1] tracking-tight mb-5"
              style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
            >
              <span className="block text-[#0D4F4F]">{content.h1Part1}</span>
              <span className="block text-[#B8945F] mt-1 lg:mt-2">{content.h1Part2}</span>
            </h1>

            {/* Subtitle */}
            <p className="text-[15px] sm:text-base text-slate-700 leading-relaxed mb-8 max-w-[460px]">
              {content.subtitle}
            </p>

            {/* Features */}
            <div className="flex flex-wrap items-center gap-4 sm:gap-6 mb-10">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#0D4F4F] shrink-0" />
                <span className="text-[13px] font-bold text-slate-800">
                  {content.feat1}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#0D4F4F] shrink-0" />
                <span className="text-[13px] font-bold text-slate-800">
                  {content.feat2}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-[#0D4F4F] shrink-0" />
                <span className="text-[13px] font-bold text-slate-800">
                  {content.feat3}
                </span>
              </div>
            </div>

            {/* CTA Button */}
            <Link href="/book-trial" className="block w-full sm:w-auto">
              <Button
                size="lg"
                className="group w-full sm:w-auto h-14 px-8 rounded-xl bg-[#0D4F4F] hover:bg-[#093D33] text-white text-[15px] font-bold shadow-xl shadow-[#0D4F4F]/20 transition-all"
              >
                {content.primaryCta}
                {isRTL ? (
                  <ArrowLeft className="w-5 h-5 ms-2 group-hover:-translate-x-1 transition-transform" />
                ) : (
                  <ArrowRight className="w-5 h-5 ms-2 group-hover:translate-x-1 transition-transform" />
                )}
              </Button>
            </Link>
          </div>
        </Container>
      </div>
    </section>
  );
}