'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Camera,
  User,
  Calendar,
  Check,
} from 'lucide-react';

export default function MyProfilePage() {
  const [name, setName] = useState('John Doe');
  const [email, setEmail] = useState('john.doe@email.com');
  const [jobTitle, setJobTitle] = useState('Software Developer');
  const [location, setLocation] = useState('Metro Manila');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const initials = name
    .split(' ')
    .filter(Boolean)
    .map((n) => n[0])
    .join('')
    .toUpperCase();

  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-hidden bg-[#0c0a14] pt-20">
      {/* Ambient background orbs */}
      <div className="pointer-events-none absolute -left-[100px] top-[150px] size-[500px] rounded-full bg-fuchsia-600/30 blur-[110px]" />
      <div className="pointer-events-none absolute -right-[150px] top-[100px] size-[550px] rounded-full bg-violet-600/25 blur-[120px]" />
      <div className="pointer-events-none absolute left-[35%] top-[550px] size-[450px] rounded-full bg-cyan-500/20 blur-[110px]" />

      {/* Sub-header / back link */}
      <div className="relative z-10 flex w-full shrink-0 items-center justify-between px-8 pb-8 pt-5 md:px-16">
        <Link href="/dashboard" className="flex items-center gap-2 text-sm font-semibold text-fuchsia-500 transition-colors hover:text-fuchsia-400">
          <ArrowLeft className="size-4" />
          Back to Dashboard
        </Link>
      </div>

      {/* Main workspace */}
      <div className="relative z-10 flex w-full flex-1 flex-col gap-8 px-8 pb-16 md:px-16">
        {/* Title */}
        <div className="flex w-full flex-col gap-2">
          <h1 className="text-[32px] font-extrabold leading-normal text-white">My Profile</h1>
          <p className="text-base font-normal text-white/60">
            Manage your personal information and account details.
          </p>
        </div>

        {/* Summary row: avatar card + stats */}
        <div className="flex w-full flex-col gap-6 lg:flex-row lg:items-start">
          {/* Profile quick card */}
          <div className="flex flex-1 items-center gap-6 rounded-3xl border border-white/[0.07] bg-[#151221]/70 p-8 shadow-[0px_16px_32px_0px_rgba(0,0,0,0.25)] backdrop-blur-[20px]">
            <div className="relative flex size-20 shrink-0 items-start">
              <div className="flex size-20 items-center justify-center rounded-full bg-[#8b5cf6]">
                <p className="text-[32px] font-extrabold text-white">{initials || 'JD'}</p>
              </div>
              <button
                title="Change photo"
                className="absolute bottom-0 right-0 flex size-7 items-center justify-center rounded-2xl bg-fuchsia-500 shadow-[0px_2px_2px_0px_rgba(0,0,0,0.16)] transition-colors hover:bg-fuchsia-400"
              >
                <Camera className="size-3 text-white" />
              </button>
            </div>
            <div className="flex min-w-0 flex-1 flex-col gap-1.5">
              <p className="truncate text-[22px] font-extrabold text-white">{name}</p>
              <p className="truncate text-sm font-normal text-white/60">{email}</p>
              <div className="flex items-center gap-1.5">
                <Calendar className="size-3.5 shrink-0 text-white/40" />
                <p className="whitespace-nowrap text-[13px] font-normal text-white/40">
                  Member since June 2025
                </p>
              </div>
            </div>
          </div>

          {/* Stat cards */}
          <div className="flex flex-1 items-start gap-5">
            <div className="flex flex-1 flex-col gap-3 rounded-2xl border border-white/[0.07] bg-[#151221]/70 p-7 shadow-[0px_16px_32px_0px_rgba(0,0,0,0.25)] backdrop-blur-[20px]">
              <p className="w-full text-[11px] font-extrabold uppercase tracking-wide text-white/40">
                Total Analyses
              </p>
              <div className="flex w-full items-baseline">
                <p className="text-4xl font-extrabold text-white">3</p>
              </div>
            </div>
            <div className="flex flex-1 flex-col gap-3 rounded-2xl border border-white/[0.07] bg-[#151221]/70 p-7 shadow-[0px_16px_32px_0px_rgba(0,0,0,0.25)] backdrop-blur-[20px]">
              <p className="w-full text-[11px] font-extrabold uppercase tracking-wide text-white/40">
                Best ATS Score
              </p>
              <div className="flex w-full items-baseline gap-1 whitespace-nowrap">
                <p className="text-4xl font-extrabold text-white">82</p>
                <p className="text-sm font-medium text-white/40">/100</p>
              </div>
            </div>
          </div>
        </div>

        {/* Personal information form */}
        <div className="flex w-full flex-col gap-7 rounded-3xl border border-white/[0.07] bg-[#151221]/70 p-8 shadow-[0px_16px_32px_0px_rgba(0,0,0,0.25)] backdrop-blur-[20px]">
          <div className="flex w-full items-center gap-3.5">
            <div className="flex shrink-0 items-start rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-2.5">
              <User className="size-5 text-emerald-500" />
            </div>
            <div className="flex min-w-0 flex-1 flex-col gap-1">
              <p className="text-lg font-bold text-white">Personal Information</p>
              <p className="text-[13px] font-normal text-white/60">
                Update your name, email, and role details
              </p>
            </div>
          </div>

          <div className="flex w-full flex-col gap-5">
            <div className="flex w-full flex-col gap-2">
              <label className="text-[11px] font-bold uppercase tracking-wide text-white/40">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-[10px] border border-white/[0.07] bg-white/[0.03] px-4 py-3 text-sm font-medium text-white outline-none transition-colors focus:border-fuchsia-500/50 focus:ring-2 focus:ring-fuchsia-500/20"
              />
            </div>

            <div className="flex w-full flex-col gap-2">
              <label className="text-[11px] font-bold uppercase tracking-wide text-white/40">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-[10px] border border-white/[0.07] bg-white/[0.03] px-4 py-3 text-sm font-medium text-white outline-none transition-colors focus:border-fuchsia-500/50 focus:ring-2 focus:ring-fuchsia-500/20"
              />
            </div>

            <div className="flex w-full flex-col gap-5 sm:flex-row">
              <div className="flex flex-1 flex-col gap-2">
                <label className="text-[11px] font-bold uppercase tracking-wide text-white/40">
                  Job Title
                </label>
                <input
                  type="text"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  className="w-full rounded-[10px] border border-white/[0.07] bg-white/[0.03] px-4 py-3 text-sm font-medium text-white outline-none transition-colors focus:border-fuchsia-500/50 focus:ring-2 focus:ring-fuchsia-500/20"
                />
              </div>
              <div className="flex flex-1 flex-col gap-2">
                <label className="text-[11px] font-bold uppercase tracking-wide text-white/40">
                  Location
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full rounded-[10px] border border-white/[0.07] bg-white/[0.03] px-4 py-3 text-sm font-medium text-white outline-none transition-colors focus:border-fuchsia-500/50 focus:ring-2 focus:ring-fuchsia-500/20"
                />
              </div>
            </div>
          </div>

          <div className="flex w-full items-start justify-end">
            <button
              onClick={handleSave}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#8b5cf6] to-[#d946ef] px-6 py-3.5 text-sm font-bold text-white shadow-[0px_4px_6px_0px_rgba(139,92,246,0.25)] transition-opacity hover:opacity-90"
            >
              {saved ? (
                <>
                  <Check className="size-4" />
                  Saved
                </>
              ) : (
                'Save Changes'
              )}
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}