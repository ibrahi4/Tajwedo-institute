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
} from "lucide-react";
import { useLesson } from "../shared/LessonContext";
import { BeatMeter, SlideDeck, TeacherCorner, VoiceNotice, speakArabic } from "../shared/Lessontoolkit";
import type { BeatPair, Slide } from "../shared/Lessontoolkit";

/* -------------------------------------------------------------------------- */
/*  Types and styling                                                         */
/* -------------------------------------------------------------------------- */

type MainTab = "learn" | "chart" | "reading" | "games";
type Vowel = "fatha" | "damma" | "kasra";
type QuizMode = "twin_spotter" | "kasra_secret" | "hum_like_a_bee";
type GameModeId = "menu" | QuizMode | "final_test";

const FOCUS =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600 dark:focus-visible:outline-teal-300";
const CARD = "border border-stone-200 bg-white dark:border-white/10 dark:bg-[#111827]";
const MUTED = "text-slate-600 dark:text-slate-300";
const BTN_PRIMARY = `inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[#0D4F4F] px-5 text-sm font-bold text-white hover:bg-[#093D33] dark:bg-teal-400 dark:text-slate-950 dark:hover:bg-teal-300 ${FOCUS}`;
const BTN_OUTLINE = `inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-[#0D4F4F]/30 px-5 text-sm font-bold text-[#0D4F4F] hover:bg-[#0D4F4F]/5 dark:border-white/20 dark:text-teal-200 dark:hover:bg-white/5 ${FOCUS}`;

// Same colour per vowel as the Madd lesson: Fatha = orange, Damma = emerald, Kasra = violet.
const TONES: Record<
  Vowel,
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
  damma: {
    text: "text-emerald-700 dark:text-emerald-300",
    chip: "bg-emerald-600 text-white",
    bar: "bg-emerald-500",
    border: "border-emerald-200 dark:border-emerald-400/30",
    tint: "bg-emerald-50 dark:bg-emerald-400/10",
    grad: "from-emerald-500 to-teal-500",
    tile: "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:border-emerald-400/30 dark:bg-emerald-400/10 dark:text-emerald-300 dark:hover:bg-emerald-400/20",
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
};

/* -------------------------------------------------------------------------- */
/*  Arabic building blocks                                                    */
/* -------------------------------------------------------------------------- */

const SHADDA = "\u0651";
const SUKUN = "\u0652";
const MARK: Record<Vowel, string> = { fatha: "\u064E", damma: "\u064F", kasra: "\u0650" };
const SOUND: Record<Vowel, string> = { fatha: "a", damma: "u", kasra: "i" };

const VOWELS: { id: Vowel; name: string; sign: string }[] = [
  { id: "fatha", name: "Fatha", sign: "ـَ" },
  { id: "damma", name: "Damma", sign: "ـُ" },
  { id: "kasra", name: "Kasra", sign: "ـِ" },
];

const silentTwin = (l: string) => `${l}${SUKUN}`;
const movingTwin = (l: string, v: Vowel) => `${l}${MARK[v]}`;
const twinForm = (l: string, v: Vowel) => `${l}${SHADDA}${MARK[v]}`;
// A Shaddah is only heard after a vowel, so audio uses a short carrier: أَ + letter.
const carrier = (text: string) => `أَ${text}`;

// [letter, name, transliteration]: the 27 letters that can wear a Shaddah (Alif never can).
const LETTERS: [string, string, string][] = [
  ["ب", "Ba", "b"],
  ["ت", "Ta", "t"],
  ["ث", "Tha", "th"],
  ["ج", "Jeem", "j"],
  ["ح", "Haa", "H"],
  ["خ", "Khaa", "kh"],
  ["د", "Dal", "d"],
  ["ذ", "Dhal", "dh"],
  ["ر", "Ra", "r"],
  ["ز", "Zay", "z"],
  ["س", "Seen", "s"],
  ["ش", "Sheen", "sh"],
  ["ص", "Saad", "S"],
  ["ض", "Daad", "D"],
  ["ط", "Taa", "T"],
  ["ظ", "Dhaa", "DH"],
  ["ع", "Ayn", "‘"],
  ["غ", "Ghayn", "gh"],
  ["ف", "Fa", "f"],
  ["ق", "Qaf", "q"],
  ["ك", "Kaf", "k"],
  ["ل", "Lam", "l"],
  ["م", "Meem", "m"],
  ["ن", "Noon", "n"],
  ["ه", "Ha", "h"],
  ["و", "Waw", "w"],
  ["ي", "Ya", "y"],
];

const TR: Record<string, string> = Object.fromEntries(LETTERS.map(([l, , tr]) => [l, tr]));
const isGhunnahLetter = (l: string) => l === "ن" || l === "م";
const spoken = (l: string, v: Vowel) => `a${TR[l]}${TR[l]}${SOUND[v]}`;

const CHART = LETTERS.map(([letter, name]) => ({
  letter,
  name,
  ghunnah: isGhunnahLetter(letter),
  forms: VOWELS.map((v) => ({
    vowel: v.id,
    ar: twinForm(letter, v.id),
    audio: carrier(twinForm(letter, v.id)),
    tr: spoken(letter, v.id).slice(1),
  })),
}));

/* -------------------------------------------------------------------------- */
/*  Content                                                                   */
/* -------------------------------------------------------------------------- */

const ex = (l: string, v: Vowel) => ({ ar: twinForm(l, v), audio: carrier(twinForm(l, v)), tr: spoken(l, v).slice(1) });

