// components/DashboardHeader.tsx
'use client';

import { useEffect, useState } from 'react';
import { Download, Loader2 } from 'lucide-react';

import type { AnalysisResult } from '@/types/analysis';
import { getStoredUser } from '@/lib/auth';
import { generateReportPDF } from '@/lib/exportReport';

interface DashboardHeaderProps {
  result: AnalysisResult;
}

// Welcome row for the dashboard page: greeting on the left, Export PDF on the right
export default function DashboardHeader({ result }: DashboardHeaderProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [firstName, setFirstName] = useState('');

  // Read the stored user on the client only (avoids a hydration mismatch)
  useEffect(() => {
    const stored = getStoredUser();
    const name = stored?.full_name?.trim().split(' ')[0] ?? '';
    setFirstName(name);
  }, []);

  const handleExport = async () => {
    if (isExporting) return;
    setIsExporting(true);
    try {
      generateReportPDF(result, getStoredUser());
    } catch (err) {
      console.error('Failed to generate report PDF:', err);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      {/* Greeting */}
      <div className="flex flex-col gap-1">
        <h1 className="text-[28px] font-extrabold leading-tight text-[#111827]">
          Welcome back{firstName ? `, ${firstName}` : ''}
        </h1>
        <p className="text-sm text-[#4b5563]">
          Here is your latest resume optimization progress dashboard.
        </p>
      </div>

      {/* Export PDF button */}
      <button
        onClick={handleExport}
        disabled={isExporting}
        className="flex items-center gap-2 self-start rounded-[12px] border-[1.5px] border-[#e3e5eb] bg-white/72 backdrop-blur-[12px] px-5 py-3 text-sm font-medium text-[#454a54] shadow-[0px_2px_8px_0px_rgba(0,0,0,0.05)] transition-colors hover:bg-white disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isExporting ? (
          <Loader2 className="size-[18px] animate-spin" />
        ) : (
          <Download className="size-[18px]" />
        )}
        {isExporting ? 'Exporting…' : 'Export PDF'}
      </button>
    </div>
  );
}