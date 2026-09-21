import { ChevronDown, CircleX, Search } from 'lucide-react';

/* ---------------------------- Page background ---------------------------- */

// Soft radial glow used for the three ambient orbs. The Figma exports each
// orb as a blurred SVG that bleeds past its frame, so the glow layer is
// oversized (negative inset) relative to the orb's nominal box.
function orbGradient(rgb: string, peak: number) {
  return `radial-gradient(closest-side, rgba(${rgb},${peak}) 0%, rgba(${rgb},${peak * 0.75}) 45%, rgba(${rgb},0) 100%)`;
}

// Decorative layers behind the whole page: dot grid, three ambient orbs and
// the thin gradient accent line across the top. Everything is absolutely
// positioned and non-interactive; the page root must be `relative` and
// `overflow-hidden`.
export function AnalysisHistoryBackground() {
  return (
    <>
      {/* Purple orb (top-left) */}
      <div aria-hidden className="pointer-events-none absolute -left-[60px] -top-[60px] size-[620px]">
        <div className="absolute -inset-[25.81%]" style={{ background: orbGradient('139,92,246', 0.3) }} />
      </div>

      {/* Cyan orb (right) */}
      <div aria-hidden className="pointer-events-none absolute -right-[80px] top-[200px] size-[520px]">
        <div className="absolute -inset-[26.92%]" style={{ background: orbGradient('6,182,212', 0.22) }} />
      </div>

      {/* Rose orb (lower-middle) */}
      <div aria-hidden className="pointer-events-none absolute left-[41.67%] top-[600px] size-[360px]">
        <div className="absolute -inset-[36.11%]" style={{ background: orbGradient('244,63,94', 0.18) }} />
      </div>

      {/* Dot-grid texture, 6% opacity, first 1200px of the page */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[1200px] opacity-[0.06]"
        style={{
          backgroundImage: 'radial-gradient(circle, #4c1d95 1px, transparent 1.5px)',
          backgroundSize: '24px 24px',
        }}
      />

      {/* Top accent line: violet -> cyan -> transparent */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-0 top-0 z-20 h-[3px] w-full bg-gradient-to-r from-[#7c3aed] via-[#06b6d4] to-[rgba(139,92,246,0)]"
      />
    </>
  );
}

// Extra concentric rings that only appear on the empty-state frame:
// two at the top-right corner, two at the lower-left.
export function AnalysisHistoryEmptyRings() {
  return (
    <>
      <div
        aria-hidden
        className="pointer-events-none absolute -right-[120px] -top-[120px] size-[340px] rounded-full border border-[#8b5cf6]/15"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-[80px] -top-[80px] size-[260px] rounded-full border border-[#8b5cf6]/15"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute left-[60px] top-[780px] size-[180px] rounded-full border border-[#06b6d4]/20"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute left-[100px] top-[820px] size-[100px] rounded-full border border-[#06b6d4]/20"
      />
    </>
  );
}

/* ------------------------- Title + search/filter row ------------------------- */

type AnalysisHistoryHeaderProps = {
  // Empty-state frame shows the search box and dropdown dimmed and inert.
  disabled?: boolean;
};

// Hardcoded / presentational: the search box and category dropdown match the
// Figma visually but are not wired to any filtering yet.
export function AnalysisHistoryHeader({ disabled = false }: AnalysisHistoryHeaderProps) {
  return (
    <div className="flex w-full flex-col gap-5 md:flex-row md:items-center md:justify-between">
      <div className="flex flex-col gap-1.5">
        <h1 className="text-[32px] font-extrabold leading-normal text-[#111827]">Resume History</h1>
        <p className="text-sm font-normal text-[#4b5563]">View and track all your resume optimization results</p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <label
          className={`flex h-[42px] w-full items-center gap-2.5 rounded-xl border-[1.5px] bg-white/[0.85] px-3.5 py-2.5 shadow-[0px_2px_4px_0px_rgba(139,92,246,0.08)] backdrop-blur-[6px] md:w-[300px] ${
            disabled ? 'border-[#8b5cf6]/30 opacity-60' : 'border-[#8b5cf6]/20'
          }`}
        >
          <Search className="size-4 shrink-0 text-[#737885]" />
          <input
            type="text"
            placeholder="Search resumes..."
            disabled={disabled}
            className="w-full min-w-0 bg-transparent text-sm font-normal text-[#111827] outline-none placeholder:text-[#737885]"
          />
        </label>

        <button
          type="button"
          disabled={disabled}
          className={`flex items-center gap-3 rounded-[10px] border border-[#e5e7eb] px-3.5 py-2.5 text-sm font-semibold text-[#4b5563] ${
            disabled ? 'bg-white/[0.72] opacity-60' : ''
          }`}
        >
          All Categories
          <ChevronDown className="size-3.5 text-[#4b5563]" />
        </button>
      </div>
    </div>
  );
}

/* -------------------------------- Pagination -------------------------------- */

type AnalysisHistoryPaginationProps = {
  shown: number;
  total: number;
};

// Static "Showing 1-N of M" footer with Previous / Next buttons.
export function AnalysisHistoryPagination({ shown, total }: AnalysisHistoryPaginationProps) {
  return (
    <div className="flex w-full flex-wrap items-center justify-between gap-4">
      <p className="text-sm font-normal text-[#4b5563]">
        Showing 1-{shown} of {total} resumes
      </p>
      <div className="flex items-center gap-3">
        <button
          type="button"
          className="rounded-[10px] border-[1.5px] border-[#e5e7eb] bg-white/[0.72] px-4 py-2.5 text-sm font-semibold text-[#4b5563]"
        >
          ← Previous
        </button>
        <button
          type="button"
          className="rounded-[10px] bg-[#8b5cf6] px-4 py-2.5 text-sm font-bold text-white shadow-[0px_4px_6px_0px_rgba(139,92,246,0.3)] transition-opacity hover:opacity-90"
        >
          Next →
        </button>
      </div>
    </div>
  );
}

/* --------------------------------- Empty state --------------------------------- */

export function AnalysisHistoryEmptyState() {
  return (
    <div className="flex w-full flex-col items-center justify-center gap-8 rounded-3xl px-10 py-[110px] backdrop-blur-[12px]">
      {/* Dashed outer ring -> soft violet disc -> circle-x icon */}
      <div className="flex size-[120px] shrink-0 items-center justify-center rounded-[60px] border-2 border-dashed border-[#8b5cf6]/20 bg-white/90 shadow-[0px_8px_24px_0px_rgba(139,92,246,0.1)]">
        <div className="flex size-20 items-center justify-center rounded-[40px] bg-[#f5f3ff]">
          <CircleX className="size-9 text-[#8b5cf6]" strokeWidth={1.5} />
        </div>
      </div>

      <div className="flex w-full flex-col items-center gap-3 text-center">
        <h2 className="text-2xl font-extrabold leading-normal text-[#111827]">No Resumes Yet</h2>
        <p className="w-full max-w-[460px] text-base font-normal leading-6 text-[#4b5563]">
          Your uploaded resumes and optimization results will appear here. Start by uploading your first resume.
        </p>
      </div>
    </div>
  );
}