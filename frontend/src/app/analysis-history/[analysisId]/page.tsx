'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  ArrowLeft,
  Check,
  Download,
  FileText,
  Lightbulb,
  Loader2,
  ShieldCheck,
  Sparkles,
  Target,
  TriangleAlert,
} from 'lucide-react';

import type { AnalysisResult } from '@/types/analysis';
import { toResult } from '@/lib/analysisResult';
import { getStoredUser } from '@/lib/auth';
import { generateReportPDF } from '@/lib/exportReport';

type SavedAnalysis = AnalysisResult & {
  id?: string;
  filename?: string;
  created_at?: string;
  target_job?: string;
  target_companies?: unknown[];
};

type AnyRecord = Record<string, any>;

function isRecord(value: unknown): value is AnyRecord {
  return typeof value === 'object' && value !== null;
}

function textValue(value: unknown): string {
  if (typeof value === 'string') return value;

  if (typeof value === 'number') return String(value);

  if (isRecord(value)) {
    return String(
      value.description ??
        value.text ??
        value.message ??
        value.name ??
        value.title ??
        value.skill ??
        ''
    );
  }

  return '';
}

function getName(value: unknown): string {
  if (typeof value === 'string') return value;

  if (isRecord(value)) {
    return String(
      value.name ??
        value.company_name ??
        value.company ??
        value.title ??
        value.full_name ??
        ''
    );
  }

  return '';
}

function getDescription(value: unknown): string {
  if (typeof value === 'string') return value;

  if (isRecord(value)) {
    return String(
      value.description ??
        value.reason ??
        value.details ??
        value.message ??
        value.text ??
        ''
    );
  }

  return '';
}

function getScore(value: unknown): number | null {
  if (!isRecord(value)) return null;

  const possible = [
    value.score,
    value.match_score,
    value.match,
    value.percentage,
  ];

  for (const item of possible) {
    const parsed = Number(item);

    if (Number.isFinite(parsed)) {
      return Math.max(0, Math.min(100, parsed));
    }
  }

  return null;
}

function formatDate(value?: string) {
  if (!value) return 'Analysis date unavailable';

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return 'Analysis date unavailable';
  }

  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

function getStatus(score: number) {
  if (score >= 85) {
    return {
      label: 'Optimized',
      className: 'bg-emerald-50 text-emerald-500',
    };
  }

  if (score >= 70) {
    return {
      label: 'Good',
      className: 'bg-cyan-50 text-cyan-600',
    };
  }

  if (score >= 50) {
    return {
      label: 'Needs improvement',
      className: 'bg-amber-100 text-amber-600',
    };
  }

  return {
    label: 'Needs work',
    className: 'bg-red-100 text-red-600',
  };
}

function getScoreDescription(score: number, targetJob: string) {
  if (score >= 85) {
    return `This resume has strong ATS compatibility for the selected ${targetJob} role.`;
  }

  if (score >= 70) {
    return `This resume has good ATS compatibility for the selected ${targetJob} role, with some areas that can still be improved.`;
  }

  if (score >= 50) {
    return `This resume has moderate ATS compatibility for ${targetJob}. Review the identified gaps and recommendations.`;
  }

  return `This resume has several areas that can be improved for the selected ${targetJob} role.`;
}

function normalizeSkillList(value: unknown): string[] {
  if (!Array.isArray(value)) return [];

  return value
    .map((item) => {
      if (typeof item === 'string') return item;

      if (isRecord(item)) {
        return String(
          item.skill ??
            item.name ??
            item.title ??
            item.keyword ??
            item.text ??
            ''
        );
      }

      return '';
    })
    .map((item) => item.trim())
    .filter(Boolean);
}

function getSkillData(result: AnyRecord) {
  const raw = result.skill_gaps;

  const matched: string[] = [];
  const required: string[] = [];
  const optional: string[] = [];

  if (isRecord(raw)) {
    matched.push(
      ...normalizeSkillList(
        raw.matched_skills ??
          raw.matched ??
          raw.present ??
          raw.existing_skills
      )
    );

    required.push(
      ...normalizeSkillList(
        raw.missing_required_skills ??
          raw.required ??
          raw.missing_required
      )
    );

    optional.push(
      ...normalizeSkillList(
        raw.missing_optional_skills ??
          raw.optional ??
          raw.missing_optional
      )
    );
  }

  if (Array.isArray(raw)) {
    raw.forEach((item) => {
      if (typeof item === 'string') {
        required.push(item);
        return;
      }

      if (!isRecord(item)) return;

      const name = String(
        item.skill ?? item.name ?? item.title ?? item.keyword ?? ''
      ).trim();

      if (!name) return;

      const missing =
        item.missing === true ||
        item.status === 'missing' ||
        item.status === 'gap';

      const isOptional =
        item.required === false ||
        item.type === 'optional' ||
        item.category === 'optional';

      if (missing) {
        if (isOptional) {
          optional.push(name);
        } else {
          required.push(name);
        }
      } else {
        matched.push(name);
      }
    });
  }

  return {
    matched: [...new Set(matched)],
    required: [...new Set(required)],
    optional: [...new Set(optional)],
  };
}

