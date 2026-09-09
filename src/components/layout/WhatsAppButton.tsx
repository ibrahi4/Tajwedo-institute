"use client";

import React, { useState, useEffect } from "react";
import { MessageCircle, Send } from "lucide-react";
import { WHATSAPP_LINK, TELEGRAM_LINK } from "@/lib/constants";
import { useLocale } from "@/hooks/useLocale";
import {
  trackWhatsAppClick,
  trackTelegramClick,
} from "@/components/shared/GoogleTagManager";

export default function FloatingContactButtons() {
  const [mounted, setMounted] = useState(false);
  const { isRTL } = useLocale();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const whatsappText = isRTL
    ? encodeURIComponent("السلام عليكم، أود الاستفسار عن دروس معهد تجويدو.")
    : encodeURIComponent(
        "Assalamu Alaikum! I would like to inquire about lessons at Tajwedo Institute."
      );

  const waUrl = (WHATSAPP_LINK || "https://wa.me/201091857418") + "?text=" + whatsappText;
  const tgUrl = TELEGRAM_LINK || "https://t.me/TajwedoInstitute";

  return (
    <>
      <a
        id="gtm-whatsapp-float"
        href={waUrl}
        target="_blank"
        rel="noopener noreferrer"
        data-gtm="whatsapp"
        data-button-id="whatsapp_float"
        data-button-name="WhatsApp"
        data-button-location="floating"
        onClick={() =>
          trackWhatsAppClick({
            button_id: "whatsapp_float",
            button_location: "floating",
            button_text: "WhatsApp Floating",
            click_url: waUrl,
          })
        }
        className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-lg shadow-green-500/30 hover:scale-110 transition-all duration-300"
        aria-label="Chat on WhatsApp"
        title="WhatsApp"
      >
        <span className="absolute inset-0 rounded-full bg-green-500 animate-ping opacity-25" />
        <MessageCircle className="w-7 h-7 relative z-10" />
      </a>

      <a
        id="gtm-telegram-float"
        href={tgUrl}
        target="_blank"
        rel="noopener noreferrer"
        data-gtm="telegram"
        data-button-id="telegram_float"
        data-button-name="Telegram"
        data-button-location="floating"
        onClick={() =>
          trackTelegramClick({
            button_id: "telegram_float",
            button_location: "floating",
            button_text: "Telegram Floating",
            click_url: tgUrl,
          })
        }
        className="fixed bottom-6 left-6 z-50 flex items-center justify-center w-14 h-14 bg-[#229ED9] hover:bg-[#1D8AC4] text-white rounded-full shadow-lg shadow-sky-500/30 hover:scale-110 transition-all duration-300"
        aria-label="Chat on Telegram"
        title="Telegram"
      >
        <Send className="w-6 h-6 -translate-x-0.5" />
      </a>
    </>
  );
}