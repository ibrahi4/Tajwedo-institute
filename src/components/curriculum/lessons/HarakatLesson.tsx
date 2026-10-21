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
  ArrowUp,
  ArrowDown,
  AlertTriangle,
  SlidersHorizontal,
  Layers
} from "lucide-react";
import { useLesson } from "../shared/LessonContext";

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

type MainTab = "learn" | "chart" | "reading" | "games";
type VowelType = "fatha" | "damma" | "kasra";
type ReadingFilter = "fatha" | "damma" | "kasra" | "mixed";
type GameModeId = "menu" | "name_mark" | "sound_match" | "word_meaning" | "say_right" | "final_test";

interface VowelCardData {
  id: VowelType;
  badge: string;
  nameAr: string;
  sampleAr: string;
  soundTitle: string;
  soundExample: string;
  placement: string;
  mouthTip: string;
  mechanicsDetail: string;
  colorHex: string;
  topBarClass: string;
  badgeClass: string;
  accentText: string;
  softBgLight: string;
  softBgDark: string;
  pillBorder: string;
  miniLetters: { ar: string; tr: string }[];
}

interface SoundRow {
  letter: string;
  name: string;
  fatha: { ar: string; tr: string };
  damma: { ar: string; tr: string };
  kasra: { ar: string; tr: string };
}

interface ReadingWordItem {
  id: string;
  arabic: string;
  translit: string;
  meaning: string;
  category: ReadingFilter;
  illustrationType: "camel" | "lion" | "pen" | "books" | "rose" | "girl" | "book" | "drank" | "wrote";
  syllables: { ar: string; tr: string; vowel: VowelType }[];
}

