'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
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
import { authSessionHeaders, clearSession, saveSession, saveUser } from '@/lib/auth';

type SettingsAccount = {
  id: string;
  email: string | null;
  full_name: string | null;
  providers: string[];
  password_changed_at: string | null;
};

type MFAFactor = { id: string; friendly_name: string; status: string };

async function settingsRequest<T>(
  path: string,
  method = 'GET',
  body?: Record<string, string>
): Promise<T> {
  const headers = authSessionHeaders(body ? { 'Content-Type': 'application/json' } : undefined);
  const response = await fetch(`/api/settings/${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
    cache: 'no-store',
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.detail ?? 'Could not update your account settings.');
  }
  return data as T;
}

function getPasswordAvailableAt(changedAt: string | null | undefined): Date | null {
  if (!changedAt) return null;
  const changedDate = new Date(changedAt);
  return Number.isNaN(changedDate.getTime())
    ? null
    : new Date(changedDate.getTime() + 60 * 24 * 60 * 60 * 1000);
}

export default function SettingsPage() {
  const router = useRouter();
  const [account, setAccount] = useState<SettingsAccount | null>(null);
  const [displayName, setDisplayName] = useState('');
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [profileSaving, setProfileSaving] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [profileSaved, setProfileSaved] = useState(false);

  const [newEmail, setNewEmail] = useState('');
  const [emailPassword, setEmailPassword] = useState('');
  const [emailCode, setEmailCode] = useState('');
  const [emailCodeSent, setEmailCodeSent] = useState(false);
  const [emailBusy, setEmailBusy] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [emailMessage, setEmailMessage] = useState<string | null>(null);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordUpdated, setPasswordUpdated] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);

  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [verifiedFactorId, setVerifiedFactorId] = useState<string | undefined>();
  const [twoFactorModalOpen, setTwoFactorModalOpen] = useState(false);
  const [twoFactorMode, setTwoFactorMode] = useState<'enable' | 'disable'>('enable');
  const [twoFactorError, setTwoFactorError] = useState<string | null>(null);

  const [signingOut, setSigningOut] = useState(false);
  const [signedOut, setSignedOut] = useState(false);
  const [sessionError, setSessionError] = useState<string | null>(null);

  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState('');
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const loadedAccount = await settingsRequest<SettingsAccount>('account');
        if (cancelled) return;
        setAccount(loadedAccount);
        setDisplayName(loadedAccount.full_name ?? '');
        setNewEmail(loadedAccount.email ?? '');
      } catch (cause) {
        if (!cancelled) {
          setLoadError(cause instanceof Error ? cause.message : 'Could not load account settings.');
        }
      }

      try {
        const factors = await settingsRequest<{ totp: MFAFactor[] }>('mfa');
        if (cancelled) return;
        const verified = factors.totp.find((factor) => factor.status === 'verified');
        setTwoFactorEnabled(Boolean(verified));
        setVerifiedFactorId(verified?.id);
      } catch (cause) {
        if (!cancelled) {
          setTwoFactorError(cause instanceof Error ? cause.message : 'Could not load 2FA settings.');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const updateCurrentTime = () => setCurrentTime(Date.now());
    updateCurrentTime();

    const availableAt = getPasswordAvailableAt(account?.password_changed_at);
    if (!availableAt || availableAt.getTime() <= Date.now()) return;

    const unlockTimer = window.setTimeout(
      updateCurrentTime,
      availableAt.getTime() - Date.now()
    );
    return () => window.clearTimeout(unlockTimer);
  }, [account?.password_changed_at]);

  const isOAuthAccount = Boolean(
    account?.providers.some((provider) => provider === 'google' || provider === 'github')
  );
  const canUsePassword = Boolean(
    account?.email && (account.providers.includes('email') || !isOAuthAccount)
  );
  const passwordAvailableAt = getPasswordAvailableAt(account?.password_changed_at);
  const passwordLocked = Boolean(passwordAvailableAt && passwordAvailableAt.getTime() > currentTime);

  const handleSaveProfile = async () => {
    if (profileSaving) return;
    setProfileSaving(true);
    setProfileError(null);
    setProfileSaved(false);
    try {
      const updated = await settingsRequest<SettingsAccount>('account', 'PATCH', {
        full_name: displayName,
      });
      setAccount(updated);
      saveUser({
        id: updated.id,
        email: updated.email,
        full_name: updated.full_name,
      });
      setProfileSaved(true);
    } catch (cause) {
      setProfileError(cause instanceof Error ? cause.message : 'Could not save your profile.');
    } finally {
      setProfileSaving(false);
    }
  };

  const handleRequestEmailCode = async () => {
    if (emailBusy) return;
    setEmailBusy(true);
    setEmailError(null);
    setEmailMessage(null);
    try {
      const result = await settingsRequest<{ message: string }>('email/request', 'POST', {
        email: newEmail,
        current_password: emailPassword,
      });
      setEmailCodeSent(true);
      setEmailMessage(result.message);
    } catch (cause) {
      setEmailError(cause instanceof Error ? cause.message : 'Could not send a verification code.');
    } finally {
      setEmailBusy(false);
    }
  };

  const handleVerifyEmailCode = async () => {
    if (!emailCodeSent || emailBusy) return;
    setEmailBusy(true);
    setEmailError(null);
    setEmailMessage(null);
    try {
      const result = await settingsRequest<{
        message: string;
        access_token: string;
        refresh_token: string;
        user: SettingsAccount;
      }>('email/verify', 'POST', { email: newEmail, token: emailCode });
      saveSession(result.access_token, result.refresh_token, result.user);
      setAccount(result.user);
      setNewEmail(result.user.email ?? '');
      setEmailPassword('');
      setEmailCode('');
      setEmailCodeSent(false);
      setEmailMessage(result.message);
    } catch (cause) {
      setEmailError(cause instanceof Error ? cause.message : 'Could not verify that code.');
    } finally {
      setEmailBusy(false);
    }
  };

  const handleUpdatePassword = async () => {
    if (passwordSaving) return;
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
    if (passwordLocked) {
      setPasswordError('You can change your password again after the 60-day waiting period.');
      return;
    }

    setPasswordSaving(true);
    setPasswordError(null);
    try {
      const result = await settingsRequest<{ password_changed_at: string }>(
        'password',
        'POST',
        { current_password: currentPassword, new_password: newPassword }
      );
      setAccount((previous) =>
        previous ? { ...previous, password_changed_at: result.password_changed_at } : previous
      );
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setPasswordUpdated(true);
    } catch (cause) {
      setPasswordError(cause instanceof Error ? cause.message : 'Could not update your password.');
    } finally {
      setPasswordSaving(false);
    }
  };

  const handleTwoFactorVerified = (enabled: boolean) => {
    setTwoFactorEnabled(enabled);
    setTwoFactorModalOpen(false);
    setTwoFactorError(null);
    void settingsRequest<{ totp: MFAFactor[] }>('mfa')
      .then(({ totp }) => {
        const verified = totp.find((factor) => factor.status === 'verified');
        setVerifiedFactorId(verified?.id);
      })
      .catch((cause) => {
        setTwoFactorError(cause instanceof Error ? cause.message : 'Could not refresh 2FA settings.');
      });
  };

  const handleSignOutAll = async () => {
    if (signingOut) return;
    setSigningOut(true);
    setSessionError(null);
    try {
      await settingsRequest('sign-out-others', 'POST');
      setSignedOut(true);
    } catch (cause) {
      setSessionError(cause instanceof Error ? cause.message : 'Could not sign out other sessions.');
    } finally {
      setSigningOut(false);
    }
  };

  const closeDeleteModal = () => {
    if (deleting) return;
    setDeleteConfirmOpen(false);
    setDeleteConfirmation('');
    setDeleteError(null);
  };

  const handleDeleteAccount = async () => {
    if (deleting || deleteConfirmation !== 'DELETE') return;
    setDeleting(true);
    setDeleteError(null);
    try {
      await settingsRequest('account', 'DELETE');
      clearSession();
      router.replace('/signin');
    } catch (cause) {
      setDeleteError(cause instanceof Error ? cause.message : 'Your account could not be deleted.');
      setDeleting(false);
    }
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-hidden bg-[#f0eeff] pt-20 font-['DM_Sans',sans-serif]">
      <SettingsBackground />

      <main className="relative z-10 flex w-full flex-col gap-8 px-6 pb-20 pt-14 md:px-20">
        <div className="flex flex-col gap-2">
          <h1 className="text-[32px] font-extrabold leading-normal text-[#111827]">Settings</h1>
          <p className="text-[15px] font-normal leading-normal text-[#667085]">
            Manage your account preferences and security settings.
          </p>
        </div>

        {loadError && (
          <p role="alert" className="rounded-xl border border-red-200 bg-white/80 px-5 py-4 text-sm font-semibold text-red-700">
            {loadError}
          </p>
        )}

        <SettingsCard
          title="General Information"
          description="Update your display name and account email."
          footer={
            <div className="flex w-full flex-wrap items-center justify-between gap-3">
              {profileError ? (
                <p role="alert" className="text-xs font-semibold text-[#dc2626]">{profileError}</p>
              ) : profileSaved ? (
                <p role="status" className="text-xs font-semibold text-[#10b981]">Profile saved.</p>
              ) : (
                <p className="text-xs text-[#9ca3af]">Changes will be applied immediately.</p>
              )}
              <GradientButton onClick={handleSaveProfile} disabled={loading || profileSaving || !account}>
                {profileSaving ? 'Saving…' : profileSaved ? 'Saved' : 'Save Changes'}
              </GradientButton>
            </div>
          }
        >
          <TextField
            label="Display Name"
            value={displayName}
            onChange={setDisplayName}
            hint="This is how your name appears across the app."
            autoComplete="name"
            disabled={loading || !account}
          />

          <div className="flex flex-col gap-4">
            <TextField
              label="Current Email Address"
              type="email"
              value={account?.email ?? ''}
              disabled
              badge={isOAuthAccount ? 'Google / GitHub' : 'Verified'}
              hint={
                isOAuthAccount
                  ? 'Email changes are managed by your Google or GitHub account.'
                  : 'A verification code is required to change your email.'
              }
            />
            {!isOAuthAccount && (
              <>
                <TextField
                  label="New Email Address"
                  type="email"
                  value={newEmail}
                  onChange={(value) => {
                    setNewEmail(value);
                    setEmailCodeSent(false);
                    setEmailMessage(null);
                  }}
                  autoComplete="email"
                  disabled={loading || emailBusy}
                  placeholder="you@example.com"
                />
                <TextField
                  label="Current Password"
                  type="password"
                  value={emailPassword}
                  onChange={setEmailPassword}
                  autoComplete="current-password"
                  disabled={loading || emailBusy}
                  placeholder="Confirm your password to continue"
                />
                {emailCodeSent && (
                  <TextField
                    label="Email Verification Code"
                    value={emailCode}
                    onChange={(value) => setEmailCode(value.replace(/\D/g, '').slice(0, 6))}
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    disabled={emailBusy}
                    placeholder="Enter the 6-digit code sent to your new email"
                  />
                )}
                <div className="flex flex-wrap items-center gap-3">
                  <GradientButton
                    onClick={emailCodeSent ? handleVerifyEmailCode : handleRequestEmailCode}
                    disabled={loading || emailBusy || !account}
                  >
                    {emailBusy
                      ? 'Please wait…'
                      : emailCodeSent
                        ? 'Verify Email'
                        : 'Send Verification Code'}
                  </GradientButton>
                  {emailMessage && <p role="status" className="text-xs font-semibold text-[#10b981]">{emailMessage}</p>}
                  {emailError && <p role="alert" className="text-xs font-semibold text-[#dc2626]">{emailError}</p>}
                </div>
              </>
            )}
          </div>
        </SettingsCard>

        <SettingsCard
          title="Security Settings"
          description="Manage your password and two-factor authentication."
          footer={
            canUsePassword ? (
              <div className="flex w-full flex-wrap items-center justify-between gap-3">
                {passwordError ? (
                  <p role="alert" className="text-xs font-semibold text-[#dc2626]">{passwordError}</p>
                ) : passwordUpdated ? (
                  <p role="status" className="text-xs font-semibold text-[#10b981]">Password updated. You can change it again in 60 days.</p>
                ) : passwordLocked && passwordAvailableAt ? (
                  <p className="text-xs text-[#9ca3af]">
                    Password changes are available again on {passwordAvailableAt.toLocaleDateString()}.
                  </p>
                ) : (
                  <p className="text-xs text-[#9ca3af]">Use a strong, unique password you don&apos;t use elsewhere.</p>
                )}
                <GradientButton onClick={handleUpdatePassword} disabled={passwordSaving || loading || passwordLocked}>
                  {passwordSaving ? 'Updating…' : 'Update Password'}
                </GradientButton>
              </div>
            ) : (
              <p className="text-xs text-[#9ca3af]">
                {isOAuthAccount
                  ? 'Your password is managed by your Google or GitHub account.'
                  : 'Password settings are unavailable until your account has loaded.'}
              </p>
            )
          }
        >
          <div className="flex flex-col gap-1">
            <h3 className="text-sm font-bold text-[#111827]">Change Password</h3>
            <p className="text-xs text-[#667085]">
              Verify your current password before choosing a new one.
            </p>
          </div>

          {canUsePassword && (
            <>
              <TextField
                label="Current Password"
                type="password"
                value={currentPassword}
                onChange={setCurrentPassword}
                placeholder="Enter current password"
                autoComplete="current-password"
                disabled={passwordLocked || passwordSaving}
              />
              <TextField
                label="New Password"
                type="password"
                value={newPassword}
                onChange={setNewPassword}
                placeholder="At least 8 characters"
                autoComplete="new-password"
                disabled={passwordLocked || passwordSaving}
              />
              <TextField
                label="Confirm New Password"
                type="password"
                value={confirmPassword}
                onChange={setConfirmPassword}
                placeholder="Re-enter new password"
                autoComplete="new-password"
                disabled={passwordLocked || passwordSaving}
              />
            </>
          )}
          {account && !canUsePassword && (
            <p className="text-sm text-[#667085]">
              Your password is managed by your Google or GitHub account.
            </p>
          )}

          <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-[#ddd6fe] bg-[#f5f3ff] px-6 py-5">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <Shield className="size-4 text-[#7c3aed]" />
                <p className="text-sm font-bold text-[#111827]">Two-Factor Authentication</p>
              </div>
              <p className={`text-xs ${twoFactorEnabled ? 'text-[#10b981]' : 'text-[#9ca3af]'}`}>
                {twoFactorEnabled ? 'Currently enabled' : loading ? 'Loading status…' : 'Currently disabled'}
              </p>
              {twoFactorError && <p role="alert" className="text-xs text-[#dc2626]">{twoFactorError}</p>}
            </div>
            {twoFactorEnabled ? (
              <SecondaryButton
                onClick={() => {
                  setTwoFactorMode('disable');
                  setTwoFactorModalOpen(true);
                }}
                disabled={!verifiedFactorId}
                className="rounded-lg px-5 py-[9px]"
              >
                Disable 2FA
              </SecondaryButton>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setTwoFactorMode('enable');
                  setTwoFactorModalOpen(true);
                }}
                disabled={loading}
                className={`rounded-lg bg-[#7c3aed] px-5 py-[9px] text-[13px] font-bold text-white shadow-[0px_4px_5px_0px_rgba(124,58,237,0.2)] transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50 ${FOCUS_RING}`}
              >
                Enable 2FA
              </button>
            )}
          </div>
        </SettingsCard>

        <section className="flex w-full flex-wrap items-center justify-between gap-4 rounded-[20px] border border-white bg-white/80 px-8 py-6 shadow-[0px_8px_32px_0px_rgba(31,41,55,0.08)]">
          <div className="flex flex-col gap-1">
            <h2 className="text-base font-extrabold text-[#111827]">Active Sessions</h2>
            <p className="text-[13px] text-[#667085]">Sign out of all other devices and browsers.</p>
            {sessionError && <p role="alert" className="text-xs font-semibold text-[#dc2626]">{sessionError}</p>}
          </div>
          <button
            type="button"
            onClick={handleSignOutAll}
            disabled={signingOut || loading}
            className={`inline-flex items-center gap-2 rounded-[10px] border border-[#e5e7eb] bg-[#f3f4f6] px-5 py-2.5 text-[13px] font-bold text-[#374151] transition-colors hover:bg-[#e5e7eb] disabled:cursor-not-allowed disabled:opacity-50 ${FOCUS_RING}`}
          >
            <LogOut className="size-[15px]" />
            {signedOut ? 'Other sessions signed out' : signingOut ? 'Signing out…' : 'Sign Out All'}
          </button>
        </section>

        <section className="flex w-full flex-wrap items-center justify-between gap-4 rounded-[20px] border border-[#fecaca] bg-[#fff5f5] px-8 py-6 shadow-[0px_4px_8px_0px_rgba(239,68,68,0.08)]">
          <div className="flex flex-col gap-1">
            <h2 className="text-base font-extrabold text-[#ef4444]">Delete Account</h2>
            <p className="text-[13px] text-[#6b7280]">
              Permanently remove your account and all data. This cannot be undone.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setDeleteConfirmOpen(true)}
            disabled={loading || !account}
            className={`inline-flex items-center gap-2 rounded-[10px] bg-[#ef4444] px-5 py-2.5 text-[13px] font-bold text-white shadow-[0px_4px_5px_0px_rgba(239,68,68,0.19)] transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50 ${FOCUS_RING}`}
          >
            <Trash2 className="size-[15px]" />
            Delete account
          </button>
        </section>
      </main>

      <TwoFactorModal
        open={twoFactorModalOpen}
        mode={twoFactorMode}
        factorId={verifiedFactorId}
        onClose={() => setTwoFactorModalOpen(false)}
        onVerified={handleTwoFactorVerified}
      />

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
          </button>
        </div>
        <p className="mb-4 text-sm text-[#667085]">
          This permanently removes your profile and analysis history. Type DELETE to confirm.
        </p>
        <TextField
          label="Confirmation"
          value={deleteConfirmation}
          onChange={setDeleteConfirmation}
          data-autofocus=""
          autoComplete="off"
          disabled={deleting}
          placeholder="Type DELETE"
        />
        {deleteError && <p role="alert" className="mt-4 text-xs font-semibold text-[#dc2626]">{deleteError}</p>}
        <div className="mt-10 flex justify-end gap-3">
          <SecondaryButton onClick={closeDeleteModal} disabled={deleting}>Cancel</SecondaryButton>
          <button
            type="button"
            onClick={handleDeleteAccount}
            disabled={deleting || deleteConfirmation !== 'DELETE'}
            className={`rounded-[10px] bg-[#ef4444] px-4 py-2.5 text-[13px] font-bold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50 ${FOCUS_RING}`}
          >
            {deleting ? 'Deleting…' : 'Delete account'}
          </button>
        </div>
      </Modal>
    </div>
  );
}
