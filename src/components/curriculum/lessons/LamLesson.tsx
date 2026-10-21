"use client";

import React, { useRef, useState } from "react";
import { useLesson } from "../shared/LessonContext";
import AudioButton from "../shared/AudioButton";
import QuizEngine, { QuizQuestion } from "../shared/QuizEngine";
import {
  ArrowRight,
  CheckCircle2,
  Gamepad2,
  HelpCircle,
  Layers,
  Moon,
  RotateCcw,
  Sparkles,
  Sun,
  XCircle,
} from "lucide-react";

/* -------------------------------------------------------------------------- */
/*  Shared styling                                                            */
/* -------------------------------------------------------------------------- */

const FOCUS =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600 dark:focus-visible:outline-teal-300";
const CARD = "border border-stone-200 bg-white dark:border-white/10 dark:bg-[#111827]";
const MUTED = "text-slate-600 dark:text-slate-300";

type LamKind = "moon" | "sun";

// Sky = Moon, Amber = Sun, everywhere in the lesson.
const TONES: Record<
  LamKind,
  { text: string; chip: string; border: string; tint: string; mark: string; icon: string }
> = {
  moon: {
    text: "text-sky-700 dark:text-sky-300",
    chip: "bg-sky-100 text-sky-800 dark:bg-sky-400/15 dark:text-sky-200",
    border: "border-sky-200 dark:border-sky-400/30",
    tint: "bg-sky-50 dark:bg-sky-400/10",
    mark: "bg-sky-100 text-sky-700 dark:bg-sky-400/20 dark:text-sky-300",
    icon: "text-sky-600 dark:text-sky-400",
  },
  sun: {
    text: "text-amber-700 dark:text-amber-300",
    chip: "bg-amber-100 text-amber-900 dark:bg-amber-400/15 dark:text-amber-200",
    border: "border-amber-200 dark:border-amber-400/30",
    tint: "bg-amber-50 dark:bg-amber-400/10",
    mark: "bg-amber-100 text-amber-800 dark:bg-amber-400/20 dark:text-amber-200",
    icon: "text-amber-600 dark:text-amber-400",
  },
};

/* -------------------------------------------------------------------------- */
/*  Arabic helpers                                                            */
/* -------------------------------------------------------------------------- */

// A base letter plus every combining mark that follows it (harakat, shadda, small signs).
const MARK_RE = /[\u0610-\u061A\u064B-\u065F\u0670\u06D6-\u06DC\u06DF-\u06E8\u06EA-\u06ED]/;

function toClusters(text: string): string[] {
  const out: string[] = [];
  for (const ch of Array.from(text)) {
    if (MARK_RE.test(ch) && out.length) out[out.length - 1] += ch;
    else out.push(ch);
  }
  return out;
}

/**
 * Renders "ٱل + letter…" with the rule made visible:
 * - Moon: the Lam is highlighted (it is pronounced).
 * - Sun: the Lam is faded (silent) and the doubled letter is highlighted.
 * Only colour changes between spans, so the letters keep joining.
 */
function LamWord({ word, kind, plain = false }: { word: string; kind: LamKind; plain?: boolean }) {
  if (plain) return <>{word}</>;
  const c = toClusters(word);
  if (c.length < 3) return <>{word}</>;
  const rest = c.slice(3).join("");

  return (
    <>
      {c[0]}
      {kind === "moon" ? (
        <span title="Clear Lam" className={`rounded-sm ${TONES.moon.mark}`}>
          {c[1]}
        </span>
      ) : (
        <span title="Silent Lam" className="text-slate-400 dark:text-slate-500">
          {c[1]}
        </span>
      )}
      {kind === "sun" ? (
        <span title="Doubled letter" className={`rounded-sm ${TONES.sun.mark}`}>
          {c[2]}
        </span>
      ) : (
        c[2]
      )}
      {rest}
    </>
  );
}

/* -------------------------------------------------------------------------- */
/*  Content                                                                   */
/* -------------------------------------------------------------------------- */

interface LamExample {
  word: string;
  articleType: LamKind;
  translit: string;
  meaning: string;
  breakdown: string[];
  ruleNote: string;
}

