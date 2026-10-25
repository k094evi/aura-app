// src/components/SessionExpiryGuard.tsx
//
// Signs the user out automatically, with a warning first:
//   - after IDLE_LIMIT_MS with no activity (mouse, keys, touch, scroll), or
//   - when the access token itself expires (whichever comes first).
// WARNING_MS before that, a dialog shows a countdown. At zero the session is
// cleared and the user is sent to /signin with an "expired" notice.
//
// Mount it ONCE in the root layout (it renders nothing when signed out).

'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { clearSession } from '@/lib/auth';

// Change these two numbers to adjust the timing.
const IDLE_LIMIT_MS = 15 * 60 * 1000; // sign out after 15 minutes without activity
const WARNING_MS = 60 * 1000; // show the countdown for the last 60 seconds

// Same key lib/auth.ts uses for the access token.
const ACCESS_TOKEN_KEY = 'aura_access_token';

const ACTIVITY_EVENTS = ['mousemove', 'mousedown', 'keydown', 'scroll', 'touchstart', 'click'] as const;

function tokenExpiryMs(token: string): number | null {
  try {
    let payload = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    payload += '='.repeat((4 - (payload.length % 4)) % 4);
    const { exp } = JSON.parse(atob(payload));
    return typeof exp === 'number' ? exp * 1000 : null;
  } catch {
    return 0; // unreadable token -> treat as already expired
  }
}

const formatTime = (seconds: number) =>
  `${Math.floor(seconds / 60)}:${(seconds % 60).toString().padStart(2, '0')}`;

export default function SessionExpiryGuard() {
  const router = useRouter();
  const lastActivity = useRef(Date.now());
  const warningOpen = useRef(false);
  // Seconds left while the warning is showing; null = no warning.
  const [secondsLeft, setSecondsLeft] = useState<number | null>(null);
  // True when the warning is caused by the token expiring (can't be extended).
  const [tokenCause, setTokenCause] = useState(false);

  const endSession = useCallback(() => {
    warningOpen.current = false;
    setSecondsLeft(null);
    clearSession();
    router.replace('/signin?reason=expired');
  }, [router]);

  const stayActive = useCallback(() => {
    lastActivity.current = Date.now();
    warningOpen.current = false;
    setSecondsLeft(null);
  }, []);

  // Activity resets the idle clock (ignored while the warning is open, so the
  // person has to choose "Stay signed in" on purpose).
  useEffect(() => {
    const onActivity = () => {
      if (!warningOpen.current) lastActivity.current = Date.now();
    };
    ACTIVITY_EVENTS.forEach((e) => window.addEventListener(e, onActivity, { passive: true }));
    // A fresh sign-in starts a fresh idle clock.
    window.addEventListener('aura:auth-change', onActivity);
    return () => {
      ACTIVITY_EVENTS.forEach((e) => window.removeEventListener(e, onActivity));
      window.removeEventListener('aura:auth-change', onActivity);
    };
  }, []);

  useEffect(() => {
    const tick = () => {
      let token: string | null = null;
      try {
        token = window.sessionStorage.getItem(ACCESS_TOKEN_KEY);
      } catch {
        // Storage unavailable: nothing to guard.
      }
      if (!token) {
        warningOpen.current = false;
        setSecondsLeft((s) => (s === null ? s : null));
        return; // signed out
      }

      const exp = tokenExpiryMs(token);
      const idleLeft = IDLE_LIMIT_MS - (Date.now() - lastActivity.current);
      const tokenLeft = exp === null ? Infinity : exp - Date.now();
      const left = Math.min(idleLeft, tokenLeft);

      if (left <= 0) {
        endSession();
        return;
      }
      if (left <= WARNING_MS) {
        warningOpen.current = true;
        setTokenCause(tokenLeft <= idleLeft);
        setSecondsLeft(Math.ceil(left / 1000));
      } else if (warningOpen.current) {
        // Idle clock was reset (e.g. "Stay signed in"): hide the warning.
        warningOpen.current = false;
        setSecondsLeft(null);
      }
    };

    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [endSession]);

  if (secondsLeft === null) return null;

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/40 px-4">
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="session-expiry-title"
        className="w-full max-w-[380px] rounded-2xl bg-white p-6 text-center shadow-xl"
      >
        <h2 id="session-expiry-title" className="text-[20px] font-bold text-[#111827]">
          {tokenCause ? 'Your session is about to expire' : 'Are you still there?'}
        </h2>
        <p className="mt-2 text-[14px] leading-[1.45] text-[#4b5563]">
          {tokenCause
            ? 'For your security you will be signed out soon. Please save your work.'
            : 'You have been inactive. You will be signed out automatically.'}
        </p>
        <p className="mt-3 text-[28px] font-extrabold tabular-nums text-[#7c3aed]">
          {formatTime(secondsLeft)}
        </p>
        <div className="mt-5 flex gap-3">
          <button
            type="button"
            onClick={endSession}
            className="flex-1 rounded-full border border-[#e5e7eb] bg-white px-4 py-[10px] text-[14px] font-semibold text-[#4b5563] hover:bg-[#f9fafb]"
          >
            Sign out now
          </button>
          {!tokenCause && (
            <button
              type="button"
              onClick={stayActive}
              className="flex-1 rounded-full bg-[#7c3aed] px-4 py-[10px] text-[14px] font-semibold text-white hover:bg-[#6d28d9]"
            >
              Stay signed in
            </button>
          )}
        </div>
      </div>
    </div>
  );
}