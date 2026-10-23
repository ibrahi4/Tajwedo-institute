"use client";

/**
 * Shared tools for lessons (put this file next to AudioButton / LessonContext in `components/curriculum/shared/`).
 * Nothing here depends on LessonContext, so any lesson can use it.
 */

import React, { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, ClipboardList, Maximize2, Minimize2, Play, X } from "lucide-react";

const FOCUS =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600 dark:focus-visible:outline-teal-300";

/* -------------------------------------------------------------------------- */
/*  Arabic speech                                                             */
/* -------------------------------------------------------------------------- */

export function speakArabic(text: string, rate = 0.68) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  try {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "ar-SA";
    utterance.rate = rate;
    const voice = window.speechSynthesis.getVoices().find((v) => v.lang.toLowerCase().startsWith("ar"));
    if (voice) utterance.voice = voice;
    window.speechSynthesis.speak(utterance);
  } catch {
    /* speech is optional */
  }
}

/** Tells you whether this device actually has an Arabic voice installed. */
export function useArabicVoice(): "checking" | "yes" | "no" {
  const [status, setStatus] = useState<"checking" | "yes" | "no">("checking");

  useEffect(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      setStatus("no");
      return;
    }
    const synth = window.speechSynthesis;
    const check = () => {
      const voices = synth.getVoices();
      if (voices.length === 0) return;
      setStatus(voices.some((v) => v.lang.toLowerCase().startsWith("ar")) ? "yes" : "no");
    };
    check();
    synth.addEventListener("voiceschanged", check);
    const giveUp = window.setTimeout(() => setStatus((s) => (s === "checking" ? "no" : s)), 2500);
    return () => {
      synth.removeEventListener("voiceschanged", check);
      window.clearTimeout(giveUp);
    };
  }, []);

  return status;
}

