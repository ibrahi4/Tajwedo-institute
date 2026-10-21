"use client";

import React, { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

export default function ThemeToggle({ className = "" }: { className?: string }) {
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("tajwedo-theme");
    const root = document.documentElement;
    if (saved === "dark" || root.classList.contains("dark")) {
      setIsDark(true);
      root.classList.add("dark", "curriculum-dark");
    }

    const handleSync = (e: Event) => {
      const customEvent = e as CustomEvent<{ dark: boolean }>;
      if (customEvent.detail && typeof customEvent.detail.dark === "boolean") {
        setIsDark(customEvent.detail.dark);
      }
    };

    window.addEventListener("tajwedo-theme-change", handleSync);
    return () => window.removeEventListener("tajwedo-theme-change", handleSync);
  }, []);

  const toggleTheme = () => {
    const nextDark = !isDark;
    setIsDark(nextDark);
    const root = document.documentElement;
    if (nextDark) {
      root.classList.add("dark", "curriculum-dark");
      localStorage.setItem("tajwedo-theme", "dark");
    } else {
      root.classList.remove("dark", "curriculum-dark");
      localStorage.setItem("tajwedo-theme", "light");
    }
    window.dispatchEvent(
      new CustomEvent("tajwedo-theme-change", { detail: { dark: nextDark } })
    );
  };

  if (!mounted) {
    return (
      <div className="w-10 h-10 rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 animate-pulse" />
    );
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label="Toggle site theme"
      title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
      className={`w-10 h-10 rounded-full border flex items-center justify-center transition-all duration-200 ${ isDark ? "bg-slate-800 border-slate-700 text-amber-400 hover:bg-slate-700 shadow-xs" : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100 shadow-xs" } ${className}`}
    >
      {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
    </button>
  );
}