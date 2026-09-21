// src/features/dashboard/components/CertificationRecommendations.tsx

'use client';

import { useState } from 'react';
import { Award } from 'lucide-react';

// One recommended certification.
// `relevance` is compared case-insensitively: "required" gets the red badge,
// anything else is treated as "optional" (yellow badge).
export type Certification = {
  name: string;
  provider: string;
  reason: string;
  relevance: string;
};

type CertificationRecommendationsProps = {
  certifications: Certification[];
};

// Certifications shown per page (a 2 x 2 grid, as in the Figma design)
const PAGE_SIZE = 4;

// Card displaying a paginated grid of recommended certifications
export default function CertificationRecommendations({
  certifications,
}: CertificationRecommendationsProps) {
  const [page, setPage] = useState(0);

  const total = certifications.length;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  // Clamp in case the list shrinks while a later page is open
  const currentPage = Math.min(page, totalPages - 1);

  const startIndex = currentPage * PAGE_SIZE;
  const visible = certifications.slice(startIndex, startIndex + PAGE_SIZE);
  const isFirstPage = currentPage === 0;
  const isLastPage = currentPage >= totalPages - 1;

  return (
    <section className="flex flex-col gap-6 rounded-[24px] border-[1.5px] border-white bg-white/[0.72] p-6 shadow-[0_10px_30px_rgba(17,24,39,0.03)] backdrop-blur-[12px] sm:p-8">
      {/* Header */}
      <div className="flex items-center gap-[14px]">
        <div className="flex shrink-0 items-center justify-center rounded-[12px] border border-[#8b5cf6]/20 bg-[#8b5cf6]/10 p-[10px]">
          <Award className="size-5 text-[#8b5cf6]" />
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <h3 className="text-[18px] font-bold leading-tight text-[#111827]">
            Certification Recommendations
          </h3>
          <p className="text-[13px] text-[#4b5563]">
            Boost your resume with industry-recognized certifications
          </p>
        </div>
      </div>

      {/* Certification grid */}
      {total === 0 ? (
        <p className="text-[13px] text-[#4b5563]">No certification recommendations yet.</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {visible.map((cert, i) => {
            const isRequired = cert.relevance.trim().toLowerCase() === 'required';

            return (
              <div
                key={`${cert.name}-${startIndex + i}`}
                className="flex flex-col gap-3 rounded-[16px] border-[1.5px] border-white bg-white/[0.72] p-5 shadow-[0_10px_30px_rgba(17,24,39,0.03)] backdrop-blur-[12px]"
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="min-w-0 truncate text-[15px] font-bold text-[#111827]" title={cert.name}>
                    {cert.name}
                  </span>

                  {isRequired ? (
                    <span className="shrink-0 rounded-[6px] bg-[#fee2e2] px-2 py-1 text-[10px] font-extrabold leading-none text-[#ef4444]">
                      Required
                    </span>
                  ) : (
                    <span className="shrink-0 rounded-[6px] bg-[#fef3c7] px-2 py-1 text-[10px] font-extrabold leading-none text-[#f59e0b]">
                      Optional
                    </span>
                  )}
                </div>

                <p className="text-[13px] leading-[1.4] text-[#4b5563]">{cert.provider}</p>
                <p className="text-[13px] leading-[1.4] text-[#4b5563]">{cert.reason}</p>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination (only when there is more than one page) */}
      {totalPages > 1 && (
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-[13px] text-[#4b5563]">
            Showing {startIndex + 1}–{startIndex + visible.length} of {total} certifications
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