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
    <div className="relative w-full aspect-square mx-auto max-w-[180px]">
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
                  ? '#4f46e5'
                  : '#ef4444'
              }
            />

            {/* Remaining/background portion */}
            <Cell fill="#f3f4f6" />
          </Pie>
        </PieChart>
      </ResponsiveContainer>

      {/* Score percentage and label centered inside the donut */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-extrabold text-gray-900">
          {score}%
        </span>

        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
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
    <div className="lg:col-span-1 space-y-6">
      {/* Overall Assessment card with score chart */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-6">
          Overall Assessment
        </h2>

        <div className="space-y-8">
          <ScoreChart score={score} />
        </div>

        {/* Summary note about resume complexity */}
        <div className="mt-8 space-y-4">
          <div className="p-4 bg-indigo-50 rounded-2xl">
            <p className="text-xs text-indigo-700 leading-relaxed font-semibold text-center">
              Resume complexity is{' '}
              <span className="font-bold">
                Optimal
              </span>{' '}
              for Executive-level parsing.
            </p>
          </div>
        </div>
      </div>

      {/* Dimension Analysis card with horizontal bar chart */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-6 flex items-center gap-2">
          <Scan className="w-4 h-4 text-indigo-600" />
          Dimension Analysis
        </h3>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={sections}
              layout="vertical"
            >
              {/* Hidden numeric axis (used for bar scaling only) */}
              <XAxis
                type="number"
                hide
              />

              {/* Category axis showing section names */}
              <YAxis
                dataKey="name"
                type="category"
                width={90}
                fontSize={10}
                fontWeight={700}
              />

              <Tooltip
                cursor={{
                  fill: '#f9fafb',
                }}
                contentStyle={{
                  borderRadius: '12px',
                  border: 'none',
                  boxShadow:
                    '0 4px 12px rgba(0,0,0,0.05)',
                }}
              />

              {/* Horizontal bars representing each section's score */}
              <Bar
                dataKey="value"
                fill="#6366f1"
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