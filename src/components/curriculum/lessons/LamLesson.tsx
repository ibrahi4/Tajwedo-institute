"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Home,
  BookOpen,
  Grid,
  Eye,
  EyeOff,
  Volume2,
  ChevronLeft,
  ChevronRight,
  Sun,
  Moon,
  Layers
} from "lucide-react";
import { useLesson } from "../shared/LessonContext";

type MainTab = "learn" | "chart" | "reading";

const playSound = (text: string, rate = 0.72) => {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  try {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "ar-SA";
    utterance.rate = rate;
    window.speechSynthesis.speak(utterance);
  } catch {}
};

const LAM_WORDS = [
  {
    arabic: "ٱلْقَمَرُ",
    translit: "al - qa - ma - ru",
    meaning: "The Moon (Lam Qamariyyah — Pronounced clearly!)",
    type: "qamari",
    imageUrl: "/Tajwedo-Public-Assets/curriculum-Imag/New Muslims.webp",
    ruleNote: "Look at the Sukun (ْ) on top of Lam: pronounce 'AL' clearly!",
  },
  {
    arabic: "ٱلْكِتَابُ",
    translit: "al - ki - taa - bu",
    meaning: "The Book (Lam Qamariyyah)",
    type: "qamari",
    imageUrl: "/Tajwedo-Public-Assets/curriculum-Imag/Arabic Language.webp",
    ruleNote: "Kaf is one of the 14 Moon letters (إبغ حجك وخف عقيمه).",
  },
  {
    arabic: "ٱلشَّمْسُ",
    translit: "ash - sham - su",
    meaning: "The Sun (Lam Shamsiyyah — Silent Lam + Shaddah!)",
    type: "shamsi",
    imageUrl: "/Tajwedo-Public-Assets/curriculum-Imag/herosection-booking.webp",
    ruleNote: "Lam is completely silent! Jump straight from Alif into the doubled Sheen (شّ)!",
  },
  {
    arabic: "ٱلسَّمَاءُ",
    translit: "as - sa - maa - u",
    meaning: "The Sky (Lam Shamsiyyah)",
    type: "shamsi",
    imageUrl: "/Tajwedo-Public-Assets/Services/Tajweed.webp",
    ruleNote: "Notice the Shaddah on Seen (سّ): read it as 'as-samaa-u'!",
  },
];

