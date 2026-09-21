// src/components/AssessmentSidebar.tsx

'use client';

import { useEffect, useId, useState, type ReactNode } from 'react';
import { X } from 'lucide-react';

// `value` is null until a resume has been analyzed.
interface SectionData {
  name: string;
  value: number | null;
}

interface AssessmentSidebarProps {
  // null = no resume analyzed yet -> the card shows its empty state
  score: number | null;
  sections?: SectionData[];
}

// Dimensions listed (with "-" values) before any resume has been analyzed.
const EMPTY_SECTIONS: SectionData[] = [
  'Formatting',
  'Keywords',
  'Quantification',
  'Impact',
  'Readability',
].map((name) => ({ name, value: null }));

// Weight (in %) each dimension contributes to the ATS score, as shown in the
// "How Your ATS Score is Calculated" modal in the Figma design. Matched by
// dimension name (case-insensitive); any other name shows "—" in the modal.
const DIMENSION_WEIGHTS: Record<string, number> = {
  formatting: 20,
  keywords: 25,
  quantification: 15,
  impact: 25,
  readability: 15,
};

// Copy for the "How Dimensions Are Measured" modal (from the Figma design).
// Matched by dimension name (case-insensitive); unknown names show no description.
const DIMENSION_DESCRIPTIONS: Record<string, string> = {
  formatting:
    'Measures resume structure, section organization, bullet consistency, and ATS-parseable formatting.',
  keywords:
    'Evaluates relevance and density of industry-specific terms, skills, and job-title matches.',
  quantification:
    'Checks for measurable achievements, metrics, percentages, and data-driven results.',
  impact: 'Assesses action verbs, accomplishment framing, and value-driven language.',
  readability: 'Analyzes sentence length, clarity, jargon balance, and overall scannability.',
};

const normalize = (name: string) => name.trim().toLowerCase();
const getWeight = (name: string): number | undefined => DIMENSION_WEIGHTS[normalize(name)];
const getDescription = (name: string): string | undefined => DIMENSION_DESCRIPTIONS[normalize(name)];

const clampPercent = (n: number) => Math.min(100, Math.max(0, Number.isFinite(n) ? n : 0));

// 18 -> "18.0", 18.75 -> "18.75", 10.2 -> "10.2"
function formatPoints(n: number) {
  const s = n.toFixed(2).replace(/0+$/, '');
  return s.endsWith('.') ? `${s}0` : s;
}

// Shared frosted card shell used by both sidebar cards.
const CARD_CLASS =
  'flex flex-col gap-5 rounded-[24px] border-[1.5px] border-white bg-white/[0.72] p-6 shadow-[0_10px_30px_rgba(17,24,39,0.03)] backdrop-blur-[12px] sm:p-7';

// Small "i" button next to the card titles; opens the matching explanation modal.
function InfoButton({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="flex size-4 shrink-0 items-center justify-center rounded-full bg-[#4b5563]/10 text-[10px] font-bold leading-none text-[#4b5563] transition hover:bg-[#7c3aed]/15 hover:text-[#7c3aed]"
    >
      i
    </button>
  );
}

// Circular progress ring showing the overall score percentage.
// With no score yet it shows a dash and "No score yet" instead of the ring.
function ScoreChart({ score, label = 'ATS Score' }: { score: number | null; label?: string }) {
  const gradientId = `score-ring-${useId().replace(/:/g, '')}`;

  if (score === null) {
    return (
      <div className="flex h-[160px] w-full flex-col items-center justify-center gap-1">
        <span className="text-[28px] font-bold leading-none text-[#9ca3af]">-</span>
        <span className="text-[10px] font-bold uppercase text-[#4b5563]">No score yet</span>
      </div>
    );
  }

  const size = 130;
  const stroke = 12;
  const radius = (size - stroke) / 2 - 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - clampPercent(score) / 100);

  return (
    <div className="relative flex h-[160px] w-full items-center justify-center">
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="-rotate-90"
        aria-hidden
      >
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#8b5cf6" />
            <stop offset="100%" stopColor="#06b6d4" />
          </linearGradient>
        </defs>

        {/* Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(124,58,237,0.10)"
          strokeWidth={stroke}
        />

        {/* Filled portion */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={`url(#${gradientId})`}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>

      {/* Score percentage and label centered inside the ring */}
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-[2px]">
        <span className="text-[32px] font-extrabold leading-none text-[#111827]">{score}%</span>
        <span className="text-[10px] font-bold uppercase text-[#4b5563]">{label}</span>
      </div>
    </div>
  );
}

