# FILE LOCATION: app/config.py
"""
PURPOSE
-------
All environment-driven configuration for the backend.
Values are read from .env at startup.

This is the single source of truth for any value that should differ
between environments (local dev, staging, production) — API keys,
secrets, URLs, feature limits — instead of those values being
hardcoded/scattered across the codebase.

HOW IT FITS INTO THE PROGRAM
-----------------------------
- Built on `pydantic_settings.BaseSettings`, which automatically reads
  matching environment variables (and values from a `.env` file) into
  typed fields, and validates them at import time.
- `app/main.py` calls `load_dotenv()` before importing this module,
  which is what actually loads the `.env` file into the process
  environment for `Settings()` below to read from.
- Nearly every other module in the app imports the single `settings`
  instance created at the bottom of this file rather than constructing
  their own `Settings()`, e.g.:
    - `app/utils/file_handler.py` reads `settings.MAX_UPLOAD_MB` and
      `settings.ALLOWED_EXTENSIONS`.
    - `app/main.py` reads `settings.ALLOWED_ORIGINS` for CORS.
  This ensures the whole app shares one consistent, validated config
  object instead of each module re-reading environment variables
  independently.

FAIL-LOUD DESIGN CHOICE
--------------------------
Fields with no default (like `SUPABASE_URL`, `SUPABASE_PUBLISHABLE_KEY`,
`SUPABASE_SECRET_KEY`) are REQUIRED. If they're missing from `.env`,
`Settings()` raises a validation error immediately at import time
(i.e. the app won't even start), rather than silently running with a
missing/hardcoded/leaked key and failing unpredictably later. This is
intentional — see the inline comment above the Supabase section.
"""

from pydantic_settings import BaseSettings
from typing import List


class Settings(BaseSettings):
    # ── App ───────────────────────────────────────────────────────────────
    APP_NAME: str = "Aura Resume Analyzer"
    DEBUG: bool = False

    # ── CORS ──────────────────────────────────────────────────────────────
    # Origins allowed to call this API from a browser. Used by the
    # CORSMiddleware set up in app/main.py.
    ALLOWED_ORIGINS: List[str] = [
        "http://localhost:3000",
        "https://aura-resume.vercel.app",
    ]

    # ── Supabase (PostgreSQL) ─────────────────────────────────────────────
    # No defaults on purpose: if these aren't in .env, Settings() raises a
    # validation error at import time instead of silently running with a
    # hardcoded/leaked key. Fail loud at startup, not quietly in prod.
    #
    # PUBLISHABLE_KEY = old "anon" key. Respects RLS. Use for normal auth
    #   calls (sign up/in, password reset) — this is what auth_service.py uses.
    # SECRET_KEY = old "service_role" key. BYPASSES RLS. Only for privileged
    #   server-side writes later on. Never wire this into routine auth calls.
    SUPABASE_URL: str
    SUPABASE_PUBLISHABLE_KEY: str
    SUPABASE_SECRET_KEY: str
    SUPABASE_JWKS_URL: str = ""     # used later to verify JWTs on protected routes
    DATABASE_URL: str = ""          # postgres://user:pass@host/db

    # ── JWT ───────────────────────────────────────────────────────────────
    # Used for signing/verifying the app's own JWTs (separate from
    # Supabase's own auth tokens, which are verified via SUPABASE_JWKS_URL).
    # NOTE: JWT_SECRET has a placeholder default ("change-me-in-production")
    # rather than being required like the Supabase keys above — worth
    # setting a real value via .env in any deployed environment, since an
    # unchanged default here would let anyone forge tokens.
    JWT_SECRET: str = "change-me-in-production"
    JWT_ALGORITHM: str = "HS256"
    JWT_EXPIRE_MINUTES: int = 60 * 24   # 24 hours

    # ── Adzuna ────────────────────────────────────────────────────────────
    # Credentials/config for the Adzuna job-search API (used to fetch job
    # listings that job_scorer.py later scores against the resume).
    ADZUNA_APP_ID: str = ""
    ADZUNA_API_KEY: str = ""
    ADZUNA_COUNTRY: str = "phsd"
    ADZUNA_BASE_URL: str = "https://api.adzuna.com/v1/api"

    # ── File upload ───────────────────────────────────────────────────────
    # Consumed directly by app/utils/file_handler.py's validate_file()
    # to reject oversized or disallowed file types before parsing.
    MAX_UPLOAD_MB: int = 10
    ALLOWED_EXTENSIONS: List[str] = [".pdf", ".docx", ".doc"]

    class Config:
        # Tells pydantic-settings to also read values from a local
        # ".env" file (in addition to real environment variables).
        env_file = ".env"
        # Ignore any extra/unrecognized keys found in .env instead of
        # raising an error for them — lets .env carry unrelated values
        # (e.g. for other tools) without breaking this app.
        extra = "ignore"


# Single shared settings instance, imported everywhere else in the app
# (e.g. `from app.config import settings`) instead of each module
# constructing its own Settings().
settings = Settings()