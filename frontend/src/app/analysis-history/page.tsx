'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import AnalysisRecordCard, { type AnalysisRecord } from '@/features/analysis-history/components/AnalysisRecordCard';
import {
  AnalysisHistoryBackground,
  AnalysisHistoryEmptyRings,
  AnalysisHistoryHeader,
  AnalysisHistoryPagination,
  AnalysisHistoryEmptyState,
} from '@/features/analysis-history/components/AnalysisHistoryParts';
import { fetchHistoryPage, HistoryAuthError, toAnalysisRecord } from '@/lib/analysisHistory';

// "Showing 1-6 of N resumes" in the Figma frame
const PAGE_SIZE = 6;

export default function AnalysisHistoryPage() {
  const router = useRouter();

  const [records, setRecords] = useState<AnalysisRecord[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  // `loading` is true on first load and on every page change
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Loads one page and stores it. Callers that need the loading indicator
  // (Next / Previous / Try again) go through goToPage.
  const loadPage = useCallback(
    (targetPage: number, signal?: AbortSignal) =>
      fetchHistoryPage(targetPage, PAGE_SIZE, signal)
        .then((data) => {
          setRecords(data.items.map(toAnalysisRecord));
          setTotal(data.total);
          setPage(targetPage);
          setError(null);
        })
        .catch((e) => {
          if (e instanceof DOMException && e.name === 'AbortError') return;
          // Not signed in / session expired: send them to sign in.
          if (e instanceof HistoryAuthError) {
            router.push('/signin');
            return;
          }
          setError(e instanceof Error ? e.message : 'Something went wrong. Please try again.');
        })
        .finally(() => {
          // Don't clear the spinner of a newer request that aborted this one
          if (!signal?.aborted) setLoading(false);
        }),
    [router]
  );

  // First page on mount (`loading` already starts as true)
  useEffect(() => {
    const controller = new AbortController();
    loadPage(1, controller.signal);
    return () => controller.abort();
  }, [loadPage]);

  const goToPage = (targetPage: number) => {
    setLoading(true);
    setError(null);
    loadPage(targetPage);
  };

  const hasRecords = records.length > 0;
  // Figma's empty frame only when loading finished cleanly with nothing to show
  const isEmpty = !loading && !error && total === 0;

  return (
    // DM Sans is the Figma typeface; make sure it's loaded (weights 400-800)
    // e.g. via next/font/google in the root layout.
    <div className="relative flex min-h-screen w-full flex-col overflow-hidden bg-[#f0eeff] pt-20 font-['DM_Sans',sans-serif]">
      <AnalysisHistoryBackground />
      {isEmpty && <AnalysisHistoryEmptyRings />}

      <main className="relative z-10 flex w-full flex-1 flex-col gap-8 px-6 py-[60px] md:px-20">
        <AnalysisHistoryHeader disabled={isEmpty} />

        {error ? (
          <div
            role="alert"
            className="flex flex-col items-start gap-3 rounded-2xl border-[1.5px] border-[#fee2e2] bg-white/[0.72] p-5 backdrop-blur-[12px]"
          >
            <p className="text-sm font-semibold text-[#dc2626]">{error}</p>
            <button
              type="button"
              onClick={() => goToPage(page)}
              className="rounded-[10px] bg-[#8b5cf6] px-4 py-2 text-sm font-bold text-white transition-opacity hover:opacity-90"
            >
              Try again
            </button>
          </div>
        ) : loading && !hasRecords ? (
          // First load: placeholder cards so the layout doesn't jump
          <div className="flex w-full flex-col gap-4" aria-busy="true" aria-label="Loading resume history">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="h-[92px] w-full animate-pulse rounded-2xl border-[1.5px] border-white bg-white/[0.72]"
              />
            ))}
          </div>
        ) : isEmpty ? (
          <AnalysisHistoryEmptyState />
        ) : (
          <>
            <div
              className={`flex w-full flex-col gap-4 transition-opacity ${loading ? 'opacity-60' : 'opacity-100'}`}
            >
              {records.map((record) => (
                <AnalysisRecordCard key={record.id} record={record} />
              ))}
            </div>

            <AnalysisHistoryPagination
              page={page}
              pageSize={PAGE_SIZE}
              shown={records.length}
              total={total}
              loading={loading}
              onPrevious={() => goToPage(page - 1)}
              onNext={() => goToPage(page + 1)}
            />
          </>
        )}
      </main>
    </div>
  );
}
