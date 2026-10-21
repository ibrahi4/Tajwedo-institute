"use client";

import React, { useRef, useState } from "react";
import { BookOpen, Award, HelpCircle, Eye, EyeOff } from "lucide-react";
import { useLesson } from "../shared/LessonContext";
import AudioButton from "../shared/AudioButton";
import QuizEngine, { QuizQuestion } from "../shared/QuizEngine";

/* -------------------------------------------------------------------------- */
/*  Settings                                                                  */
/* -------------------------------------------------------------------------- */

// false = students first try to spot the rules, then press "Show tajweed notes" to check.
// true  = notes and colour highlights are visible straight away.
const REVEAL_BY_DEFAULT = false;

const FOCUS =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600 dark:focus-visible:outline-teal-300";
const CARD = "border border-stone-200 bg-white dark:border-white/10 dark:bg-[#111827]";
const MUTED = "text-slate-600 dark:text-slate-300";

/* -------------------------------------------------------------------------- */
/*  Tajweed highlight model                                                   */
/* -------------------------------------------------------------------------- */

type MarkKind = "qalqalah" | "heavyLam" | "sunLam" | "idgham" | "izhar";

// Marks point at a base letter: nth = 1 for the first occurrence, -1 for the last.
type Mark = { letter: string; nth: number; kind: MarkKind };

type Ayah = {
  arabic: string;
  translit: string;
  marks: Mark[];
  notes: { kind: MarkKind; text: string }[];
};

type Surah = {
  id: string;
  nameEn: string;
  nameAr: string;
  meaning: string;
  ayahs: Ayah[];
};

const KINDS: Record<MarkKind, { label: string; sample: string; mark: string; chip: string }> = {
  qalqalah: {
    label: "Qalqalah (bounce)",
    sample: "د",
    mark: "bg-rose-100 text-rose-700 dark:bg-rose-400/20 dark:text-rose-300",
    chip: "border-rose-200 bg-rose-50 text-rose-800 dark:border-rose-400/30 dark:bg-rose-400/10 dark:text-rose-200",
  },
  heavyLam: {
    label: "Heavy Lam",
    sample: "ل",
    mark: "bg-sky-100 text-sky-700 dark:bg-sky-400/20 dark:text-sky-300",
    chip: "border-sky-200 bg-sky-50 text-sky-800 dark:border-sky-400/30 dark:bg-sky-400/10 dark:text-sky-200",
  },
  sunLam: {
    label: "Sun Lam",
    sample: "ل",
    mark: "bg-amber-100 text-amber-800 dark:bg-amber-400/20 dark:text-amber-200",
    chip: "border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-400/30 dark:bg-amber-400/10 dark:text-amber-200",
  },
  idgham: {
    label: "Idgham (merge)",
    sample: "ن",
    mark: "bg-violet-100 text-violet-700 dark:bg-violet-400/20 dark:text-violet-300",
    chip: "border-violet-200 bg-violet-50 text-violet-800 dark:border-violet-400/30 dark:bg-violet-400/10 dark:text-violet-200",
  },
  izhar: {
    label: "Izhar Shafawi (clear Meem)",
    sample: "م",
    mark: "bg-teal-100 text-teal-800 dark:bg-teal-400/20 dark:text-teal-200",
    chip: "border-teal-200 bg-teal-50 text-teal-900 dark:border-teal-400/30 dark:bg-teal-400/10 dark:text-teal-200",
  },
};

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

function resolveMarks(clusters: string[], marks: Mark[]): Map<number, MarkKind> {
  const found = new Map<number, MarkKind>();
  for (const m of marks) {
    const idxs: number[] = [];
    clusters.forEach((c, i) => {
      if (c[0] === m.letter) idxs.push(i);
    });
    const pick = m.nth > 0 ? idxs[m.nth - 1] : idxs[idxs.length + m.nth];
    if (pick !== undefined) found.set(pick, m.kind);
  }
  return found;
}

