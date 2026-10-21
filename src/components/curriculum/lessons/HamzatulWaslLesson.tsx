"use client";

import React, { useState } from "react";
import { useLesson } from "../shared/LessonContext";
import AudioButton from "../shared/AudioButton";
import QuizEngine, { QuizQuestion } from "../shared/QuizEngine";
import { GitBranch, HelpCircle, Sparkles } from "lucide-react";

const WASL_EXAMPLES = [
  {
    startingWord: "ٱهْدِنَا",
    connectedPhrase: "وَٱهْدِنَا",
    startVowel: "Kasra (إِهْدِنَا)",
    connectedSound: "Wah-dinaa (ٱ drops completely!)",
    meaning: "Guide us / And guide us",
    rule: "3rd letter (دِ) has Kasra → start with Kasra (Ih-dinaa). When preceded by وَ, skip ٱ!"
  },
  {
    startingWord: "ٱسْجُدْ",
    connectedPhrase: "فَٱسْجُدْ",
    startVowel: "Damma (أُسْجُدْ)",
    connectedSound: "Fas-jud (Skip ٱ in connected speech)",
    meaning: "Prostrate / Then prostrate",
    rule: "3rd letter (جُ) has essential Damma → start with Damma (Us-jud)."
  }
];

const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: "w1",
    questionEn: "What happens to Hamzatul-Wasl (ٱ) when a word comes BEFORE it in continuous recitation?",
    options: [
      { id: "a", text: "It is pronounced strongly as A", isCorrect: false },
      { id: "b", text: "It is completely dropped in pronunciation, bridging straight to the next letter", isCorrect: true },
      { id: "c", text: "It is stretched for 2 beats", isCorrect: false },
      { id: "d", text: "It turns into a Noon", isCorrect: false }
    ],
    explanation: "Hamzatul-Wasl is a bridge letter: pronounced only when starting, and dropped completely when connecting!"
  }
] as unknown as QuizQuestion[];

export default function HamzatulWaslLesson() {
  const lessonCtx = useLesson();
  const darkMode = lessonCtx?.darkMode ?? false;
  const showTransliteration = lessonCtx?.showTransliteration ?? true;
  const showEnglishMeaning = lessonCtx?.showEnglishMeaning ?? true;
  const isTeacherMode = lessonCtx?.isTeacherMode ?? false;
  const fontSizeMultiplier = lessonCtx?.fontSizeMultiplier ?? 1.1;

  const [activeTab, setActiveTab] = useState<"bridge" | "compare" | "quiz">("bridge");
  const [mode, setMode] = useState<"start" | "connect">("start");

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-wrap items-center gap-2 p-1.5 rounded-2xl border bg-slate-100/80 dark:bg-slate-900/80 border-slate-200 dark:border-slate-800 w-fit">
        {[
          { id: "bridge", label: "1. Interactive Bridge Simulator (ٱ)", icon: GitBranch },
          { id: "compare", label: "2. Starting Vowel Decoder", icon: Sparkles },
          { id: "quiz", label: "3. Mastery Quiz", icon: HelpCircle },
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

      {activeTab === "bridge" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {WASL_EXAMPLES.map((item, idx) => {
              const arabicText = mode === "start" ? item.startingWord : item.connectedPhrase;
              return (
                <div key={idx} className={`rounded-3xl border p-6 space-y-4 ${darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"}`}>
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-teal-500/15 text-teal-600 dark:text-teal-400">
                      {mode === "start" ? `Start with ${item.startVowel}` : "Bridge Mode"}
                    </span>
                    <AudioButton text={arabicText} />
                  </div>
                  <div dir="rtl" className="text-center py-4">
                    <p style={{ fontSize: `${2.5 * fontSizeMultiplier}rem` }} className="font-serif font-bold">
                      {arabicText}
                    </p>
                  </div>
                </div>
              );
            })}
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