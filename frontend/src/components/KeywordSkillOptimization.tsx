'use client';

// Represents a single skill, whether it's missing from the resume, and a recommendation
type SkillGap = {
  skill: string;
  missing: boolean;
  recommendation: string;
};

type KeywordSkillOptimizationProps = {
  skillGaps: SkillGap[];
};

// Card displaying a grid of skills, flagging which are missing vs. present
export default function KeywordSkillOptimization({ skillGaps }: KeywordSkillOptimizationProps) {
  return (
    <div className="rounded-3xl border border-white/[0.07] bg-[#151221]/70 p-6 shadow-[0px_16px_32px_0px_rgba(0,0,0,0.25)] backdrop-blur-[20px]">
      {/* Header */}
      <div className="mb-6 flex items-center gap-3.5">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-violet-500/20 bg-violet-500/10">
          <svg className="size-5 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="3" strokeWidth={2} />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2v2m0 16v2M2 12h2m16 0h2m-3.22-6.78-1.42 1.42M5.64 18.36l-1.42 1.42M18.36 18.36l-1.42-1.42M5.64 5.64 4.22 4.22" />
          </svg>
        </div>
        <div>
          <h3 className="text-lg font-bold text-white">Keyword &amp; Skill Optimization</h3>
          <p className="text-[13px] text-white/50">Industry-standard requirements for your target role level</p>
        </div>
      </div>

      {/* Skills grid - each item shows skill name, status badge, and recommendation */}
      <div className="grid grid-cols-2 gap-3">
        {skillGaps.map((item) => (
          <div
            key={item.skill}
            className={`flex flex-col gap-2 rounded-xl border p-4 ${
              item.missing
                ? 'border-amber-500/20 bg-amber-500/[0.06]'
                : 'border-emerald-500/20 bg-emerald-500/[0.06]'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-white">{item.skill}</span>
              {/* Badge indicates whether the skill is missing (optional) or present (required) */}
              {item.missing ? (
                <span className="rounded bg-amber-500/15 px-2 py-0.5 text-xs font-bold tracking-wide text-amber-400">
                  OPTIONAL
                </span>
              ) : (
                <span className="rounded bg-emerald-500/15 px-2 py-0.5 text-xs font-bold tracking-wide text-emerald-400">
                  REQUIRED
                </span>
              )}
            </div>
            <p className="text-sm leading-snug text-white/50">{item.recommendation}</p>
          </div>
        ))}
      </div>
    </div>
  );
}