"use client";

import React, { useState } from "react";
import { usePathname } from "next/navigation";
import { MessageSquare, Gift, Sparkles, X } from "lucide-react";

export default function FloatingActions() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  if (pathname?.includes("/curriculum")) {
    return null;
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {isOpen && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-4 shadow-2xl w-72">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span className="text-xs font-extrabold">Tajwedo Support</span>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="pt-3 space-y-2 text-xs">
            <p className="text-slate-600 dark:text-slate-300 font-medium">
              Need help or want to book a free 1-on-1 Zoom trial class?
            </p>
            <a
              href="https://wa.me/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 text-white font-extrabold flex items-center justify-center gap-2"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Chat on WhatsApp</span>
            </a>
          </div>
        </div>
      )}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="w-14 h-14 rounded-full bg-gradient-to-br from-[#0D9488] to-[#059669] text-white flex items-center justify-center shadow-xl hover:scale-105 transition"
      >
        <Gift className="w-6 h-6" />
      </button>
    </div>
  );
}