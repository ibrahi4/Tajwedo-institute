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

export default function Logo({ className = "", light = false }: { className?: string; light?: boolean }) {
  return (
    <Link href="/" className={`flex items-center gap-2.5 sm:gap-3 group ${className}`}>
      {/* perfectly balanced logo size */}
      <div className="relative w-10 h-10 sm:w-11 sm:h-11 shrink-0">
        <Image
          src="/Tajwedo-Public-Assets/logo.webp"
          alt="Tajwedo Institute Logo"
          width={44}
          height={44}
          className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
          priority
        />
      </div>

      {/* Elegant, balanced typography */}
      <div className={`flex flex-col justify-center leading-none ${dmSerif.className}`}>
        <span
          className={`text-[22px] sm:text-[25px] font-normal tracking-[-0.015em] leading-none ${
            light ? "text-white" : "text-[#0D4F4F]"
          }`}
        >
          <span className={light ? "text-[#E8C56A]" : "text-[#C8A96E]"}>T</span>
          ajwed
          <span className={light ? "text-[#E8C56A]" : "text-[#C8A96E]"}>o</span>
        </span>

        <span
          className={`mt-[2px] pl-[1px] text-[8px] sm:text-[9px] font-semibold tracking-[0.45em] uppercase opacity-75 ${
            light ? "text-white" : "text-[#0D4F4F]"
          }`}
          style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}
        >
          Institute
        </span>
      </div>
    </Link>
  );
}