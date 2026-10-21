"use client";

import ThemeToggle from "@/components/ui/ThemeToggle";
import React, { useEffect, useRef, useState } from "react";
import { Globe, GraduationCap, Menu, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { useLocale } from "@/hooks/useLocale";
import Logo from "@/components/shared/Logo";
import Container from "@/components/shared/Container";

/* -------------------------------------------------------------------------- */
/*  Config                                                                    */
/* -------------------------------------------------------------------------- */

const NAV_LINKS = [
  { key: "home", href: "/" },
  { key: "about", href: "/about" },
  { key: "services", href: "/services" },
  { key: "howItWorks", href: "/how-it-works" },
  { key: "games", href: "/curriculum" },
  { key: "contact", href: "/contact" },
];

// Accessibility labels live here so no translation JSON needs to change.
const LABELS = {
  en: {
    skip: "Skip to main content",
    mainNav: "Main navigation",
    mobileNav: "Mobile navigation",
    openMenu: "Open navigation menu",
    closeMenu: "Close navigation menu",
    switchLang: "Switch language to Arabic",
    appearance: "Appearance",
    badgeNew: "New",
  },
  ar: {
    skip: "انتقل إلى المحتوى الرئيسي",
    mainNav: "التنقل الرئيسي",
    mobileNav: "قائمة التنقل",
    openMenu: "فتح قائمة التنقل",
    closeMenu: "إغلاق قائمة التنقل",
    switchLang: "التبديل إلى الإنجليزية",
    appearance: "المظهر",
    badgeNew: "جديد",
  },
} as const;

const FOCUS_RING =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 dark:focus-visible:ring-teal-300";

// Shared look for the square / pill utility buttons (language, hamburger, close)
const UTILITY_BTN =
  "inline-flex items-center justify-center gap-1.5 rounded-xl border border-stone-200 bg-stone-50 text-slate-700 transition-colors hover:bg-stone-100 dark:border-white/10 dark:bg-white/5 dark:text-slate-200 dark:hover:bg-white/10";

/* -------------------------------------------------------------------------- */
/*  Small pieces                                                              */
/* -------------------------------------------------------------------------- */

function NewBadge({ label }: { label: string }) {
  return (
    <span className="rounded-full bg-emerald-700 px-1.5 py-0.5 text-[10px] font-bold leading-none text-white ring-1 ring-white/20 dark:bg-emerald-400 dark:text-emerald-950 dark:ring-0">
      {label}
    </span>
  );
}

/* -------------------------------------------------------------------------- */
/*  Navbar                                                                    */
/* -------------------------------------------------------------------------- */

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const panelRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const toggleBtnRef = useRef<HTMLButtonElement>(null);

  const pathname = usePathname();
  const t = useTranslations("nav");
  const { locale, switchLocale, isRTL } = useLocale();

  const L = LABELS[locale === "ar" ? "ar" : "en"];
  const nextLocale = locale === "en" ? "ar" : "en";
  const toggleLocale = () => switchLocale(nextLocale);

  /* ---- Scroll state (passive listener; React bails out on same value) ---- */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 15);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* ---- Lock page scroll while the drawer is open ---- */
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  /* ---- Close the drawer after navigation ---- */
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  /* ---- Close the drawer if the viewport grows to desktop (rotate / resize) ---- */
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const onChange = (e: MediaQueryListEvent) => {
      if (e.matches) setMobileOpen(false);
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  /* ---- Drawer a11y: Escape to close, focus trap, restore focus ---- */
  useEffect(() => {
    if (!mobileOpen) return;
    const toggleBtn = toggleBtnRef.current;
    closeBtnRef.current?.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMobileOpen(false);
        return;
      }
      if (e.key !== "Tab" || !panelRef.current) return;

      const focusables = Array.from(
        panelRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
        )
      );
      if (!focusables.length) return;

      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      const active = document.activeElement;

      if (e.shiftKey && active === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      toggleBtn?.focus();
    };
  }, [mobileOpen]);

  /* ---- Active link logic (no false matches like /about vs /about-us) ---- */
  const safePathname = pathname || "/";
  const isActive = (href: string) => {
    if (href === "/") return safePathname === "/" || safePathname === "";
    return safePathname === href || safePathname.startsWith(`${href}/`);
  };

  /* ---- Header surface: solid fallback, glass when supported, both themes ---- */
  const shellCls = scrolled
    ? "border-stone-200/80 shadow-[0_8px_30px_-12px_rgba(15,23,42,0.18)] dark:border-white/10 dark:shadow-[0_8px_30px_-12px_rgba(0,0,0,0.65)] after:opacity-100"
    : "border-stone-100 dark:border-white/5 after:opacity-0";

  const linkCls = (active: boolean, size: "desktop" | "mobile") => {
    const base =
      size === "desktop"
        ? "inline-flex items-center gap-1.5 rounded-xl px-3 xl:px-3.5 py-1.5 text-sm font-semibold"
        : "flex min-h-12 items-center justify-between rounded-xl px-4 py-3 text-base font-semibold";

    const state = active
      ? "bg-[#0D4F4F] text-white shadow-sm dark:bg-teal-400/15 dark:text-teal-200 dark:shadow-none dark:ring-1 dark:ring-inset dark:ring-teal-400/30"
      : "text-slate-700 hover:bg-stone-200/70 hover:text-[#0D4F4F] dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white";

    return `${base} transition-colors duration-200 motion-reduce:transition-none ${FOCUS_RING} ${state}`;
  };

  const ctaCls = `items-center justify-center rounded-xl bg-[#0D4F4F] font-bold text-white shadow-md shadow-[#0D4F4F]/20 transition-colors hover:bg-[#093D33] dark:bg-teal-400 dark:text-slate-950 dark:shadow-teal-400/10 dark:hover:bg-teal-300 ${FOCUS_RING}`;

  return (
    <>
      {/* Skip link — add id="main-content" to your <main> element */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:start-4 focus:top-4 focus:z-[10000] focus:rounded-lg focus:bg-[#0D4F4F] focus:px-4 focus:py-2 focus:text-sm focus:font-bold focus:text-white"
      >
        {L.skip}
      </a>

      <header
        className={`fixed inset-x-0 top-0 z-[100] border-b bg-white py-2.5 transition-[box-shadow,border-color] duration-300 motion-reduce:transition-none supports-[backdrop-filter]:bg-white/85 supports-[backdrop-filter]:backdrop-blur-md dark:bg-slate-950 dark:supports-[backdrop-filter]:bg-slate-950/80 after:pointer-events-none after:absolute after:inset-x-0 after:bottom-[-1px] after:h-px after:bg-gradient-to-r after:from-transparent after:via-teal-600/40 after:to-transparent after:transition-opacity after:duration-300 dark:after:via-teal-300/40 ${shellCls}`}
      >
        <Container>
          <div className="flex h-14 items-center justify-between gap-3 md:h-16">
            {/* Logo */}
            <div className="flex shrink-0 items-center">
              <Logo />
            </div>

            {/* Desktop navigation */}
            <nav
              aria-label={L.mainNav}
              className="hidden items-center rounded-2xl border border-stone-200/70 bg-stone-50/80 px-1.5 py-1 lg:flex dark:border-white/10 dark:bg-white/5"
            >
              <ul className="flex items-center gap-0.5">
                {NAV_LINKS.map((link) => {
                  const active = isActive(link.href);
                  return (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        aria-current={active ? "page" : undefined}
                        className={linkCls(active, "desktop")}
                      >
                        {link.key === "games" && (
                          <GraduationCap
                            aria-hidden="true"
                            className={`h-4 w-4 ${
                              active
                                ? "text-amber-300 dark:text-amber-300"
                                : "text-amber-600 dark:text-amber-400"
                            }`}
                          />
                        )}
                        <span>{t(link.key)}</span>
                        {link.key === "games" && <NewBadge label={L.badgeNew} />}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <div className="hidden sm:block">
                <ThemeToggle />
              </div>

              <button
                type="button"
                onClick={toggleLocale}
                aria-label={L.switchLang}
                className={`${UTILITY_BTN} ${FOCUS_RING} hidden h-10 px-3 text-sm font-semibold md:inline-flex`}
              >
                <Globe aria-hidden="true" className="h-4 w-4 text-[#0D4F4F] dark:text-teal-300" />
                <span className="hidden xl:inline" lang={nextLocale}>
                  {locale === "en" ? "العربية" : "English"}
                </span>
                <span className="xl:hidden" aria-hidden="true">
                  {locale === "en" ? "AR" : "EN"}
                </span>
              </button>

              <Link
                href="/book-trial"
                className={`${ctaCls} hidden h-10 px-4 text-sm sm:inline-flex`}
              >
                {t("bookTrial")}
              </Link>

              {/* Mobile menu toggle */}
              <button
                ref={toggleBtnRef}
                type="button"
                onClick={() => setMobileOpen(true)}
                aria-label={L.openMenu}
                aria-expanded={mobileOpen}
                aria-controls="mobile-menu"
                className={`${UTILITY_BTN} ${FOCUS_RING} h-10 w-10 lg:hidden`}
              >
                <Menu aria-hidden="true" className="h-5 w-5 text-[#0D4F4F] dark:text-teal-300" />
              </button>
            </div>
          </div>
        </Container>
      </header>

      {/* Mobile drawer — always mounted so it can animate; hidden from AT + tab order when closed */}
      <div
        dir={isRTL ? "rtl" : "ltr"}
        aria-hidden={!mobileOpen}
        className={`fixed inset-0 z-[9999] transition-[visibility] duration-300 lg:hidden ${
          mobileOpen ? "visible" : "invisible"
        }`}
      >
        {/* Overlay */}
        <div
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
          className={`absolute inset-0 bg-slate-950/60 backdrop-blur-sm transition-opacity duration-300 motion-reduce:transition-none ${
            mobileOpen ? "opacity-100" : "opacity-0"
          }`}
        />

        {/* Panel */}
        <div
          ref={panelRef}
          id="mobile-menu"
          role="dialog"
          aria-modal="true"
          aria-label={L.mobileNav}
          className={`absolute inset-y-0 ${
            isRTL ? "left-0" : "right-0"
          } flex w-[88%] max-w-sm flex-col overflow-y-auto border-s border-stone-200 bg-white p-5 shadow-2xl transition-transform duration-300 ease-out motion-reduce:transition-none dark:border-white/10 dark:bg-slate-950 ${
            mobileOpen
              ? "translate-x-0"
              : isRTL
              ? "-translate-x-full"
              : "translate-x-full"
          }`}
        >
          <div className="mb-5 flex items-center justify-between border-b border-stone-100 pb-4 dark:border-white/10">
            <Logo />
            <button
              ref={closeBtnRef}
              type="button"
              onClick={() => setMobileOpen(false)}
              aria-label={L.closeMenu}
              className={`${UTILITY_BTN} ${FOCUS_RING} h-10 w-10`}
            >
              <X aria-hidden="true" className="h-5 w-5" />
            </button>
          </div>

          <nav aria-label={L.mobileNav} className="flex-1">
            <ul className="space-y-1">
              {NAV_LINKS.map((link) => {
                const active = isActive(link.href);
                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      onClick={() => setMobileOpen(false)}
                      aria-current={active ? "page" : undefined}
                      className={linkCls(active, "mobile")}
                    >
                      <span className="flex items-center gap-3">
                        {link.key === "games" && (
                          <GraduationCap
                            aria-hidden="true"
                            className={`h-5 w-5 ${
                              active
                                ? "text-amber-300 dark:text-amber-300"
                                : "text-amber-600 dark:text-amber-400"
                            }`}
                          />
                        )}
                        <span>{t(link.key)}</span>
                      </span>
                      {link.key === "games" && <NewBadge label={L.badgeNew} />}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="mt-6 space-y-3 border-t border-stone-100 pt-5 pb-[max(0.25rem,env(safe-area-inset-bottom))] dark:border-white/10">
            <div className="flex items-center justify-between rounded-xl border border-stone-200 bg-stone-50 px-4 py-2 dark:border-white/10 dark:bg-white/5">
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                {L.appearance}
              </span>
              <ThemeToggle />
            </div>

            <button
              type="button"
              onClick={() => {
                toggleLocale();
                setMobileOpen(false);
              }}
              className={`${UTILITY_BTN} ${FOCUS_RING} h-12 w-full text-sm font-semibold`}
            >
              <Globe aria-hidden="true" className="h-4 w-4 text-[#0D4F4F] dark:text-teal-300" />
              <span lang={nextLocale}>
                {locale === "en" ? "التغيير إلى العربية" : "Switch to English"}
              </span>
            </button>

            <Link
              href="/book-trial"
              onClick={() => setMobileOpen(false)}
              className={`${ctaCls} flex h-12 w-full text-base`}
            >
              {t("bookTrial")}
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}