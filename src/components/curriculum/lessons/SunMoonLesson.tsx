'use client';

import React from 'react';
import SoundTable from '../shared/SoundTable';
import QuizEngine from '../shared/QuizEngine';
import { Sun, Moon } from 'lucide-react';

const MOON_WORDS = [
  { id: 'm1', arabic: 'ٱلْقَمَر', transliteration: 'Al-Qamar', audioText: 'اَلْقَمَر' },
  { id: 'm2', arabic: 'ٱلْكِتَاب', transliteration: 'Al-Kitaab', audioText: 'اَلْكِتَاب' },
  { id: 'm3', arabic: 'ٱلْجَنَّة', transliteration: 'Al-Jannah', audioText: 'اَلْجَنَّة' },
  { id: 'm4', arabic: 'ٱلْبَيْت', transliteration: 'Al-Bayt', audioText: 'اَلْبَيْت' },
];

const SUN_WORDS = [
  { id: 's1', arabic: 'ٱلشَّمْس', transliteration: 'Ash-Shams (Not Al-Shams)', audioText: 'اَلشَّمْس' },
  { id: 's2', arabic: 'ٱلرَّحْمَٰن', transliteration: 'Ar-Rahmaan', audioText: 'اَلرَّحْمَان' },
  { id: 's3', arabic: 'ٱلدِّين', transliteration: 'Ad-Deen', audioText: 'اَلدِّين' },
  { id: 's4', arabic: 'ٱلنَّاس', transliteration: 'An-Naas', audioText: 'اَلنَّاس' },
];

const QUIZ = [
  {
    id: 'q1',
    type: 'multiple_choice' as const,
    questionEn: 'In a Sun Letter word like "ٱلشَّمْس", what happens to the "Lam" (ل)?',
    options: [
      { id: 'o1', text: 'We pronounce it clearly.', isCorrect: false },
      { id: 'o2', text: 'We skip the Lam and double the next letter.', isCorrect: true },
    ],
  }
];

export default function SunMoonLesson() {
  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      <section className="text-center">
        <h1 className="text-4xl sm:text-5xl font-black mb-4">Sun & Moon Letters</h1>
        <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
          When we add "AL" (The) to an Arabic word, the "L" sound depends on the letter that comes after it!
        </p>
      </section>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Moon Section */}
        <section className="bg-gradient-to-br from-slate-800 to-indigo-950 p-8 rounded-[2rem] shadow-2xl text-white relative overflow-hidden border-4 border-indigo-500/30">
          <Moon className="absolute -top-10 -right-10 w-48 h-48 text-indigo-400 opacity-20" />
          <div className="relative z-10">
            <h2 className="text-3xl font-black mb-2 flex items-center gap-3 text-indigo-300">
              <Moon className="w-8 h-8 fill-indigo-300" /> Moon Letters
            </h2>
            <div className="bg-indigo-900/50 backdrop-blur-md rounded-2xl p-4 mb-6 border border-indigo-500/30">
              <p className="font-semibold text-lg text-indigo-100">Rule: Pronounce the "L" (لْ) clearly.</p>
              <p className="text-indigo-200/80 text-sm mt-1">Look for the Sukoon on the Lam.</p>
            </div>
            {/* Custom dark theme for this specific SoundTable */}
            <div className="[&>div>button]:bg-indigo-900/60 [&>div>button]:border-indigo-500/30 [&>div>button]:text-white hover:[&>div>button]:bg-indigo-800">
              <SoundTable items={MOON_WORDS} columns={2} />
            </div>
          </div>
        </section>

        {/* Sun Section */}
        <section className="bg-gradient-to-br from-amber-400 to-orange-600 p-8 rounded-[2rem] shadow-2xl text-white relative overflow-hidden border-4 border-amber-300/50">
          <Sun className="absolute -top-10 -right-10 w-48 h-48 text-amber-200 opacity-30 animate-[spin_60s_linear_infinite]" />
          <div className="relative z-10">
            <h2 className="text-3xl font-black mb-2 flex items-center gap-3 text-amber-100">
              <Sun className="w-8 h-8 fill-amber-100" /> Sun Letters
            </h2>
            <div className="bg-orange-800/30 backdrop-blur-md rounded-2xl p-4 mb-6 border border-amber-300/30">
              <p className="font-semibold text-lg text-amber-50">Rule: SKIP the "L", Double the next letter.</p>
              <p className="text-amber-100/80 text-sm mt-1">Look for the Shaddah (ـّ) on the sun letter.</p>
            </div>
            {/* Custom warm theme for this specific SoundTable */}
            <div className="[&>div>button]:bg-orange-700/40 [&>div>button]:border-amber-300/30 [&>div>button]:text-white hover:[&>div>button]:bg-orange-600/60">
              <SoundTable items={SUN_WORDS} columns={2} />
            </div>
          </div>
        </section>
      </div>

      <section className="pt-8">
        <h2 className="text-2xl font-bold mb-6 text-center">Quiz Time</h2>
        <QuizEngine questions={QUIZ} />
      </section>
    </div>
  );
}