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

            {/* Company selection component */}
            <CompanySelector
                selectedCompanies={selectedCompanies}
                onSelectionChange={setSelectedCompanies}
            />

            {/* File Upload */}
            <div className="w-full max-w-2xl mx-auto mb-8">
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
                className="w-full px-6 py-4 bg-white border-2 border-dashed border-gray-300 rounded-xl hover:border-indigo-400 hover:bg-indigo-50/30 transition-all flex items-center justify-center gap-3 group"
                >
                <FileText className="w-5 h-5 text-gray-400 group-hover:text-indigo-600 transition-colors" />
                <span className="text-gray-600 group-hover:text-indigo-600 transition-colors font-medium">
                    {selectedFile ? selectedFile.name : 'Click to upload resume (PDF, DOC, DOCX)'}
                </span>
                </button>
            </div>

          {/* Submit button - navigates to loading/analysis page */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <Link
              href="/loading"
              className="w-full sm:w-auto px-10 py-5 bg-gray-900 text-white rounded-2xl font-bold text-lg hover:bg-gray-800 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 group shadow-xl shadow-gray-200"
            >
              <FileText className="w-6 h-6 group-hover:scale-110 transition-transform" />
              Upload & Analyze Resume
            </Link>
          </div>
        </div>
    );
};