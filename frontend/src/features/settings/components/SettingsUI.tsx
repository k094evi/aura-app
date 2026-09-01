'use client';

import { useEffect, useRef, type ElementType, type ReactNode } from 'react';

/* -------------------------------------------------------------------------
 * Shared focus-visible ring, reused on every interactive element so
 * keyboard focus reads consistently across the settings page. Fuchsia to
 * match the dark theme's accent color instead of the old indigo.
 * ---------------------------------------------------------------------- */
export const FOCUS_RING =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0c0a14]';

/* -------------------------------------------------------------------------
 * Modal — shared dialog shell used by every popover on the settings page
 * (delete account, change password, sign out other sessions).
 *
 * Centralizes the a11y/UX concerns that were previously only on the
 * delete-account dialog:
 *  - moves focus into the dialog on open, restores it to the trigger on close
 *  - traps Tab/Shift+Tab inside the dialog
 *  - closes on Escape or backdrop click
 *
 * Background scroll is intentionally left alone (no
 * document.body.style.overflow toggling). Locking/unlocking it was the
 * source of a layout jump when the modal opened — DeleteAnalysisModal
 * never does this and never shifts, so this Modal matches that behavior
 * instead of trying to compensate for the lock's side effects.
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

    // Move focus into the dialog once it's mounted.
    const focusFrame = requestAnimationFrame(() => {
      const focusable = getFocusable();
      (focusable[0] ?? dialogRef.current)?.focus();
    });

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        onClose();
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
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
        tabIndex={-1}
        className={`w-full rounded-2xl border border-white/[0.08] bg-[#151221] p-6 shadow-2xl outline-none ${maxWidthClassName}`}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------
 * ToggleRow — icon/title/description row with a trailing switch. Used by
 * the Notifications section.
 * ---------------------------------------------------------------------- */
type ToggleRowProps = {
  icon: ElementType;
  title: string;
  description: string;
  checked: boolean;
  onChange: (next: boolean) => void;
  disabled?: boolean;
};

export function ToggleRow({ icon: Icon, title, description, checked, onChange, disabled }: ToggleRowProps) {
  const labelId = `toggle-label-${title.toLowerCase().replace(/\s+/g, '-')}`;

  return (
    <div className="flex items-center justify-between gap-4 border-b border-white/[0.04] py-4 last:border-b-0">
      <div className="flex min-w-0 items-start gap-4">
        <div className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-[10px] border border-white/[0.07] bg-white/[0.03]">
          <Icon className="size-[18px] text-white/50" />
        </div>
        <div className="min-w-0">
          <p id={labelId} className="text-[15px] font-semibold text-white">
            {title}
          </p>
          <p className="mt-1 text-[13px] leading-[1.4] text-white/50">{description}</p>
        </div>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-labelledby={labelId}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={FOCUS_RING}
        style={{
          position: 'relative',
          display: 'inline-flex',
          flexShrink: 0,
          alignItems: 'center',
          width: '44px',
          height: '24px',
          borderRadius: '9999px',
          border: 'none',
          padding: 0,
          cursor: disabled ? 'not-allowed' : 'pointer',
          opacity: disabled ? 0.5 : 1,
          background: checked ? 'linear-gradient(to right, #8b5cf6, #d946ef)' : 'rgba(255,255,255,0.12)',
          transition: 'background 0.2s ease',
        }}
      >
        <span
          style={{
            position: 'absolute',
            top: '2px',
            left: '2px',
            width: '20px',
            height: '20px',
            borderRadius: '9999px',
            backgroundColor: '#ffffff',
            boxShadow: '0 1px 2px rgba(0,0,0,0.4)',
            transform: checked ? 'translateX(20px)' : 'translateX(0)',
            transition: 'transform 0.2s ease',
          }}
        />
      </button>
    </div>
  );
}

/* -------------------------------------------------------------------------
 * ActionRow — shared icon/title/description row with a trailing action.
 * Replaces four near-identical copies of this markup (change password,
 * two-factor, active sessions, delete account) with one component.
 * `icon` is optional since the delete-account row in the Danger Zone never
 * had a leading icon box.
 * ---------------------------------------------------------------------- */
export function ActionRow({
  icon: Icon,
  title,
  description,
  trailing,
  onClick,
  disabled,
}: {
  icon?: ElementType;
  title: string;
  description: string;
  trailing: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
}) {
  const content = (
    <>
      <div className="flex min-w-0 flex-1 items-center gap-4">
        {Icon && (
          <div className="flex size-9 shrink-0 items-center justify-center rounded-[10px] border border-white/[0.07] bg-white/[0.03]">
            <Icon className="size-[18px] text-white/50" />
          </div>
        )}
        <div className="min-w-0 flex-1">
          <p className="text-[15px] font-semibold text-white">{title}</p>
          <p className="mt-1 text-[13px] leading-[1.4] text-white/50">{description}</p>
        </div>
      </div>
      {trailing}
    </>
  );

  if (!onClick) {
    return (
      <div className="flex items-center justify-between gap-4 border-b border-white/[0.04] py-4 last:border-b-0">
        {content}
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`flex w-full items-center justify-between gap-4 rounded-xl border-b border-white/[0.04] py-4 text-left last:border-b-0 disabled:cursor-not-allowed ${FOCUS_RING}`}
    >
      {content}
    </button>
  );
}

/* -------------------------------------------------------------------------
 * SectionCard — the glass card shell (icon + title + description header,
 * divided list of rows) used for Account & Security and Notifications.
 * ---------------------------------------------------------------------- */
export function SectionCard({
  icon: Icon,
  title,
  description,
  children,
}: {
  icon: ElementType;
  iconBg?: string;
  iconColor?: string;
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <div className="mb-6 w-full rounded-3xl border border-white/[0.07] bg-[#151221]/70 p-7 shadow-[0px_16px_32px_0px_rgba(0,0,0,0.25)] backdrop-blur-[20px]">
      <div className="mb-1 flex items-center gap-3.5">
        <div className="flex shrink-0 items-center justify-center rounded-xl border border-violet-500/20 bg-violet-500/10 p-2.5">
          <Icon className="size-5 text-violet-400" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-white">{title}</h2>
          <p className="text-[13px] text-white/50">{description}</p>
        </div>
      </div>
      <div>{children}</div>
    </div>
  );
}