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
  Sparkles,
  Star,
  Trophy,
  Volume2,
  XCircle,
  Zap,
} from "lucide-react";
import { useLesson } from "../shared/LessonContext";
import { BeatMeter, SlideDeck, TeacherCorner, VoiceNotice, speakArabic } from "../shared/Lessontoolkit";
import type { BeatPair, Slide } from "../shared/LessonToolkit";

/* -------------------------------------------------------------------------- */
/*  Types and styling                                                         */
/* -------------------------------------------------------------------------- */

type MainTab = "learn" | "chart" | "reading" | "games";
type HarakaType = "fatha" | "kasra" | "damma";
type QuizMode = "identify_haraka" | "sound_detective" | "word_reading";
type GameModeId = "menu" | QuizMode | "final_test";

const FOCUS =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600 dark:focus-visible:outline-teal-300";
const CARD = "border border-stone-200 bg-white dark:border-white/10 dark:bg-[#111827]";
const MUTED = "text-slate-600 dark:text-slate-300";
const BTN_PRIMARY = `inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[#0D4F4F] px-5 text-sm font-bold text-white hover:bg-[#093D33] dark:bg-teal-400 dark:text-slate-950 dark:hover:bg-teal-300 ${FOCUS}`;
const BTN_OUTLINE = `inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-[#0D4F4F]/30 px-5 text-sm font-bold text-[#0D4F4F] hover:bg-[#0D4F4F]/5 dark:border-white/20 dark:text-teal-200 dark:hover:bg-white/5 ${FOCUS}`;

// Consistent color identity across the curriculum:
// Orange = Fatha (Matches Alif Madd), Violet = Kasra (Matches Ya Madd), Emerald = Damma (Matches Waw Madd)
const TONES: Record<
  HarakaType,
  { text: string; chip: string; bar: string; border: string; tint: string; grad: string; tile: string }
> = {
  fatha: {
    text: "text-orange-700 dark:text-orange-300",
    chip: "bg-orange-600 text-white",
    bar: "bg-orange-500",
    border: "border-orange-200 dark:border-orange-400/30",
    tint: "bg-orange-50 dark:bg-orange-400/10",
    grad: "from-orange-500 to-amber-500",
    tile: "border-orange-200 bg-orange-50 text-orange-700 hover:bg-orange-100 dark:border-orange-400/30 dark:bg-orange-400/10 dark:text-orange-300 dark:hover:bg-orange-400/20",
  },
  kasra: {
    text: "text-violet-700 dark:text-violet-300",
    chip: "bg-violet-600 text-white",
    bar: "bg-violet-500",
    border: "border-violet-200 dark:border-violet-400/30",
    tint: "bg-violet-50 dark:bg-violet-400/10",
    grad: "from-violet-500 to-purple-500",
    tile: "border-violet-200 bg-violet-50 text-violet-700 hover:bg-violet-100 dark:border-violet-400/30 dark:bg-violet-400/10 dark:text-violet-300 dark:hover:bg-violet-400/20",
  },
  damma: {
    text: "text-emerald-700 dark:text-emerald-300",
    chip: "bg-emerald-600 text-white",
    bar: "bg-emerald-500",
    border: "border-emerald-200 dark:border-emerald-400/30",
    tint: "bg-emerald-50 dark:bg-emerald-400/10",
    grad: "from-emerald-500 to-teal-500",
    tile: "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:border-emerald-400/30 dark:bg-emerald-400/10 dark:text-emerald-300 dark:hover:bg-emerald-400/20",
  },
};

/* -------------------------------------------------------------------------- */
/*  Content                                                                   */
/* -------------------------------------------------------------------------- */

