export interface AnalysisResult {
  keywords: string[];
  total_jobs: number;
  top_jobs: {
    title: string;
    company: string;
    location: string;
    url: string;
    total_score: number;
    matched_skills: string[];
    description: string;
  }[];
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
  }[];
  ats_score: number;
  sections: { name: string; value: number }[];
  strengths: string[];
  improvements: string[];
  skill_gaps: { skill: string; missing: boolean; recommendation: string }[];
  grammar_issues: { type: string; text: string }[];
}