'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Heart } from 'lucide-react';
import Link from 'next/link';

interface LandingProps {
  isPlayer?: boolean;
  onStart: () => void;
}

export default function Landing({ isPlayer = false, onStart }: LandingProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-6 text-center max-w-md mx-auto relative z-10">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{
          type: 'spring',
          stiffness: 260,
          damping: 20,
          delay: 0.1,
        }}
        className="w-20 h-20 bg-white/10 rounded-3xl flex items-center justify-center mb-8 backdrop-blur-md shadow-[0_0_40px_rgba(255,192,203,0.3)] border border-white/20"
      >
        <Heart className="text-pink-400 fill-pink-400" size={40} />
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white via-pink-100 to-pink-300 mb-4 tracking-tight drop-shadow-sm"
      >
        Us, Apparently 💘
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-xl text-white/90 font-medium mb-3"
      >
        {isPlayer
          ? 'Someone already answered these questions 👀'
          : "A completely serious investigation into whether we'd get along."}
      </motion.p>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-sm text-white/60 mb-12 italic"
      >
        {isPlayer
          ? "Now let's see how similar you are."
          : 'Your answers may be used against you later.'}
      </motion.p>

      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onStart}
        className="w-full group bg-white text-pink-600 font-bold text-lg py-5 px-8 rounded-2xl flex items-center justify-center gap-3 shadow-[0_8px_30px_rgb(255,255,255,0.2)] hover:shadow-[0_8px_40px_rgb(255,255,255,0.3)] transition-all duration-300"
      >
        <span>{isPlayer ? 'Take the quiz' : 'Start the investigation'}</span>
        <ArrowRight className="group-hover:translate-x-1 transition-transform" />
      </motion.button>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="mt-6 flex items-center gap-2 text-white/50 text-xs font-medium uppercase tracking-widest"
      >
        <span>30 questions</span>
        <span className="w-1 h-1 rounded-full bg-white/30" />
        <span>Zero scientific credibility</span>
      </motion.div>
    </div>
  );
}
