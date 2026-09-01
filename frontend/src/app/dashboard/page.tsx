'use client';

import { useEffect, useRef, useState } from 'react';

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
    // Guard against React Strict Mode double-invocation.
    if (loaded.current) return;
    loaded.current = true;

    const raw = sessionStorage.getItem('aura_result');
    if (!raw) {
      setNotFound(true);
      return;
    }

    try {
      const parsed = JSON.parse(raw) as AnalysisResult;
      setResult(parsed);

      // Keep src 1 behavior: consume the one-time analysis result only
      // after a successful parse.
      sessionStorage.removeItem('aura_result');
    } catch {
      setNotFound(true);
    }
  }, []);

  if (notFound) {
    return (
      <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#0c0a14] px-4">
        <div className="pointer-events-none absolute -left-32 top-20 size-[420px] rounded-full bg-fuchsia-600/20 blur-[120px]" />
        <div className="pointer-events-none absolute -right-32 bottom-10 size-[420px] rounded-full bg-violet-600/20 blur-[120px]" />

        <div className="relative z-10 w-full max-w-md rounded-3xl border border-white/[0.07] bg-[#151221]/80 p-8 text-center shadow-[0px_16px_32px_0px_rgba(0,0,0,0.3)] backdrop-blur-[20px]">
          <p className="mb-5 text-lg font-semibold text-white/70">No analysis found.</p>
          <a
            href="/upload"
            className="inline-flex rounded-xl bg-gradient-to-r from-fuchsia-500 to-violet-600 px-6 py-3 font-bold text-white shadow-lg shadow-fuchsia-500/20 transition hover:brightness-110"
          >
            Upload a Resume
          </a>
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#0c0a14]">
        <div className="pointer-events-none absolute left-1/2 top-1/3 size-[420px] -translate-x-1/2 rounded-full bg-fuchsia-600/15 blur-[120px]" />
        <p className="relative z-10 text-sm font-medium text-white/40">Loading analysis…</p>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#0c0a14] px-4 pb-20 pt-20">
      {/* Ambient background orbs from src 2's visual language. */}
      <div className="pointer-events-none absolute -left-[100px] top-[150px] size-[500px] rounded-full bg-fuchsia-600/30 blur-[110px]" />
      <div className="pointer-events-none absolute -right-[150px] top-[100px] size-[550px] rounded-full bg-violet-600/25 blur-[120px]" />
      <div className="pointer-events-none absolute left-[35%] top-[550px] size-[450px] rounded-full bg-cyan-500/20 blur-[110px]" />
      <div className="pointer-events-none absolute -right-[120px] top-[1000px] size-[500px] rounded-full bg-fuchsia-600/20 blur-[120px]" />
      <div className="pointer-events-none absolute -left-[120px] top-[1500px] size-[480px] rounded-full bg-violet-600/20 blur-[115px]" />

      <div className="relative z-10 mx-auto max-w-7xl">
        <DashboardHeader result={result} />

        {/* Analysis context / keyword strip from src 1, restyled for src 2. */}
        <div className="mb-6 flex flex-wrap items-center gap-2">
          {result.keywords.map((kw) => (
            <span
              key={kw}
              className="rounded-full border border-fuchsia-500/20 bg-fuchsia-500/10 px-3 py-1 text-xs font-bold text-fuchsia-300"
            >
              {kw}
            </span>
          ))}
          <span className="rounded-full border border-white/[0.07] bg-white/[0.03] px-3 py-1 text-xs font-bold text-white/40">
            {result.total_jobs} jobs found
          </span>
        </div>

        <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
          {/* Left sidebar */}
          <div className="w-full shrink-0 lg:w-72">
            <AssessmentSidebar
              score={result.ats_score}
              sections={result.sections}
            />
          </div>

          {/* Main dashboard content */}
          <div className="min-w-0 flex-1 space-y-4">
            <KeywordSkillOptimization skillGaps={result.skill_gaps} />

            <CompanyMatchCarousel companies={result.companies} />

            <FormattingReadability grammarIssues={result.grammar_issues} />

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <KeyStrengths strengths={result.strengths} />
              <SmartSuggestions improvements={result.improvements} />
            </div>

            {/* Keep src 1's real top-job data/functionality, but use src 2's card styling. */}
            <div className="rounded-3xl border border-white/[0.07] bg-[#151221]/70 p-6 shadow-[0px_16px_32px_0px_rgba(0,0,0,0.25)] backdrop-blur-[20px]">
              <div className="mb-5 flex items-end justify-between gap-4">
                <div>
                  <h2 className="text-lg font-bold text-white">Top Job Matches</h2>
                  <p className="mt-1 text-[13px] text-white/40">
                    Roles with the strongest match to your resume
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {result.top_jobs.map((job, i) => (
                  <a
                    key={`${job.title}-${job.company}-${i}`}
                    href={job.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group block rounded-2xl border border-white/[0.06] bg-white/[0.025] p-4 transition-all hover:border-fuchsia-500/20 hover:bg-fuchsia-500/[0.05]"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-bold text-white group-hover:text-fuchsia-200">
                          {job.title}
                        </p>
                        <p className="mt-1 text-sm text-white/50">
                          {job.company} · {job.location}
                        </p>
                        <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-white/35">
                          {job.description}
                        </p>

                        {job.matched_skills.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-1">
                            {job.matched_skills.slice(0, 4).map((skill) => (
                              <span
                                key={skill}
                                className="rounded-md border border-emerald-500/15 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-300"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="shrink-0 text-right">
                        <span className="bg-gradient-to-r from-fuchsia-400 to-violet-400 bg-clip-text text-lg font-black text-transparent">
                          {job.total_score}
                        </span>
                        <p className="text-[10px] font-bold uppercase tracking-wider text-white/30">
                          Score
                        </p>
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
