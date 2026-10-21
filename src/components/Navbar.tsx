import ThemeToggle from "@/components/ui/ThemeToggle";
"use client";

import React, { useEffect, useState } from "react";
import { GraduationCap, Globe, Menu, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { useLocale } from "@/hooks/useLocale";
import Logo from "@/components/shared/Logo";
import Container from "@/components/shared/Container";
import { Button } from "@/components/ui/button";

const NAV_LINKS = [
  { key: "home", href: "/" },
  { key: "about", href: "/about" },
  { key: "services", href: "/services" },
  { key: "howItWorks", href: "/how-it-works" },
  { key: "curriculum", href: "/curriculum" },
  { key: "contact", href: "/contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const pathname = usePathname();
  const t = useTranslations("nav");
  const { locale, switchLocale, isRTL } = useLocale();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 15);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const safePathname = pathname || "/";
  const isActive = (href: string) => {
    if (href === "/") return safePathname === "/" || safePathname === "";
    return safePathname.startsWith(href);
  };

  // Always crisp white frosted background to ensure 100% contrast on all hero pages
  const shellCls = scrolled
    ? "bg-white/95 backdrop-blur-md border-b border-stone-200/80 shadow-sm py-2"
    : "bg-white/90 backdrop-blur-sm border-b border-stone-100/80 py-2.5";

  return (
    <>
      <header className={`fixed inset-x-0 top-0 z-[100] transition-all duration-300 ${shellCls}`}>
        <Container>
          <div className="flex items-center justify-between h-14 md:h-16">
            {/* Logo */}
            <div className="shrink-0 flex items-center">
              <Logo />
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1 rounded-2xl px-3 py-1 bg-stone-50 border border-stone-200/60">
              {NAV_LINKS.map((link) => {
                const active = isActive(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`inline-flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-xs md:text-sm font-bold transition-all duration-200 ${
                      active
                        ? "bg-[#0D4F4F] text-white shadow-sm"
                        : "text-slate-800 hover:bg-stone-200/60 hover:text-[#0D4F4F]"
                    }`}
                  >
                    {link.key === "curriculum" && <GraduationCap className="w-4 h-4 text-teal-600" />}
                    <span>{t(link.key)}</span>
                    {link.key === "curriculum" && (
                      <span className="rounded-full bg-emerald-600 px-1.5 py-0.5 text-[9px] font-black leading-none text-white">
                        FREE
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Desktop Actions */}
            <div className="flex items-center gap-2.5">
              <ThemeToggle /> <button
                type="button"
                onClick={() => switchLocale(locale === "en" ? "ar" : "en")}
                className="hidden md:inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-800 border border-stone-200 bg-stone-50 hover:bg-stone-100 transition-colors"
                aria-label="Switch language"
              >
                <Globe className="w-3.5 h-3.5 text-[#0D4F4F]" />
                <span>{locale === "en" ? "العربية" : "English"}</span>
              </button>

              <Link href="/book-trial" className="hidden sm:block">
                <Button size="sm" className="rounded-xl px-4 h-9 text-xs font-bold bg-[#0D4F4F] text-white shadow-md hover:bg-[#093D33]">
                  {t("bookTrial")}
                </Button>
              </Link>

              {/* Mobile Menu Toggle Button */}
              <button
                type="button"
                onClick={() => setMobileOpen(true)}
                className="inline-flex items-center justify-center rounded-xl p-2 lg:hidden text-slate-800 bg-stone-100 hover:bg-stone-200 transition-colors ms-1"
                aria-label="Open Navigation Menu"
              >
                <Menu className="w-6 h-6 text-[#0D4F4F]" />
              </button>
            </div>
          </div>
        </Container>
      </header>

      {/* Mobile Drawer Navigation */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[9999] lg:hidden" dir={isRTL ? "rtl" : "ltr"}>
          <div
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileOpen(false)}
            aria-hidden="true"
          />

          <div
            className={`fixed inset-y-0 ${
              isRTL ? "left-0" : "right-0"
            } w-[85%] max-w-sm bg-white shadow-2xl flex flex-col justify-between overflow-y-auto p-6 transition-transform`}
          >
            <div>
              <div className="flex items-center justify-between border-b border-stone-100 pb-5 mb-6">
                <Logo />
                <button
                  type="button"
                  onClick={() => setMobileOpen(false)}
                  className="rounded-xl p-2 text-slate-500 bg-stone-100 hover:bg-stone-200 transition-colors"
                  aria-label="Close Menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-1.5">
                {NAV_LINKS.map((link) => {
                  const active = isActive(link.href);
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setMobileOpen(false)}
                      className={`flex items-center justify-between rounded-xl px-4 py-3.5 text-base font-bold transition-colors ${
                        active
                          ? "bg-[#0D4F4F] text-white shadow-md"
                          : "text-slate-800 hover:bg-stone-100"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {link.key === "curriculum" && <GraduationCap className="w-5 h-5 text-teal-600" />}
                        <span>{t(link.key)}</span>
                      </div>
                      {link.key === "curriculum" && (
                        <span className="rounded-full bg-emerald-600 px-2 py-0.5 text-[10px] font-black text-white">
                          FREE
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>

            <div className="border-t border-stone-100 pt-5 space-y-3 mt-6">
              <ThemeToggle /> <button
                type="button"
                onClick={() => {
                  switchLocale(locale === "en" ? "ar" : "en");
                  setMobileOpen(false);
                }}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-stone-100 px-4 py-3.5 text-sm font-bold text-slate-800 hover:bg-stone-200 transition-colors"
              >
                <Globe className="w-4 h-4 text-[#0D4F4F]" />
                <span>{locale === "en" ? "التغيير إلى العربية" : "Switch to English"}</span>
              </button>

              <Link
                href="/book-trial"
                onClick={() => setMobileOpen(false)}
                className="block"
              >
                <Button className="w-full rounded-xl bg-[#0D4F4F] py-6 text-base font-bold text-white shadow-lg hover:bg-[#093D33]">
                  {t("bookTrial")}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}