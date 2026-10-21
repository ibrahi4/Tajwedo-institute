"use client";

import React, { useState } from "react";
import { useLesson } from "../shared/LessonContext";
import AudioButton from "../shared/AudioButton";
import QuizEngine, { QuizQuestion } from "../shared/QuizEngine";
import { Sparkles, Layers, HelpCircle, CheckCircle2, BookOpen } from "lucide-react";

const LEEN_AND_DAGGER_WORDS = [
  {
    arabic: "خَوْفٍ",
    stopping: "خَوْفْ",
    category: "leen",
    formula: "Fatha + Waw Sakinah (ـَوْ)",
    translit: "Khawfin → Stop: Khawf",
    meaning: "Fear (Surah Quraysh)",
    note: "Soft diphthong glide (like 'ow' in how). Stretched 2, 4, or 6 beats when stopping."
  },
  {
    arabic: "بَيْتٍ",
    stopping: "بَيْتْ",
    category: "leen",
    formula: "Fatha + Ya Sakinah (ـَيْ)",
    translit: "Baytin → Stop: Bayt",
    meaning: "House (Ka'bah - Surah Quraysh)",
    note: "Soft diphthong glide (like 'ay' in day). Smooth and effortless."
  },
  {
    arabic: "قُرَيْشٍ",
    stopping: "قُرَيْشْ",
    category: "leen",
    formula: "Fatha + Ya Sakinah (ـَيْ)",
    translit: "Qurayshin → Stop: Quraysh",
    meaning: "Tribe of Quraysh",
    note: "Famous Madd Al-Leen example in Surah Quraysh verse 1."
  },
  {
    arabic: "ٱلصَّيْفِ",
    stopping: "ٱلصَّيْفْ",
    category: "leen",
    formula: "Fatha + Ya Sakinah (ـَيْ)",
    translit: "As-Sayfi → Stop: As-Sayf",
    meaning: "The Summer",
    note: "Notice Sun Lam + Fatha + Ya Sakinah."
  },
  {
    arabic: "ٱلرَّحْمَٰنِ",
    stopping: "ٱلرَّحْمَٰنْ",
    category: "dagger",
    formula: "Dagger Alif (ـٰ) = 2-Beat Madd",
    translit: "Ar-Rahmaani",
    meaning: "The Most Gracious",
    note: "The miniature vertical Alif above Meem (مَٰ) is pronounced exactly like a full Alif Madd!"
  },
  {
    arabic: "هَٰذَا",
    stopping: "هَٰذَا",
    category: "dagger",
    formula: "Dagger Alif (ـٰ) after Haa",
    translit: "Haadhaa",
    meaning: "This",
    note: "Stretch Haa for 2 full beats even though no tall Alif is written."
  },
  {
    arabic: "إِبْرَٰهِيمَ",
    stopping: "إِبْرَٰهِيمْ",
    category: "dagger",
    formula: "Dagger Alif (ـٰ) after Raa",
    translit: "Ibraaheema",
    meaning: "Prophet Ibrahim (AS)",
    note: "Uthmani Mushaf script uses Dagger Alif in prophetic names."
  }
];

const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: "l1",
    prompt: "What is the exact formula for a Leen (Soft Diphthong) sound?",
    options: [
      "A Fatha followed by Waw Sakinah (ـَوْ) or Ya Sakinah (ـَيْ)",
      "A Damma followed by Waw",
      "A Kasra followed by Ya",
      "Any letter with a Shaddah"
    ],
    correctIndex: 0,
    explanation: "Leen letters occur ONLY when Waw Sakinah or Ya Sakinah are preceded by a Fatha (ـَوْ / ـَيْ)."
  },
  {
    id: "l2",
    prompt: "How many beats do you stretch a Dagger Alif (الأَلِف الخَنْجَرِيَّة ـٰ) like in (هَٰذَا)?",
    options: [
      "It is silent",
      "1 beat like a short Fatha",
      "2 full beats, exactly like a normal Natural Madd Alif",
      "6 beats"
    ],
    correctIndex: 2,
    explanation: "A miniature Dagger Alif (ـٰ) is pronounced identically to a full Natural Madd Alif for 2 beats."
  }
];

