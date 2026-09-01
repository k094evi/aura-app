'use client';

type SmartSuggestionsProps = {
  improvements: string[];
};

// Card displaying a list of suggested resume improvements with a lightbulb icon and bullet points
export default function SmartSuggestions({ improvements }: SmartSuggestionsProps) {
  return (
    <div className="rounded-3xl border border-white/[0.07] bg-[#151221]/70 p-5 shadow-[0px_16px_32px_0px_rgba(0,0,0,0.25)] backdrop-blur-[20px]">
      {/* Header with lightbulb icon and title */}
      <div className="mb-4 flex items-center gap-2">
        <svg className="size-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636-.707.707M21 12h-1M4 12H3m1.343-5.657-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
        <p className="text-sm font-extrabold uppercase tracking-widest text-white/50">Smart Suggestions</p>
      </div>
      {/* List of suggestions, each marked with a yellow dot */}
      <ul className="flex flex-col gap-3">
        {improvements.map((s) => (
          <li key={s} className="flex items-start gap-2 leading-snug">
            <span className="mt-1.5 size-2 shrink-0 rounded-full bg-amber-400" />
            <span className="text-sm font-medium text-white/80">{s}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}