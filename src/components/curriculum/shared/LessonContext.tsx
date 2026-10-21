"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export interface LessonContextType {
  darkMode: boolean;
  setDarkMode: React.Dispatch<React.SetStateAction<boolean>>;
  showTransliteration: boolean;
  setShowTransliteration: React.Dispatch<React.SetStateAction<boolean>>;
  showEnglishMeaning: boolean;
  setShowEnglishMeaning: React.Dispatch<React.SetStateAction<boolean>>;
  isTeacherMode: boolean;
  setIsTeacherMode: React.Dispatch<React.SetStateAction<boolean>>;
}

const LessonContext = createContext<LessonContextType | undefined>(undefined);

export function LessonProvider({ children }: { children: React.ReactNode }) {
  const [darkMode, setDarkModeState] = useState<boolean>(false);
  const [showTransliteration, setShowTransliteration] = useState<boolean>(true);
  const [showEnglishMeaning, setShowEnglishMeaning] = useState<boolean>(true);
  const [isTeacherMode, setIsTeacherMode] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const saved = localStorage.getItem("tajwedo-theme");
    const isDark = saved === "dark" || document.documentElement.classList.contains("dark");
    setDarkModeState(isDark);

    const handleGlobalTheme = (e: Event) => {
      const customEvent = e as CustomEvent<{ dark: boolean }>;
      if (customEvent.detail && typeof customEvent.detail.dark === "boolean") {
        setDarkModeState(customEvent.detail.dark);
      }
    };

    window.addEventListener("tajwedo-theme-change", handleGlobalTheme);
    return () => window.removeEventListener("tajwedo-theme-change", handleGlobalTheme);
  }, []);

  const setDarkMode: React.Dispatch<React.SetStateAction<boolean>> = (val) => {
    setDarkModeState((prev) => {
      const next = typeof val === "function" ? val(prev) : val;
      if (typeof document !== "undefined") {
        const root = document.documentElement;
        if (next) {
          root.classList.add("dark", "curriculum-dark");
          localStorage.setItem("tajwedo-theme", "dark");
        } else {
          root.classList.remove("dark", "curriculum-dark");
          localStorage.setItem("tajwedo-theme", "light");
        }
        window.dispatchEvent(new CustomEvent("tajwedo-theme-change", { detail: { dark: next } }));
      }
      return next;
    });
  };

  return (
    <LessonContext.Provider
      value={{
        darkMode,
        setDarkMode,
        showTransliteration,
        setShowTransliteration,
        showEnglishMeaning,
        setShowEnglishMeaning,
        isTeacherMode,
        setIsTeacherMode,
      }}
    >
      {children}
    </LessonContext.Provider>
  );
}

export function useLesson(): LessonContextType | undefined {
  return useContext(LessonContext);
}