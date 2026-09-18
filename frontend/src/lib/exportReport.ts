import { jsPDF } from 'jspdf';
import type { AnalysisResult } from '@/types/analysis';

export interface SupabaseUser {
  id?: string;
  email?: string | null;
  full_name?: string | null;
  created_at?: string;
  // Included to handle raw Supabase Auth user objects seamlessly
  user_metadata?: {
    full_name?: string;
    name?: string;
    [key: string]: unknown;
  };
}

// ─────────────────────────────────────────────
// Layout & Color System (A4 in points)
// ─────────────────────────────────────────────
const MARGIN = 40;
const PAGE_WIDTH = 595.28;
const PAGE_HEIGHT = 841.89;
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN * 2;
const BOTTOM_LIMIT = PAGE_HEIGHT - 50;

const COLOR = {
  primary: [79, 70, 229] as [number, number, number],       // Indigo #4F46E5
  primaryDark: [49, 46, 129] as [number, number, number],   // Dark Indigo #312E81
  slate900: [15, 23, 42] as [number, number, number],       // Slate 900
  slate700: [51, 65, 85] as [number, number, number],       // Slate 700
  slate500: [100, 116, 139] as [number, number, number],    // Slate 500
  slate200: [226, 232, 240] as [number, number, number],    // Slate 200
  slate50: [248, 250, 252] as [number, number, number],     // Slate 50
  emerald: [16, 185, 129] as [number, number, number],      // Green #10B981
  amber: [245, 158, 11] as [number, number, number],        // Amber #F59E0B
  rose: [244, 63, 94] as [number, number, number],          // Rose #F43F5E
  white: [255, 255, 255] as [number, number, number],
};

/**
 * Builds and downloads an executive-grade PDF analysis report.
 */
