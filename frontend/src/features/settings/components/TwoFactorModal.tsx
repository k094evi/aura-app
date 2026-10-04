'use client';

import { useEffect, useRef, useState, type ClipboardEvent, type KeyboardEvent } from 'react';
import { AlertCircle, Loader2 } from 'lucide-react';
import { authSessionHeaders, getStoredUser, saveSession } from '@/lib/auth';
import { Modal, GradientButton, SecondaryButton, FOCUS_RING } from '@/features/settings/components/SettingsUI';

const CODE_LENGTH = 6;

function CodeInput({ digits, onChange }: { digits: string[]; onChange: (next: string[]) => void }) {
  const refs = useRef<(HTMLInputElement | null)[]>([]);
  const focusBox = (index: number) =>
    refs.current[Math.max(0, Math.min(CODE_LENGTH - 1, index))]?.focus();

  const handleChange = (index: number, raw: string) => {
    const digit = raw.replace(/\D/g, '').slice(-1);
    const next = [...digits];
    next[index] = digit;
    onChange(next);
    if (digit && index < CODE_LENGTH - 1) focusBox(index + 1);
  };

  const handleKeyDown = (index: number, event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Backspace' && !digits[index] && index > 0) {
      event.preventDefault();
      const next = [...digits];
      next[index - 1] = '';
      onChange(next);
      focusBox(index - 1);
    } else if (event.key === 'ArrowLeft') {
      focusBox(index - 1);
    } else if (event.key === 'ArrowRight') {
      focusBox(index + 1);
    }
  };

  const handlePaste = (event: ClipboardEvent<HTMLInputElement>) => {
    const pasted = event.clipboardData.getData('text').replace(/\D/g, '').slice(0, CODE_LENGTH);
    if (!pasted) return;
    event.preventDefault();
    onChange(Array.from({ length: CODE_LENGTH }, (_, index) => pasted[index] ?? ''));
    focusBox(Math.min(pasted.length, CODE_LENGTH - 1));
  };

  return (
    <div className="flex flex-wrap gap-3">
      {digits.map((digit, index) => (
        <input
          key={index}
          ref={(element) => {
            refs.current[index] = element;
          }}
          data-autofocus={index === 0 ? '' : undefined}
          value={digit}
          onChange={(event) => handleChange(index, event.target.value)}
          onKeyDown={(event) => handleKeyDown(index, event)}
          onPaste={handlePaste}
          inputMode="numeric"
          autoComplete={index === 0 ? 'one-time-code' : 'off'}
          maxLength={1}
          aria-label={`Digit ${index + 1} of ${CODE_LENGTH}`}
          className="h-14 w-[72px] rounded-xl border border-[#e5e7eb] bg-white text-center text-xl font-bold text-[#111827] outline-none transition-colors focus:border-2 focus:border-[#ddd6fe] focus:ring-2 focus:ring-[#8b5cf6]/20"
        />
      ))}
    </div>
  );
}

type TwoFactorModalProps = {
  open: boolean;
  mode: 'enable' | 'disable';
  factorId?: string;
  onClose: () => void;
  onVerified: (enabled: boolean) => void;
};

export default function TwoFactorModal({
  open,
  mode,
  factorId,
  onClose,
  onVerified,
}: TwoFactorModalProps) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      labelledBy="two-factor-title"
      maxWidthClassName="max-w-[640px]"
    >
      <TwoFactorContent
        mode={mode}
        factorId={factorId}
        onClose={onClose}
        onVerified={onVerified}
      />
    </Modal>
  );
}

