'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

import AnalysisRecordCard, { type AnalysisRecord } from '@/components/AnalysisRecordCard';
import {
  AnalysisSummaryStats,
  AnalysisScoreTrendChart,
  AnalysisHistoryEmptyState,
  DeleteAnalysisModal,
} from '@/components/AnalysisHistoryParts';

// Placeholder data until this is wired up to a real API. Swap this for a
// fetch (e.g. GET /api/analysis-history) and drive `records` from server
// data instead — everything below is derived from `records`, so the rest
// of the page updates automatically once real data flows in.
const initialRecords: AnalysisRecord[] = [
  {
    id: '1',
    filename: 'Resume_v3_Final.pdf',
    date: 'June 14, 2025',
    atsScore: 82,
    jobMatch: 78,
    skillGaps: 3,
    grammarIssues: 0,
    role: 'Software Developer',
    location: 'Metro Manila',
    company: 'Accenture',
    contract: 'Full-time',
  },
  {
    id: '2',
    filename: 'Resume_v2.pdf',
    date: 'June 10, 2025',
    atsScore: 74,
    jobMatch: 65,
    skillGaps: 6,
    grammarIssues: 2,
    role: 'Software Developer',
    location: 'Metro Manila',
    company: 'Globe Telecom',
    contract: 'Full-time',
  },
  {
    id: '3',
    filename: 'Resume_v1.pdf',
    date: 'June 5, 2025',
    atsScore: 61,
    jobMatch: 48,
    skillGaps: 11,
    grammarIssues: 5,
    role: 'Software Developer',
    location: 'Metro Manila',
    company: 'Concentrix',
    contract: 'Full-time',
  },
];

export default function AnalysisHistoryPage() {
  const [records, setRecords] = useState<AnalysisRecord[]>(initialRecords);
  // ID of the record pending delete confirmation; null when the modal is closed
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

  const hasRecords = records.length > 0;

  // Summary stats for the top card grid — derived from `records`, so they
  // stay in sync automatically as records are added or removed.
  const best = hasRecords ? Math.max(...records.map((r) => r.atsScore)) : 0;
  const latest = hasRecords ? records[0].atsScore : 0;
  const improvement = hasRecords ? latest - records[records.length - 1].atsScore : 0;

  // Reverse so the trend chart reads oldest -> newest, left to right.
  const chartData = records
    .slice()
    .reverse()
    .map((r) => ({ name: r.filename.replace('.pdf', ''), score: r.atsScore }));

  const recordPendingDelete = records.find((r) => r.id === pendingDeleteId) ?? null;

  // Removes the record locally. Replace with a DELETE call to the backend
  // once available, and only update state after a successful response.
  const confirmDelete = () => {
    if (!pendingDeleteId) return;
    setRecords((prev) => prev.filter((r) => r.id !== pendingDeleteId));
    setPendingDeleteId(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-20 px-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <Link
          href="/dashboard"
          className="flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-indigo-600 py-2.5"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>
      </div>

      {/* Content column, capped at max-w-7xl to line up with the navbar/logo above */}
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">My Analysis History</h1>
          <p className="text-sm text-gray-400 mt-1">Track how your resume has improved over time.</p>
        </div>

        {!hasRecords ? (
          <AnalysisHistoryEmptyState />
        ) : (
          <>
            <AnalysisSummaryStats total={records.length} best={best} latest={latest} improvement={improvement} />

            <AnalysisScoreTrendChart data={chartData} />

            {/* One card per past analysis, newest first (records[0] is treated as "latest" above) */}
            <div className="space-y-4">
              {records.map((record) => (
                <AnalysisRecordCard key={record.id} record={record} onDelete={setPendingDeleteId} />
              ))}
            </div>

            <p className="text-center text-xs text-gray-400 mt-8">
              Analysis records are automatically deleted after 90 days.
            </p>
          </>
        )}
      </div>

      {/* Rendered once at page level; opens whenever pendingDeleteId is set */}
      <DeleteAnalysisModal
        record={recordPendingDelete}
        onClose={() => setPendingDeleteId(null)}
        onConfirm={confirmDelete}
      />
    </div>
  );
}