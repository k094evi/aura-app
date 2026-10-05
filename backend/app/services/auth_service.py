# app/services/auth_service.py
"""
Wraps Supabase Auth calls with normalized error handling.

Supabase errors are translated into ValueError with a user-facing
message — matching the pattern already used in resume_parser.py,
where the API layer catches ValueError and returns it as a 400 detail.
"""

import logging
from datetime import datetime, timedelta, timezone
from typing import Optional

from supabase import create_client

from app.config import settings
from app.extensions.supabase_client import supabase, supabase_admin
from app.models.auth_schemas import AuthResponse, AuthUser

logger = logging.getLogger(__name__)


def _extract_user(user_obj, full_name: Optional[str] = None) -> AuthUser:
    metadata = getattr(user_obj, "user_metadata", None) or {}
    app_metadata = getattr(user_obj, "app_metadata", None) or {}
    providers = app_metadata.get("providers") or [app_metadata.get("provider")]
    return AuthUser(
        id=user_obj.id,
        email=user_obj.email,
        full_name=full_name or metadata.get("full_name"),
        providers=sorted({provider for provider in providers if provider}),
        password_changed_at=app_metadata.get("password_changed_at"),
        mfa_enabled=bool(app_metadata.get("mfa_enabled", False)),
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

    user = _extract_user(result.user)
    return AuthResponse(
        user=user,
        access_token=result.session.access_token,
        refresh_token=result.session.refresh_token,
        email_confirmation_required=False,
        # Password login only yields an aal1 session. If 2FA is on, the
        # caller must finish /auth/mfa/challenge to get an aal2 session.
        mfa_required=user.mfa_enabled,
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
        
_INVALID_CODE = "Invalid or expired code. Please try again."


def verify_signup_otp(email: str, token: str) -> AuthResponse:
    try:
        result = supabase.auth.verify_otp({"email": email, "token": token, "type": "signup"})
    except Exception as exc:
        logger.warning("Signup OTP verify failed for %s: %s", email, exc)
        raise ValueError(_INVALID_CODE) from exc

    if not result.user or not result.session:
        raise ValueError(_INVALID_CODE)

    return AuthResponse(
        user=_extract_user(result.user),
        access_token=result.session.access_token,
        refresh_token=result.session.refresh_token,
        email_confirmation_required=False,
    )


def resend_signup_otp(email: str) -> None:
    try:
        supabase.auth.resend({"type": "signup", "email": email})
    except Exception as exc:
        logger.warning("Signup OTP resend failed for %s: %s", email, exc)
        raise ValueError("Could not resend the code. Please try again shortly.") from exc


def verify_reset_otp(email: str, token: str) -> tuple[str, str]:
    try:
        result = supabase.auth.verify_otp({"email": email, "token": token, "type": "recovery"})
    except Exception as exc:
        logger.warning("Recovery OTP verify failed for %s: %s", email, exc)
        raise ValueError(_INVALID_CODE) from exc

    if not result.session:
        raise ValueError(_INVALID_CODE)

    return result.session.access_token, result.session.refresh_token


def _user_client(access_token: str, refresh_token: str):
    client = create_client(settings.SUPABASE_URL, settings.SUPABASE_PUBLISHABLE_KEY)
    try:
        client.auth.set_session(access_token, refresh_token)
    except Exception as exc:
        logger.warning("Could not initialize authenticated Supabase client: %s", exc)
        raise ValueError("Your session has expired. Please sign in again.") from exc
    return client


def _require_email_account(user: AuthUser) -> None:
    if "email" not in user.providers:
        raise ValueError("This action is unavailable for accounts signed in with Google or GitHub.")


def update_profile(user_id: str, full_name: str) -> AuthUser:
    name = full_name.strip()
    if not name:
        raise ValueError("Display name cannot be blank.")

    try:
        result = supabase_admin.auth.admin.update_user_by_id(
            user_id,
            {"user_metadata": {"full_name": name}},
        )
    except Exception as exc:
        logger.warning("Profile update failed for user %s: %s", user_id, exc)
        raise ValueError("Could not save your profile. Please try again.") from exc

    return _extract_user(result.user, name)


def request_email_change(
    user: AuthUser,
    new_email: str,
    current_password: str,
) -> None:
    _require_email_account(user)
    if not user.email:
        raise ValueError("Your account does not have an email address to verify.")
    if new_email.strip().lower() == user.email.lower():
        raise ValueError("Enter a different email address.")

    client = create_client(settings.SUPABASE_URL, settings.SUPABASE_PUBLISHABLE_KEY)
    try:
        auth = client.auth.sign_in_with_password(
            {"email": user.email, "password": current_password}
        )
        if not auth.user or auth.user.id != user.id:
            raise ValueError("The current password is incorrect.")
        client.auth.update_user({"email": new_email})
    except ValueError:
        raise
    except Exception as exc:
        logger.warning("Email change request failed for user %s: %s", user.id, exc)
        raise ValueError(_friendly_auth_error(exc)) from exc


def verify_email_change(
    user: AuthUser,
    access_token: str,
    refresh_token: str,
    email: str,
    token: str,
) -> dict:
    _require_email_account(user)
    client = _user_client(access_token, refresh_token)
    try:
        result = client.auth.verify_otp(
            {"email": email, "token": token, "type": "email_change"}
        )
    except Exception as exc:
        logger.warning("Email change OTP verify failed for user %s: %s", user.id, exc)
        raise ValueError(_INVALID_CODE) from exc

    if not result.user or result.user.id != user.id or not result.session:
        raise ValueError(_INVALID_CODE)

    return {
        "message": "Your email address has been updated.",
        "access_token": result.session.access_token,
        "refresh_token": result.session.refresh_token,
        "user": _extract_user(result.user),
    }


def _password_available_at(password_changed_at: str | None) -> datetime | None:
    if not password_changed_at:
        return None
    try:
        changed_at = datetime.fromisoformat(password_changed_at.replace("Z", "+00:00"))
    except ValueError as exc:
        logger.warning("Ignoring invalid password_changed_at timestamp: %s", password_changed_at)
        raise ValueError("Could not verify password-change eligibility. Please contact support.") from exc
    if changed_at.tzinfo is None:
        changed_at = changed_at.replace(tzinfo=timezone.utc)
    return changed_at + timedelta(days=60)


def change_password(
    user: AuthUser,
    current_password: str,
    new_password: str,
) -> dict:
    now = datetime.now(timezone.utc)
    available_at = _password_available_at(user.password_changed_at)
    if available_at and now < available_at:
        raise ValueError(
            f"You can change your password again on {available_at.strftime('%B %d, %Y')}."
        )
    if current_password == new_password:
        raise ValueError("Choose a new password that differs from your current password.")
    if not user.email:
        raise ValueError("Your account does not have an email address for password verification.")

    client = create_client(settings.SUPABASE_URL, settings.SUPABASE_PUBLISHABLE_KEY)
    try:
        auth = client.auth.sign_in_with_password(
            {"email": user.email, "password": current_password}
        )
        if not auth.user or auth.user.id != user.id or not auth.session:
            raise ValueError("The current password is incorrect.")

        client.auth.update_user({"password": new_password})
        changed_at = datetime.now(timezone.utc).isoformat()
        admin_user = supabase_admin.auth.admin.get_user_by_id(user.id).user
        app_metadata = dict(getattr(admin_user, "app_metadata", None) or {})
        app_metadata["password_changed_at"] = changed_at
        supabase_admin.auth.admin.update_user_by_id(
            user.id,
            {"app_metadata": app_metadata},
        )
    except ValueError:
        raise
    except Exception as exc:
        logger.warning("Password update failed for user %s: %s", user.id, exc)
        raise ValueError(_friendly_auth_error(exc)) from exc

    return {
        "message": "Your password has been updated.",
        "password_changed_at": changed_at,
        "password_available_at": (
            datetime.fromisoformat(changed_at) + timedelta(days=60)
        ).isoformat(),
    }


def delete_account(user_id: str) -> None:
    try:
        supabase_admin.auth.admin.delete_user(user_id)
    except Exception as exc:
        logger.exception("Account deletion failed for user %s", user_id)
        raise ValueError("Could not delete your account. Please try again.") from exc


def _set_mfa_enabled(user_id: str, enabled: bool) -> None:
    admin_user = supabase_admin.auth.admin.get_user_by_id(user_id).user
    app_metadata = dict(getattr(admin_user, "app_metadata", None) or {})
    app_metadata["mfa_enabled"] = enabled
    supabase_admin.auth.admin.update_user_by_id(
        user_id,
        {"app_metadata": app_metadata},
    )


def list_mfa_factors(access_token: str, refresh_token: str) -> list[dict]:
    client = _user_client(access_token, refresh_token)
    try:
        factors = client.auth.mfa.list_factors()
    except Exception as exc:
        logger.warning("Could not list MFA factors: %s", exc)
        raise ValueError("Could not load two-factor authentication settings.") from exc
    return [
        {
            "id": factor.id,
            "friendly_name": factor.friendly_name,
            "status": factor.status,
        }
        for factor in factors.totp
    ]


def enroll_mfa(access_token: str, refresh_token: str) -> dict:
    client = _user_client(access_token, refresh_token)
    try:
        factors = client.auth.mfa.list_factors()
        for factor in factors.totp:
            if factor.status != "verified":
                client.auth.mfa.unenroll({"factor_id": factor.id})
        factor = client.auth.mfa.enroll(
            {"factor_type": "totp", "friendly_name": "Aura authenticator"}
        )
    except Exception as exc:
        logger.warning("Could not enroll MFA factor: %s", exc)
        raise ValueError("Could not start two-factor setup. Please try again.") from exc

    if not factor.totp:
        raise ValueError("Could not create an authenticator setup code.")
    return {
        "factor_id": factor.id,
        "qr_code": factor.totp.qr_code,
        "secret": factor.totp.secret,
        "uri": factor.totp.uri,
    }


def verify_mfa(
    user_id: str,
    access_token: str,
    refresh_token: str,
    factor_id: str,
    code: str,
    action: str,
) -> dict:
    client = _user_client(access_token, refresh_token)
    try:
        result = client.auth.mfa.challenge_and_verify(
            {"factor_id": factor_id, "code": code}
        )
        if action == "disable":
            elevated_client = _user_client(result.access_token, result.refresh_token)
            elevated_client.auth.mfa.unenroll({"factor_id": factor_id})
            _set_mfa_enabled(user_id, False)
        elif action == "enable":
            _set_mfa_enabled(user_id, True)
    except Exception as exc:
        logger.warning("MFA %s verification failed: %s", action, exc)
        raise ValueError("That code is invalid or expired. Please try again.") from exc

    return {
        "message": (
            "Two-factor authentication enabled."
            if action == "enable"
            else "Two-factor authentication disabled."
            if action == "disable"
            else "Two-factor authentication verified."
        ),
        "access_token": result.access_token,
        "refresh_token": result.refresh_token,
    }


_INVALID_MFA_CODE = "That code is invalid or expired. Please try again."


def challenge_mfa(access_token: str, refresh_token: str, code: str) -> dict:
    """
    Second step of sign-in for accounts with 2FA enabled.

    The caller already holds an aal1 session from the password step. We look
    up their verified TOTP factor server-side (the client never needs to know
    or send a factor id), verify the code, and return the upgraded aal2
    tokens that get_current_user accepts.
    """
    client = _user_client(access_token, refresh_token)
    try:
        factors = client.auth.mfa.list_factors()
        factor = next((f for f in factors.totp if f.status == "verified"), None)
    except Exception as exc:
        logger.warning("Could not list MFA factors for challenge: %s", exc)
        raise ValueError("Could not load two-factor authentication. Please try again.") from exc

    if factor is None:
        raise ValueError("Two-factor authentication is not set up on this account.")

    try:
        result = client.auth.mfa.challenge_and_verify(
            {"factor_id": factor.id, "code": code}
        )
    except Exception as exc:
        logger.warning("MFA challenge failed: %s", exc)
        raise ValueError(_INVALID_MFA_CODE) from exc

    if not result or not result.access_token:
        raise ValueError(_INVALID_MFA_CODE)

    return {
        "message": "Two-factor authentication verified.",
        "access_token": result.access_token,
        "refresh_token": result.refresh_token,
        "user": _extract_user(result.user) if getattr(result, "user", None) else None,
    }


def sign_out_other_sessions(access_token: str, refresh_token: str) -> None:
    client = _user_client(access_token, refresh_token)
    try:
        client.auth.sign_out({"scope": "others"})
    except Exception as exc:
        logger.warning("Could not sign out other sessions: %s", exc)
        raise ValueError("Could not sign out other sessions. Please try again.") from exc