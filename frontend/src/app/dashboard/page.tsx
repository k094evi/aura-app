'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

import DashboardHeader from '@/components/DashboardHeader';
import AssessmentSidebar from '@/components/AssessmentSidebar';
import CompanyMatchCarousel from '@/components/CompanyMatchCarousel';
import KeyStrengths from '@/components/KeyStrengths';
import SmartSuggestions from '@/components/SmartSuggestions';
import KeywordSkillOptimization from '@/components/KeywordSkillOptimization';
import FormattingReadability from '@/components/FormattingReadability';
import type { AnalysisResult } from '@/types/analysis';

export default function DashboardPage() {
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [notFound, setNotFound] = useState(false);
  const loaded = useRef(false);

  useEffect(() => {
    // Guard against React Strict Mode double-invocation
    if (loaded.current) return;
    loaded.current = true;

    const raw = sessionStorage.getItem('aura_result');
    if (!raw) {
      setNotFound(true);
      return;
    }
    try {
      const parsed = JSON.parse(raw);
      setResult(parsed);
      // Clear only after a successful parse so Strict Mode's second
      // run doesn't see missing data and trigger a redirect loop
      sessionStorage.removeItem('aura_result');
    } catch {
      setNotFound(true);
    }
  }, []);

  // No redirect — just show a friendly message with a link back
  if (notFound) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-gray-500 text-lg">No analysis found.</p>
        <a href="/upload" className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors">
          Upload a Resume
        </a>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-400">Loading analysis…</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 pt-24">
      <DashboardHeader result={result} />

      <div className="flex flex-wrap gap-2 mb-8">
        {result.keywords.map((kw) => (
          <span key={kw} className="px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-bold rounded-full border border-indigo-100">
            {kw}
          </span>
        ))}
        <span className="px-3 py-1 bg-gray-50 text-gray-400 text-xs font-bold rounded-full border border-gray-100">
          {result.total_jobs} jobs found
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <AssessmentSidebar score={result.ats_score} sections={result.sections} />

        <div className="lg:col-span-2 space-y-6">
          <CompanyMatchCarousel companies={result.companies} />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <KeyStrengths strengths={result.strengths} />
            <SmartSuggestions improvements={result.improvements} />
          </div>

          <KeywordSkillOptimization skillGaps={result.skill_gaps} />
          <FormattingReadability grammarIssues={result.grammar_issues} />

          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Top Job Matches</h2>
            <div className="space-y-3">
              {result.top_jobs.map((job, i) => (
                <a
                  key={i}
                  href={job.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block p-4 rounded-2xl border border-gray-100 hover:border-indigo-200 hover:bg-indigo-50/30 transition-all"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-gray-900 truncate">{job.title}</p>
                      <p className="text-sm text-gray-500">{job.company} · {job.location}</p>
                      <p className="text-xs text-gray-400 mt-1 line-clamp-2">{job.description}</p>
                      {job.matched_skills.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {job.matched_skills.slice(0, 4).map((s) => (
                            <span key={s} className="px-2 py-0.5 bg-green-50 text-green-700 text-[10px] font-bold rounded-md">{s}</span>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="shrink-0 text-right">
                      <span className="text-lg font-black text-indigo-600">{job.total_score}</span>
                      <p className="text-[10px] text-gray-400 font-bold uppercase">Score</p>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}