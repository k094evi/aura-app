// src/features/signin-signup/components/ResetPassword.tsx

'use client';

import { useState } from 'react';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { GRADIENT_BG } from './AuthShell';

interface ResetPasswordProps {
  accessToken: string;
  refreshToken: string;
  onSuccess: () => void;
}

const inputWrapper = (hasError: boolean) =>
  [
    'flex w-full items-center gap-2 rounded-[10px] border bg-white px-[14px] py-[12px] transition',
    hasError
      ? 'border-[#ef4444] focus-within:ring-2 focus-within:ring-[#ef4444]/15'
      : 'border-[#e5e7eb] focus-within:border-[#7c3aed] focus-within:ring-2 focus-within:ring-[#7c3aed]/15',
  ].join(' ');

export default function ResetPassword({ accessToken, refreshToken, onSuccess }: ResetPasswordProps) {
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [show, setShow] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [confirmError, setConfirmError] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    const pErr = !password
      ? 'Password is required'
      : password.length < 8
        ? 'Password must be at least 8 characters'
        : null;
    const cErr = !confirm ? 'Please confirm your password' : confirm !== password ? 'Passwords do not match' : null;
    setPasswordError(pErr);
    setConfirmError(cErr);
    setError(null);
    if (pErr || cErr) return;

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          access_token: accessToken,
          refresh_token: refreshToken,
          new_password: password,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.detail || 'Could not update your password. Please try again.');
      onSuccess();
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col items-center gap-[6px] text-center">
        <h1 className="text-[28px] font-extrabold leading-tight text-[#111827]">Create New Password</h1>
        <p className="text-[14px] text-[#4b5563]">Choose a new password for your account</p>
      </div>

      <form
        noValidate
        className="flex flex-col gap-5"
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        <div className="flex flex-col gap-[6px]">
          <label htmlFor="new-password" className="text-[13px] font-semibold text-[#4b5563]">
            New Password
          </label>
          <div className={inputWrapper(!!passwordError)}>
            <input
              id="new-password"
              type={show ? 'text' : 'password'}
              autoComplete="new-password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setPasswordError(null);
                setConfirmError(null);
                setError(null);
              }}
              className="min-w-0 flex-1 bg-transparent text-[14px] text-[#111827] outline-none placeholder:text-[#9ca3af]"
            />
            <button
              type="button"
              onClick={() => setShow(!show)}
              aria-label="Toggle password visibility"
              className="flex-shrink-0 text-[#9ca3af] transition hover:text-[#4b5563]"
            >
              {show ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {passwordError && <p className="text-[12px] text-[#ef4444]">{passwordError}</p>}
        </div>

        <div className="flex flex-col gap-[6px]">
          <label htmlFor="confirm-new-password" className="text-[13px] font-semibold text-[#4b5563]">
            Confirm Password
          </label>
          <div className={inputWrapper(!!confirmError)}>
            <input
              id="confirm-new-password"
              type={show ? 'text' : 'password'}
              autoComplete="new-password"
              placeholder="••••••••"
              value={confirm}
              onChange={(e) => {
                setConfirm(e.target.value);
                setConfirmError(null);
                setError(null);
              }}
              className="min-w-0 flex-1 bg-transparent text-[14px] text-[#111827] outline-none placeholder:text-[#9ca3af]"
            />
          </div>
          {confirmError && <p className="text-[12px] text-[#ef4444]">{confirmError}</p>}
        </div>

        {error && (
          <p role="alert" className="text-[12px] font-medium text-[#ef4444]">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className={`flex w-full items-center justify-center gap-2 rounded-full ${GRADIENT_BG} px-8 py-[14px] text-[15px] font-bold text-white shadow-[0_2px_3px_rgba(124,58,237,0.1),0_8px_12px_rgba(124,58,237,0.25)] transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-60`}
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
    </div>
  );
}