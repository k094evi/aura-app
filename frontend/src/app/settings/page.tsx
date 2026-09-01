'use client';

import { useCallback, useState, type FormEvent } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  ShieldCheck,
  KeyRound,
  LogOut,
  Bell,
  Mail,
  Trash2,
  AlertTriangle,
  X,
  Check,
} from 'lucide-react';
import { Modal, ActionRow, ToggleRow, SectionCard, FOCUS_RING } from '@/features/settings/components/SettingsUI';

type NotificationSettings = {
  analysisComplete: boolean;
  weeklySummary: boolean;
  productUpdates: boolean;
};

const INITIAL_SETTINGS: NotificationSettings = {
  analysisComplete: true,
  weeklySummary: true,
  productUpdates: false,
};

type Session = { id: string; label: string; isCurrent: boolean };

// Placeholder data until this is wired up to a real API (e.g.
// GET /api/sessions). A second, non-current session is included here so the
// "Sign out others" control is actually exercisable in the UI — with only
// the current device in the list, that action would always be disabled.
const INITIAL_SESSIONS: Session[] = [
  { id: 'current', label: 'This device', isCurrent: true },
  { id: 'session-2', label: 'iPhone · Manila, PH', isCurrent: false },
];

// Shared dark input style for the change-password form, matching the
// input-select fields used on the profile page.
const DARK_INPUT_CLASSES =
  'w-full rounded-[10px] border border-white/[0.07] bg-white/[0.03] px-4 py-2.5 text-sm font-medium text-white outline-none transition-colors focus:border-fuchsia-500/50 focus:ring-2 focus:ring-fuchsia-500/20';

