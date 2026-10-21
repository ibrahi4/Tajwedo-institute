'use client';

import React from 'react';
import AudioButton from '../shared/AudioButton';
import { useLesson } from '../shared/LessonContext';

const FATIHAH = [
  { id: 'v1', ar: 'بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ', en: 'In the name of Allah, the Entirely Merciful, the Especially Merciful.' },
  { id: 'v2', ar: 'ٱلْحَمْدُ لِلَّهِ رَبِّ ٱلْعَٰلَمِينَ', en: '[All] praise is [due] to Allah, Lord of the worlds.' },
  { id: 'v3', ar: 'ٱلرَّحْمَٰنِ ٱلرَّحِيمِ', en: 'The Entirely Merciful, the Especially Merciful.' },
  { id: 'v4', ar: 'مَٰلِكِ يَوْمِ ٱلدِّينِ', en: 'Sovereign of the Day of Recompense.' },
];

export default function ShortSurahsLesson() {
  const lessonCtx = useLesson();`n  const fontSizeMultiplier = lessonCtx?.fontSizeMultiplier ?? 1.1;`n  const isTeacherMode = lessonCtx?.isTeacherMode ?? false;

  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      <section className="text-center">
        <h1 className="text-4xl sm:text-5xl font-black mb-4 text-emerald-700 dark:text-emerald-400">
          Graduation: Surah Al-Fatihah
        </h1>
        <p className="text-xl text-slate-600 dark:text-slate-300">
          Apply everything you learned to read the greatest Surah in the Quran.
        </p>
      </section>

      <section className="max-w-4xl mx-auto">
        <div className="bg-[#fdfbf7] dark:bg-[#1a202c] rounded-[3rem] shadow-2xl overflow-hidden border border-[#e8dfc8] dark:border-slate-700">
          {/* Header Ornament */}
          <div className="bg-[url('/Tajwedo-Public-Assets/pattern.png')] bg-emerald-800 py-8 px-4 text-center relative">
            <div className="absolute inset-0 bg-emerald-900/60 mix-blend-multiply" />
            <h2 className="relative z-10 text-3xl font-bold text-white arabic-font">سُورَةُ الفَاتِحَة</h2>
          </div>

          {/* Verses */}
          <div className="p-8 sm:p-12 space-y-10">
            {FATIHAH.map((verse, idx) => (
              <div key={verse.id} className="group flex flex-col items-center text-center space-y-4 pb-10 border-b border-[#e8dfc8] dark:border-slate-700 last:border-0 last:pb-0">
                
                {/* Arabic */}
                <div className="flex items-center justify-center gap-4 w-full">
                  <span 
                    className="font-bold text-slate-900 dark:text-emerald-50 leading-loose"
                    style={{ fontSize: `${3 * fontSizeMultiplier}rem` }}
                    dir="rtl"
                  >
                    {verse.ar} <span className="text-emerald-600 dark:text-emerald-400 mx-2 text-3xl">﴾{idx + 1}﴿</span>
                  </span>
                </div>

                {/* English & Audio */}
                <div className={`flex flex-col items-center gap-4 transition-all duration-500 ${isTeacherMode ? 'opacity-0 h-0 overflow-hidden' : 'opacity-100 h-auto'}`}>
                  <p className="text-lg text-slate-500 dark:text-slate-400 italic">"{verse.en}"</p>
                  <AudioButton text={verse.ar} iconSize={24} className="bg-emerald-100 text-emerald-700 hover:bg-emerald-200" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}