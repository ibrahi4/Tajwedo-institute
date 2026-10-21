"use client";

import React, { useState } from "react";
import { useLesson } from "../shared/LessonContext";
import { Volume2, BookOpen } from "lucide-react";

export default function ReadingPracticeLesson() {
  const lessonCtx = useLesson();
  const isTeacherMode = lessonCtx?.isTeacherMode ?? false;

  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      <div className="max-w-4xl mx-auto p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm text-center space-y-6">
        <div className="w-12 h-12 rounded-2xl bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center mx-auto">
          <BookOpen className="w-6 h-6" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-extrabold">Reading Practice Studio</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-lg mx-auto">
            Interactive reading lab for practicing vocalized words, syllable separation, and fluency.
          </p>
        </div>
      </div>
    </div>
  );
}