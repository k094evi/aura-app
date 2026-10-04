import type { AnalysisResult } from '@/types/analysis';

export function toResult(data: unknown): AnalysisResult {
  const value = data as Record<string, unknown>;

  return {
    ...value,
    ats_score: Number(value.ats_score ?? 0),
    sections: Array.isArray(value.sections) ? value.sections : [],
    strengths: Array.isArray(value.strengths) ? value.strengths : [],
    improvements: Array.isArray(value.improvements)
      ? value.improvements
      : [],
    skill_gaps:
      Array.isArray(value.skill_gaps) ||
      (typeof value.skill_gaps === 'object' && value.skill_gaps !== null)
        ? value.skill_gaps
        : [],
    keyword_gaps: Array.isArray(value.keyword_gaps)
      ? value.keyword_gaps
      : [],
    grammar_issues: Array.isArray(value.grammar_issues)
      ? value.grammar_issues
      : [],
    companies: Array.isArray(value.companies)
      ? value.companies
      : [],
    top_jobs: Array.isArray(value.top_jobs)
      ? value.top_jobs
      : [],
    certifications: Array.isArray(value.certifications)
      ? value.certifications
      : [],
    keywords: Array.isArray(value.keywords)
      ? value.keywords
      : [],
  } as AnalysisResult;
}