const HARAKAT_CARDS = [
  {
    id: "fatha" as HarakaType,
    badge: "Al-Fatha",
    nameAr: "الفَتْحَةُ",
    symbolAr: "ـَ",
    sampleAr: "بَ",
    soundTitle: "Short “a”",
    position: "Above the letter (فَوْقَ الحَرْف)",
    mouthCue: "Open your mouth vertically",
    description:
      "Fatha is a small diagonal stroke placed right above the letter. Open your jaw cleanly and say a crisp, 1-beat “a” without stretching it.",
    scene: "🌱",
    sceneWord: "زَرَعَ",
    sceneMeaning: "He planted",
    examples: [
      { ar: "بَ", tr: "ba" },
      { ar: "تَ", tr: "ta" },
      { ar: "كَ", tr: "ka" },
      { ar: "قَ", tr: "qa" },
    ],
  },
  {
    id: "kasra" as HarakaType,
    badge: "Al-Kasra",
    nameAr: "الكَسْرَةُ",
    symbolAr: "ـِ",
    sampleAr: "بِ",
    soundTitle: "Short “i”",
    position: "Below the letter (تَحْتَ الحَرْف)",
    mouthCue: "Lower your jaw & smile gently",
    description:
      "Kasra is the only short vowel that sits underneath the letter! Smile gently, lower your bottom jaw, and make a sharp 1-beat “i” sound.",
    scene: "🦌",
    sceneWord: "إِبِلُ",
    sceneMeaning: "Camels",
    examples: [
      { ar: "بِ", tr: "bi" },
      { ar: "تِ", tr: "ti" },
      { ar: "سِ", tr: "si" },
      { ar: "مِ", tr: "mi" },
    ],
  },
  {
    id: "damma" as HarakaType,
    badge: "Ad-Damma",
    nameAr: "الضَّمَّةُ",
    symbolAr: "ـُ",
    sampleAr: "بُ",
    soundTitle: "Short “u”",
    position: "Above the letter (فَوْقَ الحَرْف)",
    mouthCue: "Round your lips forward",
    description:
      "Damma looks like a tiny Waw sitting on top of the letter. Round your lips into a tight circle for a quick, 1-beat “u” sound.",
    scene: "🌹",
    sceneWord: "وُرُودُ",
    sceneMeaning: "Roses",
    examples: [
      { ar: "بُ", tr: "bu" },
      { ar: "تُ", tr: "tu" },
      { ar: "نُ", tr: "nu" },
      { ar: "هُ", tr: "hu" },
    ],
  },
];

// Beat pairs help students contrast a 1-beat short vowel against an accidental 2-beat stretch
const BEAT_PAIRS: BeatPair[] = [
  { id: "fatha", name: "Fatha (ـَ)", short: { ar: "بَ", tr: "ba (1 beat)" }, long: { ar: "بَا", tr: "baa (2 beats)" }, tone: TONES.fatha },
  { id: "kasra", name: "Kasra (ـِ)", short: { ar: "بِ", tr: "bi (1 beat)" }, long: { ar: "بِي", tr: "bii (2 beats)" }, tone: TONES.kasra },
  { id: "damma", name: "Damma (ـُ)", short: { ar: "بُ", tr: "bu (1 beat)" }, long: { ar: "بُو", tr: "buu (2 beats)" }, tone: TONES.damma },
];

// [letter, name, transliteration, heavy?] (heavy = خ ص ض غ ط ق ظ)
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

// 28 letters: Hamza + 27 consonants with Fatha, Kasra, and Damma
const MATRIX = [
  {
    letter: "ء",
    name: "Hamza",
    heavy: false,
    fatha: { ar: "أَ", tr: "’a" },
    kasra: { ar: "إِ", tr: "’i" },
    damma: { ar: "أُ", tr: "’u" },
  },
  ...LETTERS.map(([letter, name, tr, heavy]) => ({
    letter,
    name,
    heavy: Boolean(heavy),
    fatha: { ar: `${letter}َ`, tr: `${tr}a` },
    kasra: { ar: `${letter}ِ`, tr: `${tr}i` },
    damma: { ar: `${letter}ُ`, tr: `${tr}u` },
  })),
];

type ReadWord = {
  id: string;
  arabic: string;
  translit: string;
  meaning: string;
  pattern: string;
  types: HarakaType[];
  scene: string;
  quran?: string;
  breakdown: { ar: string; tr: string; haraka: HarakaType }[];
};

