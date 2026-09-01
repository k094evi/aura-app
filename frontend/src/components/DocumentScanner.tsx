'use client';

import { motion } from "motion/react";
import { FileText } from "lucide-react";

// Animated document scanner illustration showing a scanning line effect
export default function DocumentScanner() {
  return (
    <div className="relative w-48 h-64 mb-12">
      {/* Document card background with icon */}
      <div className="absolute inset-0 bg-white/[0.03] border-2 border-white/[0.07] rounded-2xl shadow-[0px_16px_32px_0px_rgba(0,0,0,0.25)] flex items-center justify-center">
        <FileText className="w-16 h-16 text-white/10" />
      </div>
      {/* Scanning line that animates from top to bottom, looping */}
      <motion.div
        className="absolute top-0 left-0 right-0 h-1 bg-fuchsia-500 shadow-[0_0_15px_rgba(217,70,239,0.6)] z-10"
        initial={{ top: "0%" }}
        animate={{ top: "100%" }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      />
      {/* Decorative grid of lines to simulate document content/text */}
      <div className="absolute inset-0 flex items-center justify-center opacity-10">
        <div className="grid grid-cols-4 gap-2 w-full px-4">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="h-2 bg-white rounded-full" />
          ))}
        </div>
      </div>
    </div>
  );
}