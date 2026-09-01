'use client';

import { motion } from "motion/react";
import { Loader2 } from "lucide-react";

export default function AnalysisProgressBar({ progress }: { progress: number }) {
  return (
    <div className="text-center max-w-sm">
      {/* Spinner icon with heading */}
      <div className="flex items-center justify-center gap-2 mb-4">
        <Loader2 className="w-5 h-5 text-fuchsia-400 animate-spin" />
        <h2 className="text-2xl font-bold text-white">Analyzing Resume</h2>
      </div>
      <p className="text-white/50 font-medium mb-8">
        Comparing your experience with 500+ industry standards and ATS algorithms.
      </p>
      {/* Progress bar track */}
      <div className="w-full bg-white/[0.08] h-2.5 rounded-full overflow-hidden mb-2">
        {/* Animated fill that grows based on current progress */}
        <motion.div
        className="h-full bg-gradient-to-r from-[#8b5cf6] to-[#d946ef] rounded-full"
        initial={{ width: "0%" }}
        animate={{ width: `${progress}%` }}
        transition={{
            ease: "linear", 
            duration: 0.01
        }}
        />
      </div>
      {/* Status label and percentage display */}
      <div className="flex justify-between items-center text-xs font-bold text-white/40 uppercase tracking-wider">
        <span>Parsing content</span>
        <span>{progress}%</span>
      </div>
    </div>
  );
}