const LAM_EXAMPLES: LamExample[] = [
  {
    word: "ٱلْقَمَرُ",
    articleType: "moon",
    translit: "Al-Qamaru",
    meaning: "The Moon",
    breakdown: ["ٱلْ", "قَ", "مَ", "رُ"],
    ruleNote: "The Lam carries a visible Sukun (لْ) and is pronounced clearly before ق.",
  },
  {
    word: "ٱلْكِتَابُ",
    articleType: "moon",
    translit: "Al-Kitaabu",
    meaning: "The Book",
    breakdown: ["ٱلْ", "كِ", "تَا", "بُ"],
    ruleNote: "Your tongue tip touches the gums behind the upper front teeth for a clear Lam (لْ).",
  },
  {
    word: "ٱلْعَلِيمُ",
    articleType: "moon",
    translit: "Al-‘Aleemu",
    meaning: "The All-Knowing",
    breakdown: ["ٱلْ", "عَ", "لِي", "مُ"],
    ruleNote: "ع is one of the 14 Moon letters (إِبْغِ حَجَّكَ وَخَفْ عَقِيمَهُ), so the Lam is pronounced clearly.",
  },
  {
    word: "ٱلشَّمْسُ",
    articleType: "sun",
    translit: "Ash-Shamsu",
    meaning: "The Sun",
    breakdown: ["ٱشْ", "شَمْ", "سُ"],
    ruleNote: "The Sun Lam is written but not pronounced. Jump straight from the Alif to the doubled Sheen (شّ).",
  },
  {
    word: "ٱلرَّحْمَٰنُ",
    articleType: "sun",
    translit: "Ar-Rahmaanu",
    meaning: "The Most Merciful",
    breakdown: ["ٱرْ", "رَحْ", "مَٰ", "نُ"],
    ruleNote: "The silent Lam merges into the doubled Ra (رّ): say Ar-Rahmaanu, never Al-Rahmaanu.",
  },
  {
    word: "ٱلنَّاسُ",
    articleType: "sun",
    translit: "An-Naasu",
    meaning: "Mankind",
    breakdown: ["ٱنْ", "نَا", "سُ"],
    ruleNote: "Silent Sun Lam, plus a 2-beat nasal Ghunnah on the Noon Shaddah (نّ).",
  },
];

interface LetterEntry {
  letter: string;
  word: string;
  meaning: string;
}

// In the order of the mnemonic: إِبْغِ حَجَّكَ وَخَفْ عَقِيمَهُ
const MOON_LETTERS: LetterEntry[] = [
  { letter: "أ", word: "ٱلْأَرْضُ", meaning: "The earth" },
  { letter: "ب", word: "ٱلْبَيْتُ", meaning: "The house" },
  { letter: "غ", word: "ٱلْغُرَابُ", meaning: "The crow" },
  { letter: "ح", word: "ٱلْحَمْدُ", meaning: "The praise" },
  { letter: "ج", word: "ٱلْجَنَّةُ", meaning: "The Garden" },
  { letter: "ك", word: "ٱلْكِتَابُ", meaning: "The book" },
  { letter: "و", word: "ٱلْوَلَدُ", meaning: "The boy" },
  { letter: "خ", word: "ٱلْخَيْرُ", meaning: "The good" },
  { letter: "ف", word: "ٱلْفِيلُ", meaning: "The elephant" },
  { letter: "ع", word: "ٱلْعِلْمُ", meaning: "The knowledge" },
  { letter: "ق", word: "ٱلْقَمَرُ", meaning: "The moon" },
  { letter: "ي", word: "ٱلْيَوْمُ", meaning: "The day" },
  { letter: "م", word: "ٱلْمَاءُ", meaning: "The water" },
  { letter: "ه", word: "ٱلْهِلَالُ", meaning: "The crescent" },
];

const SUN_LETTERS: LetterEntry[] = [
  { letter: "ت", word: "ٱلتِّينُ", meaning: "The fig" },
  { letter: "ث", word: "ٱلثَّعْلَبُ", meaning: "The fox" },
  { letter: "د", word: "ٱلدِّينُ", meaning: "The religion" },
  { letter: "ذ", word: "ٱلذِّكْرُ", meaning: "The remembrance" },
  { letter: "ر", word: "ٱلرَّحِيمُ", meaning: "The Most Merciful" },
  { letter: "ز", word: "ٱلزَّيْتُونُ", meaning: "The olive" },
  { letter: "س", word: "ٱلسَّمَاءُ", meaning: "The sky" },
  { letter: "ش", word: "ٱلشَّمْسُ", meaning: "The sun" },
  { letter: "ص", word: "ٱلصَّبْرُ", meaning: "The patience" },
  { letter: "ض", word: "ٱلضَّيْفُ", meaning: "The guest" },
  { letter: "ط", word: "ٱلطَّرِيقُ", meaning: "The road" },
  { letter: "ظ", word: "ٱلظُّهْرُ", meaning: "The noon" },
  { letter: "ل", word: "ٱللَّيْلُ", meaning: "The night" },
  { letter: "ن", word: "ٱلنُّورُ", meaning: "The light" },
];

