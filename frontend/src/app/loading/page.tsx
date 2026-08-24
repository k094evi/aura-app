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
    <div className="fixed inset-0 z-100 bg-white flex flex-col items-center justify-center p-4">
      {/* Animated scanner graphic */}
      <DocumentScanner />
      {/* Progress bar reflecting current percentage */}
      <AnalysisProgressBar progress={progress} />
      {/* List of analysis steps, highlighted based on progress */}
      <AnalysisSteps progress={progress} />
    </div>
  );
}