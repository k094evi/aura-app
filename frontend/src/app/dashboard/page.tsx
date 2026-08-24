import DashboardHeader from '@/features/dashboard/components/DashboardHeader';
import CompanyMatchCarousel from '@/features/dashboard/components/CompanyMatchCarousel';
import AssessmentSidebar from '@/features/dashboard/components/AssessmentSidebar';
import KeywordSkillOptimization from '@/features/dashboard/components/KeywordSkillOptimization';
import FormattingReadability from '@/features/dashboard/components/FormattingReadability';
import KeyStrengths from '@/features/dashboard/components/KeyStrengths';
import SmartSuggestions from '@/features/dashboard/components/SmartSuggestions';
import { mockData } from './data';

export default function DashboardPage() {
    return (
        <div className="min-h-screen bg-gray-50 pt-20 pb-20 px-4">
            {/* Top navigation/header bar of the dashboard */}
            <DashboardHeader />

            <div className="max-w-7xl mx-auto mt-6 flex gap-6 items-start">
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