// Colour only changes between spans (no padding), so Arabic letters keep joining.
function QuranText({ text, marks, active }: { text: string; marks: Mark[]; active: boolean }) {
  if (!active || marks.length === 0) return <>{text}</>;

  const clusters = toClusters(text);
  const marked = resolveMarks(clusters, marks);
  const parts: React.ReactNode[] = [];
  let buffer = "";

  clusters.forEach((c, i) => {
    const kind = marked.get(i);
    if (kind) {
      if (buffer) {
        parts.push(buffer);
        buffer = "";
      }
      parts.push(
        <span key={i} title={KINDS[kind].label} className={`rounded-sm ${KINDS[kind].mark}`}>
          {c}
        </span>
      );
    } else {
      buffer += c;
    }
  });
  if (buffer) parts.push(buffer);

  return <>{parts}</>;
}

const AR_DIGITS = "٠١٢٣٤٥٦٧٨٩";
const toArabicDigits = (n: number) => String(n).replace(/\d/g, (d) => AR_DIGITS[Number(d)]);

/* -------------------------------------------------------------------------- */
/*  Content                                                                   */
/* -------------------------------------------------------------------------- */

// NOTE: please have a qualified tajweed teacher review the annotations before publishing.
const CAPSTONE_SURAHS: Surah[] = [
  {
    id: "ikhlas",
    nameEn: "Surah Al-Ikhlas",
    nameAr: "سُورَةُ الإِخْلَاص",
    meaning: "Sincerity",
    ayahs: [
      {
        arabic: "قُلْ هُوَ ٱللَّهُ أَحَدٌ",
        translit: "Qul huwal-laahu ahad",
        marks: [
          { letter: "ل", nth: 3, kind: "heavyLam" },
          { letter: "د", nth: -1, kind: "qalqalah" },
        ],
        notes: [
          { kind: "heavyLam", text: "Heavy Lam in “Allah”" },
          { kind: "qalqalah", text: "Qalqalah on the Dal when you stop" },
        ],
      },
      {
        arabic: "ٱللَّهُ ٱلصَّمَدُ",
        translit: "Allaahus-samad",
        marks: [
          { letter: "ل", nth: 2, kind: "heavyLam" },
          { letter: "ل", nth: 3, kind: "sunLam" },
          { letter: "د", nth: -1, kind: "qalqalah" },
        ],
        notes: [
          { kind: "heavyLam", text: "Heavy Lam in “Allah”" },
          { kind: "sunLam", text: "Sun Lam: the Lam is silent and the Sad is doubled" },
          { kind: "qalqalah", text: "Qalqalah on the Dal when you stop" },
        ],
      },
      {
        arabic: "لَمْ يَلِدْ وَلَمْ يُولَدْ",
        translit: "Lam yalid wa lam yoolad",
        marks: [
          { letter: "م", nth: 1, kind: "izhar" },
          { letter: "د", nth: 1, kind: "qalqalah" },
          { letter: "م", nth: 2, kind: "izhar" },
          { letter: "د", nth: -1, kind: "qalqalah" },
        ],
        notes: [
          { kind: "izhar", text: "Izhar Shafawi: read the Meem clearly before Ya (twice)" },
          { kind: "qalqalah", text: "Qalqalah on both Dals" },
        ],
      },
      {
        arabic: "وَلَمْ يَكُن لَّهُۥ كُفُوًا أَحَدٌۢ",
        translit: "Wa lam yakul-lahoo kufuwan ahad",
        marks: [
          { letter: "م", nth: 1, kind: "izhar" },
          { letter: "ن", nth: 1, kind: "idgham" },
          { letter: "د", nth: -1, kind: "qalqalah" },
        ],
        notes: [
          { kind: "izhar", text: "Izhar Shafawi: read the Meem clearly before Ya" },
          { kind: "idgham", text: "Idgham without Ghunnah: the Noon merges into the Lam" },
          { kind: "qalqalah", text: "Qalqalah on the Dal when you stop" },
        ],
      },
    ],
  },
];

