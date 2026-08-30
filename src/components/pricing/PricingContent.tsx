"use client";

import { useState } from "react";
import { useLocale } from "@/hooks/useLocale";
import { Link } from "@/i18n/navigation";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { CheckCircle2, Crown, Sparkles, Star, ArrowRight, ArrowLeft, Shield, Clock, Users } from "lucide-react";

const PLANS = [
  {
    id: "basic",
    name: "Basic",
    nameAr: "الأساسية",
    desc: "Perfect for beginners",
    descAr: "مثالية للمبتدئين",
    priceMonthly: 49.99,
    priceYearly: 499.99,
    sessions: 2,
    iconColor: "text-blue-600",
    iconBg: "bg-blue-50",
    popular: false,
    features: ["2 sessions/week", "60 min/session", "Progress tracking", "Email support", "Recordings"],
    featuresAr: ["جلستان/أسبوع", "60 دقيقة/جلسة", "تتبع التقدم", "دعم بريد", "تسجيلات"],
  },
  {
    id: "premium",
    name: "Premium",
    nameAr: "المميزة",
    desc: "For serious learners",
    descAr: "للمتعلمين الجادين",
    priceMonthly: 99.99,
    priceYearly: 999.99,
    sessions: 4,
    iconColor: "text-primary",
    iconBg: "bg-primary/10",
    popular: true,
    features: ["4 sessions/week", "60 min/session", "Priority support", "Progress reports", "Recordings", "Tajweed assessment"],
    featuresAr: ["4 جلسات/أسبوع", "60 دقيقة/جلسة", "دعم متميز", "تقارير تقدم", "تسجيلات", "تقييم تجويد"],
  },
  {
    id: "family",
    name: "Family",
    nameAr: "العائلية",
    desc: "For the whole family",
    descAr: "للعائلة بأكملها",
    priceMonthly: 149.99,
    priceYearly: 1499.99,
    sessions: 6,
    iconColor: "text-purple-600",
    iconBg: "bg-purple-50",
    popular: false,
    features: ["Up to 4 students", "6 sessions/week", "VIP support", "Family dashboard", "Recordings", "Monthly report"],
    featuresAr: ["حتى 4 طلاب", "6 جلسات/أسبوع", "دعم VIP", "لوحة عائلية", "تسجيلات", "تقرير شهري"],
  },
];

