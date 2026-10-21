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
  Ear,
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
  Waves,
  Timer
} from "lucide-react";
import { useLesson } from "../shared/LessonContext";

type MainTab = "learn" | "chart" | "reading" | "games";
type MaddType = "alif" | "waw" | "ya";
type GameModeId = "menu" | "identify_madd" | "beat_comparison" | "word_meaning" | "final_test";

const playSound = (text: string, rate = 0.68) => {
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

const MADD_CARDS = [
  {
    id: "alif" as MaddType,
    badge: "Madd bil-Alif",
    nameAr: "المَدُّ بِالأَلِف",
    sampleAr: "بَا",
    soundTitle: 'Long "aa" (2 Beats)',
    formula: "Fatha (ـَ) + Vowel-Free Alif (ا)",
    description:
      "Alif Madd loves Fatha! When a letter has Fatha followed by a bare Alif (with no Hamza or Sukun on it), stretch the open jaw sound for exactly 2 beats.",
    imageUrl: "/Tajwedo-Public-Assets/Services/Quran Recitation.webp",
    imageAlt: "Towering mountain peaks representing Jibaal (mountains) with Alif Madd",
    topBarClass: "bg-gradient-to-r from-[#FF5A1F] to-[#F59E0B]",
    badgeClass: "bg-[#FF5A1F] text-white",
    accentText: "text-[#FF5A1F] dark:text-[#FF7A45]",
    softBgLight: "bg-[#FFF8F5]",
    softBgDark: "bg-[#181824]",
    pillBorder: "border-[#FFD8C7] dark:border-[#3D2622]",
    examples: [
      { ar: "بَا", tr: "baa" },
      { ar: "تَا", tr: "taa" },
      { ar: "قَا", tr: "qaa" },
      { ar: "مَا", tr: "maa" },
    ],
  },
  {
    id: "waw" as MaddType,
    badge: "Madd bil-Waw",
    nameAr: "المَدُّ بِالوَاو",
    sampleAr: "بُو",
    soundTitle: 'Long "uu" (2 Beats)',
    formula: "Damma (ـُ) + Vowel-Free Waw (و)",
    description:
      "Waw Madd loves Damma! When a letter has Damma followed by a bare Waw, keep your lips rounded in a tight circle for 2 smooth beats: 'buu'!",
    imageUrl: "/Tajwedo-Public-Assets/offer-family.webp",
    imageAlt: "Blooming spring flowers representing Zuhoor with Waw Madd",
    topBarClass: "bg-gradient-to-r from-[#00A86B] to-[#10B981]",
    badgeClass: "bg-[#00A86B] text-white",
    accentText: "text-[#00A86B] dark:text-[#34D399]",
    softBgLight: "bg-[#F2FBF7]",
    softBgDark: "bg-[#131F24]",
    pillBorder: "border-[#BCEFD8] dark:border-[#1E3B35]",
    examples: [
      { ar: "بُو", tr: "buu" },
      { ar: "تُو", tr: "tuu" },
      { ar: "نُو", tr: "nuu" },
      { ar: "سُو", tr: "suu" },
    ],
  },
  {
    id: "ya" as MaddType,
    badge: "Madd bil-Ya",
    nameAr: "المَدُّ بِاليَاء",
    sampleAr: "بِي",
    soundTitle: 'Long "ii" (2 Beats)',
    formula: "Kasra (ـِ) + Vowel-Free Ya (ي)",
    description:
      "Ya Madd loves Kasra! When a letter has Kasra underneath followed by a bare Ya, smile gently and stretch the sound for 2 beats: 'bii'!",
    imageUrl: "/Tajwedo-Public-Assets/curriculum-Imag/Quran Recitation.webp",
    imageAlt: "Lush green fig and olive orchard representing Teen (figs) with Ya Madd",
    topBarClass: "bg-gradient-to-r from-[#7C3AED] to-[#A855F7]",
    badgeClass: "bg-[#7C3AED] text-white",
    accentText: "text-[#7C3AED] dark:text-[#A78BFA]",
    softBgLight: "bg-[#F9F6FF]",
    softBgDark: "bg-[#19162B]",
    pillBorder: "border-[#E2D4FF] dark:border-[#342654]",
    examples: [
      { ar: "بِي", tr: "bii" },
      { ar: "تِي", tr: "tii" },
      { ar: "فِي", tr: "fii" },
      { ar: "دِي", tr: "dii" },
    ],
  },
];

const MADD_MATRIX_28 = [
  { letter: "ب", name: "Ba", alif: { ar: "بَا", tr: "baa" }, waw: { ar: "بُو", tr: "buu" }, ya: { ar: "بِي", tr: "bii" } },
  { letter: "ت", name: "Ta", alif: { ar: "تَا", tr: "taa" }, waw: { ar: "تُو", tr: "tuu" }, ya: { ar: "تِي", tr: "tii" } },
  { letter: "ث", name: "Tha", alif: { ar: "ثَا", tr: "thaa" }, waw: { ar: "ثُو", tr: "thuu" }, ya: { ar: "ثِي", tr: "thii" } },
  { letter: "ج", name: "Jeem", alif: { ar: "جَا", tr: "jaa" }, waw: { ar: "جُو", tr: "juu" }, ya: { ar: "جِي", tr: "jii" } },
  { letter: "ح", name: "Haa", alif: { ar: "حَا", tr: "haa" }, waw: { ar: "حُو", tr: "huu" }, ya: { ar: "حِي", tr: "hii" } },
  { letter: "خ", name: "Khaa", alif: { ar: "خَا", tr: "khaa" }, waw: { ar: "خُو", tr: "khuu" }, ya: { ar: "خِي", tr: "khii" } },
  { letter: "د", name: "Dal", alif: { ar: "دَا", tr: "daa" }, waw: { ar: "دُو", tr: "duu" }, ya: { ar: "دِي", tr: "dii" } },
  { letter: "ذ", name: "Dhal", alif: { ar: "ذَا", tr: "dhaa" }, waw: { ar: "ذُو", tr: "dhuu" }, ya: { ar: "ذِي", tr: "dhii" } },
  { letter: "ر", name: "Ra", alif: { ar: "رَا", tr: "raa" }, waw: { ar: "رُو", tr: "ruu" }, ya: { ar: "رِي", tr: "rii" } },
  { letter: "ز", name: "Zay", alif: { ar: "زَا", tr: "zaa" }, waw: { ar: "زُو", tr: "zuu" }, ya: { ar: "زِي", tr: "zii" } },
  { letter: "س", name: "Seen", alif: { ar: "سَا", tr: "saa" }, waw: { ar: "سُو", tr: "suu" }, ya: { ar: "سِي", tr: "sii" } },
  { letter: "ش", name: "Sheen", alif: { ar: "شَا", tr: "shaa" }, waw: { ar: "شُو", tr: "shuu" }, ya: { ar: "شِي", tr: "shii" } },
  { letter: "ص", name: "Saad", alif: { ar: "صَا", tr: "saa" }, waw: { ar: "صُو", tr: "suu" }, ya: { ar: "صِي", tr: "sii" } },
  { letter: "ض", name: "Daad", alif: { ar: "ضَا", tr: "daa" }, waw: { ar: "ضُو", tr: "duu" }, ya: { ar: "ضِي", tr: "dii" } },
  { letter: "ط", name: "Taa", alif: { ar: "طَا", tr: "taa" }, waw: { ar: "طُو", tr: "tuu" }, ya: { ar: "طِي", tr: "tii" } },
  { letter: "ظ", name: "Dhaa", alif: { ar: "ظَا", tr: "dhaa" }, waw: { ar: "ظُو", tr: "dhuu" }, ya: { ar: "ظِي", tr: "dhii" } },
  { letter: "ع", name: "Ayn", alif: { ar: "عَا", tr: "‘aa" }, waw: { ar: "عُو", tr: "‘uu" }, ya: { ar: "عِي", tr: "‘ii" } },
  { letter: "غ", name: "Ghayn", alif: { ar: "غَا", tr: "ghaa" }, waw: { ar: "غُو", tr: "ghuu" }, ya: { ar: "غِي", tr: "ghii" } },
  { letter: "ف", name: "Fa", alif: { ar: "فَا", tr: "faa" }, waw: { ar: "فُو", tr: "fuu" }, ya: { ar: "فِي", tr: "fii" } },
  { letter: "ق", name: "Qaf", alif: { ar: "قَا", tr: "qaa" }, waw: { ar: "قُو", tr: "quu" }, ya: { ar: "قِي", tr: "qii" } },
  { letter: "ك", name: "Kaf", alif: { ar: "كَا", tr: "kaa" }, waw: { ar: "كُو", tr: "kuu" }, ya: { ar: "كِي", tr: "kii" } },
  { letter: "ل", name: "Lam", alif: { ar: "لَا", tr: "laa" }, waw: { ar: "لُو", tr: "luu" }, ya: { ar: "لِي", tr: "lii" } },
  { letter: "م", name: "Meem", alif: { ar: "مَا", tr: "maa" }, waw: { ar: "مُو", tr: "muu" }, ya: { ar: "مِي", tr: "mii" } },
  { letter: "ن", name: "Noon", alif: { ar: "نَا", tr: "naa" }, waw: { ar: "نُو", tr: "nuu" }, ya: { ar: "نِي", tr: "nii" } },
  { letter: "هـ", name: "Ha", alif: { ar: "هَا", tr: "haa" }, waw: { ar: "هُو", tr: "huu" }, ya: { ar: "هِي", tr: "hii" } },
  { letter: "و", name: "Waw", alif: { ar: "وَا", tr: "waa" }, waw: { ar: "وُو", tr: "wuu" }, ya: { ar: "وِي", tr: "wii" } },
  { letter: "ي", name: "Ya", alif: { ar: "يَا", tr: "yaa" }, waw: { ar: "يُو", tr: "yuu" }, ya: { ar: "يِي", tr: "yii" } },
];

const MADD_READING_WORDS = [
  {
    id: "jibaal",
    arabic: "جِبَالُ",
    translit: "ji - baa - lu",
    meaning: "Mountains (Alif Madd)",
    type: "alif" as MaddType,
    imageUrl: "/Tajwedo-Public-Assets/Services/Quran Recitation.webp",
    sceneCaption: "Majestic mountain range (وَٱلْجِبَالَ أَوْتَادًا)",
    breakdown: [
      { ar: "جِ", tr: "ji (1 beat)" },
      { ar: "بَا", tr: "baa (2 beats!)", isMadd: true },
      { ar: "لُ", tr: "lu (1 beat)" },
    ],
  },
  {
    id: "bihaar",
    arabic: "بِحَارُ",
    translit: "bi - haa - ru",
    meaning: "Seas / Oceans (Alif Madd)",
    type: "alif" as MaddType,
    imageUrl: "/Tajwedo-Public-Assets/Services/Islamic Studies.webp",
    sceneCaption: "Deep blue seas (وَإِذَا ٱلْبِحَارُ سُجِّرَتْ)",
    breakdown: [
      { ar: "بِ", tr: "bi (1 beat)" },
      { ar: "حَا", tr: "haa (2 beats!)", isMadd: true },
      { ar: "رُ", tr: "ru (1 beat)" },
    ],
  },
  {
    id: "zuhoor",
    arabic: "زُهُورُ",
    translit: "zu - huu - ru",
    meaning: "Flowers (Waw Madd)",
    type: "waw" as MaddType,
    imageUrl: "/Tajwedo-Public-Assets/offer-family.webp",
    sceneCaption: "Vibrant blooming flowers in spring (زُهُورُ)",
    breakdown: [
      { ar: "زُ", tr: "zu (1 beat)" },
      { ar: "هُو", tr: "huu (2 beats!)", isMadd: true },
      { ar: "رُ", tr: "ru (1 beat)" },
    ],
  },
  {
    id: "tuyoor",
    arabic: "طُيُورُ",
    translit: "tu - yuu - ru",
    meaning: "Birds (Waw Madd)",
    type: "waw" as MaddType,
    imageUrl: "/Tajwedo-Public-Assets/herosection-mobile.webp",
    sceneCaption: "Birds soaring in the sky (طُيُورُ)",
    breakdown: [
      { ar: "طُ", tr: "tu (1 beat)" },
      { ar: "يُو", tr: "yuu (2 beats!)", isMadd: true },
      { ar: "رُ", tr: "ru (1 beat)" },
    ],
  },
  {
    id: "mafaateeh",
    arabic: "مَفَاتِيحُ",
    translit: "ma - faa - tii - hu",
    meaning: "Keys (Alif Madd + Ya Madd!)",
    type: "ya" as MaddType,
    imageUrl: "/Tajwedo-Public-Assets/curriculum-Imag/Quran Recitation.webp",
    sceneCaption: "Antique brass keys (مَفَاتِيحُ)",
    breakdown: [
      { ar: "مَ", tr: "ma (1)" },
      { ar: "فَا", tr: "faa (2!)", isMadd: true },
      { ar: "تِي", tr: "tii (2!)", isMadd: true },
      { ar: "حُ", tr: "hu (1)" },
    ],
  },
];

const MADD_GAMES = [
  {
    id: 1,
    mode: "identify_madd",
    prompt: "Which short vowel MUST come right before Alif Madd (ا)?",
    bigDisplay: "بَا",
    audioText: "بَا",
    options: ["Fatha (ـَ)", "Damma (ـُ)", "Kasra (ـِ)"],
    correctIndex: 0,
    explanation: "Alif Madd is always preceded by a Fatha!",
  },
  {
    id: 2,
    mode: "beat_comparison",
    prompt: "How many beats do we stretch a Natural Madd (المد الطبيعي)?",
    bigDisplay: "قَالَ • يَقُولُ • قِيلَ",
    audioText: "قَالَ يَقُولُ قِيلَ",
    options: ["Exactly 2 Beats", "1 Short Beat", "6 Long Beats"],
    correctIndex: 0,
    explanation: "Natural Madd (Madd Tabee'i) is stretched for exactly 2 smooth beats!",
  },
  {
    id: 3,
    mode: "word_meaning",
    prompt: "Look at the picture of birds and read طُيُورُ. Which Madd letter is inside it?",
    bigDisplay: "طُيُورُ",
    audioText: "طُيُورُ",
    imageUrl: "/Tajwedo-Public-Assets/herosection-mobile.webp",
    options: ["Madd bil-Waw (يُو)", "Madd bil-Alif", "Madd bil-Ya"],
    correctIndex: 0,
    explanation: "طُيُورُ contains Ya with Damma followed by Waw Madd (يُو)!",
  },
];

export default function MaddLesson() {
  const lessonCtx = useLesson();
  const darkMode = lessonCtx?.darkMode ?? false;

  const [englishHints, setEnglishHints] = useState<boolean>(true);
  const [textSizeScale, setTextSizeScale] = useState<number>(1.1);
  const [stars, setStars] = useState<number>(0);

  const [activeTab, setActiveTab] = useState<MainTab>("learn");
  const [slideIdx, setSlideIdx] = useState<number>(0);
  const [matrixSearch, setMatrixSearch] = useState<string>("");
  const [activeSoundKey, setActiveSoundKey] = useState<string | null>(null);

  const [readingFilter, setReadingFilter] = useState<"all" | MaddType>("all");
  const [readingIdx, setReadingIdx] = useState<number>(0);

  const [gameMode, setGameMode] = useState<GameModeId>("menu");
  const [qIndex, setQIndex] = useState<number>(0);
  const [pickedOption, setPickedOption] = useState<number | null>(null);
  const [qAnswered, setQAnswered] = useState<boolean>(false);
  const [sessionScore, setSessionScore] = useState<number>(0);
  const [gameFinished, setGameFinished] = useState<boolean>(false);

  const filteredMatrix = useMemo(() => {
    if (!matrixSearch.trim()) return MADD_MATRIX_28;
    const q = matrixSearch.toLowerCase().trim();
    return MADD_MATRIX_28.filter((r) => r.name.toLowerCase().includes(q) || r.letter.includes(q));
  }, [matrixSearch]);

  const filteredReading = useMemo(() => {
    if (readingFilter === "all") return MADD_READING_WORDS;
    return MADD_READING_WORDS.filter((w) => w.type === readingFilter);
  }, [readingFilter]);

  const currentWord = filteredReading[readingIdx] || filteredReading[0];

  const activeQuestions = useMemo(() => {
    if (gameMode === "menu") return [];
    if (gameMode === "final_test") return MADD_GAMES;
    return MADD_GAMES.filter((q) => q.mode === gameMode);
  }, [gameMode]);

  const currentQ = activeQuestions[qIndex];

  const triggerAudio = useCallback((text: string, key: string) => {
    setActiveSoundKey(key);
    playSound(text, 0.68);
    setTimeout(() => setActiveSoundKey((prev) => (prev === key ? null : prev)), 550);
  }, []);

  const startGame = (mode: GameModeId) => {
    setGameMode(mode);
    setQIndex(0);
    setPickedOption(null);
    setQAnswered(false);
    setSessionScore(0);
    setGameFinished(false);
  };

  const handlePick = (idx: number) => {
    if (qAnswered || !currentQ) return;
    setPickedOption(idx);
    setQAnswered(true);
    if (idx === currentQ.correctIndex) {
      setSessionScore((p) => p + 1);
      setStars((p) => p + 1);
      if (currentQ.audioText) playSound(currentQ.audioText, 0.7);
    }
  };

  return (
    <div className={`min-h-screen w-full transition-colors duration-300 font-sans ${darkMode ? "bg-[#0B0F19] text-slate-100" : "bg-[#F8FAFC] text-slate-900"}`}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "LearningResource",
            name: "Noor Al-Bayan Lesson 4: Arabic Long Vowels (Al-Madd)",
            description: "Learn the 3 Arabic Long Vowels (Madd bil-Alif, Madd bil-Waw, Madd bil-Ya) with visual scenes and audio.",
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
              onClick={() => playSound("بَا بُو بِي", 0.68)}
              className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#00A86B] to-[#0D9488] text-white flex items-center justify-center shadow-md"
            >
              <span dir="rtl" className="text-xl font-serif font-bold">بَا</span>
            </button>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-extrabold tracking-tight leading-none">
                  Long Vowels (المُدُود الثَّلَاثَة)
                </h1>
                <span className="hidden md:inline-block px-2 py-0.5 rounded-md text-[11px] font-extrabold uppercase bg-emerald-500/15 text-[#00A86B]">
                  Lesson 4
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                2-Beat Stretching Letters: Alif (ا), Waw (و), Ya (ي)
              </p>
            </div>
          </div>

          <nav className={`flex items-center p-1.5 rounded-2xl border overflow-x-auto no-scrollbar ${darkMode ? "bg-slate-900/90 border-slate-800" : "bg-slate-100/90 border-slate-200/70"}`}>
            {[
              { id: "learn", label: "Learn & Slides", icon: BookOpen },
              { id: "chart", label: "Madd Matrix", icon: Grid },
              { id: "reading", label: "Visual Reading", icon: Layers },
              { id: "games", label: "Games & Quiz", icon: Gamepad2 },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => {
                    setActiveTab(tab.id as MainTab);
                    if (tab.id === "games") setGameMode("menu");
                  }}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold inline-flex items-center gap-2 transition-all shrink-0 ${
                    isActive
                      ? "bg-gradient-to-r from-[#00A86B] to-[#0D9488] text-white shadow-md"
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
            <div className={`px-3 py-1.5 rounded-xl border flex items-center gap-1.5 text-xs sm:text-sm font-extrabold ${darkMode ? "bg-amber-500/10 border-amber-500/30 text-amber-300" : "bg-amber-50 border-amber-200 text-amber-700"}`}>
              <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
              <span>{stars}</span>
            </div>
            <button
              type="button"
              onClick={() => setEnglishHints((prev) => !prev)}
              className={`px-3.5 py-2 rounded-xl border text-xs font-bold inline-flex items-center gap-1.5 ${
                englishHints ? "bg-[#00A86B]/15 border-[#00A86B]/40 text-[#00A86B]" : "bg-slate-100 border-slate-200 text-slate-500"
              }`}
            >
              {englishHints ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
              <span>Hints: {englishHints ? "ON" : "OFF"}</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-8 py-10">
        {activeTab === "learn" && (
          <div className="space-y-16">
            <section className="space-y-8">
              <div>
                <span className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-widest text-[#00A86B]">
                  <Waves className="w-3.5 h-3.5" /> Lesson 4 • The 2-Beat Stretch
                </span>
                <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight mt-1">
                  Meet the Three Letters of Madd (حُرُوفُ المَدّ)
                </h2>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-7">
                {MADD_CARDS.map((card) => (
                  <article
                    key={card.id}
                    onClick={() => playSound(card.sampleAr, 0.68)}
                    className={`rounded-3xl border overflow-hidden cursor-pointer flex flex-col justify-between group hover:-translate-y-1.5 transition-all ${
                      darkMode ? "bg-[#111827] border-slate-800 shadow-xl" : "bg-white border-slate-200 shadow-lg"
                    }`}
                  >
                    <div className={`h-2.5 w-full ${card.topBarClass}`} />
                    <div className="relative h-40 w-full overflow-hidden">
                      <img src={card.imageUrl} alt={card.imageAlt} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent" />
                      <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between">
                        <span className={`px-3.5 py-1 rounded-full text-xs font-extrabold ${card.badgeClass}`}>
                          {card.badge} • {card.nameAr}
                        </span>
                        <Volume2 className="w-5 h-5 text-white" />
                      </div>
                    </div>

                    <div className="p-6 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-baseline justify-between">
                          <span className={`text-lg font-extrabold ${card.accentText}`}>{card.soundTitle}</span>
                          <span className="text-xs font-bold opacity-75">{card.formula}</span>
                        </div>
                        <div className={`my-5 py-5 rounded-3xl border text-center ${darkMode ? card.softBgDark : card.softBgLight} ${card.pillBorder}`}>
                          <span dir="rtl" className={`text-7xl font-serif font-bold ${card.accentText}`}>{card.sampleAr}</span>
                        </div>
                        <p className={`text-xs sm:text-sm leading-relaxed ${darkMode ? "text-slate-300" : "text-slate-600"}`}>
                          {card.description}
                        </p>
                      </div>

                      <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-800" onClick={(e) => e.stopPropagation()}>
                        <div dir="rtl" className="grid grid-cols-4 gap-2">
                          {card.examples.map((ex, i) => (
                            <button
                              key={i}
                              type="button"
                              onClick={() => playSound(ex.ar, 0.68)}
                              className={`py-2.5 rounded-2xl border text-center transition hover:scale-105 ${darkMode ? "bg-[#0B0F19] border-slate-800" : "bg-slate-50 border-slate-200"}`}
                            >
                              <span className={`block text-2xl font-serif font-bold ${card.accentText}`}>{ex.ar}</span>
                              {englishHints && <span dir="ltr" className="block text-[11px] font-bold text-slate-500">{ex.tr}</span>}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </section>

            {/* 1 BEAT VS 2 BEATS INTERACTIVE COMPARISON */}
            <section className={`rounded-3xl border p-8 sm:p-10 ${darkMode ? "bg-[#111827] border-slate-800" : "bg-white border-slate-200 shadow-lg"}`}>
              <div className="text-center max-w-2xl mx-auto mb-8">
                <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-extrabold bg-emerald-500/15 text-[#00A86B]">
                  <Timer className="w-3.5 h-3.5" /> Interactive Beat Meter
                </span>
                <h3 className="text-2xl sm:text-3xl font-extrabold mt-2">
                  Compare 1 Short Beat vs. 2 Long Madd Beats
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { shortAr: "بَ", shortTr: "ba (1 Beat)", longAr: "بَا", longTr: "baa (2 Beats)", color: "border-[#FF5A1F] text-[#FF5A1F]" },
                  { shortAr: "بُ", shortTr: "bu (1 Beat)", longAr: "بُو", longTr: "buu (2 Beats)", color: "border-[#00A86B] text-[#00A86B]" },
                  { shortAr: "بِ", shortTr: "bi (1 Beat)", longAr: "بِي", longTr: "bii (2 Beats)", color: "border-[#7C3AED] text-[#7C3AED]" },
                ].map((pair, idx) => (
                  <div key={idx} className={`p-5 rounded-3xl border-2 ${pair.color} bg-opacity-5 grid grid-cols-2 gap-3 text-center`}>
                    <button type="button" onClick={() => playSound(pair.shortAr, 0.85)} className="p-4 rounded-2xl bg-slate-500/10 hover:scale-105 transition">
                      <span dir="rtl" className="block text-4xl font-serif font-bold">{pair.shortAr}</span>
                      <span className="block text-xs font-extrabold mt-2">{pair.shortTr}</span>
                    </button>
                    <button type="button" onClick={() => playSound(pair.longAr, 0.65)} className="p-4 rounded-2xl bg-current/10 border border-current hover:scale-105 transition">
                      <span dir="rtl" className="block text-4xl font-serif font-bold">{pair.longAr}</span>
                      <span className="block text-xs font-extrabold mt-2">{pair.longTr}</span>
                    </button>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}

        {activeTab === "chart" && (
          <section className="space-y-8">
            <h2 className="text-2xl sm:text-4xl font-extrabold">28 Letters × 3 Long Vowels Matrix</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredMatrix.map((row) => (
                <div key={row.name} className={`rounded-3xl border p-4 flex items-center justify-between gap-4 ${darkMode ? "bg-[#111827] border-slate-800" : "bg-white border-slate-200 shadow-sm"}`}>
                  <div className="w-16 text-center font-serif font-bold text-3xl">{row.letter}</div>
                  <div className="flex-1 grid grid-cols-3 gap-3">
                    <button type="button" onClick={() => triggerAudio(row.alif.ar, `${row.name}-a`)} className="py-3 rounded-2xl border-2 border-[#FFD5C2] bg-[#FFF6F2] dark:bg-[#FF5A1F]/10 dark:border-[#FF5A1F]/30 text-[#FF5A1F] font-serif font-bold text-3xl">
                      {row.alif.ar}
                    </button>
                    <button type="button" onClick={() => triggerAudio(row.waw.ar, `${row.name}-w`)} className="py-3 rounded-2xl border-2 border-[#BCEFD8] bg-[#F2FBF7] dark:bg-[#00A86B]/10 dark:border-[#00A86B]/30 text-[#00A86B] font-serif font-bold text-3xl">
                      {row.waw.ar}
                    </button>
                    <button type="button" onClick={() => triggerAudio(row.ya.ar, `${row.name}-y`)} className="py-3 rounded-2xl border-2 border-[#E0D1FF] bg-[#F8F5FF] dark:bg-[#7C3AED]/10 dark:border-[#7C3AED]/30 text-[#7C3AED] font-serif font-bold text-3xl">
                      {row.ya.ar}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {activeTab === "reading" && currentWord && (
          <section className="space-y-8">
            <div className={`rounded-3xl border overflow-hidden ${darkMode ? "bg-[#111827] border-slate-800 shadow-2xl" : "bg-white border-slate-200 shadow-xl"}`}>
              <div className="grid grid-cols-1 lg:grid-cols-12">
                <div className="lg:col-span-6 relative p-10 bg-slate-950 text-white flex flex-col justify-between min-h-[340px]">
                  <img src={currentWord.imageUrl} alt={currentWord.meaning} className="absolute inset-0 w-full h-full object-cover opacity-45" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent" />
                  <span className="relative z-10 px-3 py-1 rounded-full text-xs font-extrabold bg-white/15 w-fit">
                    Word {readingIdx + 1} of {filteredReading.length}
                  </span>
                  <div className="relative z-10 my-8 text-center">
                    <button type="button" onClick={() => playSound(currentWord.arabic, 0.68)} className="text-7xl font-serif font-bold text-white">
                      {currentWord.arabic}
                    </button>
                    {englishHints && (
                      <div className="mt-3">
                        <div className="text-2xl font-extrabold text-emerald-300">{currentWord.translit}</div>
                        <div className="text-base font-bold">&ldquo;{currentWord.meaning}&rdquo;</div>
                      </div>
                    )}
                  </div>
                  <div className="relative z-10 text-xs text-center text-slate-300">{currentWord.sceneCaption}</div>
                </div>

                <div className="lg:col-span-6 p-8 sm:p-10 flex flex-col justify-between space-y-6">
                  <div>
                    <span className="text-xs font-extrabold uppercase text-slate-400">Tap each syllable (Hold Madd for 2 Beats!):</span>
                    <div dir="rtl" className="grid grid-cols-3 gap-3 mt-4">
                      {currentWord.breakdown.map((b, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => playSound(b.ar, 0.68)}
                          className={`p-5 rounded-3xl border-2 text-center ${b.isMadd ? "border-[#00A86B] bg-[#00A86B]/15 text-[#00A86B]" : "border-slate-200 dark:border-slate-800"}`}
                        >
                          <span className="block text-4xl font-serif font-bold">{b.ar}</span>
                          {englishHints && <span dir="ltr" className="block text-xs font-extrabold mt-2">{b.tr}</span>}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center justify-between gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                    <button type="button" onClick={() => setReadingIdx((p) => (p === 0 ? filteredReading.length - 1 : p - 1))} className="px-5 py-3 rounded-2xl border font-extrabold text-sm">
                      Previous
                    </button>
                    <button type="button" onClick={() => playSound(currentWord.arabic, 0.68)} className="px-7 py-3 rounded-2xl bg-[#00A86B] text-white font-extrabold text-sm">
                      Listen
                    </button>
                    <button type="button" onClick={() => setReadingIdx((p) => (p + 1 >= filteredReading.length ? 0 : p + 1))} className="px-5 py-3 rounded-2xl border font-extrabold text-sm">
                      Next
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {activeTab === "games" && (
          <section className="space-y-8">
            <button type="button" onClick={() => startGame("final_test")} className="px-6 py-3.5 rounded-2xl bg-[#00A86B] text-white font-extrabold text-sm shadow-lg">
              Start Madd Mastery Quiz
            </button>
            {gameMode !== "menu" && !gameFinished && currentQ && (
              <div className={`rounded-3xl border p-8 max-w-2xl mx-auto ${darkMode ? "bg-[#111827] border-slate-800" : "bg-white border-slate-200 shadow-xl"}`}>
                {currentQ.imageUrl && <img src={currentQ.imageUrl} alt="Visual hint" className="w-full h-44 object-cover rounded-2xl mb-6" />}
                <h3 className="text-xl font-extrabold text-center mb-4">{currentQ.prompt}</h3>
                {currentQ.bigDisplay && <div dir="rtl" className="text-5xl font-serif font-bold text-center text-[#00A86B] my-6">{currentQ.bigDisplay}</div>}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {currentQ.options.map((opt, idx) => (
                    <button
                      key={idx}
                      disabled={qAnswered}
                      onClick={() => handlePick(idx)}
                      className="p-4 rounded-2xl border-2 font-extrabold text-lg border-slate-200 dark:border-slate-800 hover:border-[#00A86B]"
                    >
                      {opt}
                    </button>
                  ))}
                </div>
                {qAnswered && (
                  <div className="mt-6 pt-4 border-t flex items-center justify-between">
                    <p className="text-sm font-semibold">{currentQ.explanation}</p>
                    <button
                      type="button"
                      onClick={() => {
                        if (qIndex + 1 < activeQuestions.length) {
                          setQIndex((p) => p + 1);
                          setPickedOption(null);
                          setQAnswered(false);
                        } else {
                          setGameFinished(true);
                        }
                      }}
                      className="px-5 py-2.5 rounded-xl bg-[#00A86B] text-white font-bold text-sm"
                    >
                      Next
                    </button>
                  </div>
                )}
              </div>
            )}
          </section>
        )}
      </main>
    </div>
  );
}