type WaqfSign = {
  symbol: string;
  nameEn: string;
  nameAr: string;
  action: string;
  short: string;
  rule: string;
  tip: string;
  node: string;
  chip: string;
};

// Ordered from "must stop" to "do not stop", like a traffic light.
const WAQF_SIGNS: WaqfSign[] = [
  {
    symbol: "مـ",
    nameEn: "Waqf Lazim",
    nameAr: "وَقْفٌ لَازِمٌ",
    action: "Must stop",
    short: "Must stop",
    rule: "Compulsory stop. Continuing could change the meaning.",
    tip: "Red light: always stop.",
    node: "bg-rose-600 text-white",
    chip: "bg-rose-100 text-rose-800 dark:bg-rose-400/15 dark:text-rose-200",
  },
  {
    symbol: "قلى",
    nameEn: "Al-Waqf Awla",
    nameAr: "الوَقْفُ أَوْلَى",
    action: "Better to stop",
    short: "Prefer stop",
    rule: "Stopping is preferred, though continuing is allowed.",
    tip: "Slow down: a stop is the best choice.",
    node: "bg-orange-600 text-white",
    chip: "bg-orange-100 text-orange-900 dark:bg-orange-400/15 dark:text-orange-200",
  },
  {
    symbol: "ج",
    nameEn: "Waqf Ja’iz",
    nameAr: "وَقْفٌ جَائِزٌ",
    action: "Your choice",
    short: "Either",
    rule: "Stopping and continuing are equally fine.",
    tip: "Amber light: you decide.",
    node: "bg-amber-400 text-slate-950",
    chip: "bg-amber-100 text-amber-900 dark:bg-amber-400/15 dark:text-amber-200",
  },
  {
    symbol: "صلى",
    nameEn: "Al-Wasl Awla",
    nameAr: "الوَصْلُ أَوْلَى",
    action: "Better to continue",
    short: "Prefer go",
    rule: "Continuing is preferred, though stopping is allowed.",
    tip: "Keep the flow going if you can.",
    node: "bg-lime-400 text-slate-950",
    chip: "bg-lime-100 text-lime-900 dark:bg-lime-400/15 dark:text-lime-200",
  },
  {
    symbol: "لا",
    nameEn: "Laa Waqf",
    nameAr: "لَا وَقْفَ",
    action: "Do not stop",
    short: "Don’t stop",
    rule: "Do not stop here. Keep reading to the next word.",
    tip: "Green light: keep going.",
    node: "bg-emerald-600 text-white",
    chip: "bg-emerald-100 text-emerald-900 dark:bg-emerald-400/15 dark:text-emerald-200",
  },
];

