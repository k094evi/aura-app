'use client';

import { CheckCircle } from "lucide-react";

// Row of feature highlights with checkmark icons
export default function Checks() {
    return (
        <div className="flex items-center justify-center gap-8 text-white/40">
            <div className="flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              <span className="text-sm font-medium text-white/60">ATS-Friendly</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              <span className="text-sm font-medium text-white/60">Instant Analysis</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              <span className="text-sm font-medium text-white/60">Smart Suggestions</span>
            </div>
        </div>
    );
}