export default function MaddLeenLesson() {
  const lessonCtx = useLesson();
  const darkMode = lessonCtx?.darkMode ?? false;
  const showTransliteration = lessonCtx?.showTransliteration ?? true;
  const showEnglishMeaning = lessonCtx?.showEnglishMeaning ?? true;
  const isTeacherMode = lessonCtx?.isTeacherMode ?? false;
  const fontSizeMultiplier = lessonCtx?.fontSizeMultiplier ?? 1.1;

  const [activeTab, setActiveTab] = useState<"learn" | "words" | "quiz">("learn");
  const [filter, setFilter] = useState<"all" | "leen" | "dagger">("all");

  const visibleWords = LEEN_AND_DAGGER_WORDS.filter((w) => filter === "all" || w.category === filter);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-wrap items-center gap-2 p-1.5 rounded-2xl border bg-slate-100/80 dark:bg-slate-900/80 border-slate-200 dark:border-slate-800 w-fit">
        {[
          { id: "learn", label: "1. Leen vs. Dagger Alif Rules", icon: Sparkles },
          { id: "words", label: "2. Surah Quraysh & Uthmani Lab", icon: BookOpen },
          { id: "quiz", label: "3. Mastery Quiz", icon: HelpCircle },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold inline-flex items-center gap-2 transition ${
                activeTab === tab.id
                  ? "bg-[#0D9488] text-white shadow-md"
                  : "text-slate-600 dark:text-slate-300 hover:bg-white/60 dark:hover:bg-slate-800"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {activeTab === "learn" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className={`rounded-3xl border p-7 space-y-4 ${darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"}`}>
            <span className="px-3 py-1 rounded-full bg-teal-500/15 text-teal-600 dark:text-teal-400 text-xs font-extrabold">
              Rule 1 • حَرْفَا اللِّين (Soft Glide Letters)
            </span>
            <h3 className="text-xl font-extrabold">Fatha + Waw/Ya Sakinah (ـَوْ / ـَيْ)</h3>
            <p className="text-sm text-slate-500 leading-relaxed">
              Unlike Natural Madd (where Waw follows Damma and Ya follows Kasra), <strong>Leen</strong> happens when Waw Sakinah or Ya Sakinah comes after a <strong>Fatha</strong>—producing the smooth English glides <em>&ldquo;ow&rdquo;</em> (as in <em>how</em>) and <em>&ldquo;ay&rdquo;</em> (as in <em>day</em>).
            </p>
            <div dir="rtl" className="grid grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-teal-500/10 text-center space-y-2">
                <p className="text-3xl font-serif font-bold text-teal-600 dark:text-teal-400">خَوْفْ</p>
                <AudioButton text="خَوْفْ" />
              </div>
              <div className="p-4 rounded-2xl bg-teal-500/10 text-center space-y-2">
                <p className="text-3xl font-serif font-bold text-teal-600 dark:text-teal-400">بَيْتْ</p>
                <AudioButton text="بَيْتْ" />
              </div>
            </div>
          </div>

          <div className={`rounded-3xl border p-7 space-y-4 ${darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"}`}>
            <span className="px-3 py-1 rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400 text-xs font-extrabold">
              Rule 2 • الأَلِفُ الخَنْجَرِيَّة (Dagger Alif)
            </span>
            <h3 className="text-xl font-extrabold">Miniature Uthmani Alif (ـٰ)</h3>
            <p className="text-sm text-slate-500 leading-relaxed">
              In the Uthmani Quran script, many common words use a tiny vertical stroke above the letter (<strong dir="rtl">ـٰ</strong>) instead of a full standing Alif. Always stretch it for <strong>2 full beats</strong>!
            </p>
            <div dir="rtl" className="grid grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-amber-500/10 text-center space-y-2">
                <p className="text-3xl font-serif font-bold text-amber-600 dark:text-amber-400">ٱلرَّحْمَٰنِ</p>
                <AudioButton text="ٱلرَّحْمَٰنِ" />
              </div>
              <div className="p-4 rounded-2xl bg-amber-500/10 text-center space-y-2">
                <p className="text-3xl font-serif font-bold text-amber-600 dark:text-amber-400">هَٰذَا</p>
                <AudioButton text="هَٰذَا" />
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "words" && (
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            {(["all", "leen", "dagger"] as const).map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-xl text-xs font-extrabold uppercase transition ${
                  filter === f ? "bg-[#0D9488] text-white" : "bg-slate-200/70 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                }`}
              >
                {f === "all" ? "All Examples (7)" : f === "leen" ? "Madd Al-Leen (ـَوْ / ـَيْ)" : "Dagger Alif (ـٰ)"}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {visibleWords.map((item, idx) => (
              <div key={idx} className={`rounded-3xl border p-6 space-y-4 ${darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"}`}>
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-teal-500/15 text-teal-600 dark:text-teal-400">
                    {item.formula}
                  </span>
                  <AudioButton text={item.arabic} />
                </div>
                <div dir="rtl" className="text-center py-4">
                  <p style={{ fontSize: `${2.5 * fontSizeMultiplier}rem` }} className="font-serif font-bold">
                    {item.arabic}
                  </p>
                </div>
                {!isTeacherMode && (
                  <div className="text-xs space-y-1 border-t pt-3 border-slate-200/60 dark:border-slate-800">
                    {showTransliteration && <p className="font-bold text-teal-600 dark:text-teal-400">{item.translit}</p>}
                    {showEnglishMeaning && <p className="text-slate-500">{item.meaning} — {item.note}</p>}
                  </div>
                )}
              </div>
            ))}
          </div>
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