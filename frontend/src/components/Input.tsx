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
    <div>
      {/* Target Job Input */}
      <div className="w-full max-w-2xl mx-auto mb-6">
        <label className="block text-sm font-semibold text-gray-700 mb-2 text-left">
          Target Job Title
        </label>
        <input
          type="text"
          value={targetJob}
          onChange={(e) => setTargetJob(e.target.value)}
          placeholder="e.g., Senior Software Engineer, Product Manager, Data Scientist"
          className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
        />
      </div>

      {/* Company selector */}
      <CompanySelector
        selectedCompanies={selectedCompanies}
        onSelectionChange={setSelectedCompanies}
      />

      {/* File Upload */}
      <div className="w-full max-w-2xl mx-auto mb-4">
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.doc,.docx"
          onChange={handleFileSelect}
          className="hidden"
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          className={`w-full px-6 py-4 bg-white border-2 border-dashed rounded-xl transition-all flex items-center justify-center gap-3 group ${
            error && !selectedFile
              ? "border-red-400 bg-red-50/30"
              : "border-gray-300 hover:border-indigo-400 hover:bg-indigo-50/30"
          }`}
        >
          <FileText className={`w-5 h-5 transition-colors ${
            error && !selectedFile
              ? "text-red-400"
              : "text-gray-400 group-hover:text-indigo-600"
          }`} />
          <span className={`font-medium transition-colors ${
            error && !selectedFile
              ? "text-red-500"
              : "text-gray-600 group-hover:text-indigo-600"
          }`}>
            {selectedFile ? selectedFile.name : "Click to upload resume (PDF, DOC, DOCX)"}
          </span>
        </button>
      </div>

      {/* Error message */}
      {error && (
        <div className="w-full max-w-2xl mx-auto mb-4">
          <p className="text-red-500 text-sm text-center font-medium">{error}</p>
        </div>
      )}

      {/* Submit */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12 mt-4">
        <button
          onClick={handleSubmit}
          disabled={isUploading}
          className="w-full sm:w-auto px-10 py-5 bg-gray-900 text-white rounded-2xl font-bold text-lg hover:bg-gray-800 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 group shadow-xl shadow-gray-200 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          {isUploading ? (
            <>
              <Loader2 className="w-6 h-6 animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <FileText className="w-6 h-6 group-hover:scale-110 transition-transform" />
              Upload & Analyze Resume
            </>
          )}
        </button>
      </div>
    </div>
  );
}