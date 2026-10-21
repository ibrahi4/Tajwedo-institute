"use client";

import React, { useState } from "react";
import { useLesson } from "../shared/LessonContext";
import AudioButton from "../shared/AudioButton";
import QuizEngine, { QuizQuestion } from "../shared/QuizEngine";
import { Sparkles, Layers, HelpCircle } from "lucide-react";

const FOUR_TAJWEED_RULES = [
  {
    id: "izhar",
    name: "1. Al-Izhar (الإِظْهَار الحَلْقِي)",
    subtitle: "Clear Pronunciation — 0 Extra Nasal Stretch",
    letters: "ء • هـ • ع • ح • غ • خ",
    color: "emerald",
    examples: [
      { arabic: "مِنْ خَوْفٍ", translit: "Min Khawfin", note: "Noon carries a visible Sukun (نْ) before خ." },
      { arabic: "عَلِيمٌ حَكِيمٌ", translit: "'Aleemun Hakeemun", note: "Crisp Noon sound before throat letter ح." }
    ]
  },
  {
    id: "idgham",
    name: "2. Al-Idgham (الإِدْغَام - يَرْمَلُون)",
    subtitle: "Merging into the Next Letter (With or Without Ghunnah)",
    letters: "ي • ر • م • ل • و • ن",
    color: "amber",
    examples: [
      { arabic: "مَن يَقُولُ", translit: "May-Yaqoolu", note: "Idgham with 2-beat Ghunnah (ينمو)." },
      { arabic: "مِن رَّبِّهِمْ", translit: "Mir-Rabbihim", note: "Complete Idgham without Ghunnah (ل / ر)." }
    ]
  },
  {
    id: "iqlab",
    name: "3. Al-Iqlab (الإِقْلَاب)",
    subtitle: "Turning Noon/Tanween into a Hidden Meem (م) before ب",
    letters: "ب (Marked by tiny مـ in Mushaf)",
    color: "sky",
    examples: [
      { arabic: "مِنۢ بَعْدِ", translit: "Mim-Ba'di", note: "Tiny standing Meem (مـ) tells you to pronounce a soft Meem with 2-beat Ghunnah!" },
      { arabic: "سَمِيعٌۢ بَصِيرٌ", translit: "Samee'um-Baseer", note: "Tanween turns into Meem before Baa." }
    ]
  },
  {
    id: "ikhfa",
    name: "4. Al-Ikhfa (الإِخْفَاء الحَقِيقِي)",
    subtitle: "Light Nasal Hiding (2 Beats) before the Remaining 15 Letters",
    letters: "ت ث ج د ذ ز س ش ص ض ط ظ ف ق ك",
    color: "violet",
    examples: [
      { arabic: "مِن شَرِّ", translit: "Min-Sharri", note: "Hover the tongue near ش while holding a 2-beat nasal Ghunnah." },
      { arabic: "أَنتُمْ", translit: "Antum", note: "Bare Noon (ن) without Sukun before ت = Ikhfa." }
    ]
  }
];

const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: "n1",
    prompt: "What does the tiny standing Meem symbol (مـ) above Noon in (مِنۢ بَعْدِ) indicate?",
    options: [
      "Iqlab: Turn the Noon sound into a soft Meem with 2-beat Ghunnah before Baa (ب)",
      "Stop reading immediately",
      "Stretch for 6 beats",
      "Pronounce a hard Qalqalah"
    ],
    correctIndex: 0,
    explanation: "Whenever Noon Sakinah or Tanween is followed by Baa (ب), Iqlab converts it into a soft Meem with Ghunnah, marked by a tiny (مـ)."
  },
  {
    id: "n2",
    prompt: "Which 6 throat letters trigger clear Izhar (الإظهار الحلقي)?",
    options: [
      "ء هـ ع ح غ خ",
      "ي ر م ل و ن",
      "ق ط ب ج د",
      "ص ض ط ظ"
    ],
    correctIndex: 0,
    explanation: "The 6 throat (Halqi) letters (ء هـ ع ح غ خ) always cause Noon Sakinah and Tanween to be pronounced clearly (Izhar)."
  }
];

export default function TanweenNoonRulesLesson() {
  const lessonCtx = useLesson();
  const darkMode = lessonCtx?.darkMode ?? false;
  const showTransliteration = lessonCtx?.showTransliteration ?? true;
  const isTeacherMode = lessonCtx?.isTeacherMode ?? false;
  const fontSizeMultiplier = lessonCtx?.fontSizeMultiplier ?? 1.1;

  const [activeTab, setActiveTab] = useState<"rules" | "quiz">("rules");

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-wrap items-center gap-2 p-1.5 rounded-2xl border bg-slate-100/80 dark:bg-slate-900/80 border-slate-200 dark:border-slate-800 w-fit">
        <button
          type="button"
          onClick={() => setActiveTab("rules")}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold inline-flex items-center gap-2 ${
            activeTab === "rules" ? "bg-[#0D9488] text-white shadow-md" : ""
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>1. The 4 Color-Coded Tajweed Rules</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("quiz")}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold inline-flex items-center gap-2 ${
            activeTab === "quiz" ? "bg-[#0D9488] text-white shadow-md" : ""
          }`}
        >
          <HelpCircle className="w-4 h-4" />
          <span>2. Mastery Quiz</span>
        </button>
      </div>

      {activeTab === "rules" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {FOUR_TAJWEED_RULES.map((rule) => (
            <div
              key={rule.id}
              className={`rounded-3xl border p-6 sm:p-7 space-y-5 ${
                darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200 shadow-xs"
              }`}
            >
              <div>
                <h3 className="text-xl font-extrabold">{rule.name}</h3>
                <p className="text-xs text-slate-500 mt-0.5">{rule.subtitle}</p>
              </div>

              <div dir="rtl" className="p-3 rounded-2xl bg-teal-500/10 text-center font-serif font-bold text-lg text-teal-600 dark:text-teal-300">
                Letters: {rule.letters}
              </div>

              <div className="space-y-3">
                {rule.examples.map((ex, idx) => (
                  <div key={idx} className="p-4 rounded-2xl border border-slate-200/70 dark:border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <AudioButton text={ex.arabic} />
                      <span dir="rtl" style={{ fontSize: `${2 * fontSizeMultiplier}rem` }} className="font-serif font-bold">
                        {ex.arabic}
                      </span>
                    </div>
                    {!isTeacherMode && showTransliteration && (
                      <p className="text-xs font-bold text-teal-600 dark:text-teal-400">
                        {ex.translit} — <span className="font-normal text-slate-500">{ex.note}</span>
                      </p>
                    )}
                  </div>
                ))}
              </div>
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