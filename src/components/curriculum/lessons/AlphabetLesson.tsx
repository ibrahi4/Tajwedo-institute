"use client";

import React, { useState, useCallback, useMemo } from "react";
import Link from "next/link";
import {
  Home,
  BookOpen,
  Grid,
  Gamepad2,
  Eye,
  EyeOff,
  Star,
  Volume2,
  Trophy,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Sparkles,
  Presentation,
  Search,
  SlidersHorizontal,
  Layers,
  Compass,
  Link2Off
} from "lucide-react";
import { useLesson } from "../shared/LessonContext";

type MainTab = "learn" | "chart" | "reading" | "games";
type GameModeId = "menu" | "letter_forms" | "non_connectors" | "final_test";

interface AlphabetItem {
  letter: string;
  nameEn: string;
  nameAr: string;
  isolated: string;
  beginning: string;
  middle: string;
  end: string;
  isNonConnector: boolean;
  isHeavy: boolean;
  exampleWord: string;
  exampleMeaning: string;
  imageUrl: string;
}

const playSound = (text: string, rate = 0.72) => {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  try {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "ar-SA";
    utterance.rate = rate;
    const voices = window.speechSynthesis.getVoices();
    const arVoice = voices.find((v) => v.lang.includes("ar-SA") || v.lang.includes("ar"));
    if (arVoice) utterance.voice = arVoice;
    window.speechSynthesis.speak(utterance);
  } catch {}
};

