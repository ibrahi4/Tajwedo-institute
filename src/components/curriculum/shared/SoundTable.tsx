'use client';

import { useLesson } from './LessonContext';

interface SoundItem {
  id: string;
  arabic: string;
  transliteration: string;
  audioText: string;
  colorHex?: string; // Optional custom color per cell
}

interface Props {
  items: SoundItem[];
  columns?: 2 | 3 | 4 | 5 | 6;
  baseColor?: string; // Tailwind color class e.g., 'teal'
}

export default function SoundTable({ items, columns = 4, baseColor = 'teal' }: Props) {
  const { isTeacherMode, fontSizeMultiplier } = useLesson();

  const gridCols = {
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    4: 'grid-cols-2 sm:grid-cols-4',
    5: 'grid-cols-2 sm:grid-cols-3 md:grid-cols-5',
    6: 'grid-cols-2 sm:grid-cols-3 md:grid-cols-6',
  };

  const playAudio = (text: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ar-SA';
    utterance.rate = 0.8;
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className={`grid gap-3 sm:gap-4 ${gridCols[columns]} w-full`}>
      {items.map((item) => (
        <button
          key={item.id}
          onClick={() => playAudio(item.audioText)}
          className="group relative flex flex-col items-center justify-center p-4 sm:p-6 rounded-2xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-teal-500 hover:bg-teal-50 dark:hover:bg-slate-700 transition-all shadow-sm hover:shadow-md"
          style={item.colorHex ? { borderBottomColor: item.colorHex, borderBottomWidth: '4px' } : {}}
        >
          <span
            className="font-bold text-slate-900 dark:text-white transition-transform group-hover:scale-110"
            style={{ fontSize: `${2.5 * fontSizeMultiplier}rem`, lineHeight: 1.2 }}
            dir="rtl"
          >
            {item.arabic}
          </span>
          
          <div className={`mt-3 transition-opacity duration-300 ${isTeacherMode ? 'opacity-0' : 'opacity-100'}`}>
            <span className="text-sm font-medium text-slate-500 dark:text-slate-400 tracking-wider">
              {item.transliteration}
            </span>
          </div>
        </button>
      ))}
    </div>
  );
}