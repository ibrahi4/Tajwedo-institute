"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpen,
  CheckCircle2,
  Eye,
  EyeOff,
  Gamepad2,
  Grid,
  Home,
  Layers,
  Minus,
  Play,
  Plus,
  Presentation,
  RotateCcw,
  Search,
  Star,
  Trophy,
  Volume2,
  Zap,
} from "lucide-react";
import { useLesson } from "../shared/LessonContext";
import { BeatMeter, SlideDeck, TeacherCorner, VoiceNotice, speakArabic } from "../shared/Lessontoolkit";
import type { BeatPair, Slide } from "../shared/Lessontoolkit";

/* -------------------------------------------------------------------------- */
/*  Types and styling                                                         */
/* -------------------------------------------------------------------------- */

type MainTab = "learn" | "chart" | "reading" | "games";
type QuizMode = "identify_sukun" | "syllable_blend" | "quran_sukun";
type GameModeId = "menu" | QuizMode | "final_test";

const FOCUS =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600 dark:focus-visible:outline-teal-300";
const CARD = "border border-stone-200 bg-white dark:border-white/10 dark:bg-[#111827]";
const MUTED = "text-slate-600 dark:text-slate-300";
const BTN_PRIMARY = `inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[#0D4F4F] px-5 text-sm font-bold text-white hover:bg-[#093D33] dark:bg-teal-400 dark:text-slate-950 dark:hover:bg-teal-300 ${FOCUS}`;
const BTN_OUTLINE = `inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-[#0D4F4F]/30 px-5 text-sm font-bold text-[#0D4F4F] hover:bg-[#0D4F4F]/5 dark:border-white/20 dark:text-teal-200 dark:hover:bg-white/5 ${FOCUS}`;

const TONES = {
  sukun: {
    text: "text-cyan-700 dark:text-cyan-300",
    chip: "bg-cyan-600 text-white",
    bar: "bg-cyan-500",
    border: "border-cyan-200 dark:border-cyan-400/30",
    tint: "bg-cyan-50 dark:bg-cyan-400/10",
    grad: "from-cyan-500 to-teal-500",
    tile: "border-cyan-200 bg-cyan-50 text-cyan-700 hover:bg-cyan-100 dark:border-cyan-400/30 dark:bg-cyan-400/10 dark:text-cyan-300 dark:hover:bg-cyan-400/20",
  },
};

/* -------------------------------------------------------------------------- */
/*  Content                                                                   */
/* -------------------------------------------------------------------------- */

const SUKOON_CARDS = [
  {
    id: "definition",
    badge: "Al-Sukoon (ـْ)",
    nameAr: "السُّكُونُ",
    symbolAr: "ـْ",
    sampleAr: "أَبْ",
    soundTitle: "The Sound of Stillness",
    position: "Placed above the letter (فَوْقَ الحَرْف)",
    description:
      "Sukoon is a small circular sign placed above a letter. It indicates that the letter is devoid of vowels and relies entirely on the moving letter before it to be heard.",
    scene: "🌙",
    sceneWord: "مَسْجِدُ",
    sceneMeaning: "Mosque",
    examples: [
      { ar: "أَبْ", tr: "ab" },
      { ar: "أَتْ", tr: "at" },
      { ar: "أَمْ", tr: "am" },
      { ar: "أَنْ", tr: "an" },
    ],
  },
  {
    id: "hamsa",
    badge: "The Helper Hamza",
    nameAr: "هَمْزَةُ الوَصْلِ وَالسُّكُون",
    symbolAr: "أَبْ",
    sampleAr: "أَجْ",
    soundTitle: "Cannot Start a Word",
    position: "Needs a preceding vowel",
    description:
      "A sakin (silent) letter can never be pronounced by itself at the beginning of a word in Arabic. We always attach a helper letter (like a moving Hamza with Fatha أَبْ) to voice it!",
    scene: "⭐",
    sceneWord: "مَبْرُوكُ",
    sceneMeaning: "Blessed",
    examples: [
      { ar: "أَحْ", tr: "ah" },
      { ar: "أَدْ", tr: "ad" },
      { ar: "أَرْ", tr: "ar" },
      { ar: "أَسْ", tr: "as" },
    ],
  },
];

const BEAT_PAIRS: BeatPair[] = [
  {
    id: "moving",
    name: "Moving vs. Still",
    short: { ar: "بَ", tr: "ba (Moving 1 beat)" },
    long: { ar: "أَبْ", tr: "ab (Stopped instantly)" },
    tone: { text: "text-cyan-700", chip: "bg-cyan-600", bar: "bg-cyan-500", border: "border-cyan-200", tint: "bg-cyan-50", grad: "", tile: "" },
  },
];

