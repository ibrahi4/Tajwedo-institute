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
  Trophy,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Presentation,
  Search,
  SlidersHorizontal,
  Layers,
  Zap,
  Merge
} from "lucide-react";
import { useLesson } from "../shared/LessonContext";

type MainTab = "learn" | "chart" | "reading" | "games";

const playSound = (text: string, rate = 0.72) => {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  try {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "ar-SA";
    utterance.rate = rate;
    const voices = window.speechSynthesis.getVoices();
    const arVoice = voices.find((v) => v.lang.includes("ar-SA") || v.lang.includes("ar"));
    if (arVoice) utterance.voice = arVoice;
    window.speechSynthesis.speak(utterance);
  } catch {}
};

const SHADDAH_CONCEPTS = [
  {
    id: "twin_merger",
    badge: "Rule 1 • Twin Letter Merger",
    titleEn: "What is Shaddah (ـّ)?",
    titleAr: "الحَرْفُ المُشَدَّد",
    sampleAr: "رَبَّ",
    formula: "bْ (Silent) + bَ (Moving) = بَّ",
    description:
      "Shaddah looks like the tiny head of letter Seen (س). It tells us that TWO identical letters merged into one: the first has Sukun (silent), and the second has a vowel!",
    imageUrl: "/Tajwedo-Public-Assets/curriculum-Imag/offer-pair.webp",
    imageAlt: "Two bridges merging representing Shaddah twin letters",
    topBarClass: "bg-gradient-to-r from-[#7C3AED] to-[#EC4899]",
    badgeClass: "bg-[#7C3AED] text-white",
    accentText: "text-[#7C3AED] dark:text-[#A78BFA]",
    examples: [
      { ar: "رَبَّ", tr: "rab-ba" },
      { ar: "رَبُّ", tr: "rab-bu" },
      { ar: "رَبِّ", tr: "rab-bi" },
      { ar: "حَقُّ", tr: "haq-qu" },
    ],
  },
  {
    id: "kasra_under_shaddah",
    badge: "Rule 2 • Shaddah + Kasra Secret",
    titleEn: "Where Does Kasra Sit?",
    titleAr: "شَدَّةٌ مَعَ الكَسْرَة",
    sampleAr: "رَبِّ",
    formula: "Under the Shaddah (ـِّ) = Always Kasra!",
    description:
      "In the Quran, when a letter has Shaddah + Kasra, the stroke often sits right UNDER the Shaddah mark (still above the letter!) instead of at the bottom. If it is ABOVE the Shaddah, it is Fatha!",
    imageUrl: "/Tajwedo-Public-Assets/curriculum-Imag/Quran Recitation.webp",
    imageAlt: "Quranic script showing Shaddah with Kasra",
    topBarClass: "bg-gradient-to-r from-[#0284C7] to-[#38BDF8]",
    badgeClass: "bg-[#0284C7] text-white",
    accentText: "text-[#0284C7] dark:text-[#38BDF8]",
    examples: [
      { ar: "عَلِّمْ", tr: "‘al-lim" },
      { ar: "سَبِّحْ", tr: "sab-bih" },
      { ar: "رَبِّي", tr: "rab-bii" },
      { ar: "أُمِّي", tr: "um-mii" },
    ],
  },
  {
    id: "ghunnah_rule",
    badge: "Rule 3 • 2-Beat Nasal Hum",
    titleEn: "Noon & Meem Mushaddad",
    titleAr: "غُنَّةُ النُّونِ وَالمِيم",
    sampleAr: "إِنَّ • ثُمَّ",
    formula: "نّ / مّ = Hold Nasal Ghunnah for 2 Beats!",
    description:
      "Whenever Shaddah lands on letter Noon (نّ) or Meem (مّ), you MUST hold a sweet nasal hum (Ghunnah) in your nose for 2 full beats before releasing the vowel!",
    imageUrl: "/Tajwedo-Public-Assets/curriculum-Imag/offer-solo.webp",
    imageAlt: "Ripe pomegranate representing Rummaan (with Meem Shaddah Ghunnah)",
    topBarClass: "bg-gradient-to-r from-[#00A86B] to-[#10B981]",
    badgeClass: "bg-[#00A86B] text-white",
    accentText: "text-[#00A86B] dark:text-[#34D399]",
    examples: [
      { ar: "إِنَّ", tr: "in-na (2 beats)" },
      { ar: "ثُمَّ", tr: "thum-ma (2 beats)" },
      { ar: "عَمَّ", tr: "‘am-ma (2 beats)" },
      { ar: "جَنَّةٌ", tr: "jan-natun" },
    ],
  },
];

