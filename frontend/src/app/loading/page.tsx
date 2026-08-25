'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import DocumentScanner from '@/components/DocumentScanner';
import AnalysisProgressBar from '@/components/AnalysisProgressBar';
import AnalysisSteps from '@/components/AnalysisSteps';

export default function LoadingPage() {
  const [progress, setProgress] = useState(0);
  const [ready, setReady] = useState(false);
  const router = useRouter();
  const routerRef = useRef(router);
  routerRef.current = router;

  // Mount-only guard — check sessionStorage once, never re-run
  useEffect(() => {
    const hasData = !!sessionStorage.getItem('aura_result');
    if (!hasData) {
      // No data: user landed here directly — send to upload, not '/'
      // to avoid the '/' → UploadPage → /loading → '/' loop
      routerRef.current.replace('/upload');
      return;
    }
    setReady(true);
    routerRef.current.prefetch('/dashboard');
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Only start the progress timer once we've confirmed data exists
  useEffect(() => {
    if (!ready) return;
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) { clearInterval(interval); return 100; }
        return prev + 1;
      });
    }, 30);
    return () => clearInterval(interval);
  }, [ready]);

  // Navigate to dashboard exactly once when progress completes
  useEffect(() => {
    if (progress < 100) return;
    const timeout = setTimeout(() => {
      routerRef.current.push('/dashboard');
    }, 400);
    return () => clearTimeout(timeout);
  }, [progress]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="fixed inset-0 z-50 bg-white flex flex-col items-center justify-center p-4">
      <DocumentScanner />
      <AnalysisProgressBar progress={progress} />
      <AnalysisSteps progress={progress} />
    </div>
  );
}