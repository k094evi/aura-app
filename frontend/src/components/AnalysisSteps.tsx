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
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
            progress > (i + 1) * 18
              ? "bg-indigo-50 text-indigo-600 border border-indigo-100 shadow-sm"
              : "bg-gray-50 text-gray-300 border border-transparent"
          }`}
        >
          {step}
        </div>
      ))}
    </div>
  );
}
