// src/components/KeyStrengths.tsx

'use client';

import { motion, useReducedMotion } from 'motion/react';
import { CheckCircle2 } from 'lucide-react';

type KeyStrengthsProps = {
  strengths: string[];
};

// Card displaying a list of resume key strengths, each marked with a green check icon
export default function KeyStrengths({ strengths }: KeyStrengthsProps) {
  // ADDED: respect the OS "reduce motion" setting
  const reduceMotion = useReducedMotion();

  return (
    <div className="flex h-full flex-col gap-4 rounded-[24px] border-[1.5px] border-white bg-white/[0.72] p-6 shadow-[0_10px_30px_rgba(17,24,39,0.03)] backdrop-blur-[12px] sm:p-7">
      {/* Header with checkmark icon and title */}
      <div className="flex items-center gap-2">
        <CheckCircle2 className="size-[18px] shrink-0 text-[#10b981]" />
        <p className="text-[14px] font-bold uppercase text-[#9ca3af]">Key Strengths</p>
      </div>

      {/* List of strengths */}
      {strengths.length === 0 ? (
        <p className="text-[13px] text-[#4b5563]">No key strengths found yet.</p>
      ) : (
        <ul className="flex flex-col gap-[10px]">
          {strengths.map((s, i) => (
            // CHANGED: <li> -> <motion.li>. Each item fades/slides up with a small stagger
            // (capped at 8 steps so a long list doesn't take too long to appear).
            <motion.li
              key={`${s}-${i}`}
              initial={reduceMotion ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.4,
                delay: reduceMotion ? 0 : Math.min(i, 8) * 0.07,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="flex items-start gap-[10px]"
            >
              <CheckCircle2 aria-hidden className="mt-[1px] size-[18px] shrink-0 text-[#10b981]" />
              <span className="min-w-0 flex-1 text-[13px] leading-[1.5] text-[#4b5563]">{s}</span>
            </motion.li>
          ))}
        </ul>
      )}
    </div>
  );
}