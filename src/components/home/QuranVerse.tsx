import React from "react";
import Container from "@/components/shared/Container";
import { useTranslations } from "next-intl";

export default function QuranVerse() {
  const t = useTranslations("quranVerse");

  return (
    <section
      className="py-16 md:py-20 relative overflow-hidden"
      style={{ background: "linear-gradient(180deg, #F5F0EB 0%, #FAFAF7 100%)" }}
    >
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-500/30 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-500/30 to-transparent" />

      <Container>
        <div className="max-w-3xl mx-auto text-center">
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="h-px w-16 bg-amber-500/40" />
            <div className="w-2 h-2 rounded-full bg-amber-500/60" />
            <div className="h-px w-16 bg-amber-500/40" />
          </div>

          <p
            className="text-2xl md:text-3xl lg:text-4xl leading-[2] mb-6 text-[#0D4F4F]"
            style={{ fontFamily: "var(--font-quran, serif)" }}
          >
            {t("verse")}
          </p>

          <p className="text-lg md:text-xl text-slate-600 italic leading-relaxed mb-4">
            &ldquo;{t("translation")}&rdquo;
          </p>

          <p className="text-sm text-amber-700 font-semibold tracking-wide">
             {t("reference")}
          </p>

          <div className="flex items-center justify-center gap-4 mt-8">
            <div className="h-px w-16 bg-amber-500/40" />
            <div className="w-2 h-2 rounded-full bg-amber-500/40" />
            <div className="h-px w-16 bg-amber-500/40" />
          </div>
        </div>
      </Container>
    </section>
  );
}