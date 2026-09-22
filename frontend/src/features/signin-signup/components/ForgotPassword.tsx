// src/features/signin-signup/components/ForgotPassword.tsx

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, CheckCircle2, Loader2 } from 'lucide-react';
import AuthShell, { GRADIENT_BG } from './AuthShell';
import OtpVerification from './OtpVerification';
import ResetPassword from './ResetPassword';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Step = 'email' | 'otp' | 'reset' | 'done';

async function requestResetCode(email: string) {
  const res = await fetch('/api/auth/forgot-password', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.detail || 'Something went wrong. Please try again.');
  }
}

export default function ForgotPassword() {
  const [step, setStep] = useState<Step>('email');
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tokens, setTokens] = useState<{ access: string; refresh: string } | null>(null);

  const handleSendCode = async () => {
    const nextEmailError = !email ? 'Email is required' : !EMAIL_RE.test(email) ? 'Invalid email address' : null;
    setEmailError(nextEmailError);
    setError(null);
    if (nextEmailError) return;

    setIsSubmitting(true);
    try {
      await requestResetCode(email);
      setStep('otp');
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifyOtp = async (code: string) => {
    const res = await fetch('/api/auth/verify-reset-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, token: code }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.detail || 'Invalid or expired code. Please try again.');
    setTokens({ access: data.access_token, refresh: data.refresh_token });
    setStep('reset');
  };

  return (
    <AuthShell>
      {step === 'email' && (
        <>
          <div className="flex flex-col items-center gap-[6px] text-center">
            <h1 className="text-[28px] font-extrabold leading-tight text-[#111827]">Forgot Password</h1>
            <p className="text-[14px] leading-[1.45] text-[#4b5563]">
              Enter your email and we&apos;ll send you a 6-digit code to reset your password
            </p>
          </div>

          <form
            noValidate
            className="flex flex-col gap-6"
            onSubmit={(e) => {
              e.preventDefault();
              handleSendCode();
            }}
          >
            <div className="flex flex-col gap-[6px]">
              <label htmlFor="forgot-email" className="text-[13px] font-semibold text-[#4b5563]">
                Email
              </label>
              <div
                className={[
                  'flex w-full items-center rounded-[10px] border bg-white px-[14px] py-[12px] transition',
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
              {error && (
                <p role="alert" className="text-[12px] font-medium text-[#ef4444]">
                  {error}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className={`flex w-full items-center justify-center gap-2 rounded-full ${GRADIENT_BG} px-8 py-[14px] text-[15px] font-bold text-white shadow-[0_8px_24px_rgba(124,58,237,0.25)] transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-60`}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="size-[18px] animate-spin" />
                  Sending...
                </>
              ) : (
                'Send Code'
              )}
            </button>
          </form>

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

      {step === 'otp' && (
        <OtpVerification
          title="Verify Your Identity"
          email={email}
          submitLabel="Verify Code"
          onVerify={handleVerifyOtp}
          onResend={() => requestResetCode(email)}
          backLabel="Use a different email"
          onBack={() => setStep('email')}
        />
      )}

      {step === 'reset' && tokens && (
        <ResetPassword
          accessToken={tokens.access}
          refreshToken={tokens.refresh}
          onSuccess={() => setStep('done')}
        />
      )}

      {step === 'done' && (
        <div className="flex flex-col items-center gap-6 text-center">
          <div className="flex size-14 items-center justify-center rounded-full bg-emerald-50">
            <CheckCircle2 className="size-8 text-emerald-500" />
          </div>
          <div className="flex flex-col items-center gap-[6px]">
            <h1 className="text-[28px] font-extrabold leading-tight text-[#111827]">Password updated</h1>
            <p className="text-[14px] leading-[1.45] text-[#4b5563]">You can now sign in with your new password.</p>
          </div>
          <Link
            href="/signin"
            className={`flex w-full items-center justify-center rounded-full ${GRADIENT_BG} px-8 py-[14px] text-[15px] font-bold text-white shadow-[0_8px_24px_rgba(124,58,237,0.25)] transition hover:brightness-105`}
          >
            Go to Sign In
          </Link>
        </div>
      )}
    </AuthShell>
  );
}