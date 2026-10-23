"use client";

import React, { useRef, useState } from "react";
import { useLesson } from "../shared/LessonContext";
import AudioButton from "../shared/AudioButton";
import QuizEngine, { QuizQuestion } from "../shared/QuizEngine";
import { SlideDeck, TeacherCorner, VoiceNotice } from "../shared/Lessontoolkit";
import type { Slide } from "../shared/Lessontoolkit";
import {
  ArrowRight,
  CheckCircle2,
  GitBranch,
  HelpCircle,
  Layers,
  Lightbulb,
  Presentation,
  RotateCcw,
  Sparkles,
  XCircle,
} from "lucide-react";

/* -------------------------------------------------------------------------- */
/*  Styling                                                                   */
/* -------------------------------------------------------------------------- */

const FOCUS =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600 dark:focus-visible:outline-teal-300";
const CARD = "border border-stone-200 bg-white dark:border-white/10 dark:bg-[#111827]";
const MUTED = "text-slate-600 dark:text-slate-300";
const BTN_PRIMARY = `inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[#0D4F4F] px-5 text-sm font-bold text-white hover:bg-[#093D33] dark:bg-teal-400 dark:text-slate-950 dark:hover:bg-teal-300 ${FOCUS}`;
const BTN_OUTLINE = `inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-[#0D4F4F]/30 px-5 text-sm font-bold text-[#0D4F4F] hover:bg-[#0D4F4F]/5 dark:border-white/20 dark:text-teal-200 dark:hover:bg-white/5 ${FOCUS}`;

const WASL_MARK = "rounded-sm bg-amber-100 text-amber-800 dark:bg-amber-400/20 dark:text-amber-200";
const DROPPED = "text-slate-300 line-through dark:text-slate-600";

/* -------------------------------------------------------------------------- */
/*  Arabic helpers                                                            */
/* -------------------------------------------------------------------------- */

const MARK_RE = /[\u0610-\u061A\u064B-\u065F\u0670\u06D6-\u06DC\u06DF-\u06E8\u06EA-\u06ED]/;

function toClusters(text: string): string[] {
  const out: string[] = [];
  for (const ch of Array.from(text)) {
    if (MARK_RE.test(ch) && out.length) out[out.length - 1] += ch;
    else out.push(ch);
  }
  return out;
}

/** The first letter (Alif) gets a highlight, or is shown as dropped. Only colour changes, so letters keep joining. */
function WaslWord({ word, prefix, dropped = false }: { word: string; prefix?: string; dropped?: boolean }) {
  const c = toClusters(word);
  const rest = c.slice(1).join("");
  return (
    <>
      {prefix && <span className="text-[#0D6B66] dark:text-teal-300">{prefix}</span>}
      <span title={dropped ? "Dropped when connected" : "Hamzatul-Wasl"} className={dropped ? DROPPED : WASL_MARK}>
        {c[0]}
      </span>
      {rest}
    </>
  );
}

/* -------------------------------------------------------------------------- */
/*  Content                                                                   */
/* -------------------------------------------------------------------------- */

type StartVowel = "fatha" | "kasra" | "damma";
type Family = "verb" | "noun" | "article";

interface WaslEntry {
  id: string;
  word: string;
  letters: [string, string, string];
  family: Family;
  startVowel: StartVowel;
  startForm: string;
  startSound: string;
  prefix: string;
  connectedForm: string;
  connectedSound: string;
  meaning: string;
  rule: string;
}

const VOWELS: Record<StartVowel, { name: string; form: string; sign: string }> = {
  fatha: { name: "Fatha", form: "أَ", sign: "ـَ" },
  kasra: { name: "Kasra", form: "إِ", sign: "ـِ" },
  damma: { name: "Damma", form: "أُ", sign: "ـُ" },
};

const FAMILY_LABEL: Record<Family, string> = {
  verb: "Command verb",
  noun: "Noun",
  article: "The article “Al”",
};

