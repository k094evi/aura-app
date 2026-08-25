# ==============================================================================
# FILE: app/dependencies/auth.py
# ==============================================================================
# PURPOSE OF THIS FILE:
#   This file defines a reusable FastAPI "dependency" — a function that FastAPI
#   runs automatically before your route's own code executes, whenever that
#   route lists it as a parameter (via `Depends(...)`). This particular
#   dependency, `get_current_user`, is responsible for authentication: it
#   checks that an incoming request carries a valid Supabase login token, and
#   if so, hands the route a trustworthy `AuthUser` object to work with.
#
# HOW TO USE IT IN A ROUTE (guide for future you / teammates):
#
#     from app.dependencies.auth import get_current_user
#     from app.models.auth_schemas import AuthUser
#
#     @router.get("/resumes")
#     def list_resumes(user: AuthUser = Depends(get_current_user)):
#         # user.id is now trustworthy — it came from a verified Supabase
#         # token, not from anything the client sent in the request body.
#         ...
#
# STEP-BY-STEP: WHAT HAPPENS WHEN A REQUEST COMES IN
#   1. FastAPI's `HTTPBearer` security scheme pulls the token out of the
#      "Authorization: Bearer <token>" request header. If that header is
#      missing or malformed, HTTPBearer raises HTTP 403 automatically —
#      before any code in this file even runs.
#   2. `get_current_user` takes that token and asks Supabase to verify it
#      by calling `supabase.auth.get_user(token)`. Supabase checks the JWT's
#      signature and expiry on its own servers and reports back who (if
#      anyone) the token belongs to.
#   3. If Supabase says the token is invalid, expired, or the call fails for
#      any reason (network error, malformed token, etc.), we raise HTTP 401
#      so the client knows to send the user back to login.
#   4. If the token checks out, we build an `AuthUser` from Supabase's
#      response and return it. That's the object your route receives.
#
# WHY WE CALL SUPABASE INSTEAD OF VERIFYING THE JWT LOCALLY:
#   Verifying locally (using PyJWT + Supabase's cached public keys, aka
#   JWKS) skips a network round trip and is faster at scale. At AURA's
#   current traffic level, the extra ~100ms per request from calling
#   Supabase directly isn't worth the added complexity yet — this is the
#   standard "start simple, optimize later" tradeoff. If/when the speed
#   matters, swap the *inside* of this function for local JWKS
#   verification; because routes only ever depend on the function itself
#   (`Depends(get_current_user)`), no route code has to change.
# ==============================================================================

import logging

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from app.extensions.supabase_client import supabase
from app.models.auth_schemas import AuthUser

logger = logging.getLogger(__name__)

# `bearer_scheme` is FastAPI's built-in "read the Authorization header"
# helper. `auto_error=True` is the default, meaning: if there's no
# Authorization header at all, FastAPI itself returns HTTP 403 before
# get_current_user() below ever gets a chance to run.
bearer_scheme = HTTPBearer()


def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme),
) -> AuthUser:
    """
    FastAPI dependency that authenticates the current request.

    Add `user: AuthUser = Depends(get_current_user)` to any route's
    signature to require a valid login and get back a verified user object.

    Raises:
        HTTPException(401): if the token is missing, invalid, expired, or
                             Supabase couldn't verify it for any reason.
    Returns:
        AuthUser: a trustworthy user object (id, email, full_name) built
                  from Supabase's verified response.
    """
    # Grab just the raw token string out of the "Bearer <token>" header.
    token = credentials.credentials

    try:
        # Ask Supabase to verify this token server-side (checks signature +
        # expiry) and tell us which user it belongs to.
        result = supabase.auth.get_user(token)
    except Exception as exc:
        # Anything that goes wrong while talking to Supabase — network
        # errors, a malformed/garbage token, Supabase downtime, etc. — all
        # land here. We don't leak the internal error to the client; we
        # just tell them to log in again.
        logger.warning("Token verification failed: %s", exc)
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Your session has expired. Please sign in again.",
            headers={"WWW-Authenticate": "Bearer"},
        ) from exc

    # Supabase call succeeded but came back empty — treat this the same as
    # an invalid/expired token.
    if not result or not result.user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Your session has expired. Please sign in again.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # At this point Supabase has confirmed the token is valid and told us
    # who it belongs to. Pull out the extra profile fields (if any) that
    # were stored on the Supabase user record (e.g. full_name).
    user_obj = result.user
    metadata = getattr(user_obj, "user_metadata", None) or {}

    # Build and return the app's own AuthUser model. Routes that depend on
    # get_current_user receive this object, not Supabase's raw response —
    # this keeps the rest of the app decoupled from Supabase's SDK shape.
    return AuthUser(
        id=user_obj.id,
        email=user_obj.email,
        full_name=metadata.get("full_name"),
    )