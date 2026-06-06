'use client';

import { motion } from "motion/react";
import  Introduction  from "@/components/Introduction";
import  Checks  from "@/components/Checks";
import  Input  from "@/components/Input";

export default function UploadPage() {
  
  return (
    <section className="pt-25 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Introduction />
          <Input />
          <Checks />
        </motion.div>
      </div>
    </section>
  );
};