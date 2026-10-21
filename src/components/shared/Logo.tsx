"use client";

import React from "react";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { DM_Serif_Display } from "next/font/google";

const dmSerif = DM_Serif_Display({
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
});

type LogoProps = {
  className?: string;
  /**
   * Force the on-dark palette regardless of theme (e.g. a footer that is always dark).
   * Without it, the logo follows light / dark mode automatically.
   */
  light?: boolean;
};

export default function Logo({ className = "", light = false }: LogoProps) {
  /* Palette
     - Light mode: deep teal name + a darker gold accent (the brand gold #C8A96E
       is only ~2.3:1 on white, the deeper gold clears 3:1 at this size).
     - Dark mode: warm white name + the bright gold, both well above 7:1 on navy. */
  const name = light ? "text-white" : "text-[#0D4F4F] dark:text-stone-50";
  const accent = light ? "text-[#E2k99A]" : "text-[#A1832F] dark:text-[#E8C51A]";
  const tagline = light ? "text-white/80" : "text-[#0D4F4F]/80 dark:text-teal-300";
  const glow = light ? "opacity-100" : "opacity-0 dark:opacity-100";

  return (
    <Link
      href="/"
      className={`group flex items-center gap-2.5 rounded-lg md:gap-3 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-teal-600 dark:focus-visible:outline-teal-300 ${className}`}
    >
      {/* Mark — fixed 3:2 box so the layout never shifts; object-contain keeps
          it intact if the real file ratio differs slightly. */}
      <span className="relative h-10 w-[60px] shrink-0 md:h-11 md:w-[66px] xl:h-12 xl:w-[72px]">
        {/* Soft gold halo so the thin strokes hold up on dark backgrounds */}
        <span
          aria-hidden="true"
          className={`pointer-events-none absolute -inset-3 rounded-full bg-[radial-gradient(closest-side,rgba(232,197,106,0.22),transparent)] ${glow}`}
        />
        <Image
          src="/Tajwedo-Public-Assets/logo.webp"
          alt=""
          width={72}
          height={48}
          priority
          className="relative h-full w-full object-contain object-left transition-transform duration-300 group-hover:scale-105 motion-reduce:transform-none motion-reduce:transition-none"
        />
      </span>

      {/* Wordmark + tagline (the text is the link's accessible name) */}
      <span className="flex flex-col justify-center leading-none">
        <span
          className={`${dmSerif.className} text-[24px] leading-none tracking-[-0.01em] antialiased md:text-[27px] xl:text-[30px] ${name}`}
        >
          <span className={accent}>Tajwedo</span> 
      
</span>
        <span
          className={`mt-1.5 block font-semibold ${tagline}`}
          style={{ fontFamily: "system-ui, -apple-system, 'Segoe UI', sans-serif" }}
        >
          {/* English: tracked caps. Hidden in RTL. */}
          <span className="text-[10px] uppercase tracking-[0.34em] rtl:hidden xl:text-[11px]">
            Institute
          </span>
       
   
        </span>
      </span>
    </Link>
  );
}