"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { useLocale } from "@/hooks/useLocale";
import { ArrowRight, ArrowLeft, ShieldCheck, Clock, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";

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
      className="relative flex flex-col lg:flex-row min-h-[100svh] bg-[#FDFBF7] overflow-hidden"
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className="relative w-full h-[45vh] lg:absolute lg:inset-0 lg:h-full z-0">
        <Image
          src="/Tajwedo-Public-Assets/herosection.webp"
          alt="Tajwedo Institute"
          fill
          priority
          quality={65}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 60vw"
          className="object-cover object-[70%_center] lg:object-[80%_center]"
        />

        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#FDFBF7] to-transparent lg:hidden" />

        <div
          className="hidden lg:block absolute inset-0"
          style={{
            background: isRTL
              ? "linear-gradient(90deg, #FDFBF7 0%, rgba(253,251,247,0.95) 30%, rgba(253,251,247,0.7) 50%, transparent 100%)"
              : "linear-gradient(90deg, #FDFBF7 0%, rgba(253,251,247,0.95) 30%, rgba(253,251,247,0.7) 50%, transparent 100%)",
          }}
        />
      </div>

      <div className="relative z-10 w-full flex-1 flex flex-col justify-start lg:justify-center px-5 sm:px-10 lg:px-16 xl:px-24 pt-4 pb-12 lg:py-32">
        <div
          className={`w-full max-w-[540px] transition-all duration-700 ease-out ${
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div className="inline-flex items-center px-3 py-1.5 mb-6 rounded-full bg-[#0D4F4F]/5 border border-[#0D4F4F]/10">
            <span className="flex h-2 w-2 rounded-full bg-[#C9A567] me-2" />
            <span className="text-[11px] sm:text-xs font-bold text-[#0D4F4F] tracking-wide uppercase">
              {content.badge}
            </span>
          </div>

          <h1
            className="text-[2.5rem] sm:text-[3.2rem] lg:text-[4rem] font-bold leading-[1.1] tracking-tight mb-5"
            style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
          >
            <span className="block text-[#0D4F4F]">{content.h1Part1}</span>
            <span className="block text-[#C9A567] mt-1 lg:mt-2">{content.h1Part2}</span>
          </h1>

          <p className="text-[15px] sm:text-base text-slate-600 leading-relaxed mb-8 max-w-[480px]">
            {content.subtitle}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 mb-10">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#0D4F4F]/5 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-4 h-4 text-[#0D4F4F]" />
              </div>
              <span className="text-[13px] font-bold text-slate-800 leading-none">
                {content.feat1}
              </span>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#0D4F4F]/5 flex items-center justify-center shrink-0">
                <Clock className="w-4 h-4 text-[#0D4F4F]" />
              </div>
              <span className="text-[13px] font-bold text-slate-800 leading-none">
                {content.feat2}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#0D4F4F]/5 flex items-center justify-center shrink-0">
                <Globe className="w-4 h-4 text-[#0D4F4F]" />
              </div>
              <span className="text-[13px] font-bold text-slate-800 leading-none">
                {content.feat3}
              </span>
            </div>
          </div>

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
      </div>
    </section>
  );
}