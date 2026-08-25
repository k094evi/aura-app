# ============================================================================
# FILE LOCATION : app/models/auth_schemas.py
# ============================================================================
# PURPOSE:
#   Defines all Pydantic models used for authentication — both the
#   request bodies the API accepts and the response bodies it returns.
#   Pydantic models give FastAPI automatic request validation (e.g.
#   rejecting a signup with a password under 8 characters before your
#   code even runs) and automatic response serialization + OpenAPI/Swagger
#   docs generation.
#
# HOW IT FITS INTO THE PROGRAM:
#   - Consumed by app/api/v1/endpoints/auth.py, where each route's
#     `payload` parameter and `response_model=` are typed using the
#     classes defined here.
#   - Mirrors the fields actually used/returned by
#     app/services/auth_service.py (which does the real work of talking
#     to Supabase) — if you add/rename a field on either side, keep the
#     other in sync.
#   - Split into two logical groups:
#       1. Request bodies  — what the client sends in.
#       2. Response models — what the API sends back out.
# ============================================================================

"""
Pydantic schemas for auth requests/responses.
Matches the fields used in app/services/auth_service.py.
"""

from typing import Optional
from pydantic import BaseModel, EmailStr, Field


# ============================================================================
# ── Request bodies (used by app/api/v1/endpoints/auth.py) ──────────────
# ============================================================================

# POST /auth/signup body.
# EmailStr automatically validates that `email` looks like a real email
# address. Field(min_length=8) rejects short passwords with a 422 before
# the route function even runs.
class SignUpRequest(BaseModel):
    email: EmailStr
    password: str = Field(min_length=8, description="Minimum 8 characters")
    full_name: Optional[str] = None


# POST /auth/signin body. No min_length check here — we don't want to
# leak password policy details to someone just trying to log in with an
# existing (already-validated-at-signup) password.
class SignInRequest(BaseModel):
    email: EmailStr
    password: str


# POST /auth/forgot-password body — just the email to send the reset
# link to.
class ForgotPasswordRequest(BaseModel):
    email: EmailStr


# POST /auth/reset-password body. access_token/refresh_token come from
# the Supabase reset-password email link (the frontend extracts them
# from the URL and forwards them here). new_password is held to the
# same 8-character minimum as signup.
class ResetPasswordRequest(BaseModel):
    access_token: str
    refresh_token: str
    new_password: str = Field(min_length=8)


# ============================================================================
# ── Response models (used by auth_service.py) ───────────────────────────
# ============================================================================

# Represents the authenticated user as returned to the client. Kept
# deliberately minimal — id + email + full_name — rather than exposing
# the full Supabase user object.
class AuthUser(BaseModel):
    id: str
    email: Optional[str] = None
    full_name: Optional[str] = None


# Returned by /auth/signup and /auth/signin on success. Includes the
# session tokens the frontend needs to store, plus a flag telling the
# frontend whether the user still needs to confirm their email before
# they can fully use the account.
class AuthResponse(BaseModel):
    user: AuthUser
    access_token: str
    refresh_token: Optional[str] = None
    email_confirmation_required: bool = False


# Generic "just tell me what happened" response, used for endpoints that
# don't need to return structured data (forgot-password, reset-password).
class MessageResponse(BaseModel):
    message: str