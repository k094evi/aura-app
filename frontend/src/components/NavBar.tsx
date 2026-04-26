'use client';

import Link from "next/link";
import { Brain } from "lucide-react";

export const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">

        <Link href="/" className="flex items-center gap-2">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center">
            <Brain className="text-white w-6 h-6" />
          </div>

          <span className="text-xl font-bold tracking-tight text-gray-900">
            Aura
          </span>
        </Link>

        <div className="flex items-center gap-4">
          <Link
            href="/login"
            className="text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors"
          >
            Sign In
          </Link>

          <Link
            href="/signup"
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-100"
          >
            Get Started
          </Link>
        </div>

      </div>
    </nav>
  );
};