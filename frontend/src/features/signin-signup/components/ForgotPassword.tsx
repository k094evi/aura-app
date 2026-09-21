// src/features/signin-signup/components/ForgotPassword.tsx

'use client';

import { useState } from 'react';
import { DM_Sans } from 'next/font/google';
import { ArrowLeft, CheckCircle2, Loader2 } from 'lucide-react';
import Link from 'next/link';

// Figma uses DM Sans throughout.
const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
});

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  const handleSubmit = async () => {
    // Field-level validation (red error state from the Figma design)
    const nextEmailError = !email
      ? 'Email is required'
      : !EMAIL_RE.test(email)
        ? 'Invalid email address'
        : null;

    setEmailError(nextEmailError);
    setError(null);

    if (nextEmailError) {
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      // The backend always returns success here (by design — it never
      // reveals whether the email has an account), so we just show the
      // confirmation screen on any 2xx response.
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.detail || 'Something went wrong. Please try again.');
      }

      setSent(true);
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className={`${dmSans.className} relative flex min-h-screen w-full flex-col overflow-hidden bg-[#f0eeff]`}
    >
      {/* ───────────── Decorative background ───────────── */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        {/* Soft colour orbs */}
        <div className="absolute -left-[220px] -top-[220px] size-[940px] rounded-full bg-[radial-gradient(circle,rgba(167,139,250,0.38)_0%,rgba(167,139,250,0.16)_38%,rgba(167,139,250,0)_70%)]" />
        <div className="absolute -right-[220px] top-[60px] size-[800px] rounded-full bg-[radial-gradient(circle,rgba(34,211,238,0.30)_0%,rgba(34,211,238,0.12)_40%,rgba(34,211,238,0)_70%)]" />
        <div className="absolute left-[calc(50%-250px)] top-[270px] size-[620px] rounded-full bg-[radial-gradient(circle,rgba(251,113,133,0.18)_0%,rgba(251,113,133,0.06)_40%,rgba(251,113,133,0)_70%)]" />
        <div className="absolute -bottom-[200px] left-0 size-[500px] rounded-full bg-[radial-gradient(circle,rgba(251,191,36,0.22)_0%,rgba(251,191,36,0.08)_40%,rgba(251,191,36,0)_70%)]" />

        {/* Dot grid (6% opacity) */}
        <div className="absolute inset-0 bg-[radial-gradient(circle,#7c3aed_1px,transparent_1px)] bg-[length:24px_24px] opacity-[0.06]" />

        {/* Top accent line */}
        <div className="absolute left-0 top-0 h-[3px] w-full bg-[linear-gradient(90deg,#7c3aed_0%,#06b6d4_50%,rgba(139,92,246,0)_100%)]" />

        {/* Decorative rings — top right */}
        <div className="absolute -right-[120px] -top-[120px] size-[340px] rounded-full border border-[#8b5cf6]/20" />
        <div className="absolute -right-[80px] -top-[80px] size-[260px] rounded-full border border-[#8b5cf6]/20" />

        {/* Decorative ring — bottom left */}
        <div className="absolute -bottom-[60px] left-[60px] size-[180px] rounded-full border border-emerald-400/20" />
      </div>

      {/* Back to home pill */}
      <Link
        href="/"
        className="absolute left-4 top-6 z-20 flex items-center gap-2 rounded-full border border-white/80 bg-white/50 px-3 py-2 text-[14px] font-medium text-[#374151] backdrop-blur-[8px] transition hover:bg-white/70 sm:left-20 sm:top-10"
      >
        <ArrowLeft className="size-4" />
        Back to Home
      </Link>

      {/* ───────────── Main content ───────────── */}
      <main className="relative z-10 flex flex-1 flex-col items-center px-4 pb-16 pt-24 sm:pt-[138px]">
        <div className="flex w-full max-w-[480px] flex-col items-center gap-5">
          {/* Logo */}
          <Link href="/" className="flex items-center justify-center gap-[10px]">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden>
              <defs>
                <linearGradient id="aura-logo-grad" x1="4" y1="2" x2="28" y2="30" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#8b5cf6" />
                  <stop offset="1" stopColor="#7c3aed" />
                </linearGradient>
              </defs>
              <circle cx="16" cy="16" r="16" fill="url(#aura-logo-grad)" />
              <circle cx="16" cy="16" r="7" fill="#c4b5fd" fillOpacity="0.85" />
            </svg>
            <span className="text-[24px] font-bold text-[#111827]">Aura</span>
          </Link>

          {/* Form card */}
          <div className="flex w-full flex-col gap-6 rounded-[24px] border-[1.5px] border-white bg-white/[0.72] px-6 py-9 shadow-[0_4px_16px_rgba(124,58,237,0.05),0_20px_60px_rgba(17,24,39,0.09)] backdrop-blur-[12px] sm:px-10">
            {sent ? (
              /* ───── Confirmation state ───── */
              <div className="flex flex-col items-center gap-6 text-center">
                <div className="flex size-14 items-center justify-center rounded-full bg-emerald-50">
                  <CheckCircle2 className="size-8 text-emerald-500" />
                </div>

                <div className="flex flex-col items-center gap-[6px]">
                  <h1 className="text-[28px] font-extrabold leading-tight text-[#111827]">
                    Check your email
                  </h1>
                  <p className="text-[14px] leading-[1.45] text-[#4b5563]">
                    If an account exists for{' '}
                    <span className="break-all font-semibold text-[#111827]">{email}</span>
                    , we&apos;ve sent a link to reset your password.
                  </p>
                </div>

                <Link
                  href="/signin"
                  className="flex w-full items-center justify-center rounded-full bg-[linear-gradient(90deg,#7c3aed_0%,#a78bfa_60%,#06b6d4_100%)] px-8 py-[14px] text-[15px] font-bold text-white shadow-[0_8px_24px_rgba(124,58,237,0.25)] transition hover:brightness-105 active:brightness-95"
                >
                  Back to Sign In
                </Link>
              </div>
            ) : (
              <>
                {/* Header */}
                <div className="flex flex-col items-center gap-[6px] text-center">
                  <h1 className="text-[28px] font-extrabold leading-tight text-[#111827]">
                    Forgot Password
                  </h1>
                  <p className="text-[14px] leading-[1.45] text-[#4b5563]">
                    Enter your email and we&apos;ll send you a link to reset your password
                  </p>
                </div>

                <form
                  noValidate
                  className="flex flex-col gap-6"
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSubmit();
                  }}
                >
                  {/* Email */}
                  <div className="flex flex-col gap-[6px]">
                    <label htmlFor="forgot-email" className="text-[13px] font-semibold text-[#4b5563]">
                      Email
                    </label>
                    <div
                      className={[
                        'flex w-full items-center rounded-[10px] border bg-white px-[14px] py-[12px]',
                        'shadow-[0_1px_3px_rgba(17,24,39,0.04)] transition',
                        emailError
                          ? 'border-[#ef4444] focus-within:ring-2 focus-within:ring-[#ef4444]/15'
                          : 'border-[#e5e7eb] focus-within:border-[#7c3aed] focus-within:ring-2 focus-within:ring-[#7c3aed]/15',
                      ].join(' ')}
                    >
                      <input
                        id="forgot-email"
                        type="email"
                        autoComplete="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          if (emailError) setEmailError(null);
                          if (error) setError(null);
                        }}
                        aria-invalid={!!emailError}
                        aria-describedby={emailError ? 'forgot-email-error' : undefined}
                        className="min-w-0 flex-1 bg-transparent text-[14px] text-[#111827] outline-none placeholder:text-[#9ca3af]"
                      />
                    </div>
                    {emailError && (
                      <p id="forgot-email-error" className="text-[12px] font-medium text-[#ef4444]">
                        {emailError}
                      </p>
                    )}
                    {/* API error */}
                    {error && (
                      <p role="alert" className="text-[12px] font-medium text-[#ef4444]">
                        {error}
                      </p>
                    )}
                  </div>

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex w-full items-center justify-center gap-2 rounded-full bg-[linear-gradient(90deg,#7c3aed_0%,#a78bfa_60%,#06b6d4_100%)] px-8 py-[14px] text-[15px] font-bold text-white shadow-[0_8px_24px_rgba(124,58,237,0.25)] transition hover:brightness-105 active:brightness-95 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="size-[18px] animate-spin" />
                        Sending...
                      </>
                    ) : (
                      'Send Reset Link'
                    )}
                  </button>
                </form>

                {/* Back to login */}
                <div className="flex justify-center">
                  <Link
                    href="/signin"
                    className="flex items-center gap-1 text-[12px] font-medium text-[#4b5563] transition hover:text-[#7c3aed]"
                  >
                    <ArrowLeft className="size-3" />
                    Back to Login
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      </main>

      {/* ───────────── Footer ───────────── */}
      <footer className="relative z-10 w-full">
        <div className="h-px w-full bg-[linear-gradient(90deg,rgba(139,92,246,0)_0%,rgba(139,92,246,0.19)_30%,rgba(6,182,212,0.19)_70%,rgba(6,182,212,0)_100%)]" />
        <div className="flex flex-col items-center gap-3 bg-white/[0.38] px-6 pb-8 pt-6 text-[13px] sm:flex-row sm:justify-between sm:px-20">
          <p className="text-[#9ca3af]">© 2026 Aura. All rights reserved.</p>
          <div className="flex items-center gap-8 font-medium text-[#4b5563]">
            <Link href="/privacy" className="transition hover:text-[#7c3aed]">
              Privacy Policy
            </Link>
            <Link href="/terms-of-service" className="transition hover:text-[#7c3aed]">
              Terms of Service
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}