"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Activity,
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Check,
  ChevronRight,
  Eye,
  EyeOff,
  Gamepad2,
  Layers,
  LayoutGrid,
  Lightbulb,
  Minus,
  Play,
  Plus,
  Presentation,
  RotateCcw,
  Search,
  Shuffle,
  Star,
  Target,
  Trophy,
  Volume2,
  X,
  Zap,
} from "lucide-react";
import { useLesson } from "../shared/LessonContext";
import { SlideDeck, TeacherCorner, VoiceNotice, speakArabic } from "../shared/Lessontoolkit";
import type { Slide } from "../shared/Lessontoolkit";
import {
  getAdjacentNoorLessons,
  getNoorAlBayanLessonBySlug,
  NOOR_AL_BAYAN_LESSONS,
} from "@/lib/curriculum/noor-al-bayan";
import { BTN_GHOST, BTN_GOLD, CARD, FOCUS, HeroShell, INK, MUTED, Ornament, WRAP, headingClass } from "@/lib/ui/brand";

/* -------------------------------------------------------------------------- */
/*  Types & constants                                                         */
/* -------------------------------------------------------------------------- */

type Tx = (en: string, ar: string) => string;
type Tab = "learn" | "letters" | "reading" | "practice";
type Mode = "spot" | "blend" | "quran" | "qalqalah";
type GameId = Mode | "final";
type Vowel = "a" | "i" | "u";
type Filter = "all" | "heavy" | "qalqalah";

const SLUG = "sukun-and-qalqalah";
const STORE_KEY = "tajwedo.noor-al-bayan.sukun.v1";
const SUKUN = "\u0652";

const BTN_PRIMARY = `inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[#0D4F4F] px-5 text-sm font-bold text-white transition hover:bg-[#093D33] motion-reduce:transition-none dark:bg-teal-400 dark:text-slate-950 dark:hover:bg-teal-300 ${FOCUS}`;
const BTN_OUTLINE = `inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-[#0D4F4F]/30 px-5 text-sm font-bold text-[#0D4F4F] transition hover:bg-[#0D4F4F]/5 motion-reduce:transition-none dark:border-white/20 dark:text-teal-200 dark:hover:bg-white/5 ${FOCUS}`;
const TILE =
  "border border-stone-200 bg-stone-50 text-[#0D4F4F] dark:border-white/10 dark:bg-white/5 dark:text-white";
const TILE_HOT =
  "border-[#C8A96E] bg-[#C8A96E]/15 text-[#0D4F4F] dark:bg-[#C8A96E]/20 dark:text-white";

const CARRIERS: Record<Vowel, { ar: string; mark: string; en: string; arName: string }> = {
  a: { ar: "أَ", mark: "\u064E", en: "Fatha", arName: "فَتْحَة" },
  i: { ar: "إِ", mark: "\u0650", en: "Kasra", arName: "كَسْرَة" },
  u: { ar: "أُ", mark: "\u064F", en: "Damma", arName: "ضَمَّة" },
};

type Letter = { ch: string; en: string; ar: string; tr: string; heavy?: boolean };

const LETTERS: Letter[] = [
  { ch: "ء", en: "Hamza", ar: "هَمْزَة", tr: "'" },
  { ch: "ب", en: "Ba", ar: "بَاء", tr: "b" },
  { ch: "ت", en: "Ta", ar: "تَاء", tr: "t" },
  { ch: "ث", en: "Tha", ar: "ثَاء", tr: "th" },
  { ch: "ج", en: "Jeem", ar: "جِيم", tr: "j" },
  { ch: "ح", en: "Haa", ar: "حَاء", tr: "H" },
  { ch: "خ", en: "Khaa", ar: "خَاء", tr: "kh", heavy: true },
  { ch: "د", en: "Dal", ar: "دَال", tr: "d" },
  { ch: "ذ", en: "Dhal", ar: "ذَال", tr: "dh" },
  { ch: "ر", en: "Ra", ar: "رَاء", tr: "r" },
  { ch: "ز", en: "Zay", ar: "زَاي", tr: "z" },
  { ch: "س", en: "Seen", ar: "سِين", tr: "s" },
  { ch: "ش", en: "Sheen", ar: "شِين", tr: "sh" },
  { ch: "ص", en: "Saad", ar: "صَاد", tr: "S", heavy: true },
  { ch: "ض", en: "Daad", ar: "ضَاد", tr: "D", heavy: true },
  { ch: "ط", en: "Taa", ar: "طَاء", tr: "T", heavy: true },
  { ch: "ظ", en: "Dhaa", ar: "ظَاء", tr: "DH", heavy: true },
  { ch: "ع", en: "Ayn", ar: "عَيْن", tr: "‘" },
  { ch: "غ", en: "Ghayn", ar: "غَيْن", tr: "gh", heavy: true },
  { ch: "ف", en: "Fa", ar: "فَاء", tr: "f" },
  { ch: "ق", en: "Qaf", ar: "قَاف", tr: "q", heavy: true },
  { ch: "ك", en: "Kaf", ar: "كَاف", tr: "k" },
  { ch: "ل", en: "Lam", ar: "لَام", tr: "l" },
  { ch: "م", en: "Meem", ar: "مِيم", tr: "m" },
  { ch: "ن", en: "Noon", ar: "نُون", tr: "n" },
  { ch: "ه", en: "Ha", ar: "هَاء", tr: "h" },
  { ch: "و", en: "Waw", ar: "وَاو", tr: "w" },
  { ch: "ي", en: "Ya", ar: "يَاء", tr: "y" },
];

const QALQALAH = ["ق", "ط", "ب", "ج", "د"];
const isQalq = (ch: string) => QALQALAH.includes(ch);

function syl(l: Letter, v: Vowel) {
  const c = CARRIERS[v];
  // A Hamza cannot sit after the Hamza carrier, so it borrows Ba as the moving letter.
  if (l.ch === "ء") return { ar: `ب${c.mark}ء${SUKUN}`, tr: `b${v}'` };
  return { ar: `${c.ar}${l.ch}${SUKUN}`, tr: `${v}${l.tr}` };
}
const letterOf = (ch: string) => LETTERS.find((l) => l.ch === ch) ?? LETTERS[1];

type Syl = { ar: string; tr: string; sukun?: boolean; qalq?: boolean };
type Word = {
  id: string;
  ar: string;
  tr: string;
  meaning: [string, string];
  ref: string;
  syl: Syl[];
};

const WORDS: Word[] = [
  {
    id: "masjid",
    ar: "مَسْجِدُ",
    tr: "mas-ji-du",
    meaning: ["Mosque", "مكان الصلاة"],
    ref: "الْمَسْجِدِ الْحَرَامِ · البقرة 144",
    syl: [{ ar: "مَسْ", tr: "mas", sukun: true }, { ar: "جِ", tr: "ji" }, { ar: "دُ", tr: "du" }],
  },
  {
    id: "anamta",
    ar: "أَنْعَمْتَ",
    tr: "an-‘am-ta",
    meaning: ["You have favored", "تفضّلتَ بالنعمة"],
    ref: "صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ · الفاتحة 7",
    syl: [{ ar: "أَنْ", tr: "an", sukun: true }, { ar: "عَمْ", tr: "‘am", sukun: true }, { ar: "تَ", tr: "ta" }],
  },
  {
    id: "yalamun",
    ar: "يَعْلَمُونَ",
    tr: "ya‘-la-muu-na",
    meaning: ["They know", "يُدْرِكُونَ"],
    ref: "لَوْ كَانُوا يَعْلَمُونَ · العنكبوت 41",
    syl: [{ ar: "يَعْ", tr: "ya‘", sukun: true }, { ar: "لَ", tr: "la" }, { ar: "مُو", tr: "muu" }, { ar: "نَ", tr: "na" }],
  },
  {
    id: "yadkhulun",
    ar: "يَدْخُلُونَ",
    tr: "yad-khu-luu-na",
    meaning: ["They enter", "يَلِجُونَ"],
    ref: "يَدْخُلُونَ فِي دِينِ اللَّهِ أَفْوَاجًا · النصر 2",
    syl: [
      { ar: "يَدْ", tr: "yad", sukun: true, qalq: true },
      { ar: "خُ", tr: "khu" },
      { ar: "لُو", tr: "luu" },
      { ar: "نَ", tr: "na" },
    ],
  },
  {
    id: "alfalaq",
    ar: "الْفَلَقْ",
    tr: "al-fa-laq",
    meaning: ["The daybreak", "الصُّبْح"],
    ref: "بِرَبِّ الْفَلَقِ · الفلق 1 (عند الوقف)",
    syl: [{ ar: "الْ", tr: "al", sukun: true }, { ar: "فَ", tr: "fa" }, { ar: "لَقْ", tr: "laq", sukun: true, qalq: true }],
  },
  {
    id: "ahad",
    ar: "أَحَدْ",
    tr: "a-had",
    meaning: ["One", "وَاحِد"],
    ref: "قُلْ هُوَ اللَّهُ أَحَدٌ · الإخلاص 1 (عند الوقف)",
    syl: [{ ar: "أَ", tr: "a" }, { ar: "حَدْ", tr: "had", sukun: true, qalq: true }],
  },
];

type Opt = { en: string; ar: string; glyph?: boolean };
type Question = {
  id: number;
  mode: Mode;
  p: [string, string];
  big?: string;
  hear?: string;
  opts: Opt[];
  ok: number;
  why: [string, string];
};
const o = (en: string, ar: string): Opt => ({ en, ar });
const g = (s: string): Opt => ({ en: s, ar: s, glyph: true });