type DrillItem = LetterEntry & { kind: LamKind };
const drillPick = (list: LetterEntry[], i: number, kind: LamKind): DrillItem => ({ ...list[i], kind });

// Fixed order, alternating Moon / Sun (no randomness, so the server and browser always agree).
const DRILL: DrillItem[] = [
  drillPick(MOON_LETTERS, 1, "moon"),
  drillPick(SUN_LETTERS, 0, "sun"),
  drillPick(MOON_LETTERS, 4, "moon"),
  drillPick(SUN_LETTERS, 7, "sun"),
  drillPick(MOON_LETTERS, 7, "moon"),
  drillPick(SUN_LETTERS, 12, "sun"),
  drillPick(MOON_LETTERS, 11, "moon"),
  drillPick(SUN_LETTERS, 13, "sun"),
  drillPick(MOON_LETTERS, 9, "moon"),
  drillPick(SUN_LETTERS, 8, "sun"),
];

type LamQuizQuestion = QuizQuestion & { explanation: string };

const QUIZ_QUESTIONS: LamQuizQuestion[] = [
  {
    id: "l1",
    type: "multiple_choice",
    questionEn: "How is Al-Lam Al-Qamariyyah (Moon Lam) pronounced?",
    options: [
      { id: "a", text: "It has a Sukun sign (لْ) on top of the Lam and is pronounced clearly", isCorrect: true },
      { id: "b", text: "It has a Shaddah on the next letter", isCorrect: false },
      { id: "c", text: "The Lam is completely silent", isCorrect: false },
      { id: "d", text: "It stretches for 4 beats", isCorrect: false },
    ],
    explanation: "The Moon Lam carries a Sukun and is pronounced clearly, like in ٱلْقَمَرُ.",
  },
  {
    id: "l2",
    type: "multiple_choice",
    questionEn: "What happens to Al-Lam Al-Shamsiyyah (Sun Lam) in recitation?",
    options: [
      { id: "a", text: "It merges completely into the following Sun letter, which carries a Shaddah", isCorrect: true },
      { id: "b", text: "It is pronounced with a clear Sukun", isCorrect: false },
      { id: "c", text: "It is dropped entirely including the letter after it", isCorrect: false },
      { id: "d", text: "It turns into a Meem", isCorrect: false },
    ],
    explanation: "The Sun Lam is silent. It merges into the next letter, which is doubled, like in ٱلشَّمْسُ.",
  },
  {
    id: "l3",
    type: "multiple_choice",
    questionEn: "How many Moon letters and how many Sun letters are there?",
    options: [
      { id: "a", text: "10 Moon letters and 18 Sun letters", isCorrect: false },
      { id: "b", text: "14 Moon letters and 14 Sun letters", isCorrect: true },
      { id: "c", text: "18 Moon letters and 10 Sun letters", isCorrect: false },
      { id: "d", text: "7 Moon letters and 21 Sun letters", isCorrect: false },
    ],
    explanation: "The 28 Arabic letters split evenly: 14 Moon letters and 14 Sun letters.",
  },
  {
    id: "l4",
    type: "multiple_choice",
    questionEn: "Which word has a Moon Lam?",
    options: [
      { id: "a", text: "ٱلشَّمْسُ", isCorrect: false },
      { id: "b", text: "ٱلنَّاسُ", isCorrect: false },
      { id: "c", text: "ٱلْكِتَابُ", isCorrect: true },
      { id: "d", text: "ٱلرَّحْمَٰنُ", isCorrect: false },
    ],
    explanation: "ك is a Moon letter, so the Lam is pronounced clearly: Al-Kitaabu.",
  },
  {
    id: "l5",
    type: "multiple_choice",
    questionEn: "Which word has a Sun Lam?",
    options: [
      { id: "a", text: "ٱلْعَلِيمُ", isCorrect: false },
      { id: "b", text: "ٱلْكِتَابُ", isCorrect: false },
      { id: "c", text: "ٱلْقَمَرُ", isCorrect: false },
      { id: "d", text: "ٱلنَّاسُ", isCorrect: true },
    ],
    explanation: "ن is a Sun letter, so the Lam is silent and the Noon is doubled: An-Naasu.",
  },
  {
    id: "l6",
    type: "multiple_choice",
    questionEn: "Which phrase gathers the 14 Moon letters?",
    options: [
      { id: "a", text: "قُطْبُ جَدٍّ", isCorrect: false },
      { id: "b", text: "إِبْغِ حَجَّكَ وَخَفْ عَقِيمَهُ", isCorrect: true },
      { id: "c", text: "يَرْمَلُونَ", isCorrect: false },
      { id: "d", text: "حُرُوفُ الحَلْقِ", isCorrect: false },
    ],
    explanation: "إِبْغِ حَجَّكَ وَخَفْ عَقِيمَهُ holds all 14 Moon letters. The other phrases belong to other tajweed topics.",
  },
  {
    id: "l7",
    type: "multiple_choice",
    questionEn: "How do we say ٱلرَّحْمَٰنُ?",
    options: [
      { id: "a", text: "Al-Rahmaanu, with a clear Lam", isCorrect: false },
      { id: "b", text: "Rahmaanu, dropping the Alif", isCorrect: false },
      { id: "c", text: "Al-Ar-Rahmaanu, with both sounds", isCorrect: false },
      { id: "d", text: "Ar-Rahmaanu, the Lam merges into a doubled Ra", isCorrect: true },
    ],
    explanation: "Ra is a Sun letter, so the Lam is silent and the Ra is doubled: Ar-Rahmaanu.",
  },
];