interface GameQuestion {
  id: number;
  mode: Exclude<GameModeId, "menu" | "final_test">;
  prompt: string;
  bigDisplay?: string;
  audioText?: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

// ============================================================================
// NATIVE ARABIC SPEECH HELPER
// ============================================================================

const playSound = (text: string, rate = 0.75) => {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  try {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "ar-SA";
    utterance.rate = rate;
    utterance.pitch = 1.0;

    const voices = window.speechSynthesis.getVoices();
    const arVoice = voices.find((v) => v.lang.includes("ar-SA") || v.lang.includes("ar"));
    if (arVoice) utterance.voice = arVoice;

    window.speechSynthesis.speak(utterance);
  } catch {}
};

// ============================================================================
// SATURATED, EYE-FRIENDLY COLOR & CURRICULUM DATA
// ============================================================================

const VOWEL_CARDS: VowelCardData[] = [
  {
    id: "fatha",
    badge: "Fatha",
    nameAr: "الفَتْحَة",
    sampleAr: "بَ",
    soundTitle: 'Short "a"',
    soundExample: 'as in "cat" or "up"',
    placement: "Diagonal stroke placed ABOVE the letter",
    mouthTip: 'Open your mouth vertically. Say a crisp, short "a".',
    mechanicsDetail: "Jaw drops slightly downward for 1 quick beat while tongue rests flat.",
    colorHex: "#FF5A1F",
    topBarClass: "bg-gradient-to-r from-[#FF5A1F] to-[#FF8A4C]",
    badgeClass: "bg-[#FF5A1F] text-white shadow-sm shadow-orange-500/30",
    accentText: "text-[#FF5A1F] dark:text-[#FF7A45]",
    softBgLight: "bg-[#FFF8F5] hover:bg-[#FFF1EB]",
    softBgDark: "bg-[#181824] hover:bg-[#1F1E2E]",
    pillBorder: "border-[#FFD8C7] dark:border-[#3D2622]",
    miniLetters: [
      { ar: "أَ", tr: "a" },
      { ar: "بَ", tr: "ba" },
      { ar: "تَ", tr: "ta" },
      { ar: "جَ", tr: "ja" },
    ],
  },
  {
    id: "damma",
    badge: "Damma",
    nameAr: "الضَّمَّة",
    sampleAr: "بُ",
    soundTitle: 'Short "u"',
    soundExample: 'as in "put" or "book"',
    placement: "Small curl loop placed ABOVE the letter",
    mouthTip: 'Round your lips firmly into a circle. Say a short "u".',
    mechanicsDetail: "Push lips forward into a tight O-shape for 1 quick beat.",
    colorHex: "#00A86B",
    topBarClass: "bg-gradient-to-r from-[#00A86B] to-[#10B981]",
    badgeClass: "bg-[#00A86B] text-white shadow-sm shadow-emerald-500/30",
    accentText: "text-[#00A86B] dark:text-[#34D399]",
    softBgLight: "bg-[#F3FCF8] hover:bg-[#E6F8F0]",
    softBgDark: "bg-[#131F24] hover:bg-[#17282E]",
    pillBorder: "border-[#BCEFD8] dark:border-[#1E3B35]",
    miniLetters: [
      { ar: "أُ", tr: "u" },
      { ar: "بُ", tr: "bu" },
      { ar: "تُ", tr: "tu" },
      { ar: "جُ", tr: "ju" },
    ],
  },
  {
    id: "kasra",
    badge: "Kasra",
    nameAr: "الكَسْرَة",
    sampleAr: "بِ",
    soundTitle: 'Short "i"',
    soundExample: 'as in "sit" or "pin"',
    placement: "Diagonal stroke placed BELOW the letter",
    mouthTip: 'Smile gently and pull lips wide. Say a short "i".',
    mechanicsDetail: "Lower jaw drops slightly while lip corners stretch horizontally.",
    colorHex: "#7C3AED",
    topBarClass: "bg-gradient-to-r from-[#7C3AED] to-[#A855F7]",
    badgeClass: "bg-[#7C3AED] text-white shadow-sm shadow-violet-500/30",
    accentText: "text-[#7C3AED] dark:text-[#A78BFA]",
    softBgLight: "bg-[#F9F6FF] hover:bg-[#F2ECFF]",
    softBgDark: "bg-[#19162B] hover:bg-[#221D3A]",
    pillBorder: "border-[#E2D4FF] dark:border-[#342654]",
    miniLetters: [
      { ar: "إِ", tr: "i" },
      { ar: "بِ", tr: "bi" },
      { ar: "تِ", tr: "ti" },
      { ar: "جِ", tr: "ji" },
    ],
  },
];

const SOUND_CHART_28: SoundRow[] = [
  { letter: "أ", name: "Alif", fatha: { ar: "أَ", tr: "a" }, damma: { ar: "أُ", tr: "u" }, kasra: { ar: "إِ", tr: "i" } },
  { letter: "ب", name: "Ba", fatha: { ar: "بَ", tr: "ba" }, damma: { ar: "بُ", tr: "bu" }, kasra: { ar: "بِ", tr: "bi" } },
  { letter: "ت", name: "Ta", fatha: { ar: "تَ", tr: "ta" }, damma: { ar: "تُ", tr: "tu" }, kasra: { ar: "تِ", tr: "ti" } },
  { letter: "ث", name: "Tha", fatha: { ar: "ثَ", tr: "tha" }, damma: { ar: "ثُ", tr: "thu" }, kasra: { ar: "ثِ", tr: "thi" } },
  { letter: "ج", name: "Jeem", fatha: { ar: "جَ", tr: "ja" }, damma: { ar: "جُ", tr: "ju" }, kasra: { ar: "جِ", tr: "ji" } },
  { letter: "ح", name: "Haa", fatha: { ar: "حَ", tr: "ha" }, damma: { ar: "حُ", tr: "hu" }, kasra: { ar: "حِ", tr: "hi" } },
  { letter: "خ", name: "Khaa", fatha: { ar: "خَ", tr: "kha" }, damma: { ar: "خُ", tr: "khu" }, kasra: { ar: "خِ", tr: "khi" } },
  { letter: "د", name: "Dal", fatha: { ar: "دَ", tr: "da" }, damma: { ar: "دُ", tr: "du" }, kasra: { ar: "دِ", tr: "di" } },
  { letter: "ذ", name: "Dhal", fatha: { ar: "ذَ", tr: "dha" }, damma: { ar: "ذُ", tr: "dhu" }, kasra: { ar: "ذِ", tr: "dhi" } },
  { letter: "ر", name: "Ra", fatha: { ar: "رَ", tr: "ra" }, damma: { ar: "رُ", tr: "ru" }, kasra: { ar: "رِ", tr: "ri" } },
  { letter: "ز", name: "Zay", fatha: { ar: "زَ", tr: "za" }, damma: { ar: "زُ", tr: "zu" }, kasra: { ar: "زِ", tr: "zi" } },
  { letter: "س", name: "Seen", fatha: { ar: "سَ", tr: "sa" }, damma: { ar: "سُ", tr: "su" }, kasra: { ar: "سِ", tr: "si" } },
  { letter: "ش", name: "Sheen", fatha: { ar: "شَ", tr: "sha" }, damma: { ar: "شُ", tr: "shu" }, kasra: { ar: "شِ", tr: "shi" } },
  { letter: "ص", name: "Saad", fatha: { ar: "صَ", tr: "sa" }, damma: { ar: "صُ", tr: "su" }, kasra: { ar: "صِ", tr: "si" } },
  { letter: "ض", name: "Daad", fatha: { ar: "ضَ", tr: "da" }, damma: { ar: "ضُ", tr: "du" }, kasra: { ar: "ضِ", tr: "di" } },
  { letter: "ط", name: "Taa", fatha: { ar: "طَ", tr: "ta" }, damma: { ar: "طُ", tr: "tu" }, kasra: { ar: "طِ", tr: "ti" } },
  { letter: "ظ", name: "Dhaa", fatha: { ar: "ظَ", tr: "dha" }, damma: { ar: "ظُ", tr: "dhu" }, kasra: { ar: "ظِ", tr: "dhi" } },
  { letter: "ع", name: "Ayn", fatha: { ar: "عَ", tr: "’a" }, damma: { ar: "عُ", tr: "’u" }, kasra: { ar: "عِ", tr: "’i" } },
  { letter: "غ", name: "Ghayn", fatha: { ar: "غَ", tr: "gha" }, damma: { ar: "غُ", tr: "ghu" }, kasra: { ar: "غِ", tr: "ghi" } },
  { letter: "ف", name: "Fa", fatha: { ar: "فَ", tr: "fa" }, damma: { ar: "فُ", tr: "fu" }, kasra: { ar: "فِ", tr: "fi" } },
  { letter: "ق", name: "Qaf", fatha: { ar: "قَ", tr: "qa" }, damma: { ar: "قُ", tr: "qu" }, kasra: { ar: "قِ", tr: "qi" } },
  { letter: "ك", name: "Kaf", fatha: { ar: "كَ", tr: "ka" }, damma: { ar: "كُ", tr: "ku" }, kasra: { ar: "كِ", tr: "ki" } },
  { letter: "ل", name: "Lam", fatha: { ar: "لَ", tr: "la" }, damma: { ar: "لُ", tr: "lu" }, kasra: { ar: "لِ", tr: "li" } },
  { letter: "م", name: "Meem", fatha: { ar: "مَ", tr: "ma" }, damma: { ar: "مُ", tr: "mu" }, kasra: { ar: "مِ", tr: "mi" } },
  { letter: "ن", name: "Noon", fatha: { ar: "نَ", tr: "na" }, damma: { ar: "نُ", tr: "nu" }, kasra: { ar: "نِ", tr: "ni" } },
  { letter: "هـ", name: "Ha", fatha: { ar: "هَ", tr: "ha" }, damma: { ar: "هُ", tr: "hu" }, kasra: { ar: "هِ", tr: "hi" } },
  { letter: "و", name: "Waw", fatha: { ar: "وَ", tr: "wa" }, damma: { ar: "وُ", tr: "wu" }, kasra: { ar: "وِ", tr: "wi" } },
  { letter: "ي", name: "Ya", fatha: { ar: "يَ", tr: "ya" }, damma: { ar: "يُ", tr: "yu" }, kasra: { ar: "يِ", tr: "yi" } },
];

const READING_WORDS: ReadingWordItem[] = [
  {
    id: "jamal",
    arabic: "جَمَل",
    translit: "ja - ma - l",
    meaning: "Camel",
    category: "fatha",
    illustrationType: "camel",
    syllables: [
      { ar: "جَ", tr: "ja", vowel: "fatha" },
      { ar: "مَ", tr: "ma", vowel: "fatha" },
      { ar: "لَ", tr: "la", vowel: "fatha" },
    ],
  },
  {
    id: "asad",
    arabic: "أَسَد",
    translit: "a - sa - d",
    meaning: "Lion",
    category: "fatha",
    illustrationType: "lion",
    syllables: [
      { ar: "أَ", tr: "a", vowel: "fatha" },
      { ar: "سَ", tr: "sa", vowel: "fatha" },
      { ar: "دَ", tr: "da", vowel: "fatha" },
    ],
  },
  {
    id: "qalam",
    arabic: "قَلَم",
    translit: "qa - la - m",
    meaning: "Pen",
    category: "fatha",
    illustrationType: "pen",
    syllables: [
      { ar: "قَ", tr: "qa", vowel: "fatha" },
      { ar: "لَ", tr: "la", vowel: "fatha" },
      { ar: "مَ", tr: "ma", vowel: "fatha" },
    ],
  },
  {
    id: "kutub",
    arabic: "كُتُب",
    translit: "ku - tu - b",
    meaning: "Books",
    category: "damma",
    illustrationType: "books",
    syllables: [
      { ar: "كُ", tr: "ku", vowel: "damma" },
      { ar: "تُ", tr: "tu", vowel: "damma" },
      { ar: "بُ", tr: "bu", vowel: "damma" },
    ],
  },
  {
    id: "wurud",
    arabic: "وُرُود",
    translit: "wu - ru - d",
    meaning: "Roses",
    category: "damma",
    illustrationType: "rose",
    syllables: [
      { ar: "وُ", tr: "wu", vowel: "damma" },
      { ar: "رُ", tr: "ru", vowel: "damma" },
      { ar: "دُ", tr: "du", vowel: "damma" },
    ],
  },
  {
    id: "bint",
    arabic: "بِنْت",
    translit: "bi - n - t",
    meaning: "Girl",
    category: "kasra",
    illustrationType: "girl",
    syllables: [
      { ar: "بِ", tr: "bi", vowel: "kasra" },
      { ar: "نْ", tr: "n", vowel: "kasra" },
      { ar: "تِ", tr: "ti", vowel: "kasra" },
    ],
  },
  {
    id: "kitab",
    arabic: "كِتَاب",
    translit: "ki - ta - b",
    meaning: "Book",
    category: "kasra",
    illustrationType: "book",
    syllables: [
      { ar: "كِ", tr: "ki", vowel: "kasra" },
      { ar: "تَا", tr: "ta", vowel: "fatha" },
      { ar: "بِ", tr: "bi", vowel: "kasra" },
    ],
  },
  {
    id: "shariba",
    arabic: "شَرِبَ",
    translit: "sha - ri - ba",
    meaning: "He drank",
    category: "mixed",
    illustrationType: "drank",
    syllables: [
      { ar: "شَ", tr: "sha", vowel: "fatha" },
      { ar: "رِ", tr: "ri", vowel: "kasra" },
      { ar: "بَ", tr: "ba", vowel: "fatha" },
    ],
  },
  {
    id: "kutiba",
    arabic: "كُتِبَ",
    translit: "ku - ti - ba",
    meaning: "It was written",
    category: "mixed",
    illustrationType: "wrote",
    syllables: [
      { ar: "كُ", tr: "ku", vowel: "damma" },
      { ar: "تِ", tr: "ti", vowel: "kasra" },
      { ar: "بَ", tr: "ba", vowel: "fatha" },
    ],
  },
];

const GAME_QUESTIONS_POOL: GameQuestion[] = [
  { id: 101, mode: "name_mark", prompt: "Look at the mark above this letter. What is its name?", bigDisplay: "بَ", audioText: "بَ", options: ["Fatha", "Damma", "Kasra"], correctIndex: 0, explanation: "The diagonal line ABOVE the letter is Fatha (short 'a')." },
  { id: 102, mode: "name_mark", prompt: "Which curl-shaped vowel mark sits on top of this letter?", bigDisplay: "سُ", audioText: "سُ", options: ["Fatha", "Damma", "Kasra"], correctIndex: 1, explanation: "The small loop above the letter is Damma (short 'u')." },
  { id: 103, mode: "name_mark", prompt: "Look underneath the letter. What is this mark called?", bigDisplay: "مِ", audioText: "مِ", options: ["Fatha", "Damma", "Kasra"], correctIndex: 2, explanation: "The diagonal stroke BELOW the letter is Kasra (short 'i')." },
  { id: 201, mode: "sound_match", prompt: 'Which Arabic syllable makes the sound "ku"?', audioText: "كُ", options: ["كَ", "كُ", "كِ"], correctIndex: 1, explanation: "كُ has a Damma on top, making the sound 'ku'." },
  { id: 202, mode: "sound_match", prompt: 'Which Arabic syllable makes the sound "shi"?', audioText: "شِ", options: ["شَ", "شُ", "شِ"], correctIndex: 2, explanation: "شِ has a Kasra underneath, making the sound 'shi'." },
  { id: 301, mode: "word_meaning", prompt: "Read this Arabic word. What does it mean in English?", bigDisplay: "جَمَل", audioText: "جَمَل", options: ["Camel", "Books", "Pen"], correctIndex: 0, explanation: "جَمَل (jamal) means Camel." },
  { id: 302, mode: "word_meaning", prompt: "Read this word with three Dammas. What does it mean?", bigDisplay: "كُتُب", audioText: "كُتُب", options: ["Lion", "Books", "Pen"], correctIndex: 1, explanation: "كُتُب (kutub) means Books." },
  { id: 401, mode: "say_right", prompt: "Pick the correct phonetic reading for this word:", bigDisplay: "كُتِبَ", audioText: "كُتِبَ", options: ["ka - ta - ba", "ku - ti - ba", "ku - tu - bu"], correctIndex: 1, explanation: "Kaf has Damma (ku), Ta has Kasra (ti), Ba has Fatha (ba)." },
];

// ============================================================================
// CUSTOM SVG MOUTH & WORD ILLUSTRATIONS (ZERO EMOJIS!)
// ============================================================================

const MouthDiagramSVG: React.FC<{ vowel: VowelType }> = ({ vowel }) => {
  if (vowel === "fatha") {
    return (
      <svg viewBox="0 0 120 76" className="w-24 h-16 shrink-0" aria-label="Fatha open mouth diagram">
        <rect width="120" height="76" rx="14" fill="#FF5A1F" fillOpacity="0.12" />
        <path d="M30 38 C45 14, 75 14, 90 38 C75 64, 45 64, 30 38 Z" fill="#FF8A4C" stroke="#FF5A1F" strokeWidth="2.5" />
        <path d="M38 38 C48 22, 72 22, 82 38 C72 54, 48 54, 38 38 Z" fill="#431407" />
        <path d="M46 27 Q60 31 74 27 L72 32 Q60 35 48 32 Z" fill="#FFFFFF" />
        <path d="M15 20 L15 56 M11 25 L15 18 L19 25 M11 51 L15 58 L19 51" stroke="#FF5A1F" strokeWidth="2" strokeLinecap="round" />
      </svg>
    );
  }
  if (vowel === "damma") {
    return (
      <svg viewBox="0 0 120 76" className="w-24 h-16 shrink-0" aria-label="Damma rounded lips diagram">
        <rect width="120" height="76" rx="14" fill="#00A86B" fillOpacity="0.12" />
        <circle cx="60" cy="38" r="21" fill="#34D399" stroke="#00A86B" strokeWidth="3" />
        <circle cx="60" cy="38" r="9.5" fill="#022C22" />
        <path d="M16 38 L31 38 M26 33 L32 38 L26 43" stroke="#00A86B" strokeWidth="2" strokeLinecap="round" />
        <path d="M104 38 L89 38 M94 33 L88 38 L94 43" stroke="#00A86B" strokeWidth="2" strokeLinecap="round" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 120 76" className="w-24 h-16 shrink-0" aria-label="Kasra smiling lips diagram">
      <rect width="120" height="76" rx="14" fill="#7C3AED" fillOpacity="0.12" />
      <path d="M24 38 C42 26, 78 26, 96 38 C78 56, 42 56, 24 38 Z" fill="#A78BFA" stroke="#7C3AED" strokeWidth="2.5" />
      <path d="M32 38 C46 32, 74 32, 88 38 C74 48, 46 48, 32 38 Z" fill="#2E1065" />
      <path d="M40 37 Q60 41 80 37 L78 42 Q60 45 42 42 Z" fill="#FFFFFF" />
    </svg>
  );
};

const ReadingIllustrationSVG: React.FC<{ type: ReadingWordItem["illustrationType"] }> = ({ type }) => {
  if (type === "camel" || type === "lion") {
    return (
      <svg viewBox="0 0 120 90" className="w-28 h-20 mx-auto">
        <rect width="120" height="90" rx="20" fill="#FF5A1F" fillOpacity="0.1" />
        <circle cx="88" cy="24" r="9" fill="#F59E0B" />
        <path d="M20 72 Q60 58 100 72" stroke="#F59E0B" strokeWidth="3.5" fill="none" strokeLinecap="round" />
        <path d="M38 68 L38 48 Q38 34 50 34 Q58 18 68 34 L76 34 Q82 34 84 22 L90 20 L86 44 L86 68" stroke="#FF5A1F" strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }
  if (type === "books" || type === "book") {
    return (
      <svg viewBox="0 0 120 90" className="w-28 h-20 mx-auto">
        <rect width="120" height="90" rx="20" fill="#00A86B" fillOpacity="0.1" />
        <rect x="30" y="24" width="60" height="12" rx="4" fill="#00A86B" />
        <rect x="34" y="40" width="56" height="12" rx="4" fill="#0D9488" />
        <rect x="28" y="56" width="62" height="12" rx="4" fill="#7C3AED" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 120 90" className="w-28 h-20 mx-auto">
      <rect width="120" height="90" rx="20" fill="#7C3AED" fillOpacity="0.1" />
      <path d="M38 66 L48 62 L84 26 L74 16 L38 52 Z" fill="#A855F7" stroke="#7C3AED" strokeWidth="2" />
      <path d="M32 72 Q60 76 88 70" stroke="#0D9488" strokeWidth="3" fill="none" strokeLinecap="round" />
    </svg>
  );
};

// ============================================================================
// MAIN HARAKAT LESSON COMPONENT
// ============================================================================

export default function HarakatLesson() {
  const lessonCtx = useLesson();
  const darkMode = lessonCtx?.darkMode ?? false;

  const [englishHints, setEnglishHints] = useState<boolean>(true);
  const [textSizeScale, setTextSizeScale] = useState<number>(1.1);
  const [stars, setStars] = useState<number>(0);

  const [activeTab, setActiveTab] = useState<MainTab>("learn");
  const [slideIdx, setSlideIdx] = useState<number>(0);
  const [morphWordIdx, setMorphWordIdx] = useState<number>(0);

  const [chartSearch, setChartSearch] = useState<string>("");
  const [vowelFilter, setVowelFilter] = useState<"all" | VowelType>("all");
  const [activeSoundKey, setActiveSoundKey] = useState<string | null>(null);

  const [readingFilter, setReadingFilter] = useState<ReadingFilter>("fatha");
  const [readingIdx, setReadingIdx] = useState<number>(0);

  const [gameMode, setGameMode] = useState<GameModeId>("menu");
  const [qIndex, setQIndex] = useState<number>(0);
  const [pickedOption, setPickedOption] = useState<number | null>(null);
  const [qAnswered, setQAnswered] = useState<boolean>(false);
  const [sessionScore, setSessionScore] = useState<number>(0);
  const [gameFinished, setGameFinished] = useState<boolean>(false);

  const filteredChartRows = useMemo(() => {
    if (!chartSearch.trim()) return SOUND_CHART_28;
    const q = chartSearch.toLowerCase().trim();
    return SOUND_CHART_28.filter(
      (r) =>
        r.name.toLowerCase().includes(q) ||
        r.letter.includes(q) ||
        r.fatha.tr.toLowerCase().includes(q)
    );
  }, [chartSearch]);

  const filteredReadingWords = useMemo(() => {
    return READING_WORDS.filter((w) => w.category === readingFilter);
  }, [readingFilter]);

  const currentReadingWord = filteredReadingWords[readingIdx] || filteredReadingWords[0];

  const activeGameQuestions = useMemo(() => {
    if (gameMode === "menu") return [];
    if (gameMode === "final_test") return GAME_QUESTIONS_POOL;
    return GAME_QUESTIONS_POOL.filter((q) => q.mode === gameMode);
  }, [gameMode]);

  const currentGameQ = activeGameQuestions[qIndex];

  const triggerAudio = useCallback((text: string, key: string) => {
    setActiveSoundKey(key);
    playSound(text, 0.75);
    setTimeout(() => {
      setActiveSoundKey((prev) => (prev === key ? null : prev));
    }, 500);
  }, []);

  const startGame = (mode: GameModeId) => {
    setGameMode(mode);
    setQIndex(0);
    setPickedOption(null);
    setQAnswered(false);
    setSessionScore(0);
    setGameFinished(false);
  };

  const handleGameOptionPick = (idx: number) => {
    if (qAnswered || !currentGameQ) return;
    setPickedOption(idx);
    setQAnswered(true);
    if (idx === currentGameQ.correctIndex) {
      setSessionScore((prev) => prev + 1);
      setStars((prev) => prev + 1);
      if (currentGameQ.audioText) playSound(currentGameQ.audioText, 0.78);
    }
  };

  const MORPH_SLIDE_DATA = [
    {
      ar: "كَتَبَ",
      tr: "ka - ta - ba",
      meaning: "He wrote (Active Verb)",
      desc: "With three Fathas above the letters, it describes an active past action: He wrote.",
      badgeColor: "bg-[#FF5A1F]",
    },
    {
      ar: "كُتِبَ",
      tr: "ku - ti - ba",
      meaning: "It was written (Passive Verb)",
      desc: "Changing to Damma + Kasra + Fatha shifts the exact same consonants into passive: It was written!",
      badgeColor: "bg-[#7C3AED]",
    },
    {
      ar: "كُتُبُ",
      tr: "ku - tu - bu",
      meaning: "Books (Plural Noun)",
      desc: "Three Dammas transform the action verb into a physical object: Books!",
      badgeColor: "bg-[#00A86B]",
    },
  ];

  return (
    <div
      className={`min-h-screen w-full transition-colors duration-300 font-sans ${
        darkMode ? "bg-[#0B0F19] text-slate-100" : "bg-[#F8FAFC] text-slate-900"
      }`}
    >
      {/* ===================================================================
          UNIFIED SINGLE STUDIO DOCK (REPLACES THE 2 CLUTTERED BARS!)
         =================================================================== */}
      <div
        className={`sticky top-20 z-30 w-full border-b backdrop-blur-xl transition-all ${
          darkMode
            ? "bg-[#0B0F19]/90 border-slate-800/80 shadow-lg shadow-black/20"
            : "bg-white/90 border-slate-200/80 shadow-xs"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3 flex flex-wrap items-center justify-between gap-4">
          {/* Left: Back Link + Lesson Identity Pill */}
          <div className="flex items-center gap-3">
            <Link
              href="/en/curriculum/noor-al-bayan"
              title="Back to Noor Al-Bayan Course"
              className={`p-2.5 rounded-xl border transition flex items-center gap-1.5 text-xs font-bold ${
                darkMode
                  ? "bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800 hover:text-white"
                  : "bg-slate-100/80 border-slate-200/80 text-slate-700 hover:bg-slate-200/70"
              }`}
            >
              <Home className="w-4 h-4 text-[#0D9488]" />
              <span className="hidden sm:inline">Course</span>
            </Link>

            <button
              type="button"
              onClick={() => playSound("بَ بُ بِ", 0.72)}
              className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#0D9488] to-[#059669] text-white flex items-center justify-center shadow-md shadow-teal-500/20 hover:scale-105 transition"
            >
              <span dir="rtl" className="text-2xl font-serif font-bold">
                بَ
              </span>
            </button>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-extrabold tracking-tight leading-none">
                  Short Vowels (الحَرَكَات)
                </h1>
                <span className="hidden md:inline-block px-2 py-0.5 rounded-md text-[11px] font-extrabold uppercase bg-teal-500/15 text-[#0D9488] dark:text-teal-400">
                  Lesson 1
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Fatha, Damma & Kasra
              </p>
            </div>
          </div>

          {/* Center: Segmented Navigation Pills */}
          <nav
            aria-label="Lesson Sections"
            className={`flex items-center p-1.5 rounded-2xl border overflow-x-auto no-scrollbar ${
              darkMode
                ? "bg-slate-900/90 border-slate-800"
                : "bg-slate-100/90 border-slate-200/70"
            }`}
          >
            {[
              { id: "learn", label: "Learn & Slides", icon: BookOpen },
              { id: "chart", label: "Sound Matrix", icon: Grid },
              { id: "reading", label: "Reading Lab", icon: Layers },
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
                      ? "bg-gradient-to-r from-[#0D9488] to-[#059669] text-white shadow-md shadow-teal-600/25"
                      : darkMode
                      ? "text-slate-400 hover:text-white hover:bg-slate-800/60"
                      : "text-slate-600 hover:text-slate-900 hover:bg-white/60"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right: Compact Teacher Controls (Stars, Font Slider, Hints) */}
          <div className="flex items-center gap-2.5">
            {/* Star Counter Badge */}
            <div
              className={`px-3 py-1.5 rounded-xl border flex items-center gap-1.5 text-xs sm:text-sm font-extrabold ${
                darkMode
                  ? "bg-amber-500/10 border-amber-500/30 text-amber-300"
                  : "bg-amber-50 border-amber-200 text-amber-700"
              }`}
            >
              <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
              <span>{stars}</span>
            </div>

            {/* Smooth Font Scale Slider */}
            <div
              className={`hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl border ${
                darkMode
                  ? "bg-slate-900 border-slate-800"
                  : "bg-slate-100/80 border-slate-200/80"
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-[#0D9488]" />
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Size
              </span>
              <input
                type="range"
                min={0.9}
                max={1.4}
                step={0.05}
                value={textSizeScale}
                onChange={(e) => setTextSizeScale(parseFloat(e.target.value))}
                aria-label="Scale Arabic font size"
                className="w-20 h-1.5 bg-teal-500/30 rounded-lg appearance-none cursor-pointer accent-[#0D9488]"
              />
            </div>

            {/* Hints Toggle */}
            <button
              type="button"
              onClick={() => setEnglishHints((prev) => !prev)}
              className={`px-3.5 py-2 rounded-xl border text-xs font-bold inline-flex items-center gap-1.5 transition ${
                englishHints
                  ? "bg-[#0D9488]/15 border-[#0D9488]/40 text-[#0D9488] dark:text-teal-300"
                  : darkMode
                  ? "bg-slate-900 border-slate-800 text-slate-400"
                  : "bg-slate-100 border-slate-200 text-slate-500"
              }`}
            >
              {englishHints ? (
                <Eye className="w-3.5 h-3.5" />
              ) : (
                <EyeOff className="w-3.5 h-3.5" />
              )}
              <span>Hints: {englishHints ? "ON" : "OFF"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* ===================================================================
          MAIN STAGE CONTENT AREA (GENEROUS BREATHING ROOM & SATURATED COLORS)
         =================================================================== */}
      <main className="max-w-7xl mx-auto px-4 sm:px-8 py-10">
        {/* =================================================================
            TAB 1: LEARN & VISUAL SLIDES
           ================================================================= */}
        {activeTab === "learn" && (
          <div className="space-y-16">
            {/* SECTION A: THE 3 VOWEL MASTER CARDS */}
            <section className="space-y-8">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                  <span className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-widest text-[#0D9488] dark:text-teal-400">
                    <Sparkles className="w-3.5 h-3.5" /> Step 1 • Core Foundation
                  </span>
                  <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight mt-1">
                    Meet the Three Short Vowels
                  </h2>
                </div>
                <p
                  className={`text-sm sm:text-base max-w-md ${
                    darkMode ? "text-slate-400" : "text-slate-600"
                  }`}
                >
                  Tap any card to hear its crisp 1-beat sound. Notice the vowel
                  position and how your mouth shapes the voice.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-7">
                {VOWEL_CARDS.map((card) => (
                  <div
                    key={card.id}
                    onClick={() => playSound(card.sampleAr, 0.72)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        playSound(card.sampleAr, 0.72);
                      }
                    }}
                    className={`relative rounded-3xl border overflow-hidden transition-all duration-300 cursor-pointer flex flex-col justify-between group hover:-translate-y-1.5 ${
                      darkMode
                        ? "bg-[#111827] border-slate-800 hover:border-slate-700 shadow-xl shadow-black/30"
                        : "bg-white border-slate-200/90 hover:border-slate-300 shadow-lg shadow-slate-200/60"
                    }`}
                  >
                    {/* Top Saturated Accent Ribbon */}
                    <div className={`h-2.5 w-full ${card.topBarClass}`} />

                    <div className="p-7 flex-1 flex flex-col justify-between">
                      <div>
                        {/* Card Top Badge & Audio Icon */}
                        <div className="flex items-center justify-between">
                          <span
                            className={`px-4 py-1.5 rounded-full text-xs font-extrabold tracking-wide ${card.badgeClass}`}
                          >
                            {card.badge} • {card.nameAr}
                          </span>
                          <div
                            className={`w-10 h-10 rounded-2xl flex items-center justify-center transition ${
                              darkMode
                                ? "bg-slate-800 text-slate-300 group-hover:scale-110"
                                : "bg-slate-100 text-slate-700 group-hover:scale-110"
                            }`}
                          >
                            <Volume2 className="w-5 h-5" />
                          </div>
                        </div>

                        {/* Giant Interactive Arabic Pedestal */}
                        <div
                          className={`my-7 py-7 rounded-3xl border text-center transition-colors ${
                            darkMode ? card.softBgDark : card.softBgLight
                          } ${card.pillBorder}`}
                        >
                          <span
                            dir="rtl"
                            style={{
                              fontSize: `${Math.round(5.5 * textSizeScale)}rem`,
                              lineHeight: 1.15,
                            }}
                            className={`font-serif font-bold inline-block transition-transform duration-300 group-hover:scale-110 ${card.accentText}`}
                          >
                            {card.sampleAr}
                          </span>
                        </div>

                        {/* Clear Explanations */}
                        <div className="space-y-2.5">
                          <div className="flex items-baseline justify-between">
                            <span
                              className={`text-xl font-extrabold ${card.accentText}`}
                            >
                              {card.soundTitle}
                            </span>
                            {englishHints && (
                              <span
                                className={`text-xs font-bold px-2.5 py-1 rounded-lg ${
                                  darkMode
                                    ? "bg-slate-800 text-slate-300"
                                    : "bg-slate-100 text-slate-600"
                                }`}
                              >
                                {card.soundExample}
                              </span>
                            )}
                          </div>

                          <p className="text-sm font-bold">{card.placement}</p>
                          <p
                            className={`text-sm leading-relaxed ${
                              darkMode ? "text-slate-400" : "text-slate-600"
                            }`}
                          >
                            {card.mouthTip}
                          </p>
                        </div>

                        {/* Custom SVG Mouth Articulation Box */}
                        <div
                          className={`mt-5 p-3.5 rounded-2xl border flex items-center gap-3.5 ${
                            darkMode
                              ? "bg-[#0B0F19] border-slate-800"
                              : "bg-slate-50/90 border-slate-200/70"
                          }`}
                        >
                          <MouthDiagramSVG vowel={card.id} />
                          <p
                            className={`text-xs leading-relaxed font-medium ${
                              darkMode ? "text-slate-300" : "text-slate-600"
                            }`}
                          >
                            {card.mechanicsDetail}
                          </p>
                        </div>
                      </div>

                      {/* 4 Mini Practice Pills */}
                      <div
                        className="mt-6 pt-5 border-t border-slate-200/70 dark:border-slate-800"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <span className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-400 mb-2.5">
                          Quick Practice — Tap to Hear:
                        </span>
                        <div dir="rtl" className="grid grid-cols-4 gap-2.5">
                          {card.miniLetters.map((ml, idx) => (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => playSound(ml.ar, 0.75)}
                              className={`py-2.5 rounded-2xl border text-center transition hover:-translate-y-0.5 active:scale-95 ${
                                darkMode
                                  ? "bg-[#0B0F19] border-slate-800 hover:border-slate-600"
                                  : "bg-slate-50 border-slate-200/80 hover:bg-white hover:shadow-xs"
                              }`}
                            >
                              <span
                                className={`block text-2xl font-serif font-bold ${card.accentText}`}
                              >
                                {ml.ar}
                              </span>
                              {englishHints && (
                                <span
                                  dir="ltr"
                                  className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 mt-0.5"
                                >
                                  {ml.tr}
                                </span>
                              )}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* SECTION B: INTERACTIVE POWERPOINT SLIDESHOW */}
            <section className="space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#0D9488] to-[#059669] text-white flex items-center justify-center shadow-md shadow-teal-500/20">
                    <Presentation className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-xl sm:text-2xl font-extrabold">
                      Interactive Classroom Slides
                    </h2>
                    <p
                      className={`text-xs sm:text-sm ${
                        darkMode ? "text-slate-400" : "text-slate-600"
                      }`}
                    >
                      Visual teaching slides designed for Zoom screen-sharing &
                      home review
                    </p>
                  </div>
                </div>

                {/* Slide Selector Buttons */}
                <div className="flex items-center gap-2 flex-wrap">
                  {[
                    "1. The Motion Engine",
                    "2. Above vs Below",
                    "3. Word Morphing",
                    "4. The 1-Beat Rule",
                  ].map((label, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSlideIdx(idx)}
                      className={`px-4 py-2 rounded-xl text-xs font-extrabold transition ${
                        slideIdx === idx
                          ? "bg-[#0D9488] text-white shadow-md shadow-teal-600/25"
                          : darkMode
                          ? "bg-[#111827] text-slate-300 border border-slate-800 hover:bg-slate-800"
                          : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-100"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              <div
                className={`rounded-3xl border p-8 sm:p-12 transition-all ${
                  darkMode
                    ? "bg-[#111827] border-slate-800 shadow-2xl"
                    : "bg-white border-slate-200/90 shadow-xl shadow-slate-200/50"
                }`}
              >
                {/* SLIDE 1 */}
                {slideIdx === 0 && (
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
                    <div className="lg:col-span-6 space-y-4">
                      <span className="inline-block px-3.5 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider bg-teal-500/15 text-[#0D9488] dark:text-teal-400">
                        Visual Slide 1 of 4
                      </span>
                      <h3 className="text-2xl sm:text-3xl font-extrabold leading-tight">
                        Why Are They Called &ldquo;Harakat&rdquo;?
                      </h3>
                      <p
                        className={`text-sm sm:text-base leading-relaxed ${
                          darkMode ? "text-slate-300" : "text-slate-600"
                        }`}
                      >
                        In Arabic, <strong>Harakat (حَرَكَات)</strong> literally
                        means <strong>&ldquo;Motions&rdquo;</strong>. A raw
                        consonant letter like <strong>ب</strong> stands still
                        until a vowel mark gives it a direction: UP for Fatha,
                        ROUND for Damma, or DOWN for Kasra!
                      </p>
                    </div>

                    <div className="lg:col-span-6">
                      <div
                        className={`p-6 rounded-3xl border ${
                          darkMode
                            ? "bg-[#0B0F19] border-slate-800"
                            : "bg-slate-50/80 border-slate-200/80"
                        }`}
                      >
                        <div className="flex flex-col sm:flex-row items-center justify-around gap-6">
                          <div className="p-6 rounded-2xl bg-slate-800 text-white text-center shadow-md">
                            <span className="text-xs font-bold text-slate-400 uppercase block">
                              Still Letter
                            </span>
                            <span
                              dir="rtl"
                              className="text-5xl font-serif font-bold block my-2"
                            >
                              ب
                            </span>
                            <span className="text-xs text-slate-300">
                              Consonant &ldquo;B&rdquo;
                            </span>
                          </div>

                          <div className="space-y-3 w-full sm:w-64">
                            <button
                              type="button"
                              onClick={() => playSound("بَ", 0.75)}
                              className="w-full px-5 py-3 rounded-2xl bg-[#FF5A1F]/15 hover:bg-[#FF5A1F]/25 border border-[#FF5A1F]/40 flex items-center justify-between transition"
                            >
                              <span
                                dir="rtl"
                                className="text-3xl font-serif font-bold text-[#FF5A1F]"
                              >
                                بَ
                              </span>
                              <span className="text-sm font-extrabold">
                                Fatha ➔ &ldquo;ba&rdquo;
                              </span>
                              <ArrowUp className="w-4 h-4 text-[#FF5A1F]" />
                            </button>

                            <button
                              type="button"
                              onClick={() => playSound("بُ", 0.75)}
                              className="w-full px-5 py-3 rounded-2xl bg-[#00A86B]/15 hover:bg-[#00A86B]/25 border border-[#00A86B]/40 flex items-center justify-between transition"
                            >
                              <span
                                dir="rtl"
                                className="text-3xl font-serif font-bold text-[#00A86B]"
                              >
                                بُ
                              </span>
                              <span className="text-sm font-extrabold">
                                Damma ➔ &ldquo;bu&rdquo;
                              </span>
                              <Volume2 className="w-4 h-4 text-[#00A86B]" />
                            </button>

                            <button
                              type="button"
                              onClick={() => playSound("بِ", 0.75)}
                              className="w-full px-5 py-3 rounded-2xl bg-[#7C3AED]/15 hover:bg-[#7C3AED]/25 border border-[#7C3AED]/40 flex items-center justify-between transition"
                            >
                              <span
                                dir="rtl"
                                className="text-3xl font-serif font-bold text-[#7C3AED]"
                              >
                                بِ
                              </span>
                              <span className="text-sm font-extrabold">
                                Kasra ➔ &ldquo;bi&rdquo;
                              </span>
                              <ArrowDown className="w-4 h-4 text-[#7C3AED]" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* SLIDE 2 */}
                {slideIdx === 1 && (
                  <div className="space-y-6 text-center">
                    <span className="inline-block px-3.5 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider bg-teal-500/15 text-[#0D9488] dark:text-teal-400">
                      Visual Slide 2 of 4 • Position Memory Trick
                    </span>
                    <h3 className="text-2xl sm:text-3xl font-extrabold">
                      2 Marks Sit Above the Letter & Only 1 Sits Below!
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
                      <div
                        onClick={() => playSound("دَ", 0.75)}
                        className="p-6 rounded-3xl border-2 border-[#FF5A1F]/40 bg-[#FF5A1F]/10 cursor-pointer hover:scale-[1.02] transition space-y-2"
                      >
                        <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-[#FF5A1F] text-white">
                          ABOVE (ROOF)
                        </span>
                        <div
                          dir="rtl"
                          className="text-6xl font-serif font-bold text-[#FF5A1F] py-2"
                        >
                          دَ
                        </div>
                        <p className="text-base font-extrabold">
                          Fatha = Diagonal Dash on Top
                        </p>
                      </div>

                      <div
                        onClick={() => playSound("دُ", 0.75)}
                        className="p-6 rounded-3xl border-2 border-[#00A86B]/40 bg-[#00A86B]/10 cursor-pointer hover:scale-[1.02] transition space-y-2"
                      >
                        <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-[#00A86B] text-white">
                          ABOVE (ROOF)
                        </span>
                        <div
                          dir="rtl"
                          className="text-6xl font-serif font-bold text-[#00A86B] py-2"
                        >
                          دُ
                        </div>
                        <p className="text-base font-extrabold">
                          Damma = Baby Waw Loop on Top
                        </p>
                      </div>

                      <div
                        onClick={() => playSound("دِ", 0.75)}
                        className="p-6 rounded-3xl border-2 border-[#7C3AED]/40 bg-[#7C3AED]/10 cursor-pointer hover:scale-[1.02] transition space-y-2"
                      >
                        <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-[#7C3AED] text-white">
                          BELOW (FLOOR)
                        </span>
                        <div
                          dir="rtl"
                          className="text-6xl font-serif font-bold text-[#7C3AED] py-2"
                        >
                          دِ
                        </div>
                        <p className="text-base font-extrabold">
                          Kasra = Always Underneath!
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* SLIDE 3 */}
                {slideIdx === 2 && (
                  <div className="space-y-6 text-center">
                    <span className="inline-block px-3.5 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider bg-teal-500/15 text-[#0D9488] dark:text-teal-400">
                      Visual Slide 3 of 4 • Word Morphing Lab
                    </span>
                    <h3 className="text-2xl sm:text-3xl font-extrabold">
                      Same 3 Consonants (ك - ت - ب) ➔ 3 Different Words!
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 pt-2">
                      {MORPH_SLIDE_DATA.map((m, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => {
                            setMorphWordIdx(i);
                            playSound(m.ar, 0.72);
                          }}
                          className={`p-6 rounded-3xl border-2 text-center transition ${
                            morphWordIdx === i
                              ? "border-[#0D9488] bg-teal-500/10 shadow-lg scale-[1.02]"
                              : darkMode
                              ? "border-slate-800 bg-[#0B0F19]"
                              : "border-slate-200 bg-slate-50"
                          }`}
                        >
                          <span
                            className={`inline-block px-3 py-0.5 rounded-full text-[11px] font-extrabold text-white ${m.badgeColor}`}
                          >
                            Pattern {i + 1}
                          </span>
                          <div
                            dir="rtl"
                            className="text-5xl font-serif font-bold my-3"
                          >
                            {m.ar}
                          </div>
                          <div className="text-sm font-extrabold text-[#0D9488] dark:text-teal-400">
                            {m.tr}
                          </div>
                          <div className="text-xs font-semibold mt-1 opacity-80">
                            {m.meaning}
                          </div>
                        </button>
                      ))}
                    </div>
                    <p
                      className={`text-sm sm:text-base font-semibold max-w-2xl mx-auto pt-2 ${
                        darkMode ? "text-slate-300" : "text-slate-700"
                      }`}
                    >
                      {MORPH_SLIDE_DATA[morphWordIdx].desc}
                    </p>
                  </div>
                )}

                {/* SLIDE 4 */}
                {slideIdx === 3 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                    <div
                      onClick={() => playSound("بَ", 0.85)}
                      className="p-7 rounded-3xl border-2 border-[#00A86B]/50 bg-[#00A86B]/10 cursor-pointer space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <span className="px-3.5 py-1 rounded-full text-xs font-extrabold bg-[#00A86B] text-white">
                          CORRECT • 1 Short Beat
                        </span>
                        <CheckCircle2 className="w-6 h-6 text-[#00A86B]" />
                      </div>
                      <div
                        dir="rtl"
                        className="text-6xl font-serif font-bold text-[#00A86B]"
                      >
                        بَ
                      </div>
                      <p className="text-sm leading-relaxed">
                        Pronounce <strong>&ldquo;ba&rdquo;</strong> for exactly
                        1 crisp beat and stop immediately.
                      </p>
                    </div>

                    <div
                      onClick={() => playSound("بَا", 0.65)}
                      className="p-7 rounded-3xl border-2 border-rose-500/50 bg-rose-500/10 cursor-pointer space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <span className="px-3.5 py-1 rounded-full text-xs font-extrabold bg-rose-600 text-white">
                          MISTAKE • Stretching
                        </span>
                        <AlertTriangle className="w-6 h-6 text-rose-500" />
                      </div>
                      <div
                        dir="rtl"
                        className="text-6xl font-serif font-bold text-rose-500"
                      >
                        بَا
                      </div>
                      <p className="text-sm leading-relaxed">
                        Stretching a short vowel turns it into a long Madd
                        letter (<strong>baa</strong>), which changes the meaning!
                      </p>
                    </div>
                  </div>
                )}

                {/* Slide Footer Navigation */}
                <div className="mt-8 pt-5 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() =>
                      setSlideIdx((p) => (p === 0 ? 3 : p - 1))
                    }
                    className={`px-4 py-2.5 rounded-xl text-xs font-extrabold border inline-flex items-center gap-1.5 transition ${
                      darkMode
                        ? "bg-[#0B0F19] border-slate-800 text-slate-300 hover:bg-slate-800"
                        : "bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200"
                    }`}
                  >
                    <ChevronLeft className="w-4 h-4" /> Previous Slide
                  </button>
                  <span className="text-xs font-extrabold text-slate-400">
                    Slide {slideIdx + 1} of 4
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      setSlideIdx((p) => (p === 3 ? 0 : p + 1))
                    }
                    className="px-5 py-2.5 rounded-xl text-xs font-extrabold bg-[#0D9488] hover:bg-teal-700 text-white inline-flex items-center gap-1.5 shadow-md shadow-teal-600/20"
                  >
                    Next Slide <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* =================================================================
            TAB 2: TACTILE SOUND MATRIX (REPLACES THE DULL EMPTY TABLE!)
           ================================================================= */}
        {activeTab === "chart" && (
          <section className="space-y-8">
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
              <div>
                <span className="text-xs font-extrabold uppercase tracking-widest text-[#0D9488] dark:text-teal-400">
                  84 Interactive Audio Tiles
                </span>
                <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight mt-1">
                  Interactive Sound Matrix
                </h2>
                <p
                  className={`mt-1 text-sm sm:text-base ${
                    darkMode ? "text-slate-400" : "text-slate-600"
                  }`}
                >
                  Tap any colored vowel tile to hear its authentic Arabic
                  pronunciation.
                </p>
              </div>

              {/* Search & Vowel Filter Bar */}
              <div className="flex flex-wrap items-center gap-3">
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={chartSearch}
                    onChange={(e) => setChartSearch(e.target.value)}
                    placeholder="Find letter (e.g. Ba, ج)..."
                    className={`pl-10 pr-4 py-2.5 rounded-2xl text-xs sm:text-sm font-semibold border outline-none transition ${
                      darkMode
                        ? "bg-[#111827] border-slate-800 text-white focus:border-[#0D9488]"
                        : "bg-white border-slate-200 text-slate-800 focus:border-[#0D9488] shadow-2xs"
                    }`}
                  />
                </div>

                <div
                  className={`flex items-center p-1 rounded-2xl border ${
                    darkMode
                      ? "bg-[#111827] border-slate-800"
                      : "bg-white border-slate-200 shadow-2xs"
                  }`}
                >
                  {[
                    { id: "all", label: "All 3", activeCls: "bg-slate-800 text-white dark:bg-slate-700" },
                    { id: "fatha", label: "Fatha", activeCls: "bg-[#FF5A1F] text-white" },
                    { id: "damma", label: "Damma", activeCls: "bg-[#00A86B] text-white" },
                    { id: "kasra", label: "Kasra", activeCls: "bg-[#7C3AED] text-white" },
                  ].map((f) => (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => setVowelFilter(f.id as "all" | VowelType)}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition ${
                        vowelFilter === f.id
                          ? f.activeCls
                          : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Responsive Tactile Letter Cards Grid (2 Columns on Desktop for super clean reading) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredChartRows.map((row) => (
                <div
                  key={row.name}
                  className={`rounded-3xl border p-4 sm:p-5 flex items-center justify-between gap-4 transition-all ${
                    darkMode
                      ? "bg-[#111827] border-slate-800/90 hover:border-slate-700"
                      : "bg-white border-slate-200/80 hover:border-slate-300 shadow-sm hover:shadow-md"
                  }`}
                >
                  {/* Base Letter Badge */}
                  <div className="w-20 shrink-0 text-center border-r pr-4 border-slate-200/70 dark:border-slate-800">
                    <div
                      dir="rtl"
                      style={{ fontSize: `${Math.round(2.3 * textSizeScale)}rem` }}
                      className="font-serif font-bold leading-none text-slate-800 dark:text-slate-100"
                    >
                      {row.letter}
                    </div>
                    {englishHints && (
                      <span className="block text-xs font-extrabold text-slate-400 mt-1.5">
                        {row.name}
                      </span>
                    )}
                  </div>

                  {/* 3 Saturated Tactile Vowel Buttons */}
                  <div
                    className={`flex-1 grid gap-3 ${
                      vowelFilter === "all" ? "grid-cols-3" : "grid-cols-1"
                    }`}
                  >
                    {/* FATHA BUTTON */}
                    {(vowelFilter === "all" || vowelFilter === "fatha") && (
                      <button
                        type="button"
                        onClick={() =>
                          triggerAudio(row.fatha.ar, `${row.name}-fatha`)
                        }
                        className={`rounded-2xl py-3 px-2 border-2 text-center transition-all flex flex-col items-center justify-center cursor-pointer ${
                          activeSoundKey === `${row.name}-fatha`
                            ? "scale-95 ring-4 ring-[#FF5A1F]/30 bg-[#FF5A1F] text-white border-[#FF5A1F]"
                            : darkMode
                            ? "bg-[#FF5A1F]/10 border-[#FF5A1F]/30 hover:border-[#FF5A1F] text-[#FF7A45]"
                            : "bg-[#FFF6F2] border-[#FFD5C2] hover:bg-[#FFEDE5] hover:border-[#FF5A1F] text-[#FF5A1F]"
                        }`}
                      >
                        <span
                          dir="rtl"
                          style={{
                            fontSize: `${Math.round(2.35 * textSizeScale)}rem`,
                          }}
                          className="font-serif font-bold leading-snug"
                        >
                          {row.fatha.ar}
                        </span>
                        {englishHints && (
                          <span className="text-xs font-extrabold opacity-85 mt-0.5">
                            {row.fatha.tr}
                          </span>
                        )}
                      </button>
                    )}

                    {/* DAMMA BUTTON */}
                    {(vowelFilter === "all" || vowelFilter === "damma") && (
                      <button
                        type="button"
                        onClick={() =>
                          triggerAudio(row.damma.ar, `${row.name}-damma`)
                        }
                        className={`rounded-2xl py-3 px-2 border-2 text-center transition-all flex flex-col items-center justify-center cursor-pointer ${
                          activeSoundKey === `${row.name}-damma`
                            ? "scale-95 ring-4 ring-[#00A86B]/30 bg-[#00A86B] text-white border-[#00A86B]"
                            : darkMode
                            ? "bg-[#00A86B]/10 border-[#00A86B]/30 hover:border-[#00A86B] text-[#34D399]"
                            : "bg-[#F2FBF7] border-[#BCEFD8] hover:bg-[#E3F7ED] hover:border-[#00A86B] text-[#00A86B]"
                        }`}
                      >
                        <span
                          dir="rtl"
                          style={{
                            fontSize: `${Math.round(2.35 * textSizeScale)}rem`,
                          }}
                          className="font-serif font-bold leading-snug"
                        >
                          {row.damma.ar}
                        </span>
                        {englishHints && (
                          <span className="text-xs font-extrabold opacity-85 mt-0.5">
                            {row.damma.tr}
                          </span>
                        )}
                      </button>
                    )}

                    {/* KASRA BUTTON */}
                    {(vowelFilter === "all" || vowelFilter === "kasra") && (
                      <button
                        type="button"
                        onClick={() =>
                          triggerAudio(row.kasra.ar, `${row.name}-kasra`)
                        }
                        className={`rounded-2xl py-3 px-2 border-2 text-center transition-all flex flex-col items-center justify-center cursor-pointer ${
                          activeSoundKey === `${row.name}-kasra`
                            ? "scale-95 ring-4 ring-[#7C3AED]/30 bg-[#7C3AED] text-white border-[#7C3AED]"
                            : darkMode
                            ? "bg-[#7C3AED]/10 border-[#7C3AED]/30 hover:border-[#7C3AED] text-[#A78BFA]"
                            : "bg-[#F8F5FF] border-[#E0D1FF] hover:bg-[#EFE8FF] hover:border-[#7C3AED] text-[#7C3AED]"
                        }`}
                      >
                        <span
                          dir="rtl"
                          style={{
                            fontSize: `${Math.round(2.35 * textSizeScale)}rem`,
                          }}
                          className="font-serif font-bold leading-snug"
                        >
                          {row.kasra.ar}
                        </span>
                        {englishHints && (
                          <span className="text-xs font-extrabold opacity-85 mt-0.5">
                            {row.kasra.tr}
                          </span>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* =================================================================
            TAB 3: READING LAB (SATURATED PILLS & SYLLABLE DECONSTRUCTION)
           ================================================================= */}
        {activeTab === "reading" && (
          <section className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <span className="text-xs font-extrabold uppercase tracking-widest text-[#0D9488] dark:text-teal-400">
                  Step-by-Step Word Builder
                </span>
                <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight mt-1">
                  Reading Practice Lab
                </h2>
              </div>

              {/* 4 Saturated Category Pills */}
              <div className="flex flex-wrap items-center gap-2.5">
                {(
                  [
                    { id: "fatha", label: "Fatha Words", activeBg: "bg-[#FF5A1F] text-white shadow-md shadow-orange-500/25" },
                    { id: "damma", label: "Damma Words", activeBg: "bg-[#00A86B] text-white shadow-md shadow-emerald-500/25" },
                    { id: "kasra", label: "Kasra Words", activeBg: "bg-[#7C3AED] text-white shadow-md shadow-violet-500/25" },
                    { id: "mixed", label: "Mixed Words", activeBg: "bg-[#0D9488] text-white shadow-md shadow-teal-500/25" },
                  ] as { id: ReadingFilter; label: string; activeBg: string }[]
                ).map((pill) => (
                  <button
                    key={pill.id}
                    type="button"
                    onClick={() => {
                      setReadingFilter(pill.id);
                      setReadingIdx(0);
                    }}
                    className={`px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-extrabold transition ${
                      readingFilter === pill.id
                        ? pill.activeBg
                        : darkMode
                        ? "bg-[#111827] border border-slate-800 text-slate-300 hover:bg-slate-800"
                        : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    {pill.label}
                  </button>
                ))}
              </div>
            </div>

            {currentReadingWord && (
              <div
                className={`rounded-3xl border p-8 sm:p-12 transition-all ${
                  darkMode
                    ? "bg-[#111827] border-slate-800 shadow-2xl"
                    : "bg-white border-slate-200/90 shadow-xl shadow-slate-200/50"
                }`}
              >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
                  {/* Left: Giant Word Spotlight */}
                  <div
                    className={`lg:col-span-6 rounded-3xl p-8 border text-center ${
                      darkMode
                        ? "bg-[#0B0F19] border-slate-800"
                        : "bg-slate-50/70 border-slate-200/70"
                    }`}
                  >
                    <ReadingIllustrationSVG
                      type={currentReadingWord.illustrationType}
                    />

                    <button
                      type="button"
                      onClick={() => playSound(currentReadingWord.arabic, 0.7)}
                      className="my-5 block mx-auto group focus:outline-none"
                    >
                      <div
                        dir="rtl"
                        style={{
                          fontSize: `${Math.round(6 * textSizeScale)}rem`,
                          lineHeight: 1.15,
                        }}
                        className={`font-serif font-bold transition-transform group-hover:scale-105 ${
                          readingFilter === "fatha"
                            ? "text-[#FF5A1F]"
                            : readingFilter === "damma"
                            ? "text-[#00A86B]"
                            : readingFilter === "kasra"
                            ? "text-[#7C3AED]"
                            : "text-[#0D9488]"
                        }`}
                      >
                        {currentReadingWord.arabic}
                      </div>
                    </button>

                    {englishHints && (
                      <div className="space-y-1">
                        <div className="text-2xl font-extrabold">
                          {currentReadingWord.translit}
                        </div>
                        <div className="text-base font-semibold text-slate-500 dark:text-slate-400">
                          &ldquo;{currentReadingWord.meaning}&rdquo;
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Right: Syllable Breakdown & Navigation */}
                  <div className="lg:col-span-6 space-y-6">
                    <div>
                      <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
                        Syllable Breakdown (Tap from Right to Left)
                      </span>
                      <div dir="rtl" className="grid grid-cols-3 gap-4 mt-3">
                        {currentReadingWord.syllables.map((syl, i) => {
                          const sStyle =
                            syl.vowel === "fatha"
                              ? "border-[#FF5A1F]/40 bg-[#FF5A1F]/10 text-[#FF5A1F]"
                              : syl.vowel === "damma"
                              ? "border-[#00A86B]/40 bg-[#00A86B]/10 text-[#00A86B]"
                              : "border-[#7C3AED]/40 bg-[#7C3AED]/10 text-[#7C3AED]";
                          return (
                            <button
                              key={i}
                              type="button"
                              onClick={() => playSound(syl.ar, 0.72)}
                              className={`p-6 rounded-3xl border-2 text-center transition hover:-translate-y-1 ${sStyle}`}
                            >
                              <span className="block text-5xl font-serif font-bold">
                                {syl.ar}
                              </span>
                              {englishHints && (
                                <span
                                  dir="ltr"
                                  className="block text-sm font-extrabold mt-2 opacity-90"
                                >
                                  {syl.tr}
                                </span>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="pt-4 flex items-center justify-between gap-3">
                      <button
                        type="button"
                        onClick={() =>
                          setReadingIdx((p) =>
                            p === 0 ? filteredReadingWords.length - 1 : p - 1
                          )
                        }
                        className={`flex-1 py-3.5 px-4 rounded-2xl font-extrabold text-sm border inline-flex items-center justify-center gap-2 transition ${
                          darkMode
                            ? "bg-[#0B0F19] border-slate-800 hover:bg-slate-800"
                            : "bg-slate-100 border-slate-200 hover:bg-slate-200"
                        }`}
                      >
                        <ChevronLeft className="w-4 h-4" /> Previous
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          playSound(currentReadingWord.arabic, 0.7)
                        }
                        className="px-7 py-3.5 rounded-2xl font-extrabold text-sm bg-[#0D9488] hover:bg-teal-700 text-white inline-flex items-center gap-2 shadow-lg shadow-teal-600/25"
                      >
                        <Volume2 className="w-4 h-4" /> Listen
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          setReadingIdx((p) =>
                            p + 1 >= filteredReadingWords.length ? 0 : p + 1
                          )
                        }
                        className={`flex-1 py-3.5 px-4 rounded-2xl font-extrabold text-sm border inline-flex items-center justify-center gap-2 transition ${
                          darkMode
                            ? "bg-[#0B0F19] border-slate-800 hover:bg-slate-800"
                            : "bg-slate-100 border-slate-200 hover:bg-slate-200"
                        }`}
                      >
                        Next <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </section>
        )}

        {/* =================================================================
            TAB 4: GAMES AND QUIZZES
           ================================================================= */}
        {activeTab === "games" && (
          <section className="space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-extrabold uppercase tracking-widest text-[#0D9488] dark:text-teal-400">
                  Interactive Practice
                </span>
                <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight mt-1">
                  Games & Mastery Quizzes
                </h2>
              </div>
              {gameMode !== "menu" && (
                <button
                  type="button"
                  onClick={() => setGameMode("menu")}
                  className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-extrabold border inline-flex items-center gap-2 ${
                    darkMode
                      ? "bg-[#111827] border-slate-800 text-slate-200"
                      : "bg-white border-slate-200 text-slate-700 shadow-2xs"
                  }`}
                >
                  <ChevronLeft className="w-4 h-4" /> All Games
                </button>
              )}
            </div>

            {gameMode === "menu" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  { mode: "name_mark", title: "Name the Mark", desc: "See a syllable and pick whether it has Fatha, Damma, or Kasra.", icon: Eye, topBar: "bg-[#FF5A1F]", iconColor: "text-[#FF5A1F] bg-[#FF5A1F]/10" },
                  { mode: "sound_match", title: "Sound Match", desc: "Listen to the sound and find the matching Arabic letter.", icon: Ear, topBar: "bg-[#00A86B]", iconColor: "text-[#00A86B] bg-[#00A86B]/10" },
                  { mode: "word_meaning", title: "Word Meaning", desc: "Read the vocalized Arabic word and choose its English meaning.", icon: BookOpen, topBar: "bg-[#7C3AED]", iconColor: "text-[#7C3AED] bg-[#7C3AED]/10" },
                  { mode: "say_right", title: "Say It Right", desc: "Pick the accurate phonetic reading for the full word.", icon: Volume2, topBar: "bg-[#0D9488]", iconColor: "text-[#0D9488] bg-[#0D9488]/10" },
                  { mode: "final_test", title: "Final Mastery Test", desc: "Complete all mixed questions to earn your lesson stars!", icon: Trophy, topBar: "bg-amber-500", iconColor: "text-amber-500 bg-amber-500/10" },
                ].map((g, idx) => {
                  const Icon = g.icon;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => startGame(g.mode as GameModeId)}
                      className={`rounded-3xl border overflow-hidden text-left transition-all hover:-translate-y-1.5 flex flex-col justify-between h-56 ${
                        darkMode
                          ? "bg-[#111827] border-slate-800 hover:border-slate-700 shadow-xl"
                          : "bg-white border-slate-200/90 hover:border-slate-300 shadow-lg shadow-slate-200/50"
                      }`}
                    >
                      <div className={`h-2 w-full ${g.topBar}`} />
                      <div className="p-7 flex-1 flex flex-col justify-between">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${g.iconColor}`}>
                          <Icon className="w-6 h-6" />
                        </div>
                        <div>
                          <h3 className="text-xl font-extrabold mb-1.5">{g.title}</h3>
                          <p className={`text-sm leading-relaxed ${darkMode ? "text-slate-400" : "text-slate-600"}`}>
                            {g.desc}
                          </p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}

            {gameMode !== "menu" && !gameFinished && currentGameQ && (
              <div
                className={`rounded-3xl border p-8 sm:p-12 max-w-3xl mx-auto ${
                  darkMode
                    ? "bg-[#111827] border-slate-800 shadow-2xl"
                    : "bg-white border-slate-200 shadow-xl"
                }`}
              >
                <div className="flex items-center justify-between text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-6">
                  <span>
                    Question {qIndex + 1} of {activeGameQuestions.length}
                  </span>
                  <span>
                    Score: {sessionScore} / {activeGameQuestions.length}
                  </span>
                </div>

                <h3 className="text-xl sm:text-2xl font-extrabold text-center mb-6">
                  {currentGameQ.prompt}
                </h3>

                {currentGameQ.bigDisplay && (
                  <div className="my-6 text-center">
                    <button
                      type="button"
                      onClick={() =>
                        currentGameQ.audioText &&
                        playSound(currentGameQ.audioText, 0.75)
                      }
                      className={`px-12 py-7 rounded-3xl border-2 inline-flex flex-col items-center gap-2 transition hover:scale-105 ${
                        darkMode
                          ? "bg-[#0B0F19] border-slate-800"
                          : "bg-slate-50 border-slate-200"
                      }`}
                    >
                      <span
                        dir="rtl"
                        style={{
                          fontSize: `${Math.round(4.5 * textSizeScale)}rem`,
                        }}
                        className="font-serif font-bold text-[#FF5A1F] leading-none"
                      >
                        {currentGameQ.bigDisplay}
                      </span>
                      <span className="text-xs font-extrabold text-[#0D9488] inline-flex items-center gap-1 mt-2">
                        <Volume2 className="w-3.5 h-3.5" /> Tap to Listen
                      </span>
                    </button>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
                  {currentGameQ.options.map((opt, idx) => {
                    const isCorrect = idx === currentGameQ.correctIndex;
                    const isPicked = idx === pickedOption;

                    let cardCls = darkMode
                      ? "bg-[#0B0F19] border-slate-800 hover:border-[#0D9488]"
                      : "bg-slate-50 border-slate-200 hover:border-[#0D9488]";

                    if (qAnswered) {
                      if (isCorrect) {
                        cardCls =
                          "bg-[#00A86B]/15 border-[#00A86B] text-[#00A86B] dark:text-[#34D399]";
                      } else if (isPicked && !isCorrect) {
                        cardCls =
                          "bg-rose-500/15 border-rose-500 text-rose-600 dark:text-rose-400";
                      }
                    }

                    return (
                      <button
                        key={idx}
                        type="button"
                        disabled={qAnswered}
                        onClick={() => handleGameOptionPick(idx)}
                        className={`p-5 rounded-2xl border-2 font-extrabold text-xl text-center transition flex items-center justify-center gap-2 ${cardCls}`}
                      >
                        <span>{opt}</span>
                        {qAnswered && isCorrect && (
                          <CheckCircle2 className="w-5 h-5 shrink-0" />
                        )}
                        {qAnswered && isPicked && !isCorrect && (
                          <XCircle className="w-5 h-5 shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {qAnswered && (
                  <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-sm font-semibold">
                      {currentGameQ.explanation}
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        if (qIndex + 1 < activeGameQuestions.length) {
                          setQIndex((p) => p + 1);
                          setPickedOption(null);
                          setQAnswered(false);
                        } else {
                          setGameFinished(true);
                        }
                      }}
                      className="px-6 py-3 rounded-2xl bg-[#0D9488] hover:bg-teal-700 text-white font-extrabold text-sm inline-flex items-center gap-2 shrink-0"
                    >
                      {qIndex + 1 < activeGameQuestions.length
                        ? "Next Question"
                        : "Finish Quiz"}
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            )}

            {gameMode !== "menu" && gameFinished && (
              <div
                className={`rounded-3xl border p-10 max-w-xl mx-auto text-center space-y-6 ${
                  darkMode
                    ? "bg-[#111827] border-slate-800 shadow-2xl"
                    : "bg-white border-slate-200 shadow-xl"
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  {[1, 2, 3].map((s) => (
                    <Star
                      key={s}
                      className="w-12 h-12 text-amber-400 fill-amber-400"
                    />
                  ))}
                </div>
                <h3 className="text-3xl font-extrabold">
                  Masha’Allah! Great Job!
                </h3>
                <p className="text-slate-500 dark:text-slate-300">
                  You scored{" "}
                  <strong>
                    {sessionScore} / {activeGameQuestions.length}
                  </strong>{" "}
                  and earned{" "}
                  <strong>{stars} total stars</strong>!
                </p>
                <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
                  <button
                    type="button"
                    onClick={() => startGame(gameMode)}
                    className="px-6 py-3 rounded-2xl bg-[#0D9488] text-white font-extrabold text-sm inline-flex items-center gap-2"
                  >
                    <RotateCcw className="w-4 h-4" /> Play Again
                  </button>
                  <button
                    type="button"
                    onClick={() => setGameMode("menu")}
                    className={`px-6 py-3 rounded-2xl font-extrabold text-sm border ${
                      darkMode
                        ? "bg-[#0B0F19] border-slate-800 text-white"
                        : "bg-slate-100 border-slate-200 text-slate-800"
                    }`}
                  >
                    All Games
                  </button>
                </div>
              </div>
            )}
          </section>
        )}
      </main>
    </div>
  );
}