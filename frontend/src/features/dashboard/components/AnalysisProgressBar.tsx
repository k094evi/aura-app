// src/features/dashboard/components/AnalysisProgressBar.tsx
'use client';

import { motion } from 'motion/react';
import { Loader2 } from 'lucide-react';

export default function AnalysisProgressBar({ progress }: { progress: number }) {
  const pct = Math.min(100, Math.max(0, progress));

  return (
    <div className="w-full max-w-sm text-center">
      {/* Spinner icon with heading */}
      <div className="mb-4 flex items-center justify-center gap-2">
        <Loader2 className="size-5 animate-spin text-[#8b5cf6]" />
        <h2 className="text-2xl font-extrabold text-[#111827]">Analyzing Resume</h2>
      </div>
      <p className="mb-8 text-[14px] font-medium text-[#4b5563]">
        Comparing your experience with 500+ industry standards and ATS algorithms.
      </p>
      {/* Progress bar track */}
      <div
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={pct}
        className="mb-2 h-2.5 w-full overflow-hidden rounded-full bg-[#7c3aed]/[0.08]"
      >
        {/* Animated fill that grows based on current progress */}
        <motion.div
          className="h-full rounded-full bg-[linear-gradient(90deg,#8b5cf6_0%,#06b6d4_100%)]"
          initial={{ width: '0%' }}
          animate={{ width: `${pct}%` }}
          transition={{ ease: 'linear', duration: 0.15 }}
        />
      </div>
      {/* Status label and percentage display */}
      <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-[#9ca3af]">
        <span>Parsing content</span>
        <span>{pct}%</span>
      </div>
    </div>
  );
}