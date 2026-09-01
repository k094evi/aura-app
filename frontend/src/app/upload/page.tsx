'use client';

import { motion } from "motion/react";
import  Introduction  from "@/components/Introduction";
import  Checks  from "@/components/Checks";
import  Input  from "@/components/Input";

export default function UploadPage() {

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#0c0a14]">
      {/* Ambient background orbs, matching the rest of the app */}
      <div className="pointer-events-none absolute -left-[100px] top-[150px] size-[500px] rounded-full bg-fuchsia-600/30 blur-[110px]" />
      <div className="pointer-events-none absolute -right-[150px] top-[100px] size-[550px] rounded-full bg-violet-600/25 blur-[120px]" />
      <div className="pointer-events-none absolute left-[35%] top-[550px] size-[450px] rounded-full bg-cyan-500/20 blur-[110px]" />

      <section className="relative z-10 pt-25 px-4">
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
    </div>
  );
};