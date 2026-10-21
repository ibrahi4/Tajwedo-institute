"use client";

import React from "react";
import { LessonProvider, useLesson } from "./shared/LessonContext";

interface LessonLayoutProps {
  children: React.ReactNode;
  courseTitle?: string;
  courseSlug?: string;
  lessonTitle?: string;
  locale?: string;
  prevLesson?: { slug: string; title: string } | null;
  nextLesson?: { slug: string; title: string } | null;
}

function LessonLayoutInner({ children }: LessonLayoutProps) {
  const ctx = useLesson();
  const darkMode = ctx?.darkMode ?? false;

  return (
    <div
      className={`w-full min-h-screen pt-20 transition-colors duration-300 ${
        darkMode ? "bg-[#0B0F19] text-slate-100" : "bg-[#F8FAFC] text-slate-900"
      }`}
    >
      <div className="w-full">{children}</div>
    </div>
  );
}

export default function LessonLayout(props: LessonLayoutProps) {
  return (
    <LessonProvider>
      <LessonLayoutInner {...props} />
    </LessonProvider>
  );
}