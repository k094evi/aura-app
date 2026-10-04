'use client';

import {
  useEffect,
  useId,
  useRef,
  type ButtonHTMLAttributes,
  type InputHTMLAttributes,
  type ReactNode,
} from 'react';

/* -------------------------------------------------------------------------
 * Shared focus-visible ring, reused on every interactive element so
 * keyboard focus reads consistently. Violet to match the light theme, with
 * the offset color set to the page background so the ring doesn't look
 * cut out.
 * ---------------------------------------------------------------------- */
export const FOCUS_RING =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8b5cf6] focus-visible:ring-offset-2 focus-visible:ring-offset-[#f0eeff]';

/* -------------------------------------------------------------------------
 * Modal: shared dialog shell (delete account, two-factor setup).
 *
 *  - moves focus into the dialog on open (to `[data-autofocus]` if present,
 *    otherwise the first focusable element) and restores it on close
 *  - traps Tab / Shift+Tab inside the dialog
 *  - closes on Escape or backdrop click
 *
 * Background scroll is intentionally left alone (no body overflow toggling),
 * because locking it caused a layout jump when the modal opened.
 * ---------------------------------------------------------------------- */
export function Modal({
  open,
  onClose,
  labelledBy,
  children,
  maxWidthClassName = 'max-w-sm',
}: {
  open: boolean;
  onClose: () => void;
  labelledBy: string;
  children: ReactNode;
  maxWidthClassName?: string;
}) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onCloseRef.current = onClose;
  });

  useEffect(() => {
    if (!open) return;

    const previouslyFocused = document.activeElement as HTMLElement | null;

    const getFocusable = () =>
      dialogRef.current
        ? Array.from(
            dialogRef.current.querySelectorAll<HTMLElement>(
              'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
            )
          )
        : [];

    const focusFrame = requestAnimationFrame(() => {
      const preferred = dialogRef.current?.querySelector<HTMLElement>('[data-autofocus]');
      (preferred ?? getFocusable()[0] ?? dialogRef.current)?.focus();
    });

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        onCloseRef.current();
        return;
      }
      if (e.key !== 'Tab') return;

      const focusable = getFocusable();
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      cancelAnimationFrame(focusFrame);
      window.removeEventListener('keydown', handleKeyDown);
      previouslyFocused?.focus?.();
    };
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#111827]/40 px-4 backdrop-blur-[5px]"
      onClick={onClose}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
        tabIndex={-1}
        className={`max-h-[90vh] w-full overflow-y-auto rounded-3xl border border-white bg-white/80 p-6 shadow-[0px_16px_48px_0px_rgba(31,41,55,0.1)] outline-none backdrop-blur-[12px] ${maxWidthClassName}`}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------
 * Page background: three ambient orbs and the thin accent line across the
 * top. The page root must be `relative` and `overflow-hidden`.
 * ---------------------------------------------------------------------- */
function orbGradient(rgb: string, peak: number) {
  return `radial-gradient(closest-side, rgba(${rgb},${peak}) 0%, rgba(${rgb},${peak * 0.75}) 45%, rgba(${rgb},0) 100%)`;
}

