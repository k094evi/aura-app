'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Download, Share2, Loader2, Check } from 'lucide-react';

import type { AnalysisResult } from '@/types/analysis';
import { generateReportPDF } from '@/lib/exportReport';
import { shareResults } from '@/lib/shareResults';

interface DashboardHeaderProps {
  result: AnalysisResult;
}

// Header section for the dashboard page with navigation and action buttons
export default function DashboardHeader({ result }: DashboardHeaderProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [shareState, setShareState] = useState<'idle' | 'sharing' | 'copied' | 'shared'>('idle');

  const handleExport = async () => {
    if (isExporting) return;
    setIsExporting(true);
    try {
      generateReportPDF(result);
    } catch (err) {
      console.error('Failed to generate report PDF:', err);
    } finally {
      setIsExporting(false);
    }
  };

  const handleShare = async () => {
    if (shareState === 'sharing') return;
    setShareState('sharing');

    const outcome = await shareResults(result);

    if (outcome.method === 'share' && outcome.success) {
      setShareState('shared');
      setTimeout(() => setShareState('idle'), 2000);
    } else if (outcome.method === 'clipboard' && outcome.success) {
      setShareState('copied');
      setTimeout(() => setShareState('idle'), 2000);
    } else {
      // Cancelled share sheet, or nothing available — just reset quietly
      setShareState('idle');
    }
  };

  return (
    <div className="flex flex-col gap-4 mb-8 md:flex-row md:items-center md:justify-between">
      {/* Link to navigate back to the upload page */}
      <Link
        href="/"
        className="flex items-center gap-2 text-sm font-semibold text-fuchsia-500 transition-colors hover:text-fuchsia-400"
      >
        <ArrowLeft className="size-4" />
        Back to Upload
      </Link>

      {/* Action buttons for exporting and sharing */}
      <div className="flex items-start gap-3">
        {/* Export report button */}
        <button
          onClick={handleExport}
          disabled={isExporting}
          className="flex items-center gap-1.5 rounded-[10px] border border-white/[0.07] bg-[#151221]/70 px-4.5 py-2.5 text-[13px] font-semibold text-white shadow-[0px_8px_20px_0px_rgba(0,0,0,0.25)] backdrop-blur-[20px] transition-colors hover:bg-white/[0.06] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isExporting ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <Download className="size-4" />
          )}
          {isExporting ? 'Exporting…' : 'Export Report'}
        </button>

        {/* Share results button */}
        <button
          onClick={handleShare}
          disabled={shareState === 'sharing'}
          className="flex items-center gap-1.5 rounded-[10px] bg-gradient-to-r from-[#8b5cf6] to-[#d946ef] px-4.5 py-2.5 text-[13px] font-bold text-white shadow-[0px_4px_6px_0px_rgba(139,92,246,0.25)] transition-opacity hover:opacity-90 disabled:opacity-70"
        >
          {shareState === 'sharing' ? (
            <Loader2 className="size-4 animate-spin" />
          ) : shareState === 'copied' || shareState === 'shared' ? (
            <Check className="size-4" />
          ) : (
            <Share2 className="size-4" />
          )}
          {shareState === 'copied'
            ? 'Copied to clipboard!'
            : shareState === 'shared'
              ? 'Shared!'
              : 'Share Results'}
        </button>
      </div>
    </div>
  );
}