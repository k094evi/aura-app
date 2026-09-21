'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Briefcase, Lightbulb, TrendingUp, type LucideIcon } from 'lucide-react';

import DashboardHeader from '@/components/DashboardHeader';
import Upload from '@/features/dashboard/components/upload';
import AssessmentSidebar from '@/features/dashboard/components/AssessmentSidebar';
import CompanyMatchCarousel from '@/features/dashboard/components/CompanyMatchCarousel';
import KeyStrengths from '@/features/dashboard/components/KeyStrengths';
import SmartSuggestions from '@/features/dashboard/components/SmartSuggestions';
import KeywordSkillOptimization from '@/features/dashboard/components/KeywordSkillOptimization';
import CertificationRecommendations, {
  type Certification,
} from '@/features/dashboard/components/CertificationRecommendations';
import FormattingReadability from '@/features/dashboard/components/FormattingReadability';
import type { AnalysisResult } from '@/types/analysis';

const VIOLET_TONE = 'border-[#8b5cf6]/20 bg-[#8b5cf6]/10 text-[#8b5cf6]';
const AMBER_TONE = 'border-[#f59e0b]/20 bg-[#f59e0b]/10 text-[#f59e0b]';

// Shared decorative background (orbs, dot grid, accent line, rings) from the Figma frame.
function Background() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute -left-[220px] -top-[220px] size-[940px] rounded-full bg-[radial-gradient(circle,rgba(167,139,250,0.38)_0%,rgba(167,139,250,0.16)_38%,rgba(167,139,250,0)_70%)]" />
      <div className="absolute -right-[220px] top-[120px] size-[800px] rounded-full bg-[radial-gradient(circle,rgba(34,211,238,0.30)_0%,rgba(34,211,238,0.12)_40%,rgba(34,211,238,0)_70%)]" />
      <div className="absolute left-[calc(50%-250px)] top-[700px] size-[620px] rounded-full bg-[radial-gradient(circle,rgba(251,113,133,0.18)_0%,rgba(251,113,133,0.06)_40%,rgba(251,113,133,0)_70%)]" />

      {/* Dot grid */}
      <div className="absolute left-0 top-0 h-[960px] w-full opacity-[0.06] [background-image:radial-gradient(circle,#7c3aed_1px,transparent_1px)] [background-size:24px_24px]" />

      {/* Top accent line */}
      <div className="absolute left-0 top-0 h-[3px] w-full bg-[linear-gradient(90deg,#8b5cf6_0%,#06b6d4_50%,rgba(139,92,246,0)_100%)]" />

      {/* Decorative rings, top right */}
      <div className="absolute -right-[120px] -top-[120px] size-[340px] rounded-full border border-[#8b5cf6]/20" />
      <div className="absolute -right-[80px] -top-[80px] size-[260px] rounded-full border border-[#8b5cf6]/20" />
    </div>
  );
}

function SectionHeader({
  icon: Icon,
  tone,
  title,
  subtitle,
}: {
  icon: LucideIcon;
  tone: string;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="flex items-center gap-[14px]">
      <div className={`flex shrink-0 items-center justify-center rounded-[12px] border p-[10px] ${tone}`}>
        <Icon className="size-5" />
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <h2 className="text-[18px] font-bold leading-tight text-[#111827]">{title}</h2>
        <p className="text-[13px] text-[#4b5563]">{subtitle}</p>
      </div>
    </div>
  );
}

