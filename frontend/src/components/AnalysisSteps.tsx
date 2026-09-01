'use client';

// List of analysis stages shown to the user during loading
const STEPS = [
  "Parsing Resume",
  "Extracting Keywords",
  "Matching Job Description",
  "Readability Check",
  "Formatting Analysis",
];

export default function AnalysisSteps({ progress }: { progress: number }) {
  return (
    <div className="mt-20 flex flex-wrap justify-center gap-4">
      {STEPS.map((step, i) => (
        <div
          key={i}
          // Highlight step once progress passes its threshold, otherwise show as inactive
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
            progress > (i + 1) * 18
              ? "bg-fuchsia-500/10 text-fuchsia-300 border border-fuchsia-500/20 shadow-[0px_8px_20px_0px_rgba(0,0,0,0.2)]"
              : "bg-white/[0.03] text-white/20 border border-transparent"
          }`}
        >
          {step}
        </div>
      ))}
    </div>
  );
}