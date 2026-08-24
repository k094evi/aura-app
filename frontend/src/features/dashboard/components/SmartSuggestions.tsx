type SmartSuggestionsProps = {
  improvements: string[];
};

// Card displaying a list of suggested resume improvements with a lightbulb icon and bullet points
export default function SmartSuggestions({ improvements }: SmartSuggestionsProps) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
      {/* Header with lightbulb icon and title */}
      <div className="flex items-center gap-2 mb-4">
        <svg className="w-5 h-5 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636-.707.707M21 12h-1M4 12H3m1.343-5.657-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
        <p className="text-sm font-extrabold tracking-widest text-gray-500 uppercase">Smart Suggestions</p>
      </div>
      {/* List of suggestions, each marked with a yellow dot */}
      <ul className="flex flex-col gap-3">
        {improvements.map((s) => (
          <li key={s} className="flex items-start gap-2 leading-snug">
            <span className="w-2 h-2 rounded-full bg-yellow-400 shrink-0 mt-1.5" />
            <span className="text-sm font-medium text-gray-900">{s}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}