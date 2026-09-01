'use client';

import { useEffect, useRef, type ElementType, type ReactNode } from 'react';

/* -------------------------------------------------------------------------
 * Shared focus-visible ring, reused on every interactive element so
 * keyboard focus reads consistently across the settings page (previously
 * only the text inputs had a focus treatment).
 * ---------------------------------------------------------------------- */
export const FOCUS_RING =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2';

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
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4"
      onClick={onClose}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
        tabIndex={-1}
        className={`bg-white rounded-2xl p-6 w-full shadow-xl outline-none ${maxWidthClassName}`}
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
    <div className="flex items-center justify-between gap-4 py-4">
      <div className="flex items-start gap-3 min-w-0">
        <div className="w-9 h-9 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center shrink-0 mt-0.5">
          <Icon className="w-4 h-4 text-gray-400" />
        </div>
        <div className="min-w-0">
          <p id={labelId} className="text-sm font-bold text-gray-900">{title}</p>
          <p className="text-xs text-gray-400 mt-0.5">{description}</p>
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
          backgroundColor: checked ? '#4f46e5' : '#e5e7eb',
          transition: 'background-color 0.2s ease',
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
            boxShadow: '0 1px 2px rgba(0,0,0,0.15)',
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
      <div className="flex items-start gap-3 min-w-0">
        {Icon && (
          <div className="w-9 h-9 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center shrink-0 mt-0.5">
            <Icon className="w-4 h-4 text-gray-400" />
          </div>
        )}
        <div className="min-w-0">
          <p className="text-sm font-bold text-gray-900">{title}</p>
          <p className="text-xs text-gray-400 mt-0.5">{description}</p>
        </div>
      </div>
      {trailing}
    </>
  );

  if (!onClick) {
    return <div className="flex items-center justify-between gap-4 py-4">{content}</div>;
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`w-full flex items-center justify-between gap-4 py-4 text-left group rounded-xl disabled:cursor-not-allowed ${FOCUS_RING}`}
    >
      {content}
    </button>
  );
}

/* -------------------------------------------------------------------------
 * SectionCard — the white card shell (icon + title + description header,
 * divided list of rows) used for Account & Security and Notifications.
 * ---------------------------------------------------------------------- */
export function SectionCard({
  icon: Icon,
  iconBg,
  iconColor,
  title,
  description,
  children,
}: {
  icon: ElementType;
  iconBg: string;
  iconColor: string;
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 mb-6">
      <div className="flex items-center gap-3 mb-2">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${iconBg}`}>
          <Icon className={`w-5 h-5 ${iconColor}`} />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">{title}</h2>
          <p className="text-sm text-gray-400">{description}</p>
        </div>
      </div>
      <div className="divide-y divide-gray-100">{children}</div>
    </div>
  );
}