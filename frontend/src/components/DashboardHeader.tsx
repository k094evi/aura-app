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
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
      {/* Link to navigate back to the upload page */}
      <Link
        href="/"
        className="flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-indigo-600"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Upload
      </Link>

      {/* Action buttons for exporting and sharing */}
      <div className="flex gap-3">
        {/* Export report button */}
        <button
          onClick={handleExport}
          disabled={isExporting}
          className="px-6 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-bold flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isExporting ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Download className="w-4 h-4" />
          )}
          {isExporting ? 'Exporting…' : 'Export Report'}
        </button>

        {/* Share results button */}
        <button
          onClick={handleShare}
          disabled={shareState === 'sharing'}
          className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-bold flex items-center gap-2 disabled:opacity-70"
        >
          {shareState === 'sharing' ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : shareState === 'copied' || shareState === 'shared' ? (
            <Check className="w-4 h-4" />
          ) : (
            <Share2 className="w-4 h-4" />
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