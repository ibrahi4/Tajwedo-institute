"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Mail, Phone, MapPin, Clock, MessageCircle, Send,
  CheckCircle2, Sparkles, Globe, Shield,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Container from "@/components/shared/Container";
import { useTranslations } from "next-intl";
import { useLocale } from "@/hooks/useLocale";
import { WHATSAPP_LINK, TELEGRAM_LINK } from "@/lib/constants";

export default function ContactPageContent() {
  const t = useTranslations("contactPage");
  const { isRTL } = useLocale();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    whatsapp: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const msg = `*New Contact Message | Tajwedo Institute*
----------------------------------
*Name:* ${formData.name}
*Email:* ${formData.email}
*Phone/WhatsApp:* ${formData.whatsapp || 'N/A'}
*Message:* ${formData.message}`;

    const waUrl = `${WHATSAPP_LINK}?text=${encodeURIComponent(msg)}`;
    window.open(waUrl, "_blank");
    setSubmitted(true);
  };

  return (
    <main>
      <section className="relative overflow-hidden pt-28 pb-20 md:pt-36 md:pb-28">
        <div className="absolute inset-0 bg-hero-gradient" />
        <Container className="relative z-20">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
              {t("hero.title")} <span className="text-accent">Tajwedo Institute</span>
            </h1>
            <p className="text-lg text-white/80">{t("hero.subtitle")}</p>
          </div>
        </Container>
      </section>

      <section className="section-padding bg-sand-50">
        <Container>
          <div className="max-w-2xl mx-auto bg-white rounded-3xl p-8 md:p-10 border border-sand-200 shadow-premium">
            {submitted ? (
              <div className="text-center py-8">
                <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Message Sent!</h2>
                <p className="text-gray-600 mb-6">Your message has been formatted. If WhatsApp didn't open automatically, use one of the options below:</p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <a
                    href={`${WHATSAPP_LINK}?text=${encodeURIComponent(`*Contact:* ${formData.name} - ${formData.message}`)}`}
                    target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-green-500 text-white font-bold rounded-xl"
                  >
                    <MessageCircle className="w-5 h-5" /> Open in WhatsApp
                  </a>
                  <a
                    href={TELEGRAM_LINK}
                    target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#229ED9] text-white font-bold rounded-xl"
                  >
                    <Send className="w-5 h-5" /> Open in Telegram
                  </a>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Your Name *</label>
                  <input
                    type="text" name="name" required
                    value={formData.name} onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-sand-200 bg-sand-50"
                    placeholder="Ahmed Al-Rashid"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Email Address *</label>
                  <input
                    type="email" name="email" required
                    value={formData.email} onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-sand-200 bg-sand-50"
                    placeholder="ahmed@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">WhatsApp / Phone Number</label>
                  <input
                    type="tel" name="whatsapp"
                    value={formData.whatsapp} onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-sand-200 bg-sand-50"
                    placeholder="+201091857418"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Your Message *</label>
                  <textarea
                    name="message" required rows={4}
                    value={formData.message} onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-sand-200 bg-sand-50 resize-none"
                    placeholder="Ask us anything about our courses or schedules..."
                  />
                </div>
                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <Button type="submit" className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-6 rounded-xl gap-2 text-base">
                    <MessageCircle className="w-5 h-5" /> Send via WhatsApp
                  </Button>
                  <a
                    href={TELEGRAM_LINK}
                    target="_blank" rel="noopener noreferrer"
                    className="flex-1 inline-flex items-center justify-center bg-[#229ED9] hover:bg-[#1D8AC4] text-white font-bold py-3.5 rounded-xl gap-2 text-base"
                  >
                    <Send className="w-5 h-5" /> Contact on Telegram
                  </a>
                </div>
              </form>
            )}
          </div>
        </Container>
      </section>
    </main>
  );
}