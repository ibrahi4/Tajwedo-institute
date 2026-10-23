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
  Waves,
  XCircle,
} from "lucide-react";
import { useLesson } from "../shared/LessonContext";
import { BeatMeter, SlideDeck, TeacherCorner, VoiceNotice, speakArabic } from "../shared/Lessontoolkit";
import type { BeatPair, Slide } from "../shared/Lessontoolkit";

/* -------------------------------------------------------------------------- */
/*  Types and styling                                                         */
/* -------------------------------------------------------------------------- */

type MainTab = "learn" | "chart" | "reading" | "games";
type MaddType = "alif" | "waw" | "ya";
type QuizMode = "identify_madd" | "beat_comparison" | "word_meaning";
type GameModeId = "menu" | QuizMode | "final_test";

const FOCUS =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600 dark:focus-visible:outline-teal-300";
const CARD = "border border-stone-200 bg-white dark:border-white/10 dark:bg-[#111827]";
const MUTED = "text-slate-600 dark:text-slate-300";
const BTN_PRIMARY = `inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[#0D4F4F] px-5 text-sm font-bold text-white hover:bg-[#093D33] dark:bg-teal-400 dark:text-slate-950 dark:hover:bg-teal-300 ${FOCUS}`;
const BTN_OUTLINE = `inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-[#0D4F4F]/30 px-5 text-sm font-bold text-[#0D4F4F] hover:bg-[#0D4F4F]/5 dark:border-white/20 dark:text-teal-200 dark:hover:bg-white/5 ${FOCUS}`;

// Orange = Alif, Emerald = Waw, Violet = Ya, everywhere in the lesson.
const TONES: Record<
  MaddType,
  { text: string; chip: string; bar: string; border: string; tint: string; grad: string; tile: string }
> = {
  alif: {
    text: "text-orange-700 dark:text-orange-300",
    chip: "bg-orange-600 text-white",
    bar: "bg-orange-500",
    border: "border-orange-200 dark:border-orange-400/30",
    tint: "bg-orange-50 dark:bg-orange-400/10",
    grad: "from-orange-500 to-amber-500",
    tile: "border-orange-200 bg-orange-50 text-orange-700 hover:bg-orange-100 dark:border-orange-400/30 dark:bg-orange-400/10 dark:text-orange-300 dark:hover:bg-orange-400/20",
  },
  waw: {
    text: "text-emerald-700 dark:text-emerald-300",
    chip: "bg-emerald-600 text-white",
    bar: "bg-emerald-500",
    border: "border-emerald-200 dark:border-emerald-400/30",
    tint: "bg-emerald-50 dark:bg-emerald-400/10",
    grad: "from-emerald-500 to-teal-500",
    tile: "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:border-emerald-400/30 dark:bg-emerald-400/10 dark:text-emerald-300 dark:hover:bg-emerald-400/20",
  },
  ya: {
    text: "text-violet-700 dark:text-violet-300",
    chip: "bg-violet-600 text-white",
    bar: "bg-violet-500",
    border: "border-violet-200 dark:border-violet-400/30",
    tint: "bg-violet-50 dark:bg-violet-400/10",
    grad: "from-violet-500 to-purple-500",
    tile: "border-violet-200 bg-violet-50 text-violet-700 hover:bg-violet-100 dark:border-violet-400/30 dark:bg-violet-400/10 dark:text-violet-300 dark:hover:bg-violet-400/20",
  },
};

/* -------------------------------------------------------------------------- */
/*  Content                                                                   */
/* -------------------------------------------------------------------------- */

// Scenes are emoji so every picture matches its word exactly (swap for illustrations whenever you like).
const MADD_CARDS = [
  {
    id: "alif" as MaddType,
    badge: "Madd bil-Alif",
    nameAr: "المَدُّ بِالأَلِف",
    sampleAr: "بَا",
    soundTitle: "Long “aa”",
    vowel: "Fatha (ـَ)",
    letter: "Alif (ا)",
    description:
      "Alif Madd loves Fatha! When a letter has Fatha followed by a bare Alif (no Hamza or Sukun on it), open your jaw and stretch the sound for exactly 2 beats.",
    scene: "🏔️",
    sceneWord: "جِبَالُ",
    sceneMeaning: "Mountains",
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
    soundTitle: "Long “uu”",
    vowel: "Damma (ـُ)",
    letter: "Waw (و)",
    description:
      "Waw Madd loves Damma! When a letter has Damma followed by a bare Waw, keep your lips rounded in a small circle for 2 smooth beats: “buu”.",
    scene: "🌸",
    sceneWord: "زُهُورُ",
    sceneMeaning: "Flowers",
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
    soundTitle: "Long “ii”",
    vowel: "Kasra (ـِ)",
    letter: "Ya (ي)",
    description:
      "Ya Madd loves Kasra! When a letter has Kasra underneath followed by a bare Ya, smile gently and stretch the sound for 2 beats: “bii”.",
    scene: "🐘",
    sceneWord: "فِيلُ",
    sceneMeaning: "Elephant",
    examples: [
      { ar: "بِي", tr: "bii" },
      { ar: "تِي", tr: "tii" },
      { ar: "فِي", tr: "fii" },
      { ar: "دِي", tr: "dii" },
    ],
  },
];

