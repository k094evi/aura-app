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
        <div className="min-h-screen bg-gray-50 pt-20 pb-20 px-4">
            <DashboardHeader />

            <div className="max-w-7xl mx-auto mt-6 flex gap-6 items-start">
                <div className="w-72 shrink-0 flex flex-col gap-4">
                    <AssessmentSidebar
                        score={mockData.score}
                        sections={mockData.sections}
                    />
                </div>

                <div className="flex-1 flex flex-col gap-4">
                    <KeywordSkillOptimization skillGaps={mockData.skillGaps} />
                    <CompanyMatchCarousel companies={mockData.companyMatches} />
                    <FormattingReadability grammarIssues={mockData.grammarIssues} />
                    <div className="grid grid-cols-2 gap-4">
                        <KeyStrengths strengths={mockData.strengths} />
                        <SmartSuggestions improvements={mockData.improvements} />
                    </div>
                </div>
            </div>
        </div>
    );
}