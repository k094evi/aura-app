'use client';

import { useState } from "react";
import { motion } from "motion/react";
import { FileText, CheckCircle, Zap } from "lucide-react";
import { CompanySelector } from "@/components/CompanySelector";

export default function UploadPage() {
  const [selectedCompanies, setSelectedCompanies] = useState<string[]>([]);

  const handleUpload = () => {
    console.log("Upload clicked");
  };

  return (
    <section className="pt-32 pb-20 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100 mb-6">
            <Zap className="w-3 h-3 mr-1" />
            Powered by BERT
          </span>

          <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 mb-6 leading-tight">
            Optimize your resume with{" "}
            <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-600 to-violet-600">
              AI Intelligence.
            </span>
          </h1>

          <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
            Upload your resume and get instant feedback on ATS compatibility,
            keyword optimization, and professional impact.
          </p>

          <CompanySelector
            selectedCompanies={selectedCompanies}
            onSelectionChange={setSelectedCompanies}
          />

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <button
              onClick={handleUpload}
              className="w-full sm:w-auto px-10 py-5 bg-gray-900 text-white rounded-2xl font-bold text-lg hover:bg-gray-800 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 group shadow-xl shadow-gray-200"
            >
              <FileText className="w-6 h-6 group-hover:scale-110 transition-transform" />
              Upload & Analyze Resume
            </button>
          </div>

          <div className="flex items-center justify-center gap-8 text-gray-400">
            <div className="flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span className="text-sm font-medium">ATS-Friendly</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span className="text-sm font-medium">Instant Analysis</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span className="text-sm font-medium">Smart Suggestions</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}