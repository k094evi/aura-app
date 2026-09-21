import AnalysisRecordCard, { type AnalysisRecord } from '@/features/analysis-history/components/AnalysisRecordCard';
import {
  AnalysisHistoryBackground,
  AnalysisHistoryEmptyRings,
  AnalysisHistoryHeader,
  AnalysisHistoryPagination,
  AnalysisHistoryEmptyState,
} from '@/features/analysis-history/components/AnalysisHistoryParts';

// Hardcoded to match the Figma "Resume History" frame exactly. Swap for a
// fetch (e.g. GET /api/analysis-history) once the backend exists.
//
// To preview the Figma empty-state frame, set this to `[]`.
const records: AnalysisRecord[] = [
  {
    id: '1',
    filename: 'Senior_PM_Resume_v3.pdf',
    date: 'Oct 15, 2026',
    role: 'Senior Product Manager',
    companies: ['Google', 'Meta'],
    moreCompanies: 3,
    atsScore: 92,
    status: 'Optimized',
  },
  {
    id: '2',
    filename: 'UX_Designer_Resume.pdf',
    date: 'Oct 12, 2026',
    role: 'UX Designer',
    companies: ['Google'],
    moreCompanies: 0,
    atsScore: 85,
    status: 'Optimized',
  },
  {
    id: '3',
    filename: 'Frontend_Dev_CV.pdf',
    date: 'Oct 8, 2026',
    role: 'Frontend Developer',
    companies: ['Spotify', 'Stripe'],
    moreCompanies: 2,
    atsScore: 74,
    status: 'Needs Review',
  },
  {
    id: '4',
    filename: 'Data_Analyst_Resume.pdf',
    date: 'Oct 3, 2026',
    role: 'Data Analyst',
    companies: ['Meta', 'Netflix'],
    moreCompanies: 4,
    atsScore: 68,
    status: 'Needs Review',
  },
  {
    id: '5',
    filename: 'Marketing_Manager.docx',
    date: 'Sep 28, 2026',
    role: 'Marketing Manager',
    companies: ['Apple', 'Nike'],
    moreCompanies: 1,
    atsScore: 45,
    status: 'Draft',
  },
  {
    id: '6',
    filename: 'Backend_Engineer_v2.pdf',
    date: 'Sep 22, 2026',
    role: 'Backend Engineer',
    companies: ['Amazon', 'Microsoft'],
    moreCompanies: 5,
    atsScore: 88,
    status: 'Optimized',
  },
];

// Total shown in "Showing 1-6 of 24 resumes" (hardcoded until real pagination exists)
const TOTAL_RESUMES = 24;

export default function AnalysisHistoryPage() {
  const hasRecords = records.length > 0;

  return (
    // DM Sans is the Figma typeface; make sure it's loaded (weights 400-800)
    // e.g. via next/font/google in the root layout.
    <div className="relative flex min-h-screen w-full flex-col overflow-hidden bg-[#f0eeff] pt-20 font-['DM_Sans',sans-serif]">
      <AnalysisHistoryBackground />
      {!hasRecords && <AnalysisHistoryEmptyRings />}

      <main className="relative z-10 flex w-full flex-1 flex-col gap-8 px-6 py-[60px] md:px-20">
        <AnalysisHistoryHeader disabled={!hasRecords} />

        {hasRecords ? (
          <>
            <div className="flex w-full flex-col gap-4">
              {records.map((record) => (
                <AnalysisRecordCard key={record.id} record={record} />
              ))}
            </div>

            <AnalysisHistoryPagination shown={records.length} total={TOTAL_RESUMES} />
          </>
        ) : (
          <AnalysisHistoryEmptyState />
        )}
      </main>
    </div>
  );
}