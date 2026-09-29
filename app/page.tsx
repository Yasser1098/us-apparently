'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Landing from '@/components/Landing';
import { clearCreatorProgress, clearPlayerProgress } from '@/lib/storage';

export default function Home() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleStart = () => {
    // Starting fresh as the creator
    clearCreatorProgress();
    clearPlayerProgress(); // clear old player sessions if any
    router.push('/play');
  };

  if (!mounted) return null;

  return (
    <main className="min-h-screen flex items-center justify-center">
      <Landing onStart={handleStart} />
    </main>
  );
}
