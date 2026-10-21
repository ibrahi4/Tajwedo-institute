"use client";

import React, { useState } from "react";
import { CheckCircle2, XCircle, RotateCcw, Award, HelpCircle } from "lucide-react";

export type QuizOptionItem = string | {
  id?: string;
  text?: string;
  label?: string;
  ar?: string;
  isCorrect?: boolean;
};

export interface QuizQuestion {
  id?: string | number;
  question?: string;
  questionEn?: string;
  questionAr?: string;
  prompt?: string;
  arabicPrompt?: string;
  arabic?: string;
  options: QuizOptionItem[];
  correctIndex?: number;
  correctAnswer?: number | string;
  explanation?: string;
  explanationEn?: string;
  explanationAr?: string;
  [key: string]: any;
}

export interface Props {
  title?: string;
  questions: QuizQuestion[];
  onComplete?: (score: number) => void;
  [key: string]: any;
}

export default function QuizEngine({ title, questions = [], onComplete }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  if (!questions || questions.length === 0) return null;

  const currentQ = questions[currentIndex];
  const questionText = currentQ.questionEn || currentQ.question || currentQ.prompt || "";
  const arabicSnippet = currentQ.arabicPrompt || currentQ.arabic || currentQ.questionAr || "";
  const explanationText = currentQ.explanationEn || currentQ.explanation || "";

  const normalizedOptions = (currentQ.options || []).map((opt, idx) => {
    if (typeof opt === "string") {
      const isCorrect =
        typeof currentQ.correctIndex === "number"
          ? currentQ.correctIndex === idx
          : typeof currentQ.correctAnswer === "number"
          ? currentQ.correctAnswer === idx
          : typeof currentQ.correctAnswer === "string"
          ? currentQ.correctAnswer === opt
          : idx === 0;
      return { id: String(idx), text: opt, isCorrect };
    }
    return {
      id: opt.id ?? String(idx),
      text: opt.text || opt.label || opt.ar || "",
      isCorrect: Boolean(opt.isCorrect || currentQ.correctIndex === idx),
    };
  });

  const handleSelect = (idx: number) => {
    if (selectedIdx !== null) return;
    setSelectedIdx(idx);
    if (normalizedOptions[idx]?.isCorrect) {
      setScore((s) => s + 1);
    }
  };

  const handleNext = () => {
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((i) => i + 1);
      setSelectedIdx(null);
    } else {
      setFinished(true);
      onComplete?.(score);
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setSelectedIdx(null);
    setScore(0);
    setFinished(false);
  };

  if (finished) {
    return (
      <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 text-center space-y-5 shadow-sm">
        <div className="w-16 h-16 rounded-2xl bg-teal-500/15 text-teal-600 dark:text-teal-400 flex items-center justify-center mx-auto">
          <Award className="w-8 h-8" />
        </div>
        <h3 className="text-2xl font-extrabold">Quiz Completed!</h3>
        <p className="text-slate-500 font-semibold">
          You scored <span className="text-teal-600 dark:text-teal-400 font-extrabold">{score}</span> out of{" "}
          <span className="font-extrabold">{questions.length}</span>
        </p>
        <button
          type="button"
          onClick={handleRestart}
          className="px-6 py-3 rounded-xl bg-[#0D9488] hover:bg-teal-700 text-white font-extrabold text-sm inline-flex items-center gap-2 transition shadow-md"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Retry Quiz</span>
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 space-y-6 shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
        <div className="flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-teal-600 dark:text-teal-400" />
          <span className="font-extrabold text-sm sm:text-base">{title || "Mastery Check"}</span>
        </div>
        <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
          Question {currentIndex + 1} / {questions.length}
        </span>
      </div>

      <div className="space-y-4">
        <h4 className="text-base sm:text-lg font-extrabold leading-snug">{questionText}</h4>
        {arabicSnippet && (
          <div dir="rtl" className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 text-center font-serif font-bold text-2xl sm:text-3xl text-teal-700 dark:text-teal-300">
            {arabicSnippet}
          </div>
        )}
      </div>

      <div className="space-y-3">
        {normalizedOptions.map((opt, idx) => {
          const isSelected = selectedIdx === idx;
          const showStatus = selectedIdx !== null;
          let btnStyle = "border-slate-200 dark:border-slate-800 hover:border-teal-500/50 bg-slate-50/50 dark:bg-slate-800/40";

          if (showStatus) {
            if (opt.isCorrect) {
              btnStyle = "border-emerald-500 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300";
            } else if (isSelected) {
              btnStyle = "border-rose-500 bg-rose-500/10 text-rose-700 dark:text-rose-300";
            }
          }

          return (
            <button
              key={opt.id}
              type="button"
              disabled={selectedIdx !== null}
              onClick={() => handleSelect(idx)}
              className={`w-full text-left p-4 rounded-2xl border font-bold text-xs sm:text-sm flex items-center justify-between gap-3 transition ${btnStyle}`}
            >
              <span>{opt.text}</span>
              {showStatus && opt.isCorrect && <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />}
              {showStatus && isSelected && !opt.isCorrect && <XCircle className="w-5 h-5 text-rose-500 shrink-0" />}
            </button>
          );
        })}
      </div>

      {selectedIdx !== null && (
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          {explanationText ? (
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed">{explanationText}</p>
          ) : <div />}
          <button
            type="button"
            onClick={handleNext}
            className="px-6 py-2.5 rounded-xl bg-[#0D9488] hover:bg-teal-700 text-white font-extrabold text-xs sm:text-sm shrink-0 transition shadow-md"
          >
            {currentIndex + 1 < questions.length ? "Next Question →" : "See Results"}
          </button>
        </div>
      )}
    </div>
  );
}