import type { AnalysisResult } from '@/types/analysis';

export type ShareOutcome =
  | { method: 'share'; success: true }
  | { method: 'share'; success: false; cancelled: true }
  | { method: 'clipboard'; success: boolean }
  | { method: 'none'; success: false };

function buildSummaryText(result: AnalysisResult): string {
  const topStrength = result.strengths[0];
  const lines = [
    `My Aura resume analysis: ${result.ats_score}% ATS score.`,
    topStrength ? `Top strength: ${topStrength}` : null,
    result.total_jobs > 0
      ? `${result.total_jobs} matching jobs found across ${result.companies.length} companies.`
      : null,
  ].filter((line): line is string => Boolean(line));

  return lines.join('\n');
}

/**
 * Shares a text summary of the analysis via the native share sheet
 * (mobile / supported browsers), falling back to copying the same
 * summary to the clipboard when Web Share isn't available.
 *
 * Note: there is currently no persisted/shareable URL for a specific
 * analysis (results live only in sessionStorage on this device), so
 * this shares a text summary rather than a link. If a "share a link
 * others can open" feature is wanted later, that requires persisting
 * the result server-side with an id — a backend change, not just this
 * function.
 */
export async function shareResults(result: AnalysisResult): Promise<ShareOutcome> {
  const text = buildSummaryText(result);

  if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
    try {
      await navigator.share({
        title: 'My Aura Resume Analysis',
        text,
      });
      return { method: 'share', success: true };
    } catch (err) {
      // User dismissed the share sheet — not a real failure, don't fall through to clipboard
      if (err instanceof Error && err.name === 'AbortError') {
        return { method: 'share', success: false, cancelled: true };
      }
      // Any other error: fall through and try the clipboard instead
    }
  }

  if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return { method: 'clipboard', success: true };
    } catch {
      return { method: 'clipboard', success: false };
    }
  }

  return { method: 'none', success: false };
}