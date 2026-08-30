"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Gamepad2, Globe, Menu, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { useLocale } from "@/hooks/useLocale";
import Logo from "@/components/shared/Logo";
import Container from "@/components/shared/Container";
import { Button } from "@/components/ui/button";

const NAV_LINKS = [
  { key: "home", href: "/" },
  { key: "about", href: "/about" },
  { key: "services", href: "/services" },
  { key: "howItWorks", href: "/how-it-works" },
  { key: "games", href: "/games" },
  { key: "contact", href: "/contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const t = useTranslations("nav");
  const { locale, switchLocale, isRTL } = useLocale();
  const cleanPath = pathname.replace(/^\/(en|ar)/, "") || "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  const isActive = (href: string) =>
    href === "/" ? cleanPath === "/" : cleanPath.startsWith(href);

  const linkCls = (active: boolean) =>
    `inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-medium transition-all duration-200 ${
      active
        ? "bg-primary/6 text-primary"
        : "text-gray-700 hover:bg-gray-100 hover:text-primary"
    }`;

  const shellCls = scrolled
    ? "bg-white/95 backdrop-blur-xl border-b border-stone-200/80 shadow-[0_4px_20px_rgba(15,23,42,0.04)]"
    : "bg-white/80 backdrop-blur-md border-b border-stone-100";

  return (
    <>
      <nav className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${shellCls}`}>
        <Container>
          <div className="flex h-16 items-center justify-between md:h-20">
            <div className="shrink-0">
              <Logo />
            </div>
            <div className="hidden lg:flex items-center gap-1 rounded-2xl px-2 py-1">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={linkCls(isActive(link.href))}
                >
                  {link.key === "games" && <Gamepad2 className="h-4 w-4" />}
                  {t(link.key)}
                  {link.key === "games" && (
                    <span className="rounded-full bg-accent px-1.5 py-0.5 text-[10px] font-bold leading-none text-white">
                      NEW
                    </span>
                  )}
                </Link>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => switchLocale(locale === "en" ? "ar" : "en")}
                className="hidden md:inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-primary"
                aria-label="Switch language"
              >
                <Globe className="h-4 w-4" />
                <span>{locale === "en" ? "Ar" : "EN"}</span>
              </button>
              <Link href="/book-trial" className="hidden md:block">
                <Button className="rounded-xl px-5 text-sm font-semibold bg-primary text-white shadow-lg shadow-primary/15 hover:bg-primary/90">
                  {t("bookTrial")}
                </Button>
              </Link>
              <button
                onClick={() => setMobileOpen((p) => !p)}
                className="inline-flex items-center justify-center rounded-xl p-2 lg:hidden text-gray-700 hover:bg-gray-100"
                aria-expanded={mobileOpen}
                aria-label="Menu"
              >
                {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </Container>
      </nav>

      {mobileOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
            onClick={() => setMobileOpen(false)}
          />
          <div
            className={`fixed top-0 bottom-0 z-50 w-[88%] max-w-sm overflow-y-auto bg-white shadow-2xl lg:hidden ${
              isRTL ? "left-0" : "right-0"
            }`}
          >
            <div className="flex items-center justify-between border-b border-gray-100 px-5 py-5">
              <Logo />
              <button
                onClick={() => setMobileOpen(false)}
                className="rounded-xl p-2 text-gray-500 hover:bg-gray-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-5 space-y-1">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-2 rounded-xl px-4 py-3 text-base font-medium ${
                    isActive(link.href)
                      ? "bg-primary/5 text-primary"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {link.key === "games" && <Gamepad2 className="h-5 w-5" />}
                  {t(link.key)}
                  {link.key === "games" && (
                    <span className="rounded-full bg-accent px-1.5 py-0.5 text-[10px] font-bold text-white">
                      NEW
                    </span>
                  )}
                </Link>
              ))}
            </div>
            <div className="border-t border-gray-100 p-5 space-y-3">
              <button
                onClick={() => switchLocale(locale === "en" ? "ar" : "en")}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-gray-100 px-4 py-3 font-semibold text-gray-700 hover:bg-gray-200"
              >
                <Globe className="h-5 w-5" />
                {locale === "en" ? "عربي" : "English"}
              </button>
              <Link
                href="/book-trial"
                onClick={() => setMobileOpen(false)}
                className="block"
              >
                <Button className="w-full rounded-xl bg-primary py-6 text-base font-semibold text-white shadow-lg shadow-primary/20 hover:bg-primary/90">
                  {t("bookTrial")}
                </Button>
              </Link>
            </div>
          </div>
        </>
      )}
    </>
  );
}