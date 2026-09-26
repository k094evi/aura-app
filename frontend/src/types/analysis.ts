// src/types/analysis.ts

// One job found by the backend job search
export interface TopJob {
  title: string;
  company: string;
  location: string;
  url: string;
  total_score: number;
  matched_skills: string[];
  // Keywords (from the resume/target-JD) this job's listing matched on,
  // separate from matched_skills. See ScoredJob.matched_keywords.
  matched_keywords: string[];
  // Raw 0-1 embedding cosine similarity between the resume/target-JD and
  // this job's text — e.g. 0.82 -> "82% semantically similar". Independent
  // of score_breakdown.semantic_score, which is that same signal already
  // scaled to its 0-20 point weight within total_score.
  semantic_similarity: number;
  // Per-component points behind total_score (sums to total_score, out of
  // 100): keyword 0-30, skills 0-30, semantic 0-20, api_match 0-10,
  // title 0-10. Mirrors the "How Your ATS Score is Calculated" pattern
  // already used for the resume's own `sections` breakdown.
  score_breakdown: {
    keyword_score: number;
    skills_score: number;
    semantic_score: number;
    api_match_score: number;
    title_score: number;
  };
  description: string;
}

export interface AnalysisResult {
  keywords: string[];
  total_jobs: number;
  top_jobs: TopJob[];
  companies: {
    company: string;
    match: number;
    reason: string;
    location: string;
    jobType: string;
    experienceLevel: string;
    salary: string;
    teamSize: string;
    requirements: string[];
    // Link to the best matching job at this company (used by "View Full Job Posting")
    top_job_url?: string;
  }[];
  ats_score: number;
  sections: { name: string; value: number }[];
  strengths: string[];
  improvements: string[];
  skill_gaps: { skill: string; missing: boolean; recommendation: string }[];
  grammar_issues: { type: string; text: string }[];
  // Optional: only present when the backend returns certification suggestions
  certifications?: {
    name: string;
    provider: string;
    reason: string;
    relevance: string;
  }[];
}