const SHADDAH_READING_WORDS = [
  {
    id: "tuffaah",
    arabic: "تُفَّاحٌ",
    translit: "tuf - faa - hun",
    meaning: "Apples (Shaddah on Fa: فْ + فَ)",
    imageUrl: "/Tajwedo-Public-Assets/curriculum-Imag/Quran Recitation.webp",
    sceneCaption: "Fresh red apples on a branch (تُفَّاحٌ)",
    twinEquation: "تُفْ + فَاحٌ = تُفَّاحٌ",
  },
  {
    id: "rummaan",
    arabic: "رُمَّانٌ",
    translit: "rum - maa - nun",
    meaning: "Pomegranate (Meem Shaddah with 2-Beat Ghunnah!)",
    imageUrl: "/Tajwedo-Public-Assets/curriculum-Imag/offer-solo.webp",
    sceneCaption: "Ruby-red pomegranate fruit mentioned in Surah Ar-Rahman (رُمَّانٌ)",
    twinEquation: "رُمْ + مَانٌ = رُمَّانٌ",
  },
  {
    id: "sajjaadah",
    arabic: "سَجَّادَةٌ",
    translit: "saj - jaa - da - tun",
    meaning: "Prayer Mat (Shaddah on Jeem: جْ + جَ)",
    imageUrl: "/Tajwedo-Public-Assets/curriculum-Imag/Tajweed.webp",
    sceneCaption: "Islamic prayer rug in a peaceful room (سَجَّادَةٌ)",
    twinEquation: "سَجْ + جَادَةٌ = سَجَّادَةٌ",
  },
  {
    id: "najjaar",
    arabic: "نَجَّارٌ",
    translit: "naj - jaa - run",
    meaning: "Carpenter (Shaddah on Jeem)",
    imageUrl: "/Tajwedo-Public-Assets/curriculum-Imag/Quran Recitation.webp",
    sceneCaption: "Woodworking tools in a carpenter workshop (نَجَّارٌ)",
    twinEquation: "نَجْ + جَارٌ = نَجَّارٌ",
  },
];

