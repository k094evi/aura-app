import { jsPDF } from 'jspdf';

import type { AnalysisResult } from '@/types/analysis';

// ─────────────────────────────────────────────
// Layout constants (A4, points)
// ─────────────────────────────────────────────
const MARGIN = 48;
const PAGE_WIDTH = 595.28;
const PAGE_HEIGHT = 841.89;
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN * 2;
const BOTTOM_LIMIT = PAGE_HEIGHT - MARGIN;

const COLOR = {
  indigo: [79, 70, 229] as [number, number, number],
  gray900: [17, 24, 39] as [number, number, number],
  gray500: [107, 114, 128] as [number, number, number],
  gray400: [156, 163, 175] as [number, number, number],
  green: [34, 197, 94] as [number, number, number],
  amber: [217, 119, 6] as [number, number, number],
};

/**
 * Builds and downloads a PDF report from the analysis result.
 * Pure text/vector layout (no canvas/screenshot step), so it stays
 * crisp and small regardless of the dashboard's current DOM state.
 */
export function generateReportPDF(
  result: AnalysisResult,
  fileName = 'aura-resume-report.pdf'
): void {
  const doc = new jsPDF({ unit: 'pt', format: 'a4' });
  let y = MARGIN;

  const ensureSpace = (needed: number) => {
    if (y + needed > BOTTOM_LIMIT) {
      doc.addPage();
      y = MARGIN;
    }
  };

  const heading = (text: string, size = 14) => {
    ensureSpace(size + 14);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(size);
    doc.setTextColor(...COLOR.gray900);
    doc.text(text, MARGIN, y);
    y += size + 10;
  };

  const paragraph = (
    text: string,
    size = 10,
    color: [number, number, number] = COLOR.gray500
  ) => {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(size);
    doc.setTextColor(...color);
    const lines = doc.splitTextToSize(text, CONTENT_WIDTH);
    ensureSpace(lines.length * (size + 4));
    doc.text(lines, MARGIN, y);
    y += lines.length * (size + 4) + 3;
  };

  const bullet = (text: string, dotColor: [number, number, number] = COLOR.indigo) => {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(...COLOR.gray900);
    const lines = doc.splitTextToSize(text, CONTENT_WIDTH - 16);
    ensureSpace(lines.length * 13 + 6);
    doc.setFillColor(...dotColor);
    doc.circle(MARGIN + 3, y - 3, 2.2, 'F');
    doc.text(lines, MARGIN + 14, y);
    y += lines.length * 13 + 6;
  };

  const divider = () => {
    ensureSpace(16);
    doc.setDrawColor(230, 230, 230);
    doc.line(MARGIN, y, PAGE_WIDTH - MARGIN, y);
    y += 16;
  };

  // ── Title block ──────────────────────────────────────
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(20);
  doc.setTextColor(...COLOR.indigo);
  doc.text('Aura Resume Analysis Report', MARGIN, y);
  y += 26;

  paragraph(
    `Generated ${new Date().toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })}`,
    9,
    COLOR.gray400
  );
  y += 4;
  divider();

  // ── ATS score + dimensions ───────────────────────────
  heading(`Overall ATS Score: ${result.ats_score}%`, 16);
  result.sections.forEach((s) => {
    paragraph(`${s.name}: ${s.value}%`, 10, COLOR.gray900);
  });
  y += 6;
  divider();

  // ── Strengths ─────────────────────────────────────────
  heading('Key Strengths');
  if (result.strengths.length === 0) {
    paragraph('No strengths were identified.');
  } else {
    result.strengths.forEach((s) => bullet(s, COLOR.green));
  }
  y += 4;
  divider();

  // ── Improvements ──────────────────────────────────────
  heading('Smart Suggestions');
  if (result.improvements.length === 0) {
    paragraph('No suggestions were identified.');
  } else {
    result.improvements.forEach((s) => bullet(s, COLOR.amber));
  }
  y += 4;
  divider();

  // ── Skill gaps ────────────────────────────────────────
  heading('Keyword & Skill Optimization');
  result.skill_gaps.forEach((g) => {
    const status = g.missing ? 'Optional' : 'Required — Met';
    paragraph(`${g.skill}  (${status})`, 10, COLOR.gray900);
    paragraph(g.recommendation, 9, COLOR.gray500);
  });
  y += 4;
  divider();

  // ── Grammar / formatting ──────────────────────────────
  heading('Formatting & Readability');
  result.grammar_issues.forEach((g) => {
    paragraph(`[${g.type}]  ${g.text}`, 10, COLOR.gray900);
  });
  y += 4;

  // ── Company matches ───────────────────────────────────
  if (result.companies.length > 0) {
    divider();
    heading('Top Company Matches');
    result.companies.slice(0, 10).forEach((c) => {
      paragraph(
        `${c.company} — ${c.match}% match — ${c.location} — ${c.jobType}`,
        10,
        COLOR.gray900
      );
    });
  }

  // ── Top jobs ──────────────────────────────────────────
  if (result.top_jobs.length > 0) {
    divider();
    heading('Top Job Matches');
    result.top_jobs.slice(0, 15).forEach((j) => {
      paragraph(
        `${j.title} — ${j.company} (${j.location}) — Score: ${j.total_score}`,
        10,
        COLOR.gray900
      );
    });
  }

  doc.save(fileName);
}