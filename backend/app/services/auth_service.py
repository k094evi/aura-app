# app/services/auth_service.py
"""
Wraps Supabase Auth calls with normalized error handling.

Supabase errors are translated into ValueError with a user-facing
message — matching the pattern already used in resume_parser.py,
where the API layer catches ValueError and returns it as a 400 detail.
"""

import logging
import re
from datetime import datetime, timedelta, timezone
from typing import Optional

from supabase import create_client

from app.config import settings
from app.extensions.supabase_client import supabase_admin
from app.models.auth_schemas import AuthResponse, AuthUser

logger = logging.getLogger(__name__)


def _anon_client():
    """
    A brand-new publishable-key client for every call.

    The old shared `supabase` singleton stores whichever session was set last
    (sign-in, OTP verify, reset-password), so one user's session could bleed
    into the next request. A fresh client per call keeps sessions isolated.
    """
    return create_client(settings.SUPABASE_URL, settings.SUPABASE_PUBLISHABLE_KEY)


def _has_verified_factor(user_obj) -> bool:
    """True if Supabase reports at least one verified MFA factor on the user.

    This is the source of truth for "is 2FA on". The app_metadata flag is only
    a cache of it, so a failed flag write can never leave 2FA un-enforced.
    """
    for factor in getattr(user_obj, "factors", None) or []:
        if getattr(factor, "status", None) == "verified":
            return True
    return False


# ---- Display name rules (same as the sign-up form) -------------------------
NAME_MAX_LENGTH = 20
_LATIN = "A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u024F"
_NAME_WORD = f"[{_LATIN}][\u0300-\u036F]*"
_NAME_RE = re.compile(f"^(?:{_NAME_WORD})+(?:[ '\u2019-](?:{_NAME_WORD})+)*$")


def _clean_name_parts(first: Optional[str], middle: Optional[str], last: Optional[str]) -> dict:
    """Validates first/middle/last name. First and last are required; middle is optional."""
    cleaned = {}
    for key, value, required in (("first", first, True), ("middle", middle, False), ("last", last, True)):
        text = (value or "").strip()
        if not text:
            if required:
                raise ValueError(f"{key.capitalize()} name is required.")
            cleaned[key] = ""
            continue
        if len(text) > NAME_MAX_LENGTH or not _NAME_RE.match(text):
            raise ValueError(
                f"{key.capitalize()} name may only contain letters, spaces, hyphens and "
                f"apostrophes (up to {NAME_MAX_LENGTH} characters)."
            )
        cleaned[key] = text
    return cleaned


def _full_name_from_parts(parts: dict) -> str:
    return " ".join(p for p in (parts["first"], parts["middle"], parts["last"]) if p)


def _split_full_name(full_name: Optional[str]) -> dict:
    """Best guess for accounts that never stored separate name parts (e.g. Google sign-ups)."""
    tokens = (full_name or "").split()
    if not tokens:
        return {"first": "", "middle": "", "last": ""}
    if len(tokens) == 1:
        return {"first": tokens[0], "middle": "", "last": ""}
    return {"first": " ".join(tokens[:-1]), "middle": "", "last": tokens[-1]}


def _store_display_name(user_id: str, full_name: str, parts: Optional[dict]) -> None:
    """
    Saves the chosen name in app_metadata. Google/GitHub overwrite user_metadata's
    name every time they sign in, but never touch app_metadata, so this is the
    copy that sticks. Best effort: a failure here must not break sign-up.
    """
    try:
        admin_user = supabase_admin.auth.admin.get_user_by_id(user_id).user
        app_metadata = dict(getattr(admin_user, "app_metadata", None) or {})
        app_metadata["display_name"] = full_name
        if parts is not None:
            app_metadata["name_parts"] = parts
        supabase_admin.auth.admin.update_user_by_id(
            user_id,
            {"app_metadata": app_metadata, "user_metadata": {"full_name": full_name}},
        )
    except Exception as exc:
        logger.warning("Could not store display name for user %s: %s", user_id, exc)


