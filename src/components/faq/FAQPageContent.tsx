"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Search, BookOpen, Clock, Monitor, GraduationCap, ShieldCheck, Sparkles, Star, Heart, Moon, HelpCircle, MessageCircle } from "lucide-react";
import Container from "@/components/shared/Container";
import FAQCategory from "./FAQCategory";
import FAQCTA from "./FAQCTA";

const categories = [
  { key: "general", icon: BookOpen },
  { key: "lessons", icon: Monitor },
  { key: "scheduling", icon: Clock },
  { key: "curriculum", icon: GraduationCap },
  { key: "technical", icon: ShieldCheck },
];

function seededRandom(seed: number): number {
  const x = Math.sin(seed + 1) * 10000;
  return x - Math.floor(x);
}

function FloatingShapes() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  const shapes = useMemo(() => Array.from({ length: 25 }, (_, i) => {
    const isCircle = seededRandom(i * 9 + 3) > 0.5;
    return {
      size: Math.round((6 + seededRandom(i * 9 + 1) * 14) * 100) / 100,
      top: Math.round(seededRandom(i * 9 + 2) * 10000) / 100 + "%",
      left: Math.round(seededRandom(i * 9 + 4) * 10000) / 100 + "%",
      duration: Math.round((5 + seededRandom(i * 9 + 5) * 7) * 10) / 10,
      delay: Math.round(seededRandom(i * 9 + 6) * 40) / 10,
      opacity: 0.15 + seededRandom(i * 9 + 7) * 0.25,
      isCircle,
      rotation: Math.round(seededRandom(i * 9 + 8) * 360),
    };
  }), []);
  if (!mounted) return null;
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {shapes.map((s, i) => (
        <motion.div key={i} className="absolute" style={{ width: s.size, height: s.size, top: s.top, left: s.left, backgroundColor: "rgba(255, 255, 255, " + s.opacity + ")", borderRadius: s.isCircle ? "50%" : "4px", transform: "rotate(" + s.rotation + "deg)" }} animate={{ y: [0, -25, 0], rotate: [s.rotation, s.rotation + 25, s.rotation] }} transition={{ duration: s.duration, repeat: Infinity, delay: s.delay, ease: "easeInOut" }} />
      ))}
    </div>
  );
}

function FloatingIcons() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  const icons = useMemo(() => {
    const iconList = [HelpCircle, Sparkles, Star, BookOpen, Heart, Moon, MessageCircle, GraduationCap];
    return Array.from({ length: 10 }, (_, i) => ({
      Icon: iconList[i % iconList.length],
      top: Math.round(seededRandom(i * 5 + 11) * 9000) / 100 + "%",
      left: Math.round(seededRandom(i * 5 + 12) * 9500) / 100 + "%",
      duration: 6 + Math.round(seededRandom(i * 5 + 14) * 60) / 10,
      delay: Math.round(seededRandom(i * 5 + 15) * 50) / 10,
    }));
  }, []);
  if (!mounted) return null;
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {icons.map((item, i) => {
        const IconComp = item.Icon;
        return (
          <motion.div key={i} className="absolute text-white/20" style={{ top: item.top, left: item.left }} animate={{ y: [0, -30, 0], rotate: [0, 15, -15, 0], opacity: [0.15, 0.4, 0.15] }} transition={{ duration: item.duration, repeat: Infinity, delay: item.delay, ease: "easeInOut" }}>
            <IconComp className="w-6 h-6" />
          </motion.div>
        );
      })}
    </div>
  );
}

export default function FAQPageContent() {
  const t = useTranslations("faq");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");

  const filteredCategories = useMemo(() => {
    if (activeCategory === "all" && !searchQuery) return categories;
    if (activeCategory !== "all") return categories.filter((cat) => cat.key === activeCategory);
    return categories;
  }, [activeCategory, searchQuery]);

  return (
    <main>
      <section className="relative overflow-hidden pt-28 pb-20 md:pt-36 md:pb-28">
        <div className="absolute inset-0 bg-hero-gradient" />
        <FloatingShapes />
        <FloatingIcons />
        <Container className="relative z-20">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-[1.1] tracking-tight">{t("hero.title")}</h1>
            <div className="relative max-w-xl mx-auto mt-10">
              <Search className="absolute left-4 rtl:left-auto rtl:right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input type="text" placeholder={t("hero.searchPlaceholder")} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-12 rtl:pl-4 rtl:pr-12 pr-4 py-4 rounded-2xl bg-white/95 backdrop-blur-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-accent/50 shadow-xl text-base" />
            </div>
          </motion.div>
        </Container>
      </section>

      <section className="py-8 bg-sand-50 border-b border-sand-200 sticky top-16 md:top-20 z-30 backdrop-blur-xl bg-sand-50/90">
        <Container>
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide pb-2">
            <button onClick={() => setActiveCategory("all")} className={"flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all duration-300 " + (activeCategory === "all" ? "bg-primary text-white shadow-lg shadow-primary/20" : "bg-white text-gray-600 hover:bg-primary/5 hover:text-primary border border-gray-200")}>
              {t("categories.all")}
            </button>
            {categories.map((cat) => {
              const Icon = cat.icon;
              return (
                <button key={cat.key} onClick={() => setActiveCategory(cat.key)} className={"flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all duration-300 " + (activeCategory === cat.key ? "bg-primary text-white shadow-lg shadow-primary/20" : "bg-white text-gray-600 hover:bg-primary/5 hover:text-primary border border-gray-200")}>
                  <Icon className="w-4 h-4" /> {t("categories." + cat.key)}
                </button>
              );
            })}
          </div>
        </Container>
      </section>

      <section className="py-16 md:py-20 bg-sand-50">
        <Container>
          <div className="max-w-4xl mx-auto space-y-12">
            {filteredCategories.map((cat, index) => (
              <FAQCategory key={cat.key} categoryKey={cat.key} icon={cat.icon} searchQuery={searchQuery} index={index} />
            ))}
          </div>
        </Container>
      </section>

      <FAQCTA />
    </main>
  );
}