const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: "m1",
    type: "multiple_choice",
    questionEn: "When you stop at the end of (قُلْ هُوَ ٱللَّهُ أَحَدٌ), what happens to the final Dal (دٌ)?",
    options: [
      { id: "a", text: "The Tanween drops and Dal becomes Sakinah with a clear Qalqalah bounce", isCorrect: true },
      { id: "b", text: "Pronounce full Tanween", isCorrect: false },
      { id: "c", text: "Turn Dal into Haa", isCorrect: false },
      { id: "d", text: "Stretch Dal for 4 beats", isCorrect: false },
    ],
    explanation: "When stopping on Tanween, the vowel drops to Sukun, triggering Qalqalah.",
  },
  {
    id: "m2",
    type: "multiple-choice",
    questionEn: "What does the waqf sign (مـ) tell you to do?",
    options: [
      { id: "a", text: "Continue reading, stopping is allowed", isCorrect: false },
      { id: "b", text: "Stop or continue, it is your choice", isCorrect: false },
      { id: "c", text: "Do not stop here", isCorrect: false },
      { id: "d", text: "Stop. It is a compulsory stop", isCorrect: true },
    ],
    explanation: "مـ is Waqf Lazim, the compulsory stop. Continuing could change the meaning of the ayah.",
  },
  {
    id: "m3",
    type: "multiple-choice",
    questionEn: "You see the sign (لا) above a word. What should you do?",
    options: [
      { id: "a", text: "Do not stop. Keep reading to the next word", isCorrect: true },
      { id: "b", text: "Stop and take a breath", isCorrect: false },
      { id: "c", text: "Stop, because it is the better choice", isCorrect: false },
      { id: "d", text: "Repeat the word twice", isCorrect: false },
    ],
    explanation: "لا means there is no stopping here. Keep reading and pause at the next suitable place.",
  },
  {
    id: "m4",
    type: "multiple-choice",
    questionEn: "In (ٱلصَّمَدُ), the Lam of “Al” meets the letter Sad. What happens to the Lam?",
    options: [
      { id: "a", text: "It is pronounced clearly", isCorrect: false },
      { id: "b", text: "It is not pronounced, and the Sad is doubled", isCorrect: true },
      { id: "c", text: "It bounces with Qalqalah", isCorrect: false },
      { id: "d", text: "It is stretched for 4 beats", isCorrect: false },
    ],
    explanation: "Sad is a Sun letter, so the Lam of “Al” is silent and the Sad carries a Shaddah (Lam Shamsiyyah).",
  },
  {
    id: "m5",
    type: "multiple-choice",
    questionEn: "In (لَمْ يَلِدْ), a Meem Sakinah is followed by Ya. What is the rule?",
    options: [
      { id: "a", text: "Idgham Shafawi", isCorrect: false },
      { id: "b", text: "Ikhfa Shafawi", isCorrect: false },
      { id: "c", text: "Izhar Shafawi: pronounce the Meem clearly", isCorrect: true },
      { id: "d", text: "Iqlab", isCorrect: false },
    ],
    explanation:
      "Meem Sakinah is read clearly (Izhar Shafawi) before every letter except Ba (Ikhfa) and Meem (Idgham).",
  },
  {
    id: "m6",
    type: "multiple-choice",
    questionEn: "Which letters give the Qalqalah bounce when they carry a Sukun?",
    options: [
      { id: "a", text: "ء ه ع ح غ خ", isCorrect: false },
      { id: "b", text: "م ن ل ر", isCorrect: false },
      { id: "c", text: "ق ط ب ج د", isCorrect: true },
      { id: "d", text: "ا و ي", isCorrect: false },
    ],
    explanation: "The five Qalqalah letters are gathered in the phrase قُطْبُ جَدٍّ (Qutb Jad).",
  },
  {
    id: "m7",
    type: "multiple-choice",
    questionEn: "In (يَكُن لَّهُ), a Noon Sakinah meets Lam. What do we do?",
    options: [
      { id: "a", text: "Idgham without Ghunnah: merge the Noon into the Lam", isCorrect: true },
      { id: "b", text: "Ikhfa: hide the Noon with a nasal hum", isCorrect: false },
      { id: "c", text: "Iqlab: turn the Noon into a Meem", isCorrect: false },
      { id: "d", text: "Izhar: pronounce the Noon clearly", isCorrect: false },
    ],
    explanation: "Noon Sakinah merges completely into Lam and Ra with no nasal sound (Idgham bila Ghunnah).",
  },
];

const TABS = [
  { id: "surahs", label: "1. Recitation Lab", icon: BookOpen },
  { id: "waqf", label: "2. Waqf Signs", icon: Award },
  { id: "quiz", label: "3. Quiz", icon: HelpCircle },
] as const;

type TabId = (typeof TABS)[number]["id"];

/* -------------------------------------------------------------------------- */
/*  Component                                                                 */
/* -------------------------------------------------------------------------- */

