"use client";

import React, { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  Clock,
  GraduationCap,
  Search,
  ShieldCheck,
  Users,
  Volume2,
} from "lucide-react";
import type { CurriculumCourse, CurriculumLesson } from "@/lib/curriculum/types";
import { NOOR_AL_BAYAN_COURSE } from "@/lib/curriculum/noor-al-bayan";
import {
  amiri, dmSerif, ARROW, BTN_GHOST, BTN_GOLD, BTN_PRIMARY, BTN_SECONDARY, CARD, FOCUS, HeroShell, INK, MUTED,
  Ornament, WRAP,
} from "@/lib/ui/brand";

type Level = "All" | "Beginner" | "Elementary" | "Intermediate";
const LEVELS: Level[] = ["All", "Beginner", "Elementary", "Intermediate"];

interface CourseOverviewProps {
  course?: CurriculumCourse;
  locale?: string;
}

export default function CourseOverview({ course = NOOR_AL_BAYAN_COURSE, locale = "en" }: CourseOverviewProps) {
  const isAr = locale === "ar";
  const tx = (en: string, ar: string) => (isAr ? ar : en);
  const base = `/${locale}`;
  const activeCourse = course || NOOR_AL_BAYAN_COURSE;

  const [level, setLevel] = useState<Level>("All");
  const [query, setQuery] = useState("");

  const lessons: CurriculumLesson[] = useMemo(
    () =>
      [...(activeCourse.lessons || NOOR_AL_BAYAN_COURSE.lessons || [])].sort(
        (x, y) => (x.order ?? x.number) - (y.order ?? y.number)
      ),
    [activeCourse]
  );
  const total = lessons.length;
  const hours = Math.max(1, Math.round(lessons.reduce((a, l) => a + (l.estimatedMinutes || 25), 0) / 60));
  const firstSlug = lessons[0]?.slug || "short-vowels-harakat";
  const courseHref = `${base}/curriculum/noor-al-bayan`;

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    return lessons.filter((l) => {
      if (level !== "All" && l.difficulty !== level) return false;
      if (!q) return true;
      return l.title.toLowerCase().includes(q) || l.titleAr.includes(q) || l.subtitle.toLowerCase().includes(q);
    });
  }, [lessons, level, query]);

  const levelLabel = (l: Level) =>
    ({
      All: tx(`All lessons (${total})`, `كل الدروس (${total})`),
      Beginner: tx("Beginner", "مبتدئ"),
      Elementary: tx("Elementary", "أساسي"),
      Intermediate: tx("Intermediate", "متوسط"),
    })[l];

  const display = isAr ? amiri.className : dmSerif.className;
  const headingCls = `${display} ${isAr ? "font-bold leading-[1.45]" : "font-normal leading-[1.08] tracking-[-0.01em]"}`;

  const outcomes = [
    tx("Recognize and pronounce all 28 Arabic letters in isolated and connected forms", "التعرّف على الحروف العربية الـ28 ونطقها منفردةً ومتصلةً"),
    tx("Read the 3 short vowels (Fatha, Damma, Kasra) with a crisp 1-beat timing", "قراءة الحركات القصيرة الثلاث (الفتحة والضمة والكسرة) بزمن حركة واحدة"),
    tx("Read Sukun syllables and echo the 5 Qalqalah letters (قُطْبُ جَدٍ)", "قراءة المقاطع الساكنة وإظهار قلقلة الحروف الخمسة (قُطْبُ جَدٍ)"),
    tx("Tell Tanween (-an, -un, -in) apart from the helper Alif rules", "التمييز بين التنوين (-اً، -ٌ، -ٍ) وأحكام ألف الوصل"),
    tx("Stretch the 3 natural long vowels (Alif, Waw, Ya) for 2 beats", "مدّ حروف المدّ الطبيعي الثلاثة (الألف والواو والياء) بمقدار حركتين"),
    tx("Decode Shaddah, 2-beat Ghunnah (نّ / مّ) and Sun/Moon Lam (ال)", "قراءة الشدّة والغنّة بمقدار حركتين (نّ / مّ) و«ال» الشمسية والقمرية"),
    tx("Apply the foundational rules: Izhar, Idgham, Iqlab, Ikhfa and stopping (Waqf)", "تطبيق الأحكام الأساسية: الإظهار والإدغام والإقلاب والإخفاء وأحكام الوقف"),
    tx("Recite short Surahs word by word with clear articulation", "تلاوة سور قصيرة كلمةً كلمةً بنطق واضح"),
  ];

  const samples = [
    { slug: "short-vowels-harakat", ar: "بَ بُ بِ", n: tx("Harakat", "الحركات") },
    { slug: "sukun-and-qalqalah", ar: "أَبْ • نَجْمْ", n: tx("Sukun", "السكون") },
    { slug: "shaddah-and-ghunnah", ar: "رَبَّ • إِنَّ", n: tx("Shaddah", "الشدّة") },
  ];

  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://tajwedo.com").replace(/\/$/, "");
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Course",
        name: activeCourse.title || "Noor Al-Bayan: Learn to Read Quran",
        description: activeCourse.description,
        url: `${siteUrl}${courseHref}`,
        inLanguage: isAr ? "ar" : "en",
        typicalAgeRange: "7-14",
        isAccessibleForFree: true,
        numberOfCredits: total,
        provider: { "@type": "EducationalOrganization", name: "Tajwedo Institute", url: siteUrl },
        hasCourseInstance: { "@type": "CourseInstance", courseMode: "online" },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: `${siteUrl}${base}` },
          { "@type": "ListItem", position: 2, name: "Curriculum", item: `${siteUrl}${base}/curriculum` },
          { "@type": "ListItem", position: 3, name: "Noor Al-Bayan", item: `${siteUrl}${courseHref}` },
        ],
      },
      {
        "@type": "ItemList",
        itemListElement: lessons.map((l, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: l.title,
          url: `${siteUrl}${courseHref}/${l.slug}`,
        })),
      },
    ],
  };

  return (
    <div className="min-h-screen w-full bg-[#FBF8F2] font-sans text-slate-900 dark:bg-[#0B0F19] dark:text-slate-100">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />

      <main id="main-content">
        {/* ================================ HERO ================================ */}
        <HeroShell labelledBy="course-title" className="pt-28 sm:pt-32">
          <div className={`${WRAP} pb-20 lg:pb-24`}>
            <nav aria-label="Breadcrumb" className="mb-8 flex flex-wrap items-center gap-1.5 text-sm font-semibold text-white/70">
              <Link href={base} className="rounded hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-white">{tx("Home", "الرئيسية")}</Link>
              <ChevronRight aria-hidden="true" className="h-3.5 w-3.5 opacity-60 rtl:rotate-180" />
              <Link href={`${base}/curriculum#courses`} className="rounded hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-white">{tx("Courses", "الدورات")}</Link>
              <ChevronRight aria-hidden="true" className="h-3.5 w-3.5 opacity-60 rtl:rotate-180" />
              <span aria-current="page" className="text-white">{tx("Noor Al-Bayan", "نور البيان")}</span>
            </nav>

            <div className="grid items-center gap-14 lg:grid-cols-[1.05fr_0.95fr]">
              <div>
                <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3.5 py-1.5 text-[13px] font-semibold text-[#E6CF9F] backdrop-blur-sm">
                  <span aria-hidden="true" className="h-2 w-2 rounded-full bg-emerald-400" />
                  {tx("Free course · Ages 7–14", "دورة مجانية · من 7 إلى 14 سنة")}
                </span>

                <p lang="ar" dir="rtl" className={`${amiri.className} mt-6 text-2xl font-bold text-[#E3B45F]`}>
                  {activeCourse.titleAr || "مَنْهَجُ نُورِ البَيَانِ التَّفَاعُلِيّ"}
                </p>
                <h1 id="course-title" className={`mt-2 text-[2.25rem] text-white [text-wrap:balance] sm:text-5xl lg:text-6xl ${headingCls}`}>
                  {isAr ? "نور البيان: تعلّم قراءة القرآن" : activeCourse.title || "Noor Al-Bayan: Learn to Read Quran"}
                </h1>

                <Ornament className="my-5" />

                <p className="max-w-xl text-lg leading-relaxed text-white/80">
                  {isAr
                    ? `${total} درسًا بصريًا تفاعليًا للأطفال غير الناطقين بالعربية، من الحروف المفردة إلى قراءة آيات القرآن بثقة، للتدرّب في البيت أو مع معلم مباشر.`
                    : activeCourse.description ||
                      `${total} visual, interactive lessons for non-Arabic-speaking children, from single letters to reading Quranic verses with confidence, at home or with a live teacher.`}
                </p>

                <div className="mt-8 flex flex-wrap gap-3">
                  <Link href={`${courseHref}/${firstSlug}`} className={BTN_GOLD}>
                    <span>{tx("Start Lesson 1 free", "ابدأ الدرس الأول مجانًا")}</span>
                    <ArrowRight aria-hidden="true" className={ARROW} />
                  </Link>
                  <a href="#syllabus" className={BTN_GHOST}>{tx(`See all ${total} lessons`, `شاهد الدروس الـ ${total}`)}</a>
                </div>

                <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm font-semibold text-white/85">
                  <li className="inline-flex items-center gap-2"><BookOpen aria-hidden="true" className="h-4 w-4 text-[#E3B45F]" />{tx(`${total} lessons`, `${total} درسًا`)}</li>
                  <li className="inline-flex items-center gap-2"><Clock aria-hidden="true" className="h-4 w-4 text-[#E3B45F]" />{tx(`~${hours} hours`, `حوالي ${hours} ساعات`)}</li>
                  <li className="inline-flex items-center gap-2"><Volume2 aria-hidden="true" className="h-4 w-4 text-[#E3B45F]" />{tx("84+ audio tiles", "أكثر من 84 بطاقة صوتية")}</li>
                  <li className="inline-flex items-center gap-2"><CheckCircle2 aria-hidden="true" className="h-4 w-4 text-[#E3B45F]" />{tx("No login required", "بدون تسجيل دخول")}</li>
                </ul>
              </div>

              <div className="relative mx-auto w-full max-w-md lg:mx-0 lg:justify-self-end">
                <div aria-hidden="true" className="absolute inset-0 translate-x-3 translate-y-3 rounded-3xl border border-[#C8A96E]/40 rtl:-translate-x-3" />
                <div className="relative overflow-hidden rounded-3xl border border-white/15 bg-white/[0.07] shadow-2xl backdrop-blur-sm">
                  <div className="relative aspect-[16/10] bg-slate-900">
                    <Image src="/Tajwedo-Public-Assets/curriculum-Imag/Quran Recitation.webp" alt="" fill priority sizes="(min-width: 1024px) 40vw, 100vw" className="object-cover" />
                    <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-[#06302f]/80 via-transparent to-transparent" />
                  </div>
                  <div className="p-5 sm:p-6">
                    <p className="text-sm font-semibold text-white/70">{tx("Preview a lesson", "جرّب درسًا")}</p>
                    <div className="mt-3 grid grid-cols-3 gap-2.5">
                      {samples.map((s) => (
                        <Link
                          key={s.slug}
                          href={`${courseHref}/${s.slug}`}
                          className="rounded-xl border border-white/15 bg-white/5 p-3 text-center transition hover:border-[#C8A96E] focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
                        >
                          <span dir="rtl" lang="ar" className={`${amiri.className} block text-2xl font-bold text-white`}>{s.ar}</span>
                          <span className="mt-1 block text-xs font-semibold text-white/70">{s.n}</span>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </HeroShell>

        {/* ============================ BODY ============================ */}
        <div className={`${WRAP} grid gap-12 py-16 sm:py-24 lg:grid-cols-12`}>
          <div className="space-y-20 lg:col-span-8">
            {/* Outcomes */}
            <section aria-labelledby="outcomes-title">
              <h2 id="outcomes-title" className={`text-3xl sm:text-4xl ${headingCls} ${INK}`}>
                {tx("What your child will be able to do", "ماذا سيتمكّن طفلك من فعله")}
              </h2>
              <ul className="mt-8 grid gap-x-8 gap-y-5 sm:grid-cols-2">
                {outcomes.map((o) => (
                  <li key={o} className="flex items-start gap-3 text-[15px] leading-relaxed">
                    <CheckCircle2 aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600 dark:text-emerald-400" />
                    <span className="text-slate-700 dark:text-slate-200">{o}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* Syllabus: lesson cards live here */}
            <section id="syllabus" aria-labelledby="syllabus-title" className="scroll-mt-28">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                <h2 id="syllabus-title" className={`text-3xl sm:text-4xl ${headingCls} ${INK}`}>
                  {tx(`Course syllabus · ${total} lessons`, `محتوى الدورة · ${total} درسًا`)}
                </h2>
                <div className="relative">
                  <Search aria-hidden="true" className="pointer-events-none absolute start-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type="search"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder={tx("Search lessons", "ابحث في الدروس")}
                    aria-label={tx("Search lessons", "ابحث في الدروس")}
                    className={`min-h-11 w-full rounded-xl border border-stone-300 bg-white ps-10 pe-4 text-sm font-semibold text-slate-800 outline-none focus:border-[#0D9488] dark:border-white/15 dark:bg-[#111827] dark:text-white sm:w-64 ${FOCUS}`}
                  />
                </div>
              </div>

              <div role="group" aria-label={tx("Filter by level", "تصفية حسب المستوى")} className="mt-5 flex flex-wrap gap-2">
                {LEVELS.map((l) => (
                  <button
                    key={l}
                    type="button"
                    aria-pressed={level === l}
                    onClick={() => setLevel(l)}
                    className={`min-h-10 rounded-full px-4 text-sm font-bold transition ${FOCUS} ${
                      level === l
                        ? "bg-[#0D4F4F] text-white dark:bg-teal-400 dark:text-slate-950"
                        : "border border-stone-300 bg-white text-slate-700 hover:bg-stone-100 dark:border-white/15 dark:bg-white/5 dark:text-slate-200 dark:hover:bg-white/10"
                    }`}
                  >
                    {levelLabel(l)}
                  </button>
                ))}
              </div>

              <p className="sr-only" aria-live="polite">{tx(`${filtered.length} lessons shown`, `عدد الدروس المعروضة ${filtered.length}`)}</p>

              <ul className="mt-8 space-y-5">
                {filtered.map((lesson, idx) => (
                  <li key={lesson.id || idx}>
                    <Link
                      href={`${courseHref}/${lesson.slug}`}
                      className={`group grid overflow-hidden rounded-2xl ${CARD} transition duration-300 hover:border-teal-600/60 hover:shadow-xl motion-reduce:transition-none dark:hover:border-teal-400/50 md:grid-cols-[15rem_1fr] ${FOCUS}`}
                    >
                      <div className="relative aspect-[16/10] bg-slate-900 md:aspect-auto md:min-h-[10rem]">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={lesson.coverImage} alt="" loading="lazy" decoding="async" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105 motion-reduce:transition-none" />
                        <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/35 to-transparent" />
                        <span className="absolute start-3 top-3 rounded-lg bg-slate-950/70 px-2.5 py-1 text-xs font-bold text-white">
                          {tx("Lesson", "الدرس")} {lesson.number || idx + 1}
                        </span>
                        {!isAr && (
                          <span lang="ar" dir="rtl" className={`${amiri.className} absolute inset-x-3 bottom-2.5 line-clamp-2 text-xl font-bold leading-snug text-[#E3B45F] sm:text-2xl`}>{lesson.titleAr}</span>
                        )}
                      </div>

                      <div className="flex flex-col gap-3 p-5 sm:p-6">
                        {isAr ? (
                          <>
                            <h3 lang="ar" className={`${amiri.className} text-2xl font-bold leading-snug ${INK}`}>{lesson.titleAr}</h3>
                            <span lang="en" dir="ltr" className={`text-sm ${MUTED}`}>{lesson.title}</span>
                          </>
                        ) : (
                          <>
                                                        <h3 className={`text-xl font-bold leading-snug ${INK}`}>{lesson.title}</h3>
                            <p className={`line-clamp-2 text-sm leading-relaxed ${MUTED}`}>{lesson.description}</p>
                          </>
                        )}
                        <div className={`mt-auto flex flex-wrap items-center justify-between gap-3 pt-3 text-sm font-semibold ${MUTED}`}>
                          <span className="inline-flex items-center gap-4">
                            <span className="inline-flex items-center gap-1.5"><Clock aria-hidden="true" className="h-4 w-4" />{lesson.duration}</span>
                            <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-800 dark:bg-emerald-400/15 dark:text-emerald-300">{lesson.difficulty}</span>
                          </span>
                          <span className="inline-flex items-center gap-2 font-bold text-[#0D6B66] dark:text-teal-300">
                            {tx("Start lesson", "ابدأ الدرس")}
                            <ArrowRight aria-hidden="true" className={`${ARROW} transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1 motion-reduce:transition-none`} />
                          </span>
                        </div>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>

              {filtered.length === 0 && (
                <p className={`mt-8 rounded-2xl border border-dashed border-stone-300 p-8 text-center text-base dark:border-white/20 ${MUTED}`}>
                  {tx("No lessons match your search. Clear the search or choose All lessons.", "لا توجد دروس مطابقة لبحثك. امسح البحث أو اختر كل الدروس.")}
                </p>
              )}
            </section>
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-4">
            <div className="space-y-6 lg:sticky lg:top-28">
              <div className={`space-y-5 rounded-3xl p-7 ${CARD}`}>
                <span aria-hidden="true" className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#0D4F4F]/10 text-[#0D6B66] dark:bg-white/5 dark:text-teal-300">
                  <GraduationCap className="h-6 w-6" />
                </span>
                <h2 className={`text-2xl ${display} ${isAr ? "font-bold leading-snug" : "font-normal leading-tight"} ${INK}`}>
                  {tx("Learn at home, or with a live teacher", "تعلّم في البيت أو مع معلم مباشر")}
                </h2>
                <p className={`text-[15px] leading-relaxed ${MUTED}`}>
                  {tx(
                    "Every lesson has teacher controls: enlarge the Arabic for screen sharing, hide English hints to quiz your student, and play native audio on tap.",
                    "في كل درس أدوات للمعلم: تكبير الخط العربي للمشاركة على الشاشة، وإخفاء الترجمة لاختبار الطالب، وتشغيل النطق العربي بلمسة."
                  )}
                </p>
                <ul className="space-y-3 text-sm font-semibold">
                  {[
                    tx("Non-Arabic-speaking children, ages 7–14", "أطفال غير ناطقين بالعربية من 7 إلى 14 سنة"),
                    tx("Parents supporting Quran reading at home", "أولياء أمور يدعمون القراءة في البيت"),
                    tx("Online Quran teachers who need ready slides", "معلمو قرآن أونلاين يحتاجون شرائح جاهزة"),
                  ].map((a) => (
                    <li key={a} className="flex items-start gap-2.5">
                      <Users aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-[#0D9488]" />
                      <span className="text-slate-700 dark:text-slate-200">{a}</span>
                    </li>
                  ))}
                </ul>
                <Link href={`${base}/book-trial`} className={`${BTN_PRIMARY} w-full`}>
                  <span>{tx("Book a free 1-on-1 trial", "احجز حصة تجريبية فردية مجانية")}</span>
                  <ArrowRight aria-hidden="true" className={ARROW} />
                </Link>
              </div>

              <div className={`space-y-3 rounded-3xl p-6 ${CARD}`}>
                <h2 className={`flex items-center gap-2 text-base font-bold ${INK}`}>
                  <ShieldCheck aria-hidden="true" className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                  {tx("What you need", "ما الذي تحتاجه")}
                </h2>
                <ul className={`space-y-2 text-sm leading-relaxed ${MUTED}`}>
                  <li>{tx("No Arabic needed. The course starts from zero.", "لا حاجة للعربية، فالدورة تبدأ من الصفر.")}</li>
                  <li>{tx("Any laptop, tablet or phone browser with sound on.", "أي حاسوب أو جهاز لوحي أو هاتف بمتصفح وصوت مفعّل.")}</li>
                </ul>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}