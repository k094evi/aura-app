// src/features/dashboard/components/DocumentScanner.tsx
'use client';

import { motion } from 'motion/react';
import { FileText } from 'lucide-react';

// Animated document scanner illustration showing a scanning line effect
export default function DocumentScanner() {
  return (
    <div className="relative mb-10 h-64 w-48" aria-hidden>
      {/* Document card background with icon */}
      <div className="absolute inset-0 flex items-center justify-center rounded-[24px] border-[1.5px] border-white bg-white/[0.72] shadow-[0_15px_40px_rgba(17,24,39,0.08)] backdrop-blur-[12px]">
        <FileText className="size-16 text-[#7c3aed]/25" />
      </div>
      {/* Scanning line that animates from top to bottom, looping */}
      <motion.div
        className="absolute left-0 right-0 top-0 z-10 h-1 rounded-full bg-[#8b5cf6] shadow-[0_0_15px_rgba(139,92,246,0.6)]"
        initial={{ top: '0%' }}
        animate={{ top: '100%' }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      />
      {/* Decorative grid of lines to simulate document content/text */}
      <div className="absolute inset-0 flex items-center justify-center opacity-[0.12]">
        <div className="grid w-full grid-cols-4 gap-2 px-4">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="h-2 rounded-full bg-[#7c3aed]" />
          ))}
        </div>
      </div>
    </div>
  );
}