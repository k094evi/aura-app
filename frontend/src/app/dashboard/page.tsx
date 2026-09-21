// src/app/dashboard/page.tsx

'use client';

import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Info, TrendingUp } from 'lucide-react';

import type { AnalysisResult, TopJob } from '@/types/analysis';
import {
  AnalysisLoadingOverlay,
  AssessmentSidebar,
  CertificationRecommendations,
  CompanyMatchCarousel,
  DashboardHeader,
  FormattingReadability,
  JobListings,
  KeyStrengths,
  KeywordSkillOptimization,
  SmartSuggestions,
  Upload,
  type UploadPayload,
} from '@/features/dashboard/components';

// Keeps the last analysis across a page refresh (cleared when the tab closes).
// Bumped to v2: the stored value is now the API shape (AnalysisResult), not the old card props.
const STORAGE_KEY = 'aura:last-analysis:v2';

const normalizeName = (s: string) => s.trim().toLowerCase();

// Only http(s) links are kept (URLs come from an external API and end up in href)
const safeUrl = (url: unknown): string | undefined =>
  typeof url === 'string' && /^https?:\/\//i.test(url) ? url : undefined;

// The best-scoring job at a company, used when the API doesn't send `top_job_url` itself
function findTopJobUrl(company: string, jobs: TopJob[]): string | undefined {
  const name = normalizeName(company);
  if (!name) return undefined;

  const best = jobs
    .filter((job) => safeUrl(job.url) && normalizeName(job.company ?? '').includes(name))
    .sort((a, b) => (b.total_score ?? 0) - (a.total_score ?? 0))[0];

  return best?.url;
}

// Maps the backend response to AnalysisResult (the shape DashboardHeader / Export PDF also use).
// Accepts the alternative key names the page used before, so an older cached result still loads.
// Adjust the keys here if your FastAPI response names them differently.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function toResult(raw: Record<string, any>): AnalysisResult {
  const topJobs: TopJob[] = raw.top_jobs ?? [];

  return {
    keywords: raw.keywords ?? [],
    total_jobs: raw.total_jobs ?? topJobs.length,
    top_jobs: topJobs,
    // Each company gets its job link: from the API if present, otherwise from top_jobs
    companies: (raw.companies ?? []).map((c: AnalysisResult['companies'][number]) => ({
      ...c,
      top_job_url: safeUrl(c.top_job_url) ?? findTopJobUrl(c.company, topJobs),
    })),
    ats_score: Math.round(raw.ats_score ?? raw.score ?? 0),
    sections: raw.sections ?? raw.dimensions ?? [],
    strengths: raw.strengths ?? [],
    improvements: raw.improvements ?? raw.suggestions ?? [],
    skill_gaps: raw.skill_gaps ?? raw.skillGaps ?? [],
    grammar_issues: raw.grammar_issues ?? raw.grammarIssues ?? [],
    certifications: raw.certifications ?? [],
  };
}

async function analyzeResume({ file, jobTitle, companies }: UploadPayload): Promise<AnalysisResult> {
  const body = new FormData();
  body.append('file', file);
  body.append('job_title', jobTitle);
  body.append('target_companies', companies);

  // Use the same field names and Authorization header as the fetch in your current
  // loading page — this goes through the Next.js proxy at app/api/analyze/route.ts.
  const res = await fetch('/api/analyze', { method: 'POST', body });

  if (!res.ok) {
    const err = await res.json().catch(() => null);
    throw new Error(err?.detail ?? "We couldn't analyze that resume. Please try again.");
  }
  return toResult(await res.json());
}

