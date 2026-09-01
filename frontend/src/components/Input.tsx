'use client';

import { useState, useRef } from "react";
import CompanySelector from "@/components/CompanySelector";
import { FileText, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { authHeaders } from "@/lib/auth";

export default function Input() {
  const [selectedCompanies, setSelectedCompanies] = useState<string[]>([]);
  const [targetJob, setTargetJob] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      setError(null);
    }
  };

  const handleSubmit = async () => {
    if (!selectedFile) {
      setError("Please upload your resume before continuing.");
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      const form = new FormData();
      form.append("file", selectedFile);
      if (targetJob) form.append("target_job", targetJob);
      if (selectedCompanies.length > 0)
        form.append("target_companies", JSON.stringify(selectedCompanies));

      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: authHeaders(),
        body: form,
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.detail || "Analysis failed. Please try again.");
      }

      const data = await res.json();
      sessionStorage.setItem("aura_result", JSON.stringify(data));
      router.push("/loading");
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
      setIsUploading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto mb-8 rounded-3xl border border-white/[0.07] bg-[#151221]/70 p-7 text-left shadow-[0px_16px_32px_0px_rgba(0,0,0,0.25)] backdrop-blur-[20px]">
      {/* Target Job Input */}
      <div className="mb-5">
        <label className="block text-sm font-semibold text-white/70 mb-2 text-left">
          Target Job Title
        </label>
        <input
          type="text"
          value={targetJob}
          onChange={(e) => setTargetJob(e.target.value)}
          placeholder="e.g., Senior Software Engineer, Product Manager, Data Scientist"
          className="w-full px-4 py-3 bg-white/[0.03] border-2 border-white/[0.07] rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-fuchsia-500/40 focus:border-transparent transition-all"
        />
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
          <FileText className={`w-5 h-5 transition-colors ${
            error && !selectedFile
              ? "text-red-400"
              : "text-white/40 group-hover:text-fuchsia-300"
          }`} />
          <span className={`font-medium transition-colors ${
            error && !selectedFile
              ? "text-red-400"
              : "text-white/50 group-hover:text-fuchsia-200"
          }`}>
            {selectedFile ? selectedFile.name : "Click to upload resume (PDF, DOC, DOCX)"}
          </span>
        </button>
      </div>

      {/* Error message */}
      {error && (
        <div className="mb-4">
          <p className="text-red-400 text-sm text-center font-medium">{error}</p>
        </div>
      )}

      {/* Submit */}
      <button
        onClick={handleSubmit}
        disabled={isUploading}
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