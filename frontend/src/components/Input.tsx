'use client';

import { useEffect, useRef, useState } from "react";

import CompanySelector from "@/components/CompanySelector";

import { FileText, Loader2 } from "lucide-react";

import { useRouter } from "next/navigation";

import { authHeaders } from "@/lib/auth";

export default function Input() {
  // Stores the companies selected by the user.
  const [selectedCompanies, setSelectedCompanies] = useState<string[]>([]);

  // Stores the selected target job.
  const [targetJob, setTargetJob] = useState("");

  // Stores all supported job titles from the backend.
  const [jobOptions, setJobOptions] = useState<string[]>([]);

  // Tracks whether the job list is currently loading.
  const [isLoadingJobs, setIsLoadingJobs] = useState(true);

  // Stores the uploaded resume file.
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Tracks whether the resume is currently being analyzed.
  const [isUploading, setIsUploading] = useState(false);

  // Stores an error message.
  const [error, setError] = useState<string | null>(null);

  // Reference to the hidden file input.
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Next.js router.
  const router = useRouter();

  // ==========================================================================
  // LOAD JOB TITLES FROM BACKEND
  // ==========================================================================

  useEffect(() => {
    const loadSupportedJobs = async () => {
      try {
        setIsLoadingJobs(true);

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_FLASK_API_URL || "http://localhost:8000"}/api/jobs/supported`,
          {
            method: "GET",
            headers: authHeaders(),
          }
        );

        if (!response.ok) {
          throw new Error("Failed to load supported job titles.");
        }

        const data = await response.json();

        // Make sure the backend returned an array.
        if (Array.isArray(data.jobs)) {
          setJobOptions(data.jobs);
        } else {
          throw new Error("Invalid job list returned by the backend.");
        }
      } catch (err) {
        console.error("Failed to load supported jobs:", err);

        setError(
          "Unable to load supported job titles. Please refresh the page."
        );
      } finally {
        setIsLoadingJobs(false);
      }
    };

    loadSupportedJobs();
  }, []);

  // ==========================================================================
  // FILE SELECTION
  // ==========================================================================

  const handleFileSelect = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      setError(null);
    }
  };

  // ==========================================================================
  // SUBMIT RESUME
  // ==========================================================================

  const handleSubmit = async () => {
    if (!selectedFile) {
      setError("Please upload your resume before continuing.");
      return;
    }

    if (!targetJob) {
      setError("Please select a target job before continuing.");
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      const form = new FormData();

      // Add resume file.
      form.append("file", selectedFile);

      // Add selected target job.
      form.append("target_job", targetJob);

      // Add selected companies if any were selected.
      if (selectedCompanies.length > 0) {
        form.append(
          "target_companies",
          JSON.stringify(selectedCompanies)
        );
      }

      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: authHeaders(),
        body: form,
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));

        throw new Error(
          err.detail || "Analysis failed. Please try again."
        );
      }

      const data = await res.json();

      // Store analysis result for the loading/dashboard pages.
      sessionStorage.setItem(
        "aura_result",
        JSON.stringify(data)
      );

      // Move to loading page.
      router.push("/loading");
    } catch (err: any) {
      setError(
        err.message || "Something went wrong. Please try again."
      );

      setIsUploading(false);
    }
  };

  // ==========================================================================
  // UI
  // ==========================================================================

  return (
    <div className="w-full max-w-2xl mx-auto mb-8 rounded-3xl border border-white/[0.07] bg-[#151221]/70 p-7 text-left shadow-[0px_16px_32px_0px_rgba(0,0,0,0.25)] backdrop-blur-[20px]">

      {/* Target Job Input */}
      <div className="mb-5">
        <label className="block text-sm font-semibold text-white/70 mb-2 text-left">
          Target Job Title
        </label>

        <select
          value={targetJob}
          onChange={(e) => {
            setTargetJob(e.target.value);
            setError(null);
          }}
          disabled={isLoadingJobs || isUploading}
          className="w-full px-4 py-3 bg-white/[0.03] border-2 border-white/[0.07] rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-fuchsia-500/40 focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <option
            value=""
            className="bg-[#151221] text-white/50"
          >
            {isLoadingJobs
              ? "Loading supported jobs..."
              : "Select a target job"}
          </option>

          {jobOptions.map((job) => (
            <option
              key={job}
              value={job}
              className="bg-[#151221] text-white"
            >
              {job}
            </option>
          ))}
        </select>
      </div>

      {/* Company selector */}
      <div className="mb-6">
        <CompanySelector
          selectedCompanies={selectedCompanies}
          onSelectionChange={setSelectedCompanies}
        />
      </div>

      {/* File Upload */}
      <div className="mb-6">
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.doc,.docx"
          onChange={handleFileSelect}
          className="hidden"
        />

        <button
          onClick={() => fileInputRef.current?.click()}
          className={`w-full px-6 py-4 bg-white/[0.03] border-2 border-dashed rounded-xl transition-all flex items-center justify-center gap-3 group ${
            error && !selectedFile
              ? "border-red-400/60 bg-red-500/[0.06]"
              : "border-violet-500/40 hover:border-fuchsia-500/50 hover:bg-fuchsia-500/[0.06]"
          }`}
        >
          <FileText
            className={`w-5 h-5 transition-colors ${
              error && !selectedFile
                ? "text-red-400"
                : "text-white/40 group-hover:text-fuchsia-300"
            }`}
          />

          <span
            className={`font-medium transition-colors ${
              error && !selectedFile
                ? "text-red-400"
                : "text-white/50 group-hover:text-fuchsia-200"
            }`}
          >
            {selectedFile
              ? selectedFile.name
              : "Click to upload resume (PDF, DOC, DOCX)"}
          </span>
        </button>
      </div>

      {/* Error message */}
      {error && (
        <div className="mb-4">
          <p className="text-red-400 text-sm text-center font-medium">
            {error}
          </p>
        </div>
      )}

      {/* Submit */}
      <button
        onClick={handleSubmit}
        disabled={isUploading || isLoadingJobs}
        className="w-full px-6 py-3 bg-gradient-to-r from-[#8b5cf6] to-[#d946ef] text-white rounded-xl font-bold text-sm shadow-[0px_4px_6px_0px_rgba(139,92,246,0.25)] hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-2 group disabled:opacity-60 disabled:cursor-not-allowed disabled:active:scale-100"
      >
        {isUploading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Analyzing...
          </>
        ) : (
          <>
            <FileText className="w-4 h-4 group-hover:scale-110 transition-transform" />
            Upload &amp; Analyze Resume
          </>
        )}
      </button>
    </div>
  );
}