// src/app/mfa-challenge/page.tsx
// Second step of sign-in for accounts with two-factor authentication on.
// The user arrives here holding a password-level (aal1) session; entering the
// current authenticator code upgrades it to aal2 via /api/auth/mfa/challenge.

'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import AuthShell, { GRADIENT_BG } from '@/features/signin-signup/components/AuthShell';
import {
  authSessionHeaders,
  clearSession,
  getAccessToken,
  getAssuranceLevel,
  getStoredUser,
  saveSession,
} from '@/lib/auth';

const CODE_LENGTH = 6;

export default function MfaChallengePage() {
  const router = useRouter();
  const [digits, setDigits] = useState<string[]>(Array(CODE_LENGTH).fill(''));
  const [error, setError] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  const code = digits.join('');
  const isComplete = code.length === CODE_LENGTH;

  // Guard: no session -> sign in first; already 2FA-verified -> nothing to do here.
  useEffect(() => {
    if (!getAccessToken()) {
      router.replace('/signin');
      return;
    }
    if (getAssuranceLevel() === 'aal2') {
      router.replace('/dashboard');
      return;
    }
  }, [router]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const focusBox = (index: number) =>
    inputRefs.current[Math.max(0, Math.min(CODE_LENGTH - 1, index))]?.focus();

  const handleChange = (index: number, value: string) => {
    const char = value.replace(/\D/g, '').slice(-1);
    setError(null);
    setDigits((prev) => {
      const next = [...prev];
      next[index] = char;
      return next;
    });
    if (char && index < CODE_LENGTH - 1) focusBox(index + 1);
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) focusBox(index - 1);
    else if (e.key === 'ArrowLeft') focusBox(index - 1);
    else if (e.key === 'ArrowRight') focusBox(index + 1);
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, CODE_LENGTH);
    if (!pasted) return;
    e.preventDefault();
    setError(null);
    setDigits(Array.from({ length: CODE_LENGTH }, (_, i) => pasted[i] ?? ''));
    focusBox(Math.min(pasted.length, CODE_LENGTH - 1));
  };

  const handleVerify = async () => {
    if (isVerifying) return;
    if (!isComplete) {
      setError('Enter all 6 digits from your authenticator app.');
      return;
    }
    setIsVerifying(true);
    setError(null);

    try {
      const res = await fetch('/api/auth/mfa/challenge', {
        method: 'POST',
        headers: authSessionHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify({ code }),
      });
      const data = await res.json().catch(() => ({}));

      if (res.status === 401) {
        // The password-step session is gone; start over.
        clearSession();
        router.replace('/signin');
        return;
      }
      if (!res.ok) {
        throw new Error(data.detail || 'That code is invalid or expired. Please try again.');
      }

      const storedUser = getStoredUser();
      const user = data.user ?? storedUser;
      saveSession(
        data.access_token,
        data.refresh_token,
        user ? { ...user, mfa_enabled: true } : null
      );
      // Spinner intentionally stays on until navigation completes.
      router.push('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
      setDigits(Array(CODE_LENGTH).fill(''));
      focusBox(0);
      setIsVerifying(false);
    }
  };

  const handleBackToSignIn = () => {
    // Drop the half-finished (aal1) session so it can't be mistaken for a full login.
    clearSession();
    fetch('/api/auth/signout', { method: 'POST' }).catch(() => {});
    router.push('/signin');
  };

  return (
    <AuthShell>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-[28px] font-extrabold leading-tight text-[#111827]">
          Two-Factor Authentication
        </h1>
        <p className="text-[14px] leading-5 text-[#4b5563]">
          Enter the current six-digit code from your authenticator app to continue.
        </p>
      </div>

      <form
        noValidate
        className="flex flex-col gap-7"
        onSubmit={(e) => {
          e.preventDefault();
          handleVerify();
        }}
      >
        <div className="flex flex-col gap-3">
          <div className="flex w-full justify-center gap-2" onPaste={handlePaste}>
            {digits.map((digit, index) => (
              <input
                key={index}
                ref={(el) => {
                  inputRefs.current[index] = el;
                }}
                type="text"
                inputMode="numeric"
                autoComplete={index === 0 ? 'one-time-code' : 'off'}
                maxLength={1}
                value={digit}
                disabled={isVerifying}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                aria-label={`Digit ${index + 1} of ${CODE_LENGTH}`}
                aria-invalid={!!error}
                className={`h-12 min-w-0 flex-1 rounded-[10px] border bg-white text-center text-[18px] font-semibold text-[#111827] outline-none transition disabled:opacity-60 ${
                  error
                    ? 'border-[#ef4444]'
                    : 'border-[#e5e7eb] focus:border-2 focus:border-[#7c3aed] focus:shadow-[0_2px_8px_rgba(124,58,237,0.13)]'
                }`}
              />
            ))}
          </div>

          {error && (
            <p role="alert" className="text-center text-[13px] font-medium text-[#ef4444]">
              {error}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={!isComplete || isVerifying}
          className={`flex w-full items-center justify-center gap-2 rounded-full ${GRADIENT_BG} px-8 py-[14px] text-[15px] font-bold text-white shadow-[0_2px_6px_rgba(124,58,237,0.1),0_8px_24px_rgba(124,58,237,0.25)] transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-60`}
        >
          {isVerifying && <Loader2 className="size-[18px] animate-spin" />}
          {isVerifying ? 'Verifying…' : 'Verify & Continue'}
        </button>
      </form>

      <button
        type="button"
        onClick={handleBackToSignIn}
        className="text-center text-[14px] font-semibold text-[#7c3aed] hover:underline"
      >
        Back to Sign In
      </button>
    </AuthShell>
  );
}
