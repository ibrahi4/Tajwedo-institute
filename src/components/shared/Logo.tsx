"use client";

import React from 'react';
import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import { DM_Serif_Display } from 'next/font/google';

interface LogoProps {
  className?: string;
  light?: boolean;
}

const dmSerif = DM_Serif_Display({
  subsets: ['latin'],
  weight: ['400'],
  display: 'swap',
});

export default function Logo({ className = '', light = false }: LogoProps) {
  return (
    <Link href="/" className={`flex items-center gap-3 group ${className}`}>
      <div className="relative">
        <div className="relative w-12 h-12 flex items-center justify-center transition-all duration-500 group-hover:scale-105 overflow-hidden">
          <Image
            src="/Tajwedo-Public-Assets/logo.png"
            alt="Tajwedo Institute"
            width={48}
            height={48}
            style={{ width: 'auto', height: 'auto' }}
            className="object-contain"
            priority
          />
        </div>
      </div>

      <div className={`flex flex-col leading-none ${dmSerif.className}`}>
        <h1
          className={`text-[24px] font-normal tracking-[-0.01em] leading-[0.95] ${
            light ? 'text-white' : 'text-[#0D4F4F]'
          }`}
        >
          <span className={light ? 'text-[#E8C56A]' : 'text-[#C8A96E]'}>T</span>
          ajwed
          <span className={light ? 'text-[#E8C56A]' : 'text-[#C8A96E]'}>o</span>
        </h1>

        <span
          className={`mt-1.5 pl-0.5 text-[9px] font-medium tracking-[0.45em] uppercase ${
            light ? 'text-white/60' : 'text-[#0D4F4F]/60'
          }`}
          style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
        >
          Institute
        </span>
      </div>
    </Link>
  );
}