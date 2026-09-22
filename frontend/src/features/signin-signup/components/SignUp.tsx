// src/features/signin-signup/components/SignUp.tsx
//
// Sign-up flow: email/password/full name -> POST /api/auth/signup ->
// if Supabase requires email confirmation, show the OTP step -> POST
// /api/auth/verify-signup-otp -> save session -> redirect.
//
// If email confirmation is OFF in Supabase (Auth > Providers > Email),
// /api/auth/signup returns a session immediately and the OTP step is
// skipped entirely.

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { saveSession } from '@/lib/auth';
import AuthShell, { GRADIENT_BG } from './AuthShell';
import OtpVerification from './OtpVerification';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Step = 'form' | 'otp';

const inputWrapperClass = (hasError: boolean) =>
  [
    'flex w-full items-center gap-2 rounded-[10px] border bg-white px-[14px] py-[12px] transition',
    hasError
      ? 'border-[#ef4444] focus-within:ring-2 focus-within:ring-[#ef4444]/15'
      : 'border-[#e5e7eb] focus-within:border-[#7c3aed] focus-within:ring-2 focus-within:ring-[#7c3aed]/15',
  ].join(' ');

async function resendSignupOtp(email: string) {
  const res = await fetch('/api/auth/resend-signup-otp', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.detail || 'Could not resend the code. Please try again.');
  }
}

export default function SignUp() {
  const [step, setStep] = useState<Step>('form');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [fullNameError, setFullNameError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [confirmError, setConfirmError] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleSubmit = async () => {
    const nextFullNameError = !fullName.trim() ? 'Full name is required' : null;
    const nextEmailError = !email
      ? 'Email is required'
      : !EMAIL_RE.test(email)
        ? 'Invalid email address'
        : null;
    const nextPasswordError = !password
      ? 'Password is required'
      : password.length < 8
        ? 'Password must be at least 8 characters'
        : null;
    const nextConfirmError = !confirm
      ? 'Please confirm your password'
      : confirm !== password
        ? 'Passwords do not match'
        : null;

    setFullNameError(nextFullNameError);
    setEmailError(nextEmailError);
    setPasswordError(nextPasswordError);
    setConfirmError(nextConfirmError);
    setError(null);

    if (nextFullNameError || nextEmailError || nextPasswordError || nextConfirmError) {
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, full_name: fullName.trim() }),
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data.detail || 'Could not create your account. Please try again.');
      }

      if (data.email_confirmation_required) {
        // No session yet — Supabase needs the OTP verified first.
        setStep('otp');
        setIsSubmitting(false);
        return;
      }

      // Email confirmation is disabled on this Supabase project, so a
      // session came back immediately.
      saveSession(data.access_token, data.refresh_token, data.user);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
      setIsSubmitting(false);
    }
  };

  const handleVerifyOtp = async (code: string) => {
    const res = await fetch('/api/auth/verify-signup-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, token: code }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(data.detail || 'Invalid or expired code. Please try again.');
    }

    saveSession(data.access_token, data.refresh_token, data.user);
    router.push('/dashboard');
  };

  return (
    <AuthShell>
      {step === 'form' && (
        <>
          <div className="flex flex-col items-center gap-[6px] text-center">
            <h1 className="text-[28px] font-extrabold leading-tight text-[#111827]">Create Account</h1>
            <p className="text-[14px] text-[#4b5563]">Sign up for your AURA account</p>
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
              {/* Full name */}
              <div className="flex flex-col gap-[6px]">
                <label htmlFor="signup-name" className="text-[13px] font-semibold text-[#4b5563]">
                  Full Name
                </label>
                <div className={inputWrapperClass(!!fullNameError)}>
                  <input
                    id="signup-name"
                    type="text"
                    autoComplete="name"
                    placeholder="Enter your full name"
                    value={fullName}
                    onChange={(e) => {
                      setFullName(e.target.value);
                      if (fullNameError) setFullNameError(null);
                      if (error) setError(null);
                    }}
                    aria-invalid={!!fullNameError}
                    className="min-w-0 flex-1 bg-transparent text-[14px] text-[#111827] outline-none placeholder:text-[#9ca3af]"
                  />
                </div>
                {fullNameError && <p className="text-[12px] font-medium text-[#ef4444]">{fullNameError}</p>}
              </div>

              {/* Email */}
              <div className="flex flex-col gap-[6px]">
                <label htmlFor="signup-email" className="text-[13px] font-semibold text-[#4b5563]">
                  Email
                </label>
                <div className={inputWrapperClass(!!emailError)}>
                  <input
                    id="signup-email"
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
                    className="min-w-0 flex-1 bg-transparent text-[14px] text-[#111827] outline-none placeholder:text-[#9ca3af]"
                  />
                </div>
                {emailError && <p className="text-[12px] font-medium text-[#ef4444]">{emailError}</p>}
              </div>

              {/* Password */}
              <div className="flex flex-col gap-[6px]">
                <label htmlFor="signup-password" className="text-[13px] font-semibold text-[#4b5563]">
                  Password
                </label>
                <div className={inputWrapperClass(!!passwordError)}>
                  <input
                    id="signup-password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setPasswordError(null);
                      setConfirmError(null);
                      if (error) setError(null);
                    }}
                    aria-invalid={!!passwordError}
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
                {passwordError && <p className="text-[12px] font-medium text-[#ef4444]">{passwordError}</p>}
              </div>

              {/* Confirm password */}
              <div className="flex flex-col gap-[6px]">
                <label htmlFor="signup-confirm" className="text-[13px] font-semibold text-[#4b5563]">
                  Confirm Password
                </label>
                <div className={inputWrapperClass(!!confirmError)}>
                  <input
                    id="signup-confirm"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    placeholder="••••••••"
                    value={confirm}
                    onChange={(e) => {
                      setConfirm(e.target.value);
                      setConfirmError(null);
                      if (error) setError(null);
                    }}
                    aria-invalid={!!confirmError}
                    className="min-w-0 flex-1 bg-transparent text-[14px] text-[#111827] outline-none placeholder:text-[#9ca3af]"
                  />
                </div>
                {confirmError && <p className="text-[12px] font-medium text-[#ef4444]">{confirmError}</p>}
              </div>

              {error && (
                <p role="alert" className="text-[12px] font-medium text-[#ef4444]">
                  {error}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className={`flex w-full items-center justify-center gap-2 rounded-full ${GRADIENT_BG} px-8 py-[14px] text-[15px] font-bold text-white shadow-[0_2px_3px_rgba(124,58,237,0.1),0_8px_12px_rgba(124,58,237,0.25)] transition hover:brightness-105 active:brightness-95 disabled:cursor-not-allowed disabled:opacity-60`}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="size-[18px] animate-spin" />
                  Creating account...
                </>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          <p className="text-center text-[14px] text-[#4b5563]">
            Already have an account?{' '}
            <Link href="/signin" className="font-semibold text-[#7c3aed] hover:text-[#6d28d9] hover:underline">
              Sign In
            </Link>
          </p>
        </>
      )}

      {step === 'otp' && (
        <OtpVerification
          title="Verify Your Email"
          email={email}
          submitLabel="Verify & Create Account"
          onVerify={handleVerifyOtp}
          onResend={() => resendSignupOtp(email)}
          backLabel="Use a different email"
          onBack={() => setStep('form')}
        />
      )}
    </AuthShell>
  );
}