const QUESTIONS: Question[] = [
  {
    id: 1, mode: "spot", p: ["What does a Sukun on a letter tell us?", "ماذا تخبرنا علامة السكون فوق الحرف؟"],
    big: "بْ", hear: "أَبْ",
    opts: [o("It has no vowel and stops still", "لا حركة عليه ويقف ساكنًا"), o("It is stretched for 2 beats", "يُمَدّ بمقدار حركتين"), o("It carries a Damma", "عليه ضمّة")],
    ok: 0, why: ["Sukun means rest: no Fatha, Kasra or Damma, so the letter stops at once.", "السكون معناه السكون والراحة: لا فتحة ولا كسرة ولا ضمة، فيقف الحرف فورًا."],
  },
  {
    id: 2, mode: "spot", p: ["Which letter is sakin (still)?", "أيّ الحروف التالية ساكن؟"],
    opts: [g("بَ"), g("بْ"), g("بُ")],
    ok: 1, why: ["The small circle above Ba marks it as sakin; the others carry Fatha and Damma.", "الدائرة الصغيرة فوق الباء تجعلها ساكنة، أمّا الأخريان ففيهما فتحة وضمة."],
  },
  {
    id: 3, mode: "spot", p: ["Can a sakin letter start a word?", "هل يمكن أن يبدأ الكلام بحرف ساكن؟"],
    opts: [o("Yes, if we read it quickly", "نعم إذا قرأناه بسرعة"), o("No, a moving letter must come before it", "لا، لا بد أن يسبقه حرف متحرك"), o("Only when it is a Hamza", "فقط إذا كان همزة")],
    ok: 1, why: ["A still letter needs a moving letter before it, like أَ before بْ.", "الحرف الساكن يحتاج إلى حرف متحرك قبله، مثل أَ قبل بْ."],
  },
  {
    id: 4, mode: "spot", p: ["Which one is the Mushaf form of Sukun?", "أيّ هذه صورة السكون في المصحف؟"],
    opts: [g("بۡ"), g("بّ"), g("بً")],
    ok: 0, why: ["The Madinah Mushaf writes Sukun as a small head of Ha. The others are Shaddah and Tanween.", "يكتب مصحف المدينة السكون على هيئة رأس حاء صغيرة، أمّا الأخريان فشدّة وتنوين."],
  },
  {
    id: 5, mode: "blend", p: ["How do we read أَتْ?", "كيف نقرأ «أَتْ»؟"],
    big: "أَتْ", hear: "أَتْ",
    opts: [o("a-ta: two sounds, with a vowel on Ta", "a-ta بصوتين وحركة على التاء"), o("at: joined in one closed sound", "at بصوت واحد مغلق"), o("aat: stretched", "aat ممدودة")],
    ok: 1, why: ["The Ta is still, so it joins the Alif in one closed syllable: at.", "التاء ساكنة فتتصل بالهمزة في مقطع مغلق واحد: at."],
  },
  {
    id: 6, mode: "blend", p: ["Which one is a closed syllable?", "أيّ هذه مقطع مغلق؟"],
    opts: [g("مَا"), g("مُو"), g("مَسْ")],
    ok: 2, why: ["A closed syllable ends with a sakin letter: مَسْ.", "المقطع المغلق ينتهي بحرف ساكن: مَسْ."],
  },
  {
    id: 7, mode: "blend", p: ["Which reading of أَبْ is WRONG?", "أيّ قراءة لـ «أَبْ» خاطئة؟"],
    big: "أَبْ", hear: "أَبْ",
    opts: [o("ab: stops at once", "ab: يقف فورًا"), o("aba: adds a hidden vowel", "aba: بإضافة حركة خفية"), o("ab: short and clear", "ab: قصيرة وواضحة")],
    ok: 1, why: ["Adding a vowel after the Sukun breaks the stillness. Stop on the letter.", "إضافة حركة بعد السكون تُفسده. قِف على الحرف."],
  },
  {
    id: 8, mode: "blend", p: ["Pick the syllable with a Kasra before the Sukun", "اختر المقطع الذي تسبق سكونَه كسرة"],
    opts: [g("أَمْ"), g("أُمْ"), g("إِمْ")],
    ok: 2, why: ["إِ carries the Kasra, then Meem is still: im.", "الهمزة مكسورة ثم الميم ساكنة: im."],
  },
  {
    id: 9, mode: "quran", p: ["In أَنْعَمْتَ (Al-Fatihah 7), which two letters are sakin?", "في «أَنْعَمْتَ» (الفاتحة 7)، ما الحرفان الساكنان؟"],
    big: "أَنْعَمْتَ", hear: "أَنْعَمْتَ",
    opts: [o("Noon and Meem", "النون والميم"), o("Ayn and Ta", "العين والتاء"), o("Alif and Noon", "الألف والنون")],
    ok: 0, why: ["Noon in أَنْ and Meem in عَمْ both carry a Sukun.", "النون في أَنْ والميم في عَمْ كلتاهما عليها سكون."],
  },
  {
    id: 10, mode: "quran", p: ["In مَسْجِدُ, which syllable is closed?", "في «مَسْجِدُ»، أيّ مقطع مغلق؟"],
    big: "مَسْجِدُ", hear: "مَسْجِدُ",
    opts: [g("جِ"), g("دُ"), g("مَسْ")],
    ok: 2, why: ["مَسْ ends with the still letter Seen.", "مَسْ ينتهي بالسين الساكنة."],
  },
  {
    id: 11, mode: "quran", p: ["In يَعْلَمُونَ, which letter is sakin?", "في «يَعْلَمُونَ»، أيّ حرف ساكن؟"],
    big: "يَعْلَمُونَ", hear: "يَعْلَمُونَ",
    opts: [g("ي"), g("ع"), g("ل")],
    ok: 1, why: ["Ayn carries the Sukun: يَعْ. Ya and Lam both have a Fatha.", "العين عليها سكون: يَعْ. أمّا الياء واللام ففيهما فتحة."],
  },
  {
    id: 12, mode: "quran", p: ["Which word has TWO sakin letters?", "أيّ كلمة فيها حرفان ساكنان؟"],
    opts: [g("مَسْجِدُ"), g("أَنْعَمْتَ"), g("يَعْلَمُونَ")],
    ok: 1, why: ["أَنْعَمْتَ has a Sukun on Noon and on Meem. The others have one.", "في أَنْعَمْتَ سكون على النون وعلى الميم، وفي الأخريين سكون واحد."],
  },
  {
    id: 13, mode: "qalqalah", p: ["Which are the 5 Qalqalah letters?", "ما حروف القلقلة الخمسة؟"],
    opts: [g("ب ت ث ج ح"), g("ق ط ب ج د"), g("ق ك ل م ن")],
    ok: 1, why: ["Remember قُطْبُ جَدٍ: Qaf, Taa, Ba, Jeem, Dal.", "احفظ «قُطْبُ جَدٍ»: القاف والطاء والباء والجيم والدال."],
  },
  {
    id: 14, mode: "qalqalah", p: ["What is Qalqalah?", "ما القلقلة؟"],
    opts: [o("A light echo on a sakin letter", "اهتزاز خفيف في الحرف الساكن"), o("A nasal hum for 2 beats", "غنّة بمقدار حركتين"), o("Stretching for 4 beats", "مدّ بمقدار أربع حركات")],
    ok: 0, why: ["Qalqalah is a small bounce of sound when one of the five letters is still.", "القلقلة اهتزاز صغير في الصوت إذا سكن أحد الحروف الخمسة."],
  },
  {
    id: 15, mode: "qalqalah", p: ["Which word has Qalqalah on its sakin letter?", "أيّ كلمة فيها قلقلة على حرفها الساكن؟"],
    opts: [g("أَنْعَمْتَ"), g("مَسْجِدُ"), g("يَدْخُلُونَ")],
    ok: 2, why: ["The Dal in يَدْ is sakin and is a Qalqalah letter.", "الدال في يَدْ ساكنة وهي من حروف القلقلة."],
  },
  {
    id: 16, mode: "qalqalah", p: ["When we stop on الْفَلَقِ, what do we do on the Qaf?", "عند الوقف على «الْفَلَقِ»، ماذا نفعل بالقاف؟"],
    big: "الْفَلَقْ", hear: "الْفَلَقْ",
    opts: [o("A clear echo (Qalqalah)", "قلقلة واضحة"), o("Nothing at all", "لا شيء"), o("Stretch it for 6 beats", "نمدّها ست حركات")],
    ok: 0, why: ["Stopping makes the Qaf still, so the echo is at its strongest.", "الوقف يُسكّن القاف فتظهر القلقلة في أقوى حالاتها."],
  },
];

const FINAL_IDS = [1, 3, 5, 6, 9, 10, 12, 13, 15, 16];

const GAMES: { id: GameId; icon: typeof Target; en: string; ar: string; dEn: string; dAr: string }[] = [
  { id: "spot", icon: Target, en: "Spot the Sukun", ar: "اكتشف السكون", dEn: "Recognise a still letter and its two shapes.", dAr: "تعرّف على الحرف الساكن وصورتَي السكون." },
  { id: "blend", icon: Layers, en: "Closed Syllable Lab", ar: "مختبر المقطع المغلق", dEn: "Join a moving letter and a still letter.", dAr: "اجمع الحرف المتحرك مع الحرف الساكن." },
  { id: "quran", icon: BookOpen, en: "Quran Sukun Hunt", ar: "صيد السكون في القرآن", dEn: "Find the sakin letters in real Quranic words.", dAr: "اعثر على الحروف الساكنة في كلمات قرآنية." },
  { id: "qalqalah", icon: Activity, en: "Qalqalah Echo", ar: "صدى القلقلة", dEn: "Know the five letters and when they echo.", dAr: "اعرف الحروف الخمسة ومتى تُقلقَل." },
  { id: "final", icon: Trophy, en: "Final Challenge", ar: "التحدي الختامي", dEn: "Ten mixed questions to prove your mastery.", dAr: "عشرة أسئلة متنوعة لإثبات إتقانك." },
];

