'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
  type: 'heart' | 'star' | 'circle' | 'sparkle';
  opacity: number;
}

function generateParticles(count: number): Particle[] {
  const types: Particle['type'][] = ['heart', 'star', 'circle', 'sparkle'];
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 16 + 8,
    duration: Math.random() * 8 + 6,
    delay: Math.random() * 5,
    type: types[Math.floor(Math.random() * types.length)],
    opacity: Math.random() * 0.4 + 0.1,
  }));
}

const PARTICLE_CHARS: Record<Particle['type'], string> = {
  heart: '♥',
  star: '✦',
  circle: '○',
  sparkle: '✧',
};

export default function FloatingDecorations({ count = 18 }: { count?: number }) {
  const particlesRef = useRef<Particle[]>(generateParticles(count));

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 overflow-hidden z-0"
    >
      {particlesRef.current.map((p) => (
        <motion.div
          key={p.id}
          className="absolute select-none text-pink-300"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            fontSize: p.size,
            opacity: p.opacity,
            color:
              p.type === 'heart'
                ? '#f9a8d4'
                : p.type === 'star'
                ? '#c4b5fd'
                : p.type === 'sparkle'
                ? '#fbcfe8'
                : '#e9d5ff',
          }}
          animate={{
            y: [0, -30, 0, 15, 0],
            x: [0, 8, -8, 4, 0],
            rotate: [0, 10, -10, 5, 0],
            scale: [1, 1.1, 0.95, 1.05, 1],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          {PARTICLE_CHARS[p.type]}
        </motion.div>
      ))}
    </div>
  );
}
