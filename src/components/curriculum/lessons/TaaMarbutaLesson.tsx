"use client";

import React, { useState } from "react";
import { useLesson } from "../shared/LessonContext";
import AudioButton from "../shared/AudioButton";
import QuizEngine, { QuizQuestion } from "../shared/QuizEngine";
import { Sparkles, Play, PauseCircle, Layers, HelpCircle, CheckCircle2 } from "lucide-react";

interface TaaWordItem {
  wordContinuing: string;
  wordStopping: string;
  kind: "marbuta" | "maftuha" | "haa";
  translitContinue: string;
  translitStop: string;
  meaning: string;
  note: string;
}

const TAA_WORDS: TaaWordItem[] = [
  {
    wordContinuing: "جَنَّةٌ",
    wordStopping: "جَنَّهْ",
    kind: "marbuta",
    translitContinue: "Jannatun (T sound when continuing)",
    translitStop: "Jannah (Soft H sound when stopping!)",
    meaning: "A Garden / Paradise",
    note: "Taa Marbuta (ة / ـة) transforms into a soft Haa Sakinah (هْ) whenever you pause at the end of a verse."
  },
  {
    wordContinuing: "رَحْمَةٌ",
    wordStopping: "رَحْمَهْ",
    kind: "marbuta",
    translitContinue: "Rahmatun",
    translitStop: "Rahmah",
    meaning: "Mercy",
    note: "Two dots on top = T when connected, H when paused."
  },
  {
    wordContinuing: "ٱلصَّلَوٰةَ",
    wordStopping: "ٱلصَّلَوٰهْ",
    kind: "marbuta",
    translitContinue: "As-Salaata",
    translitStop: "As-Salaah",
    meaning: "The Prayer",
    note: "Pause on Taa Marbuta with a gentle breath of Haa (هْ)."
  },
  {
    wordContinuing: "بَيْتٌ",
    wordStopping: "بَيْتْ",
    kind: "maftuha",
    translitContinue: "Baytun",
    translitStop: "Bayt (Remains T even when stopping!)",
    meaning: "A House",
    note: "Open Taa (ت) NEVER turns into H! It stays a crisp T whether you continue or stop."
  },
  {
    wordContinuing: "بِنْتٌ",
    wordStopping: "بِنْتْ",
    kind: "maftuha",
    translitContinue: "Bintun",
    translitStop: "Bint",
    meaning: "A Daughter / Girl",
    note: "Notice the gentle Hams (breath release) on Open Taa when stopping."
  },
  {
    wordContinuing: "وَجْهُهُ",
    wordStopping: "وَجْهُهْ",
    kind: "haa",
    translitContinue: "Wajhuhu (Always H, no dots)",
    translitStop: "Wajhuh (Always H)",
    meaning: "His Face",
    note: "Haa (ه / ـه) has ZERO dots and is pronounced H both when continuing and when stopping."
  }
];

const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: "t1",
    prompt: "How do you pronounce (جَنَّةٌ) when you STOP at the end of a verse?",
    options: [
      "Jannah (with a soft H sound)",
      "Jannat (with a T sound)",
      "Jannatun",
      "Janna"
    ],
    correctIndex: 0,
    explanation: "When stopping on Taa Marbuta (ة), its vowel and T sound turn into a soft, unvoweled Haa (هْ): Jannah."
  },
  {
    id: "t2",
    prompt: "What happens when you stop on an Open Taa (ت) like in (بَيْتٌ)?",
    options: [
      "It turns into H (Bayh)",
      "It stays a clear T sound with Sukun (Bayt)",
      "It becomes silent",
      "It stretches for 2 beats"
    ],
    correctIndex: 1,
    explanation: "Open Taa (التاء المفتوحة) never changes into Haa; it remains a T sound both in continuation and stopping."
  },
  {
    id: "t3",
    prompt: "How do you tell the difference between Taa Marbuta (ـة) and Haa (ـه)?",
    options: [
      "Taa Marbuta has 2 dots above it; Haa has no dots",
      "They are identical",
      "Haa has 3 dots",
      "Taa Marbuta only comes at the beginning of a word"
    ],
    correctIndex: 0,
    explanation: "Taa Marbuta always carries two dots on top (ة / ـة), whereas final Haa (ه / ـه) has no dots at all."
  }
];

