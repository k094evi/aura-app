'use client';

import { useEffect } from 'react';
import { Award, Files, Target, TrendingDown, TrendingUp, X, FileText } from 'lucide-react';
import Link from 'next/link';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import type { AnalysisRecord } from './AnalysisRecordCard';

/* ---------------------------- Summary stats ---------------------------- */

type AnalysisSummaryStatsProps = {
  total: number;
  best: number;
  latest: number;
  improvement: number;
};

// 4-card stat grid shown above the trend chart. Purely presentational —
// the caller (page.tsx) is responsible for computing total/best/latest/
// improvement from the record list.
export function AnalysisSummaryStats({ total, best, latest, improvement }: AnalysisSummaryStatsProps) {
  const stats = [
    { label: 'Total Analyses', value: total, suffix: '', icon: Files },
    { label: 'Best ATS Score', value: best, suffix: '/100', icon: Award },
    { label: 'Latest Score', value: latest, suffix: '/100', icon: Target },
    {
      // Sign is added manually since a plain positive number reads as
      // ambiguous here (e.g. "5" vs "+5"); negative numbers already carry
      // their own minus sign.
      label: 'Score Improvement',
      value: `${improvement >= 0 ? '+' : ''}${improvement}`,
      suffix: '',
      icon: improvement >= 0 ? TrendingUp : TrendingDown,
    },
  ];

  return (
    <div className="grid grid-cols-4 gap-4 mb-6">
      {stats.map((m) => (
        <div key={m.label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center shrink-0">
              <m.icon className="w-5 h-5 text-indigo-500" />
            </div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{m.label}</p>
          </div>
          <p className="text-3xl font-extrabold text-gray-900">
            {m.value}
            <span className="text-base font-semibold text-gray-400">{m.suffix}</span>
          </p>
        </div>
      ))}
    </div>
  );
}

/* ---------------------------- Score trend chart ---------------------------- */

type AnalysisScoreTrendChartProps = {
  data: { name: string; score: number }[];
};

// Line chart of ATS score over time. Expects `data` already ordered
// oldest -> newest (page.tsx handles the reversal before passing it in).
export function AnalysisScoreTrendChart({ data }: AnalysisScoreTrendChartProps) {
  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 mb-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center">
          <TrendingUp className="w-5 h-5 text-indigo-500" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">ATS Score Trend</h2>
          <p className="text-sm text-gray-400">Your progress across all submissions</p>
        </div>
      </div>
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
            <XAxis
              dataKey="name"
              fontSize={11}
              fontWeight={700}
              tick={{ fill: '#9ca3af' }}
              axisLine={false}
              tickLine={false}
            />
            {/* Score axis is fixed to 50-100 rather than auto-scaling, so
                small score changes between analyses don't get visually
                exaggerated by the chart rescaling itself. */}
            <YAxis
              domain={[50, 100]}
              fontSize={11}
              fontWeight={700}
              tick={{ fill: '#9ca3af' }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{
                borderRadius: '12px',
                border: 'none',
                boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                fontSize: '12px',
                fontWeight: 700,
              }}
            />
            <Line
              type="monotone"
              dataKey="score"
              stroke="#6366f1"
              strokeWidth={3}
              dot={{ fill: '#6366f1', r: 5 }}
              activeDot={{ r: 7 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

/* ---------------------------- Empty state ---------------------------- */

export function AnalysisHistoryEmptyState() {
  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-12 text-center">
      <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
        <FileText className="w-7 h-7 text-indigo-400" />
      </div>
      <h2 className="text-lg font-bold text-gray-900 mb-1">No analyses yet</h2>
      <p className="text-sm text-gray-400 mb-6">
        Upload a resume to see your ATS score and analysis history here.
      </p>
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl font-bold text-sm hover:bg-indigo-700 transition-colors"
      >
        Upload a resume
      </Link>
    </div>
  );
}

/* ---------------------------- Delete modal ---------------------------- */

type DeleteAnalysisModalProps = {
  record: AnalysisRecord | null;
  onClose: () => void;
  onConfirm: () => void;
};

// Confirmation dialog for deleting a single analysis record. Controlled by
// `record`: rendering nothing when null (closed) and the confirm prompt
// for that record when set. The caller owns the "which id is pending
// delete" state — this component only renders/closes/confirms.
//
// Actions: the Delete button confirms the deletion; the X icon, backdrop
// click, and Escape all back out via onClose.
//
// Note: the Delete button and its wrapping alignment div use inline
// `style` instead of Tailwind utility classes (`bg-red-600`,
// `flex justify-end`) to sidestep purge/JIT setups where dynamically
// added classes don't make it into the generated CSS.
export function DeleteAnalysisModal({ record, onClose, onConfirm }: DeleteAnalysisModalProps) {
  const open = record !== null;

  // Close on Escape while open.
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, onClose]);

  if (!open || !record) return null;

  return (
    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="delete-analysis-title"
        className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between mb-4">
          <h3 id="delete-analysis-title" className="text-base font-bold text-gray-900">
            Delete this analysis?
          </h3>
          <button onClick={onClose} aria-label="Close dialog" className="text-gray-400 hover:text-gray-600">
            <X className="w-4 h-4" />
          </button>
        </div>
        <p className="text-sm text-gray-500">
          This will permanently remove{' '}
          <span className="font-semibold text-gray-700">{record.filename}</span> from your history.
        </p>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
          <button
            onClick={onConfirm}
            style={{ backgroundColor: '#dc2626', color: '#ffffff' }}
            className="px-4 py-2 rounded-xl font-bold text-sm hover:opacity-90 transition-opacity"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}