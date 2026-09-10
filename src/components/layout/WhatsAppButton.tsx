"use client";

import React, { useRef } from "react";
import { MessageCircle, Send } from "lucide-react";
import { WHATSAPP_LINK, TELEGRAM_LINK } from "@/lib/constants";
import { useLocale } from "@/hooks/useLocale";

export default function FloatingContactButtons() {
  const { isRTL } = useLocale();
  const lastWaClick = useRef<number>(0);
  const lastTgClick = useRef<number>(0);

  const whatsappText = isRTL
    ? encodeURIComponent("السلام عليكم، أود الاستفسار عن دروس معهد تجويدو.")
    : encodeURIComponent("Assalamu Alaikum! I would like to inquire about lessons at Tajwedo Institute.");

  const waUrl = `${WHATSAPP_LINK || "https://wa.me/201043503232"}?text=${whatsappText}`;
  const tgUrl = TELEGRAM_LINK || "https://t.me/TajwedoInstitute";

  const pushWhatsAppEvent = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const now = Date.now();
    // Prevent double firing within 1 second
    if (now - lastWaClick.current < 1000) return;
    lastWaClick.current = now;

    if (typeof window !== "undefined") {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: "click_whatsapp",
        eventCategory: "Contact",
        eventAction: "Click WhatsApp",
        eventLabel: "WhatsApp Floating Button",
        button_id: "whatsapp_floating",
        button_name: "WhatsApp Floating Button",
        button_location: "floating_bottom_right",
        button_text: "WhatsApp",
        click_url: waUrl,
        "gtm.elementUrl": waUrl,
        elementUrl: waUrl,
        link_url: waUrl,
        destination_url: waUrl,
        platform: "whatsapp",
      });
    }
  };

  const pushTelegramEvent = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const now = Date.now();
    if (now - lastTgClick.current < 1000) return;
    lastTgClick.current = now;

    if (typeof window !== "undefined") {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: "click_telegram",
        eventCategory: "Contact",
        eventAction: "Click Telegram",
        eventLabel: "Telegram Floating Button",
        button_id: "telegram_floating",
        button_name: "Telegram Floating Button",
        button_location: "floating_bottom_left",
        button_text: "Telegram",
        click_url: tgUrl,
        "gtm.elementUrl": tgUrl,
        elementUrl: tgUrl,
        link_url: tgUrl,
        destination_url: tgUrl,
        platform: "telegram",
      });
    }
  };

  return (
    <>
      {/* WhatsApp Button - Bottom Right */}
      <a
        id="whatsapp-floating-btn"
        href={waUrl}
        target="_blank"
        rel="noopener noreferrer"
        onClick={pushWhatsAppEvent}
        data-gtm-event="click_whatsapp"
        data-button-id="whatsapp_floating"
        data-button-name="WhatsApp Floating Button"
        data-button-location="floating_bottom_right"
        data-button-text="WhatsApp"
        data-click-url={waUrl}
        data-platform="whatsapp"
        className="gtm-whatsapp-click fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-lg shadow-green-500/30 hover:scale-110 transition-all duration-300"
        aria-label="Chat on WhatsApp"
        title="WhatsApp"
      >
        <span className="absolute inset-0 rounded-full bg-green-500 animate-ping opacity-25" />
        <MessageCircle className="w-7 h-7 relative z-10" />
      </a>

      {/* Telegram Button - Bottom Left */}
      <a
        id="telegram-floating-btn"
        href={tgUrl}
        target="_blank"
        rel="noopener noreferrer"
        onClick={pushTelegramEvent}
        data-gtm-event="click_telegram"
        data-button-id="telegram_floating"
        data-button-name="Telegram Floating Button"
        data-button-location="floating_bottom_left"
        data-button-text="Telegram"
        data-click-url={tgUrl}
        data-platform="telegram"
        className="gtm-telegram-click fixed bottom-6 left-6 z-50 flex items-center justify-center w-14 h-14 bg-[#229ED9] hover:bg-[#1D8AC4] text-white rounded-full shadow-lg shadow-sky-500/30 hover:scale-110 transition-all duration-300"
        aria-label="Chat on Telegram"
        title="Telegram"
      >
        <Send className="w-6 h-6 -translate-x-0.5" />
      </a>
    </>
  );
}