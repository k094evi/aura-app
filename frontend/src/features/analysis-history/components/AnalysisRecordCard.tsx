'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Download, FileText, Loader2 } from 'lucide-react';

import type { AnalysisResult } from '@/types/analysis';
import { generateReportPDF } from '@/lib/exportReport';
import { getStoredUser } from '@/lib/auth';

export type AnalysisStatus = 'Optimized' | 'Needs Review' | 'Draft';

export type AnalysisRecord = {
  id: string;
  filename: string;
  date: string;
  // Target role shown as the card's bold subtitle.
  role: string;
  // Company pills rendered on the card.
  companies: string[];
  // Count for the "+N more" pill.
  moreCompanies: number;
  atsScore: number;
  status: AnalysisStatus;
};

/* ------------------------------ Color tokens ------------------------------ */

type Tone = {
  bg: string;
  border: string;
  text: string;
};

const TONES: Record<'green' | 'amber' | 'red', Tone> = {
  green: {
    bg: '#ecfdf5',
    border: 'rgba(16,185,129,0.2)',
    text: '#10b981',
  },
  amber: {
    bg: '#fef9c3',
    border: 'rgba(161,98,7,0.2)',
    text: '#a16207',
  },
  red: {
    bg: '#fee2e2',
    border: 'rgba(220,38,38,0.2)',
    text: '#dc2626',
  },
};

// ATS score badge colors.
function scoreTone(score: number): Tone {
  if (score >= 80) return TONES.green;
  if (score >= 60) return TONES.amber;
  return TONES.red;
}

// Status pill colors.
const STATUS_STYLES: Record<
  AnalysisStatus,
  { bg: string; text: string }
> = {
  Optimized: {
    bg: '#ecfdf5',
    text: '#10b981',
  },
  'Needs Review': {
    bg: '#fef9c3',
    text: '#a16207',
  },
  Draft: {
    bg: '#f3f4f6',
    text: '#4b5563',
  },
};

// Word files get a blue icon, PDF gets a red icon.
function fileIconStyle(filename: string) {
  return /\.docx?$/i.test(filename)
    ? { circleBg: '#dbeafe', icon: '#3b82f6' }
    : { circleBg: '#fee2e2', icon: '#ef4444' };
}

/* --------------------------------- Card --------------------------------- */

type AnalysisRecordCardProps = {
  record: AnalysisRecord;
};

