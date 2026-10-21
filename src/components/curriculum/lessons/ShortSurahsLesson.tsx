'use client';

import React, { useState } from 'react';
import { Check, GraduationCap, RotateCcw } from 'lucide-react';
import AudioButton from '../shared/AudioButton';
import { useLesson } from '../shared/LessonContext';

/* -------------------------------------------------------------------------- */
/*  Content                                                                   */
/* -------------------------------------------------------------------------- */

type Verse = { id: string; ar: string; en: string };

// Surah Al-Fatihah — 7 verses (Bismillah counted as verse 1, as in the Madani mushaf).
// Please have a qualified teacher review the Arabic text and translations before publishing.
const FATIHAH: Verse[] = [
  { id: 'v1', ar: 'بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ', en: 'In the name of Allah, the Entirely Merciful, the Especially Merciful.' },
  { id: 'v2', ar: 'ٱلْحَمْدُ لِلَّهِ رَبِّ ٱلْعَٰلَمِينَ', en: '[All] praise is [due] to Allah, Lord of the worlds.' },
  { id: 'v3', ar: 'ٱلرَّحْمَٰنِ ٱلرَّحِيمِ', en: 'The Entirely Merciful, the Especially Merciful.' },
  { id: 'v4', ar: 'مَٰلِكِ يَوْمِ ٱلدِّينِ', en: 'Sovereign of the Day of Recompense.' },
  { id: 'v5', ar: 'إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ', en: 'You alone we worship, and You alone we ask for help.' },
  { id: 'v6', ar: 'ٱهْدِنَا ٱلصِّرَٰطَ ٱلْمُسْتَقِيمَ', en: 'Guide us to the straight path.' },
  {
    id: 'v7',
    ar: 'صِرَٰطَ ٱلَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ ٱلْمَغْضُوبِ عَلَيْهِمْ وَلَا ٱلضَّآلِّينَ',
    en: 'The path of those You have blessed, not of those who earned Your anger, nor of those who went astray.',
  },
];

const AR_DIGITS = '٠١٢٣٤٥٦٧٨٩';
const toArabicDigits = (n: number) => String(n).replace(/\d/g, (d) => AR_DIGITS[Number(d)]);

// Eight-point star lattice — same quiet texture used on the curriculum hub.
const STAR_TILE =
  "<svg xmlns='http://www.w3.org/2000/svg' width='72' height='72' viewBox='0 0 72 72' fill='none' stroke='#E8C56A' stroke-width='1' stroke-opacity='0.7'>" +
  "<path d='M18 18h36v36H18zM36 10.5 61.5 36 36 61.5 10.5 36z'/>" +
  "<path d='M36 0v10.5M36 61.5V72M0 36h10.5M61.5 36H72'/>" +
  '</svg>';
const PATTERN_URL = `url("data:image/svg+xml,${encodeURIComponent(STAR_TILE)}")`;

const FOCUS =
  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600 dark:focus-visible:outline-emerald-300';

/* -------------------------------------------------------------------------- */
/*  Component                                                                 */
/* -------------------------------------------------------------------------- */