const TABS: { id: Tab; icon: typeof BookOpen; en: string; ar: string }[] = [
  { id: "learn", icon: BookOpen, en: "Learn", ar: "تعلّم" },
  { id: "letters", icon: LayoutGrid, en: "Letters", ar: "الحروف" },
  { id: "reading", icon: Layers, en: "Read", ar: "اقرأ" },
  { id: "practice", icon: Gamepad2, en: "Practice", ar: "تدرّب" },
];

/* -------------------------------------------------------------------------- */
/*  Small hooks                                                               */
/* -------------------------------------------------------------------------- */

function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const m = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(m.matches);
    const on = () => setReduced(m.matches);
    m.addEventListener("change", on);
    return () => m.removeEventListener("change", on);
  }, []);
  return reduced;
}

function useTimers() {
  const ids = useRef<number[]>([]);
  const clear = useCallback(() => {
    ids.current.forEach((id) => window.clearTimeout(id));
    ids.current = [];
  }, []);
  const later = useCallback((fn: () => void, ms: number) => {
    ids.current.push(window.setTimeout(fn, ms));
  }, []);
  useEffect(() => clear, [clear]);
  return useMemo(() => ({ clear, later }), [clear, later]);
}

/* -------------------------------------------------------------------------- */
/*  Illustrations (pure CSS + transforms, no emoji)                           */
/* -------------------------------------------------------------------------- */

/** A ball of sound rolls from a moving letter and stops dead at a Sukun. */
function StillnessDemo({ tx, size }: { tx: Tx; size: string }) {
  const reduce = useReducedMotion();
  const t = useTimers();
  const [phase, setPhase] = useState<0 | 1 | 2>(0);

  const play = () => {
    t.clear();
    speakArabic("مَسْ", 0.7);
    if (reduce) {
      setPhase(2);
      t.later(() => setPhase(0), 2400);
      return;
    }
    setPhase(1);
    t.later(() => setPhase(2), 750);
    t.later(() => setPhase(0), 3000);
  };

  const ballRight = phase === 0 ? "12%" : phase === 1 ? "50%" : "57%";
  const steps = [
    tx("Moving letter: the sound flows", "الحرف المتحرك: ينساب الصوت"),
    tx("Sukun: the sound stops at once", "السكون: يقف الصوت فورًا"),
  ];

  return (
    <figure className="space-y-4">
      <div dir="rtl" aria-hidden="true" className="relative flex items-center justify-between gap-4 rounded-3xl border border-stone-200 bg-stone-50 px-5 py-8 dark:border-white/10 dark:bg-white/5">
        <span lang="ar" className={`arabic-font z-10 rounded-2xl border px-5 py-3 font-bold leading-none ${phase === 1 ? TILE_HOT : TILE}`} style={{ fontSize: size }}>
          مَ
        </span>
        <span className="pointer-events-none absolute inset-x-6 top-1/2 h-px border-t-2 border-dashed border-[#C8A96E]/60" />
        <span
          className="absolute top-1/2 z-20 h-7 w-7 -translate-y-1/2 rounded-full bg-gradient-to-br from-[#E3B45F] to-[#C8A96E] shadow-lg transition-[right] duration-700 ease-in-out motion-reduce:transition-none"
          style={{ right: ballRight }}
        />
        <span className={`pointer-events-none absolute bottom-5 start-[30%] top-5 w-1.5 rounded-full bg-rose-500 transition-opacity duration-300 motion-reduce:transition-none ${phase === 2 ? "opacity-100" : "opacity-0"}`} />
        <span lang="ar" className={`arabic-font z-10 rounded-2xl border px-5 py-3 font-bold leading-none transition-colors motion-reduce:transition-none ${phase === 2 ? "border-rose-400 bg-rose-50 text-rose-700 dark:bg-rose-400/10 dark:text-rose-200" : TILE}`} style={{ fontSize: size }}>
          سْ
        </span>
      </div>
      <figcaption className="flex flex-wrap items-center justify-between gap-3">
        <ol className="space-y-1 text-sm font-semibold">
          {steps.map((s, i) => (
            <li key={s} className={`flex items-center gap-2 ${phase === i + 1 ? "text-[#0D4F4F] dark:text-[#E3B45F]" : MUTED}`}>
              <span className={`flex h-5 w-5 items-center justify-center rounded-full text-[11px] ${phase === i + 1 ? "bg-[#C8A96E] text-[#06302f]" : "bg-stone-200 dark:bg-white/10"}`}>{i + 1}</span>
              {s}
            </li>
          ))}
        </ol>
        <button type="button" onClick={play} className={BTN_PRIMARY}>
          <Play aria-hidden="true" className="h-4 w-4" />
          {tx("Play مَسْ", "شغّل مَسْ")}
        </button>
      </figcaption>
    </figure>
  );
}

/** Two tiles slide together into one closed syllable. */
function SyllableBlend({ carrier, sakin, say, size, tx, onDark = false }: { carrier: string; sakin: string; say: string; size: string; tx: Tx; onDark?: boolean }) {
  const reduce = useReducedMotion();
  const [merged, setMerged] = useState(false);
  const tile = onDark ? "border-white/20 bg-white/10 text-white" : TILE;
  const move = reduce ? "" : "transition-transform duration-500 ease-out";
  const toggle = () => {
    const next = !merged;
    setMerged(next);
    if (next) speakArabic(say, 0.7);
  };
  return (
    <div className="space-y-4">
      <div dir="rtl" aria-hidden="true" className="flex justify-center py-2">
        <div className={`flex items-center gap-1 rounded-3xl p-2 transition-all duration-500 motion-reduce:transition-none ${merged ? "bg-[#C8A96E]/20 ring-2 ring-[#C8A96E]" : "ring-2 ring-transparent"}`}>
          <span lang="ar" className={`arabic-font rounded-2xl border px-5 py-3 font-bold leading-none ${tile} ${move} ${merged ? "translate-x-0" : "translate-x-5"}`} style={{ fontSize: size }}>{carrier}</span>
          <span lang="ar" className={`arabic-font rounded-2xl border px-5 py-3 font-bold leading-none ${tile} ${move} ${merged ? "translate-x-0" : "-translate-x-5"}`} style={{ fontSize: size }}>{sakin}</span>
        </div>
      </div>
      <div className="flex justify-center">
        <button type="button" onClick={toggle} aria-pressed={merged} className={onDark ? BTN_GOLD.replace("min-h-12", "min-h-11") : BTN_PRIMARY}>
          {merged ? <RotateCcw aria-hidden="true" className="h-4 w-4" /> : <Play aria-hidden="true" className="h-4 w-4" />}
          {merged ? tx("Separate again", "افصلهما من جديد") : tx("Blend into one syllable", "اجمعهما في مقطع واحد")}
        </button>
      </div>
    </div>
  );
}

