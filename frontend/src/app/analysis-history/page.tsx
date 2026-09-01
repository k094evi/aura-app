'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Download, Share2, Check } from 'lucide-react';

import AnalysisRecordCard, { type AnalysisRecord } from '@/features/analysis-history/components/AnalysisRecordCard';
import {
  AnalysisSummaryStats,
  AnalysisScoreTrendChart,
  AnalysisHistoryEmptyState,
  DeleteAnalysisModal,
} from '@/features/analysis-history/components/AnalysisHistoryParts';

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
  // Brief "Copied"/"Exported" feedback on the action buttons, matching the
  // Save Changes -> Saved pattern used on the profile page.
  const [shareCopied, setShareCopied] = useState(false);

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

  // Exports a single combined report covering every record. Replace with
  // a real server-generated PDF/CSV export once that endpoint exists.
  const handleExportReport = () => {
    const content = records
      .map(
        (r) =>
          `${r.filename} (${r.date})\nATS Score: ${r.atsScore}/100  Job Match: ${r.jobMatch}%  Skill Gaps: ${r.skillGaps}  Grammar Issues: ${r.grammarIssues}\n`
      )
      .join('\n');
    const blob = new Blob([`RESUME ANALYSIS HISTORY\n========================\n\n${content}`], {
      type: 'text/plain',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'analysis_history_report.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Copies the current page URL so it can be shared. Swap for a proper
  // shareable/read-only link once the backend supports one.
  const handleShareResults = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setShareCopied(true);
      setTimeout(() => setShareCopied(false), 2000);
    } catch {
      // Clipboard access can fail (e.g. insecure context) — fail silently
      // rather than blocking the rest of the page.
    }
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-hidden bg-[#0c0a14] pt-20">
      {/* Ambient background orbs */}
      <div className="pointer-events-none absolute -left-[150px] top-[120px] size-[600px] rounded-full bg-fuchsia-600/30 blur-[120px]" />
      <div className="pointer-events-none absolute -right-[200px] top-[80px] size-[650px] rounded-full bg-violet-600/25 blur-[130px]" />
      <div className="pointer-events-none absolute left-[35%] top-[850px] size-[550px] rounded-full bg-cyan-500/20 blur-[120px]" />

      {/* Sub-header: back link + export/share actions */}
      <div className="relative z-10 flex w-full shrink-0 flex-col gap-4 px-8 pb-8 pt-5 sm:flex-row sm:items-center sm:justify-between md:px-16">
        <Link
          href="/dashboard"
          className="flex items-center gap-2 text-sm font-semibold text-fuchsia-500 transition-colors hover:text-fuchsia-400"
        >
          <ArrowLeft className="size-4" />
          Back to Dashboard
        </Link>

        <div className="flex items-start gap-3">
          <button
            onClick={handleExportReport}
            className="flex items-center gap-1.5 rounded-[10px] border border-white/[0.07] bg-[#151221]/70 px-4.5 py-2.5 text-[13px] font-semibold text-white shadow-[0px_8px_20px_0px_rgba(0,0,0,0.25)] backdrop-blur-[20px] transition-colors hover:bg-white/[0.06]"
          >
            <Download className="size-4" />
            Export Report
          </button>
          <button
            onClick={handleShareResults}
            className="flex items-center gap-1.5 rounded-[10px] bg-gradient-to-r from-[#8b5cf6] to-[#d946ef] px-4.5 py-2.5 text-[13px] font-bold text-white shadow-[0px_4px_6px_0px_rgba(139,92,246,0.25)] transition-opacity hover:opacity-90"
          >
            {shareCopied ? <Check className="size-4" /> : <Share2 className="size-4" />}
            {shareCopied ? 'Link Copied' : 'Share Results'}
          </button>
        </div>
      </div>

      {/* Workspace */}
      <div className="relative z-10 flex w-full flex-col gap-8 px-8 pb-16 md:px-16">
        <div className="flex flex-col gap-2.5">
          <h1 className="text-[32px] font-extrabold leading-normal text-white">My Analysis History</h1>
          <p className="text-base font-normal text-white/60">Track how your resume has improved over time.</p>
        </div>

        {!hasRecords ? (
          <AnalysisHistoryEmptyState />
        ) : (
          <>
            <AnalysisSummaryStats total={records.length} best={best} latest={latest} improvement={improvement} />

            <AnalysisScoreTrendChart data={chartData} />

            {/* One card per past analysis, newest first (records[0] is treated as "latest" above) */}
            <div className="flex flex-col gap-5">
              {records.map((record) => (
                <AnalysisRecordCard key={record.id} record={record} onDelete={setPendingDeleteId} />
              ))}
            </div>

            <p className="pt-3 text-center text-[13px] text-white/40">
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