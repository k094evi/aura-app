// src/lib/analysisHistory.ts
//
// Maps the backend's history rows to the props AnalysisRecordCard renders.

import type { AnalysisRecord, AnalysisStatus } from '@/features/analysis-history/components/AnalysisRecordCard';
import type { AnalysisHistoryItem, AnalysisHistoryPage } from '@/types/analysis';

// Same thresholds the original Figma data followed:
// 80+ Optimized, 60-79 Needs Review, below 60 Draft.
export function statusFromScore(score: number): AnalysisStatus {
  if (score >= 80) return 'Optimized';
  if (score >= 60) return 'Needs Review';
  return 'Draft';
}

// "Oct 15, 2026"
export function formatHistoryDate(iso: string | null): string {
  if (!iso) return '';
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export function historyDateKey(iso: string | null): string {
  if (!iso) return '';
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '';

  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${date.getFullYear()}-${month}-${day}`;
}

// The card shows at most two company pills plus a "+N more" pill.
const VISIBLE_COMPANIES = 2;

export function toAnalysisRecord(item: AnalysisHistoryItem): AnalysisRecord {
  // Prefer the companies the user targeted; otherwise show who matched.
  const pool = item.target_companies?.length ? item.target_companies : item.matched_companies ?? [];
  const companies = Array.from(new Set(pool.map((c) => c.trim()).filter(Boolean)));
  const searchableCompanies = Array.from(
    new Set([...(item.target_companies ?? []), ...(item.matched_companies ?? [])].map((c) => c.trim()).filter(Boolean))
  );

  const score = Math.round(item.ats_score ?? 0);

  return {
    id: item.id,
    filename: item.filename,
    date: formatHistoryDate(item.created_at),
    createdAt: item.created_at,
    role: item.target_job || 'General analysis',
    companies: companies.slice(0, VISIBLE_COMPANIES),
    searchableCompanies,
    moreCompanies: Math.max(0, companies.length - VISIBLE_COMPANIES),
    atsScore: score,
    status: statusFromScore(score),
  };
}

// Thrown when the session is missing/expired so callers can redirect to sign-in.
export class HistoryAuthError extends Error {}

// Thrown when the session is valid but 2FA hasn't been completed yet (backend 403).
export class MfaRequiredError extends HistoryAuthError {}

// GET /api/analysis-history (through the Next.js proxy, which adds the auth cookie)
export async function fetchHistoryPage(
  page: number,
  pageSize: number,
  signal?: AbortSignal
): Promise<AnalysisHistoryPage> {
  const res = await fetch(`/api/analysis-history?page=${page}&page_size=${pageSize}`, {
    signal,
    cache: 'no-store',
  });

  if (res.status === 403) {
    const err = await res.json().catch(() => null);
    if (typeof err?.detail === 'string' && err.detail.includes('Two-factor')) {
      throw new MfaRequiredError();
    }
    throw new HistoryAuthError();
  }
  if (res.status === 401) throw new HistoryAuthError();
  if (!res.ok) {
    const err = await res.json().catch(() => null);
    throw new Error(err?.detail ?? "We couldn't load your resume history. Please try again.");
  }
  return (await res.json()) as AnalysisHistoryPage;
}

export async function fetchAllHistory(pageSize: number, signal?: AbortSignal): Promise<AnalysisHistoryItem[]> {
  const items: AnalysisHistoryItem[] = [];
  let page = 1;
  let total = 0;

  do {
    const result = await fetchHistoryPage(page, pageSize, signal);
    items.push(...result.items);
    total = result.total;

    if (result.items.length === 0 && items.length < total) {
      throw new Error("We couldn't load your complete resume history. Please try again.");
    }

    page += 1;
  } while (items.length < total);

  return items;
}
