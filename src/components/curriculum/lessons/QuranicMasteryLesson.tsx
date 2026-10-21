"use client";

import React, { useState } from "react";
import { useLesson } from "../shared/LessonContext";
import AudioButton from "../shared/AudioButton";
import QuizEngine, { QuizQuestion } from "../shared/QuizEngine";
import { BookOpen, Award, HelpCircle, Sparkles } from "lucide-react";

const WAQF_SYMBOLS = [
  { symbol: "مـ", name: "Waqf Lazim (وَقْف لَازِم)", rule: "Compulsory Stop — continuing changes the meaning." },
  { symbol: "قلى", name: "Al-Waqf Awla (الوَقْف أَوْلَى)", rule: "Stopping is preferred, though continuing is permissible." },
  { symbol: "صلى", name: "Al-Wasl Awla (الوَصْل أَوْلَى)", rule: "Continuing is preferred, though stopping is permissible." },
  { symbol: "ج", name: "Waqf Ja'iz (وَقْف جَائِز)", rule: "Equal choice between stopping or continuing." },
  { symbol: "لا", name: "Laaall-Waqf (لَا وَقْفَ فِيه)", rule: "Do not stop arbitrarily in the middle of the phrase." },
  { symbol: "∴ ∴", name: "Mu'anaqah (تَعَانُق الوَقْف)", rule: "Stop at ONE of the two three-dot markers, never both." }
];

const CAPSTONE_SURAHS = [
  {
    id: "ikhlas",
    name: "Surah Al-Ikhlas (سُورَةُ الإِخْلَاص)",
    ayahs: [
      { arabic: "قُلْ هُوَ ٱللَّهُ أَحَدٌ ﴿١﴾", stopSound: "Qul Huwal-laahu Ahad (Qalqalah on دْ)", rules: "Moon Lam + Allah Tafkheem + Qalqalah on Dal" },
      { arabic: "ٱللَّهُ ٱلصَّمَدُ ﴿٢﴾", stopSound: "Allaahus-Samad (Sun Lam + Qalqalah on دْ)", rules: "Hamzatul-Wasl + Sun Lam on صّ + Qalqalah" },
      { arabic: "لَمْ يَلِدْ وَلَمْ يُولَدْ ﴿٣﴾", stopSound: "Lam yalid wa lam yoolad", rules: "Sukun on Meem + Qalqalah on دْ + Natural Madd Waw" },
      { arabic: "وَلَمْ يَكُن لَّهُۥ كُفُوًا أَحَدٌۢ ﴿٤﴾", stopSound: "Wa lam yakul-lahoo kufuwan ahad", rules: "Complete Idgham (ن + لّ) + Madd Silah + Izhar + Qalqalah" }
    ]
  },
  {
    id: "kawthar",
    name: "Surah Al-Kawthar (سُورَةُ الكَوْثَر)",
    ayahs: [
      { arabic: "إِنَّآ أَعْطَيْنَٰكَ ٱلْكَوْثَرَ ﴿١﴾", stopSound: "Innaaa a'taynaakal-Kawthar", rules: "Noon Shaddah (2-beat Ghunnah) + Leen (يْ / وْ) + Dagger Alif (ـٰ)" },
      { arabic: "فَصَلِّ لِرَبِّكَ وَٱنْحَرْ ﴿٢﴾", stopSound: "Fasalli li-Rabbika wanhar", rules: "Shaddah on لّ and بّ + Hamzatul-Wasl + Izhar on نْ before ح" },
      { arabic: "إِنَّ شَانِئَكَ هُوَ ٱلْأَبْتَرُ ﴿٣﴾", stopSound: "Inna shaani'aka huwal-abtar", rules: "Noon Shaddah Ghunnah + Moon Lam + Qalqalah on بْ" }
    ]
  }
];

