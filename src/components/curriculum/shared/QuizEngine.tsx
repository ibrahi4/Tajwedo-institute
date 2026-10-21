'use client';

import { useState } from 'react';
import { CheckCircle2, XCircle, Trophy, Star, RefreshCw, HelpCircle } from 'lucide-react';
import AudioButton from './AudioButton';

export interface QuizQuestion {
  id: string;
  type: 'match_audio' | 'multiple_choice';
  questionEn: string;
  audioPrompt?: string; // if type is match_audio
  options: { id: string; text: string; isCorrect: boolean }[];
}

interface Props {
  questions: QuizQuestion[];
  onComplete?: (score: number, total: number) => void;
}

export default function QuizEngine({ questions, onComplete }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);

  const currentQ = questions[currentIndex];

  const handleOptionClick = (optionId: string, isCorrect: boolean) => {
    if (isAnswered) return;
    setSelectedOption(optionId);
    setIsAnswered(true);

    if (isCorrect) {
      setScore((prev) => prev + 1);
    }

    setTimeout(() => {
      if (currentIndex + 1 < questions.length) {
        setCurrentIndex((prev) => prev + 1);
        setSelectedOption(null);
        setIsAnswered(false);
      } else {
        setShowResults(true);
        if (onComplete) onComplete(score + (isCorrect ? 1 : 0), questions.length);
      }
    }, 1500);
  };

  const restart = () => {
    setCurrentIndex(0);
    setScore(0);
    setShowResults(false);
    setSelectedOption(null);
    setIsAnswered(false);
  };

  if (showResults) {
    const percentage = Math.round((score / questions.length) * 100);
    const stars = percentage >= 80 ? 3 : percentage >= 50 ? 2 : 1;

    return (
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 sm:p-12 text-center border border-slate-200 dark:border-slate-700 shadow-xl max-w-2xl mx-auto">
        <div className="flex justify-center mb-6">
          <div className="relative">
            <Trophy className="w-20 h-20 text-yellow-400" />
            <div className="absolute -top-2 -right-2 bg-teal-500 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold border-2 border-white dark:border-slate-800">
              {score}
            </div>
          </div>
        </div>
        
        <h3 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Quiz Complete!</h3>
        <p className="text-lg text-slate-600 dark:text-slate-300 mb-8">
          You scored {score} out of {questions.length} ({percentage}%)
        </p>

        <div className="flex justify-center gap-2 mb-8">
          {[1, 2, 3].map((star) => (
            <Star
              key={star}
              className={`w-10 h-10 ${
                star <= stars ? 'text-yellow-400 fill-yellow-400' : 'text-slate-200 dark:text-slate-700'
              }`}
            />
          ))}
        </div>

        <button
          onClick={restart}
          className="inline-flex items-center gap-2 px-6 py-3 bg-teal-700 hover:bg-teal-800 text-white font-semibold rounded-xl transition"
        >
          <RefreshCw className="w-5 h-5" />
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-10 border border-slate-200 dark:border-slate-700 shadow-xl max-w-2xl mx-auto">
      {/* Progress */}
      <div className="flex items-center justify-between mb-8">
        <span className="text-sm font-bold text-teal-700 dark:text-teal-400 uppercase tracking-wider">
          Question {currentIndex + 1} of {questions.length}
        </span>
        <div className="flex gap-1">
          {questions.map((_, idx) => (
            <div
              key={idx}
              className={`w-8 h-2 rounded-full ${
                idx === currentIndex
                  ? 'bg-teal-600'
                  : idx < currentIndex
                  ? 'bg-teal-200 dark:bg-teal-900'
                  : 'bg-slate-100 dark:bg-slate-700'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Question */}
      <div className="mb-8">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-start gap-3">
          <HelpCircle className="w-8 h-8 text-teal-500 shrink-0" />
          {currentQ.questionEn}
        </h3>

        {currentQ.type === 'match_audio' && currentQ.audioPrompt && (
          <div className="flex justify-center p-6 bg-slate-50 dark:bg-slate-700/50 rounded-2xl mb-6 border border-slate-100 dark:border-slate-600">
            <AudioButton text={currentQ.audioPrompt} iconSize={32} className="p-4" />
          </div>
        )}
      </div>

      {/* Options */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {currentQ.options.map((option) => {
          const isSelected = selectedOption === option.id;
          let btnStyle = 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-600 hover:border-teal-500 hover:bg-teal-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200';
          let icon = null;

          if (isAnswered) {
            if (option.isCorrect) {
              btnStyle = 'bg-green-50 dark:bg-green-900/30 border-green-500 text-green-700 dark:text-green-400';
              icon = <CheckCircle2 className="w-6 h-6 text-green-500" />;
            } else if (isSelected && !option.isCorrect) {
              btnStyle = 'bg-rose-50 dark:bg-rose-900/30 border-rose-500 text-rose-700 dark:text-rose-400';
              icon = <XCircle className="w-6 h-6 text-rose-500" />;
            } else {
              btnStyle = 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-400 opacity-50';
            }
          }

          return (
            <button
              key={option.id}
              onClick={() => handleOptionClick(option.id, option.isCorrect)}
              disabled={isAnswered}
              className={`relative flex items-center justify-between p-4 sm:p-6 rounded-2xl border-2 font-bold text-2xl transition-all ${btnStyle}`}
              dir="rtl"
            >
              <span>{option.text}</span>
              {icon}
            </button>
          );
        })}
      </div>
    </div>
  );
}