'use client';

import DashboardHeader from '@/components/DashboardHeader';
import CompanyMatchCarousel from '@/components/CompanyMatchCarousel';
import AssessmentSidebar from '@/components/AssessmentSidebar';
import KeywordSkillOptimization from '@/components/KeywordSkillOptimization';
import FormattingReadability from '@/components/FormattingReadability';
import KeyStrengths from '@/components/KeyStrengths';
import SmartSuggestions from '@/components/SmartSuggestions';
import { mockData } from './data';

export default function DashboardPage() {
    return (
        <div className="relative min-h-screen w-full overflow-hidden bg-[#0c0a14] pt-20 pb-20 px-4">
            {/* Ambient background orbs, matching the rest of the app.
                Spaced down the full page so the long dashboard content
                doesn't run out into a flat, orb-less section near the bottom. */}
            <div className="pointer-events-none absolute -left-[100px] top-[150px] size-[500px] rounded-full bg-fuchsia-600/30 blur-[110px]" />
            <div className="pointer-events-none absolute -right-[150px] top-[100px] size-[550px] rounded-full bg-violet-600/25 blur-[120px]" />
            <div className="pointer-events-none absolute left-[35%] top-[550px] size-[450px] rounded-full bg-cyan-500/20 blur-[110px]" />
            <div className="pointer-events-none absolute -right-[120px] top-[1000px] size-[500px] rounded-full bg-fuchsia-600/20 blur-[120px]" />
            <div className="pointer-events-none absolute -left-[120px] top-[1500px] size-[480px] rounded-full bg-violet-600/20 blur-[115px]" />

            {/* Top navigation/header bar of the dashboard */}
            <div className="relative z-10">
                <DashboardHeader />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto mt-6 flex gap-6 items-start">
                {/* Left sidebar showing overall resume assessment score and section breakdown */}
                <div className="w-72 shrink-0 flex flex-col gap-4">
                    <AssessmentSidebar
                        score={mockData.score}
                        sections={mockData.sections}
                    />
                </div>

                {/* Main content column */}
                <div className="flex-1 flex flex-col gap-4">
                    {/* Shows missing/matched keywords and skills for optimization */}
                    <KeywordSkillOptimization skillGaps={mockData.skillGaps} />

                    {/* Carousel of companies that match the resume */}
                    <CompanyMatchCarousel companies={mockData.companyMatches} />

                    {/* Displays formatting and readability/grammar issues */}
                    <FormattingReadability grammarIssues={mockData.grammarIssues} />

                    {/* Side-by-side display of key strengths and suggested improvements */}
                    <div className="grid grid-cols-2 gap-4">
                        <KeyStrengths strengths={mockData.strengths} />
                        <SmartSuggestions improvements={mockData.improvements} />
                    </div>
                </div>
            </div>
        </div>
    );
}