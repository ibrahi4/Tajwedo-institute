"use client";

import React from "react";
import { Amiri, Fraunces } from "next/font/google";
import { useLocale } from "@/hooks/useLocale";
import Container from "@/components/shared/Container";
import Breadcrumb, { BreadcrumbItem } from "@/components/shared/Breadcrumb";
import { cn } from "@/lib/utils";
import {
  Info,
  WalletCards,
  Mail,
  BookOpen,
  HelpCircle,
  Gamepad2,
  Sparkles,
  MessageCircle,
  Route,
  Star,
} from "lucide-react";

const fraunces = Fraunces({ subsets: ["latin"], display: "swap" });
const amiri = Amiri({ subsets: ["arabic"], weight: ["700"], display: "swap" });

const STAR_TILE =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='72' height='72' viewBox='0 0 64 64'%3E%3Cg fill='none' stroke='%23ffffff' stroke-opacity='.09' stroke-width='1'%3E%3Cpath d='M14 14h36v36H14z'/%3E%3Cpath d='M32 6.5 57.5 32 32 57.5 6.5 32z'/%3E%3C/g%3E%3C/svg%3E\")";

const TATREEZ_TEAL =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='26' height='22' viewBox='0 0 26 22' shape-rendering='crispEdges'%3E%3Crect width='26' height='22' fill='%230D4F4F'/%3E%3Cpath fill='%23C8A96E' d='M0 0h26v2h-26zM12 4h2v2h-2zM10 6h6v2h-6zM8 8h4v2h-4zM14 8h4v2h-4zM6 10h4v2h-4zM16 10h4v2h-4zM8 12h4v2h-4zM14 12h4v2h-4zM10 14h6v2h-6zM12 16h2v2h-2zM0 20h26v2h-26z'/%3E%3Cpath fill='%23FBF6EA' d='M0 10h2v2h-2zM12 10h2v2h-2zM24 10h2v2h-2z'/%3E%3C/svg%3E\")";

const TATREEZ_GOLD =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='26' height='22' viewBox='0 0 26 22' shape-rendering='crispEdges'%3E%3Crect width='26' height='22' fill='%23C8A96E'/%3E%3Cpath fill='%230D4F4F' d='M0 0h26v2h-26zM12 4h2v2h-2zM10 6h6v2h-6zM8 8h4v2h-4zM14 8h4v2h-4zM6 10h4v2h-4zM16 10h4v2h-4zM8 12h4v2h-4zM14 12h4v2h-4zM10 14h6v2h-6zM12 16h2v2h-2zM0 20h26v2h-26z'/%3E%3Cpath fill='%23FBF6EA' d='M0 10h2v2h-2zM12 10h2v2h-2zM24 10h2v2h-2z'/%3E%3C/svg%3E\")";

export type IconName =
  | "info"
  | "wallet"
  | "contact"
  | "course"
  | "faq"
  | "games"
  | "blog"
  | "how"
  | "reviews";

const ICON_MAP: Record<IconName, React.ComponentType<{ className?: string }>> = {
  info: Info,
  wallet: WalletCards,
  contact: Mail,
  course: BookOpen,
  faq: HelpCircle,
  games: Gamepad2,
  blog: Sparkles,
  how: Route,
  reviews: Star,
};

export type HeroTheme = "teal" | "gold";

interface PageHeroProps {
  title: string;
  subtitle: string;
  badge?: string;
  iconName?: IconName;
  breadcrumbs: BreadcrumbItem[];
  theme?: HeroTheme;
}

export default function PageHero({
  title,
  subtitle,
  badge,
  iconName,
  breadcrumbs,
  theme = "teal",
}: PageHeroProps) {
  const { isRTL } = useLocale();
  const IconComponent = iconName ? ICON_MAP[iconName] : null;
  const isGold = theme === "gold";

  return (
    <section
      className={cn(
        "relative isolate overflow-hidden text-white pt-28 pb-20 md:pt-36 md:pb-24",
        isGold ? "bg-[#B8945F]" : "bg-[#06302f]"
      )}
    >
      <div
        aria-hidden
        className={cn(
          "absolute inset-0 -z-20",
          isGold
            ? "bg-gradient-to-b from-[#8B6F3A] via-[#B8945F] to-[#C8A96E]"
            : "bg-gradient-to-b from-[#031a1a] via-[#06302f] to-[#0a4040]"
        )}
      />
      <div
        aria-hidden
        className="absolute inset-0 -z-10 opacity-60"
        style={{
          backgroundImage: STAR_TILE,
          backgroundSize: "72px 72px",
          WebkitMaskImage: "linear-gradient(to bottom, #000 0%, transparent 100%)",
          maskImage: "linear-gradient(to bottom, #000 0%, transparent 100%)",
        }}
      />

      <div
        aria-hidden
        className={cn(
          "pointer-events-none absolute -top-24 left-1/2 -z-10 h-[300px] w-[500px] -translate-x-1/2 rounded-full blur-[100px]",
          isGold ? "bg-white/20" : "bg-[#C8A96E]/15"
        )}
      />

      <Container className="relative z-10">
        <div className="max-w-3xl mx-auto text-center flex flex-col items-center">
          <div
            className={cn(
              "mb-6 opacity-90 hover:opacity-100 transition-opacity",
              isGold
                ? "[&_span]:text-white/80 [&_a]:text-white/80 [&_a:hover]:text-white [&_svg]:text-white/60 [&_[aria-current]]:text-[#06302f]"
                : "[&_span]:text-white/70 [&_a]:text-white/70 [&_a:hover]:text-white [&_svg]:text-white/50 [&_[aria-current]]:text-[#E3B45F]"
            )}
          >
            <Breadcrumb items={breadcrumbs} />
          </div>

          {badge && (
            <p
              className={cn(
                "mb-5 inline-flex items-center gap-2.5 text-[11.5px] font-semibold sm:gap-3 sm:text-[12.5px]",
                isGold ? "text-[#06302f]" : "text-[#E6CF9F]",
                !isRTL && "uppercase tracking-[0.1em] sm:tracking-[0.14em]"
              )}
            >
              {IconComponent ? (
                <IconComponent className={cn("w-4 h-4", isGold ? "text-[#06302f]" : "text-[#C8A96E]")} />
              ) : (
                <span aria-hidden className={cn("h-1.5 w-1.5 rotate-45", isGold ? "bg-[#06302f]" : "bg-[#C8A96E]")} />
              )}
              {badge}
              {!IconComponent && (
                <span aria-hidden className={cn("h-1.5 w-1.5 rotate-45", isGold ? "bg-[#06302f]" : "bg-[#C8A96E]")} />
              )}
            </p>
          )}

          <h1
            className={cn(
              "text-3xl font-bold sm:text-4xl lg:text-5xl mb-6",
              isGold ? "text-[#06302f]" : "text-white",
              isRTL
                ? cn(amiri.className, "leading-[1.4]")
                : cn(fraunces.className, "leading-[1.1] tracking-[-0.01em]")
            )}
          >
            {title}
          </h1>

          <p
            className={cn(
              "text-[15px] sm:text-lg leading-relaxed max-w-2xl mx-auto",
              isGold ? "text-[#06302f]/85" : "text-white/80"
            )}
          >
            {subtitle}
          </p>
        </div>
      </Container>

      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 z-20 h-[22px]"
        style={{
          backgroundImage: isGold ? TATREEZ_GOLD : TATREEZ_TEAL,
          backgroundRepeat: "repeat-x",
          backgroundSize: "26px 22px",
        }}
      />
    </section>
  );
}