import Link from 'next/link';
import { FileDown, FileText, Trash2 } from 'lucide-react';

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
  // FIX: strip whatever extension is present instead of assuming `.pdf`,
  // so non-PDF filenames (e.g. `.docx`) don't end up with the original
  // extension baked into the downloaded report name.
  link.download = `${record.filename.replace(/\.[^/.]+$/, '')}_report.txt`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  // Release the object URL now that the download has been triggered,
  // so we don't leak memory for every report a user downloads.
  URL.revokeObjectURL(url);
}

// Score coloring uses inline style objects instead of Tailwind class
// strings so the border/background color renders reliably on every card
// (Tailwind wasn't generating these dynamically-composed classes on this
// page). Box layout — rounded-2xl, border, p-4 — is unchanged either way.

// Maps a 0-100 score to a text color: green for strong scores, indigo for
// middling ones, red for scores that need attention.
function scoreTextColor(score: number) {
  if (score >= 80) return '#16a34a'; // green-600
  if (score >= 65) return '#4f46e5'; // indigo-600
  return '#ef4444'; // red-500
}

// Companion to scoreTextColor — returns the matching background/border
// pair so each metric card's "tint" agrees with its number's color.
function scoreBoxStyle(score: number) {
  if (score >= 80) {
    return { backgroundColor: '#f0fdf4', borderColor: '#dcfce7' }; // green-50 / green-100
  }
  if (score >= 65) {
    return { backgroundColor: '#eef2ff', borderColor: '#e0e7ff' }; // indigo-50 / indigo-100
  }
  return { backgroundColor: '#fef2f2', borderColor: '#fee2e2' }; // red-50 / red-100
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
  // work uniformly across all four cards below.
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
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
      {/* Record header: filename/date on the left, actions on the right */}
      <div className="flex items-start justify-between gap-4 mb-4">
        {/* min-w-0 lets this flex child shrink below its content size, and
            truncate on the filename means a long name ellipsizes instead of
            stretching the row and squeezing the action buttons */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center shrink-0">
            <FileText className="w-5 h-5 text-indigo-500" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-bold text-gray-900 truncate" title={record.filename}>
              {record.filename}
            </p>
            <p className="text-xs text-gray-400 mt-0.5">{record.date}</p>
          </div>
        </div>

        {/* Buttons always have a visible circular border, like the carousel's
            prev/next chips — not just an icon that appears on hover.
            aria-label alongside title so screen readers announce the
            button's purpose, not just mouse-hover users */}
        <div className="flex gap-3 shrink-0">
          <button
            onClick={() => downloadReport(record)}
            className="w-11 h-11 rounded-full border border-gray-200 bg-white flex items-center justify-center text-gray-400 hover:bg-indigo-50 hover:border-indigo-300 hover:text-indigo-600 transition-all"
            title="Download report"
            aria-label={`Download report for ${record.filename}`}
          >
            <FileDown className="w-5 h-5" />
          </button>
          <button
            // Delegate the actual removal (and any "are you sure?" prompt)
            // to the parent — this component just reports which id was
            // requested for deletion.
            onClick={() => onDelete(record.id)}
            className="w-11 h-11 rounded-full border border-gray-200 bg-white flex items-center justify-center text-gray-400 hover:bg-red-50 hover:border-red-300 hover:text-red-600 transition-all"
            title="Delete"
            aria-label={`Delete analysis ${record.filename}`}
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Score metrics: a 4-up grid of color-coded stat cards */}
      <div className="grid grid-cols-4 gap-3 mb-4">
        {metrics.map((m) => (
          <div key={m.label} className="rounded-2xl border p-4" style={scoreBoxStyle(m.score)}>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">{m.label}</p>
            <p className="text-2xl font-extrabold" style={{ color: scoreTextColor(m.score) }}>
              {m.value}
            </p>
          </div>
        ))}
      </div>

      {/* Tags: role, location, company, and contract type as pill badges */}
      <div className="flex flex-wrap gap-2 mb-4">
        {[record.role, record.location, record.company, record.contract].map((tag) => (
          <span key={tag} className="text-xs font-semibold px-3 py-1 rounded-full bg-gray-100 text-gray-500">
            {tag}
          </span>
        ))}
      </div>

      {/* Link to the full breakdown for this specific resume/analysis */}
      <Link
        href={`/dashboard?resume=${record.id}`}
        className="inline-flex items-center gap-2 text-sm font-bold text-indigo-600 hover:text-indigo-700 transition-colors"
      >
        View full results →
      </Link>
    </div>
  );
}