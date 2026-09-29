'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  loadCreatorProgress,
  loadResultAnswers,
} from '@/lib/storage';
import { calculateCompatibility } from '@/lib/scoring';
import { generateShareLink } from '@/lib/sharing';
import CompatibilityResult from '@/components/CompatibilityResult';
import ShareButton from '@/components/ShareButton';

export default function ResultPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [mode, setMode] = useState<'creator' | 'player' | null>(null);
  
  // For creator mode
  const [shareUrl, setShareUrl] = useState('');
  
  // For player mode
  const [resultData, setResultData] = useState<any>(null);

  useEffect(() => {
    // Determine if we are showing creator share screen or player comparison screen
    const resultAnswers = loadResultAnswers();
    
    if (resultAnswers) {
      // Player mode: We have both answers, calculate and show comparison
      setMode('player');
      const comp = calculateCompatibility(
        resultAnswers.creatorAnswers,
        resultAnswers.playerAnswers
      );
      setResultData(comp);
      // For player, share link is just the base site so they can make their own
      setShareUrl(window.location.origin);
    } else {
      // Creator mode: We just finished answering, need to generate link
      const creatorState = loadCreatorProgress();
      if (creatorState && creatorState.completed) {
        setMode('creator');
        const url = generateShareLink(creatorState.answers);
        setShareUrl(url);
      } else {
        // Not completed, redirect to home
        router.push('/');
        return;
      }
    }
    
    setMounted(true);
  }, [router]);

  if (!mounted || !mode) {
    return <div className="min-h-screen flex items-center justify-center">...</div>;
  }

  return (
    <main className="min-h-screen pt-12 px-6 flex flex-col items-center">
      {mode === 'creator' ? (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full text-center mt-12"
        >
          <div className="text-6xl mb-6">✨</div>
          <h1 className="text-3xl font-bold text-white mb-4">Quiz Complete!</h1>
          <p className="text-white/80 mb-12 text-lg">
            Now send this totally scientific assessment to them and see what they say.
          </p>
          
          <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 shadow-xl mb-8">
            <h2 className="text-sm font-bold tracking-widest text-white/50 uppercase mb-6">
              Your Share Link
            </h2>
            <div className="space-y-4">
              <ShareButton url={shareUrl} label="Share Link" />
              <ShareButton url={shareUrl} variant="secondary" label="Copy Link" />
            </div>
          </div>
          
          <p className="text-xs text-white/40 italic mt-8 px-6">
            Their answers will be compared locally on their device. We don't save anything to a server.
          </p>
        </motion.div>
      ) : (
        <CompatibilityResult result={resultData} shareUrl={shareUrl} />
      )}
    </main>
  );
}