const BEAT_PAIRS: BeatPair[] = [
  { id: "alif", name: "Alif (ا)", short: { ar: "بَ", tr: "ba" }, long: { ar: "بَا", tr: "baa" }, tone: TONES.alif },
  { id: "waw", name: "Waw (و)", short: { ar: "بُ", tr: "bu" }, long: { ar: "بُو", tr: "buu" }, tone: TONES.waw },
  { id: "ya", name: "Ya (ي)", short: { ar: "بِ", tr: "bi" }, long: { ar: "بِي", tr: "bii" }, tone: TONES.ya },
];

// [letter, name, transliteration, heavy?]  (heavy = خ ص ض غ ط ق ظ, said with a full mouth)
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

// 28 consonants: Hamza + the 27 letters above (each with Fatha+Alif, Damma+Waw, Kasra+Ya).
const MATRIX = [
  {
    letter: "ء",
    name: "Hamza",
    heavy: false,
    alif: { ar: "آ", tr: "’aa" },
    waw: { ar: "أُو", tr: "’uu" },
    ya: { ar: "إِي", tr: "’ii" },
  },
  ...LETTERS.map(([letter, name, tr, heavy]) => ({
    letter,
    name,
    heavy: Boolean(heavy),
    alif: { ar: `${letter}َا`, tr: `${tr}aa` },
    waw: { ar: `${letter}ُو`, tr: `${tr}uu` },
    ya: { ar: `${letter}ِي`, tr: `${tr}ii` },
  })),
];

type ReadWord = {
  id: string;
  arabic: string;
  translit: string;
  meaning: string;
  types: MaddType[];
  scene: string;
  quran?: string;
  breakdown: { ar: string; tr: string; madd?: boolean }[];
};