export default function SettingsPage() {
  // Draft settings the user is currently editing, vs. the last-saved values.
  // Comparing the two gives us a real dirty flag instead of always flashing
  // "Saved" the moment the button is clicked.
  const [settings, setSettings] = useState<NotificationSettings>(INITIAL_SETTINGS);
  const [savedSettings, setSavedSettings] = useState<NotificationSettings>(INITIAL_SETTINGS);
  const isDirty = (Object.keys(settings) as (keyof NotificationSettings)[]).some(
    (key) => settings[key] !== savedSettings[key]
  );

  // Only two labels are shown on the save button ("Save Changes" /
  // "Saved") — 'saving' is still tracked internally to disable the button
  // mid-request, it just doesn't change the visible label.
  const [saveState, setSaveState] = useState<'idle' | 'saving' | 'saved'>('idle');
  const [saveError, setSaveError] = useState<string | null>(null);
  const [sessions, setSessions] = useState<Session[]>(INITIAL_SESSIONS);

  // Delete account
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  // Change password
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [passwordLastChanged, setPasswordLastChanged] = useState('June 2025');

  // Sign out other sessions
  const [signOutModalOpen, setSignOutModalOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);

  const otherSessionCount = sessions.filter((s) => !s.isCurrent).length;

  const updateSetting = (key: keyof NotificationSettings, value: boolean) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  // Real persistence is a backend concern — wire the commented calls below
  // up to your API. This keeps the local draft/saved split and, unlike
  // before, surfaces a visible error if the save fails instead of quietly
  // resetting the button as if nothing happened.
  const handleSave = async () => {
    if (!isDirty || saveState === 'saving') return;
    setSaveState('saving');
    setSaveError(null);
    try {
      // await fetch('/api/settings', { method: 'PATCH', body: JSON.stringify(settings) });
      await new Promise((resolve) => setTimeout(resolve, 400));
      setSavedSettings(settings);
      setSaveState('saved');
      setTimeout(() => setSaveState('idle'), 2000);
    } catch {
      setSaveState('idle');
      setSaveError("Couldn't save your changes. Try again.");
    }
  };

  const closeDeleteModal = useCallback(() => {
    setDeleteConfirmOpen(false);
    setDeleteError(null);
  }, []);

  const handleDeleteAccount = async () => {
    if (deleting) return;
    setDeleting(true);
    setDeleteError(null);
    try {
      // await fetch('/api/account', { method: 'DELETE' });
      await new Promise((resolve) => setTimeout(resolve, 500));
      closeDeleteModal();
    } catch {
      setDeleteError("Something went wrong and your account wasn't deleted. Try again.");
    } finally {
      setDeleting(false);
    }
  };

  const closePasswordModal = useCallback(() => {
    setPasswordModalOpen(false);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setPasswordError(null);
    setPasswordSuccess(false);
  }, []);

  const handleChangePassword = async (e: FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError('Fill in all three fields.');
      return;
    }
    if (newPassword.length < 8) {
      setPasswordError('New password must be at least 8 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError("New password and confirmation don't match.");
      return;
    }
    setPasswordSaving(true);
    setPasswordError(null);
    try {
      // await fetch('/api/account/password', { method: 'POST', body: JSON.stringify({ currentPassword, newPassword }) });
      await new Promise((resolve) => setTimeout(resolve, 500));
      setPasswordSuccess(true);
      setPasswordLastChanged(
        new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
      );
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch {
      setPasswordError('Could not update your password. Try again.');
    } finally {
      setPasswordSaving(false);
    }
  };

  const closeSignOutModal = useCallback(() => setSignOutModalOpen(false), []);

  const handleSignOutOthers = async () => {
    if (signingOut) return;
    setSigningOut(true);
    try {
      // await fetch('/api/sessions/others', { method: 'DELETE' });
      await new Promise((resolve) => setTimeout(resolve, 400));
      setSessions((prev) => prev.filter((s) => s.isCurrent));
      setSignOutModalOpen(false);
    } finally {
      setSigningOut(false);
    }
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-hidden bg-[#0c0a14] pt-20">
      {/* Ambient background orbs */}
      <div className="pointer-events-none absolute -left-[100px] top-[150px] size-[500px] rounded-full bg-fuchsia-600/30 blur-[110px]" />
      <div className="pointer-events-none absolute -right-[150px] top-[100px] size-[550px] rounded-full bg-violet-600/25 blur-[120px]" />
      <div className="pointer-events-none absolute left-[35%] top-[550px] size-[450px] rounded-full bg-cyan-500/20 blur-[110px]" />

      {/* Sub-header / back link */}
      <div className="relative z-10 flex w-full shrink-0 items-center justify-between px-8 pb-8 pt-5 md:px-16">
        <Link
          href="/dashboard"
          className="flex items-center gap-2 text-sm font-semibold text-fuchsia-500 transition-colors hover:text-fuchsia-400"
        >
          <ArrowLeft className="size-4" />
          Back to Dashboard
        </Link>
      </div>

      <div className="relative z-10 flex w-full flex-col gap-8 px-8 pb-16 md:px-16">
        <div className="flex flex-col gap-2">
          <h1 className="text-[32px] font-extrabold leading-normal text-white">Settings</h1>
          <p className="text-base font-normal text-white/50">Manage your account, notifications, and data.</p>
        </div>

        {/* Account & Security */}
        <SectionCard icon={ShieldCheck} title="Account & Security" description="Keep your account protected">
          <ActionRow
            icon={KeyRound}
            title="Change password"
            description={`Last changed ${passwordLastChanged}`}
            onClick={() => setPasswordModalOpen(true)}
            trailing={
              <span className="shrink-0 text-sm font-semibold text-fuchsia-500 transition-colors group-hover:text-fuchsia-400">
                Update
              </span>
            }
          />

          <ActionRow
            icon={ShieldCheck}
            title="Two-factor sign-in"
            description="We already send a one-time code to your email whenever you sign in"
            trailing={
              <span className="shrink-0 rounded-md bg-emerald-500/10 px-2.5 py-1 text-xs font-bold text-emerald-500">
                ACTIVE
              </span>
            }
          />

          <ActionRow
            icon={LogOut}
            title="Active sessions"
            description={`Signed in on ${sessions.length} device${sessions.length === 1 ? '' : 's'}`}
            onClick={() => setSignOutModalOpen(true)}
            disabled={otherSessionCount === 0}
            trailing={
              <span
                className={`shrink-0 text-sm font-semibold ${
                  otherSessionCount === 0 ? 'text-white/20' : 'text-fuchsia-500 group-hover:text-fuchsia-400'
                }`}
              >
                Sign out others
              </span>
            }
          />
        </SectionCard>

        {/* Notifications */}
        <SectionCard icon={Bell} title="Notifications" description="Choose what we email you about">
          <ToggleRow
            icon={Mail}
            title="Analysis complete"
            description="Get an email when your resume analysis is ready"
            checked={settings.analysisComplete}
            onChange={(next) => updateSetting('analysisComplete', next)}
          />
          <ToggleRow
            icon={Mail}
            title="Weekly progress summary"
            description="A recap of your ATS score trend, sent every Monday"
            checked={settings.weeklySummary}
            onChange={(next) => updateSetting('weeklySummary', next)}
          />
          <ToggleRow
            icon={Mail}
            title="Product updates"
            description="New features and tips, sent occasionally"
            checked={settings.productUpdates}
            onChange={(next) => updateSetting('productUpdates', next)}
          />
          <div className="mt-2 flex items-center justify-end gap-3 pt-4">
            {saveError && (
              <p role="alert" className="text-xs font-semibold text-red-400">
                {saveError}
              </p>
            )}
            <button
              onClick={handleSave}
              disabled={!isDirty || saveState === 'saving'}
              className={`inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#8b5cf6] to-[#d946ef] px-6 py-3 text-sm font-bold text-white shadow-[0px_4px_6px_0px_rgba(139,92,246,0.25)] transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40 ${FOCUS_RING}`}
            >
              {saveState === 'saved' ? (
                <>
                  <Check className="size-4" />
                  Saved
                </>
              ) : (
                'Save Changes'
              )}
            </button>
          </div>
        </SectionCard>

        {/* Danger Zone */}
        <div className="w-full rounded-3xl border border-red-500/20 bg-red-500/[0.06] p-7">
          <div className="mb-1 flex items-center gap-3.5">
            <div className="flex shrink-0 items-center justify-center rounded-xl border border-red-500/20 bg-red-500/10 p-2.5">
              <AlertTriangle className="size-5 text-red-500" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-red-500">Danger Zone</h2>
              <p className="text-[13px] text-red-500/80">Actions here can&apos;t be undone</p>
            </div>
          </div>
          <ActionRow
            title="Delete account"
            description="Permanently deletes your profile and all analysis history"
            trailing={
              <button
                onClick={() => setDeleteConfirmOpen(true)}
                className={`inline-flex shrink-0 items-center gap-2 rounded-[10px] border border-red-500 bg-red-500/10 px-4 py-2.5 text-[13px] font-semibold text-red-500 transition-colors hover:bg-red-500/20 ${FOCUS_RING}`}
              >
                <Trash2 className="size-3.5" />
                Delete account
              </button>
            }
          />
        </div>
      </div>

      {/* Delete account confirmation modal */}
      <Modal open={deleteConfirmOpen} onClose={closeDeleteModal} labelledBy="delete-account-title">
        <div className="mb-4 flex items-start justify-between">
          <h3 id="delete-account-title" className="text-base font-bold text-white">
            Delete your account?
          </h3>
          <button
            onClick={closeDeleteModal}
            aria-label="Close dialog"
            className={`rounded-lg text-white/40 hover:text-white/70 ${FOCUS_RING}`}
          >
            <X className="size-4" />
          </button>
        </div>
        <p className="mb-6 text-sm text-white/60">
          This permanently removes your profile and all analysis history. This can&apos;t be undone.
        </p>
        {deleteError && (
          <p role="alert" className="mb-4 text-xs font-semibold text-red-400">
            {deleteError}
          </p>
        )}
        {/* Only the Delete action remains here (Cancel removed per request),
            right-aligned to match the other modals' button placement. The
            X icon and Escape still back out without deleting. */}
        <div className="flex justify-end">
          <button
            onClick={handleDeleteAccount}
            disabled={deleting}
            className={`rounded-xl bg-red-600 px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-red-500 disabled:cursor-not-allowed disabled:bg-red-800/60 ${FOCUS_RING}`}
          >
            {deleting ? 'Deleting…' : 'Delete account'}
          </button>
        </div>
      </Modal>

      {/* Change password modal */}
      <Modal open={passwordModalOpen} onClose={closePasswordModal} labelledBy="change-password-title">
        <div className="mb-4 flex items-start justify-between">
          <h3 id="change-password-title" className="text-base font-bold text-white">
            Change password
          </h3>
          <button
            onClick={closePasswordModal}
            aria-label="Close dialog"
            className={`rounded-lg text-white/40 hover:text-white/70 ${FOCUS_RING}`}
          >
            <X className="size-4" />
          </button>
        </div>

        {passwordSuccess ? (
          <div className="py-4 text-center">
            <div className="mx-auto mb-3 flex size-10 items-center justify-center rounded-full bg-emerald-500/10">
              <Check className="size-5 text-emerald-500" />
            </div>
            <p className="mb-4 text-sm font-semibold text-white">Password updated.</p>
            <button
              onClick={closePasswordModal}
              className={`w-full rounded-xl bg-gradient-to-r from-[#8b5cf6] to-[#d946ef] px-4 py-2.5 text-sm font-bold text-white transition-opacity hover:opacity-90 ${FOCUS_RING}`}
            >
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleChangePassword} className="space-y-4">
            <div>
              <label
                htmlFor="current-password"
                className="mb-1.5 block text-[11px] font-bold uppercase tracking-wide text-white/40"
              >
                Current password
              </label>
              <input
                id="current-password"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className={DARK_INPUT_CLASSES}
              />
            </div>
            <div>
              <label
                htmlFor="new-password"
                className="mb-1.5 block text-[11px] font-bold uppercase tracking-wide text-white/40"
              >
                New password
              </label>
              <input
                id="new-password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className={DARK_INPUT_CLASSES}
              />
            </div>
            <div>
              <label
                htmlFor="confirm-password"
                className="mb-1.5 block text-[11px] font-bold uppercase tracking-wide text-white/40"
              >
                Confirm new password
              </label>
              <input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={DARK_INPUT_CLASSES}
              />
            </div>
            {passwordError && (
              <p role="alert" className="text-xs font-semibold text-red-400">
                {passwordError}
              </p>
            )}
            <div className="mt-2 flex justify-end">
              <button
                type="submit"
                disabled={passwordSaving}
                className={`rounded-xl bg-gradient-to-r from-[#8b5cf6] to-[#d946ef] px-6 py-2.5 text-sm font-bold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40 ${FOCUS_RING}`}
              >
                {passwordSaving ? 'Updating…' : 'Update password'}
              </button>
            </div>
          </form>
        )}
      </Modal>

      {/* Sign out other sessions confirmation */}
      <Modal open={signOutModalOpen} onClose={closeSignOutModal} labelledBy="sign-out-others-title">
        <div className="mb-4 flex items-start justify-between">
          <h3 id="sign-out-others-title" className="text-base font-bold text-white">
            Sign out other sessions?
          </h3>
          <button
            onClick={closeSignOutModal}
            aria-label="Close dialog"
            className={`rounded-lg text-white/40 hover:text-white/70 ${FOCUS_RING}`}
          >
            <X className="size-4" />
          </button>
        </div>
        <p className="mb-6 text-sm text-white/60">
          This signs you out on every device except this one
          {otherSessionCount > 0 ? ` (${otherSessionCount} other session${otherSessionCount === 1 ? '' : 's'})` : ''}.
        </p>
        <div className="flex justify-end">
          <button
            onClick={handleSignOutOthers}
            disabled={signingOut}
            className={`rounded-xl bg-gradient-to-r from-[#8b5cf6] to-[#d946ef] px-6 py-2.5 text-sm font-bold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40 ${FOCUS_RING}`}
          >
            {signingOut ? 'Signing out…' : 'Sign out others'}
          </button>
        </div>
      </Modal>
    </div>
  );
}