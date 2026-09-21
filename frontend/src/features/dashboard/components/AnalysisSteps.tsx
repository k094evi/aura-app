// src/features/dashboard/components/AnalysisSteps.tsx
'use client';

// List of analysis stages shown to the user during loading
const STEPS = [
  'Parsing Resume',
  'Extracting Keywords',
  'Matching Job Description',
  'Readability Check',
  'Formatting Analysis',
];

export default function AnalysisSteps({ progress }: { progress: number }) {
  return (
    <div className="mt-10 flex max-w-xl flex-wrap justify-center gap-3">
      {STEPS.map((step, i) => (
        <div
          key={step}
          // Highlight a step once progress passes its threshold, otherwise show it as inactive
          className={`rounded-lg border px-4 py-2 text-xs font-bold transition-all ${
            progress > (i + 1) * 18
              ? 'border-[#8b5cf6]/20 bg-[#8b5cf6]/10 text-[#7c3aed] shadow-[0_8px_20px_rgba(124,58,237,0.08)]'
              : 'border-white bg-white/[0.72] text-[#9ca3af]'
          }`}
        >
          {step}
        </div>
      ))}
    </div>
  );
}