"use client";

import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { Gamepad2, Trophy, Star, Pencil, BookOpen, Mic } from "lucide-react";
import { useTranslations } from "next-intl";
import SectionHeader from "@/components/shared/SectionHeader";
import GameCard from "./shared/GameCard";
import { gamesConfig } from "@/config/games";
import { Amiri, Fraunces } from "next/font/google";
import { useLocale } from "@/hooks/useLocale";
import { cn } from "@/lib/utils";

const fraunces = Fraunces({ subsets: ["latin"], display: "swap" });
const amiri = Amiri({ subsets: ["arabic"], weight: ["700"], display: "swap" });

/** Islamic star lattice — teal strokes, clearly visible on amber */
const STAR_TILE =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='64' height='64' viewBox='0 0 64 64'%3E%3Cg fill='none' stroke='%230D4F4F' stroke-opacity='0.14' stroke-width='1.25'%3E%3Cpath d='M12 12h40v40H12z'/%3E%3Cpath d='M32 4l28 28-28 28L4 32z'/%3E%3Ccircle cx='32' cy='32' r='3' fill='%230D4F4F' fill-opacity='0.08' stroke='none'/%3E%3C/g%3E%3C/svg%3E\")";

/** Tatreez embroidery strip — teal base + gold stitches (stands out under yellow hero) */
const TATREEZ =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='26' height='22' viewBox='0 0 26 22' shape-rendering='crispEdges'%3E%3Crect width='26' height='22' fill='%230D4F4F'/%3E%3Cpath fill='%23C8A96E' d='M0 0h26v2H0zM12 4h2v2h-2zM10 6h6v2h-6zM8 8h4v2H8zM14 8h4v2h-4zM6 10h4v2H6zM16 10h4v2h-4zM8 12h4v2H8zM14 12h4v2h-4zM10 14h6v2h-6zM12 16h2v2h-2zM0 20h26v2H0z'/%3E%3Cpath fill='%23FBF6EA' d='M0 10h2v2H0zM12 10h2v2h-2zM24 10h2v2h-2z'/%3E%3C/svg%3E\")";

function seededRandom(seed: number): number {
  const x = Math.sin(seed + 1) * 10000;
  return x - Math.floor(x);
}

const CONFETTI_COLORS = [
  "#0D4F4F", "#C8A96E", "#FF6B6B", "#4ECDC4",
  "#45B7D1", "#FFEAA7", "#DDA0DD", "#82E0AA",
  "#BB8FCE", "#85C1E9", "#F8C471", "#54A0FF",
];

interface ConfettiPiece {
  color: string;
  width: number;
  height: number;
  top: string;
  left: string;
  rotation: number;
  duration: number;
  delay: number;
  isCircle: boolean;
}

