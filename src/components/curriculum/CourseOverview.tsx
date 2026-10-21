"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  Clock,
  BookOpen,
  Star,
  ArrowRight,
  ShieldCheck,
  Users,
  Play,
  Sparkles,
  GraduationCap,
  Globe,
  Award,
  Search,
  Layers,
  Volume2,
  Presentation,
  Gamepad2,
  ChevronRight,
  Home
} from "lucide-react";
import type { CurriculumCourse, CurriculumLesson } from "@/lib/curriculum/types";
import { NOOR_AL_BAYAN_COURSE } from "@/lib/curriculum/noor-al-bayan";

interface CourseOverviewProps {
  course?: CurriculumCourse;
  locale?: string;
}

export default function CourseOverview({
  course = NOOR_AL_BAYAN_COURSE,
  locale = "en",
}: CourseOverviewProps) {
  const activeCourse = course || NOOR_AL_BAYAN_COURSE;

  // Sync with Global Theme Toggle (Light / Dark)
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [levelFilter, setLevelFilter] = useState<"All" | "Beginner" | "Elementary" | "Intermediate">("All");
  const [searchQuery, setSearchQuery] = useState<string>("");

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

  const lessons: CurriculumLesson[] = useMemo(() => {
    return activeCourse.lessons || NOOR_AL_BAYAN_COURSE.lessons || [];
  }, [activeCourse]);

  const filteredLessons = useMemo(() => {
    return lessons.filter((item) => {
      if (levelFilter !== "All" && item.difficulty !== levelFilter) return false;
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase().trim();
      return (
        item.title.toLowerCase().includes(q) ||
        item.titleAr.includes(q) ||
        item.subtitle.toLowerCase().includes(q)
      );
    });
  }, [lessons, levelFilter, searchQuery]);

  const totalMinutes = useMemo(() => {
    return lessons.reduce((acc, l) => acc + (l.estimatedMinutes || 25), 0);
  }, [lessons]);

  const firstLessonSlug = lessons[0]?.slug || "short-vowels-harakat";

  const learningOutcomes = [
    "Recognize and pronounce all 28 Arabic letters in isolated and connected forms",
    "Master the 3 Short Vowels (Fatha, Damma, Kasra) with crisp 1-beat timing",
    "Read Sukun syllables and apply natural echo on the 5 Qalqalah letters (قُطْبُ جَدٍ)",
    "Distinguish audibly and visually between Tanween (-an, -un, -in) and Helper Alif rules",
    "Stretch the 3 Natural Long Vowels (Madd Alif, Waw, Ya) for an accurate 2-beat duration",
    "Decode Shaddah twin letters, 2-beat nasal Ghunnah (نّ / مّ), and Sun/Moon Lam (ال)",
    "Apply foundational Tajweed rules (Izhar, Idgham, Iqlab, Ikhfa) and Waqf stopping rules",
    "Recite short Quranic Surahs word-by-word with confidence and proper articulation",
  ];

  return (
    <div
      className={`min-h-screen w-full transition-colors duration-300 font-sans pb-24 ${
        darkMode ? "bg-[#0B0F19] text-slate-100" : "bg-[#F8FAFC] text-slate-900"
      }`}
    >
      {/* ===================================================================
          1. COURSERA/UDEMY FLAGSHIP HERO BANNER (WITH NAVBAR CLEARANCE pt-28)
         =================================================================== */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#082F2C] via-[#0D5C56] to-[#0F766E] text-white pt-28 pb-16 px-4 sm:px-8 border-b border-teal-800/60">
        {/* Subtle decorative background glow */}
        <div className="pointer-events-none absolute -top-24 right-1/4 w-96 h-96 rounded-full bg-amber-400/10 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 left-10 w-80 h-80 rounded-full bg-teal-300/10 blur-3xl" />

        <div className="max-w-7xl mx-auto relative z-10">
          {/* Breadcrumb Navigation */}
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-teal-200 mb-6">
            <Link href={`/${locale}`} className="hover:text-white transition inline-flex items-center gap-1">
              <Home className="w-3.5 h-3.5" /> Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5 opacity-60" />
            <Link href={`/${locale}/curriculum`} className="hover:text-white transition">
              Interactive Curriculum
            </Link>
            <ChevronRight className="w-3.5 h-3.5 opacity-60" />
            <span className="text-white font-bold">Noor Al-Bayan</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left 7 Columns: Course Identity, Value Prop & Trust Metrics */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-400/20 border border-amber-300/40 text-amber-200 text-xs font-extrabold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>100% Free Interactive Curriculum • Ages 7–14</span>
              </div>

              <div className="space-y-2">
                <span dir="rtl" className="block text-xl sm:text-2xl font-serif font-bold text-amber-300">
                  {activeCourse.titleAr || "مَنْهَجُ نُورِ البَيَانِ التَّفَاعُلِيّ"}
                </span>
                <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight text-white">
                  {activeCourse.title || "Noor Al-Bayan: Learn to Read Quran"}
                </h1>
              </div>

              <p className="text-teal-50 text-base sm:text-lg leading-relaxed max-w-2xl">
                {activeCourse.description ||
                  "A complete, visual, and interactive 12-lesson foundational program designed for non-Arabic speaking children at home and live 1-on-1 Zoom teachers."}
              </p>

              {/* Key Trust Badges (Coursera Style) */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-3.5">
                  <div className="flex items-center gap-2 text-amber-300 font-extrabold text-sm">
                    <BookOpen className="w-4 h-4" />
                    <span>{lessons.length} Lessons</span>
                  </div>
                  <p className="text-[11px] text-teal-100 mt-0.5">Step-by-step mastery</p>
                </div>

                <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-3.5">
                  <div className="flex items-center gap-2 text-emerald-300 font-extrabold text-sm">
                    <Volume2 className="w-4 h-4" />
                    <span>Native Audio</span>
                  </div>
                  <p className="text-[11px] text-teal-100 mt-0.5">84+ clickable sounds</p>
                </div>

                <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-3.5">
                  <div className="flex items-center gap-2 text-sky-300 font-extrabold text-sm">
                    <Presentation className="w-4 h-4" />
                    <span>Visual Slides</span>
                  </div>
                  <p className="text-[11px] text-teal-100 mt-0.5">Replaces PowerPoint</p>
                </div>

                <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-3.5">
                  <div className="flex items-center gap-2 text-amber-300 font-extrabold text-sm">
                    <Users className="w-4 h-4" />
                    <span>500+ Students</span>
                  </div>
                  <p className="text-[11px] text-teal-100 mt-0.5">Trusted worldwide</p>
                </div>
              </div>

              {/* Primary CTA Buttons */}
              <div className="pt-3 flex flex-wrap items-center gap-4">
                <Link
                  href={`/${locale}/curriculum/noor-al-bayan/${firstLessonSlug}`}
                  className="px-7 py-4 rounded-2xl bg-gradient-to-r from-[#FF5A1F] to-[#F59E0B] hover:opacity-95 text-white font-extrabold text-sm sm:text-base inline-flex items-center gap-2.5 shadow-xl shadow-orange-600/30 transition transform hover:-translate-y-0.5"
                >
                  <Play className="w-5 h-5 fill-current" />
                  <span>Start Lesson 1 Now (Free)</span>
                </Link>

                <a
                  href="#syllabus"
                  className="px-6 py-4 rounded-2xl bg-white/15 hover:bg-white/25 border border-white/25 text-white font-extrabold text-sm sm:text-base inline-flex items-center gap-2 transition"
                >
                  <Layers className="w-4 h-4" />
                  <span>Explore All 12 Lessons</span>
                </a>
              </div>
            </div>

            {/* Right 5 Columns: Interactive Course Preview Card */}
            <div className="lg:col-span-5">
              <div className="rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 p-5 sm:p-6 shadow-2xl space-y-5">
                <div className="relative h-52 rounded-2xl overflow-hidden border border-white/15">
                  <img
                    src="/Tajwedo-Public-Assets/curriculum-Imag/Quran Recitation.webp"
                    alt="Noor Al-Bayan Quranic Reading Preview"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent" />
                  <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-emerald-500 text-white text-xs font-extrabold uppercase tracking-wider">
                    Interactive Studio Ready
                  </div>
                  <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
                    <div>
                      <span className="text-xs font-bold text-amber-300 uppercase block">
                        Included in Every Lesson
                      </span>
                      <p className="text-lg font-extrabold text-white">
                        Learn + Sound Matrix + Reading + Games
                      </p>
                    </div>
                  </div>
                </div>

                {/* Quick Sample Preview Pills */}
                <div className="grid grid-cols-3 gap-2.5 text-center">
                  <Link
                    href={`/${locale}/curriculum/noor-al-bayan/short-vowels-harakat`}
                    className="p-3 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/15 transition"
                  >
                    <span dir="rtl" className="block text-2xl font-serif font-bold text-amber-300">
                      بَ بُ بِ
                    </span>
                    <span className="text-[11px] font-bold text-teal-100 mt-1 block">
                      1. Harakat
                    </span>
                  </Link>
                  <Link
                    href={`/${locale}/curriculum/noor-al-bayan/sukun-and-qalqalah`}
                    className="p-3 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/15 transition"
                  >
                    <span dir="rtl" className="block text-2xl font-serif font-bold text-sky-300">
                      أَبْ • نَجْمْ
                    </span>
                    <span className="text-[11px] font-bold text-teal-100 mt-1 block">
                      3. Sukun
                    </span>
                  </Link>
                  <Link
                    href={`/${locale}/curriculum/noor-al-bayan/shaddah-and-ghunnah`}
                    className="p-3 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/15 transition"
                  >
                    <span dir="rtl" className="block text-2xl font-serif font-bold text-violet-300">
                      رَبَّ • إِنَّ
                    </span>
                    <span className="text-[11px] font-bold text-teal-100 mt-1 block">
                      6. Shaddah
                    </span>
                  </Link>
                </div>

                <div className="pt-2 border-t border-white/15 flex items-center justify-between text-xs text-teal-100 font-medium">
                  <span>Total Study Time: ~{Math.round(totalMinutes / 60)} Hours</span>
                  <span className="text-amber-300 font-bold">No login required</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================================
          2. MAIN COURSE BODY (WHAT YOU'LL LEARN + INTERACTIVE 12-LESSON SYLLABUS)
         =================================================================== */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 mt-14 grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left 8 Columns: Outcomes & Full 12-Lesson Syllabus */}
        <div className="lg:col-span-8 space-y-14">
          {/* Coursera-Style "What You Will Learn" Box */}
          <section
            className={`rounded-3xl border p-7 sm:p-9 transition-colors ${
              darkMode
                ? "bg-[#111827] border-slate-800 shadow-xl"
                : "bg-white border-slate-200/90 shadow-md shadow-slate-200/50"
            }`}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-2xl bg-[#0D9488]/15 text-[#0D9488] dark:text-teal-400 flex items-center justify-center">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-extrabold">
                  What Students Will Master
                </h2>
                <p className={`text-xs sm:text-sm ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
                  Step-by-step foundational skills from single letters to full Quranic verses
                </p>
              </div>
            </div>

            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {learningOutcomes.map((item, idx) => (
                <li key={idx} className="flex items-start gap-3 text-sm leading-relaxed">
                  <CheckCircle2 className="w-5 h-5 text-[#00A86B] shrink-0 mt-0.5" />
                  <span className={darkMode ? "text-slate-200" : "text-slate-700"}>
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </section>

          {/* Interactive 12-Lesson Syllabus Section */}
          <section id="syllabus" className="scroll-mt-28 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <span className="text-xs font-extrabold uppercase tracking-widest text-[#0D9488] dark:text-teal-400">
                  Structured Learning Path
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold mt-1">
                  Course Curriculum ({lessons.length} Interactive Lessons)
                </h2>
              </div>

              {/* Search Input */}
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search lessons..."
                  className={`pl-10 pr-4 py-2.5 rounded-2xl text-xs sm:text-sm font-semibold border outline-none transition ${
                    darkMode
                      ? "bg-[#111827] border-slate-800 text-white focus:border-[#0D9488]"
                      : "bg-white border-slate-200 text-slate-800 focus:border-[#0D9488] shadow-2xs"
                  }`}
                />
              </div>
            </div>

            {/* Level Filter Pills */}
            <div className="flex flex-wrap items-center gap-2">
              {(["All", "Beginner", "Elementary", "Intermediate"] as const).map((lvl) => (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => setLevelFilter(lvl)}
                  className={`px-4 py-2 rounded-2xl text-xs font-extrabold transition ${
                    levelFilter === lvl
                      ? "bg-[#0D9488] text-white shadow-md shadow-teal-600/20"
                      : darkMode
                      ? "bg-[#111827] border border-slate-800 text-slate-300 hover:bg-slate-800"
                      : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  {lvl === "All" ? `All Lessons (${lessons.length})` : `${lvl} Level`}
                </button>
              ))}
            </div>

            {/* Lesson Cards List */}
            <div className="space-y-5">
              {filteredLessons.map((lesson, idx) => (
                <article
                  key={lesson.id || idx}
                  className={`group rounded-3xl border overflow-hidden transition-all duration-300 hover:-translate-y-1 ${
                    darkMode
                      ? "bg-[#111827] border-slate-800 hover:border-teal-500/50 shadow-xl"
                      : "bg-white border-slate-200/90 hover:border-teal-500 shadow-md shadow-slate-200/50"
                  }`}
                >
                  <div className="grid grid-cols-1 md:grid-cols-12">
                    {/* Left Visual Thumbnail */}
                    <div className="md:col-span-4 relative h-48 md:h-auto overflow-hidden bg-slate-900">
                      <img
                        src={lesson.coverImage}
                        alt={lesson.title}
                        loading="lazy"
                        className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent" />
                      <div className="absolute top-3 left-3 flex items-center gap-2">
                        <span className="px-3 py-1 rounded-xl bg-black/60 backdrop-blur-md text-white text-xs font-extrabold">
                          Lesson {lesson.number || idx + 1}
                        </span>
                        <span className="px-2.5 py-1 rounded-xl bg-emerald-500/90 text-white text-[11px] font-extrabold">
                          {lesson.difficulty}
                        </span>
                      </div>
                      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white">
                        <span
                          dir="rtl"
                          className="text-2xl font-serif font-bold px-3 py-1 rounded-xl bg-white/15 backdrop-blur-md text-amber-300"
                        >
                          {lesson.arabicBadge}
                        </span>
                        <span className="text-xs font-bold text-slate-200 flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" /> {lesson.duration}
                        </span>
                      </div>
                    </div>

                    {/* Right Lesson Content & Objectives */}
                    <div className="md:col-span-8 p-6 sm:p-7 flex flex-col justify-between space-y-4">
                      <div className="space-y-2">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <span
                            dir="rtl"
                            className="text-sm font-serif font-bold text-[#0D9488] dark:text-teal-400"
                          >
                            {lesson.titleAr}
                          </span>
                        </div>
                        <h3 className="text-xl sm:text-2xl font-extrabold group-hover:text-[#0D9488] dark:group-hover:text-teal-400 transition-colors">
                          {lesson.title}
                        </h3>
                        <p className={`text-xs sm:text-sm leading-relaxed ${darkMode ? "text-slate-300" : "text-slate-600"}`}>
                          {lesson.description}
                        </p>

                        {/* Top 2 Objectives Preview */}
                        {lesson.objectives && lesson.objectives.length > 0 && (
                          <div className="pt-2 space-y-1.5">
                            {lesson.objectives.slice(0, 2).map((obj, oIdx) => (
                              <div key={oIdx} className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
                                <CheckCircle2 className="w-3.5 h-3.5 text-[#00A86B] shrink-0" />
                                <span className="line-clamp-1">{obj}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="pt-3 border-t border-slate-200/70 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
                        <div className="flex items-center gap-2 text-[11px] font-bold text-slate-400">
                          <span className="px-2.5 py-1 rounded-lg bg-slate-500/10">Slides</span>
                          <span className="px-2.5 py-1 rounded-lg bg-slate-500/10">Audio Matrix</span>
                          <span className="px-2.5 py-1 rounded-lg bg-slate-500/10">Quiz</span>
                        </div>

                        <Link
                          href={`/${locale}/curriculum/noor-al-bayan/${lesson.slug}`}
                          className="px-5 py-2.5 rounded-xl bg-[#0D9488] hover:bg-teal-700 text-white font-extrabold text-xs sm:text-sm inline-flex items-center gap-2 shadow-md shadow-teal-600/20 transition"
                        >
                          <span>Launch Interactive Lesson</span>
                          <ArrowRight className="w-4 h-4" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </div>

        {/* Right 4 Columns: Sticky Teacher & Parent Studio Sidebar */}
        <aside className="lg:col-span-4 space-y-6">
          <div className="sticky top-28 space-y-6">
            {/* Teacher & Live Zoom Card */}
            <div
              className={`rounded-3xl border p-7 space-y-5 ${
                darkMode
                  ? "bg-[#111827] border-slate-800 shadow-xl"
                  : "bg-white border-slate-200/90 shadow-md shadow-slate-200/50"
              }`}
            >
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#0D9488] to-[#059669] text-white flex items-center justify-center shadow-md">
                <GraduationCap className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-extrabold">
                Designed for Live Zoom Classes & Home Practice
              </h3>
              <p className={`text-sm leading-relaxed ${darkMode ? "text-slate-300" : "text-slate-600"}`}>
                Every lesson includes built-in <strong>Teacher Studio Controls</strong>: scale Arabic font sizes for screen-sharing, hide English hints to quiz students live, and play instant native audio.
              </p>

              <ul className="space-y-3 pt-1">
                {[
                  "Non-Arabic speaking Muslim children (ages 7–14)",
                  "Parents supporting Quranic reading at home",
                  "Online Quran teachers replacing static PowerPoint slides",
                ].map((aud, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-xs sm:text-sm font-semibold">
                    <CheckCircle2 className="w-4 h-4 text-[#0D9488] shrink-0 mt-0.5" />
                    <span className={darkMode ? "text-slate-200" : "text-slate-700"}>{aud}</span>
                  </li>
                ))}
              </ul>

              <div className="pt-3">
                <Link
                  href={`/${locale}/contact`}
                  className="w-full py-3.5 px-5 rounded-2xl bg-gradient-to-r from-[#0D9488] to-[#059669] hover:opacity-95 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg shadow-teal-600/25 transition"
                >
                  <span>Book a Free 1-on-1 Trial Class</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Prerequisites & Technical Info Card */}
            <div
              className={`rounded-3xl border p-6 space-y-4 ${
                darkMode
                  ? "bg-[#111827] border-slate-800 shadow-xl"
                  : "bg-white border-slate-200/90 shadow-md shadow-slate-200/50"
              }`}
            >
              <h3 className="text-base font-extrabold flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-[#00A86B]" />
                <span>Course Requirements</span>
              </h3>
              <ul className="space-y-2.5 text-xs sm:text-sm">
                <li className={`flex items-start gap-2 ${darkMode ? "text-slate-300" : "text-slate-600"}`}>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#0D9488] mt-2 shrink-0" />
                  <span>Zero prior Arabic reading experience required—starts from scratch.</span>
                </li>
                <li className={`flex items-start gap-2 ${darkMode ? "text-slate-300" : "text-slate-600"}`}>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#0D9488] mt-2 shrink-0" />
                  <span>Works on any laptop, tablet, or mobile browser with audio enabled.</span>
                </li>
              </ul>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}