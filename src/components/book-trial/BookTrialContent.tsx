"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import type { LucideIcon } from "lucide-react";
import {
  AlertCircle, Baby, Check, CheckCircle2, ChevronDown, Clock, FileText,
  Gift, Globe, MessageCircle, Moon, Send, ShieldCheck, Sun, Users, Video,
} from "lucide-react";
import Container from "@/components/shared/Container";
import { WHATSAPP_LINK, TELEGRAM_LINK } from "@/lib/constants";
import { useLocale } from "@/hooks/useLocale";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";
import { Link } from "@/i18n/navigation";
import { trackEvent, trackWhatsAppClick } from "@/components/shared/GoogleTagManager";
import CountrySelect from "./CountrySelect";

/* ══════════════════════════════════════════════════════════════
   OFFER SETTINGS
   These numbers are PROPOSALS. Confirm each one before publishing:
   anything written here is a promise to a parent.
   ══════════════════════════════════════════════════════════════ */
const SOLO_DISCOUNT = 10;        // % off for 1 learner ...
const SOLO_DISCOUNT_MONTHS = 1;  // ... for the first N month(s)
const PAIR_DISCOUNT = 20;        // % off for 2 learners
const FAMILY_DISCOUNT = 30;      // % off for 3+ learners
const DISCOUNT_MONTHS = 3;       // pair / family discount applies to the first N months
const OFFER_WINDOW_DAYS = 7;     // days after the trial lessons to enrol and keep the offer

/** Public path of the hero photo: frontend/public/Tajwedo-Public-Assets/herosection-booking.webp */
const HERO_IMAGE = "/Tajwedo-Public-Assets/herosection-booking.webp";

/** Public paths of the three offer photos: frontend/public/Tajwedo-Public-Assets/offer-*.webp */
const OFFER_IMAGES: Record<"solo" | "pair" | "family", string> = {
  solo: "/Tajwedo-Public-Assets/offer-solo.webp",
  pair: "/Tajwedo-Public-Assets/offer-pair.webp",
  family: "/Tajwedo-Public-Assets/offer-family.webp",
};

type PlanId = "solo" | "pair" | "family";

interface Offer {
  id: PlanId;
  learners: number;
  discount: number;
  title: string;
  who: string;
  badge: string;
  tag?: string;
  perks: string[];
  /** Always English: this goes into the WhatsApp message your team reads. */
  messageLabel: string;
}

interface GiftItem {
  icon: LucideIcon;
  title: string;
  desc: string;
  plans: PlanId[];
}

const CITIES = [
  { tz: "Europe/London", en: "London", ar: "لندن" },
  { tz: "America/New_York", en: "New York", ar: "نيويورك" },
  { tz: "America/Toronto", en: "Toronto", ar: "تورنتو" },
  { tz: "Australia/Sydney", en: "Sydney", ar: "سيدني" },
];

/** Subtle 8-point star tile used as a quiet background motif. */
const STAR_TILE =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='72' height='72' viewBox='0 0 64 64'%3E%3Cg fill='none' stroke='%23ffffff' stroke-opacity='.09' stroke-width='1'%3E%3Cpath d='M14 14h36v36H14z'/%3E%3Cpath d='M32 6.5 57.5 32 32 57.5 6.5 32z'/%3E%3C/g%3E%3C/svg%3E\")";

const inputCls =
  "w-full rounded-xl border border-sand-200 bg-sand-50 px-4 py-3 text-base text-gray-900 placeholder-gray-400 transition-all focus:border-primary/40 focus:outline-none focus:ring-2 focus:ring-primary/20 sm:text-sm";

function Field({
  id, label, error, hint, children,
}: {
  id?: string;
  label: string;
  error?: string;
  hint?: string;
  children: React.ReactNode;
}) {
  const labelCls = "block text-sm font-semibold text-gray-800";
  return (
    <div className="space-y-1.5">
      {id ? (
        <label htmlFor={id} className={labelCls}>{label}</label>
      ) : (
        <span className={labelCls}>{label}</span>
      )}
      {children}
      {error ? (
        <p role="alert" className="flex items-center gap-1 text-xs text-red-600">
          <AlertCircle className="h-3.5 w-3.5 shrink-0" aria-hidden />
          {error}
        </p>
      ) : hint ? (
        <p className="text-xs text-gray-500">{hint}</p>
      ) : null}
    </div>
  );
}

