'use client';

import React from 'react';
import SoundTable from '../shared/SoundTable';
import WordCarousel from '../shared/WordCarousel';
import QuizEngine from '../shared/QuizEngine';

const LEEN_WAW = [
  { id: 'l1', arabic: 'خَوْ', transliteration: 'Khaw', audioText: 'خَوْ' },
  { id: 'l2', arabic: 'قَوْ', transliteration: 'Qaw', audioText: 'قَوْ' },
  { id: 'l3', arabic: 'لَوْ', transliteration: 'Law', audioText: 'لَوْ' },
  { id: 'l4', arabic: 'يَوْ', transliteration: 'Yaw', audioText: 'يَوْ' },
];

const LEEN_YAA = [
  { id: 'l5', arabic: 'بَيْ', transliteration: 'Bay', audioText: 'بَيْ' },
  { id: 'l6', arabic: 'صَيْ', transliteration: 'Say', audioText: 'صَيْ' },
  { id: 'l7', arabic: 'كَيْ', transliteration: 'Kay', audioText: 'كَيْ' },
  { id: 'l8', arabic: 'لَيْ', transliteration: 'Lay', audioText: 'لَيْ' },
];

const LEEN_WORDS = [
  { id: 'w1', arabic: 'خَوْفٌ', transliteration: 'Khaw-fun', meaningEn: 'Fear' },
  { id: 'w2', arabic: 'بَيْتٌ', transliteration: 'Bay-tun', meaningEn: 'House' },
  { id: 'w3', arabic: 'قَوْمٌ', transliteration: 'Qaw-mun', meaningEn: 'People' },
  { id: 'w4', arabic: 'صَيْفٌ', transliteration: 'Say-fun', meaningEn: 'Summer' },
];

const QUIZ = [
  {
    id: 'q1',
    type: 'multiple_choice' as const,
    questionEn: 'Leen letters occur when Waw or Yaa have a Sukoon and are preceded by:',
    options: [
      { id: 'o1', text: 'Fatha (ـَ)', isCorrect: true },
      { id: 'o2', text: 'Damma (ـُ)', isCorrect: false },
      { id: 'o3', text: 'Kasra (ـِ)', isCorrect: false },
    ],
  },
];

export default function LeenLesson() {
  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      <section>
        <h1 className="text-3xl sm:text-4xl font-bold mb-4">Leen Letters (Soft Vowels)</h1>
        <p className="text-lg text-slate-600 dark:text-slate-300 mb-8">
          Leen letters are <strong>Waw (وْ)</strong> and <strong>Yaa (يْ)</strong> bearing a Sukoon and preceded by a <strong>Fatha (ـَ)</strong>. They produce smooth diphthong sounds (&quot;aw&quot; and &quot;ay&quot;).
        </p>

        <div className="space-y-8">
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border-t-4 border-t-sky-500 shadow-sm">
            <h3 className="text-xl font-bold mb-2">1. Waw Leen (وْ) — "AW" Sound</h3>
            <SoundTable items={LEEN_WAW} columns={4} />
          </div>

          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border-t-4 border-t-blue-500 shadow-sm">
            <h3 className="text-xl font-bold mb-2">2. Yaa Leen (يْ) — "AY" Sound</h3>
            <SoundTable items={LEEN_YAA} columns={4} />
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-6 text-center">Reading Practice</h2>
        <WordCarousel words={LEEN_WORDS} title="Words with Leen Letters" />
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-6 text-center">Quiz Time</h2>
        <QuizEngine questions={QUIZ} />
      </section>
    </div>
  );
}