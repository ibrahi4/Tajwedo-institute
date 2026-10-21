'use client';

import { Eye, EyeOff, ZoomIn, ZoomOut, Moon, Sun, Settings2 } from 'lucide-react';
import { useLesson } from './LessonContext';

export default function TeacherControls() {
  const {
    isTeacherMode,
    toggleTeacherMode,
    increaseFont,
    decreaseFont,
    isDarkMode,
    toggleDarkMode,
  } = useLesson();

  return (
    <div className="sticky top-0 z-40 w-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 shadow-sm transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2 text-teal-700 dark:text-teal-400 font-bold">
          <Settings2 className="w-5 h-5" />
          <span className="hidden sm:inline">Teacher Controls</span>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          {/* Font Sizing */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-lg p-1">
            <button
              onClick={decreaseFont}
              className="p-2 text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 rounded-md transition"
              aria-label="Decrease font size"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <button
              onClick={increaseFont}
              className="p-2 text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 rounded-md transition"
              aria-label="Increase font size"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
          </div>

          {/* Teacher Mode Toggle */}
          <button
            onClick={toggleTeacherMode}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition ${
              isTeacherMode
                ? 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400'
                : 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400'
            }`}
          >
            {isTeacherMode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            <span className="hidden sm:inline">
              {isTeacherMode ? 'Test Mode ON (Hidden)' : 'Learn Mode (Visible)'}
            </span>
          </button>

          {/* Dark Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            className="p-2.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition"
            aria-label="Toggle dark mode"
          >
            {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </div>
      </div>
    </div>
  );
}