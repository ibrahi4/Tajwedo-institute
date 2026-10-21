'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight, BookOpen } from 'lucide-react';
import { useLesson } from './LessonContext';
import AudioButton from './AudioButton';

export interface PracticeWord {
  id: string;
  arabic: string;
  meaningEn: string;
  transliteration: string;
}

interface Props {
  words: PracticeWord[];
  title?: string;
}

export default function WordCarousel({ words, title = 'Reading Practice' }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { isTeacherMode, fontSizeMultiplier } = useLesson();

  const handleNext = () => setCurrentIndex((prev) => (prev + 1) % words.length);
  const handlePrev = () => setCurrentIndex((prev) => (prev - 1 + words.length) % words.length);

  const word = words[currentIndex];

  return (
    <div className="w-full max-w-2xl mx-auto bg-white dark:bg-slate-800 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-700 overflow-hidden">
      <div className="bg-teal-700 dark:bg-teal-900 px-6 py-4 flex items-center justify-between text-white">
        <div className="flex items-center gap-2 font-semibold">
          <BookOpen className="w-5 h-5 text-teal-200" />
          {title}
        </div>
        <div className="text-teal-100 text-sm font-medium bg-teal-800/50 px-3 py-1 rounded-full">
          {currentIndex + 1} / {words.length}
        </div>
      </div>

      <div className="p-8 sm:p-12 relative flex flex-col items-center justify-center min-h-[300px]">
        {/* Navigation Buttons */}
        <button
          onClick={handlePrev}
          className="absolute left-4 p-3 rounded-full bg-slate-50 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-teal-50 hover:text-teal-600 transition shadow-sm border border-slate-200 dark:border-slate-600"
          aria-label="Previous word"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <button
          onClick={handleNext}
          className="absolute right-4 p-3 rounded-full bg-slate-50 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-teal-50 hover:text-teal-600 transition shadow-sm border border-slate-200 dark:border-slate-600"
          aria-label="Next word"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* Word Display */}
        <div className="text-center w-full px-12">
          <div
            className="font-bold text-slate-900 dark:text-white mb-6 leading-tight"
            style={{ fontSize: `${4 * fontSizeMultiplier}rem` }}
            dir="rtl"
          >
            {word.arabic}
          </div>

          <div className={`space-y-2 transition-all duration-300 ${isTeacherMode ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}`}>
            <p className="text-lg font-medium text-teal-700 dark:text-teal-400 tracking-wide">
              {word.transliteration}
            </p>
            <p className="text-slate-500 dark:text-slate-400">
              {word.meaningEn}
            </p>
          </div>

          <div className="mt-8 flex justify-center">
            <AudioButton text={word.arabic} iconSize={24} className="p-4" />
          </div>
        </div>
      </div>
    </div>
  );
}