export default function LamLesson() {
  const lessonCtx = useLesson();
  const darkMode = lessonCtx?.darkMode ?? false;
  const [englishHints, setEnglishHints] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<MainTab>("learn");
  const [wordIdx, setWordIdx] = useState<number>(0);

  const currentWord = LAM_WORDS[wordIdx];

  return (
    <div className={`min-h-screen w-full transition-colors duration-300 font-sans ${darkMode ? "bg-[#0B0F19] text-slate-100" : "bg-[#F8FAFC] text-slate-900"}`}>
      <header className={`sticky top-20 z-30 w-full border-b backdrop-blur-xl ${darkMode ? "bg-[#0B0F19]/90 border-slate-800" : "bg-white/90 border-slate-200"}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link href="/en/curriculum/noor-al-bayan" className="p-2.5 rounded-xl border text-xs font-bold flex items-center gap-1.5">
              <Home className="w-4 h-4 text-[#0D9488]" /> Course
            </Link>
            <div>
              <h1 className="text-base sm:text-lg font-extrabold">Moon & Sun Lam (اللَّامُ القَمَرِيَّةُ وَالشَّمْسِيَّة)</h1>
              <p className="text-xs text-slate-500">14 Moon Letters vs. 14 Sun Letters</p>
            </div>
          </div>

          <nav className="flex items-center gap-2">
            {[
              { id: "learn", label: "Moon vs Sun Guide", icon: BookOpen },
              { id: "reading", label: "Visual Reading", icon: Layers },
            ].map((t) => {
              const Icon = t.icon;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setActiveTab(t.id as MainTab)}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold inline-flex items-center gap-2 ${
                    activeTab === t.id ? "bg-[#0D9488] text-white shadow-md" : "text-slate-500"
                  }`}
                >
                  <Icon className="w-4 h-4" /> {t.label}
                </button>
              );
            })}
          </nav>

          <button
            type="button"
            onClick={() => setEnglishHints((p) => !p)}
            className="px-3.5 py-2 rounded-xl border text-xs font-bold inline-flex items-center gap-1.5 bg-[#0D9488]/15 border-[#0D9488]/40 text-[#0D9488]"
          >
            {englishHints ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
            <span>Hints: {englishHints ? "ON" : "OFF"}</span>
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-8 py-10 space-y-12">
        {activeTab === "learn" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Lam Qamariyyah Card */}
            <article
              onClick={() => playSound("القَمَرُ", 0.72)}
              className={`rounded-3xl border overflow-hidden cursor-pointer transition hover:-translate-y-1 ${darkMode ? "bg-[#111827] border-slate-800 shadow-xl" : "bg-white border-slate-200 shadow-lg"}`}
            >
              <div className="h-2.5 w-full bg-gradient-to-r from-[#0284C7] to-[#38BDF8]" />
              <div className="relative h-48 overflow-hidden">
                <img src="/Tajwedo-Public-Assets/curriculum-Imag/New Muslims.webp" alt="Full Moon" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                <div className="absolute bottom-4 left-5 right-5 flex items-center justify-between text-white">
                  <span className="px-3.5 py-1 rounded-full text-xs font-extrabold bg-[#0284C7] inline-flex items-center gap-1.5">
                    <Moon className="w-3.5 h-3.5" /> Lam Qamariyyah (اللَّامُ القَمَرِيَّة)
                  </span>
                  <Volume2 className="w-5 h-5" />
                </div>
              </div>

              <div className="p-7 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xl font-extrabold text-[#0284C7]">Written & Pronounced Clearly!</span>
                  <span dir="rtl" className="text-4xl font-serif font-bold text-[#0284C7]">ٱلْقَمَرُ</span>
                </div>
                <p className="text-sm leading-relaxed text-slate-500 dark:text-slate-300">
                  Moon Lam carries a visible <strong>Sukun (ْ)</strong> on top of the Lam. Pronounce the &ldquo;L&rdquo; sound clearly before the 14 Moon letters gathered in: <strong>(إِبْغِ حَجَّكَ وَخَفْ عَقِيمَهُ)</strong>.
                </p>
                <div dir="rtl" className="grid grid-cols-7 gap-2 pt-2 text-center">
                  {["أ", "ب", "غ", "ح", "ج", "ك", "و", "خ", "ف", "ع", "ق", "ي", "م", "هـ"].map((l) => (
                    <span key={l} className="py-2 rounded-xl bg-[#0284C7]/15 text-[#0284C7] font-serif font-bold text-xl">
                      {l}
                    </span>
                  ))}
                </div>
              </div>
            </article>

            {/* Lam Shamsiyyah Card */}
            <article
              onClick={() => playSound("الشَّمْسُ", 0.72)}
              className={`rounded-3xl border overflow-hidden cursor-pointer transition hover:-translate-y-1 ${darkMode ? "bg-[#111827] border-slate-800 shadow-xl" : "bg-white border-slate-200 shadow-lg"}`}
            >
              <div className="h-2.5 w-full bg-gradient-to-r from-[#FF5A1F] to-[#F59E0B]" />
              <div className="relative h-48 overflow-hidden">
                <img src="/Tajwedo-Public-Assets/curriculum-Imag/herosection-booking.webp" alt="Bright Sun" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                <div className="absolute bottom-4 left-5 right-5 flex items-center justify-between text-white">
                  <span className="px-3.5 py-1 rounded-full text-xs font-extrabold bg-[#FF5A1F] inline-flex items-center gap-1.5">
                    <Sun className="w-3.5 h-3.5" /> Lam Shamsiyyah (اللَّامُ الشَّمْسِيَّة)
                  </span>
                  <Volume2 className="w-5 h-5" />
                </div>
              </div>

              <div className="p-7 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xl font-extrabold text-[#FF5A1F]">Written, But Completely Silent!</span>
                  <span dir="rtl" className="text-4xl font-serif font-bold text-[#FF5A1F]">ٱلشَّمْسُ</span>
                </div>
                <p className="text-sm leading-relaxed text-slate-500 dark:text-slate-300">
                  Sun Lam has <strong>NO mark on the Lam</strong>, and the letter right after it ALWAYS has a <strong>Shaddah (ـّ)</strong>! Skip the Lam and merge straight into the doubled letter:
                </p>
                <div dir="rtl" className="grid grid-cols-7 gap-2 pt-2 text-center">
                  {["ت", "ث", "د", "ذ", "ر", "ز", "س", "ش", "ص", "ض", "ط", "ظ", "ل", "ن"].map((l) => (
                    <span key={l} className="py-2 rounded-xl bg-[#FF5A1F]/15 text-[#FF5A1F] font-serif font-bold text-xl">
                      {l}ّ
                    </span>
                  ))}
                </div>
              </div>
            </article>
          </div>
        )}

        {activeTab === "reading" && currentWord && (
          <section className={`rounded-3xl border overflow-hidden max-w-4xl mx-auto ${darkMode ? "bg-[#111827] border-slate-800 shadow-2xl" : "bg-white border-slate-200 shadow-xl"}`}>
            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="relative min-h-[320px] p-8 flex flex-col justify-between bg-slate-950 text-white">
                <img src={currentWord.imageUrl} alt={currentWord.meaning} className="absolute inset-0 w-full h-full object-cover opacity-50" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent" />
                <span className="relative z-10 px-3 py-1 rounded-full text-xs font-extrabold bg-white/20 w-fit">
                  Word {wordIdx + 1} of {LAM_WORDS.length}
                </span>
                <div className="relative z-10 text-center my-6">
                  <button type="button" onClick={() => playSound(currentWord.arabic, 0.72)} className="text-6xl font-serif font-bold">
                    {currentWord.arabic}
                  </button>
                  {englishHints && <div className="text-xl font-bold text-amber-300 mt-3">{currentWord.translit}</div>}
                </div>
              </div>

              <div className="p-8 flex flex-col justify-between space-y-6">
                <div className="space-y-3">
                  <span className={`px-3.5 py-1 rounded-full text-xs font-extrabold text-white ${currentWord.type === "qamari" ? "bg-[#0284C7]" : "bg-[#FF5A1F]"}`}>
                    {currentWord.type === "qamari" ? "Moon Lam (Pronounced)" : "Sun Lam (Silent + Shaddah)"}
                  </span>
                  <h3 className="text-2xl font-extrabold">{currentWord.meaning}</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-300">{currentWord.ruleNote}</p>
                </div>

                <div className="flex items-center justify-between gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                  <button type="button" onClick={() => setWordIdx((p) => (p === 0 ? LAM_WORDS.length - 1 : p - 1))} className="px-5 py-3 rounded-2xl border font-extrabold text-sm">
                    Previous
                  </button>
                  <button type="button" onClick={() => playSound(currentWord.arabic, 0.72)} className="px-6 py-3 rounded-2xl bg-[#0D9488] text-white font-extrabold text-sm">
                    Listen
                  </button>
                  <button type="button" onClick={() => setWordIdx((p) => (p + 1 >= LAM_WORDS.length ? 0 : p + 1))} className="px-5 py-3 rounded-2xl border font-extrabold text-sm">
                    Next
                  </button>
                </div>
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}