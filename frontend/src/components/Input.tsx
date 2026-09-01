'use client';

import { useState, useRef } from "react";
import  CompanySelector  from "@/components/CompanySelector";
import { FileText } from "lucide-react";
import Link from 'next/link';

// Form for entering target job, selecting companies, and uploading a resume
export default function Input() {
    // List of companies selected by the user
    const [selectedCompanies, setSelectedCompanies] = useState<string[]>([]);

    // Target job title entered by the user
    const [targetJob, setTargetJob] = useState('');
    // Ref to the hidden file input, used to trigger it programmatically
    const fileInputRef = useRef<HTMLInputElement>(null);
    // The resume file selected by the user
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    // Handles file selection and stores the chosen file
    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
        setSelectedFile(e.target.files[0]);
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

            {/* Company selection component */}
            <div className="mb-6">
                <CompanySelector
                    selectedCompanies={selectedCompanies}
                    onSelectionChange={setSelectedCompanies}
                />
            </div>

            {/* File Upload */}
            <div className="mb-6">
                {/* Hidden native file input, triggered via the button below */}
                <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleFileSelect}
                className="hidden"
                />
                {/* Custom styled button that opens the file picker */}
                <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full px-6 py-4 bg-white/[0.03] border-2 border-dashed border-violet-500/40 rounded-xl hover:border-fuchsia-500/50 hover:bg-fuchsia-500/[0.06] transition-all flex items-center justify-center gap-3 group"
                >
                <FileText className="w-5 h-5 text-white/40 group-hover:text-fuchsia-300 transition-colors" />
                <span className="text-white/50 group-hover:text-fuchsia-200 transition-colors font-medium">
                    {selectedFile ? selectedFile.name : 'Click to upload resume (PDF, DOC, DOCX)'}
                </span>
                </button>
            </div>

          {/* Submit button - navigates to loading/analysis page */}
          <Link
            href="/loading"
            className="w-full px-6 py-3 bg-gradient-to-r from-[#8b5cf6] to-[#d946ef] text-white rounded-xl font-bold text-sm shadow-[0px_4px_6px_0px_rgba(139,92,246,0.25)] hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-2 group"
          >
            <FileText className="w-4 h-4 group-hover:scale-110 transition-transform" />
            Upload &amp; Analyze Resume
          </Link>
        </div>
    );
};