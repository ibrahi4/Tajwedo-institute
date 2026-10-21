"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  BookOpen,
  GraduationCap,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Volume2,
  Presentation,
  Gamepad2,
  Users,
  Clock,
  Star,
  Layers,
  Compass,
  Award,
  Play
} from "lucide-react";
import { NOOR_AL_BAYAN_COURSE } from "@/lib/curriculum/noor-al-bayan";

interface CurriculumHubProps {
  locale?: string;
}

export default function CurriculumHub({ locale = "en" }: CurriculumHubProps) {
  const [darkMode, setDarkMode] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const checkTheme = () => {
      const saved = localStorage.getItem("tajwedo-theme");
      const isDark = saved === "dark" || document.documentElement.classList.contains("dark");
      setDarkMode(isDark);
    };
    checkTheme();

    const handleThemeEvent = (e: Event) => {
      const custom = e as CustomEvent<{ dark: boolean }>;
      if (custom.detail && typeof custom.detail.dark === "boolean") {
        setDarkMode(custom.detail.dark);
      } else {
        checkTheme();
      }
    };

    window.addEventListener("tajwedo-theme-change", handleThemeEvent);
    return () => window.removeEventListener("tajwedo-theme-change", handleThemeEvent);
  }, []);

  const featuredLessons = NOOR_AL_BAYAN_COURSE.lessons.slice(0, 6);

  const LEARNING_TRACKS = [
    {
      id: "noor-al-bayan",
      step: "Track 01 • Foundational Reading",
      title: "Noor Al-Bayan: Learn to Read Quran",
      titleAr: "مَنْهَجُ نُورِ البَيَانِ التَّفَاعُلِيّ",
      description:
        "12 interactive visual lessons taking children from single Arabic letters and short vowels (Harakat) to reading full Quranic verses with confidence.",
      lessonsCount: "12 Interactive Lessons",
      age: "Ages 7–14",
      status: "available",
      href: `/${locale}/curriculum/noor-al-bayan`,
      firstLessonHref: `/${locale}/curriculum/noor-al-bayan/short-vowels-harakat`,
      image: "/Tajwedo-Public-Assets/curriculum-Imag/Quran Recitation.webp",
      accent: "from-[#0D9488] to-[#059669]",
      badge: "AVAILABLE NOW • 100% FREE",
    },
    {
      id: "tajweed-mastery",
      step: "Track 02 • Recitation Rules",
      title: "Interactive Tajweed Rules for Kids",
      titleAr: "أَحْكَامُ التَّجْوِيدِ المُصَوَّرَة",
      description:
        "Visual mouth articulation diagrams (Makharij), Noon & Meem Sakinah rules, Madd rules, and color-coded Juz Amma practice.",
      lessonsCount: "10 Visual Modules",
      age: "Ages 8–14",
      status: "coming_soon",
      href: `/${locale}/contact`,
      image: "/Tajwedo-Public-Assets/curriculum-Imag/Tajweed.webp",
      accent: "from-[#0284C7] to-[#38BDF8]",
      badge: "LIVE IN 1-ON-1 ZOOM CLASSES",
    },
    {
      id: "arabic-for-kids",
      step: "Track 03 • Language & Vocabulary",
      title: "Quranic & Modern Standard Arabic",
      titleAr: "اللُّغَةُ العَرَبِيَّةُ لِلأَطْفَال",
      description:
        "Build a rich vocabulary of 300+ essential Quranic and everyday Arabic words, sentence building, and conversational confidence.",
      lessonsCount: "15 Interactive Units",
      age: "Ages 7–14",
      status: "coming_soon",
      href: `/${locale}/contact`,
      image: "/Tajwedo-Public-Assets/curriculum-Imag/Arabic Language.webp",
      accent: "from-[#FF5A1F] to-[#F59E0B]",
      badge: "LIVE IN 1-ON-1 ZOOM CLASSES",
    },
    {
      id: "islamic-studies",
      step: "Track 04 • Faith & Character",
      title: "Islamic Studies, Duas & Seerah",
      titleAr: "الدِّرَاسَاتُ الإِسْلَامِيَّةُ وَالأَدْعِيَة",
      description:
        "Age-appropriate lessons covering the 5 Pillars of Islam, daily Sunnah Duas, Prophet stories, and noble Islamic manners (Akhlaq).",
      lessonsCount: "12 Illustrated Lessons",
      age: "Ages 7–14",
      status: "coming_soon",
      href: `/${locale}/contact`,
      image: "/Tajwedo-Public-Assets/curriculum-Imag/Islamic Studies.webp",
      accent: "from-[#7C3AED] to-[#A855F7]",
      badge: "LIVE IN 1-ON-1 ZOOM CLASSES",
    },
  ];

  return (
    <div
      className={`min-h-screen w-full transition-colors duration-300 font-sans pb-24 ${
        darkMode ? "bg-[#0B0F19] text-slate-100" : "bg-[#F8FAFC] text-slate-900"
      }`}
    >
      {/* ===================================================================
          1. ACADEMY HERO SECTION (WITH FULL pt-28 CLEARANCE BELOW NAVBAR)
         =================================================================== */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#072B28] via-[#0D5C56] to-[#0F766E] text-white pt-28 pb-20 px-4 sm:px-8 border-b border-teal-800">
        <div className="pointer-events-none absolute -top-20 left-1/3 w-96 h-96 rounded-full bg-amber-400/10 blur-3xl" />

        <div className="max-w-7xl mx-auto relative z-10 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-xs font-extrabold uppercase tracking-wider text-amber-300">
            <GraduationCap className="w-4 h-4" />
            <span>Tajwedo Interactive Learning Studio • Serving 500+ Students</span>
          </div>

          <h1 className="text-3xl sm:text-6xl font-extrabold tracking-tight max-w-4xl mx-auto leading-tight">
            Interactive Quran & Arabic{" "}
            <span className="text-amber-300">Curriculum System</span>
          </h1>

          <p className="text-teal-50 text-base sm:text-xl max-w-2xl mx-auto leading-relaxed">
            Built for non-Arabic speaking children (ages 7–14) to practice at home
            and used live by our certified teachers during 1-on-1 Zoom classes.
          </p>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
            <Link
              href={`/${locale}/curriculum/noor-al-bayan`}
              className="px-8 py-4 rounded-2xl bg-gradient-to-r from-[#FF5A1F] to-[#F59E0B] hover:opacity-95 text-white font-extrabold text-sm sm:text-base inline-flex items-center gap-2.5 shadow-xl shadow-orange-600/30 transition transform hover:-translate-y-0.5"
            >
              <Play className="w-5 h-5 fill-current" />
              <span>Start Noor Al-Bayan Course (12 Free Lessons)</span>
            </Link>

            <Link
              href={`/${locale}/contact`}
              className="px-7 py-4 rounded-2xl bg-white/15 hover:bg-white/25 border border-white/25 text-white font-extrabold text-sm sm:text-base inline-flex items-center gap-2 transition"
            >
              <span>Book a Free 1-on-1 Trial Class</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* 4 Studio Pillars Bar */}
          <div className="pt-8 max-w-4xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { icon: Presentation, label: "Visual Slides", sub: "Replaces PowerPoint" },
              { icon: Volume2, label: "84+ Audio Tiles", sub: "Instant Arabic speech" },
              { icon: Layers, label: "Word X-Ray Lab", sub: "Syllable breakdown" },
              { icon: Gamepad2, label: "Mastery Games", sub: "Earn stars & badges" },
            ].map((p, i) => {
              const Icon = p.icon;
              return (
                <div
                  key={i}
                  className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-4 text-left flex items-center gap-3"
                >
                  <div className="w-10 h-10 rounded-xl bg-amber-400/20 text-amber-300 flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs sm:text-sm font-extrabold text-white">{p.label}</div>
                    <div className="text-[11px] text-teal-100">{p.sub}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===================================================================
          2. FLAGSHIP FEATURED PROGRAM: NOOR AL-BAYAN (SPOTLIGHT BENTO)
         =================================================================== */}
      <main className="max-w-7xl mx-auto px-4 sm:px-8 mt-16 space-y-20">
        <section className="space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-extrabold uppercase tracking-widest text-[#0D9488] dark:text-teal-400">
                Flagship Interactive Program • Open Access
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold mt-1">
                Noor Al-Bayan: 12-Lesson Reading Path
              </h2>
            </div>

            <Link
              href={`/${locale}/curriculum/noor-al-bayan`}
              className="text-sm font-extrabold text-[#0D9488] dark:text-teal-400 inline-flex items-center gap-1.5 hover:underline"
            >
              <span>View Full Course & All 12 Lessons</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Quick Jump Grid of First 6 Lessons */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredLessons.map((lesson) => (
              <Link
                key={lesson.id}
                href={`/${locale}/curriculum/noor-al-bayan/${lesson.slug}`}
                className={`group rounded-3xl border overflow-hidden flex flex-col justify-between transition-all duration-300 hover:-translate-y-1.5 ${
                  darkMode
                    ? "bg-[#111827] border-slate-800 hover:border-teal-500/50 shadow-xl"
                    : "bg-white border-slate-200/90 hover:border-teal-500 shadow-md shadow-slate-200/50"
                }`}
              >
                <div>
                  <div className="relative h-40 overflow-hidden bg-slate-900">
                    <img
                      src={lesson.coverImage}
                      alt={lesson.title}
                      loading="lazy"
                      className="w-full h-full object-cover opacity-85 group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/25 to-transparent" />
                    <span className="absolute top-3 left-3 px-3 py-1 rounded-xl bg-black/60 backdrop-blur-md text-white text-xs font-extrabold">
                      Lesson {lesson.number}
                    </span>
                    <span
                      dir="rtl"
                      className="absolute bottom-3 right-3 px-3 py-1 rounded-xl bg-white/20 backdrop-blur-md text-amber-300 font-serif font-bold text-xl"
                    >
                      {lesson.arabicBadge}
                    </span>
                  </div>

                  <div className="p-6 space-y-2">
                    <span dir="rtl" className="text-xs font-serif font-bold text-[#0D9488] dark:text-teal-400 block">
                      {lesson.titleAr}
                    </span>
                    <h3 className="text-lg font-extrabold group-hover:text-[#0D9488] dark:group-hover:text-teal-400 transition-colors">
                      {lesson.title}
                    </h3>
                    <p className={`text-xs leading-relaxed line-clamp-2 ${darkMode ? "text-slate-400" : "text-slate-600"}`}>
                      {lesson.description}
                    </p>
                  </div>
                </div>

                <div className="px-6 pb-5 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs font-extrabold text-[#0D9488] dark:text-teal-400">
                  <span>Start Interactive Lesson</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* =================================================================
            3. ALL 4 CURRICULUM TRACKS ROADMAP
           ================================================================= */}
        <section className="space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-extrabold uppercase tracking-widest text-[#0D9488] dark:text-teal-400">
              Complete Academic Architecture
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold">
              Structured Learning Paths
            </h2>
            <p className={`text-sm sm:text-base ${darkMode ? "text-slate-400" : "text-slate-600"}`}>
              Each program builds progressively on the previous one—taking your
              child from foundational reading to fluent Quranic recitation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
            {LEARNING_TRACKS.map((track) => (
              <article
                key={track.id}
                className={`rounded-3xl border overflow-hidden flex flex-col justify-between transition-all ${
                  darkMode
                    ? "bg-[#111827] border-slate-800 shadow-xl"
                    : "bg-white border-slate-200/90 shadow-lg shadow-slate-200/50"
                }`}
              >
                <div>
                  <div className={`h-2.5 w-full bg-gradient-to-r ${track.accent}`} />
                  <div className="relative h-48 overflow-hidden bg-slate-950">
                    <img
                      src={track.image}
                      alt={track.title}
                      loading="lazy"
                      className="w-full h-full object-cover opacity-80"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/35 to-transparent" />
                    <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                      <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-xs font-extrabold">
                        {track.step}
                      </span>
                      <span
                        className={`px-3 py-1 rounded-full text-[11px] font-extrabold ${
                          track.status === "available"
                            ? "bg-emerald-500 text-white"
                            : "bg-amber-500/90 text-slate-950"
                        }`}
                      >
                        {track.badge}
                      </span>
                    </div>
                    <div className="absolute bottom-4 left-5 right-5 text-white">
                      <span dir="rtl" className="text-sm font-serif font-bold text-amber-300 block">
                        {track.titleAr}
                      </span>
                      <h3 className="text-xl sm:text-2xl font-extrabold">{track.title}</h3>
                    </div>
                  </div>

                  <div className="p-7 space-y-4">
                    <p className={`text-sm leading-relaxed ${darkMode ? "text-slate-300" : "text-slate-600"}`}>
                      {track.description}
                    </p>
                    <div className="flex items-center gap-4 text-xs font-bold text-slate-500 dark:text-slate-400">
                      <span className="flex items-center gap-1.5">
                        <BookOpen className="w-4 h-4 text-[#0D9488]" /> {track.lessonsCount}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Users className="w-4 h-4 text-[#0D9488]" /> {track.age}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="px-7 pb-7 pt-2 flex flex-wrap items-center gap-3">
                  <Link
                    href={track.href}
                    className={`flex-1 py-3.5 px-5 rounded-2xl font-extrabold text-xs sm:text-sm inline-flex items-center justify-center gap-2 transition ${
                      track.status === "available"
                        ? "bg-[#0D9488] hover:bg-teal-700 text-white shadow-md shadow-teal-600/20"
                        : darkMode
                        ? "bg-slate-800 hover:bg-slate-700 text-white"
                        : "bg-slate-100 hover:bg-slate-200 text-slate-800"
                    }`}
                  >
                    <span>
                      {track.status === "available"
                        ? "Explore All 12 Interactive Lessons"
                        : "Enroll in Live 1-on-1 Classes"}
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}