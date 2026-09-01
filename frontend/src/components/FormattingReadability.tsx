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
    <div className="rounded-3xl border border-white/[0.07] bg-[#151221]/70 p-6 shadow-[0px_16px_32px_0px_rgba(0,0,0,0.25)] backdrop-blur-[20px]">
      {/* Header */}
      <div className="mb-6 flex items-center gap-3.5">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-amber-500/20 bg-amber-500/10">
          <span className="text-lg font-bold text-amber-400">T</span>
        </div>
        <div>
          <h3 className="text-lg font-bold text-white">Formatting &amp; Readability</h3>
          <p className="text-[13px] text-white/50">Checking for visual flow and linguistic clarity</p>
        </div>
      </div>

      {/* Issues list - renders each grammar/style issue as a row */}
      <div className="flex flex-col gap-3">
        {grammarIssues.map((issue) => (
          <div
            key={issue.text}
            className="group flex items-center gap-4 rounded-xl border border-white/[0.05] bg-white/[0.03] px-4 py-3 transition-colors hover:border-fuchsia-500/20 hover:bg-fuchsia-500/[0.06]"
          >
            {/* Issue category/type label */}
            <span className="w-24 shrink-0 text-xs font-bold uppercase tracking-widest text-white/40 transition-colors group-hover:text-fuchsia-300">
              {issue.type}
            </span>
            {/* Issue description */}
            <p className="text-sm font-medium leading-snug text-white/80">{issue.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}