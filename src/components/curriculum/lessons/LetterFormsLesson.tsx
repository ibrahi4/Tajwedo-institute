'use client';

import React from 'react';
import SoundTable from '../shared/SoundTable';
import QuizEngine from '../shared/QuizEngine';
import { Share2 } from 'lucide-react';

const FORMS_DATA = [
  { id: '1', arabic: 'بـ  ـبـ  ـب', transliteration: 'Baa (Connected)', audioText: 'باء' },
  { id: '2', arabic: 'تـ  ـتـ  ـت', transliteration: 'Taa (Connected)', audioText: 'تاء' },
  { id: '3', arabic: 'جـ  ـجـ  ـج', transliteration: 'Jeem (Connected)', audioText: 'جيم' },
  { id: '4', arabic: 'سـ  ـسـ  ـس', transliteration: 'Seen (Connected)', audioText: 'سين' },
  { id: '5', arabic: 'عـ  ـعـ  ـع', transliteration: 'Ayn (Connected)', audioText: 'عين' },
  { id: '6', arabic: 'فـ  ـفـ  ـف', transliteration: 'Faa (Connected)', audioText: 'فاء' },
  { id: '7', arabic: 'كـ  ـكـ  ـك', transliteration: 'Kaaf (Connected)', audioText: 'كاف' },
  { id: '8', arabic: 'مـ  ـمـ  ـم', transliteration: 'Meem (Connected)', audioText: 'ميم' },
];

const NAUGHTY_LETTERS = [
  { id: 'n1', arabic: 'ا', transliteration: 'Alif', audioText: 'ألف', colorHex: '#ef4444' },
  { id: 'n2', arabic: 'د', transliteration: 'Daal', audioText: 'دال', colorHex: '#ef4444' },
  { id: 'n3', arabic: 'ذ', transliteration: 'Thaal', audioText: 'ذال', colorHex: '#ef4444' },
  { id: 'n4', arabic: 'ر', transliteration: 'Raa', audioText: 'راء', colorHex: '#ef4444' },
  { id: 'n5', arabic: 'ز', transliteration: 'Zaay', audioText: 'زاي', colorHex: '#ef4444' },
  { id: 'n6', arabic: 'و', transliteration: 'Waaw', audioText: 'واو', colorHex: '#ef4444' },
];

const QUIZ_QUESTIONS = [
  {
    id: 'q1',
    type: 'multiple_choice' as const,
    questionEn: 'Which of these is the letter "Meem" in the MIDDLE of a word?',
    options: [
      { id: 'o1', text: 'مـ', isCorrect: false },
      { id: 'o2', text: 'ـمـ', isCorrect: true },
      { id: 'o3', text: 'ـم', isCorrect: false },
      { id: 'o4', text: 'م', isCorrect: false },
    ],
  },
  {
    id: 'q2',
    type: 'multiple_choice' as const,
    questionEn: 'Which of the following is a "Non-Connecting" (Naughty) letter?',
    options: [
      { id: 'o1', text: 'ب', isCorrect: false },
      { id: 'o2', text: 'س', isCorrect: false },
      { id: 'o3', text: 'ر', isCorrect: true },
      { id: 'o4', text: 'ع', isCorrect: false },
    ],
  },
];

export default function LetterFormsLesson() {
  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      <section>
        <h1 className="text-3xl sm:text-4xl font-bold mb-4">Letter Forms & Positions</h1>
        <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
          Unlike English, Arabic is cursive. Letters connect to each other and change their shape
          depending on whether they are at the <strong>Beginning</strong>, <strong>Middle</strong>, or <strong>End</strong> of a word.
        </p>

        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Share2 className="w-5 h-5 text-teal-600" /> Connecting Letters Examples
        </h3>
        <SoundTable items={FORMS_DATA} columns={2} />
      </section>

      <section className="bg-rose-50 dark:bg-rose-900/10 p-6 sm:p-8 rounded-3xl border border-rose-100 dark:border-rose-900/30">
        <h3 className="text-2xl font-bold text-rose-700 dark:text-rose-400 mb-4">
          The 6 "Non-Connecting" Letters
        </h3>
        <p className="text-slate-700 dark:text-slate-300 mb-6">
          These 6 letters are special. They connect to the letter <strong>before</strong> them, but NEVER connect to the letter <strong>after</strong> them. They cause a break in the word.
        </p>
        <SoundTable items={NAUGHTY_LETTERS} columns={6} />
      </section>

      <section className="pt-8 border-t border-slate-200 dark:border-slate-800">
        <h2 className="text-2xl font-bold mb-8 text-center">Quiz Time</h2>
        <QuizEngine questions={QUIZ_QUESTIONS} />
      </section>
    </div>
  );
}