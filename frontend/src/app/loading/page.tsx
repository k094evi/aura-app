'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import DocumentScanner from '@/components/DocumentScanner';
import AnalysisProgressBar from '@/features/resume-upload/components/AnalysisProgressBar';
import AnalysisSteps from '@/features/resume-upload/components/AnalysisSteps';
import { getResume } from '@/features/resume-upload/services/getResume';
import type { Resume } from '@/schemas/resume';

const STATUS_PROGRESS: Record<Resume['status'], number> = {
  uploaded: 15,
  processing: 60,
  completed: 100,
  failed: 60,
};

const ANALYSIS_TIMEOUT_MS = 45_000;

export default function LoadingPage() {
  const searchParams = useSearchParams();
  const resumeId = searchParams.get('resumeId');
  const router = useRouter();
  const [timedOut, setTimedOut] = useState(false);

  useEffect(() => {
    if (!resumeId) return;
    const timer = setTimeout(() => setTimedOut(true), ANALYSIS_TIMEOUT_MS);
    return () => clearTimeout(timer);
  }, [resumeId]);

  useEffect(() => {
    router.prefetch('/dashboard');
  }, [router]);

  const { data: resume, isError } = useQuery({
    queryKey: ['resume', resumeId],
    queryFn: () => getResume(resumeId!),
    enabled: !!resumeId,
    refetchInterval: (query) => {
      const status = query.state.data?.status;
      if (timedOut || status === 'completed' || status === 'failed') return false;
      return 2000;
    },
  });

  useEffect(() => {
    if (resume?.status === 'completed') {
      const timeout = setTimeout(() => router.push(`/dashboard?resumeId=${resume.id}`), 400);
      return () => clearTimeout(timeout);
    }
  }, [resume?.status, router]);

  if (!resumeId) {
    return (
      <div className="fixed inset-0 z-100 bg-white flex items-center justify-center p-4">
        <p role="alert">No resume specified.</p>
      </div>
    );
  }

  if (isError || resume?.status === 'failed' || timedOut) {
    return (
      <div className="fixed inset-0 z-100 bg-white flex flex-col items-center justify-center gap-4 p-4">
        <p role="alert" className="text-red-600">
          {timedOut ? 'This is taking longer than expected.' : "We couldn't analyze your resume."}
        </p>
        <button onClick={() => router.push('/upload')} className="text-indigo-600 font-semibold underline">
          Try Again
        </button>
      </div>
    );
  }

  const progress = resume ? STATUS_PROGRESS[resume.status] : 0;

  return (
    <div className="fixed inset-0 z-100 bg-white flex flex-col items-center justify-center p-4">
      <DocumentScanner />
      <AnalysisProgressBar progress={progress} />
      <AnalysisSteps progress={progress} />
    </div>
  );
}