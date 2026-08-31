"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2, Clock, Sparkles, BookOpen, Award,
  User, Mail, Globe, Calendar, ChevronRight, ChevronLeft, Cake,
  Languages, GraduationCap, UserCircle, Heart, AlertCircle, Phone,
  Users, Send, Shield, Book, Mic, Brain, PenTool, Library, Baby, Star,
  MapPin, MessageCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Container from "@/components/shared/Container";
import { WHATSAPP_LINK, TELEGRAM_LINK } from "@/lib/constants";
import { useLocale } from "@/hooks/useLocale";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";
import { Link } from "@/i18n/navigation";
import { trackEvent } from "@/components/shared/GoogleTagManager";
import CountrySelect from "./CountrySelect";
import PhoneInput from "./PhoneInput";
import { findCountryByName } from "./countries-data";

const groupedTimezones = [
  { region: "Africa", zones: ["Africa/Cairo", "Africa/Casablanca", "Africa/Algiers", "Africa/Tunis", "Africa/Lagos", "Africa/Nairobi", "Africa/Johannesburg", "Africa/Khartoum"] },
  { region: "Middle East", zones: ["Asia/Riyadh", "Asia/Dubai", "Asia/Qatar", "Asia/Kuwait", "Asia/Baghdad", "Asia/Amman", "Asia/Beirut", "Asia/Damascus", "Asia/Jerusalem", "Asia/Tehran"] },
  { region: "Asia", zones: ["Asia/Karachi", "Asia/Kolkata", "Asia/Dhaka", "Asia/Bangkok", "Asia/Jakarta", "Asia/Singapore", "Asia/Kuala_Lumpur", "Asia/Manila", "Asia/Hong_Kong", "Asia/Shanghai", "Asia/Tokyo", "Asia/Seoul"] },
  { region: "Europe", zones: ["Europe/London", "Europe/Dublin", "Europe/Paris", "Europe/Berlin", "Europe/Madrid", "Europe/Rome", "Europe/Amsterdam", "Europe/Brussels", "Europe/Vienna", "Europe/Zurich", "Europe/Stockholm", "Europe/Oslo", "Europe/Copenhagen", "Europe/Helsinki", "Europe/Warsaw", "Europe/Moscow", "Europe/Istanbul"] },
  { region: "Americas", zones: ["America/New_York", "America/Chicago", "America/Denver", "America/Los_Angeles", "America/Toronto", "America/Vancouver", "America/Mexico_City", "America/Sao_Paulo", "America/Buenos_Aires", "America/Bogota"] },
  { region: "Oceania", zones: ["Australia/Sydney", "Australia/Melbourne", "Australia/Perth", "Pacific/Auckland"] },
];

const nativeLanguages = [
  { value: "Arabic", label: "Arabic" },
  { value: "English", label: "English" },
  { value: "Urdu", label: "Urdu" },
  { value: "Turkish", label: "Turkish" },
  { value: "French", label: "French" },
  { value: "Spanish", label: "Spanish" },
  { value: "German", label: "German" },
  { value: "Indonesian", label: "Indonesian" },
  { value: "Malay", label: "Malay" },
  { value: "Bengali", label: "Bengali" },
  { value: "Other", label: "Other" },
];

const services = [
  { value: "quran-recitation", label: "Quran Recitation", icon: Book },
  { value: "tajweed-course", label: "Tajweed Course", icon: Mic },
  { value: "quran-memorization", label: "Quran Memorization", icon: Brain },
  { value: "arabic-language", label: "Arabic Language", icon: PenTool },
  { value: "islamic-studies", label: "Islamic Studies", icon: Library },
  { value: "kids-program", label: "Kids Program", icon: Baby },
  { value: "new-muslims", label: "New Muslims", icon: Star },
];

const studentLevels = [
  { value: "BEGINNER", label: "Beginner", desc: "Just starting out" },
  { value: "INTERMEDIATE", label: "Intermediate", desc: "Can read with help" },
  { value: "ADVANCED", label: "Advanced", desc: "Fluent reader" },
  { value: "HAFIZ", label: "Hafiz", desc: "Memorizing / Memorized" },
];

const parentRelations = [
  { value: "father", label: "Father" },
  { value: "mother", label: "Mother" },
  { value: "guardian", label: "Legal Guardian" },
  { value: "sibling", label: "Sibling" },
  { value: "other", label: "Other" },
];

function seededRandom(seed: number) {
  const x = Math.sin(seed + 1) * 10000;
  return x - Math.floor(x);
}

