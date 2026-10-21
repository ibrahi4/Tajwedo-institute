/**
 * Tajwedo brand kit: the single source of truth for fonts, colours and the
 * signature pieces (star lattice, ornament, tatreez band, dark-teal hero).
 * Place at: src/lib/ui/brand.tsx
 */
import React from "react";
import { Amiri, DM_Serif_Display } from "next/font/google";
import { cn } from "@/lib/utils";

/* ------------------------------- Fonts ------------------------------- */

export const dmSerif = DM_Serif_Display({ subsets: ["latin"], weight: ["400"], display: "swap" });
// preload:false so English visitors don't download the Arabic font up-front.
export const amiri = Amiri({ subsets: ["arabic", "latin"], weight: ["400", "700"], display: "swap", preload: false });

export const displayFont = (isAr: boolean) => (isAr ? amiri.className : dmSerif.className);
export const headingClass = (isAr: boolean) =>
  `${displayFont(isAr)} ${isAr ? "font-bold leading-[1.45]" : "font-normal leading-[1.1] tracking-[-0.01em]"}`;

/* ------------------------------ Palette ------------------------------ */
/* deep   #06302f  hero / footer surfaces        teal  #0D4F4F  ink + tatreez ground
   gold   #C8A96E  lines, fills, buttons         goldL #E3B45F  gold text on dark
   goldD  #A8832F  gold text on light            cream #FBF8F2  page body (light)   */

export const WRAP = "mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8";
export const INK = "text-[#0D4F4F] dark:text-white";
export const MUTED = "text-slate-600 dark:text-slate-400";
export const GOLD_TEXT = "text-[#A8832F] dark:text-[#E3B45F]";
export const CARD = "border border-stone-200 bg-white dark:border-white/10 dark:bg-[#111827]";
export const ARROW = "h-4 w-4 shrink-0 rtl:rotate-180";

export const FOCUS =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600 dark:focus-visible:outline-teal-300";
const FOCUS_ON_DARK =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white";

const BTN =
  "inline-flex min-h-12 items-center justify-center gap-2 rounded-xl px-6 text-base font-bold transition motion-reduce:transition-none";
/** Primary on light surfaces */
export const BTN_PRIMARY = `${BTN} bg-[#0D4F4F] text-white shadow-lg shadow-[#0D4F4F]/20 hover:bg-[#093D33] dark:bg-teal-400 dark:text-slate-950 dark:shadow-none dark:hover:bg-teal-300 ${FOCUS}`;
export const BTN_SECONDARY = `${BTN} border border-[#0D4F4F]/25 bg-white/60 text-[#0D4F4F] hover:bg-white dark:border-white/20 dark:bg-white/5 dark:text-white dark:hover:bg-white/10 ${FOCUS}`;
/** Primary on dark surfaces (same gold as the home hero CTA) */
export const BTN_GOLD = `${BTN} bg-[#C8A96E] text-[#06302f] shadow-[0_12px_28px_-12px_rgba(200,169,110,0.85)] hover:bg-[#D9BC84] ${FOCUS_ON_DARK}`;
export const BTN_GHOST = `${BTN} border border-white/30 text-white hover:bg-white/10 ${FOCUS_ON_DARK}`;

/* --------------------------- Signature pieces --------------------------- */

const STAR_WHITE =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='72' height='72' viewBox='0 0 64 64'%3E%3Cg fill='none' stroke='%23ffffff' stroke-opacity='.07' stroke-width='1'%3E%3Cpath d='M14 14h36v36H14z'/%3E%3Cpath d='M32 6.5 57.5 32 32 57.5 6.5 32z'/%3E%3C/g%3E%3C/svg%3E\")";

const MASK = "radial-gradient(ellipse 70% 60% at 50% 40%, #000 0%, transparent 75%)";

/** Eight-point star lattice on dark surfaces. Place AFTER any image/overlay layers. */
export function StarPattern() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 -z-10 opacity-80"
      style={{ backgroundImage: STAR_WHITE, backgroundSize: "72px 72px", WebkitMaskImage: MASK, maskImage: MASK }}
    />
  );
}

/* Gold variant for the closing CTA band (kept for existing usages). */
const STAR_GOLD =
  "<svg xmlns='http://www.w3.org/2000/svg' width='72' height='72' viewBox='0 0 72 72' fill='none' stroke='#C8A96E' stroke-width='1' stroke-opacity='0.6'>" +
  "<path d='M18 18h36v36H18zM36 10.5 61.5 36 36 61.5 10.5 36z'/><path d='M36 0v10.5M36 61.5V72M0 36h10.5M61.5 36H72'/></svg>";
export const PATTERN_URL = `url("data:image/svg+xml,${encodeURIComponent(STAR_GOLD)}")`;
export const PATTERN_MASK =
  "[mask-image:radial-gradient(ellipse_at_top,black,transparent_72%)] [-webkit-mask-image:radial-gradient(ellipse_at_top,black,transparent_72%)]";

/** Small diamond divider. Pass alignment classes, e.g. "mx-auto sm:mx-0". */
export function Ornament({ className }: { className?: string }) {
  return (
    <svg width="120" height="12" viewBox="0 0 120 12" aria-hidden className={cn("block", className)}>
      <g stroke="#C8A96E" fill="none" strokeWidth="1.1">
        <path d="M0 6H44" strokeOpacity=".55" />
        <path d="M76 6H120" strokeOpacity=".55" />
        <rect x="55" y="1.5" width="10" height="10" />
        <rect x="55" y="1.5" width="10" height="10" transform="rotate(45 60 6.5)" />
      </g>
      <circle cx="60" cy="6.5" r="1.3" fill="#C8A96E" />
    </svg>
  );
}

// Fixed: the original had a malformed path ("...z24 10h2v2h-2z") that dropped the third dot.
const TATREEZ =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='26' height='22' viewBox='0 0 26 22' shape-rendering='crispEdges'%3E%3Crect width='26' height='22' fill='%230D4F4F'/%3E%3Cpath fill='%23C8A96E' d='M0 0h26v2h-26zM12 4h2v2h-2zM10 6h6v2h-6zM8 8h4v2h-4zM14 8h4v2h-4zM6 10h4v2h-4zM16 10h4v2h-4zM8 12h4v2h-4zM10 14h6v2h-6zM12 16h2v2h-2zM0 20h26v2h-26z'/%3E%3Cpath fill='%23FBF6EA' d='M0 10h2v2h-2zM12 10h2v2h-2zM24 10h2v2h-2z'/%3E%3C/svg%3E\")";

/** Cross-stitch border that closes every dark hero. Parent must be `relative`. */
export function TatreezBand() {
  return (
    <div
      aria-hidden
      className="absolute inset-x-0 bottom-0 z-20 h-[22px]"
      style={{ backgroundImage: TATREEZ, backgroundRepeat: "repeat-x", backgroundSize: "26px 22px" }}
    />
  );
}

/**
 * Shared hero surface for inner pages (curriculum hub, course pages, ...).
 * Children need at least ~pb-16 so content clears the tatreez band.
 */
export function HeroShell({
  labelledBy,
  className,
  children,
}: {
  labelledBy: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section
      aria-labelledby={labelledBy}
      className={cn("relative isolate overflow-hidden bg-[#06302f] text-white", className)}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(60%_60%_at_85%_0%,rgba(200,169,110,0.16),transparent)]"
      />
      <StarPattern />
      {children}
      <TatreezBand />
    </section>
  );
}