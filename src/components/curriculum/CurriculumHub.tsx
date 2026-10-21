import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Amiri, DM_Serif_Display } from "next/font/google";
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Clock,
  Gamepad2,
  Layers,
  Plus,
  Presentation,
  Star,
  Users,
  Volume2,
} from "lucide-react";
import { NOOR_AL_BAYAN_COURSE } from "@/lib/curriculum/noor-al-bayan";

const dmSerif = DM_Serif_Display({ subsets: ["latin"], weight: ["400"], display: "swap" });
const amiri = Amiri({ subsets: ["arabic", "latin"], weight: ["400", "700"], display: "swap", preload: false });

/* ---------------------------- Design tokens ---------------------------- */

const WRAP = "mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8";
const INK = "text-[#0D4F4F] dark:text-white";
const MUTED = "text-slate-600 dark:text-slate-400";
const GOLD_TEXT = "text-[#A8832F] dark:text-[#E8C56A]";
const CARD = "border border-stone-200 bg-white dark:border-white/10 dark:bg-[#111827]";
const FOCUS =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600 dark:focus-visible:outline-teal-300";
const BTN =
  "inline-flex min-h-12 items-center justify-center gap-2 rounded-xl px-6 text-base font-bold transition motion-reduce:transition-none";
const BTN_PRIMARY = `${BTN} bg-[#0D4F4F] text-white shadow-lg shadow-[#0D4F4F]/20 hover:bg-[#093D33] dark:bg-teal-400 dark:text-slate-950 dark:shadow-none dark:hover:bg-teal-300 ${FOCUS}`;
const BTN_SECONDARY = `${BTN} border border-[#0D4F4F]/25 bg-white/60 text-[#0D4F4F] hover:bg-white dark:border-white/20 dark:bg-white/5 dark:text-white dark:hover:bg-white/10 ${FOCUS}`;
const BTN_GOLD = `${BTN} bg-[#E8C56A] text-[#072B28] hover:bg-[#F0D184] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white`;
const BTN_GHOST = `${BTN} border border-white/30 text-white hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white`;

const STAR_TILE =
  "<svg xmlns='http://www.w3.org/2000/svg' width='72' height='72' viewBox='0 0 72 72' fill='none' stroke='#C8A96E' stroke-width='1' stroke-opacity='0.6'>" +
  "<path d='M18 18h36v36H18zM36 10.5 61.5 36 36 61.5 10.5 36z'/>" +
  "<path d='M36 0v10.5M36 61.5V72M0 36h10.5M61.5 36H72'/></svg>";
const PATTERN_URL = `url("data:image/svg+xml,${encodeURIComponent(STAR_TILE)}")`;
const PATTERN_MASK =
  "[mask-image:radial-gradient(ellipse_at_top,black,transparent_72%)] [-webkit-mask-image:radial-gradient(ellipse_at_top,black,transparent_72%)]";

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="flex items-center gap-3 text-sm font-semibold text-[#0D6B66] dark:text-teal-300">
      <span aria-hidden="true" className="h-px w-8 bg-[#C8A96E]" />
      {children}
    </p>
  );
}

const ARROW = "h-4 w-4 shrink-0 rtl:rotate-180";

/* -------------------------------- Page -------------------------------- */

