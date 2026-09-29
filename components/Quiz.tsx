'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { QUESTIONS, TOTAL_QUESTIONS } from '@/lib/questions';
import { QuizState } from '@/types/quiz';
import { saveCreatorProgress, savePlayerProgress } from '@/lib/storage';
import ProgressBar from './ProgressBar';
import QuestionCard from './QuestionCard';

interface QuizProps {
  initialState: QuizState;
  onComplete: (state: QuizState) => void;
}

export default function Quiz({ initialState, onComplete }: QuizProps) {
  const router = useRouter();
  const [state, setState] = useState<QuizState>(initialState);
  const [transitionMsg, setTransitionMsg] = useState<string | null>(null);
  
  // Save progress on every change
  useEffect(() => {
    if (state.role === 'creator') {
      saveCreatorProgress(state);
    } else {
      savePlayerProgress(state);
    }
  }, [state]);

  const currentQIndex = state.currentQuestion;
  const question = QUESTIONS[currentQIndex];

  const handleSelectAnswer = (answerId: string) => {
    const newAnswers = { ...state.answers, [question.id]: answerId };
    
    // Auto advance after a brief delay
    setTimeout(() => {
      if (question.transitionMessage && currentQIndex < TOTAL_QUESTIONS - 1) {
        setTransitionMsg(question.transitionMessage);
        setTimeout(() => {
          setTransitionMsg(null);
          advanceToNext(newAnswers);
        }, 2000);
      } else {
        advanceToNext(newAnswers);
      }
    }, 400); // 400ms delay to show selected state before transitioning
  };

  const advanceToNext = (newAnswers: any) => {
    if (currentQIndex < TOTAL_QUESTIONS - 1) {
      setState((prev) => ({
        ...prev,
        answers: newAnswers,
        currentQuestion: prev.currentQuestion + 1,
      }));
    } else {
      const finalState = {
        ...state,
        answers: newAnswers,
        completed: true,
      };
      setState(finalState);
      onComplete(finalState);
    }
  };

  const handleBack = () => {
    if (currentQIndex > 0) {
      setState((prev) => ({
        ...prev,
        currentQuestion: prev.currentQuestion - 1,
      }));
    } else {
      // If at first question and role is creator, go back to landing
      if (state.role === 'creator') {
        router.push('/');
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col p-6 max-w-md mx-auto w-full">
      {/* Header */}
      <header className="flex items-center justify-between mb-8 pt-4">
        <button
          onClick={handleBack}
          className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors backdrop-blur-sm"
          aria-label="Go back"
        >
          <ArrowLeft size={20} />
        </button>
        <span className="text-sm font-semibold tracking-wider text-white/50 uppercase">
          {question.category}
        </span>
        <div className="w-10" /> {/* Spacer for centering */}
      </header>

      <ProgressBar current={currentQIndex + 1} total={TOTAL_QUESTIONS} />

      <main className="flex-1 flex flex-col justify-center mt-12 mb-20 relative">
        <AnimatePresence mode="wait">
          {transitionMsg ? (
            <motion.div
              key="transition"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              transition={{ duration: 0.4 }}
              className="flex items-center justify-center text-center px-4"
            >
              <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-200 to-white italic">
                {transitionMsg}
              </h2>
            </motion.div>
          ) : (
            <QuestionCard
              key={question.id}
              question={question}
              selectedAnswer={state.answers[question.id] || null}
              onSelect={handleSelectAnswer}
            />
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
