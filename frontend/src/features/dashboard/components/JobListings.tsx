// src/features/dashboard/components/JobListings.tsx

'use client';

import { useState } from 'react';
import { Briefcase, Building2, ExternalLink, MapPin } from 'lucide-react';

import type { TopJob } from '@/types/analysis';

type JobListingsProps = {
  jobs: TopJob[];
  // Total jobs the search found (may be larger than the jobs returned)
  totalJobs?: number;
  // Keywords the search was based on
  keywords?: string[];
};

// Jobs shown per page
const PAGE_SIZE = 4;
const MAX_SKILL_CHIPS = 6;
const MAX_KEYWORD_CHIPS = 10;

// The backend score may be 0–1 or 0–100; show both as a 0–100 percentage.
const toPercent = (score: number) => {
  const n = Number.isFinite(score) ? score : 0;
  return Math.round(Math.min(100, Math.max(0, n <= 1 ? n * 100 : n)));
};

// Only http(s) links are rendered as links (the URL comes from an external API).
const isHttpUrl = (url: string | undefined): url is string => !!url && /^https?:\/\//i.test(url);

// Card displaying a paginated list of the jobs found by the API
export default function JobListings({ jobs, totalJobs, keywords = [] }: JobListingsProps) {
  const [page, setPage] = useState(0);

  const total = jobs.length;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  // Clamp in case the list shrinks while a later page is open
  const currentPage = Math.min(page, totalPages - 1);

  const startIndex = currentPage * PAGE_SIZE;
  const visible = jobs.slice(startIndex, startIndex + PAGE_SIZE);
  const isFirstPage = currentPage === 0;
  const isLastPage = currentPage >= totalPages - 1;

  const found = totalJobs && totalJobs > total ? totalJobs : total;

  return (
    <section className="flex flex-col gap-6 rounded-[24px] border-[1.5px] border-white bg-white/[0.72] p-6 shadow-[0_10px_30px_rgba(17,24,39,0.03)] backdrop-blur-[12px] sm:p-8">
      {/* Header */}
      <div className="flex items-center gap-[14px]">
        <div className="flex shrink-0 items-center justify-center rounded-[12px] border border-[#f59e0b]/20 bg-[#f59e0b]/10 p-[10px]">
          <Briefcase className="size-5 text-[#f59e0b]" />
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <h3 className="text-[18px] font-bold leading-tight text-[#111827]">Matching Job Openings</h3>
          <p className="text-[13px] text-[#4b5563]">
            {total > 0
              ? `${found} job${found === 1 ? '' : 's'} found · showing your top ${total}`
              : 'Open roles that best fit your resume'}
          </p>
        </div>
      </div>

      {/* Keywords the search was based on */}
      {keywords.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[11px] font-bold uppercase text-[#9ca3af]">Search keywords</span>
          {keywords.slice(0, MAX_KEYWORD_CHIPS).map((keyword) => (
            <span
              key={keyword}
              className="rounded-full border border-[#e5e7eb] bg-white px-[10px] py-1 text-[11px] font-medium text-[#4b5563]"
            >
              {keyword}
            </span>
          ))}
        </div>
      )}

      {/* Job list */}
      {total === 0 ? (
        <p className="text-[13px] text-[#4b5563]">No job matches were returned for this resume.</p>
      ) : (
        <div className="flex flex-col gap-4">
          {visible.map((job, i) => {
            const skills = job.matched_skills ?? [];

            return (
              <article
                key={`${job.url}-${startIndex + i}`}
                className="flex flex-col gap-3 rounded-[16px] border-[1.5px] border-white bg-white/[0.72] p-5 shadow-[0_10px_30px_rgba(17,24,39,0.03)] backdrop-blur-[12px]"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex min-w-0 flex-1 flex-col gap-1">
                    <h4 className="text-[15px] font-bold leading-snug text-[#111827]">{job.title}</h4>
                    <p className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[13px] text-[#4b5563]">
                      <span className="inline-flex items-center gap-1">
                        <Building2 className="size-3.5 shrink-0 text-[#8b5cf6]" />
                        {job.company}
                      </span>
                      {job.location && (
                        <span className="inline-flex items-center gap-1">
                          <MapPin className="size-3.5 shrink-0 text-[#8b5cf6]" />
                          {job.location}
                        </span>
                      )}
                    </p>
                  </div>

                  <span className="shrink-0 rounded-[8px] border border-[#8b5cf6]/20 bg-[#8b5cf6]/10 px-[10px] py-[6px] text-[12px] font-extrabold leading-none text-[#8b5cf6]">
                    {toPercent(job.total_score)}% match
                  </span>
                </div>

                {job.description && (
                  <p className="line-clamp-3 text-[13px] leading-[1.4] text-[#4b5563]">{job.description}</p>
                )}

                {skills.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {skills.slice(0, MAX_SKILL_CHIPS).map((skill) => (
                      <span
                        key={skill}
                        className="rounded-full bg-[#10b981]/10 px-[10px] py-1 text-[11px] font-semibold text-[#059669]"
                      >
                        {skill}
                      </span>
                    ))}
                    {skills.length > MAX_SKILL_CHIPS && (
                      <span className="px-1 py-1 text-[11px] font-medium text-[#9ca3af]">
                        +{skills.length - MAX_SKILL_CHIPS} more
                      </span>
                    )}
                  </div>
                )}

                {isHttpUrl(job.url) && (
                  <a
                    href={job.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 self-start text-[13px] font-bold text-[#7c3aed] transition hover:text-[#6d28d9]"
                  >
                    View job
                    <ExternalLink className="size-3.5" />
                  </a>
                )}
              </article>
            );
          })}
        </div>
      )}

      {/* Pagination (only when there is more than one page) */}
      {totalPages > 1 && (
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-[13px] text-[#4b5563]">
            Showing {startIndex + 1}–{startIndex + visible.length} of {total} jobs
          </p>

          <div className="flex items-center gap-[10px] font-medium">
            <button
              type="button"
              onClick={() => setPage(currentPage - 1)}
              disabled={isFirstPage}
              className="flex items-center gap-[6px] rounded-[10px] border border-[#e5e7eb] bg-white/[0.72] px-4 py-2 text-[#4b5563] transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-white/[0.72]"
            >
              <span className="text-[14px]">←</span>
              <span className="text-[13px]">Previous</span>
            </button>

            <button
              type="button"
              onClick={() => setPage(currentPage + 1)}
              disabled={isLastPage}
              className="flex items-center gap-[6px] rounded-[10px] bg-[#8b5cf6] px-4 py-2 text-white shadow-[0_4px_12px_rgba(124,58,237,0.2)] transition hover:bg-[#7c3aed] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-[#8b5cf6]"
            >
              <span className="text-[13px]">Next</span>
              <span className="text-[14px]">→</span>
            </button>
          </div>
        </div>
      )}
    </section>
  );
}