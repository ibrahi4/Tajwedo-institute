"use client";

import Script from "next/script";

const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID || "GTM-P5JSLSHS";

declare global {
  interface Window {
    dataLayer: Record<string, unknown>[];
  }
}

export default function GoogleTagManager() {
  if (!GTM_ID) return null;
  return (
    <Script id="gtm-base" strategy="afterInteractive">{`
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        "gtm.start": new Date().getTime(),
        event: "gtm.js"
      });
      (function(w,d,s,l,i){
        w[l]=w[l]||[];
        var f=d.getElementsByTagName(s)[0],
        j=d.createElement(s),dl=l!="dataLayer"?"&l="+l:"";
        j.async=true;
        j.src="https://www.googletagmanager.com/gtm.js?id="+i+dl;
        f.parentNode.insertBefore(j,f);
      })(window,document,"script","dataLayer","${GTM_ID}");
    `}</Script>
  );
}

export function GTMNoscript() {
  const id = process.env.NEXT_PUBLIC_GTM_ID || "GTM-P5JSLSHS";
  if (!id) return null;
  return (
    <noscript>
      <iframe
        src={"https://www.googletagmanager.com/ns.html?id=" + id}
        height="0"
        width="0"
        style={{ display: "none", visibility: "hidden" }}
      />
    </noscript>
  );
}

function str(v: unknown, fallback = ""): string {
  if (v === null || v === undefined) return fallback;
  return String(v);
}

/**
 * Push conversion / click events with ALL variables as defined strings.
 * Google Ads / GTM Data Layer Variables map to these exact keys.
 */
export function trackEvent(
  eventName: string,
  params?: Record<string, unknown>
) {
  if (typeof window === "undefined") return;

  window.dataLayer = window.dataLayer || [];

  const p = params || {};

  // Clear previous ecommerce-style undefined leftovers (best practice)
  window.dataLayer.push({ ecommerce: null });

  window.dataLayer.push({
    event: str(eventName, "custom_event"),

    // --- Standard click / button variables (for GTM Variable setup) ---
    eventCategory: str(p.eventCategory, "engagement"),
    eventAction: str(p.eventAction, "click"),
    eventLabel: str(p.eventLabel, eventName),

    button_id: str(p.button_id, ""),
    button_name: str(p.button_name, ""),
    button_location: str(p.button_location, ""),
    button_text: str(p.button_text, ""),

    click_url: str(p.click_url, ""),
    click_text: str(p.click_text, ""),
    link_url: str(p.link_url, str(p.click_url, "")),

    form_name: str(p.form_name, ""),
    service: str(p.service, ""),
    country: str(p.country, ""),
    level: str(p.level, ""),

    page_path: str(
      p.page_path,
      typeof window !== "undefined" ? window.location.pathname : ""
    ),
    page_url: str(
      p.page_url,
      typeof window !== "undefined" ? window.location.href : ""
    ),
    page_title: str(
      p.page_title,
      typeof document !== "undefined" ? document.title : ""
    ),

    currency: str(p.currency, "USD"),
    value: typeof p.value === "number" ? p.value : Number(p.value) || 0,

    transport_type: str(p.transport_type, ""), // whatsapp | telegram
  });
}

/** Dedicated WhatsApp click helper — variables always populated */
export function trackWhatsAppClick(opts: {
  button_id: string;
  button_location: string;
  button_text?: string;
  click_url: string;
}) {
  trackEvent("click_whatsapp", {
    eventCategory: "contact",
    eventAction: "click",
    eventLabel: "whatsapp",
    button_id: opts.button_id,
    button_name: "WhatsApp",
    button_location: opts.button_location,
    button_text: opts.button_text || "WhatsApp",
    click_text: opts.button_text || "WhatsApp",
    click_url: opts.click_url,
    link_url: opts.click_url,
    transport_type: "whatsapp",
  });
}

/** Dedicated Telegram click helper */
export function trackTelegramClick(opts: {
  button_id: string;
  button_location: string;
  button_text?: string;
  click_url: string;
}) {
  trackEvent("click_telegram", {
    eventCategory: "contact",
    eventAction: "click",
    eventLabel: "telegram",
    button_id: opts.button_id,
    button_name: "Telegram",
    button_location: opts.button_location,
    button_text: opts.button_text || "Telegram",
    click_text: opts.button_text || "Telegram",
    click_url: opts.click_url,
    link_url: opts.click_url,
    transport_type: "telegram",
  });
}