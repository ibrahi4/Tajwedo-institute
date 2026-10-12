"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { CheckCircle2, MessageCircle, Clock, Users, Shield, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import Container from "@/components/shared/Container";
import CountrySelect from "@/components/book-trial/CountrySelect";
import PhoneInput from "@/components/book-trial/PhoneInput";
import { findCountryByName } from "@/components/book-trial/countries-data";
import { WHATSAPP_LINK } from "@/lib/constants";
import { useLocale } from "@/hooks/useLocale";
import { trackEvent, trackWhatsAppClick } from "@/components/shared/GoogleTagManager";
import toast from "react-hot-toast";

export default function BookTrialClient() {
  const t = useTranslations("bookTrial");
  const { isRTL } = useLocale();
  const [submitting, setSubmittedState] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    whatsapp: "",
    country: "United States",
    service: "quran-recitation",
    studentType: "child",
    preferredTime: "",
    message: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleFieldChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.name.trim()) errs.name = "Required";
    if (!form.whatsapp.trim()) errs.whatsapp = "Required";
    setErrors(errs);
    return !Object.keys(errs).length;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      toast.error(t("errors.generic"));
      return;
    }

    setSubmittedState(true);

    const waMsg = `*Free Trial Booking | Tajwedo Institute*
*Name:* ${form.name}
*Email:* ${form.email || "N/A"}
*WhatsApp:* ${form.whatsapp}
*Country:* ${form.country}
*Service:* ${form.service}
*Student Type:* ${form.studentType}
*Preferred Time:* ${form.preferredTime || "Flexible"}
*Message:* ${form.message || "None"}`;

    const waUrl = `${WHATSAPP_LINK}?text=${encodeURIComponent(waMsg)}`;

    trackEvent("generate_lead", {
      form_name: "book_trial_page_form",
      service: form.service,
      country: form.country,
      currency: "USD",
      value: 1,
    });

    trackWhatsAppClick({
      button_id: "book_trial_submit",
      button_location: "book_trial_page",
      click_url: waUrl,
    });

    setTimeout(() => {
      setSubmittedState(false);
      setIsSuccess(true);
      window.open(waUrl, "_blank");
    }, 400);
  };

  const expectations = [0, 1, 2, 3, 4, 5];

  return (
    <div className="pt-24 pb-16 bg-[#FFFDF8]" dir={isRTL ? "rtl" : "ltr"}>
      <Container>
        {/* HERO */}
        <div className="max-w-3xl mx-auto text-center mb-12">
          <span className="inline-block px-3.5 py-1.5 rounded-full bg-[#0D4F4F]/10 text-[#0D4F4F] font-bold text-xs uppercase tracking-wider mb-4">
            {t("hero.badge")}
          </span>
          <h1
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-4 leading-tight"
            dangerouslySetInnerHTML={{
              __html: t("hero.title").replace(
                "<accent>",
                '<span class="text-[#C9A567]">'
              ).replace("</accent>", "</span>"),
            }}
          />
          <p className="text-slate-600 text-lg leading-relaxed">
            {t("hero.subtitle")}
          </p>

          {/* Stats Bar */}
          <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto mt-8 p-4 rounded-2xl bg-white border border-stone-200 shadow-sm">
            <div>
              <p className="text-2xl font-bold text-[#0D4F4F]">30</p>
              <p className="text-xs text-slate-500 font-semibold">{t("hero.stats.minutes")}</p>
            </div>
            <div className="border-x border-stone-200">
              <p className="text-2xl font-bold text-[#0D4F4F]">500+</p>
              <p className="text-xs text-slate-500 font-semibold">{t("hero.stats.students")}</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-[#C9A567]">100%</p>
              <p className="text-xs text-slate-500 font-semibold">{t("hero.stats.free")}</p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-12 items-start max-w-6xl mx-auto">
          {/* LEFT COLUMN: EXPECTATIONS & TESTIMONIAL & WHATSAPP */}
          <div className="lg:col-span-5 space-y-8">
            {/* Expectations */}
            <div className="p-6 sm:p-8 rounded-3xl bg-white border border-stone-200 shadow-sm space-y-4">
              <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-[#0D4F4F]" />
                <span>{t("expectations.title")}</span>
              </h2>
              <ul className="space-y-3">
                {expectations.map((idx) => (
                  <li key={idx} className="flex items-start gap-3 text-sm text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{t(`expectations.items.${idx}`)}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Testimonial Quote */}
            <div className="p-6 rounded-3xl bg-amber-500/5 border border-amber-500/20 relative">
              <p className="text-slate-700 text-sm italic leading-relaxed mb-4">
                &ldquo;{t("testimonial.quote")}&rdquo;
              </p>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[#0D4F4F] text-amber-400 font-bold flex items-center justify-center text-sm">
                  {t("testimonial.initial")}
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900">{t("testimonial.name")}</p>
                  <p className="text-[11px] text-slate-500">{t("testimonial.location")}</p>
                </div>
              </div>
            </div>

            {/* Direct WhatsApp Option */}
            <div className="p-6 rounded-3xl bg-emerald-50 border border-emerald-200 space-y-3">
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-[#25D366]" />
                <span>{t("whatsapp.title")}</span>
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {t("whatsapp.description")}
              </p>
              <a
                href={`${WHATSAPP_LINK}?text=${encodeURIComponent(
                  "Assalamu Alaikum, I would like to book a free trial lesson."
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() =>
                  trackWhatsAppClick({
                    button_id: "book_trial_sidebar_wa",
                    button_location: "book_trial_sidebar",
                    click_url: WHATSAPP_LINK,
                  })
                }
                className="inline-flex items-center justify-center gap-2 w-full h-11 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-xs transition-all shadow-sm"
              >
                <MessageCircle className="w-4 h-4" />
                <span>{t("whatsapp.button")}</span>
              </a>
            </div>
          </div>

          {/* RIGHT COLUMN: FORM */}
          <div className="lg:col-span-7">
            <div className="p-6 sm:p-10 rounded-3xl bg-white border border-stone-200 shadow-xl">
              {isSuccess ? (
                <div className="text-center py-12 space-y-4">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-8 h-8 stroke-[2.5]" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900">
                    {t("form.success.title")}
                  </h3>
                  <p className="text-slate-600 text-sm max-w-md mx-auto leading-relaxed">
                    {t("form.success.message")}
                  </p>
                  <Button
                    onClick={() => setIsSuccess(false)}
                    variant="outline"
                    className="rounded-xl border-stone-300 text-slate-700"
                  >
                    {t("form.success.again")}
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="border-b border-stone-100 pb-4 mb-2">
                    <h2 className="text-xl font-bold text-slate-900">
                      {t("form.title")}
                    </h2>
                    <p className="text-xs text-slate-500 mt-1">
                      {t("form.subtitle")}
                    </p>
                  </div>

                  {/* Name */}
                  <div>
                    <label className="block text-xs font-bold text-slate-900 mb-1">
                      {t("form.fields.name.label")}
                    </label>
                    <input
                      type="text"
                      value={form.name}
                      onChange={(e) => handleFieldChange("name", e.target.value)}
                      placeholder={t("form.fields.name.placeholder")}
                      className="w-full px-4 py-3 rounded-xl border border-stone-200 bg-white text-sm focus:outline-none focus:border-[#0D4F4F]"
                    />
                    {errors.name && <p className="text-xs text-rose-600 mt-1">Field required</p>}
                  </div>

                  {/* Email & Country */}
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-900 mb-1">
                        {t("form.fields.email.label")}
                      </label>
                      <input
                        type="email"
                        value={form.email}
                        onChange={(e) => handleFieldChange("email", e.target.value)}
                        placeholder={t("form.fields.email.placeholder")}
                        className="w-full px-4 py-3 rounded-xl border border-stone-200 bg-white text-sm focus:outline-none focus:border-[#0D4F4F]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-900 mb-1">
                        {t("form.fields.country.label")}
                      </label>
                      <CountrySelect
                        value={form.country}
                        isRTL={isRTL}
                        onChange={(name, country) => {
                          setForm((prev) => ({
                            ...prev,
                            country: name,
                            whatsapp:
                              country && (!prev.whatsapp || /^\+\d{1,4}\s*$/.test(prev.whatsapp))
                                ? `${country.dialCode} `
                                : prev.whatsapp,
                          }));
                        }}
                      />
                    </div>
                  </div>

                  {/* WhatsApp */}
                  <div>
                    <label className="block text-xs font-bold text-slate-900 mb-1">
                      {t("form.fields.whatsapp.label")}
                    </label>
                    <PhoneInput
                      value={form.whatsapp}
                      isRTL={isRTL}
                      placeholder={t("form.fields.whatsapp.placeholder")}
                      defaultCountryCode={findCountryByName(form.country)?.code || "US"}
                      onChange={(full) => handleFieldChange("whatsapp", full)}
                    />
                    {errors.whatsapp && <p className="text-xs text-rose-600 mt-1">Field required</p>}
                  </div>

                  {/* Service & Student Type */}
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-900 mb-1">
                        {t("form.fields.service.label")}
                      </label>
                      <select
                        value={form.service}
                        onChange={(e) => handleFieldChange("service", e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-stone-200 bg-white text-sm focus:outline-none focus:border-[#0D4F4F]"
                      >
                        <option value="quran-recitation">{t("form.fields.service.options.quran-recitation")}</option>
                        <option value="tajweed-course">{t("form.fields.service.options.tajweed-course")}</option>
                        <option value="arabic-language">{t("form.fields.service.options.arabic-language")}</option>
                        <option value="islamic-studies">{t("form.fields.service.options.islamic-studies")}</option>
                        <option value="kids-program">{t("form.fields.service.options.kids-program")}</option>
                        <option value="new-muslims">{t("form.fields.service.options.new-muslims")}</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-900 mb-1">
                        {t("form.fields.studentType.label")}
                      </label>
                      <select
                        value={form.studentType}
                        onChange={(e) => handleFieldChange("studentType", e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-stone-200 bg-white text-sm focus:outline-none focus:border-[#0D4F4F]"
                      >
                        <option value="child">{t("form.fields.studentType.options.child")}</option>
                        <option value="self">{t("form.fields.studentType.options.self")}</option>
                        <option value="family">{t("form.fields.studentType.options.family")}</option>
                      </select>
                    </div>
                  </div>

                  {/* Preferred Time */}
                  <div>
                    <label className="block text-xs font-bold text-slate-900 mb-1">
                      {t("form.fields.preferredTime.label")}
                    </label>
                    <input
                      type="text"
                      value={form.preferredTime}
                      onChange={(e) => handleFieldChange("preferredTime", e.target.value)}
                      placeholder={t("form.fields.preferredTime.placeholder")}
                      className="w-full px-4 py-3 rounded-xl border border-stone-200 bg-white text-sm focus:outline-none focus:border-[#0D4F4F]"
                    />
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-xs font-bold text-slate-900 mb-1">
                      {t("form.fields.message.label")}
                    </label>
                    <textarea
                      rows={3}
                      value={form.message}
                      onChange={(e) => handleFieldChange("message", e.target.value)}
                      placeholder={t("form.fields.message.placeholder")}
                      className="w-full px-4 py-3 rounded-xl border border-stone-200 bg-white text-sm focus:outline-none focus:border-[#0D4F4F]"
                    />
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    disabled={submitting}
                    className="w-full h-13 rounded-xl bg-[#0D4F4F] hover:bg-[#093D33] text-white font-bold text-sm shadow-lg shadow-[#0D4F4F]/20"
                  >
                    <Send className="w-4 h-4 me-2" />
                    {submitting ? t("form.submitting") : t("form.submit")}
                  </Button>

                  <p className="text-center text-[11px] text-slate-400">
                    {t("form.disclaimer")}
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}