export default function CurriculumHub({ locale = "en" }: { locale?: string }) {
  const isAr = locale === "ar";
  const tx = (en: string, ar: string) => (isAr ? ar : en);
  const base = `/${locale}`;

  const lessons = NOOR_AL_BAYAN_COURSE.lessons;
  const total = lessons.length;
  const hours = Math.max(1, Math.round(lessons.reduce((a, l) => a + (l.estimatedMinutes || 25), 0) / 60));
  const firstLessonHref = `${base}/curriculum/noor-al-bayan/short-vowels-harakat`;

  const display = isAr ? amiri.className : dmSerif.className;
  const headingCls = `${display} ${isAr ? "font-bold leading-[1.45]" : "font-normal leading-[1.08] tracking-[-0.01em]"}`;

  const stats = [
    { v: "500+", l: tx("Students taught", "طالب وطالبة") },
    { v: String(total), l: tx("Free interactive lessons", "درسًا تفاعليًا مجانيًا") },
    { v: "84+", l: tx("Audio tiles, instant Arabic speech", "بطاقة صوتية بنطق عربي فوري") },
    { v: tx("1-on-1", "فردي"), l: tx("Live Zoom classes, certified teachers", "حصص Zoom مباشرة مع معلمين معتمدين") },
  ];

  const features = [
    {
      icon: Presentation,
      title: tx("Visual slides", "شرائح بصرية"),
      text: tx("Clear visual slides replace PowerPoint, for teachers in class and kids at home.", "شرائح بصرية واضحة تغني عن PowerPoint، للمعلم في الحصة وللطفل في البيت."),
    },
    {
      icon: Volume2,
      title: tx("84+ audio tiles", "أكثر من 84 بطاقة صوتية"),
      text: tx("Tap a tile and hear the Arabic instantly.", "المس البطاقة لتسمع النطق العربي فورًا."),
    },
    {
      icon: Layers,
      title: tx("Word X-Ray Lab", "مختبر تحليل الكلمات"),
      text: tx("See every word broken down syllable by syllable.", "شاهد كل كلمة مقسّمة إلى مقاطعها مقطعًا مقطعًا."),
    },
    {
      icon: Gamepad2,
      title: tx("Mastery games", "ألعاب الإتقان"),
      text: tx("Earn stars and badges as each lesson is mastered.", "اكسب النجوم والشارات كلما أتقنت درسًا."),
    },
  ];

  const courses = [
    {
      id: "noor-al-bayan",
      available: true,
      accent: "from-[#0D9488] to-[#059669]",
      title: "Noor Al-Bayan: Learn to Read Quran",
      titleAr: "مَنْهَجُ نُورِ البَيَانِ التَّفَاعُلِيّ",
      desc: tx(
        `${total} interactive visual lessons taking children from single Arabic letters and short vowels (Harakat) to reading full Quranic verses with confidence.`,
        `${total} درسًا بصريًا تفاعليًا ينقل الطفل من الحروف العربية المفردة والحركات القصيرة إلى قراءة آيات القرآن كاملةً بثقة.`
      ),
      meta: [tx(`${total} lessons`, `${total} درسًا`), tx(`~${hours} hours`, `حوالي ${hours} ساعات`), tx("Ages 7–14", "من 7 إلى 14 سنة")],
      ageRange: "7-14",
      href: `${base}/curriculum/noor-al-bayan`,
      image: "/Tajwedo-Public-Assets/curriculum-Imag/Quran Recitation.webp",
    },
    {
      id: "tajweed-mastery",
      available: false,
      accent: "from-[#0284C7] to-[#38BDF8]",
      title: "Interactive Tajweed Rules for Kids",
      titleAr: "أَحْكَامُ التَّجْوِيدِ المُصَوَّرَة",
      desc: tx(
        "Visual mouth articulation diagrams (Makharij), Noon & Meem Sakinah rules, Madd rules, and color-coded Juz Amma practice.",
        "رسوم توضيحية لمخارج الحروف، وأحكام النون والميم الساكنتين، وأحكام المدّ، وتدريب ملوّن على جزء عمّ."
      ),
      meta: [tx("10 visual modules", "10 وحدات بصرية"), tx("Ages 8–14", "من 8 إلى 14 سنة")],
      ageRange: "8-14",
      href: `${base}/book-trial`,
      image: "/Tajwedo-Public-Assets/curriculum-Imag/Tajweed.webp",
    },
    {
      id: "arabic-for-kids",
      available: false,
      accent: "from-[#FF5A1F] to-[#F59E0B]",
      title: "Quranic & Modern Standard Arabic",
      titleAr: "اللُّغَةُ العَرَبِيَّةُ لِلأَطْفَال",
      desc: tx(
        "Build a rich vocabulary of 300+ essential Quranic and everyday Arabic words, sentence building, and conversational confidence.",
        "ثروة لغوية من أكثر من 300 كلمة قرآنية ويومية أساسية، مع بناء الجمل والثقة في المحادثة."
      ),
      meta: [tx("15 interactive units", "15 وحدة تفاعلية"), tx("Ages 7–14", "من 7 إلى 14 سنة")],
      ageRange: "7-14",
      href: `${base}/book-trial`,
      image: "/Tajwedo-Public-Assets/curriculum-Imag/Arabic Language.webp",
    },
    {
      id: "islamic-studies",
      available: false,
      accent: "from-[#7C3AED] to-[#A855F7]",
      title: "Islamic Studies, Duas & Seerah",
      titleAr: "الدِّرَاسَاتُ الإِسْلَامِيَّةُ وَالأَدْعِيَة",
      desc: tx(
        "Age-appropriate lessons covering the 5 Pillars of Islam, daily Sunnah Duas, Prophet stories, and noble Islamic manners (Akhlaq).",
        "دروس مناسبة للعمر عن أركان الإسلام الخمسة، وأدعية السنّة اليومية، وقصص السيرة النبوية، ومكارم الأخلاق الإسلامية."
      ),
      meta: [tx("12 illustrated lessons", "12 درسًا مصوّرًا"), tx("Ages 7–14", "من 7 إلى 14 سنة")],
      ageRange: "7-14",
      href: `${base}/book-trial`,
      image: "/Tajwedo-Public-Assets/curriculum-Imag/Islamic Studies.webp",
    },
  ];
  const [flagship, ...upcoming] = courses;

  const faqs = [
    {
      q: tx("Is Noor Al-Bayan really free?", "هل منهج نور البيان مجاني فعلًا؟"),
      a: tx(`Yes. All ${total} interactive Noor Al-Bayan lessons are free and open to use.`, `نعم. جميع دروس نور البيان التفاعلية (${total} درسًا) مجانية ومتاحة للجميع.`),
    },
    {
      q: tx("What age is the curriculum for?", "لأي عمر هذا المنهج؟"),
      a: tx("It is built for children aged 7–14 who don't speak Arabic. It starts from single letters, so no prior Arabic is needed.", "صُمّم للأطفال من 7 إلى 14 سنة غير الناطقين بالعربية. يبدأ من الحروف المفردة، فلا حاجة لأي معرفة سابقة بالعربية."),
    },
    {
      q: tx("Does my child need a teacher?", "هل يحتاج طفلي إلى معلم؟"),
      a: tx("Children can practice at home on their own. Our certified teachers also use the same lessons live in 1-on-1 Zoom classes.", "يستطيع الطفل التدرّب في البيت وحده. ويستخدم معلمونا المعتمدون الدروس نفسها مباشرةً في حصص Zoom الفردية."),
    },
    {
      q: tx("When will the other three courses launch?", "متى تتوفر الدورات الثلاث الأخرى؟"),
      a: tx("Tajweed, Arabic and Islamic Studies are coming soon as interactive courses. The content is already taught live in 1-on-1 Zoom classes today.", "دورات التجويد واللغة العربية والدراسات الإسلامية قادمة قريبًا كدورات تفاعلية. ومحتواها يُدرَّس بالفعل الآن مباشرةً في حصص Zoom الفردية."),
    },
    {
      q: tx("How do I book a free trial class?", "كيف أحجز حصة تجريبية مجانية؟"),
      a: tx("Use the Book a Free 1-on-1 Trial button on this page and choose a time that suits you.", "اضغط زر حجز الحصة التجريبية المجانية الفردية في هذه الصفحة واختر الموعد المناسب لك."),
    },
  ];

  const steps = [
    { t: tx("Start free", "ابدأ مجانًا"), d: tx(`Open Lesson 1 of ${total} and begin today.`, `افتح الدرس الأول من ${total} وابدأ اليوم.`) },
    { t: tx("Practice daily", "تدرّب يوميًا"), d: tx("Audio tiles and mastery games make practice stick.", "البطاقات الصوتية وألعاب الإتقان تثبّت التعلّم.") },
    { t: tx("Add a live teacher", "أضف معلمًا مباشرًا"), d: tx("Book a 1-on-1 Zoom class whenever you're ready.", "احجز حصة Zoom فردية متى شئت.") },
  ];

  /* ------------------------------ SEO schema ----------------------------- */

  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://tajwedo.com").replace(/\/$/, "");
  const provider = { "@type": "EducationalOrganization", name: "Tajwedo Institute", url: siteUrl };
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ItemList",
        name: tx("Tajwedo courses", "دورات تجويدو"),
        itemListElement: courses.map((c, i) => ({
          "@type": "ListItem",
          position: i + 1,
          item: {
            "@type": "Course",
            name: c.title,
            description: c.desc,
            url: `${siteUrl}${c.available ? c.href : `${base}/curriculum`}`,
            provider,
            typicalAgeRange: c.ageRange,
            isAccessibleForFree: c.available,
          },
        })),
      },
      {
        "@type": "FAQPage",
        mainEntity: faqs.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      },
    ],
  };

  return (
    <div className="min-h-screen w-full bg-[#FBF8F2] font-sans text-slate-900 dark:bg-[#0B0F19] dark:text-slate-100">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />

      <main id="main-content">
        {/* ================================ HERO (unchanged) ================================ */}
        <section aria-labelledby="hub-title" className="relative isolate overflow-hidden border-b border-stone-200 pt-28 dark:border-white/10 sm:pt-32">
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
            <div className="absolute inset-0 bg-[radial-gradient(60%_55%_at_85%_0%,rgba(200,169,110,0.24),transparent)] dark:bg-[radial-gradient(60%_55%_at_85%_0%,rgba(13,148,136,0.24),transparent)]" />
            <div className={`absolute inset-0 opacity-40 dark:opacity-25 ${PATTERN_MASK}`} style={{ backgroundImage: PATTERN_URL }} />
          </div>

          <div className={`${WRAP} grid items-center gap-14 pb-16 lg:grid-cols-[1.05fr_0.95fr] lg:pb-20`}>
            <div>
              <p className="inline-flex items-center gap-2 rounded-full border border-[#C8A96E]/50 bg-white/60 px-4 py-1.5 text-sm font-semibold text-[#0D4F4F] dark:bg-white/5 dark:text-[#E8C56A]">
                <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                {tx("Tajwedo Interactive Learning Studio", "استوديو تجويدو للتعلّم التفاعلي")}
              </p>

              <h1 id="hub-title" className={`mt-6 text-[2.5rem] sm:text-6xl ${headingCls} ${INK}`}>
                {tx("Interactive Quran & Arabic ", "منهج تفاعلي لتعليم القرآن واللغة العربية ")}
                <span className={GOLD_TEXT}>{tx("Curriculum for Kids", "للأطفال")}</span>
              </h1>

              <p className={`mt-6 max-w-xl text-lg leading-relaxed ${MUTED}`}>
                {tx(
                  "Built for non-Arabic-speaking children (ages 7–14) to practice at home, and used live by our certified teachers in 1-on-1 Zoom classes.",
                  "مصمَّم للأطفال غير الناطقين بالعربية (من 7 إلى 14 سنة) ليتدرّبوا في البيت، ويستخدمه معلمونا المعتمدون مباشرةً في حصص Zoom الفردية."
                )}
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link href={flagship.href} className={BTN_PRIMARY}>
                  <span>{tx(`Start the free course (${total} lessons)`, `ابدأ الدورة المجانية (${total} درسًا)`)}</span>
                  <ArrowRight aria-hidden="true" className={ARROW} />
                </Link>
                <Link href={`${base}/book-trial`} className={BTN_SECONDARY}>
                  {tx("Book a free 1-on-1 trial", "احجز حصة تجريبية فردية مجانية")}
                </Link>
              </div>

              <ul className={`mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm font-semibold ${MUTED}`}>
                {[tx("Ages 7–14", "من 7 إلى 14 سنة"), tx(`${total} free lessons`, `${total} درسًا مجانيًا`), tx("Certified teachers", "معلمون معتمدون")].map((item) => (
                  <li key={item} className="inline-flex items-center gap-2">
                    <CheckCircle2 aria-hidden="true" className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="relative mx-auto w-full max-w-md lg:mx-0 lg:justify-self-end">
              <div aria-hidden="true" className="absolute inset-0 translate-x-3 translate-y-3 rounded-3xl border border-[#C8A96E]/50 rtl:-translate-x-3" />
              <div className={`relative rounded-3xl p-5 shadow-[0_24px_60px_-24px_rgba(13,79,79,0.35)] sm:p-6 ${CARD}`}>
                <div aria-hidden="true">
                  <div className="flex items-center justify-between text-sm font-semibold">
                    <span className={INK}>{tx("Lesson 1 · Short Vowels", "الدرس 1 · الحركات القصيرة")}</span>
                    <span className={MUTED}>{tx(`1 of ${total}`, `1 من ${total}`)}</span>
                  </div>
                  <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-stone-200 dark:bg-white/10">
                    <div className="h-full w-[8%] rounded-full bg-[#0D9488]" />
                  </div>
                  <div dir="rtl" lang="ar" className="mt-6 grid grid-cols-3 gap-3">
                    {[
                      { ch: "بَ", rom: "ba", active: true },
                      { ch: "بِ", rom: "bi", active: false },
                      { ch: "بُ", rom: "bu", active: false },
                    ].map((tile) => (
                      <div
                        key={tile.rom}
                        className={`relative flex aspect-[4/5] flex-col items-center justify-center rounded-2xl border ${
                          tile.active
                            ? "border-transparent bg-[#0D4F4F] text-white dark:bg-teal-400 dark:text-slate-950"
                            : "border-stone-200 bg-stone-50 text-[#0D4F4F] dark:border-white/10 dark:bg-white/5 dark:text-white"
                        }`}
                      >
                        {tile.active && (
                          <>
                            <span className="absolute inset-0 rounded-2xl ring-2 ring-[#E8C56A]/70 motion-safe:animate-pulse" />
                            <Volume2 className="absolute end-2 top-2 h-4 w-4 opacity-80" />
                          </>
                        )}
                        <span className={`${amiri.className} text-5xl leading-none`}>{tile.ch}</span>
                        <span dir="ltr" className="mt-3 text-sm font-semibold opacity-80">{tile.rom}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-5 flex items-center gap-1 text-[#C8A96E]">
                    <Star className="h-5 w-5 fill-current" />
                    <Star className="h-5 w-5 fill-current" />
                    <Star className="h-5 w-5 text-stone-300 dark:text-white/20" />
                    <span className={`ms-2 text-sm font-semibold ${MUTED}`}>{tx("Earn stars & badges", "اكسب النجوم والشارات")}</span>
                  </div>
                </div>
                <Link
                  href={firstLessonHref}
                  className={`mt-5 flex min-h-11 items-center justify-center gap-2 rounded-xl border border-[#0D4F4F]/20 text-sm font-bold ${INK} transition hover:bg-[#0D4F4F]/5 dark:border-white/15 dark:hover:bg-white/5 ${FOCUS}`}
                >
                  <span>{tx("Try this lesson free", "جرّب هذا الدرس مجانًا")}</span>
                  <ArrowRight aria-hidden="true" className={ARROW} />
                </Link>
              </div>
            </div>
          </div>

          <dl className={`${WRAP} grid grid-cols-2 gap-x-6 gap-y-8 pb-14 lg:grid-cols-4 lg:gap-x-10`}>
            {stats.map((s) => (
              <div key={s.l} className="flex flex-col-reverse gap-1 border-t border-[#C8A96E]/50 pt-4">
                <dt className={`text-sm font-medium leading-snug ${MUTED}`}>{s.l}</dt>
                <dd className={`text-4xl ${display} ${isAr ? "font-bold" : "font-normal"} ${INK}`}>{s.v}</dd>
              </div>
            ))}
          </dl>
        </section>

        {/* ================================ COURSES ================================ */}
        <section id="courses" aria-labelledby="courses-title" className={`${WRAP} scroll-mt-24 py-20 sm:py-28`}>
          <div className="grid gap-6 lg:grid-cols-2 lg:items-end">
            <div>
              <Eyebrow>{tx("Our courses", "دوراتنا")}</Eyebrow>
              <h2 id="courses-title" className={`mt-4 text-3xl sm:text-5xl ${headingCls} ${INK}`}>
                {tx("Four courses, one steady climb", "أربع دورات، وصعود ثابت")}
              </h2>
            </div>
            <p className={`text-base leading-relaxed ${MUTED}`}>
              {tx(
                "Start with the free reading course today. Each course builds on the one before it, taking your child from first letters to fluent recitation.",
                "ابدأ اليوم بدورة القراءة المجانية. تبني كل دورة على ما قبلها، لتأخذ طفلك من الحروف الأولى إلى التلاوة بطلاقة."
              )}
            </p>
          </div>

          {/* Featured: available course */}
          <article className={`mt-12 grid overflow-hidden rounded-3xl ${CARD} shadow-[0_24px_60px_-28px_rgba(13,79,79,0.35)] lg:grid-cols-[1fr_1fr]`}>
            <div className="relative aspect-[16/10] bg-slate-900 lg:aspect-auto lg:min-h-[360px]">
              <Image src={flagship.image} alt="" fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" priority />
              <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/10 to-transparent" />
              <div aria-hidden="true" className={`absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r ${flagship.accent}`} />
              <span lang="ar" dir="rtl" className={`${amiri.className} absolute bottom-4 end-5 text-2xl font-bold text-amber-200`}>
                {flagship.titleAr}
              </span>
            </div>
            <div className="flex flex-col justify-between gap-8 p-6 sm:p-10">
              <div className="space-y-5">
                <span className="inline-block rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800 dark:bg-emerald-400/15 dark:text-emerald-300">
                  {tx("Available now · 100% free", "متاح الآن · مجاني بالكامل")}
                </span>
                <h3 className={`text-3xl sm:text-4xl ${display} ${isAr ? "font-bold leading-snug" : "font-normal leading-tight"} ${INK}`}>
                  {isAr ? flagship.titleAr : flagship.title}
                </h3>
                <p className={`text-base leading-relaxed ${MUTED}`}>{flagship.desc}</p>
                <p className={`flex flex-wrap gap-x-5 gap-y-2 text-sm font-semibold ${MUTED}`}>
                  <span className="inline-flex items-center gap-2"><BookOpen aria-hidden="true" className="h-4 w-4 text-[#0D9488]" />{flagship.meta[0]}</span>
                  <span className="inline-flex items-center gap-2"><Clock aria-hidden="true" className="h-4 w-4 text-[#0D9488]" />{flagship.meta[1]}</span>
                  <span className="inline-flex items-center gap-2"><Users aria-hidden="true" className="h-4 w-4 text-[#0D9488]" />{flagship.meta[2]}</span>
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link href={flagship.href} className={BTN_PRIMARY}>
                  <span>{tx("View course & lessons", "استعرض الدورة ودروسها")}</span>
                  <ArrowRight aria-hidden="true" className={ARROW} />
                </Link>
                <Link href={firstLessonHref} className={BTN_SECONDARY}>{tx("Start Lesson 1", "ابدأ الدرس الأول")}</Link>
              </div>
            </div>
          </article>

          {/* Upcoming courses */}
          <ul className="mt-6 grid gap-6 md:grid-cols-3">
            {upcoming.map((c) => (
              <li key={c.id}>
                <article className={`flex h-full flex-col overflow-hidden rounded-2xl ${CARD}`}>
                  <div className="relative aspect-[16/10] bg-slate-900">
                    <Image src={c.image} alt="" fill sizes="(min-width: 768px) 33vw, 100vw" className="object-cover" />
                    <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/10 to-transparent" />
                    <div aria-hidden="true" className={`absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r ${c.accent}`} />
                    <span lang={isAr ? "en" : "ar"} dir={isAr ? "ltr" : "rtl"} className={`absolute bottom-3 end-4 text-base font-bold text-amber-200 ${isAr ? "" : amiri.className}`}>
                      {isAr ? c.title : c.titleAr}
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col gap-4 p-6">
                    <div className="flex flex-wrap gap-2 text-xs font-bold">
                      <span className="rounded-full bg-amber-100 px-3 py-1 text-amber-900 dark:bg-amber-400/15 dark:text-amber-200">
                        {tx("Interactive version coming soon", "النسخة التفاعلية قريبًا")}
                      </span>
                      <span className="rounded-full bg-sky-100 px-3 py-1 text-sky-900 dark:bg-sky-400/15 dark:text-sky-200">
                        {tx("Taught live today", "تُدرَّس مباشرةً الآن")}
                      </span>
                    </div>
                    <h3 className={isAr ? `${amiri.className} text-2xl font-bold leading-snug ${INK}` : `${display} text-2xl font-normal leading-tight ${INK}`}>
                      {isAr ? c.titleAr : c.title}
                    </h3>
                    <p className={`text-[15px] leading-relaxed ${MUTED}`}>{c.desc}</p>
                    <p className={`mt-auto flex flex-wrap gap-x-4 gap-y-1 pt-2 text-sm font-semibold ${MUTED}`}>
                      {c.meta.map((m) => (<span key={m}>{m}</span>))}
                    </p>
                    <Link href={c.href} className={`${BTN_SECONDARY} w-full`}>
                      <span>{tx("Enroll in live 1-on-1 classes", "سجّل في الحصص المباشرة الفردية")}</span>
                      <ArrowRight aria-hidden="true" className={ARROW} />
                    </Link>
                  </div>
                </article>
              </li>
            ))}
          </ul>
        </section>

        {/* ============================ STUDIO TOOLS ============================ */}
        <section aria-labelledby="studio-title" className="border-y border-stone-200 bg-white/60 py-20 dark:border-white/10 dark:bg-white/[0.02] sm:py-28">
          <div className={`${WRAP} grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20`}>
            <div className="lg:sticky lg:top-32 lg:self-start">
              <Eyebrow>{tx("Inside the learning studio", "داخل استوديو التعلّم")}</Eyebrow>
              <h2 id="studio-title" className={`mt-4 text-3xl sm:text-4xl ${headingCls} ${INK}`}>
                {tx("Everything a Quran lesson needs, in one place", "كل ما يحتاجه درس القرآن في مكان واحد")}
              </h2>
              <p className={`mt-4 text-base leading-relaxed ${MUTED}`}>
                {tx("Kids practice at home. Teachers teach live with the very same tools.", "يتدرّب الأطفال في البيت، ويدرّس المعلمون مباشرةً بالأدوات نفسها.")}
              </p>
            </div>
            <ul className="divide-y divide-stone-200 border-y border-stone-200 dark:divide-white/10 dark:border-white/10">
              {features.map((f) => {
                const Icon = f.icon;
                return (
                  <li key={f.title} className="flex items-start gap-5 py-7 sm:gap-8">
                    <span aria-hidden="true" className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#0D4F4F]/10 text-[#0D6B66] dark:bg-white/5 dark:text-teal-300">
                      <Icon className="h-5 w-5" />
                    </span>
                    <div className="flex-1">
                      <h3 className={`text-lg font-bold ${INK}`}>{f.title}</h3>
                      <p className={`mt-1.5 text-[15px] leading-relaxed ${MUTED}`}>{f.text}</p>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </section>

        {/* ================================= FAQ ================================= */}
        <section aria-labelledby="faq-title" className={`${WRAP} grid gap-12 py-20 sm:py-28 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20`}>
          <div>
            <Eyebrow>{tx("Good to know", "معلومات مفيدة")}</Eyebrow>
            <h2 id="faq-title" className={`mt-4 text-3xl sm:text-4xl ${headingCls} ${INK}`}>
              {tx("Questions parents ask", "أسئلة يطرحها أولياء الأمور")}
            </h2>
          </div>
          <div className="divide-y divide-stone-200 border-y border-stone-200 dark:divide-white/10 dark:border-white/10">
            {faqs.map((f) => (
              <details key={f.q} className="group py-5">
                <summary className={`flex cursor-pointer list-none items-center justify-between gap-4 rounded-lg text-start text-lg font-bold ${INK} [&::-webkit-details-marker]:hidden ${FOCUS}`}>
                  {f.q}
                  <Plus aria-hidden="true" className="h-5 w-5 shrink-0 text-[#A8832F] transition-transform group-open:rotate-45 motion-reduce:transition-none dark:text-[#E8C56A]" />
                </summary>
                <p className={`mt-3 max-w-2xl text-base leading-relaxed ${MUTED}`}>{f.a}</p>
              </details>
            ))}
          </div>
        </section>

        {/* =============================== FINAL CTA =============================== */}
        <section aria-labelledby="cta-title" className="relative isolate overflow-hidden bg-[#0D4F4F] text-white dark:bg-[#0A3333]">
          <div aria-hidden="true" className={`pointer-events-none absolute inset-0 -z-10 opacity-25 ${PATTERN_MASK}`} style={{ backgroundImage: PATTERN_URL }} />
          <div className={`${WRAP} grid gap-12 py-20 sm:py-24 lg:grid-cols-[1.1fr_0.9fr] lg:items-center`}>
            <div>
              <h2 id="cta-title" className={`text-3xl sm:text-5xl ${display} ${isAr ? "font-bold leading-[1.45]" : "font-normal leading-[1.1]"}`}>
                {tx("Start free today. Add a live teacher when you're ready.", "ابدأ مجانًا اليوم، وأضف معلمًا مباشرًا حين تكون جاهزًا.")}
              </h2>
              <p className="mt-5 max-w-xl text-lg leading-relaxed text-teal-100">
                {tx("Your child can begin Lesson 1 in minutes, and a certified teacher is one booking away.", "يستطيع طفلك بدء الدرس الأول في دقائق، ومعلم معتمد على بُعد حجز واحد.")}
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href={`${base}/book-trial`} className={BTN_GOLD}>{tx("Book a free 1-on-1 trial", "احجز حصة تجريبية فردية مجانية")}</Link>
                <Link href={firstLessonHref} className={BTN_GHOST}>
                  <span>{tx("Start Lesson 1", "ابدأ الدرس الأول")}</span>
                  <ArrowRight aria-hidden="true" className={ARROW} />
                </Link>
              </div>
            </div>
            <ol className="space-y-5">
              {steps.map((s, i) => (
                <li key={s.t} className="flex items-start gap-4">
                  <span aria-hidden="true" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#E8C56A] text-base font-bold text-[#072B28]">{i + 1}</span>
                  <div>
                    <h3 className="text-lg font-bold">{s.t}</h3>
                    <p className="mt-0.5 text-[15px] leading-relaxed text-teal-100">{s.d}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>
      </main>
    </div>
  );
}