const LETTERS: [string, string, string, boolean?][] = [
  ["ب", "Ba", "b"],
  ["ت", "Ta", "t"],
  ["ث", "Tha", "th"],
  ["ج", "Jeem", "j"],
  ["ح", "Haa", "H"],
  ["خ", "Khaa", "kh", true],
  ["د", "Dal", "d"],
  ["ذ", "Dhal", "dh"],
  ["ر", "Ra", "r"],
  ["ز", "Zay", "z"],
  ["س", "Seen", "s"],
  ["ش", "Sheen", "sh"],
  ["ص", "Saad", "S", true],
  ["ض", "Daad", "D", true],
  ["ط", "Taa", "T", true],
  ["ظ", "Dhaa", "DH", true],
  ["ع", "Ayn", "‘"],
  ["غ", "Ghayn", "gh", true],
  ["ف", "Fa", "f"],
  ["ق", "Qaf", "q", true],
  ["ك", "Kaf", "k"],
  ["ل", "Lam", "l"],
  ["م", "Meem", "m"],
  ["ن", "Noon", "n"],
  ["ه", "Ha", "h"],
  ["و", "Waw", "w"],
  ["ي", "Ya", "y"],
];

const MATRIX = [
  {
    letter: "ء",
    name: "Hamza",
    heavy: false,
    sukun: { ar: "أَبْ", tr: "ab" },
  },
  ...LETTERS.map(([letter, name, tr, heavy]) => ({
    letter,
    name,
    heavy: Boolean(heavy),
    sukun: { ar: `أ${letter}ْ`, tr: `a${tr}` },
  })),
];

type ReadWord = {
  id: string;
  arabic: string;
  translit: string;
  meaning: string;
  scene: string;
  quran?: string;
  breakdown: { ar: string; tr: string; sukun?: boolean }[];
};

const READ_WORDS: ReadWord[] = [
  {
    id: "masjid",
    arabic: "مَسْجِدُ",
    translit: "mas-ji-du",
    meaning: "Mosque",
    scene: "🕌",
    quran: "فِي مَسْجِدِ ضِرَارٍ · التوبة 107",
    breakdown: [
      { ar: "مَسْ", tr: "mas", sukun: true },
      { ar: "جِ", tr: "ji" },
      { ar: "دُ", tr: "du" },
    ],
  },
  {
    id: "an-amta",
    arabic: "أَنْعَمْتَ",
    translit: "an-‘am-ta",
    meaning: "You have bestowed favor",
    scene: "✨",
    quran: "صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ · الفاتحة 7",
    breakdown: [
      { ar: "أَنْ", tr: "an", sukun: true },
      { ar: "عَمْ", tr: "‘am", sukun: true },
      { ar: "تَ", tr: "ta" },
    ],
  },
  {
    id: "ya'lamun",
    arabic: "يَعْلَمُونَ",
    translit: "ya‘-la-muun",
    meaning: "They know",
    scene: "🧠",
    quran: "وَاللَّهُ يَعْلَمُ وَأَنْتُمْ لَا تَعْلَمُونَ · البقرة 216",
    breakdown: [
      { ar: "يَعْ", tr: "ya‘", sukun: true },
      { ar: "لَ", tr: "la" },
      { ar: "مُو", tr: "muu" },
      { ar: "نَ", tr: "na" },
    ],
  },
];

interface Question {
  id: number;
  mode: QuizMode;
  prompt: string;
  big?: string;
  audio?: string;
  scene?: string;
  options: string[];
  correct: number;
  why: string;
}

const QUESTIONS: Question[] = [
  {
    id: 1,
    mode: "identify_sukun",
    prompt: "What does the Sukun sign (ـْ) indicate on a letter?",
    big: "مَسْ",
    audio: "مَسْ",
    options: ["Stretched for 2 beats", "Completely still without any vowel", "Has a Damma"],
    correct: 1,
    why: "Sukun means stillness; the letter has no vowel and stops abruptly.",
  },
  {
    id: 2,
    mode: "identify_sukun",
    prompt: "Can a letter with a Sukun start a word in Arabic by itself?",
    big: "بْـ",
    audio: "بْ",
    options: ["Yes", "No, it must always be preceded by a moving letter", "Only with Shaddah"],
    correct: 1,
    why: "Arabic phonology does not permit starting a word with a sakin letter.",
  },
  {
    id: 3,
    mode: "syllable_blend",
    prompt: "How do you blend a sakin syllable like (مَسْ) in (مَسْجِدُ)?",
    big: "مَسْجِدُ",
    audio: "مَسْجِدُ",
    scene: "🕌",
    options: ["Say 'Ma' then 'sa' separately", "Attach Meem and Seen together in one breath: 'mas'", "Stretch it for 4 beats"],
    correct: 1,
    why: "A sakin letter is pronounced instantly attached to the vowel before it.",
  },
  {
    id: 4,
    mode: "quran_sukun",
    prompt: "Look at (أَنْعَمْتَ) from Surah Al-Fatihah. Which letters carry a Sukun?",
    big: "أَنْعَمْتَ",
    audio: "أَنْعَمْتَ",
    scene: "✨",
    options: ["Noon and Meem", "Only Ta", "Aleph and Ha"],
    correct: 0,
    why: "Both the Noon in أَنْ and the Meem in عَمْ carry a Sukun.",
  },
];

