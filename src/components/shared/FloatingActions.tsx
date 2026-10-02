"use client";

import React, { useState, useEffect } from "react";
import { Gift, Sparkles, X } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { useLocale } from "@/hooks/useLocale";
import { WHATSAPP_LINK } from "@/lib/constants";
import { trackEvent, trackWhatsAppClick } from "@/components/shared/GoogleTagManager";

export default function FloatingActions() {
  const { isRTL } = useLocale();
  const [mounted, setMounted] = useState(false);
  const [showGiftTooltip, setShowGiftTooltip] = useState(true);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const t = (en: string, ar: string) => (isRTL ? ar : en);

  const whatsappUrl = `${WHATSAPP_LINK}?text=${encodeURIComponent(
    t(
      "Assalamu Alaikum, I would like to inquire about Quran classes at Tajwedo Institute.",
      "السلام عليكم، أود الاستفسار عن دروس القرآن في معهد تجويدو."
    )
  )}`;

  const handleWhatsAppClick = () => {
    trackWhatsAppClick({
      button_id: "floating_wa_button",
      button_location: "floating_widget",
      button_text: "WhatsApp",
      click_url: whatsappUrl,
    });
  };

  const handleGiftClick = () => {
    trackEvent("click_floating_gift_offer", {
      eventCategory: "engagement",
      eventAction: "click",
      eventLabel: "floating_gift_offer",
      button_id: "floating_gift_button",
      button_location: "floating_widget",
    });
  };

  return (
    <>
      {/* 1. LEFT SIDE: GIFT / FREE TRIAL OFFER BUTTON */}
      <div className="fixed bottom-5 left-5 z-50 flex items-center select-none">
        <div className="relative flex items-center">
          {/* Tooltip Offer Banner */}
          {showGiftTooltip && (
            <div
              className={`hidden md:flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900/95 text-white text-xs font-bold shadow-xl border border-slate-700/80 backdrop-blur-md ${
                isRTL ? "ml-3" : "mr-3"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>{t("Claim 30-min Free Assessment!", "احصل على جلسة مجانية 30 دقيقة!")}</span>
              <button
                type="button"
                onClick={() => setShowGiftTooltip(false)}
                className="text-slate-400 hover:text-white ms-1 transition-colors"
                aria-label={t("Close offer badge", "إغلاق العرض")}
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Gift FAB with Red Unread Badge "1" */}
          <Link
            href="/book-trial"
            onClick={handleGiftClick}
            aria-label={t("Claim Free Trial Gift", "احصل على العرض التجريبي المجاني")}
            className="relative group flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-tr from-amber-600 via-amber-500 to-yellow-500 text-white shadow-xl shadow-amber-500/35 hover:shadow-amber-500/60 hover:scale-110 transition-all duration-300 active:scale-95"
          >
            {/* Pulsing Aura */}
            <span className="absolute -inset-1 rounded-full bg-amber-500/40 animate-ping pointer-events-none opacity-75" />

            <Gift className="w-7 h-7 stroke-[2.2] relative z-10" />

            {/* Red Unread Notification Badge "1" */}
            <span className="absolute -top-1 -right-1 flex h-5.5 w-5.5 items-center justify-center rounded-full bg-rose-600 text-[11px] font-extrabold text-white ring-2 ring-white shadow-lg animate-bounce">
              1
            </span>
          </Link>
        </div>
      </div>

      {/* 2. RIGHT SIDE: WHATSAPP BUTTON */}
      <div className="fixed bottom-5 right-5 z-50 flex items-center select-none">
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleWhatsAppClick}
          aria-label={t("Chat on WhatsApp", "محادثة عبر الواتساب")}
          className="relative group flex items-center justify-center w-14 h-14 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white shadow-xl shadow-[#25D366]/35 hover:shadow-[#25D366]/60 hover:scale-110 transition-all duration-300 active:scale-95"
        >
          {/* Pulsing Aura */}
          <span className="absolute -inset-1 rounded-full bg-[#25D366]/40 animate-ping pointer-events-none opacity-75" />

          {/* Official WhatsApp Clean SVG */}
          <svg
            className="w-8 h-8 fill-current relative z-10"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.275-.883-.71-1.48-1.587-1.653-1.884-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.572-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.87 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.99c-.002 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c-.001 2.096.65 4.14 1.88 5.86L0 24l6.45-1.691a11.801 11.801 0 005.6 1.428h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>

          {/* Red Unread Notification Badge "1" */}
          <span className="absolute -top-1 -right-1 flex h-5.5 w-5.5 items-center justify-center rounded-full bg-rose-600 text-[11px] font-extrabold text-white ring-2 ring-white shadow-lg animate-bounce">
            1
          </span>
        </a>
      </div>
    </>
  );
}