export default function TaaMarbutaLesson() {
  const lessonCtx = useLesson();
  const darkMode = lessonCtx?.darkMode ?? false;
  const showTransliteration = lessonCtx?.showTransliteration ?? true;
  const showEnglishMeaning = lessonCtx?.showEnglishMeaning ?? true;
  const isTeacherMode = lessonCtx?.isTeacherMode ?? false;
  const fontSizeMultiplier = lessonCtx?.fontSizeMultiplier ?? 1.1;

  const [activeTab, setActiveTab] = useState<"simulator" | "compare" | "quiz">("simulator");
  const [stopMode, setStopMode] = useState<boolean>(false);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Studio Tabs */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 rounded-2xl border bg-slate-100/80 dark:bg-slate-900/80 border-slate-200 dark:border-slate-800 w-fit">
        {[
          { id: "simulator", label: "1. Live Stop vs. Continue Simulator", icon: Play },
          { id: "compare", label: "2. ة vs. ت vs. ه Comparison", icon: Layers },
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

      {/* TAB 1: INTERACTIVE WAQF (STOP) VS WASL (CONTINUE) SIMULATOR */}
      {activeTab === "simulator" && (
        <div className="space-y-6">
          <div className={`rounded-3xl border p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200 shadow-xs"}`}>
            <div className="space-y-1">
              <span className="text-xs font-extrabold uppercase tracking-wider text-teal-600 dark:text-teal-400">
                Interactive Chameleon Letter Lab
              </span>
              <h3 className="text-xl font-extrabold">
                Toggle between Continuing (وَصْل) and Stopping (وَقْف)
              </h3>
              <p className="text-xs sm:text-sm text-slate-500">
                Watch how Taa Marbuta (ة) transforms into Haa (هْ) when stopping, while Open Taa (ت) stays T!
              </p>
            </div>

            <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl shrink-0">
              <button
                type="button"
                onClick={() => setStopMode(false)}
                className={`px-4 py-2.5 rounded-xl text-xs font-extrabold transition ${
                  !stopMode ? "bg-emerald-600 text-white shadow-xs" : "text-slate-600 dark:text-slate-300"
                }`}
              >
                ▶ Continue Reading (Wasl)
              </button>
              <button
                type="button"
                onClick={() => setStopMode(true)}
                className={`px-4 py-2.5 rounded-xl text-xs font-extrabold transition ${
                  stopMode ? "bg-amber-600 text-white shadow-xs" : "text-slate-600 dark:text-slate-300"
                }`}
              >
                ⏸ Stop at Verse End (Waqf)
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {TAA_WORDS.map((item, idx) => {
              const displayedArabic = stopMode ? item.wordStopping : item.wordContinuing;
              const displayedTranslit = stopMode ? item.translitStop : item.translitContinue;
              return (
                <div
                  key={idx}
                  className={`rounded-3xl border p-6 space-y-4 transition ${
                    darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200 shadow-xs"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-teal-500/15 text-teal-600 dark:text-teal-400">
                      {item.kind === "marbuta" ? "Taa Marbuta (ة)" : item.kind === "maftuha" ? "Open Taa (ت)" : "Pure Haa (ه)"}
                    </span>
                    <AudioButton text={displayedArabic} />
                  </div>

                  <div dir="rtl" className="text-center py-5 rounded-2xl bg-slate-500/5">
                    <p style={{ fontSize: `${2.5 * fontSizeMultiplier}rem` }} className="font-serif font-bold">
                      {displayedArabic}
                    </p>
                  </div>

                  {!isTeacherMode && (
                    <div className="space-y-1 text-xs">
                      {showTransliteration && (
                        <p className="font-extrabold text-teal-600 dark:text-teal-400">{displayedTranslit}</p>
                      )}
                      {showEnglishMeaning && (
                        <p className="text-slate-500 leading-relaxed">{item.meaning} — {item.note}</p>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: 3-COLUMN COMPARISON */}
      {activeTab === "compare" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              badge: "ة / ـة",
              title: "Taa Marbuta (التاء المربوطة)",
              continueSound: "Pronounced T (ت) with its vowel",
              stopSound: "Transforms into soft H (هْ)",
              example: "رَحْمَةٌ ⬅ رَحْمَهْ"
            },
            {
              badge: "ت / ـت",
              title: "Open Taa (التاء المفتوحة)",
              continueSound: "Pronounced T (ت) with its vowel",
              stopSound: "Stays crisp T with breath (تْ)",
              example: "بَيْتٌ ⬅ بَيْتْ"
            },
            {
              badge: "ه / ـه",
              title: "Final Haa (الهاء المربوطة)",
              continueSound: "Pronounced H (ه) — zero dots",
              stopSound: "Stays soft H (هْ)",
              example: "كِتَابُهُ ⬅ كِتَابُهْ"
            }
          ].map((col, i) => (
            <div key={i} className={`rounded-3xl border p-6 space-y-4 ${darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"}`}>
              <div dir="rtl" className="text-3xl font-serif font-bold text-teal-600 dark:text-teal-400">
                {col.badge}
              </div>
              <h3 className="text-lg font-extrabold">{col.title}</h3>
              <div className="space-y-2 text-xs sm:text-sm">
                <p><strong>When Continuing:</strong> {col.continueSound}</p>
                <p><strong>When Stopping:</strong> {col.stopSound}</p>
              </div>
              <div dir="rtl" className="p-3 rounded-xl bg-teal-500/10 text-center font-serif font-bold text-xl">
                {col.example}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 3: QUIZ */}
      {activeTab === "quiz" && (
        <QuizEngine
          questions={QUIZ_QUESTIONS}
        />
      )}
    </div>
  );
}