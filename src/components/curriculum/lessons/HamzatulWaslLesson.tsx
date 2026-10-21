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

const HAMZA_CARDS = [
  {
    badge: "Hamzat Al-Qat‘ (أ / إ)",
    titleAr: "هَمْزَةُ القَطْع",
    sampleAr: "أَحْمَدُ • إِيْمَانٌ",
    audioText: "أَحْمَدُ",
    rule: "Visible Hamza Head (ء) = Pronounced EVERY Time!",
    desc: "Hamzat Al-Qat' has a clear Hamza symbol (ء) above or below the Alif. You MUST pronounce its crisp glottal stop whether at the start or in the middle of speech!",
    imageUrl: "/Tajwedo-Public-Assets/curriculum-Imag/Arabic Language.webp",
    color: "from-[#FF5A1F] to-[#F59E0B]",
    accent: "text-[#FF5A1F]",
  },
  {
    badge: "Hamzat Al-Wasl (ٱ)",
    titleAr: "هَمْزَةُ الوَصْل (رأس الصاد ٱ)",
    sampleAr: "ٱلْحَمْدُ • وَٱلشَّمْسِ",
    audioText: "وَالشَّمْسِ",
    rule: "Pronounced at the Start • Dropped Silently When Connecting!",
    desc: "Marked in the Mushaf with a tiny head of letter Saad (ٱ). When connecting words (like وَٱلشَّمْسِ), jump straight from Waw to Sheen ('wash-shamsi') and skip the Alif completely!",
    imageUrl: "/Tajwedo-Public-Assets/curriculum-Imag/herosection-booking.webp",
    color: "from-[#0284C7] to-[#38BDF8]",
    accent: "text-[#0284C7]",
  },
];

export default function HamzatulWaslLesson() {
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
            <h1 className="text-base sm:text-lg font-extrabold">Lesson 10: Hamzat Al-Wasl (ٱ) vs. Hamzat Al-Qat‘ (أ)</h1>
          </div>
          <button
            type="button"
            onClick={() => setEnglishHints((p) => !p)}
            className="px-3.5 py-2 rounded-xl border text-xs font-bold inline-flex items-center gap-1.5 bg-[#0284C7]/15 border-[#0284C7]/40 text-[#0284C7]"
          >
            {englishHints ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
            <span>Hints: {englishHints ? "ON" : "OFF"}</span>
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {HAMZA_CARDS.map((c, i) => (
            <article
              key={i}
              onClick={() => playSound(c.audioText, 0.72)}
              className={`rounded-3xl border overflow-hidden cursor-pointer transition hover:-translate-y-1.5 ${darkMode ? "bg-[#111827] border-slate-800 shadow-xl" : "bg-white border-slate-200 shadow-lg"}`}
            >
              <div className={`h-2.5 w-full bg-gradient-to-r ${c.color}`} />
              <div className="relative h-48 overflow-hidden">
                <img src={c.imageUrl} alt={c.badge} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 to-transparent" />
                <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-white">
                  <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-black/50 backdrop-blur-md">{c.badge}</span>
                  <Volume2 className="w-5 h-5" />
                </div>
              </div>
              <div className="p-7 space-y-4">
                <h2 dir="rtl" className={`text-2xl font-serif font-bold ${c.accent}`}>{c.titleAr}</h2>
                <div dir="rtl" className={`py-5 rounded-2xl border text-center text-5xl font-serif font-bold ${c.accent} border-slate-200 dark:border-slate-800`}>
                  {c.sampleAr}
                </div>
                <p className={`text-base font-extrabold ${c.accent}`}>{c.rule}</p>
                {englishHints && <p className="text-sm leading-relaxed text-slate-500 dark:text-slate-300">{c.desc}</p>}
              </div>
            </article>
          ))}
        </div>
      </main>
    </div>
  );
}