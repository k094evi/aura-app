'use client';

import { useEffect } from 'react';
import Script from 'next/script';
import { getAccessToken } from '@/lib/auth';

interface AgentIdentity {
  metadata: Record<string, string>;
  userID: string;
  userHash: string;
}

export default function DashboardChatbot() {
  useEffect(() => {
    let cancelled = false;
    const accessToken = getAccessToken();

    if (!accessToken) return;

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
  }, []);

  return (
    <Script
      src="https://cdn.jotfor.ms/agent/embedjs/01a108ada8687000814d4e82b99ffcaab47d/embed.js"
      strategy="afterInteractive"
      onError={() => console.error('[DashboardChatbot] Failed to load the Jotform agent embed.')}
    />
  );
}