// One summary tile in the stats row ("Resumes Uploaded", "Jobs Targeted", "Match Score")
function StatCard({ label, value, hint }: { label: string; value: string | number; hint: string }) {
  return (
    <div className="flex flex-col gap-3 rounded-[20px] border-[1.5px] border-white bg-white/[0.72] p-5 shadow-[0_10px_30px_rgba(17,24,39,0.03)] backdrop-blur-[12px]">
      <p className="text-[13px] font-medium text-[#4b5563]">{label}</p>
      <div className="flex items-end justify-between gap-3">
        <p className="text-[32px] font-extrabold leading-none text-[#111827]">{value}</p>
        <span className="flex items-center gap-1 rounded-full bg-[#10b981]/10 px-2 py-1 text-[10px] font-bold text-[#10b981]">
          <TrendingUp className="size-3" />
          {hint}
        </span>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Restore the last analysis after a refresh
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem(STORAGE_KEY);
      if (saved) setResult(toResult(JSON.parse(saved)));
    } catch {
      // Storage unavailable or corrupted: start from the empty state.
    }
  }, []);

  const handleAnalyze = async (payload: UploadPayload) => {
    setIsAnalyzing(true);
    setError(null);
    try {
      const next = await analyzeResume(payload);
      setResult(next);
      try {
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        // Not being able to persist is fine; the results still show.
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const hasResult = result !== null;
  const topMatch =
    result && result.companies.length > 0
      ? Math.max(...result.companies.map((c) => c.match))
      : null;

  return (
    // A <div>, not <main>: ConditionalLayout already wraps every page in <main>
    <div className="relative min-h-screen w-full overflow-hidden bg-[#f4f2fb]">
      {/* Ambient background orbs */}
      <div className="pointer-events-none absolute -left-24 top-10 size-[480px] rounded-full bg-violet-300/40 blur-[110px]" />
      <div className="pointer-events-none absolute -right-24 top-40 size-[420px] rounded-full bg-cyan-200/50 blur-[110px]" />
      <div className="pointer-events-none absolute left-1/3 top-[520px] size-[400px] rounded-full bg-pink-200/40 blur-[110px]" />

      {/* Top padding leaves room for the fixed Navbar */}
      <div className="relative z-10 mx-auto flex w-full max-w-[1200px] flex-col gap-6 px-4 pb-16 pt-28 sm:px-6">
        {/* Header: greeting from the stored user + working Export PDF */}
        <DashboardHeader result={result} />

        {/* Upload card + assessment sidebar */}
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.9fr)_minmax(0,1fr)]">
          <Upload onAnalyze={handleAnalyze} isAnalyzing={isAnalyzing} error={error} />
          <AssessmentSidebar score={result?.ats_score ?? null} sections={result?.sections} />
        </div>

        {/* Summary stats */}
        <div className="grid gap-4 sm:grid-cols-3">
          <StatCard
            label="Resumes Uploaded"
            value={hasResult ? 1 : 0}
            hint={hasResult ? 'Analyzed' : 'Upload to begin'}
          />
          <StatCard
            label="Jobs Targeted"
            value={result ? result.companies.length : 0}
            hint={result && result.companies.length > 0 ? 'Companies matched' : 'No targets yet'}
          />
          <StatCard
            label="Match Score"
            value={topMatch !== null ? `${topMatch}%` : '-'}
            hint={topMatch !== null ? 'Top company fit' : 'No score yet'}
          />
        </div>

        {/* Results appear only after a resume has been analyzed */}
        {result ? (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col gap-6"
          >
            <div className="grid gap-6 md:grid-cols-2">
              <KeyStrengths strengths={result.strengths} />
              <SmartSuggestions improvements={result.improvements} />
            </div>
            <KeywordSkillOptimization skillGaps={result.skill_gaps} />
            <CertificationRecommendations certifications={result.certifications ?? []} />
            <FormattingReadability grammarIssues={result.grammar_issues} />
            <CompanyMatchCarousel companies={result.companies} />
            <JobListings
              jobs={result.top_jobs}
              totalJobs={result.total_jobs}
              keywords={result.keywords}
            />
          </motion.div>
        ) : (
          <div className="flex items-start gap-3 rounded-[16px] border-[1.5px] border-white bg-white/[0.72] px-5 py-4 backdrop-blur-[12px]">
            <span className="mt-[1px] flex size-6 shrink-0 items-center justify-center rounded-full bg-[#7c3aed]/[0.08]">
              <Info className="size-3.5 text-[#9ca3af]" />
            </span>
            <div className="flex flex-col gap-[2px]">
              <p className="text-[13px] font-bold text-[#111827]">No data available yet</p>
              <p className="text-[12px] text-[#9ca3af]">
                Upload your first resume to generate scores, insights, and personalized
                recommendations.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Full-screen loading state while the request is running */}
      {isAnalyzing && <AnalysisLoadingOverlay />}
    </div>
  );
}