'use client';

import React from 'react';
import SoundTable from '../shared/SoundTable';
import WordCarousel from '../shared/WordCarousel';
import QuizEngine from '../shared/QuizEngine';

const MADD_ALIF = [
  { id: 'm1', arabic: 'بَا', transliteration: 'Baa (2 counts)', audioText: 'بَا' },
  { id: 'm2', arabic: 'تَا', transliteration: 'Taa (2 counts)', audioText: 'تَا' },
  { id: 'm3', arabic: 'ثَا', transliteration: 'Thaa (2 counts)', audioText: 'ثَا' },
  { id: 'm4', arabic: 'جَا', transliteration: 'Jaa (2 counts)', audioText: 'جَا' },
];

const MADD_WAW = [
  { id: 'm5', arabic: 'بُو', transliteration: 'Boo (2 counts)', audioText: 'بُو' },
  { id: 'm6', arabic: 'تُو', transliteration: 'Too (2 counts)', audioText: 'تُو' },
  { id: 'm7', arabic: 'ثُو', transliteration: 'Thoo (2 counts)', audioText: 'ثُو' },
  { id: 'm8', arabic: 'جُو', transliteration: 'Joo (2 counts)', audioText: 'جُو' },
];

const MADD_YAA = [
  { id: 'm9', arabic: 'بِي', transliteration: 'Bee (2 counts)', audioText: 'بِي' },
  { id: 'm10', arabic: 'تِي', transliteration: 'Tee (2 counts)', audioText: 'تِي' },
  { id: 'm11', arabic: 'ثِي', transliteration: 'Thee (2 counts)', audioText: 'ثِي' },
  { id: 'm12', arabic: 'جِي', transliteration: 'Jee (2 counts)', audioText: 'جِي' },
];

const MUDOOD_WORDS = [
  { id: 'w1', arabic: 'قَالَ', transliteration: 'Qaa-la', meaningEn: 'He said' },
  { id: 'w2', arabic: 'يَقُولُ', transliteration: 'Ya-qoo-lu', meaningEn: 'He says' },
  { id: 'w3', arabic: 'قِيلَ', transliteration: 'Qee-la', meaningEn: 'It was said' },
  { id: 'w4', arabic: 'غَفُورٌ', transliteration: 'Gha-foo-run', meaningEn: 'Most Forgiving' },
];

const QUIZ = [
  {
    id: 'q1',
    type: 'match_audio' as const,
    questionEn: 'Listen and select the word with Madd:',
    audioPrompt: 'قَالَ',
    options: [
      { id: 'o1', text: 'قَتَلَ', isCorrect: false },
      { id: 'o2', text: 'قَالَ', isCorrect: true },
      { id: 'o3', text: 'قُلْ', isCorrect: false },
    ],
  },
];

export default function MudoodLesson() {
  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      <section>
        <h1 className="text-3xl sm:text-4xl font-bold mb-4">Long Vowels (Mudood)</h1>
        <p className="text-lg text-slate-600 dark:text-slate-300 mb-8">
          The three long vowel letters (ا و ي) stretch the short vowel preceding them for <strong>2 counts</strong>.
        </p>

        <div className="space-y-8">
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border-t-4 border-t-emerald-500 shadow-sm">
            <h3 className="text-xl font-bold mb-2">1. Madd Alif (ا) — Preceded by Fatha</h3>
            <SoundTable items={MADD_ALIF} columns={4} />
          </div>

          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border-t-4 border-t-teal-500 shadow-sm">
            <h3 className="text-xl font-bold mb-2">2. Madd Waw (و) — Preceded by Damma</h3>
            <SoundTable items={MADD_WAW} columns={4} />
          </div>

          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border-t-4 border-t-cyan-500 shadow-sm">
            <h3 className="text-xl font-bold mb-2">3. Madd Yaa (ي) — Preceded by Kasra</h3>
            <SoundTable items={MADD_YAA} columns={4} />
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-6 text-center">Reading Practice</h2>
        <WordCarousel words={MUDOOD_WORDS} title="Words with Long Vowels" />
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-6 text-center">Quiz Time</h2>
        <QuizEngine questions={QUIZ} />
      </section>
    </div>
  );
}