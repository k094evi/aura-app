'use client';

import { Zap } from "lucide-react";

// Hero section introducing the resume optimization tool
export default function Introduction() {
    return (
        <div>
            {/* Badge highlighting the AI model used */}
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-teal-500/10 text-teal-300 border border-teal-500/20 mb-6">
                <Zap className="w-3 h-3 mr-1" />
                Powered by BERT
            </span>

            {/* Main headline with gradient-highlighted text */}
            <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 leading-tight">
                Optimize your resume with{" "}
                    <span className="text-transparent bg-clip-text bg-linear-to-r from-[#8b5cf6] to-[#d946ef]">
                    AI Intelligence.
                    </span>
            </h1>

            {/* Supporting description text */}
            <p className="text-xl text-white/50 mb-10 max-w-2xl mx-auto">
                Upload your resume and get instant feedback on ATS compatibility,
                keyword optimization, and professional impact.
            </p>
        </div>
    );
};