const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: "m1",
    prompt: "When you stop at the end of (قُلْ هُوَ ٱللَّهُ أَحَدٌ), what happens to the final Dal (دٌ)?",
    options: [
      "The Tanween drops and Dal becomes Sakinah with a clear Qalqalah bounce (Ahad)",
      "Pronounce the full Tanween (Ahadun)",
      "Turn Dal into Haa",
      "Stretch Dal for 4 beats"
    ],
    correctIndex: 0,
    explanation: "When stopping on any word ending in Damma or Kasra Tanween, the vowel drops to Sukun, triggering Qalqalah on (دْ)."
  },
  {
    id: "m2",
    prompt: "What does the Mushaf stopping symbol (قلى) mean?",
    options: [
      "Stopping is preferred (الوَقْف أَوْلَى)",
      "Never stop here",
      "Prostration required",
      "Repeat the verse twice"
    ],
    correctIndex: 0,
    explanation: "قلى stands for (الوَقْف أَوْلَى) — you may continue, but pausing there is recommended."
  }
];

export default function QuranicMasteryLesson() {
  const lessonCtx = useLesson();
  const darkMode = lessonCtx?.darkMode ?? false;
  const showTransliteration = lessonCtx?.showTransliteration ?? true;
  const isTeacherMode = lessonCtx?.isTeacherMode ?? false;
  const fontSizeMultiplier = lessonCtx?.fontSizeMultiplier ?? 1.1;

  const [activeTab, setActiveTab] = useState<"surahs" | "waqf" | "quiz">("surahs");
  const [selectedSurah, setSelectedSurah] = useState<string>("ikhlas");

  const currentSurah = CAPSTONE_SURAHS.find((s) => s.id === selectedSurah) || CAPSTONE_SURAHS[0];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-wrap items-center gap-2 p-1.5 rounded-2xl border bg-slate-100/80 dark:bg-slate-900/80 border-slate-200 dark:border-slate-800 w-fit">
        {[
          { id: "surahs", label: "1. Interactive Surah Recitation Lab", icon: BookOpen },
          { id: "waqf", label: "2. Mushaf Stopping Signs (عَلَامَات الوَقْف)", icon: Award },
          { id: "quiz", label: "3. Final Graduation Quiz", icon: HelpCircle },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold inline-flex items-center gap-2 ${
                activeTab === tab.id ? "bg-[#0D9488] text-white shadow-md" : ""
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {activeTab === "surahs" && (
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            {CAPSTONE_SURAHS.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setSelectedSurah(s.id)}
                className={`px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-extrabold transition ${
                  selectedSurah === s.id
                    ? "bg-[#0D9488] text-white shadow-md"
                    : "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
                }`}
              >
                {s.name}
              </button>
            ))}
          </div>

          <div className="space-y-4">
            {currentSurah.ayahs.map((ayah, idx) => (
              <div
                key={idx}
                className={`rounded-3xl border p-6 sm:p-8 space-y-4 ${
                  darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200 shadow-xs"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                    Ayah {idx + 1} • Applied Rules
                  </span>
                  <AudioButton text={ayah.arabic} />
                </div>

                <div dir="rtl" className="text-right py-3">
                  <p style={{ fontSize: `${2.3 * fontSizeMultiplier}rem` }} className="font-serif font-bold leading-relaxed">
                    {ayah.arabic}
                  </p>
                </div>

                {!isTeacherMode && showTransliteration && (
                  <div className="pt-3 border-t border-slate-200/60 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                    <span className="font-extrabold text-teal-600 dark:text-teal-400">{ayah.stopSound}</span>
                    <span className="text-slate-500 font-semibold">Rules inside: {ayah.rules}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === "waqf" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {WAQF_SYMBOLS.map((w, idx) => (
            <div key={idx} className={`rounded-3xl border p-6 space-y-3 ${darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"}`}>
              <div dir="rtl" className="w-16 h-16 rounded-2xl bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center font-serif font-bold text-3xl">
                {w.symbol}
              </div>
              <h4 className="font-extrabold text-base">{w.name}</h4>
              <p className="text-xs text-slate-500 leading-relaxed">{w.rule}</p>
            </div>
          ))}
        </div>
      )}

      {activeTab === "quiz" && (
        <QuizEngine
          questions={QUIZ_QUESTIONS}
        />
      )}
    </div>
  );
}