def get_name_parts(user_id: str, full_name: Optional[str]) -> dict:
    """First/middle/last for the Settings form (stored parts, else a best-guess split)."""
    try:
        admin_user = supabase_admin.auth.admin.get_user_by_id(user_id).user
        stored = (getattr(admin_user, "app_metadata", None) or {}).get("name_parts")
        if isinstance(stored, dict) and (stored.get("first") or stored.get("last")):
            return {
                "first": stored.get("first", "") or "",
                "middle": stored.get("middle", "") or "",
                "last": stored.get("last", "") or "",
            }
    except Exception as exc:
        logger.warning("Could not read name parts for user %s: %s", user_id, exc)
    return _split_full_name(full_name)


def _extract_user(user_obj, full_name: Optional[str] = None) -> AuthUser:
    metadata = getattr(user_obj, "user_metadata", None) or {}
    app_metadata = getattr(user_obj, "app_metadata", None) or {}
    providers = app_metadata.get("providers") or [app_metadata.get("provider")]
    return AuthUser(
        id=user_obj.id,
        email=user_obj.email,
        full_name=(
            app_metadata.get("display_name")
            or full_name
            or metadata.get("full_name")
            or metadata.get("name")
            or metadata.get("user_name")
        ),
        providers=sorted(
            {provider for provider in providers if provider}
            | ({"email"} if app_metadata.get("has_password") else set())
        ),
        password_changed_at=app_metadata.get("password_changed_at"),
        mfa_enabled=bool(app_metadata.get("mfa_enabled", False))
        or _has_verified_factor(user_obj),
    )


def _friendly_auth_error(exc: Exception) -> str:
    """
    Supabase's error messages are already fairly readable
    (e.g. "User already registered", "Invalid login credentials"),
    so we mostly pass them through as-is.
    """
    msg = str(exc).strip()
    return msg or "Something went wrong. Please try again."