const ALPHABET_28: AlphabetItem[] = [
  { letter: "أ", nameEn: "Alif", nameAr: "أَلِف", isolated: "أ", beginning: "أ", middle: "ـأ", end: "ـأ", isNonConnector: true, isHeavy: false, exampleWord: "أَسَدٌ", exampleMeaning: "Lion", imageUrl: "/Tajwedo-Public-Assets/curriculum-Imag/Quran Recitation.webp" },
  { letter: "ب", nameEn: "Ba", nameAr: "بَاء", isolated: "ب", beginning: "بـ", middle: "ـبـ", end: "ـب", isNonConnector: false, isHeavy: false, exampleWord: "بَيْتٌ", exampleMeaning: "House", imageUrl: "/Tajwedo-Public-Assets/curriculum-Imag/Kids Program.webp" },
  { letter: "ت", nameEn: "Ta", nameAr: "تَاء", isolated: "ت", beginning: "تـ", middle: "ـتـ", end: "ـت", isNonConnector: false, isHeavy: false, exampleWord: "تَمْرٌ", exampleMeaning: "Dates", imageUrl: "/Tajwedo-Public-Assets/curriculum-Imag/Quran Recitation.webp" },
  { letter: "ث", nameEn: "Tha", nameAr: "ثَاء", isolated: "ث", beginning: "ثـ", middle: "ـثـ", end: "ـث", isNonConnector: false, isHeavy: false, exampleWord: "ثَلْجٌ", exampleMeaning: "Snow", imageUrl: "/Tajwedo-Public-Assets/curriculum-Imag/Quran Recitation.webp" },
  { letter: "ج", nameEn: "Jeem", nameAr: "جِيم", isolated: "ج", beginning: "جـ", middle: "ـجـ", end: "ـج", isNonConnector: false, isHeavy: false, exampleWord: "جَمَلٌ", exampleMeaning: "Camel", imageUrl: "/Tajwedo-Public-Assets/curriculum-Imag/offer-pair.webp" },
  { letter: "ح", nameEn: "Haa", nameAr: "حَاء", isolated: "ح", beginning: "حـ", middle: "ـحـ", end: "ـح", isNonConnector: false, isHeavy: false, exampleWord: "حَمَامَةٌ", exampleMeaning: "Dove", imageUrl: "/Tajwedo-Public-Assets/curriculum-Imag/Quran Recitation.webp" },
  { letter: "خ", nameEn: "Khaa", nameAr: "خَاء", isolated: "خ", beginning: "خـ", middle: "ـخـ", end: "ـخ", isNonConnector: false, isHeavy: true, exampleWord: "خُبْزٌ", exampleMeaning: "Bread", imageUrl: "/Tajwedo-Public-Assets/curriculum-Imag/Quran Recitation.webp" },
  { letter: "د", nameEn: "Dal", nameAr: "دَال", isolated: "د", beginning: "د", middle: "ـد", end: "ـد", isNonConnector: true, isHeavy: false, exampleWord: "دَرَّاجَةٌ", exampleMeaning: "Bicycle", imageUrl: "/Tajwedo-Public-Assets/curriculum-Imag/Quran Recitation.webp" },
  { letter: "ذ", nameEn: "Dhal", nameAr: "ذَال", isolated: "ذ", beginning: "ذ", middle: "ـذ", end: "ـذ", isNonConnector: true, isHeavy: false, exampleWord: "ذَهَبٌ", exampleMeaning: "Gold", imageUrl: "/Tajwedo-Public-Assets/curriculum-Imag/Quran Recitation.webp" },
  { letter: "ر", nameEn: "Ra", nameAr: "رَاء", isolated: "ر", beginning: "ر", middle: "ـر", end: "ـر", isNonConnector: true, isHeavy: false, exampleWord: "رُمَّانٌ", exampleMeaning: "Pomegranate", imageUrl: "/Tajwedo-Public-Assets/curriculum-Imag/offer-solo.webp" },
  { letter: "ز", nameEn: "Zay", nameAr: "زَاي", isolated: "ز", beginning: "ز", middle: "ـز", end: "ـز", isNonConnector: true, isHeavy: false, exampleWord: "زَهْرَةٌ", exampleMeaning: "Flower", imageUrl: "/Tajwedo-Public-Assets/offer-family.webp" },
  { letter: "س", nameEn: "Seen", nameAr: "سِين", isolated: "س", beginning: "سـ", middle: "ـسـ", end: "ـس", isNonConnector: false, isHeavy: false, exampleWord: "سَمَكَةٌ", exampleMeaning: "Fish", imageUrl: "/Tajwedo-Public-Assets/curriculum-Imag/Quran Recitation.webp" },
  { letter: "ش", nameEn: "Sheen", nameAr: "شِين", isolated: "ش", beginning: "شـ", middle: "ـشـ", end: "ـش", isNonConnector: false, isHeavy: false, exampleWord: "شَجَرَةٌ", exampleMeaning: "Tree", imageUrl: "/Tajwedo-Public-Assets/Services/Kids Program.webp" },
  { letter: "ص", nameEn: "Saad", nameAr: "صَاد", isolated: "ص", beginning: "صـ", middle: "ـصـ", end: "ـص", isNonConnector: false, isHeavy: true, exampleWord: "صَقْرٌ", exampleMeaning: "Falcon", imageUrl: "/Tajwedo-Public-Assets/curriculum-Imag/Quran Recitation.webp" },
  { letter: "ض", nameEn: "Daad", nameAr: "ضَاد", isolated: "ض", beginning: "ضـ", middle: "ـضـ", end: "ـض", isNonConnector: false, isHeavy: true, exampleWord: "ضَوْءٌ", exampleMeaning: "Light", imageUrl: "/Tajwedo-Public-Assets/Services/Islamic Studies.webp" },
  { letter: "ط", nameEn: "Taa", nameAr: "طَاء", isolated: "ط", beginning: "طـ", middle: "ـطـ", end: "ـط", isNonConnector: false, isHeavy: true, exampleWord: "طَائِرٌ", exampleMeaning: "Bird", imageUrl: "/Tajwedo-Public-Assets/herosection-mobile.webp" },
  { letter: "ظ", nameEn: "Dhaa", nameAr: "ظَاء", isolated: "ظ", beginning: "ظـ", middle: "ـظـ", end: "ـظ", isNonConnector: false, isHeavy: true, exampleWord: "ظَرْفٌ", exampleMeaning: "Envelope", imageUrl: "/Tajwedo-Public-Assets/curriculum-Imag/Quran Recitation.webp" },
  { letter: "ع", nameEn: "Ayn", nameAr: "عَيْن", isolated: "ع", beginning: "عـ", middle: "ـعـ", end: "ـع", isNonConnector: false, isHeavy: false, exampleWord: "عَسَلٌ", exampleMeaning: "Honey", imageUrl: "/Tajwedo-Public-Assets/curriculum-Imag/Quran Recitation.webp" },
  { letter: "غ", nameEn: "Ghayn", nameAr: "غَيْن", isolated: "غ", beginning: "غـ", middle: "ـغـ", end: "ـغ", isNonConnector: false, isHeavy: true, exampleWord: "غَيْمٌ", exampleMeaning: "Clouds", imageUrl: "/Tajwedo-Public-Assets/Services/Tajweed.webp" },
  { letter: "ف", nameEn: "Fa", nameAr: "فَاء", isolated: "ف", beginning: "فـ", middle: "ـفـ", end: "ـف", isNonConnector: false, isHeavy: false, exampleWord: "فَرَاشَةٌ", exampleMeaning: "Butterfly", imageUrl: "/Tajwedo-Public-Assets/curriculum-Imag/Quran Recitation.webp" },
  { letter: "ق", nameEn: "Qaf", nameAr: "قَاف", isolated: "ق", beginning: "قـ", middle: "ـقـ", end: "ـق", isNonConnector: false, isHeavy: true, exampleWord: "قَمَرٌ", exampleMeaning: "Moon", imageUrl: "/Tajwedo-Public-Assets/curriculum-Imag/New Muslims.webp" },
  { letter: "ك", nameEn: "Kaf", nameAr: "كَاف", isolated: "ك", beginning: "كـ", middle: "ـكـ", end: "ـك", isNonConnector: false, isHeavy: false, exampleWord: "كِتَابٌ", exampleMeaning: "Book", imageUrl: "/Tajwedo-Public-Assets/curriculum-Imag/Arabic Language.webp" },
  { letter: "ل", nameEn: "Lam", nameAr: "لَام", isolated: "ل", beginning: "لـ", middle: "ـلـ", end: "ـل", isNonConnector: false, isHeavy: false, exampleWord: "لَيْمُونٌ", exampleMeaning: "Lemon", imageUrl: "/Tajwedo-Public-Assets/curriculum-Imag/Quran Recitation.webp" },
  { letter: "م", nameEn: "Meem", nameAr: "مِيم", isolated: "م", beginning: "مـ", middle: "ـمـ", end: "ـم", isNonConnector: false, isHeavy: false, exampleWord: "مَسْجِدٌ", exampleMeaning: "Mosque", imageUrl: "/Tajwedo-Public-Assets/curriculum-Imag/Islamic Studies.webp" },
  { letter: "ن", nameEn: "Noon", nameAr: "نُون", isolated: "ن", beginning: "نـ", middle: "ـنـ", end: "ـن", isNonConnector: false, isHeavy: false, exampleWord: "نَحْلَةٌ", exampleMeaning: "Bee", imageUrl: "/Tajwedo-Public-Assets/curriculum-Imag/Quran Recitation.webp" },
  { letter: "هـ", nameEn: "Ha", nameAr: "هَاء", isolated: "ه", beginning: "هـ", middle: "ـهـ", end: "ـه", isNonConnector: false, isHeavy: false, exampleWord: "هلالٌ", exampleMeaning: "Crescent", imageUrl: "/Tajwedo-Public-Assets/curriculum-Imag/offer-pair.webp" },
  { letter: "و", nameEn: "Waw", nameAr: "وَاو", isolated: "و", beginning: "و", middle: "ـو", end: "ـو", isNonConnector: true, isHeavy: false, exampleWord: "وَرْدَةٌ", exampleMeaning: "Rose", imageUrl: "/Tajwedo-Public-Assets/curriculum-Imag/offer-pair copy.webp" },
  { letter: "ي", nameEn: "Ya", nameAr: "يَاء", isolated: "ي", beginning: "يـ", middle: "ـيـ", end: "ـي", isNonConnector: false, isHeavy: false, exampleWord: "يَدٌ", exampleMeaning: "Hand", imageUrl: "/Tajwedo-Public-Assets/curriculum-Imag/Arabic Language.webp" },
];

