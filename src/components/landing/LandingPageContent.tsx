"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  CheckCircle2, Shield, Star, MessageCircle, ShieldCheck, ChevronDown,
  ExternalLink, Play, X, ArrowRight, Check, Minus, Volume2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Container from "@/components/shared/Container";
import { WHATSAPP_LINK } from "@/lib/constants";
import { useLocale } from "@/hooks/useLocale";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";
import { Link } from "@/i18n/navigation";
import CountrySelect from "@/components/book-trial/CountrySelect";
import PhoneInput from "@/components/book-trial/PhoneInput";
import { findCountryByName } from "@/components/book-trial/countries-data";
import { trackEvent, trackWhatsAppClick } from "@/components/shared/GoogleTagManager";

/* ═══ عدّل دول قبل النشر ═══ */
const PRICE_FROM = "$9";
const SLOTS_LEFT = 6;
const TEACHER_IMG = "/Tajwedo-Public-Assets/teachers";

export default function LandingPageContent() {
  const { isRTL } = useLocale();
  const [mounted, setMounted] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [quickPhone, setQuickPhone] = useState("");
  const [faqOpen, setFaqOpen] = useState<number | null>(0);
  const [activeRule, setActiveRule] = useState<number>(1);
  const [activeVideo, setActiveVideo] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "", phone: "", country: "United States",
    age: "", gender: "", course: "kids-program",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const t = (en: string, ar: string) => (isRTL ? ar : en);
  const set = (f: string, v: string) => {
    setForm((p) => ({ ...p, [f]: v }));
    setErrors((p) => ({ ...p, [f]: "" }));
  };

  const quickStart = () => {
    if (quickPhone.trim().length < 6) {
      toast.error(t("Enter your WhatsApp number", "اكتب رقم الواتساب"));
      return;
    }
    const url = `${WHATSAPP_LINK}?text=${encodeURIComponent(
      t(`Assalamu Alaikum, I'd like the free 30-minute assessment. My number: ${quickPhone}`,
        `السلام عليكم، أريد جلسة التقييم المجانية. رقمي: ${quickPhone}`)
    )}`;
    trackEvent("generate_lead", { form_name: "hero_quick_start", currency: "USD", value: 1 });
    trackWhatsAppClick({ button_id: "hero_quick_start", button_location: "hero", click_url: url });
    window.open(url, "_blank");
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = t("Name is required", "الاسم مطلوب");
    if (!form.phone.trim()) e.phone = t("WhatsApp number required", "رقم الواتساب مطلوب");
    const a = Number(form.age);
    if (!form.age.trim() || Number.isNaN(a) || a < 3 || a > 100) e.age = t("Enter a valid age", "أدخل عمراً صحيحاً");
    if (!form.gender) e.gender = t("Choose one", "اختر واحد");
    setErrors(e);
    return !Object.keys(e).length;
  };

  const handleSubmit = (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validate()) { toast.error(t("Check the highlighted fields", "راجع الحقول المحددة")); return; }
    setLoading(true);
    const waUrl = `${WHATSAPP_LINK}?text=${encodeURIComponent(
`*Free Assessment | Tajwedo Institute*
*Name:* ${form.name}
*WhatsApp:* ${form.phone}
*Country:* ${form.country}
*Age:* ${form.age}
*Teacher:* ${form.gender}
*Program:* ${form.course}`)}`;
    trackEvent("generate_lead", {
      form_name: "ad_landing_page", service: form.course, country: form.country,
      age: form.age, gender: form.gender, currency: "USD", value: 1,
    });
    trackWhatsAppClick({ button_id: "lp_form_submit", button_location: "ad_landing_page", click_url: waUrl });
    setTimeout(() => { setLoading(false); setSubmitted(true); window.open(waUrl, "_blank"); }, 300);
  };

  const waDirect = `${WHATSAPP_LINK}?text=${encodeURIComponent(
    t("Assalamu Alaikum, I have a question about your classes.", "السلام عليكم، عندي سؤال عن الحصص.")
  )}`;

  /* ═══ المحتوى ═══ */

  const ayah = [
    { id: 0, ar: "بِسْمِ", rule: null as string | null, name: "", note: "" },
    { id: 1, ar: "ٱللَّهِ", rule: "jalalah",
      name: t("Tafkheem — the heavy laam", "تفخيم اللام"),
      note: t("After a fat-ha, the laam of Allah is pronounced full and heavy from the back of the mouth. Saying it thin is the mistake most English speakers are never corrected on.", "بعد الفتحة تُنطق لام لفظ الجلالة مفخّمة من أقصى الفم. ترقيقها خطأ شائع لا يُصحَّح لمعظم الناطقين بالإنجليزية.") },
    { id: 2, ar: "ٱلرَّحْمَٰنِ", rule: "madd",
      name: t("Madd — hold it two counts", "مدّ — حركتان"),
      note: t("The small standing alif stretches the vowel for two counts. Not one, not four. Here, length carries meaning.", "الألف الخنجرية تُطيل الحركة بمقدار حركتين. لا واحدة ولا أربع. الطول هنا معنى.") },
    { id: 3, ar: "ٱلرَّحِيمِ", rule: "shadda",
      name: t("Shadda — double the letter", "شدّة — تضعيف الحرف"),
      note: t("The raa is pressed twice and held on the tongue. Skipping it changes the word, and most self-taught readers skip it.", "الراء تُنطق مضعّفة ويُحبس عليها اللسان. إهمالها يغيّر الكلمة، ومعظم من تعلّم ذاتياً يهملها.") },
  ];
  const ruleColor: Record<string, string> = {
    jalalah: "var(--r-jalalah)", madd: "var(--r-madd)", shadda: "var(--r-shadda)",
  };
  const current = ayah.find((a) => a.id === activeRule);

  const videos = [
    { id: "v1", youtubeId: "", duration: "2:15", tag: t("Kids", "أطفال"),
      title: t("A first lesson with a 7-year-old", "أول حصة مع طفل عمره 7 سنين"),
      desc: t("Letters, not pages. Watch how slowly we actually start.", "حروف مش صفحات. شوف بنبدأ ببطء إزاي."),
      poster: "/Tajwedo-Public-Assets/Services/Kids Program.webp" },
    { id: "v2", youtubeId: "", duration: "3:40", tag: t("Tajweed", "تجويد"),
      title: t("Fixing an adult's madd in real time", "تصحيح المدّ لطالب كبير مباشرة"),
      desc: t("The teacher interrupts mid-word. That is the method.", "المعلم بيقاطع في نص الكلمة. دي الطريقة."),
      poster: "/Tajwedo-Public-Assets/Services/Tajweed.webp" },
    { id: "v3", youtubeId: "", duration: "1:50", tag: t("New Muslims", "مسلمون جدد"),
      title: t("Teaching Al-Fatiha to a revert", "تعليم الفاتحة لمسلم جديد"),
      desc: t("Entirely in English, from the first letter.", "بالإنجليزي بالكامل من أول حرف."),
      poster: "/Tajwedo-Public-Assets/Services/New Muslims.webp" },
  ];

  const teachers = [
    { name: "Ustadh Ahmad H.", img: `${TEACHER_IMG}/1.webp`,
      cred: t("Ijazah · Hafs", "إجازة · حفص"), note: t("Boys 6–14", "أولاد 6–14") },
    { name: "Ustadha Fatimah R.", img: `${TEACHER_IMG}/2.webp`,
      cred: t("Ijazah · 9 yrs", "إجازة · 9 سنوات"), note: t("Sisters & girls", "أخوات وبنات") },
    { name: "Ustadh Yusuf M.", img: `${TEACHER_IMG}/3.webp`,
      cred: t("Tajweed · Al-Azhar", "تجويد · الأزهر"), note: t("Adults, reverts", "كبار ومسلمون جدد") },
  ];

  const comparison = [
    { p: t("Who verified the teacher", "مين تحقق من المعلم"),
      us: t("We check the ijazah chain before hiring", "بنتحقق من سند الإجازة قبل التعيين"),
      them: t("Nobody. It is a profile claim.", "محدش. مجرد كلام في بروفايل.") },
    { p: t("Same teacher every week", "نفس المعلم كل أسبوع"), us: true, them: false },
    { p: t("Written progress report", "تقرير تقدّم مكتوب"),
      us: t("Every week, to your WhatsApp", "أسبوعي على واتساب"), them: false },
    { p: t("Parents may join unannounced", "ولي الأمر يحضر بدون إخطار"), us: true, them: false },
    { p: t("Curriculum", "المنهج"),
      us: t("Fixed path: letters → fluency → hifz", "مسار ثابت: حروف ← طلاقة ← حفظ"),
      them: t("Whatever that tutor prefers", "حسب اجتهاد كل معلم") },
  ];

  const safeguards = [
    t("Sit in on any lesson, any time, without telling us first.", "احضر أي حصة في أي وقت بدون ما تبلغنا."),
    t("Female teachers for sisters and girls by default, not on request.", "معلمات للأخوات والبنات افتراضياً، مش بناءً على طلب."),
    t("Every teacher is interviewed and reference-checked before meeting a child.", "كل معلم يمر بمقابلة وتحقق من المراجع قبل مقابلة أي طفل."),
    t("One teacher stays with your child. No rotating strangers.", "معلم ثابت لطفلك. مفيش وجوه جديدة كل شوية."),
  ];

  const reviews = [
    { n: "Sarah Mitchell", w: "Birmingham, UK", a: "SM", p: t("Kids Quran", "قرآن للأطفال"),
      x: t("Two years of weekend madrasa and she still could not read a page alone. Four months here and she reads Juz Amma unaided. The weekly report is what convinced me.", "سنتين مدرسة نهاية أسبوع ومقدرتش تقرأ صفحة لوحدها. أربع شهور هنا وبتقرأ جزء عم بدون مساعدة. التقرير الأسبوعي هو اللي أقنعني.") },
    { n: "Bilal Hassan", w: "Houston, USA", a: "BH", p: t("Adult Tajweed", "تجويد للكبار"),
      x: t("I am 41 and was embarrassed to recite in jamaa'ah. My teacher never once made me feel slow. Madd finally makes sense.", "عندي 41 سنة وكنت محرج أقرأ في الجماعة. المعلم ولا مرة حسسني إني بطيء. المدّ أخيراً بقى واضح.") },
    { n: "Maryam K.", w: "Toronto, Canada", a: "MK", p: t("New Muslims", "مسلمون جدد"),
      x: t("I took shahadah last year knowing zero Arabic letters. They started at the alphabet in English, assuming nothing. I pray properly now.", "أسلمت السنة اللي فاتت ومكنتش أعرف حرف. بدأوا من الألف بالإنجليزي بدون افتراضات. دلوقتي بصلي صح.") },
    { n: "Imran Patel", w: "Sydney, Australia", a: "IP", p: t("Hifz", "حفظ"),
      x: t("Timezone was my worry. My son is at 5pm Sydney, same teacher, same slot, every week since March.", "التوقيت كان همي. ابني الساعة 5 بتوقيت سيدني، نفس المعلم ونفس الموعد من مارس.") },
  ];

  const steps = [
    { n: "1", t: t("Send your number", "ابعت رقمك"), b: t("One field. No card, no account.", "حقل واحد. بدون بطاقة ولا حساب.") },
    { n: "2", t: t("Pick a time", "اختر موعد"), b: t("We reply with slots in your timezone, usually within the hour.", "بنرد بمواعيد بتوقيتك، غالباً خلال ساعة.") },
    { n: "3", t: t("30-minute assessment", "تقييم 30 دقيقة"), b: t("A teacher listens and tells you the honest starting point.", "معلم يستمع ويقولك نقطة البداية بصدق.") },
    { n: "4", t: t("Decide after", "قرر بعدها"), b: t("You get a written plan. Enrol only if it makes sense.", "تستلم خطة مكتوبة. اشترك بس لو أقنعتك.") },
  ];

  const faqs = [
    { q: t("Is the assessment really free?", "التقييم مجاني فعلاً؟"),
      a: t("Yes. 30 minutes with a qualified teacher, no card, no account. Reading level cannot be judged from a form, so we do it properly.", "نعم. 30 دقيقة مع معلم مؤهل، بدون بطاقة ولا حساب. المستوى مينفعش يتحدد من استمارة.") },
    { q: t("How much are lessons?", "كام سعر الحصص؟"),
      a: t(`From ${PRICE_FROM} per 30-minute session, moving with how many lessons a week you take. Exact figure in writing after the assessment — no pressure on the call.`, `من ${PRICE_FROM} للحصة (30 دقيقة)، حسب عدد الحصص أسبوعياً. الرقم الدقيق مكتوب بعد التقييم بدون ضغط.`) },
    { q: t("My child speaks only English. Problem?", "ابني بيتكلم إنجليزي بس. مشكلة؟"),
      a: t("That is exactly who this is built for. Teachers explain in English and start Arabic from zero, assuming no background at all.", "ده بالظبط اللي المعهد متبني له. المعلمون يشرحون بالإنجليزي ويبدأون العربي من الصفر.") },
    { q: t("Are female teachers available?", "فيه معلمات؟"),
      a: t("Yes — assigned by default for sisters and girls, not something you have to ask for.", "نعم — بتتحدد افتراضياً للأخوات والبنات، مش محتاج تطلبها.") },
    { q: t("Can I change teacher?", "أقدر أغيّر المعلم؟"),
      a: t("Once, free, within the first month. Tell us and we reassign within 48 hours.", "مرة واحدة مجاناً خلال الشهر الأول. بلّغنا ونغيّر خلال 48 ساعة.") },
  ];

  return (
    <div dir={isRTL ? "rtl" : "ltr"} className="tw min-h-screen pb-24 sm:pb-0">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,600;9..144,700&family=Karla:wght@400;500;600;700&family=Amiri+Quran&display=swap');
        .tw{
          --night:#111C2E; --night-2:#0A1320; --veil:#1B2A42;
          --gold:#E3B45F; --gold-2:#C8993F;
          --paper:#FFFDF8; --line:#E6E0D4; --body:#2A2F3A; --mute:#6B7486;
          --go:#128C5E;
          --r-jalalah:#F0785A; --r-madd:#5FD1A8; --r-shadda:#9B8BEE;
          background:var(--paper); color:var(--body);
          font-family:'Karla',system-ui,sans-serif;
        }
        .tw h1,.tw h2,.tw h3,.tw .dsp{
          font-family:'Fraunces',Georgia,serif; font-optical-sizing:auto;
          letter-spacing:-0.018em; line-height:1.07;
        }
        .tw .quran{font-family:'Amiri Quran',serif; line-height:2.1}
        .tw :focus-visible{outline:2px solid var(--gold);outline-offset:3px;border-radius:6px}
        .tw .grain{
          background-image:radial-gradient(circle at 1px 1px,rgba(227,180,95,.16) 1px,transparent 0);
          background-size:26px 26px;
        }
        .tw .word{transition:color .18s ease, transform .18s ease; cursor:pointer}
        .tw .word:hover{transform:translateY(-3px)}
        @media (prefers-reduced-motion:reduce){.tw *{transition:none!important;animation:none!important}}
      `}</style>

      {/* ═══ HERO ═══ */}
      <section className="relative bg-[var(--night)] text-white overflow-hidden">
        <div className="absolute inset-0 grain opacity-60" />
        <div className="absolute -top-40 -end-40 w-[560px] h-[560px] rounded-full bg-[var(--veil)] blur-[120px] opacity-70" />

        <div className="relative border-b border-white/10">
          <Container>
            <div className="h-16 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Image src="/Tajwedo-Public-Assets/logo.webp" alt="Tajwedo" width={36} height={36}
                  className="object-contain" priority />
                <p className="dsp text-[18px] font-semibold">Tajwedo</p>
              </div>
              <a href="#book"
                className="text-[13px] font-semibold px-4 py-2.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 transition-colors">
                {t("Free assessment", "تقييم مجاني")}
              </a>
            </div>
          </Container>
        </div>

        <Container>
          <div className="relative py-14 md:py-20 grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">

            <div className="lg:col-span-6">
              <p className="inline-flex items-center gap-2 text-[12.5px] font-semibold text-[var(--gold)] bg-[var(--gold)]/10 border border-[var(--gold)]/25 rounded-full px-3.5 py-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--gold)]" />
                {t(`${SLOTS_LEFT} assessment slots left this week`, `${SLOTS_LEFT} مقاعد تقييم متبقية هذا الأسبوع`)}
              </p>

              <h1 className="mt-6 text-[40px] sm:text-[54px] lg:text-[60px] font-semibold">
                {t("These four words carry three rules.", "أربع كلمات فيها ثلاثة أحكام.")}
                <span className="block mt-2 text-[var(--gold)]">
                  {t("Most readers miss all three.", "معظم القرّاء يفوتونها كلها.")}
                </span>
              </h1>

              <p className="mt-6 text-[17px] leading-[1.7] text-white/65 max-w-[54ch]">
                {t(
                  "Tap any word to see what is hiding inside it. Then let a teacher with ijazah listen to your child read for thirty minutes, free.",
                  "دوس على أي كلمة تشوف الحكم اللي جواها. وبعدين خلي معلم بإجازة يسمع طفلك 30 دقيقة، مجاناً."
                )}
              </p>

              <div className="mt-9 max-w-[480px]">
                <div className="flex gap-2">
                  <input
                    type="tel" inputMode="tel" value={quickPhone}
                    onChange={(e) => setQuickPhone(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && quickStart()}
                    placeholder={t("Your WhatsApp number", "رقم الواتساب")}
                    aria-label={t("WhatsApp number", "رقم الواتساب")}
                    className="flex-1 min-w-0 px-5 py-4 rounded-xl bg-white/[0.07] border border-white/15 text-[15px] text-white placeholder:text-white/40 focus:outline-none focus:border-[var(--gold)]/60"
                  />
                  <button type="button" onClick={quickStart}
                    className="shrink-0 inline-flex items-center gap-2 px-6 py-4 rounded-xl bg-[var(--go)] hover:bg-[#0E7650] font-bold text-[15px] transition-colors">
                    <MessageCircle className="w-[18px] h-[18px]" />
                    <span className="hidden sm:inline">{t("Start", "ابدأ")}</span>
                  </button>
                </div>
                <p className="mt-3 text-[12.5px] text-white/45 flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-[var(--go)]" />
                  {t("No card, no account. We reply within the hour.", "بدون بطاقة ولا حساب. بنرد خلال ساعة.")}
                </p>
              </div>
            </div>

            {/* الآية التفاعلية */}
            <div className="lg:col-span-6">
              <div className="rounded-3xl border border-white/12 bg-gradient-to-b from-white/[0.08] to-white/[0.02] p-7 sm:p-9 backdrop-blur-sm">
                <p className="quran text-[34px] sm:text-[46px] text-center leading-[2] mb-2" dir="rtl">
                  {ayah.map((w) => (
                    <span
                      key={w.id}
                      role={w.rule ? "button" : undefined}
                      tabIndex={w.rule ? 0 : undefined}
                      onClick={() => w.rule && setActiveRule(w.id)}
                      onKeyDown={(e) => w.rule && e.key === "Enter" && setActiveRule(w.id)}
                      className={cn("word inline-block mx-1.5", !w.rule && "text-white/35 cursor-default")}
                      style={{
                        color: w.rule
                          ? (activeRule === w.id ? ruleColor[w.rule] : "rgba(255,255,255,.82)")
                          : undefined,
                        textShadow: w.rule && activeRule === w.id ? `0 0 34px ${ruleColor[w.rule]}55` : undefined,
                      }}
                    >
                      {w.ar}
                    </span>
                  ))}
                </p>

                <div className="mt-2 flex justify-center gap-2">
                  {ayah.filter((a) => a.rule).map((w) => (
                    <button key={w.id} type="button" onClick={() => setActiveRule(w.id)} aria-label={w.name}
                      className={cn("h-1.5 rounded-full transition-all",
                        activeRule === w.id ? "w-8" : "w-1.5 bg-white/25")}
                      style={activeRule === w.id && w.rule ? { background: ruleColor[w.rule] } : undefined} />
                  ))}
                </div>

                {current?.rule && (
                  <div className="mt-6 pt-6 border-t border-white/10">
                    <p className="text-[15px] font-bold mb-2" style={{ color: ruleColor[current.rule] }}>
                      {current.name}
                    </p>
                    <p className="text-[14.5px] leading-[1.75] text-white/65">{current.note}</p>
                  </div>
                )}

                <p className="mt-6 text-[12.5px] text-white/40 flex items-center gap-2">
                  <Volume2 className="w-3.5 h-3.5" />
                  {t("In a lesson, your teacher hears which of these you miss.", "في الحصة، معلمك بيسمع أنهي واحد فيهم بتفوته.")}
                </p>
              </div>
            </div>
          </div>

          <div className="relative border-t border-white/10 py-6 grid grid-cols-2 sm:grid-cols-4 gap-6">
            {[
              { k: "Al-Azhar", v: t("certified teachers", "معلمون معتمدون") },
              { k: "1-to-1", v: t("never group classes", "ولا مرة مجموعات") },
              { k: "30 min", v: t("free assessment", "تقييم مجاني") },
              { k: "48 hrs", v: t("to change teacher", "لتغيير المعلم") },
            ].map((s) => (
              <div key={s.k}>
                <p className="dsp text-[21px] font-semibold text-[var(--gold)]">{s.k}</p>
                <p className="text-[12.5px] text-white/50 mt-0.5">{s.v}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ═══ الفيديوهات ═══ */}
      <section className="py-16 sm:py-20">
        <Container>
          <div className="flex flex-wrap items-end justify-between gap-4 mb-9">
            <h2 className="text-[30px] sm:text-[40px] font-semibold text-[var(--night)] max-w-xl">
              {t("Watch a real lesson before you book one", "شوف حصة حقيقية قبل ما تحجز")}
            </h2>
            <p className="text-[14px] text-[var(--mute)] max-w-xs">
              {t("Recorded with parent permission. No actors, no script.", "مسجلة بإذن ولي الأمر. مفيش ممثلين ولا سكريبت.")}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            {videos.map((v) => (
              <button key={v.id} type="button" onClick={() => setActiveVideo(v.id)}
                className="group text-start rounded-2xl overflow-hidden border border-[var(--line)] bg-white hover:border-[var(--night)]/25 transition-colors">
                <div className="relative aspect-[16/10] bg-[var(--night)]">
                  <Image src={v.poster} alt={v.title} fill sizes="(max-width:768px) 100vw, 33vw"
                    className="object-cover opacity-70 group-hover:opacity-80 transition-opacity" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[var(--night)]/85 via-transparent to-transparent" />
                  <span className="absolute inset-0 grid place-items-center">
                    <span className="w-14 h-14 rounded-full bg-[var(--gold)] text-[var(--night)] grid place-items-center shadow-lg group-hover:scale-105 transition-transform">
                      <Play className="w-5 h-5 fill-current ms-0.5" />
                    </span>
                  </span>
                  <span className="absolute bottom-3 start-3 text-[11px] font-bold text-white/90 bg-black/45 px-2 py-1 rounded">
                    {v.duration}
                  </span>
                  <span className="absolute top-3 start-3 text-[11px] font-bold text-[var(--night)] bg-[var(--gold)] px-2.5 py-1 rounded-full">
                    {v.tag}
                  </span>
                </div>
                <div className="p-5">
                  <h3 className="text-[18px] font-semibold text-[var(--night)] leading-snug">{v.title}</h3>
                  <p className="mt-1.5 text-[14px] text-[var(--mute)] leading-relaxed">{v.desc}</p>
                </div>
              </button>
            ))}
          </div>
        </Container>
      </section>

      {/* مودال الفيديو */}
      {activeVideo && (() => {
        const v = videos.find((x) => x.id === activeVideo);
        if (!v) return null;
        return (
          <div className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm grid place-items-center p-4"
            onClick={() => setActiveVideo(null)} role="dialog" aria-modal="true">
            <div className="w-full max-w-3xl" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-3">
                <p className="text-white font-semibold text-[15px]">{v.title}</p>
                <button type="button" onClick={() => setActiveVideo(null)} aria-label={t("Close", "إغلاق")}
                  className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white grid place-items-center">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="aspect-video rounded-2xl overflow-hidden bg-black">
                {v.youtubeId ? (
                  <iframe className="w-full h-full"
                    src={`https://www.youtube.com/embed/${v.youtubeId}?autoplay=1&rel=0`}
                    title={v.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; picture-in-picture"
                    allowFullScreen />
                ) : (
                  <div className="w-full h-full grid place-items-center text-center px-8">
                    <div>
                      <p className="text-white font-semibold text-[16px]">
                        {t("This clip is being edited", "الفيديو تحت التجهيز")}
                      </p>
                      <p className="mt-2 text-white/55 text-[14px] max-w-sm">
                        {t("Ask us on WhatsApp and we will send it to you directly.", "اسألنا على واتساب ونبعتهولك مباشرة.")}
                      </p>
                      <a href={waDirect} target="_blank" rel="noopener noreferrer"
                        className="mt-5 inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[var(--go)] text-white font-semibold text-[14px]">
                        <MessageCircle className="w-4 h-4" />{t("Request the clip", "اطلب الفيديو")}
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })()}

      {/* ═══ المعلمون ═══ */}
      <section className="py-16 sm:py-20 bg-[var(--night)] text-white relative overflow-hidden">
        <div className="absolute inset-0 grain opacity-40" />
        <Container>
          <div className="relative grid lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-5">
              <h2 className="text-[30px] sm:text-[40px] font-semibold">
                {t("Every teacher holds an ijazah. We check the chain.", "كل معلم معه إجازة. وإحنا بنتحقق من السند.")}
              </h2>
              <p className="mt-5 text-[16px] leading-[1.75] text-white/60 max-w-[52ch]">
                {t(
                  "An ijazah is an unbroken chain of teachers going back to the Prophet ﷺ. On general tutoring sites it is a line someone typed. Here it is a document we verified before they met a single student.",
                  "الإجازة سند متصل من معلم لمعلم حتى النبي ﷺ. في مواقع التدريس العامة هي سطر كتبه أي حد. هنا هي وثيقة تحققنا منها قبل ما يقابل طالب واحد."
                )}
              </p>
            </div>
            <div className="lg:col-span-7 grid sm:grid-cols-3 gap-4">
              {teachers.map((tc) => (
                <div key={tc.name} className="rounded-2xl overflow-hidden border border-white/12 bg-white/[0.04]">
                  <div className="relative aspect-[4/5]">
                    <Image src={tc.img} alt={tc.name} fill sizes="(max-width:640px) 100vw, 220px"
                      className="object-cover" />
                    <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/85 to-transparent" />
                    <div className="absolute inset-x-0 bottom-0 p-4">
                      <p className="font-bold text-[14.5px] leading-tight">{tc.name}</p>
                      <p className="text-[12px] text-[var(--gold)] font-semibold mt-1">{tc.cred}</p>
                      <p className="text-[12px] text-white/55 mt-0.5">{tc.note}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* ═══ مقارنة ═══ */}
      <section className="py-16 sm:py-20">
        <Container>
          <h2 className="text-[30px] sm:text-[40px] font-semibold text-[var(--night)] max-w-2xl">
            {t("An institute, not a marketplace of strangers", "معهد، مش سوق معلمين غرباء")}
          </h2>

          <div className="mt-9 rounded-3xl border border-[var(--line)] overflow-hidden bg-white">
            <div className="grid grid-cols-[1.1fr_1fr_1fr] text-[13px] font-bold bg-[var(--night)] text-white">
              <div className="p-4" />
              <div className="p-4 dsp text-[16px] text-[var(--gold)]">Tajwedo</div>
              <div className="p-4 text-white/55">{t("Tutoring sites", "مواقع التدريس")}</div>
            </div>
            {comparison.map((r, i) => (
              <div key={r.p}
                className={cn("grid grid-cols-[1.1fr_1fr_1fr] text-[14px]", i % 2 ? "bg-[var(--paper)]" : "bg-white")}>
                <div className="p-4 font-semibold text-[var(--night)]">{r.p}</div>
                <div className="p-4 text-[var(--body)] border-x border-[var(--line)]">
                  {r.us === true
                    ? <span className="inline-flex items-center gap-1.5 text-[var(--go)] font-bold">
                        <Check className="w-4 h-4" />{t("Yes", "نعم")}</span>
                    : r.us}
                </div>
                <div className="p-4 text-[var(--mute)]">
                  {r.them === false
                    ? <span className="inline-flex items-center gap-1.5">
                        <Minus className="w-4 h-4" />{t("Not guaranteed", "غير مضمون")}</span>
                    : r.them}
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ═══ الأمان ═══ */}
      <section className="py-16 sm:py-20 bg-[var(--night-2)] text-white">
        <Container>
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-start">
            <div>
              <h2 className="text-[30px] sm:text-[40px] font-semibold">
                {t("You are handing us your child's time", "إنت بتسلّمنا وقت طفلك")}
              </h2>
              <p className="mt-5 text-[16px] leading-[1.75] text-white/60 max-w-[50ch]">
                {t("Most parents ask about safety last, after price and schedule. We put it first, because it is what we would ask first.", "معظم الأهالي بيسألوا عن الأمان في الآخر. إحنا بنحطه الأول، لأنه اللي كنا هنسأل عنه الأول.")}
              </p>
            </div>
            <ul className="space-y-5">
              {safeguards.map((s) => (
                <li key={s} className="flex gap-3.5 items-start pb-5 border-b border-white/10 last:border-0">
                  <ShieldCheck className="w-5 h-5 text-[var(--gold)] shrink-0 mt-0.5" />
                  <span className="text-[15.5px] leading-[1.7] text-white/80">{s}</span>
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </section>

      {/* ═══ السعر ═══ */}
      <section className="py-16 sm:py-20">
        <Container>
          <div className="rounded-3xl bg-[var(--night)] text-white p-8 sm:p-12 relative overflow-hidden">
            <div className="absolute inset-0 grain opacity-50" />
            <div className="relative max-w-2xl">
              <h2 className="text-[30px] sm:text-[40px] font-semibold">
                {t("What it costs, before you ask", "التكلفة، قبل ما تسأل")}
              </h2>
              <p className="mt-5 text-[16px] leading-[1.75] text-white/65">
                {t(
                  `From ${PRICE_FROM} per 30-minute session, moving with how many lessons a week you take. We put the number on the page because we would rather you know now than find out after a trial.`,
                  `من ${PRICE_FROM} للحصة (30 دقيقة)، حسب عدد الحصص أسبوعياً. حطينا الرقم هنا لأننا نفضّل تعرفه دلوقتي مش بعد التجربة.`
                )}
              </p>
              <div className="mt-7 flex flex-wrap gap-x-7 gap-y-3 text-[14.5px]">
                {[t("No registration fee", "بدون رسوم تسجيل"),
                  t("Pause when you travel", "أوقف وقت السفر"),
                  t("Sibling discount", "خصم للإخوة")].map((x) => (
                  <span key={x} className="inline-flex items-center gap-2 text-white/80">
                    <Check className="w-4 h-4 text-[var(--gold)]" />{x}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* ═══ آراء ═══ */}
      <section className="pb-16 sm:pb-20">
        <Container>
          <h2 className="text-[30px] sm:text-[40px] font-semibold text-[var(--night)] max-w-2xl mb-9">
            {t("Parents in the UK, US, Canada and Australia", "أهالي في بريطانيا وأمريكا وكندا وأستراليا")}
          </h2>
          <div className="grid md:grid-cols-2 gap-5">
            {reviews.map((r) => (
              <figure key={r.n} className="rounded-2xl border border-[var(--line)] bg-white p-6 sm:p-7">
                <div className="flex gap-0.5 mb-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-[var(--gold-2)] text-[var(--gold-2)]" />
                  ))}
                </div>
                <blockquote className="text-[15.5px] leading-[1.75] text-[var(--body)]">{r.x}</blockquote>
                <figcaption className="mt-5 pt-5 border-t border-[var(--line)] flex items-center gap-3">
                  <span className="w-10 h-10 rounded-full bg-[var(--night)] text-[var(--gold)] text-[12px] font-bold grid place-items-center shrink-0">
                    {r.a}
                  </span>
                  <span className="text-[13px] leading-tight">
                    <span className="block font-bold text-[var(--night)]">{r.n}</span>
                    <span className="block text-[var(--mute)]">{r.w} · {r.p}</span>
                  </span>
                </figcaption>
              </figure>
            ))}
          </div>
        </Container>
      </section>

      {/* ═══ الخطوات + الفورم ═══ */}
      <section id="book" className="py-16 sm:py-20 bg-[var(--night)] text-white scroll-mt-16 relative overflow-hidden">
        <div className="absolute inset-0 grain opacity-40" />
        <Container>
          <div className="relative grid lg:grid-cols-12 gap-10 lg:gap-14 items-start">

            <div className="lg:col-span-5">
              <h2 className="text-[30px] sm:text-[40px] font-semibold">
                {t("Book the free assessment", "احجز التقييم المجاني")}
              </h2>
              <ol className="mt-8 space-y-6">
                {steps.map((s) => (
                  <li key={s.n} className="flex gap-4">
                    <span className="dsp shrink-0 w-9 h-9 rounded-full border border-[var(--gold)]/40 text-[var(--gold)] text-[15px] font-semibold grid place-items-center">
                      {s.n}
                    </span>
                    <div>
                      <p className="font-bold text-[15.5px]">{s.t}</p>
                      <p className="text-[14px] text-white/55 mt-1 leading-relaxed">{s.b}</p>
                    </div>
                  </li>
                ))}
              </ol>
              <p className="mt-8 text-[14px] text-white/50">
                {t("Just want to ask something?", "عايز تسأل بس؟")}{" "}
                <a href={waDirect} target="_blank" rel="noopener noreferrer"
                  onClick={() => trackWhatsAppClick({ button_id: "ask_first", button_location: "form_section", click_url: waDirect })}
                  className="font-bold text-[var(--gold)] underline underline-offset-4">
                  {t("Message us on WhatsApp", "راسلنا على واتساب")}
                </a>
              </p>
            </div>

            <div className="lg:col-span-7 w-full">
              <div className="bg-[var(--paper)] text-[var(--body)] rounded-3xl p-6 sm:p-8">
                {submitted ? (
                  <div className="text-center py-12 space-y-4">
                    <CheckCircle2 className="w-12 h-12 text-[var(--go)] mx-auto" />
                    <h3 className="text-[24px] font-semibold text-[var(--night)]">
                      {t("Your request is ready", "طلبك جاهز")}
                    </h3>
                    <p className="text-[15px] text-[var(--mute)] max-w-sm mx-auto">
                      {t("If WhatsApp did not open, tap below.", "لو واتساب مفتحش، اضغط تحت.")}
                    </p>
                    <a href={`${WHATSAPP_LINK}?text=${encodeURIComponent(
                        `*Free Assessment*\nName: ${form.name}\nAge: ${form.age}\nTeacher: ${form.gender}\nProgram: ${form.course}`)}`}
                      target="_blank" rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[var(--go)] text-white font-bold text-[15px]">
                      <MessageCircle className="w-[18px] h-[18px]" />{t("Open WhatsApp", "افتح واتساب")}
                    </a>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                      <label htmlFor="f-name" className="block text-[13px] font-bold text-[var(--night)] mb-2">
                        {t("Your name", "اسمك")}
                      </label>
                      <input id="f-name" type="text" value={form.name} onChange={(e) => set("name", e.target.value)}
                        placeholder={t("Sarah Mitchell", "مثال: أحمد")}
                        className="w-full px-4 py-3.5 rounded-xl border border-[var(--line)] bg-white text-[15px] focus:outline-none focus:border-[var(--night)]" />
                      {errors.name && <p className="text-[12.5px] text-red-600 mt-1.5">{errors.name}</p>}
                    </div>

                    <div>
                      <label className="block text-[13px] font-bold text-[var(--night)] mb-2">
                        {t("Country", "الدولة")}
                      </label>
                      <CountrySelect value={form.country} isRTL={isRTL}
                        onChange={(name, country) => setForm((p) => ({
                          ...p, country: name,
                          phone: country && (!p.phone || /^\+\d{1,4}\s*$/.test(p.phone)) ? `${country.dialCode} ` : p.phone,
                        }))} />
                    </div>

                    <div>
                      <label className="block text-[13px] font-bold text-[var(--night)] mb-2">
                        {t("WhatsApp number", "رقم الواتساب")}
                      </label>
                      <PhoneInput value={form.phone} isRTL={isRTL} placeholder="7700900000"
                        defaultCountryCode={findCountryByName(form.country)?.code || "US"}
                        onChange={(full) => set("phone", full)} />
                      {errors.phone && <p className="text-[12.5px] text-red-600 mt-1.5">{errors.phone}</p>}
                    </div>

                    <div className="grid sm:grid-cols-2 gap-5">
                      <div>
                        <label htmlFor="f-age" className="block text-[13px] font-bold text-[var(--night)] mb-2">
                          {t("Student's age", "عمر الطالب")}
                        </label>
                        <input id="f-age" type="number" inputMode="numeric" min={3} max={100}
                          value={form.age} onChange={(e) => set("age", e.target.value)} placeholder="8"
                          className="w-full px-4 py-3.5 rounded-xl border border-[var(--line)] bg-white text-[15px] focus:outline-none focus:border-[var(--night)]" />
                        {errors.age && <p className="text-[12.5px] text-red-600 mt-1.5">{errors.age}</p>}
                      </div>
                      <div>
                        <span className="block text-[13px] font-bold text-[var(--night)] mb-2">
                          {t("Teacher", "المعلم")}
                        </span>
                        <div className="grid grid-cols-2 gap-2">
                          {[{ v: "Male", l: t("Male", "معلم") }, { v: "Female", l: t("Female", "معلمة") }].map((g) => (
                            <button key={g.v} type="button" onClick={() => set("gender", g.v)}
                              aria-pressed={form.gender === g.v}
                              className={cn("py-3.5 rounded-xl border text-[14px] font-bold transition-colors",
                                form.gender === g.v
                                  ? "border-[var(--night)] bg-[var(--night)] text-white"
                                  : "border-[var(--line)] bg-white text-[var(--mute)] hover:border-[var(--night)]/40")}>
                              {g.l}
                            </button>
                          ))}
                        </div>
                        {errors.gender && <p className="text-[12.5px] text-red-600 mt-1.5">{errors.gender}</p>}
                      </div>
                    </div>

                    <div>
                      <label htmlFor="f-course" className="block text-[13px] font-bold text-[var(--night)] mb-2">
                        {t("Program", "البرنامج")}
                      </label>
                      <select id="f-course" value={form.course} onChange={(e) => set("course", e.target.value)}
                        className="w-full px-4 py-3.5 rounded-xl border border-[var(--line)] bg-white text-[15px] focus:outline-none focus:border-[var(--night)]">
                        <option value="kids-program">{t("Kids Quran", "قرآن للأطفال")}</option>
                        <option value="quran-recitation">{t("Quran recitation", "تلاوة القرآن")}</option>
                        <option value="tajweed-course">{t("Tajweed", "تجويد")}</option>
                        <option value="arabic-language">{t("Arabic language", "اللغة العربية")}</option>
                        <option value="new-muslims">{t("New Muslims", "المسلمون الجدد")}</option>
                      </select>
                    </div>

                    <Button type="submit" disabled={loading}
                      className="w-full py-4 h-auto rounded-xl bg-[var(--go)] hover:bg-[#0E7650] text-white font-bold text-[15px]">
                      <MessageCircle className="w-[18px] h-[18px] me-2" />
                      {loading ? t("Preparing…", "جاري التحضير…")
                        : t("Book free assessment on WhatsApp", "احجز التقييم على واتساب")}
                    </Button>
                    <p className="text-[12.5px] text-[var(--mute)] text-center">
                      {t("We use your number only to arrange the lesson.", "بنستخدم رقمك لترتيب الحصة فقط.")}
                    </p>
                  </form>
                )}
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* ═══ الأسئلة ═══ */}
      <section className="py-16 sm:py-20">
        <Container>
          <div className="max-w-3xl">
            <h2 className="text-[30px] sm:text-[40px] font-semibold text-[var(--night)]">
              {t("Questions parents ask", "أسئلة بيسألها الأهالي")}
            </h2>
            <div className="mt-9 border-t border-[var(--line)]">
              {faqs.map((f, i) => (
                <div key={f.q} className="border-b border-[var(--line)]">
                  <button type="button" onClick={() => setFaqOpen(faqOpen === i ? null : i)}
                    aria-expanded={faqOpen === i}
                    className="w-full py-5 flex items-start justify-between gap-6 text-start">
                    <span className="text-[17px] font-semibold text-[var(--night)]">{f.q}</span>
                    <ChevronDown className={cn("w-5 h-5 text-[var(--mute)] shrink-0 mt-0.5 transition-transform",
                      faqOpen === i && "rotate-180 text-[var(--night)]")} />
                  </button>
                  {faqOpen === i && (
                    <p className="pb-5 pe-10 text-[15px] leading-[1.75] text-[var(--mute)]">{f.a}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* ═══ الخاتمة ═══ */}
      <section className="py-16 sm:py-20 bg-[var(--night-2)] text-white">
        <Container>
          <div className="max-w-2xl">
            <h2 className="text-[34px] sm:text-[46px] font-semibold">
              {t("Thirty minutes tells you more than thirty reviews.", "ثلاثون دقيقة تقول لك أكثر من ثلاثين تقييماً.")}
            </h2>
            <p className="mt-5 text-[16px] leading-[1.75] text-white/60">
              {t("Hear a teacher work with your child, then decide. Nothing to cancel if you walk away.", "اسمع معلم وهو بيشتغل مع طفلك، وبعدين قرر. مفيش حاجة تلغيها لو مشيت.")}
            </p>
            <a href="#book"
              className="mt-8 inline-flex items-center gap-2.5 px-8 py-4 rounded-xl bg-[var(--gold)] hover:bg-[var(--gold-2)] text-[var(--night)] font-bold text-[15px] transition-colors">
              {t("Book the free assessment", "احجز التقييم المجاني")}
              <ArrowRight className={cn("w-[18px] h-[18px]", isRTL && "rotate-180")} />
            </a>
            <p className="mt-10 pt-6 border-t border-white/12">
              <Link href="/" className="inline-flex items-center gap-2 text-[14px] text-white/50 hover:text-white transition-colors">
                {t("See all programs on the main site", "شوف كل البرامج على الموقع الرئيسي")}
                <ExternalLink className="w-4 h-4" />
              </Link>
            </p>
          </div>
        </Container>
      </section>

      {/* شريط الموبايل */}
      <div className="fixed bottom-0 inset-x-0 z-50 sm:hidden bg-[var(--paper)] border-t border-[var(--line)] p-3 flex gap-2.5">
        <a href={waDirect} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp"
          onClick={() => trackWhatsAppClick({ button_id: "lp_sticky_wa", button_location: "lp_mobile_bar", click_url: waDirect })}
          className="shrink-0 px-4 py-3.5 rounded-xl border border-[var(--line)] text-[var(--go)] grid place-items-center">
          <MessageCircle className="w-5 h-5" />
        </a>
        <a href="#book"
          className="flex-1 py-3.5 rounded-xl bg-[var(--go)] text-white text-[14.5px] font-bold grid place-items-center">
          {t("Book free assessment", "احجز التقييم المجاني")}
        </a>
      </div>
    </div>
  );
}