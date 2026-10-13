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
    <Link href="/" className={`flex items-center gap-3 sm:gap-3.5 group ${className}`}>
      {/* Enlarged Logo Icon */}
      <div className="relative w-14 h-14 sm:w-16 sm:h-16 shrink-0">
        <Image
          src="/Tajwedo-Public-Assets/logo.webp"
          alt="Tajwedo Institute Logo"
          width={64}
          height={64}
          className="w-full h-full object-contain transition-transform group-hover:scale-105"
          priority
        />
      </div>

      {/* Enlarged Brand Name */}
      <div className={`flex flex-col leading-none ${dmSerif.className}`}>
        <span
          className={`text-[28px] sm:text-[32px] font-normal tracking-[-0.01em] leading-[0.9] ${
            light ? "text-white" : "text-[#0D4F4F]"
          }`}
        >
          <span className={light ? "text-[#E8C56A]" : "text-[#C8A96E]"}>T</span>
          ajwed
          <span className={light ? "text-[#E8C56A]" : "text-[#C8A96E]"}>o</span>
        </span>

        <span
          className={`mt-1.5 pl-0.5 text-[10px] sm:text-[11px] font-semibold tracking-[0.4em] uppercase ${
            light ? "text-white/70" : "text-[#0D4F4F]/70"
          }`}
          style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}
        >
          Institute
        </span>
      </div>
    </Link>
  );
}