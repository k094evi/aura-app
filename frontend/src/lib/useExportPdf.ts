// src/lib/useExportPdf.ts
'use client';

import { useCallback, useRef, useState } from 'react';

import type { AnalysisResult } from '@/types/analysis';
import {
  exportReportWithLoading,
  EXPORT_AFTER_MS,
  type SupabaseUser,
} from '@/lib/exportReport';

/**
 * One shared behaviour for EVERY "Export PDF" button (Dashboard, History,
 * View Results):
 *   1. click      -> spinner + "Exporting…" shows immediately
 *   2. ~0.8s      -> the PDF downloads and the spinner stops
 *   3. +1.2s      -> button stays disabled (no spinner), then re-enables
 *
 * Usage:
 *   const { isExporting, isBusy, exportPdf } = useExportPdf();
 *   <button disabled={isBusy} onClick={() => exportPdf(() => result, getStoredUser())}>
 *     {isExporting ? <Loader2 className="animate-spin" /> : <Download />}
 *   </button>
 *
 * - `isExporting` -> use for the spinner / "Exporting…" label
 * - `isBusy`      -> use for `disabled` (covers the cooldown too)
 */
export function useExportPdf() {
  const [isExporting, setIsExporting] = useState(false);
  const [isCoolingDown, setIsCoolingDown] = useState(false);
  // A ref (not state) so a rapid double-click in the same tick is blocked
  // before React has re-rendered the disabled button.
  const lock = useRef(false);

  const exportPdf = useCallback(
    async (
      getResult: () => AnalysisResult | Promise<AnalysisResult>,
      user?: SupabaseUser | null,
      customFileName?: string
    ) => {
      if (lock.current) return;
      lock.current = true;
      setIsExporting(true);

      try {
        const result = await getResult();
        await exportReportWithLoading(result, user, customFileName);
      } catch (error) {
        console.error('Failed to generate report PDF:', error);
        alert(
          error instanceof Error
            ? error.message
            : "We couldn't generate the PDF. Please try again."
        );
      } finally {
        setIsExporting(false);
        setIsCoolingDown(true);
        setTimeout(() => {
          lock.current = false;
          setIsCoolingDown(false);
        }, EXPORT_AFTER_MS);
      }
    },
    []
  );

  return { isExporting, isBusy: isExporting || isCoolingDown, exportPdf };
}