function TwoFactorContent({
  mode,
  factorId,
  onClose,
  onVerified,
}: {
  mode: 'enable' | 'disable';
  factorId?: string;
  onClose: () => void;
  onVerified: (enabled: boolean) => void;
}) {
  const [digits, setDigits] = useState<string[]>(Array(CODE_LENGTH).fill(''));
  const [error, setError] = useState<string | null>(null);
  const [verifying, setVerifying] = useState(false);
  const [loadingSetup, setLoadingSetup] = useState(mode === 'enable');
  const [setup, setSetup] = useState<{ factor_id: string; qr_code: string; secret: string } | null>(null);

  useEffect(() => {
    if (mode !== 'enable') return;
    let cancelled = false;

    (async () => {
      try {
        const response = await fetch('/api/settings/mfa/enroll', {
          method: 'POST',
          headers: authSessionHeaders(),
        });
        const data = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(data.detail ?? 'Could not start two-factor setup.');
        if (!cancelled) setSetup(data);
      } catch (cause) {
        if (!cancelled) {
          setError(cause instanceof Error ? cause.message : 'Could not start two-factor setup.');
        }
      } finally {
        if (!cancelled) setLoadingSetup(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [mode]);

  const handleVerify = async () => {
    if (digits.some((digit) => !digit)) {
      setError('Enter all 6 digits from your authenticator app.');
      return;
    }
    const activeFactorId = mode === 'enable' ? setup?.factor_id : factorId;
    if (!activeFactorId) {
      setError('The authenticator setup is unavailable. Close this dialog and try again.');
      return;
    }

    setVerifying(true);
    setError(null);
    try {
      const response = await fetch('/api/settings/mfa/verify', {
        method: 'POST',
        headers: authSessionHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify({
          factor_id: activeFactorId,
          code: digits.join(''),
          action: mode,
        }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.detail ?? 'Could not verify that code.');
      if (data.access_token) {
        saveSession(data.access_token, data.refresh_token, getStoredUser());
      }
      onVerified(mode === 'enable');
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Could not verify that code.');
    } finally {
      setVerifying(false);
    }
  };

  const title =
    mode === 'enable' ? 'Set up two-factor authentication' : 'Disable two-factor authentication';

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2 pr-2">
        <h3 id="two-factor-title" className="text-2xl font-extrabold leading-normal text-[#111827]">
          {title}
        </h3>
        <p className="text-sm font-normal leading-normal text-[#667085]">
          {mode === 'enable'
            ? 'Scan this real setup code with an authenticator app, then enter its current code.'
            : 'Enter the current code from your authenticator app to disable two-factor authentication.'}
        </p>
      </div>

      {mode === 'enable' && (
        <div className="flex flex-col gap-3 rounded-xl border border-[#e5e7eb] bg-white p-5 sm:flex-row sm:items-center">
          {loadingSetup ? (
            <Loader2 className="size-8 animate-spin text-[#7c3aed]" />
          ) : setup?.qr_code.startsWith('data:image/') ? (
            <img src={setup.qr_code} alt="Authenticator setup QR code" className="size-36 rounded-lg" />
          ) : (
            <p role="alert" className="text-sm text-[#dc2626]">
              The authenticator setup code could not be displayed.
            </p>
          )}
          <div className="flex min-w-0 flex-col gap-2">
            <p className="text-sm font-bold text-[#111827]">Manual setup key</p>
            <code className="break-all rounded-lg bg-[#f9fafb] p-3 text-sm text-[#374151]">
              {setup?.secret ?? 'Loading…'}
            </code>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-3">
        <p className="text-sm font-bold text-[#111827]">Enter the 6-digit verification code</p>
        <CodeInput digits={digits} onChange={setDigits} />
        {error && (
          <p role="alert" className="text-xs font-semibold text-[#dc2626]">
            {error}
          </p>
        )}
      </div>

      {mode === 'enable' && (
        <div className="flex items-center gap-3 rounded-xl border border-[#fed7aa] bg-[#fff7ed] p-4">
          <AlertCircle className="size-4 shrink-0 text-[#ea580c]" />
          <p className="text-xs text-[#92400e]">
            Keep your authenticator app available. You will need it to sign in when two-factor
            authentication is enabled.
          </p>
        </div>
      )}

      <div className="flex flex-wrap items-center justify-end gap-3">
        <SecondaryButton onClick={onClose}>Cancel</SecondaryButton>
        <GradientButton
          onClick={handleVerify}
          disabled={verifying || loadingSetup || (mode === 'enable' && !setup)}
          className={FOCUS_RING}
        >
          {verifying ? 'Verifying…' : mode === 'enable' ? 'Verify & Enable' : 'Verify & Disable'}
        </GradientButton>
      </div>
    </div>
  );
}