const WASL_WORDS: WaslEntry[] = [
  {
    id: "ihdina",
    word: "ٱهْدِنَا",
    letters: ["ٱ", "هْ", "دِ"],
    family: "verb",
    startVowel: "kasra",
    startForm: "إِهْدِنَا",
    startSound: "ih-dinaa",
    prefix: "وَ",
    connectedForm: "وَهْدِنَا",
    connectedSound: "wah-dinaa",
    meaning: "Guide us",
    rule: "The 3rd letter دِ has a Kasra, so we start with a Kasra: ih-dinaa.",
  },
  {
    id: "usjud",
    word: "ٱسْجُدْ",
    letters: ["ٱ", "سْ", "جُ"],
    family: "verb",
    startVowel: "damma",
    startForm: "أُسْجُدْ",
    startSound: "us-jud",
    prefix: "فَ",
    connectedForm: "فَسْجُدْ",
    connectedSound: "fas-jud",
    meaning: "Prostrate!",
    rule: "The 3rd letter جُ has an essential Damma, so we start with a Damma: us-jud.",
  },
  {
    id: "iqra",
    word: "ٱقْرَأْ",
    letters: ["ٱ", "قْ", "رَ"],
    family: "verb",
    startVowel: "kasra",
    startForm: "إِقْرَأْ",
    startSound: "iq-ra’",
    prefix: "وَ",
    connectedForm: "وَقْرَأْ",
    connectedSound: "waq-ra’",
    meaning: "Read!",
    rule: "The 3rd letter رَ has a Fatha. Only a Damma earns a Damma start, so we start with a Kasra: iq-ra’.",
  },
  {
    id: "unzur",
    word: "ٱنْظُرْ",
    letters: ["ٱ", "نْ", "ظُ"],
    family: "verb",
    startVowel: "damma",
    startForm: "أُنْظُرْ",
    startSound: "un-zur",
    prefix: "فَ",
    connectedForm: "فَنْظُرْ",
    connectedSound: "fan-zur",
    meaning: "Look!",
    rule: "The 3rd letter ظُ has an essential Damma, so we start with a Damma: un-zur.",
  },
  {
    id: "udu",
    word: "ٱدْعُ",
    letters: ["ٱ", "دْ", "عُ"],
    family: "verb",
    startVowel: "damma",
    startForm: "أُدْعُ",
    startSound: "ud-‘u",
    prefix: "وَ",
    connectedForm: "وَدْعُ",
    connectedSound: "wad-‘u",
    meaning: "Call! Invite!",
    rule: "The 3rd letter عُ has an essential Damma, so we start with a Damma: ud-‘u.",
  },
  {
    id: "ilam",
    word: "ٱعْلَمْ",
    letters: ["ٱ", "عْ", "لَ"],
    family: "verb",
    startVowel: "kasra",
    startForm: "إِعْلَمْ",
    startSound: "i‘-lam",
    prefix: "وَ",
    connectedForm: "وَعْلَمْ",
    connectedSound: "wa‘-lam",
    meaning: "Know!",
    rule: "The 3rd letter لَ has a Fatha, so we start with a Kasra: i‘-lam.",
  },
  {
    id: "ismu",
    word: "ٱسْمُ",
    letters: ["ٱ", "سْ", "مُ"],
    family: "noun",
    startVowel: "kasra",
    startForm: "إِسْمُ",
    startSound: "is-mu",
    prefix: "وَ",
    connectedForm: "وَسْمُ",
    connectedSound: "was-mu",
    meaning: "Name",
    rule: "A noun. The Damma on مُ is only the word ending, not an essential Damma, so we start with a Kasra: is-mu.",
  },
  {
    id: "alhamd",
    word: "ٱلْحَمْدُ",
    letters: ["ٱ", "لْ", "حَ"],
    family: "article",
    startVowel: "fatha",
    startForm: "أَلْحَمْدُ",
    startSound: "al-hamdu",
    prefix: "وَ",
    connectedForm: "وَلْحَمْدُ",
    connectedSound: "wal-hamdu",
    meaning: "The praise",
    rule: "The article ٱلْ always starts with a Fatha: al-hamdu.",
  },
];

// Decoder order: mixes Kasra, Damma and Fatha starts.
const DECODER_ORDER = ["ihdina", "usjud", "iqra", "alhamd", "unzur", "ismu", "udu", "ilam"];
const DECODER: WaslEntry[] = DECODER_ORDER.map((id) => WASL_WORDS.find((w) => w.id === id) as WaslEntry);

interface SortItem {
  word: string;
  kind: "wasl" | "qat";
  meaning: string;
  audio: string;
}

const SORT_ITEMS: SortItem[] = [
  { word: "ٱهْدِنَا", kind: "wasl", meaning: "Guide us", audio: "إِهْدِنَا" },
  { word: "أَنْعَمْتَ", kind: "qat", meaning: "You have blessed", audio: "أَنْعَمْتَ" },
  { word: "ٱقْرَأْ", kind: "wasl", meaning: "Read!", audio: "إِقْرَأْ" },
  { word: "أَحَدٌ", kind: "qat", meaning: "One", audio: "أَحَدٌ" },
  { word: "ٱللَّهُ", kind: "wasl", meaning: "Allah", audio: "أَللَّهُ" },
  { word: "إِيَّاكَ", kind: "qat", meaning: "You alone", audio: "إِيَّاكَ" },
  { word: "ٱلرَّحْمَٰنُ", kind: "wasl", meaning: "The Most Merciful", audio: "أَلرَّحْمَٰنُ" },
  { word: "أَعُوذُ", kind: "qat", meaning: "I seek refuge", audio: "أَعُوذُ" },
];