/** A ball bounces when one of the five Qalqalah letters is still. */
function QalqalahBounce({ tx, size }: { tx: Tx; size: string }) {
  const reduce = useReducedMotion();
  const t = useTimers();
  const [ch, setCh] = useState("ق");
  const [step, setStep] = useState(0);

  const play = (next: string) => {
    t.clear();
    setCh(next);
    speakArabic(syl(letterOf(next), "a").ar, 0.65);
    if (reduce) return;
    setStep(1);
    t.later(() => setStep(2), 140);
    t.later(() => setStep(3), 420);
    t.later(() => setStep(0), 640);
  };

  const ballStyle: React.CSSProperties = {
    transform:
      step === 1 ? "translateY(0) scale(1.3, 0.7)" : step === 2 ? "translateY(-46px) scale(0.9, 1.1)" : step === 3 ? "translateY(0) scale(1.12, 0.85)" : "translateY(0) scale(1)",
    transition: reduce ? "none" : "transform 150ms ease-out",
  };

  return (
    <div className="space-y-5">
      <div dir="rtl" aria-hidden="true" className="relative flex h-40 flex-col items-center justify-end rounded-3xl border border-stone-200 bg-stone-50 pb-5 dark:border-white/10 dark:bg-white/5">
        <span className="mb-1 block h-7 w-7 rounded-full bg-gradient-to-br from-[#E3B45F] to-[#C8A96E] shadow-lg" style={ballStyle} />
        <span className="h-1 w-3/4 rounded-full bg-[#0D4F4F]/30 dark:bg-white/20" />
        <span lang="ar" className="arabic-font absolute start-4 top-3 font-bold text-[#0D4F4F] dark:text-white" style={{ fontSize: size }}>
          {syl(letterOf(ch), "a").ar}
        </span>
      </div>
      <ul dir="rtl" className="grid grid-cols-5 gap-2">
        {QALQALAH.map((q) => (
          <li key={q}>
            <button
              type="button"
              onClick={() => play(q)}
              aria-label={tx(`Hear and bounce ${letterOf(q).en}`, `اسمع وشاهد القلقلة في ${letterOf(q).ar}`)}
              className={`w-full rounded-2xl border py-3 text-center transition motion-reduce:transition-none ${ch === q ? TILE_HOT : TILE} ${FOCUS}`}
            >
              <span lang="ar" className="arabic-font block text-3xl font-bold leading-none">{q}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Lesson                                                                    */
/* -------------------------------------------------------------------------- */

export default function SoukoonLesson() {
  const lessonCtx = useLesson();
  const isTeacherMode = lessonCtx?.isTeacherMode ?? false;

  const pathname = usePathname() ?? "";
  const isAr = pathname.split("/")[1] === "ar";
  const locale = isAr ? "ar" : "en";
  const tx: Tx = useCallback((en, ar) => (isAr ? ar : en), [isAr]);
  const courseHref = `/${locale}/curriculum/noor-al-bayan`;
  const Fwd = isAr ? ArrowLeft : ArrowRight;
  const Back = isAr ? ArrowRight : ArrowLeft;

  const meta = getNoorAlBayanLessonBySlug(SLUG);
  const adj = getAdjacentNoorLessons(SLUG);
  const total = NOOR_AL_BAYAN_LESSONS.length;
  const minutes = meta?.estimatedMinutes ?? 25;

  const [hints, setHints] = useState<boolean>(!isTeacherMode);
  const [scale, setScale] = useState<number>(lessonCtx?.fontSizeMultiplier ?? 1.1);
  const [presenting, setPresenting] = useState(false);
  const [tab, setTab] = useState<Tab>("learn");
  const [flash, setFlash] = useState<string | null>(null);

  const [vowel, setVowel] = useState<Vowel>("a");
  const [filter, setFilter] = useState<Filter>("all");
  const [search, setSearch] = useState("");
  const [drill, setDrill] = useState<number | null>(null);

  const [wordIdx, setWordIdx] = useState(0);
  const [hot, setHot] = useState<number | null>(null);
  const [spelling, setSpelling] = useState(false);

  const [game, setGame] = useState<GameId | "menu">("menu");
  const [qi, setQi] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [missed, setMissed] = useState<number[]>([]);
  const [finished, setFinished] = useState(false);
  const [best, setBest] = useState<Record<string, number>>({});

  const timers = useTimers();
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const contentRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as { best?: Record<string, unknown> };
      if (!parsed?.best || typeof parsed.best !== "object") return;
      const clean: Record<string, number> = {};
      Object.entries(parsed.best).forEach(([k, v]) => {
        if (typeof v === "number" && Number.isFinite(v) && v >= 0) clean[k] = v;
      });
      setBest(clean);
    } catch {
      /* storage unavailable: progress simply is not remembered */
    }
  }, []);

  const stars = useMemo(() => Object.values(best).reduce((a, b) => a + b, 0), [best]);

  const fluid = (min: number, vw: number, max: number) =>
    `clamp(${(min * scale).toFixed(2)}rem, ${(vw * scale).toFixed(2)}vw + 0.4rem, ${(max * scale).toFixed(2)}rem)`;

  const hear = useCallback(
    (text: string, key: string, rate = 0.7) => {
      setFlash(key);
      speakArabic(text, rate);
      timers.later(() => setFlash((p) => (p === key ? null : p)), 600);
    },
    [timers]
  );

  const letters = useMemo(() => {
    const q = search.trim().toLowerCase();
    return LETTERS.filter((l) => {
      if (filter === "heavy" && !l.heavy) return false;
      if (filter === "qalqalah" && !isQalq(l.ch)) return false;
      if (!q) return true;
      return l.en.toLowerCase().includes(q) || l.ar.includes(q) || l.ch.includes(q) || l.tr.toLowerCase() === q;
    });
  }, [search, filter]);

  const word = WORDS[wordIdx];

  const spell = () => {
    if (spelling) return;
    timers.clear();
    setSpelling(true);
    let at = 0;
    word.syl.forEach((s, i) => {
      timers.later(() => {
        setHot(i);
        speakArabic(s.ar, 0.65);
      }, at);
      at += 800;
    });
    timers.later(() => {
      setHot(null);
      speakArabic(word.ar, 0.75);
    }, at);
    timers.later(() => setSpelling(false), at + 900);
  };

  const questions = useMemo(() => {
    if (game === "menu") return [];
    if (game === "final") return QUESTIONS.filter((x) => FINAL_IDS.includes(x.id));
    return QUESTIONS.filter((x) => x.mode === game);
  }, [game]);
  const q = questions[qi];
  const answered = picked !== null;

  const start = (id: GameId | "menu") => {
    setGame(id);
    setQi(0);
    setPicked(null);
    setScore(0);
    setMissed([]);
    setFinished(false);
  };

  const pick = (i: number) => {
    if (answered || !q) return;
    setPicked(i);
    if (i === q.ok) {
      setScore((s) => s + 1);
      if (q.hear) speakArabic(q.hear, 0.7);
    } else {
      setMissed((m) => [...m, q.id]);
    }
  };

  const next = () => {
    if (qi + 1 < questions.length) {
      setQi((i) => i + 1);
      setPicked(null);
      return;
    }
    if (game !== "menu") {
      const prev = best[game] ?? 0;
      if (score > prev) {
        const merged = { ...best, [game]: score };
        setBest(merged);
        try {
          window.localStorage.setItem(STORE_KEY, JSON.stringify({ best: merged }));
        } catch {
          /* ignore */
        }
      }
    }
    setFinished(true);
  };

  const onTabKey = (e: React.KeyboardEvent, index: number) => {
    const last = TABS.length - 1;
    const forward = isAr ? "ArrowLeft" : "ArrowRight";
    const backward = isAr ? "ArrowRight" : "ArrowLeft";
    let to = -1;
    if (e.key === forward) to = index === last ? 0 : index + 1;
    else if (e.key === backward) to = index === 0 ? last : index - 1;
    else if (e.key === "Home") to = 0;
    else if (e.key === "End") to = last;
    if (to >= 0) {
      e.preventDefault();
      setTab(TABS[to].id);
      tabRefs.current[TABS[to].id]?.focus();
    }
  };

  const goTab = (id: Tab) => {
    setTab(id);
    contentRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const heading = headingClass(isAr);

  const slides: Slide[] = [
    {
      id: "title",
      title: tx("Sukun and Qalqalah", "السكون والقلقلة"),
      node: (
        <div className="space-y-6 text-center">
          <p lang="ar" dir="rtl" className="arabic-font font-bold text-[#A8832F] dark:text-[#E3B45F]" style={{ fontSize: fluid(3, 8, 5) }}>السُّكُونُ وَالقَلْقَلَة</p>
          <h2 className="text-4xl font-black text-[#0D4F4F] dark:text-white sm:text-6xl">{tx("The letter that stops, and the echo", "الحرف الذي يقف، وصداه")}</h2>
        </div>
      ),
    },
    { id: "stop", title: tx("Sukun means rest", "السكون يعني الراحة"), node: <div className="mx-auto max-w-3xl"><StillnessDemo tx={tx} size={fluid(3, 8, 5)} /></div> },
    {
      id: "shapes",
      title: tx("Two shapes, one meaning", "صورتان ومعنى واحد"),
      node: (
        <div dir="rtl" className="mx-auto grid max-w-3xl grid-cols-2 gap-6 text-center">
          {[["بْ", tx("Round circle", "الدائرة")], ["بۡ", tx("Mushaf head of Ha", "رأس الحاء في المصحف")]].map(([glyph, label]) => (
            <div key={glyph} className={`rounded-3xl p-6 ${CARD}`}>
              <p lang="ar" className="arabic-font font-bold text-[#0D4F4F] dark:text-white" style={{ fontSize: fluid(4, 10, 7) }}>{glyph}</p>
              <p className={`mt-2 text-lg font-bold ${MUTED}`}>{label}</p>
            </div>
          ))}
        </div>
      ),
    },
    { id: "blend", title: tx("A moving letter comes first", "يسبقه حرف متحرك"), node: <div className="mx-auto max-w-2xl"><SyllableBlend carrier="أَ" sakin={`ب${SUKUN}`} say="أَبْ" size={fluid(4, 10, 7)} tx={tx} /></div> },
    { id: "qalq", title: tx("Qalqalah: قُطْبُ جَدٍ", "القلقلة: قُطْبُ جَدٍ"), node: <div className="mx-auto max-w-2xl"><QalqalahBounce tx={tx} size={fluid(3, 8, 5)} /></div> },
  ];

  const t = (en: string, ar: string) => tx(en, ar);

  return (
    <div className="min-h-screen w-full bg-[#FBF8F2] font-sans text-slate-900 dark:bg-[#0B0F19] dark:text-slate-100">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "LearningResource",
            name: "Noor Al-Bayan: Sukun and Qalqalah",
            description: "Learn Arabic Sukun, closed syllables and the five Qalqalah letters with audio, a 28-letter chart, Quranic words and a quiz.",
            educationalLevel: "Beginner",
            learningResourceType: "Interactive lesson",
            teaches: "Reading sakin letters, closed syllables and Qalqalah",
            inLanguage: ["en", "ar"],
            isAccessibleForFree: true,
            timeRequired: `PT${minutes}M`,
            provider: { "@type": "EducationalOrganization", name: "Tajwedo Institute" },
          }).replace(/</g, "\\u003c"),
        }}
      />

      <SlideDeck open={presenting} onClose={() => setPresenting(false)} slides={slides} heading={t("Sukun and Qalqalah", "السكون والقلقلة")} />

      {/* ================================ HERO ================================ */}
      <HeroShell labelledBy="sukun-title" className="pt-28 sm:pt-32">
        <div className={`${WRAP} pb-20 lg:pb-24`}>
          <nav aria-label="Breadcrumb" className="mb-8 flex flex-wrap items-center gap-1.5 text-sm font-semibold text-white/70">
            <Link href={`/${locale}`} className="rounded hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-white">{t("Home", "الرئيسية")}</Link>
            <ChevronRight aria-hidden="true" className="h-3.5 w-3.5 opacity-60 rtl:rotate-180" />
            <Link href={courseHref} className="rounded hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-white">{t("Noor Al-Bayan", "نور البيان")}</Link>
            <ChevronRight aria-hidden="true" className="h-3.5 w-3.5 opacity-60 rtl:rotate-180" />
            <span aria-current="page" className="text-white">{t(`Lesson ${meta?.number ?? 3}`, `الدرس ${meta?.number ?? 3}`)}</span>
          </nav>

          <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3.5 py-1.5 text-[13px] font-semibold text-[#E6CF9F] backdrop-blur-sm">
                <span aria-hidden="true" className="h-2 w-2 rounded-full bg-emerald-400" />
                {t(`Lesson ${meta?.number ?? 3} of ${total} · ${minutes} min`, `الدرس ${meta?.number ?? 3} من ${total} · ${minutes} دقيقة`)}
              </span>
              <p lang="ar" dir="rtl" className="arabic-font mt-6 text-2xl font-bold text-[#E3B45F]">السُّكُونُ وَالقَلْقَلَة</p>
              <h1 id="sukun-title" className={`mt-2 text-[2.25rem] text-white [text-wrap:balance] sm:text-5xl lg:text-6xl ${heading}`}>
                {t("Sukun & Qalqalah", "السكون والقلقلة")}
              </h1>
              <Ornament className="my-5" />
              <p className="max-w-xl text-lg leading-relaxed text-white/80">
                {t(
                  "Learn how a still letter leans on the letter before it, and how five special letters give a small echo.",
                  "تعلّم كيف يستند الحرف الساكن إلى الحرف الذي قبله، وكيف تُصدر خمسة حروف خاصة صدى خفيفًا."
                )}
              </p>
              <ul className="mt-6 space-y-2 text-sm font-semibold text-white/90">
                {[
                  t("Read closed syllables like أَبْ and مَسْ", "اقرأ المقاطع المغلقة مثل أَبْ ومَسْ"),
                  t("Know the two shapes of Sukun", "اعرف صورتَي السكون"),
                  t("Echo the five Qalqalah letters قُطْبُ جَدٍ", "قلقل الحروف الخمسة قُطْبُ جَدٍ"),
                ].map((x) => (
                  <li key={x} className="flex items-start gap-2.5">
                    <Check aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-[#E3B45F]" />
                    <span>{x}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-8 flex flex-wrap gap-3">
                <button type="button" onClick={() => goTab("learn")} className={BTN_GOLD}>
                  {t("Start the lesson", "ابدأ الدرس")}
                  <Fwd aria-hidden="true" className="h-4 w-4" />
                </button>
                <button type="button" onClick={() => setPresenting(true)} className={BTN_GHOST}>
                  <Presentation aria-hidden="true" className="h-4 w-4" />
                  {t("Present to class", "اعرض على الطلاب")}
                </button>
              </div>
            </div>

            <div className="relative mx-auto w-full max-w-md lg:justify-self-end">
              <div aria-hidden="true" className="absolute inset-0 translate-x-3 translate-y-3 rounded-3xl border border-[#C8A96E]/40 rtl:-translate-x-3" />
              <div className="relative space-y-5 rounded-3xl border border-white/15 bg-white/[0.07] p-6 shadow-2xl backdrop-blur-sm">
                <p className="text-sm font-semibold text-white/70">{t("Try it: join the two letters", "جرّب: اجمع الحرفين")}</p>
                <SyllableBlend carrier="أَ" sakin={`ب${SUKUN}`} say="أَبْ" size="3.2rem" tx={tx} onDark />
                <div className="border-t border-white/15 pt-4">
                  <p className="mb-2 text-xs font-semibold text-white/70">{t("The five echo letters", "حروف القلقلة الخمسة")}</p>
                  <ul dir="rtl" className="grid grid-cols-5 gap-2">
                    {QALQALAH.map((c) => (
                      <li key={c}>
                        <button
                          type="button"
                          onClick={() => hear(syl(letterOf(c), "a").ar, `hero-${c}`)}
                          aria-label={t(`Hear ${letterOf(c).en}`, `اسمع ${letterOf(c).ar}`)}
                          className={`w-full rounded-xl border py-2 transition motion-reduce:transition-none ${flash === `hero-${c}` ? "border-[#C8A96E] bg-[#C8A96E]/25" : "border-white/20 bg-white/5 hover:bg-white/10"} text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-white`}
                        >
                          <span lang="ar" className="arabic-font text-2xl font-bold leading-none">{c}</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </HeroShell>

      {/* ============================ STICKY TOOLBAR ============================ */}
      <div ref={contentRef} className="z-30 scroll-mt-24 border-b border-stone-200 bg-white/90 backdrop-blur-xl dark:border-white/10 dark:bg-[#0B0F19]/90 md:sticky md:top-[5.35rem]">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-8">
          <div role="tablist" aria-label={t("Lesson sections", "أقسام الدرس")} className="flex items-center overflow-x-auto rounded-2xl border border-stone-200 bg-stone-100/80 p-1.5 dark:border-white/10 dark:bg-white/5">
            {TABS.map((tb, index) => {
              const Icon = tb.icon;
              const active = tab === tb.id;
              return (
                <button
                  key={tb.id}
                  ref={(el) => {
                    tabRefs.current[tb.id] = el;
                  }}
                  id={`sukun-tab-${tb.id}`}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  aria-controls={`sukun-panel-${tb.id}`}
                  tabIndex={active ? 0 : -1}
                  onClick={() => setTab(tb.id)}
                  onKeyDown={(e) => onTabKey(e, index)}
                  className={`inline-flex min-h-10 shrink-0 items-center gap-2 rounded-xl px-4 text-sm font-bold transition-colors motion-reduce:transition-none ${FOCUS} ${active ? "bg-[#0D4F4F] text-white shadow-md dark:bg-teal-400 dark:text-slate-950" : "text-slate-600 hover:bg-white dark:text-slate-300 dark:hover:bg-white/10"}`}
                >
                  <Icon aria-hidden="true" className="h-4 w-4" />
                  {t(tb.en, tb.ar)}
                </button>
              );
            })}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="flex min-h-10 items-center gap-1.5 rounded-xl border border-amber-200 bg-amber-50 px-3 text-sm font-extrabold text-amber-800 dark:border-amber-400/30 dark:bg-amber-400/10 dark:text-amber-300" role="status" aria-label={t(`${stars} stars earned`, `${stars} نجمة مكتسبة`)}>
              <Star aria-hidden="true" className="h-4 w-4 fill-amber-500 text-amber-500" />
              <span className="tabular-nums">{stars}</span>
            </div>
            <div role="group" aria-label={t("Arabic text size", "حجم الخط العربي")} className="flex items-center rounded-xl border border-stone-200 dark:border-white/10">
              <button type="button" onClick={() => setScale((s) => Math.max(0.8, +(s - 0.1).toFixed(1)))} aria-label={t("Smaller Arabic text", "تصغير الخط العربي")} className={`flex h-10 w-10 items-center justify-center rounded-s-xl hover:bg-stone-100 dark:hover:bg-white/10 ${FOCUS}`}>
                <Minus aria-hidden="true" className="h-4 w-4" />
              </button>
              <span className="w-12 text-center text-xs font-bold tabular-nums">{Math.round(scale * 100)}%</span>
              <button type="button" onClick={() => setScale((s) => Math.min(1.8, +(s + 0.1).toFixed(1)))} aria-label={t("Larger Arabic text", "تكبير الخط العربي")} className={`flex h-10 w-10 items-center justify-center rounded-e-xl hover:bg-stone-100 dark:hover:bg-white/10 ${FOCUS}`}>
                <Plus aria-hidden="true" className="h-4 w-4" />
              </button>
            </div>
            <button type="button" onClick={() => setHints((h) => !h)} aria-pressed={hints} className={`inline-flex min-h-10 items-center gap-1.5 rounded-xl border px-3.5 text-xs font-bold ${FOCUS} ${hints ? "border-emerald-300 bg-emerald-50 text-emerald-800 dark:border-emerald-400/30 dark:bg-emerald-400/10 dark:text-emerald-300" : "border-stone-200 bg-stone-100 text-slate-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-300"}`}>
              {hints ? <Eye aria-hidden="true" className="h-3.5 w-3.5" /> : <EyeOff aria-hidden="true" className="h-3.5 w-3.5" />}
              {t("Hints", "التلميحات")}: {hints ? t("ON", "تعمل") : t("OFF", "متوقفة")}
            </button>
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-7xl space-y-6 px-4 py-12 sm:px-8">
        <VoiceNotice />

        {/* ------------------------------ 1. LEARN ------------------------------ */}
        <div role="tabpanel" id="sukun-panel-learn" aria-labelledby="sukun-tab-learn" hidden={tab !== "learn"} tabIndex={0} className={`space-y-20 rounded-2xl ${FOCUS}`}>
          <section aria-labelledby="s1" className="grid gap-10 lg:grid-cols-2 lg:items-center">
            <div className="space-y-4">
              <p className="inline-flex items-center gap-2 text-sm font-bold text-[#0D6B66] dark:text-teal-300"><Zap aria-hidden="true" className="h-4 w-4" />{t("Part 1", "الجزء الأول")}</p>
              <h2 id="s1" className={`text-3xl sm:text-4xl ${heading} ${INK}`}>{t("Sukun: the letter that stops", "السكون: الحرف الذي يقف")}</h2>
              <p className={`text-base leading-relaxed ${MUTED}`}>
                {t(
                  "Sukun means rest. A letter with Sukun has no vowel, so it stops at once and leans on the letter before it. Together they make one closed syllable, like أَبْ or مَسْ.",
                  "السكون معناه الراحة. الحرف الساكن لا حركة عليه، فيقف فورًا ويستند إلى الحرف الذي قبله، فيتكوّن مقطع مغلق واحد مثل أَبْ أو مَسْ."
                )}
              </p>
            </div>
            <div className={`rounded-3xl p-5 sm:p-6 ${CARD}`}>
              <StillnessDemo tx={tx} size={fluid(2.4, 6, 3.6)} />
            </div>
          </section>

          <section aria-labelledby="s2" className="space-y-8">
            <div className="max-w-2xl space-y-3">
              <h2 id="s2" className={`text-3xl sm:text-4xl ${heading} ${INK}`}>{t("Two shapes, one meaning", "صورتان ومعنى واحد")}</h2>
              <p className={`text-base leading-relaxed ${MUTED}`}>
                {t(
                  "School books usually show Sukun as a small circle. The Madinah Mushaf writes it as a small head of the letter Ha. Both mean the letter is still.",
                  "تكتب كتب التعليم السكون غالبًا دائرة صغيرة، ويكتبه مصحف المدينة على هيئة رأس حاء صغيرة. والمعنى واحد: الحرف ساكن."
                )}
              </p>
            </div>
            <ul className="grid gap-6 sm:grid-cols-2">
              {[
                { key: "circle", glyph: `ب${SUKUN}`, say: `أَب${SUKUN}`, en: "Round circle (ْ)", ar: "الدائرة (ْ)", dEn: "Used in school books and learning apps.", dAr: "تُستخدم في كتب التعليم والتطبيقات." },
                { key: "mushaf", glyph: "بۡ", say: "أَبْ", en: "Mushaf head of Ha (ۡ)", ar: "رأس الحاء في المصحف (ۡ)", dEn: "Used in the Madinah Mushaf you will read from.", dAr: "يُستخدم في مصحف المدينة الذي ستقرأ منه." },
              ].map((s) => (
                <li key={s.key}>
                  <button type="button" onClick={() => hear(s.say, `shape-${s.key}`)} className={`flex w-full items-center gap-5 rounded-3xl p-6 text-start shadow-sm transition hover:-translate-y-0.5 motion-reduce:transition-none motion-reduce:hover:translate-y-0 ${flash === `shape-${s.key}` ? "ring-2 ring-[#C8A96E]" : ""} ${CARD} ${FOCUS}`}>
                    <span lang="ar" dir="rtl" className="arabic-font font-bold text-[#0D4F4F] dark:text-white" style={{ fontSize: fluid(3, 7, 4.5) }}>{s.glyph}</span>
                    <span className="flex-1">
                      <span className={`block text-lg font-extrabold ${INK}`}>{t(s.en, s.ar)}</span>
                      <span className={`mt-1 block text-sm ${MUTED}`}>{t(s.dEn, s.dAr)}</span>
                    </span>
                    <Volume2 aria-hidden="true" className="h-5 w-5 shrink-0 text-[#0D6B66] dark:text-teal-300" />
                  </button>
                </li>
              ))}
            </ul>
          </section>

          <section aria-labelledby="s3" className="grid gap-10 lg:grid-cols-2 lg:items-center">
            <div className={`order-2 rounded-3xl p-5 sm:p-6 lg:order-1 ${CARD}`}>
              <SyllableBlend carrier="أَ" sakin={`ب${SUKUN}`} say="أَبْ" size={fluid(3, 7, 4.5)} tx={tx} />
            </div>
            <div className="order-1 space-y-4 lg:order-2">
              <h2 id="s3" className={`text-3xl sm:text-4xl ${heading} ${INK}`}>{t("A still letter never starts a word", "الحرف الساكن لا يبدأ به الكلام")}</h2>
              <p className={`text-base leading-relaxed ${MUTED}`}>
                {t(
                  "Arabic never begins with a still letter, so a moving letter always comes first. Press the button to join أَ and بْ in one breath.",
                  "لا يبدأ الكلام العربي بحرف ساكن، فيسبقه دائمًا حرف متحرك. اضغط الزر لتجمع أَ وبْ في نَفَس واحد."
                )}
              </p>
              <div className="flex items-start gap-3 rounded-2xl border border-[#C8A96E]/50 bg-[#C8A96E]/10 p-4 text-sm leading-relaxed">
                <Lightbulb aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-[#A8832F] dark:text-[#E3B45F]" />
                <p className="text-slate-700 dark:text-slate-200">
                  {t("Say ab, not aba. Do not add a hidden vowel after the Sukun.", "قل ab وليس aba. لا تُضِف حركة خفية بعد السكون.")}
                </p>
              </div>
            </div>
          </section>

          <section aria-labelledby="s4" className="grid gap-10 lg:grid-cols-2 lg:items-center">
            <div className="space-y-4">
              <p className="inline-flex items-center gap-2 text-sm font-bold text-[#0D6B66] dark:text-teal-300"><Activity aria-hidden="true" className="h-4 w-4" />{t("Part 2", "الجزء الثاني")}</p>
              <h2 id="s4" className={`text-3xl sm:text-4xl ${heading} ${INK}`}>{t("Qalqalah: a little echo", "القلقلة: صدى خفيف")}</h2>
              <p className={`text-base leading-relaxed ${MUTED}`}>
                {t(
                  "When one of the five letters ق ط ب ج د is still, its sound gives a small bounce. Remember them as قُطْبُ جَدٍ. The echo is strongest when you stop on the letter.",
                  "إذا سكن أحد الحروف الخمسة ق ط ب ج د اهتزّ صوته اهتزازًا خفيفًا. احفظها في «قُطْبُ جَدٍ». وتكون القلقلة أقوى ما يكون عند الوقف على الحرف."
                )}
              </p>
              <ul dir="rtl" className="grid grid-cols-3 gap-2">
                {[
                  { w: "يَدْخُلُونَ", n: t("middle", "وسط الكلمة") },
                  { w: "الْفَلَقْ", n: t("stop", "عند الوقف") },
                  { w: "أَحَدْ", n: t("stop", "عند الوقف") },
                ].map((x) => (
                  <li key={x.w}>
                    <button type="button" onClick={() => hear(x.w, `ex-${x.w}`)} className={`w-full rounded-2xl border py-3 text-center transition motion-reduce:transition-none ${flash === `ex-${x.w}` ? TILE_HOT : TILE} ${FOCUS}`}>
                      <span lang="ar" className="arabic-font block text-2xl font-bold">{x.w}</span>
                      {hints && <span dir="ltr" className={`block text-[11px] font-bold ${MUTED}`}>{x.n}</span>}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            <div className={`rounded-3xl p-5 sm:p-6 ${CARD}`}>
              <QalqalahBounce tx={tx} size={fluid(2.2, 5, 3.2)} />
            </div>
          </section>

          <TeacherCorner
            sections={[
              {
                heading: t("Lesson goals", "أهداف الدرس"),
                items: [
                  t("Understand that a still letter needs a moving letter before it.", "أن يفهم الطالب أن الحرف الساكن يحتاج إلى حرف متحرك قبله."),
                  t("Read closed syllables such as أَبْ، مَسْ، يَعْ without adding a vowel.", "قراءة المقاطع المغلقة مثل أَبْ ومَسْ ويَعْ دون إضافة حركة."),
                  t("Recognise both shapes of Sukun.", "التمييز بين صورتَي السكون."),
                  t("Echo the five Qalqalah letters قُطْبُ جَدٍ.", "قلقلة الحروف الخمسة قُطْبُ جَدٍ."),
                ],
              },
              {
                heading: t(`A ${minutes}-minute plan`, `خطة الدرس في ${minutes} دقيقة`),
                items: [
                  t("5 min: Play the stopping ball and explain that Sukun means rest.", "5 دقائق: شغّل الكرة المتوقفة واشرح أن السكون راحة."),
                  t("7 min: Drill the Letters tab with Fatha, then Kasra, then Damma.", "7 دقائق: دَرّب الحروف بالفتحة ثم الكسرة ثم الضمة."),
                  t("8 min: Read the six words in the Read tab, then the echo letters.", "8 دقائق: اقرأ الكلمات الست في تبويب اقرأ ثم حروف القلقلة."),
                  t("5 min: Final Challenge.", "5 دقائق: التحدي الختامي."),
                ],
              },
              {
                heading: t("Mistakes to listen for", "أخطاء يجب الانتباه لها"),
                items: [
                  t("Adding a hidden vowel after the Sukun (mas becomes masa).", "إضافة حركة خفية بعد السكون (مَسْ تصبح مَسَ)."),
                  t("Echoing letters that are not Qalqalah, such as Meem or Noon.", "قلقلة حروف ليست من حروف القلقلة مثل الميم والنون."),
                  t("No echo at all when stopping on قُطْبُ جَدٍ.", "ترك القلقلة عند الوقف على حروف قُطْبُ جَدٍ."),
                ],
              },
            ]}
          />
        </div>

        {/* ------------------------------ 2. LETTERS ------------------------------ */}
        <div role="tabpanel" id="sukun-panel-letters" aria-labelledby="sukun-tab-letters" hidden={tab !== "letters"} tabIndex={0} className={`space-y-8 rounded-2xl ${FOCUS}`}>
          <div className="max-w-2xl space-y-3">
            <h2 className={`text-3xl sm:text-4xl ${heading} ${INK}`}>{t("28 letters with Sukun", "الحروف الـ 28 مع السكون")}</h2>
            <p className={`text-base ${MUTED}`}>
              {t("Choose the vowel on the moving letter, then tap any tile to hear the closed syllable.", "اختر حركة الحرف المتحرك ثم المس أي بطاقة لتسمع المقطع المغلق.")}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div role="group" aria-label={t("Vowel before the Sukun", "الحركة قبل السكون")} className="flex rounded-full border border-stone-300 p-1 dark:border-white/20">
              {(Object.keys(CARRIERS) as Vowel[]).map((v) => (
                <button key={v} type="button" aria-pressed={vowel === v} onClick={() => setVowel(v)} className={`min-h-10 rounded-full px-4 text-sm font-bold ${FOCUS} ${vowel === v ? "bg-[#0D4F4F] text-white dark:bg-teal-400 dark:text-slate-950" : "text-slate-700 hover:bg-stone-100 dark:text-slate-200 dark:hover:bg-white/10"}`}>
                  {t(CARRIERS[v].en, CARRIERS[v].arName)}
                </button>
              ))}
            </div>
            <div role="group" aria-label={t("Filter letters", "تصفية الحروف")} className="flex flex-wrap gap-2">
              {([["all", t("All", "الكل")], ["heavy", t("Heavy", "المفخّمة")], ["qalqalah", t("Qalqalah", "القلقلة")]] as [Filter, string][]).map(([id, label]) => (
                <button key={id} type="button" aria-pressed={filter === id} onClick={() => setFilter(id)} className={`min-h-10 rounded-full border px-4 text-sm font-bold ${FOCUS} ${filter === id ? "border-[#0D4F4F] bg-[#0D4F4F] text-white dark:border-teal-400 dark:bg-teal-400 dark:text-slate-950" : "border-stone-300 text-slate-700 hover:bg-stone-100 dark:border-white/20 dark:text-slate-200 dark:hover:bg-white/10"}`}>
                  {label}
                </button>
              ))}
            </div>
            <div className="relative">
              <Search aria-hidden="true" className="pointer-events-none absolute start-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input type="search" value={search} onChange={(e) => setSearch(e.target.value)} placeholder={t("Search a letter", "ابحث عن حرف")} aria-label={t("Search a letter", "ابحث عن حرف")} className={`min-h-11 w-56 rounded-xl border border-stone-300 bg-white ps-10 pe-4 text-sm font-semibold text-slate-800 outline-none focus:border-[#0D9488] dark:border-white/15 dark:bg-[#111827] dark:text-white ${FOCUS}`} />
            </div>
            <button type="button" onClick={() => setDrill(Math.floor(Math.random() * LETTERS.length))} className={BTN_OUTLINE}>
              <Shuffle aria-hidden="true" className="h-4 w-4" />
              {t("Random drill", "تدريب عشوائي")}
            </button>
          </div>

          {drill !== null && (
            <section aria-label={t("Random drill", "تدريب عشوائي")} className={`relative overflow-hidden rounded-3xl p-8 text-center shadow-sm ${CARD}`}>
              <button type="button" onClick={() => setDrill(null)} aria-label={t("Close drill", "إغلاق التدريب")} className={`absolute end-4 top-4 flex h-10 w-10 items-center justify-center rounded-full hover:bg-stone-100 dark:hover:bg-white/10 ${FOCUS}`}>
                <X aria-hidden="true" className="h-5 w-5" />
              </button>
              <button type="button" onClick={() => hear(syl(LETTERS[drill], vowel).ar, "drill")} className={`rounded-2xl px-6 py-2 ${FOCUS}`} aria-label={t("Hear this syllable", "اسمع هذا المقطع")}>
                <span lang="ar" dir="rtl" className="arabic-font block font-bold text-[#0D4F4F] dark:text-white" style={{ fontSize: fluid(5, 13, 9) }}>{syl(LETTERS[drill], vowel).ar}</span>
              </button>
              {hints && <p dir="ltr" className={`mt-2 text-xl font-extrabold ${MUTED}`}>{syl(LETTERS[drill], vowel).tr}</p>}
              <div className="mt-5 flex justify-center gap-3">
                <button type="button" onClick={() => hear(syl(LETTERS[drill], vowel).ar, "drill")} className={BTN_OUTLINE}><Volume2 aria-hidden="true" className="h-4 w-4" />{t("Hear", "اسمع")}</button>
                <button type="button" onClick={() => setDrill(Math.floor(Math.random() * LETTERS.length))} className={BTN_PRIMARY}><Shuffle aria-hidden="true" className="h-4 w-4" />{t("Next letter", "الحرف التالي")}</button>
              </div>
            </section>
          )}

          <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {letters.map((l) => {
              const s = syl(l, vowel);
              const key = `L-${l.ch}`;
              return (
                <li key={l.ch}>
                  <button type="button" onClick={() => hear(s.ar, key)} aria-label={`${t(l.en, l.ar)}: ${s.tr}`} className={`flex w-full flex-col items-center gap-2 rounded-3xl border p-4 text-center shadow-sm transition hover:-translate-y-0.5 motion-reduce:transition-none motion-reduce:hover:translate-y-0 ${flash === key ? TILE_HOT : CARD} ${FOCUS}`}>
                    <span lang="ar" dir="rtl" className="arabic-font font-bold leading-none text-[#0D4F4F] dark:text-white" style={{ fontSize: fluid(2.4, 6, 3.4) }}>{s.ar}</span>
                    {hints && <span dir="ltr" className={`text-sm font-bold ${MUTED}`}>{s.tr}</span>}
                    <span className={`text-xs font-semibold ${MUTED}`}>{t(l.en, l.ar)}</span>
                    <span className="flex min-h-5 flex-wrap justify-center gap-1">
                      {isQalq(l.ch) && <span className="inline-flex items-center gap-1 rounded-full bg-[#C8A96E]/25 px-2 py-0.5 text-[11px] font-bold text-[#7A5E1C] dark:text-[#E3B45F]"><Activity aria-hidden="true" className="h-3 w-3" />{t("Echo", "قلقلة")}</span>}
                      {l.heavy && <span className="rounded-full bg-slate-200 px-2 py-0.5 text-[11px] font-bold text-slate-700 dark:bg-white/10 dark:text-slate-200">{t("Heavy", "مفخّم")}</span>}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
          {letters.length === 0 && <p className={`rounded-2xl border border-dashed border-stone-300 p-8 text-center dark:border-white/20 ${MUTED}`}>{t("No letters match. Clear the search or filter.", "لا توجد حروف مطابقة. امسح البحث أو التصفية.")}</p>}
          <p className={`text-sm ${MUTED}`}>{t("Hamza uses Ba as its moving letter because a Hamza cannot follow a Hamza carrier.", "تأخذ الهمزة الباء حرفًا متحركًا قبلها لأن الهمزة لا تأتي بعد حامل الهمزة.")}</p>
        </div>

        {/* ------------------------------ 3. READ ------------------------------ */}
        <div role="tabpanel" id="sukun-panel-reading" aria-labelledby="sukun-tab-reading" hidden={tab !== "reading"} tabIndex={0} className={`space-y-8 rounded-2xl ${FOCUS}`}>
          <div className="max-w-2xl space-y-3">
            <h2 className={`text-3xl sm:text-4xl ${heading} ${INK}`}>{t("Read real Quranic words", "اقرأ كلمات قرآنية حقيقية")}</h2>
            <p className={`text-base ${MUTED}`}>{t("Tap a syllable, or press Spell to hear it slowly, then the whole word.", "المس مقطعًا، أو اضغط تهجَّ لتسمعه ببطء ثم الكلمة كاملة.")}</p>
          </div>

          <ul className="flex flex-wrap gap-2" aria-label={t("Choose a word", "اختر كلمة")}>
            {WORDS.map((w, i) => (
              <li key={w.id}>
                <button type="button" aria-pressed={wordIdx === i} onClick={() => { timers.clear(); setSpelling(false); setHot(null); setWordIdx(i); }} className={`min-h-11 rounded-full border px-4 ${FOCUS} ${wordIdx === i ? "border-[#0D4F4F] bg-[#0D4F4F] text-white dark:border-teal-400 dark:bg-teal-400 dark:text-slate-950" : "border-stone-300 text-slate-700 hover:bg-stone-100 dark:border-white/20 dark:text-slate-200 dark:hover:bg-white/10"}`}>
                  <span lang="ar" className="arabic-font text-lg font-bold">{w.ar}</span>
                </button>
              </li>
            ))}
          </ul>

          <div className={`overflow-hidden rounded-3xl shadow-sm ${CARD}`}>
            <div className="grid lg:grid-cols-12">
              <div className="flex flex-col justify-between gap-6 bg-[#06302f] p-8 text-white lg:col-span-5 sm:p-10">
                <div className="text-center">
                  <button type="button" onClick={() => hear(word.ar, `word-${word.id}`, 0.75)} aria-label={t("Hear the word", "اسمع الكلمة")} className="rounded-xl px-3 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white">
                    <span lang="ar" dir="rtl" className="arabic-font block font-bold" style={{ fontSize: fluid(3.2, 9, 5) }}>{word.ar}</span>
                  </button>
                  {hints && (
                    <div className="mt-3">
                      <p dir="ltr" className="text-2xl font-extrabold text-[#E3B45F]">{word.tr}</p>
                      <p className="text-base font-semibold text-white/80">{t(word.meaning[0], word.meaning[1])}</p>
                    </div>
                  )}
                </div>
                <p lang="ar" dir="rtl" className="arabic-font text-center text-lg leading-relaxed text-[#E6CF9F]">{word.ref}</p>
              </div>

              <div className="flex flex-col justify-between gap-6 p-6 sm:p-10 lg:col-span-7">
                <ol dir="rtl" className="grid gap-3" style={{ gridTemplateColumns: `repeat(${word.syl.length}, minmax(0, 1fr))` }}>
                  {word.syl.map((s, i) => (
                    <li key={`${word.id}-${i}`}>
                      <button type="button" onClick={() => hear(s.ar, `syl-${i}`, 0.65)} className={`w-full rounded-3xl border-2 p-4 text-center transition motion-reduce:transition-none ${s.qalq ? "border-[#C8A96E] bg-[#C8A96E]/15" : s.sukun ? "border-teal-500 bg-teal-50 text-teal-900 dark:bg-teal-400/10 dark:text-teal-100" : "border-stone-200 dark:border-white/10"} ${hot === i ? "scale-105 shadow-lg" : ""} ${FOCUS}`}>
                        <span lang="ar" className="arabic-font block font-bold" style={{ fontSize: fluid(2.2, 5, 3.2) }}>{s.ar}</span>
                        {hints && <span dir="ltr" className="mt-1 block text-xs font-bold">{s.tr}</span>}
                      </button>
                    </li>
                  ))}
                </ol>

                <ul className="flex flex-wrap gap-4 text-xs font-bold">
                  <li className="flex items-center gap-2"><span aria-hidden="true" className="h-3 w-3 rounded-full border-2 border-teal-500 bg-teal-50 dark:bg-teal-400/10" />{t("Closed syllable (Sukun)", "مقطع مغلق (سكون)")}</li>
                  <li className="flex items-center gap-2"><span aria-hidden="true" className="h-3 w-3 rounded-full border-2 border-[#C8A96E] bg-[#C8A96E]/30" />{t("Echo (Qalqalah)", "قلقلة")}</li>
                </ul>

                <div className="flex flex-wrap items-center justify-center gap-3 border-t border-stone-200 pt-5 dark:border-white/10">
                  <button type="button" onClick={spell} disabled={spelling} className={`${BTN_OUTLINE} disabled:opacity-50`}>
                    <Play aria-hidden="true" className="h-4 w-4" />{t("Spell it slowly", "تهجَّ ببطء")}
                  </button>
                  <button type="button" onClick={() => { timers.clear(); setSpelling(false); setHot(null); setWordIdx((p) => (p + 1) % WORDS.length); }} className={BTN_PRIMARY}>
                    {t("Next word", "الكلمة التالية")}<Fwd aria-hidden="true" className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ------------------------------ 4. PRACTICE ------------------------------ */}
        <div role="tabpanel" id="sukun-panel-practice" aria-labelledby="sukun-tab-practice" hidden={tab !== "practice"} tabIndex={0} className={`space-y-8 rounded-2xl ${FOCUS}`}>
          {game === "menu" && (
            <>
              <div className="max-w-2xl space-y-3">
                <h2 className={`text-3xl sm:text-4xl ${heading} ${INK}`}>{t("Practice & quiz", "تدرّب واختبر نفسك")}</h2>
                <p className={`text-base ${MUTED}`}>{t("Your best score in each game is saved on this device and turns into stars.", "تُحفظ أفضل نتيجة لك في كل لعبة على هذا الجهاز وتتحول إلى نجوم.")}</p>
              </div>
              <ul className="grid gap-5 sm:grid-cols-2">
                {GAMES.map((gm) => {
                  const Icon = gm.icon;
                  const count = gm.id === "final" ? FINAL_IDS.length : QUESTIONS.filter((x) => x.mode === gm.id).length;
                  return (
                    <li key={gm.id}>
                      <button type="button" onClick={() => start(gm.id)} className={`flex h-full w-full items-start gap-4 rounded-3xl p-6 text-start shadow-sm transition hover:-translate-y-1 motion-reduce:transition-none motion-reduce:hover:translate-y-0 ${CARD} ${FOCUS}`}>
                        <span aria-hidden="true" className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#0D4F4F]/10 text-[#0D6B66] dark:bg-white/5 dark:text-teal-300"><Icon className="h-6 w-6" /></span>
                        <span className="flex-1">
                          <span className={`block text-lg font-extrabold ${INK}`}>{t(gm.en, gm.ar)}</span>
                          <span className={`mt-1 block text-sm ${MUTED}`}>{t(gm.dEn, gm.dAr)}</span>
                          <span className="mt-2 block text-xs font-bold text-[#0D6B66] dark:text-teal-300">
                            {t(`${count} questions`, `${count} أسئلة`)}
                            {best[gm.id] !== undefined && ` · ${t("Best", "الأفضل")} ${best[gm.id]}/${count}`}
                          </span>
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </>
          )}

          {game !== "menu" && !finished && q && (
            <section aria-label={t("Question", "سؤال")} className={`mx-auto max-w-2xl space-y-6 rounded-3xl p-6 shadow-sm sm:p-8 ${CARD}`}>
              <div className="space-y-2">
                <div className={`flex items-center justify-between text-sm font-semibold ${MUTED}`}>
                  <span>{t(`Question ${qi + 1} of ${questions.length}`, `السؤال ${qi + 1} من ${questions.length}`)}</span>
                  <span>{t("Score", "النتيجة")}: {score}</span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-stone-200 dark:bg-white/10" role="progressbar" aria-valuemin={0} aria-valuemax={questions.length} aria-valuenow={qi + (answered ? 1 : 0)}>
                  <div className="h-full rounded-full bg-[#C8A96E] transition-all motion-reduce:transition-none" style={{ width: `${((qi + (answered ? 1 : 0)) / questions.length) * 100}%` }} />
                </div>
              </div>
              <h2 className="text-center text-xl font-extrabold text-slate-900 dark:text-white">{t(q.p[0], q.p[1])}</h2>
              {q.big && (
                <div className="flex items-center justify-center gap-3">
                  <p lang="ar" dir="rtl" className="arabic-font font-bold text-[#0D4F4F] dark:text-teal-300" style={{ fontSize: fluid(2.6, 7, 3.6) }}>{q.big}</p>
                  {q.hear && (
                    <button type="button" onClick={() => speakArabic(q.hear as string, 0.7)} aria-label={t("Hear it", "اسمعها")} className={`flex h-11 w-11 items-center justify-center rounded-full border border-stone-300 hover:bg-stone-100 dark:border-white/20 dark:hover:bg-white/10 ${FOCUS}`}>
                      <Volume2 aria-hidden="true" className="h-5 w-5" />
                    </button>
                  )}
                </div>
              )}
              <div className="grid gap-3 sm:grid-cols-3">
                {q.opts.map((opt, i) => {
                  const right = answered && i === q.ok;
                  const wrong = answered && picked === i && i !== q.ok;
                  return (
                    <button key={`${q.id}-${i}`} type="button" disabled={answered} onClick={() => pick(i)} className={`flex min-h-14 items-center justify-center gap-2 rounded-2xl border-2 px-3 py-3 text-center font-extrabold transition motion-reduce:transition-none ${opt.glyph ? "arabic-font text-2xl" : "text-base"} ${right ? "border-emerald-500 bg-emerald-50 text-emerald-900 dark:bg-emerald-400/10 dark:text-emerald-200" : wrong ? "border-rose-500 bg-rose-50 text-rose-900 dark:bg-rose-400/10 dark:text-rose-200" : "border-stone-200 text-slate-800 hover:border-[#0D9488] dark:border-white/15 dark:text-slate-100"} ${FOCUS}`} {...(opt.glyph ? { lang: "ar", dir: "rtl" } : {})}>
                      {right && <Check aria-hidden="true" className="h-4 w-4 shrink-0" />}
                      {wrong && <X aria-hidden="true" className="h-4 w-4 shrink-0" />}
                      <span>{opt.glyph ? opt.ar : t(opt.en, opt.ar)}</span>
                    </button>
                  );
                })}
              </div>
              <div aria-live="polite">
                {answered && (
                  <div className="space-y-3 rounded-2xl border border-stone-200 bg-stone-50 p-4 text-[15px] leading-relaxed dark:border-white/10 dark:bg-white/5">
                    <p className="font-extrabold">{picked === q.ok ? t("Correct!", "أحسنت!") : t("Not quite.", "ليس تمامًا.")}</p>
                    <p>{t(q.why[0], q.why[1])}</p>
                    <button type="button" onClick={next} className={BTN_PRIMARY}>
                      {qi + 1 === questions.length ? t("See my score", "اعرض نتيجتي") : t("Next question", "السؤال التالي")}
                      <Fwd aria-hidden="true" className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>
            </section>
          )}

          {game !== "menu" && finished && (
            <section aria-label={t("Results", "النتيجة")} className={`mx-auto max-w-xl space-y-5 rounded-3xl p-8 text-center shadow-sm ${CARD}`}>
              <Trophy aria-hidden="true" className="mx-auto h-12 w-12 text-amber-500" />
              <p className="text-5xl font-black text-[#0D4F4F] dark:text-teal-300">{score}/{questions.length}</p>
              <p className="text-lg font-extrabold">
                {score === questions.length ? t("Perfect score! Sukun mastered.", "علامة كاملة! أتقنتَ السكون.") : score >= questions.length * 0.7 ? t("Great work, almost there.", "عمل رائع، اقتربتَ من الإتقان.") : t("Good start. Review and try again.", "بداية جيدة. راجع وأعد المحاولة.")}
              </p>
              {missed.length > 0 && (
                <div className="space-y-2 rounded-2xl border border-stone-200 p-4 text-start text-sm dark:border-white/10">
                  <p className="font-extrabold">{t("Review these", "راجع هذه الأسئلة")}</p>
                  <ul className="space-y-2">
                    {missed.map((id) => {
                      const m = QUESTIONS.find((x) => x.id === id);
                      return m ? <li key={id} className={MUTED}>{t(m.why[0], m.why[1])}</li> : null;
                    })}
                  </ul>
                </div>
              )}
              <div className="flex flex-wrap justify-center gap-3">
                <button type="button" onClick={() => start(game)} className={BTN_PRIMARY}><RotateCcw aria-hidden="true" className="h-4 w-4" />{t("Try again", "حاول مرة أخرى")}</button>
                <button type="button" onClick={() => start("menu")} className={BTN_OUTLINE}>{t("Back to games", "العودة للألعاب")}</button>
              </div>
            </section>
          )}
        </div>

        {/* ------------------------------ Lesson navigation ------------------------------ */}
        <nav aria-label={t("Lesson navigation", "التنقل بين الدروس")} className="grid gap-4 border-t border-stone-200 pt-10 dark:border-white/10 sm:grid-cols-2">
          {adj.prev ? (
            <Link href={`${courseHref}/${adj.prev.slug}`} className={`group flex items-center gap-3 rounded-2xl p-5 transition hover:border-teal-600/60 motion-reduce:transition-none ${CARD} ${FOCUS}`}>
              <Back aria-hidden="true" className="h-5 w-5 shrink-0 text-[#0D6B66] dark:text-teal-300" />
              <span>
                <span className={`block text-xs font-bold ${MUTED}`}>{t("Previous lesson", "الدرس السابق")}</span>
                <span className={`block font-extrabold ${INK}`}>{isAr ? adj.prev.titleAr : adj.prev.title}</span>
              </span>
            </Link>
          ) : <span />}
          {adj.next && (
            <Link href={`${courseHref}/${adj.next.slug}`} className={`group flex items-center justify-between gap-3 rounded-2xl p-5 transition hover:border-teal-600/60 motion-reduce:transition-none ${CARD} ${FOCUS}`}>
              <span>
                <span className={`block text-xs font-bold ${MUTED}`}>{t("Next lesson", "الدرس التالي")}</span>
                <span className={`block font-extrabold ${INK}`}>{isAr ? adj.next.titleAr : adj.next.title}</span>
              </span>
              <Fwd aria-hidden="true" className="h-5 w-5 shrink-0 text-[#0D6B66] dark:text-teal-300" />
            </Link>
          )}
        </nav>
      </main>
    </div>
  );
}