const RULES = [
  {
    id: "twins",
    n: 1,
    scene: "👯",
    sceneLabel: "Twins",
    title: "Twin Letter Merger",
    titleAr: "الحَرْفُ المُشَدَّدُ",
    formula: `${silentTwin("ب")} (silent) + ${movingTwin("ب", "fatha")} (moving) = ${twinForm("ب", "fatha")}`,
    text: "A Shaddah (ّ) means the letter is written once but read twice. The first twin is silent (Sukun) and the second twin moves with the vowel. Press the two together and hold the letter a little longer.",
    chip: "bg-teal-600 text-white",
    border: "border-teal-200 dark:border-teal-400/30",
    tint: "bg-teal-50 dark:bg-teal-400/10",
    accent: "text-teal-700 dark:text-teal-300",
    bar: "from-teal-500 to-emerald-500",
    examples: [ex("ب", "fatha"), ex("ر", "damma"), ex("ك", "kasra"), ex("ل", "fatha")],
  },
  {
    id: "kasra",
    n: 2,
    scene: "🔍",
    sceneLabel: "Magnifying glass",
    title: "The Kasra Secret",
    titleAr: "سِرُّ الكَسْرَةِ",
    formula: "Fatha and Damma ride on the Shaddah. Kasra sits below the letter.",
    text: "Look at where the vowel sits. A vowel on top of the Shaddah is a Fatha or a Damma. A vowel below the letter is always a Kasra, even when the letter has a Shaddah.",
    chip: "bg-violet-600 text-white",
    border: "border-violet-200 dark:border-violet-400/30",
    tint: "bg-violet-50 dark:bg-violet-400/10",
    accent: "text-violet-700 dark:text-violet-300",
    bar: "from-violet-500 to-purple-500",
    examples: [ex("ب", "fatha"), ex("ب", "damma"), ex("ب", "kasra"), ex("ت", "kasra")],
  },
  {
    id: "ghunnah",
    n: 3,
    scene: "🐝",
    sceneLabel: "Bee",
    title: "The 2-Beat Nasal Hum",
    titleAr: "الغُنَّةُ",
    formula: `${twinForm("ن", "fatha")} and ${twinForm("م", "fatha")} = hum for 2 beats`,
    text: "Noon (نّ) and Meem (مّ) with a Shaddah make the strongest nasal sound, the Ghunnah. Close your lips for Meem, touch the gums behind your upper teeth for Noon, and hum through your nose like a bee for exactly 2 beats.",
    chip: "bg-amber-500 text-slate-950",
    border: "border-amber-200 dark:border-amber-400/30",
    tint: "bg-amber-50 dark:bg-amber-400/10",
    accent: "text-amber-800 dark:text-amber-300",
    bar: "from-amber-500 to-orange-500",
    examples: [
      { ar: "إِنَّ", audio: "إِنَّ", tr: "inna" },
      { ar: "ثُمَّ", audio: "ثُمَّ", tr: "thumma" },
      { ar: "أَنَّ", audio: "أَنَّ", tr: "anna" },
      { ar: "عَمَّ", audio: "عَمَّ", tr: "‘amma" },
    ],
  },
];

const GHUNNAH_PAIRS: BeatPair[] = [
  {
    id: "noon",
    name: "Noon (ن)",
    short: { ar: "أَنَ", tr: "ana (1 beat)" },
    long: { ar: "أَنَّ", tr: "anna (hum 2 beats)" },
    tone: TONES.damma,
  },
  {
    id: "meem",
    name: "Meem (م)",
    short: { ar: "أَمَ", tr: "ama (1 beat)" },
    long: { ar: "أَمَّ", tr: "amma (hum 2 beats)" },
    tone: TONES.kasra,
  },
];

type Syllable = { ar: string; tr: string; twin?: "silent" | "moving"; ghunnah?: boolean };

type ReadWord = {
  id: string;
  arabic: string;
  translit: string;
  meaning: string;
  kind: "plain" | "ghunnah";
  scene: string;
  quran?: string;
  breakdown: Syllable[];
};

