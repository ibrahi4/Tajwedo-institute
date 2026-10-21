"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Home, Volume2, Eye, EyeOff, Trophy, Sparkles } from "lucide-react";
import { useLesson } from "../shared/LessonContext";

const playSound = (text: string, rate = 0.7) => {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  try {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "ar-SA";
    utterance.rate = rate;
    window.speechSynthesis.speak(utterance);
  } catch {}
};

const SURAH_IKHLAS_VERSES = [
  {
    ayah: "قُلْ هُوَ ٱللَّهُ أَحَدٌ ﴿١﴾",
    stoppingReading: "قُلْ هُوَ ٱللَّهُ أَحَدْ",
    translit: "Qul huwa Allaahu Ahad!",
    meaning: "Say, 'He is Allah, [who is] One'",
    tajweedNotes: "Lam in قُلْ has Sukun • Hamzat Al-Wasl in ٱللَّهُ is dropped • Stopping on أَحَدٌ turns Dammatan into Sukun with strong Dal Qalqalah (Ahad!)!",
  },
  {
    ayah: "ٱللَّهُ ٱلصَّمَدُ ﴿٢﴾",
    stoppingReading: "ٱللَّهُ ٱلصَّمَدْ",
    translit: "Allaahu As-Samad!",
    meaning: "Allah, the Eternal Refuge.",
    tajweedNotes: "Sun Lam in ٱلصَّمَدُ merges into heavy Saad with Shaddah (صّ) • Stopping on Dal triggers Qalqalah echo!",
  },
  {
    ayah: "لَمْ يَلِدْ وَلَمْ يُولَدْ ﴿٣﴾",
    stoppingReading: "لَمْ يَلِدْ وَلَمْ يُولَدْ",
    translit: "Lam yalid wa lam yuulad!",
    meaning: "He neither begets nor is born,",
    tajweedNotes: "Two Dal Sukuns (يَلِدْ and يُولَدْ) both bounce with Qalqalah • يُو contains a 2-beat Waw Madd!",
  },
  {
    ayah: "وَلَمْ يَكُن لَّهُۥ كُفُوًا أَحَدٌۢ ﴿٤﴾",
    stoppingReading: "وَلَمْ يَكُن لَّهُۥ كُفُوًا أَحَدْ",
    translit: "Wa lam yakul-lahuu kufuwan Ahad!",
    meaning: "Nor is there to Him any equivalent.",
    tajweedNotes: "Noon in يَكُن merges into Lam without Ghunnah (Idgham) • كُفُوًا has Izhar before أَحَدٌ!",
  },
];

export default function QuranicMasteryLesson() {
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
            <h1 className="text-base sm:text-lg font-extrabold">Lesson 12: Quranic Recitation & Stopping Mastery (سورة الإخلاص)</h1>
          </div>
          <button
            type="button"
            onClick={() => setEnglishHints((p) => !p)}
            className="px-3.5 py-2 rounded-xl border text-xs font-bold inline-flex items-center gap-1.5 bg-[#00A86B]/15 border-[#00A86B]/40 text-[#00A86B]"
          >
            {englishHints ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
            <span>Hints: {englishHints ? "ON" : "OFF"}</span>
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-8 py-10 space-y-8">
        <div className="text-center space-y-2">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-extrabold bg-emerald-500/15 text-[#00A86B]">
            <Trophy className="w-4 h-4" /> Lesson 12 • Noor Al-Bayan Graduation Capstone
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold">
            Surah Al-Ikhlas — Interactive Tajweed & Waqf Lab
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Tap any verse below to hear its recitation and see how all 12 Noor Al-Bayan rules come together!
          </p>
        </div>

        <div className="space-y-5">
          {SURAH_IKHLAS_VERSES.map((v, idx) => (
            <article
              key={idx}
              onClick={() => playSound(v.stoppingReading, 0.7)}
              className={`rounded-3xl border p-7 cursor-pointer transition hover:-translate-y-1 ${
                darkMode ? "bg-[#111827] border-slate-800 shadow-xl" : "bg-white border-slate-200 shadow-lg"
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-5 border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-3">
                  <span className="w-10 h-10 rounded-2xl bg-[#00A86B]/15 text-[#00A86B] font-extrabold flex items-center justify-center">
                    {idx + 1}
                  </span>
                  {englishHints && (
                    <div>
                      <div className="text-base font-extrabold text-[#00A86B]">{v.translit}</div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">{v.meaning}</div>
                    </div>
                  )}
                </div>
                <div dir="rtl" className="text-3xl sm:text-5xl font-serif font-bold text-right">
                  {v.ayah}
                </div>
              </div>
              {englishHints && (
                <div className="pt-4 flex items-center justify-between text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                  <span><strong>Tajweed Breakdown:</strong> {v.tajweedNotes}</span>
                  <Volume2 className="w-5 h-5 text-[#00A86B] shrink-0 ml-4" />
                </div>
              )}
            </article>
          ))}
        </div>
      </main>
    </div>
  );
}