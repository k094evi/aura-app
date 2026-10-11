// src/features/dashboard/data/supportedJobs.ts
//
// Mirror of the roles in backend/app/data/job_requirements.py
// (JOB_REQUIREMENTS keys + JOB_TITLE_ALIASES). Those are the only titles the
// backend has a skill checklist for, so the Target Job Title field suggests
// exactly these. If you add a role there, add it here too.

export const SUPPORTED_JOB_TITLES: readonly string[] = [
  "Fullstack Developer",
  "Backend Developer",
  "Frontend Developer",
  "Mobile App Developer",
  "QA Engineer",
  "Cybersecurity Engineer",
  "Cloud Security Architect",
  "SOC Analyst",
  "Cloud Solutions Architect",
  "DevOps / Platform Engineer",
  "Network Engineer",
  "IT Infrastructure Automation Engineer",
  "Data Engineer",
  "Data Analyst",
  "Database Administrator",
  "AI / Machine Learning Engineer",
  "AI Solutions Architect",
  "AI Governance & Risk Specialist",
  "UI/UX Designer",
  "IT Support / Systems Administrator"
];

// Alternate spellings the backend already treats as the same role.
// Keys are the canonical titles above.
export const JOB_TITLE_ALIASES: Record<string, readonly string[]> = {
  "UI/UX Designer": [
    "ux designer",
    "ui designer",
    "ux/ui designer",
    "product designer",
    "user experience designer",
    "interaction designer"
  ],
  "Frontend Developer": [
    "front-end developer",
    "front end developer",
    "frontend engineer",
    "front-end engineer",
    "web developer"
  ],
  "Backend Developer": [
    "back-end developer",
    "back end developer",
    "backend engineer",
    "server-side developer",
    "software engineer backend"
  ],
  "Cybersecurity Engineer": [
    "cyber security engineer",
    "security engineer",
    "information security engineer",
    "cybersecurity analyst",
    "information security analyst"
  ]
};

const normalize = (text: string) => text.trim().toLowerCase().replace(/\s+/g, ' ');

/** Returns the canonical supported title for an exact title or alias, else null. */
export function findSupportedJob(text: string): string | null {
  const q = normalize(text);
  if (!q) return null;
  for (const title of SUPPORTED_JOB_TITLES) {
    if (normalize(title) === q) return title;
    if ((JOB_TITLE_ALIASES[title] ?? []).some((alias) => normalize(alias) === q)) return title;
  }
  return null;
}

/** Supported titles whose name or any alias contains the query. */
export function searchSupportedJobs(query: string): string[] {
  const q = normalize(query);
  if (!q) return [...SUPPORTED_JOB_TITLES];
  return SUPPORTED_JOB_TITLES.filter(
    (title) =>
      normalize(title).includes(q) ||
      (JOB_TITLE_ALIASES[title] ?? []).some((alias) => normalize(alias).includes(q))
  );
}