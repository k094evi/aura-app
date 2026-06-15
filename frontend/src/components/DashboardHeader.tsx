'use client';

import Link from 'next/link';
import { ArrowLeft, Download, Share2 } from 'lucide-react';

// Header section for the dashboard page with navigation and action buttons
export default function DashboardHeader() {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">

      {/* Link to navigate back to the upload page */}
      <Link
        href="/"
        className="flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-indigo-600"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Upload
      </Link>

      {/* Action buttons for exporting and sharing */}
      <div className="flex gap-3">
        {/* Export report button */}
        <button className="px-6 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-bold flex items-center gap-2">
          <Download className="w-4 h-4" />
          Export Report
        </button>

        {/* Share results button */}
        <button className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-bold flex items-center gap-2">
          <Share2 className="w-4 h-4" />
          Share Results
        </button>
      </div>
    </div>
  );
}