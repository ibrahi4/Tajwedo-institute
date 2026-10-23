"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpen,
  CheckCircle2,
  Eye,
  EyeOff,
  Feather,
  Gamepad2,
  Grid,
  Home,
  Layers,
  Minus,
  PauseCircle,
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
} from "lucide-react";
import { useLesson } from "../shared/LessonContext";
import { BeatMeter, SlideDeck, TeacherCorner, VoiceNotice, speakArabic } from "../shared/Lessontoolkit";
import type { BeatPair, Slide } from "../shared/Lessontoolkit";

/* -------------------------------------------------------------------------- */
/*  Types and styling                                                         */
/* -------------------------------------------------------------------------- */

type MainTab = "learn" | "chart" | "reading" | "games";
type RuleType = "dagger" | "waw_leen" | "ya_leen";
type QuizMode = "leen_vs_madd" | "uthmani_dagger" | "quraysh_lab";
type GameModeId = "menu" | QuizMode | "final_test";

const FOCUS =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600 dark:focus-visible:outline-teal-300";
const CARD = "border border-stone-200 bg-white dark:border-white/10 dark:bg-[#111827]";
const MUTED = "text-slate-600 dark:text-slate-300";
const BTN_PRIMARY = `inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[#0D4F4F] px-5 text-sm font-bold text-white hover:bg-[#093D33] dark:bg-teal-400 dark:text-slate-950 dark:hover:bg-teal-300 ${FOCUS}`;
const BTN_OUTLINE = `inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-[#0D4F4F]/30 px-5 text-sm font-bold text-[#0D4F4F] hover:bg-[#0D4F4F]/5 dark:border-white/20 dark:text-teal-200 dark:hover:bg-white/5 ${FOCUS}`;

// Amber = Dagger Alif (ـٰ), Emerald = Waw Leen (ـَوْ), Violet = Ya Leen (ـَيْ)
const TONES: Record<
  RuleType,
  { text: string; chip: string; bar: string; border: string; tint: string; grad: string; tile: string }
