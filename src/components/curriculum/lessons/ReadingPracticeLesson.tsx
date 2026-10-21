'use client';

import React, { useState } from 'react';
import WordCarousel from '../shared/WordCarousel';
import { useLesson } from '../shared/LessonContext';

const MIXED_WORDS = [
  { id: 'w1', arabic: 'مَلِكِ', transliteration: 'Ma-li-ki', meaningEn: 'King' },
  { id: 'w2', arabic: 'عَلِمَ', transliteration: 'A-li-ma', meaningEn: 'He knew' },
  { id: 'w3', arabic: 'فَهِمَ', transliteration: 'Fa-hi-ma', meaningEn: 'He understood' },
  { id: 'w4', arabic: 'يَكْتُبُ', transliteration: 'Yak-tu-bu', meaningEn: 'He writes' },
  { id: 'w5', arabic: 'مُسْلِمُون', transliteration: 'Mus-li-moon', meaningEn: 'Muslims' },
  { id: 'w6', arabic: 'ٱلْحَمْدُ', transliteration: 'Al-ham-du', meaningEn: 'All praise' },
];

export default function ReadingPracticeLesson() {
  const { isTeacherMode } = useLesson();

  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      <section className="text-center max-w-3xl mx-auto">
        <div className="inline-block bg-teal-100 text-teal-800 px-4 py-1.5 rounded-full font-bold text-sm mb-4 tracking-widest uppercase">
          Mastery Stage
        </div>
        <h1 className="text-4xl sm:text-5xl font-black mb-4 text-slate-900 dark:text-white">
          Put it all together
        </h1>
        <p className="text-xl text-slate-600 dark:text-slate-300">
          You've learned the alphabet, vowels, sukoon, and mudood. Now it's time to read full Arabic words!
        </p>
      </section>

      <section>
        <div className="bg-gradient-to-b from-slate-100 to-white dark:from-slate-800 dark:to-slate-900 p-4 sm:p-8 rounded-[2.5rem] shadow-inner border border-slate-200 dark:border-slate-700">
          <WordCarousel words={MIXED_WORDS} title="Mixed Vocabulary Challenge" />
        </div>
      </section>
    </div>
  );
}