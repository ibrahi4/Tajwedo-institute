"use client";

import React, { useState, useMemo } from "react";
import { Search, ChevronDown, MessageCircle, HelpCircle, Sparkles, ShieldCheck } from "lucide-react";
import { useTranslations } from "next-intl";
import { useLocale } from "@/hooks/useLocale";
import Container from "@/components/shared/Container";
import { WHATSAPP_LINK } from "@/lib/constants";
import { trackWhatsAppClick } from "@/components/shared/GoogleTagManager";

type CategoryKey = "all" | "general" | "lessons" | "pricing" | "scheduling" | "curriculum" | "technical";

export default function FAQHubContent() {
  const t = useTranslations("faq");
  const { isRTL } = useLocale();
  const [activeCategory, setActiveCategory] = useState<CategoryKey>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [openQuestion, setOpenQuestion] = useState<string | null>(null);

  const categories: { key: CategoryKey; label: string }[] = [
    { key: "all", label: t("categories.all") },
    { key: "general", label: t("categories.general") },
    { key: "lessons", label: t("categories.lessons") },
    { key: "pricing", label: t("categories.pricing") },
    { key: "scheduling", label: t("categories.scheduling") },
    { key: "curriculum", label: t("categories.curriculum") },
    { key: "technical", label: t("categories.technical") },
  ];

  // Extract all questions dynamically from translations
  const allFaqItems = useMemo(() => {
    const catKeys: CategoryKey[] = ["general", "lessons", "pricing", "scheduling", "curriculum", "technical"];
    const items: { id: string; category: CategoryKey; q: string; a: string }[] = [];

    catKeys.forEach((cat) => {
      try {
        const count = Number(t(`${cat}.count`) || 0);
        for (let i = 0; i < count; i++) {
          const q = t(`${cat}.items.${i}.q`);
          const a = t(`${cat}.items.${i}.a`);
          if (q && a) {
            items.push({ id: `${cat}-${i}`, category: cat, q, a });
          }
        }
      } catch {
        // Fallback safely
      }
    });

    return items;
  }, [t]);

  // Filter items based on active category and live search query
  const filteredItems = useMemo(() => {
    return allFaqItems.filter((item) => {
      const matchesCategory = activeCategory === "all" || item.category === activeCategory;
      const matchesSearch =
        !searchQuery.trim() ||
        item.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.a.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [allFaqItems, activeCategory, searchQuery]);

  const whatsappUrl = `${WHATSAPP_LINK}?text=${encodeURIComponent(
    isRTL
      ? "السلام عليكم، لدي سؤال إضافي حول دروس القرآن في معهد تجويدو."
      : "Assalamu Alaikum, I have an additional question about Quran lessons at Tajwedo Institute."
  )}`;

  return (
    <div className="py-12 md:py-16 bg-[#FFFDF8]" dir={isRTL ? "rtl" : "ltr"}>
      <Container>
        {/* Live Search Input */}
        <div className="max-w-2xl mx-auto mb-10">
          <div className="relative">
            <Search className="absolute start-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t("hero.searchPlaceholder")}
              className="w-full ps-12 pe-4 py-4 rounded-2xl border border-stone-200 bg-white text-slate-800 text-sm md:text-base focus:outline-none focus:border-[#0D4F4F] shadow-sm transition-all"
            />
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center justify-center flex-wrap gap-2 max-w-4xl mx-auto mb-12">
          {categories.map((cat) => (
            <button
              key={cat.key}
              type="button"
              onClick={() => setActiveCategory(cat.key)}
              className={`px-4 py-2.5 rounded-xl text-xs md:text-sm font-bold transition-all duration-200 ${
                activeCategory === cat.key
                  ? "bg-[#0D4F4F] text-white shadow-md"
                  : "bg-white border border-stone-200 text-slate-700 hover:bg-stone-100"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* FAQ Items Accordion List */}
        <div className="max-w-3xl mx-auto space-y-4 mb-16">
          {filteredItems.length > 0 ? (
            filteredItems.map((item) => {
              const isOpen = openQuestion === item.id;
              return (
                <div
                  key={item.id}
                  className={`rounded-2xl border transition-all duration-300 overflow-hidden bg-white ${
                    isOpen ? "border-[#0D4F4F] shadow-md ring-1 ring-[#0D4F4F]/10" : "border-stone-200/80 hover:border-stone-300"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setOpenQuestion(isOpen ? null : item.id)}
                    className="w-full p-5 text-start flex items-center justify-between gap-4 font-bold text-slate-900 text-base"
                  >
                    <span className="flex items-center gap-3">
                      <HelpCircle className="w-5 h-5 text-[#0D4F4F] shrink-0" />
                      <span>{item.q}</span>
                    </span>
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-transform duration-300 ${
                        isOpen ? "bg-[#0D4F4F] text-white rotate-180" : "bg-stone-100 text-slate-500"
                      }`}
                    >
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 text-slate-600 text-sm leading-relaxed border-t border-stone-100/80">
                      <p className="ps-8">{item.a}</p>
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="text-center py-12 bg-white rounded-2xl border border-stone-200">
              <HelpCircle className="w-10 h-10 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-600 font-semibold text-sm">
                {isRTL ? "لم نجد أسئلة تطابق بحثك." : "No questions match your search query."}
              </p>
            </div>
          )}
        </div>

        {/* WhatsApp Direct Assistance Card */}
        <div className="max-w-2xl mx-auto p-8 rounded-3xl bg-[#0D4F4F] text-white text-center space-y-4 shadow-xl">
          <div className="w-12 h-12 rounded-full bg-white/10 text-amber-400 flex items-center justify-center mx-auto">
            <Sparkles className="w-6 h-6" />
          </div>
          <h3 className="text-2xl font-bold">{t("cta.title")}</h3>
          <p className="text-white/80 text-sm leading-relaxed max-w-md mx-auto">
            {t("cta.subtitle")}
          </p>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() =>
              trackWhatsAppClick({
                button_id: "faq_hub_wa_cta",
                button_location: "faq_hub_bottom",
                click_url: whatsappUrl,
              })
            }
            className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-sm transition-all shadow-md"
          >
            <MessageCircle className="w-5 h-5" />
            <span>{t("cta.whatsapp")}</span>
          </a>
        </div>
      </Container>
    </div>
  );
}