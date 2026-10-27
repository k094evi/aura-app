// src/app/not-found.tsx
//
// Shown for any URL that does not exist (e.g. a misspelled /dashbord).
// Uses the same soft purple/cyan background as the rest of the app.

import Link from 'next/link';

const GRADIENT_BG = 'bg-[linear-gradient(90deg,#7c3aed_0%,#a78bfa_60%,#06b6d4_100%)]';

export default function NotFound() {
  return (
    <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-[#f0eeff] px-4 pb-16 pt-32 font-['DM_Sans',_sans-serif]">
      {/* Decorative background (same look as the sign-in pages) */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-[220px] -top-[220px] size-[940px] rounded-full bg-[radial-gradient(circle,rgba(167,139,250,0.38)_0%,rgba(167,139,250,0.16)_38%,rgba(167,139,250,0)_70%)]" />
        <div className="absolute -right-[220px] top-[60px] size-[800px] rounded-full bg-[radial-gradient(circle,rgba(34,211,238,0.30)_0%,rgba(34,211,238,0.12)_40%,rgba(34,211,238,0)_70%)]" />
        <div className="absolute -bottom-[200px] left-0 size-[500px] rounded-full bg-[radial-gradient(circle,rgba(251,191,36,0.22)_0%,rgba(251,191,36,0.08)_40%,rgba(251,191,36,0)_70%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle,#7c3aed_1px,transparent_1px)] bg-[length:24px_24px] opacity-[0.06]" />
      </div>

      <div className="relative z-10 flex w-full max-w-[480px] flex-col items-center gap-5 rounded-[24px] border-[1.5px] border-white bg-white/[0.72] px-6 py-10 text-center shadow-[0_4px_16px_rgba(124,58,237,0.05),0_20px_60px_rgba(17,24,39,0.09)] backdrop-blur-[12px] sm:px-10">
        <p className="bg-[linear-gradient(90deg,#7c3aed_0%,#06b6d4_100%)] bg-clip-text text-[72px] font-extrabold leading-none text-transparent">
          404
        </p>
        <div className="flex flex-col gap-[6px]">
          <h1 className="text-[24px] font-extrabold leading-tight text-[#111827]">Page not found</h1>
          <p className="text-[14px] leading-[1.45] text-[#4b5563]">
            The page you are looking for does not exist or may have been moved.
          </p>
        </div>
        <div className="flex w-full flex-col gap-3 sm:flex-row">
          <Link
            href="/"
            className="flex flex-1 items-center justify-center rounded-full border border-[#e5e7eb] bg-white px-6 py-[12px] text-[14px] font-semibold text-[#4b5563] transition hover:bg-[#f9fafb]"
          >
            Go to Home
          </Link>
          <Link
            href="/dashboard"
            className={`flex flex-1 items-center justify-center rounded-full ${GRADIENT_BG} px-6 py-[12px] text-[14px] font-bold text-white shadow-[0_8px_24px_rgba(124,58,237,0.25)] transition hover:brightness-105`}
          >
            Go to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}