"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Home, Volume2, Eye, EyeOff } from "lucide-react";
import { useLesson } from "../shared/LessonContext";

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

const TAJWEED_4_RULES = [
  {
    badge: "1. Izhar (الإِظْهَارُ الحَلْقِيّ)",
    sampleAr: "مَنْ آمَنَ • عَلِيمٌ حَكِيمٌ",
    audioText: "مَنْ آمَنَ",
    rule: "Clear Noon Before 6 Throat Letters (ء هـ ع ح غ خ)",
    desc: "In the Mushaf, Noon carries the visible Sukun sign (نْ). Pronounce the 'n' crisply without extra nasal stretching!",
    color: "from-[#0284C7] to-[#38BDF8]",
    accent: "text-[#0284C7]",
  },
  {
    badge: "2. Idgham (الإِدْغَام — يَرْمَلُون)",
    sampleAr: "مَن يَقُولُ • غَفُورٌ رَّحِيمٌ",
    audioText: "مَنْ يَقُولُ",
    rule: "Merge Noon Into the Next Letter (ي ر م ل و ن)",
    desc: "The Noon has NO Sukun on it! Merge straight into the following letter (with 2 beats of Ghunnah on ي ن م و, and without Ghunnah on ل ر).",
    color: "from-[#00A86B] to-[#10B981]",
    accent: "text-[#00A86B]",
  },
  {
    badge: "3. Iqlab (الإِقْلَاب — م)",
    sampleAr: "مِنۢ بَعْدِ • سَمِيعٌۢ بَصِيرٌ",
    audioText: "مِنْ بَعْدِ",
    rule: "Tiny Floating Meem (م) Before Letter Ba (ب)!",
    desc: "Whenever Noon Sakinah or Tanween comes before Ba (ب), the Mushaf places a tiny standing Meem (م) above it—turn the 'n' into a gentle 2-beat 'm'!",
    color: "from-[#FF5A1F] to-[#F59E0B]",
    accent: "text-[#FF5A1F]",
  },
  {
    badge: "4. Ikhfa (الإِخْفَاءُ الحَقِيقِيّ)",
    sampleAr: "مِن قَبْلُ • أَنفُسِهِمْ",
    audioText: "مِنْ قَبْلُ",
    rule: "Soft 2-Beat Nasal Hiding Before the Remaining 15 Letters!",
    desc: "Noon is bare (without Sukun) and the next letter has no Shaddah. Hide the Noon softly with a 2-beat nasal Ghunnah!",
    color: "from-[#7C3AED] to-[#A855F7]",
    accent: "text-[#7C3AED]",
  },
];

export default function TanweenNoonRulesLesson() {
  const lessonCtx = useLesson();
  const darkMode = lessonCtx?.darkMode ?? false;
  const [englishHints, setEnglishHints] = useState<boolean>(true);

  return (
    <div className={`min-h-screen w-full transition-colors duration-300 font-sans ${darkMode ? "bg-[#0B0F19] text-slate-100" : "bg-[#F8FAFC] text-slate-900"}`}>
      <header className={`sticky top-20 z-30 w-full border-b backdrop-blur-xl ${darkMode ? "bg-[#0B0F19]/90 border-slate-800" : "bg-white/90 border-slate-200"}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/en/curriculum/noor-al-bayan" className="p-2.5 rounded-xl border text-xs font-bold flex items-center gap-1.5">
              <Home className="w-4 h-4 text-[#0D9488]" /> Course
            </Link>
            <h1 className="text-base sm:text-lg font-extrabold">Lesson 11: 4 Rules of Noon Sakinah & Tanween</h1>
          </div>
          <button
            type="button"
            onClick={() => setEnglishHints((p) => !p)}
            className="px-3.5 py-2 rounded-xl border text-xs font-bold inline-flex items-center gap-1.5 bg-[#7C3AED]/15 border-[#7C3AED]/40 text-[#7C3AED]"
          >
            {englishHints ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
            <span>Hints: {englishHints ? "ON" : "OFF"}</span>
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
          {TAJWEED_4_RULES.map((c, i) => (
            <article
              key={i}
              onClick={() => playSound(c.audioText, 0.72)}
              className={`rounded-3xl border overflow-hidden cursor-pointer transition hover:-translate-y-1.5 ${darkMode ? "bg-[#111827] border-slate-800 shadow-xl" : "bg-white border-slate-200 shadow-lg"}`}
            >
              <div className={`h-2.5 w-full bg-gradient-to-r ${c.color}`} />
              <div className="p-7 space-y-4">
                <div className="flex items-center justify-between">
                  <span className={`text-sm font-extrabold ${c.accent}`}>{c.badge}</span>
                  <Volume2 className={`w-5 h-5 ${c.accent}`} />
                </div>
                <div dir="rtl" className={`py-6 rounded-2xl border text-center text-4xl sm:text-5xl font-serif font-bold ${c.accent} border-slate-200 dark:border-slate-800`}>
                  {c.sampleAr}
                </div>
                <p className="text-base font-extrabold">{c.rule}</p>
                {englishHints && <p className="text-xs sm:text-sm leading-relaxed text-slate-500 dark:text-slate-300">{c.desc}</p>}
              </div>
            </article>
          ))}
        </div>
      </main>
    </div>
  );
}