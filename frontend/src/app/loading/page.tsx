'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import DocumentScanner from '@/components/DocumentScanner';
import AnalysisProgressBar from '@/components/AnalysisProgressBar';
import AnalysisSteps from '@/components/AnalysisSteps';

export default function LoadingPage() {
  const [progress, setProgress] = useState(0);
  const router = useRouter();

  useEffect(() => {
    router.prefetch('/dashboard');
  }, [router]);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => Math.min(prev + 1, 100));
    }, 40);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (progress === 100) {
      const timeout = setTimeout(() => {
        router.push('/dashboard');
      }, 400);

      return () => clearTimeout(timeout);
    }
  }, [progress, router]);

  return (
    <div className="fixed inset-0 z-100 bg-white flex flex-col items-center justify-center p-4">
      <DocumentScanner />
      <AnalysisProgressBar progress={progress} />
      <AnalysisSteps progress={progress} />
    </div>
  );
}