function ConfettiBackground() {
  const pieces: ConfettiPiece[] = useMemo(() => {
    return Array.from({ length: 28 }, (_, i) => {
      const isCircle = seededRandom(i * 7 + 8) > 0.55;
      const w = Math.round((5 + seededRandom(i * 7 + 1) * 10) * 10) / 10;
      return {
        color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
        width: w,
        height: isCircle ? w : Math.round((5 + seededRandom(i * 7 + 2) * 14) * 10) / 10,
        top: Math.round(seededRandom(i * 7 + 3) * 1000) / 10 + "%",
        left: Math.round(seededRandom(i * 7 + 4) * 1000) / 10 + "%",
        rotation: Math.round(seededRandom(i * 7 + 5) * 360),
        duration: Math.round((4 + seededRandom(i * 7 + 6) * 5) * 10) / 10,
        delay: Math.round(seededRandom(i * 7 + 7) * 20) / 10,
        isCircle,
      };
    });
  }, []);

  return (
    <div className="pointer-events-none absolute inset-0 z-[1] overflow-hidden" aria-hidden>
      {pieces.map((p, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{
            width: p.width,
            height: p.height,
            backgroundColor: p.color,
            borderRadius: p.isCircle ? "50%" : 2,
            top: p.top,
            left: p.left,
          }}
          animate={{
            y: [0, -18, 0],
            rotate: [p.rotation, p.rotation + 25, p.rotation],
            opacity: [0.45, 0.9, 0.45],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

export default function GamesHubContent() {
  const t = useTranslations("games");
  const { isRTL } = useLocale();

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-white to-amber-50">
      {/* ════════ HERO ════════ */}
      <section className="relative overflow-hidden bg-[#F5B942] pt-28 pb-[4.5rem] text-[#0D4F4F] md:pt-36 md:pb-24">
        {/* Solid base (explicit, not only Tailwind) */}
        <div aria-hidden className="absolute inset-0 z-0 bg-[#F5B942]" />

        {/* Islamic star lattice — clearly visible */}
        <div
          aria-hidden
          className="absolute inset-0 z-[1]"
          style={{
            backgroundImage: STAR_TILE,
            backgroundSize: "64px 64px",
            backgroundRepeat: "repeat",
            opacity: 1,
          }}
        />

        {/* Soft vignette so stars fade gently at edges */}
        <div
          aria-hidden
          className="absolute inset-0 z-[2]"
          style={{
            background:
              "radial-gradient(ellipse 80% 70% at 50% 40%, transparent 0%, rgba(245,185,66,0.35) 70%, rgba(245,185,66,0.55) 100%)",
          }}
        />

        <ConfettiBackground />

        <div className="container-custom relative z-10 mx-auto max-w-5xl px-4">
          <div className="mx-auto max-w-3xl text-center">
            <motion.div
              initial={{ opacity: 0, y: -16 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#0D4F4F]/25 bg-[#0D4F4F]/10 px-5 py-2"
            >
              <Gamepad2 className="h-4 w-4 text-[#0D4F4F]" />
              <span className="text-xs font-bold uppercase tracking-wider text-[#0D4F4F]">
                {t("hero.badge")}
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 }}
              className={cn(
                "mb-5 text-4xl font-bold text-[#0D4F4F] md:text-5xl lg:text-[3.75rem]",
                isRTL
                  ? cn(amiri.className, "leading-[1.35]")
                  : cn(fraunces.className, "leading-[1.08] tracking-tight")
              )}
            >
              {t("hero.title")}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.16 }}
              className="mx-auto mb-10 max-w-2xl text-[15px] font-medium leading-relaxed text-[#0D4F4F]/85 sm:text-lg"
            >
              {t("hero.subtitle")}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.24 }}
              className="flex flex-wrap items-center justify-center gap-3 sm:gap-5"
            >
              {[
                { icon: Gamepad2, value: "5", label: t("hero.games") },
                { icon: Trophy, value: "108", label: t("hero.levels") },
                { icon: Star, value: "324", label: t("hero.stars"), fill: true },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="flex items-center gap-3 rounded-2xl border border-[#0D4F4F]/15 bg-white/55 px-5 py-3.5 shadow-sm backdrop-blur-md"
                >
                  <stat.icon
                    className={cn(
                      "h-6 w-6 text-[#0D4F4F]",
                      stat.fill && "fill-[#0D4F4F]"
                    )}
                  />
                  <div className="text-start">
                    <p className="text-2xl font-black leading-none text-[#0D4F4F]">
                      {stat.value}
                    </p>
                    <p className="mt-1 text-[10px] font-bold uppercase tracking-wider text-[#0D4F4F]/70">
                      {stat.label}
                    </p>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Tatreez embroidery — full width, solid teal+gold strip */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-[22px] w-full"
          style={{
            backgroundImage: TATREEZ,
            backgroundRepeat: "repeat-x",
            backgroundSize: "26px 22px",
            backgroundPosition: "left bottom",
          }}
        />
      </section>

      {/* ════════ GAMES GRID ════════ */}
      <section className="py-16 md:py-24">
        <div className="container-custom mx-auto max-w-6xl px-4">
          <SectionHeader title={t("allGames.title")} subtitle={t("allGames.subtitle")} />
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8 lg:grid-cols-3">
            {gamesConfig.map((game, index) => (
              <GameCard key={game.id} game={game} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* ════════ FEATURES ════════ */}
      <section className="border-t border-amber-100/60 bg-white py-16 md:py-24">
        <div className="container-custom mx-auto max-w-6xl px-4">
          <SectionHeader title={t("features.title")} subtitle={t("features.subtitle")} />
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[0, 1, 2, 3].map((i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="rounded-3xl border border-amber-100 bg-amber-50/60 p-6 text-center transition-shadow hover:shadow-lg"
              >
                <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#0D4F4F] shadow-md">
                  {i === 0 && <Pencil className="h-7 w-7 text-amber-400" />}
                  {i === 1 && <Mic className="h-7 w-7 text-amber-400" />}
                  {i === 2 && <Star className="h-7 w-7 text-amber-400" />}
                  {i === 3 && <BookOpen className="h-7 w-7 text-amber-400" />}
                </div>
                <h3 className="mb-2 text-lg font-bold text-slate-900">
                  {t(`features.items.${i}.title`)}
                </h3>
                <p className="text-sm leading-relaxed text-slate-600">
                  {t(`features.items.${i}.description`)}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}