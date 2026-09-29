'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { CompatibilityResult as ResultType } from '@/types/quiz';
import ShareButton from './ShareButton';
import { getScoreColor, getScoreLabel } from '@/lib/scoring';
import { RotateCcw } from 'lucide-react';
import Link from 'next/link';

interface CompatibilityResultProps {
  result: ResultType;
  shareUrl: string;
}

export default function CompatibilityResult({
  result,
  shareUrl,
}: CompatibilityResultProps) {
  const [displayScore, setDisplayScore] = useState(0);
  const [stage, setStage] = useState<'analyzing' | 'revealing' | 'done'>(
    'analyzing'
  );
  const [loadingText, setLoadingText] = useState('Comparing questionable opinions...');

  useEffect(() => {
    // Loading sequence
    const t1 = setTimeout(
      () => setLoadingText('Analyzing snack preferences...'),
      1200
    );
    const t2 = setTimeout(
      () => setLoadingText('Determining who is more chaotic...'),
      2400
    );
    const t3 = setTimeout(() => setStage('revealing'), 3600);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  useEffect(() => {
    if (stage === 'revealing') {
      // Counter animation
      let startTimestamp: number;
      const duration = 2000;

      const step = (timestamp: number) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        
        // Easing function for smoother counter
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        
        setDisplayScore(Math.floor(easeOutQuart * result.score));

        if (progress < 1) {
          window.requestAnimationFrame(step);
        } else {
          setStage('done');
          fireConfetti();
        }
      };

      window.requestAnimationFrame(step);
    }
  }, [stage, result.score]);

  const fireConfetti = () => {
    const end = Date.now() + 2000;
    const colors = ['#ff7eb3', '#ff758c', '#ffffff', '#ff9a9e'];

    (function frame() {
      confetti({
        particleCount: 4,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: colors,
      });
      confetti({
        particleCount: 4,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: colors,
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();
  };

  if (stage === 'analyzing') {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center">
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="text-6xl mb-6"
        >
          💘
        </motion.div>
        <h2 className="text-xl font-medium text-white/80 animate-pulse">
          {loadingText}
        </h2>
      </div>
    );
  }

  const gradient = getScoreColor(result.score);
  const label = getScoreLabel(result.score);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-md mx-auto w-full pb-12"
    >
      {/* Result Card */}
      <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 mb-6 text-center shadow-xl border border-white/20 relative overflow-hidden">
        {/* Decorative background glow */}
        <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-20`} />
        
        <div className="relative z-10">
          <p className="text-white/70 font-semibold tracking-widest uppercase text-sm mb-2">
            Ahmed × Nesrine
          </p>
          
          <div className="flex items-end justify-center gap-1 mb-2">
            <motion.span 
              className={`text-8xl font-black text-transparent bg-clip-text bg-gradient-to-br ${gradient} drop-shadow-sm`}
              initial={{ scale: 0.5 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', bounce: 0.5 }}
            >
              {displayScore}
            </motion.span>
            <span className="text-4xl font-bold text-white/80 mb-2">%</span>
          </div>

          <p className="text-2xl font-bold text-white mb-6">
            {label}
          </p>

          <div className="bg-black/20 rounded-2xl p-5 mb-2">
            <p className="text-lg text-white font-medium mb-1">
              {result.conclusion}
            </p>
            <p className="text-sm text-white/70">
              {result.subConclusion}
            </p>
          </div>
        </div>
      </div>

      {stage === 'done' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="space-y-6"
        >
          {/* Matches */}
          {result.matches.length > 0 && (
            <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-6 border border-white/10">
              <h3 className="text-lg font-bold text-white mb-4 text-center">
                Things we somehow both chose ✨
              </h3>
              <div className="space-y-3">
                {result.matches.map((match, i) => (
                  <div key={i} className="bg-white/10 rounded-xl p-3 flex items-center gap-3">
                    <span className="text-2xl">{match.emoji}</span>
                    <div>
                      <p className="text-xs text-white/60">{match.questionText}</p>
                      <p className="text-sm font-medium text-white">{match.answer}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Differences */}
          {result.differences.length > 0 && (
            <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-6 border border-white/10">
              <h3 className="text-lg font-bold text-white mb-4 text-center">
                Our funny differences 🤷
              </h3>
              <div className="space-y-4">
                {result.differences.map((diff, i) => (
                  <div key={i} className="bg-black/10 rounded-xl p-4">
                    <p className="text-xs text-white/60 text-center mb-3">
                      {diff.questionText}
                    </p>
                    <div className="grid grid-cols-2 gap-2 text-center">
                      <div className="bg-white/5 rounded-lg p-2">
                        <span className="block text-xl mb-1">{diff.emojiA}</span>
                        <span className="text-xs text-white">Them: {diff.answerA}</span>
                      </div>
                      <div className="bg-white/5 rounded-lg p-2">
                        <span className="block text-xl mb-1">{diff.emojiB}</span>
                        <span className="text-xs text-white">You: {diff.answerB}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="space-y-3 pt-4">
            <ShareButton url={shareUrl} score={result.score} />
            <div className="grid grid-cols-2 gap-3">
              <ShareButton 
                url={shareUrl} 
                score={result.score} 
                variant="secondary" 
                label="Copy link" 
              />
              <Link 
                href="/"
                className="w-full flex items-center justify-center gap-2 py-4 px-6 rounded-xl font-bold bg-white/10 text-white hover:bg-white/20 transition-colors backdrop-blur-sm"
              >
                <RotateCcw size={20} />
                <span>Restart</span>
              </Link>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
