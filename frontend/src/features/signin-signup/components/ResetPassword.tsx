// src/features/signin-signup/components/ResetPassword.tsx

'use client';

import { useEffect, useState, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { DM_Sans } from 'next/font/google';
import { AlertCircle, ArrowLeft, CheckCircle2, Eye, EyeOff, Loader2 } from 'lucide-react';
import Link from 'next/link';

// Figma uses DM Sans throughout.
const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
});

const GRADIENT_BUTTON =
  'bg-[linear-gradient(90deg,#7c3aed_0%,#a78bfa_60%,#06b6d4_100%)] shadow-[0_8px_24px_rgba(124,58,237,0.25)] transition hover:brightness-105 active:brightness-95';

// Input wrapper styling (default / focus / error states, same as the other auth pages)
const inputWrapperClass = (hasError: boolean) =>
  [
    'flex w-full items-center gap-2 rounded-[10px] border bg-white px-[14px] py-[12px]',
    'shadow-[0_1px_1.5px_rgba(17,24,39,0.04)] transition',
    hasError
      ? 'border-[#ef4444] focus-within:ring-2 focus-within:ring-[#ef4444]/15'
      : 'border-[#e5e7eb] focus-within:border-[#7c3aed] focus-within:ring-2 focus-within:ring-[#7c3aed]/15',
  ].join(' ');

