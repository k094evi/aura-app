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
    <div className="min-h-screen bg-gray-50 pt-20 pb-20 px-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <Link
          href="/dashboard"
          className={`flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-indigo-600 py-2.5 rounded-lg transition-colors ${FOCUS_RING}`}
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>
      </div>

      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">Settings</h1>
          <p className="text-sm text-gray-400 mt-1">Manage your account, notifications, and data.</p>
        </div>

        {/* Account & Security */}
        <SectionCard
          icon={ShieldCheck}
          iconBg="bg-indigo-50"
          iconColor="text-indigo-500"
          title="Account & Security"
          description="Keep your account protected"
        >
          <ActionRow
            icon={KeyRound}
            title="Change password"
            description={`Last changed ${passwordLastChanged}`}
            onClick={() => setPasswordModalOpen(true)}
            trailing={
              <span className="text-xs font-bold text-indigo-600 shrink-0 group-hover:text-indigo-700">
                Update
              </span>
            }
          />

          <ActionRow
            icon={ShieldCheck}
            title="Two-factor sign-in"
            description="We already send a one-time code to your email whenever you sign in"
            trailing={<span className="text-xs font-bold text-green-600 shrink-0">Active</span>}
          />

          <ActionRow
            icon={LogOut}
            title="Active sessions"
            description={`Signed in on ${sessions.length} device${sessions.length === 1 ? '' : 's'}`}
            onClick={() => setSignOutModalOpen(true)}
            disabled={otherSessionCount === 0}
            trailing={
              <span
                className={`text-xs font-bold shrink-0 ${
                  otherSessionCount === 0
                    ? 'text-gray-300'
                    : 'text-indigo-600 group-hover:text-indigo-700'
                }`}
              >
                Sign out others
              </span>
            }
          />
        </SectionCard>

        {/* Notifications */}
        <SectionCard
          icon={Bell}
          iconBg="bg-amber-50"
          iconColor="text-amber-500"
          title="Notifications"
          description="Choose what we email you about"
        >
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
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 12, marginTop: 24 }}>
            {saveError && (
              <p role="alert" className="text-xs font-semibold text-red-600">
                {saveError}
              </p>
            )}
            <button
              onClick={handleSave}
              disabled={!isDirty || saveState === 'saving'}
              className={`inline-flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white rounded-xl font-bold text-sm hover:bg-indigo-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-indigo-600 ${FOCUS_RING}`}
            >
              {saveState === 'saved' ? (
                <>
                  <Check className="w-4 h-4" />
                  Saved
                </>
              ) : (
                'Save Changes'
              )}
            </button>
          </div>
        </SectionCard>

        {/* Danger Zone */}
        <div className="bg-red-50/50 rounded-3xl border border-red-100 p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-red-500" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-red-600">Danger Zone</h2>
              <p className="text-sm text-red-400">Actions here can't be undone</p>
            </div>
          </div>
          <ActionRow
            title="Delete account"
            description="Permanently deletes your profile and all analysis history"
            trailing={
              <button
                onClick={() => setDeleteConfirmOpen(true)}
                className={`shrink-0 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-red-200 bg-white text-red-600 text-sm font-bold hover:bg-red-50 transition-colors ${FOCUS_RING}`}
              >
                <Trash2 className="w-4 h-4" />
                Delete account
              </button>
            }
          />
        </div>
      </div>

      {/* Delete account confirmation modal */}
      <Modal open={deleteConfirmOpen} onClose={closeDeleteModal} labelledBy="delete-account-title">
        <div className="flex items-start justify-between mb-4">
          <h3 id="delete-account-title" className="text-base font-bold text-gray-900">
            Delete your account?
          </h3>
          <button
            onClick={closeDeleteModal}
            aria-label="Close dialog"
            className={`text-gray-400 hover:text-gray-600 rounded-lg ${FOCUS_RING}`}
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <p className="text-sm text-gray-500 mb-6">
          This permanently removes your profile and all analysis history. This can't be undone.
        </p>
        {deleteError && (
          <p role="alert" className="text-xs font-semibold text-red-600 mb-4">
            {deleteError}
          </p>
        )}
        {/* Only the Delete action remains here (Cancel removed per request),
            right-aligned to match the other modals' button placement. The
            X icon and Escape still back out without deleting. Inline
            style on the button rather than a Tailwind bg-red-* class,
            since dynamically-referenced red utility classes weren't
            reliably making it into the generated CSS elsewhere in this
            app. */}
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button
            onClick={handleDeleteAccount}
            disabled={deleting}
            style={{
              backgroundColor: deleting ? '#fca5a5' : '#ef4444',
              color: '#ffffff',
              cursor: deleting ? 'not-allowed' : 'pointer',
            }}
            className={`px-4 py-2.5 rounded-xl text-sm font-bold transition-colors ${FOCUS_RING}`}
            onMouseEnter={(e) => {
              if (!deleting) e.currentTarget.style.backgroundColor = '#dc2626';
            }}
            onMouseLeave={(e) => {
              if (!deleting) e.currentTarget.style.backgroundColor = '#ef4444';
            }}
          >
            {deleting ? 'Deleting…' : 'Delete account'}
          </button>
        </div>
      </Modal>

      {/* Change password modal */}
      <Modal open={passwordModalOpen} onClose={closePasswordModal} labelledBy="change-password-title">
        <div className="flex items-start justify-between mb-4">
          <h3 id="change-password-title" className="text-base font-bold text-gray-900">
            Change password
          </h3>
          <button
            onClick={closePasswordModal}
            aria-label="Close dialog"
            className={`text-gray-400 hover:text-gray-600 rounded-lg ${FOCUS_RING}`}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {passwordSuccess ? (
          <div className="text-center py-4">
            <div className="w-10 h-10 mx-auto rounded-full bg-green-50 flex items-center justify-center mb-3">
              <Check className="w-5 h-5 text-green-600" />
            </div>
            <p className="text-sm font-semibold text-gray-900 mb-4">Password updated.</p>
            <button
              onClick={closePasswordModal}
              className={`w-full px-4 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-bold hover:bg-indigo-700 transition-colors ${FOCUS_RING}`}
            >
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleChangePassword} className="space-y-4">
            <div>
              <label htmlFor="current-password" className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5 block">
                Current password
              </label>
              <input
                id="current-password"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition-colors"
              />
            </div>
            <div>
              <label htmlFor="new-password" className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5 block">
                New password
              </label>
              <input
                id="new-password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition-colors"
              />
            </div>
            <div>
              <label htmlFor="confirm-password" className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5 block">
                Confirm new password
              </label>
              <input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition-colors"
              />
            </div>
            {passwordError && (
              <p role="alert" className="text-xs font-semibold text-red-600">
                {passwordError}
              </p>
            )}
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 8 }}>
              <button
                type="submit"
                disabled={passwordSaving}
                className={`px-6 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-bold hover:bg-indigo-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${FOCUS_RING}`}
              >
                {passwordSaving ? 'Updating…' : 'Update password'}
              </button>
            </div>
          </form>
        )}
      </Modal>

      {/* Sign out other sessions confirmation */}
      <Modal open={signOutModalOpen} onClose={closeSignOutModal} labelledBy="sign-out-others-title">
        <div className="flex items-start justify-between mb-4">
          <h3 id="sign-out-others-title" className="text-base font-bold text-gray-900">
            Sign out other sessions?
          </h3>
          <button
            onClick={closeSignOutModal}
            aria-label="Close dialog"
            className={`text-gray-400 hover:text-gray-600 rounded-lg ${FOCUS_RING}`}
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <p className="text-sm text-gray-500 mb-6">
          This signs you out on every device except this one
          {otherSessionCount > 0 ? ` (${otherSessionCount} other session${otherSessionCount === 1 ? '' : 's'})` : ''}.
        </p>
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button
            onClick={handleSignOutOthers}
            disabled={signingOut}
            className={`px-6 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-bold hover:bg-indigo-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${FOCUS_RING}`}
          >
            {signingOut ? 'Signing out…' : 'Sign out others'}
          </button>
        </div>
      </Modal>
    </div>
  );
}