function FloatingShapes() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  const shapes = useMemo(() => Array.from({ length: 18 }, (_, i) => ({
    size: Math.round((6 + seededRandom(i * 9 + 1) * 14) * 100) / 100,
    top: Math.round(seededRandom(i * 9 + 2) * 10000) / 100,
    left: Math.round(seededRandom(i * 9 + 4) * 10000) / 100,
    duration: Math.round((5 + seededRandom(i * 9 + 5) * 7) * 100) / 100,
    delay: Math.round(seededRandom(i * 9 + 6) * 400) / 100,
    opacity: Math.round((0.15 + seededRandom(i * 9 + 7) * 0.2) * 1000) / 1000,
    isCircle: seededRandom(i * 9 + 3) > 0.5,
    rotation: Math.round(seededRandom(i * 9 + 8) * 36000) / 100,
  })), []);

  if (!mounted) return null;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {shapes.map((s, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{
            width: `${s.size}px`, height: `${s.size}px`,
            top: `${s.top}%`, left: `${s.left}%`,
            backgroundColor: `rgba(255,255,255,${s.opacity})`,
            borderRadius: s.isCircle ? "50%" : "4px",
            transform: `rotate(${s.rotation}deg)`,
          }}
          animate={{ y: [0, -20, 0], opacity: [s.opacity, s.opacity + 0.1, s.opacity] }}
          transition={{ duration: s.duration, repeat: Infinity, delay: s.delay, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}

function StepIndicator({ step, totalSteps }: { step: number; totalSteps: number }) {
  return (
    <div className="flex items-center justify-center gap-3 mb-8">
      {Array.from({ length: totalSteps }).map((_, idx) => {
        const n = idx + 1;
        const isActive = step === n;
        const isCompleted = step > n;
        return (
          <React.Fragment key={n}>
            <div className="flex items-center gap-2">
              <div className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-500",
                isCompleted ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/30" :
                isActive    ? "bg-primary text-white shadow-lg shadow-primary/30 ring-4 ring-primary/20 scale-110" :
                              "bg-white text-gray-400 border-2 border-sand-200"
              )}>
                {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : n}
              </div>
              <span className={cn(
                "text-xs font-bold hidden sm:block transition-colors",
                isActive ? "text-primary" : isCompleted ? "text-emerald-600" : "text-gray-400"
              )}>
                {n === 1 ? "Your Info" : "Learning"}
              </span>
            </div>
            {n < totalSteps && (
              <div className={cn(
                "h-1 w-12 sm:w-20 rounded-full transition-all duration-500",
                step > n ? "bg-emerald-500" : "bg-sand-200"
              )} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

type FieldProps = {
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
  hint?: string;
};

function Field({ label, icon: Icon, required, error, children, hint }: FieldProps) {
  return (
    <div className="space-y-1.5">
      <label className="flex items-center gap-1.5 text-xs font-bold text-gray-700 uppercase tracking-wider">
        {Icon && <Icon className="w-3.5 h-3.5" />}
        {label}
        {required && <span className="text-red-400">*</span>}
      </label>
      {children}
      {error && (
        <p className="text-xs text-red-600 flex items-center gap-1 mt-1">
          <AlertCircle className="w-3 h-3" />
          {error}
        </p>
      )}
      {!error && hint && (
        <p className="text-[11px] text-gray-500">{hint}</p>
      )}
    </div>
  );
}

const inputCls = "w-full px-4 py-3 rounded-xl border border-sand-200 bg-sand-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all text-sm font-sans";
const selectCls = "w-full px-4 py-3 rounded-xl border border-sand-200 bg-sand-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all text-sm font-sans appearance-none cursor-pointer bg-no-repeat bg-[length:16px] bg-[position:right_1rem_center]";
const selectArrow = { backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E\")" };

function StudentTypeCards({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const types = [
    { value: "self",   icon: User,  label: "For Myself",   desc: "I want to learn" },
    { value: "child",  icon: Heart, label: "For My Child", desc: "Registering for my kid" },
    { value: "family", icon: Users, label: "For Family",   desc: "Multiple family members" },
  ];

  return (
    <div className="grid grid-cols-3 gap-3">
      {types.map((t) => {
        const Icon = t.icon;
        const isSelected = value === t.value;
        return (
          <button
            key={t.value}
            type="button"
            onClick={() => onChange(t.value)}
            className={cn(
              "p-3 rounded-2xl border-2 text-left transition-all duration-200 group",
              isSelected
                ? "border-primary bg-primary/5 shadow-md shadow-primary/10"
                : "border-sand-200 hover:border-primary/30 hover:bg-sand-50"
            )}
          >
            <div className={cn(
              "w-10 h-10 rounded-xl flex items-center justify-center mb-2 transition-colors",
              isSelected ? "bg-primary text-white" : "bg-sand-100 text-gray-500 group-hover:bg-primary/10 group-hover:text-primary"
            )}>
              <Icon className="w-5 h-5" />
            </div>
            <p className={cn("font-bold text-sm leading-tight", isSelected ? "text-primary" : "text-gray-900")}>
              {t.label}
            </p>
            <p className="text-[10px] text-gray-500 mt-0.5">{t.desc}</p>
          </button>
        );
      })}
    </div>
  );
}

function SuccessScreen({ name, form }: { name: string; form: any }) {
  const msgText = `*New Trial Class Booking | Tajwedo Institute*
----------------------------------------
*Name:* ${form.firstName} ${form.lastName}
*Email:* ${form.email}
*Phone/WhatsApp:* ${form.phone}
*Country:* ${form.country}
*DOB & Gender:* ${form.dateOfBirth} (${form.gender})
*Native Language:* ${form.nativeLanguage}
*Student Type:* ${form.studentType}
*Course Needed:* ${form.service}
*Current Level:* ${form.currentLevel}
*Preferred Time:* ${form.preferredDate} ${form.preferredTime} (${form.timezone})
${form.parentName ? `*Parent:* ${form.parentName} (${form.parentRelation}) - ${form.parentPhone}\n` : ''}${form.message ? `*Notes:* ${form.message}` : ''}`;

  const encoded = encodeURIComponent(msgText);
  const waUrl = `${WHATSAPP_LINK}?text=${encoded}`;
  const tgUrl = `${TELEGRAM_LINK}`;

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 bg-sand-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full text-center bg-white rounded-3xl p-8 shadow-premium border border-sand-200"
      >
        <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-8 h-8 text-emerald-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Almost Done, {name.split(" ")[0]}!</h2>
        <p className="text-gray-600 text-sm mb-6">
          Click below to send your booking details directly to our academic team on WhatsApp or Telegram:
        </p>

        <div className="space-y-3 mb-6">
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full py-4 rounded-xl bg-green-500 hover:bg-green-600 text-white font-bold transition-all shadow-lg shadow-green-500/20"
          >
            <MessageCircle className="w-5 h-5" />
            Send Booking via WhatsApp
          </a>

          <a
            href={tgUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full py-4 rounded-xl bg-[#229ED9] hover:bg-[#1D8AC4] text-white font-bold transition-all shadow-lg shadow-sky-500/20"
          >
            <Send className="w-5 h-5" />
            Send Booking via Telegram
          </a>
        </div>

        <Link href="/" className="text-sm text-gray-500 font-medium hover:underline">
          Back to Homepage
        </Link>
      </motion.div>
    </div>
  );
}

export default function BookTrialContent() {
  const { isRTL } = useLocale();

  const [step, setStep] = useState(1);
  const [success, setSuccess] = useState(false);

  const [form, setForm] = useState({
    firstName: "", lastName: "", email: "",
    country: "", phone: "",
    dateOfBirth: "", gender: "",
    nativeLanguage: "",
    studentType: "", service: "", currentLevel: "",
    parentName: "", parentPhone: "", parentRelation: "",
    timezone: typeof window !== "undefined" ? Intl.DateTimeFormat().resolvedOptions().timeZone : "Africa/Cairo",
    preferredDate: "", preferredTime: "",
    message: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const set = useCallback((field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: "" }));
  }, []);

  const validateStep = (): boolean => {
    const errs: Record<string, string> = {};

    if (step === 1) {
      if (!form.firstName.trim()) errs.firstName = "First name required";
      if (!form.lastName.trim())  errs.lastName  = "Last name required";
      if (!form.email.trim() || !form.email.includes("@")) errs.email = "Valid email required";
      if (!form.country.trim())    errs.country   = "Country required";
      if (!form.phone.trim())      errs.phone     = "Valid phone required";
      if (!form.dateOfBirth)       errs.dateOfBirth = "Date of birth required";
      if (!form.gender)            errs.gender = "Select gender";
      if (!form.nativeLanguage)    errs.nativeLanguage = "Language required";
    }

    if (step === 2) {
      if (!form.studentType)  errs.studentType  = "Select student type";
      if (!form.service)      errs.service      = "Select course";
      if (!form.currentLevel) errs.currentLevel = "Select level";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = () => {
    if (validateStep()) setStep(s => s + 1);
    else toast.error("Please fill in all required fields");
  };

  const handleBack = () => setStep(s => s - 1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep()) return;

    const msgText = `*New Trial Class Booking | Tajwedo Institute*
----------------------------------------
*Name:* ${form.firstName} ${form.lastName}
*Email:* ${form.email}
*Phone/WhatsApp:* ${form.phone}
*Country:* ${form.country}
*DOB & Gender:* ${form.dateOfBirth} (${form.gender})
*Native Language:* ${form.nativeLanguage}
*Student Type:* ${form.studentType}
*Course Needed:* ${form.service}
*Current Level:* ${form.currentLevel}
*Preferred Time:* ${form.preferredDate} ${form.preferredTime} (${form.timezone})
${form.parentName ? `*Parent:* ${form.parentName} (${form.parentRelation}) - ${form.parentPhone}\n` : ''}${form.message ? `*Notes:* ${form.message}` : ''}`;

    const encoded = encodeURIComponent(msgText);
    const waUrl = `${WHATSAPP_LINK}?text=${encoded}`;

    window.open(waUrl, "_blank");
    trackEvent("generate_lead", {
      form_name: "book_trial",
      currency: "USD",
      value: 1,
      service: form.service,
      country: form.country,
    });
    trackEvent("book_trial_success", {
      service: form.service,
      level: form.currentLevel,
      country: form.country,
    });
    setSuccess(true);
  };

  if (success) return <SuccessScreen name={`${form.firstName} ${form.lastName}`} form={form} />;

  return (
    <main dir={isRTL ? "rtl" : "ltr"}>
      <section className="relative overflow-hidden pt-28 pb-20 md:pt-36 md:pb-28">
        <div className="absolute inset-0 bg-hero-gradient" />
        <FloatingShapes />
        <Container className="relative z-20">
          <div className="text-center max-w-3xl mx-auto">
            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-6xl font-bold text-white leading-tight mb-4">
              Start Your <span className="text-accent">Quran Journey</span>
            </motion.h1>
            <p className="text-lg text-white/75 max-w-2xl mx-auto">
              Book a free 30-minute trial with a qualified Tajwedo Institute teacher.
            </p>
          </div>
        </Container>
      </section>

      <section className="py-16 bg-sand-50 min-h-screen">
        <Container>
          <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-3xl p-6 md:p-10 border border-sand-200/60 shadow-premium">
              <StepIndicator step={step} totalSteps={2} />

              <form onSubmit={handleSubmit}>
                <AnimatePresence mode="wait">
                  {step === 1 && (
                    <motion.div key="step1" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="space-y-5">
                      <div className="grid sm:grid-cols-2 gap-4">
                        <Field label="First Name" icon={User} required error={errors.firstName}>
                          <input className={inputCls} placeholder="Ahmed" value={form.firstName} onChange={e => set("firstName", e.target.value)} />
                        </Field>
                        <Field label="Last Name" icon={User} required error={errors.lastName}>
                          <input className={inputCls} placeholder="Al-Rashid" value={form.lastName} onChange={e => set("lastName", e.target.value)} />
                        </Field>
                      </div>

                      <Field label="Email Address" icon={Mail} required error={errors.email}>
                        <input type="email" className={inputCls} placeholder="ahmed@example.com" value={form.email} onChange={e => set("email", e.target.value)} />
                      </Field>

                      <Field label="Country" icon={Globe} required error={errors.country}>
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
                            setErrors(prev => ({ ...prev, country: "" }));
                          }}
                          isRTL={isRTL}
                        />
                      </Field>

                      <Field label="WhatsApp Number" icon={Phone} required error={errors.phone}>
                        <PhoneInput
                          value={form.phone}
                          onChange={(fullPhone) => set("phone", fullPhone)}
                          defaultCountryCode={findCountryByName(form.country)?.code || "EG"}
                          placeholder="1234567890"
                          isRTL={isRTL}
                        />
                      </Field>

                      <div className="grid sm:grid-cols-2 gap-4">
                        <Field label="Date of Birth" icon={Cake} required error={errors.dateOfBirth}>
                          <input type="date" className={inputCls} value={form.dateOfBirth} onChange={e => set("dateOfBirth", e.target.value)} />
                        </Field>
                        <Field label="Gender" icon={UserCircle} required error={errors.gender}>
                          <div className="grid grid-cols-2 gap-2 h-[46px]">
                            {[{ value: "MALE", label: "Male" }, { value: "FEMALE", label: "Female" }].map(g => (
                              <button
                                key={g.value} type="button" onClick={() => set("gender", g.value)}
                                className={cn("rounded-xl border-2 text-sm font-bold transition-all", form.gender === g.value ? "border-primary bg-primary text-white" : "border-sand-200 bg-sand-50 text-gray-600")}
                              >
                                {g.label}
                              </button>
                            ))}
                          </div>
                        </Field>
                      </div>

                      <Field label="Native Language" icon={Languages} required error={errors.nativeLanguage}>
                        <select className={selectCls} style={selectArrow} value={form.nativeLanguage} onChange={e => set("nativeLanguage", e.target.value)}>
                          <option value="">Select language</option>
                          {nativeLanguages.map(l => <option key={l.value} value={l.value}>{l.label}</option>)}
                        </select>
                      </Field>
                    </motion.div>
                  )}

                  {step === 2 && (
                    <motion.div key="step2" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="space-y-5">
                      <Field label="Who is this trial for?" required error={errors.studentType}>
                        <StudentTypeCards value={form.studentType} onChange={v => set("studentType", v)} />
                      </Field>

                      <div className="grid sm:grid-cols-2 gap-4">
                        <Field label="What to Learn" icon={BookOpen} required error={errors.service}>
                          <select className={selectCls} style={selectArrow} value={form.service} onChange={e => set("service", e.target.value)}>
                            <option value="">Select a service</option>
                            {services.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                          </select>
                        </Field>
                        <Field label="Current Level" icon={GraduationCap} required error={errors.currentLevel}>
                          <select className={selectCls} style={selectArrow} value={form.currentLevel} onChange={e => set("currentLevel", e.target.value)}>
                            <option value="">Select level</option>
                            {studentLevels.map(l => <option key={l.value} value={l.value}>{l.label}</option>)}
                          </select>
                        </Field>
                      </div>

                      <div className="p-5 bg-sand-50 border border-sand-200 rounded-2xl space-y-4">
                        <Field label="Your Timezone" icon={MapPin}>
                          <select className={selectCls} style={selectArrow} value={form.timezone} onChange={e => set("timezone", e.target.value)}>
                            {groupedTimezones.map(group => (
                              <optgroup key={group.region} label={group.region}>
                                {group.zones.map(tz => <option key={tz} value={tz}>{tz.split("/")[1]?.replace(/_/g, " ") || tz}</option>)}
                              </optgroup>
                            ))}
                          </select>
                        </Field>
                        <div className="grid sm:grid-cols-2 gap-4">
                          <Field label="Preferred Date" icon={Calendar}>
                            <input type="date" className={inputCls} min={new Date().toISOString().split("T")[0]} value={form.preferredDate} onChange={e => set("preferredDate", e.target.value)} />
                          </Field>
                          <Field label="Preferred Time" icon={Clock}>
                            <input type="time" className={inputCls} value={form.preferredTime} onChange={e => set("preferredTime", e.target.value)} />
                          </Field>
                        </div>
                      </div>

                      <Field label="Additional Notes">
                        <textarea className={cn(inputCls, "resize-none h-20")} placeholder="Any special requirements..." value={form.message} onChange={e => set("message", e.target.value)} />
                      </Field>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="flex items-center justify-between mt-8 pt-6 border-t border-sand-100">
                  {step > 1 ? (
                    <button type="button" onClick={handleBack} className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-sand-200 text-gray-600 font-semibold text-sm">
                      <ChevronLeft className="w-4 h-4" /> Back
                    </button>
                  ) : <div />}

                  {step < 2 ? (
                    <button type="button" onClick={handleNext} className="flex items-center gap-2 px-8 py-3 rounded-xl bg-primary text-white font-bold text-sm shadow-lg shadow-primary/20">
                      Continue <ChevronRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <Button type="submit" size="lg" className="flex items-center gap-2 px-8 rounded-xl bg-green-600 hover:bg-green-700 text-white font-bold shadow-lg shadow-green-600/20">
                      <MessageCircle className="w-4 h-4" /> Book via WhatsApp
                    </Button>
                  )}
                </div>
              </form>
            </div>
          </div>
        </Container>
      </section>
    </main>
  );
}