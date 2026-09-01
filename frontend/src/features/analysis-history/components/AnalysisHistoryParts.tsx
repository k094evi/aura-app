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
    <div className="mb-6 grid grid-cols-2 gap-5 lg:grid-cols-4">
      {stats.map((m) => (
        <div
          key={m.label}
          className="flex flex-col gap-3 rounded-[20px] border border-white/[0.07] bg-[#151221]/70 p-6 shadow-[0px_16px_32px_0px_rgba(0,0,0,0.25)] backdrop-blur-[20px]"
        >
          <div className="flex items-center gap-2.5">
            <div className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-violet-500/20 bg-violet-500/10">
              <m.icon className="size-4 text-violet-400" />
            </div>
            <p className="text-[10px] font-extrabold uppercase tracking-wide text-white/40">{m.label}</p>
          </div>
          <p className="text-[32px] font-extrabold leading-none text-white">
            {m.value}
            <span className="text-sm font-medium text-white/40">{m.suffix}</span>
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
    <div className="mb-6 w-full rounded-3xl border border-white/[0.07] bg-[#151221]/70 p-8 shadow-[0px_16px_32px_0px_rgba(0,0,0,0.25)] backdrop-blur-[20px]">
      <div className="mb-6 flex items-center gap-3.5">
        <div className="flex items-center justify-center rounded-xl border border-violet-500/20 bg-violet-500/10 p-2.5">
          <TrendingUp className="size-5 text-violet-400" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-white">ATS Score Trend</h2>
          <p className="text-[13px] font-normal text-white/60">Your progress across all submissions</p>
        </div>
      </div>
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.07)" />
            <XAxis
              dataKey="name"
              fontSize={11}
              fontWeight={700}
              tick={{ fill: 'rgba(255,255,255,0.4)' }}
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
              tick={{ fill: 'rgba(255,255,255,0.4)' }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{
                borderRadius: '12px',
                border: '1px solid rgba(255,255,255,0.1)',
                background: '#151221',
                boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
                fontSize: '12px',
                fontWeight: 700,
                color: '#fff',
              }}
              labelStyle={{ color: 'rgba(255,255,255,0.6)' }}
            />
            <Line
              type="monotone"
              dataKey="score"
              stroke="#a78bfa"
              strokeWidth={3}
              dot={{ fill: '#a78bfa', stroke: '#0c0a14', strokeWidth: 2, r: 5 }}
              activeDot={{ r: 7, fill: '#d946ef' }}
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
    <div className="rounded-3xl border border-white/[0.07] bg-[#151221]/70 p-12 text-center shadow-[0px_16px_32px_0px_rgba(0,0,0,0.25)] backdrop-blur-[20px]">
      <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-2xl border border-violet-500/20 bg-violet-500/10">
        <FileText className="size-7 text-violet-400" />
      </div>
      <h2 className="mb-1 text-lg font-bold text-white">No analyses yet</h2>
      <p className="mb-6 text-sm text-white/40">
        Upload a resume to see your ATS score and analysis history here.
      </p>
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#8b5cf6] to-[#d946ef] px-5 py-2.5 text-sm font-bold text-white shadow-[0px_4px_6px_0px_rgba(139,92,246,0.25)] transition-opacity hover:opacity-90"
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
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="delete-analysis-title"
        className="w-full max-w-sm rounded-2xl border border-white/[0.08] bg-[#151221] p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-start justify-between">
          <h3 id="delete-analysis-title" className="text-base font-bold text-white">
            Delete this analysis?
          </h3>
          <button onClick={onClose} aria-label="Close dialog" className="text-white/40 hover:text-white/70">
            <X className="size-4" />
          </button>
        </div>
        <p className="text-sm text-white/60">
          This will permanently remove <span className="font-semibold text-white">{record.filename}</span> from
          your history.
        </p>
        <div className="mt-5 flex justify-end">
          <button
            onClick={onConfirm}
            className="rounded-xl bg-red-600 px-4 py-2 text-sm font-bold text-white transition-opacity hover:opacity-90"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}