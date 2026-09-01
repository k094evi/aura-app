'use client';

type KeyStrengthsProps = {
  strengths: string[];
};

// Card displaying a list of resume key strengths with checkmark icon and bullet points
export default function KeyStrengths({ strengths }: KeyStrengthsProps) {
  return (
    <div className="rounded-3xl border border-white/[0.07] bg-[#151221]/70 p-5 shadow-[0px_16px_32px_0px_rgba(0,0,0,0.25)] backdrop-blur-[20px]">
      {/* Header with checkmark icon and title */}
      <div className="mb-4 flex items-center gap-2">
        <svg className="size-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="text-sm font-extrabold uppercase tracking-widest text-white/50">Key Strengths</p>
      </div>
      {/* List of strengths, each marked with a green dot */}
      <ul className="flex flex-col gap-3">
        {strengths.map((s) => (
          <li key={s} className="flex items-start gap-2 leading-snug">
            <span className="mt-1.5 size-2 shrink-0 rounded-full bg-emerald-400" />
            <span className="text-sm font-medium text-white/80">{s}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}