export default function AlphabetLesson() {
  const lessonCtx = useLesson();
  const darkMode = lessonCtx?.darkMode ?? false;

  const [englishHints, setEnglishHints] = useState<boolean>(true);
  const [textSizeScale, setTextSizeScale] = useState<number>(1.1);
  const [stars, setStars] = useState<number>(0);

  const [activeTab, setActiveTab] = useState<MainTab>("learn");
  const [filterType, setFilterType] = useState<"all" | "non_connector" | "heavy">("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [readingIdx, setReadingIdx] = useState<number>(0);

  const filteredLetters = useMemo(() => {
    return ALPHABET_28.filter((item) => {
      if (filterType === "non_connector" && !item.isNonConnector) return false;
      if (filterType === "heavy" && !item.isHeavy) return false;
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase().trim();
      return item.nameEn.toLowerCase().includes(q) || item.letter.includes(q);
    });
  }, [filterType, searchQuery]);

  const currentReading = ALPHABET_28[readingIdx];

  return (
    <div className={`min-h-screen w-full transition-colors duration-300 font-sans ${darkMode ? "bg-[#0B0F19] text-slate-100" : "bg-[#F8FAFC] text-slate-900"}`}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "LearningResource",
            name: "Noor Al-Bayan: Arabic Alphabet & Letter Connecting Forms",
            description: "Interactive guide to all 28 Arabic letters, their beginning, middle, and end shapes, non-connecting letters, and heavy letters.",
            educationalLevel: "Beginner",
            inLanguage: ["en", "ar"],
            provider: { "@type": "EducationalOrganization", name: "Tajwedo Institute" },
          }),
        }}
      />

      {/* UNIFIED STUDIO DOCK */}
      <header className={`relative md:sticky md:top-20 z-30 w-full border-b backdrop-blur-xl transition-all ${darkMode ? "bg-[#0B0F19]/90 border-slate-800/80 shadow-lg" : "bg-white/90 border-slate-200/80 shadow-xs"}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              href="/en/curriculum/noor-al-bayan"
              className={`p-2.5 rounded-xl border transition flex items-center gap-1.5 text-xs font-bold ${darkMode ? "bg-slate-900 border-slate-800 text-slate-300" : "bg-slate-100 border-slate-200 text-slate-700"}`}
            >
              <Home className="w-4 h-4 text-[#0D9488]" />
              <span className="hidden sm:inline">Course</span>
            </Link>

            <button
              type="button"
              onClick={() => playSound("أ ب ت ث", 0.72)}
              className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#0D9488] to-[#0284C7] text-white flex items-center justify-center shadow-md"
            >
              <span dir="rtl" className="text-xl font-serif font-bold">أ ب</span>
            </button>

            <div>
              <h1 className="text-base sm:text-lg font-extrabold tracking-tight leading-none">
                Arabic Alphabet & Shapes (الحُرُوفُ وَأَشْكَالُهَا)
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                28 Letters • Connecting Forms • Heavy & Non-Connecting Letters
              </p>
            </div>
          </div>

          <nav className={`flex items-center p-1.5 rounded-2xl border overflow-x-auto no-scrollbar ${darkMode ? "bg-slate-900/90 border-slate-800" : "bg-slate-100/90 border-slate-200/70"}`}>
            {[
              { id: "learn", label: "Core Rules", icon: BookOpen },
              { id: "chart", label: "28 Shapes Matrix", icon: Grid },
              { id: "reading", label: "Visual Flashcards", icon: Layers },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id as MainTab)}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold inline-flex items-center gap-2 transition-all shrink-0 ${
                    isActive
                      ? "bg-gradient-to-r from-[#0D9488] to-[#0284C7] text-white shadow-md"
                      : darkMode ? "text-slate-400 hover:text-white" : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => setEnglishHints((prev) => !prev)}
              className="px-3.5 py-2 rounded-xl border text-xs font-bold inline-flex items-center gap-1.5 bg-[#0D9488]/15 border-[#0D9488]/40 text-[#0D9488]"
            >
              {englishHints ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
              <span>Hints: {englishHints ? "ON" : "OFF"}</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-8 py-10 space-y-12">
        {activeTab === "learn" && (
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-7">
            {/* Rule 1: 3 Positions */}
            <article className={`rounded-3xl border overflow-hidden flex flex-col justify-between ${darkMode ? "bg-[#111827] border-slate-800 shadow-xl" : "bg-white border-slate-200 shadow-lg"}`}>
              <div className="h-2.5 w-full bg-gradient-to-r from-[#0D9488] to-[#10B981]" />
              <div className="p-7 space-y-4">
                <span className="px-3.5 py-1 rounded-full text-xs font-extrabold bg-[#0D9488] text-white">
                  Rule 1 • Connecting Hands
                </span>
                <h2 className="text-2xl font-extrabold">Beginning, Middle & End</h2>
                <p className="text-sm text-slate-500 dark:text-slate-300 leading-relaxed">
                  Arabic is written in a flowing cursive script from right to left. Most letters stretch out their hands to connect with neighbors!
                </p>
                <div dir="rtl" className="grid grid-cols-3 gap-3 text-center pt-2">
                  <div className="p-4 rounded-2xl bg-teal-500/10 border border-teal-500/30">
                    <span className="text-4xl font-serif font-bold text-[#0D9488]">بـ</span>
                    <span dir="ltr" className="block text-xs font-bold mt-2">Start</span>
                  </div>
                  <div className="p-4 rounded-2xl bg-teal-500/10 border border-teal-500/30">
                    <span className="text-4xl font-serif font-bold text-[#0D9488]">ـبـ</span>
                    <span dir="ltr" className="block text-xs font-bold mt-2">Middle</span>
                  </div>
                  <div className="p-4 rounded-2xl bg-teal-500/10 border border-teal-500/30">
                    <span className="text-4xl font-serif font-bold text-[#0D9488]">ـب</span>
                    <span dir="ltr" className="block text-xs font-bold mt-2">End</span>
                  </div>
                </div>
              </div>
            </article>

            {/* Rule 2: 6 Non-Connecting Letters */}
            <article className={`rounded-3xl border overflow-hidden flex flex-col justify-between ${darkMode ? "bg-[#111827] border-slate-800 shadow-xl" : "bg-white border-slate-200 shadow-lg"}`}>
              <div className="h-2.5 w-full bg-gradient-to-r from-[#FF5A1F] to-[#F59E0B]" />
              <div className="p-7 space-y-4">
                <span className="px-3.5 py-1 rounded-full text-xs font-extrabold bg-[#FF5A1F] text-white">
                  Rule 2 • The 6 One-Way Letters
                </span>
                <h2 className="text-2xl font-extrabold">الحُرُوفُ الرَّفَّاسَة</h2>
                <p className="text-sm text-slate-500 dark:text-slate-300 leading-relaxed">
                  6 special letters connect ONLY from the right (before them) and NEVER hold the hand of the letter after them!
                </p>
                <div dir="rtl" className="grid grid-cols-6 gap-2 text-center pt-2">
                  {["أ", "د", "ذ", "ر", "ز", "و"].map((l) => (
                    <button
                      key={l}
                      type="button"
                      onClick={() => playSound(l, 0.72)}
                      className="p-3 rounded-2xl bg-[#FF5A1F]/15 border border-[#FF5A1F]/40 text-3xl font-serif font-bold text-[#FF5A1F] hover:scale-105 transition"
                    >
                      {l}
                    </button>
                  ))}
                </div>
              </div>
            </article>

            {/* Rule 3: 7 Heavy Letters */}
            <article className={`rounded-3xl border overflow-hidden flex flex-col justify-between ${darkMode ? "bg-[#111827] border-slate-800 shadow-xl" : "bg-white border-slate-200 shadow-lg"}`}>
              <div className="h-2.5 w-full bg-gradient-to-r from-[#7C3AED] to-[#A855F7]" />
              <div className="p-7 space-y-4">
                <span className="px-3.5 py-1 rounded-full text-xs font-extrabold bg-[#7C3AED] text-white">
                  Rule 3 • Heavy Letters (خُصَّ ضَغْطٍ قِظْ)
                </span>
                <h2 className="text-2xl font-extrabold">حُرُوفُ التَّفْخِيم</h2>
                <p className="text-sm text-slate-500 dark:text-slate-300 leading-relaxed">
                  7 letters are always pronounced with a full, deep, elevated tongue sound (Tafkheem):
                </p>
                <div dir="rtl" className="grid grid-cols-7 gap-1.5 text-center pt-2">
                  {["خ", "ص", "ض", "غ", "ط", "ق", "ظ"].map((l) => (
                    <button
                      key={l}
                      type="button"
                      onClick={() => playSound(l, 0.72)}
                      className="py-3 rounded-2xl bg-[#7C3AED]/15 border border-[#7C3AED]/40 text-2xl font-serif font-bold text-[#7C3AED] hover:scale-105 transition"
                    >
                      {l}
                    </button>
                  ))}
                </div>
              </div>
            </article>
          </section>
        )}

        {activeTab === "chart" && (
          <section className="space-y-8">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <h2 className="text-2xl sm:text-4xl font-extrabold">All 28 Letters & Connecting Shapes</h2>
              <div className="flex flex-wrap items-center gap-2">
                {[
                  { id: "all", label: "All 28 Letters" },
                  { id: "non_connector", label: "6 One-Way Letters (أ د ذ ر ز و)" },
                  { id: "heavy", label: "7 Heavy Letters (خص ضغط قظ)" },
                ].map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => setFilterType(f.id as "all" | "non_connector" | "heavy")}
                    className={`px-4 py-2 rounded-2xl text-xs font-extrabold transition ${
                      filterType === f.id
                        ? "bg-[#0D9488] text-white shadow-md"
                        : darkMode ? "bg-[#111827] border border-slate-800" : "bg-white border border-slate-200"
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredLetters.map((item) => (
                <div
                  key={item.nameEn}
                  onClick={() => playSound(item.nameAr, 0.74)}
                  className={`rounded-3xl border p-5 cursor-pointer flex items-center justify-between gap-4 transition hover:-translate-y-0.5 ${
                    darkMode ? "bg-[#111827] border-slate-800" : "bg-white border-slate-200 shadow-sm"
                  }`}
                >
                  <div className="w-24 text-center border-r pr-4 border-slate-200 dark:border-slate-800">
                    <span dir="rtl" className="text-4xl font-serif font-bold text-[#0D9488]">{item.isolated}</span>
                    <span className="block text-xs font-extrabold text-slate-400 mt-1">{item.nameEn}</span>
                  </div>

                  <div dir="rtl" className="flex-1 grid grid-cols-3 gap-2 text-center">
                    <div className="p-3 rounded-2xl bg-slate-500/10">
                      <span className="block text-2xl font-serif font-bold text-[#FF5A1F]">{item.beginning}</span>
                      <span dir="ltr" className="text-[10px] font-bold text-slate-400">Start</span>
                    </div>
                    <div className="p-3 rounded-2xl bg-slate-500/10">
                      <span className="block text-2xl font-serif font-bold text-[#00A86B]">{item.middle}</span>
                      <span dir="ltr" className="text-[10px] font-bold text-slate-400">Middle</span>
                    </div>
                    <div className="p-3 rounded-2xl bg-slate-500/10">
                      <span className="block text-2xl font-serif font-bold text-[#7C3AED]">{item.end}</span>
                      <span dir="ltr" className="text-[10px] font-bold text-slate-400">End</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {activeTab === "reading" && currentReading && (
          <section className={`rounded-3xl border overflow-hidden max-w-4xl mx-auto ${darkMode ? "bg-[#111827] border-slate-800 shadow-2xl" : "bg-white border-slate-200 shadow-xl"}`}>
            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="relative min-h-[320px] p-8 flex flex-col justify-between bg-slate-950 text-white">
                <img src={currentReading.imageUrl} alt={currentReading.exampleMeaning} className="absolute inset-0 w-full h-full object-cover opacity-50" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent" />
                <span className="relative z-10 px-3 py-1 rounded-full text-xs font-extrabold bg-white/20 w-fit">
                  Letter {readingIdx + 1} of 28 • {currentReading.nameEn}
                </span>
                <div className="relative z-10 text-center my-6">
                  <button type="button" onClick={() => playSound(currentReading.exampleWord, 0.72)} className="text-7xl font-serif font-bold">
                    {currentReading.exampleWord}
                  </button>
                  <div className="text-lg font-bold text-teal-300 mt-2">{currentReading.exampleMeaning}</div>
                </div>
              </div>

              <div className="p-8 flex flex-col justify-between space-y-6">
                <div className="text-center space-y-3">
                  <span dir="rtl" className="text-7xl font-serif font-bold text-[#0D9488] block">{currentReading.letter}</span>
                  <div className="text-xl font-extrabold">{currentReading.nameEn} ({currentReading.nameAr})</div>
                </div>

                <div className="flex items-center justify-between gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                  <button type="button" onClick={() => setReadingIdx((p) => (p === 0 ? 27 : p - 1))} className="px-5 py-3 rounded-2xl border font-extrabold text-sm">
                    Previous
                  </button>
                  <button type="button" onClick={() => playSound(currentReading.exampleWord, 0.72)} className="px-6 py-3 rounded-2xl bg-[#0D9488] text-white font-extrabold text-sm">
                    Listen
                  </button>
                  <button type="button" onClick={() => setReadingIdx((p) => (p === 27 ? 0 : p + 1))} className="px-5 py-3 rounded-2xl border font-extrabold text-sm">
                    Next
                  </button>
                </div>
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}