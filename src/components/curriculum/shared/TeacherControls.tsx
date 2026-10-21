"use client";

import React from "react";
import { useLesson } from "./LessonContext";
import { Eye, EyeOff, SlidersHorizontal, Sparkles } from "lucide-react";

export default function TeacherControls() {
  const lessonCtx = useLesson();
  const isTeacherMode = lessonCtx?.isTeacherMode ?? false;
  const toggleTeacherMode = lessonCtx?.toggleTeacherMode ?? (() => {});
  const increaseFont = lessonCtx?.increaseFont ?? (() => {});
  const decreaseFont = lessonCtx?.decreaseFont ?? (() => {});

  return (
    <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl border bg-white/80 dark:bg-slate-900/80 border-slate-200 dark:border-slate-800 shadow-xs">
      <button
        type="button"
        onClick={toggleTeacherMode}
        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
          isTeacherMode ? "bg-teal-600 text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
        }`}
      >
        <Sparkles className="w-3.5 h-3.5" />
        <span>Teacher Mode: {isTeacherMode ? "ON" : "OFF"}</span>
      </button>

      <div className="hidden sm:flex items-center gap-1 border-l pl-2 border-slate-200 dark:border-slate-800">
        <button
          type="button"
          onClick={decreaseFont}
          className="px-2 py-1 rounded-md text-xs font-bold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200"
          title="Decrease Font Size"
        >
          A-
        </button>
        <button
          type="button"
          onClick={increaseFont}
          className="px-2 py-1 rounded-md text-xs font-bold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200"
          title="Increase Font Size"
        >
          A+
        </button>
      </div>
    </div>
  );
}