const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: "w1",
    type: "multiple-choice",
    questionEn: "What happens to Hamzatul-Wasl (ٱ) when a word comes BEFORE it in continuous recitation?",
    options: [
      { id: "a", text: "It is pronounced strongly as A", isCorrect: false },
      { id: "b", text: "It is completely dropped in pronunciation, bridging straight to the next letter", isCorrect: true },
      { id: "c", text: "It is stretched for 2 beats", isCorrect: false },
      { id: "d", text: "It turns into a Noon", isCorrect: false },
    ],
    explanation: "Hamzatul-Wasl is a bridge letter: pronounced only when starting, and dropped completely when connecting!",
  },
  {
    id: "w2",
    type: "multiple-choice",
    questionEn: "How can you recognise Hamzatul-Wasl when you read?",
    options: [
      { id: "a", text: "An Alif with a Hamza above it (أ)", isCorrect: false },
      { id: "b", text: "A bare Alif with no Hamza sign (ٱ)", isCorrect: true },
      { id: "c", text: "An Alif with a Hamza below it (إ)", isCorrect: false },
      { id: "d", text: "An Alif with a Madd sign (آ)", isCorrect: false },
    ],
    explanation: "Hamzatul-Wasl is written as a bare Alif. Hamzatul-Qat’ always carries a Hamza sign above or below.",
  },
  {
    id: "w3",
    type: "multiple-choice",
    questionEn: "You start reading the word ٱهْدِنَا. How do you say it?",
    options: [
      { id: "a", text: "Ah-dinaa, with a Fatha", isCorrect: false },
      { id: "b", text: "Uh-dinaa, with a Damma", isCorrect: false },
      { id: "c", text: "Ih-dinaa, with a Kasra", isCorrect: true },
      { id: "d", text: "H-dinaa, with no starting vowel", isCorrect: false },
    ],
    explanation: "The 3rd letter دِ has a Kasra, so the start vowel is a Kasra. A word can never begin with a Sukun.",
  },
  {
    id: "w4",
    type: "multiple-choice",
    questionEn: "Why do we start ٱسْجُدْ with a Damma (us-jud)?",
    options: [
      { id: "a", text: "Because the 3rd letter جُ has an essential Damma", isCorrect: true },
      { id: "b", text: "Because every verb starts with a Damma", isCorrect: false },
      { id: "c", text: "Because the word starts with Sin", isCorrect: false },
      { id: "d", text: "Because it has a Sukun on the 2nd letter", isCorrect: false },
    ],
    explanation: "Only an essential Damma on the 3rd letter earns a Damma start. Otherwise the start vowel is a Kasra.",
  },
  {
    id: "w5",
    type: "multiple-choice",
    questionEn: "What is the starting vowel of ٱلْحَمْدُ?",
    options: [
      { id: "a", text: "Kasra (il-hamdu)", isCorrect: false },
      { id: "b", text: "Damma (ul-hamdu)", isCorrect: false },
      { id: "c", text: "No vowel", isCorrect: false },
      { id: "d", text: "Fatha (al-hamdu)", isCorrect: true },
    ],
    explanation: "The article ٱلْ always starts with a Fatha.",
  },
  {
    id: "w6",
    type: "multiple-choice",
    questionEn: "Which word starts with Hamzatul-Qat’, which is ALWAYS pronounced?",
    options: [
      { id: "a", text: "ٱهْدِنَا", isCorrect: false },
      { id: "b", text: "أَنْعَمْتَ", isCorrect: true },
      { id: "c", text: "ٱقْرَأْ", isCorrect: false },
      { id: "d", text: "ٱللَّهُ", isCorrect: false },
    ],
    explanation: "أَنْعَمْتَ starts with an Alif carrying a Hamza (أ), so it is pronounced even when connected.",
  },
  {
    id: "w7",
    type: "multiple-choice",
    questionEn: "How do we say فَٱسْجُدْ in continuous reading?",
    options: [
      { id: "a", text: "Fa-us-jud", isCorrect: false },
      { id: "b", text: "Fa-is-jud", isCorrect: false },
      { id: "c", text: "Fas-jud, with the Alif dropped", isCorrect: true },
      { id: "d", text: "Fa-as-jud", isCorrect: false },
    ],
    explanation: "The Alif is a bridge. After فَ it disappears and the Fa lands right on the Sin: fas-jud.",
  },
];

const TABS = [
  { id: "bridge", label: "1. Bridge Simulator (ٱ)", icon: GitBranch },
  { id: "decoder", label: "2. Starting Vowel Decoder", icon: Sparkles },
  { id: "sorter", label: "3. Wasl or Qat’?", icon: Layers },
  { id: "quiz", label: "4. Mastery Quiz", icon: HelpCircle },
] as const;

type TabId = (typeof TABS)[number]["id"];

/* -------------------------------------------------------------------------- */
/*  Small pieces                                                              */
/* -------------------------------------------------------------------------- */

function ThreeLetters({ letters, highlight }: { letters: [string, string, string]; highlight: boolean }) {
  const labels = ["1st · the Alif", "2nd", "3rd · look here"];
  return (
    <ol dir="rtl" className="grid grid-cols-3 gap-3">
      {letters.map((l, i) => (
        <li
          key={i}
          className={`rounded-2xl border-2 p-4 text-center ${
            highlight && i === 2
              ? "border-teal-500 bg-teal-50 dark:bg-teal-400/10"
              : highlight && i === 0
              ? "border-amber-300 bg-amber-50 dark:border-amber-400/40 dark:bg-amber-400/10"
              : "border-stone-200 dark:border-white/10"
          }`}
        >
          <span lang="ar" className="arabic-font block text-4xl font-bold text-slate-900 dark:text-white">
            {l}
          </span>
          <span dir="ltr" className={`mt-1 block text-xs font-bold ${MUTED}`}>
            {labels[i]}
          </span>
        </li>
      ))}
    </ol>
  );
}

