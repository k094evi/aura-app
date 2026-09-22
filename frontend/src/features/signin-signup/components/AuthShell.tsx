'use client';

import type { ReactNode } from 'react';
import Link from 'next/link';
import { DM_Sans } from 'next/font/google';
import { ArrowLeft } from 'lucide-react';
import { Footer } from '@/components/Footer';

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
});

export const GRADIENT_BG = 'bg-[linear-gradient(90deg,#7c3aed_0%,#a78bfa_60%,#06b6d4_100%)]';

export default function AuthShell({
  children,
  maxWidthClass = 'max-w-[480px]',
}: {
  children: ReactNode;
  maxWidthClass?: string; // full Tailwind class so it gets detected
}) {
  return (
    <div className={`${dmSans.className} relative flex min-h-screen w-full flex-col overflow-hidden bg-[#f0eeff]`}>
      {/* ───── Decorative background (copy your existing block from signup/page.tsx here, unchanged) ───── */}

      <Link
        href="/"
        className="absolute left-4 top-6 z-20 flex items-center gap-2 rounded-full border border-white/80 bg-white/50 px-3 py-2 text-[14px] font-medium text-[#374151] backdrop-blur-[8px] transition hover:bg-white/70 sm:left-20 sm:top-10"
      >
        <ArrowLeft className="size-4" />
        Back to Home
      </Link>

      <main className="relative z-10 flex flex-1 flex-col items-center justify-center px-4 pb-12 pt-24">
        <div className={`flex w-full ${maxWidthClass} flex-col items-center gap-5`}>
          {/* ───── Logo (copy your existing Link + svg block here, unchanged) ───── */}

          <div className="flex w-full flex-col gap-5 rounded-[24px] border-[1.5px] border-white bg-white/[0.72] px-6 py-8 shadow-[0_4px_16px_rgba(124,58,237,0.05),0_20px_60px_rgba(17,24,39,0.09)] backdrop-blur-[12px] sm:px-10">
            {children}
          </div>
        </div>
      </main>

      <div className="relative z-10">
        <Footer />
      </div>
    </div>
  );
}