// features/dashboard/components/KeywordSkillOptimization.tsx
type SkillEntry = {
  skill: string;
  present: boolean;
  importance: 'required' | 'optional';
};

type KeywordSkillOptimizationProps = {
  skills: SkillEntry[];
};

export default function KeywordSkillOptimization({ skills }: KeywordSkillOptimizationProps) {
  const missingSkills = skills.filter((item) => !item.present);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center">
          <svg className="w-6 h-6 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="3" strokeWidth={2} />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2v2m0 16v2M2 12h2m16 0h2m-3.22-6.78-1.42 1.42M5.64 18.36l-1.42 1.42M18.36 18.36l-1.42-1.42M5.64 5.64 4.22 4.22" />
          </svg>
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-900">Keyword & Skill Optimization</h3>
          <p className="text-sm text-gray-400">Industry-standard requirements for your target role level</p>
        </div>
      </div>

      {missingSkills.length === 0 ? (
        <p className="text-sm text-gray-500">You have not missed any key skills for this role yet.</p>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {missingSkills.map((item) => (
            <div
              key={item.skill}
              className="rounded-xl p-4 flex flex-col gap-2 border bg-orange-50 border-orange-100"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-gray-900 capitalize">{item.skill}</span>
                <span
                  className={`text-xs font-bold px-2 py-0.5 rounded tracking-wide ${
                    item.importance === 'required'
                      ? 'bg-indigo-100 text-indigo-600'
                      : 'bg-gray-100 text-gray-500'
                  }`}
                >
                  {item.importance.toUpperCase()}
                </span>
              </div>
              <p className="text-sm text-gray-400 leading-snug">Consider adding this to your resume</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}