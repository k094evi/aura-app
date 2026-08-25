"""
app/extensions/supabase_client.py
──────────────────────────────────
Supabase clients, built from app.config.settings — never hardcoded here.

Two clients on purpose:
  - `supabase`       → publishable key, respects RLS. Use for anything
                        done on behalf of the current user (auth flows,
                        reads/writes that should be scoped to them).
  - `supabase_admin` → secret key, BYPASSES RLS. Only import this where
                        you deliberately need privileged server-side
                        access. Do not use it for routine auth calls.
"""

import logging

from supabase import create_client, Client

from app.config import settings

logger = logging.getLogger(__name__)

supabase: Client = create_client(settings.SUPABASE_URL, settings.SUPABASE_PUBLISHABLE_KEY)
supabase_admin: Client = create_client(settings.SUPABASE_URL, settings.SUPABASE_SECRET_KEY)

logger.info("Supabase clients initialized for %s", settings.SUPABASE_URL)