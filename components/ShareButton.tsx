'use client';

import { useState } from 'react';
import { shareResult } from '@/lib/sharing';
import { Share2, Check, Copy } from 'lucide-react';

interface ShareButtonProps {
  url: string;
  score?: number;
  variant?: 'primary' | 'secondary';
  label?: string;
}

export default function ShareButton({
  url,
  score = 0,
  variant = 'primary',
  label = 'Share result',
}: ShareButtonProps) {
  const [status, setStatus] = useState<'idle' | 'copied' | 'shared'>('idle');

  const handleShare = async () => {
    const result = await shareResult(url, score);
    if (result === 'copied') {
      setStatus('copied');
      setTimeout(() => setStatus('idle'), 2500);
    } else if (result === 'shared') {
      setStatus('shared');
      setTimeout(() => setStatus('idle'), 2500);
    }
  };

  const isPrimary = variant === 'primary';

  return (
    <button
      onClick={handleShare}
      className={`w-full flex items-center justify-center gap-2 py-4 px-6 rounded-xl font-bold transition-all duration-300 ${
        isPrimary
          ? 'bg-white text-pink-600 hover:bg-pink-50 shadow-[0_4px_14px_0_rgba(255,255,255,0.39)]'
          : 'bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm'
      }`}
    >
      {status === 'copied' ? (
        <>
          <Check size={20} />
          <span>Link copied 💘</span>
        </>
      ) : status === 'shared' ? (
        <>
          <Check size={20} />
          <span>Shared 💘</span>
        </>
      ) : (
        <>
          {isPrimary ? <Share2 size={20} /> : <Copy size={20} />}
          <span>{label}</span>
        </>
      )}
    </button>
  );
}
