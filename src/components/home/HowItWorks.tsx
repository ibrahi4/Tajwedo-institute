import React from "react";
import { CalendarCheck, Target, BookOpen, TrendingUp, ArrowRight, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Container from "@/components/shared/Container";
import SectionHeader from "@/components/shared/SectionHeader";
import { getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

const stepIcons = [CalendarCheck, Target, BookOpen, TrendingUp];
const stepNumbers = ["01", "02", "03", "04"];

export default async function HowItWorks() {
  const locale = await getLocale();
  const t = await getTranslations("howItWorksHome");
  const isRTL = locale === "ar";

  return (
    <section className="py-16 md:py-24 bg-white relative overflow-hidden">
      <Container className="relative z-10">
        <SectionHeader
          title={t("title")}
          subtitle={t("subtitle")}
        />

        <div className="relative max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[0, 1, 2, 3].map((index) => {
              const Icon = stepIcons[index];
              return (
                <div
                  key={index}
                  className="relative bg-white rounded-2xl p-6 border border-stone-200 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group"
                >
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-12 h-12 rounded-2xl bg-[#0D4F4F]/10 text-[#0D4F4F] flex items-center justify-center">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-3xl font-bold text-stone-200 group-hover:text-[#0D4F4F]/20 transition-colors">
                      {stepNumbers[index]}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-[#0D4F4F] transition-colors">
                    {t(`steps.${index}.title`)}
                  </h3>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    {t(`steps.${index}.description`)}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="text-center mt-12">
            <Link href="/book-trial">
              <Button
                size="lg"
                className="rounded-xl bg-[#0D4F4F] hover:bg-[#093D33] text-white font-bold px-8 shadow-lg shadow-[#0D4F4F]/20"
              >
                {t("cta")}
                {isRTL ? <ArrowLeft className="w-4 h-4 ms-2" /> : <ArrowRight className="w-4 h-4 ms-2" />}
              </Button>
            </Link>
            <p className="text-xs text-slate-500 mt-3">
              {t("ctaNote")}
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}