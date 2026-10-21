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
  ShieldAlert,
  Radio,
  Magnet,
  Compass
} from "lucide-react";
import { useLesson } from "../shared/LessonContext";

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

type MainTab = "learn" | "chart" | "reading" | "games";
type LeadVowel = "fatha" | "damma" | "kasra";
type ReadingCategory = "nature" | "qalqalah" | "everyday" | "quranic";
type GameModeId = "menu" | "spot_sukun" | "qalqalah_hunter" | "sound_match" | "word_meaning" | "final_test";

interface SukunConceptCard {
  id: string;
  badge: string;
  titleEn: string;
  titleAr: string;
  sampleAr: string;
  audioSample: string;
  subtitle: string;
  description: string;
  mechanicNote: string;
  imageUrl: string;
  imageAlt: string;
  topBarClass: string;
  badgeClass: string;
  accentText: string;
  softBgLight: string;
  softBgDark: string;
  pillBorder: string;
  examples: { ar: string; tr: string; note: string }[];
}

interface SukunMatrixRow {
  letter: string;
  name: string;
  isQalqalah: boolean;
  withFatha: { ar: string; tr: string };
  withDamma: { ar: string; tr: string };
  withKasra: { ar: string; tr: string };
}

interface SukunReadingWord {
  id: string;
  arabic: string;
  translit: string;
  meaning: string;
  category: ReadingCategory;
  hasQalqalah: boolean;
  imageUrl: string;
  sceneCaption: string;
  steps: {
    ar: string;
    tr: string;
    role: "collision" | "vowel";
  }[];
}