export function VoiceNotice() {
  const status = useArabicVoice();
  if (status !== "no") return null;
  return (
    <div
      role="note"
      className="rounded-2xl border border-amber-300 bg-amber-50 p-4 text-sm leading-relaxed text-amber-950 dark:border-amber-400/30 dark:bg-amber-400/10 dark:text-amber-100"
    >
      <strong>No Arabic voice found on this device.</strong> Audio may sound wrong or stay silent. Try Chrome or Edge, or
      add an Arabic voice in your device’s speech settings.
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Beat meter (1 beat vs 2 beats)                                            */
/* -------------------------------------------------------------------------- */

export type BeatTone = { text: string; bar: string; border: string; tint: string };

export type BeatPair = {
  id: string;
  name: string;
  short: { ar: string; tr: string };
  long: { ar: string; tr: string };
  tone: BeatTone;
};

export function BeatMeter({ pairs, showHints = true }: { pairs: BeatPair[]; showHints?: boolean }) {
  const [pairId, setPairId] = useState(pairs[0]?.id ?? "");
  const [bpm, setBpm] = useState(85);
  const [playing, setPlaying] = useState<"short" | "long" | null>(null);
  const [beat, setBeat] = useState(0);
  const timers = useRef<number[]>([]);
  const audio = useRef<AudioContext | null>(null);

  useEffect(
    () => () => {
      timers.current.forEach((t) => window.clearTimeout(t));
      void audio.current?.close();
    },
    []
  );

  const pair = pairs.find((p) => p.id === pairId) ?? pairs[0];
  if (!pair) return null;

  const clearTimers = () => {
    timers.current.forEach((t) => window.clearTimeout(t));
    timers.current = [];
  };

  const click = (accent: boolean) => {
    try {
      const Ctx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!Ctx) return;
      if (!audio.current) audio.current = new Ctx();
      const ctx = audio.current;
      if (ctx.state === "suspended") void ctx.resume();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.value = accent ? 880 : 660;
      gain.gain.setValueAtTime(0.0001, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.25, ctx.currentTime + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.12);
      osc.connect(gain).connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.14);
    } catch {
      /* the visual still works without sound */
    }
  };

  const schedule = (kind: "short" | "long", offset: number) => {
    const interval = 60000 / bpm;
    const beats = kind === "short" ? 1 : 2;
    timers.current.push(
      window.setTimeout(() => {
        setPlaying(kind);
        setBeat(0);
      }, offset)
    );
    for (let i = 0; i < beats; i++) {
      timers.current.push(
        window.setTimeout(() => {
          setBeat(i + 1);
          click(i === 0);
        }, offset + i * interval)
      );
    }
    const end = offset + beats * interval;
    timers.current.push(
      window.setTimeout(() => {
        setPlaying(null);
        setBeat(0);
      }, end)
    );
    return end;
  };

  const play = (kind: "short" | "long") => {
    clearTimers();
    schedule(kind, 0);
  };

  const playBoth = () => {
    clearTimers();
    const end = schedule("short", 0);
    schedule("long", end + 500);
  };

  return (
    <div className="space-y-5">
      <div role="group" aria-label="Choose a Madd letter" className="flex flex-wrap gap-2">
        {pairs.map((p) => (
          <button
            key={p.id}
            type="button"
            aria-pressed={p.id === pair.id}
            onClick={() => setPairId(p.id)}
            className={`min-h-11 rounded-full border px-4 text-sm font-bold transition-colors motion-reduce:transition-none ${FOCUS} ${
              p.id === pair.id
                ? `${p.tone.border} ${p.tone.tint} ${p.tone.text}`
                : "border-stone-300 text-slate-700 hover:bg-stone-100 dark:border-white/20 dark:text-slate-200 dark:hover:bg-white/10"
            }`}
          >
            {p.name}
          </button>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {(["short", "long"] as const).map((kind) => {
          const data = pair[kind];
          const beats = kind === "short" ? 1 : 2;
          const active = playing === kind;
          return (
            <div key={kind} className={`space-y-4 rounded-2xl border-2 p-5 ${pair.tone.border} ${pair.tone.tint}`}>
              <div className="flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => speakArabic(data.ar, kind === "short" ? 0.85 : 0.65)}
                  aria-label={`Hear ${data.tr}`}
                  className={`rounded-xl px-2 ${FOCUS}`}
                >
                  <span lang="ar" dir="rtl" className={`arabic-font text-5xl font-bold ${pair.tone.text}`}>
                    {data.ar}
                  </span>
                </button>
                <div className="text-end">
                  {showHints && <p className="text-sm font-extrabold text-slate-700 dark:text-slate-200">{data.tr}</p>}
                  <p className="text-xs font-bold text-slate-500 dark:text-slate-400">
                    {beats} {beats === 1 ? "beat" : "beats"}
                  </p>
                </div>
              </div>

              <div aria-hidden="true" className="grid grid-cols-2 gap-1.5">
                {Array.from({ length: beats }).map((_, i) => (
                  <span
                    key={i}
                    className={`h-4 rounded-full transition-colors duration-150 ${
                      active && beat > i ? pair.tone.bar : "bg-stone-200 dark:bg-white/10"
                    }`}
                  />
                ))}
              </div>

              <button
                type="button"
                onClick={() => play(kind)}
                className={`inline-flex min-h-11 items-center gap-2 rounded-full bg-[#0D4F4F] px-5 text-sm font-bold text-white hover:bg-[#093D33] dark:bg-teal-400 dark:text-slate-950 dark:hover:bg-teal-300 ${FOCUS}`}
              >
                <Play aria-hidden="true" className="h-4 w-4" />
                Count {beats} {beats === 1 ? "beat" : "beats"}
              </button>
            </div>
          );
        })}
      </div>

      <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
        <label className="flex items-center gap-3 text-sm font-semibold text-slate-700 dark:text-slate-200">
          Tempo
          <input
            type="range"
            min={60}
            max={140}
            step={5}
            value={bpm}
            onChange={(e) => setBpm(Number(e.target.value))}
            aria-valuetext={`${bpm} beats per minute`}
            className={`w-40 accent-teal-600 ${FOCUS}`}
          />
          <span className="w-16 tabular-nums">{bpm} BPM</span>
        </label>
        <button
          type="button"
          onClick={playBoth}
          className={`inline-flex min-h-11 items-center gap-2 rounded-full border border-[#0D4F4F]/30 px-5 text-sm font-bold text-[#0D4F4F] hover:bg-[#0D4F4F]/5 dark:border-white/20 dark:text-teal-200 dark:hover:bg-white/5 ${FOCUS}`}
        >
          <Play aria-hidden="true" className="h-4 w-4" />
          Short, then long
        </button>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Teacher slide deck (full-screen presenter)                                */
/* -------------------------------------------------------------------------- */

export type Slide = { id: string; title: string; node: React.ReactNode };

export function SlideDeck({
  open,
  onClose,
  slides,
  heading,
}: {
  open: boolean;
  onClose: () => void;
  slides: Slide[];
  heading: string;
}) {
  const [index, setIndex] = useState(0);
  const [isFull, setIsFull] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) setIndex(0);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const lastIndex = slides.length - 1;
    document.body.style.overflow = "hidden";
    panelRef.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowRight" || e.key === "PageDown") setIndex((i) => Math.min(i + 1, lastIndex));
      else if (e.key === "ArrowLeft" || e.key === "PageUp") setIndex((i) => Math.max(i - 1, 0));
      else if (e.key === "Home") setIndex(0);
      else if (e.key === "End") setIndex(lastIndex);
    };
    const onFullscreen = () => setIsFull(Boolean(document.fullscreenElement));
    document.addEventListener("keydown", onKey);
    document.addEventListener("fullscreenchange", onFullscreen);

    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("fullscreenchange", onFullscreen);
      document.body.style.overflow = "";
      if (document.fullscreenElement) void document.exitFullscreen();
      previouslyFocused?.focus();
    };
  }, [open, onClose, slides.length]);

  if (!open || slides.length === 0) return null;
  const slide = slides[index];

  const toggleFullscreen = () => {
    if (document.fullscreenElement) void document.exitFullscreen();
    else void panelRef.current?.requestFullscreen?.();
  };

  const navBtn = `inline-flex min-h-11 items-center gap-2 rounded-full border border-stone-300 px-4 text-sm font-bold text-slate-700 hover:bg-stone-100 disabled:opacity-40 dark:border-white/20 dark:text-slate-200 dark:hover:bg-white/10 ${FOCUS}`;

  return (
    <div
      ref={panelRef}
      role="dialog"
      aria-modal="true"
      aria-label={heading}
      tabIndex={-1}
      className="fixed inset-0 z-[10000] flex flex-col bg-[#FBF8F2] text-slate-900 outline-none dark:bg-[#0B0F19] dark:text-slate-100"
    >
      <div className="flex items-center justify-between gap-3 border-b border-stone-200 px-4 py-3 dark:border-white/10 sm:px-8">
        <div className="min-w-0">
          <p className="truncate text-xs font-bold text-slate-500 dark:text-slate-400">{heading}</p>
          <p className="truncate text-base font-extrabold" aria-live="polite">
            {slide.title} <span className="font-semibold text-slate-500">· {index + 1}/{slides.length}</span>
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={toggleFullscreen}
            aria-label={isFull ? "Exit full screen" : "Enter full screen"}
            className={`flex h-11 w-11 items-center justify-center rounded-full border border-stone-300 hover:bg-stone-100 dark:border-white/20 dark:hover:bg-white/10 ${FOCUS}`}
          >
            {isFull ? <Minimize2 aria-hidden="true" className="h-5 w-5" /> : <Maximize2 aria-hidden="true" className="h-5 w-5" />}
          </button>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close presentation"
            className={`flex h-11 w-11 items-center justify-center rounded-full border border-stone-300 hover:bg-stone-100 dark:border-white/20 dark:hover:bg-white/10 ${FOCUS}`}
          >
            <X aria-hidden="true" className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="flex flex-1 items-center justify-center overflow-y-auto px-4 py-8 sm:px-8">
        <div className="w-full max-w-6xl">{slide.node}</div>
      </div>

      <div className="flex items-center justify-between gap-3 border-t border-stone-200 px-4 py-3 dark:border-white/10 sm:px-8">
        <button type="button" onClick={() => setIndex((i) => Math.max(i - 1, 0))} disabled={index === 0} className={navBtn}>
          <ChevronLeft aria-hidden="true" className="h-4 w-4 rtl:rotate-180" />
          <span className="hidden sm:inline">Previous</span>
        </button>
        <ol className="flex flex-wrap items-center justify-center gap-1.5">
          {slides.map((s, i) => (
            <li key={s.id}>
              <button
                type="button"
                onClick={() => setIndex(i)}
                aria-label={`Go to slide ${i + 1}: ${s.title}`}
                aria-current={i === index ? "step" : undefined}
                className={`h-3 rounded-full transition-all motion-reduce:transition-none ${FOCUS} ${
                  i === index ? "w-8 bg-[#0D4F4F] dark:bg-teal-300" : "w-3 bg-stone-300 hover:bg-stone-400 dark:bg-white/20"
                }`}
              />
            </li>
          ))}
        </ol>
        <button
          type="button"
          onClick={() => setIndex((i) => Math.min(i + 1, slides.length - 1))}
          disabled={index === slides.length - 1}
          className={navBtn}
        >
          <span className="hidden sm:inline">Next</span>
          <ChevronRight aria-hidden="true" className="h-4 w-4 rtl:rotate-180" />
        </button>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Teacher & parent corner                                                   */
/* -------------------------------------------------------------------------- */

export function TeacherCorner({
  title = "Teacher & parent corner",
  sections,
}: {
  title?: string;
  sections: { heading: string; items: string[] }[];
}) {
  return (
    <details className="group rounded-3xl border border-stone-200 bg-white dark:border-white/10 dark:bg-[#111827]">
      <summary
        className={`flex cursor-pointer list-none items-center justify-between gap-3 rounded-3xl p-5 text-lg font-extrabold text-[#0D4F4F] dark:text-white sm:p-6 [&::-webkit-details-marker]:hidden ${FOCUS}`}
      >
        <span className="inline-flex items-center gap-3">
          <ClipboardList aria-hidden="true" className="h-5 w-5 text-[#0D9488]" />
          {title}
        </span>
        <ChevronRight
          aria-hidden="true"
          className="h-5 w-5 transition-transform group-open:rotate-90 motion-reduce:transition-none rtl:rotate-180 rtl:group-open:rotate-90"
        />
      </summary>
      <div className="grid gap-8 border-t border-stone-200 p-5 dark:border-white/10 sm:grid-cols-2 sm:p-6">
        {sections.map((s) => (
          <div key={s.heading}>
            <h3 className="text-base font-extrabold text-[#0D4F4F] dark:text-teal-300">{s.heading}</h3>
            <ul className="mt-3 list-disc space-y-2 ps-5 text-[15px] leading-relaxed text-slate-700 dark:text-slate-300">
              {s.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </details>
  );
}