const GAME_MENU = [
  { id: "identify_sukun" as QuizMode, title: "Spot the Sukun", text: "Identify stillness and how sakin letters behave.", icon: "🔍", count: 2 },
  { id: "syllable_blend" as QuizMode, title: "Closed Syllable Lab", text: "Practice blending moving letters with sakin letters.", icon: "🧩", count: 1 },
  { id: "quran_sukun" as QuizMode, title: "Quranic Sukun Match", text: "Read real words from Surah Al-Fatihah.", icon: "📖", count: 1 },
  { id: "final_test" as GameModeId, title: "Final Sukun Challenge", text: "Test your mastery of stillness and closed syllables.", icon: "🏆", count: QUESTIONS.length },
];

const TABS = [
  { id: "learn" as MainTab, label: "Learn", icon: BookOpen },
  { id: "chart" as MainTab, label: "Sukun Matrix", icon: Grid },
  { id: "reading" as MainTab, label: "Syllable Builder", icon: Layers },
  { id: "games" as MainTab, label: "Games & Quiz", icon: Gamepad2 },
];

/* -------------------------------------------------------------------------- */
/*  Helper Components                                                         */
/* -------------------------------------------------------------------------- */

function BeatDots({ beats, tone }: { beats: number; tone: string }) {
  return (
    <span aria-hidden="true" className="mt-2 flex justify-center gap-1">
      {Array.from({ length: beats }).map((_, i) => (
        <span key={i} className={`h-2 w-4 rounded-full ${tone}`} />
      ))}
    </span>
  );
}

function Scene({ emoji, label, size = "text-5xl" }: { emoji: string; label: string; size?: string }) {
  return (
    <span
      role={label ? "img" : undefined}
      aria-label={label || undefined}
      aria-hidden={label ? undefined : true}
      className={`${size} leading-none`}
    >
      {emoji}
    </span>
  );
}

/* -------------------------------------------------------------------------- */
/*  Component                                                                 */
/* -------------------------------------------------------------------------- */

