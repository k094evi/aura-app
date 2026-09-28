'use client';

import { useRef, useState, type ClipboardEvent, type KeyboardEvent } from 'react';
import { AlertCircle } from 'lucide-react';
import { Modal, GradientButton, SecondaryButton, FOCUS_RING } from '@/features/settings/components/SettingsUI';

// Hardcoded to match the Figma. Replace with a key/QR payload from your
// backend (e.g. POST /api/account/2fa/setup) once it exists.
const MANUAL_KEY = 'AURA-7X2Q-9L4M';
const CODE_LENGTH = 6;

// The Figma shows a stylised QR placeholder, not a scannable code. Each
// entry is [left, top] in px inside the 126px grid.
const FINDER_PATTERNS: [number, number][] = [
  [11, 11],
  [87, 11],
  [11, 87],
];
const QR_DOTS: [number, number][] = [
  [55, 19],
  [73, 19],
  [55, 37],
  [91, 37],
  [73, 55],
  [55, 73],
  [91, 73],
  [109, 55],
  [73, 91],
  [91, 109],
  [109, 91],
];

function QrPlaceholder() {
  return (
    <div
      role="img"
      aria-label="QR code placeholder"
      className="flex size-[152px] shrink-0 flex-col rounded-2xl border border-[#e5e7eb] bg-white p-3"
    >
      <div className="relative w-full flex-1 overflow-hidden rounded-xl border border-[#e5e7eb] bg-[#f9fafb]">
        {FINDER_PATTERNS.map(([left, top]) => (
          <div key={`${left}-${top}`}>
            <div className="absolute size-7 rounded bg-[#111827]" style={{ left, top }} />
            <div className="absolute size-4 rounded-sm bg-white" style={{ left: left + 6, top: top + 6 }} />
            <div className="absolute size-2 rounded-[1px] bg-[#111827]" style={{ left: left + 10, top: top + 10 }} />
          </div>
        ))}
        {QR_DOTS.map(([left, top]) => (
          <div key={`${left}-${top}`} className="absolute size-2.5 rounded-sm bg-[#111827]" style={{ left, top }} />
        ))}
      </div>
    </div>
  );
}