const READ_WORDS: ReadWord[] = [
  {
    id: "rabbi",
    arabic: "رَبِّ",
    translit: "rab-bi",
    meaning: "My Lord",
    kind: "plain",
    scene: "🤲",
    quran: "رَبِّ ٱلْعَٰلَمِينَ · 1:2",
    breakdown: [
      { ar: "رَبْ", tr: "rab", twin: "silent" },
      { ar: "بِ", tr: "bi", twin: "moving" },
    ],
  },
  {
    id: "muallim",
    arabic: "مُعَلِّمُ",
    translit: "mu-‘al-li-mu",
    meaning: "Teacher",
    kind: "plain",
    scene: "👩‍🏫",
    breakdown: [
      { ar: "مُ", tr: "mu" },
      { ar: "عَلْ", tr: "‘al", twin: "silent" },
      { ar: "لِ", tr: "li", twin: "moving" },
      { ar: "مُ", tr: "mu" },
    ],
  },
  {
    id: "sayyara",
    arabic: "سَيَّارَةُ",
    translit: "say-yaa-ra-tu",
    meaning: "Car",
    kind: "plain",
    scene: "🚗",
    breakdown: [
      { ar: "سَيْ", tr: "say", twin: "silent" },
      { ar: "يَا", tr: "yaa", twin: "moving" },
      { ar: "رَ", tr: "ra" },
      { ar: "تُ", tr: "tu" },
    ],
  },
  {
    id: "jannah",
    arabic: "جَنَّةُ",
    translit: "jan-na-tu",
    meaning: "Garden (Paradise)",
    kind: "ghunnah",
    scene: "🌳",
    breakdown: [
      { ar: "جَنْ", tr: "jan", twin: "silent" },
      { ar: "نَ", tr: "na", twin: "moving", ghunnah: true },
      { ar: "تُ", tr: "tu" },
    ],
  },
  {
    id: "ummu",
    arabic: "أُمُّ",
    translit: "um-mu",
    meaning: "Mother",
    kind: "ghunnah",
    scene: "👩",
    breakdown: [
      { ar: "أُمْ", tr: "um", twin: "silent" },
      { ar: "مُ", tr: "mu", twin: "moving", ghunnah: true },
    ],
  },
  {
    id: "naas",
    arabic: "ٱلنَّاسُ",
    translit: "an-naa-su",
    meaning: "People",
    kind: "ghunnah",
    scene: "👨‍👩‍👧‍👦",
    quran: "مِنَ ٱلْجِنَّةِ وَٱلنَّاسِ · 114:6",
    breakdown: [
      { ar: "ٱنْ", tr: "an", twin: "silent" },
      { ar: "نَا", tr: "naa", twin: "moving", ghunnah: true },
      { ar: "سُ", tr: "su" },
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
    mode: "twin_spotter",
    prompt: "What does a Shaddah (ّ) tell you?",
    big: twinForm("ب", "fatha"),
    audio: carrier(twinForm("ب", "fatha")),
    options: ["The letter is doubled: a silent twin, then a moving twin", "Stretch the vowel for 2 beats", "Skip this letter"],
    correct: 0,
    why: "A Shaddah means the letter is written once but read twice.",
  },
  {
    id: 2,
    mode: "twin_spotter",
    prompt: "This letter is the same as which pair?",
    big: twinForm("ب", "fatha"),
    audio: carrier(twinForm("ب", "fatha")),
    options: [
      `Silent ${silentTwin("ب")} + moving ${movingTwin("ب", "fatha")}`,
      `Moving ${movingTwin("ب", "fatha")} + silent ${silentTwin("ب")}`,
      "Two moving letters",
    ],
    correct: 0,
    why: "The first twin is silent (Sukun) and the second twin carries the vowel.",
  },
  {
    id: 3,
    mode: "twin_spotter",
    prompt: "Which word has a Shaddah?",
    scene: "🔎",
    options: ["كِتَابُ", "رَبِّ", "قَمَرُ"],
    correct: 1,
    why: "رَبِّ has a Shaddah on the Ba: rab-bi.",
  },
  {
    id: 4,
    mode: "kasra_secret",
    prompt: "Look at the doubled Ba in this word. Which vowel does it carry?",
    big: "رَبِّ",
    audio: "رَبِّ",
    options: ["Fatha", "Damma", "Kasra"],
    correct: 2,
    why: "The vowel sits below the letter, so it is a Kasra.",
  },
  {
    id: 5,
    mode: "kasra_secret",
    prompt: "Where does a Kasra sit on a letter that has a Shaddah?",
    options: ["On top of the Shaddah", "Below the letter", "Inside the letter"],
    correct: 1,
    why: "Fatha and Damma ride on the Shaddah. The Kasra always stays below the letter.",
  },
  {
    id: 6,
    mode: "kasra_secret",
    prompt: "Which vowel does the doubled Lam carry in this word?",
    big: "مُعَلِّمُ",
    audio: "مُعَلِّمُ",
    scene: "👩‍🏫",
    options: ["Damma", "Kasra", "Fatha"],
    correct: 1,
    why: "The Kasra is below the Lam: mu-‘al-li-mu.",
  },
  {
    id: 7,
    mode: "hum_like_a_bee",
    prompt: "Which two letters make the nasal Ghunnah when they carry a Shaddah?",
    scene: "🐝",
    options: ["Noon and Meem", "Ba and Ta", "Lam and Ra"],
    correct: 0,
    why: "Noon (نّ) and Meem (مّ) with a Shaddah always have the Ghunnah.",
  },
  {
    id: 8,
    mode: "hum_like_a_bee",
    prompt: "How long is the Ghunnah on نّ or مّ?",
    big: "إِنَّ",
    audio: "إِنَّ",
    options: ["1 beat", "4 beats", "2 beats"],
    correct: 2,
    why: "The Ghunnah is held for exactly 2 beats.",
  },
  {
    id: 9,
    mode: "hum_like_a_bee",
    prompt: "Which word has NO Ghunnah?",
    scene: "🐝",
    options: ["جَنَّةُ", "رَبِّ", "أُمُّ"],
    correct: 1,
    why: "رَبِّ has its Shaddah on the Ba, not on a Noon or a Meem, so there is no Ghunnah.",
  },
];

const GAME_MENU: { id: Exclude<GameModeId, "menu">; title: string; text: string; icon: string; count: number }[] = [
  { id: "twin_spotter", title: "Twin Spotter", text: "Find the Shaddah and split it into its twins.", icon: "👯", count: 3 },
  { id: "kasra_secret", title: "The Kasra Secret", text: "Where does the vowel sit? Fatha, Damma or Kasra?", icon: "🔍", count: 3 },
  { id: "hum_like_a_bee", title: "Hum Like a Bee", text: "Noon, Meem and the 2-beat nasal hum.", icon: "🐝", count: 3 },
  { id: "final_test", title: "Final Mastery Quiz", text: "All questions in one go. Earn your stars!", icon: "🏆", count: QUESTIONS.length },
];

const TABS = [
  { id: "learn", label: "Learn & Twins", icon: BookOpen },
  { id: "chart", label: "Twin Chart", icon: Grid },
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

export default function ShaddahLesson() {
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
  const [activeKey, setActiveKey] = useState<string | null>(null);

  // Twin lab
  const [labLetter, setLabLetter] = useState("ب");
  const [labVowel, setLabVowel] = useState<Vowel>("fatha");
  const [merged, setMerged] = useState(false);

  // Chart
  const [chartSearch, setChartSearch] = useState("");
  const [ghunnahOnly, setGhunnahOnly] = useState(false);

  // Reading
  const [readingFilter, setReadingFilter] = useState<"all" | "plain" | "ghunnah">("all");
  const [readingIdx, setReadingIdx] = useState(0);
  const [hot, setHot] = useState<number | null>(null);

  // Games
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

  const labTone = TONES[labVowel];
  const labSilent = silentTwin(labLetter);
  const labMoving = movingTwin(labLetter, labVowel);
  const labMerged = twinForm(labLetter, labVowel);

  const filteredChart = useMemo(() => {
    const q = chartSearch.trim().toLowerCase();
    return CHART.filter(
      (r) =>
        (!ghunnahOnly || r.ghunnah) &&
        (!q || r.name.toLowerCase().includes(q) || r.letter.includes(q) || TR[r.letter].toLowerCase().startsWith(q))
    );
  }, [chartSearch, ghunnahOnly]);

  const words = useMemo(
    () => (readingFilter === "all" ? READ_WORDS : READ_WORDS.filter((w) => w.kind === readingFilter)),
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
      t += (b.ghunnah ? 2 : 1) * 800;
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

  const selectTab = (id: MainTab) => {
    setActiveTab(id);
    if (id === "games") startGame("menu");
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

  /* ------------------------------ Teacher deck ------------------------------ */

  const slides: Slide[] = [
    {
      id: "intro",
      title: "The twin letter",
      node: (
        <div className="space-y-6 text-center">
          <p lang="ar" dir="rtl" className="arabic-font font-bold text-[#A8832F] dark:text-[#E8C56A]" style={{ fontSize: fluid(3, 8, 5) }}>
            الشَّدَّةُ
          </p>
          <h2 className="text-4xl font-black text-[#0D4F4F] dark:text-white sm:text-6xl">Shaddah &amp; Ghunnah</h2>
          <p className={`mx-auto max-w-2xl text-xl ${MUTED}`}>
            One written letter, <strong>two twins</strong>. Plus a <strong>2-beat nasal hum</strong> for Noon and Meem.
          </p>
        </div>
      ),
    },
    {
      id: "merger",
      title: "Twin letter merger",
      node: (
        <div className="space-y-6">
          <div dir="ltr" className="flex flex-wrap items-center justify-center gap-5">
            {[
              { ar: silentTwin("ب"), label: "Silent twin", cls: "border-stone-300 dark:border-white/20" },
              { ar: movingTwin("ب", "fatha"), label: "Moving twin", cls: "border-orange-300 dark:border-orange-400/40" },
            ].map((t, i) => (
              <React.Fragment key={t.label}>
                {i === 1 && <span aria-hidden="true" className="text-5xl font-black text-slate-400">+</span>}
                <div className={`rounded-3xl border-2 px-8 py-5 text-center ${t.cls}`}>
                  <span lang="ar" dir="rtl" className="arabic-font block font-bold text-slate-900 dark:text-white" style={{ fontSize: fluid(4, 10, 6.5) }}>
                    {t.ar}
                  </span>
                  <span className="text-lg font-bold">{t.label}</span>
                </div>
              </React.Fragment>
            ))}
            <span aria-hidden="true" className="text-5xl font-black text-slate-400">=</span>
            <div className="rounded-3xl border-2 border-teal-500 bg-teal-50 px-8 py-5 text-center dark:bg-teal-400/10">
              <span lang="ar" dir="rtl" className="arabic-font block font-bold text-teal-800 dark:text-teal-200" style={{ fontSize: fluid(4, 10, 6.5) }}>
                {twinForm("ب", "fatha")}
              </span>
              <span className="text-lg font-bold">One letter, pressed together</span>
            </div>
          </div>
          <p className={`text-center text-xl ${MUTED}`}>Say the silent twin, then the moving twin, then blend them.</p>
        </div>
      ),
    },
    {
      id: "vowels",
      title: "Vowels on a Shaddah",
      node: (
        <div className="grid gap-6 md:grid-cols-3">
          {VOWELS.map((v) => {
            const t = TONES[v.id];
            return (
              <button
                key={v.id}
                type="button"
                onClick={() => hear(carrier(twinForm("ب", v.id)), `slide-${v.id}`)}
                className={`rounded-3xl border-2 p-8 text-center ${t.border} ${t.tint} ${FOCUS}`}
              >
                <span lang="ar" dir="rtl" className={`arabic-font block font-bold ${t.text}`} style={{ fontSize: fluid(4, 10, 6.5) }}>
                  {twinForm("ب", v.id)}
                </span>
                <span className="mt-3 block text-xl font-extrabold text-slate-900 dark:text-white">{v.name}</span>
                <span className={`block text-lg font-semibold ${MUTED}`}>
                  {v.id === "kasra" ? "below the letter" : "on top of the Shaddah"}
                </span>
              </button>
            );
          })}
        </div>
      ),
    },
    {
      id: "kasra",
      title: "The Kasra secret",
      node: (
        <div className="mx-auto max-w-3xl space-y-6 text-center">
          <Scene emoji="🔍" label="Magnifying glass" size="text-7xl" />
          <h2 className="text-3xl font-black text-violet-800 dark:text-violet-300 sm:text-5xl">Look where the vowel sits</h2>
          <p className="text-2xl leading-relaxed text-slate-700 dark:text-slate-200">
            Vowel <strong>below the letter</strong>? It is always a <strong>Kasra</strong>. Fatha and Damma ride on top of the Shaddah.
          </p>
          <p lang="ar" dir="rtl" className="arabic-font font-bold text-slate-900 dark:text-white" style={{ fontSize: fluid(3.5, 9, 5.5) }}>
            رَبِّ
          </p>
        </div>
      ),
    },
    {
      id: "ghunnah",
      title: "The 2-beat hum",
      node: (
        <div className="space-y-8 text-center">
          <Scene emoji="🐝" label="Bee" size="text-7xl" />
          <div className="flex flex-wrap items-center justify-center gap-8">
            {[twinForm("ن", "fatha"), twinForm("م", "fatha")].map((f) => (
              <span key={f} lang="ar" dir="rtl" className="arabic-font block font-bold text-amber-800 dark:text-amber-300" style={{ fontSize: fluid(5, 13, 8) }}>
                {f}
              </span>
            ))}
          </div>
          <p className="mx-auto max-w-2xl text-2xl leading-relaxed text-slate-700 dark:text-slate-200">
            Noon or Meem with a Shaddah: hum through your nose like a bee for exactly <strong>2 beats</strong>.
          </p>
        </div>
      ),
    },
    {
      id: "beats",
      title: "Count the hum",
      node: <BeatMeter pairs={GHUNNAH_PAIRS} showHints={hints} />,
    },
    {
      id: "words",
      title: "Read the words",
      node: (
        <div className="grid gap-6 md:grid-cols-3">
          {[READ_WORDS[0], READ_WORDS[3], READ_WORDS[5]].map((w) => (
            <div key={w.id} className={`rounded-3xl p-6 text-center ${CARD}`}>
              <Scene emoji={w.scene} label={w.meaning} size="text-6xl" />
              <button type="button" onClick={() => hear(w.arabic, `slide-w-${w.id}`)} className={`mt-3 rounded-xl px-2 ${FOCUS}`}>
                <span lang="ar" dir="rtl" className="arabic-font block font-bold text-slate-900 dark:text-white" style={{ fontSize: fluid(3, 8, 4.5) }}>
                  {w.arabic}
                </span>
              </button>
              <ol dir="rtl" className="mt-4 flex flex-wrap justify-center gap-2">
                {w.breakdown.map((b, i) => (
                  <li
                    key={i}
                    className={`rounded-xl border px-3 py-2 ${
                      b.twin === "moving" ? "border-teal-500 bg-teal-50 dark:bg-teal-400/10" : "border-stone-200 dark:border-white/10"
                    }`}
                  >
                    <span lang="ar" className="arabic-font block text-2xl font-bold text-slate-900 dark:text-white">{b.ar}</span>
                    {b.ghunnah && <BeatDots beats={2} tone="bg-amber-500" />}
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
          <li>Split <span lang="ar" className="arabic-font font-bold">{twinForm("ت", "damma")}</span> into its twins.</li>
          <li>Is the vowel in <span lang="ar" className="arabic-font font-bold">رَبِّ</span> a Fatha, Damma or Kasra? How do you know?</li>
          <li>Which of these hums: <span lang="ar" className="arabic-font font-bold">جَنَّةُ</span> or <span lang="ar" className="arabic-font font-bold">رَبِّ</span>?</li>
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
            name: "Noor Al-Bayan Lesson 5: Shaddah & Ghunnah",
            description:
              "Learn the Arabic Shaddah (doubled letter) and the 2-beat Ghunnah on Noon and Meem with a twin-merger lab, beat meter, letter chart, visual reading and games.",
            educationalLevel: "Beginner",
            learningResourceType: "Interactive lesson",
            teaches: "Shaddah (twin letters), the Kasra position rule, and the 2-beat Ghunnah",
            inLanguage: ["en", "ar"],
            isAccessibleForFree: true,
            provider: { "@type": "EducationalOrganization", name: "Tajwedo Institute" },
          }).replace(/</g, "\\u003c"),
        }}
      />

      <SlideDeck open={presenting} onClose={() => setPresenting(false)} slides={slides} heading="Lesson 5 · Shaddah & Ghunnah" />

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
              onClick={() => speakArabic(carrier(twinForm("ب", "fatha")), 0.68)}
              aria-label="Hear a doubled letter"
              className={`flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-600 to-pink-600 text-white shadow-md ${FOCUS}`}
            >
              <span lang="ar" dir="rtl" className="arabic-font text-xl font-bold">{twinForm("ب", "fatha")}</span>
            </button>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-extrabold leading-none tracking-tight sm:text-lg">
                  Shaddah &amp; Ghunnah{" "}
                  <span lang="ar" dir="rtl" className="arabic-font font-bold text-[#A8832F] dark:text-[#E8C56A]">(الشَّدَّة)</span>
                </h1>
                <span className="hidden rounded-md bg-purple-100 px-2 py-0.5 text-xs font-bold text-purple-800 dark:bg-purple-400/15 dark:text-purple-300 md:inline-block">
                  Lesson 5
                </span>
              </div>
              <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                Twin letter merger (ّ) and the 2-beat nasal hum (مّ / نّ)
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
                  id={`shaddah-tab-${tab.id}`}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  aria-controls={`shaddah-panel-${tab.id}`}
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

        {/* ----------------------------- 1. Learn & Twins ----------------------------- */}
        <div
          role="tabpanel"
          id="shaddah-panel-learn"
          aria-labelledby="shaddah-tab-learn"
          hidden={activeTab !== "learn"}
          tabIndex={0}
          className={`space-y-14 rounded-2xl ${FOCUS}`}
        >
          <section className="space-y-4">
            <p className="text-sm font-bold text-[#0D6B66] dark:text-teal-300">Lesson 5 · Twin consonant power</p>
            <h2 className="text-3xl font-extrabold tracking-tight text-[#0D4F4F] dark:text-white sm:text-5xl">
              How Shaddah combines two letters into one
            </h2>
            <p className={`max-w-2xl text-base ${MUTED}`}>
              Build a twin yourself, then meet the three rules that make Shaddah easy.
            </p>
          </section>

          {/* Twin lab */}
          <section aria-labelledby="lab-title" className={`space-y-6 rounded-3xl p-6 shadow-sm sm:p-10 ${CARD}`}>
            <div className="max-w-2xl">
              <p className="inline-flex items-center gap-1.5 text-sm font-bold text-[#0D6B66] dark:text-teal-300">
                <Sparkles aria-hidden="true" className="h-4 w-4" /> Twin merger lab
              </p>
              <h2 id="lab-title" className="mt-2 text-2xl font-extrabold text-[#0D4F4F] dark:text-white sm:text-3xl">
                Pick a letter and a vowel, then merge the twins
              </h2>
              <p className={`mt-1 text-sm ${MUTED}`}>Alif is missing because it can never wear a Shaddah.</p>
            </div>

            <div role="group" aria-label="Pick a letter" className="flex flex-wrap gap-2">
              {LETTERS.map(([l, name]) => (
                <button
                  key={l}
                  type="button"
                  aria-pressed={l === labLetter}
                  aria-label={name}
                  onClick={() => {
                    setLabLetter(l);
                    setMerged(false);
                  }}
                  className={`flex h-11 w-11 items-center justify-center rounded-xl border text-xl font-bold ${FOCUS} ${
                    l === labLetter
                      ? "border-[#0D4F4F] bg-[#0D4F4F] text-white dark:border-teal-400 dark:bg-teal-400 dark:text-slate-950"
                      : "border-stone-300 text-slate-800 hover:bg-stone-100 dark:border-white/20 dark:text-slate-100 dark:hover:bg-white/10"
                  }`}
                >
                  <span lang="ar" className="arabic-font">{l}</span>
                </button>
              ))}
            </div>

            <div role="group" aria-label="Pick a vowel" className="flex flex-wrap gap-2">
              {VOWELS.map((v) => (
                <button
                  key={v.id}
                  type="button"
                  aria-pressed={v.id === labVowel}
                  onClick={() => {
                    setLabVowel(v.id);
                    setMerged(false);
                  }}
                  className={`inline-flex min-h-11 items-center gap-2 rounded-full border px-4 text-sm font-bold ${FOCUS} ${
                    v.id === labVowel
                      ? `${TONES[v.id].border} ${TONES[v.id].tint} ${TONES[v.id].text}`
                      : "border-stone-300 text-slate-700 hover:bg-stone-100 dark:border-white/20 dark:text-slate-200 dark:hover:bg-white/10"
                  }`}
                >
                  <span lang="ar" className="arabic-font text-xl">{v.sign}</span>
                  {v.name}
                </button>
              ))}
            </div>

            <div dir="ltr" className="flex flex-wrap items-stretch justify-center gap-3 sm:gap-5">
              {[
                { ar: labSilent, label: "Twin 1", sub: "silent (Sukun)" },
                { ar: labMoving, label: "Twin 2", sub: "moving (vowel)" },
              ].map((t, i) => (
                <React.Fragment key={t.label}>
                  {i === 1 && <span aria-hidden="true" className="self-center text-4xl font-black text-slate-400">+</span>}
                  <div
                    className={`flex min-w-[8rem] flex-1 flex-col items-center gap-1 rounded-3xl border-2 border-stone-200 px-4 py-5 text-center transition-all duration-500 motion-reduce:transition-none dark:border-white/15 sm:min-w-[10rem] ${
                      merged ? "scale-95 opacity-50" : ""
                    }`}
                  >
                    <span lang="ar" dir="rtl" className="arabic-font font-bold leading-[1.5] text-slate-900 dark:text-white" style={{ fontSize: sampleSize }}>
                      {t.ar}
                    </span>
                    <span className="text-sm font-extrabold">{t.label}</span>
                    <span className={`text-xs font-semibold ${MUTED}`}>{t.sub}</span>
                  </div>
                </React.Fragment>
              ))}
              <span aria-hidden="true" className="self-center text-4xl font-black text-slate-400">=</span>
              <div
                className={`flex min-w-[8rem] flex-1 flex-col items-center gap-1 rounded-3xl border-2 px-4 py-5 text-center transition-all duration-500 motion-reduce:transition-none sm:min-w-[10rem] ${
                  merged
                    ? `scale-105 ${labTone.border} ${labTone.tint}`
                    : "border-dashed border-stone-300 dark:border-white/20"
                }`}
              >
                <span
                  lang="ar"
                  dir="rtl"
                  aria-hidden={!merged}
                  className={`arabic-font font-bold leading-[1.5] ${merged ? labTone.text : "text-slate-300 dark:text-slate-600"}`}
                  style={{ fontSize: sampleSize }}
                >
                  {merged ? labMerged : "؟"}
                </span>
                <span className="text-sm font-extrabold">Merged</span>
                <span className={`text-xs font-semibold ${MUTED}`}>one pressed letter</span>
              </div>
            </div>

            <p className="sr-only" aria-live="polite">
              {merged ? `Merged: ${spoken(labLetter, labVowel)}` : ""}
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <button type="button" onClick={() => setMerged((m) => !m)} className={BTN_PRIMARY}>
                <Sparkles aria-hidden="true" className="h-4 w-4" />
                {merged ? "Split the twins" : "Merge the twins!"}
              </button>
              <button
                type="button"
                onClick={() => hear(carrier(labMerged), "lab", 0.65)}
                className={BTN_OUTLINE}
              >
                <Volume2 aria-hidden="true" className="h-4 w-4" /> Hear it
              </button>
              {hints && (
                <p className={`text-sm font-bold ${MUTED}`}>
                  Sounds like <span className="text-[#0D6B66] dark:text-teal-300">{spoken(labLetter, labVowel)}</span>
                  {isGhunnahLetter(labLetter) && <span className="ms-2 rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-bold text-amber-900 dark:bg-amber-400/15 dark:text-amber-200">🐝 Ghunnah: hum 2 beats</span>}
                </p>
              )}
            </div>
          </section>

          {/* Three rules */}
          <section className="space-y-8">
            <h2 className="text-2xl font-extrabold text-[#0D4F4F] dark:text-white sm:text-3xl">Three rules, one lesson</h2>
            <ul className="grid gap-7 lg:grid-cols-3">
              {RULES.map((rule) => (
                <li key={rule.id}>
                  <article className={`flex h-full flex-col overflow-hidden rounded-3xl shadow-sm ${CARD}`}>
                    <div className={`h-2.5 w-full bg-gradient-to-r ${rule.bar}`} />
                    <div className="flex items-center justify-between gap-3 px-6 pt-5">
                      <h3 className={`rounded-full px-3.5 py-1 text-xs font-extrabold ${rule.chip}`}>Rule {rule.n}</h3>
                      <span lang="ar" dir="rtl" className="arabic-font text-lg font-bold text-slate-600 dark:text-slate-300">
                        {rule.titleAr}
                      </span>
                    </div>
                    <div className={`mx-6 mt-4 flex items-center gap-4 rounded-2xl border p-4 ${rule.border} ${rule.tint}`}>
                      <Scene emoji={rule.scene} label={rule.sceneLabel} />
                      <p className={`text-lg font-extrabold ${rule.accent}`}>{rule.title}</p>
                    </div>
                    <div className="flex flex-1 flex-col gap-4 p-6">
                      <p lang="ar" dir="ltr" className={`rounded-xl border px-3 py-2 text-center text-sm font-bold ${rule.border} ${rule.accent}`}>
                        {rule.formula}
                      </p>
                      <p className={`text-sm leading-relaxed ${MUTED}`}>{rule.text}</p>
                      <ul dir="rtl" className="mt-auto grid grid-cols-4 gap-2">
                        {rule.examples.map((e) => {
                          const key = `${rule.id}-${e.ar}`;
                          return (
                            <li key={key}>
                              <button
                                type="button"
                                onClick={() => hear(e.audio, key)}
                                aria-label={`Hear ${e.tr}`}
                                className={`w-full rounded-2xl border py-2.5 text-center transition motion-reduce:transition-none ${rule.border} ${rule.tint} ${rule.accent} ${
                                  activeKey === key ? "scale-105 shadow-md" : ""
                                } ${FOCUS}`}
                              >
                                <span lang="ar" className="arabic-font block text-2xl font-bold">{e.ar}</span>
                                {hints && <span dir="ltr" className="block text-[11px] font-bold">{e.tr}</span>}
                              </button>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  </article>
                </li>
              ))}
            </ul>
          </section>

          {/* Ghunnah beat meter */}
          <section className={`space-y-6 rounded-3xl p-6 shadow-sm sm:p-10 ${CARD}`}>
            <div className="mx-auto max-w-2xl text-center">
              <p className="inline-flex items-center gap-1.5 text-sm font-bold text-[#0D6B66] dark:text-teal-300">
                <Play aria-hidden="true" className="h-4 w-4" /> Ghunnah beat meter
              </p>
              <h2 className="mt-2 text-2xl font-extrabold text-[#0D4F4F] dark:text-white sm:text-3xl">
                Plain Noon: 1 beat. Noon with Shaddah: hum 2 beats
              </h2>
              <p className={`mt-2 text-sm ${MUTED}`}>Press count and hum along with the clicks, lips closed for Meem.</p>
            </div>
            <BeatMeter pairs={GHUNNAH_PAIRS} showHints={hints} />
          </section>

          <TeacherCorner
            sections={[
              {
                heading: "Lesson goals",
                items: [
                  "Explain that a Shaddah means one written letter is read twice: a silent twin, then a moving twin.",
                  "Find the vowel on a doubled letter: Fatha and Damma on top, Kasra below the letter.",
                  "Hum the Ghunnah on Noon and Meem with a Shaddah for exactly 2 beats.",
                  "Read six words with Shaddah, three of them with Ghunnah.",
                ],
              },
              {
                heading: "A 25-minute plan",
                items: [
                  "3 min: warm up. Read بَ بُ بِ, then ask what happens if the letter is pressed twice.",
                  "6 min: press Present. Use the merger slide, then the Kasra secret.",
                  "6 min: Twin lab. Let the student pick three letters and merge them.",
                  "5 min: Ghunnah beat meter, hum together with the clicks.",
                  "5 min: Visual Reading with Slow read, then the Final Mastery Quiz.",
                ],
              },
              {
                heading: "Mistakes to listen for",
                items: [
                  "Reading the doubled letter only once, so rab-bi becomes ra-bi.",
                  "Putting a full pause between the twins instead of pressing them together.",
                  "Putting the vowel on the first twin. The first twin is always silent.",
                  "A Ghunnah that is too short, too long, or made without the nose.",
                  "Adding a Ghunnah to other doubled letters, like the Ba in رَبِّ.",
                ],
              },
              {
                heading: "Quick activities",
                items: [
                  "Pinch your fingers together as you merge the twins, then open them to split.",
                  "Cover your nose gently: the Ghunnah should stop. Release: the hum returns.",
                  "Shaddah hunt: find doubled letters in Al-Fatihah, like رَبِّ and ٱلرَّحْمَٰنِ.",
                  "Home practice: read مُعَلِّمُ, جَنَّةُ and ٱلنَّاسُ to a parent.",
                ],
              },
            ]}
          />
        </div>

        {/* ------------------------------ 2. Twin chart ------------------------------ */}
        <div
          role="tabpanel"
          id="shaddah-panel-chart"
          aria-labelledby="shaddah-tab-chart"
          hidden={activeTab !== "chart"}
          tabIndex={0}
          className={`space-y-8 rounded-2xl ${FOCUS}`}
        >
          <div className="space-y-3">
            <h2 className="text-3xl font-extrabold text-[#0D4F4F] dark:text-white sm:text-4xl">27 letters × 3 vowels</h2>
            <p className={`max-w-2xl text-base ${MUTED}`}>
              Tap a tile to hear it. Each sound starts with a short “a” so you can hear the doubling. Noon and Meem carry the
              Ghunnah: hum for 2 beats.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <Search aria-hidden="true" className="pointer-events-none absolute start-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="search"
                value={chartSearch}
                onChange={(e) => setChartSearch(e.target.value)}
                placeholder="Search a letter or name"
                aria-label="Search a letter or name"
                className={`min-h-11 w-64 rounded-xl border border-stone-300 bg-white ps-10 pe-4 text-sm font-semibold text-slate-800 outline-none focus:border-[#0D9488] dark:border-white/15 dark:bg-[#111827] dark:text-white ${FOCUS}`}
              />
            </div>
            <button
              type="button"
              aria-pressed={ghunnahOnly}
              onClick={() => setGhunnahOnly((g) => !g)}
              className={`min-h-11 rounded-full border px-4 text-sm font-bold ${FOCUS} ${
                ghunnahOnly
                  ? "border-[#0D4F4F] bg-[#0D4F4F] text-white dark:border-teal-400 dark:bg-teal-400 dark:text-slate-950"
                  : "border-stone-300 text-slate-700 hover:bg-stone-100 dark:border-white/20 dark:text-slate-200 dark:hover:bg-white/10"
              }`}
            >
              Ghunnah letters only
            </button>
            <p className="sr-only" aria-live="polite">{`${filteredChart.length} letters shown`}</p>
          </div>

          <ul className="grid gap-4 md:grid-cols-2">
            {filteredChart.map((row) => (
              <li key={row.name} className={`flex items-center gap-4 rounded-3xl p-4 shadow-sm ${CARD}`}>
                <div className="w-20 shrink-0 text-center">
                  <p lang="ar" className="arabic-font text-4xl font-bold leading-none text-slate-900 dark:text-white">{row.letter}</p>
                  <p className="mt-1 text-xs font-bold text-slate-500 dark:text-slate-400">{row.name}</p>
                  {row.ghunnah && (
                    <span className="mt-1 inline-block rounded-full bg-amber-500 px-2 py-0.5 text-[10px] font-bold text-slate-950">
                      🐝 Ghunnah
                    </span>
                  )}
                </div>
                <div dir="rtl" className="grid flex-1 grid-cols-3 gap-2.5">
                  {row.forms.map((f) => {
                    const key = `${row.name}-${f.vowel}`;
                    return (
                      <button
                        key={f.vowel}
                        type="button"
                        onClick={() => hear(f.audio, key)}
                        aria-label={`Hear ${f.tr}`}
                        className={`rounded-2xl border-2 py-3 text-center transition motion-reduce:transition-none ${TONES[f.vowel].tile} ${
                          activeKey === key ? "scale-105 shadow-md" : ""
                        } ${FOCUS}`}
                      >
                        <span lang="ar" className="arabic-font block text-3xl font-bold leading-tight">{f.ar}</span>
                        {hints && <span dir="ltr" className="block text-[11px] font-bold">{f.tr}</span>}
                      </button>
                    );
                  })}
                </div>
              </li>
            ))}
          </ul>

          {filteredChart.length === 0 && (
            <p className={`rounded-2xl border border-dashed border-stone-300 p-8 text-center dark:border-white/20 ${MUTED}`}>
              No letters match. Clear the search or turn off the Ghunnah filter.
            </p>
          )}
        </div>

        {/* --------------------------- 3. Visual reading --------------------------- */}
        <div
          role="tabpanel"
          id="shaddah-panel-reading"
          aria-labelledby="shaddah-tab-reading"
          hidden={activeTab !== "reading"}
          tabIndex={0}
          className={`space-y-6 rounded-2xl ${FOCUS}`}
        >
          <div className="space-y-3">
            <h2 className="text-3xl font-extrabold text-[#0D4F4F] dark:text-white sm:text-4xl">Visual reading</h2>
            <p className={`max-w-2xl text-base ${MUTED}`}>
              Every Shaddah splits into two syllables: the silent twin closes one, the moving twin opens the next. Tap a
              syllable to hear it, or use Slow read.
            </p>
          </div>

          <div role="group" aria-label="Filter words" className="flex flex-wrap gap-2">
            {(["all", "plain", "ghunnah"] as const).map((f) => (
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
                {f === "all" ? "All words" : f === "plain" ? "Plain Shaddah" : "With Ghunnah 🐝"}
              </button>
            ))}
          </div>

          {word && (
            <div className={`overflow-hidden rounded-3xl shadow-sm ${CARD}`}>
              <div className="grid lg:grid-cols-12">
                <div className="relative flex min-h-[20rem] flex-col justify-between gap-6 bg-gradient-to-br from-slate-900 to-purple-950 p-8 text-white sm:p-10 lg:col-span-5">
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
                    <p lang="ar" dir="rtl" className="arabic-font text-center text-lg text-amber-200">{word.quran}</p>
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
                          aria-label={`Hear ${b.tr}${b.twin ? `, ${b.twin} twin` : ""}${b.ghunnah ? ", hum 2 beats" : ""}`}
                          className={`w-full rounded-3xl border-2 p-4 text-center transition motion-reduce:transition-none ${FOCUS} ${
                            b.twin === "moving"
                              ? "border-teal-500 bg-teal-50 text-teal-900 dark:bg-teal-400/10 dark:text-teal-200"
                              : b.twin === "silent"
                              ? "border-stone-400 bg-stone-50 text-slate-900 dark:border-white/30 dark:bg-white/5 dark:text-white"
                              : "border-stone-200 text-slate-900 dark:border-white/10 dark:text-white"
                          } ${hot === i || activeKey === `syl-${word.id}-${i}` ? "scale-105 shadow-lg" : ""}`}
                        >
                          <span lang="ar" className="arabic-font block text-4xl font-bold">{b.ar}</span>
                          {hints && <span dir="ltr" className="mt-1 block text-xs font-bold">{b.tr}</span>}
                          {b.twin && (
                            <span dir="ltr" className="mt-1 block text-[11px] font-bold opacity-80">
                              {b.twin === "silent" ? "silent twin" : "moving twin"}
                            </span>
                          )}
                          {b.ghunnah && <BeatDots beats={2} tone="bg-amber-500" />}
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
          id="shaddah-panel-games"
          aria-labelledby="shaddah-tab-games"
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
                        <span className="mt-2 block text-xs font-bold text-[#0D6B66] dark:text-teal-300">{g.count} questions</span>
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
                      <span lang={/[\u0600-\u06FF]/.test(opt) && !/[A-Za-z]/.test(opt) ? "ar" : undefined}>{opt}</span>
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
                  ? "Perfect! You are a Shaddah master."
                  : score >= Math.ceil(questions.length * 0.7)
                  ? "Great work! A little more practice and it is perfect."
                  : "Good start! Revisit the twin lab and the beat meter, then try again."}
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