
import React, { useState } from 'react';
import { QuizQuestion } from '../types';

interface QuizInterfaceProps {
  questions: QuizQuestion[];
  onComplete: (score: number, total: number) => void;
  onCancel: () => void;
}

export const QuizInterface: React.FC<QuizInterfaceProps> = ({ questions, onComplete, onCancel }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  const handleNext = () => {
    if (selectedOption === null) return;
    
    const newAnswers = [...answers, selectedOption];
    setAnswers(newAnswers);
    setSelectedOption(null);

    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      const score = newAnswers.reduce((acc, val, idx) => {
        return val === questions[idx].correctAnswer ? acc + 1 : acc;
      }, 0);
      onComplete(score, questions.length);
    }
  };

  const currentQuestion = questions[currentIndex];
  const progress = ((currentIndex + 1) / questions.length) * 100;

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 sm:py-12">
      <div className="flex justify-between items-center mb-8">
        <button onClick={onCancel} className="text-slate-400 hover:text-slate-600 font-medium flex items-center">
          <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          Batal
        </button>
        <div className="text-right">
          <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest">Soal {currentIndex + 1} dari {questions.length}</span>
        </div>
      </div>

      <div className="w-full bg-slate-200 h-1.5 rounded-full mb-10 overflow-hidden">
        <div 
          className="bg-indigo-600 h-full transition-all duration-500 ease-out" 
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="bg-white p-6 sm:p-10 rounded-[32px] shadow-xl shadow-slate-200/50 border border-slate-100">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mb-8 leading-tight">
          {currentQuestion.question}
        </h3>

        <div className="space-y-4">
          {currentQuestion.options.map((option, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedOption(idx)}
              className={`w-full text-left p-5 rounded-2xl border-2 transition-all flex items-center gap-4 ${
                selectedOption === idx 
                  ? 'border-indigo-600 bg-indigo-50 text-indigo-900 shadow-md' 
                  : 'border-slate-100 hover:border-indigo-200 hover:bg-slate-50 text-slate-600'
              }`}
            >
              <span className={`w-10 h-10 flex-shrink-0 flex items-center justify-center rounded-xl font-bold text-sm ${
                selectedOption === idx ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-400'
              }`}>
                {String.fromCharCode(65 + idx)}
              </span>
              <span className="font-medium text-base">{option}</span>
            </button>
          ))}
        </div>

        <button
          onClick={handleNext}
          disabled={selectedOption === null}
          className="w-full mt-10 bg-indigo-600 text-white py-5 rounded-2xl font-bold text-lg shadow-xl shadow-indigo-100 hover:bg-indigo-700 disabled:opacity-50 disabled:shadow-none transition-all active:scale-[0.98]"
        >
          {currentIndex === questions.length - 1 ? 'Lihat Hasil' : 'Lanjutkan'}
        </button>
      </div>
    </div>
  );
};
