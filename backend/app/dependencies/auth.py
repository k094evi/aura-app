# ==============================================================================
# FILE: app/dependencies/auth.py
# ==============================================================================
# PURPOSE:
#   Reusable FastAPI dependencies that authenticate a request using the
#   Supabase access token in "Authorization: Bearer <token>".
#
#   - get_authenticated_user: token is valid (used by /auth/me and the MFA
#     challenge, which must work BEFORE 2FA is completed).
#   - get_current_user: token is valid AND, if the account has 2FA enabled,
#     the token is aal2. Use this on every protected route.
#
# USAGE:
#     @router.get("/resumes")
#     def list_resumes(user: AuthUser = Depends(get_current_user)):
#         ...  # user.id comes from a verified token, never from the client.
#
# 2FA ENFORCEMENT:
#   "2FA is on" means Supabase reports at least one VERIFIED MFA factor on the
#   user, OR the app_metadata["mfa_enabled"] flag is set. The factor check is
#   the source of truth; the flag is only a cache. This way a failed flag write
#   during setup can never leave an account with an authenticator but no
#   enforcement at sign-in.
#
# WHY WE CALL SUPABASE INSTEAD OF VERIFYING THE JWT LOCALLY:
#   Simple and correct at AURA's current traffic. If speed matters later, swap
#   the inside of _load_authenticated_user for local JWKS verification; routes
#   only depend on the functions, so no route code has to change.
# ==============================================================================

import base64
import json
import logging

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from app.extensions.supabase_client import supabase
from app.models.auth_schemas import AuthUser

logger = logging.getLogger(__name__)

# Missing/malformed Authorization header -> FastAPI returns 403 by itself.
bearer_scheme = HTTPBearer()


def _unauthorized() -> HTTPException:
    return HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Your session has expired. Please sign in again.",
        headers={"WWW-Authenticate": "Bearer"},
    )


def _has_verified_factor(user_obj) -> bool:
    """True if Supabase reports at least one verified MFA factor on the user."""
    for factor in getattr(user_obj, "factors", None) or []:
        if getattr(factor, "status", None) == "verified":
            return True
    return False


def _load_authenticated_user(token: str) -> AuthUser:
    """
    Verifies the token with Supabase (signature, expiry, and that the session
    has not been revoked by a logout) and builds an AuthUser from the result.

    Raises HTTPException(401) for any invalid/expired/revoked token.
    """
    try:
        result = supabase.auth.get_user(token)
    except Exception as exc:
        logger.warning("Token verification failed: %s", exc)
        raise _unauthorized() from exc

    if not result or not result.user:
        raise _unauthorized()

    user_obj = result.user
    metadata = getattr(user_obj, "user_metadata", None) or {}
    app_metadata = getattr(user_obj, "app_metadata", None) or {}
    providers = app_metadata.get("providers") or [app_metadata.get("provider")]

    # Google sends "full_name"/"name"; GitHub sends "name"/"user_name".
    full_name = (
        metadata.get("full_name")
        or metadata.get("name")
        or metadata.get("user_name")
    )

    return AuthUser(
        id=user_obj.id,
        email=user_obj.email,
        full_name=full_name,
        providers=sorted({provider for provider in providers if provider}),
        password_changed_at=app_metadata.get("password_changed_at"),
        mfa_enabled=bool(app_metadata.get("mfa_enabled", False))
        or _has_verified_factor(user_obj),
    )


def _token_assurance_level(token: str) -> str | None:
    try:
        encoded_claims = token.split(".")[1]
        encoded_claims += "=" * (-len(encoded_claims) % 4)
        claims = json.loads(base64.urlsafe_b64decode(encoded_claims))
        return claims.get("aal")
    except (IndexError, ValueError, json.JSONDecodeError):
        return None


def get_authenticated_user(
    credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme),
) -> AuthUser:
    return _load_authenticated_user(credentials.credentials)


def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme),
) -> AuthUser:
    user = _load_authenticated_user(credentials.credentials)
    if user.mfa_enabled and _token_assurance_level(credentials.credentials) != "aal2":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Two-factor verification is required. Open /mfa-challenge to continue.",
        )
    return user