// Everything the dashboard / upload flow needs, in one import:
//   import { DashboardHeader, AssessmentSidebar } from '@/features/dashboard/components';

// Header + result cards
export { default as DashboardHeader } from './DashboardHeader';
export { default as AssessmentSidebar } from './AssessmentSidebar';
export { default as KeyStrengths } from './KeyStrengths';
export { default as SmartSuggestions } from './SmartSuggestions';
export { default as KeywordSkillOptimization } from './KeywordSkillOptimization';
export { default as CertificationRecommendations } from './CertificationRecommendations';
export type { Certification } from './CertificationRecommendations';
export { default as FormattingReadability } from './FormattingReadability';
export { default as CompanyMatchCarousel } from './CompanyMatchCarousel';
export type { CompanyMatch } from './CompanyMatchCarousel';
export { default as JobListings } from './JobListings';

// Upload + loading flow
export { default as Upload } from './upload';
export type { UploadPayload } from './upload';
export { default as CompanySelector } from './CompanySelector';
export { default as AnalysisLoadingOverlay } from './AnalysisLoadingOverlay';
export { default as DocumentScanner } from './DocumentScanner';
export { default as AnalysisProgressBar } from './AnalysisProgressBar';
export { default as AnalysisSteps } from './AnalysisSteps';