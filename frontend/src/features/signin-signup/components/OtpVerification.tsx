'use client';

import { useEffect, useRef, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { GRADIENT_BG } from './AuthShell';

const OTP_LENGTH = 6;
const RESEND_SECONDS = 30;

interface OtpVerificationProps {
  title: string;
  email: string;
  submitLabel: string;
  /** Throw an Error with a message to show it inline. */
  onVerify: (code: string) => Promise<void>;
  onResend: () => Promise<void>;
  backLabel: string;
  onBack: () => void;
}

export default function OtpVerification({
  title,
  email,
  submitLabel,
  onVerify,
  onResend,
  backLabel,
  onBack,
}: OtpVerificationProps) {
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
    const t = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [secondsLeft]);

  const handleChange = (index: number, value: string) => {
    const char = value.replace(/\D/g, '').slice(-1);
    setError(null);
    setDigits((prev) => {
      const next = [...prev];
      next[index] = char;
      return next;
    });
    if (char && index < OTP_LENGTH - 1) inputRefs.current[index + 1]?.focus();
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) inputRefs.current[index - 1]?.focus();
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, OTP_LENGTH);
    if (!pasted) return;
    e.preventDefault();
    const next = Array(OTP_LENGTH).fill('');
    pasted.split('').forEach((c, i) => (next[i] = c));
    setDigits(next);
    inputRefs.current[Math.min(pasted.length, OTP_LENGTH - 1)]?.focus();
  };

  const handleVerify = async () => {
    if (!isComplete || isVerifying) return;
    setIsVerifying(true);
    setError(null);
    try {
      await onVerify(code);
      // On success the parent navigates / swaps steps, so the spinner stays until then.
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid code. Please try again.');
      setDigits(Array(OTP_LENGTH).fill(''));
      inputRefs.current[0]?.focus();
      setIsVerifying(false);
    }
  };

  const handleResend = async () => {
    if (secondsLeft > 0 || isResending) return;
    setIsResending(true);
    setError(null);
    try {
      await onResend();
      setSecondsLeft(RESEND_SECONDS);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not resend the code.');
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-[28px] font-extrabold leading-tight text-[#111827]">{title}</h1>
        <p className="text-[14px] leading-[1.45] text-[#4b5563]">
          We sent a 6-digit code to <span className="break-all font-semibold text-[#111827]">{email}</span>
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
            autoComplete={index === 0 ? 'one-time-code' : 'off'}
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            aria-label={`Digit ${index + 1}`}
            aria-invalid={!!error}
            className={`h-12 min-w-0 flex-1 rounded-[10px] border bg-white text-center text-[18px] font-semibold text-[#111827] outline-none transition ${
              error
                ? 'border-[#ef4444]'
                : digit
                  ? 'border-[#7c3aed] shadow-[0_2px_4px_rgba(124,58,237,0.25)]'
                  : 'border-[#e5e7eb] focus:border-[#7c3aed]'
            }`}
          />
        ))}
      </div>

      {error && (
        <p role="alert" className="text-center text-[13px] font-medium text-[#ef4444]">
          {error}
        </p>
      )}

      <div className="flex flex-col items-center gap-1.5 text-[13px] text-[#4b5563]">
        <p>
          Didn&apos;t receive the code?{' '}
          <button
            type="button"
            onClick={handleResend}
            disabled={secondsLeft > 0 || isResending}
            className={`font-semibold ${
              secondsLeft > 0 || isResending ? 'cursor-not-allowed text-[#9ca3af]' : 'text-[#7c3aed] hover:underline'
            }`}
          >
            {isResending ? 'Sending…' : 'Resend'}
          </button>
        </p>
        {secondsLeft > 0 && (
          <span className="text-[12px] font-semibold text-emerald-500">
            Resend available in 0:{secondsLeft.toString().padStart(2, '0')}
          </span>
        )}
      </div>

      <button
        type="button"
        onClick={handleVerify}
        disabled={!isComplete || isVerifying}
        className={`flex w-full items-center justify-center gap-2 rounded-full ${GRADIENT_BG} px-8 py-[14px] text-[15px] font-bold text-white shadow-[0_2px_3px_rgba(124,58,237,0.1),0_8px_12px_rgba(124,58,237,0.25)] transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-60`}
      >
        {isVerifying && <Loader2 className="size-[18px] animate-spin" />}
        {isVerifying ? 'Verifying…' : submitLabel}
      </button>

      <button
        type="button"
        onClick={onBack}
        className="text-center text-[13px] font-semibold text-[#7c3aed] hover:underline"
      >
        {backLabel}
      </button>
    </div>
  );
}