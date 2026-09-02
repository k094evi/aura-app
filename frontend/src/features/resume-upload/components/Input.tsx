'use client';

import { useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { FileText } from 'lucide-react';

import CompanySelector from '@/features/resume-upload/components/CompanySelector';
import { getSupportedJobs } from '@/features/resume-upload/services/getSupportedJobs';
import { uploadResume } from '@/features/resume-upload/services/uploadResume';
import { resumeUploadSchema, type ResumeUploadFormData } from '@/schemas/resume';
import { analyzeResume } from '../services/analyzeResume';

export default function Input() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ResumeUploadFormData>({
    resolver: zodResolver(resumeUploadSchema),
    defaultValues: {
      targetJob: '',
      selectedCompanies: [],
    },
  });

  const selectedFile = watch('resumeFile');
  const selectedCompanies = watch('selectedCompanies');

  const { data: jobs, isLoading: jobsLoading, isError: jobsError } = useQuery({
    queryKey: ['supportedJobs'],
    queryFn: getSupportedJobs,
  });

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setValue('resumeFile', file, { shouldValidate: true });
    }
  };

const uploadMutation = useMutation({
  mutationFn: uploadResume,
  onSuccess: (resumeRow) => {
    analyzeResume(resumeRow.id).catch((err) => {
      console.error('Analysis failed to trigger:', err);
    });
    router.push(`/loading?resumeId=${resumeRow.id}`);
  },
});

  const onSubmit = (data: ResumeUploadFormData) => {
    uploadMutation.mutate({
      file: data.resumeFile,
      targetJob: data.targetJob,
      selectedCompanies: data.selectedCompanies,
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* Target Job Selection — now backend-driven */}
      <div className="w-full max-w-2xl mx-auto mb-6">
        <label htmlFor="targetJob" className="block text-sm font-semibold text-gray-700 mb-2 text-left">
          Target Job Title
        </label>
        <select
          id="targetJob"
          {...register('targetJob')}
          disabled={jobsLoading}
          className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
        >
          <option value="">
            {jobsLoading ? 'Loading jobs...' : jobsError ? 'Unable to load jobs' : 'Select a target job'}
          </option>
          {jobs?.map((job) => (
            <option key={job} value={job}>
              {job.replace(/\b\w/g, (c) => c.toUpperCase())}
            </option>
          ))}
        </select>
        {errors.targetJob && <p className="mt-2 text-sm text-red-600">{errors.targetJob.message}</p>}
        {jobsError && <p className="mt-2 text-sm text-red-500">Failed to load supported jobs. Please try again.</p>}
      </div>

      {/* Company selection — back on RHF, not local state */}
      <CompanySelector
        selectedCompanies={selectedCompanies}
        onSelectionChange={(companies) => setValue('selectedCompanies', companies, { shouldValidate: true })}
      />
      {errors.selectedCompanies && (
        <div className="w-full max-w-2xl mx-auto mt-2">
          <p className="text-sm text-red-600">{errors.selectedCompanies.message}</p>
        </div>
      )}

      {/* File Upload */}
      <div className="w-full max-w-2xl mx-auto mb-8">
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.docx"
          onChange={handleFileSelect}
          className="hidden"
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="w-full px-6 py-4 bg-white border-2 border-dashed border-gray-300 rounded-xl hover:border-indigo-400 hover:bg-indigo-50/30 transition-all flex items-center justify-center gap-3 group"
        >
          <FileText className="w-5 h-5 text-gray-400 group-hover:text-indigo-600 transition-colors" />
          <span className="text-gray-600 group-hover:text-indigo-600 transition-colors font-medium">
            {selectedFile ? selectedFile.name : 'Click to upload resume (PDF, DOCX)'}
          </span>
        </button>
        {errors.resumeFile && <p className="mt-2 text-sm text-red-600">{errors.resumeFile.message}</p>}
      </div>

      {uploadMutation.isError && (
        <p className="text-sm text-red-600 text-center mb-4" role="alert">
          {uploadMutation.error instanceof Error ? uploadMutation.error.message : 'Something went wrong while uploading your resume.'}
        </p>
      )}

      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
        <button
          type="submit"
          disabled={uploadMutation.isPending}
          className="w-full sm:w-auto px-10 py-5 bg-gray-900 text-white rounded-2xl font-bold text-lg hover:bg-gray-800 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 group shadow-xl shadow-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <FileText className="w-6 h-6 group-hover:scale-110 transition-transform" />
          {uploadMutation.isPending ? 'Uploading...' : 'Upload and Analyze Resume'}
        </button>
      </div>
    </form>
  );
}