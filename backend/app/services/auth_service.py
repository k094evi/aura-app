# app/services/auth_service.py
"""
Wraps Supabase Auth calls with normalized error handling.

Supabase errors are translated into ValueError with a user-facing
message — matching the pattern already used in resume_parser.py,
where the API layer catches ValueError and returns it as a 400 detail.
"""

import logging
from typing import Optional

from app.extensions.supabase_client import supabase
from app.models.auth_schemas import AuthResponse, AuthUser

logger = logging.getLogger(__name__)


def _extract_user(user_obj, full_name: Optional[str] = None) -> AuthUser:
    metadata = getattr(user_obj, "user_metadata", None) or {}
    return AuthUser(
        id=user_obj.id,
        email=user_obj.email,
        full_name=full_name or metadata.get("full_name"),
    )


def _friendly_auth_error(exc: Exception) -> str:
    """
    Supabase's error messages are already fairly readable
    (e.g. "User already registered", "Invalid login credentials"),
    so we mostly pass them through as-is.
    """
    msg = str(exc).strip()
    return msg or "Something went wrong. Please try again."


def sign_up(email: str, password: str, full_name: Optional[str] = None) -> AuthResponse:
    try:
        result = supabase.auth.sign_up({
            "email": email,
            "password": password,
            "options": {"data": {"full_name": full_name}} if full_name else {},
        })
    except Exception as exc:
        logger.warning("Supabase sign_up failed for %s: %s", email, exc)
        raise ValueError(_friendly_auth_error(exc)) from exc

    if not result.user:
        raise ValueError("Could not create account. Please try again.")

    # Supabase returns no session when email confirmation is required
    # (this is the default for new Supabase projects).
    if not result.session:
        return AuthResponse(
            user=_extract_user(result.user, full_name),
            access_token="",
            refresh_token=None,
            email_confirmation_required=True,
        )

    return AuthResponse(
        user=_extract_user(result.user, full_name),
        access_token=result.session.access_token,
        refresh_token=result.session.refresh_token,
        email_confirmation_required=False,
    )


def sign_in(email: str, password: str) -> AuthResponse:
    try:
        result = supabase.auth.sign_in_with_password({
            "email": email,
            "password": password,
        })
    except Exception as exc:
        logger.warning("Supabase sign_in failed for %s: %s", email, exc)
        raise ValueError(_friendly_auth_error(exc)) from exc

    if not result.user or not result.session:
        raise ValueError("Invalid email or password.")

    return AuthResponse(
        user=_extract_user(result.user),
        access_token=result.session.access_token,
        refresh_token=result.session.refresh_token,
        email_confirmation_required=False,
    )


def request_password_reset(email: str, redirect_to: str) -> None:
    """
    Sends the reset email. Deliberately swallows/logs errors rather than
    raising — the API layer always reports success either way, so we
    don't leak whether a given email has an account (account enumeration).
    """
    try:
        supabase.auth.reset_password_email(email, {"redirect_to": redirect_to})
    except Exception as exc:
        logger.warning("Password reset request failed for %s: %s", email, exc)


def reset_password(access_token: str, refresh_token: str, new_password: str) -> None:
    try:
        supabase.auth.set_session(access_token, refresh_token)
        supabase.auth.update_user({"password": new_password})
    except Exception as exc:
        logger.warning("Password reset (update) failed: %s", exc)
        raise ValueError(
            "This reset link is invalid or has expired. Please request a new one."
        ) from exc