export function SettingsBackground() {
  return (
    <>
      {/* Purple orb (top-left) */}
      <div aria-hidden className="pointer-events-none absolute -left-[90px] -top-[80px] size-[620px]">
        <div className="absolute -inset-[25.81%]" style={{ background: orbGradient('139,92,246', 0.3) }} />
      </div>

      {/* Cyan orb (right) */}
      <div aria-hidden className="pointer-events-none absolute -right-[100px] top-[230px] size-[560px]">
        <div className="absolute -inset-[25.89%]" style={{ background: orbGradient('6,182,212', 0.22) }} />
      </div>

      {/* Rose orb (lower-middle) */}
      <div aria-hidden className="pointer-events-none absolute left-[38.9%] top-[850px] size-[400px]">
        <div className="absolute -inset-[35%]" style={{ background: orbGradient('244,63,94', 0.16) }} />
      </div>

      {/* Top accent line: violet -> cyan -> transparent */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-0 top-0 z-20 h-[3px] w-full bg-gradient-to-r from-[#7c3aed] via-[#06b6d4] to-[rgba(139,92,246,0)]"
      />
    </>
  );
}

/* -------------------------------------------------------------------------
 * Card shell: header (title + description), body, and a grey footer with a
 * hint on the left and an action on the right.
 * ---------------------------------------------------------------------- */
export function SettingsCard({
  title,
  description,
  children,
  footer,
}: {
  title: string;
  description: string;
  children: ReactNode;
  footer: ReactNode;
}) {
  return (
    <section className="w-full overflow-hidden rounded-[20px] border border-white bg-white/80 shadow-[0px_8px_32px_0px_rgba(31,41,55,0.08)]">
      <header className="flex flex-col gap-1.5 border-b border-[#e5e7eb] px-8 pb-6 pt-7">
        <h2 className="text-lg font-extrabold leading-normal text-[#111827]">{title}</h2>
        <p className="text-[13px] font-normal leading-normal text-[#667085]">{description}</p>
      </header>
      <div className="flex flex-col gap-6 px-8 py-7">{children}</div>
      <footer className="flex flex-wrap items-center justify-between gap-4 border-t border-[#e5e7eb] bg-[#f9fafb] px-8 py-5">
        {footer}
      </footer>
    </section>
  );
}

/* -------------------------------------------------------------------------
 * Text field: label, input, optional hint. `badge` renders a small pill
 * inside the input (used for the "Locked" email).
 * ---------------------------------------------------------------------- */
type TextFieldProps = {
  label: string;
  value: string;
  onChange?: (value: string) => void;
  hint?: string;
  badge?: string;
  disabled?: boolean;
} & Omit<InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange' | 'className' | 'disabled'>;

export function TextField({ label, value, onChange, hint, badge, disabled, ...inputProps }: TextFieldProps) {
  const id = useId();
  const hintId = `${id}-hint`;

  return (
    <div className="flex w-full flex-col gap-2">
      <label htmlFor={id} className={`text-[13px] font-bold ${disabled ? 'text-[#9ca3af]' : 'text-[#374151]'}`}>
        {label}
      </label>
      <div
        className={`flex items-center justify-between gap-3 rounded-[10px] border border-[#e5e7eb] px-4 py-3 transition-colors ${
          disabled
            ? 'bg-[#f3f4f6] opacity-80'
            : 'bg-[#f9fafb] focus-within:border-[#8b5cf6] focus-within:ring-2 focus-within:ring-[#8b5cf6]/20'
        }`}
      >
        <input
          id={id}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          disabled={disabled}
          aria-describedby={hint ? hintId : undefined}
          className="w-full min-w-0 bg-transparent text-sm font-normal text-[#111827] outline-none placeholder:text-[#9ca3af] disabled:cursor-not-allowed disabled:text-[#9ca3af]"
          {...inputProps}
        />
        {badge && (
          <span className="shrink-0 rounded-full bg-[#e5e7eb] px-2 py-[3px] text-[11px] font-semibold text-[#6b7280]">
            {badge}
          </span>
        )}
      </div>
      {hint && (
        <p id={hintId} className="text-xs font-normal text-[#9ca3af]">
          {hint}
        </p>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------
 * Buttons
 * ---------------------------------------------------------------------- */
export function GradientButton({ className = '', ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      {...props}
      className={`rounded-[10px] bg-gradient-to-r from-[#7c3aed] to-[#a78bfa] px-6 py-2.5 text-[13px] font-bold text-white shadow-[0px_4px_6px_0px_rgba(124,58,237,0.25)] transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50 ${FOCUS_RING} ${className}`}
    />
  );
}

export function SecondaryButton({ className = '', ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      {...props}
      className={`rounded-[10px] border border-[#e5e7eb] bg-white/[0.65] px-5 py-2.5 text-[13px] font-bold text-[#374151] transition-colors hover:bg-white disabled:cursor-not-allowed disabled:opacity-50 ${FOCUS_RING} ${className}`}
    />
  );
}