const TABS = [
  { id: "learn", label: "1. Moon vs. Sun Rule", icon: Sparkles },
  { id: "letters", label: "2. 14+14 Letter Matrix", icon: Sun },
  { id: "xray", label: "3. Word X-Ray Lab", icon: Layers },
  { id: "practice", label: "4. Moon or Sun?", icon: Gamepad2 },
  { id: "quiz", label: "5. Mastery Quiz", icon: HelpCircle },
] as const;

type TabId = (typeof TABS)[number]["id"];

/* -------------------------------------------------------------------------- */
/*  Component                                                                 */
/* -------------------------------------------------------------------------- */

export default function LamLesson() {
  const lessonCtx = useLesson();
  const showTransliteration = lessonCtx?.showTransliteration ?? true;
  const showEnglishMeaning = lessonCtx?.showEnglishMeaning ?? true;
  const isTeacherMode = lessonCtx?.isTeacherMode ?? false;
  const fontSizeMultiplier = lessonCtx?.fontSizeMultiplier ?? 1.1;

  const [activeTab, setActiveTab] = useState<TabId>("learn");
  const [filterType, setFilterType] = useState<"all" | LamKind>("all");
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  // Moon-or-Sun drill
  const [drillIndex, setDrillIndex] = useState(0);
  const [drillChoice, setDrillChoice] = useState<LamKind | null>(null);
  const [drillScore, setDrillScore] = useState(0);

  const filteredWords = LAM_EXAMPLES.filter((w) => filterType === "all" || w.articleType === filterType);

  const m = fontSizeMultiplier;
  const fluid = (min: number, vw: number, max: number) =>
    `clamp(${(min * m).toFixed(2)}rem, ${(vw * m).toFixed(2)}vw + 0.4rem, ${(max * m).toFixed(2)}rem)`;
  const heroSize = fluid(2.2, 5, 3);
  const wordSize = fluid(2, 4.4, 2.6);

  const drillDone = drillIndex >= DRILL.length;
  const current = drillDone ? null : DRILL[drillIndex];
  const answered = drillChoice !== null;
  const drillCorrect = current !== null && drillChoice === current.kind;

  const chooseDrill = (choice: LamKind) => {
    if (!current || drillChoice) return;
    setDrillChoice(choice);
    if (choice === current.kind) setDrillScore((s) => s + 1);
  };
  const nextDrill = () => {
    setDrillIndex((i) => i + 1);
    setDrillChoice(null);
  };
  const restartDrill = () => {
    setDrillIndex(0);
    setDrillChoice(null);
    setDrillScore(0);
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

  const panelCls = `space-y-6 rounded-2xl ${FOCUS}`;
  const arabicBold = "arabic-font font-bold";

  /* ------------------------- Tab 1: rule cards -------------------------- */

  const ruleCard = (kind: LamKind) => {
    const tone = TONES[kind];
    const isMoon = kind === "moon";
    const Icon = isMoon ? Moon : Sun;
    const word = isMoon ? "ٱلْقَمَرُ" : "ٱلشَّمْسُ";
    return (
      <article className={`space-y-5 rounded-3xl p-6 shadow-sm sm:p-7 ${CARD} ${tone.border}`}>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className={`inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-sm font-extrabold ${tone.chip}`}>
            <Icon aria-hidden="true" className="h-4 w-4" />
            <span>{isMoon ? "Moon Lam" : "Sun Lam"}</span>
            <span aria-hidden="true">•</span>
            <span lang="ar" dir="rtl" className="arabic-font">
              {isMoon ? "اللَّامُ القَمَرِيَّة" : "اللَّامُ الشَّمْسِيَّة"}
            </span>
          </h2>
          <AudioButton text={word} />
        </div>

        <div className={`rounded-2xl border py-6 text-center ${tone.border} ${tone.tint}`}>
          <p lang="ar" dir="rtl" style={{ fontSize: heroSize }} className={`${arabicBold} leading-[1.9] text-slate-900 dark:text-white`}>
            <LamWord word={word} kind={kind} />
          </p>
          {!isTeacherMode && showTransliteration && (
            <p className={`mt-2 text-sm font-bold ${tone.text}`}>
              {isMoon ? "Al-Qamaru (pronounce the L clearly)" : "Ash-Shamsu (skip the L, double the Sh!)"}
            </p>
          )}
        </div>

        <ul className="space-y-2.5 text-[15px] leading-relaxed">
          <li className="flex items-start gap-2">
            <CheckCircle2 aria-hidden="true" className={`mt-1 h-4 w-4 shrink-0 ${tone.icon}`} />
            <span>
              <strong>Visual clue:</strong>{" "}
              {isMoon ? (
                <>
                  the Lam carries a visible Sukun (<span lang="ar" dir="rtl" className={arabicBold}>لْ</span>).
                </>
              ) : (
                <>
                  the Lam is bare, and the next letter carries a Shaddah (<span lang="ar" dir="rtl" className={arabicBold}>ّ</span>).
                </>
              )}
            </span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 aria-hidden="true" className={`mt-1 h-4 w-4 shrink-0 ${tone.icon}`} />
            <span>
              <strong>Sound rule:</strong>{" "}
              {isMoon
                ? "your tongue tip touches the gums behind the upper front teeth for a crisp “L” sound."
                : "the Lam is silent. Jump straight from the Alif into the doubled letter!"}
            </span>
          </li>
        </ul>
      </article>
    );
  };

  /* ------------------------- Tab 2: letter groups ------------------------ */

  const letterGroup = (kind: LamKind, entries: LetterEntry[]) => {
    const tone = TONES[kind];
    const isMoon = kind === "moon";
    const Icon = isMoon ? Moon : Sun;
    return (
      <section className={`space-y-5 rounded-3xl p-6 sm:p-8 ${CARD}`}>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className={`flex flex-wrap items-center gap-x-2 gap-y-1 text-lg font-extrabold ${tone.text}`}>
            <Icon aria-hidden="true" className="h-5 w-5" />
            {isMoon ? "14 Moon letters" : "14 Sun letters"}
            {isMoon && (
              <span lang="ar" dir="rtl" className="arabic-font text-base font-bold">
                (إِبْغِ حَجَّكَ وَخَفْ عَقِيمَهُ)
              </span>
            )}
          </h2>
          <p className={`text-sm font-semibold ${MUTED}`}>
            {isMoon ? "The Lam is pronounced clearly" : "Silent Lam, and the letter is doubled"}
          </p>
        </div>

        <ul dir="rtl" className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {entries.map((entry) => (
            <li key={entry.letter} className={`space-y-2 rounded-2xl border p-4 text-center ${tone.border} ${tone.tint}`}>
              <p lang="ar" className={`${arabicBold} text-4xl leading-none ${tone.text}`}>
                {entry.letter}
              </p>
              <p lang="ar" dir="rtl" className={`${arabicBold} text-2xl leading-[1.9] text-slate-900 dark:text-white`}>
                <LamWord word={entry.word} kind={kind} />
              </p>
              {showEnglishMeaning && (
                <p dir="ltr" lang="en" className={`text-xs font-semibold ${MUTED}`}>
                  {entry.meaning}
                </p>
              )}
              <div className="flex justify-center">
                <AudioButton text={entry.word} />
              </div>
            </li>
          ))}
        </ul>
      </section>
    );
  };

  /* ------------------------------ Render -------------------------------- */

  return (
    <div className="space-y-8 animate-in fade-in duration-500 motion-reduce:animate-none">
      {/* ------------------------------ Tabs ------------------------------ */}
      <div
        role="tablist"
        aria-label="Moon and Sun Lam lesson sections"
        className="flex w-full flex-wrap gap-1.5 rounded-2xl border border-stone-200 bg-stone-100/80 p-1.5 dark:border-white/10 dark:bg-white/5 sm:w-fit"
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
              id={`lam-tab-${tab.id}`}
              type="button"
              role="tab"
              aria-selected={active}
              aria-controls={`lam-panel-${tab.id}`}
              tabIndex={active ? 0 : -1}
              onClick={() => setActiveTab(tab.id)}
              onKeyDown={(e) => onTabKeyDown(e, index)}
              className={`inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-center text-xs font-extrabold transition-colors motion-reduce:transition-none sm:flex-none sm:px-4 sm:text-sm ${FOCUS} ${
                active
                  ? "bg-[#0D4F4F] text-white shadow-md dark:bg-teal-400 dark:text-slate-950"
                  : "text-slate-600 hover:bg-white dark:text-slate-300 dark:hover:bg-white/10"
              }`}
            >
              <Icon aria-hidden="true" className="hidden h-4 w-4 sm:block" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ------------------- 1. Moon vs Sun rule ------------------- */}
      <div
        role="tabpanel"
        id="lam-panel-learn"
        aria-labelledby="lam-tab-learn"
        hidden={activeTab !== "learn"}
        tabIndex={0}
        className={panelCls}
      >
        <p className={`text-base ${MUTED}`}>
          Look at the Lam, then at the letter after it. Two small clues tell you exactly how to read “Al”.
        </p>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {ruleCard("moon")}
          {ruleCard("sun")}
        </div>
        <p className={`flex flex-wrap items-center gap-x-5 gap-y-2 text-sm font-semibold ${MUTED}`}>
          <span className="inline-flex items-center gap-2">
            <span aria-hidden="true" lang="ar" className={`arabic-font inline-flex h-7 w-7 items-center justify-center rounded-md text-base font-bold ${TONES.moon.mark}`}>
              ل
            </span>
            Highlighted Lam = say it clearly
          </span>
          <span className="inline-flex items-center gap-2">
            <span aria-hidden="true" lang="ar" className="arabic-font inline-flex h-7 w-7 items-center justify-center rounded-md text-base font-bold text-slate-400 dark:text-slate-500">
              ل
            </span>
            Faded Lam = silent
          </span>
        </p>
      </div>

      {/* ------------------- 2. Letter matrix ------------------- */}
      <div
        role="tabpanel"
        id="lam-panel-letters"
        aria-labelledby="lam-tab-letters"
        hidden={activeTab !== "letters"}
        tabIndex={0}
        className={panelCls}
      >
        <p className={`text-base ${MUTED}`}>
          Every Arabic letter is either a Moon or a Sun letter. Each tile shows a real word; press the speaker to hear it.
        </p>
        {letterGroup("moon", MOON_LETTERS)}
        {letterGroup("sun", SUN_LETTERS)}
      </div>

      {/* ------------------- 3. Word X-Ray Lab ------------------- */}
      <div
        role="tabpanel"
        id="lam-panel-xray"
        aria-labelledby="lam-tab-xray"
        hidden={activeTab !== "xray"}
        tabIndex={0}
        className={panelCls}
      >
        <p className={`text-base ${MUTED}`}>
          X-ray a word: what you <strong>see</strong> on the page, and what you actually <strong>say</strong>.
        </p>

        <div role="group" aria-label="Filter words" className="flex flex-wrap items-center gap-2">
          {(["all", "moon", "sun"] as const).map((t) => (
            <button
              key={t}
              type="button"
              aria-pressed={filterType === t}
              onClick={() => setFilterType(t)}
              className={`min-h-11 rounded-xl px-4 text-sm font-extrabold transition-colors motion-reduce:transition-none ${FOCUS} ${
                filterType === t
                  ? "bg-[#0D4F4F] text-white dark:bg-teal-400 dark:text-slate-950"
                  : "bg-stone-200/70 text-slate-700 hover:bg-stone-200 dark:bg-white/10 dark:text-slate-200 dark:hover:bg-white/15"
              }`}
            >
              {t === "all" ? `All words (${LAM_EXAMPLES.length})` : t === "moon" ? "Moon Lam words" : "Sun Lam words"}
            </button>
          ))}
        </div>

        <ul className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {filteredWords.map((item) => {
            const tone = TONES[item.articleType];
            return (
              <li key={item.word}>
                <article className={`h-full space-y-4 rounded-3xl p-6 shadow-sm ${CARD}`}>
                  <div className="flex items-center justify-between gap-3">
                    <span className={`rounded-full px-3 py-1 text-xs font-extrabold ${tone.chip}`}>
                      {item.articleType === "moon" ? "Moon Lam (clear)" : "Sun Lam (silent + doubled)"}
                    </span>
                    <AudioButton text={item.word} />
                  </div>

                  <div>
                    <p className={`mb-1 text-xs font-bold ${MUTED}`}>You see</p>
                    <p
                      lang="ar"
                      dir="rtl"
                      style={{ fontSize: wordSize }}
                      className={`${arabicBold} rounded-2xl py-3 text-center leading-[1.9] text-slate-900 dark:text-white ${tone.tint}`}
                    >
                      <LamWord word={item.word} kind={item.articleType} />
                    </p>
                  </div>

                  <div>
                    <p className={`mb-2 text-xs font-bold ${MUTED}`}>You say (syllables)</p>
                    <ul dir="rtl" lang="ar" className="flex flex-wrap items-center justify-center gap-2">
                      {item.breakdown.map((syl, sIdx) => (
                        <li
                          key={`${syl}-${sIdx}`}
                          className="arabic-font rounded-xl border border-teal-500/30 bg-teal-500/10 px-3.5 py-1.5 text-lg font-bold text-teal-700 dark:text-teal-300"
                        >
                          {syl}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {!isTeacherMode && (
                    <div className="space-y-1 border-t border-stone-200 pt-3 text-sm dark:border-white/10">
                      {showTransliteration && (
                        <p className="font-extrabold text-teal-700 dark:text-teal-300">{item.translit}</p>
                      )}
                      {showEnglishMeaning && (
                        <p className={MUTED}>
                          <span className="font-semibold">{item.meaning}</span> — {item.ruleNote}
                        </p>
                      )}
                    </div>
                  )}
                </article>
              </li>
            );
          })}
        </ul>
      </div>

      {/* ------------------- 4. Moon or Sun? drill ------------------- */}
      <div
        role="tabpanel"
        id="lam-panel-practice"
        aria-labelledby="lam-tab-practice"
        hidden={activeTab !== "practice"}
        tabIndex={0}
        className={panelCls}
      >
        <p className={`text-base ${MUTED}`}>
          Read the word, then choose: is the Lam a Moon Lam or a Sun Lam? Tip: look at the letter after the Lam.
        </p>

        {!drillDone && current ? (
          <section aria-label="Moon or Sun drill" className={`mx-auto max-w-2xl space-y-6 rounded-3xl p-6 shadow-sm sm:p-8 ${CARD}`}>
            <div>
              <div className={`flex items-center justify-between text-sm font-semibold ${MUTED}`}>
                <span>
                  Word {drillIndex + 1} of {DRILL.length}
                </span>
                <span>Score: {drillScore}</span>
              </div>
              <div
                role="progressbar"
                aria-label="Drill progress"
                aria-valuemin={0}
                aria-valuemax={DRILL.length}
                aria-valuenow={drillIndex + (answered ? 1 : 0)}
                className="mt-2 h-2 overflow-hidden rounded-full bg-stone-200 dark:bg-white/10"
              >
                <div
                  className="h-full rounded-full bg-[#0D9488] transition-[width] duration-500 motion-reduce:transition-none"
                  style={{ width: `${((drillIndex + (answered ? 1 : 0)) / DRILL.length) * 100}%` }}
                />
              </div>
            </div>

            <div className="flex items-center justify-center gap-4 rounded-2xl bg-stone-50 py-8 dark:bg-white/5">
              <p
                lang="ar"
                dir="rtl"
                style={{ fontSize: heroSize }}
                className={`${arabicBold} leading-[1.9] text-slate-900 dark:text-white`}
              >
                <LamWord word={current.word} kind={current.kind} plain={!answered} />
              </p>
              <AudioButton text={current.word} />
            </div>

            <div role="group" aria-label="Your answer" className="grid grid-cols-2 gap-3">
              {(["moon", "sun"] as const).map((kind) => {
                const tone = TONES[kind];
                const Icon = kind === "moon" ? Moon : Sun;
                const picked = drillChoice === kind;
                const isAnswer = answered && current.kind === kind;
                const wrongPick = picked && current.kind !== kind;
                return (
                  <button
                    key={kind}
                    type="button"
                    disabled={answered}
                    aria-pressed={picked}
                    onClick={() => chooseDrill(kind)}
                    className={`flex min-h-16 flex-col items-center justify-center gap-1 rounded-2xl border-2 px-3 py-3 text-base font-extrabold transition-colors disabled:cursor-default motion-reduce:transition-none ${FOCUS} ${
                      isAnswer
                        ? "border-emerald-500 bg-emerald-50 text-emerald-900 dark:bg-emerald-400/10 dark:text-emerald-200"
                        : wrongPick
                        ? "border-rose-500 bg-rose-50 text-rose-900 dark:bg-rose-400/10 dark:text-rose-200"
                        : `${tone.border} ${tone.tint} ${tone.text} ${answered ? "" : "hover:brightness-95 dark:hover:brightness-125"}`
                    }`}
                  >
                    <span className="inline-flex items-center gap-2">
                      <Icon aria-hidden="true" className="h-5 w-5" />
                      {kind === "moon" ? "Moon Lam" : "Sun Lam"}
                    </span>
                    {isAnswer && (
                      <span className="inline-flex items-center gap-1 text-xs font-bold">
                        <CheckCircle2 aria-hidden="true" className="h-4 w-4" /> Right answer
                      </span>
                    )}
                    {wrongPick && (
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
                  drillCorrect
                    ? "border-emerald-300 bg-emerald-50 text-emerald-950 dark:border-emerald-400/30 dark:bg-emerald-400/10 dark:text-emerald-100"
                    : "border-rose-300 bg-rose-50 text-rose-950 dark:border-rose-400/30 dark:bg-rose-400/10 dark:text-rose-100"
                }`}
              >
                <p className="font-extrabold">{drillCorrect ? "Correct!" : "Not quite."}</p>
                <p>
                  <span lang="ar" dir="rtl" className={`${arabicBold} text-lg`}>
                    {current.letter}
                  </span>{" "}
                  is a {current.kind === "moon" ? "Moon" : "Sun"} letter,{" "}
                  {current.kind === "moon"
                    ? "so the Lam is pronounced clearly."
                    : "so the Lam is silent and the letter is doubled."}
                </p>
                <button
                  type="button"
                  onClick={nextDrill}
                  className={`inline-flex min-h-11 items-center gap-2 rounded-full bg-[#0D4F4F] px-5 text-sm font-bold text-white hover:bg-[#093D33] dark:bg-teal-400 dark:text-slate-950 dark:hover:bg-teal-300 ${FOCUS}`}
                >
                  {drillIndex + 1 === DRILL.length ? "See my score" : "Next word"}
                  <ArrowRight aria-hidden="true" className="h-4 w-4 rtl:rotate-180" />
                </button>
              </div>
            )}
          </section>
        ) : (
          <section
            aria-label="Drill results"
            className={`mx-auto max-w-2xl space-y-5 rounded-3xl p-8 text-center shadow-sm ${CARD}`}
          >
            <p className="text-5xl font-black text-[#0D4F4F] dark:text-teal-300">
              {drillScore}/{DRILL.length}
            </p>
            <p className="text-lg font-extrabold">
              {drillScore === DRILL.length
                ? "Perfect! You can tell Moon from Sun every time."
                : drillScore >= 7
                ? "Great work! Just a little more practice."
                : "Good start! Review the letter matrix and try again."}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={restartDrill}
                className={`inline-flex min-h-11 items-center gap-2 rounded-full bg-[#0D4F4F] px-5 text-sm font-bold text-white hover:bg-[#093D33] dark:bg-teal-400 dark:text-slate-950 dark:hover:bg-teal-300 ${FOCUS}`}
              >
                <RotateCcw aria-hidden="true" className="h-4 w-4" />
                Play again
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("letters")}
                className={`inline-flex min-h-11 items-center gap-2 rounded-full border border-[#0D4F4F]/30 px-5 text-sm font-bold text-[#0D4F4F] hover:bg-[#0D4F4F]/5 dark:border-white/20 dark:text-teal-200 dark:hover:bg-white/5 ${FOCUS}`}
              >
                Review the letter matrix
              </button>
            </div>
          </section>
        )}
      </div>

      {/* ------------------- 5. Mastery quiz ------------------- */}
      <div
        role="tabpanel"
        id="lam-panel-quiz"
        aria-labelledby="lam-tab-quiz"
        hidden={activeTab !== "quiz"}
        tabIndex={0}
        className={panelCls}
      >
        <QuizEngine questions={QUIZ_QUESTIONS} />
      </div>
    </div>
  );
}