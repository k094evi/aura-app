// src/components/FormattingReadability.tsx

'use client';

import { useState } from 'react';
import { FileText } from 'lucide-react';

// Represents a single grammar/style issue with its category and description
type GrammarIssue = {
  type: string;
  text: string;
};

type FormattingReadabilityProps = {
  grammarIssues: GrammarIssue[];
};

// Issues shown per page (as in the Figma design)
const PAGE_SIZE = 4;

// Badge + status-dot colors per issue category (from the Figma design).
// Matched by category name, case-insensitively; any other category uses the neutral style.
type IssueStyle = { badge: string; dot: string };

const ISSUE_STYLES: Record<string, IssueStyle> = {
  formatting: { badge: 'bg-[#dbeafe] text-[#2563eb]', dot: 'bg-[#dc2626]' },
  structure: { badge: 'bg-[#dbeafe] text-[#2563eb]', dot: 'bg-[#dc2626]' },
  readability: { badge: 'bg-[#ede9fe] text-[#7c3aed]', dot: 'bg-[#eab30a]' },
  consistency: { badge: 'bg-[#fef9c3] text-[#a16207]', dot: 'bg-[#eab30a]' },
};

const NEUTRAL_STYLE: IssueStyle = { badge: 'bg-[#f3f4f6] text-[#4b5563]', dot: 'bg-[#9ca3af]' };

const getIssueStyle = (type: string): IssueStyle =>
  ISSUE_STYLES[type.trim().toLowerCase()] ?? NEUTRAL_STYLE;

// Card component displaying a paginated list of formatting and readability issues
export default function FormattingReadability({ grammarIssues }: FormattingReadabilityProps) {
  const [page, setPage] = useState(0);

  const total = grammarIssues.length;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  // Clamp in case the list shrinks while a later page is open
  const currentPage = Math.min(page, totalPages - 1);

  const startIndex = currentPage * PAGE_SIZE;
  const visible = grammarIssues.slice(startIndex, startIndex + PAGE_SIZE);
  const isFirstPage = currentPage === 0;
  const isLastPage = currentPage >= totalPages - 1;

  return (
    <section className="flex flex-col gap-6 rounded-[24px] border-[1.5px] border-white bg-white/[0.72] p-6 shadow-[0_10px_30px_rgba(17,24,39,0.03)] backdrop-blur-[12px] sm:p-8">
      {/* Header */}
      <div className="flex items-center gap-[14px]">
        <div className="flex shrink-0 items-center justify-center rounded-[12px] border border-[#06b6d4]/20 bg-[#06b6d4]/10 p-[10px]">
          <FileText className="size-5 text-[#06b6d4]" />
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <h3 className="text-[18px] font-bold leading-tight text-[#111827]">
            Formatting &amp; Readability
          </h3>
          <p className="text-[13px] text-[#4b5563]">
            Checking the visual flow and layout for clarity
          </p>
        </div>
      </div>

      {/* Issues list - renders each grammar/style issue as a row */}
      {total === 0 ? (
        <p className="text-[13px] text-[#4b5563]">No formatting or readability issues found.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {visible.map((issue, i) => {
            const style = getIssueStyle(issue.type);

            return (
              <div
                key={`${issue.text}-${startIndex + i}`}
                className="flex flex-wrap items-center gap-x-4 gap-y-2 rounded-[16px] border-[1.5px] border-white bg-white/[0.72] p-4 transition-colors hover:bg-white"
              >
                {/* Issue category/type label */}
                <span
                  className={`shrink-0 rounded-full px-[10px] py-1 text-[10px] font-extrabold uppercase leading-none ${style.badge}`}
                >
                  {issue.type}
                </span>

                {/* Status dot + issue description */}
                <div className="flex min-w-0 flex-1 basis-[200px] items-center gap-3">
                  <span aria-hidden className={`size-[10px] shrink-0 rounded-full ${style.dot}`} />
                  <p className="min-w-0 flex-1 text-[13px] font-medium text-[#111827]">{issue.text}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination (only when there is more than one page) */}
      {totalPages > 1 && (
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-[13px] text-[#4b5563]">
            Showing {startIndex + 1}-{startIndex + visible.length} of {total} issues
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