'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import Quiz from '@/components/Quiz';
import Landing from '@/components/Landing';
import { QuizState, Answers } from '@/types/quiz';
import { getPayloadFromHash, decodeAnswers } from '@/lib/sharing';
import {
  loadCreatorProgress,
  loadPlayerProgress,
  saveResultAnswers,
} from '@/lib/storage';

export default function PlayPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [state, setState] = useState<QuizState | null>(null);
  
  // When acting as player, we store creator's answers here
  const [creatorAnswers, setCreatorAnswers] = useState<Answers | null>(null);
  
  // If player hasn't started yet, show landing
  const [showPlayerLanding, setShowPlayerLanding] = useState(false);

  useEffect(() => {
    // Check hash for payload (means we are the player)
    const hashPayload = getPayloadFromHash();
    
    if (hashPayload) {
      const decoded = decodeAnswers(hashPayload);
      if (decoded) {
        setCreatorAnswers(decoded);
        
        // Load player's previous progress if they started and refreshed
        const savedPlayerState = loadPlayerProgress();
        if (savedPlayerState && !savedPlayerState.completed) {
          setState(savedPlayerState);
        } else {
          // Initialize fresh player state, but show landing first
          setShowPlayerLanding(true);
          setState({
            answers: {},
            currentQuestion: 0,
            completed: false,
            role: 'player',
          });
        }
      } else {
        // Invalid link, redirect to home
        router.push('/');
        return;
      }
    } else {
      // We are the creator
      const savedCreatorState = loadCreatorProgress();
      if (savedCreatorState && !savedCreatorState.completed) {
        setState(savedCreatorState);
      } else if (savedCreatorState && savedCreatorState.completed) {
        // Creator already finished, go to result
        router.push('/result');
        return;
      } else {
        // Fresh creator state
        setState({
          answers: {},
          currentQuestion: 0,
          completed: false,
          role: 'creator',
        });
      }
    }
    
    setMounted(true);
  }, [router]);

  const handleComplete = (finalState: QuizState) => {
    if (finalState.role === 'creator') {
      // Creator finished, go to results to generate link
      router.push('/result');
    } else {
      // Player finished, save both answers to compare
      if (creatorAnswers) {
        saveResultAnswers(creatorAnswers, finalState.answers);
        router.push('/result');
      }
    }
  };

  if (!mounted || !state) {
    return <div className="min-h-screen flex items-center justify-center">...</div>;
  }

  if (showPlayerLanding) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <Landing 
          isPlayer={true} 
          onStart={() => setShowPlayerLanding(false)} 
        />
      </main>
    );
  }

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Quiz initialState={state} onComplete={handleComplete} />
    </Suspense>
  );
}
