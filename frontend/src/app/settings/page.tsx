'use client';

import { useCallback, useState } from 'react';
import { LogOut, Shield, Trash2, X } from 'lucide-react';
import {
  FOCUS_RING,
  GradientButton,
  Modal,
  SecondaryButton,
  SettingsBackground,
  SettingsCard,
  TextField,
} from '@/features/settings/components/SettingsUI';
import TwoFactorModal from '@/features/settings/components/TwoFactorModal';

// Hardcoded to match the Figma. Swap for the signed-in user's data once the
// backend exists (e.g. GET /api/account).
const ACCOUNT = {
  displayName: 'Alex Morgan',
  email: 'alex.morgan@email.com',
  
};

export default function SettingsPage() {
  // General information
  const [displayName, setDisplayName] = useState(ACCOUNT.displayName);
  const [saveState, setSaveState] = useState<'idle' | 'saving' | 'saved'>('idle');
  const [saveError, setSaveError] = useState<string | null>(null);

  // Password
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordUpdated, setPasswordUpdated] = useState(false);

  // Two-factor authentication
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [twoFactorModalOpen, setTwoFactorModalOpen] = useState(false);

  // Active sessions
  const [signingOut, setSigningOut] = useState(false);
  const [signedOut, setSignedOut] = useState(false);

  // Delete account
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  // Persistence is a backend concern. Wire the commented calls up to your
  // API; the simulated delays keep the loading states visible until then.
  const handleSaveChanges = async () => {
    if (saveState === 'saving') return;
    setSaveState('saving');
    setSaveError(null);
    try {
      // await fetch('/api/account', { method: 'PATCH', body: JSON.stringify({ displayName }) });
      await new Promise((resolve) => setTimeout(resolve, 400));
      setSaveState('saved');
      setTimeout(() => setSaveState('idle'), 2000);
    } catch {
      setSaveState('idle');
      setSaveError("Couldn't save your changes. Try again.");
    }
  };

  const handleUpdatePassword = async () => {
    setPasswordUpdated(false);
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
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setPasswordUpdated(true);
      setTimeout(() => setPasswordUpdated(false), 3000);
    } catch {
      setPasswordError('Could not update your password. Try again.');
    } finally {
      setPasswordSaving(false);
    }
  };

  const closeTwoFactorModal = useCallback(() => setTwoFactorModalOpen(false), []);

  const handleTwoFactorVerified = useCallback(() => {
    setTwoFactorEnabled(true);
    setTwoFactorModalOpen(false);
  }, []);

  const handleSignOutAll = async () => {
    if (signingOut) return;
    setSigningOut(true);
    try {
      // await fetch('/api/sessions/others', { method: 'DELETE' });
      await new Promise((resolve) => setTimeout(resolve, 400));
      setSignedOut(true);
      setTimeout(() => setSignedOut(false), 2000);
    } finally {
      setSigningOut(false);
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

  return (
    // DM Sans is the Figma typeface; make sure it's loaded (weights 400-800),
    // e.g. via next/font/google in the root layout.
    <div className="relative flex min-h-screen w-full flex-col overflow-hidden bg-[#f0eeff] pt-20 font-['DM_Sans',sans-serif]">
      <SettingsBackground />

      <main className="relative z-10 flex w-full flex-col gap-8 px-6 pb-20 pt-14 md:px-20">
        <div className="flex flex-col gap-2">
          <h1 className="text-[32px] font-extrabold leading-normal text-[#111827]">Settings</h1>
          <p className="text-[15px] font-normal leading-normal text-[#667085]">
            Manage your account preferences and security settings.
          </p>
        </div>

        {/* General Information */}
        <SettingsCard
          title="General Information"
          description="Update your display name and personal details."
          footer={
            <>
              <p className="text-xs font-normal text-[#9ca3af]">Changes will be applied immediately.</p>
              <div className="flex items-center gap-3">
                {saveError && (
                  <p role="alert" className="text-xs font-semibold text-[#dc2626]">
                    {saveError}
                  </p>
                )}
                <GradientButton onClick={handleSaveChanges} disabled={saveState === 'saving'}>
                  {saveState === 'saved' ? 'Saved' : 'Save Changes'}
                </GradientButton>
              </div>
            </>
          }
        >
          <TextField
            label="Display Name"
            value={displayName}
            onChange={setDisplayName}
            hint="This is how your name appears across the app."
            autoComplete="name"
          />
          <TextField
            label="Email Address"
            value={ACCOUNT.email}
            disabled
            badge="Locked"
            hint="Your email is tied to your account and cannot be changed."
          />
        </SettingsCard>

        {/* Security Settings */}
        <SettingsCard
          title="Security Settings"
          description="Keep your account secure with a strong password and two-factor authentication."
          footer={
            <>
              {passwordError ? (
                <p role="alert" className="text-xs font-semibold text-[#dc2626]">
                  {passwordError}
                </p>
              ) : passwordUpdated ? (
                <p role="status" className="text-xs font-semibold text-[#10b981]">
                  Password updated.
                </p>
              ) : (
                <p className="text-xs font-normal text-[#9ca3af]">
                  Use a strong, unique password you don&apos;t use elsewhere.
                </p>
              )}
              <GradientButton onClick={handleUpdatePassword} disabled={passwordSaving}>
                {passwordSaving ? 'Updating…' : 'Update Password'}
              </GradientButton>
            </>
          }
        >
          <TextField
            label="Current Password"
            type="password"
            value={currentPassword}
            onChange={setCurrentPassword}
            placeholder="Enter current password"
            autoComplete="current-password"
          />
          <TextField
            label="New Password"
            type="password"
            value={newPassword}
            onChange={setNewPassword}
            placeholder="At least 8 characters"
            autoComplete="new-password"
          />
          <TextField
            label="Confirm New Password"
            type="password"
            value={confirmPassword}
            onChange={setConfirmPassword}
            placeholder="Re-enter new password"
            autoComplete="new-password"
          />

          {/* Two-factor authentication row */}
          <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-[#ddd6fe] bg-[#f5f3ff] px-6 py-5">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <Shield className="size-4 text-[#7c3aed]" />
                <p className="text-sm font-bold text-[#111827]">Two-Factor Authentication</p>
              </div>
              <p className={`text-xs font-normal ${twoFactorEnabled ? 'text-[#10b981]' : 'text-[#9ca3af]'}`}>
                {twoFactorEnabled ? 'Currently enabled' : 'Currently disabled'}
              </p>
            </div>
            {twoFactorEnabled ? (
              <SecondaryButton onClick={() => setTwoFactorEnabled(false)} className="rounded-lg px-5 py-[9px]">
                Disable 2FA
              </SecondaryButton>
            ) : (
              <button
                type="button"
                onClick={() => setTwoFactorModalOpen(true)}
                className={`rounded-lg bg-[#7c3aed] px-5 py-[9px] text-[13px] font-bold text-white shadow-[0px_4px_5px_0px_rgba(124,58,237,0.2)] transition-opacity hover:opacity-90 ${FOCUS_RING}`}
              >
                Enable 2FA
              </button>
            )}
          </div>
        </SettingsCard>

        {/* Active Sessions */}
        <section className="flex w-full flex-wrap items-center justify-between gap-4 rounded-[20px] border border-white bg-white/80 px-8 py-6 shadow-[0px_8px_32px_0px_rgba(31,41,55,0.08)]">
          <div className="flex flex-col gap-1">
            <h2 className="text-base font-extrabold leading-normal text-[#111827]">Active Sessions</h2>
            <p className="text-[13px] font-normal leading-normal text-[#667085]">
              Sign out of all other devices and browsers.
            </p>
          </div>
          <button
            type="button"
            onClick={handleSignOutAll}
            disabled={signingOut}
            className={`inline-flex items-center gap-2 rounded-[10px] border border-[#e5e7eb] bg-[#f3f4f6] px-5 py-2.5 text-[13px] font-bold text-[#374151] transition-colors hover:bg-[#e5e7eb] disabled:cursor-not-allowed disabled:opacity-50 ${FOCUS_RING}`}
          >
            <LogOut className="size-[15px]" />
            {signedOut ? 'Signed out' : signingOut ? 'Signing out…' : 'Sign Out All'}
          </button>
        </section>

        {/* Delete Account */}
        <section className="flex w-full flex-wrap items-center justify-between gap-4 rounded-[20px] border border-[#fecaca] bg-[#fff5f5] px-8 py-6 shadow-[0px_4px_8px_0px_rgba(239,68,68,0.08)]">
          <div className="flex flex-col gap-1">
            <h2 className="text-base font-extrabold leading-normal text-[#ef4444]">Delete Account</h2>
            <p className="text-[13px] font-normal leading-normal text-[#6b7280]">
              Permanently remove your account and all data. This cannot be undone.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setDeleteConfirmOpen(true)}
            className={`inline-flex items-center gap-2 rounded-[10px] bg-[#ef4444] px-5 py-2.5 text-[13px] font-bold text-white shadow-[0px_4px_5px_0px_rgba(239,68,68,0.19)] transition-opacity hover:opacity-90 ${FOCUS_RING}`}
          >
            <Trash2 className="size-[15px]" />
            Delete account
          </button>
        </section>
      </main>

      {/* Two-factor setup modal */}
      <TwoFactorModal open={twoFactorModalOpen} onClose={closeTwoFactorModal} onVerified={handleTwoFactorVerified} />

      {/* Delete account confirmation. Not in the Figma, kept as a safety net
          for a destructive action. Only the Delete action is shown (no
          Cancel button); the X icon, backdrop click, and Escape all back
          out without deleting. */}
      <Modal open={deleteConfirmOpen} onClose={closeDeleteModal} labelledBy="delete-account-title">
        <div className="mb-4 flex items-start justify-between">
          <h3 id="delete-account-title" className="text-base font-bold text-[#111827]">
            Delete your account?
          </h3>
          <button
            type="button"
            onClick={closeDeleteModal}
            aria-label="Close dialog"
            className={`rounded-lg text-[#9ca3af] hover:text-[#4b5563] ${FOCUS_RING}`}
          >
            <X className="size-4" />
          </button>
        </div>
        <p className="mb-6 text-sm text-[#667085]">
          This permanently removes your profile and all analysis history. This can&apos;t be undone.
        </p>
        {deleteError && (
          <p role="alert" className="mb-4 text-xs font-semibold text-[#dc2626]">
            {deleteError}
          </p>
        )}
        <div className="flex justify-end">
          <button
            type="button"
            onClick={handleDeleteAccount}
            disabled={deleting}
            className={`rounded-[10px] bg-[#ef4444] px-4 py-2.5 text-[13px] font-bold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50 ${FOCUS_RING}`}
          >
            {deleting ? 'Deleting…' : 'Delete account'}
          </button>
        </div>
      </Modal>
    </div>
  );
}