export default function SukoonLesson() {
  const lessonCtx = useLesson();
  const isTeacherMode = lessonCtx?.isTeacherMode ?? false;

  const pathname = usePathname() ?? "";
  const locale = pathname.split("/")[1] === "ar" ? "ar" : "en";
  const courseHref = `/${locale}/curriculum/noor-al-bayan`;

  const [hints, setHints] = useState<boolean>(!isTeacherMode);
  const [scale, setScale] = useState<number>(lessonCtx?.fontSizeMultiplier ?? 1.1);
  const [stars, setStars] = useState(0);
  const [presenting, setPresenting] = useState(false);

  const [activeTab, setActiveTab] = useState<MainTab>("learn");
  const [matrixSearch, setMatrixSearch] = useState("");
  const [heavyOnly, setHeavyOnly] = useState(false);
  const [activeKey, setActiveKey] = useState<string | null>(null);

  const [readingIdx, setReadingIdx] = useState(0);
  const [hot, setHot] = useState<number | null>(null);

  const [gameMode, setGameMode] = useState<GameModeId>("menu");
  const [qIndex, setQIndex] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const timers = useRef<number[]>([]);
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  const clearTimers = useCallback(() => {
    timers.current.forEach((t) => window.clearTimeout(t));
    timers.current = [];
  }, []);
  useEffect(() => clearTimers, [clearTimers]);

  const fluid = (min: number, vw: number, max: number) =>
    `clamp(${(min * scale).toFixed(2)}rem, ${(vw * scale).toFixed(2)}vw + 0.4rem, ${(max * scale).toFixed(2)}rem)`;

  const hear = useCallback((text: string, key: string, rate = 0.7) => {
    setActiveKey(key);
    speakArabic(text, rate);
    timers.current.push(window.setTimeout(() => setActiveKey((p) => (p === key ? null : p)), 600));
  }, []);

  const filteredMatrix = useMemo(() => {
    const q = matrixSearch.trim().toLowerCase();
    return MATRIX.filter(
      (r) =>
        (!heavyOnly || r.heavy) &&
        (!q || r.name.toLowerCase().includes(q) || r.letter.includes(q) || r.sukun.tr.toLowerCase().startsWith(q))
    );
  }, [matrixSearch, heavyOnly]);

  const word = READ_WORDS[Math.min(readingIdx, READ_WORDS.length - 1)];

  const questions = useMemo(() => {
    if (gameMode === "menu") return [];
    if (gameMode === "final_test") return QUESTIONS;
    return QUESTIONS.filter((q) => q.mode === gameMode);
  }, [gameMode]);
  const q = questions[qIndex];
  const answered = picked !== null;

  const slowSpell = () => {
    if (!word) return;
    clearTimers();
    let t = 0;
    word.breakdown.forEach((b, i) => {
      timers.current.push(
        window.setTimeout(() => {
          setHot(i);
          speakArabic(b.ar, 0.65);
        }, t)
      );
      t += 750;
    });
    timers.current.push(window.setTimeout(() => setHot(null), t));
  };

  const startGame = (mode: GameModeId) => {
    setGameMode(mode);
    setQIndex(0);
    setPicked(null);
    setScore(0);
    setFinished(false);
  };

  const pick = (i: number) => {
    if (picked !== null || !q) return;
    setPicked(i);
    if (i === q.correct) {
      setScore((s) => s + 1);
      setStars((s) => s + 1);
      if (q.audio) speakArabic(q.audio, 0.7);
    }
  };

  const nextQuestion = () => {
    if (qIndex + 1 < questions.length) {
      setQIndex((i) => i + 1);
      setPicked(null);
    } else {
      setFinished(true);
    }
  };

  const onTabKeyDown = (e: React.KeyboardEvent, index: number) => {
    const last = TABS.length - 1;
    let next = -1;
    if (e.key === "ArrowRight") next = index === last ? 0 : index + 1;
    else if (e.key === "ArrowLeft") next = index === 0 ? last : index - 1;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = last;
    if (next >= 0) {
      e.preventDefault();
      setActiveTab(TABS[next].id);
      tabRefs.current[TABS[next].id]?.focus();
    }
  };

  const slides: Slide[] = [
    {
      id: "intro",
      title: "Al-Sukoon (ـْ)",
      node: (
        <div className="space-y-6 text-center">
          <p lang="ar" dir="rtl" className="arabic-font font-bold text-[#A8832F] dark:text-[#E8C56A]" style={{ fontSize: fluid(3, 8, 5) }}>
            حَرْفُ السُّكُونِ
          </p>
          <h2 className="text-4xl font-black text-[#0D4F4F] dark:text-white sm:text-6xl">
            The Sign of Stillness
          </h2>
          <p className={`mx-auto max-w-2xl text-xl ${MUTED}`}>
            A sakin letter has no vowel. It stops abruptly on its makhraj and relies on the letter before it!
          </p>
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen w-full bg-[#FBF8F2] font-sans text-slate-900 dark:bg-[#0B0F19] dark:text-slate-100">
      <SlideDeck open={presenting} onClose={() => setPresenting(false)} slides={slides} heading="Al-Sukoon (ـْ)" />

      <header className="relative z-30 w-full border-b border-stone-200 bg-white/90 backdrop-blur-xl dark:border-white/10 dark:bg-[#0B0F19]/90 md:sticky md:top-[5.35rem]">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-3 sm:px-8">
          <div className="flex items-center gap-3">
            <Link
              href={courseHref}
              className={`inline-flex min-h-11 items-center gap-1.5 rounded-xl border border-stone-200 bg-stone-50 px-3 text-xs font-bold text-slate-700 hover:bg-stone-100 dark:border-white/10 dark:bg-white/5 dark:text-slate-200 dark:hover:bg-white/10 ${FOCUS}`}
            >
              <Home aria-hidden="true" className="h-4 w-4 text-[#0D9488]" />
              <span className="hidden sm:inline">Course</span>
            </Link>

            <button
              type="button"
              onClick={() => speakArabic("أَبْ أَتْ أَمْ", 0.7)}
              aria-label="Hear Sukoon examples"
              className={`flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 to-teal-600 text-white shadow-md ${FOCUS}`}
            >
              <span lang="ar" dir="rtl" className="arabic-font text-xl font-bold">أَبْ</span>
            </button>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-extrabold leading-none tracking-tight sm:text-lg">
                  Al-Sukoon (ـْ){" "}
                  <span lang="ar" dir="rtl" className="arabic-font font-bold text-[#A8832F] dark:text-[#E8C56A]">
                    (دَرْسُ السُّكُونِ)
                  </span>
                </h1>
                <span className="hidden rounded-md bg-cyan-100 px-2 py-0.5 text-xs font-bold text-cyan-800 dark:bg-cyan-400/15 dark:text-cyan-300 md:inline-block">
                  Core Tajweed
                </span>
              </div>
              <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                Stillness and Closed Syllables: أَبْ، أَتْ، مَسْجِدُ
              </p>
            </div>
          </div>

          <div
            role="tablist"
            aria-label="Lesson sections"
            className="flex items-center overflow-x-auto rounded-2xl border border-stone-200 bg-stone-100/80 p-1.5 dark:border-white/10 dark:bg-white/5"
          >
            {TABS.map((tab, index) => {
              const Icon = tab.icon;
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  ref={(el) => {
                    tabRefs.current[tab.id] = el;
                  }}
                  id={`sukun-tab-${tab.id}`}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  aria-controls={`sukun-panel-${tab.id}`}
                  tabIndex={active ? 0 : -1}
                  onClick={() => setActiveTab(tab.id)}
                  onKeyDown={(e) => onTabKeyDown(e, index)}
                  className={`inline-flex min-h-10 shrink-0 items-center gap-2 rounded-xl px-4 text-xs font-bold transition-colors motion-reduce:transition-none sm:text-sm ${FOCUS} ${
                    active
                      ? "bg-[#0D4F4F] text-white shadow-md dark:bg-teal-400 dark:text-slate-950"
                      : "text-slate-600 hover:bg-white dark:text-slate-300 dark:hover:bg-white/10"
                  }`}
                >
                  <Icon aria-hidden="true" className="h-4 w-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div
              className="flex min-h-10 items-center gap-1.5 rounded-xl border border-amber-200 bg-amber-50 px-3 text-sm font-extrabold text-amber-800 dark:border-amber-400/30 dark:bg-amber-400/10 dark:text-amber-300"
              aria-label={`${stars} stars earned`}
            >
              <Star aria-hidden="true" className="h-4 w-4 fill-amber-500 text-amber-500" />
              <span>{stars}</span>
            </div>

            <div role="group" aria-label="Arabic text size" className="flex items-center rounded-xl border border-stone-200 dark:border-white/10">
              <button
                type="button"
                onClick={() => setScale((s) => Math.max(0.8, +(s - 0.1).toFixed(1)))}
                aria-label="Smaller Arabic text"
                className={`flex h-10 w-10 items-center justify-center rounded-s-xl hover:bg-stone-100 dark:hover:bg-white/10 ${FOCUS}`}
              >
                <Minus aria-hidden="true" className="h-4 w-4" />
              </button>
              <span className="w-12 text-center text-xs font-bold tabular-nums">{Math.round(scale * 100)}%</span>
              <button
                type="button"
                onClick={() => setScale((s) => Math.min(1.8, +(s + 0.1).toFixed(1)))}
                aria-label="Larger Arabic text"
                className={`flex h-10 w-10 items-center justify-center rounded-e-xl hover:bg-stone-100 dark:hover:bg-white/10 ${FOCUS}`}
              >
                <Plus aria-hidden="true" className="h-4 w-4" />
              </button>
            </div>

            <button
              type="button"
              onClick={() => setHints((h) => !h)}
              aria-pressed={hints}
              className={`inline-flex min-h-10 items-center gap-1.5 rounded-xl border px-3.5 text-xs font-bold ${FOCUS} ${
                hints
                  ? "border-emerald-300 bg-emerald-50 text-emerald-800 dark:border-emerald-400/30 dark:bg-emerald-400/10 dark:text-emerald-300"
                  : "border-stone-200 bg-stone-100 text-slate-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-300"
              }`}
            >
              {hints ? <Eye aria-hidden="true" className="h-3.5 w-3.5" /> : <EyeOff aria-hidden="true" className="h-3.5 w-3.5" />}
              Hints: {hints ? "ON" : "OFF"}
            </button>

            <button type="button" onClick={() => setPresenting(true)} className={BTN_PRIMARY}>
              <Presentation aria-hidden="true" className="h-4 w-4" />
              Present
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl space-y-6 px-4 py-10 sm:px-8">
        <VoiceNotice />

        {/* 1. Learn */}
        <div
          role="tabpanel"
          id="sukun-panel-learn"
          aria-labelledby="sukun-tab-learn"
          hidden={activeTab !== "learn"}
          tabIndex={0}
          className={`space-y-14 rounded-2xl ${FOCUS}`}
        >
          <section className="space-y-8">
            <div>
              <p className="inline-flex items-center gap-1.5 text-sm font-bold text-[#0D6B66] dark:text-teal-300">
                <Zap aria-hidden="true" className="h-4 w-4" /> Mastering Stillness &amp; Closed Syllables
              </p>
              <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-[#0D4F4F] dark:text-white sm:text-4xl">
                What is Al-Sukoon?{" "}
                <span lang="ar" dir="rtl" className="arabic-font text-[#A8832F] dark:text-[#E8C56A]">(حَرْفُ السُّكُونِ)</span>
              </h2>
              <p className={`mt-3 max-w-2xl text-base ${MUTED}`}>
                Sukoon means absolute rest. A letter with a Sukun has no vowel. To voice it, we always attach it to a moving letter before it, creating a closed syllable like <strong>أَبْ</strong> or <strong>مَسْ</strong>.
              </p>
            </div>

            <ul className="grid gap-7 lg:grid-cols-2">
              {SUKOON_CARDS.map((card) => {
                const t = TONES.sukun;
                const key = `card-${card.id}`;
                return (
                  <li key={card.id}>
                    <article className={`flex h-full flex-col overflow-hidden rounded-3xl shadow-sm ${CARD}`}>
                      <div className={`h-2.5 w-full bg-gradient-to-r ${t.grad}`} />
                      <div className="flex items-center justify-between gap-3 px-6 pt-5">
                        <h3 className={`rounded-full px-3.5 py-1 text-xs font-extrabold ${t.chip}`}>{card.badge}</h3>
                        <span lang="ar" dir="rtl" className="arabic-font text-lg font-bold text-slate-600 dark:text-slate-300">
                          {card.nameAr}
                        </span>
                      </div>

                      <div className={`mx-6 mt-4 flex items-center gap-4 rounded-2xl border p-4 ${t.border} ${t.tint}`}>
                        <Scene emoji={card.scene} label={card.sceneMeaning} />
                        <div>
                          <p lang="ar" dir="rtl" className="arabic-font text-2xl font-bold text-slate-900 dark:text-white">
                            {card.sceneWord}
                          </p>
                          {hints && <p className={`text-sm font-semibold ${MUTED}`}>{card.sceneMeaning}</p>}
                        </div>
                      </div>

                      <div className="flex flex-1 flex-col gap-4 p-6">
                        <p className={`text-lg font-extrabold ${t.text}`}>{card.soundTitle}</p>
                        <p className={`text-sm leading-relaxed ${MUTED}`}>{card.description}</p>

                        <ul dir="rtl" className="mt-auto grid grid-cols-4 gap-2">
                          {card.examples.map((ex) => {
                            const exKey = `${card.id}-${ex.ar}`;
                            return (
                              <li key={ex.ar}>
                                <button
                                  type="button"
                                  onClick={() => hear(ex.ar, exKey)}
                                  aria-label={`Hear ${ex.tr}`}
                                  className={`w-full rounded-2xl border py-2.5 text-center transition motion-reduce:transition-none ${t.tile} ${
                                    activeKey === exKey ? "scale-105 shadow-md" : ""
                                  } ${FOCUS}`}
                                >
                                  <span lang="ar" className="arabic-font block text-2xl font-bold">{ex.ar}</span>
                                  {hints && <span dir="ltr" className="block text-[11px] font-bold">{ex.tr}</span>}
                                </button>
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    </article>
                  </li>
                );
              })}
            </ul>
          </section>

          <TeacherCorner
            sections={[
              {
                heading: "Lesson goals",
                items: [
                  "Understand that a sakin letter cannot be pronounced alone and needs a helper moving letter.",
                  "Master reading closed syllables (e.g., مَسْـ، أَنْـ، يَعْـ).",
                  "Prevent adding an unwanted vowel when reading Sukun.",
                  "Read words with Sukun smoothly from Surah Al-Fatihah.",
                ],
              },
              {
                heading: "A 25-minute plan",
                items: [
                  "5 min: Explain why a sakin letter needs a push from a moving letter.",
                  "7 min: Drill helper Hamza combinations (أَبْ، أَتْ، أَمْ، أَنْ).",
                  "8 min: Syllable Builder—break down مَسْجِدُ.",
                  "5 min: Mastery Quiz.",
                ],
              },
            ]}
          />
        </div>

        {/* 2. Chart / Matrix */}
        <div
          role="tabpanel"
          id="sukun-panel-chart"
          aria-labelledby="sukun-tab-chart"
          hidden={activeTab !== "chart"}
          tabIndex={0}
          className={`space-y-8 rounded-2xl ${FOCUS}`}
        >
          <div className="space-y-3">
            <h2 className="text-3xl font-extrabold text-[#0D4F4F] dark:text-white sm:text-4xl">
              28 letters with Sukun
            </h2>
            <p className={`max-w-2xl text-base ${MUTED}`}>
              Tap any tile to hear how the helper Hamza voices each sakin consonant.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <Search aria-hidden="true" className="pointer-events-none absolute start-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="search"
                value={matrixSearch}
                onChange={(e) => setMatrixSearch(e.target.value)}
                placeholder="Search a letter or name"
                aria-label="Search a letter or name"
                className={`min-h-11 w-64 rounded-xl border border-stone-300 bg-white ps-10 pe-4 text-sm font-semibold text-slate-800 outline-none focus:border-[#0D9488] dark:border-white/15 dark:bg-[#111827] dark:text-white ${FOCUS}`}
              />
            </div>
            <button
              type="button"
              aria-pressed={heavyOnly}
              onClick={() => setHeavyOnly((h) => !h)}
              className={`min-h-11 rounded-full border px-4 text-sm font-bold ${FOCUS} ${
                heavyOnly
                  ? "border-[#0D4F4F] bg-[#0D4F4F] text-white dark:border-teal-400 dark:bg-teal-400 dark:text-slate-950"
                  : "border-stone-300 text-slate-700 hover:bg-stone-100 dark:border-white/20 dark:text-slate-200 dark:hover:bg-white/10"
              }`}
            >
              Heavy letters only
            </button>
          </div>

          <ul className="grid gap-4 md:grid-cols-2">
            {filteredMatrix.map((row) => (
              <li key={row.name} className={`flex items-center justify-between rounded-3xl p-4 shadow-sm ${CARD}`}>
                <div className="w-24 text-center">
                  <p lang="ar" className="arabic-font text-4xl font-bold leading-none text-slate-900 dark:text-white">{row.letter}</p>
                  <p className="mt-1 text-xs font-bold text-slate-500 dark:text-slate-400">{row.name}</p>
                </div>
                <button
                  type="button"
                  onClick={() => hear(row.sukun.ar, row.name)}
                  className={`flex-1 ms-4 rounded-2xl border-2 py-3 text-center transition ${TONES.sukun.tile} ${FOCUS}`}
                >
                  <span lang="ar" className="arabic-font block text-3xl font-bold">{row.sukun.ar}</span>
                  {hints && <span dir="ltr" className="block text-xs font-bold">{row.sukun.tr}</span>}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* 3. Reading / Syllable Builder */}
        <div
          role="tabpanel"
          id="sukun-panel-reading"
          aria-labelledby="sukun-tab-reading"
          hidden={activeTab !== "reading"}
          tabIndex={0}
          className={`space-y-6 rounded-2xl ${FOCUS}`}
        >
          <div className="space-y-3">
            <h2 className="text-3xl font-extrabold text-[#0D4F4F] dark:text-white sm:text-4xl">Syllable Builder</h2>
            <p className={`max-w-2xl text-base ${MUTED}`}>Practice reading Quranic words containing closed sakin syllables.</p>
          </div>

          {word && (
            <div className={`overflow-hidden rounded-3xl shadow-sm ${CARD}`}>
              <div className="grid lg:grid-cols-12">
                <div className="relative flex min-h-[20rem] flex-col justify-between gap-6 bg-gradient-to-br from-slate-900 to-teal-950 p-8 text-white lg:col-span-5 sm:p-10">
                  <div className="text-center">
                    <Scene emoji={word.scene} label={word.meaning} size="text-7xl" />
                    <button
                      type="button"
                      onClick={() => hear(word.arabic, `word-${word.id}`)}
                      className="mt-4 rounded-xl px-3"
                    >
                      <span lang="ar" dir="rtl" className="arabic-font block font-bold" style={{ fontSize: fluid(3.2, 9, 5) }}>
                        {word.arabic}
                      </span>
                    </button>
                    {hints && (
                      <div className="mt-3">
                        <p className="text-2xl font-extrabold text-cyan-300">{word.translit}</p>
                        <p className="text-base font-semibold">“{word.meaning}”</p>
                      </div>
                    )}
                  </div>
                  {word.quran && (
                    <p lang="ar" dir="rtl" className="arabic-font text-center text-lg text-amber-200">
                      {word.quran}
                    </p>
                  )}
                </div>

                <div className="flex flex-col justify-between gap-6 p-6 sm:p-10 lg:col-span-7">
                  <ol
                    dir="rtl"
                    className="grid gap-3"
                    style={{ gridTemplateColumns: `repeat(${word.breakdown.length}, minmax(0, 1fr))` }}
                  >
                    {word.breakdown.map((b, i) => (
                      <li key={i}>
                        <button
                          type="button"
                          onClick={() => hear(b.ar, `syl-${i}`, 0.65)}
                          className={`w-full rounded-3xl border-2 p-4 text-center transition ${
                            b.sukun ? "border-cyan-500 bg-cyan-50 text-cyan-900 dark:bg-cyan-400/10 dark:text-cyan-200" : "border-stone-200 dark:border-white/10"
                          } ${hot === i ? "scale-105 shadow-lg" : ""}`}
                        >
                          <span lang="ar" className="arabic-font block text-4xl font-bold">{b.ar}</span>
                          {hints && <span dir="ltr" className="mt-1 block text-xs font-bold">{b.tr}</span>}
                        </button>
                      </li>
                    ))}
                  </ol>

                  <div className="flex flex-wrap items-center justify-center gap-3 border-t pt-5 dark:border-white/10">
                    <button type="button" onClick={slowSpell} className={BTN_OUTLINE}>
                      <Play className="h-4 w-4" /> Spell word
                    </button>
                    <button
                      type="button"
                      onClick={() => setReadingIdx((p) => (p + 1 >= READ_WORDS.length ? 0 : p + 1))}
                      className={BTN_PRIMARY}
                    >
                      Next word
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 4. Games */}
        <div
          role="tabpanel"
          id="sukun-panel-games"
          aria-labelledby="sukun-tab-games"
          hidden={activeTab !== "games"}
          tabIndex={0}
          className={`space-y-8 rounded-2xl ${FOCUS}`}
        >
          {gameMode === "menu" && (
            <>
              <div className="space-y-3">
                <h2 className="text-3xl font-extrabold text-[#0D4F4F] dark:text-white sm:text-4xl">Games &amp; quiz</h2>
                <p className={`max-w-2xl text-base ${MUTED}`}>Test your knowledge of Sukun and closed syllables.</p>
              </div>
              <ul className="grid gap-5 sm:grid-cols-2">
                {GAME_MENU.map((g) => (
                  <li key={g.id}>
                    <button
                      type="button"
                      onClick={() => startGame(g.id)}
                      className={`flex h-full w-full items-start gap-4 rounded-3xl p-6 text-start shadow-sm transition hover:-translate-y-1 ${CARD} ${FOCUS}`}
                    >
                      <Scene emoji={g.icon} label="" size="text-4xl" />
                      <span>
                        <span className="block text-lg font-extrabold text-[#0D4F4F] dark:text-white">{g.title}</span>
                        <span className={`mt-1 block text-sm ${MUTED}`}>{g.text}</span>
                        <span className="mt-2 block text-xs font-bold text-[#0D6B66] dark:text-teal-300">
                          {g.count} questions
                        </span>
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </>
          )}

          {gameMode !== "menu" && !finished && q && (
            <section aria-label="Question" className={`mx-auto max-w-2xl space-y-6 rounded-3xl p-6 shadow-sm sm:p-8 ${CARD}`}>
              <div className={`flex items-center justify-between text-sm font-semibold ${MUTED}`}>
                <span>Question {qIndex + 1} of {questions.length}</span>
                <span>Score: {score}</span>
              </div>
              {q.scene && (
                <div className="text-center">
                  <Scene emoji={q.scene} label="" size="text-6xl" />
                </div>
              )}
              <h2 className="text-center text-xl font-extrabold text-slate-900 dark:text-white">{q.prompt}</h2>
              {q.big && (
                <div className="flex items-center justify-center gap-3">
                  <p lang="ar" dir="rtl" className="arabic-font text-center font-bold text-[#0D6B66] dark:text-teal-300" style={{ fontSize: fluid(2.6, 7, 3.6) }}>
                    {q.big}
                  </p>
                </div>
              )}

              <div className="grid gap-3 sm:grid-cols-3">
                {q.options.map((opt, i) => {
                  const isRight = answered && i === q.correct;
                  const isWrong = answered && picked === i && i !== q.correct;
                  return (
                    <button
                      key={opt}
                      type="button"
                      disabled={answered}
                      onClick={() => pick(i)}
                      className={`flex min-h-14 flex-col items-center justify-center gap-1 rounded-2xl border-2 px-3 py-3 text-center text-base font-extrabold transition ${
                        isRight
                          ? "border-emerald-500 bg-emerald-50 text-emerald-900 dark:bg-emerald-400/10 dark:text-emerald-200"
                          : isWrong
                          ? "border-rose-500 bg-rose-50 text-rose-900 dark:bg-rose-400/10 dark:text-rose-200"
                          : "border-stone-200 text-slate-800 hover:border-[#0D9488] dark:border-white/15 dark:text-slate-100"
                      }`}
                    >
                      <span>{opt}</span>
                    </button>
                  );
                })}
              </div>

              {answered && (
                <div className="space-y-3 rounded-2xl border p-4 text-[15px] leading-relaxed">
                  <p className="font-extrabold">{picked === q.correct ? "Correct! +1 star" : "Not quite."}</p>
                  <p>{q.why}</p>
                  <button type="button" onClick={nextQuestion} className={BTN_PRIMARY}>
                    {qIndex + 1 === questions.length ? "See my score" : "Next question"}
                  </button>
                </div>
              )}
            </section>
          )}

          {gameMode !== "menu" && finished && (
            <section aria-label="Results" className={`mx-auto max-w-xl space-y-5 rounded-3xl p-8 text-center shadow-sm ${CARD}`}>
              <Trophy className="mx-auto h-12 w-12 text-amber-500" />
              <p className="text-5xl font-black text-[#0D4F4F] dark:text-teal-300">{score}/{questions.length}</p>
              <p className="text-lg font-extrabold">Great job mastering Al-Sukoon!</p>
              <div className="flex justify-center gap-3">
                <button type="button" onClick={() => startGame(gameMode)} className={BTN_PRIMARY}>
                  <RotateCcw className="h-4 w-4" /> Try again
                </button>
                <button type="button" onClick={() => startGame("menu")} className={BTN_OUTLINE}>
                  Back to games
                </button>
              </div>
            </section>
          )}
        </div>
      </main>
    </div>
  );
}