'use client';

import { CheckCircle } from "lucide-react";

export default function Checks() {
    return (
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
    );
}