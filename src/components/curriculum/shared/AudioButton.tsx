'use client';

import { useState } from 'react';
import { Volume2 } from 'lucide-react';

interface Props {
  text: string;
  lang?: string;
  className?: string;
  iconSize?: number;
}

export default function AudioButton({ text, lang = 'ar-SA', className = '', iconSize = 20 }: Props) {
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlay = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering parent clicks
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    window.speechSynthesis.cancel(); // Stop any currently playing audio

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.rate = 0.8; // Slightly slower for learning
    utterance.pitch = 1.0;

    utterance.onstart = () => setIsPlaying(true);
    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = () => setIsPlaying(false);

    window.speechSynthesis.speak(utterance);
  };

  return (
    <button
      onClick={handlePlay}
      className={`relative inline-flex items-center justify-center rounded-full p-2 transition-all ${
        isPlaying
          ? 'bg-teal-600 text-white scale-110 shadow-lg shadow-teal-500/30'
          : 'bg-teal-100 dark:bg-teal-900/40 text-teal-700 dark:text-teal-400 hover:bg-teal-200 dark:hover:bg-teal-800/60 hover:scale-105'
      } ${className}`}
      aria-label={`Play audio for ${text}`}
    >
      <Volume2 style={{ width: iconSize, height: iconSize }} />
      {isPlaying && (
        <span className="absolute inset-0 rounded-full animate-ping bg-teal-400 opacity-20" />
      )}
    </button>
  );
}