def sign_up(
    email: str,
    password: str,
    full_name: Optional[str] = None,
    name_parts: Optional[dict] = None,
) -> AuthResponse:
    parts = None
    if name_parts is not None:
        parts = _clean_name_parts(
            name_parts.get("first"), name_parts.get("middle"), name_parts.get("last")
        )
        full_name = _full_name_from_parts(parts)

    try:
        result = _anon_client().auth.sign_up({
            "email": email,
            "password": password,
            "options": {"data": {"full_name": full_name}} if full_name else {},
        })
    except Exception as exc:
        logger.warning("Supabase sign_up failed for %s: %s", email, exc)
        raise ValueError(_friendly_auth_error(exc)) from exc

    if not result.user:
        raise ValueError("Could not create account. Please try again.")

    # Supabase hides "email already registered" by returning a user with no
    # identities instead of an error. Surface it so the person knows to sign in.
    identities = getattr(result.user, "identities", None)
    if identities is not None and len(identities) == 0:
        raise ValueError("An account with this email already exists. Please sign in instead.")

    # Keep the name typed on the sign-up form, even if Google/GitHub is used later.
    if full_name:
        _store_display_name(result.user.id, full_name, parts)

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
        result = _anon_client().auth.sign_in_with_password({
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


def find_user_by_email(email: str):
    """
    Looks an account up by email using the admin API. Returns the Supabase
    user, or None when no account has that email.
    """
    target = email.strip().lower()
    per_page = 200
    for page in range(1, 51):
        users = supabase_admin.auth.admin.list_users(page=page, per_page=per_page)
        if not users:
            break
        for user in users:
            if (getattr(user, "email", None) or "").lower() == target:
                return user
        if len(users) < per_page:
            break
    return None


def request_password_reset(email: str, redirect_to: str) -> None:
    """
    Sends the reset email (with the 6-digit code) ONLY to an existing account.

    Raises ValueError with a user-facing message when:
      - no account exists for the email,
      - the account has no password (signed up with Google/GitHub only),
      - Supabase could not send the email (e.g. rate limit, SMTP problem).
    """
    try:
        user = find_user_by_email(email)
    except Exception as exc:
        logger.warning("Account lookup failed for %s: %s", email, exc)
        raise ValueError("Could not process your request. Please try again.") from exc

    if user is None:
        raise ValueError("No account was found with that email address.")

    app_meta = getattr(user, "app_metadata", None) or {}
    providers = app_meta.get("providers") or [app_meta.get("provider")]
    if "email" not in providers and not app_meta.get("has_password"):
        raise ValueError(
            "This account signs in with Google or GitHub, so it has no password to reset."
        )

    try:
        _anon_client().auth.reset_password_email(email, {"redirect_to": redirect_to})
    except Exception as exc:
        logger.warning("Password reset email failed for %s: %s", email, exc)
        if "rate limit" in str(exc).lower() or "too many" in str(exc).lower():
            raise ValueError(
                "Too many reset emails were requested. Please wait a few minutes and try again."
            ) from exc
        raise ValueError("Could not send the reset code. Please try again later.") from exc


def reset_password(access_token: str, refresh_token: str, new_password: str) -> None:
    try:
        client = _user_client(access_token, refresh_token)
        client.auth.update_user({"password": new_password})
        return
    except Exception as exc:
        logger.warning("Password reset (update) failed: %s", exc)
        detail = f"{getattr(exc, 'code', '')} {exc}".lower()
        if "same_password" in detail or "different from the old password" in detail:
            raise ValueError(
                "Your new password must be different from your old password."
            ) from exc
        if "aal2" in detail:
            # The account has two-factor authentication on, and Supabase refuses
            # password changes from the email-code (aal1) session. Handled below.
            _reset_password_mfa_account(access_token, new_password)
            return
        raise ValueError(
            "This reset link is invalid or has expired. Please request a new one."
        ) from exc


def _reset_password_mfa_account(access_token: str, new_password: str) -> None:
    """
    Password reset for accounts with 2FA. The person already proved they own the
    email by entering the reset code. Changing the password does NOT log anyone
    in: signing in still requires the authenticator code (see /mfa-challenge).
    """
    try:
        user = supabase_admin.auth.get_user(access_token).user
    except Exception as exc:
        logger.warning("Reset token check failed: %s", exc)
        raise ValueError(
            "This reset link is invalid or has expired. Please request a new one."
        ) from exc
    if user is None or not user.email:
        raise ValueError("This reset link is invalid or has expired. Please request a new one.")

    # The admin API does not reject re-using the old password, so check it here:
    # if the new password already signs in, it is the same as the old one.
    same_as_old = False
    try:
        _anon_client().auth.sign_in_with_password({"email": user.email, "password": new_password})
        same_as_old = True
    except Exception:
        pass
    if same_as_old:
        raise ValueError("Your new password must be different from your old password.")

    try:
        supabase_admin.auth.admin.update_user_by_id(user.id, {"password": new_password})
    except Exception as exc:
        logger.warning("Admin password update failed for %s: %s", user.id, exc)
        raise ValueError("Could not update your password. Please try again.") from exc


_INVALID_CODE = "Invalid or expired code. Please try again."


def verify_signup_otp(email: str, token: str) -> AuthResponse:
    try:
        result = _anon_client().auth.verify_otp({"email": email, "token": token, "type": "signup"})
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
        _anon_client().auth.resend({"type": "signup", "email": email})
    except Exception as exc:
        logger.warning("Signup OTP resend failed for %s: %s", email, exc)
        raise ValueError("Could not resend the code. Please try again shortly.") from exc


def verify_reset_otp(email: str, token: str) -> tuple[str, str]:
    try:
        result = _anon_client().auth.verify_otp({"email": email, "token": token, "type": "recovery"})
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


def update_profile(
    user_id: str,
    full_name: Optional[str] = None,
    name_parts: Optional[dict] = None,
) -> AuthUser:
    parts = None
    if name_parts is not None:
        parts = _clean_name_parts(
            name_parts.get("first"), name_parts.get("middle"), name_parts.get("last")
        )
        name = _full_name_from_parts(parts)
    else:
        name = (full_name or "").strip()
    if not name:
        raise ValueError("Display name cannot be blank.")

    try:
        admin_user = supabase_admin.auth.admin.get_user_by_id(user_id).user
        app_metadata = dict(getattr(admin_user, "app_metadata", None) or {})
        app_metadata["display_name"] = name
        if parts is not None:
            app_metadata["name_parts"] = parts
        else:
            app_metadata.pop("name_parts", None)
        result = supabase_admin.auth.admin.update_user_by_id(
            user_id,
            {"user_metadata": {"full_name": name}, "app_metadata": app_metadata},
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


def _password_policy_error(password: str) -> str | None:
    if len(password) < 8:
        return "Password must be at least 8 characters."
    if not any(c.islower() for c in password):
        return "Password must include a lowercase letter."
    if not any(c.isupper() for c in password):
        return "Password must include an uppercase letter."
    if not any(c.isdigit() for c in password):
        return "Password must include a number."
    if all(c.isalnum() for c in password):
        return "Password must include a symbol."
    return None


def _set_first_password(user: AuthUser, new_password: str) -> dict:
    """
    For accounts created with Google/GitHub that have no password yet: sets one
    so the person can also sign in with their email + password. No current
    password is asked because there isn't one. The caller is already signed in
    (valid access token, and 2FA-verified when 2FA is on).
    """
    policy_error = _password_policy_error(new_password)
    if policy_error:
        raise ValueError(policy_error)
    try:
        admin_user = supabase_admin.auth.admin.get_user_by_id(user.id).user
        app_metadata = dict(getattr(admin_user, "app_metadata", None) or {})
        app_metadata["has_password"] = True
        supabase_admin.auth.admin.update_user_by_id(
            user.id,
            {"password": new_password, "app_metadata": app_metadata},
        )
    except Exception as exc:
        logger.warning("Setting first password failed for user %s: %s", user.id, exc)
        raise ValueError("Could not set your password. Please try again.") from exc
    return {
        "message": "Password set. You can now sign in with your email and password.",
        "password_changed_at": None,
        "password_available_at": None,
    }


def change_password(
    user: AuthUser,
    current_password: Optional[str],
    new_password: str,
) -> dict:
    # Google/GitHub account with no password yet: set one, no current password.
    if "email" not in user.providers:
        return _set_first_password(user, new_password)
    if not current_password:
        raise ValueError("Enter your current password.")

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


_INVALID_MFA_CODE = "That code is invalid or expired. Please try again."


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
        # list_factors().totp only contains VERIFIED factors, so abandoned
        # (unverified) setups never showed up there and kept blocking new
        # enrollments. `.all` includes every factor regardless of status.
        for factor in getattr(factors, "all", None) or []:
            if factor.factor_type == "totp" and factor.status != "verified":
                client.auth.mfa.unenroll({"factor_id": factor.id})
        # Unique name so a leftover factor can never collide with this one.
        stamp = datetime.now(timezone.utc).strftime("%Y%m%d%H%M%S")
        factor = client.auth.mfa.enroll(
            {"factor_type": "totp", "friendly_name": f"Aura authenticator {stamp}"}
        )
    except Exception as exc:
        logger.exception("Could not enroll MFA factor: %s", exc)
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

    # Step 1: check the code. Only this step may report "invalid code".
    try:
        result = client.auth.mfa.challenge_and_verify(
            {"factor_id": factor_id, "code": code}
        )
    except Exception as exc:
        logger.warning("MFA %s code check failed: %s", action, exc)
        raise ValueError(_INVALID_MFA_CODE) from exc

    if not result or not getattr(result, "access_token", None):
        raise ValueError(_INVALID_MFA_CODE)

    # Step 2: apply the change. Failures here are server problems, not bad
    # codes, so they get their own message and a full traceback in the log.
    if action == "disable":
        try:
            elevated_client = _user_client(result.access_token, result.refresh_token)
            elevated_client.auth.mfa.unenroll({"factor_id": factor_id})
        except Exception as exc:
            logger.exception("Could not remove MFA factor for user %s", user_id)
            raise ValueError(
                "Your code was correct, but two-factor authentication could not be "
                "disabled. Please try again."
            ) from exc
        try:
            _set_mfa_enabled(user_id, False)
        except Exception:
            # The factor is already gone, so 2FA is no longer enforced.
            logger.exception("Could not clear mfa_enabled flag for user %s", user_id)
    elif action == "enable":
        try:
            _set_mfa_enabled(user_id, True)
        except Exception:
            # Not fatal: enforcement also checks the verified factor itself.
            logger.exception("Could not set mfa_enabled flag for user %s", user_id)

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


def sign_out(access_token: str) -> None:
    """
    Revokes this device's Supabase session (scope "local" — other devices
    stay signed in). Never raises: logging out must always succeed from the
    user's point of view, even if the token already expired.
    """
    try:
        supabase_admin.auth.admin.sign_out(access_token, "local")
    except Exception as exc:
        logger.warning("Server-side sign out failed (token may be expired): %s", exc)