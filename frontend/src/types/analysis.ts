// src/types/analysis.ts

// One job found by the backend job search
export interface TopJob {
  title: string;
  company: string;
  location: string;
  url: string;
  total_score: number;
  matched_skills: string[];
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