export default function ShortSurahsLesson() {
  // useLesson() may return undefined outside a provider, so read defensively.
  const lessonCtx = useLesson();
  const fontSizeMultiplier = lessonCtx?.fontSizeMultiplier ?? 1.1;
  const isTeacherMode = lessonCtx?.isTeacherMode ?? false;

  const [readIds, setReadIds] = useState<string[]>([]);

  const total = FATIHAH.length;
  const readCount = readIds.length;
  const allRead = readCount === total;
  const pct = Math.round((readCount / total) * 100);

  const toggleRead = (id: string) =>
    setReadIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  // Fluid Arabic size: comfortable on phones, large on projectors, scaled by the lesson's A+/A- control.
  const m = fontSizeMultiplier;
  const verseFontSize = `clamp(${(1.9 * m).toFixed(2)}rem, ${(4.6 * m).toFixed(2)}vw + 0.6rem, ${(3 * m).toFixed(2)}rem)`;

  return (
    <div className="space-y-10 animate-in fade-in duration-700 motion-reduce:animate-none">
      {/* ------------------------------ Intro ------------------------------ */}
      <section aria-labelledby="fatihah-title" className="mx-auto max-w-3xl text-center">
        <h1
          id="fatihah-title"
          className="mb-4 text-4xl font-black text-emerald-700 dark:text-emerald-400 sm:text-5xl"
        >
          Graduation: Surah Al-Fatihah
        </h1>
        <p className="text-xl text-slate-600 dark:text-slate-300">
          Apply everything you learned to read the greatest Surah in the Quran.
        </p>
        <p className="mt-3 text-base text-slate-500 dark:text-slate-400">
          {isTeacherMode
            ? 'Teacher view: translations and audio are hidden so the student can read on their own.'
            : 'Read each verse aloud, listen to check yourself, then tick it off.'}
        </p>

        <div className="mx-auto mt-6 max-w-md">
          <div className="flex items-center justify-between text-sm font-semibold text-slate-600 dark:text-slate-300">
            <span aria-live="polite">
              {readCount} of {total} verses read
            </span>
            <span>{pct}%</span>
          </div>
          <div
            role="progressbar"
            aria-label="Verses read"
            aria-valuemin={0}
            aria-valuemax={total}
            aria-valuenow={readCount}
            className="mt-2 h-2.5 overflow-hidden rounded-full bg-emerald-100 dark:bg-white/10"
          >
            <div
              className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-[#C8A96E] transition-[width] duration-500 motion-reduce:transition-none"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>
      </section>

      {/* ------------------------------ Mushaf card ------------------------------ */}
      <section aria-label="Surah Al-Fatihah" className="mx-auto max-w-4xl">
        <div className="overflow-hidden rounded-[2rem] border border-[#e8dfc8] bg-[#fdfbf7] shadow-2xl dark:border-slate-700 dark:bg-[#1a202c] sm:rounded-[3rem]">
          {/* Header ornament */}
          <div className="relative isolate overflow-hidden bg-emerald-800 px-4 py-9 text-center dark:bg-emerald-900">
            <div
              aria-hidden="true"
              className="absolute inset-0 -z-10 opacity-30"
              style={{ backgroundImage: PATTERN_URL }}
            />
            <div
              aria-hidden="true"
              className="absolute inset-x-8 bottom-0 h-px bg-gradient-to-r from-transparent via-[#E8C56A] to-transparent"
            />
            <h2 lang="ar" dir="rtl" className="arabic-font text-4xl font-bold text-white sm:text-5xl">
              سُورَةُ الفَاتِحَة
            </h2>
            <p className="mt-2 text-sm font-semibold text-emerald-100">The Opening · {total} verses</p>
          </div>

          {/* Verses */}
          <ol className="p-6 sm:p-12">
            {FATIHAH.map((verse, idx) => {
              const isRead = readIds.includes(verse.id);
              const n = idx + 1;
              return (
                <li
                  key={verse.id}
                  className="border-b border-[#e8dfc8] py-10 first:pt-0 last:border-0 last:pb-0 dark:border-slate-700"
                >
                  <div className="flex flex-col items-center gap-5 text-center">
                    <h3 className="sr-only">Verse {n}</h3>

                    {/* Arabic + end-of-verse medallion */}
                    <p
                      lang="ar"
                      dir="rtl"
                      className="arabic-font font-bold leading-[2.1] text-slate-900 dark:text-emerald-50"
                      style={{ fontSize: verseFontSize }}
                    >
                      {verse.ar}{' '}
                      <span
                        aria-hidden="true"
                        className={`mx-1 inline-flex h-10 w-10 items-center justify-center rounded-full border-2 align-middle text-base font-bold transition-colors motion-reduce:transition-none ${
                          isRead
                            ? 'border-emerald-600 bg-emerald-600 text-white dark:border-emerald-400 dark:bg-emerald-400 dark:text-slate-950'
                            : 'border-[#C8A96E] text-[#8F6B1E] dark:text-[#E8C56A]'
                        }`}
                      >
                        {toArabicDigits(n)}
                      </span>
                    </p>

                    {/* Translation + audio (collapses in teacher mode, out of tab order when hidden) */}
                    <div
                      className={`grid w-full transition-[grid-template-rows,opacity] duration-500 motion-reduce:transition-none ${
                        isTeacherMode ? 'invisible grid-rows-[0fr] opacity-0' : 'grid-rows-[1fr] opacity-100'
                      }`}
                    >
                      <div className="overflow-hidden">
                        <div className="flex flex-col items-center gap-4 pt-1">
                          <p lang="en" className="max-w-2xl text-lg italic text-slate-500 dark:text-slate-400">
                            “{verse.en}”
                          </p>
                          <AudioButton
                            text={verse.ar}
                            iconSize={24}
                            className="bg-emerald-100 text-emerald-700 hover:bg-emerald-200 dark:bg-emerald-400/15 dark:text-emerald-300 dark:hover:bg-emerald-400/25"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Self-check */}
                    <button
                      type="button"
                      onClick={() => toggleRead(verse.id)}
                      aria-pressed={isRead}
                      className={`inline-flex min-h-11 items-center gap-2 rounded-full border px-5 text-sm font-bold transition-colors motion-reduce:transition-none ${FOCUS} ${
                        isRead
                          ? 'border-emerald-600 bg-emerald-600 text-white hover:bg-emerald-700 dark:border-emerald-400 dark:bg-emerald-400 dark:text-slate-950 dark:hover:bg-emerald-300'
                          : 'border-emerald-600/40 text-emerald-800 hover:bg-emerald-50 dark:border-emerald-300/40 dark:text-emerald-200 dark:hover:bg-white/5'
                      }`}
                    >
                      <Check aria-hidden="true" className={`h-4 w-4 ${isRead ? 'opacity-100' : 'opacity-40'}`} />
                      I read this verse
                    </button>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </section>

      {/* ------------------------------ Graduation ------------------------------ */}
      {allRead && (
        <div
          role="status"
          className="mx-auto max-w-4xl animate-in fade-in slide-in-from-bottom-4 duration-700 motion-reduce:animate-none"
        >
          <div className="rounded-[2rem] bg-gradient-to-br from-emerald-700 to-emerald-900 p-8 text-center text-white shadow-xl sm:p-10">
            <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#E8C56A] text-emerald-950">
              <GraduationCap aria-hidden="true" className="h-7 w-7" />
            </span>
            <h2 className="mt-4 text-2xl font-black sm:text-3xl">Masha’Allah! You read every verse of Al-Fatihah.</h2>
            <p className="mx-auto mt-2 max-w-xl text-emerald-100">
              That is the greatest Surah in the Quran, read by you. Come back and recite it again any time.
            </p>
            <button
              type="button"
              onClick={() => setReadIds([])}
              className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-full border border-white/40 px-5 text-sm font-bold text-white transition-colors hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white motion-reduce:transition-none"
            >
              <RotateCcw aria-hidden="true" className="h-4 w-4" />
              Read again
            </button>
          </div>
        </div>
      )}
    </div>
  );
}