export default function AnalysisRecordCard({
  record,
}: AnalysisRecordCardProps) {
  const score = scoreTone(record.atsScore);
  const status = STATUS_STYLES[record.status];
  const fileIcon = fileIconStyle(record.filename);

  // Prevent multiple PDF exports at the same time.
  const [isExporting, setIsExporting] = useState(false);

  // Fetch the complete saved analysis and generate the same PDF
  // used by the DashboardHeader.
  const handleExport = async () => {
    if (isExporting) return;

    setIsExporting(true);

    try {
      // Get the complete analysis from the backend.
      const response = await fetch(
        `/api/analysis-history/${encodeURIComponent(record.id)}`,
        {
          method: 'GET',
          cache: 'no-store',
        }
      );

      if (!response.ok) {
        const error = await response.json().catch(() => null);

        throw new Error(
          error?.detail ?? "We couldn't load this saved analysis."
        );
      }

      // Convert the saved response into the same AnalysisResult
      // shape expected by generateReportPDF().
      const savedAnalysis = (await response.json()) as AnalysisResult;

      // Generate the exact same PDF function used by DashboardHeader.
      await generateReportPDF(savedAnalysis, getStoredUser());
    } catch (error) {
      console.error('Failed to generate report PDF:', error);

      // Simple user-facing error.
      alert(
        error instanceof Error
          ? error.message
          : "We couldn't generate the PDF. Please try again."
      );
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="flex w-full flex-col items-start gap-5 rounded-2xl border-[1.5px] border-white bg-white/[0.72] p-5 shadow-[0px_10px_30px_0px_rgba(17,24,39,0.03)] backdrop-blur-[12px] lg:flex-row lg:items-center lg:justify-between lg:gap-0">
      {/* Left: file icon, filename, date */}
      <div className="flex w-full min-w-0 shrink-0 items-center gap-4 lg:w-[300px]">
        <div
          className="flex size-12 shrink-0 items-center justify-center rounded-3xl"
          style={{ backgroundColor: fileIcon.circleBg }}
        >
          <FileText
            className="size-[22px]"
            style={{ color: fileIcon.icon }}
          />
        </div>

        <div className="flex min-w-0 flex-col gap-1">
          <p
            className="truncate text-base font-bold text-[#111827]"
            title={record.filename}
          >
            {record.filename}
          </p>

          <p className="text-[13px] font-normal text-[#9ca3af]">
            {record.date}
          </p>
        </div>
      </div>

      {/* Middle: target role + company pills */}
      <div className="flex min-w-0 flex-col gap-2 lg:flex-1">
        <p className="text-sm font-bold text-[#111827]">
          {record.role}
        </p>

        <div className="flex flex-wrap gap-2">
          {record.companies.map((company) => (
            <span
              key={company}
              className="rounded-full border border-[#e5e7eb] bg-[#f3f4f6] px-2.5 py-1 text-[11px] font-semibold text-[#4b5563]"
            >
              {company}
            </span>
          ))}

          {record.moreCompanies > 0 && (
            <span className="flex items-center justify-center rounded-full bg-[#8b5cf6]/10 px-2.5 py-[3px] text-[11px] font-medium text-[#8b5cf6]">
              +{record.moreCompanies} more
            </span>
          )}
        </div>
      </div>

      {/* ATS score badge */}
      <div className="flex shrink-0 items-start justify-center lg:w-[120px]">
        <div
          className="flex flex-col items-center justify-center gap-0.5 rounded-[10px] border px-3.5 py-1.5"
          style={{
            backgroundColor: score.bg,
            borderColor: score.border,
          }}
        >
          <p
            className="text-lg font-extrabold leading-normal"
            style={{ color: score.text }}
          >
            {record.atsScore}%
          </p>

          <p className="text-[9px] font-bold uppercase leading-normal text-[#9ca3af]">
            ATS Score
          </p>
        </div>
      </div>

      {/* Right: status pill, download, view results */}
      <div className="flex shrink-0 flex-wrap items-center gap-6">
        <span
          className="whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-bold"
          style={{
            backgroundColor: status.bg,
            color: status.text,
          }}
        >
          {record.status}
        </span>

        {/* Export PDF button */}
        <button
          type="button"
          onClick={handleExport}
          disabled={isExporting}
          className="flex size-9 shrink-0 items-center justify-center rounded-[10px] border-[1.5px] border-[#e5e7eb] bg-white/90 text-[#4b5563] transition-colors hover:border-[#8b5cf6]/40 hover:text-[#8b5cf6] disabled:cursor-not-allowed disabled:opacity-60"
          title={isExporting ? 'Exporting PDF...' : 'Export PDF'}
          aria-label={`Export PDF for ${record.filename}`}
        >
          {isExporting ? (
            <Loader2 className="size-[18px] animate-spin" />
          ) : (
            <Download className="size-[18px]" />
          )}
        </button>

        {/* Open the full dashboard for this analysis */}
        <Link
          href={`/analysis-history/${record.id}`}
          className="whitespace-nowrap rounded-[10px] border-[1.5px] border-[#8b5cf6]/30 bg-[#8b5cf6]/[0.08] px-4 py-2 text-[13px] font-medium text-[#8b5cf6] shadow-[0px_1px_2px_0px_rgba(17,24,39,0.02)] transition-colors hover:bg-[#8b5cf6]/15"
        >
          View Results →
        </Link>
      </div>
    </div>
  );
}