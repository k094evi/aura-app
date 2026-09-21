// src/components/KeyStrengths.tsx

'use client';

import { CheckCircle2 } from 'lucide-react';

type KeyStrengthsProps = {
  strengths: string[];
};

// Card displaying a list of resume key strengths, each marked with a green check icon
export default function KeyStrengths({ strengths }: KeyStrengthsProps) {
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
            <li key={`${s}-${i}`} className="flex items-start gap-[10px]">
              <CheckCircle2 aria-hidden className="mt-[1px] size-[18px] shrink-0 text-[#10b981]" />
              <span className="min-w-0 flex-1 text-[13px] leading-[1.5] text-[#4b5563]">{s}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}