// src/features/signin-signup/components/VerifyIdentity.tsx
'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';

const OTP_LENGTH = 6;
const RESEND_SECONDS = 30;

interface VerifyIdentityProps {
  /** Email the code was sent to, shown in the helper copy if provided. */
  email?: string;
  /** Called with the joined code once all digits are filled and Verify is pressed. */
  onVerify?: (code: string) => Promise<void> | void;
  /** Called when the user taps "Resend". Defaults to a no-op. */
  onResend?: () => Promise<void> | void;
  /** Where "Back to Sign In" / "Back to Home" should send the user. */
  signInHref?: string;
  homeHref?: string;
}

export default function VerifyIdentity({
  email,
  onVerify,
  onResend,
  signInHref = '/signin',
  homeHref = '/',
}: VerifyIdentityProps) {
  const router = useRouter();
  const [digits, setDigits] = useState<string[]>(Array(OTP_LENGTH).fill(''));
  const [error, setError] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(RESEND_SECONDS);
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  const code = digits.join('');
  const isComplete = code.length === OTP_LENGTH;

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  useEffect(() => {
    if (secondsLeft <= 0) return;
    const timer = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearTimeout(timer);
  }, [secondsLeft]);

  const handleChange = (index: number, value: string) => {
    const char = value.replace(/[^0-9]/g, '').slice(-1);
    setError(null);

    setDigits((prev) => {
      const next = [...prev];
      next[index] = char;
      return next;
    });

    if (char && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const pasted = e.clipboardData.getData('text').replace(/[^0-9]/g, '').slice(0, OTP_LENGTH);
    if (!pasted) return;
    e.preventDefault();
    const next = Array(OTP_LENGTH).fill('');
    pasted.split('').forEach((char, i) => (next[i] = char));
    setDigits(next);
    inputRefs.current[Math.min(pasted.length, OTP_LENGTH - 1)]?.focus();
  };

  const handleVerify = async () => {
    if (!isComplete || isVerifying) return;
    setIsVerifying(true);
    setError(null);
    try {
      if (onVerify) {
        await onVerify(code);
      } else {
        router.push('/dashboard');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid code. Please try again.');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResend = async () => {
    if (secondsLeft > 0 || isResending) return;
    setIsResending(true);
    setError(null);
    try {
      await onResend?.();
    } finally {
      setSecondsLeft(RESEND_SECONDS);
      setIsResending(false);
    }
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-[#f0eeff]">
      {/* top accent line */}
      <div className="absolute left-0 top-0 h-[3px] w-full bg-gradient-to-r from-[#7c3aed] via-[#06b6d4] to-transparent" />

      {/* decorative blurred orbs */}
      <div className="pointer-events-none absolute -left-16 -top-16 size-[620px] rounded-full bg-[#7c3aed]/25 blur-[100px]" />
      <div className="pointer-events-none absolute -right-20 top-[200px] size-[520px] rounded-full bg-[#06b6d4]/20 blur-[100px]" />
      <div className="pointer-events-none absolute left-[600px] top-[400px] size-[360px] rounded-full bg-rose-300/20 blur-[90px]" />
      <div className="pointer-events-none absolute left-[100px] top-[700px] size-[300px] rounded-full bg-amber-200/25 blur-[80px]" />

      {/* decorative rings */}
      <div className="pointer-events-none absolute -right-[120px] -top-[120px] size-[340px] rounded-full border border-white/40" />
      <div className="pointer-events-none absolute -right-20 -top-20 size-[260px] rounded-full border border-white/40" />
      <div className="pointer-events-none absolute bottom-[122px] left-[60px] size-[180px] rounded-full border border-white/40" />

      {/* back to home */}
      <Link
        href={homeHref}
        className="absolute left-8 sm:left-20 top-10 z-10 flex items-center gap-2 rounded-full border border-white/80 bg-white/50 py-2 pl-3 pr-4 text-sm font-medium text-gray-700 backdrop-blur-md transition hover:bg-white/70"
      >
        <ArrowLeft size={16} />
        Back to Home
      </Link>

      {/* content */}
      <div className="z-10 flex flex-col items-center gap-5 px-4">
        <div className="flex items-center justify-center gap-2.5">
          <span className="size-8 rounded-full bg-gradient-to-br from-[#7c3aed] to-[#06b6d4]" />
          <span className="text-2xl font-bold text-gray-900">Aura</span>
        </div>

        <div className="flex w-full max-w-[480px] flex-col items-start gap-7 rounded-3xl border-[1.5px] border-white bg-white/70 px-6 py-9 shadow-[0px_4px_16px_0px_rgba(124,58,237,0.05),0px_20px_60px_0px_rgba(17,24,39,0.09)] backdrop-blur-md sm:px-10">
          <div className="flex w-full flex-col items-center gap-2 text-center">
            <h1 className="text-[28px] font-extrabold text-gray-900">Verify Your Identity</h1>
            <p className="text-sm leading-5 text-gray-600">
              {`We've sent a 6-digit verification code to `}
              {email ? <span className="font-medium text-gray-800">{email}</span> : 'your email address'}
            </p>
          </div>

          <div className="flex w-full justify-center gap-2" onPaste={handlePaste}>
            {digits.map((digit, index) => (
              <input
                key={index}
                ref={(el) => {
                  inputRefs.current[index] = el;
                }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className={`h-12 flex-1 rounded-[10px] border bg-white text-center text-lg font-semibold text-gray-900 outline-none transition ${
                  digit
                    ? 'border-[#7c3aed] shadow-[0px_2px_4px_rgba(124,58,237,0.25)]'
                    : 'border-gray-200 focus:border-[#7c3aed]'
                }`}
              />
            ))}
          </div>

          {error && <p className="w-full text-center text-sm text-rose-500">{error}</p>}

          <div className="flex w-full flex-col items-center gap-1.5">
            <p className="text-[13px] text-gray-600">
              {`Didn't receive the code? `}
              <button
                type="button"
                onClick={handleResend}
                disabled={secondsLeft > 0 || isResending}
                className={`font-medium ${
                  secondsLeft > 0 || isResending
                    ? 'cursor-not-allowed text-gray-400'
                    : 'cursor-pointer text-[#7c3aed] hover:underline'
                }`}
              >
                {isResending ? 'Sending…' : 'Resend'}
              </button>
            </p>
            {secondsLeft > 0 && (
              <div className="flex items-center gap-1.5">
                <span className="size-1.5 rounded-full bg-emerald-500" />
                <span className="text-[13px] font-semibold text-emerald-500">
                  Resend available in 0:{secondsLeft.toString().padStart(2, '0')}
                </span>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={handleVerify}
            disabled={!isComplete || isVerifying}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#7c3aed] via-[#a78bfa] to-[#06b6d4] px-8 py-3.5 text-[15px] font-bold text-white shadow-[0px_2px_3px_rgba(124,58,237,0.1),0px_8px_12px_rgba(124,58,237,0.25)] transition disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isVerifying && <Loader2 size={16} className="animate-spin" />}
            {isVerifying ? 'Verifying…' : 'Verify & Sign In'}
          </button>

          <div className="flex w-full items-start justify-center">
            <Link href={signInHref} className="text-sm">
              <span className="text-gray-600">Want to try again? </span>
              <span className="font-semibold text-[#7c3aed]">Back to Sign In</span>
            </Link>
          </div>
        </div>
      </div>

      {/* footer */}
      <div className="absolute bottom-0 left-0 right-0 z-10 flex h-[122px] flex-col items-center justify-center pt-12">
        <div className="h-px w-full bg-gradient-to-r from-transparent via-[#8b5cf6]/20 to-transparent" />
        <div className="flex w-full items-center justify-between bg-white/40 px-8 py-6 text-[13px] sm:px-20">
          <p className="text-gray-400">© 2026 Aura. All rights reserved.</p>
          <div className="flex gap-8 font-medium text-gray-600">
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
          </div>
        </div>
      </div>
    </div>
  );
}