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
  Bell,
  Scale,
  AlertCircle
} from "lucide-react";
import { useLesson } from "../shared/LessonContext";

type MainTab = "learn" | "chart" | "reading" | "games";
type TanweenType = "fathatan" | "dammatan" | "kasratan";
type GameModeId = "menu" | "identify_tanween" | "alif_helper" | "sound_match" | "word_meaning" | "final_test";

interface TanweenCardData {
  id: TanweenType;
  badge: string;
  nameAr: string;
  sampleAr: string;
  audioSample: string;
  soundTitle: string;
  phoneticFormula: string;
  placement: string;
  orthographyRule: string;
  imageUrl: string;
  imageAlt: string;
  topBarClass: string;
  badgeClass: string;
  accentText: string;
  softBgLight: string;
  softBgDark: string;
  pillBorder: string;
  examples: { ar: string; tr: string }[];
}

interface TanweenMatrixRow {
  letter: string;
  name: string;
  fathatan: { ar: string; tr: string };
  dammatan: { ar: string; tr: string };
  kasratan: { ar: string; tr: string };
}

interface TanweenReadingWord {
  id: string;
  arabic: string;
  translit: string;
  meaning: string;
  type: TanweenType;
  imageUrl: string;
  sceneCaption: string;
  breakdown: { ar: string; tr: string; isTanween?: boolean }[];
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

const TANWEEN_CARDS: TanweenCardData[] = [
  {
    id: "fathatan",
    badge: "Tanween Fath",
    nameAr: "تَنْوِينٌ بِالفَتْح",
    sampleAr: "بًا",
    audioSample: "بَنْ",
    soundTitle: 'Ends with "-an"',
    phoneticFormula: "Fatha + Hidden Noon (ـَ + نْ = ـً)",
    placement: "Double Fatha above the last letter + Helper Alif (ا)",
    orthographyRule:
      "Tanween Fath almost always needs a silent Helper Alif (ا) at the end (like بًا, كِتَابًا), EXCEPT when the word ends in Taa Marbuta (ةً) or Hamza (ءً)!",
    imageUrl: "/Tajwedo-Public-Assets/Services/Arabic Language.webp",
    imageAlt: "Open classic book pages representing Kitaban",
    topBarClass: "bg-gradient-to-r from-[#FF5A1F] to-[#F59E0B]",
    badgeClass: "bg-[#FF5A1F] text-white shadow-sm shadow-orange-500/30",
    accentText: "text-[#FF5A1F] dark:text-[#FF7A45]",
    softBgLight: "bg-[#FFF8F5] hover:bg-[#FFF0E8]",
    softBgDark: "bg-[#181824] hover:bg-[#201E2E]",
    pillBorder: "border-[#FFD8C7] dark:border-[#3D2622]",
    examples: [
      { ar: "بًا", tr: "ban" },
      { ar: "تًا", tr: "tan" },
      { ar: "جًا", tr: "jan" },
      { ar: "دًا", tr: "dan" },
    ],
  },
  {
    id: "dammatan",
    badge: "Tanween Damm",
    nameAr: "تَنْوِينٌ بِالضَّمّ",
    sampleAr: "بٌ",
    audioSample: "بُنْ",
    soundTitle: 'Ends with "-un"',
    phoneticFormula: "Damma + Hidden Noon (ـُ + نْ = ـٌ)",
    placement: "Double Damma placed directly ABOVE the last letter",
    orthographyRule:
      "Tanween Damm sits right on top of the final letter without any extra Alif. Your lips round for 'u' and immediately touch the roof of the mouth for 'n'!",
    imageUrl: "/Tajwedo-Public-Assets/Services/Islamic Studies.webp",
    imageAlt: "Calm ocean horizon under bright sky",
    topBarClass: "bg-gradient-to-r from-[#00A86B] to-[#10B981]",
    badgeClass: "bg-[#00A86B] text-white shadow-sm shadow-emerald-500/30",
    accentText: "text-[#00A86B] dark:text-[#34D399]",
    softBgLight: "bg-[#F2FBF7] hover:bg-[#E6F8F0]",
    softBgDark: "bg-[#131F24] hover:bg-[#17282E]",
    pillBorder: "border-[#BCEFD8] dark:border-[#1E3B35]",
    examples: [
      { ar: "بٌ", tr: "bun" },
      { ar: "تٌ", tr: "tun" },
      { ar: "جٌ", tr: "jun" },
      { ar: "دٌ", tr: "dun" },
    ],
  },
  {
    id: "kasratan",
    badge: "Tanween Kasr",
    nameAr: "تَنْوِينٌ بِالكَسْر",
    sampleAr: "بٍ",
    audioSample: "بِنْ",
    soundTitle: 'Ends with "-in"',
    phoneticFormula: "Kasra + Hidden Noon (ـِ + نْ = ـٍ)",
    placement: "Double Kasra placed directly BELOW the last letter",
    orthographyRule:
      "Two parallel diagonal strokes sit underneath the final letter. Smile gently for 'i' and close with a crisp 'n' bell sound: '-in'!",
    imageUrl: "/Tajwedo-Public-Assets/curriculum-Imag/Quran Recitation.webp",
    imageAlt: "Tall green trees in sunlight representing Shajaratin",
    topBarClass: "bg-gradient-to-r from-[#7C3AED] to-[#A855F7]",
    badgeClass: "bg-[#7C3AED] text-white shadow-sm shadow-violet-500/30",
    accentText: "text-[#7C3AED] dark:text-[#A78BFA]",
    softBgLight: "bg-[#F9F6FF] hover:bg-[#F2ECFF]",
    softBgDark: "bg-[#19162B] hover:bg-[#221D3A]",
    pillBorder: "border-[#E2D4FF] dark:border-[#342654]",
    examples: [
      { ar: "بٍ", tr: "bin" },
      { ar: "تٍ", tr: "tin" },
      { ar: "جٍ", tr: "jin" },
      { ar: "دٍ", tr: "din" },
    ],
  },
];

const TANWEEN_MATRIX_28: TanweenMatrixRow[] = [
  { letter: "أ", name: "Alif", fathatan: { ar: "أً", tr: "an" }, dammatan: { ar: "أٌ", tr: "un" }, kasratan: { ar: "إٍ", tr: "in" } },
  { letter: "ب", name: "Ba", fathatan: { ar: "بًا", tr: "ban" }, dammatan: { ar: "بٌ", tr: "bun" }, kasratan: { ar: "بٍ", tr: "bin" } },
  { letter: "ت", name: "Ta", fathatan: { ar: "تًا", tr: "tan" }, dammatan: { ar: "تٌ", tr: "tun" }, kasratan: { ar: "تٍ", tr: "tin" } },
  { letter: "ث", name: "Tha", fathatan: { ar: "ثًا", tr: "than" }, dammatan: { ar: "ثٌ", tr: "thun" }, kasratan: { ar: "ثٍ", tr: "thin" } },
  { letter: "ج", name: "Jeem", fathatan: { ar: "جًا", tr: "jan" }, dammatan: { ar: "جٌ", tr: "jun" }, kasratan: { ar: "جٍ", tr: "jin" } },
  { letter: "ح", name: "Haa", fathatan: { ar: "حًا", tr: "han" }, dammatan: { ar: "حٌ", tr: "hun" }, kasratan: { ar: "حٍ", tr: "hin" } },
  { letter: "خ", name: "Khaa", fathatan: { ar: "خًا", tr: "khan" }, dammatan: { ar: "خٌ", tr: "khun" }, kasratan: { ar: "خٍ", tr: "khin" } },
  { letter: "د", name: "Dal", fathatan: { ar: "دًا", tr: "dan" }, dammatan: { ar: "دٌ", tr: "dun" }, kasratan: { ar: "دٍ", tr: "din" } },
  { letter: "ذ", name: "Dhal", fathatan: { ar: "ذًا", tr: "dhan" }, dammatan: { ar: "ذٌ", tr: "dhun" }, kasratan: { ar: "ذٍ", tr: "dhin" } },
  { letter: "ر", name: "Ra", fathatan: { ar: "رًا", tr: "ran" }, dammatan: { ar: "رٌ", tr: "run" }, kasratan: { ar: "رٍ", tr: "rin" } },
  { letter: "ز", name: "Zay", fathatan: { ar: "زًا", tr: "zan" }, dammatan: { ar: "زٌ", tr: "zun" }, kasratan: { ar: "زٍ", tr: "zin" } },
  { letter: "س", name: "Seen", fathatan: { ar: "سًا", tr: "san" }, dammatan: { ar: "سٌ", tr: "sun" }, kasratan: { ar: "سٍ", tr: "sin" } },
  { letter: "ش", name: "Sheen", fathatan: { ar: "شًا", tr: "shan" }, dammatan: { ar: "شٌ", tr: "shun" }, kasratan: { ar: "شٍ", tr: "shin" } },
  { letter: "ص", name: "Saad", fathatan: { ar: "صًا", tr: "san" }, dammatan: { ar: "صٌ", tr: "sun" }, kasratan: { ar: "صٍ", tr: "sin" } },
  { letter: "ض", name: "Daad", fathatan: { ar: "ضًا", tr: "dan" }, dammatan: { ar: "ضٌ", tr: "dun" }, kasratan: { ar: "ضٍ", tr: "din" } },
  { letter: "ط", name: "Taa", fathatan: { ar: "طًا", tr: "tan" }, dammatan: { ar: "طٌ", tr: "tun" }, kasratan: { ar: "طٍ", tr: "tin" } },
  { letter: "ظ", name: "Dhaa", fathatan: { ar: "ظًا", tr: "dhan" }, dammatan: { ar: "ظٌ", tr: "dhun" }, kasratan: { ar: "ظٍ", tr: "dhin" } },
  { letter: "ع", name: "Ayn", fathatan: { ar: "عًا", tr: "‘an" }, dammatan: { ar: "عٌ", tr: "‘un" }, kasratan: { ar: "عٍ", tr: "‘in" } },
  { letter: "غ", name: "Ghayn", fathatan: { ar: "غًا", tr: "ghan" }, dammatan: { ar: "غٌ", tr: "ghun" }, kasratan: { ar: "غٍ", tr: "ghin" } },
  { letter: "ف", name: "Fa", fathatan: { ar: "فًا", tr: "fan" }, dammatan: { ar: "فٌ", tr: "fun" }, kasratan: { ar: "فٍ", tr: "fin" } },
  { letter: "ق", name: "Qaf", fathatan: { ar: "قًا", tr: "qan" }, dammatan: { ar: "قٌ", tr: "qun" }, kasratan: { ar: "قٍ", tr: "qin" } },
  { letter: "ك", name: "Kaf", fathatan: { ar: "كًا", tr: "kan" }, dammatan: { ar: "كٌ", tr: "kun" }, kasratan: { ar: "كٍ", tr: "kin" } },
  { letter: "ل", name: "Lam", fathatan: { ar: "لًا", tr: "lan" }, dammatan: { ar: "لٌ", tr: "lun" }, kasratan: { ar: "لٍ", tr: "lin" } },
  { letter: "م", name: "Meem", fathatan: { ar: "مًا", tr: "man" }, dammatan: { ar: "مٌ", tr: "mun" }, kasratan: { ar: "مٍ", tr: "min" } },
  { letter: "ن", name: "Noon", fathatan: { ar: "نًا", tr: "nan" }, dammatan: { ar: "نٌ", tr: "nun" }, kasratan: { ar: "نٍ", tr: "nin" } },
  { letter: "هـ", name: "Ha", fathatan: { ar: "هًا", tr: "han" }, dammatan: { ar: "هٌ", tr: "hun" }, kasratan: { ar: "هٍ", tr: "hin" } },
  { letter: "و", name: "Waw", fathatan: { ar: "وًا", tr: "wan" }, dammatan: { ar: "وٌ", tr: "wun" }, kasratan: { ar: "وٍ", tr: "win" } },
  { letter: "ي", name: "Ya", fathatan: { ar: "يًا", tr: "yan" }, dammatan: { ar: "يٌ", tr: "yun" }, kasratan: { ar: "يٍ", tr: "yin" } },
];

const TANWEEN_READING_WORDS: TanweenReadingWord[] = [
  {
    id: "kitaban",
    arabic: "كِتَابًا",
    translit: "ki - taa - ban",
    meaning: "A Book (with Helper Alif)",
    type: "fathatan",
    imageUrl: "/Tajwedo-Public-Assets/curriculum-Imag/Arabic Language.webp",
    sceneCaption: "An open book on a wooden desk (كِتَابًا)",
    breakdown: [
      { ar: "كِ", tr: "ki" },
      { ar: "تَا", tr: "taa" },
      { ar: "بًا", tr: "ban!", isTanween: true },
    ],
  },
  {
    id: "qalaman",
    arabic: "قَلَمًا",
    translit: "qa - la - man",
    meaning: "A Pen (with Helper Alif)",
    type: "fathatan",
    imageUrl: "/Tajwedo-Public-Assets/curriculum-Imag/Quran Recitation.webp",
    sceneCaption: "Fountain pen writing on paper (قَلَمًا)",
    breakdown: [
      { ar: "قَ", tr: "qa" },
      { ar: "لَ", tr: "la" },
      { ar: "مًا", tr: "man!", isTanween: true },
    ],
  },
  {
    id: "shajaratan",
    arabic: "شَجَرَةً",
    translit: "sha - ja - ra - tan",
    meaning: "A Tree (Ends in Taa Marbuta — NO Alif!)",
    type: "fathatan",
    imageUrl: "/Tajwedo-Public-Assets/Services/Kids Program.webp",
    sceneCaption: "Lush green tree in nature (شَجَرَةً)",
    breakdown: [
      { ar: "شَ", tr: "sha" },
      { ar: "جَ", tr: "ja" },
      { ar: "رَ", tr: "ra" },
      { ar: "ةً", tr: "tan!", isTanween: true },
    ],
  },
  {
    id: "qamarun",
    arabic: "قَمَرٌ",
    translit: "qa - ma - run",
    meaning: "A Moon",
    type: "dammatan",
    imageUrl: "/Tajwedo-Public-Assets/curriculum-Imag/New Muslims.webp",
    sceneCaption: "Full glowing moon in the night sky (قَمَرٌ)",
    breakdown: [
      { ar: "قَ", tr: "qa" },
      { ar: "مَ", tr: "ma" },
      { ar: "رٌ", tr: "run!", isTanween: true },
    ],
  },
  {
    id: "masjidun",
    arabic: "مَسْجِدٌ",
    translit: "mas - ji - dun",
    meaning: "A Mosque / Masjid",
    type: "dammatan",
    imageUrl: "/Tajwedo-Public-Assets/curriculum-Imag/Islamic Studies.webp",
    sceneCaption: "Beautiful Masjid architecture (مَسْجِدٌ)",
    breakdown: [
      { ar: "مَسْ", tr: "mas" },
      { ar: "جِ", tr: "ji" },
      { ar: "دٌ", tr: "dun!", isTanween: true },
    ],
  },
  {
    id: "wardatin",
    arabic: "وَرْدَةٍ",
    translit: "war - da - tin",
    meaning: "A Rose / Flower",
    type: "kasratan",
    imageUrl: "/Tajwedo-Public-Assets/curriculum-Imag/offer-pair copy.webp",
    sceneCaption: "Blooming rose petals with water drops (وَرْدَةٍ)",
    breakdown: [
      { ar: "وَرْ", tr: "war" },
      { ar: "دَ", tr: "da" },
      { ar: "ةٍ", tr: "tin!", isTanween: true },
    ],
  },
  {
    id: "samaain",
    arabic: "سَمَاءٍ",
    translit: "sa - maa - in",
    meaning: "A Sky",
    type: "kasratan",
    imageUrl: "/Tajwedo-Public-Assets/Services/Tajweed.webp",
    sceneCaption: "Blue sky with soft white clouds (سَمَاءٍ)",
    breakdown: [
      { ar: "سَ", tr: "sa" },
      { ar: "مَا", tr: "maa" },
      { ar: "ءٍ", tr: "in!", isTanween: true },
    ],
  },
];

const TANWEEN_GAMES: GameQuestion[] = [
  {
    id: 1,
    mode: "identify_tanween",
    prompt: "What hidden consonant sound do you hear at the end of EVERY Tanween?",
    bigDisplay: "بًا • بٌ • بٍ",
    audioText: "بَنْ بُنْ بِنْ",
    options: ["Hidden Noon (نْ)", "Hidden Meem (مْ)", "Hidden Ba (بْ)"],
    correctIndex: 0,
    explanation: "Tanween is a double vowel that produces a spoken (but unwritten!) Noon Sukun (نْ) bell sound at the end of a noun.",
  },
  {
    id: 2,
    mode: "alif_helper",
    prompt: "Which of these words with Tanween Fath DOES NOT take a Helper Alif (ا) at the end?",
    bigDisplay: "شَجَرَةً",
    audioText: "شَجَرَةَنْ",
    imageUrl: "/Tajwedo-Public-Assets/Services/Kids Program.webp",
    options: ["كِتَابًا (kitaban)", "شَجَرَةً (shajaratan)", "قَلَمًا (qalaman)"],
    correctIndex: 1,
    explanation: "When a word ends in Taa Marbuta (ةً), Tanween Fath sits directly on the Taa Marbuta without adding an Alif!",
  },
  {
    id: 3,
    mode: "sound_match",
    prompt: 'Which letter carries Tanween Damm making the sound "run"?',
    audioText: "رُنْ",
    options: ["رًا (ran)", "رٌ (run)", "رٍ (rin)"],
    correctIndex: 1,
    explanation: "رٌ has double Damma on top, so it is pronounced 'run'!",
  },
  {
    id: 4,
    mode: "word_meaning",
    prompt: "Look at the full moon photo and read قَمَرٌ (qamarun). What does it mean?",
    bigDisplay: "قَمَرٌ",
    audioText: "قَمَرٌ",
    imageUrl: "/Tajwedo-Public-Assets/curriculum-Imag/New Muslims.webp",
    options: ["A Moon", "A Pen", "A Book"],
    correctIndex: 0,
    explanation: "قَمَرٌ (qa-ma-run) means A Moon!",
  },
];

export default function TanweenLesson() {
  const lessonCtx = useLesson();
  const darkMode = lessonCtx?.darkMode ?? false;

  const [englishHints, setEnglishHints] = useState<boolean>(true);
  const [textSizeScale, setTextSizeScale] = useState<number>(1.1);
  const [stars, setStars] = useState<number>(0);

  const [activeTab, setActiveTab] = useState<MainTab>("learn");
  const [slideIdx, setSlideIdx] = useState<number>(0);
  const [matrixSearch, setMatrixSearch] = useState<string>("");
  const [tanweenFilter, setTanweenFilter] = useState<"all" | TanweenType>("all");
  const [activeSoundKey, setActiveSoundKey] = useState<string | null>(null);

  const [readingFilter, setReadingFilter] = useState<"all" | TanweenType>("all");
  const [readingIdx, setReadingIdx] = useState<number>(0);

  const [gameMode, setGameMode] = useState<GameModeId>("menu");
  const [qIndex, setQIndex] = useState<number>(0);
  const [pickedOption, setPickedOption] = useState<number | null>(null);
  const [qAnswered, setQAnswered] = useState<boolean>(false);
  const [sessionScore, setSessionScore] = useState<number>(0);
  const [gameFinished, setGameFinished] = useState<boolean>(false);

  const filteredMatrix = useMemo(() => {
    if (!matrixSearch.trim()) return TANWEEN_MATRIX_28;
    const q = matrixSearch.toLowerCase().trim();
    return TANWEEN_MATRIX_28.filter(
      (r) => r.name.toLowerCase().includes(q) || r.letter.includes(q)
    );
  }, [matrixSearch]);

  const filteredReading = useMemo(() => {
    if (readingFilter === "all") return TANWEEN_READING_WORDS;
    return TANWEEN_READING_WORDS.filter((w) => w.type === readingFilter);
  }, [readingFilter]);

  const currentWord = filteredReading[readingIdx] || filteredReading[0];

  const activeQuestions = useMemo(() => {
    if (gameMode === "menu") return [];
    if (gameMode === "final_test") return TANWEEN_GAMES;
    return TANWEEN_GAMES.filter((q) => q.mode === gameMode);
  }, [gameMode]);

  const currentQ = activeQuestions[qIndex];

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

  const handlePick = (idx: number) => {
    if (qAnswered || !currentQ) return;
    setPickedOption(idx);
    setQAnswered(true);
    if (idx === currentQ.correctIndex) {
      setSessionScore((p) => p + 1);
      setStars((p) => p + 1);
      if (currentQ.audioText) playSound(currentQ.audioText, 0.76);
    }
  };

  return (
    <div
      className={`min-h-screen w-full transition-colors duration-300 font-sans ${
        darkMode ? "bg-[#0B0F19] text-slate-100" : "bg-[#F8FAFC] text-slate-900"
      }`}
    >
      {/* SEO JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "LearningResource",
            name: "Noor Al-Bayan Lesson 3: Arabic Tanween (Nunation)",
            description: "Interactive Arabic & Quran reading lesson teaching Tanween Fath, Damm, and Kasr for children.",
            educationalLevel: "Beginner",
            inLanguage: ["en", "ar"],
            provider: {
              "@type": "EducationalOrganization",
              name: "Tajwedo Institute",
            },
          }),
        }}
      />

      {/* UNIFIED STUDIO DOCK */}
      <header
        className={`relative md:sticky md:top-20 z-30 w-full border-b backdrop-blur-xl transition-all ${
          darkMode
            ? "bg-[#0B0F19]/90 border-slate-800/80 shadow-lg shadow-black/20"
            : "bg-white/90 border-slate-200/80 shadow-xs"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              href="/en/curriculum/noor-al-bayan"
              className={`p-2.5 rounded-xl border transition flex items-center gap-1.5 text-xs font-bold ${
                darkMode
                  ? "bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800"
                  : "bg-slate-100/80 border-slate-200/80 text-slate-700 hover:bg-slate-200/70"
              }`}
            >
              <Home className="w-4 h-4 text-[#0D9488]" />
              <span className="hidden sm:inline">Course</span>
            </Link>

            <button
              type="button"
              onClick={() => playSound("بَنْ بُنْ بِنْ", 0.72)}
              className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#F59E0B] to-[#FF5A1F] text-white flex items-center justify-center shadow-md shadow-orange-500/20 hover:scale-105 transition"
            >
              <span dir="rtl" className="text-2xl font-serif font-bold">
                بٌ
              </span>
            </button>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-extrabold tracking-tight leading-none">
                  Tanween / Nunation (التَّنْوِين)
                </h1>
                <span className="hidden md:inline-block px-2 py-0.5 rounded-md text-[11px] font-extrabold uppercase bg-amber-500/15 text-amber-600 dark:text-amber-400">
                  Lesson 3
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Double Vowels (ـً ـٌ ـٍ) & The Hidden Noon Bell
              </p>
            </div>
          </div>

          <nav
            aria-label="Lesson Sections"
            className={`flex items-center p-1.5 rounded-2xl border overflow-x-auto no-scrollbar ${
              darkMode ? "bg-slate-900/90 border-slate-800" : "bg-slate-100/90 border-slate-200/70"
            }`}
          >
            {[
              { id: "learn", label: "Learn & Slides", icon: BookOpen },
              { id: "chart", label: "84-Tanween Matrix", icon: Grid },
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
                      ? "bg-gradient-to-r from-[#FF5A1F] to-[#F59E0B] text-white shadow-md shadow-orange-500/25"
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

          <div className="flex items-center gap-2.5">
            <div
              className={`px-3 py-1.5 rounded-xl border flex items-center gap-1.5 text-xs sm:text-sm font-extrabold ${
                darkMode ? "bg-amber-500/10 border-amber-500/30 text-amber-300" : "bg-amber-50 border-amber-200 text-amber-700"
              }`}
            >
              <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
              <span>{stars}</span>
            </div>

            <div
              className={`hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl border ${
                darkMode ? "bg-slate-900 border-slate-800" : "bg-slate-100/80 border-slate-200/80"
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-[#FF5A1F]" />
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Size</span>
              <input
                type="range"
                min={0.9}
                max={1.4}
                step={0.05}
                value={textSizeScale}
                onChange={(e) => setTextSizeScale(parseFloat(e.target.value))}
                className="w-20 h-1.5 bg-orange-500/30 rounded-lg appearance-none cursor-pointer accent-[#FF5A1F]"
              />
            </div>

            <button
              type="button"
              onClick={() => setEnglishHints((prev) => !prev)}
              className={`px-3.5 py-2 rounded-xl border text-xs font-bold inline-flex items-center gap-1.5 transition ${
                englishHints
                  ? "bg-[#FF5A1F]/15 border-[#FF5A1F]/40 text-[#FF5A1F] dark:text-orange-300"
                  : darkMode
                  ? "bg-slate-900 border-slate-800 text-slate-400"
                  : "bg-slate-100 border-slate-200 text-slate-500"
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
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                  <span className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-widest text-[#FF5A1F]">
                    <Bell className="w-3.5 h-3.5" /> Lesson 3 • The Ringing Noon Rule
                  </span>
                  <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight mt-1">
                    Meet the Three Types of Tanween
                  </h2>
                </div>
                <p className={`text-sm sm:text-base max-w-md ${darkMode ? "text-slate-400" : "text-slate-600"}`}>
                  When a short vowel is doubled at the end of a noun, it rings
                  with a crisp hidden Noon sound (-an, -un, -in)!
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-7">
                {TANWEEN_CARDS.map((card) => (
                  <article
                    key={card.id}
                    onClick={() => playSound(card.audioSample, 0.74)}
                    className={`relative rounded-3xl border overflow-hidden transition-all duration-300 cursor-pointer flex flex-col justify-between group hover:-translate-y-1.5 ${
                      darkMode
                        ? "bg-[#111827] border-slate-800 hover:border-slate-700 shadow-xl"
                        : "bg-white border-slate-200/90 hover:border-slate-300 shadow-lg"
                    }`}
                  >
                    <div className={`h-2.5 w-full ${card.topBarClass}`} />

                    <div className="relative h-40 w-full overflow-hidden">
                      <img
                        src={card.imageUrl}
                        alt={card.imageAlt}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent" />
                      <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between">
                        <span className={`px-3.5 py-1 rounded-full text-xs font-extrabold ${card.badgeClass}`}>
                          {card.badge} • {card.nameAr}
                        </span>
                        <span className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-md text-white flex items-center justify-center">
                          <Volume2 className="w-4 h-4" />
                        </span>
                      </div>
                    </div>

                    <div className="p-6 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-baseline justify-between">
                          <span className={`text-xl font-extrabold ${card.accentText}`}>
                            {card.soundTitle}
                          </span>
                          <span className="text-xs font-bold opacity-75">
                            {card.phoneticFormula}
                          </span>
                        </div>

                        <div
                          className={`my-5 py-5 rounded-3xl border text-center transition-colors ${
                            darkMode ? card.softBgDark : card.softBgLight
                          } ${card.pillBorder}`}
                        >
                          <span
                            dir="rtl"
                            style={{ fontSize: `${Math.round(4.6 * textSizeScale)}rem`, lineHeight: 1.15 }}
                            className={`font-serif font-bold inline-block transition-transform group-hover:scale-105 ${card.accentText}`}
                          >
                            {card.sampleAr}
                          </span>
                        </div>

                        <p className="text-sm font-bold mb-2">{card.placement}</p>
                        <p className={`text-xs sm:text-sm leading-relaxed ${darkMode ? "text-slate-300" : "text-slate-600"}`}>
                          {card.orthographyRule}
                        </p>
                      </div>

                      <div
                        className="mt-6 pt-4 border-t border-slate-200/70 dark:border-slate-800"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <span className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-400 mb-2.5">
                          Tap to Hear {card.badge}:
                        </span>
                        <div dir="rtl" className="grid grid-cols-4 gap-2">
                          {card.examples.map((ex, i) => (
                            <button
                              key={i}
                              type="button"
                              onClick={() => playSound(ex.ar, 0.74)}
                              className={`py-2.5 rounded-2xl border text-center transition hover:-translate-y-0.5 ${
                                darkMode ? "bg-[#0B0F19] border-slate-800" : "bg-slate-50 border-slate-200/80 hover:bg-white"
                              }`}
                            >
                              <span className={`block text-2xl font-serif font-bold ${card.accentText}`}>
                                {ex.ar}
                              </span>
                              {englishHints && (
                                <span dir="ltr" className="block text-[11px] font-extrabold text-slate-500 mt-0.5">
                                  {ex.tr}
                                </span>
                              )}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </section>

            {/* VISUAL CLASSROOM SLIDESHOW */}
            <section className="space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#FF5A1F] to-[#F59E0B] text-white flex items-center justify-center shadow-md">
                    <Presentation className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-xl sm:text-2xl font-extrabold">
                      Visual Classroom Slides (Tanween Secrets)
                    </h2>
                    <p className={`text-xs sm:text-sm ${darkMode ? "text-slate-400" : "text-slate-600"}`}>
                      Interactive comparisons for live Zoom teaching
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  {[
                    "1. Spoken vs Written Noon",
                    "2. The Helper Alif Rule",
                    "3. Stopping on Tanween",
                  ].map((label, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSlideIdx(idx)}
                      className={`px-4 py-2 rounded-xl text-xs font-extrabold transition ${
                        slideIdx === idx
                          ? "bg-[#FF5A1F] text-white shadow-md"
                          : darkMode
                          ? "bg-[#111827] text-slate-300 border border-slate-800"
                          : "bg-white text-slate-700 border border-slate-200"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              <div
                className={`rounded-3xl border p-8 sm:p-12 transition-all ${
                  darkMode ? "bg-[#111827] border-slate-800 shadow-2xl" : "bg-white border-slate-200/90 shadow-xl"
                }`}
              >
                {slideIdx === 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                    <div className="space-y-4">
                      <span className="px-3.5 py-1 rounded-full text-xs font-extrabold bg-orange-500/15 text-[#FF5A1F]">
                        Slide 1 of 3 • The Invisible Noon
                      </span>
                      <h3 className="text-2xl sm:text-3xl font-extrabold">
                        Hear the Noon, Never Write the Noon!
                      </h3>
                      <p className={`text-sm sm:text-base leading-relaxed ${darkMode ? "text-slate-300" : "text-slate-600"}`}>
                        When children hear <strong>&ldquo;kitaban&rdquo;</strong>, they often want to write a real letter Noon (ن) at the end. Teach them: the second twin mark IS the Noon sound!
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-6 rounded-3xl border-2 border-[#00A86B] bg-[#00A86B]/10 text-center space-y-2">
                        <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-[#00A86B] text-white">
                          CORRECT SPELLING
                        </span>
                        <div dir="rtl" className="text-5xl font-serif font-bold text-[#00A86B] py-2">
                          قَلَمٌ
                        </div>
                        <p className="text-xs font-bold">Written with Double Damma</p>
                      </div>
                      <div className="p-6 rounded-3xl border-2 border-rose-500 bg-rose-500/10 text-center space-y-2">
                        <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-rose-600 text-white">
                          WRONG SPELLING
                        </span>
                        <div dir="rtl" className="text-5xl font-serif font-bold text-rose-500 py-2">
                          قَلَمُنْ
                        </div>
                        <p className="text-xs font-bold">Never write a real Noon!</p>
                      </div>
                    </div>
                  </div>
                )}

                {slideIdx === 1 && (
                  <div className="space-y-6 text-center">
                    <span className="px-3.5 py-1 rounded-full text-xs font-extrabold bg-amber-500/15 text-amber-500">
                      Slide 2 of 3 • Tanween Fath Chair Rule
                    </span>
                    <h3 className="text-2xl sm:text-3xl font-extrabold">
                      When Does Tanween Fath Need a Helper Alif (ا)?
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
                      <div className="p-6 rounded-3xl border-2 border-[#FF5A1F]/40 bg-[#FF5A1F]/10 space-y-2">
                        <span className="text-xs font-extrabold text-[#FF5A1F]">REGULAR LETTERS (+ ا)</span>
                        <div dir="rtl" className="text-5xl font-serif font-bold text-[#FF5A1F] py-2">كِتَابًا</div>
                        <p className="text-xs">Needs a silent Helper Alif at the end!</p>
                      </div>
                      <div className="p-6 rounded-3xl border-2 border-[#00A86B]/40 bg-[#00A86B]/10 space-y-2">
                        <span className="text-xs font-extrabold text-[#00A86B]">TAA MARBUTA (NO ا)</span>
                        <div dir="rtl" className="text-5xl font-serif font-bold text-[#00A86B] py-2">شَجَرَةً</div>
                        <p className="text-xs">Sits directly on ة without Alif!</p>
                      </div>
                      <div className="p-6 rounded-3xl border-2 border-[#7C3AED]/40 bg-[#7C3AED]/10 space-y-2">
                        <span className="text-xs font-extrabold text-[#7C3AED]">HAMZA AFTER ALIF (NO ا)</span>
                        <div dir="rtl" className="text-5xl font-serif font-bold text-[#7C3AED] py-2">سَمَاءً</div>
                        <p className="text-xs">Sits directly on ء without another Alif!</p>
                      </div>
                    </div>
                  </div>
                )}

                {slideIdx === 2 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                    <div className="p-6 rounded-3xl border-2 border-[#0284C7]/40 bg-[#0284C7]/10 space-y-2">
                      <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-[#0284C7] text-white">
                        STOPPING ON DAMMATAN / KASRATAN
                      </span>
                      <div dir="rtl" className="text-5xl font-serif font-bold text-[#0284C7] py-2">
                        قَمَرٌ ⬅ قَمَرْ
                      </div>
                      <p className="text-sm">When stopping at the end of a verse, drop the Tanween and rest on Sukun!</p>
                    </div>
                    <div className="p-6 rounded-3xl border-2 border-[#FF5A1F]/40 bg-[#FF5A1F]/10 space-y-2">
                      <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-[#FF5A1F] text-white">
                        STOPPING ON FATHATAN (MADD ‘IWAD)
                      </span>
                      <div dir="rtl" className="text-5xl font-serif font-bold text-[#FF5A1F] py-2">
                        كِتَابًا ⬅ كِتَابَا
                      </div>
                      <p className="text-sm">When stopping on Tanween Fath with Alif, turn it into a 2-beat Alif Madd (kitaabaa)!</p>
                    </div>
                  </div>
                )}
              </div>
            </section>
          </div>
        )}

        {/* TAB 2: 84-TANWEEN MATRIX */}
        {activeTab === "chart" && (
          <section className="space-y-8">
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
              <div>
                <span className="text-xs font-extrabold uppercase tracking-widest text-[#FF5A1F]">
                  84 Interactive Audio Tiles
                </span>
                <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight mt-1">
                  Complete Tanween Sound Matrix
                </h2>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={matrixSearch}
                    onChange={(e) => setMatrixSearch(e.target.value)}
                    placeholder="Find letter..."
                    className={`pl-10 pr-4 py-2.5 rounded-2xl text-xs sm:text-sm font-semibold border outline-none ${
                      darkMode ? "bg-[#111827] border-slate-800 text-white" : "bg-white border-slate-200 text-slate-800"
                    }`}
                  />
                </div>

                <div className={`flex items-center p-1 rounded-2xl border ${darkMode ? "bg-[#111827] border-slate-800" : "bg-white border-slate-200"}`}>
                  {[
                    { id: "all", label: "All 3", cls: "bg-slate-800 text-white" },
                    { id: "fathatan", label: "-an (ـً)", cls: "bg-[#FF5A1F] text-white" },
                    { id: "dammatan", label: "-un (ـٌ)", cls: "bg-[#00A86B] text-white" },
                    { id: "kasratan", label: "-in (ـٍ)", cls: "bg-[#7C3AED] text-white" },
                  ].map((f) => (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => setTanweenFilter(f.id as "all" | TanweenType)}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition ${
                        tanweenFilter === f.id ? f.cls : "text-slate-500"
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredMatrix.map((row) => (
                <div
                  key={row.name}
                  className={`rounded-3xl border p-4 sm:p-5 flex items-center justify-between gap-4 ${
                    darkMode ? "bg-[#111827] border-slate-800/90" : "bg-white border-slate-200/80 shadow-sm"
                  }`}
                >
                  <div className="w-20 shrink-0 text-center border-r pr-4 border-slate-200/70 dark:border-slate-800">
                    <div dir="rtl" className="text-3xl font-serif font-bold">{row.letter}</div>
                    {englishHints && <span className="block text-xs font-extrabold text-slate-400 mt-1">{row.name}</span>}
                  </div>

                  <div className={`flex-1 grid gap-3 ${tanweenFilter === "all" ? "grid-cols-3" : "grid-cols-1"}`}>
                    {(tanweenFilter === "all" || tanweenFilter === "fathatan") && (
                      <button
                        type="button"
                        onClick={() => triggerAudio(row.fathatan.ar, `${row.name}-fn`)}
                        className={`rounded-2xl py-3 px-2 border-2 text-center transition ${
                          activeSoundKey === `${row.name}-fn`
                            ? "bg-[#FF5A1F] text-white border-[#FF5A1F] scale-95"
                            : darkMode
                            ? "bg-[#FF5A1F]/10 border-[#FF5A1F]/30 text-[#FF7A45]"
                            : "bg-[#FFF6F2] border-[#FFD5C2] text-[#FF5A1F]"
                        }`}
                      >
                        <span dir="rtl" className="block text-3xl font-serif font-bold">{row.fathatan.ar}</span>
                        {englishHints && <span className="text-xs font-extrabold">{row.fathatan.tr}</span>}
                      </button>
                    )}

                    {(tanweenFilter === "all" || tanweenFilter === "dammatan") && (
                      <button
                        type="button"
                        onClick={() => triggerAudio(row.dammatan.ar, `${row.name}-dn`)}
                        className={`rounded-2xl py-3 px-2 border-2 text-center transition ${
                          activeSoundKey === `${row.name}-dn`
                            ? "bg-[#00A86B] text-white border-[#00A86B] scale-95"
                            : darkMode
                            ? "bg-[#00A86B]/10 border-[#00A86B]/30 text-[#34D399]"
                            : "bg-[#F2FBF7] border-[#BCEFD8] text-[#00A86B]"
                        }`}
                      >
                        <span dir="rtl" className="block text-3xl font-serif font-bold">{row.dammatan.ar}</span>
                        {englishHints && <span className="text-xs font-extrabold">{row.dammatan.tr}</span>}
                      </button>
                    )}

                    {(tanweenFilter === "all" || tanweenFilter === "kasratan") && (
                      <button
                        type="button"
                        onClick={() => triggerAudio(row.kasratan.ar, `${row.name}-kn`)}
                        className={`rounded-2xl py-3 px-2 border-2 text-center transition ${
                          activeSoundKey === `${row.name}-kn`
                            ? "bg-[#7C3AED] text-white border-[#7C3AED] scale-95"
                            : darkMode
                            ? "bg-[#7C3AED]/10 border-[#7C3AED]/30 text-[#A78BFA]"
                            : "bg-[#F8F5FF] border-[#E0D1FF] text-[#7C3AED]"
                        }`}
                      >
                        <span dir="rtl" className="block text-3xl font-serif font-bold">{row.kasratan.ar}</span>
                        {englishHints && <span className="text-xs font-extrabold">{row.kasratan.tr}</span>}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* TAB 3: CONTEXTUAL VISUAL READING LAB */}
        {activeTab === "reading" && (
          <section className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <span className="text-xs font-extrabold uppercase tracking-widest text-[#FF5A1F]">
                  Contextual Visual Vocabulary
                </span>
                <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight mt-1">
                  Tanween Reading Lab
                </h2>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {[
                  { id: "all", label: "All Words" },
                  { id: "fathatan", label: "Tanween Fath (-an)" },
                  { id: "dammatan", label: "Tanween Damm (-un)" },
                  { id: "kasratan", label: "Tanween Kasr (-in)" },
                ].map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => {
                      setReadingFilter(t.id as "all" | TanweenType);
                      setReadingIdx(0);
                    }}
                    className={`px-4 py-2 rounded-2xl text-xs sm:text-sm font-extrabold transition ${
                      readingFilter === t.id
                        ? "bg-[#FF5A1F] text-white shadow-md"
                        : darkMode
                        ? "bg-[#111827] border border-slate-800 text-slate-300"
                        : "bg-white border border-slate-200 text-slate-700"
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {currentWord && (
              <div
                className={`rounded-3xl border overflow-hidden ${
                  darkMode ? "bg-[#111827] border-slate-800 shadow-2xl" : "bg-white border-slate-200/90 shadow-xl"
                }`}
              >
                <div className="grid grid-cols-1 lg:grid-cols-12">
                  <div className="lg:col-span-6 relative flex flex-col justify-between p-8 sm:p-10 bg-slate-950 text-white min-h-[340px]">
                    <img
                      src={currentWord.imageUrl}
                      alt={currentWord.meaning}
                      loading="lazy"
                      className="absolute inset-0 w-full h-full object-cover opacity-45"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/45 to-slate-950/30" />

                    <div className="relative z-10 flex items-center justify-between">
                      <span className="px-3.5 py-1 rounded-full text-xs font-extrabold bg-white/15 backdrop-blur-md">
                        Word {readingIdx + 1} of {filteredReading.length}
                      </span>
                      <span className="px-3.5 py-1 rounded-full text-xs font-extrabold bg-[#FF5A1F] text-white">
                        {currentWord.type.toUpperCase()}
                      </span>
                    </div>

                    <div className="relative z-10 my-8 text-center">
                      <button
                        type="button"
                        onClick={() => playSound(currentWord.arabic, 0.72)}
                        className="group focus:outline-none"
                      >
                        <div
                          dir="rtl"
                          style={{ fontSize: `${Math.round(5.5 * textSizeScale)}rem`, lineHeight: 1.15 }}
                          className="font-serif font-bold text-white drop-shadow-md transition-transform group-hover:scale-105"
                        >
                          {currentWord.arabic}
                        </div>
                      </button>
                      {englishHints && (
                        <div className="mt-3 space-y-1">
                          <div className="text-2xl font-extrabold text-amber-300">{currentWord.translit}</div>
                          <div className="text-base font-bold text-white">&ldquo;{currentWord.meaning}&rdquo;</div>
                        </div>
                      )}
                    </div>

                    <div className="relative z-10 text-xs text-slate-300 text-center">
                      {currentWord.sceneCaption}
                    </div>
                  </div>

                  <div className="lg:col-span-6 p-8 sm:p-10 flex flex-col justify-between space-y-8">
                    <div className="space-y-4">
                      <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
                        Syllable Breakdown (Notice the Ringing Tanween at the end!)
                      </span>
                      <div dir="rtl" className="grid grid-cols-3 sm:grid-cols-4 gap-3 pt-2">
                        {currentWord.breakdown.map((syl, i) => (
                          <button
                            key={i}
                            type="button"
                            onClick={() => playSound(syl.ar, 0.72)}
                            className={`p-5 rounded-3xl border-2 text-center transition hover:-translate-y-1 ${
                              syl.isTanween
                                ? "border-[#FF5A1F] bg-[#FF5A1F]/15 text-[#FF5A1F]"
                                : "border-slate-300 dark:border-slate-700"
                            }`}
                          >
                            <span className="block text-4xl font-serif font-bold">{syl.ar}</span>
                            {englishHints && (
                              <span dir="ltr" className="block text-xs font-extrabold mt-2">{syl.tr}</span>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                      <button
                        type="button"
                        onClick={() => setReadingIdx((p) => (p === 0 ? filteredReading.length - 1 : p - 1))}
                        className={`flex-1 py-3.5 px-4 rounded-2xl font-extrabold text-sm border inline-flex items-center justify-center gap-2 ${
                          darkMode ? "bg-[#0B0F19] border-slate-800" : "bg-slate-100 border-slate-200"
                        }`}
                      >
                        <ChevronLeft className="w-4 h-4" /> Previous
                      </button>
                      <button
                        type="button"
                        onClick={() => playSound(currentWord.arabic, 0.72)}
                        className="px-7 py-3.5 rounded-2xl font-extrabold text-sm bg-[#FF5A1F] text-white inline-flex items-center gap-2 shadow-lg"
                      >
                        <Volume2 className="w-4 h-4" /> Listen
                      </button>
                      <button
                        type="button"
                        onClick={() => setReadingIdx((p) => (p + 1 >= filteredReading.length ? 0 : p + 1))}
                        className={`flex-1 py-3.5 px-4 rounded-2xl font-extrabold text-sm border inline-flex items-center justify-center gap-2 ${
                          darkMode ? "bg-[#0B0F19] border-slate-800" : "bg-slate-100 border-slate-200"
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

        {/* TAB 4: GAMES */}
        {activeTab === "games" && (
          <section className="space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl sm:text-4xl font-extrabold">Tanween Mastery Games</h2>
              {gameMode !== "menu" && (
                <button
                  type="button"
                  onClick={() => setGameMode("menu")}
                  className="px-4 py-2 rounded-2xl text-xs font-extrabold border border-slate-300 dark:border-slate-700"
                >
                  Back to Menu
                </button>
              )}
            </div>

            {gameMode === "menu" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  { mode: "identify_tanween", title: "Hidden Noon Detective", desc: "Discover the secret consonant inside every Tanween.", icon: Bell, topBar: "bg-[#FF5A1F]" },
                  { mode: "alif_helper", title: "Helper Alif Challenge", desc: "Spot when Tanween Fath needs an Alif and when it doesn't!", icon: Scale, topBar: "bg-[#00A86B]" },
                  { mode: "sound_match", title: "Sound Match (-an, -un, -in)", desc: "Listen and pick the matching Tanween syllable.", icon: Ear, topBar: "bg-[#7C3AED]" },
                  { mode: "word_meaning", title: "Picture Vocabulary", desc: "Match real-world scenes with vocalized Tanween nouns.", icon: BookOpen, topBar: "bg-[#0284C7]" },
                  { mode: "final_test", title: "Final Mastery Quiz", desc: "Earn all 3 stars in the complete Tanween assessment!", icon: Trophy, topBar: "bg-amber-500" },
                ].map((g, i) => {
                  const Icon = g.icon;
                  return (
                    <button
                      key={i}
                      type="button"
                      onClick={() => startGame(g.mode as GameModeId)}
                      className={`rounded-3xl border overflow-hidden text-left transition hover:-translate-y-1.5 flex flex-col justify-between h-52 ${
                        darkMode ? "bg-[#111827] border-slate-800" : "bg-white border-slate-200 shadow-md"
                      }`}
                    >
                      <div className={`h-2 w-full ${g.topBar}`} />
                      <div className="p-6 flex-1 flex flex-col justify-between">
                        <Icon className="w-8 h-8 text-[#FF5A1F]" />
                        <div>
                          <h3 className="text-xl font-extrabold mb-1">{g.title}</h3>
                          <p className="text-xs sm:text-sm opacity-75">{g.desc}</p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}

            {gameMode !== "menu" && !gameFinished && currentQ && (
              <div className={`rounded-3xl border p-8 max-w-2xl mx-auto ${darkMode ? "bg-[#111827] border-slate-800" : "bg-white border-slate-200 shadow-xl"}`}>
                {currentQ.imageUrl && (
                  <img src={currentQ.imageUrl} alt="Quiz visual" className="w-full h-44 object-cover rounded-2xl mb-6" />
                )}
                <h3 className="text-xl font-extrabold text-center mb-6">{currentQ.prompt}</h3>
                {currentQ.bigDisplay && (
                  <div dir="rtl" className="text-5xl font-serif font-bold text-center text-[#FF5A1F] my-6">
                    {currentQ.bigDisplay}
                  </div>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {currentQ.options.map((opt, idx) => (
                    <button
                      key={idx}
                      disabled={qAnswered}
                      onClick={() => handlePick(idx)}
                      className={`p-4 rounded-2xl border-2 font-extrabold text-lg ${
                        qAnswered
                          ? idx === currentQ.correctIndex
                            ? "border-[#00A86B] bg-[#00A86B]/15 text-[#00A86B]"
                            : idx === pickedOption
                            ? "border-rose-500 bg-rose-500/15 text-rose-500"
                            : "border-slate-300 dark:border-slate-800"
                          : "border-slate-200 dark:border-slate-800 hover:border-[#FF5A1F]"
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
                {qAnswered && (
                  <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4">
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
                      className="px-5 py-2.5 rounded-xl bg-[#FF5A1F] text-white font-bold text-sm shrink-0"
                    >
                      Next
                    </button>
                  </div>
                )}
              </div>
            )}

            {gameFinished && (
              <div className={`rounded-3xl border p-10 max-w-xl mx-auto text-center space-y-5 ${darkMode ? "bg-[#111827] border-slate-800" : "bg-white border-slate-200 shadow-xl"}`}>
                <Trophy className="w-14 h-14 text-amber-400 mx-auto" />
                <h3 className="text-3xl font-extrabold">Masha’Allah! Tanween Mastered!</h3>
                <button
                  type="button"
                  onClick={() => setGameMode("menu")}
                  className="px-6 py-3 rounded-2xl bg-[#FF5A1F] text-white font-extrabold text-sm"
                >
                  Back to All Games
                </button>
              </div>
            )}
          </section>
        )}
      </main>
    </div>
  );
}