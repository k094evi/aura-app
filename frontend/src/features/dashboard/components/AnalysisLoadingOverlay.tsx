// src/features/dashboard/components/AnalysisLoadingOverlay.tsx
'use client';

import { useEffect, useState } from 'react';

import { DocumentScanner, AnalysisProgressBar, AnalysisSteps } from '@/features/dashboard/components';
// The real request has no progress events, so the bar eases toward this ceiling
// and never reaches 100% on its own. The overlay is unmounted when the request finishes.
const CEILING = 95;
const TICK_MS = 100;

// Render this only while an analysis is running: {isAnalyzing && <AnalysisLoadingOverlay />}
// Mounting starts the progress from 0, unmounting resets it.
export default function AnalysisLoadingOverlay() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => {
      setProgress((p) => p + (CEILING - p) * 0.03);
    }, TICK_MS);
    return () => window.clearInterval(id);
  }, []);

  // Stop the page behind the overlay from scrolling
  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, []);

  const shown = Math.min(CEILING, Math.round(progress));

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Analyzing your resume"
      className="fixed inset-0 z-[90] flex flex-col items-center justify-center overflow-y-auto bg-[#f4f2fb]/90 p-6 backdrop-blur-[6px]"
    >
      <DocumentScanner />
      <AnalysisProgressBar progress={shown} />
      <AnalysisSteps progress={shown} />
    </div>
  );
}