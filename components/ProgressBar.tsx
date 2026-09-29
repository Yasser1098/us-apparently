'use client';

import { motion, AnimatePresence } from 'framer-motion';

interface ProgressBarProps {
  current: number;
  total: number;
}

export default function ProgressBar({ current, total }: ProgressBarProps) {
  const percentage = Math.round((current / total) * 100);

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-2xl font-bold text-white tabular-nums">
            {String(current).padStart(2, '0')}
          </span>
          <span className="text-white/40 text-sm font-medium">/ {total}</span>
        </div>
        <motion.div
          className="flex items-center gap-1.5 bg-white/10 px-3 py-1 rounded-full"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <motion.span
            animate={{ scale: [1, 1.3, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="text-pink-400 text-sm"
          >
            ♥
          </motion.span>
          <span className="text-white/70 text-xs font-medium">{percentage}%</span>
        </motion.div>
      </div>

      <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-pink-500 via-rose-400 to-purple-500"
          initial={{ width: `${((current - 1) / total) * 100}%` }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
}