const READ_WORDS: ReadWord[] = [
  {
    id: "jibaal",
    arabic: "جِبَالُ",
    translit: "ji-baa-lu",
    meaning: "Mountains",
    types: ["alif"],
    scene: "🏔️",
    quran: "وَٱلْجِبَالَ أَوْتَادًا · 78:7",
    breakdown: [
      { ar: "جِ", tr: "ji" },
      { ar: "بَا", tr: "baa", madd: true },
      { ar: "لُ", tr: "lu" },
    ],
  },
  {
    id: "bihaar",
    arabic: "بِحَارُ",
    translit: "bi-haa-ru",
    meaning: "Seas",
    types: ["alif"],
    scene: "🌊",
    quran: "وَإِذَا ٱلْبِحَارُ سُجِّرَتْ · 81:6",
    breakdown: [
      { ar: "بِ", tr: "bi" },
      { ar: "حَا", tr: "haa", madd: true },
      { ar: "رُ", tr: "ru" },
    ],
  },
  {
    id: "zuhoor",
    arabic: "زُهُورُ",
    translit: "zu-huu-ru",
    meaning: "Flowers",
    types: ["waw"],
    scene: "🌸",
    breakdown: [
      { ar: "زُ", tr: "zu" },
      { ar: "هُو", tr: "huu", madd: true },
      { ar: "رُ", tr: "ru" },
    ],
  },
  {
    id: "tuyoor",
    arabic: "طُيُورُ",
    translit: "tu-yuu-ru",
    meaning: "Birds",
    types: ["waw"],
    scene: "🐦",
    breakdown: [
      { ar: "طُ", tr: "tu" },
      { ar: "يُو", tr: "yuu", madd: true },
      { ar: "رُ", tr: "ru" },
    ],
  },
  {
    id: "fiil",
    arabic: "فِيلُ",
    translit: "fii-lu",
    meaning: "Elephant",
    types: ["ya"],
    scene: "🐘",
    quran: "بِأَصْحَٰبِ ٱلْفِيلِ · 105:1",
    breakdown: [
      { ar: "فِي", tr: "fii", madd: true },
      { ar: "لُ", tr: "lu" },
    ],
  },
  {
    id: "mafaateeh",
    arabic: "مَفَاتِيحُ",
    translit: "ma-faa-tii-hu",
    meaning: "Keys (two Madds!)",
    types: ["alif", "ya"],
    scene: "🔑",
    breakdown: [
      { ar: "مَ", tr: "ma" },
      { ar: "فَا", tr: "faa", madd: true },
      { ar: "تِي", tr: "tii", madd: true },
      { ar: "حُ", tr: "hu" },
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
    mode: "identify_madd",
    prompt: "Which short vowel MUST come right before Alif Madd (ا)?",
    big: "بَا",
    audio: "بَا",
    options: ["Fatha (ـَ)", "Damma (ـُ)", "Kasra (ـِ)"],
    correct: 0,
    why: "Alif Madd always comes after a Fatha.",
  },
  {
    id: 2,
    mode: "identify_madd",
    prompt: "Which letter must follow a Damma to make a Madd?",
    big: "بُو",
    audio: "بُو",
    options: ["Alif (ا)", "Waw (و)", "Ya (ي)"],
    correct: 1,
    why: "Damma + bare Waw makes Madd bil-Waw.",
  },
  {
    id: 3,
    mode: "identify_madd",
    prompt: "Look at the syllable. Which Madd is it?",
    big: "بِي",
    audio: "بِي",
    options: ["Madd bil-Alif", "Madd bil-Waw", "Madd bil-Ya"],
    correct: 2,
    why: "Kasra + bare Ya makes Madd bil-Ya.",
  },
  {
    id: 4,
    mode: "beat_comparison",
    prompt: "How many beats do we stretch a Natural Madd (المد الطبيعي)?",
    big: "قَالَ • يَقُولُ • قِيلَ",
    audio: "قَالَ يَقُولُ قِيلَ",
    options: ["1 short beat", "Exactly 2 beats", "6 long beats"],
    correct: 1,
    why: "A Natural Madd (Madd Tabee’i) is stretched for exactly 2 smooth beats.",
  },
  {
    id: 5,
    mode: "beat_comparison",
    prompt: "How many beats is the short vowel in this letter?",
    big: "بَ",
    audio: "بَ",
    options: ["2 beats", "1 beat", "4 beats"],
    correct: 1,
    why: "A short vowel lasts one beat. Only the Madd letters stretch to two.",
  },
  {
    id: 6,
    mode: "beat_comparison",
    prompt: "Which one is held longer?",
    big: "بُ  •  بُو",
    audio: "بُو",
    options: ["بُ", "بُو", "They are the same"],
    correct: 1,
    why: "بُو has the Waw Madd, so it lasts 2 beats. بُ lasts 1.",
  },
  {
    id: 7,
    mode: "word_meaning",
    prompt: "Read the word (birds). Which Madd letter is inside it?",
    big: "طُيُورُ",
    audio: "طُيُورُ",
    scene: "🐦",
    options: ["Madd bil-Alif", "Madd bil-Waw (يُو)", "Madd bil-Ya"],
    correct: 1,
    why: "طُيُورُ has a Damma on the Ya followed by a bare Waw: يُو.",
  },
  {
    id: 8,
    mode: "word_meaning",
    prompt: "جِبَالُ means mountains. Which Madd letter stretches in it?",
    big: "جِبَالُ",
    audio: "جِبَالُ",
    scene: "🏔️",
    options: ["Alif (بَا)", "Waw (بُو)", "Ya (بِي)"],
    correct: 0,
    why: "In جِبَالُ the Ba has a Fatha followed by Alif: بَا.",
  },
  {
    id: 9,
    mode: "word_meaning",
    prompt: "مَفَاتِيحُ (keys) has TWO Madd letters. Which ones?",
    big: "مَفَاتِيحُ",
    audio: "مَفَاتِيحُ",
    scene: "🔑",
    options: ["Waw and Ya", "Alif and Ya", "Alif and Waw"],
    correct: 1,
    why: "فَا is Alif Madd and تِي is Ya Madd. Each one lasts 2 beats.",
  },
];

const GAME_MENU: { id: Exclude<GameModeId, "menu">; title: string; text: string; icon: string; count: number }[] = [
  { id: "identify_madd", title: "Identify the Madd", text: "Match each short vowel with its Madd letter.", icon: "🔎", count: 3 },
  { id: "beat_comparison", title: "Count the Beats", text: "One beat or two? Train your ear and your counting.", icon: "🥁", count: 3 },
  { id: "word_meaning", title: "Word Detective", text: "Find the Madd letters hiding inside real words.", icon: "🕵️", count: 3 },
  { id: "final_test", title: "Final Mastery Quiz", text: "All questions in one go. Earn your stars!", icon: "🏆", count: QUESTIONS.length },
];

const TABS = [
  { id: "learn", label: "Learn", icon: BookOpen },
  { id: "chart", label: "Madd Matrix", icon: Grid },
  { id: "reading", label: "Visual Reading", icon: Layers },
  { id: "games", label: "Games & Quiz", icon: Gamepad2 },
] as const;

/* -------------------------------------------------------------------------- */
/*  Small pieces                                                              */
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

export default function MaddLesson() {
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

  const [readingFilter, setReadingFilter] = useState<"all" | MaddType>("all");
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

  const hear = useCallback((text: string, key: string, rate = 0.68) => {
    setActiveKey(key);
    speakArabic(text, rate);
    timers.current.push(window.setTimeout(() => setActiveKey((p) => (p === key ? null : p)), 600));
  }, []);

  /* ------------------------------ Derived data ------------------------------ */

  const filteredMatrix = useMemo(() => {
    const q = matrixSearch.trim().toLowerCase();
    return MATRIX.filter(
      (r) =>
        (!heavyOnly || r.heavy) &&
        (!q || r.name.toLowerCase().includes(q) || r.letter.includes(q) || r.alif.tr.toLowerCase().startsWith(q))
    );
  }, [matrixSearch, heavyOnly]);

  const words = useMemo(
    () => (readingFilter === "all" ? READ_WORDS : READ_WORDS.filter((w) => w.types.includes(readingFilter))),
    [readingFilter]
  );
  const word = words[Math.min(readingIdx, words.length - 1)];

  const questions = useMemo(() => {
    if (gameMode === "menu") return [];
    if (gameMode === "final_test") return QUESTIONS;
    return QUESTIONS.filter((q) => q.mode === gameMode);
  }, [gameMode]);
  const q = questions[qIndex];
  const answered = picked !== null;

  /* -------------------------------- Actions -------------------------------- */

  const slowRead = () => {
    if (!word) return;
    clearTimers();
    let t = 0;
    word.breakdown.forEach((b, i) => {
      timers.current.push(
        window.setTimeout(() => {
          setHot(i);
          speakArabic(b.ar, 0.6);
        }, t)
      );
      t += (b.madd ? 2 : 1) * 800;
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
      selectTab(TABS[next].id);
      tabRefs.current[TABS[next].id]?.focus();
    }
  };

  const selectTab = (id: MainTab) => {
    setActiveTab(id);
    if (id === "games") startGame("menu");
  };

  /* ------------------------------ Teacher deck ------------------------------ */

  const slides: Slide[] = [
    {
      id: "intro",
      title: "Long vowels",
      node: (
        <div className="space-y-6 text-center">
          <p lang="ar" dir="rtl" className="arabic-font font-bold text-[#A8832F] dark:text-[#E8C56A]" style={{ fontSize: fluid(3, 8, 5) }}>
            حُرُوفُ المَدِّ
          </p>
          <h2 className="text-4xl font-black text-[#0D4F4F] dark:text-white sm:text-6xl">Long vowels</h2>
          <p className={`mx-auto max-w-2xl text-xl ${MUTED}`}>
            A short vowel plus its matching letter makes a sound we stretch for exactly <strong>2 beats</strong>.
          </p>
        </div>
      ),
    },
    {
      id: "formula",
      title: "The formula",
      node: (
        <div className="grid gap-6 md:grid-cols-3">
          {MADD_CARDS.map((c) => {
            const t = TONES[c.id];
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => hear(c.sampleAr, `slide-${c.id}`)}
                className={`rounded-3xl border-2 p-8 text-center ${t.border} ${t.tint} ${FOCUS}`}
              >
                <span lang="ar" dir="rtl" className={`arabic-font block font-bold ${t.text}`} style={{ fontSize: fluid(4, 10, 6.5) }}>
                  {c.sampleAr}
                </span>
                <span className="mt-3 block text-xl font-extrabold text-slate-900 dark:text-white">
                  {c.vowel} + {c.letter}
                </span>
                <span className={`block text-lg font-semibold ${MUTED}`}>= 2 beats</span>
              </button>
            );
          })}
        </div>
      ),
    },
    ...MADD_CARDS.map((c) => {
      const t = TONES[c.id];
      return {
        id: `slide-${c.id}`,
        title: c.badge,
        node: (
          <div className="grid items-center gap-10 md:grid-cols-2">
            <div className={`rounded-3xl border-2 p-10 text-center ${t.border} ${t.tint}`}>
              <span lang="ar" dir="rtl" className={`arabic-font block font-bold ${t.text}`} style={{ fontSize: fluid(5, 14, 9) }}>
                {c.sampleAr}
              </span>
              <p className={`mt-2 text-2xl font-extrabold ${t.text}`}>{c.soundTitle} · 2 beats</p>
            </div>
            <div className="space-y-5">
              <p lang="ar" dir="rtl" className="arabic-font text-3xl font-bold text-slate-900 dark:text-white">
                {c.nameAr}
              </p>
              <p className="text-xl leading-relaxed text-slate-700 dark:text-slate-200">{c.description}</p>
              <div className={`flex items-center gap-5 rounded-2xl border p-5 ${t.border} ${t.tint}`}>
                <Scene emoji={c.scene} label={c.sceneMeaning} size="text-6xl" />
                <span lang="ar" dir="rtl" className="arabic-font text-4xl font-bold text-slate-900 dark:text-white">
                  {c.sceneWord}
                </span>
                {hints && <span className={`text-lg font-semibold ${MUTED}`}>{c.sceneMeaning}</span>}
              </div>
            </div>
          </div>
        ),
      };
    }),
    {
      id: "beats",
      title: "Count the beats",
      node: <BeatMeter pairs={BEAT_PAIRS} showHints={hints} />,
    },
    {
      id: "words",
      title: "Read the words",
      node: (
        <div className="grid gap-6 md:grid-cols-3">
          {[READ_WORDS[0], READ_WORDS[2], READ_WORDS[4]].map((w) => (
            <div key={w.id} className={`rounded-3xl p-6 text-center ${CARD}`}>
              <Scene emoji={w.scene} label={w.meaning} size="text-6xl" />
              <button type="button" onClick={() => hear(w.arabic, `slide-w-${w.id}`)} className={`mt-3 rounded-xl px-2 ${FOCUS}`}>
                <span lang="ar" dir="rtl" className="arabic-font block font-bold text-slate-900 dark:text-white" style={{ fontSize: fluid(3, 8, 4.5) }}>
                  {w.arabic}
                </span>
              </button>
              <ol dir="rtl" className="mt-4 flex justify-center gap-2">
                {w.breakdown.map((b, i) => (
                  <li key={i} className={`rounded-xl border px-3 py-2 ${b.madd ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-400/10" : "border-stone-200 dark:border-white/10"}`}>
                    <span lang="ar" className="arabic-font block text-2xl font-bold text-slate-900 dark:text-white">{b.ar}</span>
                    <BeatDots beats={b.madd ? 2 : 1} tone={b.madd ? "bg-emerald-500" : "bg-slate-400"} />
                  </li>
                ))}
              </ol>
            </div>
          ))}
        </div>
      ),
    },
    {
      id: "check",
      title: "Check for understanding",
      node: (
        <ol className="mx-auto max-w-3xl list-decimal space-y-5 ps-8 text-2xl font-semibold leading-relaxed text-slate-800 dark:text-slate-100">
          <li>Which vowel goes with Alif? With Waw? With Ya?</li>
          <li>Show 1 or 2 fingers: I say <span lang="ar" className="arabic-font font-bold">بَ</span> or <span lang="ar" className="arabic-font font-bold">بَا</span>.</li>
          <li>Find both Madd letters in <span lang="ar" className="arabic-font font-bold">مَفَاتِيحُ</span>.</li>
        </ol>
      ),
    },
  ];

  const sampleSize = fluid(3.2, 9, 4.6);

  /* --------------------------------- Render --------------------------------- */

  return (
    <div className="min-h-screen w-full bg-[#FBF8F2] font-sans text-slate-900 dark:bg-[#0B0F19] dark:text-slate-100">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "LearningResource",
            name: "Noor Al-Bayan Lesson 4: Arabic Long Vowels (Al-Madd)",
            description:
              "Learn the 3 Arabic long vowels (Madd bil-Alif, Madd bil-Waw, Madd bil-Ya) with a beat meter, audio, a 28-letter matrix, visual reading and games.",
            educationalLevel: "Beginner",
            learningResourceType: "Interactive lesson",
            teaches: "Natural Madd: stretching Alif, Waw and Ya for 2 beats",
            inLanguage: ["en", "ar"],
            isAccessibleForFree: true,
            provider: { "@type": "EducationalOrganization", name: "Tajwedo Institute" },
          }).replace(/</g, "\\u003c"),
        }}
      />

      <SlideDeck open={presenting} onClose={() => setPresenting(false)} slides={slides} heading="Lesson 4 · Long vowels" />

      {/* ------------------------------ Studio dock ------------------------------ */}
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
              onClick={() => speakArabic("بَا بُو بِي", 0.68)}
              aria-label="Hear the three Madd sounds"
              className={`flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-600 text-white shadow-md ${FOCUS}`}
            >
              <span lang="ar" dir="rtl" className="arabic-font text-xl font-bold">بَا</span>
            </button>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-extrabold leading-none tracking-tight sm:text-lg">
                  Long Vowels{" "}
                  <span lang="ar" dir="rtl" className="arabic-font font-bold text-[#A8832F] dark:text-[#E8C56A]">
                    (حُرُوفُ المَدِّ الثَّلَاثَةُ)
                  </span>
                </h1>
                <span className="hidden rounded-md bg-emerald-100 px-2 py-0.5 text-xs font-bold text-emerald-800 dark:bg-emerald-400/15 dark:text-emerald-300 md:inline-block">
                  Lesson 4
                </span>
              </div>
              <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                2-beat stretching letters: Alif (ا), Waw (و), Ya (ي)
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
                  id={`madd-tab-${tab.id}`}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  aria-controls={`madd-panel-${tab.id}`}
                  tabIndex={active ? 0 : -1}
                  onClick={() => selectTab(tab.id)}
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

        {/* ------------------------------ 1. Learn ------------------------------ */}
        <div
          role="tabpanel"
          id="madd-panel-learn"
          aria-labelledby="madd-tab-learn"
          hidden={activeTab !== "learn"}
          tabIndex={0}
          className={`space-y-14 rounded-2xl ${FOCUS}`}
        >
          <section className="space-y-8">
            <div>
              <p className="inline-flex items-center gap-1.5 text-sm font-bold text-[#0D6B66] dark:text-teal-300">
                <Waves aria-hidden="true" className="h-4 w-4" /> Lesson 4 · The 2-beat stretch
              </p>
              <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-[#0D4F4F] dark:text-white sm:text-4xl">
                Meet the three letters of Madd{" "}
                <span lang="ar" dir="rtl" className="arabic-font text-[#A8832F] dark:text-[#E8C56A]">(حُرُوفُ المَدِّ)</span>
              </h2>
              <p className={`mt-3 max-w-2xl text-base ${MUTED}`}>
                Each Madd letter has a favourite short vowel before it. Match the pair, then stretch for exactly 2 beats.
              </p>
            </div>

            <ul className="grid gap-7 lg:grid-cols-3">
              {MADD_CARDS.map((card) => {
                const t = TONES[card.id];
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
                        <div className="flex flex-wrap items-baseline justify-between gap-2">
                          <p className={`text-lg font-extrabold ${t.text}`}>{card.soundTitle} · 2 beats</p>
                          <p className="text-xs font-bold text-slate-500 dark:text-slate-400">
                            {card.vowel} + {card.letter}
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() => hear(card.sampleAr, key)}
                          aria-label={`Hear ${card.sampleAr}`}
                          className={`rounded-3xl border py-5 text-center transition-transform motion-reduce:transition-none ${t.border} ${t.tint} ${
                            activeKey === key ? "scale-[1.03]" : ""
                          } ${FOCUS}`}
                        >
                          <span lang="ar" dir="rtl" className={`arabic-font block font-bold ${t.text}`} style={{ fontSize: sampleSize }}>
                            {card.sampleAr}
                          </span>
                          <span className={`mt-1 inline-flex items-center gap-1.5 text-xs font-bold ${t.text}`}>
                            <Volume2 aria-hidden="true" className="h-3.5 w-3.5" /> Tap to hear
                          </span>
                        </button>

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

          <section className={`space-y-6 rounded-3xl p-6 shadow-sm sm:p-10 ${CARD}`}>
            <div className="mx-auto max-w-2xl text-center">
              <p className="inline-flex items-center gap-1.5 text-sm font-bold text-[#0D6B66] dark:text-teal-300">
                <Play aria-hidden="true" className="h-4 w-4" /> Interactive beat meter
              </p>
              <h2 className="mt-2 text-2xl font-extrabold text-[#0D4F4F] dark:text-white sm:text-3xl">
                Compare 1 short beat with 2 Madd beats
              </h2>
              <p className={`mt-2 text-sm ${MUTED}`}>Press count and say the syllable along with the clicks.</p>
            </div>
            <BeatMeter pairs={BEAT_PAIRS} showHints={hints} />
          </section>

          <TeacherCorner
            sections={[
              {
                heading: "Lesson goals",
                items: [
                  "Match each Madd letter with its short vowel: Alif after Fatha, Waw after Damma, Ya after Kasra.",
                  "Stretch a natural Madd for exactly 2 beats.",
                  "Tell a 1-beat short vowel from a 2-beat Madd while reading.",
                  "Read six everyday words that contain Madd, three of them linked to the Quran.",
                ],
              },
              {
                heading: "A 25-minute plan",
                items: [
                  "3 min: warm up with بَ بُ بِ, one beat each.",
                  "5 min: press Present and walk through the formula and the three Madd slides.",
                  "5 min: beat meter. Count 1 beat and 2 beats aloud with the clicks.",
                  "7 min: Visual Reading. Use Slow read, then let the student read alone.",
                  "5 min: Final Mastery Quiz as an exit check.",
                ],
              },
              {
                heading: "Mistakes to listen for",
                items: [
                  "Cutting the Madd short, so baa sounds like ba.",
                  "Stretching past 2 beats, which belongs to other Madd rules.",
                  "Adding a hidden extra sound, like buu turning into bu-wu. Keep lips and tongue still.",
                  "Treating Fatha + Waw (as in بَوْ) as a Madd. That is a different rule, Madd Leen.",
                ],
              },
              {
                heading: "Quick activities",
                items: [
                  "Finger count: show 1 or 2 fingers while the student reads each syllable.",
                  "Mystery syllable: say بَ or بَا and let the student show the beats.",
                  "Home practice: read جِبَالُ, زُهُورُ and فِيلُ to a parent.",
                  "Matrix race: pick a letter in the matrix and read its three sounds.",
                ],
              },
            ]}
          />
        </div>

        {/* ------------------------------ 2. Matrix ------------------------------ */}
        <div
          role="tabpanel"
          id="madd-panel-chart"
          aria-labelledby="madd-tab-chart"
          hidden={activeTab !== "chart"}
          tabIndex={0}
          className={`space-y-8 rounded-2xl ${FOCUS}`}
        >
          <div className="space-y-3">
            <h2 className="text-3xl font-extrabold text-[#0D4F4F] dark:text-white sm:text-4xl">
              28 letters × 3 long vowels
            </h2>
            <p className={`max-w-2xl text-base ${MUTED}`}>
              Tap any tile to hear it. Heavy letters (
              <span lang="ar" className="arabic-font font-bold">خ ص ض غ ط ق ظ</span>
              ) are said with a full mouth, so even their Madd sounds fuller. Compare Seen (saa) with Saad (Saa).
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
            <p className="sr-only" aria-live="polite">{`${filteredMatrix.length} letters shown`}</p>
          </div>

          <ul className="grid gap-4 md:grid-cols-2">
            {filteredMatrix.map((row) => (
              <li key={row.name} className={`flex items-center gap-4 rounded-3xl p-4 shadow-sm ${CARD}`}>
                <div className="w-20 shrink-0 text-center">
                  <p lang="ar" className="arabic-font text-4xl font-bold leading-none text-slate-900 dark:text-white">{row.letter}</p>
                  <p className="mt-1 text-xs font-bold text-slate-500 dark:text-slate-400">{row.name}</p>
                  {row.heavy && (
                    <span className="mt-1 inline-block rounded-full bg-slate-900 px-2 py-0.5 text-[10px] font-bold text-white dark:bg-white dark:text-slate-900">
                      Heavy
                    </span>
                  )}
                </div>
                <div dir="rtl" className="grid flex-1 grid-cols-3 gap-2.5">
                  {(["alif", "waw", "ya"] as const).map((k) => {
                    const cell = row[k];
                    const key = `${row.name}-${k}`;
                    return (
                      <button
                        key={k}
                        type="button"
                        onClick={() => hear(cell.ar, key)}
                        aria-label={`Hear ${cell.tr}`}
                        className={`rounded-2xl border-2 py-3 text-center transition motion-reduce:transition-none ${TONES[k].tile} ${
                          activeKey === key ? "scale-105 shadow-md" : ""
                        } ${FOCUS}`}
                      >
                        <span lang="ar" className="arabic-font block text-3xl font-bold leading-tight">{cell.ar}</span>
                        {hints && <span dir="ltr" className="block text-[11px] font-bold">{cell.tr}</span>}
                      </button>
                    );
                  })}
                </div>
              </li>
            ))}
          </ul>

          {filteredMatrix.length === 0 && (
            <p className={`rounded-2xl border border-dashed border-stone-300 p-8 text-center dark:border-white/20 ${MUTED}`}>
              No letters match. Clear the search or turn off the heavy-letters filter.
            </p>
          )}
        </div>

        {/* ---------------------------- 3. Visual reading ---------------------------- */}
        <div
          role="tabpanel"
          id="madd-panel-reading"
          aria-labelledby="madd-tab-reading"
          hidden={activeTab !== "reading"}
          tabIndex={0}
          className={`space-y-6 rounded-2xl ${FOCUS}`}
        >
          <div className="space-y-3">
            <h2 className="text-3xl font-extrabold text-[#0D4F4F] dark:text-white sm:text-4xl">Visual reading</h2>
            <p className={`max-w-2xl text-base ${MUTED}`}>
              Tap a syllable to hear it. Madd syllables show two beat bars. Use Slow read to follow the beats one by one.
            </p>
          </div>

          <div role="group" aria-label="Filter words by Madd letter" className="flex flex-wrap gap-2">
            {(["all", "alif", "waw", "ya"] as const).map((f) => (
              <button
                key={f}
                type="button"
                aria-pressed={readingFilter === f}
                onClick={() => {
                  setReadingFilter(f);
                  setReadingIdx(0);
                  setHot(null);
                }}
                className={`min-h-11 rounded-full border px-4 text-sm font-bold ${FOCUS} ${
                  readingFilter === f
                    ? "border-[#0D4F4F] bg-[#0D4F4F] text-white dark:border-teal-400 dark:bg-teal-400 dark:text-slate-950"
                    : "border-stone-300 text-slate-700 hover:bg-stone-100 dark:border-white/20 dark:text-slate-200 dark:hover:bg-white/10"
                }`}
              >
                {f === "all" ? "All words" : f === "alif" ? "With Alif" : f === "waw" ? "With Waw" : "With Ya"}
              </button>
            ))}
          </div>

          {word && (
            <div className={`overflow-hidden rounded-3xl shadow-sm ${CARD}`}>
              <div className="grid lg:grid-cols-12">
                <div className="relative flex min-h-[20rem] flex-col justify-between gap-6 bg-gradient-to-br from-slate-900 to-teal-950 p-8 text-white lg:col-span-5 sm:p-10">
                  <p className="w-fit rounded-full bg-white/15 px-3 py-1 text-xs font-bold">
                    Word {Math.min(readingIdx, words.length - 1) + 1} of {words.length}
                  </p>
                  <div className="text-center">
                    <Scene emoji={word.scene} label={word.meaning} size="text-7xl" />
                    <button
                      type="button"
                      onClick={() => hear(word.arabic, `word-${word.id}`)}
                      aria-label={`Hear ${word.translit}`}
                      className="mt-4 rounded-xl px-3 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                    >
                      <span lang="ar" dir="rtl" className="arabic-font block font-bold" style={{ fontSize: fluid(3.2, 9, 5) }}>
                        {word.arabic}
                      </span>
                    </button>
                    {hints && (
                      <div className="mt-3">
                        <p className="text-2xl font-extrabold text-emerald-300">{word.translit}</p>
                        <p className="text-base font-semibold">“{word.meaning}”</p>
                      </div>
                    )}
                  </div>
                  {word.quran ? (
                    <p lang="ar" dir="rtl" className="arabic-font text-center text-lg text-amber-200">
                      {word.quran}
                    </p>
                  ) : (
                    <span aria-hidden="true" />
                  )}
                </div>

                <div className="flex flex-col justify-between gap-6 p-6 sm:p-10 lg:col-span-7">
                  <ol
                    dir="rtl"
                    className="grid gap-3"
                    style={{ gridTemplateColumns: `repeat(${word.breakdown.length}, minmax(0, 1fr))` }}
                  >
                    {word.breakdown.map((b, i) => (
                      <li key={`${word.id}-${i}`}>
                        <button
                          type="button"
                          onClick={() => hear(b.ar, `syl-${word.id}-${i}`, 0.6)}
                          aria-label={`Hear ${b.tr}${b.madd ? ", two beats" : ""}`}
                          className={`w-full rounded-3xl border-2 p-4 text-center transition motion-reduce:transition-none ${FOCUS} ${
                            b.madd
                              ? "border-emerald-500 bg-emerald-50 text-emerald-800 dark:bg-emerald-400/10 dark:text-emerald-300"
                              : "border-stone-200 text-slate-900 dark:border-white/10 dark:text-white"
                          } ${hot === i || activeKey === `syl-${word.id}-${i}` ? "scale-105 shadow-lg" : ""}`}
                        >
                          <span lang="ar" className="arabic-font block text-4xl font-bold">{b.ar}</span>
                          {hints && <span dir="ltr" className="mt-1 block text-xs font-bold">{b.tr}</span>}
                          <BeatDots beats={b.madd ? 2 : 1} tone={b.madd ? "bg-emerald-500" : "bg-slate-400"} />
                        </button>
                      </li>
                    ))}
                  </ol>

                  <div className="space-y-4 border-t border-stone-200 pt-5 dark:border-white/10">
                    <div className="flex flex-wrap items-center justify-center gap-3">
                      <button
                        type="button"
                        onClick={() => {
                          setReadingIdx((p) => (p === 0 ? words.length - 1 : p - 1));
                          setHot(null);
                        }}
                        className={BTN_OUTLINE}
                      >
                        Previous
                      </button>
                      <button type="button" onClick={() => hear(word.arabic, `word-${word.id}`)} className={BTN_PRIMARY}>
                        <Volume2 aria-hidden="true" className="h-4 w-4" /> Listen
                      </button>
                      <button type="button" onClick={slowRead} className={BTN_OUTLINE}>
                        <Play aria-hidden="true" className="h-4 w-4" /> Slow read
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setReadingIdx((p) => (p + 1 >= words.length ? 0 : p + 1));
                          setHot(null);
                        }}
                        className={BTN_OUTLINE}
                      >
                        Next
                      </button>
                    </div>
                    <ol className="flex flex-wrap items-center justify-center gap-1.5">
                      {words.map((w, i) => (
                        <li key={w.id}>
                          <button
                            type="button"
                            onClick={() => {
                              setReadingIdx(i);
                              setHot(null);
                            }}
                            aria-label={`Word ${i + 1}: ${w.meaning}`}
                            aria-current={i === Math.min(readingIdx, words.length - 1) ? "true" : undefined}
                            className={`h-3 rounded-full transition-all motion-reduce:transition-none ${FOCUS} ${
                              i === Math.min(readingIdx, words.length - 1)
                                ? "w-8 bg-[#0D4F4F] dark:bg-teal-300"
                                : "w-3 bg-stone-300 hover:bg-stone-400 dark:bg-white/20"
                            }`}
                          />
                        </li>
                      ))}
                    </ol>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ------------------------------ 4. Games ------------------------------ */}
        <div
          role="tabpanel"
          id="madd-panel-games"
          aria-labelledby="madd-tab-games"
          hidden={activeTab !== "games"}
          tabIndex={0}
          className={`space-y-8 rounded-2xl ${FOCUS}`}
        >
          {gameMode === "menu" && (
            <>
              <div className="space-y-3">
                <h2 className="text-3xl font-extrabold text-[#0D4F4F] dark:text-white sm:text-4xl">Games &amp; quiz</h2>
                <p className={`max-w-2xl text-base ${MUTED}`}>Every right answer earns a star. Pick a game to start.</p>
              </div>
              <ul className="grid gap-5 sm:grid-cols-2">
                {GAME_MENU.map((g) => (
                  <li key={g.id}>
                    <button
                      type="button"
                      onClick={() => startGame(g.id)}
                      className={`flex h-full w-full items-start gap-4 rounded-3xl p-6 text-start shadow-sm transition hover:-translate-y-1 hover:border-teal-600/60 motion-reduce:transition-none motion-reduce:hover:translate-y-0 ${CARD} ${FOCUS}`}
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
                <span>
                  Question {qIndex + 1} of {questions.length}
                </span>
                <span>Score: {score}</span>
              </div>
              <div
                role="progressbar"
                aria-label="Quiz progress"
                aria-valuemin={0}
                aria-valuemax={questions.length}
                aria-valuenow={qIndex + (answered ? 1 : 0)}
                className="h-2 overflow-hidden rounded-full bg-stone-200 dark:bg-white/10"
              >
                <div
                  className="h-full rounded-full bg-[#0D9488] transition-[width] duration-500 motion-reduce:transition-none"
                  style={{ width: `${((qIndex + (answered ? 1 : 0)) / questions.length) * 100}%` }}
                />
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
                  {q.audio && (
                    <button
                      type="button"
                      onClick={() => speakArabic(q.audio as string, 0.68)}
                      aria-label="Hear it"
                      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#0D4F4F] text-white dark:bg-teal-400 dark:text-slate-950 ${FOCUS}`}
                    >
                      <Volume2 aria-hidden="true" className="h-5 w-5" />
                    </button>
                  )}
                </div>
              )}

              <div role="group" aria-label="Answers" className="grid gap-3 sm:grid-cols-3">
                {q.options.map((opt, i) => {
                  const isRight = answered && i === q.correct;
                  const isWrong = answered && picked === i && i !== q.correct;
                  return (
                    <button
                      key={opt}
                      type="button"
                      disabled={answered}
                      onClick={() => pick(i)}
                      className={`flex min-h-14 flex-col items-center justify-center gap-1 rounded-2xl border-2 px-3 py-3 text-center text-base font-extrabold transition-colors disabled:cursor-default motion-reduce:transition-none ${FOCUS} ${
                        isRight
                          ? "border-emerald-500 bg-emerald-50 text-emerald-900 dark:bg-emerald-400/10 dark:text-emerald-200"
                          : isWrong
                          ? "border-rose-500 bg-rose-50 text-rose-900 dark:bg-rose-400/10 dark:text-rose-200"
                          : "border-stone-200 text-slate-800 hover:border-[#0D9488] dark:border-white/15 dark:text-slate-100"
                      }`}
                    >
                      <span lang={/[\u0600-\u06FF]/.test(opt) ? "ar" : undefined}>{opt}</span>
                      {isRight && (
                        <span className="inline-flex items-center gap-1 text-xs font-bold">
                          <CheckCircle2 aria-hidden="true" className="h-4 w-4" /> Right answer
                        </span>
                      )}
                      {isWrong && (
                        <span className="inline-flex items-center gap-1 text-xs font-bold">
                          <XCircle aria-hidden="true" className="h-4 w-4" /> Your answer
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {answered && (
                <div
                  role="status"
                  className={`space-y-3 rounded-2xl border p-4 text-[15px] leading-relaxed animate-in fade-in duration-300 motion-reduce:animate-none ${
                    picked === q.correct
                      ? "border-emerald-300 bg-emerald-50 text-emerald-950 dark:border-emerald-400/30 dark:bg-emerald-400/10 dark:text-emerald-100"
                      : "border-rose-300 bg-rose-50 text-rose-950 dark:border-rose-400/30 dark:bg-rose-400/10 dark:text-rose-100"
                  }`}
                >
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
              <Trophy aria-hidden="true" className="mx-auto h-12 w-12 text-amber-500" />
              <p className="text-5xl font-black text-[#0D4F4F] dark:text-teal-300">
                {score}/{questions.length}
              </p>
              <p className="text-lg font-extrabold">
                {score === questions.length
                  ? "Perfect! You are a Madd master."
                  : score >= Math.ceil(questions.length * 0.7)
                  ? "Great work! A little more practice and it is perfect."
                  : "Good start! Revisit the matrix and the beat meter, then try again."}
              </p>
              <p className={`text-sm ${MUTED}`}>You have {stars} stars in total.</p>
              <div className="flex flex-wrap items-center justify-center gap-3">
                <button type="button" onClick={() => startGame(gameMode)} className={BTN_PRIMARY}>
                  <RotateCcw aria-hidden="true" className="h-4 w-4" /> Try again
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