interface GameQuestion {
  id: number;
  mode: Exclude<GameModeId, "menu" | "final_test">;
  prompt: string;
  bigDisplay?: string;
  audioText?: string;
  imageUrl?: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

// ============================================================================
// NATIVE ARABIC SPEECH HELPER
// ============================================================================

const playSound = (text: string, rate = 0.74) => {
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
// VISUAL & CURRICULUM DATA FOR SUKUN (LESSON 2)
// ============================================================================

const SUKUN_CONCEPT_CARDS: SukunConceptCard[] = [
  {
    id: "stop_sign",
    badge: "Rule 1 • The Stop Sign",
    titleEn: "What is Sukun?",
    titleAr: "السُّكُون",
    sampleAr: "أَبْ",
    audioSample: "أَبْ",
    subtitle: "Zero Vowel • Instant Brake on the Letter",
    description:
      "Sukun means 'stillness'. When you see the small circle above a letter, freeze your mouth on that consonant without adding a, u, or i!",
    mechanicNote:
      "A Sukun letter CANNOT be read alone at the start of a word. It needs a moving letter before it to crash into it!",
    imageUrl: "/Tajwedo-Public-Assets/curriculum-Imag/offer-pair.webp",
    imageAlt: "Still calm lake representing stillness of Sukun",
    topBarClass: "bg-gradient-to-r from-[#0284C7] to-[#38BDF8]",
    badgeClass: "bg-[#0284C7] text-white shadow-sm shadow-sky-500/30",
    accentText: "text-[#0284C7] dark:text-[#38BDF8]",
    softBgLight: "bg-[#F0F9FF] hover:bg-[#E0F2FE]",
    softBgDark: "bg-[#111C2D] hover:bg-[#16243A]",
    pillBorder: "border-[#BAE6FD] dark:border-[#1E3A5F]",
    examples: [
      { ar: "أَبْ", tr: "ab", note: "Alif pushes Ba" },
      { ar: "مَنْ", tr: "man", note: "Meem pushes Noon" },
      { ar: "كَمْ", tr: "kam", note: "Kaf pushes Meem" },
      { ar: "لَمْ", tr: "lam", note: "Lam pushes Meem" },
    ],
  },
  {
    id: "quranic_shape",
    badge: "Rule 2 • Mushaf Secret",
    titleEn: "2 Shapes of Sukun",
    titleAr: "رَأْسُ الحَاء",
    sampleAr: "مَنْ ۚ",
    audioSample: "مَنْ",
    subtitle: "Round Circle (ْ) vs. Quranic Head of Haa (ۡ)",
    description:
      "In school books, Sukun looks like a tiny circle (ْ). In the Uthmani Quran (Mushaf), it looks like the tiny head of letter Haa (ۡ) from the word 'Khafeef' (light).",
    mechanicNote:
      "Both marks mean the exact same thing: land firmly on the consonant and hold still!",
    imageUrl: "/Tajwedo-Public-Assets/curriculum-Imag/Quran Recitation.webp",
    imageAlt: "Open Quran Mushaf calligraphy",
    topBarClass: "bg-gradient-to-r from-[#00A86B] to-[#10B981]",
    badgeClass: "bg-[#00A86B] text-white shadow-sm shadow-emerald-500/30",
    accentText: "text-[#00A86B] dark:text-[#34D399]",
    softBgLight: "bg-[#F2FBF7] hover:bg-[#E6F8F0]",
    softBgDark: "bg-[#122226] hover:bg-[#162B30]",
    pillBorder: "border-[#BCEFD8] dark:border-[#1E3B35]",
    examples: [
      { ar: "عَنْ", tr: "‘an", note: "Circle Sukun" },
      { ar: "مِنْ", tr: "min", note: "Sharp Stop" },
      { ar: "بَلْ", tr: "bal", note: "Tongue rests" },
      { ar: "هَلْ", tr: "hal", note: "Clean stop" },
    ],
  },
  {
    id: "qalqalah_echo",
    badge: "Rule 3 • Bouncing Echo",
    titleEn: "Qalqalah Letters",
    titleAr: "قُطْبُ جَدٍ",
    sampleAr: "أَقْ",
    audioSample: "أَقْ",
    subtitle: "5 Special Letters That Bounce When Silent: ق ط ب ج د",
    description:
      "If Sukun lands on any of the 5 letters in (قُطْبُ جَدٍ), airflow gets trapped completely—so we release a tiny natural bounce (echo) to hear the letter clearly!",
    mechanicNote:
      "Memory Phrase: القلقلة حروفها خمسة مجموعة في (قُطْبُ جَد) — Qaf, Taa, Ba, Jeem, Dal.",
    imageUrl: "/Tajwedo-Public-Assets/curriculum-Imag/offer-pair copy.webp",
    imageAlt: "Ripples and echo waves in water",
    topBarClass: "bg-gradient-to-r from-[#FF5A1F] to-[#F59E0B]",
    badgeClass: "bg-[#FF5A1F] text-white shadow-sm shadow-orange-500/30",
    accentText: "text-[#FF5A1F] dark:text-[#FF7A45]",
    softBgLight: "bg-[#FFF8F5] hover:bg-[#FFF0E8]",
    softBgDark: "bg-[#211824] hover:bg-[#2B1F2F]",
    pillBorder: "border-[#FFD8C7] dark:border-[#422826]",
    examples: [
      { ar: "أَقْ", tr: "aq!", note: "Deep Bounce" },
      { ar: "أَطْ", tr: "at!", note: "Strong Echo" },
      { ar: "أَبْ", tr: "ab!", note: "Lip Bounce" },
      { ar: "أَجْ", tr: "aj!", note: "Mid Bounce" },
    ],
  },
];

const QALQALAH_SET = new Set(["ق", "ط", "ب", "ج", "د"]);

const SUKUN_MATRIX_28: SukunMatrixRow[] = [
  { letter: "ب", name: "Ba", isQalqalah: true, withFatha: { ar: "أَبْ", tr: "ab" }, withDamma: { ar: "أُبْ", tr: "ub" }, withKasra: { ar: "إِبْ", tr: "ib" } },
  { letter: "ت", name: "Ta", isQalqalah: false, withFatha: { ar: "أَتْ", tr: "at" }, withDamma: { ar: "أُتْ", tr: "ut" }, withKasra: { ar: "إِتْ", tr: "it" } },
  { letter: "ث", name: "Tha", isQalqalah: false, withFatha: { ar: "أَثْ", tr: "ath" }, withDamma: { ar: "أُثْ", tr: "uth" }, withKasra: { ar: "إِثْ", tr: "ith" } },
  { letter: "ج", name: "Jeem", isQalqalah: true, withFatha: { ar: "أَجْ", tr: "aj" }, withDamma: { ar: "أُجْ", tr: "uj" }, withKasra: { ar: "إِجْ", tr: "ij" } },
  { letter: "ح", name: "Haa", isQalqalah: false, withFatha: { ar: "أَحْ", tr: "ah" }, withDamma: { ar: "أُحْ", tr: "uh" }, withKasra: { ar: "إِحْ", tr: "ih" } },
  { letter: "خ", name: "Khaa", isQalqalah: false, withFatha: { ar: "أَخْ", tr: "akh" }, withDamma: { ar: "أُخْ", tr: "ukh" }, withKasra: { ar: "إِخْ", tr: "ikh" } },
  { letter: "د", name: "Dal", isQalqalah: true, withFatha: { ar: "أَدْ", tr: "ad" }, withDamma: { ar: "أُدْ", tr: "ud" }, withKasra: { ar: "إِدْ", tr: "id" } },
  { letter: "ذ", name: "Dhal", isQalqalah: false, withFatha: { ar: "أَذْ", tr: "adh" }, withDamma: { ar: "أُذْ", tr: "udh" }, withKasra: { ar: "إِذْ", tr: "idh" } },
  { letter: "ر", name: "Ra", isQalqalah: false, withFatha: { ar: "أَرْ", tr: "ar" }, withDamma: { ar: "أُرْ", tr: "ur" }, withKasra: { ar: "إِرْ", tr: "ir" } },
  { letter: "ز", name: "Zay", isQalqalah: false, withFatha: { ar: "أَزْ", tr: "az" }, withDamma: { ar: "أُزْ", tr: "uz" }, withKasra: { ar: "إِزْ", tr: "iz" } },
  { letter: "س", name: "Seen", isQalqalah: false, withFatha: { ar: "أَسْ", tr: "as" }, withDamma: { ar: "أُسْ", tr: "us" }, withKasra: { ar: "إِسْ", tr: "is" } },
  { letter: "ش", name: "Sheen", isQalqalah: false, withFatha: { ar: "أَشْ", tr: "ash" }, withDamma: { ar: "أُشْ", tr: "ush" }, withKasra: { ar: "إِشْ", tr: "ish" } },
  { letter: "ص", name: "Saad", isQalqalah: false, withFatha: { ar: "أَصْ", tr: "as" }, withDamma: { ar: "أُصْ", tr: "us" }, withKasra: { ar: "إِصْ", tr: "is" } },
  { letter: "ض", name: "Daad", isQalqalah: false, withFatha: { ar: "أَضْ", tr: "ad" }, withDamma: { ar: "أُضْ", tr: "ud" }, withKasra: { ar: "إِضْ", tr: "id" } },
  { letter: "ط", name: "Taa", isQalqalah: true, withFatha: { ar: "أَطْ", tr: "at" }, withDamma: { ar: "أُطْ", tr: "ut" }, withKasra: { ar: "إِطْ", tr: "it" } },
  { letter: "ظ", name: "Dhaa", isQalqalah: false, withFatha: { ar: "أَظْ", tr: "adh" }, withDamma: { ar: "أُظْ", tr: "udh" }, withKasra: { ar: "إِظْ", tr: "idh" } },
  { letter: "ع", name: "Ayn", isQalqalah: false, withFatha: { ar: "أَعْ", tr: "a‘" }, withDamma: { ar: "أُعْ", tr: "u‘" }, withKasra: { ar: "إِعْ", tr: "i‘" } },
  { letter: "غ", name: "Ghayn", isQalqalah: false, withFatha: { ar: "أَغْ", tr: "agh" }, withDamma: { ar: "أُغْ", tr: "ugh" }, withKasra: { ar: "إِغْ", tr: "igh" } },
  { letter: "ف", name: "Fa", isQalqalah: false, withFatha: { ar: "أَفْ", tr: "af" }, withDamma: { ar: "أُفْ", tr: "uf" }, withKasra: { ar: "إِفْ", tr: "if" } },
  { letter: "ق", name: "Qaf", isQalqalah: true, withFatha: { ar: "أَقْ", tr: "aq" }, withDamma: { ar: "أُقْ", tr: "uq" }, withKasra: { ar: "إِقْ", tr: "iq" } },
  { letter: "ك", name: "Kaf", isQalqalah: false, withFatha: { ar: "أَكْ", tr: "ak" }, withDamma: { ar: "أُكْ", tr: "uk" }, withKasra: { ar: "إِكْ", tr: "ik" } },
  { letter: "ل", name: "Lam", isQalqalah: false, withFatha: { ar: "أَلْ", tr: "al" }, withDamma: { ar: "أُلْ", tr: "ul" }, withKasra: { ar: "إِلْ", tr: "il" } },
  { letter: "م", name: "Meem", isQalqalah: false, withFatha: { ar: "أَمْ", tr: "am" }, withDamma: { ar: "أُمْ", tr: "um" }, withKasra: { ar: "إِمْ", tr: "im" } },
  { letter: "ن", name: "Noon", isQalqalah: false, withFatha: { ar: "أَنْ", tr: "an" }, withDamma: { ar: "أُنْ", tr: "un" }, withKasra: { ar: "إِنْ", tr: "in" } },
  { letter: "هـ", name: "Ha", isQalqalah: false, withFatha: { ar: "أَهْ", tr: "ah" }, withDamma: { ar: "أُهْ", tr: "uh" }, withKasra: { ar: "إِهْ", tr: "ih" } },
  { letter: "و", name: "Waw", isQalqalah: false, withFatha: { ar: "أَوْ", tr: "aw" }, withDamma: { ar: "أُوْ", tr: "uw" }, withKasra: { ar: "إِوْ", tr: "iw" } },
  { letter: "ي", name: "Ya", isQalqalah: false, withFatha: { ar: "أَيْ", tr: "ay" }, withDamma: { ar: "أُيْ", tr: "uy" }, withKasra: { ar: "إِيْ", tr: "iy" } },
];

const SUKUN_READING_WORDS: SukunReadingWord[] = [
  {
    id: "shams",
    arabic: "شَمْسُ",
    translit: "sham - su",
    meaning: "Sun",
    category: "nature",
    hasQalqalah: false,
    imageUrl: "/Tajwedo-Public-Assets/curriculum-Imag/herosection-booking.webp",
    sceneCaption: "Golden sunrise over mountain peaks (شَمْس)",
    steps: [
      { ar: "شَمْ", tr: "sham (Collision!)", role: "collision" },
      { ar: "سُ", tr: "su", role: "vowel" },
    ],
  },
  {
    id: "bahr",
    arabic: "بَحْرُ",
    translit: "bah - ru",
    meaning: "Sea / Ocean",
    category: "nature",
    hasQalqalah: false,
    imageUrl: "/Tajwedo-Public-Assets/Services/Islamic Studies.webp",
    sceneCaption: "Turquoise ocean waves (بَحْر)",
    steps: [
      { ar: "بَحْ", tr: "bah (Collision!)", role: "collision" },
      { ar: "رُ", tr: "ru", role: "vowel" },
    ],
  },
  {
    id: "najm",
    arabic: "نَجْمُ",
    translit: "naj! - mu",
    meaning: "Star (Qalqalah on Jeem!)",
    category: "qalqalah",
    hasQalqalah: true,
    imageUrl: "/Tajwedo-Public-Assets/Services/New Muslims.webp",
    sceneCaption: "Bright night sky stars over snowy mountain (نَجْم)",
    steps: [
      { ar: "نَجْ", tr: "naj! (Echo Bounce)", role: "collision" },
      { ar: "مُ", tr: "mu", role: "vowel" },
    ],
  },
  {
    id: "habl",
    arabic: "حَبْلُ",
    translit: "hab! - lu",
    meaning: "Rope (Qalqalah on Ba!)",
    category: "qalqalah",
    hasQalqalah: true,
    imageUrl: "/Tajwedo-Public-Assets/curriculum-Imag/Quran Recitation.webp",
    sceneCaption: "Strong braided ship rope (حَبْل)",
    steps: [
      { ar: "حَبْ", tr: "hab! (Echo Bounce)", role: "collision" },
      { ar: "لُ", tr: "lu", role: "vowel" },
    ],
  },
  {
    id: "qalb",
    arabic: "قَلْبُ",
    translit: "qal - bu",
    meaning: "Heart",
    category: "everyday",
    hasQalqalah: false,
    imageUrl: "/Tajwedo-Public-Assets/curriculum-Imag/Quran Recitation.webp",
    sceneCaption: "Warm light symbolizing a pure heart (قَلْب)",
    steps: [
      { ar: "قَلْ", tr: "qal (Collision!)", role: "collision" },
      { ar: "بُ", tr: "bu", role: "vowel" },
    ],
  },
  {
    id: "bait",
    arabic: "بَيْتُ",
    translit: "bay - tu",
    meaning: "House / Home",
    category: "everyday",
    hasQalqalah: false,
    imageUrl: "/Tajwedo-Public-Assets/curriculum-Imag/Kids Program.webp",
    sceneCaption: "Cozy welcoming house surrounded by nature (بَيْت)",
    steps: [
      { ar: "بَيْ", tr: "bay (Soft Ya Sukun)", role: "collision" },
      { ar: "تُ", tr: "tu", role: "vowel" },
    ],
  },
  {
    id: "masjid",
    arabic: "مَسْجِدُ",
    translit: "mas - ji - du",
    meaning: "Mosque / Masjid",
    category: "quranic",
    hasQalqalah: false,
    imageUrl: "/Tajwedo-Public-Assets/curriculum-Imag/Islamic Studies.webp",
    sceneCaption: "Beautiful illuminated Masjid dome (مَسْجِد)",
    steps: [
      { ar: "مَسْ", tr: "mas (Collision!)", role: "collision" },
      { ar: "جِ", tr: "ji", role: "vowel" },
      { ar: "دُ", tr: "du", role: "vowel" },
    ],
  },
  {
    id: "yaqra",
    arabic: "يَقْرَأُ",
    translit: "yaq! - ra - u",
    meaning: "He reads / recites",
    category: "quranic",
    hasQalqalah: true,
    imageUrl: "/Tajwedo-Public-Assets/curriculum-Imag/Tajweed.webp",
    sceneCaption: "Reading and reciting the Noble Quran (يَقْرَأُ)",
    steps: [
      { ar: "يَقْ", tr: "yaq! (Qaf Echo!)", role: "collision" },
      { ar: "رَ", tr: "ra", role: "vowel" },
      { ar: "أُ", tr: "u", role: "vowel" },
    ],
  },
];

const SUKUN_GAME_QUESTIONS: GameQuestion[] = [
  {
    id: 1,
    mode: "spot_sukun",
    prompt: "Which letter in the word شَمْسُ (shamsu) carries the Sukun mark?",
    bigDisplay: "شَمْسُ",
    audioText: "شَمْسُ",
    imageUrl: "/Tajwedo-Public-Assets/curriculum-Imag/herosection-booking.webp",
    options: ["شَ (Sheen)", "مْ (Meem)", "سُ (Seen)"],
    correctIndex: 1,
    explanation: "Meem (مْ) has the small circle on top, so Sheen crashes into Meem: 'sham'!",
  },
  {
    id: 2,
    mode: "spot_sukun",
    prompt: "Can a letter with Sukun (ْ) ever be the FIRST letter of an Arabic word?",
    bigDisplay: "بْ ؟",
    options: ["No, never!", "Yes, always", "Only with Kasra"],
    correctIndex: 0,
    explanation: "Arabic never begins with a silent letter! A Sukun letter always needs a vocalized letter before it.",
  },
  {
    id: 3,
    mode: "qalqalah_hunter",
    prompt: "Which of these silent syllables makes a bouncing Qalqalah echo (قُطْبُ جَدٍ)?",
    bigDisplay: "أَقْ",
    audioText: "أَقْ",
    options: ["أَمْ (am)", "أَقْ (aq!)", "أَسْ (as)"],
    correctIndex: 1,
    explanation: "Qaf (ق) is one of the 5 Qalqalah letters (ق ط ب ج د), so أَقْ bounces with a clear echo!",
  },
  {
    id: 4,
    mode: "qalqalah_hunter",
    prompt: "Find the word that contains a Qalqalah bouncing letter in the middle:",
    bigDisplay: "نَجْمُ",
    audioText: "نَجْمُ",
    imageUrl: "/Tajwedo-Public-Assets/Services/New Muslims.webp",
    options: ["شَمْسُ (shamsu)", "نَجْمُ (najmu)", "بَحْرُ (bahru)"],
    correctIndex: 1,
    explanation: "In نَجْمُ (najmu), the middle letter Jeem (جْ) has Sukun and belongs to (قُطْبُ جَدٍ)!",
  },
  {
    id: 5,
    mode: "sound_match",
    prompt: 'Listen carefully: Which Arabic syllable makes the sound "ub!"?',
    audioText: "أُبْ",
    options: ["أَبْ", "أُبْ", "إِبْ"],
    correctIndex: 1,
    explanation: "أُبْ starts with Damma (u) and stops on Ba with Qalqalah: 'ub!'",
  },
  {
    id: 6,
    mode: "word_meaning",
    prompt: "Look at the picture and read the word مَسْجِدُ. What does it mean?",
    bigDisplay: "مَسْجِدُ",
    audioText: "مَسْجِدُ",
    imageUrl: "/Tajwedo-Public-Assets/curriculum-Imag/Islamic Studies.webp",
    options: ["Sun", "Mosque / Masjid", "Ocean"],
    correctIndex: 1,
    explanation: "مَسْجِدُ (mas-ji-du) means Mosque!",
  },
];

// ============================================================================
// CUSTOM SVG DIAGRAMS FOR SUKUN & QALQALAH
// ============================================================================

const SukunCollisionSVG: React.FC = () => (
  <svg viewBox="0 0 360 120" className="w-full max-w-md mx-auto h-28" aria-label="Sukun collision diagram">
    <rect width="360" height="120" rx="20" fill="#0284C7" fillOpacity="0.08" />
    {/* Moving Train/Ball (Vocalized Letter) */}
    <circle cx="85" cy="60" r="34" fill="#FF5A1F" />
    <text x="85" y="70" textAnchor="middle" fill="#FFFFFF" fontSize="28" fontWeight="bold">
      أَ
    </text>
    <text x="85" y="108" textAnchor="middle" fill="#FF5A1F" fontSize="11" fontWeight="bold">
      MOVING (Fatha)
    </text>

    {/* Collision Sparks */}
    <path d="M130 60 L195 60 M182 50 L196 60 L182 70" stroke="#0284C7" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="212" cy="40" r="4" fill="#F59E0B" />
    <circle cx="212" cy="80" r="4" fill="#F59E0B" />

    {/* Stationary Wall/Target (Sukun Letter) */}
    <rect x="225" y="26" width="68" height="68" rx="16" fill="#0284C7" />
    <text x="259" y="70" textAnchor="middle" fill="#FFFFFF" fontSize="28" fontWeight="bold">
      بْ
    </text>
    <text x="259" y="108" textAnchor="middle" fill="#0284C7" fontSize="11" fontWeight="bold">
      STILL (Sukun)
    </text>
  </svg>
);

// ============================================================================
// MAIN SUKUN LESSON COMPONENT
// ============================================================================

export default function SukunLesson() {
  const lessonCtx = useLesson();
  const darkMode = lessonCtx?.darkMode ?? false;

  const [englishHints, setEnglishHints] = useState<boolean>(true);
  const [textSizeScale, setTextSizeScale] = useState<number>(1.1);
  const [stars, setStars] = useState<number>(0);

  const [activeTab, setActiveTab] = useState<MainTab>("learn");
  const [slideIdx, setSlideIdx] = useState<number>(0);

  // Matrix Filters
  const [matrixSearch, setMatrixSearch] = useState<string>("");
  const [onlyQalqalah, setOnlyQalqalah] = useState<boolean>(false);
  const [activeSoundKey, setActiveSoundKey] = useState<string | null>(null);

  // Reading Lab State
  const [readingCat, setReadingCat] = useState<"all" | ReadingCategory>("all");
  const [readingIdx, setReadingIdx] = useState<number>(0);

  // Games State
  const [gameMode, setGameMode] = useState<GameModeId>("menu");
  const [qIndex, setQIndex] = useState<number>(0);
  const [pickedOption, setPickedOption] = useState<number | null>(null);
  const [qAnswered, setQAnswered] = useState<boolean>(false);
  const [sessionScore, setSessionScore] = useState<number>(0);
  const [gameFinished, setGameFinished] = useState<boolean>(false);

  const filteredMatrixRows = useMemo(() => {
    return SUKUN_MATRIX_28.filter((row) => {
      if (onlyQalqalah && !row.isQalqalah) return false;
      if (!matrixSearch.trim()) return true;
      const q = matrixSearch.toLowerCase().trim();
      return (
        row.name.toLowerCase().includes(q) ||
        row.letter.includes(q) ||
        row.withFatha.tr.toLowerCase().includes(q)
      );
    });
  }, [matrixSearch, onlyQalqalah]);

  const filteredReadingWords = useMemo(() => {
    if (readingCat === "all") return SUKUN_READING_WORDS;
    return SUKUN_READING_WORDS.filter((w) => w.category === readingCat);
  }, [readingCat]);

  const currentReadingWord = filteredReadingWords[readingIdx] || filteredReadingWords[0];

  const activeGameQuestions = useMemo(() => {
    if (gameMode === "menu") return [];
    if (gameMode === "final_test") return SUKUN_GAME_QUESTIONS;
    return SUKUN_GAME_QUESTIONS.filter((q) => q.mode === gameMode);
  }, [gameMode]);

  const currentGameQ = activeGameQuestions[qIndex];

  const triggerAudio = useCallback((text: string, key: string) => {
    setActiveSoundKey(key);
    playSound(text, 0.74);
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

  return (
    <div
      className={`min-h-screen w-full transition-colors duration-300 font-sans ${
        darkMode ? "bg-[#0B0F19] text-slate-100" : "bg-[#F8FAFC] text-slate-900"
      }`}
    >
      {/* ===================================================================
          UNIFIED SINGLE STUDIO DOCK (CONSISTENT ACROSS ALL 12 LESSONS)
         =================================================================== */}
      <div
        className={`sticky top-20 z-30 w-full border-b backdrop-blur-xl transition-all ${
          darkMode
            ? "bg-[#0B0F19]/90 border-slate-800/80 shadow-lg shadow-black/20"
            : "bg-white/90 border-slate-200/80 shadow-xs"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3 flex flex-wrap items-center justify-between gap-4">
          {/* Left: Course Link + Lesson Badge */}
          <div className="flex items-center gap-3">
            <Link
              href="/en/curriculum/noor-al-bayan"
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
              onClick={() => playSound("أَبْ", 0.72)}
              className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#0284C7] to-[#0D9488] text-white flex items-center justify-center shadow-md shadow-sky-500/20 hover:scale-105 transition"
            >
              <span dir="rtl" className="text-2xl font-serif font-bold">
                أَبْ
              </span>
            </button>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-extrabold tracking-tight leading-none">
                  Sukun & Qalqalah (السُّكُون)
                </h1>
                <span className="hidden md:inline-block px-2 py-0.5 rounded-md text-[11px] font-extrabold uppercase bg-sky-500/15 text-[#0284C7] dark:text-sky-400">
                  Lesson 2
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                The Silence Mark (ْ) & Echo Letters (قُطْبُ جَدٍ)
              </p>
            </div>
          </div>

          {/* Center: 4 Main Studio Tabs */}
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
              { id: "chart", label: "Sukun Matrix", icon: Grid },
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
                      ? "bg-gradient-to-r from-[#0284C7] to-[#0D9488] text-white shadow-md shadow-sky-600/25"
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

          {/* Right: Stars + Font Slider + Hints */}
          <div className="flex items-center gap-2.5">
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

            <div
              className={`hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl border ${
                darkMode
                  ? "bg-slate-900 border-slate-800"
                  : "bg-slate-100/80 border-slate-200/80"
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-[#0284C7]" />
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
                className="w-20 h-1.5 bg-sky-500/30 rounded-lg appearance-none cursor-pointer accent-[#0284C7]"
              />
            </div>

            <button
              type="button"
              onClick={() => setEnglishHints((prev) => !prev)}
              className={`px-3.5 py-2 rounded-xl border text-xs font-bold inline-flex items-center gap-1.5 transition ${
                englishHints
                  ? "bg-[#0284C7]/15 border-[#0284C7]/40 text-[#0284C7] dark:text-sky-300"
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
          MAIN LESSON STAGE
         =================================================================== */}
      <main className="max-w-7xl mx-auto px-4 sm:px-8 py-10">
        {/* =================================================================
            TAB 1: LEARN & VISUAL SLIDESHOW (WITH RICH PHOTOGRAPHIC SCENES)
           ================================================================= */}
        {activeTab === "learn" && (
          <div className="space-y-16">
            {/* SECTION A: 3 ILLUSTRATED CONCEPT CARDS */}
            <section className="space-y-8">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                  <span className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-widest text-[#0284C7] dark:text-sky-400">
                    <Sparkles className="w-3.5 h-3.5" /> Lesson 2 • Visual Guide
                  </span>
                  <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight mt-1">
                    Mastering Sukun & The Qalqalah Echo
                  </h2>
                </div>
                <p
                  className={`text-sm sm:text-base max-w-md ${
                    darkMode ? "text-slate-400" : "text-slate-600"
                  }`}
                >
                  Tap any card or syllable below to hear how a moving letter
                  connects into a silent Sukun letter.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-7">
                {SUKUN_CONCEPT_CARDS.map((card) => (
                  <div
                    key={card.id}
                    onClick={() => playSound(card.audioSample, 0.72)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        playSound(card.audioSample, 0.72);
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

                    {/* Visual Scene Banner Photo */}
                    <div className="relative h-40 w-full overflow-hidden">
                      <img
                        src={card.imageUrl}
                        alt={card.imageAlt}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent" />
                      <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between">
                        <span
                          className={`px-3.5 py-1 rounded-full text-xs font-extrabold tracking-wide ${card.badgeClass}`}
                        >
                          {card.badge}
                        </span>
                        <span className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-md text-white flex items-center justify-center">
                          <Volume2 className="w-4 h-4" />
                        </span>
                      </div>
                    </div>

                    <div className="p-6 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-baseline justify-between">
                          <h3 className="text-xl font-extrabold">{card.titleEn}</h3>
                          <span
                            dir="rtl"
                            className={`text-xl font-serif font-bold ${card.accentText}`}
                          >
                            {card.titleAr}
                          </span>
                        </div>
                        <p className={`text-xs font-bold mt-1 ${card.accentText}`}>
                          {card.subtitle}
                        </p>

                        {/* Giant Arabic Pedestal */}
                        <div
                          className={`my-5 py-5 rounded-3xl border text-center transition-colors ${
                            darkMode ? card.softBgDark : card.softBgLight
                          } ${card.pillBorder}`}
                        >
                          <span
                            dir="rtl"
                            style={{
                              fontSize: `${Math.round(4.4 * textSizeScale)}rem`,
                              lineHeight: 1.15,
                            }}
                            className={`font-serif font-bold inline-block transition-transform duration-300 group-hover:scale-105 ${card.accentText}`}
                          >
                            {card.sampleAr}
                          </span>
                        </div>

                        <p
                          className={`text-sm leading-relaxed ${
                            darkMode ? "text-slate-300" : "text-slate-600"
                          }`}
                        >
                          {card.description}
                        </p>

                        <div
                          className={`mt-4 p-3.5 rounded-2xl border text-xs leading-relaxed font-semibold ${
                            darkMode
                              ? "bg-[#0B0F19] border-slate-800 text-slate-300"
                              : "bg-slate-50 border-slate-200/80 text-slate-700"
                          }`}
                        >
                          {card.mechanicNote}
                        </div>
                      </div>

                      {/* 4 Clickable Syllables */}
                      <div
                        className="mt-6 pt-4 border-t border-slate-200/70 dark:border-slate-800"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <span className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-400 mb-2.5">
                          Tap to Hear Examples:
                        </span>
                        <div dir="rtl" className="grid grid-cols-4 gap-2">
                          {card.examples.map((ex, i) => (
                            <button
                              key={i}
                              type="button"
                              onClick={() => playSound(ex.ar, 0.74)}
                              className={`py-2.5 px-1 rounded-2xl border text-center transition hover:-translate-y-0.5 ${
                                darkMode
                                  ? "bg-[#0B0F19] border-slate-800 hover:border-slate-600"
                                  : "bg-slate-50 border-slate-200/80 hover:bg-white hover:shadow-xs"
                              }`}
                            >
                              <span
                                className={`block text-2xl font-serif font-bold ${card.accentText}`}
                              >
                                {ex.ar}
                              </span>
                              {englishHints && (
                                <span
                                  dir="ltr"
                                  className="block text-[11px] font-extrabold text-slate-500 dark:text-slate-400 mt-0.5"
                                >
                                  {ex.tr}
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

            {/* SECTION B: VISUAL CLASSROOM SLIDESHOW (POWERPOINT REPLACEMENT) */}
            <section className="space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#0284C7] to-[#0D9488] text-white flex items-center justify-center shadow-md shadow-sky-500/20">
                    <Presentation className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-xl sm:text-2xl font-extrabold">
                      Visual Classroom Slideshow
                    </h2>
                    <p
                      className={`text-xs sm:text-sm ${
                        darkMode ? "text-slate-400" : "text-slate-600"
                      }`}
                    >
                      Rich illustrated slides for Zoom screen-sharing & student
                      mastery
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  {[
                    "1. The Magnet Rule",
                    "2. Qalqalah 5 Letters",
                    "3. Meaning Changer",
                  ].map((label, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSlideIdx(idx)}
                      className={`px-4 py-2 rounded-xl text-xs font-extrabold transition ${
                        slideIdx === idx
                          ? "bg-[#0284C7] text-white shadow-md shadow-sky-600/25"
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
                {/* SLIDE 1: MAGNET / COLLISION MECHANICS */}
                {slideIdx === 0 && (
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
                    <div className="lg:col-span-6 space-y-4">
                      <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider bg-sky-500/15 text-[#0284C7] dark:text-sky-400">
                        <Magnet className="w-3.5 h-3.5" /> Slide 1 of 3 • The Magnet Rule
                      </span>
                      <h3 className="text-2xl sm:text-3xl font-extrabold leading-tight">
                        Why Can’t Sukun Stand Alone?
                      </h3>
                      <p
                        className={`text-sm sm:text-base leading-relaxed ${
                          darkMode ? "text-slate-300" : "text-slate-600"
                        }`}
                      >
                        Think of a Sukun letter like a train carriage without an
                        engine! It cannot move by itself. It needs a vocalized
                        letter (with Fatha, Damma, or Kasra) right before it to
                        pull it into one combined syllable.
                      </p>
                      <SukunCollisionSVG />
                    </div>

                    <div className="lg:col-span-6 space-y-4">
                      <div className="grid grid-cols-3 gap-3">
                        {[
                          { ar: "أَبْ", tr: "a + b = ab", color: "border-[#FF5A1F] text-[#FF5A1F] bg-[#FF5A1F]/10" },
                          { ar: "أُبْ", tr: "u + b = ub", color: "border-[#00A86B] text-[#00A86B] bg-[#00A86B]/10" },
                          { ar: "إِبْ", tr: "i + b = ib", color: "border-[#7C3AED] text-[#7C3AED] bg-[#7C3AED]/10" },
                        ].map((item, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => playSound(item.ar, 0.72)}
                            className={`p-5 rounded-3xl border-2 text-center transition hover:scale-105 ${item.color}`}
                          >
                            <span dir="rtl" className="block text-5xl font-serif font-bold">
                              {item.ar}
                            </span>
                            <span className="block text-xs font-extrabold mt-2">
                              {item.tr}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* SLIDE 2: THE 5 QALQALAH LETTERS */}
                {slideIdx === 1 && (
                  <div className="space-y-6 text-center">
                    <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider bg-orange-500/15 text-[#FF5A1F]">
                      <Radio className="w-3.5 h-3.5" /> Slide 2 of 3 • Qalqalah Echo (قُطْبُ جَدٍ)
                    </span>
                    <h3 className="text-2xl sm:text-3xl font-extrabold">
                      Tap the 5 Bouncing Letters of Qalqalah!
                    </h3>
                    <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
                      When any of these 5 letters has a Sukun, release your
                      tongue or lips with a quick, crisp echo (without adding a
                      Fatha!).
                    </p>

                    <div dir="rtl" className="grid grid-cols-2 sm:grid-cols-5 gap-4 pt-2">
                      {[
                        { l: "قْ", sample: "أَقْ", name: "Qaf", tr: "aq!" },
                        { l: "طْ", sample: "أَطْ", name: "Taa", tr: "at!" },
                        { l: "بْ", sample: "أَبْ", name: "Ba", tr: "ab!" },
                        { l: "جْ", sample: "أَجْ", name: "Jeem", tr: "aj!" },
                        { l: "دْ", sample: "أَدْ", name: "Dal", tr: "ad!" },
                      ].map((qItem, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => playSound(qItem.sample, 0.72)}
                          className={`p-6 rounded-3xl border-2 border-[#FF5A1F]/40 bg-[#FF5A1F]/10 hover:bg-[#FF5A1F]/20 transition hover:-translate-y-1 text-center`}
                        >
                          <span className="block text-5xl font-serif font-bold text-[#FF5A1F]">
                            {qItem.sample}
                          </span>
                          <span
                            dir="ltr"
                            className="block text-sm font-extrabold mt-2"
                          >
                            {qItem.name} ({qItem.tr})
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* SLIDE 3: MEANING CHANGER (FATHA VS SUKUN) */}
                {slideIdx === 2 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                    <div
                      onClick={() => playSound("عَلَمُ", 0.72)}
                      className="p-7 rounded-3xl border-2 border-[#FF5A1F]/40 bg-[#FF5A1F]/10 cursor-pointer space-y-3"
                    >
                      <span className="px-3.5 py-1 rounded-full text-xs font-extrabold bg-[#FF5A1F] text-white">
                        WITH FATHA ON LAM (3 Syllables)
                      </span>
                      <div dir="rtl" className="text-6xl font-serif font-bold text-[#FF5A1F]">
                        عَلَمُ
                      </div>
                      <p className="text-lg font-extrabold">‘a - la - mu = Flag!</p>
                      <p className="text-xs sm:text-sm opacity-80">
                        Because Lam has a Fatha, it makes 3 separate beats and means &ldquo;Flag&rdquo;.
                      </p>
                    </div>

                    <div
                      onClick={() => playSound("عِلْمُ", 0.72)}
                      className="p-7 rounded-3xl border-2 border-[#0284C7]/40 bg-[#0284C7]/10 cursor-pointer space-y-3"
                    >
                      <span className="px-3.5 py-1 rounded-full text-xs font-extrabold bg-[#0284C7] text-white">
                        WITH SUKUN ON LAM (2 Syllables)
                      </span>
                      <div dir="rtl" className="text-6xl font-serif font-bold text-[#0284C7]">
                        عِلْمُ
                      </div>
                      <p className="text-lg font-extrabold">‘il - mu = Knowledge!</p>
                      <p className="text-xs sm:text-sm opacity-80">
                        Putting Sukun on Lam merges the first two letters into &ldquo;‘il&rdquo;, meaning &ldquo;Knowledge&rdquo;!
                      </p>
                    </div>
                  </div>
                )}

                <div className="mt-8 pt-5 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setSlideIdx((p) => (p === 0 ? 2 : p - 1))}
                    className={`px-4 py-2.5 rounded-xl text-xs font-extrabold border inline-flex items-center gap-1.5 ${
                      darkMode
                        ? "bg-[#0B0F19] border-slate-800 text-slate-300"
                        : "bg-slate-100 border-slate-200 text-slate-700"
                    }`}
                  >
                    <ChevronLeft className="w-4 h-4" /> Previous Slide
                  </button>
                  <span className="text-xs font-extrabold text-slate-400">
                    Slide {slideIdx + 1} of 3
                  </span>
                  <button
                    type="button"
                    onClick={() => setSlideIdx((p) => (p === 2 ? 0 : p + 1))}
                    className="px-5 py-2.5 rounded-xl text-xs font-extrabold bg-[#0284C7] text-white inline-flex items-center gap-1.5 shadow-md"
                  >
                    Next Slide <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* =================================================================
            TAB 2: INTERACTIVE SUKUN MATRIX (WITH QALQALAH FILTER)
           ================================================================= */}
        {activeTab === "chart" && (
          <section className="space-y-8">
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
              <div>
                <span className="text-xs font-extrabold uppercase tracking-widest text-[#0284C7] dark:text-sky-400">
                  Interactive Collision Chart
                </span>
                <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight mt-1">
                  Sukun Sound Matrix
                </h2>
                <p
                  className={`mt-1 text-sm sm:text-base ${
                    darkMode ? "text-slate-400" : "text-slate-600"
                  }`}
                >
                  Tap any tile to hear Alif with Fatha, Damma, or Kasra colliding
                  into each silent letter.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={matrixSearch}
                    onChange={(e) => setMatrixSearch(e.target.value)}
                    placeholder="Search letter..."
                    className={`pl-10 pr-4 py-2.5 rounded-2xl text-xs sm:text-sm font-semibold border outline-none ${
                      darkMode
                        ? "bg-[#111827] border-slate-800 text-white"
                        : "bg-white border-slate-200 text-slate-800 shadow-2xs"
                    }`}
                  />
                </div>

                <button
                  type="button"
                  onClick={() => setOnlyQalqalah((prev) => !prev)}
                  className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-extrabold border transition inline-flex items-center gap-2 ${
                    onlyQalqalah
                      ? "bg-[#FF5A1F] border-[#FF5A1F] text-white shadow-md shadow-orange-500/25"
                      : darkMode
                      ? "bg-[#111827] border-slate-800 text-slate-300"
                      : "bg-white border-slate-200 text-slate-700"
                  }`}
                >
                  <Radio className="w-4 h-4" />
                  <span>
                    {onlyQalqalah ? "Showing 5 Qalqalah Only" : "Filter Qalqalah (قُطْبُ جَدٍ)"}
                  </span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredMatrixRows.map((row) => (
                <div
                  key={row.name}
                  className={`rounded-3xl border p-4 sm:p-5 flex items-center justify-between gap-4 transition-all ${
                    darkMode
                      ? "bg-[#111827] border-slate-800/90"
                      : "bg-white border-slate-200/80 shadow-sm"
                  }`}
                >
                  {/* Base Letter + Qalqalah Badge */}
                  <div className="w-24 shrink-0 text-center border-r pr-4 border-slate-200/70 dark:border-slate-800">
                    <div
                      dir="rtl"
                      style={{ fontSize: `${Math.round(2.2 * textSizeScale)}rem` }}
                      className="font-serif font-bold leading-none"
                    >
                      {row.letter}ْ
                    </div>
                    {englishHints && (
                      <span className="block text-xs font-extrabold text-slate-400 mt-1.5">
                        {row.name}
                      </span>
                    )}
                    {row.isQalqalah && (
                      <span className="mt-1.5 inline-block px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-[#FF5A1F]/15 text-[#FF5A1F]">
                        Qalqalah!
                      </span>
                    )}
                  </div>

                  {/* 3 Collision Tiles */}
                  <div className="flex-1 grid grid-cols-3 gap-3">
                    <button
                      type="button"
                      onClick={() =>
                        triggerAudio(row.withFatha.ar, `${row.name}-f`)
                      }
                      className={`rounded-2xl py-3 px-2 border-2 text-center transition flex flex-col items-center ${
                        activeSoundKey === `${row.name}-f`
                          ? "bg-[#FF5A1F] text-white border-[#FF5A1F] scale-95"
                          : darkMode
                          ? "bg-[#FF5A1F]/10 border-[#FF5A1F]/30 text-[#FF7A45]"
                          : "bg-[#FFF6F2] border-[#FFD5C2] text-[#FF5A1F]"
                      }`}
                    >
                      <span
                        dir="rtl"
                        style={{
                          fontSize: `${Math.round(2.1 * textSizeScale)}rem`,
                        }}
                        className="font-serif font-bold"
                      >
                        {row.withFatha.ar}
                      </span>
                      {englishHints && (
                        <span className="text-xs font-extrabold mt-0.5">
                          {row.withFatha.tr}
                        </span>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        triggerAudio(row.withDamma.ar, `${row.name}-d`)
                      }
                      className={`rounded-2xl py-3 px-2 border-2 text-center transition flex flex-col items-center ${
                        activeSoundKey === `${row.name}-d`
                          ? "bg-[#00A86B] text-white border-[#00A86B] scale-95"
                          : darkMode
                          ? "bg-[#00A86B]/10 border-[#00A86B]/30 text-[#34D399]"
                          : "bg-[#F2FBF7] border-[#BCEFD8] text-[#00A86B]"
                      }`}
                    >
                      <span
                        dir="rtl"
                        style={{
                          fontSize: `${Math.round(2.1 * textSizeScale)}rem`,
                        }}
                        className="font-serif font-bold"
                      >
                        {row.withDamma.ar}
                      </span>
                      {englishHints && (
                        <span className="text-xs font-extrabold mt-0.5">
                          {row.withDamma.tr}
                        </span>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        triggerAudio(row.withKasra.ar, `${row.name}-k`)
                      }
                      className={`rounded-2xl py-3 px-2 border-2 text-center transition flex flex-col items-center ${
                        activeSoundKey === `${row.name}-k`
                          ? "bg-[#7C3AED] text-white border-[#7C3AED] scale-95"
                          : darkMode
                          ? "bg-[#7C3AED]/10 border-[#7C3AED]/30 text-[#A78BFA]"
                          : "bg-[#F8F5FF] border-[#E0D1FF] text-[#7C3AED]"
                      }`}
                    >
                      <span
                        dir="rtl"
                        style={{
                          fontSize: `${Math.round(2.1 * textSizeScale)}rem`,
                        }}
                        className="font-serif font-bold"
                      >
                        {row.withKasra.ar}
                      </span>
                      {englishHints && (
                        <span className="text-xs font-extrabold mt-0.5">
                          {row.withKasra.tr}
                        </span>
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* =================================================================
            TAB 3: VISUAL READING LAB (WITH REAL PHOTOGRAPHIC SCENES!)
           ================================================================= */}
        {activeTab === "reading" && (
          <section className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <span className="text-xs font-extrabold uppercase tracking-widest text-[#0284C7] dark:text-sky-400">
                  Illustrated Word Lab
                </span>
                <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight mt-1">
                  Visual Reading Practice
                </h2>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {[
                  { id: "all", label: "All Words" },
                  { id: "nature", label: "Nature" },
                  { id: "qalqalah", label: "Qalqalah Words" },
                  { id: "quranic", label: "Quranic & Daily" },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => {
                      setReadingCat(tab.id as "all" | ReadingCategory);
                      setReadingIdx(0);
                    }}
                    className={`px-4 py-2 rounded-2xl text-xs sm:text-sm font-extrabold transition ${
                      readingCat === tab.id
                        ? "bg-[#0284C7] text-white shadow-md"
                        : darkMode
                        ? "bg-[#111827] border border-slate-800 text-slate-300"
                        : "bg-white border border-slate-200 text-slate-700"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {currentReadingWord && (
              <div
                className={`rounded-3xl border overflow-hidden transition-all ${
                  darkMode
                    ? "bg-[#111827] border-slate-800 shadow-2xl"
                    : "bg-white border-slate-200/90 shadow-xl"
                }`}
              >
                <div className="grid grid-cols-1 lg:grid-cols-12">
                  {/* Left: Photographic Scene + Word Spotlight */}
                  <div className="lg:col-span-6 relative flex flex-col justify-between p-8 sm:p-10 bg-gradient-to-br from-sky-950 to-slate-900 text-white">
                    <img
                      src={currentReadingWord.imageUrl}
                      alt={currentReadingWord.meaning}
                      className="absolute inset-0 w-full h-full object-cover opacity-40"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/50 to-slate-950/30" />

                    <div className="relative z-10 flex items-center justify-between">
                      <span className="px-3.5 py-1 rounded-full text-xs font-extrabold bg-white/15 backdrop-blur-md">
                        Word {readingIdx + 1} of {filteredReadingWords.length}
                      </span>
                      {currentReadingWord.hasQalqalah && (
                        <span className="px-3.5 py-1 rounded-full text-xs font-extrabold bg-[#FF5A1F] text-white">
                          Contains Qalqalah Echo!
                        </span>
                      )}
                    </div>

                    <div className="relative z-10 my-10 text-center">
                      <button
                        type="button"
                        onClick={() =>
                          playSound(currentReadingWord.arabic, 0.7)
                        }
                        className="group focus:outline-none"
                      >
                        <div
                          dir="rtl"
                          style={{
                            fontSize: `${Math.round(5.8 * textSizeScale)}rem`,
                            lineHeight: 1.15,
                          }}
                          className="font-serif font-bold text-white drop-shadow-lg transition-transform group-hover:scale-105"
                        >
                          {currentReadingWord.arabic}
                        </div>
                      </button>

                      {englishHints && (
                        <div className="mt-4 space-y-1">
                          <div className="text-2xl font-extrabold text-sky-300">
                            {currentReadingWord.translit}
                          </div>
                          <div className="text-lg font-bold text-white">
                            &ldquo;{currentReadingWord.meaning}&rdquo;
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="relative z-10 text-xs text-slate-300 text-center">
                      {currentReadingWord.sceneCaption}
                    </div>
                  </div>

                  {/* Right: Step-by-Step Syllable Collision Breakdown */}
                  <div className="lg:col-span-6 p-8 sm:p-10 flex flex-col justify-between space-y-8">
                    <div className="space-y-4">
                      <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
                        Syllable Breakdown (Notice how the Sukun merges 2 letters!)
                      </span>

                      <div
                        dir="rtl"
                        className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-2"
                      >
                        {currentReadingWord.steps.map((st, i) => (
                          <button
                            key={i}
                            type="button"
                            onClick={() => playSound(st.ar, 0.72)}
                            className={`p-6 rounded-3xl border-2 text-center transition hover:-translate-y-1 ${
                              st.role === "collision"
                                ? "border-[#0284C7] bg-[#0284C7]/10 text-[#0284C7] dark:text-sky-300"
                                : "border-[#00A86B]/50 bg-[#00A86B]/10 text-[#00A86B] dark:text-emerald-300"
                            }`}
                          >
                            <span className="block text-5xl font-serif font-bold">
                              {st.ar}
                            </span>
                            {englishHints && (
                              <span
                                dir="ltr"
                                className="block text-xs font-extrabold mt-3"
                              >
                                {st.tr}
                              </span>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                      <button
                        type="button"
                        onClick={() =>
                          setReadingIdx((p) =>
                            p === 0 ? filteredReadingWords.length - 1 : p - 1
                          )
                        }
                        className={`flex-1 py-3.5 px-4 rounded-2xl font-extrabold text-sm border inline-flex items-center justify-center gap-2 ${
                          darkMode
                            ? "bg-[#0B0F19] border-slate-800"
                            : "bg-slate-100 border-slate-200"
                        }`}
                      >
                        <ChevronLeft className="w-4 h-4" /> Previous
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          playSound(currentReadingWord.arabic, 0.7)
                        }
                        className="px-7 py-3.5 rounded-2xl font-extrabold text-sm bg-[#0284C7] hover:bg-sky-700 text-white inline-flex items-center gap-2 shadow-lg"
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
                        className={`flex-1 py-3.5 px-4 rounded-2xl font-extrabold text-sm border inline-flex items-center justify-center gap-2 ${
                          darkMode
                            ? "bg-[#0B0F19] border-slate-800"
                            : "bg-slate-100 border-slate-200"
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
            TAB 4: GAMES & MASTERY QUIZZES
           ================================================================= */}
        {activeTab === "games" && (
          <section className="space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-extrabold uppercase tracking-widest text-[#0284C7] dark:text-sky-400">
                  Interactive Challenges
                </span>
                <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight mt-1">
                  Sukun & Qalqalah Games
                </h2>
              </div>
              {gameMode !== "menu" && (
                <button
                  type="button"
                  onClick={() => setGameMode("menu")}
                  className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-extrabold border inline-flex items-center gap-2 ${
                    darkMode
                      ? "bg-[#111827] border-slate-800 text-slate-200"
                      : "bg-white border-slate-200 text-slate-700"
                  }`}
                >
                  <ChevronLeft className="w-4 h-4" /> All Games
                </button>
              )}
            </div>

            {gameMode === "menu" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  { mode: "spot_sukun", title: "Spot the Sukun", desc: "Find the silent letter and master the collision rule.", icon: Eye, topBar: "bg-[#0284C7]", iconColor: "text-[#0284C7] bg-[#0284C7]/10" },
                  { mode: "qalqalah_hunter", title: "Qalqalah Hunter", desc: "Identify which silent letters bounce with an echo (قُطْبُ جَدٍ).", icon: Radio, topBar: "bg-[#FF5A1F]", iconColor: "text-[#FF5A1F] bg-[#FF5A1F]/10" },
                  { mode: "sound_match", title: "Sound Match", desc: "Listen to the syllable and pick the matching Arabic.", icon: Ear, topBar: "bg-[#00A86B]", iconColor: "text-[#00A86B] bg-[#00A86B]/10" },
                  { mode: "word_meaning", title: "Picture & Word", desc: "Match the illustrated scene with the Arabic word.", icon: BookOpen, topBar: "bg-[#7C3AED]", iconColor: "text-[#7C3AED] bg-[#7C3AED]/10" },
                  { mode: "final_test", title: "Final Mastery Quiz", desc: "Complete all mixed questions to earn your stars!", icon: Trophy, topBar: "bg-amber-500", iconColor: "text-amber-500 bg-amber-500/10" },
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
                          : "bg-white border-slate-200/90 hover:border-slate-300 shadow-lg"
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

                {currentGameQ.imageUrl && (
                  <div className="mb-6 rounded-2xl overflow-hidden h-44 max-w-md mx-auto border border-slate-700/30">
                    <img
                      src={currentGameQ.imageUrl}
                      alt="Question visual hint"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                <h3 className="text-xl sm:text-2xl font-extrabold text-center mb-6">
                  {currentGameQ.prompt}
                </h3>

                {currentGameQ.bigDisplay && (
                  <div className="my-6 text-center">
                    <button
                      type="button"
                      onClick={() =>
                        currentGameQ.audioText &&
                        playSound(currentGameQ.audioText, 0.74)
                      }
                      className={`px-12 py-6 rounded-3xl border-2 inline-flex flex-col items-center gap-2 transition hover:scale-105 ${
                        darkMode
                          ? "bg-[#0B0F19] border-slate-800"
                          : "bg-slate-50 border-slate-200"
                      }`}
                    >
                      <span
                        dir="rtl"
                        style={{
                          fontSize: `${Math.round(4.2 * textSizeScale)}rem`,
                        }}
                        className="font-serif font-bold text-[#0284C7] leading-none"
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
                      ? "bg-[#0B0F19] border-slate-800 hover:border-[#0284C7]"
                      : "bg-slate-50 border-slate-200 hover:border-[#0284C7]";

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
                      className="px-6 py-3 rounded-2xl bg-[#0284C7] hover:bg-sky-700 text-white font-extrabold text-sm inline-flex items-center gap-2 shrink-0"
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
                  Masha’Allah! Sukun Mastered!
                </h3>
                <p className="text-slate-500 dark:text-slate-300">
                  You scored{" "}
                  <strong>
                    {sessionScore} / {activeGameQuestions.length}
                  </strong>{" "}
                  and earned <strong>{stars} total stars</strong>!
                </p>
                <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
                  <button
                    type="button"
                    onClick={() => startGame(gameMode)}
                    className="px-6 py-3 rounded-2xl bg-[#0284C7] text-white font-extrabold text-sm inline-flex items-center gap-2"
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