// Stat card from the Figma stats row: label, big value, and an optional
// green trend badge (icon + short text) aligned to the right of the value.
function StatCard({
  label,
  value,
  badge,
}: {
  label: string;
  value: string | number;
  badge?: string;
}) {
  return (
    <div className="flex flex-col gap-3 rounded-[20px] border-[1.5px] border-white bg-white/[0.72] p-6 shadow-[0_10px_30px_rgba(17,24,39,0.03)] backdrop-blur-[12px]">
      <p className="text-[14px] font-semibold text-[#4b5563]">{label}</p>

      <div className="flex items-baseline justify-between gap-3">
        <p className="text-[36px] font-extrabold leading-none text-[#111827]">{value}</p>

        {badge && (
          <span className="flex shrink-0 items-center gap-1 rounded-full bg-[#ecfdf5] px-2 py-1">
            <TrendingUp className="size-3 text-[#10b981]" strokeWidth={2.5} />
            <span className="whitespace-nowrap text-[12px] font-bold text-[#10b981]">{badge}</span>
          </span>
        )}
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [notFound, setNotFound] = useState(false);
  const loaded = useRef(false);
  const router = useRouter();

  // Called by the Upload Resume card when a valid file is chosen and the user
  // presses "Upload & Analyze". For now this hands off to the existing /upload
  // flow (the same behavior the old card had). This is the single place to
  // replace with the real analysis request once it's wired here.
  const handleAnalyze = () => {
    router.push('/upload');
  };

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
      <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#f0eeff] px-4">
        <Background />
        <div className="relative z-10 w-full max-w-md rounded-[24px] border-[1.5px] border-white bg-white/[0.72] p-8 text-center shadow-[0_10px_30px_rgba(17,24,39,0.03)] backdrop-blur-[12px]">
          <p className="mb-5 text-lg font-semibold text-[#4b5563]">No analysis found.</p>
          <Link
            href="/upload"
            className="inline-flex rounded-full bg-gradient-to-r from-[#7c3aed] via-[#a78bfa] via-[60%] to-[#06b6d4] px-8 py-[14px] text-[15px] font-bold text-white shadow-[0_8px_12px_rgba(124,58,237,0.2)] transition-opacity hover:opacity-90"
          >
            Upload a Resume
          </Link>
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#f0eeff]">
        <Background />
        <p className="relative z-10 text-sm font-medium text-[#9ca3af]">Loading analysis…</p>
      </div>
    );
  }

  // Certification recommendations. `certifications` isn't part of the
  // AnalysisResult type yet, so it's read defensively: until the analysis
  // response includes it, the card just shows its empty state.
  const certifications =
    (result as AnalysisResult & { certifications?: Certification[] }).certifications ?? [];

  // ── Stats row values ──
  // Resumes Uploaded: needs the user's upload history, which this page doesn't
  // have yet (it only receives the one-time analysis result). Shows "—" until
  // it's wired to the history data.
  const resumesUploaded: number | null = null;

  // Match Score: average score of the top job matches.
  const jobScores = result.top_jobs
    .map((job) => Number(job.total_score))
    .filter((n) => Number.isFinite(n));
  const matchScore =
    jobScores.length > 0
      ? `${Math.round(jobScores.reduce((sum, n) => sum + n, 0) / jobScores.length)}%`
      : '—';

  return (
    <div className="relative min-h-screen w-full overflow-x-clip bg-[#f0eeff]">
      <Background />

      {/* Top padding leaves room for the fixed site navbar (rendered by the layout) */}
      <div className="relative z-10 mx-auto flex w-full max-w-[1440px] flex-col gap-8 px-6 pb-16 pt-[120px] sm:px-10 lg:px-20">
        {/* ───────────── Welcome row + keyword chips ───────────── */}
        <div className="flex flex-col gap-4">
          <DashboardHeader result={result} />

          {result.keywords.length > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              {result.keywords.map((kw) => (
                <span
                  key={kw}
                  className="rounded-full border border-[#7c3aed]/20 bg-[#7c3aed]/[0.08] px-3 py-1 text-xs font-bold text-[#7c3aed]"
                >
                  {kw}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* ───────────── Upload card + assessment sidebar ───────────── */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_420px]">
          <Upload onAnalyze={handleAnalyze} />

          <div className="w-full min-w-0">
            <AssessmentSidebar score={result.ats_score} sections={result.sections} />
          </div>
        </div>

        {/* ───────────── Stats row ───────────── */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <StatCard label="Resumes Uploaded" value={resumesUploaded ?? '—'} />
          <StatCard
            label="Jobs Targeted"
            value={result.total_jobs}
            badge={`${result.top_jobs.length} top matches`}
          />
          <StatCard label="Match Score" value={matchScore} />
        </div>

        {/* ───────────── Analysis results ───────────── */}
        <div className="flex flex-col gap-6">
          <KeywordSkillOptimization skillGaps={result.skill_gaps} />

          <CertificationRecommendations certifications={certifications} />

          <CompanyMatchCarousel companies={result.companies} />

          <FormattingReadability grammarIssues={result.grammar_issues} />

          {/* Insights & Recommendations */}
          <section className="flex flex-col gap-6 rounded-[24px] border-[1.5px] border-white bg-white/[0.72] p-8 shadow-[0_10px_30px_rgba(17,24,39,0.03)] backdrop-blur-[12px]">
            <SectionHeader
              icon={Lightbulb}
              tone={AMBER_TONE}
              title="Insights & Recommendations"
              subtitle="AI-powered analysis of your resume strengths and areas for improvement"
            />
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <KeyStrengths strengths={result.strengths} />
              <SmartSuggestions improvements={result.improvements} />
            </div>
          </section>

          {/* Top Job Matches: real job data, styled like the other Figma cards */}
          <section className="flex flex-col gap-6 rounded-[24px] border-[1.5px] border-white bg-white/[0.72] p-8 shadow-[0_10px_30px_rgba(17,24,39,0.03)] backdrop-blur-[12px]">
            <SectionHeader
              icon={Briefcase}
              tone={VIOLET_TONE}
              title="Top Job Matches"
              subtitle="Roles with the strongest match to your resume"
            />

            <div className="flex flex-col gap-3">
              {result.top_jobs.map((job, i) => (
                <a
                  key={`${job.title}-${job.company}-${i}`}
                  href={job.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block rounded-[16px] border-[1.5px] border-white bg-white/[0.72] p-4 shadow-[0_10px_30px_rgba(17,24,39,0.03)] transition-all hover:border-[#8b5cf6]/30 hover:bg-white"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[15px] font-bold text-[#111827] group-hover:text-[#7c3aed]">
                        {job.title}
                      </p>
                      <p className="mt-1 text-[13px] text-[#4b5563]">
                        {job.company} · {job.location}
                      </p>
                      <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-[#9ca3af]">
                        {job.description}
                      </p>

                      {job.matched_skills.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1">
                          {job.matched_skills.slice(0, 4).map((skill, skillIndex) => (
                            <span
                              key={`${skill}-${skillIndex}`}
                              className="rounded-md border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-600"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="shrink-0 text-right">
                      <span className="bg-gradient-to-r from-[#8b5cf6] to-[#06b6d4] bg-clip-text text-lg font-black text-transparent">
                        {job.total_score}
                      </span>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-[#9ca3af]">
                        Score
                      </p>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}