> = {
  dagger: {
    text: "text-amber-700 dark:text-amber-300",
    chip: "bg-amber-600 text-white",
    bar: "bg-amber-500",
    border: "border-amber-200 dark:border-amber-400/30",
    tint: "bg-amber-50 dark:bg-amber-400/10",
    grad: "from-amber-500 to-orange-500",
    tile: "border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100 dark:border-amber-400/30 dark:bg-amber-400/10 dark:text-amber-300 dark:hover:bg-amber-400/20",
  },
  waw_leen: {
    text: "text-emerald-700 dark:text-emerald-300",
    chip: "bg-emerald-600 text-white",
    bar: "bg-emerald-500",
    border: "border-emerald-200 dark:border-emerald-400/30",
    tint: "bg-emerald-50 dark:bg-emerald-400/10",
    grad: "from-emerald-500 to-teal-500",
    tile: "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:border-emerald-400/30 dark:bg-emerald-400/10 dark:text-emerald-300 dark:hover:bg-emerald-400/20",
  },
  ya_leen: {
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

const RULE_CARDS = [
  {
    id: "dagger" as RuleType,
    badge: "Dagger Alif (ـٰ)",
    nameAr: "الأَلِفُ الخَنْجَرِيَّةُ",
    sampleAr: "هَٰذَا",
    soundTitle: "2-Beat Hidden Alif",
    formula: "Fatha (ـَ) + Mini Alif (ـٰ)",
    description:
      "In the Uthmani Mushaf, many common words use a tiny vertical stroke above the letter instead of a full standing Alif. Stretch it for 2 full beats—just like a normal Madd bil-Alif!",
    scene: "✨",
    sceneWord: "ٱلرَّحْمَٰنِ",
    sceneMeaning: "The Most Gracious",
    examples: [
      { ar: "هَٰذَا", tr: "haa-dhaa" },
      { ar: "ذَٰلِكَ", tr: "dhaa-li-ka" },
      { ar: "لَٰكِنَّ", tr: "laa-kin-na" },
      { ar: "مَٰلِكِ", tr: "maa-li-ki" },
    ],
  },
  {
    id: "waw_leen" as RuleType,
    badge: "Waw Al-Leen (ـَوْ)",
    nameAr: "وَاوُ اللِّينِ",
    sampleAr: "خَوْفْ",
    soundTitle: "Soft “aw” Glide",
    formula: "Fatha (ـَ) + Waw Sakinah (وْ)",
    description:
      "When Waw has a Sukun and comes right after a Fatha, it makes a smooth, effortless diphthong like “ow” in “how”. When stopping on the word, stretch it softly for 2, 4, or 6 beats!",
    scene: "🛡️",
    sceneWord: "خَوْفٍ",
    sceneMeaning: "Fear (Surah Quraysh)",
    examples: [
      { ar: "بَوْ", tr: "baw" },
      { ar: "ثَوْبْ", tr: "thawb" },
      { ar: "نَوْمْ", tr: "nawm" },
      { ar: "يَوْمْ", tr: "yawm" },
    ],
  },
  {
    id: "ya_leen" as RuleType,
    badge: "Ya Al-Leen (ـَيْ)",
    nameAr: "يَاءُ اللِّينِ",
    sampleAr: "بَيْتْ",
    soundTitle: "Soft “ay” Glide",
    formula: "Fatha (ـَ) + Ya Sakinah (يْ)",
    description:
      "When Ya has a Sukun and comes right after a Fatha, glide smoothly from “a” to “y” like “ay” in “day”. Never squeeze the tongue—let it flow gently, especially when stopping at the end of a verse.",
    scene: "🕋",
    sceneWord: "بَيْتٍ",
    sceneMeaning: "House / Ka'bah",
    examples: [
      { ar: "بَيْ", tr: "bay" },
      { ar: "صَيْفْ", tr: "sayf" },
      { ar: "عَيْنْ", tr: "‘ayn" },
      { ar: "لَيْلْ", tr: "layl" },
    ],
  },
];

// Contrast pairs: Short/Glide vs. Full Stretch so students hear the difference between Leen and Natural Madd
const BEAT_PAIRS: BeatPair[] = [
  {
    id: "dagger",
    name: "Fatha vs. Dagger Alif (ـٰ)",
    short: { ar: "مَلِكِ", tr: "ma-li-ki (1 beat)" },
    long: { ar: "مَٰلِكِ", tr: "maa-li-ki (2 beats)" },
    tone: TONES.dagger,
  },
  {
    id: "waw_leen",
    name: "Waw Leen (ـَوْ) vs. Waw Madd (ـُو)",
    short: { ar: "بَوْ", tr: "baw (Fatha + ওْ)" },
    long: { ar: "بُو", tr: "buu (Damma + و)" },
    tone: TONES.waw_leen,
  },
  {
    id: "ya_leen",
    name: "Ya Leen (ـَيْ) vs. Ya Madd (ـِي)",
    short: { ar: "بَيْ", tr: "bay (Fatha + يْ)" },
    long: { ar: "بِي", tr: "bii (Kasra + ي)" },
    tone: TONES.ya_leen,
  },
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

// 28 letters: each shown with Dagger Alif (ـَٰ), Waw Leen (ـَوْ), and Ya Leen (ـَيْ)
const MATRIX = [
  {
    letter: "ء",
    name: "Hamza",
    heavy: false,
    dagger: { ar: "ءَٰ", tr: "’aa" },
    waw_leen: { ar: "أَوْ", tr: "’aw" },
    ya_leen: { ar: "أَيْ", tr: "’ay" },
  },
  ...LETTERS.map(([letter, name, tr, heavy]) => ({
    letter,
    name,
    heavy: Boolean(heavy),
    dagger: { ar: `${letter}َٰ`, tr: `${tr}aa` },
    waw_leen: { ar: `${letter}َوْ`, tr: `${tr}aw` },
    ya_leen: { ar: `${letter}َيْ`, tr: `${tr}ay` },
  })),
];

type ReadWord = {
  id: string;
  arabic: string;
  stopping: string;
  translitWasl: string;
  translitWaqf: string;
  meaning: string;
  rule: RuleType;
  formula: string;
  scene: string;
  quran: string;
  note: string;
  breakdown: { ar: string; tr: string; highlight?: RuleType; beatsWasl: number; beatsWaqf: number }[];
};

const READ_WORDS: ReadWord[] = [
  {
    id: "khawf",
    arabic: "خَوْفٍ",
    stopping: "خَوْفْ",
    translitWasl: "khaw-fin",
    translitWaqf: "khawf (stretch 2–4–6)",
    meaning: "Fear",
    rule: "waw_leen",
    formula: "Fatha + Waw Sakinah (ـَوْ)",
    scene: "🛡️",
    quran: "وَءَامَنَهُم مِّنْ خَوْفٍۭ · قريش 4",
    note: "Soft 'aw' glide. When stopping at the end of Surah Quraysh, sukoon lands on Fa, unlocking Madd Al-Leen (2, 4, or 6 beats).",
    breakdown: [
      { ar: "خَوْ", tr: "khaw", highlight: "waw_leen", beatsWasl: 1, beatsWaqf: 2 },
      { ar: "فٍ", tr: "fin → f", beatsWasl: 1, beatsWaqf: 1 },
    ],
  },
  {
    id: "bayt",
    arabic: "بَيْتٍ",
    stopping: "بَيْتْ",
    translitWasl: "bay-tin",
    translitWaqf: "bayt (stretch 2–4–6)",
    meaning: "House (The Ka'bah)",
    rule: "ya_leen",
    formula: "Fatha + Ya Sakinah (ـَيْ)",
    scene: "🕋",
    quran: "فَلْيَعْبُدُوا۟ رَبَّ هَٰذَا ٱلْبَيْتِ · قريش 3",
    note: "Smooth 'ay' glide on بَيْ. When stopping on the Ta, let the Ya glide gently before closing the Ta.",
    breakdown: [
      { ar: "بَيْ", tr: "bay", highlight: "ya_leen", beatsWasl: 1, beatsWaqf: 2 },
      { ar: "تٍ", tr: "tin → t", beatsWasl: 1, beatsWaqf: 1 },
    ],
  },
  {
    id: "quraysh",
    arabic: "قُرَيْشٍ",
    stopping: "قُرَيْشْ",
    translitWasl: "qu-ray-shin",
    translitWaqf: "qu-raysh (stretch 2–4–6)",
    meaning: "Tribe of Quraysh",
    rule: "ya_leen",
    formula: "Fatha + Ya Sakinah (ـَيْ)",
    scene: "🐪",
    quran: "لِإِيلَٰفِ قُرَيْشٍ · قريش 1",
    note: "The signature example of Madd Al-Leen in Juz' Amma! Notice Fatha on Ra followed by Ya Sakinah.",
    breakdown: [
      { ar: "قُ", tr: "qu", beatsWasl: 1, beatsWaqf: 1 },
      { ar: "رَيْ", tr: "ray", highlight: "ya_leen", beatsWasl: 1, beatsWaqf: 2 },
      { ar: "شٍ", tr: "shin → sh", beatsWasl: 1, beatsWaqf: 1 },
    ],
  },
  {
    id: "sayf",
    arabic: "ٱلصَّيْفِ",
    stopping: "ٱلصَّيْفْ",
    translitWasl: "as-say-fi",
    translitWaqf: "as-sayf (stretch 2–4–6)",
    meaning: "The Summer",
    rule: "ya_leen",
    formula: "Fatha + Ya Sakinah (ـَيْ)",
    scene: "☀️",
    quran: "رِحْلَةَ ٱلشِّتَآءِ وَٱلصَّيْفِ · قريش 2",
    note: "Heavy Saad with Fatha glides into a soft Ya Sakinah (صَيْ). Keep the Saad full and the Ya gentle!",
    breakdown: [
      { ar: "ٱلصَّيْ", tr: "as-say", highlight: "ya_leen", beatsWasl: 1, beatsWaqf: 2 },
      { ar: "فِ", tr: "fi → f", beatsWasl: 1, beatsWaqf: 1 },
    ],
  },
  {
    id: "rahman",
    arabic: "ٱلرَّحْمَٰنِ",
    stopping: "ٱلرَّحْمَٰنْ",
    translitWasl: "ar-rah-maa-ni",
    translitWaqf: "ar-rah-maan",
    meaning: "The Most Gracious",
    rule: "dagger",
    formula: "Dagger Alif (ـٰ) = 2-Beat Madd",
    scene: "✨",
    quran: "ٱلرَّحْمَٰنِ ٱلرَّحِيمِ · الفاتحة 3",
    note: "The miniature vertical Alif above Meem (مَٰ) is stretched 2 full beats in continuing recitation.",
    breakdown: [
      { ar: "ٱلرَّحْ", tr: "ar-rah", beatsWasl: 1, beatsWaqf: 1 },
      { ar: "مَٰ", tr: "maa", highlight: "dagger", beatsWasl: 2, beatsWaqf: 2 },
      { ar: "نِ", tr: "ni → n", beatsWasl: 1, beatsWaqf: 1 },
    ],
  },
  {
    id: "haadhaa",
    arabic: "هَٰذَا",
    stopping: "هَٰذَا",
    translitWasl: "haa-dhaa",
    translitWaqf: "haa-dhaa",
    meaning: "This",
    rule: "dagger",
    formula: "Dagger Alif (ـٰ) after Ha",
    scene: "👉",
    quran: "فَلْيَعْبُدُوا۟ رَبَّ هَٰذَا ٱلْبَيْتِ · قريش 3",
    note: "One of the most frequent words in the Quran! Stretch Ha for 2 beats even though no tall Alif is drawn after it.",
    breakdown: [
      { ar: "هَٰ", tr: "haa", highlight: "dagger", beatsWasl: 2, beatsWaqf: 2 },
      { ar: "ذَا", tr: "dhaa", highlight: "dagger", beatsWasl: 2, beatsWaqf: 2 },
    ],
  },
  {
    id: "ibraheem",
    arabic: "إِبْرَٰهِيمَ",
    stopping: "إِبْرَٰهِيمْ",
    translitWasl: "ib-raa-hee-ma",
    translitWaqf: "ib-raa-heem",
    meaning: "Prophet Ibrahim (AS)",
    rule: "dagger",
    formula: "Dagger Alif (ـٰ) after Ra",
    scene: "🌟",
    quran: "سَلَٰمٌ عَلَىٰٓ إِبْرَٰهِيمَ · الصافات 109",
    note: "Uthmani script frequently uses Dagger Alif inside prophetic names like إِبْرَٰهِيمَ, إِسْمَٰعِيلَ, and إِسْحَٰقَ.",
    breakdown: [
      { ar: "إِبْ", tr: "ib", beatsWasl: 1, beatsWaqf: 1 },
      { ar: "رَٰ", tr: "raa", highlight: "dagger", beatsWasl: 2, beatsWaqf: 2 },
      { ar: "هِي", tr: "hee", beatsWasl: 2, beatsWaqf: 2 },
      { ar: "مَ", tr: "ma → m", beatsWasl: 1, beatsWaqf: 1 },
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
    mode: "leen_vs_madd",
    prompt: "What is the exact formula for a Leen (Soft Diphthong) letter?",
    big: "خَوْفْ  •  بَيْتْ",
    audio: "خَوْفْ بَيْتْ",
    options: [
      "Fatha + Waw Sakinah (ـَوْ) or Ya Sakinah (ـَيْ)",
      "Damma + Waw or Kasra + Ya",
      "Any letter with a Shaddah",
    ],
    correct: 0,
    why: "Leen occurs ONLY when Waw Sakinah or Ya Sakinah is preceded by a Fatha (ـَوْ / ـَيْ).",
  },
  {
    id: 2,
    mode: "leen_vs_madd",
    prompt: "Which of these two syllables is a Waw Al-Leen (soft glide)?",
    big: "بُو  •  بَوْ",
    audio: "بَوْ",
    options: ["بُو (Damma + Waw)", "بَوْ (Fatha + Waw Sakinah)", "Both are the same"],
    correct: 1,
    why: "بَوْ has a Fatha before Waw Sakinah, creating the soft 'baw' Leen glide. بُو is a Natural Madd.",
  },
  {
    id: 3,
    mode: "leen_vs_madd",
    prompt: "Which of these two syllables is a Ya Al-Leen (soft glide)?",
    big: "بِي  •  بَيْ",
    audio: "بَيْ",
    options: ["بِي (bii)", "بَيْ (bay)", "Neither"],
    correct: 1,
    why: "بَيْ has a Fatha before Ya Sakinah ('bay'), whereas بِي has a Kasra before Ya ('bii').",
  },
  {
    id: 4,
    mode: "uthmani_dagger",
    prompt: "How many beats do you stretch a Dagger Alif (الأَلِف الخَنْجَرِيَّة ـٰ) like in هَٰذَا?",
    big: "هَٰذَا",
    audio: "هَٰذَا",
    scene: "👉",
    options: ["Silent (0 beats)", "1 short beat", "2 full beats, just like a regular Alif Madd"],
    correct: 2,
    why: "A miniature Dagger Alif (ـٰ) is pronounced identically to a full standing Alif Madd for 2 beats.",
  },
  {
    id: 5,
    mode: "uthmani_dagger",
    prompt: "Which letter in ٱلرَّحْمَٰنِ carries the 2-beat Dagger Alif?",
    big: "ٱلرَّحْمَٰنِ",
    audio: "ٱلرَّحْمَٰنِ",
    scene: "✨",
    options: ["The Ra (رَّ)", "The Meem (مَٰ)", "The Noon (نِ)"],
    correct: 1,
    why: "The tiny vertical stroke sits right above the Meem (مَٰ), stretching it into 'maa'.",
  },
  {
    id: 6,
    mode: "uthmani_dagger",
    prompt: "In إِبْرَٰهِيمَ, how should you read the syllable رَٰ?",
    big: "إِبْرَٰهِيمَ",
    audio: "إِبْرَٰهِيمَ",
    scene: "🌟",
    options: ["Short 'ra' (1 beat)", "Stretched 'raa' (2 beats)", "With a Damma 'ruu'"],
    correct: 1,
    why: "The Dagger Alif above Ra (رَٰ) stretches the Fatha for 2 full beats: 'ib-raa-hee-ma'.",
  },
  {
    id: 7,
    mode: "quraysh_lab",
    prompt: "Surah Quraysh is famous for which Tajweed feature at the end of its verses?",
    big: "قُرَيْشٍ • ٱلصَّيْفِ • ٱلْبَيْتِ • خَوْفٍ",
    audio: "قُرَيْشْ الصَّيْفْ البَيْتْ خَوْفْ",
    scene: "🕋",
    options: ["Madd Al-Leen when stopping", "Noon Shaddah only", "Qalqalah on every letter"],
    correct: 0,
    why: "All four verses of Surah Quraysh end with a Leen letter (ـَيْ or ـَوْ) before the final consonant!",
  },
  {
    id: 8,
    mode: "quraysh_lab",
    prompt: "When you STOP on خَوْفٍ (making it خَوْفْ), how many beats can you stretch the Waw Al-Leen?",
    big: "خَوْفٍ ⬅ خَوْفْ",
    audio: "خَوْفْ",
    scene: "🛡️",
    options: ["2, 4, or 6 beats (Madd Al-Leen)", "Zero beats", "Only 1 beat"],
    correct: 0,
    why: "Stopping puts a temporary Sukun on the final letter, unlocking Madd Al-Leen for 2, 4, or 6 beats.",
  },
  {
    id: 9,
    mode: "quraysh_lab",
    prompt: "Look closely at this phrase from Surah Quraysh. It contains BOTH rules from today's lesson! Which ones?",
    big: "هَٰذَا ٱلْبَيْتِ",
    audio: "هَٰذَا الْبَيْتْ",
    scene: "🕋",
    options: [
      "Dagger Alif in هَٰذَا + Ya Leen in ٱلْبَيْتِ",
      "Two Waw Leen letters",
      "Only short Harakat",
    ],
    correct: 0,
    why: "هَٰذَا has the Dagger Alif after Ha, and ٱلْبَيْتِ has Ya Al-Leen (بَيْ)!",
  },
];

const GAME_MENU: { id: Exclude<GameModeId, "menu">; title: string; text: string; icon: string; count: number }[] = [
  {
    id: "leen_vs_madd",
    title: "Leen vs. Natural Madd",
    text: "Tell a soft diphthong glide (ـَوْ / ـَيْ) apart from a regular Madd (ـُو / ـِي).",
    icon: "🪶",
    count: 3,
  },
  {
    id: "uthmani_dagger",
    title: "Dagger Alif Detective",
    text: "Spot the miniature Uthmani Alif (ـٰ) inside common Quranic words.",
    icon: "✨",
    count: 3,
  },
  {
    id: "quraysh_lab",
    title: "Surah Quraysh Challenge",
    text: "Master stopping (Waqf) and continuing (Wasl) on the verses of Surah Quraysh.",
    icon: "🕋",
    count: 3,
  },
  {
    id: "final_test",
    title: "Final Mastery Quiz",
    text: "All 9 questions in one run. Earn your golden stars!",
    icon: "🏆",
    count: QUESTIONS.length,
  },
];

const TABS = [
  { id: "learn", label: "Learn", icon: BookOpen },
  { id: "chart", label: "Leen & Dagger Matrix", icon: Grid },
  { id: "reading", label: "Surah Quraysh & Uthmani Lab", icon: Layers },
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

export default function MaddLeenLesson() {
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
  const [waqfMode, setWaqfMode] = useState<boolean>(true); // True = Stopping (shows full Leen stretch)
  const [matrixSearch, setMatrixSearch] = useState("");
  const [heavyOnly, setHeavyOnly] = useState(false);
  const [activeKey, setActiveKey] = useState<string | null>(null);

  const [readingFilter, setReadingFilter] = useState<"all" | RuleType>("all");
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
        (!q || r.name.toLowerCase().includes(q) || r.letter.includes(q) || r.dagger.tr.toLowerCase().startsWith(q))
    );
  }, [matrixSearch, heavyOnly]);

  const words = useMemo(
    () => (readingFilter === "all" ? READ_WORDS : READ_WORDS.filter((w) => w.rule === readingFilter)),
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
      const beats = waqfMode ? b.beatsWaqf : b.beatsWasl;
      timers.current.push(
        window.setTimeout(() => {
          setHot(i);
          speakArabic(b.ar, 0.6);
        }, t)
      );
      t += beats * 780;
    });
    timers.current.push(
      window.setTimeout(() => {
        setHot(-1);
        speakArabic(waqfMode ? word.stopping : word.arabic, 0.68);
      }, t + 120)
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
      title: "Dagger Alif & Madd Al-Leen",
      node: (
        <div className="space-y-6 text-center">
          <p lang="ar" dir="rtl" className="arabic-font font-bold text-[#A8832F] dark:text-[#E8C56A]" style={{ fontSize: fluid(3, 8, 5) }}>
            الأَلِفُ الخَنْجَرِيَّةُ وَحَرْفَا اللِّينِ
          </p>
          <h2 className="text-4xl font-black text-[#0D4F4F] dark:text-white sm:text-6xl">
            Dagger Alif &amp; Soft Glides
          </h2>
          <p className={`mx-auto max-w-2xl text-xl ${MUTED}`}>
            Master the hidden 2-beat Uthmani Alif (<strong>ـٰ</strong>) and the two effortless glides of Surah Quraysh (<strong>ـَوْ</strong> and <strong>ـَيْ</strong>).
          </p>
        </div>
      ),
    },
    {
      id: "formula",
      title: "The Three Golden Formulas",
      node: (
        <div className="grid gap-6 md:grid-cols-3">
          {RULE_CARDS.map((c) => {
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
                  {c.formula}
                </span>
                <span className={`mt-1 block text-lg font-semibold ${MUTED}`}>{c.soundTitle}</span>
              </button>
            );
          })}
        </div>
      ),
    },
    ...RULE_CARDS.map((c) => {
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
              <p className={`mt-2 text-2xl font-extrabold ${t.text}`}>{c.soundTitle}</p>
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
      id: "contrast",
      title: "Leen Glide vs. Natural Madd",
      node: <BeatMeter pairs={BEAT_PAIRS} showHints={hints} />,
    },
    {
      id: "quraysh",
      title: "Surah Quraysh Stopping Lab",
      node: (
        <div className="grid gap-6 md:grid-cols-3">
          {[READ_WORDS[0], READ_WORDS[1], READ_WORDS[4]].map((w) => {
            const tone = TONES[w.rule];
            return (
              <div key={w.id} className={`rounded-3xl p-6 text-center ${CARD}`}>
                <Scene emoji={w.scene} label={w.meaning} size="text-6xl" />
                <button type="button" onClick={() => hear(w.stopping, `slide-w-${w.id}`)} className={`mt-3 rounded-xl px-2 ${FOCUS}`}>
                  <span lang="ar" dir="rtl" className="arabic-font block font-bold text-slate-900 dark:text-white" style={{ fontSize: fluid(3, 8, 4.5) }}>
                    {w.stopping}
                  </span>
                </button>
                <p className={`mt-1 text-xs font-extrabold ${tone.text}`}>{w.formula}</p>
                <ol dir="rtl" className="mt-4 flex justify-center gap-2">
                  {w.breakdown.map((b, i) => (
                    <li
                      key={i}
                      className={`rounded-xl border px-3 py-2 ${
                        b.highlight ? `${TONES[b.highlight].border} ${TONES[b.highlight].tint}` : "border-stone-200 dark:border-white/10"
                      }`}
                    >
                      <span lang="ar" className="arabic-font block text-2xl font-bold text-slate-900 dark:text-white">{b.ar}</span>
                      <BeatDots beats={b.beatsWaqf} tone={b.highlight ? TONES[b.highlight].bar : "bg-slate-400"} />
                    </li>
                  ))}
                </ol>
              </div>
            );
          })}
        </div>
      ),
    },
    {
      id: "check",
      title: "Check for understanding",
      node: (
        <ol className="mx-auto max-w-3xl list-decimal space-y-5 ps-8 text-2xl font-semibold leading-relaxed text-slate-800 dark:text-slate-100">
          <li>What is the difference between <span lang="ar" className="arabic-font font-bold">بُو</span> and <span lang="ar" className="arabic-font font-bold">بَوْ</span>?</li>
          <li>Where is the hidden 2-beat Madd in <span lang="ar" className="arabic-font font-bold">ٱلرَّحْمَٰنِ</span> and <span lang="ar" className="arabic-font font-bold">هَٰذَا</span>?</li>
          <li>How does stopping (Waqf) change the end of <span lang="ar" className="arabic-font font-bold">خَوْفٍ</span> and <span lang="ar" className="arabic-font font-bold">قُرَيْشٍ</span>?</li>
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
            name: "Noor Al-Bayan: Madd Al-Leen (Soft Glides) & Uthmani Dagger Alif",
            description:
              "Master Arabic Leen letters (Waw and Ya Sakinah after Fatha) and the Uthmani Dagger Alif (Al-Alif Al-Khanjariyyah) with Surah Quraysh audio labs, a 28-letter matrix, and interactive quizzes.",
            educationalLevel: "Beginner to Intermediate",
            learningResourceType: "Interactive lesson",
            teaches: "Pronouncing Waw and Ya Al-Leen (ـَوْ / ـَيْ) in Wasl and Waqf, and stretching Dagger Alif (ـٰ) for 2 beats",
            inLanguage: ["en", "ar"],
            isAccessibleForFree: true,
            provider: { "@type": "EducationalOrganization", name: "Tajwedo Institute" },
          }).replace(/</g, "\\u003c"),
        }}
      />

      <SlideDeck open={presenting} onClose={() => setPresenting(false)} slides={slides} heading="Dagger Alif & Madd Al-Leen" />

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
              onClick={() => speakArabic("هَٰذَا خَوْفْ بَيْتْ", 0.68)}
              aria-label="Hear Dagger Alif and Leen examples"
              className={`flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500 via-emerald-600 to-violet-600 text-white shadow-md ${FOCUS}`}
            >
              <span lang="ar" dir="rtl" className="arabic-font text-xl font-bold">بَيْ</span>
            </button>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-extrabold leading-none tracking-tight sm:text-lg">
                  Madd Al-Leen &amp; Dagger Alif{" "}
                  <span lang="ar" dir="rtl" className="arabic-font font-bold text-[#A8832F] dark:text-[#E8C56A]">
                    (حَرْفَا اللِّينِ وَالأَلِفُ الخَنْجَرِيَّةُ)
                  </span>
                </h1>
                <span className="hidden rounded-md bg-teal-100 px-2 py-0.5 text-xs font-bold text-teal-800 dark:bg-teal-400/15 dark:text-teal-300 md:inline-block">
                  Tajweed &amp; Uthmani Script
                </span>
              </div>
              <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                Miniature Alif (ـٰ) &amp; Soft Diphthongs: Fatha + Waw/Ya Sakinah (ـَوْ / ـَيْ)
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
                  id={`leen-tab-${tab.id}`}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  aria-controls={`leen-panel-${tab.id}`}
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
          id="leen-panel-learn"
          aria-labelledby="leen-tab-learn"
          hidden={activeTab !== "learn"}
          tabIndex={0}
          className={`space-y-14 rounded-2xl ${FOCUS}`}
        >
          <section className="space-y-8">
            <div>
              <p className="inline-flex items-center gap-1.5 text-sm font-bold text-[#0D6B66] dark:text-teal-300">
                <Feather aria-hidden="true" className="h-4 w-4" /> Soft Glides &amp; Uthmani Secrets
              </p>
              <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-[#0D4F4F] dark:text-white sm:text-4xl">
                Dagger Alif &amp; The Two Letters of Leen{" "}
                <span lang="ar" dir="rtl" className="arabic-font text-[#A8832F] dark:text-[#E8C56A]">
                  (الأَلِفُ الخَنْجَرِيَّةُ وَحَرْفَا اللِّينِ)
                </span>
              </h2>
              <p className={`mt-3 max-w-2xl text-base ${MUTED}`}>
                “Leen” means <strong>softness and ease</strong>. While a Natural Madd requires a matching vowel (Damma + Waw, Kasra + Ya), a <strong>Leen</strong> glide happens when Waw Sakinah or Ya Sakinah comes after a <strong>Fatha</strong>!
              </p>
            </div>

            <ul className="grid gap-7 lg:grid-cols-3">
              {RULE_CARDS.map((card) => {
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
                          <p className={`text-lg font-extrabold ${t.text}`}>{card.soundTitle}</p>
                          <p className="text-xs font-bold text-slate-500 dark:text-slate-400">
                            {card.formula}
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

          {/* Interactive Waqf vs. Wasl Simulator for Surah Quraysh */}
          <section className={`space-y-6 rounded-3xl p-6 shadow-sm sm:p-10 ${CARD}`}>
            <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
              <div>
                <p className="inline-flex items-center gap-1.5 text-sm font-bold text-[#0D6B66] dark:text-teal-300">
                  <PauseCircle aria-hidden="true" className="h-4 w-4" /> Surah Quraysh Waqf (Stopping) Simulator
                </p>
                <h2 className="mt-1 text-2xl font-extrabold text-[#0D4F4F] dark:text-white sm:text-3xl">
                  Why Madd Al-Leen shines when you stop at the end of a verse
                </h2>
                <p className={`mt-1 max-w-2xl text-sm ${MUTED}`}>
                  When continuing (Wasl), a Leen letter glides quickly in 1 beat. When stopping (Waqf), the final letter becomes Sukun—unlocking a smooth 2, 4, or 6-beat stretch!
                </p>
              </div>

              <div role="group" aria-label="Recitation mode" className="flex rounded-2xl border border-stone-200 bg-stone-100 p-1 dark:border-white/10 dark:bg-white/5">
                <button
                  type="button"
                  aria-pressed={!waqfMode}
                  onClick={() => setWaqfMode(false)}
                  className={`rounded-xl px-4 py-2 text-xs font-extrabold transition ${FOCUS} ${
                    !waqfMode
                      ? "bg-[#0D4F4F] text-white shadow dark:bg-teal-400 dark:text-slate-950"
                      : "text-slate-600 dark:text-slate-300"
                  }`}
                >
                  Continuing (وَصْل)
                </button>
                <button
                  type="button"
                  aria-pressed={waqfMode}
                  onClick={() => setWaqfMode(true)}
                  className={`rounded-xl px-4 py-2 text-xs font-extrabold transition ${FOCUS} ${
                    waqfMode
                      ? "bg-[#0D4F4F] text-white shadow dark:bg-teal-400 dark:text-slate-950"
                      : "text-slate-600 dark:text-slate-300"
                  }`}
                >
                  Stopping (وَقْف · 2–4–6 Beats)
                </button>
              </div>
            </div>

            <div dir="rtl" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {READ_WORDS.slice(0, 4).map((w) => {
                const tone = TONES[w.rule];
                const displayAr = waqfMode ? w.stopping : w.arabic;
                const key = `sim-${w.id}-${waqfMode ? "waqf" : "wasl"}`;
                return (
                  <button
                    key={w.id}
                    type="button"
                    onClick={() => hear(displayAr, key, waqfMode ? 0.62 : 0.75)}
                    className={`rounded-3xl border-2 p-5 text-center transition motion-reduce:transition-none ${tone.tile} ${
                      activeKey === key ? "scale-[1.03] shadow-lg" : ""
                    } ${FOCUS}`}
                  >
                    <span className={`inline-block rounded-full px-3 py-0.5 text-[11px] font-extrabold ${tone.chip}`}>
                      {waqfMode ? "Stop: Stretch 2–4–6" : "Continue: Soft Glide"}
                    </span>
                    <span lang="ar" className="arabic-font mt-3 block font-bold" style={{ fontSize: fluid(2.8, 7, 4) }}>
                      {displayAr}
                    </span>
                    {hints && (
                      <span dir="ltr" className="mt-1 block text-xs font-extrabold">
                        {waqfMode ? w.translitWaqf : w.translitWasl}
                      </span>
                    )}
                    <BeatDots beats={waqfMode ? 4 : 1} tone={tone.bar} />
                  </button>
                );
              })}
            </div>
          </section>

          <section className={`space-y-6 rounded-3xl p-6 shadow-sm sm:p-10 ${CARD}`}>
            <div className="mx-auto max-w-2xl text-center">
              <p className="inline-flex items-center gap-1.5 text-sm font-bold text-[#0D6B66] dark:text-teal-300">
                <Play aria-hidden="true" className="h-4 w-4" /> Ear Training · Contrast Lab
              </p>
              <h2 className="mt-2 text-2xl font-extrabold text-[#0D4F4F] dark:text-white sm:text-3xl">
                Compare Dagger Alif &amp; Leen against Natural Madd
              </h2>
              <p className={`mt-2 text-sm ${MUTED}`}>
                Listen closely to how Fatha + Waw/Ya Sakinah (<span lang="ar" className="arabic-font font-bold">بَوْ / بَيْ</span>) glides differently from Damma + Waw or Kasra + Ya (<span lang="ar" className="arabic-font font-bold">بُو / بِي</span>).
              </p>
            </div>
            <BeatMeter pairs={BEAT_PAIRS} showHints={hints} />
          </section>

          <TeacherCorner
            sections={[
              {
                heading: "Lesson goals",
                items: [
                  "Recognize the miniature Dagger Alif (ـٰ) in Uthmani script and stretch it for 2 full beats.",
                  "Spot the two Leen letters immediately: Waw Sakinah (وْ) or Ya Sakinah (يْ) preceded by a Fatha.",
                  "Distinguish between a Leen diphthong (بَوْ / بَيْ) and a Natural Madd (بُو / بِي).",
                  "Apply Madd Al-Leen (2, 4, or 6 beats) when stopping on the verses of Surah Quraysh.",
                ],
              },
              {
                heading: "A 25-minute plan",
                items: [
                  "4 min: Write بُو vs. بَوْ and بِي vs. بَيْ on the board; ask students what changed on the first letter.",
                  "6 min: Open Present Mode to introduce Dagger Alif (هَٰذَا, ٱلرَّحْمَٰنِ) and the two Leen glides.",
                  "6 min: Use the Surah Quraysh Waqf Simulator to practice reading all 4 verse endings when stopping.",
                  "5 min: Matrix drill—pick heavy vs. light letters (e.g., صَيْ vs. سَيْ) so students keep the Fatha accurate.",
                  "4 min: Run the Final Mastery Quiz.",
                ],
              },
              {
                heading: "Mistakes to listen for",
                items: [
                  "Skipping the Dagger Alif in هَٰذَا, ذَٰلِكَ, or ٱلرَّحْمَٰنِ so it sounds like a 1-beat Fatha.",
                  "Turning Waw Leen (خَوْفْ) into a Damma (خُوفْ) by rounding the lips too early on the first letter.",
                  "Pressing too hard on Ya Leen (بَيْتْ) so it sounds harsh instead of an effortless, soft glide.",
                  "Forgetting to pronounce the final consonant (like the تْ in بَيْتْ or فْ in خَوْفْ) after stretching Madd Al-Leen.",
                ],
              },
              {
                heading: "Quick classroom activities",
                items: [
                  "Dagger Hunt: Open Surah Al-Fatihah and count every miniature Dagger Alif (ٱلرَّحْمَٰنِ, مَٰلِكِ, الصِّرَٰطَ).",
                  "Surah Quraysh Relay: Recite Surah Quraysh together, holding up 2 or 4 fingers on every verse ending.",
                  "Madd or Leen Flash: Call out ثَوْبْ, نُورْ, عَيْنْ, فِيلْ—students raise green for Madd, purple for Leen.",
                ],
              },
            ]}
          />
        </div>

        {/* ------------------------------ 2. Matrix ------------------------------ */}
        <div
          role="tabpanel"
          id="leen-panel-chart"
          aria-labelledby="leen-tab-chart"
          hidden={activeTab !== "chart"}
          tabIndex={0}
          className={`space-y-8 rounded-2xl ${FOCUS}`}
        >
          <div className="space-y-3">
            <h2 className="text-3xl font-extrabold text-[#0D4F4F] dark:text-white sm:text-4xl">
              28 letters × Dagger Alif &amp; Leen Glides
            </h2>
            <p className={`max-w-2xl text-base ${MUTED}`}>
              Tap any tile to hear it. Compare the 2-beat <strong>Dagger Alif (ـَٰ)</strong> with <strong>Waw Al-Leen (ـَوْ)</strong> and <strong>Ya Al-Leen (ـَيْ)</strong> across all 28 letters.
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
                  {(["dagger", "waw_leen", "ya_leen"] as const).map((k) => {
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
          id="leen-panel-reading"
          aria-labelledby="leen-tab-reading"
          hidden={activeTab !== "reading"}
          tabIndex={0}
          className={`space-y-6 rounded-2xl ${FOCUS}`}
        >
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div className="space-y-2">
              <h2 className="text-3xl font-extrabold text-[#0D4F4F] dark:text-white sm:text-4xl">
                Surah Quraysh &amp; Uthmani Lab
              </h2>
              <p className={`max-w-2xl text-base ${MUTED}`}>
                Tap any syllable to hear it. Toggle between <strong>Stopping (Waqf)</strong> and <strong>Continuing (Wasl)</strong> to see how the beat count changes on Madd Al-Leen!
              </p>
            </div>

            <button
              type="button"
              onClick={() => setWaqfMode((w) => !w)}
              aria-pressed={waqfMode}
              className={BTN_OUTLINE}
            >
              <Sparkles aria-hidden="true" className="h-4 w-4" />
              Mode: {waqfMode ? "Stopping (Waqf)" : "Continuing (Wasl)"}
            </button>
          </div>

          <div role="group" aria-label="Filter words by rule" className="flex flex-wrap gap-2">
            {(["all", "waw_leen", "ya_leen", "dagger"] as const).map((f) => (
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
                {f === "all"
                  ? "All Examples (7)"
                  : f === "waw_leen"
                  ? "Waw Al-Leen (ـَوْ)"
                  : f === "ya_leen"
                  ? "Ya Al-Leen (ـَيْ)"
                  : "Dagger Alif (ـٰ)"}
              </button>
            ))}
          </div>

          {word && (
            <div className={`overflow-hidden rounded-3xl shadow-sm ${CARD}`}>
              <div className="grid lg:grid-cols-12">
                <div
                  className={`relative flex min-h-[21rem] flex-col justify-between gap-6 bg-gradient-to-br from-slate-900 to-teal-950 p-8 text-white lg:col-span-5 sm:p-10 ${
                    hot === -1 ? "ring-4 ring-emerald-400" : ""
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="w-fit rounded-full bg-white/15 px-3 py-1 text-xs font-bold">
                      Word {Math.min(readingIdx, words.length - 1) + 1} of {words.length}
                    </p>
                    <span className="rounded-full bg-amber-400/20 px-3 py-1 text-xs font-bold text-amber-200">
                      {word.formula}
                    </span>
                  </div>

                  <div className="text-center">
                    <Scene emoji={word.scene} label={word.meaning} size="text-7xl" />
                    <button
                      type="button"
                      onClick={() => hear(waqfMode ? word.stopping : word.arabic, `word-${word.id}`)}
                      aria-label={`Hear ${waqfMode ? word.translitWaqf : word.translitWasl}`}
                      className="mt-4 rounded-xl px-3 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                    >
                      <span lang="ar" dir="rtl" className="arabic-font block font-bold" style={{ fontSize: fluid(3.2, 9, 5) }}>
                        {waqfMode ? word.stopping : word.arabic}
                      </span>
                    </button>
                    {hints && (
                      <div className="mt-3 space-y-1">
                        <p className="text-xl font-extrabold text-emerald-300">
                          {waqfMode ? word.translitWaqf : word.translitWasl}
                        </p>
                        <p className="text-base font-semibold">“{word.meaning}”</p>
                      </div>
                    )}
                  </div>

                  <p lang="ar" dir="rtl" className="arabic-font text-center text-lg text-amber-200">
                    {word.quran}
                  </p>
                </div>

                <div className="flex flex-col justify-between gap-6 p-6 sm:p-10 lg:col-span-7">
                  <div className="space-y-4">
                    <ol
                      dir="rtl"
                      className="grid gap-3"
                      style={{ gridTemplateColumns: `repeat(${word.breakdown.length}, minmax(0, 1fr))` }}
                    >
                      {word.breakdown.map((b, i) => {
                        const tone = b.highlight ? TONES[b.highlight] : null;
                        const beats = waqfMode ? b.beatsWaqf : b.beatsWasl;
                        return (
                          <li key={`${word.id}-${i}`}>
                            <button
                              type="button"
                              onClick={() => hear(b.ar, `syl-${word.id}-${i}`, 0.6)}
                              aria-label={`Hear ${b.tr}`}
                              className={`w-full rounded-3xl border-2 p-4 text-center transition motion-reduce:transition-none ${FOCUS} ${
                                tone
                                  ? `${tone.border} ${tone.tint} ${tone.text}`
                                  : "border-stone-200 text-slate-900 dark:border-white/10 dark:text-white"
                              } ${hot === i || activeKey === `syl-${word.id}-${i}` ? "scale-105 shadow-lg" : ""}`}
                            >
                              <span lang="ar" className="arabic-font block text-4xl font-bold">{b.ar}</span>
                              {hints && <span dir="ltr" className="mt-1 block text-xs font-bold">{b.tr}</span>}
                              <BeatDots beats={beats} tone={tone ? tone.bar : "bg-slate-400"} />
                            </button>
                          </li>
                        );
                      })}
                    </ol>

                    {hints && (
                      <div className="rounded-2xl border border-stone-200/80 bg-stone-50/80 p-4 text-sm leading-relaxed text-slate-700 dark:border-white/10 dark:bg-white/5 dark:text-slate-200">
                        <strong className="font-extrabold text-[#0D4F4F] dark:text-teal-300">Tajweed Note: </strong>
                        {word.note}
                      </div>
                    )}
                  </div>

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
                      <button
                        type="button"
                        onClick={() => hear(waqfMode ? word.stopping : word.arabic, `word-${word.id}`)}
                        className={BTN_PRIMARY}
                      >
                        <Volume2 aria-hidden="true" className="h-4 w-4" /> Listen ({waqfMode ? "Stop" : "Continue"})
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
          id="leen-panel-games"
          aria-labelledby="leen-tab-games"
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
                  ? "Perfect! You mastered Madd Al-Leen and Dagger Alif."
                  : score >= Math.ceil(questions.length * 0.7)
                  ? "Great work! A little more practice and it is perfect."
                  : "Good start! Revisit the Surah Quraysh lab and the matrix, then try again."}
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