export default function ReadingPracticeLesson() {
  const lessonCtx = useLesson();
  const showTransliteration = lessonCtx?.showTransliteration ?? true;
  const isTeacherMode = lessonCtx?.isTeacherMode ?? false;
  const fontSizeMultiplier = lessonCtx?.fontSizeMultiplier ?? 1.1;

  const [activeTab, setActiveTab] = useState<TabId>("surahs");
  const [selectedSurah, setSelectedSurah] = useState<string>("ikhlas");
  const [revealed, setRevealed] = useState<string[]>([]);
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  const currentSurah = CAPSTONE_SURAHS.find((s) => s.id === selectedSurah) || CAPSTONE_SURAHS[0];

  const notesEnabled = !isTeacherMode;
  const keyFor = (i: number) => `${currentSurah.id}-${i}`;
  const isRevealed = (i: number) => notesEnabled && (REVEAL_BY_DEFAULT || revealed.includes(keyFor(i)));
  const allRevealed = currentSurah.ayahs.every((_, i) => isRevealed(i));
  const anyRevealed = currentSurah.ayahs.some((_, i) => isRevealed(i));

  const toggleOne = (i: number) =>
    setRevealed((prev) => (prev.includes(keyFor(i)) ? prev.filter((k) => k !== keyFor(i)) : [...prev, keyFor(i)]));

  const toggleAll = () => {
    const keys = currentSurah.ayahs.map((_, i) => keyFor(i));
    setRevealed((prev) =>
      allRevealed ? prev.filter((k) => !keys.includes(k)) : Array.from(new Set([...prev, ...keys]))
    );
  };

  const m = fontSizeMultiplier;
  const ayahFontSize = `clamp(${(1.7 * m).toFixed(2)}rem, ${(4.2 * m).toFixed(2)}vw + 0.5rem, ${(2.4 * m).toFixed(2)}rem)`;

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

  const usedKinds = Array.from(new Set(currentSurah.ayahs.flatMap((a) => a.marks.map((mk) => mk.kind))));

  return (
    <div className="space-y-8 animate-in fade-in duration-500 motion-reduce:animate-none">
      {/* ------------------------------ Tabs ------------------------------ */}
      <div
        role="tablist"
        aria-label="Reading practice sections"
        className="flex w-full gap-1.5 rounded-2xl border border-stone-200 bg-stone-100/80 p-1.5 dark:border-white/10 dark:bg-white/5 sm:w-fit"
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
              id={`reading-tab-${tab.id}`}
              type="button"
              role="tab"
              aria-selected={active}
              aria-controls={`reading-panel-${tab.id}`}
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

      {/* ------------------------- 1. Recitation lab ------------------------- */}
      <div
        role="tabpanel"
        id="reading-panel-surahs"
        aria-labelledby="reading-tab-surahs"
        hidden={activeTab !== "surahs"}
        tabIndex={0}
        className={`space-y-6 ${FOCUS} rounded-2xl`}
      >
        <p className={`text-base ${MUTED}`}>
          {notesEnabled
            ? "Read each ayah aloud first. Then show the tajweed notes to check the rules you spotted."
            : "Teacher view: highlights and notes are hidden so the student reads and spots the rules alone."}
        </p>

        {CAPSTONE_SURAHS.length > 1 && (
          <div className="flex flex-wrap gap-2" role="group" aria-label="Choose a surah">
            {CAPSTONE_SURAHS.map((s) => (
              <button
                key={s.id}
                type="button"
                aria-pressed={s.id === currentSurah.id}
                onClick={() => setSelectedSurah(s.id)}
                className={`min-h-11 rounded-full border px-4 text-sm font-bold ${FOCUS} ${
                  s.id === currentSurah.id
                    ? "border-[#0D4F4F] bg-[#0D4F4F] text-white dark:border-teal-400 dark:bg-teal-400 dark:text-slate-950"
                    : "border-stone-300 text-slate-700 hover:bg-stone-100 dark:border-white/20 dark:text-slate-200 dark:hover:bg-white/10"
                }`}
              >
                {s.nameEn}
              </button>
            ))}
          </div>
        )}

        {/* Surah header */}
        <div className={`flex flex-wrap items-center justify-between gap-4 rounded-3xl p-5 sm:p-6 ${CARD}`}>
          <div>
            <h2 className="text-lg font-extrabold text-[#0D4F4F] dark:text-white">{currentSurah.nameEn}</h2>
            <p className={`mt-0.5 text-sm ${MUTED}`}>
              {currentSurah.meaning} · {currentSurah.ayahs.length} ayahs
            </p>
          </div>
          <p lang="ar" dir="rtl" className="arabic-font text-3xl font-bold text-emerald-800 dark:text-emerald-300">
            {currentSurah.nameAr}
          </p>
          {notesEnabled && (
            <button
              type="button"
              onClick={toggleAll}
              className={`inline-flex min-h-11 items-center gap-2 rounded-full border border-[#0D4F4F]/30 px-4 text-sm font-bold text-[#0D4F4F] hover:bg-[#0D4F4F]/5 dark:border-white/20 dark:text-teal-200 dark:hover:bg-white/5 ${FOCUS}`}
            >
              {allRevealed ? <EyeOff aria-hidden="true" className="h-4 w-4" /> : <Eye aria-hidden="true" className="h-4 w-4" />}
              {allRevealed ? "Hide all notes" : "Show all notes"}
            </button>
          )}
        </div>

        {/* Colour legend (appears once any note is shown) */}
        {notesEnabled && anyRevealed && (
          <ul aria-label="Highlight colours" className="flex flex-wrap gap-x-5 gap-y-2">
            {usedKinds.map((k) => (
              <li key={k} className={`inline-flex items-center gap-2 text-sm font-semibold ${MUTED}`}>
                <span
                  aria-hidden="true"
                  lang="ar"
                  className={`arabic-font inline-flex h-7 w-7 items-center justify-center rounded-md text-base font-bold ${KINDS[k].mark}`}
                >
                  {KINDS[k].sample}
                </span>
                {KINDS[k].label}
              </li>
            ))}
          </ul>
        )}

        {/* Ayahs */}
        <ol className="space-y-4">
          {currentSurah.ayahs.map((ayah, idx) => {
            const open = isRevealed(idx);
            const n = idx + 1;
            return (
              <li key={`${currentSurah.id}-${idx}`}>
                <article className={`rounded-3xl p-6 shadow-sm sm:p-8 ${CARD}`}>
                  <div className="flex items-center justify-between gap-3">
                    <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-extrabold text-emerald-800 dark:bg-emerald-400/15 dark:text-emerald-300">
                      Ayah {n}
                    </span>
                    <AudioButton text={ayah.arabic} />
                  </div>

                  <p
                    lang="ar"
                    dir="rtl"
                    className="arabic-font py-8 text-center font-bold leading-[2.1] text-slate-900 dark:text-emerald-50"
                    style={{ fontSize: ayahFontSize }}
                  >
                    <QuranText text={ayah.arabic} marks={ayah.marks} active={open} />{" "}
                    <span
                      aria-hidden="true"
                      className="mx-1 inline-flex h-10 w-10 items-center justify-center rounded-full border-2 border-[#C8A96E] align-middle text-base font-bold text-[#8F6B1E] dark:text-[#E8C56A]"
                    >
                      {toArabicDigits(n)}
                    </span>
                  </p>

                  {notesEnabled && (
                    <div className="border-t border-stone-200 pt-4 dark:border-white/10">
                      <button
                        type="button"
                        onClick={() => toggleOne(idx)}
                        aria-expanded={open}
                        className={`inline-flex min-h-11 items-center gap-2 rounded-full px-3 text-sm font-bold text-[#0D6B66] hover:bg-teal-50 dark:text-teal-300 dark:hover:bg-white/5 ${FOCUS}`}
                      >
                        {open ? <EyeOff aria-hidden="true" className="h-4 w-4" /> : <Eye aria-hidden="true" className="h-4 w-4" />}
                        {open ? "Hide tajweed notes" : "Show tajweed notes"}
                      </button>

                      {open && (
                        <div className="mt-3 space-y-3 animate-in fade-in slide-in-from-top-1 duration-300 motion-reduce:animate-none">
                          {showTransliteration && (
                            <p lang="en" className="text-sm">
                              <span className={`font-semibold ${MUTED}`}>Say it: </span>
                              <span className="font-extrabold italic text-teal-700 dark:text-teal-300">{ayah.translit}</span>
                            </p>
                          )}
                          <ul className="flex flex-wrap gap-2">
                            {ayah.notes.map((note) => (
                              <li
                                key={note.text}
                                className={`rounded-full border px-3 py-1 text-xs font-bold sm:text-sm ${KINDS[note.kind].chip}`}
                              >
                                {note.text}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                </article>
              </li>
            );
          })}
        </ol>
      </div>

      {/* --------------------------- 2. Waqf signs --------------------------- */}
      <div
        role="tabpanel"
        id="reading-panel-waqf"
        aria-labelledby="reading-tab-waqf"
        hidden={activeTab !== "waqf"}
        tabIndex={0}
        className={`space-y-8 ${FOCUS} rounded-2xl`}
      >
        <p className={`text-base ${MUTED}`}>
          Waqf signs tell you when to pause. Learn the five signs on one scale, from “must stop” to “do not stop”.
        </p>

        {/* Stop → go scale */}
        <div aria-hidden="true" className="relative mx-auto max-w-2xl pt-2">
          <div className="absolute inset-x-8 top-[2.1rem] h-1.5 rounded-full bg-gradient-to-r from-rose-500 via-amber-400 to-emerald-500" />
          <ol className="relative flex justify-between">
            {WAQF_SIGNS.map((s) => (
              <li key={s.symbol} className="flex w-[4.2rem] flex-col items-center gap-2 text-center">
                <span
                  lang="ar"
                  dir="rtl"
                  className={`arabic-font flex h-14 w-14 items-center justify-center rounded-full text-2xl font-bold shadow-md ${s.node}`}
                >
                  {s.symbol}
                </span>
                <span className={`text-xs font-bold leading-tight ${MUTED}`}>{s.short}</span>
              </li>
            ))}
          </ol>
        </div>

        <ul className="space-y-4">
          {WAQF_SIGNS.map((s) => (
            <li key={s.symbol} className={`flex items-start gap-4 rounded-3xl p-5 sm:items-center sm:gap-6 sm:p-6 ${CARD}`}>
              <span
                lang="ar"
                dir="rtl"
                className={`arabic-font flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl text-3xl font-bold ${s.node}`}
              >
                {s.symbol}
              </span>
              <div className="min-w-0 flex-1">
                <span className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${s.chip}`}>{s.action}</span>
                <div className="mt-2 flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <h3 className="text-base font-extrabold text-[#0D4F4F] dark:text-white">{s.nameEn}</h3>
                  <span lang="ar" dir="rtl" className="arabic-font text-lg text-slate-500 dark:text-slate-400">
                    {s.nameAr}
                  </span>
                </div>
                <p className={`mt-1 text-sm leading-relaxed ${MUTED}`}>{s.rule}</p>
                <p className="mt-1 text-sm font-semibold text-[#0D6B66] dark:text-teal-300">{s.tip}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* ------------------------------ 3. Quiz ------------------------------ */}
      <div
        role="tabpanel"
        id="reading-panel-quiz"
        aria-labelledby="reading-tab-quiz"
        hidden={activeTab !== "quiz"}
        tabIndex={0}
        className={`space-y-6 ${FOCUS} rounded-2xl`}
      >
        <p className={`text-base ${MUTED}`}>
          Test yourself with {QUIZ_QUESTIONS.length} questions on the rules you just practised.
        </p>
        <QuizEngine questions={QUIZ_QUESTIONS} />
      </div>
    </div>
  );
}