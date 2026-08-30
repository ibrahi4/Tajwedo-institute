"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  MessageCircle,
  Send,
  X,
  Sparkles,
  BookOpen,
  Baby,
  CreditCard,
  MessageSquare,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";
import { WHATSAPP_LINK, TELEGRAM_LINK } from "@/lib/constants";
import { useLocale } from "@/hooks/useLocale";
import Image from "next/image";

type Platform = "whatsapp" | "telegram";

export default function WhatsAppButton() {
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [platform, setPlatform] = useState<Platform>("whatsapp");
  const [customMsg, setCustomMsg] = useState("");
  const { isRTL } = useLocale();
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  if (!mounted) return null;

  const quickTemplates = isRTL
    ? [
        {
          id: "trial",
          icon: Sparkles,
          title: "حجز جلسة تجريبية مجانية",
          desc: "طلب موعد حصة تجريبية 30 دقيقة",
          text: "السلام عليكم، أود حجز جلسة تجريبية مجانية لمعرفة المستوى والبدء مع معهد تجويدو.",
          badge: "مجاني",
        },
        {
          id: "quran",
          icon: BookOpen,
          title: "دورات القرآن والتجويد",
          desc: "استفسار عن برامج التلاوة والحفظ",
          text: "السلام عليكم ورحمة الله، أرغب في الاستفسار عن دورات حفظ القرآن الكريم وأحكام التجويد المتاحة.",
        },
        {
          id: "kids",
          icon: Baby,
          title: "برنامج الأطفال والناشئين",
          desc: "دروس تفاعلية مخصصة للأطفال",
          text: "السلام عليكم، أود الاستفسار عن برنامج تعليم القرآن واللغة العربية للأطفال والمواعيد المتاحة.",
        },
        {
          id: "pricing",
          icon: CreditCard,
          title: "الأسعار والاشتراكات",
          desc: "تفاصيل الباقات والجداول الدراسية",
          text: "السلام عليكم، أرجو تزويدي بتفاصيل خطط الاشتراكات الشهرية والجداول المتاحة للحصص.",
        },
      ]
    : [
        {
          id: "trial",
          icon: Sparkles,
          title: "Book a Free Trial Session",
          desc: "Request a 30-minute introductory class",
          text: "Assalamu Alaikum! I would like to book a free 30-minute trial session with Tajwedo Institute.",
          badge: "FREE",
        },
        {
          id: "quran",
          icon: BookOpen,
          title: "Quran & Tajweed Courses",
          desc: "Inquire about recitation & Hifz",
          text: "Assalamu Alaikum, I am interested in learning more about your Quran Recitation and Tajweed programs.",
        },
        {
          id: "kids",
          icon: Baby,
          title: "Kids & Youth Program",
          desc: "Interactive Quran classes for children",
          text: "Assalamu Alaikum! I would like to inquire about online Quran and Arabic classes for my kids.",
        },
        {
          id: "pricing",
          icon: CreditCard,
          title: "Plans & Pricing Options",
          desc: "Details about monthly subscriptions",
          text: "Assalamu Alaikum, could you please provide details about your subscription plans and schedules?",
        },
      ];

  const handleSend = (text: string) => {
    const encoded = encodeURIComponent(text);
    if (platform === "whatsapp") {
      window.open(`${WHATSAPP_LINK}?text=${encoded}`, "_blank");
    } else {
      window.open(`${TELEGRAM_LINK}`, "_blank");
    }
    setIsOpen(false);
  };

  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight;

  return (
    <div
      ref={panelRef}
      className={`fixed bottom-6 z-50 flex flex-col items-end ${
        isRTL ? "left-6 rtl:right-auto" : "right-6"
      }`}
      dir={isRTL ? "rtl" : "ltr"}
    >
      {/* POPUP PANEL */}
      {isOpen && (
        <div className="mb-4 w-[360px] max-w-[calc(100vw-2rem)] bg-white rounded-3xl shadow-2xl border border-sand-200 overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-300">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#0D4F4F] to-[#1A6B5A] p-5 text-white relative">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 rtl:right-auto rtl:left-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors text-white"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center p-1.5 shrink-0">
                <Image
                  src="/Tajwedo-Public-Assets/logo.png"
                  alt="Tajwedo Institute"
                  width={36}
                  height={36}
                  className="object-contain"
                />
              </div>
              <div>
                <h3 className="font-bold text-base leading-tight">
                  {isRTL ? "معهد تجويدو" : "Tajwedo Institute"}
                </h3>
                <p className="text-xs text-white/80 flex items-center gap-1.5 mt-0.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  {isRTL ? "فريق الدعم المباشر متصل" : "Instant Support Online"}
                </p>
              </div>
            </div>

            {/* Platform Switcher */}
            <div className="flex bg-black/20 p-1 rounded-xl mt-4 border border-white/10">
              <button
                type="button"
                onClick={() => setPlatform("whatsapp")}
                className={`flex-1 flex items-center justify-center gap-2 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  platform === "whatsapp"
                    ? "bg-emerald-500 text-white shadow-md"
                    : "text-white/70 hover:text-white"
                }`}
              >
                <MessageCircle className="w-3.5 h-3.5" />
                WhatsApp
              </button>
              <button
                type="button"
                onClick={() => setPlatform("telegram")}
                className={`flex-1 flex items-center justify-center gap-2 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  platform === "telegram"
                    ? "bg-[#229ED9] text-white shadow-md"
                    : "text-white/70 hover:text-white"
                }`}
              >
                <Send className="w-3.5 h-3.5" />
                Telegram
              </button>
            </div>
          </div>

          {/* Quick Message Options */}
          <div className="p-4 space-y-2.5 max-h-[340px] overflow-y-auto">
            <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400 px-1">
              {isRTL ? "اختر نوع الاستفسار المباشر:" : "Select a quick topic:"}
            </p>

            {quickTemplates.map((item) => {
              const ItemIcon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => handleSend(item.text)}
                  className="w-full text-start p-3 rounded-2xl border border-sand-200 hover:border-primary/30 bg-sand-50/50 hover:bg-primary/5 transition-all duration-200 group flex items-start gap-3 relative"
                >
                  <div className="w-9 h-9 rounded-xl bg-white shadow-sm border border-sand-200 flex items-center justify-center text-primary group-hover:scale-110 transition-transform shrink-0">
                    <ItemIcon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <p className="text-xs font-bold text-gray-900 group-hover:text-primary transition-colors">
                        {item.title}
                      </p>
                      {item.badge && (
                        <span className="px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[9px] font-extrabold">
                          {item.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-gray-500 truncate mt-0.5">
                      {item.desc}
                    </p>
                  </div>
                  <ArrowIcon className="w-3.5 h-3.5 text-gray-400 group-hover:text-primary group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5 transition-all self-center shrink-0" />
                </button>
              );
            })}
          </div>

          {/* Custom Message Field */}
          <div className="p-3.5 bg-sand-50 border-t border-sand-200">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (customMsg.trim()) handleSend(customMsg.trim());
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={customMsg}
                onChange={(e) => setCustomMsg(e.target.value)}
                placeholder={
                  isRTL ? "أو اكتب استفسارك الخاص..." : "Or type custom message..."
                }
                className="flex-1 px-3.5 py-2 rounded-xl border border-sand-200 bg-white text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
              <button
                type="submit"
                disabled={!customMsg.trim()}
                className="w-9 h-9 rounded-xl bg-primary text-white flex items-center justify-center disabled:opacity-40 hover:bg-primary/90 transition-all shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* TRIGGER BUTTON */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="group flex items-center gap-2.5 px-4 py-3.5 rounded-full bg-gradient-to-r from-[#0D4F4F] to-[#1A6B5A] text-white shadow-xl shadow-primary/25 hover:shadow-2xl hover:scale-105 transition-all duration-300"
        aria-label="Open support chat options"
      >
        <div className="relative">
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-white animate-pulse" />
          <MessageSquare className="w-5 h-5 text-white" />
        </div>
        <span className="font-bold text-sm">
          {isRTL ? "تواصل معنا" : "Quick Chat"}
        </span>
        <Sparkles className="w-4 h-4 text-accent animate-pulse" />
      </button>
    </div>
  );
}