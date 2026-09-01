import Link from 'next/link';
import { ChevronRight, Download, Trash2 } from 'lucide-react';

export type AnalysisRecord = {
  id: string;
  filename: string;
  date: string;
  atsScore: number;
  jobMatch: number;
  skillGaps: number;
  grammarIssues: number;
  role: string;
  location: string;
  company: string;
  contract: string;
};

// Builds a simple plain-text report and downloads it as a .txt file
// in the browser (no server round-trip needed).
export function downloadReport(record: AnalysisRecord) {
  const content = `RESUME ANALYSIS REPORT
========================
File: ${record.filename}
Date: ${record.date}

ATS Score: ${record.atsScore}/100
Job Match: ${record.jobMatch}%
Skill Gaps: ${record.skillGaps}
Grammar Issues: ${record.grammarIssues}

Role: ${record.role}
Location: ${record.location}
Company: ${record.company}
Contract: ${record.contract}
`;

  // Create an in-memory Blob and a temporary object URL so the browser
  // can trigger a download without ever hitting a server.
  const blob = new Blob([content], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);

  // A hidden, throwaway <a> is the standard trick for programmatically
  // triggering a file download from a Blob URL.
  const link = document.createElement('a');
  link.href = url;
  // Strip whatever extension is present instead of assuming `.pdf`, so
  // non-PDF filenames (e.g. `.docx`) don't end up with the original
  // extension baked into the downloaded report name.
  link.download = `${record.filename.replace(/\.[^/.]+$/, '')}_report.txt`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  // Release the object URL now that the download has been triggered, so
  // we don't leak memory for every report a user downloads.
  URL.revokeObjectURL(url);
}

// Score coloring uses inline style objects instead of Tailwind class
// strings so the border/background color renders reliably on every card
// (Tailwind wasn't generating these dynamically-composed classes on this
// page). Box layout — rounded-2xl, border, p-4/[18px] — is unchanged either way.
//
// Three tiers, matching the Figma design's metric-badge coloring:
// emerald (strong), violet (middling), amber (needs attention).

function scoreTextColor(score: number) {
  if (score >= 80) return '#10b981'; // emerald-500
  if (score >= 65) return '#a78bfa'; // violet-400
  return '#ef4444'; // red-500
}

function scoreBoxStyle(score: number) {
  if (score >= 80) {
    return { backgroundColor: 'rgba(16,185,129,0.1)', borderColor: 'rgba(16,185,129,0.2)' };
  }
  if (score >= 65) {
    return { backgroundColor: 'rgba(139,92,246,0.1)', borderColor: 'rgba(139,92,246,0.2)' };
  }
  return { backgroundColor: 'rgba(239,68,68,0.1)', borderColor: 'rgba(239,68,68,0.2)' };
}

type AnalysisRecordCardProps = {
  record: AnalysisRecord;
  // Delegated up to the parent, which owns the records list and any
  // delete-confirmation UI — this card only needs to report the id.
  onDelete: (id: string) => void;
};

export default function AnalysisRecordCard({ record, onDelete }: AnalysisRecordCardProps) {
  // Each metric gets its own derived "score" (0-100 scale) purely for
  // color-coding purposes, even though Skill Gaps and Grammar Issues are
  // raw counts, not percentages — this lets scoreBoxStyle/scoreTextColor
  // grade each badge independently, so a card can show e.g. a strong ATS
  // Score in green right next to a weaker Skill Gaps count in amber.
  const metrics = [
    { label: 'ATS Score', value: `${record.atsScore}/100`, score: record.atsScore },
    { label: 'Job Match', value: `${record.jobMatch}%`, score: record.jobMatch },
    {
      label: 'Skill Gaps',
      value: record.skillGaps,
      score: record.skillGaps <= 3 ? 90 : record.skillGaps <= 7 ? 70 : 50,
    },
    {
      label: 'Grammar Issues',
      value: record.grammarIssues,
      score: record.grammarIssues === 0 ? 90 : record.grammarIssues <= 2 ? 70 : 50,
    },
  ];

  return (
    <div className="w-full rounded-3xl border border-white/[0.07] bg-[#151221]/70 p-8 shadow-[0px_16px_32px_0px_rgba(0,0,0,0.25)] backdrop-blur-[20px]">
      {/* Record header: filename/date on the left, actions on the right */}
      <div className="mb-6 flex items-center justify-between gap-4">
        {/* min-w-0 lets this flex child shrink below its content size, and
            truncate on the filename means a long name ellipsizes instead of
            stretching the row and squeezing the action buttons */}
        <div className="min-w-0">
          <p className="truncate text-lg font-bold text-white" title={record.filename}>
            {record.filename}
          </p>
          <p className="mt-1.5 text-[13px] font-normal text-white/40">{record.date}</p>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <button
            onClick={() => downloadReport(record)}
            className="rounded-lg border border-white/[0.08] bg-white/[0.04] p-2 text-white/60 transition-colors hover:border-fuchsia-400/30 hover:text-fuchsia-400"
            title="Download report"
            aria-label={`Download report for ${record.filename}`}
          >
            <Download className="size-4" />
          </button>
          <button
            // Delegate the actual removal (and any "are you sure?" prompt)
            // to the parent — this component just reports which id was
            // requested for deletion.
            onClick={() => onDelete(record.id)}
            className="rounded-lg border border-white/[0.08] bg-white/[0.04] p-2 text-white/60 transition-colors hover:border-red-400/30 hover:text-red-400"
            title="Delete"
            aria-label={`Delete analysis ${record.filename}`}
          >
            <Trash2 className="size-4" />
          </button>
        </div>
      </div>

      {/* Score metrics: a 4-up grid of color-coded stat badges */}
      <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {metrics.map((m) => (
          <div key={m.label} className="flex flex-col gap-2 rounded-2xl border p-[18px]" style={scoreBoxStyle(m.score)}>
            <p className="text-[10px] font-extrabold uppercase tracking-wide text-white/40">{m.label}</p>
            <p className="text-2xl font-extrabold" style={{ color: scoreTextColor(m.score) }}>
              {m.value}
            </p>
          </div>
        ))}
      </div>

      {/* Tags: role, location, company, and contract type as pill badges */}
      <div className="mb-6 flex flex-wrap gap-2">
        {[record.role, record.location, record.company, record.contract].map((tag) => (
          <span
            key={tag}
            className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs font-semibold text-white/60"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Link to the full breakdown for this specific resume/analysis */}
      <Link
        href={`/dashboard?resume=${record.id}`}
        className="inline-flex items-center gap-1 text-sm font-bold text-fuchsia-500 transition-colors hover:text-fuchsia-400"
      >
        View full results
        <ChevronRight className="size-3.5" />
      </Link>
    </div>
  );
}