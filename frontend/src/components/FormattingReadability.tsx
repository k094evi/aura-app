'use client';

// Represents a single grammar/style issue with its category and description
type GrammarIssue = {
  type: string;
  text: string;
};

type FormattingReadabilityProps = {
  grammarIssues: GrammarIssue[];
};

// Card component displaying a list of formatting and readability issues
export default function FormattingReadability({ grammarIssues }: FormattingReadabilityProps) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center">
          <span className="text-indigo-500 font-bold text-lg">T</span>
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-900">Formatting & Readability</h3>
          <p className="text-sm text-gray-400">Checking for visual flow and linguistic clarity</p>
        </div>
      </div>

      {/* Issues list - renders each grammar/style issue as a row */}
      <div className="flex flex-col gap-3">
        {grammarIssues.map((issue) => (
          <div
            key={issue.text}
            className="group flex items-center gap-4 bg-gray-50 rounded-xl px-4 py-3 hover:bg-indigo-50 transition-colors cursor-default"
          >
            {/* Issue category/type label */}
            <span className="text-xs font-bold tracking-widest uppercase w-24 shrink-0 text-gray-400 group-hover:text-indigo-500 transition-colors">
              {issue.type}
            </span>
            {/* Issue description */}
            <p className="text-sm font-medium text-gray-900 leading-snug">{issue.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}