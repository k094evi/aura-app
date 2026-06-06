import { motion } from "motion/react";
import { Loader2 } from "lucide-react";

export default function AnalysisProgressBar({ progress }: { progress: number }) {
  return (
    <div className="text-center max-w-sm">
      <div className="flex items-center justify-center gap-2 mb-4">
        <Loader2 className="w-5 h-5 text-indigo-600 animate-spin" />
        <h2 className="text-2xl font-bold text-gray-900">Analyzing Resume</h2>
      </div>
      <p className="text-gray-500 font-medium mb-8">
        Comparing your experience with 500+ industry standards and ATS algorithms.
      </p>
      <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden mb-2">
        <motion.div
        className="h-full bg-indigo-600 rounded-full"
        initial={{ width: "0%" }}
        animate={{ width: `${progress}%` }}
        transition={{
            ease: "linear", 
            duration: 0.01
        }}
        />
      </div>
      <div className="flex justify-between items-center text-xs font-bold text-gray-400 uppercase tracking-wider">
        <span>Parsing content</span>
        <span>{progress}%</span>
      </div>
    </div>
  );
}
