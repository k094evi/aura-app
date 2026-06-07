'use client';

type KeyStrengthsProps = {
  strengths: string[];
};

export default function KeyStrengths({ strengths }: KeyStrengthsProps) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="text-sm font-extrabold tracking-widest text-gray-500 uppercase">Key Strengths</p>
      </div>
      <ul className="flex flex-col gap-3">
        {strengths.map((s) => (
          <li key={s} className="flex items-start gap-2 leading-snug">
            <span className="w-2 h-2 rounded-full bg-green-500 shrink-0 mt-1.5" />
            <span className="text-sm font-medium text-gray-900">{s}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}