export default function ShaddahLesson() {
  const lessonCtx = useLesson();
  const darkMode = lessonCtx?.darkMode ?? false;

  const [englishHints, setEnglishHints] = useState<boolean>(true);
  const [textSizeScale, setTextSizeScale] = useState<number>(1.1);
  const [stars, setStars] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<MainTab>("learn");
  const [readingIdx, setReadingIdx] = useState<number>(0);

  const currentWord = SHADDAH_READING_WORDS[readingIdx];

  return (
    <div className={`min-h-screen w-full transition-colors duration-300 font-sans ${darkMode ? "bg-[#0B0F19] text-slate-100" : "bg-[#F8FAFC] text-slate-900"}`}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "LearningResource",
            name: "Noor Al-Bayan Lesson 5: Arabic Shaddah & Ghunnah",
            description: "Interactive lesson teaching Arabic Shaddah (doubled letters) and 2-beat Noon/Meem Ghunnah.",
            educationalLevel: "Beginner",
            inLanguage: ["en", "ar"],
            provider: { "@type": "EducationalOrganization", name: "Tajwedo Institute" },
          }),
        }}
      />

      {/* UNIFIED STUDIO DOCK */}
      <header className={`sticky top-20 z-30 w-full border-b backdrop-blur-xl transition-all ${darkMode ? "bg-[#0B0F19]/90 border-slate-800/80 shadow-lg" : "bg-white/90 border-slate-200/80 shadow-xs"}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              href="/en/curriculum/noor-al-bayan"
              className={`p-2.5 rounded-xl border transition flex items-center gap-1.5 text-xs font-bold ${darkMode ? "bg-slate-900 border-slate-800 text-slate-300" : "bg-slate-100 border-slate-200 text-slate-700"}`}
            >
              <Home className="w-4 h-4 text-[#0D9488]" />
              <span className="hidden sm:inline">Course</span>
            </Link>

            <button
              type="button"
              onClick={() => playSound("رَبَّ", 0.72)}
              className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#7C3AED] to-[#EC4899] text-white flex items-center justify-center shadow-md"
            >
              <span dir="rtl" className="text-2xl font-serif font-bold">بَّ</span>
            </button>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-extrabold tracking-tight leading-none">
                  Shaddah & Ghunnah (الشَّدَّة)
                </h1>
                <span className="hidden md:inline-block px-2 py-0.5 rounded-md text-[11px] font-extrabold uppercase bg-violet-500/15 text-[#7C3AED]">
                  Lesson 5
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Twin Letter Merger (ـّ) & 2-Beat Nasal Hum (نّ / مّ)
              </p>
            </div>
          </div>

          <nav className={`flex items-center p-1.5 rounded-2xl border overflow-x-auto no-scrollbar ${darkMode ? "bg-slate-900/90 border-slate-800" : "bg-slate-100/90 border-slate-200/70"}`}>
            {[
              { id: "learn", label: "Learn & Twins", icon: BookOpen },
              { id: "reading", label: "Visual Reading", icon: Layers },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id as MainTab)}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold inline-flex items-center gap-2 transition-all shrink-0 ${
                    isActive
                      ? "bg-gradient-to-r from-[#7C3AED] to-[#EC4899] text-white shadow-md"
                      : darkMode ? "text-slate-400 hover:text-white" : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => setEnglishHints((prev) => !prev)}
              className="px-3.5 py-2 rounded-xl border text-xs font-bold inline-flex items-center gap-1.5 bg-[#7C3AED]/15 border-[#7C3AED]/40 text-[#7C3AED]"
            >
              {englishHints ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
              <span>Hints: {englishHints ? "ON" : "OFF"}</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-8 py-10 space-y-14">
        {activeTab === "learn" && (
          <section className="space-y-8">
            <div>
              <span className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-widest text-[#7C3AED]">
                <Merge className="w-3.5 h-3.5" /> Lesson 5 • Twin Consonant Power
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight mt-1">
                How Shaddah Combines Two Letters Into One
              </h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-7">
              {SHADDAH_CONCEPTS.map((card) => (
                <article
                  key={card.id}
                  onClick={() => playSound(card.sampleAr, 0.72)}
                  className={`rounded-3xl border overflow-hidden cursor-pointer flex flex-col justify-between group hover:-translate-y-1.5 transition-all ${
                    darkMode ? "bg-[#111827] border-slate-800 shadow-xl" : "bg-white border-slate-200 shadow-lg"
                  }`}
                >
                  <div className={`h-2.5 w-full ${card.topBarClass}`} />
                  <div className="relative h-40 w-full overflow-hidden">
                    <img src={card.imageUrl} alt={card.imageAlt} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent" />
                    <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between">
                      <span className={`px-3.5 py-1 rounded-full text-xs font-extrabold ${card.badgeClass}`}>
                        {card.badge}
                      </span>
                      <Volume2 className="w-5 h-5 text-white" />
                    </div>
                  </div>

                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-xl font-extrabold">{card.titleEn}</h3>
                      <p className={`text-xs font-extrabold mt-1 ${card.accentText}`}>{card.formula}</p>
                      <div className="my-5 py-5 rounded-3xl border border-violet-500/20 bg-violet-500/5 text-center">
                        <span dir="rtl" className={`text-6xl font-serif font-bold ${card.accentText}`}>{card.sampleAr}</span>
                      </div>
                      <p className={`text-xs sm:text-sm leading-relaxed ${darkMode ? "text-slate-300" : "text-slate-600"}`}>
                        {card.description}
                      </p>
                    </div>

                    <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-800" onClick={(e) => e.stopPropagation()}>
                      <div dir="rtl" className="grid grid-cols-4 gap-2">
                        {card.examples.map((ex, i) => (
                          <button
                            key={i}
                            type="button"
                            onClick={() => playSound(ex.ar, 0.72)}
                            className={`py-2.5 rounded-2xl border text-center transition hover:scale-105 ${darkMode ? "bg-[#0B0F19] border-slate-800" : "bg-slate-50 border-slate-200"}`}
                          >
                            <span className={`block text-2xl font-serif font-bold ${card.accentText}`}>{ex.ar}</span>
                            {englishHints && <span dir="ltr" className="block text-[10px] font-bold text-slate-500">{ex.tr}</span>}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        {activeTab === "reading" && currentWord && (
          <section className="space-y-8">
            <div className={`rounded-3xl border overflow-hidden ${darkMode ? "bg-[#111827] border-slate-800 shadow-2xl" : "bg-white border-slate-200 shadow-xl"}`}>
              <div className="grid grid-cols-1 lg:grid-cols-12">
                <div className="lg:col-span-6 relative p-10 bg-slate-950 text-white flex flex-col justify-between min-h-[340px]">
                  <img src={currentWord.imageUrl} alt={currentWord.meaning} className="absolute inset-0 w-full h-full object-cover opacity-50" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent" />
                  <span className="relative z-10 px-3 py-1 rounded-full text-xs font-extrabold bg-white/15 w-fit">
                    Word {readingIdx + 1} of {SHADDAH_READING_WORDS.length}
                  </span>
                  <div className="relative z-10 my-8 text-center">
                    <button type="button" onClick={() => playSound(currentWord.arabic, 0.7)} className="text-7xl font-serif font-bold text-white">
                      {currentWord.arabic}
                    </button>
                    {englishHints && (
                      <div className="mt-3">
                        <div className="text-2xl font-extrabold text-violet-300">{currentWord.translit}</div>
                        <div className="text-base font-bold">&ldquo;{currentWord.meaning}&rdquo;</div>
                      </div>
                    )}
                  </div>
                  <div className="relative z-10 text-xs text-center text-slate-300">{currentWord.sceneCaption}</div>
                </div>

                <div className="lg:col-span-6 p-8 sm:p-10 flex flex-col justify-between space-y-6">
                  <div className="space-y-4">
                    <span className="text-xs font-extrabold uppercase text-slate-400">Twin Letter X-Ray Equation:</span>
                    <div dir="rtl" className="p-6 rounded-3xl border-2 border-[#7C3AED] bg-[#7C3AED]/10 text-center text-4xl font-serif font-bold text-[#7C3AED]">
                      {currentWord.twinEquation}
                    </div>
                  </div>
                  <div className="flex items-center justify-between gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                    <button type="button" onClick={() => setReadingIdx((p) => (p === 0 ? SHADDAH_READING_WORDS.length - 1 : p - 1))} className="px-5 py-3 rounded-2xl border font-extrabold text-sm">
                      Previous
                    </button>
                    <button type="button" onClick={() => playSound(currentWord.arabic, 0.7)} className="px-7 py-3 rounded-2xl bg-[#7C3AED] text-white font-extrabold text-sm">
                      Listen
                    </button>
                    <button type="button" onClick={() => setReadingIdx((p) => (p + 1 >= SHADDAH_READING_WORDS.length ? 0 : p + 1))} className="px-5 py-3 rounded-2xl border font-extrabold text-sm">
                      Next
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}