function normalizeList(value: unknown): string[] {
  if (!Array.isArray(value)) return [];

  return value
    .map((item) => textValue(item).trim())
    .filter(Boolean);
}

function normalizeCompanies(value: unknown): AnyRecord[] {
  if (!Array.isArray(value)) return [];

  return value.filter(isRecord);
}

function normalizeCertifications(value: unknown): AnyRecord[] {
  if (!Array.isArray(value)) return [];

  return value.filter(isRecord);
}

function normalizeJobs(value: unknown): AnyRecord[] {
  if (!Array.isArray(value)) return [];

  return value.filter(isRecord);
}

export default function AnalysisHistoryDetailPage() {
  const params = useParams<{ analysisId: string }>();

  const analysisId = params?.analysisId;

  const [analysis, setAnalysis] = useState<SavedAnalysis | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isExporting, setIsExporting] = useState(false);
  const [firstName, setFirstName] = useState('');

  useEffect(() => {
    const storedUser = getStoredUser();

    if (storedUser?.full_name) {
      setFirstName(storedUser.full_name.trim().split(' ')[0] ?? '');
    }
  }, []);

  useEffect(() => {
    if (!analysisId) return;

    let cancelled = false;

    async function loadAnalysis() {
      setLoading(true);
      setError('');

      try {
        const response = await fetch(
          `/api/analysis-history/${encodeURIComponent(analysisId)}`,
          {
            method: 'GET',
            cache: 'no-store',
          }
        );

        if (!response.ok) {
          const body = await response.text();

          throw new Error(
            body || `Failed to load analysis (${response.status})`
          );
        }

        const raw = await response.json();

        /*
         * The history endpoint may return either:
         *
         * 1. the saved result directly
         * 2. a database row containing result_json
         *
         * This supports both formats.
         */
        let source: AnyRecord;

        if (
          isRecord(raw) &&
          isRecord(raw.result_json)
        ) {
          source = {
            ...raw.result_json,
            ...raw,
          };
        } else {
          source = raw;
        }

        const parsed = toResult(source) as SavedAnalysis;

        /*
         * Preserve metadata that may exist outside result_json.
         */
        parsed.id = String(source.id ?? analysisId);
        parsed.filename = String(
          source.filename ??
            source.resume_filename ??
            parsed.filename ??
            'Resume'
        );

        parsed.created_at = String(
          source.created_at ??
            source.analyzed_at ??
            parsed.created_at ??
            ''
        );

        parsed.target_job = String(
          source.target_job ??
            source.selected_job ??
            parsed.target_job ??
            ''
        );

        if (Array.isArray(source.target_companies)) {
          parsed.target_companies = source.target_companies;
        }

        if (!cancelled) {
          setAnalysis(parsed);
        }
      } catch (err) {
        console.error('Failed to load saved analysis:', err);

        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : 'Unable to load this saved analysis.'
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadAnalysis();

    return () => {
      cancelled = true;
    };
  }, [analysisId]);

  const handleExport = async () => {
    if (!analysis || isExporting) return;

    setIsExporting(true);

    try {
      await generateReportPDF(analysis, getStoredUser());
    } catch (err) {
      console.error('Failed to generate report PDF:', err);
    } finally {
      setIsExporting(false);
    }
  };

  const view = useMemo(() => {
    if (!analysis) return null;

    const result = analysis as AnyRecord;

    const atsScore = Math.max(
      0,
      Math.min(100, Number(result.ats_score ?? 0))
    );

    const targetJob =
      String(result.target_job ?? '').trim() || 'General Analysis';

    const filename =
      String(result.filename ?? '').trim() || 'Resume';

    const companies = normalizeCompanies(result.companies);

    const strengths = normalizeList(result.strengths);

    const improvements = normalizeList(result.improvements);

    const grammarIssues = Array.isArray(result.grammar_issues)
      ? result.grammar_issues
      : [];

    const certifications = normalizeCertifications(
      result.certifications
    );

    const topJobs = normalizeJobs(result.top_jobs);

    const keywords = normalizeSkillList(result.keywords);

    const skillData = getSkillData(result);

    const status = getStatus(atsScore);

    return {
      result,
      atsScore,
      targetJob,
      filename,
      companies,
      strengths,
      improvements,
      grammarIssues,
      certifications,
      topJobs,
      keywords,
      skillData,
      status,
    };
  }, [analysis]);

  if (loading) {
    return (
      <div className="min-h-screen bg-indigo-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="size-14 rounded-full bg-gradient-to-br from-violet-600 to-violet-400 flex items-center justify-center shadow-lg">
            <Loader2 className="size-7 text-white animate-spin" />
          </div>

          <p className="text-gray-600 text-sm font-semibold font-['DM_Sans']">
            Loading saved analysis...
          </p>
        </div>
      </div>
    );
  }

  if (error || !analysis || !view) {
    return (
      <div className="min-h-screen bg-indigo-50 flex items-center justify-center px-6">
        <div className="w-full max-w-lg p-8 bg-white/80 rounded-[20px] shadow-[0px_12px_34px_0px_rgba(17,24,39,0.04)] outline outline-[1.5px] outline-white backdrop-blur-md text-center">
          <div className="mx-auto mb-5 size-12 rounded-2xl bg-red-100 flex items-center justify-center">
            <TriangleAlert className="size-6 text-red-600" />
          </div>

          <h1 className="text-gray-900 text-xl font-extrabold font-['DM_Sans']">
            Unable to load this analysis
          </h1>

          <p className="mt-2 text-gray-600 text-sm font-['DM_Sans'] leading-6">
            {error || 'The saved analysis could not be found.'}
          </p>

          <Link
            href="/analysis-history"
            className="mt-6 inline-flex items-center gap-2 px-5 py-3 rounded-full bg-violet-500 text-white text-sm font-bold font-['DM_Sans'] hover:bg-violet-600 transition"
          >
            <ArrowLeft className="size-4" />
            Back to History
          </Link>
        </div>
      </div>
    );
  }

  const {
    result,
    atsScore,
    targetJob,
    filename,
    companies,
    strengths,
    improvements,
    grammarIssues,
    certifications,
    topJobs,
    keywords,
    skillData,
    status,
  } = view;

  const selectedCompanies = companies
    .map((company) => getName(company))
    .filter(Boolean);

  const displayedCompanies = selectedCompanies.slice(0, 3);
  const moreCompanies = Math.max(
    0,
    selectedCompanies.length - displayedCompanies.length
  );

  const totalSkills =
    skillData.matched.length +
    skillData.required.length +
    skillData.optional.length;

  const keywordCoverage =
    totalSkills > 0
      ? Math.round(
          (skillData.matched.length / totalSkills) * 100
        )
      : keywords.length > 0
        ? 100
        : 0;

  const dimensionItems = [
    {
      name: 'Formatting',
      score: atsScore,
    },
    {
      name: 'Keywords',
      score: keywordCoverage,
    },
    {
      name: 'Quantification',
      score: undefined,
    },
    {
      name: 'Impact',
      score: undefined,
    },
    {
      name: 'Readability',
      score: undefined,
    },
  ];

  return (
    <div className="min-h-screen relative bg-indigo-50 overflow-hidden">
      {/* Background decorations */}
      <div className="size-[660px] left-[-80px] top-[-90px] fixed opacity-60 bg-violet-300 rounded-full blur-[82.5px] pointer-events-none" />

      <div className="size-[560px] right-[-100px] top-[260px] fixed opacity-50 bg-cyan-200 rounded-full blur-3xl pointer-events-none" />

      <div className="size-[480px] left-[520px] top-[1160px] fixed opacity-25 bg-red-300 rounded-full blur-[80px] pointer-events-none" />

      <div className="size-[520px] right-[-80px] top-[1850px] fixed opacity-30 bg-cyan-200 rounded-full blur-[85px] pointer-events-none" />

      {/* Top gradient */}
      <div className="h-[3px] bg-gradient-to-r from-violet-600 via-cyan-500 to-violet-500/0" />

      <main className="relative z-10 w-full max-w-[1440px] mx-auto px-6 lg:px-20 pt-5 pb-14">
        {/* ========================= */}
        {/* NAVIGATION */}
        {/* ========================= */}

        <div className="h-16 pl-6 pr-3.5 py-3.5 bg-white/80 rounded-[999px] shadow-[0px_8px_32px_0px_rgba(31,41,55,0.06)] outline outline-1 outline-offset-[-1px] outline-white backdrop-blur-[10px] flex justify-between items-center overflow-hidden">
          <div className="flex items-center gap-2.5">
            <div className="size-7 relative flex justify-center items-center overflow-hidden">
              <div className="size-7 absolute bg-gradient-to-br from-violet-600 to-violet-400 rounded-full" />
              <div className="size-3.5 bg-white/40 rounded-full relative" />
            </div>

            <div className="text-gray-900 text-xl font-bold font-['DM_Sans']">
              Aura
            </div>
          </div>

          <div className="hidden md:flex items-center gap-9">
            <Link
              href="/dashboard"
              className="text-gray-600 text-sm font-semibold font-['DM_Sans'] hover:text-gray-900 transition"
            >
              Dashboard
            </Link>

            <Link
              href="/analysis-history"
              className="flex flex-col items-center gap-1.5"
            >
              <span className="text-gray-900 text-sm font-bold font-['DM_Sans']">
                History
              </span>

              <span className="w-5 h-0.5 bg-violet-500 rounded-full" />
            </Link>

            <Link
              href="/ai-mode"
              className="text-gray-600 text-sm font-semibold font-['DM_Sans'] hover:text-gray-900 transition"
            >
              AI Mode
            </Link>

            <Link
              href="/settings"
              className="text-gray-600 text-sm font-semibold font-['DM_Sans'] hover:text-gray-900 transition"
            >
              Settings
            </Link>
          </div>

          <div className="px-2.5 flex items-center gap-3">
            <div className="size-10 rounded-full bg-violet-100 flex items-center justify-center overflow-hidden">
              <span className="text-violet-600 font-bold font-['DM_Sans']">
                {firstName?.charAt(0)?.toUpperCase() || 'A'}
              </span>
            </div>

            <div className="hidden sm:flex flex-col gap-0.5">
              <div className="text-gray-900 text-sm font-semibold font-['DM_Sans']">
                {firstName || 'User'}
              </div>

              <div className="text-gray-400 text-xs font-normal font-['DM_Sans']">
                AURA User
              </div>
            </div>
          </div>
        </div>

        {/* ========================= */}
        {/* HEADER */}
        {/* ========================= */}

        <div className="mt-8 flex flex-col gap-5">
          <div className="flex justify-between items-center">
            <Link
              href="/analysis-history"
              className="flex items-center gap-2 text-violet-500 text-sm font-bold font-['DM_Sans'] hover:text-violet-700 transition"
            >
              <ArrowLeft className="size-4" />
              Back to History
            </Link>

            <div className="px-3 py-1.5 bg-white/70 rounded-full outline outline-1 outline-offset-[-1px] outline-white flex items-center gap-2">
              <ShieldCheck className="size-3.5 text-gray-600" />

              <span className="text-gray-600 text-xs font-semibold font-['DM_Sans']">
                Historical result · Saved snapshot
              </span>
            </div>
          </div>

          <div className="flex justify-between items-start gap-6">
            <div className="flex-1 flex flex-col gap-2.5 min-w-0">
              <div className="flex items-center gap-3">
                <div className="size-10 bg-red-100 rounded-2xl flex justify-center items-center">
                  <FileText className="size-5 text-red-600" />
                </div>

                <h1 className="text-gray-900 text-2xl md:text-4xl font-extrabold font-['DM_Sans'] truncate">
                  {filename}
                </h1>
              </div>

              <div className="flex flex-wrap items-center gap-2.5">
                <span className="text-gray-600 text-sm font-normal font-['DM_Sans']">
                  Analyzed {formatDate(analysis.created_at)}
                </span>

                <span className="text-gray-400">•</span>

                <span className="text-gray-900 text-sm font-bold font-['DM_Sans']">
                  {targetJob}
                </span>

                {displayedCompanies.map((company) => (
                  <span
                    key={company}
                    className="px-2.5 py-[5px] bg-gray-100 rounded-full text-gray-600 text-xs font-bold font-['DM_Sans']"
                  >
                    {company}
                  </span>
                ))}

                {moreCompanies > 0 && (
                  <span className="px-2.5 py-[5px] bg-violet-500/10 rounded-full text-violet-500 text-xs font-bold font-['DM_Sans']">
                    +{moreCompanies} companies
                  </span>
                )}
              </div>
            </div>

            <button
              type="button"
              onClick={handleExport}
              disabled={isExporting}
              className="hidden md:inline-flex shrink-0 items-center gap-2 px-5 py-3 bg-white/80 rounded-full shadow-sm outline outline-1 outline-white text-gray-700 text-sm font-bold font-['DM_Sans'] hover:bg-white transition disabled:opacity-50"
            >
              {isExporting ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Download className="size-4" />
              )}

              {isExporting ? 'Exporting...' : 'Export PDF'}
            </button>
          </div>
        </div>

        {/* ========================= */}
        {/* OVERALL + DIMENSIONS */}
        {/* ========================= */}

        <div className="mt-8 grid lg:grid-cols-[380px_1fr] gap-6">
          {/* Overall assessment */}

          <div className="p-7 bg-white/80 rounded-[20px] shadow-[0px_12px_34px_0px_rgba(17,24,39,0.04)] outline outline-[1.5px] outline-white backdrop-blur-md flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <div className="text-gray-600 text-xs font-bold font-['DM_Sans'] uppercase">
                Overall assessment
              </div>

              <div
                className={`px-2.5 py-[5px] rounded-full text-xs font-bold font-['DM_Sans'] ${status.className}`}
              >
                {status.label}
              </div>
            </div>

            <div className="flex items-center gap-5">
              <div className="size-36 shrink-0 relative flex justify-center items-center">
                <div className="absolute inset-0 rounded-full bg-gray-200/50" />

                <div
                  className="absolute inset-0 rounded-full"
                  style={{
                    background: `conic-gradient(from 0deg, #8b5cf6, #06b6d4 ${
                      atsScore * 3.6
                    }deg, transparent ${atsScore * 3.6}deg)`,
                  }}
                />

                <div className="absolute inset-[8px] rounded-full bg-white flex flex-col justify-center items-center">
                  <div className="text-gray-900 text-4xl font-extrabold font-['DM_Sans']">
                    {atsScore}%
                  </div>

                  <div className="text-gray-400 text-[9px] font-bold font-['DM_Sans'] uppercase">
                    ATS score
                  </div>
                </div>
              </div>

              <div className="flex-1 flex flex-col gap-2">
                <div className="text-gray-900 text-xl font-extrabold font-['DM_Sans']">
                  {atsScore >= 85
                    ? 'Excellent match'
                    : atsScore >= 70
                      ? 'Good match'
                      : 'Needs improvement'}
                </div>

                <div className="text-gray-600 text-xs font-normal font-['DM_Sans'] leading-5">
                  {getScoreDescription(atsScore, targetJob)}
                </div>
              </div>
            </div>

            <div className="p-3 bg-violet-500/10 rounded-2xl outline outline-1 outline-violet-600/20 flex items-center gap-2">
              <Sparkles className="size-3.5 text-violet-500 shrink-0" />

              <div className="flex-1 text-violet-500 text-xs font-semibold font-['DM_Sans']">
                This score reflects the saved resume analysis for{' '}
                {targetJob}.
              </div>
            </div>
          </div>

          {/* Dimension Analysis */}

          <div className="p-7 bg-white/80 rounded-[20px] shadow-[0px_12px_34px_0px_rgba(17,24,39,0.04)] outline outline-[1.5px] outline-white backdrop-blur-md flex flex-col gap-5">
            <div className="flex justify-between items-center">
              <div>
                <div className="text-gray-900 text-xl font-extrabold font-['DM_Sans']">
                  Dimension Analysis
                </div>

                <div className="text-gray-600 text-xs font-normal font-['DM_Sans']">
                  Saved scoring from this analysis
                </div>
              </div>

              <div className="px-2.5 py-[5px] bg-violet-500/10 rounded-full text-violet-500 text-xs font-bold font-['DM_Sans']">
                ATS {atsScore}%
              </div>
            </div>

            <div className="flex flex-col gap-3.5">
              {dimensionItems.map((dimension) => (
                <div
                  key={dimension.name}
                  className="flex items-center gap-3.5"
                >
                  <div className="w-28 text-gray-900 text-xs font-bold font-['DM_Sans']">
                    {dimension.name}
                  </div>

                  <div className="flex-1 h-2 bg-gray-200/50 rounded-full overflow-hidden">
                    {dimension.score !== undefined && (
                      <div
                        className="h-full bg-gradient-to-r from-violet-500 to-cyan-500 rounded-full"
                        style={{
                          width: `${dimension.score}%`,
                        }}
                      />
                    )}
                  </div>

                  <div className="w-11 text-right text-gray-900 text-xs font-extrabold font-['DM_Sans']">
                    {dimension.score !== undefined
                      ? `${dimension.score}%`
                      : '—'}
                  </div>
                </div>
              ))}
            </div>

            <div className="px-4 py-3 bg-cyan-500/10 rounded-2xl flex items-center gap-2.5">
              <Target className="size-4 text-cyan-500 shrink-0" />

              <div className="flex-1 text-gray-600 text-xs font-semibold font-['DM_Sans']">
                Role-specific keyword coverage is calculated from the saved
                skill-match data. Dimensions without a stored numeric score
                are not fabricated.
              </div>
            </div>
          </div>
        </div>

        {/* ========================= */}
        {/* STRENGTHS / IMPROVEMENTS */}
        {/* ========================= */}

        <div className="mt-6 p-7 bg-white/80 rounded-[20px] shadow-[0px_12px_34px_0px_rgba(17,24,39,0.04)] outline outline-[1.5px] outline-white backdrop-blur-md flex flex-col gap-6">
          <div className="flex items-center gap-3.5">
            <div className="size-10 bg-amber-100 rounded-2xl outline outline-1 outline-amber-600/20 flex justify-center items-center">
              <Lightbulb className="size-5 text-amber-600" />
            </div>

            <div>
              <div className="text-gray-900 text-lg font-bold font-['DM_Sans']">
                Key Strengths &amp; Priority Improvements
              </div>

              <div className="text-gray-600 text-xs font-normal font-['DM_Sans']">
                The observations captured with this analysis
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            {/* Strengths */}

            <div className="p-5 bg-white/60 rounded-2xl outline outline-1 outline-white flex flex-col gap-4">
              <div className="flex items-center gap-2.5">
                <div className="size-7 bg-emerald-50 rounded-full flex justify-center items-center">
                  <div className="text-emerald-500 text-xs font-extrabold font-['DM_Sans']">
                    {strengths.length}
                  </div>
                </div>

                <div className="text-gray-900 text-lg font-bold font-['DM_Sans']">
                  Key strengths
                </div>
              </div>

              {strengths.length > 0 ? (
                <div className="flex flex-col gap-3">
                  {strengths.map((strength, index) => (
                    <div
                      key={`${strength}-${index}`}
                      className="flex items-start gap-2.5"
                    >
                      <Check className="size-4 mt-0.5 text-emerald-500 shrink-0" />

                      <div className="flex-1 text-gray-600 text-xs font-normal font-['DM_Sans'] leading-5">
                        {strength}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-xs font-['DM_Sans']">
                  No saved strengths were returned for this analysis.
                </p>
              )}
            </div>

            {/* Improvements */}

            <div className="p-5 bg-white/60 rounded-2xl outline outline-1 outline-white flex flex-col gap-4">
              <div className="flex items-center gap-2.5">
                <div className="size-7 bg-amber-100 rounded-full flex justify-center items-center">
                  <div className="text-amber-600 text-xs font-extrabold font-['DM_Sans']">
                    {improvements.length}
                  </div>
                </div>

                <div className="text-gray-900 text-lg font-bold font-['DM_Sans']">
                  Priority improvements
                </div>
              </div>

              {improvements.length > 0 ? (
                <div className="flex flex-col gap-3">
                  {improvements.map((improvement, index) => (
                    <div
                      key={`${improvement}-${index}`}
                      className="flex items-start gap-2.5"
                    >
                      <TriangleAlert className="size-4 mt-0.5 text-amber-600 shrink-0" />

                      <div className="flex-1 text-gray-600 text-xs font-normal font-['DM_Sans'] leading-5">
                        {improvement}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-xs font-['DM_Sans']">
                  No saved improvements were returned for this analysis.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* ========================= */}
        {/* KEYWORD / SKILL MATCH */}
        {/* ========================= */}

        <div className="mt-6 p-7 bg-white/80 rounded-[20px] shadow-[0px_12px_34px_0px_rgba(17,24,39,0.04)] outline outline-[1.5px] outline-white backdrop-blur-md flex flex-col gap-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3.5">
              <div className="size-10 bg-violet-500/10 rounded-2xl outline outline-1 outline-violet-500/20 flex justify-center items-center">
                <Target className="size-5 text-violet-500" />
              </div>

              <div>
                <div className="text-gray-900 text-lg font-bold font-['DM_Sans']">
                  Keyword &amp; Skill Match
                </div>

                <div className="text-gray-600 text-xs font-normal font-['DM_Sans']">
                  Role-specific terms found in the saved resume
                </div>
              </div>
            </div>

            <div className="flex flex-col items-end">
              <div className="text-violet-500 text-2xl font-extrabold font-['DM_Sans']">
                {keywordCoverage}%
              </div>

              <div className="text-gray-400 text-[10px] font-bold font-['DM_Sans'] uppercase">
                Coverage
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            {/* Matched */}

            <div className="p-5 bg-white/60 rounded-2xl outline outline-1 outline-white flex flex-col gap-3.5">
              <div className="flex justify-between items-center">
                <div className="text-gray-900 text-base font-bold font-['DM_Sans']">
                  Matched in resume
                </div>

                <div className="px-2.5 py-[5px] bg-emerald-50 rounded-full text-emerald-500 text-xs font-bold font-['DM_Sans']">
                  {skillData.matched.length} matched
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {skillData.matched.length > 0 ? (
                  skillData.matched.map((skill) => (
                    <span
                      key={skill}
                      className="px-2.5 py-[5px] bg-emerald-50 rounded-full text-emerald-500 text-xs font-bold font-['DM_Sans']"
                    >
                      ✓ {skill}
                    </span>
                  ))
                ) : keywords.length > 0 ? (
                  keywords.map((keyword) => (
                    <span
                      key={keyword}
                      className="px-2.5 py-[5px] bg-emerald-50 rounded-full text-emerald-500 text-xs font-bold font-['DM_Sans']"
                    >
                      ✓ {keyword}
                    </span>
                  ))
                ) : (
                  <span className="text-gray-500 text-xs font-['DM_Sans']">
                    No matched skills were saved.
                  </span>
                )}
              </div>

              <div className="text-gray-600 text-xs font-normal font-['DM_Sans'] leading-4">
                Skills shown here come from the saved role-specific analysis.
              </div>
            </div>

            {/* Gaps */}

            <div className="p-5 bg-white/60 rounded-2xl outline outline-1 outline-white flex flex-col gap-3.5">
              <div className="flex justify-between items-center">
                <div className="text-gray-900 text-base font-bold font-['DM_Sans']">
                  Relevant gaps
                </div>

                <div className="px-2.5 py-[5px] bg-amber-100 rounded-full text-amber-600 text-xs font-bold font-['DM_Sans']">
                  {skillData.required.length +
                    skillData.optional.length}{' '}
                  opportunities
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {skillData.required.map((skill) => (
                  <span
                    key={`required-${skill}`}
                    className="px-2.5 py-[5px] bg-red-100 rounded-full text-red-600 text-xs font-bold font-['DM_Sans']"
                  >
                    Required · {skill}
                  </span>
                ))}

                {skillData.optional.map((skill) => (
                  <span
                    key={`optional-${skill}`}
                    className="px-2.5 py-[5px] bg-amber-100 rounded-full text-amber-600 text-xs font-bold font-['DM_Sans']"
                  >
                    Optional · {skill}
                  </span>
                ))}

                {skillData.required.length === 0 &&
                  skillData.optional.length === 0 && (
                    <span className="text-emerald-500 text-xs font-bold font-['DM_Sans']">
                      No skill gaps were saved.
                    </span>
                  )}
              </div>

              <div className="text-gray-600 text-xs font-normal font-['DM_Sans'] leading-4">
                Required and optional gaps are based on the selected{' '}
                {targetJob} role.
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-28 text-gray-600 text-xs font-bold font-['DM_Sans']">
              Coverage
            </div>

            <div className="flex-1 h-2 bg-gray-200/50 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-violet-500 to-cyan-500 rounded-full"
                style={{
                  width: `${keywordCoverage}%`,
                }}
              />
            </div>

            <div className="w-11 text-right text-gray-900 text-xs font-extrabold font-['DM_Sans']">
              {keywordCoverage}%
            </div>
          </div>
        </div>

        {/* ========================= */}
        {/* FORMATTING */}
        {/* ========================= */}

        <div className="mt-6 p-7 bg-white/80 rounded-[20px] shadow-[0px_12px_34px_0px_rgba(17,24,39,0.04)] outline outline-[1.5px] outline-white backdrop-blur-md flex flex-col gap-5">
          <div className="flex items-center gap-3.5">
            <div className="size-10 bg-cyan-500/10 rounded-2xl outline outline-1 outline-cyan-500/20 flex justify-center items-center">
              <FileText className="size-5 text-cyan-500" />
            </div>

            <div>
              <div className="text-gray-900 text-lg font-bold font-['DM_Sans']">
                Formatting &amp; Readability
              </div>

              <div className="text-gray-600 text-xs font-normal font-['DM_Sans']">
                Issues and observations captured from the saved analysis
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2.5">
            {grammarIssues.length > 0 ? (
              grammarIssues.map((issue, index) => {
                const title = isRecord(issue)
                  ? String(
                      issue.title ??
                        issue.type ??
                        issue.category ??
                        'Grammar / formatting issue'
                    )
                  : 'Grammar / formatting issue';

                const description = getDescription(issue);

                return (
                  <div
                    key={index}
                    className="p-3.5 bg-white/60 rounded-2xl outline outline-1 outline-white flex items-center gap-3.5"
                  >
                    <div className="size-9 bg-amber-100 rounded-[10px] flex justify-center items-center shrink-0">
                      <TriangleAlert className="size-4 text-amber-600" />
                    </div>

                    <div className="w-48 shrink-0">
                      <div className="text-gray-400 text-[10px] font-bold font-['DM_Sans'] uppercase">
                        Review
                      </div>

                      <div className="text-gray-900 text-sm font-bold font-['DM_Sans']">
                        {title}
                      </div>
                    </div>

                    <div className="flex-1 text-gray-600 text-xs font-normal font-['DM_Sans'] leading-5">
                      {description || textValue(issue)}
                    </div>

                    <div className="px-2.5 py-[5px] bg-amber-100 rounded-full text-amber-600 text-xs font-bold font-['DM_Sans']">
                      Review
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="p-4 bg-emerald-50/70 rounded-2xl flex items-center gap-3">
                <div className="size-9 bg-emerald-50 rounded-[10px] flex justify-center items-center">
                  <Check className="size-4 text-emerald-500" />
                </div>

                <div className="flex-1 text-gray-600 text-xs font-semibold font-['DM_Sans']">
                  No grammar or formatting issues were returned in the saved
                  analysis.
                </div>

                <div className="px-2.5 py-[5px] bg-emerald-50 rounded-full text-emerald-500 text-xs font-bold font-['DM_Sans']">
                  Passed
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ========================= */}
        {/* RECOMMENDATIONS */}
        {/* ========================= */}

        <div className="mt-6 p-7 bg-white/80 rounded-[20px] shadow-[0px_12px_34px_0px_rgba(17,24,39,0.04)] outline outline-[1.5px] outline-white backdrop-blur-md flex flex-col gap-6">
          <div className="flex items-center gap-3.5">
            <div className="size-10 bg-violet-500/10 rounded-2xl outline outline-1 outline-violet-500/20 flex justify-center items-center">
              <Sparkles className="size-5 text-violet-500" />
            </div>

            <div>
              <div className="text-gray-900 text-lg font-bold font-['DM_Sans']">
                Recommendations &amp; Certifications
              </div>

              <div className="text-gray-600 text-xs font-normal font-['DM_Sans']">
                Suggestions preserved from this saved analysis
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            {/* Improvements / Recommendations */}

            <div className="p-5 bg-white/60 rounded-2xl outline outline-1 outline-white flex flex-col gap-3.5">
              <div className="text-gray-900 text-lg font-bold font-['DM_Sans']">
                Relevant recommendations
              </div>

              {improvements.length > 0 ? (
                improvements.slice(0, 5).map((improvement, index) => (
                  <div
                    key={`${improvement}-${index}`}
                    className="flex items-start gap-3"
                  >
                    <div className="size-6 bg-violet-500/10 rounded-full flex justify-center items-center shrink-0">
                      <Lightbulb className="size-3 text-violet-500" />
                    </div>

                    <div className="flex-1 flex flex-col gap-[3px]">
                      <div className="flex justify-between items-center gap-2">
                        <div className="text-gray-900 text-xs font-bold font-['DM_Sans']">
                          Improvement {index + 1}
                        </div>

                        <div className="px-2.5 py-[5px] bg-violet-500/10 rounded-full text-violet-500 text-xs font-bold font-['DM_Sans']">
                          Recommendation
                        </div>
                      </div>

                      <div className="text-gray-600 text-xs font-normal font-['DM_Sans'] leading-4">
                        {improvement}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-xs font-['DM_Sans']">
                  No recommendations were saved for this analysis.
                </p>
              )}
            </div>

            {/* Certifications */}

            <div className="p-5 bg-white/60 rounded-2xl outline outline-1 outline-white flex flex-col gap-3.5">
              <div className="text-gray-900 text-lg font-bold font-['DM_Sans']">
                Certification recommendations
              </div>

              {certifications.length > 0 ? (
                certifications.map((certification, index) => {
                  const name =
                    String(
                      certification.full_name ??
                        certification.name ??
                        certification.title ??
                        'Certification'
                    );

                  const provider = String(
                    certification.provider ??
                      certification.issuer ??
                      ''
                  );

                  const url = String(
                    certification.url ??
                      certification.link ??
                      ''
                  );

                  return (
                    <div
                      key={`${name}-${index}`}
                      className="flex items-start gap-3"
                    >
                      <div className="size-8 bg-cyan-500/10 rounded-[10px] flex justify-center items-center shrink-0">
                        <ShieldCheck className="size-4 text-cyan-500" />
                      </div>

                      <div className="flex-1 flex flex-col gap-0.5">
                        <div className="flex justify-between items-center gap-2">
                          {url ? (
                            <a
                              href={url}
                              target="_blank"
                              rel="noreferrer"
                              className="text-gray-900 text-xs font-bold font-['DM_Sans'] hover:text-violet-500 transition"
                            >
                              {name}
                            </a>
                          ) : (
                            <div className="text-gray-900 text-xs font-bold font-['DM_Sans']">
                              {name}
                            </div>
                          )}

                          <div className="px-2.5 py-[5px] bg-amber-100 rounded-full text-amber-600 text-xs font-bold font-['DM_Sans']">
                            Recommended
                          </div>
                        </div>

                        {provider && (
                          <div className="text-gray-400 text-xs font-semibold font-['DM_Sans']">
                            {provider}
                          </div>
                        )}

                        <div className="text-gray-600 text-xs font-normal font-['DM_Sans']">
                          Certification relevant to {targetJob}.
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="text-gray-500 text-xs font-['DM_Sans']">
                  No certification recommendations were saved for this
                  analysis.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* ========================= */}
        {/* TOP JOBS */}
        {/* ========================= */}

        {topJobs.length > 0 && (
          <div className="mt-6 p-7 bg-white/80 rounded-[20px] shadow-[0px_12px_34px_0px_rgba(17,24,39,0.04)] outline outline-[1.5px] outline-white backdrop-blur-md">
            <div className="flex items-center gap-3.5 mb-5">
              <div className="size-10 bg-cyan-500/10 rounded-2xl outline outline-1 outline-cyan-500/20 flex justify-center items-center">
                <Target className="size-5 text-cyan-500" />
              </div>

              <div>
                <div className="text-gray-900 text-lg font-bold font-['DM_Sans']">
                  Matching Job Opportunities
                </div>

                <div className="text-gray-600 text-xs font-normal font-['DM_Sans']">
                  Job matches preserved from this analysis
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {topJobs.slice(0, 6).map((job, index) => {
                const title = String(
                  job.title ??
                    job.job_title ??
                    job.name ??
                    'Job opportunity'
                );

                const company = String(
                  job.company ??
                    job.company_name ??
                    job.employer ??
                    ''
                );

                const location = String(
                  job.location ??
                    job.job_location ??
                    ''
                );

                const match = getScore(job);

                const applyUrl = String(
                  job.apply_url ??
                    job.url ??
                    job.job_apply_link ??
                    ''
                );

                return (
                  <div
                    key={`${title}-${index}`}
                    className="p-5 bg-white/60 rounded-2xl outline outline-1 outline-white"
                  >
                    <div className="flex justify-between gap-4">
                      <div>
                        <div className="text-gray-900 text-sm font-bold font-['DM_Sans']">
                          {title}
                        </div>

                        {company && (
                          <div className="mt-1 text-gray-400 text-xs font-semibold font-['DM_Sans']">
                            {company}
                          </div>
                        )}

                        {location && (
                          <div className="mt-1 text-gray-600 text-xs font-normal font-['DM_Sans']">
                            {location}
                          </div>
                        )}
                      </div>

                      {match !== null && (
                        <div className="px-2.5 py-[5px] h-fit bg-violet-500/10 rounded-full text-violet-500 text-xs font-bold font-['DM_Sans']">
                          {match}%
                        </div>
                      )}
                    </div>

                    {applyUrl && (
                      <a
                        href={applyUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex mt-4 text-violet-500 text-xs font-bold font-['DM_Sans'] hover:text-violet-700"
                      >
                        View job →
                      </a>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}