export function generateReportPDF(
  result: AnalysisResult,
  user?: SupabaseUser | null,
  customFileName?: string
): void {
  const doc = new jsPDF({ unit: 'pt', format: 'a4' });
  let y = MARGIN;

  // ── Extract User Information safely across DB & Auth structures ──
  const rawName =
    user?.full_name?.trim() ||
    user?.user_metadata?.full_name?.trim() ||
    user?.user_metadata?.name?.trim() ||
    '';

  const candidateName = rawName || (user?.email ? user.email.split('@')[0] : 'Valued Candidate');
  const candidateEmail = user?.email || 'N/A';

  // ── Format Dynamic Filename: name-aura-resume_report.pdf ───────
  const nameSlug = rawName
    ? rawName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
    : user?.email
    ? user.email.split('@')[0].toLowerCase().replace(/[^a-z0-9]+/g, '-')
    : 'user';

  const fileName = customFileName || `${nameSlug}-aura-resume_report.pdf`;

  // ── Helper: Page Overflow Guard ───────────────────────
  const ensureSpace = (needed: number) => {
    if (y + needed > BOTTOM_LIMIT) {
      doc.addPage();
      y = MARGIN + 20;
    }
  };

  // ── Helper: Section Heading with Accent Bar ───────────
  const renderSectionHeader = (title: string) => {
    ensureSpace(35);
    doc.setFillColor(...COLOR.primary);
    doc.rect(MARGIN, y, 4, 14, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    doc.setTextColor(...COLOR.slate900);
    doc.text(title.toUpperCase(), MARGIN + 12, y + 11);
    y += 24;
  };

  // ── 1. Top Decorative Brand Banner ────────────────────
  doc.setFillColor(...COLOR.primaryDark);
  doc.rect(0, 0, PAGE_WIDTH, 8, 'F');

  // ── 2. Report Header Block ────────────────────────────
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.setTextColor(...COLOR.primaryDark);
  doc.text('AURA RESUME ANALYSIS', MARGIN, y + 20);

  // User details block (Top Right)
  const reportDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(...COLOR.slate900);
  doc.text(candidateName, PAGE_WIDTH - MARGIN, y + 8, { align: 'right' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(...COLOR.slate500);
  doc.text(candidateEmail, PAGE_WIDTH - MARGIN, y + 20, { align: 'right' });
  doc.text(`Generated: ${reportDate}`, PAGE_WIDTH - MARGIN, y + 31, { align: 'right' });

  y += 48;

  // Divider
  doc.setDrawColor(...COLOR.slate200);
  doc.setLineWidth(0.75);
  doc.line(MARGIN, y, PAGE_WIDTH - MARGIN, y);
  y += 18;

  // ── 3. Executive ATS Score Summary Card ───────────────
  ensureSpace(90);
  const cardHeight = 82;
  doc.setFillColor(...COLOR.slate50);
  doc.setDrawColor(...COLOR.slate200);
  doc.roundedRect(MARGIN, y, CONTENT_WIDTH, cardHeight, 6, 6, 'FD');

  const score = result.ats_score ?? 0;
  const scoreColor = score >= 80 ? COLOR.emerald : score >= 60 ? COLOR.amber : COLOR.rose;

  doc.setFillColor(...scoreColor);
  doc.roundedRect(MARGIN + 12, y + 12, 70, 58, 4, 4, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.setTextColor(...COLOR.white);
  doc.text(`${score}%`, MARGIN + 47, y + 42, { align: 'center' });

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.text('ATS SCORE', MARGIN + 47, y + 57, { align: 'center' });

  let sectionX = MARGIN + 100;
  let sectionY = y + 22;
  const maxSectionsPerRow = 3;
  const colWidth = (CONTENT_WIDTH - 110) / maxSectionsPerRow;

  result.sections.forEach((sec, idx) => {
    if (idx > 0 && idx % maxSectionsPerRow === 0) {
      sectionX = MARGIN + 100;
      sectionY += 28;
    }

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(...COLOR.slate500);
    doc.text(sec.name, sectionX, sectionY);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(...COLOR.slate900);
    doc.text(`${sec.value}%`, sectionX, sectionY + 13);

    sectionX += colWidth;
  });

  y += cardHeight + 20;

  // ── 4. Key Strengths ──────────────────────────────────
  renderSectionHeader('Key Strengths');
  if (!result.strengths || result.strengths.length === 0) {
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(9.5);
    doc.setTextColor(...COLOR.slate500);
    doc.text('No strengths identified in the current pass.', MARGIN, y);
    y += 16;
  } else {
    result.strengths.forEach((strength) => {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9.5);
      doc.setTextColor(...COLOR.slate700);

      const lines = doc.splitTextToSize(strength, CONTENT_WIDTH - 20);
      ensureSpace(lines.length * 13 + 4);

      doc.setFillColor(...COLOR.emerald);
      doc.circle(MARGIN + 4, y - 3, 2.5, 'F');

      doc.text(lines, MARGIN + 16, y);
      y += lines.length * 13 + 4;
    });
  }
  y += 10;

  // ── 5. Smart Suggestions ──────────────────────────────
  renderSectionHeader('Smart Suggestions');
  if (!result.improvements || result.improvements.length === 0) {
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(9.5);
    doc.setTextColor(...COLOR.slate500);
    doc.text('No critical improvements needed.', MARGIN, y);
    y += 16;
  } else {
    result.improvements.forEach((item) => {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9.5);
      doc.setTextColor(...COLOR.slate700);

      const lines = doc.splitTextToSize(item, CONTENT_WIDTH - 20);
      ensureSpace(lines.length * 13 + 4);

      doc.setFillColor(...COLOR.amber);
      doc.circle(MARGIN + 4, y - 3, 2.5, 'F');

      doc.text(lines, MARGIN + 16, y);
      y += lines.length * 13 + 4;
    });
  }
  y += 10;

  // ── 6. Skill & Keyword Gaps ───────────────────────────
  if (result.skill_gaps && result.skill_gaps.length > 0) {
    renderSectionHeader('Skill & Keyword Gap Analysis');

    result.skill_gaps.forEach((gap) => {
      const isMissing = gap.missing;
      const statusLabel = isMissing ? 'OPTIONAL / MISSING' : 'REQUIRED — MET';
      const badgeBg = isMissing ? COLOR.amber : COLOR.emerald;

      const recLines = doc.splitTextToSize(gap.recommendation, CONTENT_WIDTH - 12);
      ensureSpace(recLines.length * 12 + 22);

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(...COLOR.slate900);
      doc.text(gap.skill, MARGIN, y);

      const skillNameWidth = doc.getTextWidth(gap.skill);
      doc.setFillColor(...badgeBg);
      doc.roundedRect(MARGIN + skillNameWidth + 8, y - 8, 80, 11, 2, 2, 'F');
      
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(6.5);
      doc.setTextColor(...COLOR.white);
      doc.text(statusLabel, MARGIN + skillNameWidth + 48, y - 1, { align: 'center' });

      y += 13;

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);
      doc.setTextColor(...COLOR.slate500);
      doc.text(recLines, MARGIN, y);
      y += recLines.length * 12 + 6;
    });
    y += 10;
  }

  // ── 7. Top Job Matches ────────────────────────────────
  if (result.top_jobs && result.top_jobs.length > 0) {
    renderSectionHeader('Top Matched Opportunities');

    result.top_jobs.slice(0, 5).forEach((job) => {
      ensureSpace(28);

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9.5);
      doc.setTextColor(...COLOR.slate900);
      doc.text(job.title, MARGIN, y);

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(...COLOR.primary);
      doc.text(`${job.total_score}% Match`, PAGE_WIDTH - MARGIN, y, { align: 'right' });

      y += 11;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);
      doc.setTextColor(...COLOR.slate500);
      doc.text(`${job.company} • ${job.location}`, MARGIN, y);

      y += 16;
    });
  }

  // ── 8. Global Dynamic Header & Footer Pass ────────────
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);

    doc.setDrawColor(...COLOR.slate200);
    doc.setLineWidth(0.5);
    doc.line(MARGIN, PAGE_HEIGHT - 35, PAGE_WIDTH - MARGIN, PAGE_HEIGHT - 35);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(...COLOR.slate500);
    doc.text('Aura AI Resume Analyzer — Confidential Report', MARGIN, PAGE_HEIGHT - 22);
    doc.text(`Page ${i} of ${totalPages}`, PAGE_WIDTH - MARGIN, PAGE_HEIGHT - 22, {
      align: 'right',
    });
  }

  doc.save(fileName);
}