function ResultCard({
  score,
  total,
  perfect,
  good,
  onRestart,
}: {
  score: number;
  total: number;
  perfect: string;
  good: string;
  onRestart: () => void;
}) {
  return (
    <section aria-label="Results" className={`mx-auto max-w-xl space-y-5 rounded-3xl p-8 text-center shadow-sm ${CARD}`}>
      <p className="text-5xl font-black text-[#0D4F4F] dark:text-teal-300">
        {score}/{total}
      </p>
      <p className="text-lg font-extrabold">{score === total ? perfect : good}</p>
      <button type="button" onClick={onRestart} className={BTN_PRIMARY}>
        <RotateCcw aria-hidden="true" className="h-4 w-4" /> Play again
      </button>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  Component                                                                 */
/* -------------------------------------------------------------------------- */

export default function HamzatulWaslLesson() {
  const lessonCtx = useLesson();
  const showTransliteration = lessonCtx?.showTransliteration ?? true;
  const showEnglishMeaning = lessonCtx?.showEnglishMeaning ?? true;
  const isTeacherMode = lessonCtx?.isTeacherMode ?? false;
  const fontSizeMultiplier = lessonCtx?.fontSizeMultiplier ?? 1.1;

  const [activeTab, setActiveTab] = useState<TabId>("bridge");
  const [presenting, setPresenting] = useState(false);
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  // Bridge simulator
  const [wordId, setWordId] = useState(WASL_WORDS[0].id);
  const [mode, setMode] = useState<"start" | "connect">("start");

  // Starting-vowel decoder
  const [dIdx, setDIdx] = useState(0);
  const [dChoice, setDChoice] = useState<StartVowel | null>(null);
  const [dScore, setDScore] = useState(0);
  const [dHint, setDHint] = useState(false);

  // Wasl-or-Qat' sorter
  const [sIdx, setSIdx] = useState(0);
  const [sChoice, setSChoice] = useState<"wasl" | "qat" | null>(null);
  const [sScore, setSScore] = useState(0);

  const m = fontSizeMultiplier;
  const fluid = (min: number, vw: number, max: number) =>
    `clamp(${(min * m).toFixed(2)}rem, ${(vw * m).toFixed(2)}vw + 0.4rem, ${(max * m).toFixed(2)}rem)`;
  const bigSize = fluid(2.8, 8, 4.2);

  const entry = WASL_WORDS.find((w) => w.id === wordId) ?? WASL_WORDS[0];
  const vowel = VOWELS[entry.startVowel];

  const dDone = dIdx >= DECODER.length;
  const dWord = dDone ? null : DECODER[dIdx];
  const dAnswered = dChoice !== null;

  const sDone = sIdx >= SORT_ITEMS.length;
  const sItem = sDone ? null : SORT_ITEMS[sIdx];
  const sAnswered = sChoice !== null;

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

  const chooseVowel = (v: StartVowel) => {
    if (!dWord || dChoice) return;
    setDChoice(v);
    if (v === dWord.startVowel) setDScore((s) => s + 1);
  };
  const nextDecoder = () => {
    setDIdx((i) => i + 1);
    setDChoice(null);
    setDHint(false);
  };
  const restartDecoder = () => {
    setDIdx(0);
    setDChoice(null);
    setDScore(0);
    setDHint(false);
  };

  const chooseKind = (k: "wasl" | "qat") => {
    if (!sItem || sChoice) return;
    setSChoice(k);
    if (k === sItem.kind) setSScore((s) => s + 1);
  };
  const nextSort = () => {
    setSIdx((i) => i + 1);
    setSChoice(null);
  };
  const restartSort = () => {
    setSIdx(0);
    setSChoice(null);
    setSScore(0);
  };

  /* ------------------------------ Teacher deck ------------------------------ */

  const bigArabic = (children: React.ReactNode) => (
    <span lang="ar" dir="rtl" className="arabic-font block font-bold text-slate-900 dark:text-white" style={{ fontSize: fluid(3, 9, 5.5) }}>
      {children}
    </span>
  );

  const slides: Slide[] = [
    {
      id: "intro",
      title: "The bridge letter",
      node: (
        <div className="space-y-6 text-center">
          <span lang="ar" dir="rtl" className="arabic-font block font-bold text-[#A8832F] dark:text-[#E8C56A]" style={{ fontSize: fluid(6, 16, 10) }}>
            ٱ
          </span>
          <h2 className="text-4xl font-black text-[#0D4F4F] dark:text-white sm:text-6xl">Hamzatul-Wasl</h2>
          <p className={`mx-auto max-w-2xl text-xl ${MUTED}`}>
            A bridge letter: <strong>said when you start</strong> a word, <strong>silent when you connect</strong> it to the word before.
          </p>
        </div>
      ),
    },
    {
      id: "compare",
      title: "Wasl or Qat’?",
      node: (
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-3xl border-2 border-amber-300 bg-amber-50 p-8 text-center dark:border-amber-400/40 dark:bg-amber-400/10">
            {bigArabic(<WaslWord word="ٱهْدِنَا" />)}
            <p className="mt-3 text-2xl font-extrabold text-amber-900 dark:text-amber-200">Wasl: bare Alif</p>
            <p className={`mt-1 text-lg ${MUTED}`}>Dropped when connected</p>
          </div>
          <div className="rounded-3xl border-2 border-teal-300 bg-teal-50 p-8 text-center dark:border-teal-400/40 dark:bg-teal-400/10">
            {bigArabic("أَنْعَمْتَ")}
            <p className="mt-3 text-2xl font-extrabold text-teal-900 dark:text-teal-200">Qat’: Alif with Hamza</p>
            <p className={`mt-1 text-lg ${MUTED}`}>Always pronounced</p>
          </div>
        </div>
      ),
    },
    {
      id: "third-letter",
      title: "The 3rd-letter rule",
      node: (
        <div className="grid gap-6 md:grid-cols-3">
          {["ihdina", "usjud", "iqra"].map((id) => {
            const w = WASL_WORDS.find((x) => x.id === id) as WaslEntry;
            return (
              <div key={id} className={`space-y-4 rounded-3xl p-6 text-center ${CARD}`}>
                {bigArabic(w.word)}
                <ThreeLetters letters={w.letters} highlight />
                <p className="text-xl font-extrabold text-[#0D4F4F] dark:text-teal-300">
                  Starts with {VOWELS[w.startVowel].name}: {w.startSound}
                </p>
              </div>
            );
          })}
        </div>
      ),
    },
    {
      id: "nouns",
      title: "Nouns and “Al”",
      node: (
        <div className="grid gap-6 md:grid-cols-2">
          {["ismu", "alhamd"].map((id) => {
            const w = WASL_WORDS.find((x) => x.id === id) as WaslEntry;
            return (
              <div key={id} className={`space-y-3 rounded-3xl p-8 text-center ${CARD}`}>
                {bigArabic(w.word)}
                <p className="text-2xl font-extrabold text-[#0D4F4F] dark:text-teal-300">
                  {VOWELS[w.startVowel].name}: {w.startSound}
                </p>
                <p className={`text-lg ${MUTED}`}>{w.rule}</p>
              </div>
            );
          })}
        </div>
      ),
    },
    {
      id: "bridge",
      title: "Watch the bridge",
      node: (
        <div className="space-y-6 text-center">
          {bigArabic(<WaslWord word="ٱهْدِنَا" prefix="وَ" dropped />)}
          <p className="text-3xl font-extrabold text-[#0D4F4F] dark:text-teal-300">wah-dinaa</p>
          <p className={`mx-auto max-w-2xl text-xl ${MUTED}`}>The Alif disappears and the Waw lands right on the next letter.</p>
        </div>
      ),
    },
    {
      id: "check",
      title: "Check for understanding",
      node: (
        <ol className="mx-auto max-w-3xl list-decimal space-y-5 ps-8 text-2xl font-semibold leading-relaxed text-slate-800 dark:text-slate-100">
          <li>How do we start <span lang="ar" className="arabic-font font-bold">ٱقْرَأْ</span>, and why?</li>
          <li>Is <span lang="ar" className="arabic-font font-bold">أَحَدٌ</span> Wasl or Qat’? How can you tell?</li>
          <li>Say <span lang="ar" className="arabic-font font-bold">فَٱسْجُدْ</span> without pronouncing the Alif.</li>
        </ol>
      ),
    },
  ];

  /* --------------------------------- Render --------------------------------- */

  return (
    <div className="space-y-8 animate-in fade-in duration-500 motion-reduce:animate-none">
      <SlideDeck open={presenting} onClose={() => setPresenting(false)} slides={slides} heading="Hamzatul-Wasl" />
      <VoiceNotice />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div
          role="tablist"
          aria-label="Hamzatul-Wasl lesson sections"
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
                id={`wasl-tab-${tab.id}`}
                type="button"
                role="tab"
                aria-selected={active}
                aria-controls={`wasl-panel-${tab.id}`}
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
        <button type="button" onClick={() => setPresenting(true)} className={BTN_PRIMARY}>
          <Presentation aria-hidden="true" className="h-4 w-4" />
          Present
        </button>
      </div>

      {/* ------------------------- 1. Bridge simulator ------------------------- */}
      <div
        role="tabpanel"
        id="wasl-panel-bridge"
        aria-labelledby="wasl-tab-bridge"
        hidden={activeTab !== "bridge"}
        tabIndex={0}
        className={`space-y-6 rounded-2xl ${FOCUS}`}
      >
        <p className={`text-base ${MUTED}`}>
          Hamzatul-Wasl is a bridge. Pick a word, then switch between <strong>starting</strong> it and{" "}
          <strong>connecting</strong> it to a word before.
        </p>

        <div role="group" aria-label="Choose a word" className="flex flex-wrap gap-2">
          {WASL_WORDS.map((w) => (
            <button
              key={w.id}
              type="button"
              aria-pressed={w.id === entry.id}
              onClick={() => setWordId(w.id)}
              className={`min-h-11 rounded-full border px-4 ${FOCUS} ${
                w.id === entry.id
                  ? "border-[#0D4F4F] bg-[#0D4F4F] text-white dark:border-teal-400 dark:bg-teal-400 dark:text-slate-950"
                  : "border-stone-300 text-slate-800 hover:bg-stone-100 dark:border-white/20 dark:text-slate-100 dark:hover:bg-white/10"
              }`}
            >
              <span lang="ar" className="arabic-font text-xl font-bold">{w.word}</span>
            </button>
          ))}
        </div>

        <div role="group" aria-label="Start or connect" className="inline-flex rounded-full border border-stone-200 bg-stone-100/80 p-1 dark:border-white/10 dark:bg-white/5">
          {(["start", "connect"] as const).map((md) => (
            <button
              key={md}
              type="button"
              aria-pressed={mode === md}
              onClick={() => setMode(md)}
              className={`min-h-10 rounded-full px-5 text-sm font-bold ${FOCUS} ${
                mode === md
                  ? "bg-[#0D4F4F] text-white dark:bg-teal-400 dark:text-slate-950"
                  : "text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
              }`}
            >
              {md === "start" ? "Start the word" : `Connect after ${entry.prefix}`}
            </button>
          ))}
        </div>

        <article className={`space-y-6 rounded-3xl p-6 shadow-sm sm:p-8 ${CARD}`}>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-teal-100 px-3 py-1 text-xs font-extrabold text-teal-900 dark:bg-teal-400/15 dark:text-teal-200">
                {mode === "start" ? `Starts with ${vowel.name}` : "Bridge mode: Alif dropped"}
              </span>
              <span className="rounded-full bg-stone-100 px-3 py-1 text-xs font-bold text-slate-700 dark:bg-white/10 dark:text-slate-200">
                {FAMILY_LABEL[entry.family]}
              </span>
            </div>
            <AudioButton text={mode === "start" ? entry.startForm : entry.connectedForm} />
          </div>

          <p lang="ar" dir="rtl" className="arabic-font py-2 text-center font-bold leading-[1.9] text-slate-900 dark:text-white" style={{ fontSize: bigSize }}>
            {mode === "start" ? (
              <WaslWord word={entry.word} />
            ) : (
              <WaslWord word={entry.word} prefix={entry.prefix} dropped />
            )}
          </p>

          {mode === "start" ? (
            <>
              <ThreeLetters letters={entry.letters} highlight />
              <div className="flex flex-wrap items-center justify-center gap-4 rounded-2xl bg-teal-50 p-5 dark:bg-teal-400/10">
                <span className="text-sm font-bold text-slate-700 dark:text-slate-200">3rd letter decides</span>
                <ArrowRight aria-hidden="true" className="h-5 w-5 text-teal-600 rtl:rotate-180 dark:text-teal-300" />
                <span lang="ar" dir="rtl" className="arabic-font text-4xl font-bold text-[#0D4F4F] dark:text-teal-200">
                  {entry.startForm}
                </span>
                {!isTeacherMode && showTransliteration && (
                  <span className="text-lg font-extrabold text-teal-800 dark:text-teal-300">{entry.startSound}</span>
                )}
              </div>
            </>
          ) : (
            <div className="space-y-3 rounded-2xl bg-teal-50 p-5 text-center dark:bg-teal-400/10">
              <p lang="ar" dir="rtl" className="arabic-font text-4xl font-bold text-[#0D4F4F] dark:text-teal-200">
                {entry.connectedForm}
              </p>
              {!isTeacherMode && showTransliteration && (
                <p className="text-lg font-extrabold text-teal-800 dark:text-teal-300">{entry.connectedSound}</p>
              )}
              <p className={`text-sm ${MUTED}`}>
                The Alif is only a bridge. After {entry.prefix} it disappears and the {entry.prefix === "وَ" ? "Waw" : "Fa"} lands right on the next letter.
              </p>
            </div>
          )}

          {!isTeacherMode && (
            <div className="space-y-1 border-t border-stone-200 pt-4 text-sm dark:border-white/10">
              {showEnglishMeaning && (
                <p className="font-semibold text-slate-800 dark:text-slate-100">{entry.meaning}</p>
              )}
              <p className={MUTED}>{entry.rule}</p>
            </div>
          )}
        </article>
      </div>

      {/* ------------------------- 2. Starting vowel decoder ------------------------- */}
      <div
        role="tabpanel"
        id="wasl-panel-decoder"
        aria-labelledby="wasl-tab-decoder"
        hidden={activeTab !== "decoder"}
        tabIndex={0}
        className={`space-y-6 rounded-2xl ${FOCUS}`}
      >
        <div className={`space-y-3 text-base ${MUTED}`}>
          <p>How do we start this word? Look at the 3rd letter, then choose the starting vowel.</p>
          <ul className="grid gap-2 text-sm sm:grid-cols-3">
            <li className="rounded-xl bg-stone-100 p-3 dark:bg-white/5"><strong>Essential Damma</strong> on the 3rd letter → <strong>Damma</strong></li>
            <li className="rounded-xl bg-stone-100 p-3 dark:bg-white/5">Any other verb or noun → <strong>Kasra</strong></li>
            <li className="rounded-xl bg-stone-100 p-3 dark:bg-white/5">The article <span lang="ar" className="arabic-font font-bold">ٱلْ</span> → <strong>Fatha</strong></li>
          </ul>
        </div>

        {!dDone && dWord ? (
          <section aria-label="Decoder game" className={`mx-auto max-w-2xl space-y-6 rounded-3xl p-6 shadow-sm sm:p-8 ${CARD}`}>
            <div className={`flex items-center justify-between text-sm font-semibold ${MUTED}`}>
              <span>Word {dIdx + 1} of {DECODER.length}</span>
              <span>Score: {dScore}</span>
            </div>
            <div
              role="progressbar"
              aria-label="Decoder progress"
              aria-valuemin={0}
              aria-valuemax={DECODER.length}
              aria-valuenow={dIdx + (dAnswered ? 1 : 0)}
              className="h-2 overflow-hidden rounded-full bg-stone-200 dark:bg-white/10"
            >
              <div
                className="h-full rounded-full bg-[#0D9488] transition-[width] duration-500 motion-reduce:transition-none"
                style={{ width: `${((dIdx + (dAnswered ? 1 : 0)) / DECODER.length) * 100}%` }}
              />
            </div>

            <p lang="ar" dir="rtl" className="arabic-font rounded-2xl bg-stone-50 py-6 text-center font-bold leading-[1.9] text-slate-900 dark:bg-white/5 dark:text-white" style={{ fontSize: bigSize }}>
              <WaslWord word={dWord.word} />
            </p>

            {(dHint || dAnswered) && <ThreeLetters letters={dWord.letters} highlight />}

            {!dAnswered && !dHint && (
              <div className="text-center">
                <button type="button" onClick={() => setDHint(true)} className={BTN_OUTLINE}>
                  <Lightbulb aria-hidden="true" className="h-4 w-4" /> Show the first three letters
                </button>
              </div>
            )}

            <div role="group" aria-label="Choose the starting vowel" className="grid gap-3 sm:grid-cols-3">
              {(Object.keys(VOWELS) as StartVowel[]).map((v) => {
                const isRight = dAnswered && v === dWord.startVowel;
                const isWrong = dAnswered && dChoice === v && v !== dWord.startVowel;
                return (
                  <button
                    key={v}
                    type="button"
                    disabled={dAnswered}
                    onClick={() => chooseVowel(v)}
                    className={`flex min-h-20 flex-col items-center justify-center gap-1 rounded-2xl border-2 px-3 py-3 text-base font-extrabold transition-colors disabled:cursor-default motion-reduce:transition-none ${FOCUS} ${
                      isRight
                        ? "border-emerald-500 bg-emerald-50 text-emerald-900 dark:bg-emerald-400/10 dark:text-emerald-200"
                        : isWrong
                        ? "border-rose-500 bg-rose-50 text-rose-900 dark:bg-rose-400/10 dark:text-rose-200"
                        : "border-stone-200 text-slate-800 hover:border-[#0D9488] dark:border-white/15 dark:text-slate-100"
                    }`}
                  >
                    <span lang="ar" className="arabic-font text-3xl font-bold">{VOWELS[v].form}</span>
                    <span>{VOWELS[v].name}</span>
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

            {dAnswered && (
              <div
                role="status"
                className={`space-y-3 rounded-2xl border p-4 text-[15px] leading-relaxed animate-in fade-in duration-300 motion-reduce:animate-none ${
                  dChoice === dWord.startVowel
                    ? "border-emerald-300 bg-emerald-50 text-emerald-950 dark:border-emerald-400/30 dark:bg-emerald-400/10 dark:text-emerald-100"
                    : "border-rose-300 bg-rose-50 text-rose-950 dark:border-rose-400/30 dark:bg-rose-400/10 dark:text-rose-100"
                }`}
              >
                <p className="font-extrabold">{dChoice === dWord.startVowel ? "Correct!" : "Not quite."}</p>
                <p>{dWord.rule}</p>
                <div className="flex flex-wrap items-center gap-3">
                  <AudioButton text={dWord.startForm} />
                  {showTransliteration && <span className="font-extrabold">{dWord.startSound}</span>}
                </div>
                <button type="button" onClick={nextDecoder} className={BTN_PRIMARY}>
                  {dIdx + 1 === DECODER.length ? "See my score" : "Next word"}
                </button>
              </div>
            )}
          </section>
        ) : (
          <ResultCard
            score={dScore}
            total={DECODER.length}
            perfect="Perfect! You can decode every starting vowel."
            good="Good start! Re-read the three rules above and try again."
            onRestart={restartDecoder}
          />
        )}
      </div>

      {/* ------------------------- 3. Wasl or Qat'? ------------------------- */}
      <div
        role="tabpanel"
        id="wasl-panel-sorter"
        aria-labelledby="wasl-tab-sorter"
        hidden={activeTab !== "sorter"}
        tabIndex={0}
        className={`space-y-6 rounded-2xl ${FOCUS}`}
      >
        <div className="grid gap-5 md:grid-cols-2">
          <article className="space-y-3 rounded-3xl border-2 border-amber-300 bg-amber-50 p-6 dark:border-amber-400/40 dark:bg-amber-400/10">
            <h2 className="text-lg font-extrabold text-amber-900 dark:text-amber-200">
              Hamzatul-Wasl <span lang="ar" className="arabic-font">(همزة الوصل)</span>
            </h2>
            <ul className="list-disc space-y-1.5 ps-5 text-[15px] text-slate-800 dark:text-slate-100">
              <li>Written as a <strong>bare Alif</strong> (ٱ), with no Hamza sign.</li>
              <li>Pronounced <strong>only when you start</strong> the word.</li>
              <li>Dropped when connected to the word before.</li>
            </ul>
            <p lang="ar" dir="rtl" className="arabic-font text-3xl font-bold text-slate-900 dark:text-white">
              <WaslWord word="ٱهْدِنَا" />
            </p>
          </article>
          <article className="space-y-3 rounded-3xl border-2 border-teal-300 bg-teal-50 p-6 dark:border-teal-400/40 dark:bg-teal-400/10">
            <h2 className="text-lg font-extrabold text-teal-900 dark:text-teal-200">
              Hamzatul-Qat’ <span lang="ar" className="arabic-font">(همزة القطع)</span>
            </h2>
            <ul className="list-disc space-y-1.5 ps-5 text-[15px] text-slate-800 dark:text-slate-100">
              <li>Written as an Alif with a <strong>Hamza above or below</strong> (أ or إ).</li>
              <li><strong>Always pronounced</strong>, even when connected.</li>
              <li>It “cuts” the sound, so nothing bridges over it.</li>
            </ul>
            <p lang="ar" dir="rtl" className="arabic-font text-3xl font-bold text-slate-900 dark:text-white">أَنْعَمْتَ</p>
          </article>
        </div>

        {!sDone && sItem ? (
          <section aria-label="Sorting game" className={`mx-auto max-w-2xl space-y-6 rounded-3xl p-6 shadow-sm sm:p-8 ${CARD}`}>
            <div className={`flex items-center justify-between text-sm font-semibold ${MUTED}`}>
              <span>Word {sIdx + 1} of {SORT_ITEMS.length}</span>
              <span>Score: {sScore}</span>
            </div>
            <div
              role="progressbar"
              aria-label="Sorting progress"
              aria-valuemin={0}
              aria-valuemax={SORT_ITEMS.length}
              aria-valuenow={sIdx + (sAnswered ? 1 : 0)}
              className="h-2 overflow-hidden rounded-full bg-stone-200 dark:bg-white/10"
            >
              <div
                className="h-full rounded-full bg-[#0D9488] transition-[width] duration-500 motion-reduce:transition-none"
                style={{ width: `${((sIdx + (sAnswered ? 1 : 0)) / SORT_ITEMS.length) * 100}%` }}
              />
            </div>

            <p className="text-center text-lg font-extrabold">Does this word start with Wasl or Qat’?</p>
            <div className="flex items-center justify-center gap-3 rounded-2xl bg-stone-50 py-6 dark:bg-white/5">
              <p lang="ar" dir="rtl" className="arabic-font font-bold leading-[1.9] text-slate-900 dark:text-white" style={{ fontSize: bigSize }}>
                {sAnswered && sItem.kind === "wasl" ? <WaslWord word={sItem.word} /> : sItem.word}
              </p>
              <AudioButton text={sItem.audio} />
            </div>

            <div role="group" aria-label="Your answer" className="grid gap-3 sm:grid-cols-2">
              {(["wasl", "qat"] as const).map((k) => {
                const isRight = sAnswered && sItem.kind === k;
                const isWrong = sAnswered && sChoice === k && sItem.kind !== k;
                return (
                  <button
                    key={k}
                    type="button"
                    disabled={sAnswered}
                    onClick={() => chooseKind(k)}
                    className={`flex min-h-16 flex-col items-center justify-center gap-1 rounded-2xl border-2 px-3 py-3 text-base font-extrabold transition-colors disabled:cursor-default motion-reduce:transition-none ${FOCUS} ${
                      isRight
                        ? "border-emerald-500 bg-emerald-50 text-emerald-900 dark:bg-emerald-400/10 dark:text-emerald-200"
                        : isWrong
                        ? "border-rose-500 bg-rose-50 text-rose-900 dark:bg-rose-400/10 dark:text-rose-200"
                        : "border-stone-200 text-slate-800 hover:border-[#0D9488] dark:border-white/15 dark:text-slate-100"
                    }`}
                  >
                    <span>{k === "wasl" ? "Hamzatul-Wasl (ٱ)" : "Hamzatul-Qat’ (أ / إ)"}</span>
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

            {sAnswered && (
              <div
                role="status"
                className={`space-y-3 rounded-2xl border p-4 text-[15px] leading-relaxed animate-in fade-in duration-300 motion-reduce:animate-none ${
                  sChoice === sItem.kind
                    ? "border-emerald-300 bg-emerald-50 text-emerald-950 dark:border-emerald-400/30 dark:bg-emerald-400/10 dark:text-emerald-100"
                    : "border-rose-300 bg-rose-50 text-rose-950 dark:border-rose-400/30 dark:bg-rose-400/10 dark:text-rose-100"
                }`}
              >
                <p className="font-extrabold">{sChoice === sItem.kind ? "Correct!" : "Not quite."}</p>
                <p>
                  {sItem.kind === "wasl"
                    ? "A bare Alif with no Hamza sign is Hamzatul-Wasl. It is dropped when connected."
                    : "The Hamza sign on the Alif makes it Hamzatul-Qat’. It is always pronounced."}
                  {showEnglishMeaning && ` Meaning: ${sItem.meaning}.`}
                </p>
                <button type="button" onClick={nextSort} className={BTN_PRIMARY}>
                  {sIdx + 1 === SORT_ITEMS.length ? "See my score" : "Next word"}
                </button>
              </div>
            )}
          </section>
        ) : (
          <ResultCard
            score={sScore}
            total={SORT_ITEMS.length}
            perfect="Perfect! You can always tell Wasl from Qat’."
            good="Good start! Look for the Hamza sign on the Alif and try again."
            onRestart={restartSort}
          />
        )}
      </div>

      {/* ------------------------- 4. Quiz ------------------------- */}
      <div
        role="tabpanel"
        id="wasl-panel-quiz"
        aria-labelledby="wasl-tab-quiz"
        hidden={activeTab !== "quiz"}
        tabIndex={0}
        className={`space-y-6 rounded-2xl ${FOCUS}`}
      >
        <QuizEngine title="Hamzatul-Wasl Mastery Quiz" questions={QUIZ_QUESTIONS} />
      </div>

      <TeacherCorner
        sections={[
          {
            heading: "Lesson goals",
            items: [
              "Tell Hamzatul-Wasl (bare Alif) from Hamzatul-Qat’ (Alif with a Hamza sign).",
              "Drop the Wasl Alif when a word comes before it.",
              "Start words with the right vowel: Kasra, Damma, or Fatha for ٱلْ.",
              "Use the 3rd-letter rule for command verbs. Nouns start with a Kasra.",
            ],
          },
          {
            heading: "A 25-minute plan",
            items: [
              "3 min: read ٱهْدِنَا and ٱلْحَمْدُ from Al-Fatihah and ask what the first letter does.",
              "5 min: press Present and walk through the slides.",
              "7 min: Bridge Simulator. Toggle start and connect on three words.",
              "6 min: Starting Vowel Decoder, the student answers aloud.",
              "4 min: Wasl or Qat’? as an exit check.",
            ],
          },
          {
            heading: "Mistakes to listen for",
            items: [
              "Pronouncing the Wasl Alif when connecting, like wa-ihdinaa instead of wahdinaa.",
              "Starting a word with a Sukun and no vowel, like hdinaa.",
              "Using a Damma start for every verb. Only an essential Damma on the 3rd letter earns it.",
              "Starting ٱسْمُ with a Damma because of the ending on the Meem.",
            ],
          },
          {
            heading: "Quick activities",
            items: [
              "Cover the first letter with a finger and read the connected phrase.",
              "Hold up cards for Kasra, Damma or Fatha to show the starting vowel.",
              "Find Wasl and Qat’ words in Al-Fatihah: ٱهْدِنَا and ٱلْحَمْدُ against أَنْعَمْتَ and إِيَّاكَ.",
              "Ask the student to invent a short phrase with وَ + a Wasl word.",
            ],
          },
        ]}
      />
    </div>
  );
}