'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';

import AnalysisRecordCard, { type AnalysisRecord } from '@/features/analysis-history/components/AnalysisRecordCard';
import {
  AnalysisHistoryBackground,
  AnalysisHistoryEmptyRings,
  AnalysisHistoryHeader,
  AnalysisHistoryPagination,
  AnalysisHistoryEmptyState,
  type AnalysisHistorySearchCategory,
} from '@/features/analysis-history/components/AnalysisHistoryParts';
import {
  fetchAllHistory,
  historyDateKey,
  HistoryAuthError,
  MfaRequiredError,
  toAnalysisRecord,
} from '@/lib/analysisHistory';

// "Showing 1-6 of N resumes" in the Figma frame
const PAGE_SIZE = 6;
const HISTORY_FETCH_SIZE = 50;

export default function AnalysisHistoryPage() {
  const router = useRouter();

  const [records, setRecords] = useState<AnalysisRecord[]>([]);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<AnalysisHistorySearchCategory>('all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  // `loading` is true while the history is initially fetched or retried.
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadHistory = useCallback(
    (signal?: AbortSignal) =>
      fetchAllHistory(HISTORY_FETCH_SIZE, signal)
        .then((data) => {
          setRecords(data.map(toAnalysisRecord));
          setPage(1);
          setError(null);
        })
        .catch((e) => {
          if (e instanceof DOMException && e.name === 'AbortError') return;
          // Not signed in / session expired: send them to sign in.
          if (e instanceof MfaRequiredError) {
            router.push('/mfa-challenge');
            return;
          }
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
    loadHistory(controller.signal);
    return () => controller.abort();
  }, [loadHistory]);

  const retryLoad = () => {
    setLoading(true);
    setError(null);
    loadHistory();
  };

  const hasFilters = Boolean(search.trim() || dateFrom || dateTo || category !== 'all');
  const filteredRecords = useMemo(() => {
    const normalizedSearch = search.trim().toLocaleLowerCase();

    return records.filter((record) => {
      const searchMatches =
        !normalizedSearch ||
        (category === 'all' || category === 'filename') &&
          record.filename.toLocaleLowerCase().includes(normalizedSearch) ||
        (category === 'all' || category === 'role') &&
          record.role.toLocaleLowerCase().includes(normalizedSearch) ||
        (category === 'all' || category === 'company') &&
          record.searchableCompanies.some((company) => company.toLocaleLowerCase().includes(normalizedSearch));
      const recordDate = historyDateKey(record.createdAt);
      const fromMatches = !dateFrom || Boolean(recordDate && recordDate >= dateFrom);
      const toMatches = !dateTo || Boolean(recordDate && recordDate <= dateTo);

      return searchMatches && fromMatches && toMatches;
    });
  }, [records, search, category, dateFrom, dateTo]);

  const total = filteredRecords.length;
  const pageCount = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);
  const visibleRecords = filteredRecords.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const updateFilter = (update: () => void) => {
    update();
    setPage(1);
  };

  const hasRecords = records.length > 0;
  // Figma's empty frame only when loading finished cleanly with nothing to show
  const isEmpty = !loading && !error && records.length === 0;

  return (
    // DM Sans is the Figma typeface; make sure it's loaded (weights 400-800)
    // e.g. via next/font/google in the root layout.
    <div className="relative flex min-h-screen w-full flex-col overflow-hidden bg-[#f0eeff] pt-20 font-['DM_Sans',sans-serif]">
      <AnalysisHistoryBackground />
      {isEmpty && <AnalysisHistoryEmptyRings />}

      <main className="relative z-10 flex w-full flex-1 flex-col gap-8 px-6 py-[60px] md:px-20">
        <AnalysisHistoryHeader
          disabled={isEmpty}
          search={search}
          category={category}
          dateFrom={dateFrom}
          dateTo={dateTo}
          hasFilters={hasFilters}
          onSearchChange={(value) => updateFilter(() => setSearch(value))}
          onCategoryChange={(value) => updateFilter(() => setCategory(value))}
          onDateFromChange={(value) => updateFilter(() => setDateFrom(value))}
          onDateToChange={(value) => updateFilter(() => setDateTo(value))}
          onClearFilters={() => {
            setSearch('');
            setCategory('all');
            setDateFrom('');
            setDateTo('');
            setPage(1);
          }}
        />

        {error ? (
          <div
            role="alert"
            className="flex flex-col items-start gap-3 rounded-2xl border-[1.5px] border-[#fee2e2] bg-white/[0.72] p-5 backdrop-blur-[12px]"
          >
            <p className="text-sm font-semibold text-[#dc2626]">{error}</p>
            <button
              type="button"
              onClick={retryLoad}
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
        ) : total === 0 ? (
          <div className="flex flex-col items-center gap-3 rounded-2xl border-[1.5px] border-white bg-white/[0.72] px-6 py-12 text-center backdrop-blur-[12px]">
            <p className="text-base font-bold text-[#111827]">No matching analyses</p>
            <p className="text-sm text-[#4b5563]">Try a different search or adjust the date range.</p>
            <button
              type="button"
              onClick={() => {
                setSearch('');
                setCategory('all');
                setDateFrom('');
                setDateTo('');
                setPage(1);
              }}
              className="rounded-[10px] bg-[#8b5cf6] px-4 py-2 text-sm font-bold text-white transition-opacity hover:opacity-90"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <>
            <div
              className={`flex w-full flex-col gap-4 transition-opacity ${loading ? 'opacity-60' : 'opacity-100'}`}
            >
              {visibleRecords.map((record) => (
                <AnalysisRecordCard key={record.id} record={record} />
              ))}
            </div>

            <AnalysisHistoryPagination
              page={currentPage}
              pageSize={PAGE_SIZE}
              shown={visibleRecords.length}
              total={total}
              loading={loading}
              onPrevious={() => setPage((current) => Math.max(1, current - 1))}
              onNext={() => setPage((current) => Math.min(pageCount, current + 1))}
            />
          </>
        )}
      </main>
    </div>
  );
}
