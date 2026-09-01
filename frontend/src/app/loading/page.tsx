'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import DocumentScanner from '@/components/DocumentScanner';
import AnalysisProgressBar from '@/components/AnalysisProgressBar';
import AnalysisSteps from '@/components/AnalysisSteps';

export default function LoadingPage() {
  const [progress, setProgress] = useState(0);
  const router = useRouter();

  // Prefetch the dashboard route so navigation after loading is instant
  useEffect(() => {
    router.prefetch('/dashboard');
  }, [router]);

  // Increment progress by 1 every 40ms until it reaches 100
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => Math.min(prev + 1, 100));
    }, 40);

    return () => clearInterval(interval);
  }, []);

  // Once progress hits 100%, wait briefly then redirect to the dashboard
  useEffect(() => {
    if (progress === 100) {
      const timeout = setTimeout(() => {
        router.push('/dashboard');
      }, 400);

      return () => clearTimeout(timeout);
    }
  }, [progress, router]);

  return (
    // Fullscreen overlay shown while the analysis is "loading"
    <div className="fixed inset-0 z-100 flex flex-col items-center justify-center overflow-hidden bg-[#0c0a14] p-4">
      {/* Ambient background orbs, matching the rest of the app */}
      <div className="pointer-events-none absolute -left-[150px] top-[100px] size-[550px] rounded-full bg-fuchsia-600/30 blur-[120px]" />
      <div className="pointer-events-none absolute -right-[180px] top-[150px] size-[600px] rounded-full bg-violet-600/25 blur-[125px]" />
      <div className="pointer-events-none absolute bottom-[80px] left-[40%] size-[500px] rounded-full bg-cyan-500/20 blur-[120px]" />

      <div className="relative z-10 flex flex-col items-center">
        {/* Animated scanner graphic */}
        <DocumentScanner />
        {/* Progress bar reflecting current percentage */}
        <AnalysisProgressBar progress={progress} />
        {/* List of analysis steps, highlighted based on progress */}
        <AnalysisSteps progress={progress} />
      </div>
    </div>
  );
}