'use client';

import DashboardHeader from '@/components/DashboardHeader';
import CompanyMatchCarousel from '@/components/CompanyMatchCarousel';
import AssessmentSidebar from '@/components/AssessmentSidebar';
import { mockData } from './data';

export default function DashboardPage() {
    return (
        <div className="min-h-screen bg-gray-50 pt-24 pb-20 px-4">
            <DashboardHeader />
            <CompanyMatchCarousel companies={mockData.companyMatches} />
            <AssessmentSidebar
                score={mockData.score}
                sections={mockData.sections}
            />
        </div>
    );
};