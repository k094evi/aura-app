'use client';

import { Scan } from 'lucide-react';

import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';

interface SectionData {
  name: string;
  value: number;
}

interface AssessmentSidebarProps {
  score: number;
  sections: SectionData[];
}

// Circular donut chart showing the overall score percentage
function ScoreChart({
  score,
  label = 'ATS Score',
}: {
  score: number;
  label?: string;
}) {
  const data = [
    {
      name: 'Score',
      value: score,
    },
    {
      name: 'Remaining',
      value: 100 - score,
    },
  ];

  return (
    <div className="relative mx-auto aspect-square w-full max-w-[180px]">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            innerRadius="75%"
            outerRadius="100%"
            paddingAngle={5}
            dataKey="value"
            startAngle={90}
            endAngle={-270}
          >
            {/* Filled portion color depends on score range */}
            <Cell
              fill={
                score > 80
                  ? '#22c55e'
                  : score > 60
                  ? '#d946ef'
                  : '#ef4444'
              }
            />

            {/* Remaining/background portion */}
            <Cell fill="rgba(255,255,255,0.08)" />
          </Pie>
        </PieChart>
      </ResponsiveContainer>

      {/* Score percentage and label centered inside the donut */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-extrabold text-white">
          {score}%
        </span>

        <span className="text-[10px] font-bold uppercase tracking-wider text-white/40">
          {label}
        </span>
      </div>
    </div>
  );
}

export default function AssessmentSidebar({
  score,
  sections,
}: AssessmentSidebarProps) {
  return (
    <div className="flex flex-col gap-4 lg:col-span-1">
      {/* Overall Assessment card with score chart */}
      <div className="rounded-3xl border border-white/[0.07] bg-[#151221]/70 p-6 shadow-[0px_16px_32px_0px_rgba(0,0,0,0.25)] backdrop-blur-[20px]">
        <h2 className="mb-6 text-sm font-bold uppercase tracking-widest text-white/40">
          Overall Assessment
        </h2>

        <div className="space-y-8">
          <ScoreChart score={score} />
        </div>

        {/* Summary note about resume complexity */}
        <div className="mt-8 space-y-4">
          <div className="rounded-2xl border border-fuchsia-500/20 bg-fuchsia-500/10 p-4">
            <p className="text-center text-xs font-semibold leading-relaxed text-fuchsia-300">
              Resume complexity is{' '}
              <span className="font-bold">Optimal</span> for
              Executive-level parsing.
            </p>
          </div>
        </div>
      </div>

      {/* Dimension Analysis card with horizontal bar chart */}
      <div className="rounded-3xl border border-white/[0.07] bg-[#151221]/70 p-6 shadow-[0px_16px_32px_0px_rgba(0,0,0,0.25)] backdrop-blur-[20px]">
        <h3 className="mb-6 flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-white/40">
          <Scan className="size-4 text-fuchsia-400" />
          Dimension Analysis
        </h3>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={sections} layout="vertical">
              {/* Hidden numeric axis (used for bar scaling only) */}
              <XAxis type="number" hide />

              {/* Category axis showing section names */}
              <YAxis
                dataKey="name"
                type="category"
                width={90}
                fontSize={10}
                fontWeight={700}
                stroke="rgba(255,255,255,0.5)"
                tick={{ fill: 'rgba(255,255,255,0.5)' }}
              />

              <Tooltip
                cursor={{ fill: 'rgba(255,255,255,0.04)' }}
                contentStyle={{
                  borderRadius: '12px',
                  border: '1px solid rgba(255,255,255,0.08)',
                  background: '#1a1726',
                  color: '#fff',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.35)',
                }}
              />

              {/* Horizontal bars representing each section's score */}
              <Bar
                dataKey="value"
                fill="#d946ef"
                radius={[0, 4, 4, 0]}
                barSize={14}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}