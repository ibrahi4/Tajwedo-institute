"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  CheckCircle2, Sparkles, User, Mail, Globe, Heart, Shield, Star,
  MessageCircle, ArrowRight, ArrowLeft, Check, Phone, Play, Video,
  X, Users, Award, Clock, BookOpen, ShieldCheck, ChevronDown,
  Languages, ExternalLink
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

export default function LandingPageContent() {
  const { isRTL } = useLocale();
  const [mounted, setMounted] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeVideo, setActiveVideo] = useState<string | null>(null);
  const [reviewFilter, setReviewFilter] = useState("all");
  const [faqOpen, setFaqOpen] = useState<number | null>(0);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    country: "United States",
    age: "",
    gender: "",
    course: "quran-recitation",
    level: "BEGINNER",
    notes: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const handleInputChange = (field: string, val: string) => {
    setForm((prev) => ({ ...prev, [field]: val }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.name.trim()) errs.name = isRTL ? "الاسم مطلوب" : "Name is required";
    if (!form.phone.trim()) errs.phone = isRTL ? "رقم الواتساب مطلوب" : "WhatsApp phone required";
    const ageNum = Number(form.age);
    if (!form.age.trim() || Number.isNaN(ageNum) || ageNum < 3 || ageNum > 100) {
      errs.age = isRTL ? "أدخل عمراً صحيحاً (3-100)" : "Enter a valid age (3-100)";
    }
    if (!form.gender) errs.gender = isRTL ? "اختر الجنس" : "Select gender";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      toast.error(isRTL ? "يرجى ملء كافة الحقول المطلوبة" : "Please fill in required fields");
      return;
    }

    setLoading(true);

    const msgText = `*New Free Trial Booking | Tajwedo Institute*
----------------------------------------
*Name:* ${form.name}
*WhatsApp:* ${form.phone}
*Country:* ${form.country}
*Age:* ${form.age}
*Gender:* ${form.gender}
*Interested Course:* ${form.course}
*Current Level:* ${form.level}
${form.notes ? `*Notes:* ${form.notes}` : ''}`;

    const encoded = encodeURIComponent(msgText);
    const waUrl = `${WHATSAPP_LINK}?text=${encoded}`;

    trackEvent("generate_lead", {
      form_name: "ad_landing_page",
      service: form.course,
      country: form.country,
      currency: "USD",
      value: 1,
    });
    trackWhatsAppClick({
      button_id: "lp_form_submit",
      button_location: "ad_landing_page",
      button_text: "Book Free Trial LP",
      click_url: waUrl,
    });

    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      window.open(waUrl, "_blank");
    }, 400);
  };

  const waDirectUrl = `${WHATSAPP_LINK}?text=${encodeURIComponent(isRTL ? "السلام عليكم، أود حجز حصة تجريبية مجانية مع معهد تجويدو." : "Assalamu Alaikum, I would like to book a free trial session.")}`;

  // Sample Class Recordings
  const sampleVideos = [
    {
      id: "v1",
      title: isRTL ? "حصة تجويد تفاعلية للأطفال (8 سنوات)" : "Interactive Tajweed Class for Kids (8 Yo)",
      student: "Aisha M.",
      location: "London, UK",
      duration: "02:15",
      tag: isRTL ? "برنامج الأطفال" : "Kids Program",
      desc: isRTL ? "شاهد كيف تتفاعل الأستاذة مع الطفلة لتعليم مخارج الحروف بالإنجليزية واللطف." : "Watch how tutor Fatima guides 8yo Aisha in Noor Al-Bayan with patience & clarity.",
      poster: "/Tajwedo-Public-Assets/Services/Kids Program.webp",
    },
    {
      id: "v2",
      title: isRTL ? "تلاوة خاشعة وتطبيق أحكام التجويد الكبار" : "Adult Quran Recitation & Tajweed Correction",
      student: "Dr. Omar H.",
      location: "Texas, USA",
      duration: "03:40",
      tag: isRTL ? "تصحيح التلاوة" : "Tajweed Mastery",
      desc: isRTL ? "تصحيح دقيق لأحكام الترتيل والمدود مع شيخ أزهري معتمد." : "Detailed correction of Madd and Pronunciation with a certified Al-Azhar Shaykh.",
      poster: "/Tajwedo-Public-Assets/Services/Tajweed.webp",
    },
    {
      id: "v3",
      title: isRTL ? "دروس اللغة العربية والقرآن للمهتدين الجدد" : "Arabic & Quran Lessons for Reverts",
      student: "James Abdullah",
      location: "Toronto, Canada",
      duration: "01:50",
      tag: isRTL ? "المسلمون الجدد" : "New Muslims",
      desc: isRTL ? "تعلم النطق الصحيح لآيات الصلاة خطوة بخطوة باللغة الإنجليزية." : "Step-by-step guidance on reciting Surah Al-Fatiha for prayer fluency.",
      poster: "/Tajwedo-Public-Assets/Services/New Muslims.webp",
    },
  ];

  // Authentic Reviews (Lucide Icons, Zero Emojis)
  const allReviews = [
    {
      id: 1,
      category: "kids",
      name: "Sarah Mitchell",
      role: isRTL ? "ولي أمر طفلين" : "Parent of 2 Students",
      country: "London, UK",
      avatar: "SM",
      rating: 5,
      date: "Verified Parent",
      course: "Kids Quran & Noor Al-Bayan",
      verified: true,
      headline: isRTL ? "أفضل قرار اتخذته لطفليّ في الغربة" : "Exceptional Progress For My Children",
      text: isRTL
        ? "ابنتي كان لديها صعوبة شديدة في نطق الحروف العربية. خلال 3 أشهر فقط مع الأستاذة بمعهد تجويدو أصبحت تقرأ الجزء الثلاثون بطلاقة. الأسلوب التفاعلي رائع جداً."
        : "My 8yo daughter was struggling with Arabic letters. Within 3 months with Tajwedo Institute, she is now reciting Juz Amma smoothly. Highly recommended!",
    },
    {
      id: 2,
      category: "adults",
      name: "Dr. Bilal Hassan",
      role: isRTL ? "طالب حفظ وتجويد" : "Adult Hifz Student",
      country: "Texas, USA",
      avatar: "BH",
      rating: 5,
      date: "Verified Student",
      course: "Tajweed & Hifz Program",
      verified: true,
      headline: isRTL ? "معلمون أزاهرة بطلاقة ممتازة في الإنجليزية" : "True Al-Azhar Scholars Fluent in English",
      text: isRTL
        ? "البحث عن شيخ أزهري متقن ومجاز ومتقن للغة الإنجليزية في أمريكا كان صعباً جداً. الحمد لله معهد تجويدو وفر لي شيخاً ممتازاً يصحح لي التلاوة بمواعيد دقيقة."
        : "Finding an authentic Al-Azhar tutor with fluent English in the US was hard. My Shaykh at Tajwedo fixes my Tajweed nuances with incredible accuracy.",
    },
    {
      id: 3,
      category: "reverts",
      name: "Maryam K.",
      role: isRTL ? "مسلمة جديدة" : "Revert Sister",
      country: "Toronto, Canada",
      avatar: "MK",
      rating: 5,
      date: "Verified Student",
      course: "New Muslim Quran & Prayer",
      verified: true,
      headline: isRTL ? "تجربة مريحة ومشجعة جداً" : "Felt Completely Respected and Supported",
      text: isRTL
        ? "كنت متخوفة جداً من البدء من الصفر. المعلمة جعلتني أشعر بالراحة التامة وعلمتني الصلاة والتلاوة خطوة بخطوة باللغة الإنجليزية بدون أي تعقيد."
        : "As a revert, I was nervous about mispronouncing words. My female tutor was gentle and taught me Al-Fatiha and Salah recitations in plain English.",
    },
    {
      id: 4,
      category: "kids",
      name: "Eng. Tariq Al-Mansoor",
      role: isRTL ? "ولي أمر" : "Parent of Zayd (7yo)",
      country: "Dubai, UAE",
      avatar: "TM",
      rating: 5,
      date: "Verified Parent",
      course: "Quran Memorization",
      verified: true,
      headline: isRTL ? "تقارير أسبوعية تفصيلية ومتابعة جادة" : "Professional Weekly Progress Tracking",
      text: isRTL
        ? "أهم ما يميز معهد تجويدو هو الالتزام والتقارير الأسبوعية التي تصلني عن حفظ ابني زياد. المعهد مؤسسي واحترافي وليس مجرد دروس عشوائية."
        : "The weekly report card I receive about my son Zayd's Hifz progress is fantastic. It is a real structured academy, not just random lessons.",
    },
  ];

  const filteredReviews = reviewFilter === "all" ? allReviews : allReviews.filter(r => r.category === reviewFilter);

  const faqs = [
    {
      q: isRTL ? "هل الحصة التجريبية مجانية بالفعل بدون أي دفع؟" : "Is the 30-minute trial session truly 100% free?",
      a: isRTL
        ? "نعم، الحصة التجريبية مجانية 100% وبدون إدخال أي بطاقة ائتمانية. هدفها تقييم مستوى الطالب والتعرف على المعلم وتحديد الخطة المناسبة."
        : "Yes, 100% free with zero financial commitment or credit card needed. It is a risk-free 30-minute session to assess level & experience the teaching style.",
    },
    {
      q: isRTL ? "هل توجد معلمات إناث للأخوات والأطفال؟" : "Are qualified female teachers available for sisters & kids?",
      a: isRTL
        ? "نعم بالتأكيد، لدينا نخبة من المعلمات الحافظات المعتمدات من الأزهر الشريف والمجازات بطلاقة كاملة باللغة الإنجليزية للأخوات والأطفال."
        : "Yes! We have certified Al-Azhar female scholars with complete English fluency dedicated for sisters and young children upon request.",
    },
    {
      q: isRTL ? "كيف يتم تحديد المواعيد المناسبة لفرق التوقيت؟" : "How do class times work with international time zones?",
      a: isRTL
        ? "نعمل على مدار 24 ساعة طوال الأسبوع بمرونة كاملة لتنسيق المواعيد التي تناسب جدولكم في أمريكا، كندا، أوروبا، وأستراليا والخليج."
        : "We operate 24/7 across all timezones (US Eastern/Pacific, UK GMT, Europe, Gulf, Australia). We match schedules to your exact preference.",
    },
  ];

  return (
    <div className="min-h-screen bg-[#FAFAF7] font-sans text-gray-900 pb-20 sm:pb-0" dir={isRTL ? "rtl" : "ltr"}>
      
      {/* ── 0. SUBTLE TOP BAR ── */}
      <div className="bg-[#0D4F4F] text-white py-2 px-4 text-center text-xs font-semibold flex items-center justify-center gap-2">
        <Sparkles className="w-3.5 h-3.5 text-[#C8A96E]" />
        <span>
          {isRTL
            ? "معهد أزهري معتمد • استقبال طلبات تجريبية محدودة لهذا الأسبوع"
            : "Al-Azhar Certified Academy • Limited Free Trial Spots Available This Week"}
        </span>
      </div>

      {/* ── 1. MINIMAL SPACIOUS HEADER ── */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-[#EDE6DD] py-3.5">
        <Container>
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 relative shrink-0">
                <Image
                  src="/Tajwedo-Public-Assets/logo.webp"
                  alt="Tajwedo Institute"
                  width={36}
                  height={44}
                  className="object-contain"
                  priority
                />
              </div>
              <div className="flex flex-col leading-none">
                <span className="font-extrabold text-base text-[#0D4F4F] tracking-tight">
                  Tajwedo <span className="text-[#C8A96E]">Institute</span>
                </span>
                <span className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">
                  {isRTL ? "معهد تجويدو المعتمد" : "Online Quran Academy"}
                </span>
              </div>
            </div>

            {/* Header Right Actions */}
            <div className="flex items-center gap-3">
              {/* LINK TO MAIN WEBSITE */}
              <Link
                href="/"
                className="hidden md:inline-flex items-center gap-1.5 text-xs font-bold text-[#0D4F4F] hover:text-[#1A6B5A] px-3 py-2 rounded-xl bg-sand-100 hover:bg-sand-200 transition-colors"
              >
                <span>{isRTL ? "تصفح الموقع الرئيسي" : "Visit Main Website"}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>

              <a
                href={waDirectUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackWhatsAppClick({ button_id: "lp_header_wa", button_location: "lp_header", click_url: waDirectUrl })}
                className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-50 text-emerald-800 font-bold text-xs border border-emerald-200/80 hover:bg-emerald-100 transition-colors"
              >
                <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                <span>{isRTL ? "واتساب المعهد" : "WhatsApp"}</span>
              </a>

              <a
                href="#trial-form"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0D4F4F] text-white font-bold text-xs shadow-sm hover:bg-[#093737] transition-all"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#C8A96E]" />
                <span>{isRTL ? "احجز التجربة" : "Free Trial"}</span>
              </a>
            </div>
          </div>
        </Container>
      </header>

      {/* ── 2. WARM SPACIOUS HERO SECTION ── */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#FAF8F5] via-[#F5F0EB] to-[#FAFAF7] text-gray-900 pt-10 pb-16 md:pt-14 md:pb-20 border-b border-[#EDE6DD]">
        <Container className="relative z-10">
          <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Left Column: Value Prop */}
            <div className="lg:col-span-7 text-center lg:text-start space-y-6">
              
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white shadow-sm border border-[#EDE6DD]">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span className="text-xs font-bold text-[#0D4F4F]">
                  {isRTL ? "حصة 30 دقيقة مجانية 100% بدون أي التزام مالي" : "100% Free 30-Minute Live Trial Class"}
                </span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-[50px] font-extrabold text-[#0D4F4F] leading-[1.18] tracking-tight">
                {isRTL ? (
                  <>تعلّم القرآن والتجويد أونلاين مع <span className="text-[#C8A96E]">نخبة المعلمين الأزاهرة</span></>
                ) : (
                  <>Master Holy Quran & Tajweed Online With <span className="text-[#C8A96E]">Certified Al-Azhar Scholars</span></>
                )}
              </h1>

              <p className="text-base sm:text-lg text-gray-600 leading-relaxed font-normal max-w-2xl mx-auto lg:mx-0">
                {isRTL
                  ? "دروس فردية مخصصة 1-على-1 للأطفال والكبار. مع معلمين ومعلمات معتمدين متحدثين بالإنجليزي بطلاقة وجدول مرن يناسب مواعيدك."
                  : "Personalized 1-on-1 live classes for kids, adults & reverts. Taught by English-fluent male & female native scholars with 24/7 scheduling flexibility."}
              </p>

              {/* Feature Pills */}
              <div className="grid sm:grid-cols-2 gap-3 text-start max-w-xl mx-auto lg:mx-0 pt-2">
                {[
                  { title: isRTL ? "معلمون ومعلمات معتمدون أزهرياً" : "Al-Azhar Certified Male & Female Tutors", icon: ShieldCheck },
                  { title: isRTL ? "طلاقة كاملة باللغة الإنجليزية" : "Fluent Native English Communication", icon: Languages },
                  { title: isRTL ? "جدول مرن 24/7 حسب توقيتك" : "24/7 Flexible Global Scheduling", icon: Clock },
                  { title: isRTL ? "تقارير متابعة أسبوعية للأهالي" : "Weekly Progress Reports for Parents", icon: Award },
                ].map((feat, idx) => (
                  <div key={idx} className="flex items-center gap-2.5 bg-white px-3.5 py-2.5 rounded-2xl border border-[#EDE6DD] shadow-sm">
                    <div className="w-7 h-7 rounded-xl bg-[#F5F0EB] text-[#0D4F4F] flex items-center justify-center shrink-0">
                      <feat.icon className="w-4 h-4 text-[#0D4F4F]" />
                    </div>
                    <span className="text-xs font-bold text-gray-800">{feat.title}</span>
                  </div>
                ))}
              </div>

              {/* Social Proof */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-4 border-t border-[#EDE6DD]">
                <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-xl border border-[#EDE6DD]">
                  <div className="flex items-center gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <span className="text-xs font-bold text-gray-900 ms-1">4.9/5</span>
                </div>

                <div className="text-xs text-gray-600 font-semibold flex items-center gap-2">
                  <Users className="w-4 h-4 text-[#0D4F4F]" />
                  <span>{isRTL ? "أكثر من 500+ عائلة مسلمة في أمريكا وأوروبا والخليج" : "Joined by 500+ Muslim Families in US, UK & Gulf"}</span>
                </div>
              </div>

            </div>

            {/* Right Column: Crisp White Form Card */}
            <div id="trial-form" className="lg:col-span-5 scroll-mt-24">
              <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm text-gray-900 border border-[#EDE6DD] relative overflow-hidden">
                <div className="absolute top-0 inset-x-0 h-1.5 bg-[#0D4F4F]" />

                {submitted ? (
                  <div className="text-center py-8 space-y-4">
                    <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center mx-auto text-emerald-600">
                      <CheckCircle2 className="w-7 h-7" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">
                      {isRTL ? "تم تجهيز طلبك بنجاح!" : "Booking Request Ready!"}
                    </h3>
                    <p className="text-xs text-gray-600 leading-relaxed">
                      {isRTL
                        ? "اضغط على الزر أدناه لتأكيد حجزك مع الفريق الأكاديمي عبر الواتساب مباشرة:"
                        : "Click below to confirm your free trial directly with our academic team on WhatsApp:"}
                    </p>
                    <a
                      href={`${WHATSAPP_LINK}?text=${encodeURIComponent(`*Trial Request:* ${form.name} (${form.course})`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-sm text-sm transition-all"
                    >
                      <MessageCircle className="w-4 h-4" />
                      {isRTL ? "تأكيد الحجز عبر الواتساب" : "Confirm via WhatsApp Now"}
                    </a>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="text-center mb-4">
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold uppercase tracking-wider">
                        {isRTL ? "بدون بطاقة أئتمام • حصة مجانية 100%" : "No Credit Card Required • 100% Free"}
                      </span>
                      <h3 className="text-xl font-extrabold text-[#0D4F4F] mt-2">
                        {isRTL ? "احجز حصتك التجريبية الآن" : "Claim Your Free Trial Class"}
                      </h3>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {isRTL ? "استمارة حجز سريعة في 60 ثانية" : "Quick 60-second form to schedule your session"}
                      </p>
                    </div>

                                                            <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">{isRTL ? "الاسم الكامل *" : "Full Name *"}</label>
                      <input
                        type="text"
                        required
                        value={form.name}
                        onChange={(e) => handleInputChange("name", e.target.value)}
                        placeholder="e.g. Sarah Mitchell"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#EDE6DD] bg-[#FAFAF7] text-sm focus:outline-none focus:ring-2 focus:ring-[#0D4F4F]/20 focus:bg-white"
                      />
                      {errors.name && <p className="text-[11px] text-red-500 mt-0.5">{errors.name}</p>}
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">{isRTL ? "الدولة *" : "Country *"}</label>
                      <CountrySelect
                        value={form.country}
                        onChange={(name, country) => {
                          setForm(prev => ({
                            ...prev,
                            country: name,
                            phone: country && (!prev.phone || prev.phone.match(/^\+\d{1,4}\s*$/))
                              ? `${country.dialCode} `
                              : prev.phone,
                          }));
                        }}
                        isRTL={isRTL}
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">{isRTL ? "رقم الواتساب *" : "WhatsApp Phone Number *"}</label>
                      <PhoneInput
                        value={form.phone}
                        onChange={(fullPhone) => handleInputChange("phone", fullPhone)}
                        defaultCountryCode={findCountryByName(form.country)?.code || "US"}
                        placeholder="1234567890"
                        isRTL={isRTL}
                      />
                      {errors.phone && <p className="text-[11px] text-red-500 mt-0.5">{errors.phone}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">{isRTL ? "العمر *" : "Age *"}</label>
                        <input
                          type="number"
                          inputMode="numeric"
                          min={3}
                          max={100}
                          required
                          value={form.age}
                          onChange={(e) => handleInputChange("age", e.target.value)}
                          placeholder={isRTL ? "مثال: 12" : "e.g. 12"}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-[#EDE6DD] bg-[#FAFAF7] text-sm focus:outline-none focus:ring-2 focus:ring-[#0D4F4F]/20 focus:bg-white"
                        />
                        {errors.age && <p className="text-[11px] text-red-500 mt-0.5">{errors.age}</p>}
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">{isRTL ? "الجنس *" : "Gender *"}</label>
                        <div className="grid grid-cols-2 gap-2">
                          {[{ value: "Male", labelAr: "ذكر", labelEn: "Male" }, { value: "Female", labelAr: "أنثى", labelEn: "Female" }].map((g) => (
                            <button
                              key={g.value}
                              type="button"
                              onClick={() => handleInputChange("gender", g.value)}
                              className={`py-2.5 rounded-xl border text-xs font-bold transition-all ${
                                form.gender === g.value
                                  ? "border-[#0D4F4F] bg-[#0D4F4F] text-white"
                                  : "border-[#EDE6DD] bg-[#FAFAF7] text-gray-600 hover:border-[#0D4F4F]/30"
                              }`}
                            >
                              {isRTL ? g.labelAr : g.labelEn}
                            </button>
                          ))}
                        </div>
                        {errors.gender && <p className="text-[11px] text-red-500 mt-0.5">{errors.gender}</p>}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">{isRTL ? "الدورة" : "Course"}</label>
                        <select
                          value={form.course}
                          onChange={(e) => handleInputChange("course", e.target.value)}
                          className="w-full px-3 py-2.5 rounded-xl border border-[#EDE6DD] bg-[#FAFAF7] text-xs focus:outline-none focus:ring-2 focus:ring-[#0D4F4F]/20 focus:bg-white"
                        >
                          <option value="quran-recitation">Quran Recitation</option>
                          <option value="tajweed-course">Tajweed Rules</option>
                          <option value="arabic-language">Arabic Language</option>
                          <option value="kids-program">Kids Program</option>
                          <option value="new-muslims">New Muslims</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">{isRTL ? "المستوى" : "Level"}</label>
                        <select
                          value={form.level}
                          onChange={(e) => handleInputChange("level", e.target.value)}
                          className="w-full px-3 py-2.5 rounded-xl border border-[#EDE6DD] bg-[#FAFAF7] text-xs focus:outline-none focus:ring-2 focus:ring-[#0D4F4F]/20 focus:bg-white"
                        >
                          <option value="BEGINNER">Beginner (Zero)</option>
                          <option value="INTERMEDIATE">Intermediate</option>
                          <option value="ADVANCED">Advanced</option>
                        </select>
                      </div>
                    </div>

                    <Button
                      type="submit"
                      disabled={loading}
                      size="lg"
                      className="w-full py-5 rounded-xl bg-[#0D4F4F] hover:bg-[#093737] text-white font-extrabold text-sm shadow-sm mt-2 transition-all"
                    >
                      <Sparkles className="w-4 h-4 me-1.5 text-[#C8A96E]" />
                      {loading ? (isRTL ? "جاري التجهيز..." : "Processing...") : (isRTL ? "احجز الحصة التجريبية الآن" : "Book Free Trial Session")}
                    </Button>

                    <p className="text-[10px] text-gray-400 text-center flex items-center justify-center gap-1 pt-1">
                      <Shield className="w-3 h-3 text-emerald-600" />
                      {isRTL ? "معلوماتك آمنة 100% ومحمية بالكامل" : "100% Secure & confidential. Zero spam."}
                    </p>
                  </form>
                )}
              </div>
            </div>

          </div>
        </Container>
      </section>

      {/* ── 3. CLASSROOM VIDEO SHOWCASE ── */}
      <section className="py-16 bg-white border-b border-[#EDE6DD]">
        <Container>
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="px-3 py-1 rounded-full bg-[#F5F0EB] text-[#0D4F4F] text-xs font-bold uppercase tracking-wider">
              {isRTL ? "معاينة حية من الحصص" : "Inside Our Classroom"}
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mt-3">
              {isRTL ? "شاهد كيف تُدار الحصص التفاعلية في المعهد" : "See Our Interactive Classes in Action"}
            </h2>
            <p className="text-gray-600 text-xs sm:text-sm mt-2">
              {isRTL
                ? "نماذج واقعية لكيفية تفاعل المعلمين الأزاهرة مع الطلاب والأطفال بسهولة ولطف"
                : "Real recordings of how our Al-Azhar tutors interact with kids and adult students online."}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {sampleVideos.map((video) => (
              <div
                key={video.id}
                className="bg-[#FAFAF7] rounded-2xl overflow-hidden border border-[#EDE6DD] shadow-sm hover:shadow-md transition-all group flex flex-col justify-between"
              >
                <div className="relative h-44 bg-gray-900 overflow-hidden cursor-pointer" onClick={() => setActiveVideo(video.id)}>
                  <Image
                    src={video.poster}
                    alt={video.title}
                    fill
                    className="object-cover opacity-75 group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-[#0D4F4F] text-white flex items-center justify-center shadow-md group-hover:scale-110 transition-all border border-white/40">
                      <Play className="w-5 h-5 fill-white ms-0.5" />
                    </div>
                  </div>

                  <span className="absolute top-2.5 left-2.5 bg-black/60 text-white text-[10px] font-bold px-2 py-0.5 rounded">
                    {video.duration}
                  </span>

                  <span className="absolute top-2.5 right-2.5 bg-[#C8A96E] text-gray-900 font-extrabold text-[10px] px-2 py-0.5 rounded-full">
                    {video.tag}
                  </span>
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-sm text-gray-900 mb-1.5 leading-snug">
                      {video.title}
                    </h3>
                    <p className="text-xs text-gray-600 leading-relaxed">
                      {video.desc}
                    </p>
                  </div>

                  <div className="pt-3 mt-3 border-t border-[#EDE6DD] flex items-center justify-between text-xs">
                    <span className="font-bold text-[#0D4F4F] flex items-center gap-1 text-[11px]">
                      <User className="w-3.5 h-3.5 text-[#C8A96E]" />
                      {video.student}
                    </span>
                    <span className="text-gray-400 text-[11px]">{video.location}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* VIDEO MODAL PLAYER */}
      {activeVideo && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setActiveVideo(null)}>
          <div className="relative w-full max-w-2xl bg-black rounded-3xl overflow-hidden shadow-2xl border border-white/20" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setActiveVideo(null)}
              className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-white/20 hover:bg-white/40 text-white flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="p-8 text-center text-white space-y-3">
              <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/30">
                <Video className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold">Class Recording Preview</h3>
              <p className="text-xs text-gray-300 max-w-md mx-auto">
                {isRTL
                  ? "يتم تقديم جميع الحصص عبر القاعات الافتراضية المباشرة (Zoom / Google Meet) مع السبورة التفاعلية والتواصل المباشر."
                  : "All classes are hosted live 1-on-1 via Zoom with interactive whiteboards and screen sharing."}
              </p>
              <Button onClick={() => setActiveVideo(null)} className="bg-[#0D4F4F] hover:bg-[#093737] text-white font-bold rounded-xl px-5 text-xs">
                Close Preview
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ── 4. AUTHENTIC REVIEWS SECTION ── */}
      <section className="py-16 bg-[#FAFAF7] border-b border-[#EDE6DD]">
        <Container>
          <div className="text-center max-w-2xl mx-auto mb-8">
            <span className="text-xs font-bold text-[#0D4F4F] uppercase tracking-widest">{isRTL ? "تقييمات موثقة" : "Verified Student Stories"}</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mt-2">
              {isRTL ? "ماذا يقول أولياء الأمور والطلاب عنا؟" : "Trusted by Muslim Families in US, UK & Canada"}
            </h2>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
            {[
              { id: "all", label: isRTL ? "الكل" : "All Reviews" },
              { id: "kids", label: isRTL ? "أولياء الأمور والأطفال" : "Parents & Kids" },
              { id: "adults", label: isRTL ? "الكبار والتجويد" : "Adults & Tajweed" },
              { id: "reverts", label: isRTL ? "المسلمون الجدد" : "Reverts" },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setReviewFilter(f.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  reviewFilter === f.id
                    ? "bg-[#0D4F4F] text-white shadow-sm"
                    : "bg-white text-gray-600 hover:bg-sand-100 border border-[#EDE6DD]"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {filteredReviews.map((rev) => (
              <div key={rev.id} className="bg-white rounded-2xl p-6 border border-[#EDE6DD] shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#0D4F4F] text-white font-bold text-xs flex items-center justify-center shadow-sm">
                        {rev.avatar}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h4 className="font-bold text-xs text-gray-900">{rev.name}</h4>
                          <Globe className="w-3 h-3 text-gray-400" />
                          {rev.verified && (
                            <span className="inline-flex items-center gap-0.5 text-[9px] font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded-full border border-blue-100">
                              <ShieldCheck className="w-3 h-3 text-blue-600" />
                              Verified
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] text-gray-400">{rev.role} &middot; {rev.country}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-0.5">
                      {[...Array(rev.rating)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                  </div>

                  <h5 className="font-bold text-xs text-[#0D4F4F] mb-1.5">&ldquo;{rev.headline}&rdquo;</h5>
                  <p className="text-xs text-gray-600 leading-relaxed italic mb-3">
                    {rev.text}
                  </p>
                </div>

                <div className="pt-3 border-t border-[#EDE6DD] flex items-center justify-between text-[10px]">
                  <span className="px-2 py-0.5 rounded bg-sand-100 text-gray-700 font-bold">
                    {rev.course}
                  </span>
                  <span className="text-gray-400">{rev.date}</span>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ── 5. LINK BANNER TO MAIN WEBSITE ── */}
      <section className="py-10 bg-[#F5F0EB] border-b border-[#EDE6DD]">
        <Container>
          <div className="bg-white rounded-3xl p-6 md:p-8 border border-[#EDE6DD] shadow-sm flex flex-col md:flex-row items-center justify-between gap-6 max-w-5xl mx-auto">
            <div className="space-y-1.5 text-center md:text-start">
              <span className="px-2.5 py-0.5 rounded-full bg-accent/20 text-[#0D4F4F] text-[10px] font-extrabold uppercase">
                {isRTL ? "استكشف المعهد كاملاً" : "Explore Tajwedo Institute"}
              </span>
              <h3 className="text-lg md:text-xl font-extrabold text-[#0D4F4F]">
                {isRTL ? "هل ترغب بتصفح المناهج والألعاب التعليمية للأطفال؟" : "Looking to Explore Our Full Curriculum & Learning Games?"}
              </h3>
              <p className="text-xs text-gray-500">
                {isRTL ? "تعرف على كافة خدماتنا، الأسعار، وفلسفة التعليم في موقعنا الرسمي" : "Visit our main website to see all courses, games hub, blog articles, and tuition details."}
              </p>
            </div>

            <Link
              href="/"
              className="shrink-0 inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#0D4F4F] hover:bg-[#093737] text-white font-bold text-xs transition-all shadow-sm"
            >
              <span>{isRTL ? "الذهاب للموقع الرئيسي" : "Visit Official Website"}</span>
              <ExternalLink className="w-4 h-4 text-[#C8A96E]" />
            </Link>
          </div>
        </Container>
      </section>

      {/* ── 6. FAQ ACCORDION SECTION ── */}
      <section className="py-16 bg-white">
        <Container>
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-bold text-[#0D4F4F] uppercase tracking-widest">{isRTL ? "أسئلة شائعة" : "Got Questions?"}</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mt-2">
              {isRTL ? "كل ما تحتاج معرفته قبل البدء" : "Frequently Asked Questions"}
            </h2>
          </div>

          <div className="max-w-3xl mx-auto space-y-3">
            {faqs.map((faq, idx) => (
              <div key={idx} className="bg-[#FAFAF7] rounded-2xl border border-[#EDE6DD] overflow-hidden shadow-sm">
                <button
                  type="button"
                  onClick={() => setFaqOpen(faqOpen === idx ? null : idx)}
                  className="w-full p-4 sm:p-5 text-start font-bold text-xs sm:text-sm text-gray-900 flex items-center justify-between gap-4"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={cn("w-4 h-4 text-gray-400 transition-transform", faqOpen === idx && "rotate-180 text-[#0D4F4F]")} />
                </button>
                {faqOpen === idx && (
                  <div className="px-5 pb-5 text-xs text-gray-600 leading-relaxed border-t border-[#EDE6DD] pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ── 7. BOTTOM CALL TO ACTION ── */}
      <section className="py-16 bg-[#0D4F4F] text-white text-center relative overflow-hidden">
        <Container>
          <div className="max-w-2xl mx-auto relative z-10 space-y-5">
            <h2 className="text-2xl sm:text-4xl font-extrabold">
              {isRTL ? "ابدأ رحلة تعليم القرآن لأسرتك اليوم" : "Give Your Family The Gift of Quran Today"}
            </h2>
            <p className="text-white/80 text-xs sm:text-sm leading-relaxed">
              {isRTL
                ? "احجز حصتك التجريبية المجانية 100% الآن بدون أي مخاطرة أو التزام مالي."
                : "Book your 100% free 30-minute trial session now. Zero financial risk."}
            </p>
            <a
              href="#trial-form"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-[#C8A96E] hover:bg-[#b8985e] text-gray-900 font-extrabold text-xs sm:text-sm shadow-md transition-all"
            >
              <Sparkles className="w-4 h-4 text-gray-900" />
              <span>{isRTL ? "احجز الحصة التجريبية الآن" : "Claim Your Free Trial Session"}</span>
            </a>
          </div>
        </Container>
      </section>

      {/* ── 8. STICKY MOBILE BOTTOM BAR ── */}
      <div className="fixed bottom-0 inset-x-0 z-50 bg-white border-t border-[#EDE6DD] p-3 flex items-center gap-2 sm:hidden shadow-lg">
        <a
          href={waDirectUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackWhatsAppClick({ button_id: "lp_sticky_wa", button_location: "lp_mobile_bar", click_url: waDirectUrl })}
          className="flex-1 py-3 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold text-xs flex items-center justify-center gap-1.5"
        >
          <MessageCircle className="w-4 h-4 text-emerald-600" />
          <span>{isRTL ? "واتساب" : "WhatsApp"}</span>
        </a>

        <a
          href="#trial-form"
          className="flex-1 py-3 rounded-xl bg-[#0D4F4F] text-white font-extrabold text-xs flex items-center justify-center gap-1.5 shadow-md"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#C8A96E]" />
          <span>{isRTL ? "حصة تجريبية مجاناً" : "Book Free Trial"}</span>
        </a>
      </div>

    </div>
  );
}