export default function PricingContent() {
  const { isRTL } = useLocale();
  const t = (en: string, ar: string) => (isRTL ? ar : en);
  const Arrow = isRTL ? ArrowLeft : ArrowRight;
  const [billing, setBilling] = useState<"monthly" | "yearly">("monthly");

  return (
    <div className="min-h-screen bg-sand-50" dir={isRTL ? "rtl" : "ltr"}>
      <section className="relative overflow-hidden bg-hero-gradient pt-20 pb-32">
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-accent/20 rounded-full blur-3xl" />
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 border border-white/25 mb-4"
          >
            <Crown className="w-4 h-4 text-accent" />
            <span className="text-xs font-bold text-white/90 uppercase tracking-widest">
              {t("Simple Pricing", "أسعار بسيطة")}
            </span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-bold text-white mb-4 leading-tight"
          >
            {t("Choose Your", "اختر")}{" "}
            <span className="text-accent">{t("Learning Plan", "خطة تعلمك")}</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-white/70 mb-10 max-w-2xl mx-auto"
          >
            {t(
              "Invest in your Quran journey. Cancel anytime.",
              "استثمر في رحلتك مع القرآن. إلغاء في أي وقت."
            )}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="inline-flex items-center gap-1 p-1 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-sm"
          >
            <button
              onClick={() => setBilling("monthly")}
              className={cn(
                "px-5 py-2.5 rounded-xl text-sm font-bold transition-all",
                billing === "monthly" ? "bg-white text-primary shadow-md" : "text-white/70 hover:text-white"
              )}
            >
              {t("Monthly", "شهري")}
            </button>
            <button
              onClick={() => setBilling("yearly")}
              className={cn(
                "px-5 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2",
                billing === "yearly" ? "bg-white text-primary shadow-md" : "text-white/70 hover:text-white"
              )}
            >
              {t("Yearly", "سنوي")}
              <span className="px-2 py-0.5 rounded-full bg-emerald-400/20 text-emerald-300 text-[10px] font-bold border border-emerald-400/30">
                -17%
              </span>
            </button>
          </motion.div>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 80" fill="none">
            <path d="M0 80L480 40L960 60L1440 0V80H0Z" className="fill-sand-50" />
          </svg>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 -mt-16 pb-20">
        <div className="grid md:grid-cols-3 gap-6">
          {PLANS.map((plan, i) => {
            const price = billing === "monthly" ? plan.priceMonthly : plan.priceYearly / 12;
            const features = isRTL ? plan.featuresAr : plan.features;
            return (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className={cn(
                  "relative bg-white rounded-3xl overflow-hidden border transition-all duration-300",
                  plan.popular
                    ? "border-primary shadow-2xl shadow-primary/15 scale-105"
                    : "border-sand-200 shadow-lg hover:shadow-xl hover:-translate-y-1"
                )}
              >
                {plan.popular && (
                  <div className="absolute top-0 left-0 right-0 py-2 bg-gradient-to-r from-primary to-primary/80 text-center">
                    <span className="text-xs font-bold text-white uppercase tracking-widest flex items-center justify-center gap-1.5">
                      <Star className="w-3 h-3 fill-accent text-accent" />
                      {t("Most Popular", "الأكثر شيوعاً")}
                      <Star className="w-3 h-3 fill-accent text-accent" />
                    </span>
                  </div>
                )}
                <div className={cn("p-6", plan.popular && "pt-12")}>
                  <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center mb-4", plan.iconBg)}>
                    <Crown className={cn("w-6 h-6", plan.iconColor)} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-1">
                    {isRTL ? plan.nameAr : plan.name}
                  </h3>
                  <p className="text-sm text-gray-500 mb-4">
                    {isRTL ? plan.descAr : plan.desc}
                  </p>
                  <div className="mb-6">
                    <div className="flex items-end gap-1">
                      <span className="text-4xl font-bold text-gray-900">${price.toFixed(0)}</span>
                      <span className="text-gray-500 text-sm mb-1.5">/{t("mo", "شهر")}</span>
                    </div>
                    {billing === "yearly" && (
                      <p className="text-xs text-emerald-600 font-semibold mt-1">
                        ${plan.priceYearly}/yr
                      </p>
                    )}
                    <p className="text-xs text-gray-500 mt-1">
                      {plan.sessions} {t("sessions/week", "جلسات/أسبوع")}
                    </p>
                  </div>
                  <Link
                    href="/book-trial"
                    className="w-full py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all mb-6 bg-primary text-white hover:bg-primary/90 shadow-lg shadow-primary/25"
                  >
                    <Sparkles className="w-4 h-4" />
                    {t("Start Free Trial", "ابدأ بالتجربة المجانية")}
                    <Arrow className="w-4 h-4" />
                  </Link>
                  <div className="space-y-2.5">
                    {features.map((f, fi) => (
                      <div key={fi} className="flex items-center gap-2.5">
                        <div className={cn("w-5 h-5 rounded-full flex items-center justify-center shrink-0", plan.iconBg)}>
                          <CheckCircle2 className={cn("w-3.5 h-3.5", plan.iconColor)} />
                        </div>
                        <span className="text-sm text-gray-700">{f}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        <div className="mt-12 grid sm:grid-cols-3 gap-4">
          {[
            { Icon: Shield, text: t("Secure Payment", "دفع آمن"), sub: t("SSL encrypted", "تشفير SSL") },
            { Icon: Clock, text: t("Cancel Anytime", "إلغاء في أي وقت"), sub: t("No contracts", "بدون عقود") },
            { Icon: Users, text: t("500+ Students", "500+ طالب"), sub: t("Worldwide", "مجتمع عالمي") },
          ].map(({ Icon, text, sub }, i) => (
            <div key={i} className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-sand-200 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <Icon className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900">{text}</p>
                <p className="text-xs text-gray-500">{sub}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}