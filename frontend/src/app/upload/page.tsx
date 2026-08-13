'use client';

import { motion } from "motion/react";
import  Introduction  from "@/features/resume-upload/components/Introduction";
import  Checks  from "@/features/resume-upload/components/Checks";
import  Input  from "@/features/resume-upload/components/Input";

export default function UploadPage() {
  
  return (
    <section className="pt-25 px-4">
      <div className="max-w-4xl mx-auto text-center">
        {/* Animated container that fades and slides in on page load */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Page intro/heading section */}
          <Introduction />
          {/* Resume upload input */}
          <Input />
          {/* List of checks/requirements for the uploaded file */}
          <Checks />
        </motion.div>
      </div>
    </section>
  );
};