function StepBadge({ n }: { n: number }) {
  return (
    <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-[#7c3aed] to-[#a78bfa] text-[13px] font-extrabold text-white">
      {n}
    </div>
  );
}

// Six single-digit boxes with auto-advance, backspace-to-previous, arrow
// navigation, and paste support.
function CodeInput({ digits, onChange }: { digits: string[]; onChange: (next: string[]) => void }) {
  const refs = useRef<(HTMLInputElement | null)[]>([]);

  const focusBox = (i: number) => refs.current[Math.max(0, Math.min(CODE_LENGTH - 1, i))]?.focus();

  const handleChange = (i: number, raw: string) => {
    const digit = raw.replace(/\D/g, '').slice(-1);
    const next = [...digits];
    next[i] = digit;
    onChange(next);
    if (digit && i < CODE_LENGTH - 1) focusBox(i + 1);
  };

  const handleKeyDown = (i: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !digits[i] && i > 0) {
      e.preventDefault();
      const next = [...digits];
      next[i - 1] = '';
      onChange(next);
      focusBox(i - 1);
    } else if (e.key === 'ArrowLeft') {
      focusBox(i - 1);
    } else if (e.key === 'ArrowRight') {
      focusBox(i + 1);
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, CODE_LENGTH);
    if (!pasted) return;
    e.preventDefault();
    const next = Array.from({ length: CODE_LENGTH }, (_, i) => pasted[i] ?? '');
    onChange(next);
    focusBox(Math.min(pasted.length, CODE_LENGTH - 1));
  };

  return (
    <div className="flex flex-wrap gap-3">
      {digits.map((digit, i) => (
        <input
          key={i}
          ref={(el) => {
            refs.current[i] = el;
          }}
          data-autofocus={i === 0 ? '' : undefined}
          value={digit}
          onChange={(e) => handleChange(i, e.target.value)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          onPaste={handlePaste}
          inputMode="numeric"
          autoComplete={i === 0 ? 'one-time-code' : 'off'}
          maxLength={1}
          aria-label={`Digit ${i + 1} of ${CODE_LENGTH}`}
          className="h-14 w-[72px] rounded-xl border border-[#e5e7eb] bg-white text-center text-xl font-bold text-[#111827] outline-none transition-colors focus:border-2 focus:border-[#ddd6fe] focus:ring-2 focus:ring-[#8b5cf6]/20"
        />
      ))}
    </div>
  );
}

type TwoFactorModalProps = {
  open: boolean;
  onClose: () => void;
  // Called after a complete 6-digit code is submitted.
  onVerified: () => void;
};

export default function TwoFactorModal({ open, onClose, onVerified }: TwoFactorModalProps) {
  return (
    <Modal open={open} onClose={onClose} labelledBy="two-factor-title" maxWidthClassName="max-w-[640px]">
      {/* Content lives in its own component so its state (typed digits,
          errors) resets every time the modal closes and reopens. */}
      <TwoFactorContent onClose={onClose} onVerified={onVerified} />
    </Modal>
  );
}

function TwoFactorContent({ onClose, onVerified }: { onClose: () => void; onVerified: () => void }) {
  const [digits, setDigits] = useState<string[]>(Array(CODE_LENGTH).fill(''));
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [verifying, setVerifying] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(MANUAL_KEY);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard can be blocked (insecure context / permissions); the key
      // is still visible on screen so the user can copy it by hand.
    }
  };

  const handleVerify = async () => {
    if (digits.some((d) => !d)) {
      setError('Enter all 6 digits from your authenticator app.');
      return;
    }
    setVerifying(true);
    setError(null);
    try {
      // await fetch('/api/account/2fa/verify', { method: 'POST', body: JSON.stringify({ code: digits.join('') }) });
      await new Promise((resolve) => setTimeout(resolve, 500));
      onVerified();
    } catch {
      setError("That code didn't work. Check your authenticator app and try again.");
    } finally {
      setVerifying(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2 pr-2">
        <h3 id="two-factor-title" className="text-2xl font-extrabold leading-normal text-[#111827]">
          Set up two-factor authentication
        </h3>
        <p className="text-sm font-normal leading-normal text-[#667085]">
          An authenticator app adds an extra layer of security by generating a one-time code each time you sign in.
        </p>
      </div>

      {/* Step 1 */}
      <div className="flex items-start gap-4">
        <StepBadge n={1} />
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <p className="text-sm font-bold text-[#111827]">Download or open an authenticator app</p>
          <p className="text-[13px] font-normal text-[#667085]">
            Use Google Authenticator, Microsoft Authenticator, or Authy on your phone.
          </p>
        </div>
      </div>

      {/* Step 2 */}
      <div className="flex items-start gap-4">
        <StepBadge n={2} />
        <div className="flex min-w-0 flex-1 flex-col gap-3">
          <p className="text-sm font-bold text-[#111827]">Scan the QR code</p>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <QrPlaceholder />
            <div className="flex min-w-0 flex-1 flex-col gap-3">
              <p className="text-[13px] font-normal text-[#667085]">
                If you cannot scan the code, use the manual setup key below in your authenticator app.
              </p>
              <div className="flex items-center gap-3">
                <div className="min-w-0 flex-1 rounded-[10px] border border-[#e5e7eb] bg-[#f9fafb] px-3.5 py-3">
                  <p className="truncate text-[13px] font-bold text-[#111827]">{MANUAL_KEY}</p>
                </div>
                <SecondaryButton onClick={handleCopy} className="shrink-0 px-4">
                  {copied ? 'Copied' : 'Copy key'}
                </SecondaryButton>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Step 3 */}
      <div className="flex items-start gap-4">
        <StepBadge n={3} />
        <div className="flex min-w-0 flex-1 flex-col gap-3">
          <p className="text-sm font-bold text-[#111827]">Enter the 6-digit verification code</p>
          <p className="text-[13px] font-normal text-[#667085]">
            Open your authenticator app and enter the current code for Aura.
          </p>
          <CodeInput digits={digits} onChange={setDigits} />
          {error && (
            <p role="alert" className="text-xs font-semibold text-[#dc2626]">
              {error}
            </p>
          )}
        </div>
      </div>

      {/* Recovery warning */}
      <div className="flex items-center gap-3 rounded-xl border border-[#fed7aa] bg-[#fff7ed] p-4">
        <div className="flex size-6 shrink-0 items-center justify-center rounded-xl bg-[#ffedd5]">
          <AlertCircle className="size-3.5 text-[#ea580c]" />
        </div>
        <p className="text-xs font-normal text-[#92400e]">
          After verification, save your recovery codes in a secure place in case you lose access to your
          authenticator app.
        </p>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="text-[13px] font-normal text-[#9ca3af]">You can turn 2FA off later from Security Settings.</p>
        <div className="flex items-center gap-3">
          <SecondaryButton onClick={onClose}>Cancel</SecondaryButton>
          <GradientButton onClick={handleVerify} disabled={verifying} className={FOCUS_RING}>
            {verifying ? 'Verifying…' : 'Verify & Enable'}
          </GradientButton>
        </div>
      </div>
    </div>
  );
}