// Shared page chrome: background art, back pill, logo, card and footer.
function AuthShell({ children }: { children: ReactNode }) {
  return (
    <div
      className={`${dmSans.className} relative flex min-h-screen w-full flex-col overflow-hidden bg-[#f0eeff]`}
    >
      {/* ───────────── Decorative background ───────────── */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-[220px] -top-[220px] size-[940px] rounded-full bg-[radial-gradient(circle,rgba(167,139,250,0.38)_0%,rgba(167,139,250,0.16)_38%,rgba(167,139,250,0)_70%)]" />
        <div className="absolute -right-[220px] top-[60px] size-[800px] rounded-full bg-[radial-gradient(circle,rgba(34,211,238,0.30)_0%,rgba(34,211,238,0.12)_40%,rgba(34,211,238,0)_70%)]" />
        <div className="absolute left-[calc(50%-250px)] top-[270px] size-[620px] rounded-full bg-[radial-gradient(circle,rgba(251,113,133,0.18)_0%,rgba(251,113,133,0.06)_40%,rgba(251,113,133,0)_70%)]" />
        <div className="absolute -bottom-[200px] left-0 size-[500px] rounded-full bg-[radial-gradient(circle,rgba(251,191,36,0.22)_0%,rgba(251,191,36,0.08)_40%,rgba(251,191,36,0)_70%)]" />

        <div className="absolute inset-0 bg-[radial-gradient(circle,#7c3aed_1px,transparent_1px)] bg-[length:24px_24px] opacity-[0.06]" />
        <div className="absolute left-0 top-0 h-[3px] w-full bg-[linear-gradient(90deg,#7c3aed_0%,#06b6d4_50%,rgba(139,92,246,0)_100%)]" />

        <div className="absolute -right-[120px] -top-[120px] size-[340px] rounded-full border border-[#8b5cf6]/20" />
        <div className="absolute -right-[80px] -top-[80px] size-[260px] rounded-full border border-[#8b5cf6]/20" />
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
      <main className="relative z-10 flex flex-1 flex-col items-center justify-center px-4 pb-16 pt-24 sm:pt-16">
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

          {/* Card */}
          <div className="flex w-full flex-col gap-6 rounded-[24px] border-[1.5px] border-white bg-white/[0.72] px-6 py-9 shadow-[0_4px_16px_rgba(124,58,237,0.05),0_20px_60px_rgba(17,24,39,0.09)] backdrop-blur-[12px] sm:px-10">
            {children}
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

export default function ResetPassword() {
  const [tokens, setTokens] = useState<{ access_token: string; refresh_token: string } | null>(
    null
  );
  const [tokensChecked, setTokensChecked] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [confirmError, setConfirmError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  // Supabase appends the recovery session to the URL fragment
  // (#access_token=...&refresh_token=...&type=recovery) rather than a
  // query string, so it must be parsed client-side — it never reaches
  // the server.
  useEffect(() => {
    const hash = window.location.hash.startsWith('#')
      ? window.location.hash.slice(1)
      : window.location.hash;
    const params = new URLSearchParams(hash);
    const access_token = params.get('access_token');
    const refresh_token = params.get('refresh_token');

    if (access_token && refresh_token) {
      setTokens({ access_token, refresh_token });
    }
    setTokensChecked(true);
  }, []);

  const handleSubmit = async () => {
    if (!tokens) return;

    // Field-level checks (same rules and messages as before)
    const nextPasswordError = password.length < 8 ? 'Password must be at least 8 characters.' : null;
    const nextConfirmError =
      !nextPasswordError && password !== confirmPassword ? 'Passwords do not match.' : null;

    setPasswordError(nextPasswordError);
    setConfirmError(nextConfirmError);
    setError(null);

    if (nextPasswordError || nextConfirmError) {
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          access_token: tokens.access_token,
          refresh_token: tokens.refresh_token,
          new_password: password,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data.detail || 'Could not reset password. Please try again.');
      }

      setSuccess(true);
      setTimeout(() => router.push('/signin'), 2000);
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // ───────────── Loading (checking the URL for tokens) ─────────────
  if (!tokensChecked) {
    return (
      <AuthShell>
        <p className="py-8 text-center text-[14px] text-[#9ca3af]">Loading…</p>
      </AuthShell>
    );
  }

  // ───────────── Missing / invalid link ─────────────
  if (!tokens) {
    return (
      <AuthShell>
        <div className="flex flex-col items-center gap-6 text-center">
          <div className="flex size-14 items-center justify-center rounded-full bg-red-50">
            <AlertCircle className="size-8 text-[#ef4444]" />
          </div>

          <div className="flex flex-col items-center gap-[6px]">
            <h1 className="text-[28px] font-extrabold leading-tight text-[#111827]">
              Invalid or expired link
            </h1>
            <p className="text-[14px] leading-[1.45] text-[#4b5563]">
              This password reset link is missing or no longer valid. Request a new one.
            </p>
          </div>

          <Link
            href="/forgot-password"
            className={`flex w-full items-center justify-center rounded-full px-8 py-[14px] text-[15px] font-bold text-white ${GRADIENT_BUTTON}`}
          >
            Request New Link
          </Link>
        </div>
      </AuthShell>
    );
  }

  // ───────────── Success ─────────────
  if (success) {
    return (
      <AuthShell>
        <div className="flex flex-col items-center gap-6 text-center">
          <div className="flex size-14 items-center justify-center rounded-full bg-emerald-50">
            <CheckCircle2 className="size-8 text-emerald-500" />
          </div>

          <div className="flex flex-col items-center gap-[6px]">
            <h1 className="text-[28px] font-extrabold leading-tight text-[#111827]">Password updated</h1>
            <p className="text-[14px] leading-[1.45] text-[#4b5563]">Redirecting you to sign in…</p>
          </div>

          <Link
            href="/signin"
            className={`flex w-full items-center justify-center rounded-full px-8 py-[14px] text-[15px] font-bold text-white ${GRADIENT_BUTTON}`}
          >
            Go to Sign In
          </Link>
        </div>
      </AuthShell>
    );
  }

  // ───────────── Set-new-password form ─────────────
  return (
    <AuthShell>
      {/* Header */}
      <div className="flex flex-col items-center gap-[6px] text-center">
        <h1 className="text-[28px] font-extrabold leading-tight text-[#111827]">Set a new password</h1>
        <p className="text-[14px] leading-[1.45] text-[#4b5563]">
          Choose a new password for your account.
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
        <div className="flex flex-col gap-4">
          {/* New password (show/hide toggle controls both fields) */}
          <div className="flex flex-col gap-[6px]">
            <label htmlFor="reset-password" className="text-[13px] font-semibold text-[#4b5563]">
              New Password
            </label>
            <div className={inputWrapperClass(!!passwordError)}>
              <input
                id="reset-password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (passwordError) setPasswordError(null);
                  if (confirmError) setConfirmError(null);
                  if (error) setError(null);
                }}
                aria-invalid={!!passwordError}
                aria-describedby={passwordError ? 'reset-password-error' : undefined}
                className="min-w-0 flex-1 bg-transparent text-[14px] text-[#111827] outline-none placeholder:text-[#9ca3af]"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="flex-shrink-0 text-[#9ca3af] transition hover:text-[#4b5563]"
                aria-label="Toggle password visibility"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {passwordError && (
              <p id="reset-password-error" className="text-[12px] font-medium text-[#ef4444]">
                {passwordError}
              </p>
            )}
          </div>

          {/* Confirm password */}
          <div className="flex flex-col gap-[6px]">
            <label htmlFor="reset-confirm-password" className="text-[13px] font-semibold text-[#4b5563]">
              Confirm Password
            </label>
            <div className={inputWrapperClass(!!confirmError)}>
              <input
                id="reset-confirm-password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  if (confirmError) setConfirmError(null);
                  if (error) setError(null);
                }}
                aria-invalid={!!confirmError}
                aria-describedby={confirmError ? 'reset-confirm-error' : undefined}
                className="min-w-0 flex-1 bg-transparent text-[14px] text-[#111827] outline-none placeholder:text-[#9ca3af]"
              />
            </div>
            {confirmError && (
              <p id="reset-confirm-error" className="text-[12px] font-medium text-[#ef4444]">
                {confirmError}
              </p>
            )}
          </div>

          {/* API error */}
          {error && (
            <p role="alert" className="text-[12px] font-medium text-[#ef4444]">
              {error}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="flex w-full items-center justify-center gap-2 rounded-full bg-[linear-gradient(90deg,#7c3aed_0%,#a78bfa_60%,#06b6d4_100%)] px-8 py-[14px] text-[15px] font-bold text-white shadow-[0_2px_3px_rgba(124,58,237,0.1),0_8px_12px_rgba(124,58,237,0.25)] transition hover:brightness-105 active:brightness-95 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="size-[18px] animate-spin" />
              Updating...
            </>
          ) : (
            'Update Password'
          )}
        </button>
      </form>
    </AuthShell>
  );
}