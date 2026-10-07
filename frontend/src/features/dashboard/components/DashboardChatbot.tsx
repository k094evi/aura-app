'use client';

import { useEffect, useSyncExternalStore } from 'react';
import Script from 'next/script';
import {
  AUTH_CHANGE_EVENT,
  getAccessToken,
  setJotformAgentVisible,
} from '@/lib/auth';

interface AgentIdentity {
  metadata: Record<string, string>;
  userID: string;
  userHash: string;
}

function subscribeToAuthChanges(onChange: () => void) {
  if (typeof window === 'undefined') return () => {};

  const handleStorage = (event: StorageEvent) => {
    if (event.key === 'aura_access_token' || event.key === null) onChange();
  };
  const handleAuthChange = () => onChange();
  window.addEventListener('storage', handleStorage);
  window.addEventListener(AUTH_CHANGE_EVENT, handleAuthChange);
  return () => {
    window.removeEventListener('storage', handleStorage);
    window.removeEventListener(AUTH_CHANGE_EVENT, handleAuthChange);
  };
}

function getAuthSnapshot() {
  return !!getAccessToken();
}

function getServerAuthSnapshot() {
  return false;
}

export default function DashboardChatbot() {
  const isAuthenticated = useSyncExternalStore(
    subscribeToAuthChanges,
    getAuthSnapshot,
    getServerAuthSnapshot
  );

  useEffect(() => {
    setJotformAgentVisible(isAuthenticated);
  }, [isAuthenticated]);

  useEffect(() => {
    let cancelled = false;
    const accessToken = getAccessToken();

    if (!isAuthenticated || !accessToken) return;

    const identifyUser = async () => {
      try {
        const response = await fetch('/api/auth/jotform-agent-user', {
          headers: { Authorization: `Bearer ${accessToken}` },
          cache: 'no-store',
        });

        if (response.ok) {
          const identity: AgentIdentity = await response.json();
          if (!cancelled && getAccessToken() === accessToken) {
            window._jfAgentIdentifiedUser = identity;
          }
        } else if (response.status !== 401) {
          const error = await response.json().catch(() => null);
          console.error(
            '[DashboardChatbot] Could not identify the authenticated user:',
            error?.detail ?? response.statusText
          );
        }
      } catch (error) {
        console.error('[DashboardChatbot] Could not load the personalized chat identity:', error);
      }
    };

    void identifyUser();
    return () => {
      cancelled = true;
    };
  }, [isAuthenticated]);

  if (!isAuthenticated) return null;

  return (
    <Script
      src="https://cdn.jotfor.ms/agent/embedjs/01a108ada8687000814d4e82b99ffcaab47d/embed.js"
      strategy="afterInteractive"
      onError={() => console.error('[DashboardChatbot] Failed to load the Jotform agent embed.')}
    />
  );
}
