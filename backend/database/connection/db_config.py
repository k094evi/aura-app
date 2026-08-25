"""
database/connection/db_config.py
──────────────────────────────────
Supabase client setup.
Used by controllers that need to read/write to the database.
"""

from supabase import create_client, Client
from app.config import settings
from app.utils.logger import logger

_client: Client | None = None


def get_supabase() -> Client:
    """Returns the singleton Supabase client, initialising it on first call."""
    global _client
    if _client is None:
        if not settings.SUPABASE_URL or not settings.SUPABASE_KEY:
            logger.warning(
                "SUPABASE_URL or SUPABASE_KEY not set — "
                "database operations will fail."
            )
        _client = create_client(settings.SUPABASE_URL, settings.SUPABASE_KEY)
        logger.info("Supabase client initialised.")
    return _client