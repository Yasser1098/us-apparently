'use client';

import { Question } from '@/types/quiz';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

interface QuestionCardProps {
  question: Question;
  selectedAnswer: string | null;
  onSelect: (answerId: string) => void;
}

export default function QuestionCard({
  question,
  selectedAnswer,
  onSelect,
}: QuestionCardProps) {
  return (
    <motion.div
      key={question.id}
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
      className="w-full"
    >
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white mb-2 leading-tight">
          {question.text}
        </h2>
        {question.emoji && (
          <div className="text-5xl mt-4 mb-2 filter drop-shadow-lg">
            {question.emoji}
          </div>
        )}
      </div>

      <div className="space-y-3">
        {question.options?.map((option, index) => {
          const isSelected = selectedAnswer === option.id;
          return (
            <motion.button
              key={option.id}
              onClick={() => onSelect(option.id)}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`w-full relative overflow-hidden group flex items-center justify-between p-4 rounded-2xl transition-all duration-300 ${
                isSelected
                  ? 'bg-white text-slate-900 shadow-[0_0_20px_rgba(255,255,255,0.3)]'
                  : 'bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm'
              }`}
            >
              <div className="flex items-center gap-3">
                {option.emoji && (
                  <span className="text-2xl">{option.emoji}</span>
                )}
                <span className="text-lg font-medium text-left">
                  {option.label}
                </span>
              </div>
              
              <div
                className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                  isSelected
                    ? 'border-pink-500 bg-pink-500 text-white'
                    : 'border-white/30 group-hover:border-white/50'
                }`}
              >
                {isSelected && <Check size={14} strokeWidth={3} />}
              </div>
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
}
