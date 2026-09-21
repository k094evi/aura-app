'use client';

import Link from 'next/link';
import { Download, FileText } from 'lucide-react';

export type AnalysisStatus = 'Optimized' | 'Needs Review' | 'Draft';

export type AnalysisRecord = {
  id: string;
  filename: string;
  date: string;
  // Target role shown as the card's bold subtitle (e.g. "Senior Product Manager")
  role: string;
  // Company pills rendered on the card (Figma shows at most two)
  companies: string[];
  // Count for the purple "+N more" pill; 0 hides the pill
  moreCompanies: number;
  atsScore: number;
  status: AnalysisStatus;
};

// Builds a simple plain-text report and downloads it as a .txt file
// in the browser (no server round-trip needed).
export function downloadReport(record: AnalysisRecord) {
  const companies =
    record.companies.join(', ') + (record.moreCompanies > 0 ? ` (+${record.moreCompanies} more)` : '');

  const content = `RESUME ANALYSIS REPORT
========================
File: ${record.filename}
Date: ${record.date}

Target Role: ${record.role}
Companies: ${companies}

ATS Score: ${record.atsScore}%
Status: ${record.status}
`;

  // In-memory Blob + temporary object URL so the browser can trigger a
  // download without ever hitting a server.
  const blob = new Blob([content], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  // Strip whatever extension is present instead of assuming `.pdf`.
  link.download = `${record.filename.replace(/\.[^/.]+$/, '')}_report.txt`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  // Release the object URL now that the download has been triggered.
  URL.revokeObjectURL(url);
}

/* ------------------------------ Color tokens ------------------------------ */

// Colors are inline style objects (not composed Tailwind classes) so they
// render reliably on every card, same approach the previous version used.

type Tone = { bg: string; border: string; text: string };

const TONES: Record<'green' | 'amber' | 'red', Tone> = {
  green: { bg: '#ecfdf5', border: 'rgba(16,185,129,0.2)', text: '#10b981' },
  amber: { bg: '#fef9c3', border: 'rgba(161,98,7,0.2)', text: '#a16207' },
  red: { bg: '#fee2e2', border: 'rgba(220,38,38,0.2)', text: '#dc2626' },
};

// ATS score badge: green (strong), amber (middling), red (weak).
function scoreTone(score: number): Tone {
  if (score >= 80) return TONES.green;
  if (score >= 60) return TONES.amber;
  return TONES.red;
}

// Status pill colors per the Figma. "Draft" is neutral grey even though its
// score badge is red, so status is styled independently of the score.
const STATUS_STYLES: Record<AnalysisStatus, { bg: string; text: string }> = {
  Optimized: { bg: '#ecfdf5', text: '#10b981' },
  'Needs Review': { bg: '#fef9c3', text: '#a16207' },
  Draft: { bg: '#f3f4f6', text: '#4b5563' },
};

// Word files get the blue file icon, everything else (PDF) gets the red one.
function fileIconStyle(filename: string) {
  return /\.docx?$/i.test(filename)
    ? { circleBg: '#dbeafe', icon: '#3b82f6' }
    : { circleBg: '#fee2e2', icon: '#ef4444' };
}

/* --------------------------------- Card --------------------------------- */

type AnalysisRecordCardProps = {
  record: AnalysisRecord;
};

export default function AnalysisRecordCard({ record }: AnalysisRecordCardProps) {
  const score = scoreTone(record.atsScore);
  const status = STATUS_STYLES[record.status];
  const fileIcon = fileIconStyle(record.filename);

  return (
    <div className="flex w-full flex-col items-start gap-5 rounded-2xl border-[1.5px] border-white bg-white/[0.72] p-5 shadow-[0px_10px_30px_0px_rgba(17,24,39,0.03)] backdrop-blur-[12px] lg:flex-row lg:items-center lg:justify-between lg:gap-0">
      {/* Left: file icon, filename, date */}
      <div className="flex w-full min-w-0 shrink-0 items-center gap-4 lg:w-[300px]">
        <div
          className="flex size-12 shrink-0 items-center justify-center rounded-3xl"
          style={{ backgroundColor: fileIcon.circleBg }}
        >
          <FileText className="size-[22px]" style={{ color: fileIcon.icon }} />
        </div>
        <div className="flex min-w-0 flex-col gap-1">
          <p className="truncate text-base font-bold text-[#111827]" title={record.filename}>
            {record.filename}
          </p>
          <p className="text-[13px] font-normal text-[#9ca3af]">{record.date}</p>
        </div>
      </div>

      {/* Middle: target role + company pills */}
      <div className="flex min-w-0 flex-col gap-2 lg:flex-1">
        <p className="text-sm font-bold text-[#111827]">{record.role}</p>
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

      {/* ATS score badge. Fixed-width container so badges line up column-wise
          even though the status pill next to it varies in width. */}
      <div className="flex shrink-0 items-start justify-center lg:w-[120px]">
        <div
          className="flex flex-col items-center justify-center gap-0.5 rounded-[10px] border px-3.5 py-1.5"
          style={{ backgroundColor: score.bg, borderColor: score.border }}
        >
          <p className="text-lg font-extrabold leading-normal" style={{ color: score.text }}>
            {record.atsScore}%
          </p>
          <p className="text-[9px] font-bold uppercase leading-normal text-[#9ca3af]">ATS Score</p>
        </div>
      </div>

      {/* Right: status pill, download, view results */}
      <div className="flex shrink-0 flex-wrap items-center gap-6">
        <span
          className="whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-bold"
          style={{ backgroundColor: status.bg, color: status.text }}
        >
          {record.status}
        </span>

        <button
          type="button"
          onClick={() => downloadReport(record)}
          className="flex size-9 shrink-0 items-center justify-center rounded-[10px] border-[1.5px] border-[#e5e7eb] bg-white/90 text-[#4b5563] transition-colors hover:border-[#8b5cf6]/40 hover:text-[#8b5cf6]"
          title="Download report"
          aria-label={`Download report for ${record.filename}`}
        >
          <Download className="size-[18px]" />
        </button>

        {/* Links to the full breakdown for this specific resume/analysis */}
        <Link
          href={`/dashboard?resume=${record.id}`}
          className="whitespace-nowrap rounded-[10px] border-[1.5px] border-[#8b5cf6]/30 bg-[#8b5cf6]/[0.08] px-4 py-2 text-[13px] font-medium text-[#8b5cf6] shadow-[0px_1px_2px_0px_rgba(17,24,39,0.02)] transition-colors hover:bg-[#8b5cf6]/15"
        >
          View Results →
        </Link>
      </div>
    </div>
  );
}