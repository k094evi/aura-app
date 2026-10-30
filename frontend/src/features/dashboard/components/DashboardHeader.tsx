// src/features/dashboard/components/DashboardHeader.tsx
'use client';

import { useEffect, useState } from 'react';
import { Download, Loader2 } from 'lucide-react';

import type { AnalysisResult } from '@/types/analysis';
import { getStoredUser } from '@/lib/auth';
import { useExportPdf } from '@/lib/useExportPdf';

// ADDED: hover lift for buttons (no lift while disabled, respects reduced motion).
const BTN_MOTION =
  'transition-all duration-200 ease-out hover:-translate-y-1 motion-reduce:transition-none motion-reduce:hover:translate-y-0 disabled:hover:translate-y-0';

interface DashboardHeaderProps {
  // null until a resume has been analyzed: the Export button stays disabled
  result: AnalysisResult | null;
}

// Welcome row for the dashboard page: greeting on the left, Export PDF on the right
export default function DashboardHeader({ result }: DashboardHeaderProps) {
  // Shared by every Export PDF button: spinner -> download -> short cooldown.
  const { isExporting, isBusy, exportPdf } = useExportPdf();
  const [firstName, setFirstName] = useState('');

  // Read the stored user on the client only (avoids a hydration mismatch)
  useEffect(() => {
    const stored = getStoredUser();
    const name = stored?.full_name?.trim().split(/\s+/)[0] ?? '';
    // Very long first names are cut so the heading can never push the button around.
    setFirstName(name.length > 20 ? `${name.slice(0, 20)}…` : name);
  }, []);

  const handleExport = () => {
    if (!result) return;
    void exportPdf(() => result, getStoredUser());
  };

  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      {/* Greeting */}
      <div className="flex min-w-0 flex-col gap-1">
        <h1
          className="truncate text-[28px] font-extrabold leading-tight text-[#111827]"
          title={firstName ? `Welcome back, ${firstName}` : undefined}
        >
          Welcome back{firstName ? `, ${firstName}` : ''}
        </h1>
        <p className="text-sm text-[#4b5563]">
          {result
            ? 'Here is how your resume performs and where to improve it.'
            : 'No resume has been uploaded yet – upload one to unlock your optimization dashboard.'}
        </p>
      </div>

      {/* Export PDF button
          CHANGED: `transition-colors` -> BTN_MOTION (hover lift; stays put while disabled) */}
      <button
        type="button"
        onClick={handleExport}
        disabled={!result || isBusy}
        className={`flex shrink-0 items-center gap-2 self-start whitespace-nowrap rounded-[12px] border-[1.5px] border-[#e3e5eb] bg-white/[0.72] px-5 py-3 text-sm font-medium text-[#454a54] shadow-[0px_2px_8px_0px_rgba(0,0,0,0.05)] backdrop-blur-[12px] ${BTN_MOTION} hover:bg-white disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:bg-white/[0.72]`}
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