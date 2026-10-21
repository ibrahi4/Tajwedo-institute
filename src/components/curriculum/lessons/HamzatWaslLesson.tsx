'use client';

import React from 'react';
import SoundTable from '../shared/SoundTable';
import WordCarousel from '../shared/WordCarousel';
import QuizEngine from '../shared/QuizEngine';
import { Link as LinkIcon, Unlink } from 'lucide-react';

const HAMZA_START = [
  { id: 'h1', arabic: 'ٱلْحَمْدُ', transliteration: 'Al-hamdu', audioText: 'اَلْحَمْدُ' },
  { id: 'h2', arabic: 'ٱهْدِنَا', transliteration: 'Ih-dinaa', audioText: 'اِهْدِنَا' },
];

const HAMZA_MIDDLE = [
  { id: 'h3', arabic: 'وَٱلْقَمَرِ', transliteration: 'Wal-qamari (Not Wa-Al)', audioText: 'وَالْقَمَرِ' },
  { id: 'h4', arabic: 'بِٱسْمِ', transliteration: 'Bis-mi (Not Bi-Ismi)', audioText: 'بِسْمِ' },
];

const QUIZ = [
  {
    id: 'q1',
    type: 'multiple_choice' as const,
    questionEn: 'If Hamzat Al-Wasl (ٱ) is in the MIDDLE of a sentence, what do we do?',
    options: [
      { id: 'o1', text: 'Pronounce it clearly as "A"', isCorrect: false },
      { id: 'o2', text: 'Skip it completely and connect the words', isCorrect: true },
      { id: 'o3', text: 'Stop and take a breath', isCorrect: false },
    ],
  }
];

export default function HamzatWaslLesson() {
  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      <section>
        <h1 className="text-3xl sm:text-4xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
          Hamzat Al-Wasl (ٱ)
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-300 mb-8">
          The connecting Hamza looks like an Alif with a small "Sad" (ٱ) on top. Its rule is simple: 
          <strong> Read it if you start with it, skip it if you connect!</strong>
        </p>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl border-t-8 border-t-emerald-500 shadow-xl">
            <h3 className="text-2xl font-bold mb-4 flex items-center gap-2 text-emerald-700 dark:text-emerald-400">
              <Unlink className="w-6 h-6" /> Starting the Word
            </h3>
            <p className="text-slate-600 dark:text-slate-400 mb-6">We pronounce it clearly (A, I, or U) when it's the very first letter we read.</p>
            <SoundTable items={HAMZA_START} columns={2} />
          </div>

          <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl border-t-8 border-t-rose-500 shadow-xl">
            <h3 className="text-2xl font-bold mb-4 flex items-center gap-2 text-rose-700 dark:text-rose-400">
              <LinkIcon className="w-6 h-6" /> In the Middle
            </h3>
            <p className="text-slate-600 dark:text-slate-400 mb-6">We drop the sound completely and jump to the next letter to connect the words.</p>
            <SoundTable items={HAMZA_MIDDLE} columns={2} />
          </div>
        </div>
      </section>
      <section>
        <h2 className="text-2xl font-bold mb-6 text-center">Quiz Time</h2>
        <QuizEngine questions={QUIZ} />
      </section>
    </div>
  );
}