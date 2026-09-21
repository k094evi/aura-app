// src/components/SmartSuggestions.tsx

'use client';

import { Lightbulb } from 'lucide-react';

type SmartSuggestionsProps = {
  improvements: string[];
};

// Card displaying a list of suggested resume improvements, each marked with a lightbulb icon
export default function SmartSuggestions({ improvements }: SmartSuggestionsProps) {
  return (
    <div className="flex h-full flex-col gap-4 rounded-[24px] border-[1.5px] border-white bg-white/[0.72] p-6 shadow-[0_10px_30px_rgba(17,24,39,0.03)] backdrop-blur-[12px] sm:p-7">
      {/* Header with lightbulb icon and title */}
      <div className="flex items-center gap-2">
        <Lightbulb className="size-[18px] shrink-0 text-[#f59e0b]" />
        <p className="text-[14px] font-bold uppercase text-[#9ca3af]">Smart Suggestions</p>
      </div>

      {/* List of suggestions */}
      {improvements.length === 0 ? (
        <p className="text-[13px] text-[#4b5563]">No suggestions right now.</p>
      ) : (
        <ul className="flex flex-col gap-[10px]">
          {improvements.map((s, i) => (
            <li key={`${s}-${i}`} className="flex items-start gap-[10px]">
              <Lightbulb aria-hidden className="mt-[1px] size-[18px] shrink-0 text-[#f59e0b]" />
              <span className="min-w-0 flex-1 text-[13px] leading-[1.5] text-[#4b5563]">{s}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}