const READ_WORDS: ReadWord[] = [
  {
    id: "kataba",
    arabic: "كَتَبَ",
    translit: "ka-ta-ba",
    meaning: "He wrote",
    pattern: "All Fatha (فَتْحٌ فَقَط)",
    types: ["fatha"],
    scene: "✍️",
    quran: "كَتَبَ اللَّهُ لَأَغْلِبَنَّ · 58:21",
    breakdown: [
      { ar: "كَ", tr: "ka", haraka: "fatha" },
      { ar: "تَ", tr: "ta", haraka: "fatha" },
      { ar: "بَ", tr: "ba", haraka: "fatha" },
    ],
  },
  {
    id: "qaraa",
    arabic: "قَرَأَ",
    translit: "qa-ra-’a",
    meaning: "He read",
    pattern: "All Fatha (فَتْحٌ فَقَط)",
    types: ["fatha"],
    scene: "📖",
    quran: "فَإِذَا قَرَأْنَاهُ فَاتَّبِعْ قُرْآنَهُ · 75:18",
    breakdown: [
      { ar: "قَ", tr: "qa", haraka: "fatha" },
      { ar: "رَ", tr: "ra", haraka: "fatha" },
      { ar: "أَ", tr: "’a", haraka: "fatha" },
    ],
  },
  {
    id: "sami-a",
    arabic: "سَمِعَ",
    translit: "sa-mi-‘a",
    meaning: "He heard",
    pattern: "Fatha + Kasra",
    types: ["fatha", "kasra"],
    scene: "👂",
    quran: "قَدْ سَمِعَ اللَّهُ قَوْلَ · 58:1",
    breakdown: [
      { ar: "سَ", tr: "sa", haraka: "fatha" },
      { ar: "مِ", tr: "mi", haraka: "kasra" },
      { ar: "عَ", tr: "‘a", haraka: "fatha" },
    ],
  },
  {
    id: "ibilu",
    arabic: "إِبِلُ",
    translit: "’i-bi-lu",
    meaning: "Camels",
    pattern: "Kasra + Damma",
    types: ["kasra", "damma"],
    scene: "🐪",
    quran: "أَفَلَا يَنظُرُونَ إِلَى الْإِبِلِ · 88:17",
    breakdown: [
      { ar: "إِ", tr: "’i", haraka: "kasra" },
      { ar: "بِ", tr: "bi", haraka: "kasra" },
      { ar: "لُ", tr: "lu", haraka: "damma" },
    ],
  },
  {
    id: "kutiba",
    arabic: "كُتِبَ",
    translit: "ku-ti-ba",
    meaning: "It was written (All 3 Harakat!)",
    pattern: "Damma + Kasra + Fatha",
    types: ["damma", "kasra", "fatha"],
    scene: "📜",
    quran: "كُتِبَ عَلَيْكُمُ الصِّيَامُ · 2:183",
    breakdown: [
      { ar: "كُ", tr: "ku", haraka: "damma" },
      { ar: "تِ", tr: "ti", haraka: "kasra" },
      { ar: "بَ", tr: "ba", haraka: "fatha" },
    ],
  },
  {
    id: "rusulu",
    arabic: "رُسُلُ",
    translit: "ru-su-lu",
    meaning: "Messengers",
    pattern: "All Damma (ضَمٌّ فَقَط)",
    types: ["damma"],
    scene: "🕊️",
    quran: "وَمَا مُحَمَّدٌ إِلَّا رَسُولٌ · 3:144",
    breakdown: [
      { ar: "رُ", tr: "ru", haraka: "damma" },
      { ar: "سُ", tr: "su", haraka: "damma" },
      { ar: "لُ", tr: "lu", haraka: "damma" },
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
    mode: "identify_haraka",
    prompt: "Which short vowel is a small stroke placed ABOVE the letter?",
    big: "بَ",
    audio: "بَ",
    options: ["Fatha (ـَ)", "Kasra (ـِ)", "Damma (ـُ)"],
    correct: 0,
    why: "Fatha sits above the letter and gives a crisp 1-beat “a” sound.",
  },
  {
    id: 2,
    mode: "identify_haraka",
    prompt: "Which Haraka always sits UNDERNEATH the letter?",
    big: "بِ",
    audio: "بِ",
    options: ["Fatha (ـَ)", "Kasra (ـِ)", "Damma (ـُ)"],
    correct: 1,
    why: "Kasra is the only short vowel placed below the letter, making the “i” sound.",
  },
  {
    id: 3,
    mode: "identify_haraka",
    prompt: "Look at this letter. Which Haraka is on top of it?",
    big: "بُ",
    audio: "بُ",
    options: ["Fatha (ـَ)", "Kasra (ـِ)", "Damma (ـُ)"],
    correct: 2,
    why: "Damma looks like a tiny Waw above the letter and makes the “u” sound.",
  },
  {
    id: 4,
    mode: "sound_detective",
    prompt: "How many beats does a single Haraka (Fatha, Kasra, or Damma) last?",
    big: "بَ • بِ • بُ",
    audio: "بَ بِ بُ",
    options: ["Exactly 1 quick beat", "2 long beats", "3 beats"],
    correct: 0,
    why: "Every short vowel (Haraka) gets exactly 1 crisp beat. Stretching it turns it into a Madd letter!",
  },
  {
    id: 5,
    mode: "sound_detective",
    prompt: "How do you shape your mouth when pronouncing Damma (ـُ)?",
    big: "سُ • نُ • وُ",
    audio: "سُ نُ وُ",
    options: ["Open jaw wide vertically", "Smile gently", "Round your lips in a circle"],
    correct: 2,
    why: "Damma requires rounding your lips forward cleanly for 1 beat.",
  },
  {
    id: 6,
    mode: "sound_detective",
    prompt: "Listen and look: which syllable has the “i” sound?",
    big: "مَ  •  مِ  •  مُ",
    audio: "مِ",
    options: ["مَ (ma)", "مِ (mi)", "مُ (mu)"],
    correct: 1,
    why: "مِ has a Kasra underneath, giving it the short “mi” sound.",
  },
  {
    id: 7,
    mode: "word_reading",
    prompt: "Look at the middle letter (مِ) in سَمِعَ. Which Haraka does it have?",
    big: "سَمِعَ",
    audio: "سَمِعَ",
    scene: "👂",
    options: ["Fatha (ـَ)", "Kasra (ـِ)", "Damma (ـُ)"],
    correct: 1,
    why: "In سَمِعَ (sa-mi-‘a), the Meem has a Kasra underneath it: مِ.",
  },
  {
    id: 8,
    mode: "word_reading",
    prompt: "Read the word كُتِبَ. What is the order of the three Harakat from right to left?",
    big: "كُتِبَ",
    audio: "كُتِبَ",
    scene: "📜",
    options: ["Fatha → Kasra → Damma", "Damma → Kasra → Fatha", "Damma → Fatha → Kasra"],
    correct: 1,
    why: "كُ has Damma (ku), تِ has Kasra (ti), and بَ has Fatha (ba): ku-ti-ba.",
  },
  {
    id: 9,
    mode: "word_reading",
    prompt: "Which of these words has ONLY Damma on every single letter?",
    big: "رُسُلُ",
    audio: "رُسُلُ",
    scene: "🕊️",
    options: ["كَتَبَ", "سَمِعَ", "رُسُلُ"],
    correct: 2,
    why: "رُسُلُ (ru-su-lu) has a Damma on Ra, Seen, and Lam.",
  },
];

const GAME_MENU: { id: Exclude<GameModeId, "menu">; title: string; text: string; icon: string; count: number }[] = [
  { id: "identify_haraka", title: "Spot the Haraka", text: "Identify Fatha, Kasra, and Damma by their shape and position.", icon: "🔎", count: 3 },
  { id: "sound_detective", title: "Sound & Mouth Lab", text: "Master the 1-beat timing and mouth shapes for each vowel.", icon: "🎯", count: 3 },
  { id: "word_reading", title: "3-Letter Word Reader", text: "Break down real Arabic & Quranic words by their vowels.", icon: "📖", count: 3 },
  { id: "final_test", title: "Final Mastery Quiz", text: "All 9 questions in one challenge. Collect all your stars!", icon: "🏆", count: QUESTIONS.length },
];

const TABS = [
  { id: "learn", label: "Learn", icon: BookOpen },
  { id: "chart", label: "Harakat Matrix", icon: Grid },
  { id: "reading", label: "Word Builder", icon: Layers },
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

export default function HarakatLesson() {
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
  const [trioLetterIdx, setTrioLetterIdx] = useState<number>(1); // Default to Ba (ب)
  const [matrixSearch, setMatrixSearch] = useState("");
  const [heavyOnly, setHeavyOnly] = useState(false);
  const [activeKey, setActiveKey] = useState<string | null>(null);

  const [readingFilter, setReadingFilter] = useState<"all" | HarakaType>("all");
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

  const hear = useCallback((text: string, key: string, rate = 0.72) => {
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
        (!q || r.name.toLowerCase().includes(q) || r.letter.includes(q) || r.fatha.tr.toLowerCase().startsWith(q))
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

  const currentTrio = MATRIX[trioLetterIdx] ?? MATRIX[1];

  /* -------------------------------- Actions -------------------------------- */

  // Step-by-step slow spell (1 letter at a time)
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

  // Fast blend: quickly highlights syllables then pronounces the whole joined word
  const blendWord = () => {
    if (!word) return;
    clearTimers();
    let t = 0;
    word.breakdown.forEach((b, i) => {
      timers.current.push(
        window.setTimeout(() => {
          setHot(i);
          speakArabic(b.ar, 0.85);
        }, t)
      );
      t += 480;
    });
    timers.current.push(
      window.setTimeout(() => {
        setHot(-1); // -1 highlights the whole word card
        speakArabic(word.arabic, 0.75);
      }, t + 150)
    );
    timers.current.push(window.setTimeout(() => setHot(null), t + 1100));
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
      if (q.audio) speakArabic(q.audio, 0.72);
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
      title: "Short Vowels (Al-Harakat)",
      node: (
        <div className="space-y-6 text-center">
          <p lang="ar" dir="rtl" className="arabic-font font-bold text-[#A8832F] dark:text-[#E8C56A]" style={{ fontSize: fluid(3, 8, 5) }}>
            الحَرَكَاتُ القَصِيرَةُ الثَّلَاثُ
          </p>
          <h2 className="text-4xl font-black text-[#0D4F4F] dark:text-white sm:text-6xl">
            Fatha · Kasra · Damma
          </h2>
          <p className={`mx-auto max-w-2xl text-xl ${MUTED}`}>
            Harakat bring still Arabic letters to life! Each mark gives a letter a crisp, <strong>1-beat</strong> sound.
          </p>
        </div>
      ),
    },
    {
      id: "positions",
      title: "Where do they sit?",
      node: (
        <div className="grid gap-6 md:grid-cols-3">
          {HARAKAT_CARDS.map((c) => {
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
                  {c.badge} ({c.symbolAr})
                </span>
                <span className={`mt-1 block text-base font-bold ${t.text}`}>{c.mouthCue}</span>
                <span className={`mt-1 block text-sm font-semibold ${MUTED}`}>1 quick beat</span>
              </button>
            );
          })}
        </div>
      ),
    },
    ...HARAKAT_CARDS.map((c) => {
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
              <p className={`mt-2 text-2xl font-extrabold ${t.text}`}>{c.soundTitle} · 1 beat</p>
              <p className="mt-1 text-sm font-bold text-slate-600 dark:text-slate-300">{c.position}</p>
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
      title: "1 Beat vs 2 Beats",
      node: <BeatMeter pairs={BEAT_PAIRS} showHints={hints} />,
    },
    {
      id: "words",
      title: "Blend 3-Letter Words",
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
                {w.breakdown.map((b, i) => {
                  const tone = TONES[b.haraka];
                  return (
                    <li key={i} className={`rounded-xl border px-3 py-2 ${tone.border} ${tone.tint}`}>
                      <span lang="ar" className={`arabic-font block text-2xl font-bold ${tone.text}`}>{b.ar}</span>
                      <BeatDots beats={1} tone={tone.bar} />
                    </li>
                  );
                })}
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
          <li>Point up, down, or circle your lips when I say: <span lang="ar" className="arabic-font font-bold">بَ / بِ / بُ</span>.</li>
          <li>Why must we stop after 1 beat on <span lang="ar" className="arabic-font font-bold">كَتَبَ</span>? What happens if we stretch it?</li>
          <li>Read <span lang="ar" className="arabic-font font-bold">كُتِبَ</span> slowly, then blend it in one breath!</li>
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
            name: "Noor Al-Bayan: Arabic Short Vowels (Al-Harakat - Fatha, Kasra, Damma)",
            description:
              "Interactive Arabic lesson on the three short vowels (Al-Fatha, Al-Kasra, Ad-Damma) with native audio, mouth-shape guides, a 28-letter interactive matrix, step-by-step word blending, and mastery games.",
            educationalLevel: "Beginner",
            learningResourceType: "Interactive lesson",
            teaches: "Reading Arabic letters with Fatha, Kasra, and Damma for 1 crisp beat and blending 3-letter words",
            inLanguage: ["en", "ar"],
            isAccessibleForFree: true,
            provider: { "@type": "EducationalOrganization", name: "Tajwedo Institute" },
          }).replace(/</g, "\\u003c"),
        }}
      />

      <SlideDeck open={presenting} onClose={() => setPresenting(false)} slides={slides} heading="Short Vowels · Al-Harakat" />

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
              onClick={() => speakArabic("بَ بِ بُ", 0.72)}
              aria-label="Hear the three Harakat sounds"
              className={`flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 via-violet-600 to-emerald-600 text-white shadow-md ${FOCUS}`}
            >
              <span lang="ar" dir="rtl" className="arabic-font text-xl font-bold">بَ</span>
            </button>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-extrabold leading-none tracking-tight sm:text-lg">
                  Short Vowels{" "}
                  <span lang="ar" dir="rtl" className="arabic-font font-bold text-[#A8832F] dark:text-[#E8C56A]">
                    (الحَرَكَاتُ الثَّلَاثُ: الفَتْحَةُ وَالكَسْرَةُ وَالضَّمَّةُ)
                  </span>
                </h1>
                <span className="hidden rounded-md bg-orange-100 px-2 py-0.5 text-xs font-bold text-orange-800 dark:bg-orange-400/15 dark:text-orange-300 md:inline-block">
                  Foundation
                </span>
              </div>
              <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                1-beat vowel marks: Fatha (ـَ), Kasra (ـِ), Damma (ـُ)
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
                  id={`harakat-tab-${tab.id}`}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  aria-controls={`harakat-panel-${tab.id}`}
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
          id="harakat-panel-learn"
          aria-labelledby="harakat-tab-learn"
          hidden={activeTab !== "learn"}
          tabIndex={0}
          className={`space-y-14 rounded-2xl ${FOCUS}`}
        >
          <section className="space-y-8">
            <div>
              <p className="inline-flex items-center gap-1.5 text-sm font-bold text-[#0D6B66] dark:text-teal-300">
                <Sparkles aria-hidden="true" className="h-4 w-4" /> The 1-beat foundation of Arabic reading
              </p>
              <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-[#0D4F4F] dark:text-white sm:text-4xl">
                Meet the three short vowels{" "}
                <span lang="ar" dir="rtl" className="arabic-font text-[#A8832F] dark:text-[#E8C56A]">(الحَرَكَاتُ القَصِيرَةُ)</span>
              </h2>
              <p className={`mt-3 max-w-2xl text-base ${MUTED}`}>
                In Arabic, a “Haraka” literally means a <strong>movement</strong>. It tells your mouth how to move—opening up, smiling down, or rounding forward—for <strong>1 quick beat</strong>.
              </p>
            </div>

            <ul className="grid gap-7 lg:grid-cols-3">
              {HARAKAT_CARDS.map((card) => {
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
                          <p className={`text-lg font-extrabold ${t.text}`}>{card.soundTitle} · 1 beat</p>
                          <p className="text-xs font-bold text-slate-500 dark:text-slate-400">
                            {card.mouthCue}
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
                            <Volume2 aria-hidden="true" className="h-3.5 w-3.5" /> Tap to hear ({card.position})
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

          {/* Interactive Trio Sound Switcher */}
          <section className={`space-y-6 rounded-3xl p-6 shadow-sm sm:p-10 ${CARD}`}>
            <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
              <div>
                <p className="inline-flex items-center gap-1.5 text-sm font-bold text-[#0D6B66] dark:text-teal-300">
                  <Zap aria-hidden="true" className="h-4 w-4" /> Instant Vowel Switcher
                </p>
                <h2 className="mt-1 text-2xl font-extrabold text-[#0D4F4F] dark:text-white sm:text-3xl">
                  See how one letter changes sound with each Haraka
                </h2>
              </div>
              <button
                type="button"
                onClick={() =>
                  hear(
                    `${currentTrio.fatha.ar} ${currentTrio.kasra.ar} ${currentTrio.damma.ar}`,
                    `trio-all-${currentTrio.name}`,
                    0.68
                  )
                }
                className={BTN_PRIMARY}
              >
                <Volume2 aria-hidden="true" className="h-4 w-4" /> Hear all 3 in a row
              </button>
            </div>

            <div className="flex flex-wrap gap-2" role="group" aria-label="Pick a letter to test">
              {[1, 2, 4, 8, 11, 13, 20, 23].map((idx) => {
                const item = MATRIX[idx];
                const selected = trioLetterIdx === idx;
                return (
                  <button
                    key={item.name}
                    type="button"
                    onClick={() => setTrioLetterIdx(idx)}
                    aria-pressed={selected}
                    className={`min-h-11 rounded-2xl border px-4 py-2 text-sm font-bold transition ${FOCUS} ${
                      selected
                        ? "border-[#0D4F4F] bg-[#0D4F4F] text-white dark:border-teal-400 dark:bg-teal-400 dark:text-slate-950"
                        : "border-stone-200 bg-stone-50 text-slate-700 hover:bg-stone-100 dark:border-white/10 dark:bg-white/5 dark:text-slate-200"
                    }`}
                  >
                    <span lang="ar" className="arabic-font me-1.5 text-xl">{item.letter}</span>
                    <span>{item.name}</span>
                  </button>
                );
              })}
            </div>

            <div dir="rtl" className="grid gap-4 sm:grid-cols-3">
              {(["fatha", "kasra", "damma"] as const).map((hKey) => {
                const cell = currentTrio[hKey];
                const tone = TONES[hKey];
                const meta = HARAKAT_CARDS.find((c) => c.id === hKey)!;
                const playKey = `trio-${currentTrio.name}-${hKey}`;
                return (
                  <button
                    key={hKey}
                    type="button"
                    onClick={() => hear(cell.ar, playKey)}
                    className={`rounded-3xl border-2 p-6 text-center transition motion-reduce:transition-none ${tone.tile} ${
                      activeKey === playKey ? "scale-[1.03] shadow-lg" : ""
                    } ${FOCUS}`}
                  >
                    <span className={`inline-block rounded-full px-3 py-0.5 text-xs font-extrabold ${tone.chip}`}>
                      {meta.badge}
                    </span>
                    <span lang="ar" className="arabic-font mt-3 block font-bold" style={{ fontSize: fluid(3.5, 9, 5) }}>
                      {cell.ar}
                    </span>
                    {hints && (
                      <span dir="ltr" className="mt-2 block text-base font-extrabold">
                        “{cell.tr}” · 1 beat
                      </span>
                    )}
                    <BeatDots beats={1} tone={tone.bar} />
                  </button>
                );
              })}
            </div>
          </section>

          <section className={`space-y-6 rounded-3xl p-6 shadow-sm sm:p-10 ${CARD}`}>
            <div className="mx-auto max-w-2xl text-center">
              <p className="inline-flex items-center gap-1.5 text-sm font-bold text-[#0D6B66] dark:text-teal-300">
                <Play aria-hidden="true" className="h-4 w-4" /> Rhythm Guard · Don’t over-stretch!
              </p>
              <h2 className="mt-2 text-2xl font-extrabold text-[#0D4F4F] dark:text-white sm:text-3xl">
                Hear why 1 crisp beat must not turn into 2 beats
              </h2>
              <p className={`mt-2 text-sm ${MUTED}`}>
                A common beginner mistake is holding a Haraka too long, accidentally adding an Alif, Ya, or Waw. Practice stopping right on beat 1!
              </p>
            </div>
            <BeatMeter pairs={BEAT_PAIRS} showHints={hints} />
          </section>

          <TeacherCorner
            sections={[
              {
                heading: "Lesson goals",
                items: [
                  "Distinguish Fatha (above), Kasra (below), and Damma (above) visually at a glance.",
                  "Produce a clean 1-beat vowel without dragging it into a 2-beat Madd.",
                  "Keep heavy letters (خ ص ض غ ط ق ظ) resonant with Fatha (e.g., قَ sounds full like 'qaw', while كَ smiles like 'ka').",
                  "Blend 3-letter vocalized verbs and nouns smoothly from right to left.",
                ],
              },
              {
                heading: "A 25-minute plan",
                items: [
                  "4 min: Hand-gesture warm-up—hand flat above head for Fatha, below chin for Kasra, fist forward for Damma.",
                  "6 min: Use the Instant Vowel Switcher and Present Mode to drill بَ بِ بُ across light and heavy letters.",
                  "5 min: Rhythm Guard (Beat Meter) to train students to cut the sound cleanly after 1 beat.",
                  "6 min: Word Builder—use 'Slow Spell' first, then 'Fast Blend' on كَتَبَ, سَمِعَ, and كُتِبَ.",
                  "4 min: Final Mastery Quiz as a fun exit ticket.",
                ],
              },
              {
                heading: "Mistakes to listen for",
                items: [
                  "Tawallud (stretching): turning كَتَبَ into كَاتَابَا by holding the vowel past 1 beat.",
                  "Imalah (tilting Fatha): making light Fatha sound like 'eh' instead of a clean vertical 'a'.",
                  "Weak Kasra: not lowering the jaw enough on بِ, making it sound between Fatha and Kasra.",
                  "Unrounded Damma: pronouncing بُ with flat lips like an English 'uh' instead of a tight circle 'bu'.",
                ],
              },
              {
                heading: "Quick classroom games",
                items: [
                  "Air Signs: Teacher says a syllable (سِ / سُ / سَ) and students point up, down, or circle their fingers.",
                  "Robot vs. Smooth: Read a 3-letter word like a robot (كَ... تَ... بَ), then clap and blend it smoothly (كَتَبَ!).",
                  "Heavy vs. Light Echo: Contrast تَ (ta) with طَ (Ta) and سَ (sa) with صَ (Sa).",
                ],
              },
            ]}
          />
        </div>

        {/* ------------------------------ 2. Matrix ------------------------------ */}
        <div
          role="tabpanel"
          id="harakat-panel-chart"
          aria-labelledby="harakat-tab-chart"
          hidden={activeTab !== "chart"}
          tabIndex={0}
          className={`space-y-8 rounded-2xl ${FOCUS}`}
        >
          <div className="space-y-3">
            <h2 className="text-3xl font-extrabold text-[#0D4F4F] dark:text-white sm:text-4xl">
              28 letters × 3 short vowels
            </h2>
            <p className={`max-w-2xl text-base ${MUTED}`}>
              Tap any tile to hear its crisp 1-beat pronunciation. Notice how heavy letters (
              <span lang="ar" className="arabic-font font-bold">خ ص ض غ ط ق ظ</span>
              ) give Fatha a deep, full-mouth sound compared to light letters.
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
                  {(["fatha", "kasra", "damma"] as const).map((k) => {
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

        {/* ---------------------------- 3. Word Builder ---------------------------- */}
        <div
          role="tabpanel"
          id="harakat-panel-reading"
          aria-labelledby="harakat-tab-reading"
          hidden={activeTab !== "reading"}
          tabIndex={0}
          className={`space-y-6 rounded-2xl ${FOCUS}`}
        >
          <div className="space-y-3">
            <h2 className="text-3xl font-extrabold text-[#0D4F4F] dark:text-white sm:text-4xl">
              Step-by-Step Word Builder
            </h2>
            <p className={`max-w-2xl text-base ${MUTED}`}>
              Tap each colored letter to hear its 1-beat sound. Use <strong>Slow spell</strong> to read letter by letter, then press <strong>Fast blend</strong> to join them into a complete word!
            </p>
          </div>

          <div role="group" aria-label="Filter words by Haraka" className="flex flex-wrap gap-2">
            {(["all", "fatha", "kasra", "damma"] as const).map((f) => (
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
                {f === "all" ? "All words" : f === "fatha" ? "With Fatha (ـَ)" : f === "kasra" ? "With Kasra (ـِ)" : "With Damma (ـُ)"}
              </button>
            ))}
          </div>

          {word && (
            <div className={`overflow-hidden rounded-3xl shadow-sm ${CARD}`}>
              <div className="grid lg:grid-cols-12">
                <div
                  className={`relative flex min-h-[20rem] flex-col justify-between gap-6 bg-gradient-to-br from-slate-900 to-teal-950 p-8 text-white transition-transform lg:col-span-5 sm:p-10 ${
                    hot === -1 ? "ring-4 ring-emerald-400" : ""
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <p className="w-fit rounded-full bg-white/15 px-3 py-1 text-xs font-bold">
                      Word {Math.min(readingIdx, words.length - 1) + 1} of {words.length}
                    </p>
                    <span className="rounded-full bg-emerald-400/20 px-3 py-1 text-xs font-bold text-emerald-200">
                      {word.pattern}
                    </span>
                  </div>

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
                    {word.breakdown.map((b, i) => {
                      const tone = TONES[b.haraka];
                      const activeSyllable = hot === i || activeKey === `syl-${word.id}-${i}`;
                      return (
                        <li key={`${word.id}-${i}`}>
                          <button
                            type="button"
                            onClick={() => hear(b.ar, `syl-${word.id}-${i}`, 0.65)}
                            aria-label={`Hear ${b.tr}, ${b.haraka}, one beat`}
                            className={`w-full rounded-3xl border-2 p-4 text-center transition motion-reduce:transition-none ${FOCUS} ${tone.border} ${tone.tint} ${tone.text} ${
                              activeSyllable ? "scale-105 shadow-lg ring-2 ring-offset-2 ring-teal-500" : ""
                            }`}
                          >
                            <span className="mb-1 inline-block rounded-full bg-white/80 px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-slate-700 dark:bg-slate-900/70 dark:text-slate-200">
                              {b.haraka}
                            </span>
                            <span lang="ar" className="arabic-font block text-4xl font-bold">{b.ar}</span>
                            {hints && <span dir="ltr" className="mt-1 block text-xs font-bold">{b.tr}</span>}
                            <BeatDots beats={1} tone={tone.bar} />
                          </button>
                        </li>
                      );
                    })}
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
                      <button type="button" onClick={slowSpell} className={BTN_OUTLINE}>
                        <Play aria-hidden="true" className="h-4 w-4" /> Slow spell
                      </button>
                      <button type="button" onClick={blendWord} className={BTN_PRIMARY}>
                        <Zap aria-hidden="true" className="h-4 w-4" /> Fast blend
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
          id="harakat-panel-games"
          aria-labelledby="harakat-tab-games"
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
                      onClick={() => speakArabic(q.audio as string, 0.72)}
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
                  ? "Perfect! You mastered all three Harakat."
                  : score >= Math.ceil(questions.length * 0.7)
                  ? "Great work! A little more practice and it is perfect."
                  : "Good start! Revisit the matrix and the word builder, then try again."}
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