export default function BookTrialContent() {
  const { isRTL } = useLocale();
  const t = (en: string, ar: string) => (isRTL ? ar : en);

  const [plan, setPlan] = useState<PlanId>("pair");
  const [form, setForm] = useState({ name: "", age: "", gender: "", country: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sentUrl, setSentUrl] = useState<string | null>(null);
  const [clocks, setClocks] = useState<{ time: string; day: boolean }[] | null>(null);
  const [barHidden, setBarHidden] = useState(false);

  const set = (field: string, value: string) => {
    setForm((p) => ({ ...p, [field]: value }));
    setErrors((p) => ({ ...p, [field]: "" }));
  };

  /* World clocks: computed after mount so server and client HTML always match. */
  useEffect(() => {
    const tick = () => {
      const now = new Date();
      setClocks(
        CITIES.map(({ tz }) => {
          const parts = new Intl.DateTimeFormat("en-GB", {
            hour: "2-digit", minute: "2-digit", hour12: false, timeZone: tz,
          }).formatToParts(now);
          const h = Number(parts.find((p) => p.type === "hour")?.value ?? "0") % 24;
          const m = parts.find((p) => p.type === "minute")?.value ?? "00";
          return { time: `${String(h).padStart(2, "0")}:${m}`, day: h >= 6 && h < 18 };
        })
      );
    };
    tick();
    const id = window.setInterval(tick, 30000);
    return () => window.clearInterval(id);
  }, []);

  /* Hide the mobile sticky bar while the form or the site footer is on screen. */
  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;
    const candidates: (Element | null)[] = [
      document.getElementById("book-form"),
      document.querySelector("footer"),
    ];
    const targets = candidates.filter((el): el is Element => el !== null);
    if (targets.length === 0) return;
    const visible = new Set<Element>();
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => (e.isIntersecting ? visible.add(e.target) : visible.delete(e.target)));
        setBarHidden(visible.size > 0);
      },
      { threshold: 0.15 }
    );
    targets.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [sentUrl]);

  /* ───────────── Content ───────────── */

  const offers: Offer[] = [
    {
      id: "solo",
      learners: 1,
      discount: SOLO_DISCOUNT,
      title: t("One learner", "متعلم واحد"),
      who: t("You, or your child", "أنت أو طفلك"),
      badge: t(`1 free trial + ${SOLO_DISCOUNT}% off`, `حصة مجانية + خصم ${SOLO_DISCOUNT}٪`),
      messageLabel: `One learner (1 free trial + ${SOLO_DISCOUNT}% off)`,
      perks: [
        t("A free 30-minute live lesson", "حصة مباشرة مجانية مدتها 30 دقيقة"),
        t(
          `${SOLO_DISCOUNT}% off your first month when you enrol within ${OFFER_WINDOW_DAYS} days`,
          `خصم ${SOLO_DISCOUNT}٪ على أول شهر إذا اشتركت خلال ${OFFER_WINDOW_DAYS} أيام`
        ),
        t("A written learning plan after the lesson", "خطة تعلّم مكتوبة بعد الحصة"),
        t("Colour-coded Tajweed card (PDF)", "بطاقة أحكام التجويد الملونة (PDF)"),
      ],
    },
    {
      id: "pair",
      learners: 2,
      discount: PAIR_DISCOUNT,
      title: t("Two learners", "متعلمان اثنان"),
      who: t("Two children, or a parent and child", "طفلان، أو أحد الوالدين مع طفله"),
      badge: t(`2 free trials + ${PAIR_DISCOUNT}% off`, `حصتان مجانيتان + خصم ${PAIR_DISCOUNT}٪`),
      messageLabel: `Two learners (2 free trials + ${PAIR_DISCOUNT}% off)`,
      perks: [
        t("A free 30-minute lesson for each learner", "حصة مجانية مدتها 30 دقيقة لكل متعلم"),
        t(
          `${PAIR_DISCOUNT}% off monthly lessons for both, for the first ${DISCOUNT_MONTHS} months`,
          `خصم ${PAIR_DISCOUNT}٪ على الاشتراك الشهري للاثنين لأول ${DISCOUNT_MONTHS} أشهر`
        ),
        t("Lessons lined up back-to-back on the same day", "حصص متتالية في اليوم نفسه"),
        t("A written plan for each learner", "خطة مكتوبة لكل متعلم"),
        t(
          "Colour-coded Tajweed card + children's progress chart (PDF)",
          "بطاقة التجويد الملونة + لوحة متابعة الأطفال (PDF)"
        ),
      ],
    },
    {
      id: "family",
      learners: 3,
      discount: FAMILY_DISCOUNT,
      title: t("Family of 3 or more", "عائلة من 3 أو أكثر"),
      who: t("A mother and her children, or the whole family", "أم مع أطفالها، أو العائلة كلها"),
      badge: t(`3+ free trials + ${FAMILY_DISCOUNT}% off`, `3 حصص مجانية فأكثر + خصم ${FAMILY_DISCOUNT}٪`),
      tag: t("Best value", "الأوفر"),
      messageLabel: `Family of 3+ (free trial for everyone + ${FAMILY_DISCOUNT}% off)`,
      perks: [
        t("A free 30-minute lesson for every family member", "حصة مجانية مدتها 30 دقيقة لكل فرد في العائلة"),
        t(
          `${FAMILY_DISCOUNT}% off monthly lessons for everyone, for the first ${DISCOUNT_MONTHS} months`,
          `خصم ${FAMILY_DISCOUNT}٪ على الاشتراك الشهري للجميع لأول ${DISCOUNT_MONTHS} أشهر`
        ),
        t(
          "One coordinated timetable, so you are not juggling schedules",
          "جدول واحد منسّق، فلا تضطر لمطاردة المواعيد"
        ),
        t("Female teachers available for mothers and girls", "معلمات متاحات للأمهات والفتيات"),
        t("A short weekly progress summary for the whole family", "ملخص أسبوعي قصير لتقدّم العائلة كلها"),
        t("All gifts: written plans, Tajweed card, children's chart", "كل الهدايا: خطط مكتوبة، بطاقة التجويد، لوحة الأطفال"),
      ],
    },
  ];

  const gifts: GiftItem[] = [
    {
      icon: FileText,
      title: t("Your written learning plan", "خطتك التعليمية المكتوبة"),
      desc: t(
        "After the lesson your teacher writes down your level, what to fix first and a step-by-step path.",
        "بعد الحصة يكتب المعلم مستواك وما يجب تصحيحه أولًا ومسارًا خطوة بخطوة."
      ),
      plans: ["solo", "pair", "family"],
    },
    {
      icon: Gift,
      title: t("Colour-coded Tajweed card (PDF)", "بطاقة أحكام التجويد الملونة (PDF)"),
      desc: t(
        "The core rules on one printable page, colour-coded so they are easy to spot while you read.",
        "أهم الأحكام في صفحة واحدة قابلة للطباعة، ملونة ليسهل تمييزها أثناء القراءة."
      ),
      plans: ["solo", "pair", "family"],
    },
    {
      icon: Baby,
      title: t("Children's progress chart (PDF)", "لوحة متابعة الأطفال (PDF)"),
      desc: t(
        "A printable chart for the fridge: a star for every lesson and every page learned.",
        "لوحة قابلة للطباعة تعلّقها في البيت: نجمة لكل حصة ولكل صفحة تتعلمها."
      ),
      plans: ["pair", "family"],
    },
    {
      icon: Users,
      title: t("Weekly family progress summary", "ملخص أسبوعي لتقدّم العائلة"),
      desc: t(
        "One short message a week covering everyone, so you always know where each child stands.",
        "رسالة قصيرة أسبوعيًا تغطي الجميع، لتعرف دائمًا أين وصل كل فرد."
      ),
      plans: ["family"],
    },
  ];

  const steps = [
    {
      title: t("Choose who is learning", "اختر من سيتعلم"),
      body: t(
        "One learner, two, or the whole family. Pick the offer that fits.",
        "متعلم واحد أو اثنان أو العائلة كلها. اختر العرض المناسب."
      ),
    },
    {
      title: t("Send your details on WhatsApp", "أرسل بياناتك على واتساب"),
      body: t(
        "Name, age, gender and country. WhatsApp opens with the message ready; just press Send.",
        "الاسم والعمر والجنس والدولة. يفتح واتساب والرسالة جاهزة، اضغط إرسال."
      ),
    },
    {
      title: t("Meet your teacher", "قابل معلمك"),
      body: t(
        "We reply with lesson times in your time zone. You get a live 30-minute lesson and your gifts.",
        "نرد عليك بمواعيد مناسبة لتوقيتك، وتحصل على حصة مباشرة مدتها 30 دقيقة وهداياك."
      ),
    },
  ];

  const terms = [
    t(
      "The trial lesson is free: 30 minutes, one per learner. No payment details are needed and there is no obligation to continue.",
      "الحصة التجريبية مجانية: 30 دقيقة لكل متعلم. لا نطلب بيانات دفع ولا يوجد التزام بالاستمرار."
    ),
    t(
      `Discounts apply to monthly lesson packages bought within ${OFFER_WINDOW_DAYS} days of the trial lessons: ${SOLO_DISCOUNT}% for one learner (first ${SOLO_DISCOUNT_MONTHS} month), ${PAIR_DISCOUNT}% for two learners and ${FAMILY_DISCOUNT}% for three or more (first ${DISCOUNT_MONTHS} months).`,
      `تُطبَّق الخصومات على الاشتراكات الشهرية خلال ${OFFER_WINDOW_DAYS} أيام من الحصص التجريبية: ${SOLO_DISCOUNT}٪ لمتعلم واحد (أول ${SOLO_DISCOUNT_MONTHS} شهر)، و${PAIR_DISCOUNT}٪ لمتعلمين، و${FAMILY_DISCOUNT}٪ لثلاثة فأكثر (أول ${DISCOUNT_MONTHS} أشهر).`
    ),
    t(
      "Offers cannot be combined with other discounts. Gifts are digital and yours to keep whether or not you enrol.",
      "لا يمكن الجمع بين العروض وأي خصومات أخرى. الهدايا رقمية وتبقى لك سواء اشتركت أم لا."
    ),
    t(
      "Lesson times depend on teacher availability in your time zone, and we always confirm them in writing on WhatsApp.",
      "تعتمد المواعيد على توفر المعلمين في توقيتك، ونؤكدها دائمًا كتابةً على واتساب."
    ),
  ];

  const faqs = [
    {
      q: t("Is the trial lesson really free?", "هل الحصة التجريبية مجانية فعلًا؟"),
      a: t(
        "Yes. Each learner gets one live 30-minute lesson. We do not ask for card details and there is no obligation to continue.",
        "نعم. يحصل كل متعلم على حصة مباشرة مدتها 30 دقيقة. لا نطلب بيانات بطاقة ولا يوجد التزام بالاستمرار."
      ),
    },
    {
      q: t("How do the discounts work?", "كيف تعمل الخصومات؟"),
      a: t(
        `Every learner gets their own free lesson. If you enrol within ${OFFER_WINDOW_DAYS} days of the trials, you save ${SOLO_DISCOUNT}% (one learner, first month), ${PAIR_DISCOUNT}% (two learners) or ${FAMILY_DISCOUNT}% (three or more) on monthly lessons for the first ${DISCOUNT_MONTHS} months.`,
        `يحصل كل متعلم على حصته المجانية. وإذا اشتركتم خلال ${OFFER_WINDOW_DAYS} أيام من الحصص التجريبية، توفّرون ${SOLO_DISCOUNT}٪ (متعلم واحد، أول شهر) أو ${PAIR_DISCOUNT}٪ (متعلمان) أو ${FAMILY_DISCOUNT}٪ (ثلاثة فأكثر) على الاشتراك الشهري لأول ${DISCOUNT_MONTHS} أشهر.`
      ),
    },
    {
      q: t(
        "My children are different ages and levels. Is that a problem?",
        "أطفالي بأعمار ومستويات مختلفة، هل هذه مشكلة؟"
      ),
      a: t(
        "No. Every learner is assessed on their own and may be matched with a different teacher. We line the lessons up so your day stays simple.",
        "لا. يُقيَّم كل متعلم على حدة وقد يُسند إلى معلم مختلف، ونرتب الحصص لتبقى جداولكم بسيطة."
      ),
    },
    {
      q: t("Are female teachers available?", "هل توجد معلمات؟"),
      a: t(
        "Yes. Female teachers are available for sisters, mothers and girls.",
        "نعم، تتوفر معلمات للأخوات والأمهات والفتيات."
      ),
    },
    {
      q: t("What happens when I press the button?", "ماذا يحدث عند الضغط على الزر؟"),
      a: t(
        "WhatsApp opens with your details already written. Press Send, and our team replies with available lesson times in your time zone.",
        "يفتح واتساب والرسالة مكتوبة ببياناتك. اضغط إرسال وسيرد فريقنا بالمواعيد المتاحة بتوقيتك."
      ),
    },
  ];

  const heroChips = [
    { icon: ShieldCheck, text: t("Al-Azhar certified teachers", "معلمون معتمدون من الأزهر") },
    { icon: Video, text: t("Live 1-to-1 on Zoom", "حصة مباشرة فردية على Zoom") },
    { icon: Clock, text: t("Flexible times in your time zone", "مواعيد مرنة بتوقيتك") },
    { icon: Gift, text: t("Gifts to keep", "هدايا تبقى لك") },
  ];

  const current = offers.find((o) => o.id === plan) ?? offers[0];
  const multi = current.learners > 1;
  const labelCaps = isRTL ? "" : "uppercase tracking-wider";

  /* ───────────── Submit ───────────── */

  const validate = () => {
    const e: Record<string, string> = {};
    const age = Number(form.age);
    if (form.name.trim().length < 2) e.name = t("Please enter a name", "من فضلك أدخل الاسم");
    if (!form.age.trim() || !Number.isInteger(age) || age < 3 || age > 100)
      e.age = t("Enter an age between 3 and 100", "أدخل عمرًا بين 3 و100");
    if (!form.gender) e.gender = t("Please choose one", "من فضلك اختر");
    if (!form.country.trim()) e.country = t("Please choose a country", "من فضلك اختر الدولة");
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validate()) {
      toast.error(t("Please check the highlighted fields", "راجع الحقول المحددة"));
      return;
    }

    let tz = "unknown";
    try {
      tz = Intl.DateTimeFormat().resolvedOptions().timeZone || "unknown";
    } catch {
      /* keep "unknown" */
    }

    const message = `*Free Trial Booking | Tajwedo Institute*
----------------------------------------
*Offer:* ${current.messageLabel}
*Name:* ${form.name.trim()}${multi ? " (first learner)" : ""}
*Age:* ${form.age}
*Gender:* ${form.gender}
*Country:* ${form.country}
*Time zone:* ${tz}
${multi ? `*Learners:* ${current.learners === 3 ? "3 or more" : current.learners} (other names and ages to follow in chat)` : ""}`.trim();

    const url = `${WHATSAPP_LINK}?text=${encodeURIComponent(message)}`;

    trackEvent("generate_lead", {
      form_name: "book_trial",
      plan: current.id,
      learners: current.learners,
      country: form.country,
      age: form.age,
      gender: form.gender,
      currency: "USD",
      value: 1,
    });
    trackEvent("book_trial_success", { plan: current.id, country: form.country });
    trackWhatsAppClick({
      button_id: "book_trial_submit",
      button_location: "book_trial_page",
      button_text: "Claim my free trial",
      click_url: url,
    });

    // Opened synchronously inside the click handler so mobile browsers do not block it.
    window.open(url, "_blank");
    setSentUrl(url);
  };

  const firstName = form.name.trim().split(" ")[0] || "";

  /* ───────────── Render ───────────── */

  return (
    <main dir={isRTL ? "rtl" : "ltr"} className="pb-24 lg:pb-0">
      {/* ═══ Hero ═══ */}
      <section className="relative isolate overflow-hidden pb-16 pt-28 md:pb-24 md:pt-36">
        <Image
          src={HERO_IMAGE}
          alt=""
          fill
          priority
          quality={75}
          sizes="100vw"
          className="-z-30 object-cover object-center"
        />
        {/* Dark teal veil keeps the text readable whatever the photo looks like. Lower the % to show more photo. */}
        <div
          aria-hidden
          className="absolute inset-0 -z-20 bg-gradient-to-b from-[#031a1a]/85 via-[#06302f]/75 to-[#0a4040]/90"
        />
        <div
          aria-hidden
          className="absolute inset-0 -z-10"
          style={{ backgroundImage: STAR_TILE, backgroundSize: "72px 72px" }}
        />

        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <p className="inline-flex items-center gap-2 rounded-full border border-accent/40 bg-accent/15 px-4 py-1.5 text-xs font-bold text-white">
              <Gift className="h-3.5 w-3.5 text-accent" aria-hidden />
              {t(
                `Free trial · Families save up to ${FAMILY_DISCOUNT}%`,
                `حصة تجريبية مجانية · العائلات توفّر حتى ${FAMILY_DISCOUNT}٪`
              )}
            </p>

            <h1
              className={cn(
                "mt-5 text-4xl font-bold text-white md:text-6xl",
                isRTL ? "leading-[1.35]" : "leading-[1.1]"
              )}
            >
              {t("Book a Free Quran Trial Class", "احجز حصة قرآن تجريبية مجانية")}
              <span className="mt-2 block text-accent">
                {t(
                  "Everyone in your family gets a free first lesson",
                  "وكل فرد في عائلتك يحصل على حصته الأولى مجانًا"
                )}
              </span>
            </h1>

            <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-white/85 md:text-lg">
              {t(
                "A live 30-minute lesson, one-to-one with a qualified teacher. No card, no obligation. Booking for more than one person? Pick a family offer below to unlock a bigger discount and gifts to keep.",
                "حصة مباشرة مدتها 30 دقيقة، فردية مع معلم مؤهل. بدون بطاقة وبدون التزام. هل تحجز لأكثر من شخص؟ اختر عرض العائلة أدناه لتحصل على خصم أكبر وهدايا تبقى لك."
              )}
            </p>

            <ul className="mt-8 flex flex-wrap justify-center gap-x-6 gap-y-3 text-sm text-white/90">
              {heroChips.map(({ icon: Icon, text }) => (
                <li key={text} className="flex items-center gap-2">
                  <Icon className="h-4 w-4 text-accent" aria-hidden />
                  {text}
                </li>
              ))}
            </ul>

            {/* World clocks: shows the page is built for families in different time zones */}
            <div className="mx-auto mt-10 max-w-2xl rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-md">
              <p className="flex items-center justify-center gap-2 text-xs font-semibold text-white/80">
                <Globe className="h-3.5 w-3.5" aria-hidden />
                {t(
                  "Lessons are scheduled in your time zone",
                  "نحدد مواعيد الحصص بحسب توقيتك"
                )}
              </p>
              <ul className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {CITIES.map((c, i) => {
                  const clock = clocks?.[i];
                  return (
                    <li
                      key={c.tz}
                      className="flex items-center justify-center gap-2 rounded-xl bg-black/20 px-3 py-2"
                    >
                      {clock?.day === false ? (
                        <Moon className="h-4 w-4 shrink-0 text-accent" aria-hidden />
                      ) : (
                        <Sun className="h-4 w-4 shrink-0 text-accent" aria-hidden />
                      )}
                      <span className="text-start leading-tight">
                        <span className="block text-[11px] text-white/70">{t(c.en, c.ar)}</span>
                        <span dir="ltr" className="block text-sm font-bold tabular-nums text-white">
                          {clock ? clock.time : "--:--"}
                        </span>
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </Container>
      </section>

      {/* ═══ Offers + form ═══ */}
      <section className="bg-sand-50 py-14 md:py-20">
        <Container>
          <div className="grid items-start gap-10 lg:grid-cols-12 lg:gap-12">
            {/* Offers */}
            <div className="lg:col-span-7">
              <p className={cn("text-xs font-bold text-primary", labelCaps)}>
                {t("Step 1", "الخطوة 1")}
              </p>
              <h2 className="mt-1 text-2xl font-bold text-gray-900 md:text-3xl">
                {t("Who is learning?", "من سيتعلم؟")}
              </h2>

              <fieldset className="mt-6">
                <legend className="sr-only">{t("Choose your offer", "اختر العرض")}</legend>
                <div className="space-y-5">
                  {offers.map((o) => {
                    const selected = o.id === plan;
                    return (
                      <div
                        key={o.id}
                        className={cn(
                          "overflow-hidden rounded-2xl border-2 bg-white transition-all focus-within:ring-2 focus-within:ring-primary/30",
                          selected
                            ? "border-primary shadow-premium"
                            : "border-sand-200 hover:border-primary/40"
                        )}
                      >
                        <label className="grid cursor-pointer sm:grid-cols-[240px_1fr]">
                          <input
                            type="radio"
                            name="plan"
                            value={o.id}
                            checked={selected}
                            onChange={() => setPlan(o.id)}
                            className="sr-only"
                          />

                          {/* Illustration + discount seal */}
                          <span className="relative block aspect-[8/5] overflow-hidden bg-primary/10 sm:aspect-auto sm:min-h-[160px]">
                            <Image
                              src={OFFER_IMAGES[o.id]}
                              alt=""
                              fill
                              quality={80}
                              sizes="(min-width: 640px) 240px, 100vw"
                              className="object-cover object-center"
                            />
                            <span className="absolute end-3 top-3 grid h-[68px] w-[68px] -rotate-6 place-items-center rounded-full border-2 border-white/80 bg-accent text-center text-gray-900 shadow-lg rtl:rotate-6">
                              <span className="leading-none">
                                <span dir="ltr" className="block text-xl font-extrabold">
                                  -{o.discount}%
                                </span>
                                <span className="mt-0.5 block text-[10px] font-bold">
                                  {t("OFF", "خصم")}
                                </span>
                              </span>
                            </span>
                          </span>

                          <span className="flex items-start gap-3 p-4 sm:p-5">
                            <span className="min-w-0 flex-1">
                              <span className="flex flex-wrap items-center gap-x-2 gap-y-1.5">
                                <span className="text-lg font-bold text-gray-900">{o.title}</span>
                                {o.tag && (
                                  <span className="rounded-full bg-accent px-2.5 py-0.5 text-[11px] font-bold text-gray-900">
                                    {o.tag}
                                  </span>
                                )}
                              </span>
                              <span className="mt-0.5 block text-sm text-gray-600">{o.who}</span>
                              <span
                                className={cn(
                                  "mt-2.5 inline-block rounded-full px-2.5 py-1 text-xs font-bold",
                                  selected ? "bg-primary text-white" : "bg-primary/10 text-primary"
                                )}
                              >
                                {o.badge}
                              </span>
                            </span>
                            <span
                              aria-hidden
                              className={cn(
                                "mt-1 grid h-6 w-6 shrink-0 place-items-center rounded-full border-2",
                                selected ? "border-primary bg-primary text-white" : "border-sand-200"
                              )}
                            >
                              {selected && <Check className="h-3.5 w-3.5" />}
                            </span>
                          </span>
                        </label>

                        {selected && (
                          <div className="mx-4 border-t-2 border-dashed border-sand-200 pb-4 pt-4 sm:mx-5 sm:pb-5">
                            <p className={cn("text-xs font-bold text-gray-500", labelCaps)}>
                              {t("What you get", "ما ستحصل عليه")}
                            </p>
                            <ul className="mt-3 space-y-2">
                              {o.perks.map((perk) => (
                                <li key={perk} className="flex items-start gap-2.5 text-sm text-gray-700">
                                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" aria-hidden />
                                  {perk}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </fieldset>
            </div>

            {/* Form */}
            <div className="lg:sticky lg:top-24 lg:col-span-5" id="book-form">
              <div className="scroll-mt-24 rounded-3xl border border-sand-200 bg-white p-6 shadow-premium sm:p-8">
                {sentUrl ? (
                  <div className="text-center">
                    <CheckCircle2 className="mx-auto h-14 w-14 text-emerald-500" aria-hidden />
                    <h2 className="mt-4 text-2xl font-bold text-gray-900">
                      {firstName
                        ? t(`One last step, ${firstName}!`, `خطوة أخيرة يا ${firstName}!`)
                        : t("One last step!", "خطوة أخيرة!")}
                    </h2>
                    <p className="mt-2 text-sm leading-relaxed text-gray-600">
                      {t(
                        "WhatsApp should have opened with your details written. Press Send to confirm your booking.",
                        "كان يجب أن يفتح واتساب والرسالة مكتوبة ببياناتك. اضغط إرسال لتأكيد الحجز."
                      )}
                    </p>

                    <a
                      href={sentUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-green-600 py-4 text-base font-bold text-white shadow-lg shadow-green-600/20 transition-colors hover:bg-green-700"
                    >
                      <MessageCircle className="h-5 w-5" aria-hidden />
                      {t("Open WhatsApp again", "افتح واتساب مرة أخرى")}
                    </a>

                    {TELEGRAM_LINK && (
                      <a
                        href={TELEGRAM_LINK}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-800"
                      >
                        <Send className="h-4 w-4" aria-hidden />
                        {t("Prefer Telegram?", "تفضّل تيليجرام؟")}
                      </a>
                    )}

                    <ul className="mt-6 space-y-2 border-t border-sand-200 pt-5 text-start text-sm text-gray-600">
                      <li className="flex items-start gap-2.5">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" aria-hidden />
                        {t("We reply with lesson times in your time zone.", "نرد عليك بمواعيد مناسبة لتوقيتك.")}
                      </li>
                      <li className="flex items-start gap-2.5">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" aria-hidden />
                        {t("Your gifts are sent in the same chat.", "نرسل لك هداياك في المحادثة نفسها.")}
                      </li>
                    </ul>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} noValidate className="space-y-5">
                    <div>
                      <p className={cn("text-xs font-bold text-primary", labelCaps)}>
                        {t("Step 2", "الخطوة 2")}
                      </p>
                      <h2 className="mt-1 text-2xl font-bold text-gray-900">
                        {t("Reserve your free trial", "احجز حصتك التجريبية المجانية")}
                      </h2>
                      <p className="mt-3 inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
                        <Gift className="h-3.5 w-3.5" aria-hidden />
                        {current.title} · {current.badge}
                      </p>
                    </div>

                    <Field
                      id="bt-name"
                      label={multi ? t("First learner's name", "اسم المتعلم الأول") : t("Learner's name", "اسم المتعلم")}
                      error={errors.name}
                      hint={t("For a child, enter the child's name.", "للطفل، أدخل اسم الطفل.")}
                    >
                      <input
                        id="bt-name"
                        type="text"
                        autoComplete="off"
                        className={inputCls}
                        placeholder={t("e.g. Aisha", "مثال: عائشة")}
                        value={form.name}
                        onChange={(e) => set("name", e.target.value)}
                        aria-invalid={!!errors.name}
                      />
                    </Field>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <Field
                        id="bt-age"
                        label={multi ? t("First learner's age", "عمر المتعلم الأول") : t("Age", "العمر")}
                        error={errors.age}
                      >
                        <input
                          id="bt-age"
                          type="number"
                          inputMode="numeric"
                          min={3}
                          max={100}
                          className={inputCls}
                          placeholder="8"
                          value={form.age}
                          onChange={(e) => set("age", e.target.value)}
                          aria-invalid={!!errors.age}
                        />
                      </Field>

                      <Field label={t("Gender", "الجنس")} error={errors.gender}>
                        <div className="grid h-[46px] grid-cols-2 gap-2" role="group" aria-label={t("Gender", "الجنس")}>
                          {[
                            { value: "Male", label: t("Male", "ذكر") },
                            { value: "Female", label: t("Female", "أنثى") },
                          ].map((g) => (
                            <button
                              key={g.value}
                              type="button"
                              onClick={() => set("gender", g.value)}
                              aria-pressed={form.gender === g.value}
                              className={cn(
                                "rounded-xl border-2 text-sm font-bold transition-all",
                                form.gender === g.value
                                  ? "border-primary bg-primary text-white"
                                  : "border-sand-200 bg-sand-50 text-gray-600 hover:border-primary/30"
                              )}
                            >
                              {g.label}
                            </button>
                          ))}
                        </div>
                      </Field>
                    </div>

                    <Field label={t("Country", "الدولة")} error={errors.country}>
                      <CountrySelect
                        value={form.country}
                        onChange={(name: string) => set("country", name)}
                        isRTL={isRTL}
                      />
                    </Field>

                    {multi && (
                      <p className="rounded-xl bg-sand-50 px-4 py-3 text-xs leading-relaxed text-gray-600">
                        {t(
                          "You will add the other learners on WhatsApp. It takes a minute.",
                          "ستضيف بقية المتعلمين على واتساب، وتستغرق دقيقة."
                        )}
                      </p>
                    )}

                    <button
                      type="submit"
                      className="flex w-full items-center justify-center gap-2 rounded-xl bg-green-600 py-4 text-base font-bold text-white shadow-lg shadow-green-600/20 transition-colors hover:bg-green-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-700"
                    >
                      <MessageCircle className="h-5 w-5" aria-hidden />
                      {t("Claim my free trial on WhatsApp", "احجز حصتي المجانية عبر واتساب")}
                    </button>

                    <p className="flex items-center justify-center gap-1.5 text-center text-xs text-gray-500">
                      <ShieldCheck className="h-3.5 w-3.5 shrink-0 text-emerald-600" aria-hidden />
                      {t(
                        "No card · No obligation · WhatsApp opens with your details filled in",
                        "بدون بطاقة · بدون التزام · يفتح واتساب ومعه بياناتك جاهزة"
                      )}
                    </p>
                  </form>
                )}
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* ═══ Gifts ═══ */}
      <section className="bg-white py-14 md:py-20">
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-2xl font-bold text-gray-900 md:text-3xl">
              {t("Gifts that are yours to keep", "هدايا تبقى لك")}
            </h2>
            <p className="mt-3 text-gray-600">
              {t(
                "Whether or not you decide to enrol afterwards.",
                "سواء قررت الاشتراك بعد ذلك أم لا."
              )}
            </p>
          </div>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {gifts.map((g) => {
              const included = g.plans.includes(plan);
              const unlockPlan = offers.find((o) => o.id === g.plans[0]);
              const Icon = g.icon;
              return (
                <div
                  key={g.title}
                  className={cn(
                    "flex flex-col rounded-2xl border p-5 transition-colors",
                    included ? "border-primary/30 bg-primary/5" : "border-sand-200 bg-sand-50"
                  )}
                >
                  <span
                    className={cn(
                      "grid h-11 w-11 place-items-center rounded-xl",
                      included ? "bg-primary text-white" : "bg-sand-100 text-gray-500"
                    )}
                  >
                    <Icon className="h-5 w-5" aria-hidden />
                  </span>
                  <h3 className="mt-4 text-base font-bold text-gray-900">{g.title}</h3>
                  <p className="mt-1.5 flex-1 text-sm leading-relaxed text-gray-600">{g.desc}</p>
                  <p
                    className={cn(
                      "mt-4 inline-flex items-center gap-1.5 text-xs font-bold",
                      included ? "text-emerald-700" : "text-gray-500"
                    )}
                  >
                    {included ? (
                      <>
                        <Check className="h-3.5 w-3.5" aria-hidden />
                        {t("In your offer", "ضمن عرضك")}
                      </>
                    ) : (
                      t(`Unlocks with: ${unlockPlan?.title ?? ""}`, `يُتاح مع: ${unlockPlan?.title ?? ""}`)
                    )}
                  </p>
                </div>
              );
            })}
          </div>
        </Container>
      </section>

      {/* ═══ How it works ═══ */}
      <section className="bg-sand-50 py-14 md:py-20">
        <Container>
          <h2 className="text-center text-2xl font-bold text-gray-900 md:text-3xl">
            {t("How it works", "كيف تعمل الخطوات")}
          </h2>
          <ol className="mx-auto mt-10 grid max-w-4xl gap-8 md:grid-cols-3">
            {steps.map((s, i) => (
              <li key={s.title} className="text-center md:text-start">
                <span className="mx-auto grid h-11 w-11 place-items-center rounded-full bg-primary text-lg font-bold text-white md:mx-0">
                  {i + 1}
                </span>
                <h3 className="mt-4 text-lg font-bold text-gray-900">{s.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-gray-600">{s.body}</p>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      {/* ═══ FAQ + terms ═══ */}
      <section className="bg-white py-14 md:py-20">
        <Container>
          <div className="mx-auto max-w-3xl">
            <h2 className="text-2xl font-bold text-gray-900 md:text-3xl">
              {t("Questions parents ask", "أسئلة يسألها الأهالي")}
            </h2>

            <div className="mt-8 divide-y divide-sand-200 border-y border-sand-200">
              {faqs.map((f) => (
                <details key={f.q} className="group py-1">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 text-start [&::-webkit-details-marker]:hidden">
                    <span className="text-base font-semibold text-gray-900">{f.q}</span>
                    <ChevronDown
                      className="h-5 w-5 shrink-0 text-gray-500 transition-transform group-open:rotate-180"
                      aria-hidden
                    />
                  </summary>
                  <p className="pb-4 pe-8 text-sm leading-relaxed text-gray-600">{f.a}</p>
                </details>
              ))}
            </div>

            <div className="mt-10 rounded-2xl bg-sand-50 p-5">
              <h3 className="text-sm font-bold text-gray-900">{t("Offer terms", "شروط العرض")}</h3>
              <ul className="mt-3 list-disc space-y-2 ps-5 text-xs leading-relaxed text-gray-600">
                {terms.map((x) => (
                  <li key={x}>{x}</li>
                ))}
              </ul>
              <p className="mt-4 text-xs text-gray-500">
                {t("Want to hear from other parents? ", "تريد أن تسمع من أهالٍ آخرين؟ ")}
                <Link href="/testimonials" className="font-semibold text-primary underline underline-offset-4">
                  {t("Read their reviews", "اقرأ تقييماتهم")}
                </Link>
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* ═══ Closing ═══ */}
      <section className="relative isolate overflow-hidden py-16 text-center md:py-20">
        <div className="absolute inset-0 -z-20 bg-hero-gradient" />
        <div
          aria-hidden
          className="absolute inset-0 -z-10"
          style={{ backgroundImage: STAR_TILE, backgroundSize: "72px 72px" }}
        />
        <Container>
          <h2 className="text-3xl font-bold text-white md:text-4xl">
            {t("Your first lesson is on us.", "حصتك الأولى علينا.")}
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-white/80">
            {t(
              "Pick an offer, send four details, and meet your teacher.",
              "اختر عرضًا، أرسل أربع معلومات، وقابل معلمك."
            )}
          </p>
          <a
            href="#book-form"
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-accent px-8 py-4 text-base font-bold text-gray-900 transition-opacity hover:opacity-90"
          >
            <Gift className="h-5 w-5" aria-hidden />
            {t("Reserve my free trial", "احجز حصتي المجانية")}
          </a>
        </Container>
      </section>

      {/* ═══ Mobile sticky bar (slides away over the form and the footer) ═══ */}
      {!sentUrl && (
        <div
          aria-hidden={barHidden}
          className={cn(
            "fixed inset-x-0 bottom-0 z-40 border-t border-sand-200 bg-white/95 p-3 backdrop-blur transition-transform duration-300 lg:hidden",
            barHidden && "translate-y-full"
          )}
        >
          <a
            href="#book-form"
            tabIndex={barHidden ? -1 : 0}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-green-600 py-3.5 text-base font-bold text-white"
          >
            <Gift className="h-5 w-5" aria-hidden />
            {t(
              `Claim my free trial · up to ${FAMILY_DISCOUNT}% off`,
              `احجز حصتي المجانية · خصم حتى ${FAMILY_DISCOUNT}٪`
            )}
          </a>
        </div>
      )}
    </main>
  );
}