// One "Formatting ▬▬▬▬ 90%" row in the Dimension Analysis card.
// With no value yet it shows just the name and a dash.
function DimensionRow({ name, value }: { name: string; value: number | null }) {
  if (value === null) {
    return (
      <div className="flex h-8 items-center justify-between gap-3">
        <p className="text-[14px] font-semibold text-[#111827]">{name}</p>
        <p className="w-[38px] shrink-0 text-right text-[13px] font-bold text-[#9ca3af]">-</p>
      </div>
    );
  }

  const pct = clampPercent(value);

  return (
    <div className="flex h-8 items-center gap-3">
      <p
        title={name}
        className="w-[100px] shrink-0 truncate text-[14px] font-semibold text-[#111827]"
      >
        {name}
      </p>

      <div className="h-2 min-w-0 flex-1 rounded-full bg-[#7c3aed]/[0.08]">
        <div
          className="h-full rounded-full bg-[linear-gradient(90deg,#8b5cf6_0%,#06b6d4_100%)]"
          style={{ width: `${pct}%` }}
        />
      </div>

      <p className="w-[38px] shrink-0 text-right text-[13px] font-bold text-[#111827]">
        {Math.round(pct)}%
      </p>
    </div>
  );
}

// Shared modal frame (light scrim, frosted card, title + close button).
// Closes on the × button, the Escape key, or a click on the scrim.
function ModalShell({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: ReactNode;
}) {
  const titleId = useId();

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-[#e9e8f4]/[0.72] p-4 backdrop-blur-[2px]"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        onClick={(e) => e.stopPropagation()}
        className="flex max-h-[calc(100vh-2rem)] w-full max-w-[368px] flex-col gap-[14px] overflow-y-auto rounded-[24px] border-[1.5px] border-white bg-white/[0.88] p-6 shadow-[0_12px_36px_rgba(17,24,39,0.08)] backdrop-blur-[12px]"
      >
        {/* Header */}
        <div className="flex items-center justify-between gap-3">
          <p id={titleId} className="text-[13px] font-bold uppercase text-[#4b5563]">
            {title}
          </p>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex size-8 shrink-0 items-center justify-center rounded-full border border-[#e5e7eb] bg-white text-[#4b5563] transition hover:text-[#111827]"
          >
            <X className="size-[14px]" strokeWidth={2.5} />
          </button>
        </div>

        {children}
      </div>
    </div>
  );
}

// "How Your ATS Score is Calculated" modal (Figma: ATS Score Calculation Modal)
function AtsScoreModal({
  score,
  sections,
  onClose,
}: {
  score: number | null;
  sections: SectionData[];
  onClose: () => void;
}) {
  const rows = sections.map((section) => {
    const weight = getWeight(section.name);
    const pct = section.value === null ? null : clampPercent(section.value);
    return {
      name: section.name,
      pct,
      weight,
      points:
        weight === undefined || pct === null ? undefined : (pct * weight) / 100,
    };
  });

  // Only sum the dimensions when every one of them has a score and a known weight.
  const allWeighted = rows.length > 0 && rows.every((row) => row.points !== undefined);
  const total = allWeighted ? rows.reduce((sum, row) => sum + (row.points ?? 0), 0) : null;

  const totalText =
    total === null
      ? score === null
        ? '—'
        : `${score}%`
      : Number.isInteger(total)
        ? `${total}%`
        : `${formatPoints(total)}% ≈ ${Math.round(total)}% (rounded)`;

  return (
    <ModalShell title="How Your ATS Score is Calculated" onClose={onClose}>
      {/* Calculation table */}
      <div className="flex flex-col gap-[10px] rounded-[16px] border border-[#e5e7eb] bg-white p-[14px]">
        {rows.map((row) => (
          <div key={row.name} className="flex h-8 items-center justify-between gap-2">
            <p
              className="min-w-0 flex-1 truncate text-[13px] font-semibold text-[#111827]"
              title={row.name}
            >
              {row.name}
            </p>
            <p className="w-[40px] shrink-0 text-right text-[12px] font-bold text-[#111827]">
              {row.pct === null ? '—' : `${Math.round(row.pct)}%`}
            </p>
            <p className="w-[48px] shrink-0 text-right text-[12px] font-semibold text-[#4b5563]">
              {row.weight === undefined ? '—' : `× ${row.weight}%`}
            </p>
            <p className="w-[48px] shrink-0 text-right text-[12px] font-bold text-[#111827]">
              {row.points === undefined ? '—' : formatPoints(row.points)}
            </p>
          </div>
        ))}

        <div className="h-px w-full bg-[#e5e7eb]" />

        <div className="flex min-h-8 items-center justify-between gap-4 text-[13px] text-[#111827]">
          <p className="font-bold">Total ATS Score</p>
          <p className="text-right font-extrabold">{totalText}</p>
        </div>
      </div>

      {/* Formula note */}
      <div className="rounded-[12px] border border-[#7c3aed]/20 bg-[#7c3aed]/[0.07] p-3">
        <p className="text-[11px] font-medium leading-[1.35] text-[#7c3aed]">
          ATS Score = Σ (Dimension Score × Weight)
        </p>
      </div>
    </ModalShell>
  );
}

// "How Dimensions Are Measured" modal (Figma: Dimension Analysis Popup)
function DimensionGuideModal({
  sections,
  onClose,
}: {
  sections: SectionData[];
  onClose: () => void;
}) {
  return (
    <ModalShell title="How Dimensions Are Measured" onClose={onClose}>
      {/* Dimension guide */}
      <div className="flex flex-col gap-[10px] rounded-[16px] border border-[#e5e7eb] bg-white p-[14px]">
        {sections.map((section) => {
          const description = getDescription(section.name);
          return (
            <div
              key={section.name}
              className="flex flex-col gap-1 border-b border-[#e5e7eb] pb-[9px]"
            >
              <div className="flex items-center justify-between gap-3">
                <p className="min-w-0 truncate text-[13px] font-bold text-[#111827]">
                  {section.name}
                </p>
                {section.value !== null && (
                  <p className="shrink-0 text-[11px] font-bold text-[#7c3aed]">
                    {Math.round(clampPercent(section.value))}%
                  </p>
                )}
              </div>
              {description && (
                <p className="text-[11px] leading-[1.3] text-[#4b5563]">{description}</p>
              )}
            </div>
          );
        })}
      </div>

      {/* Scoring note */}
      <div className="rounded-[12px] border border-[#7c3aed]/20 bg-[#7c3aed]/[0.07] p-[11px]">
        <p className="text-[11px] leading-[1.35] text-[#7c3aed]">
          Each score reflects how consistently your resume meets ATS and recruiter best practices.
        </p>
      </div>
    </ModalShell>
  );
}

export default function AssessmentSidebar({ score, sections }: AssessmentSidebarProps) {
  // Which explanation modal (if any) is open
  const [openModal, setOpenModal] = useState<'score' | 'dimensions' | null>(null);
  const closeModal = () => setOpenModal(null);

  const hasResult = score !== null;
  // Before analysis, list the standard dimensions with "-" values
  const rows = hasResult && sections && sections.length > 0 ? sections : EMPTY_SECTIONS;

  return (
    <div className="flex flex-col gap-6">
      {/* Overall Assessment card with score chart */}
      <div className={CARD_CLASS}>
        <div className="flex items-center gap-2">
          <h2 className="text-[14px] font-bold uppercase text-[#4b5563]">Overall Assessment</h2>
          <InfoButton
            label="How is the ATS score calculated?"
            onClick={() => setOpenModal('score')}
          />
        </div>

        <ScoreChart score={score} />

        {/* Summary note */}
        <div className="rounded-[12px] border border-[#7c3aed]/20 bg-[#7c3aed]/[0.07] p-3">
          <p className="text-[13px] font-medium leading-[1.4] text-[#7c3aed]">
            {hasResult
              ? 'Resume complexity is Optimal for Executive-level parsing.'
              : 'Your ATS score appears here after a resume is uploaded and analyzed.'}
          </p>
        </div>
      </div>

      {/* Dimension Analysis card with per-section bars */}
      <div className={CARD_CLASS}>
        <div className="flex items-center gap-2">
          <h3 className="text-[14px] font-bold uppercase text-[#4b5563]">Dimension Analysis</h3>
          <InfoButton
            label="How are the dimensions measured?"
            onClick={() => setOpenModal('dimensions')}
          />
        </div>

        <div className="flex flex-col gap-4">
          {rows.map((section) => (
            <DimensionRow key={section.name} name={section.name} value={section.value} />
          ))}
        </div>
      </div>

      {openModal === 'score' && (
        <AtsScoreModal score={score} sections={rows} onClose={closeModal} />
      )}
      {openModal === 'dimensions' && (
        <DimensionGuideModal sections={rows} onClose={closeModal} />
      )}
    </div>
  );
}