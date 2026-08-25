# ============================================================================
# FILE LOCATION : app/api/v1/endpoints/auth.py
# ============================================================================
# PURPOSE:
#   Defines all authentication-related HTTP endpoints for the API:
#   sign up, sign in, forgot password, reset password, and "get current
#   user". These endpoints are thin wrappers — they validate the incoming
#   request (via Pydantic schemas), delegate the real work to
#   `app.services.auth_service`, and translate any errors into proper
#   HTTP responses.
#
# HOW IT FITS INTO THE PROGRAM:
#   - This router is mounted under the `/auth` prefix (see `router = APIRouter(prefix="/auth", ...)`
#     below), so each route ends up as e.g. POST /auth/signup, POST /auth/signin, etc.
#   - It relies on Supabase (or a similar auth provider) under the hood,
#     accessed through `auth_service`. This file itself does not talk to
#     Supabase directly.
#   - Authentication state (who is logged in) is verified via the
#     `get_current_user` dependency, which decodes/validates the bearer
#     token sent by the frontend — the server never trusts a user ID that
#     the frontend claims to be its own.
# ============================================================================

import os

from fastapi import APIRouter, Depends, HTTPException

from app.models.auth_schemas import (
    SignUpRequest,
    SignInRequest,
    ForgotPasswordRequest,
    ResetPasswordRequest,
    AuthResponse,
    AuthUser,
    MessageResponse,
)
from app.services import auth_service
from app.dependencies.auth import get_current_user

# All routes in this file are grouped under prefix "/auth" and tagged
# "auth" so they appear together in the auto-generated OpenAPI/Swagger docs.
router = APIRouter(prefix="/auth", tags=["auth"])

# Where Supabase redirects the user after they click the link in the
# reset-password email. This exact URL must also be added to
# Authentication > URL Configuration > Redirect URLs in your Supabase
# project settings, or Supabase will reject the redirect.
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:3000")


# ----------------------------------------------------------------------------
# POST /auth/signup
# Creates a new user account.
# Body: SignUpRequest (email, password, full_name)
# Returns: AuthResponse (e.g. session/user info on success)
# Errors: 400 if auth_service raises ValueError (e.g. email already taken,
#         weak password, etc.)
# ----------------------------------------------------------------------------
@router.post("/signup", response_model=AuthResponse)
def signup(payload: SignUpRequest):
    try:
        return auth_service.sign_up(
            email=payload.email,
            password=payload.password,
            full_name=payload.full_name,
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


# ----------------------------------------------------------------------------
# POST /auth/signin
# Logs an existing user in.
# Body: SignInRequest (email, password)
# Returns: AuthResponse (session/token info)
# Errors: 401 if credentials are invalid (auth_service raises ValueError)
# ----------------------------------------------------------------------------
@router.post("/signin", response_model=AuthResponse)
def signin(payload: SignInRequest):
    try:
        return auth_service.sign_in(email=payload.email, password=payload.password)
    except ValueError as e:
        raise HTTPException(status_code=401, detail=str(e))


# ----------------------------------------------------------------------------
# POST /auth/forgot-password
# Kicks off the "forgot password" flow by asking auth_service to send a
# reset email containing a link back to FRONTEND_URL/reset-password.
#
# Security note: the response message is IDENTICAL whether or not the
# email actually belongs to a registered account. This prevents an
# attacker from using this endpoint to discover which emails are
# registered in the system (user enumeration).
# ----------------------------------------------------------------------------
@router.post("/forgot-password", response_model=MessageResponse)
def forgot_password(payload: ForgotPasswordRequest):
    redirect_to = f"{FRONTEND_URL}/reset-password"
    auth_service.request_password_reset(payload.email, redirect_to)
    # Same message regardless of whether the email has an account —
    # avoids leaking which addresses are registered.
    return MessageResponse(
        message="If an account exists for that email, a password reset link has been sent."
    )


# ----------------------------------------------------------------------------
# POST /auth/reset-password
# Completes the "forgot password" flow. The frontend calls this after the
# user follows the emailed reset link and picks a new password; it passes
# back the access_token/refresh_token Supabase embedded in that link.
# Body: ResetPasswordRequest (access_token, refresh_token, new_password)
# Errors: 400 if the tokens are invalid/expired (ValueError from service)
# ----------------------------------------------------------------------------
@router.post("/reset-password", response_model=MessageResponse)
def reset_password(payload: ResetPasswordRequest):
    try:
        auth_service.reset_password(
            access_token=payload.access_token,
            refresh_token=payload.refresh_token,
            new_password=payload.new_password,
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    return MessageResponse(message="Your password has been updated. You can now sign in.")


# ----------------------------------------------------------------------------
# GET /auth/me
# "Who am I?" endpoint. Requires a valid bearer token (enforced by the
# get_current_user dependency, which decodes and verifies the token rather
# than trusting anything the client claims about its own identity).
# ----------------------------------------------------------------------------
@router.get("/me", response_model=AuthUser)
def get_me(user: AuthUser = Depends(get_current_user)):
    """
    Returns the currently authenticated user, verified from the bearer
    token — never trust a user ID the frontend sends you directly.
    The frontend calls this on load to check "is this session still valid"
    without re-prompting for a password.
    """
    return user